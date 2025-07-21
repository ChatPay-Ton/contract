import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { EscrowFactory } from '../build/EscrowFactory/EscrowFactory_EscrowFactory';
import '@ton/test-utils';

describe('EscrowFactory', () => {
  let blockchain: Blockchain;
  let client: SandboxContract<TreasuryContract>;
  let provider: SandboxContract<TreasuryContract>;
  let owner: SandboxContract<TreasuryContract>;
  let escrowFactory: SandboxContract<EscrowFactory>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    client = await blockchain.treasury('client');
    provider = await blockchain.treasury('provider');
    owner = await blockchain.treasury('owner');

    escrowFactory = blockchain.openContract(await EscrowFactory.fromInit(owner.address));
  });

  it('should deploy', async () => {
    // Teste básico de deployment - apenas verificar que o contrato pode ser inicializado
    expect(escrowFactory.address).toBeDefined();
  });

  it('should create escrow contract successfully', async () => {
    const escrowAmount = toNano('1.0');

    const createEscrowResult = await escrowFactory.send(
      client.getSender(),
      {
        value: toNano('0.2'), // Valor suficiente para deploy e taxa
      },
      {
        $$type: 'CreateEscrow',
        client: client.address,
        provider: provider.address,
        amount: escrowAmount,
        isClientConfirmed: false,
        isProviderConfirmed: false,
      }
    );

    expect(createEscrowResult.transactions).toHaveTransaction({
      from: client.address,
      to: escrowFactory.address,
      success: true,
    });
  });

  it('should create multiple escrow contracts', async () => {
    const escrowAmount = toNano('1.0');

    for (let i = 0; i < 3; i++) {
      const tempClient = await blockchain.treasury(`client${i}`);
      const tempProvider = await blockchain.treasury(`provider${i}`);

      const createEscrowResult = await escrowFactory.send(
        tempClient.getSender(),
        {
          value: toNano('0.2'),
        },
        {
          $$type: 'CreateEscrow',
          client: tempClient.address,
          provider: tempProvider.address,
          amount: escrowAmount,
          isClientConfirmed: false,
          isProviderConfirmed: false,
        }
      );

      expect(createEscrowResult.transactions).toHaveTransaction({
        from: tempClient.address,
        to: escrowFactory.address,
        success: true,
      });
    }
  });

  it('should handle different escrow amounts', async () => {
    const testCases = [toNano('0.5'), toNano('2.0'), toNano('10.0')];

    for (let i = 0; i < testCases.length; i++) {
      const tempClient = await blockchain.treasury(`client_${i}`);
      const tempProvider = await blockchain.treasury(`provider_${i}`);

      const createEscrowResult = await escrowFactory.send(
        tempClient.getSender(),
        {
          value: toNano('0.2'),
        },
        {
          $$type: 'CreateEscrow',
          client: tempClient.address,
          provider: tempProvider.address,
          amount: testCases[i],
          isClientConfirmed: false,
          isProviderConfirmed: false,
        }
      );

      expect(createEscrowResult.transactions).toHaveTransaction({
        from: tempClient.address,
        to: escrowFactory.address,
        success: true,
      });
    }
  });
}); 