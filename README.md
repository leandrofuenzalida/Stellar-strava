# 🚴 Strava → Stellar Rewards

Sistema tokenizado que convierte tus kilómetros en bicicleta en tokens blockchain Stellar.

## 📋 Descripción

Este proyecto integra **Strava** (plataforma de deportes) con **Stellar Blockchain** para crear un sistema de recompensas sostenible:

- **Sincroniza** tus actividades de Strava
- **Calcula** el CO2 que evitas emitir (120g por km)
- **Emite** tokens BIKE en la red Stellar (1:1 ratio kg CO2 → BIKE)
- **Canjea** tus tokens por descuentos o transfiere a amigos
- **Visualiza** tu impacto ambiental en tiempo real

## 🎯 Características Principales

✓ **Integración MCP Strava** - Conexión directa con tus datos de ciclismo  
✓ **Cálculos Automáticos** - CO2 evitado basado en km reales  
✓ **Blockchain Real** - Tokens en la red Stellar pública  
✓ **Interfaz Interactiva** - Visualización paso a paso del proceso  
✓ **Completamente Funcional** - Datos de ejemplo incluidos  

## 🚀 Acceder a las Páginas

### 1. **Landing Page Principal** (Comienza aquí)
```
https://leandrofuenzalida.github.io/strava-stellar.html
```
Descripción general, características y acceso a otros recursos.

### 2. **Calculadora Interactiva**
```
https://leandrofuenzalida.github.io/strava-stellar-rewards.html
```
Interfaz visual paso a paso:
- Conectar Strava
- Calcular CO2 evitado
- Ver conversión a tokens BIKE
- Canjear recompensas
- Visualizar impacto

**Prueba con datos de ejemplo** sin conectar Strava realmente.

### 3. **Documentación Técnica**
```
https://leandrofuenzalida.github.io/strava-stellar-integration.html
```
Guía técnica con 4 secciones:
- **Arquitectura** - Componentes y flujo de datos
- **MCP Integration** - Herramientas Strava y ejemplos de código
- **Smart Contracts** - Configuración de tokens en Stellar Soroban
- **Deployment** - Paso a paso para implementar

## 📊 Cómo Funciona

```
┌─────────────────┐
│  Usuario Strava │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Strava MCP Server  │  ← Obtiene actividades (km)
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Data Processor     │  ← Calcula CO2 (km × 0.120)
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Stellar Contract   │  ← Emite tokens BIKE (1:1)
└────────┬────────────┘
         │
         ▼
┌──────────────────┐
│  User's Wallet   │  ← Recibe tokens BIKE
└──────────────────┘
```

## 🔧 Stack Técnico

### Frontend
- **HTML5 / CSS3 / JavaScript** - Interfaz responsiva
- **Gradientes y animaciones** - Diseño moderno
- **Sin dependencias externas** - Todo incluido en archivos HTML

### Backend (MCP)
- **Strava MCP Server** - Integración con API de Strava
- **Data Processing** - Cálculos de CO2
- **Stellar SDK** - Interacción con blockchain

### Blockchain
- **Red:** Stellar Mainnet / Testnet
- **Token:** BIKE (asset customizado)
- **Smart Contracts:** Soroban (Rust)
- **Estándar:** SEP-0041 (Stellar Assets)

## 📈 Fórmulas de Conversión

```
1. Kilómetros en bicicleta
   km = Suma de distancias de Strava

2. CO2 Evitado
   CO2 (kg) = km × 0.120
   Ejemplo: 100 km × 0.120 = 12 kg CO2

3. Tokens BIKE
   BIKE tokens = CO2 (kg) × 1
   Ejemplo: 12 kg = 12 BIKE tokens

4. Valor Aproximado
   Valor USD ≈ BIKE tokens × $0.50
   Ejemplo: 12 BIKE ≈ $6.00
```

## 🔐 Seguridad y Privacidad

✓ **Datos privados** - Solo usamos distancia y tipo de actividad  
✓ **No almacenamos rutas** - Información mínima procesada  
✓ **Blockchain descentralizado** - Tus tokens bajo tu control  
✓ **Ledger abierto** - Todas las transacciones verificables  
✓ **HTTPS/MCP seguro** - Comunicación encriptada  

## 🛠️ Configuración Local (Desarrollo)

### Requisitos
- Node.js 18+
- Git
- Stellar CLI (para deployment)

### Setup
```bash
# Clonar repositorio
git clone https://github.com/leandrofuenzalida/leandrofuenzalida.github.io
cd leandrofuenzalida.github.io

# Instalar dependencias MCP
npm install @stellar/js-sdk
npm install dotenv

# Configurar MCP Strava
claude mcp add --transport http strava \
  "https://strava-mcp.example.com"

# Abrir en navegador
open strava-stellar.html
```

### Variables de Entorno (.env)
```env
# Strava
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret

# Stellar
STELLAR_NETWORK=public
STELLAR_ISSUER_SECRET=SBRIDE...

# MCP
MCP_STRAVA_ENABLED=true
```

## 📱 Uso de la Calculadora Interactiva

1. **Abre** `strava-stellar-rewards.html`
2. **Conecta Strava** o carga datos de ejemplo
3. **Observa** cómo se calculan automáticamente:
   - Total de km
   - CO2 evitado
   - Tokens BIKE ganados
4. **Canjea** o transfiere tus tokens
5. **Visualiza** tu impacto ambiental

## 💡 Casos de Uso

### Para Usuarios
- Ganar recompensas reales por pedalear
- Contribuir al medio ambiente con incentivos
- Transferir tokens a amigos
- Canjear por descuentos en negocios locales
- Participar en competencias gamificadas

### Para Negocios
- Atraer clientes ecológicos
- Crear programas de fidelización
- Aceptar pagos en BIKE tokens
- Promocionar sostenibilidad

### Para Ciudades
- Incentivar transporte sostenible
- Reducir congestión vehicular
- Promover salud y bienestar
- Cumplir objetivos de CO2

## 📚 Documentación Relacionada

- [Strava API Developers](https://developers.strava.com)
- [Stellar Developers](https://developers.stellar.org)
- [Soroban Smart Contracts](https://developers.stellar.org/docs/smart-contracts)
- [MCP Protocol](https://modelcontextprotocol.io)

## 🤝 Contribuir

Sugerencias y mejoras son bienvenidas. Puedes:
- Reportar bugs
- Proponer nuevas features
- Mejorar documentación
- Contribuir código

## 📄 Licencia

Código abierto con licencia MIT.

## 📧 Contacto

Para preguntas o sugerencias:
- Email: leandro.fuenzalida@gmail.com
- GitHub Issues: [Reportar problema](https://github.com/leandrofuenzalida/leandrofuenzalida.github.io/issues)

---

**🌱 Pedalea hacia un futuro más sostenible**

Hecho con ❤️ para la comunidad de ciclistas y el planeta.
