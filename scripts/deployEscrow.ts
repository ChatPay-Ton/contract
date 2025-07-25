import { toNano, Address } from '@ton/core';
import { Escrow } from '../build/Escrow/Escrow_Escrow';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
  // Configurar parâmetros do contrato Escrow
  const clientAddress = provider.sender().address!;
  // Usar o próprio endereço como provedor para teste (pode ser alterado)
  const providerAddress = clientAddress;
  const escrowAmount = toNano('1.0'); // 1 TON de escrow

  console.log('Deploying Escrow contract...');
  console.log('Client address:', clientAddress.toString());
  console.log('Provider address:', providerAddress.toString());
  console.log('Escrow amount:', escrowAmount.toString(), 'nanotons (1 TON)');

  const escrow = provider.open(await Escrow.fromInit(
    clientAddress,
    providerAddress,
    escrowAmount,
    false, // isClientConfirmed
    false  // isProviderConfirmed
  ));

  // Deploy com um depósito inicial
  await escrow.send(
    provider.sender(),
    {
      value: toNano('1.05'), // 1 TON para escrow + 0.05 para taxa
    },
    {
      $$type: 'Deposit',
      value: escrowAmount,
    },
  );

  await provider.waitForDeploy(escrow.address);

  console.log('✅ Escrow contract deployed successfully!');
  console.log('Contract address:', escrow.address.toString());

  // Verificar status inicial
  try {
    const status = await escrow.getStatus();
    console.log('Initial status:', status.toString());
  } catch (error) {
    console.log('Could not get initial status');
  }

  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Both client and provider should confirm the transaction');
  console.log('2. Use npm run start to interact with the contract');
  console.log('');
  console.log('💡 Contract parameters:');
  console.log('- Client:', clientAddress.toString());
  console.log('- Provider:', providerAddress.toString());
  console.log('- Amount:', '1 TON');
} 