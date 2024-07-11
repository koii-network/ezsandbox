# Lesson 6: KPL Tokens

## Deploying a KPL Task

### Config

Deploying a KPL task is very similar to deploying a Koii Task. You'll use the same `config-task.yml`, but the values you enter for `minimum_stake_amount`, `total_bounty_amount`, and `bounty_amount_per_round` will be in your token rather than KOII.

### Create Task CLI

In order to deploy a KPL task, we'll use the same command we used for deploying a KOII task:

```sh
npx @_koii/create-task-cli
```

You'll see this menu:

```sh
? Select operation › - Use arrow-keys. Return to submit.
❯   Create a New Local Repository
    Deploy a New Task
    Update Existing Task
    Activate/Deactivate Task
    Claim Reward
    Fund Task with More KOII
    Withdraw Staked Funds from Task
    Upload Assets to IPFS (Metadata/Local Vars)
```

Choose `Deploy a New Task`. Next, you may be asked if you want to use your Koii CLI wallet:

```sh
It looks like you have a koii cli installed. Would you like to use your koii cli key (/home/laura/.config/koii/id.json) to deploy this task? › (y/N)
```

> [!IMPORTANT]
>
> The wallet you use to deploy a KPL task must have sufficient KOII to cover the rent exemption and your token bounty.

In order to create a KPL task, you must use the wallet that holds your token - this is the wallet you used when creating it. If it is not your Koii CLI wallet, be sure to choose `no` at this point. Next you may be asked a similar question about your desktop node wallet:

```sh
It looks like you have a desktop node installed. Would you like to use your desktop node key (/home/laura/.config/KOII-Desktop-Node/wallets/Laura Work_mainSystemWallet.json) to deploy this task? › (y/N)
```

Again, only choose `yes` if this is the wallet you used to create your token. If you choose `no` for this as well, you will be asked to manually enter the path to your wallet:

```sh
? Enter the path to your wallet ›
```

After you've entered the path to your wallet, you'll be asked how you want to configure your task:

```sh
? Select operation › - Use arrow-keys. Return to submit.
❯   using CLI
    using config YML
```

Make sure you have set the `minimum_stake_amount`, `total_bounty_amount`, and `bounty_amount_per_round` values you want to use in `config-task.yml`, then choose `using config YML`.

Next, you'll be asked how you would like to upload your metadata:

```sh
? Select operation › - Use arrow-keys. Return to submit.
❯   Using KOII Storage SDK
    Manually Input IPFS
```

Choose `Using KOII Storage SDK`. At this point you may be asked if you want to use the staking wallet from your desktop node. This wallet is only used for signing the IPFS upload, so it is safe to choose `yes` here.

```sh
? It looks like you have a desktop node installed. Would you like to use your desktop node staking key (/home/laura/.config/KOII-Desktop-Node/namespace/Laura Work_stakingWallet.json) to sign this upload to IPFS? › (y/N)
```

If you choose no, or if your staking wallet's location cannot be found automatically, you will be asked to manually enter the path to your staking wallet:

```sh
? Enter the path to your staking wallet ›
```

You'll now be asked what type of task you want to deploy:

```sh
? Select operation › - Use arrow-keys. Return to submit.
❯    KOII-Task
     KPL-Task
```

Choose `KPL-Task` and you will be asked to enter your mint address:

```sh
? Enter the mint address of the token you want to use for the task ›
```

You should have the mint address saved from when you created the token, but if you've misplaced it, you can find it by visiting [the explorer](https://explorer.koii.live/) and searching for your wallet's public key. Scroll down and click on the `Tokens` tab. You will see a list of the tokens you own along with their mint addresses. Click on the copy icon to copy your mint address to the clipboard.

After you enter your mint address, you will be asked to confirm your deployment:

```sh
? Your account will be deducted rent exemption(XX KOII) and bounty amount fees (XX Tokens) › (y/N)
```

Choose `yes` and your KPL task will be deployed!
