# Setup Completo: Strava → Stellar Rewards

Guía paso a paso para configurar y ejecutar la aplicación completa.

## 🎯 Resumen del Flujo

```
1. Local: Crear token BIKE en Stellar Testnet
   ↓
2. Local: Guardar credenciales en .env.local
   ↓
3. Vercel: Configurar variables de entorno
   ↓
4. Vercel: App usa credenciales para mostrar datos
   ↓
5. GitHub: Conectar Strava OAuth
```

## 📋 Paso 1: Crear Token BIKE Localmente

### Requisitos
- Node.js 24.x
- npm o yarn

### Instrucciones

```bash
# 1. Clonar el repo
git clone https://github.com/leandrofuenzalida/Stellar-strava.git
cd Stellar-strava

# 2. Instalar dependencias
npm install stellar-sdk

# 3. Crear el token BIKE
node create-token.js
```

### Salida esperada

```
✨ TOKEN BIKE CREADO EN STELLAR TESTNET

📊 CONFIGURACIÓN DEL TOKEN:
   Nombre:       BIKE
   Emisor:       GBNM3UZPOXQZOBGDQPQSO7ACUQTBA57DUCL7M5CMFHVSJYCZVCWMMZTR
   Distribuidor: GBM77XIRHUWHUAUSFUSDGJBMEOJSXZPXIBSOYDO4YCZA77SHQ7TEAYHY
   Supply:       1,000,000 BIKE
   Red:          Stellar Testnet

🔗 LINKS DE STELLAR EXPERT:
   Emisor:       https://stellar.expert/explorer/testnet/account/GBNM3UZPOXQZOBGDQPQSO7ACUQTBA57DUCL7M5CMFHVSJYCZVCWMMZTR
   Distribuidor: https://stellar.expert/explorer/testnet/account/GBM77XIRHUWHUAUSFUSDGJBMEOJSXZPXIBSOYDO4YCZA77SHQ7TEAYHY
   Token:        https://stellar.expert/explorer/testnet/asset/BIKE-GBNM3UZPOXQZOBGDQPQSO7ACUQTBA57DUCL7M5CMFHVSJYCZVCWMMZTR
```

El script crea automáticamente `.env.local` con las credenciales.

## 🔐 Paso 2: Configurar Strava OAuth

### En Strava.com

1. Ve a https://www.strava.com/settings/apps
2. Crea una nueva app:
   - **Application name**: Strava Stellar Rewards
   - **Category**: Pick one
   - Acepta términos
3. Copia:
   - **Client ID**
   - **Client Secret**
4. En **Authorization Callback Domain**, agrega:
   ```
   stellar-strava.vercel.app
   ```
5. Guarda

### En `.env.local` (local)

```bash
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
```

El archivo `.env.local` se crea automáticamente con el script `create-token.js`.

## 🚀 Paso 3: Deploy a Vercel

### Configurar variables de entorno

En **Vercel Dashboard → Settings → Environment Variables**, agrega:

```
STRAVA_CLIENT_ID          = [tu Client ID]
STRAVA_CLIENT_SECRET      = [tu Client Secret]
```

**IMPORTANTE:** Marca AMBAS opciones:
- ✅ Production
- ✅ Preview

Sin estas, las variables no estarán disponibles en runtime.

### Deploy

```bash
# Instalar Vercel CLI
npm install -g vercel

# Conectar con tu proyecto
vercel

# Deploy a producción
vercel --prod
```

O simplemente haz un push a GitHub y Vercel redeploy automáticamente.

## ✅ Paso 4: Verificar que Funciona

### Local

```bash
# Desarrollar localmente
vercel dev

# Abre http://localhost:3000/strava-stellar-rewards.html
# Haz clic en "Conectar Strava"
# Deberías ver un pop-up de autorización de Strava
```

### Production

1. Ve a https://stellar-strava.vercel.app/strava-stellar-rewards.html
2. Haz clic en **"Conectar Strava"**
3. Autoriza en Strava.com
4. Deberías ver tus actividades reales cargadas
5. Los km y CO2 deberían calcularse automáticamente
6. Los tokens BIKE deberían mostrarse

## 🐛 Troubleshooting

### "No access token received" en Strava OAuth

**Causa:** `STRAVA_CLIENT_SECRET` es incorrecto

**Fix:** 
1. Ve a https://www.strava.com/settings/apps
2. Copia el Client Secret exactamente (sin espacios)
3. Actualiza en Vercel Environment Variables
4. Redeploy

### "Not authenticated" al conectar

**Causa:** Las cookies de Strava expiraron

**Fix:** Haz clic en "Conectar Strava" de nuevo

### Token BIKE no aparece en Stellar Expert

**Causa:** Delay de indexación o problema temporal

**Fix:** 
1. Espera unos minutos
2. Recarga la página
3. O verifica la cuenta directamente en Stellar Expert

## 📚 Documentación Adicional

- **[OAuth Security](./OAUTH_SETUP.md)** - Cómo funciona OAuth de forma segura
- **[Architecture](./strava-stellar-integration.html)** - Arquitectura técnica completa

## 🎯 Resumen de Credenciales Necesarias

```
LOCAL (.env.local):
├── STELLAR_BIKE_ISSUER                [Auto-generado por create-token.js]
├── STELLAR_BIKE_ISSUER_SECRET         [Auto-generado por create-token.js]
├── STELLAR_BIKE_DISTRIBUTOR           [Auto-generado por create-token.js]
├── STELLAR_BIKE_DISTRIBUTOR_SECRET    [Auto-generado por create-token.js]
├── STRAVA_CLIENT_ID                   [De https://www.strava.com/settings/apps]
└── STRAVA_CLIENT_SECRET               [De https://www.strava.com/settings/apps]

VERCEL (Environment Variables):
├── STRAVA_CLIENT_ID                   [Producción + Preview]
└── STRAVA_CLIENT_SECRET               [Producción + Preview]
```

## ✨ Flujo Completo de Uso

```
Usuario abre la app
    ↓
Click "Conectar Strava"
    ↓
Redirige a Strava.com
    ↓
Usuario autoriza
    ↓
Strava redirige a /api/strava-auth?code=xxx
    ↓
Backend (Vercel) intercambia código por access_token
    ↓
Token se guarda en cookie HttpOnly
    ↓
Frontend obtiene actividades de /api/strava-activities
    ↓
Backend usa token para obtener de Strava API
    ↓
Frontend calcula CO2 y tokens BIKE
    ↓
Muestra resultados al usuario ✅
```
