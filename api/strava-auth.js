export default async function handler(req, res) {
  // PASO 1: Redirigir al usuario a Strava para autorización
  if (req.method === 'GET') {
    const { code, error } = req.query;

    // Si Strava retorna con código de autorización
    if (code) {
      try {
        // PASO 2: Intercambiar código por access token (SEGURO - en el backend)
        const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET, // SEGURO aquí
            code: code,
            grant_type: 'authorization_code',
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
          // PASO 3: Guardar el token (en producción, usar una DB)
          // Para desarrollo, retornamos el token al frontend de forma segura
          res.setHeader('Set-Cookie', `strava_token=${tokenData.access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`);

          // Redirigir de vuelta a la app con éxito
          res.redirect('/strava-stellar-rewards.html?auth=success');
        } else {
          res.status(400).json({ error: 'No access token received' });
        }
      } catch (err) {
        console.error('OAuth token exchange error:', err);
        res.status(500).json({ error: 'Token exchange failed' });
      }
    } else if (error) {
      res.redirect(`/strava-stellar-rewards.html?auth=error&error=${error}`);
    } else {
      // PASO 0: Iniciar flujo OAuth - redirigir a Strava
      const clientId = process.env.STRAVA_CLIENT_ID;
      const redirectUri = `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/strava-auth`;
      const scopes = 'read,activity:read_all';

      const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}`;

      res.redirect(stravaAuthUrl);
    }
  }
}
