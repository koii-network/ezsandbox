# Lesson 6: KPL Tokens

## Deploying a KPL Task

Follow the instructions from [Lesson 1](../Lesson%201/PartIV.md#deploying-a-task) until you reach the step where you choose a task type:

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
