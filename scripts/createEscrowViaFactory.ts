import { toNano, Address } from '@ton/core';
import { EscrowFactory } from '../build/EscrowFactory/EscrowFactory_EscrowFactory';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
  // Contract deployed at address EQDu_xcpGtFeApo5bl9y5O9-tPXN1EJo7kkIlSczirLBljE4
  // You can view it at https://testnet.tonscan.org/address/EQDu_xcpGtFeApo5bl9y5O9-tPXN1EJo7kkIlSczirLBljE4
  // ✅ EscrowFactory contract deployed successfully!
  // Factory address: EQCQkWNWU91_i2W3zwxheZn5ya_gg1Nv7J5lZeVxCOtLNnSf

  // Endereço da factory - substitua pelo endereço real da sua factory
  const factoryAddress = Address.parse('EQDu_xcpGtFeApo5bl9y5O9-tPXN1EJo7kkIlSczirLBljE4');

  const escrowFactory = provider.open(EscrowFactory.fromAddress(factoryAddress));

  console.log('🏭 Criando novo contrato Escrow via Factory...');
  console.log('Factory address:', factoryAddress.toString());

  // Configurar parâmetros do novo escrow
  const clientAddress = provider.sender().address!;
  const providerAddress = clientAddress; // Para teste, use o mesmo endereço
  const escrowAmount = toNano('2.0'); // 2 TON

  console.log('');
  console.log('📝 Parâmetros do novo Escrow:');
  console.log('Client:', clientAddress.toString());
  console.log('Provider:', providerAddress.toString());
  console.log('Amount:', '2 TON');

  try {
    console.log('');
    console.log('🚀 Enviando transação CreateEscrow...');

    await escrowFactory.send(
      provider.sender(),
      {
        value: toNano('0.2'), // Taxa para criação
      },
      {
        $$type: 'CreateEscrow',
        client: clientAddress,
        provider: providerAddress,
        amount: escrowAmount,
        isClientConfirmed: false,
        isProviderConfirmed: false,
      }
    );

    console.log('✅ CreateEscrow message sent!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Wait for the transaction to be processed');
    console.log('2. Check transaction details to find the new Escrow contract address');
    console.log('3. Use the new contract address with interactEscrow.ts script');
    console.log('4. Client should deposit the escrow amount');
    console.log('5. Both parties should confirm to complete the escrow');

  } catch (error) {
    console.log('❌ Error creating escrow:', error);
  }
} 