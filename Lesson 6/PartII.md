# Lesson 6: KPL Tokens

## Deploying a KPL Task

1. Make sure you have enough token in your account to cover the cost of the bounty, and enough KOII to cover the cost of the deployment fees. The deployment fee is determined by the `space` value in `config-task.yml`. If you are testing a task, you can set the space to 0.1, which will cost about 7 KOII. If you are deploying into production, the space should be at least 1, which would cost about 70 KOII.

2. In `config-task.yml`, set the values you want for `minimum_stake`, `total_bounty_amount`, and `bounty_amount_per_round`. These will all be in your token, not in KOII.

3. In `config-task.yml`, change `task_type` to `KPL` and enter the token mint address in `token_type`.

   > [!NOTE]
   >
   > You can deploy a task with *any* KPL token as long as you have sufficient balance and you know the mint address; it doesn't have to be a token you created.

Follow the instructions from [Lesson 1](../Lesson%201/PartIV.md#deploying-a-task) for deploying a task!
