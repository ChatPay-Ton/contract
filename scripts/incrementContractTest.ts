import { Address, toNano } from '@ton/core';
import { ContractTest } from '../build/ContractTest/ContractTest_ContractTest';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('ContractTest address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const contractTest = provider.open(ContractTest.fromAddress(address));

    const counterBefore = await contractTest.getCounter();

    await contractTest.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Add',
            amount: 1n,
        }
    );

    ui.write('Waiting for counter to increase...');

    let counterAfter = await contractTest.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await contractTest.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
