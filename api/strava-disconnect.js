export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Limpiar la cookie del token
  res.setHeader('Set-Cookie', 'strava_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');

  res.status(200).json({ message: 'Disconnected from Strava' });
}
