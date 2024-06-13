## Part II. Operations
In this part, we will focus on the minting process using the @solana/spl-token library. Minting is the process of creating new tokens that are added to the circulation within the blockchain. 

### Overview
Minting custom tokens requires an understanding of a few key concepts:

- Mint Authority: This is the wallet or entity that has the authority to create new tokens.
- Token Account: A wallet must have a token account associated with the particular token mint to receive and hold tokens.

### Step-by-Step Guide to Minting Tokens

1. Prepare the Environment
Make sure your project setup from Part I is ready. If not, please refer back to ensure all dependencies are installed and your project is correctly set up.

2. Writing the Minting Function
Open your project and update the `create_token.js` file, or create a new file named `mint_token.js` to include minting functionality. Below is a guide on how to write the minting function:
```Javascript
const { Connection, PublicKey, Keypair } = require("@_koi/web3.js");
const { mintTo, getOrCreateAssociatedTokenAccount } = require("@solana/spl-token");

// Establish connection to the blockchain
const connection = new Connection("https://testnet.koii.network", "confirmed");

// Create or import the payer's Keypair
const keypair = Keypair.generate(); // For example, or load from your wallet

async function mintTokens(tokenMintAddress, mintAmount, tokenDecimals) {
    console.log("Payer Keypair:", keypair);

    // Get or create the associated token account for the mint
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        new PublicKey(tokenMintAddress),
        keypair.publicKey
    );
    console.log("Token Account:", tokenAccount.address.toBase58());

    // Mint new tokens
    const mintResult = await mintTo(
        connection,
        keypair,
        new PublicKey(tokenMintAddress),
        tokenAccount.address,
        keypair,
        Number(mintAmount) * 10 ** Number(tokenDecimals)
    );
    console.log("Minting successful, transaction ID:", mintResult);
}

// Example usage
mintTokens("YourTokenMintAddress", "1000", "9");
```
3. Execute and Verify
To execute the minting script:

- Ensure you have sufficient KOII in your payer's account for transaction fees.
- Replace "YourTokenMintAddress" with your actual token mint address and adjust mintAmount and tokenDecimals as needed.
- Run your script using Node.js:
```bash
node mint_token.js
```
#### Additional Tips
- Token Decimals: Remember that the amount to mint should consider the decimal places defined in your token creation. For example, to mint 1000 tokens with 9 decimals, you multiply 1000 by 10^9. 
- Security: Handle the Keypair and token details securely. Avoid hardcoding sensitive information directly into your scripts.
[Continue to Part III. RPC API](./PartIII.md)