import { toNano, Address } from '@ton/core';
import { Escrow } from '../build/Escrow/Escrow_Escrow';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
  // Endereço do contrato - substitua pelo endereço real do seu contrato
  const contractAddress = Address.parse('kQDk534YvtZvop78-vfBpxxLfTAS3i1EDplF95Nl7qg9Qg9z');

  const escrow = provider.open(Escrow.fromAddress(contractAddress));

  console.log('📊 Verificando status do contrato Escrow...');
  console.log('Contract address:', contractAddress.toString());

  try {
    const status = await escrow.getStatus();
    console.log('Status:', status.toString(), getStatusText(status));

    console.log('');
    console.log('🎯 Escolha uma ação (edite este script):');
    console.log('');
    console.log('Para fazer depósito (apenas cliente):');
    console.log('1. Descomente e ajuste a seção DEPOSIT abaixo');
    console.log('');
    console.log('Para confirmar como cliente:');
    console.log('2. Descomente e ajuste a seção CLIENT_CONFIRM abaixo');
    console.log('');
    console.log('Para confirmar como provedor:');
    console.log('3. Descomente e ajuste a seção PROVIDER_CONFIRM abaixo');

    // ==============================================
    // DEPOSIT - Descomente para fazer depósito
    // ==============================================

    // console.log('💰 Making deposit...');
    // await escrow.send(
    //   provider.sender(),
    //   {
    //     value: toNano('1.05'), // 1 TON + taxa
    //   },
    //   {
    //     $$type: 'Deposit',
    //     value: toNano('1.0'),
    //   }
    // );
    // console.log('✅ Deposit sent!');


    // ==============================================
    // CLIENT_CONFIRM - Descomente para confirmar como cliente
    // ==============================================

    console.log('✅ Confirming as client...');
    await escrow.send(
      provider.sender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Confirm',
        fromClient: true,
      }
    );
    console.log('✅ Client confirmation sent!');


    // ==============================================
    // PROVIDER_CONFIRM - Descomente para confirmar como provedor
    // ==============================================

    // console.log('✅ Confirming as provider...');
    // await escrow.send(
    //   provider.sender(),
    //   {
    //     value: toNano('0.05'),
    //   },
    //   {
    //     $$type: 'Confirm',
    //     fromClient: false,
    //   }
    // );
    // console.log('✅ Provider confirmation sent!');


  } catch (error) {
    console.log('❌ Error:', error);
  }
}

function getStatusText(status: bigint): string {
  switch (Number(status)) {
    case 0: return '(Waiting for confirmations)';
    case 1: return '(Client confirmed)';
    case 2: return '(Provider confirmed)';
    case 3: return '(Both confirmed - Payment released)';
    default: return '(Unknown status)';
  }
} 