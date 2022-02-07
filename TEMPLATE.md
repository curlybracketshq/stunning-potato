# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools
commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample
script that deploys that contract, and an example of a task implementation,
which simply lists the available accounts. It also comes with a variety of other
tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
npx hardhat --network localhost run scripts/deploy.ts
npx hardhat console --network localhost
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

Example console session after deploying the contract:

```
const StunningPotato = await ethers.getContractFactory('StunningPotato');
const stunningPotatoContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const stunningPotato = await StunningPotato.attach(stunningPotatoContractAddress);
const authorAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
const frameData = '0xabcdef';
const tx = await stunningPotato.createFrame(authorAddress, frameData);
const rx = await tx.wait();
const event = rx.events.find(e => e.event === 'Transfer');
const tokenId = event.args['tokenId'].toString();
await stunningPotato.tokenURI(tokenId);
await stunningPotato.tokenData(tokenId);
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an
Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit
it to fill in the details. Enter your Etherscan API key, your Ropsten node URL
(eg from Alchemy), and the private key of the account which will send the
deployment transaction. With a valid .env file in place, first deploy your
contract:

```shell
hardhat run --network ropsten scripts/deploy.ts
```

Then, copy the deployment address and paste it in to replace
`DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type
checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in
hardhat's environment. For more details see
[the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
