import "./contract_escrow";

message(0x1f58bf48) CreateEscrow {
    client: Address;
    provider: Address;
    amount: Int as uint128;
    isClientConfirmed: Bool;
    isProviderConfirmed: Bool;
}

contract EscrowFactory(owner: Address) {
    receive(msg: CreateEscrow) {
        let client = sender();

        let init = initOf Escrow(client, msg.provider, msg.amount, false, false);
        let escrow = contractAddress(init);

        send(SendParameters {
            to: escrow,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            bounce: false,
            body: beginCell().endCell(),
            data: init.data,
            code: init.code,
        });

        cashback(client);
    }
}
