import { toNano } from '@ton/core';
import { EscrowFactory } from '../build/EscrowFactory/EscrowFactory_EscrowFactory';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
  const ownerAddress = provider.sender().address!;

  console.log('Deploying EscrowFactory contract...');
  console.log('Owner address:', ownerAddress.toString());

  const escrowFactory = provider.open(await EscrowFactory.fromInit(ownerAddress));

  // Deploy da factory criando um escrow de exemplo
  console.log('Sending deploy transaction with example escrow...');

  const exampleClient = ownerAddress;
  const exampleProvider = ownerAddress;
  const exampleAmount = toNano('0.1');

  await escrowFactory.send(
    provider.sender(),
    {
      value: toNano('0.3'), // Valor suficiente para deploy + criação
    },
    {
      $$type: 'CreateEscrow',
      client: exampleClient,
      provider: exampleProvider,
      amount: exampleAmount,
      isClientConfirmed: false,
      isProviderConfirmed: false,
    },
  );

  await provider.waitForDeploy(escrowFactory.address);

  console.log('✅ EscrowFactory contract deployed successfully!');
  console.log('Factory address:', escrowFactory.address.toString());
  console.log('');
  console.log('📝 Usage:');
  console.log('Send CreateEscrow message to factory with:');
  console.log('- client: Address');
  console.log('- provider: Address');
  console.log('- amount: BigInt (in nanotons)');
  console.log('- isClientConfirmed: false');
  console.log('- isProviderConfirmed: false');
  console.log('');
  console.log('💡 The factory will deploy a new Escrow contract and return remaining funds');
} 