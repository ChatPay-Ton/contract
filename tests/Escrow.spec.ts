import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Escrow } from '../build/Escrow/Escrow_Escrow';
import '@ton/test-utils';

describe('Escrow', () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let client: SandboxContract<TreasuryContract>;
  let provider: SandboxContract<TreasuryContract>;
  let escrow: SandboxContract<Escrow>;
  const escrowAmount = toNano('1.0');

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    deployer = await blockchain.treasury('deployer');
    client = await blockchain.treasury('client');
    provider = await blockchain.treasury('provider');

    escrow = blockchain.openContract(await Escrow.fromInit(
      client.address,
      provider.address,
      escrowAmount,
      false,
      false
    ));

    // Deploy com uma transação de depósito válida
    const deployResult = await escrow.send(
      client.getSender(),
      {
        value: toNano('1.1'), // Valor suficiente para cobrir o escrow amount + taxa
      },
      {
        $$type: 'Deposit',
        value: escrowAmount,
      }
    );

    expect(deployResult.transactions).toHaveTransaction({
      from: client.address,
      to: escrow.address,
      success: true,
    });
  });

  it('should deploy', async () => {
    const status = await escrow.getStatus();
    expect(status).toBe(0n); // Status inicial - esperando
  });

  it('should allow client to deposit sufficient value', async () => {
    // Criamos um novo contrato para testar o depósito
    const newEscrow = blockchain.openContract(await Escrow.fromInit(
      client.address,
      provider.address,
      toNano('0.5'), // Valor menor para este teste
      false,
      false
    ));

    const depositResult = await newEscrow.send(
      client.getSender(),
      {
        value: toNano('0.6'), // Um pouco mais que o necessário
      },
      {
        $$type: 'Deposit',
        value: toNano('0.5'),
      }
    );

    expect(depositResult.transactions).toHaveTransaction({
      from: client.address,
      to: newEscrow.address,
      success: true,
    });
  });

  it('should reject deposit from non-client', async () => {
    const depositResult = await escrow.send(
      provider.getSender(),
      {
        value: toNano('1.1'),
      },
      {
        $$type: 'Deposit',
        value: escrowAmount,
      }
    );

    expect(depositResult.transactions).toHaveTransaction({
      from: provider.address,
      to: escrow.address,
      success: false,
    });
  });

  it('should allow client to confirm', async () => {
    const confirmResult = await escrow.send(
      client.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Confirm',
        fromClient: true,
      }
    );

    expect(confirmResult.transactions).toHaveTransaction({
      from: client.address,
      to: escrow.address,
      success: true,
    });

    const status = await escrow.getStatus();
    expect(status).toBe(1n); // Cliente confirmou
  });

  it('should allow provider to confirm', async () => {
    const confirmResult = await escrow.send(
      provider.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Confirm',
        fromClient: false,
      }
    );

    expect(confirmResult.transactions).toHaveTransaction({
      from: provider.address,
      to: escrow.address,
      success: true,
    });

    const status = await escrow.getStatus();
    expect(status).toBe(2n); // Provedor confirmou
  });

  it('should reject confirmation from wrong address', async () => {
    // Cliente tentando confirmar como provedor
    const wrongConfirmResult = await escrow.send(
      client.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Confirm',
        fromClient: false,
      }
    );

    expect(wrongConfirmResult.transactions).toHaveTransaction({
      from: client.address,
      to: escrow.address,
      success: false,
    });
  });

  it('should complete escrow when both parties confirm', async () => {
    // Primeiro o cliente confirma
    await escrow.send(
      client.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Confirm',
        fromClient: true,
      }
    );

    // Depois o provedor confirma - isso deve liberar o pagamento
    const finalConfirmResult = await escrow.send(
      provider.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Confirm',
        fromClient: false,
      }
    );

    expect(finalConfirmResult.transactions).toHaveTransaction({
      from: provider.address,
      to: escrow.address,
      success: true,
    });

    const status = await escrow.getStatus();
    expect(status).toBe(3n); // Ambos confirmaram
  });

  it('should track status correctly through the process', async () => {
    let status = await escrow.getStatus();
    expect(status).toBe(0n);

    // Cliente confirma
    await escrow.send(
      client.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Confirm',
        fromClient: true,
      }
    );

    status = await escrow.getStatus();
    expect(status).toBe(1n);

    // Provedor confirma
    await escrow.send(
      provider.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Confirm',
        fromClient: false,
      }
    );

    status = await escrow.getStatus();
    expect(status).toBe(3n);
  });
}); 