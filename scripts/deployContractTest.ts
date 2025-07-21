import { toNano } from '@ton/core';
import { ContractTest } from '../build/ContractTest/ContractTest_ContractTest';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractTest = provider.open(await ContractTest.fromInit(BigInt(Math.floor(Math.random() * 10000)), 0n));

    await contractTest.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(contractTest.address);

    console.log('ID', await contractTest.getId());
}
