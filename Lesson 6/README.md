# Lesson 6: KPL Tokens

KPL stands for Koii Program Library. It supports users in creating various fungible tokens, which can be used as rewards for tasks (currently in progress) and like other tokens, they are interchangeable and divisible.

Visit [this site](http://kpl.koii.network/) to create KPL Tokens.

## Create Token

First, upload your JSON wallet. This will be the same wallet you used to deploy a task in Lesson 1.

If you're using your main wallet from the desktop node, it will be located at `<OS-specific-path>/KOII-Desktop-Node/wallets/<name>_mainSystemWallet.json`.

The OS-specific paths are as follows:

**Windows**: `/Users/<username>/AppData/Roaming`

**Mac**: `/Users/<username>/Library/Application Support`

**Linux**: `/home/<username>/.config` (This path contains a dot folder that will be hidden by default. You can show hidden folders by pressing Ctrl-H)

Here you should see a file with the name `<name>stakingWallet.json`. Enter the full path to this file (`<OS-specific path>/KOII-Desktop-Node/namespace/<name>stakingWallet.json`).

If you created your wallet with `koii-keygen`, the default location is `<user_folder>/.config/koii/id.json`. The `.config` folder may be hidden in your file explorer, you can press `Cmd-Shift-.` on Mac or `Ctrl-H` on Linux. On Windows, there is no keyboard shortcut but in the file explorer you can select `View > Show > Hidden Files`. Make sure your wallet has a balance of at least 0.1 KOII to cover the cost of creating the mint and minting your tokens.

> [!NOTE]
>
> Your JSON wallet is handled through front-end JavaScript only. Your wallet file will never be uploaded anywhere and will always remain on your local machine.

Next, you'll need an image for your token. It can be a .png, .ico, or .jpg. It should be a square image; if it's rectangular, you may not like how it's cropped.

Finally enter the token details: the name, the symbol (like FIRE or KOII), and the description.

> [!TIP]
>
> When you create the token, you'll be given a public key - this is your mint address. Hold onto this, you'll need it in the next step.

## Mint Tokens

Minting your tokens is simple: you just need to enter the number of tokens, your JSON wallet file (the same one you used when creating the tokens), and your mint address.

## Tokens Owned

Afterwards, you can check the tokens you own by clicking "Connect Finnie" to link your Finnie Wallet, and then clicking "Fetch Tokens".
