message(0x5fcc3d14) Deposit {
    value: Int as uint128;
}

message(0xcaacedc6) Confirm {
    fromClient: Bool;
}

contract Escrow(
    client: Address,
    provider: Address,
    amount: Int as uint128,
    isClientConfirmed: Bool,
    isProviderConfirmed: Bool,
) {
    receive(msg: Deposit) {
        require(sender() == self.client, "Only client can deposit");

        // garantir que o valor enviado é suficiente
        require(msg.value >= self.amount, "Insufficient value");
    }

    receive(msg: Confirm) {
        if (msg.fromClient) {
            require(sender() == self.client, "Not client");
            self.isClientConfirmed = true;
        } else {
            require(sender() == self.provider, "Not provider");
            self.isProviderConfirmed = true;
        }

        if (self.isClientConfirmed && self.isProviderConfirmed) {
            // libera o pagamento
            message(MessageParameters {
                to: self.provider,
                value: self.amount,
            });
        }
    }

    get fun status(): Int {
        // Retorna um status simples para leitura externa:
        // 0 = esperando
        // 1 = cliente confirmou
        // 2 = prestador confirmou
        // 3 = ambos confirmaram
        let sum = (self.isClientConfirmed ? 1 : 0) + (self.isProviderConfirmed ? 2 : 0);
        return sum;
    }
}
