# OAuth Seguro - Strava Stellar Rewards

## 🔒 Arquitectura de Seguridad

Este proyecto implementa OAuth 2.0 **seguro**, con autenticación manejada SOLO en el backend (Vercel serverless functions).

### ❌ ¿Por qué NO poner OAuth en el frontend?

```javascript
// ❌ INSEGURO - Nunca hagas esto
const STRAVA_CLIENT_SECRET = "abc123"; // EXPUESTO en el navegador
fetch('https://www.strava.com/oauth/token', {
  body: JSON.stringify({
    client_secret: STRAVA_CLIENT_SECRET // VULNERABLE
  })
});
```

**Problemas:**
- El `CLIENT_SECRET` se ve en el código fuente
- DevTools (F12) lo muestra en red requests
- Puede ser robado y usado maliciosamente
- Viola los estándares de OAuth 2.0

### ✅ Arquitectura Segura (Este Proyecto)

```
Frontend (navegador)          Backend (servidor)
    ↓                              ↑
    └─ Click "Connect Strava" ───→ /api/strava-auth
       (inicio OAuth)
    ←─ Redirige a Strava auth ───┘
    ↓
 Usuario autoriza en strava.com
    ↓
 Strava redirige → /api/strava-auth?code=xxx
    ↑                              ↓
    └─ Cookie segura (HttpOnly)← /api/strava-auth
       intercambia código por token
       (CLIENT_SECRET está seguro aquí)
    ↓
 Fetch /api/strava-activities
    ↑                              ↓
    └──────────────────────────→ /api/strava-activities
                                 (usa token de cookie)
                                 ↓
                            Llama Strava API
                                 ↓
                          Retorna datos limpios
```

## 🚀 Setup

### 1. Crear Strava App

1. Ve a https://www.strava.com/settings/apps
2. Crea una nueva app con nombre "Strava Stellar Rewards"
3. Copiar:
   - **Client ID**
   - **Client Secret**
4. En Authorization Callback Domain: `tu-dominio.vercel.app`

### 2. Configurar Variables de Entorno en Vercel

```bash
# Vercel Dashboard → Settings → Environment Variables
STRAVA_CLIENT_ID=123456
STRAVA_CLIENT_SECRET=abcdef123456abcdef...
```

**IMPORTANTE:**
- `STRAVA_CLIENT_SECRET` es privada - solo accessible en serverless functions
- Nunca la commits en Git (está en `.gitignore`)
- Nunca la expongas en el frontend

### 3. Development Local

```bash
# 1. Copia .env.example a .env.local
cp .env.example .env.local

# 2. Agrega tus credenciales
STRAVA_CLIENT_ID=your_id
STRAVA_CLIENT_SECRET=your_secret

# 3. Usa Vercel CLI
npm install -g vercel
vercel dev

# Ahora http://localhost:3000 tiene acceso a las env vars
```

## 📁 Estructura de Archivos

```
/api/
  ├── strava-auth.js         ← Maneja OAuth flow (SEGURO)
  ├── strava-activities.js    ← Obtiene actividades (SEGURO)
  └── strava-disconnect.js    ← Limpia sesión (SEGURO)

/
  ├── strava-stellar-rewards.html  ← UI (PÚBLICO)
  ├── .env.example                 ← Template vars
  └── .gitignore                   ← Excluye .env.local
```

## 🔐 Cómo Funciona

### OAuth Flow Completo

1. **Usuario hace clic en "Conectar Strava"**
   ```javascript
   window.location.href = '/api/strava-auth';
   ```

2. **Backend genera authorization URL**
   ```javascript
   // /api/strava-auth.js
   const stravaAuthUrl = `https://www.strava.com/oauth/authorize?
     client_id=${STRAVA_CLIENT_ID}&
     response_type=code&
     redirect_uri=/api/strava-auth&
     scope=read,activity:read_all`;
   res.redirect(stravaAuthUrl);
   ```

3. **Usuario autoriza en Strava.com**
   - Strava lo redirige a: `/api/strava-auth?code=abc123`

4. **Backend intercambia código por token (SEGURO)**
   ```javascript
   // Este código NUNCA se ve en el navegador
   const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
     body: JSON.stringify({
       client_id: process.env.STRAVA_CLIENT_ID,
       client_secret: process.env.STRAVA_CLIENT_SECRET, // ← SEGURO en servidor
       code: code,
       grant_type: 'authorization_code'
     })
   });
   ```

5. **Backend guarda token en cookie HttpOnly**
   ```javascript
   res.setHeader('Set-Cookie', 
     `strava_token=${token}; HttpOnly; Secure; SameSite=Strict`
   );
   ```

6. **Frontend obtiene datos vía backend**
   ```javascript
   // El token viene automático en la cookie
   fetch('/api/strava-activities')
   // Backend lo usa de forma segura
   ```

## 🛡️ Medidas de Seguridad

| Aspecto | Medida |
|--------|--------|
| **Client Secret** | Solo en `process.env` del servidor |
| **Token Storage** | Cookie HttpOnly (JS no puede acceder) |
| **HTTPS** | Required (`Secure` flag) |
| **CSRF** | SameSite=Strict |
| **Domain** | Solo mismo origen |

## ⚠️ Limitaciones Actuales

- Tokens se guardan en memoria del serverless function
- En Vercel, cada request es un proceso nuevo
- Para producción, usar una DB (MongoDB, PostgreSQL, etc.)

### TODO para Producción

```javascript
// Hoy: Token en memoria (se pierde al reiniciar)
let userTokens = {}; // ❌ NO PERSISTE

// Producción: Guardar en DB
async function saveToken(userId, token) {
  await db.collection('tokens').updateOne(
    { userId },
    { $set: { accessToken: token } }
  );
}
```

## 🧪 Testing

### Flujo Completo

1. Abre http://localhost:3000/strava-stellar-rewards.html
2. Haz clic en "Conectar Strava"
3. Autoriza en Strava.com
4. Se redirige de vuelta con data de actividades
5. Verifica en DevTools:
   - Request al `/api/strava-auth` - sin credenciales visibles
   - Cookie `strava_token` - HttpOnly (no accesible desde JS)
   - `/api/strava-activities` retorna actividades reales

### Ver Requests Seguras

```bash
# En DevTools → Network tab
GET /api/strava-auth
├─ Headers: Authorization a Strava (en backend, no visible aquí)
└─ Cookie: strava_token=... (HttpOnly, enviado automático)

GET /api/strava-activities
├─ Cookie: strava_token=... (enviado automático)
└─ Response: Actividades reales
```

## 🚨 Errores Comunes

### Error: "Not authenticated"
```javascript
// ❌ Significa que no hay cookie o expiró
// ✅ Hacer clic en "Conectar Strava" de nuevo
```

### Error: "Invalid client_id"
```javascript
// ❌ STRAVA_CLIENT_ID no está en env vars
// ✅ Verificar en Vercel Dashboard → Settings → Env Vars
```

### Error: "Invalid client_secret"
```javascript
// ❌ STRAVA_CLIENT_SECRET es incorrecto o no existe
// ✅ Copiar exactamente de https://www.strava.com/settings/apps
```

## 📚 Referencias

- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [Strava API Authentication](https://developers.strava.com/docs/authentication/)
- [OWASP: Sensitive Data Exposure](https://owasp.org/www-project-top-ten/2021/)

---

**Resumen:** El secreto de OAuth NUNCA va en el frontend. Siempre en el servidor.
