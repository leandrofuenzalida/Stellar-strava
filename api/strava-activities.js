export default async function handler(req, res) {
  // Verificar que la solicitud viene del usuario autenticado
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // El token viene de la cookie (HttpOnly, seguro)
  const token = req.headers.cookie
    ?.split('; ')
    .find(row => row.startsWith('strava_token='))
    ?.split('=')[1];

  if (!token) {
    res.status(401).json({ error: 'Not authenticated. Please connect to Strava first.' });
    return;
  }

  try {
    // BACKEND llama a Strava API con el token
    const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=30', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.status}`);
    }

    const activities = await response.json();

    // Procesar actividades y calcular CO2
    const processedActivities = activities
      .filter(a => a.type === 'Ride') // Solo ciclismo
      .map(a => ({
        id: a.id,
        name: a.name,
        distance: a.distance / 1000, // km
        date: a.start_date,
        co2Saved: (a.distance / 1000) * 0.21, // kg CO2 por km
      }));

    res.status(200).json({
      activities: processedActivities,
      totalDistance: processedActivities.reduce((sum, a) => sum + a.distance, 0),
      totalCO2: processedActivities.reduce((sum, a) => sum + a.co2Saved, 0),
    });
  } catch (err) {
    console.error('Error fetching Strava activities:', err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
}
