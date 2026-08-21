#!/usr/bin/env node

/**
 * Script para crear el token BIKE en Stellar Testnet
 *
 * Uso:
 *   npm install
 *   node create-token.js
 *
 * Este script:
 * 1. Crea keypairs para emisor y distribuidor
 * 2. Obtiene fondos de Friendbot (testnet faucet)
 * 3. Crea una trust line para el token BIKE
 * 4. Emite 1,000,000 tokens BIKE
 * 5. Guarda las credenciales en .env.local
 */

const StellarSdk = require('stellar-sdk');
const fs = require('fs');

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = 'Test SDF Network ; September 2015';

async function createBikeToken() {
  console.log('🚀 Creando token BIKE en Stellar Testnet...\n');

  try {
    // 1. Crear keypair del emisor
    console.log('1️⃣  Generando keypair del emisor...');
    const issuerKeypair = StellarSdk.Keypair.random();
    const issuerPublic = issuerKeypair.publicKey();
    const issuerSecret = issuerKeypair.secret();

    console.log(`   Public:  ${issuerPublic}`);
    console.log(`   Secret:  ${issuerSecret}\n`);

    // 2. Obtener fondos del issuer con friendbot
    console.log('2️⃣  Obteniendo fondos del emisor...');
    let response = await fetch(
      `https://friendbot.stellar.org?addr=${issuerPublic}`
    );

    if (!response.ok) {
      throw new Error(`Friendbot error: ${response.statusText}`);
    }

    const friendbotData = await response.json();
    console.log(`   ✓ Fondos recibidos: ${friendbotData.hash}\n`);
    await new Promise(r => setTimeout(r, 2000));

    // 3. Crear keypair del distribuidor
    console.log('3️⃣  Configurando cuenta de distribuidor...');
    const distributorKeypair = StellarSdk.Keypair.random();
    const distributorPublic = distributorKeypair.publicKey();
    const distributorSecret = distributorKeypair.secret();

    console.log(`   Public:  ${distributorPublic}`);
    console.log(`   Secret:  ${distributorSecret}\n`);

    // 4. Fondos para el distribuidor
    console.log('4️⃣  Obteniendo fondos del distribuidor...');
    response = await fetch(
      `https://friendbot.stellar.org?addr=${distributorPublic}`
    );

    if (!response.ok) {
      throw new Error(`Friendbot error: ${response.statusText}`);
    }

    console.log(`   ✓ Fondos recibidos\n`);
    await new Promise(r => setTimeout(r, 2000));

    // 5. Cargar la cuenta del distribuidor
    console.log('5️⃣  Cargando cuenta del distribuidor...');
    const distributorAccount = await server.loadAccount(distributorPublic);
    console.log(`   ✓ Sequence: ${distributorAccount.sequence}\n`);

    // 6. Crear transacción para confiar en el asset BIKE
    console.log('6️⃣  Creando trust line para BIKE...');
    const bikeAsset = new StellarSdk.Asset('BIKE', issuerPublic);

    const trustTransaction = new StellarSdk.TransactionBuilder(
      distributorAccount,
      {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: networkPassphrase,
      }
    )
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset: bikeAsset,
          limit: '1000000',
        })
      )
      .setTimeout(30)
      .build();

    trustTransaction.sign(distributorKeypair);
    const trustResult = await server.submitTransaction(trustTransaction);

    console.log(`   ✓ Trust line creada: ${trustResult.hash}\n`);
    await new Promise(r => setTimeout(r, 2000));

    // 7. Emitir tokens
    console.log('7️⃣  Emitiendo 1,000,000 tokens BIKE...');
    const issuerAccount = await server.loadAccount(issuerPublic);

    const issueTransaction = new StellarSdk.TransactionBuilder(
      issuerAccount,
      {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: networkPassphrase,
      }
    )
      .addOperation(
        StellarSdk.Operation.payment({
          destination: distributorPublic,
          asset: bikeAsset,
          amount: '1000000',
        })
      )
      .setTimeout(30)
      .build();

    issueTransaction.sign(issuerKeypair);
    const issueResult = await server.submitTransaction(issueTransaction);

    console.log(`   ✓ Tokens emitidos: ${issueResult.hash}\n`);

    // 8. Guardar en .env.local
    console.log('8️⃣  Guardando credenciales en .env.local...');
    const envContent = `# Stellar BIKE Token Credentials
STELLAR_BIKE_ISSUER=${issuerPublic}
STELLAR_BIKE_ISSUER_SECRET=${issuerSecret}
STELLAR_BIKE_DISTRIBUTOR=${distributorPublic}
STELLAR_BIKE_DISTRIBUTOR_SECRET=${distributorSecret}

# Strava OAuth
STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
`;

    fs.writeFileSync('.env.local', envContent);
    console.log('   ✓ Credenciales guardadas en .env.local\n');

    // 9. Resumen
    console.log('════════════════════════════════════════════════');
    console.log('✨ TOKEN BIKE CREADO EN STELLAR TESTNET');
    console.log('════════════════════════════════════════════════\n');

    console.log('📊 CONFIGURACIÓN DEL TOKEN:');
    console.log(`   Nombre:       BIKE`);
    console.log(`   Emisor:       ${issuerPublic}`);
    console.log(`   Distribuidor: ${distributorPublic}`);
    console.log(`   Supply:       1,000,000 BIKE`);
    console.log(`   Red:          Stellar Testnet\n`);

    console.log('🔗 LINKS DE STELLAR EXPERT:');
    console.log(
      `   Emisor:       https://stellar.expert/explorer/testnet/account/${issuerPublic}`
    );
    console.log(
      `   Distribuidor: https://stellar.expert/explorer/testnet/account/${distributorPublic}`
    );
    console.log(
      `   Token:        https://stellar.expert/explorer/testnet/asset/BIKE-${issuerPublic}\n`
    );

    console.log('📋 TRANSACCIONES:');
    console.log(`   Trust Line: ${trustResult.hash}`);
    console.log(`   Emisión:    ${issueResult.hash}\n`);

    console.log('════════════════════════════════════════════════');
    console.log('✅ Token listo para usar en tu app!\n');

    return {
      token: {
        code: 'BIKE',
        issuer: issuerPublic,
        issuerSecret: issuerSecret,
        distributor: distributorPublic,
        distributorSecret: distributorSecret,
      },
      transactions: {
        trustLine: trustResult.hash,
        emission: issueResult.hash,
      },
    };

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
createBikeToken();
