# Lesson 6: Using Custom Tokens for Tasks

This lesson covers how to create, mint, and send a KPL Token. Here is the lesson plan:

- [Part I. Create a KPL Token](./README.md) - Explains and showcases an example of how to create a KPL token on our chain. 
- [Part II. Operations](./PartII.md) - Discusses operations within the JavaScript package about how to mint, transfer, etc. 
- [Part III. RPC API](./PartIII.md) - Walks through the RPC APIs related to our KPL Token Operations. 

## Part I. Create a KPL Token
Creating a custom KPL Token can be crucial for specific tasks in decentralized applications. This part of the lesson demonstrates how to create your own KPL Token using the `@solana/spl-token` JavaScript package.

### Overview
1. Setting Up Your Project
2. Connecting to the Solana Blockchain
3. Creating a New Token

#### Prerequisites
Before we begin, ensure you have the following:

1. Node.js installed on your machine.
2. Solana CLI installed.
3. A wallet configured with some KOII for transaction fees.

#### Step-by-Step Guide

1. Setting Up Your Project
First, create a new directory for your project and initialize it with npm:
```bash
mkdir koii-kpl-token
cd koii-kpl-token
npm init -y
npm install @_koi/web3.js @solana/spl-token
```

2. Connecting to the Koii Blockchain
Create a new file `create_token.js` and import necessary libraries:

```javascript
const { Connection, PublicKey, clusterApiUrl, Keypair } = require("@_koi/web3.js");
const { Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const connection = new Connection("https://testnet.koii.network", 'confirmed');
```

3. Creating a New Token
In the same file, add the following code to generate a new `keypair` for the token and create it:

```javascript
const main = async () => {
    // Create a new wallet keypair
    const payer = Keypair.generate();

    // Create new token
    const token = await createMint(
        connection,
        payer, // the fee payer
        payer.publicKey, // the mint authority
        payer.publicKey, // the freeze authority
        9
    );

    console.log(`Created a new token with mint address: ${token.publicKey.toBase58()}`);
};

main().catch(err => console.error(err));
```

4. Testing the Token Creation
Ensure you have transferred some Koii to the payer wallet to cover transaction fees. Then, run the script:

```bash
node create_token.js
```
Additional Considerations: 

Token Decimals: Define the token precision. In our example, we used 9 decimals.
Mint Authority: The wallet is allowed to mint new tokens. In this script, the payer is the mint authority.

This script demonstrates the initial steps to create a KPL Token. In the next parts, we will cover how to mint, transfer tokens, and utilize them in tasks.

[Continue to Part II. Operations](./PartII.md)
