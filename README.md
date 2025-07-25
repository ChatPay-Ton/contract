# ChatPay TON - Contratos Inteligentes

Sistema de pagamentos seguros com escrow na blockchain TON, desenvolvido em Tact.

## 📋 Descrição

O ChatPay TON é uma solução para facilitar pagamentos seguros entre clientes e prestadores de serviços através de contratos de escrow (depósito em garantia). O sistema garante que os fundos só sejam liberados quando ambas as partes confirmarem a conclusão do serviço.

## 🔧 Contratos

### EscrowFactory
- **Função**: Cria novos contratos de escrow
- **Uso**: Permite que qualquer usuário crie um novo contrato de depósito em garantia
- **Responsabilidade**: Gerencia a criação e inicialização de contratos Escrow

### Escrow
- **Função**: Gerencia o depósito em garantia entre cliente e prestador
- **Características**:
  - Cliente deposita o valor acordado
  - Ambas as partes precisam confirmar para liberar o pagamento
  - Status transparente do processo (esperando, confirmações, finalizado)
- **Segurança**: Apenas as partes envolvidas podem interagir com o contrato

## 🌐 Contrato na Mainnet

**Endereço do contrato**: [`EQDu_xcpGtFeApo5bl9y5O9-tPXN1EJo7kkIlSczirLBljE4`](https://tonscan.org/address/EQDu_xcpGtFeApo5bl9y5O9-tPXN1EJo7kkIlSczirLBljE4)

## 📁 Estrutura do Projeto

-   `contracts` - código fonte dos contratos inteligentes e suas dependências
-   `wrappers` - classes wrapper (implementando `Contract` do ton-core) para os contratos
-   `tests` - testes para os contratos
-   `scripts` - scripts do projeto, principalmente para deploy

## 🚀 Como usar

### Build

```bash
npx blueprint build
# ou
yarn blueprint build
```

### Testes

```bash
npx blueprint test
# ou
yarn blueprint test
```

### Deploy ou executar script

```bash
npx blueprint run
# ou
yarn blueprint run
```

### Adicionar novo contrato

```bash
npx blueprint create ContractName
# ou
yarn blueprint create ContractName
```
