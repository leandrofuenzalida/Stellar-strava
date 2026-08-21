# 🚴 Strava → Stellar Rewards

Convierte tus kilómetros en bicicleta en tokens blockchain reales en Stellar.

## ✨ Características

- **Strava Integration**: Conecta tu cuenta de Strava (OAuth seguro)
- **CO2 Calculation**: Calcula automáticamente el CO2 que evitas al pedalear
- **Stellar Tokens**: Recibe tokens BIKE reales en Stellar Testnet
- **Blockchain Rewards**: Canjea o transfiere tus tokens a otros
- **Impact Tracking**: Visualiza tu impacto ambiental

## 🏗️ Tecnología

- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Blockchain**: Stellar Testnet + BIKE Token
- **Auth**: OAuth 2.0 (seguro, lado servidor)
- **Hosting**: Vercel

## 🚀 Quick Start

### 1. Requirements
- Node.js 18+
- Vercel CLI: `npm install -g vercel`
- Strava App (crear en https://www.strava.com/settings/apps)

### 2. Local Development

```bash
# Clone y setup
git clone https://github.com/leandrofuenzalida/leandrofuenzalida.github.io.git
cd leandrofuenzalida.github.io

# Environment variables
cp .env.example .env.local
# Edita .env.local con tus Strava credentials

# Desarrollar localmente
vercel dev
# Abre http://localhost:3000/strava-stellar-rewards.html
```

### 3. Deploy a Vercel

```bash
# Conectar con Vercel
vercel

# Agregar variables de entorno
vercel env add STRAVA_CLIENT_ID
vercel env add STRAVA_CLIENT_SECRET

# Redeploy
vercel --prod
```

## 📚 Documentación

- **[OAuth Setup Guide](./OAUTH_SETUP.md)** - Cómo configurar OAuth de forma segura
- **[Stellar Token Details](./strava-stellar-integration.html)** - Información del token BIKE

## 🔒 Seguridad

Este proyecto implementa OAuth 2.0 de forma SEGURA:

✅ **CLIENT_SECRET solo en servidor** (process.env)  
✅ **Tokens en cookies HttpOnly** (no accesible desde JS)  
✅ **HTTPS required** (Secure flag)  
✅ **SameSite=Strict CSRF protection**  

❌ No exponemos credenciales en el frontend  
❌ No guardamos tokens en localStorage  
❌ No hacemos llamadas directas a Strava API desde el navegador  

[Ver arquitectura completa →](./OAUTH_SETUP.md)

## 📊 BIKE Token

```
Nombre:        BIKE
Emisor:        GBNM3UZPOXQZOBGDQPQSO7ACUQTBA57DUCL7M5CMFHVSJYCZVCWMMZTR
Distribuidor:  GBM77XIRHUWHUAUSFUSDGJBMEOJSXZPXIBSOYDO4YCZA77SHQ7TEAYHY
Red:           Stellar Testnet
Supply:        1,000,000 BIKE
Ratio:         1 kg CO2 = 1 BIKE
```

Ver en Stellar Expert:
https://stellar.expert/explorer/testnet/asset/BIKE-GBNM3UZPOXQZOBGDQPQSO7ACUQTBA57DUCL7M5CMFHVSJYCZVCWMMZTR

## 📁 Estructura del Proyecto

```
.
├── strava-stellar-rewards.html      ← Aplicación principal
├── strava-stellar.html              ← Landing page
├── strava-stellar-integration.html   ← Documentación técnica
├── api/
│   ├── strava-auth.js              ← OAuth flow (SEGURO)
│   ├── strava-activities.js         ← Obtiene actividades
│   └── strava-disconnect.js         ← Limpia sesión
├── package.json                     ← Node.js config
├── vercel.json                      ← Vercel config
├── .env.example                     ← Template variables
├── .gitignore                       ← Git ignore rules
├── OAUTH_SETUP.md                   ← OAuth documentation
└── README.md                        ← Este archivo
```

## 🔄 Flujo de la Aplicación

```
1. Usuario abre strava-stellar-rewards.html
   ↓
2. Hace clic en "Conectar Strava"
   ↓
3. Redirige a /api/strava-auth (backend)
   ↓
4. Backend redirige a strava.com (usuario autoriza)
   ↓
5. Strava redirige de vuelta a /api/strava-auth?code=xxx
   ↓
6. Backend intercambia código por access_token (SEGURO)
   ↓
7. Backend guarda token en cookie HttpOnly
   ↓
8. Frontend obtiene actividades de /api/strava-activities
   ↓
9. Backend obtiene datos de Strava API
   ↓
10. Frontend calcula CO2 y tokens
    ↓
11. Muestra wallet Stellar con balance
```

## 🧪 Testing

### Local
```bash
# Terminal 1: Vercel dev server
vercel dev

# Terminal 2: Abre en navegador
open http://localhost:3000/strava-stellar-rewards.html

# Test:
1. Click "Conectar Strava"
2. Autoriza en Strava.com
3. Verifica que muestre tus actividades reales
4. DevTools → Application → Cookies → strava_token debe existir
```

### En Vercel Production
```bash
# Después de deploy
open https://your-vercel-url.vercel.app/strava-stellar-rewards.html

# Los mismos pasos que local
```

## 🐛 Troubleshooting

### "Not authenticated" error
```
Causa: Cookie expiró o no existe
Fix:   Click "Conectar Strava" de nuevo
```

### OAuth callback no funciona
```
Causa: Vercel URL no configurada en Strava app
Fix:   https://www.strava.com/settings/apps
      → Authorization Callback Domain
      → Debe ser tu-dominio.vercel.app (sin http://)
```

### API responds "Invalid client_id"
```
Causa: STRAVA_CLIENT_ID no está en env vars de Vercel
Fix:   Vercel Dashboard → Settings → Environment Variables
      → Agregar STRAVA_CLIENT_ID
      → Redeploy
```

## 📈 Roadmap

- [ ] Guardar tokens en base de datos (en lugar de memoria)
- [ ] Soporte para múltiples redes blockchain
- [ ] Dashboard de usuario con historial
- [ ] Integración con parqueaderos y cafés
- [ ] Mobile app
- [ ] Leaderboards comunitarios

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repo
2. Crea una branch (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la branch (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles

## 📧 Contacto

- Email: leandro.fuenzalida@gmail.com
- GitHub: [@leandrofuenzalida](https://github.com/leandrofuenzalida)

## 🙏 Agradecimientos

- [Strava API](https://developers.strava.com/)
- [Stellar Foundation](https://stellar.org/)
- [Vercel](https://vercel.com/)

---

**⚠️ NOTA IMPORTANTE**: Este proyecto usa Stellar **Testnet** (no real money).
Los tokens BIKE no tienen valor monetario real.
