# Lesson 1: Introduction to Koii Tasks

## Part 1: What is a Koii Task?

### Overview

A Koii Task is a decentralized computing job that runs across our network of nodes. Below is an infographic showing how a task runs (the runtime flow):

![Lesson_1_Know_Koii_Task_Basic](https://github.com/koii-network/ezsandbox/blob/main/Lesson%201/imgs/gradual-consensus.png)

Let's take a look at a minimal example to see how the runtime flow works in practice.

### Example

To get you started, we've provided the code for a simple task in the [`EZ-testing-task/`](./EZ-testing-task/) folder.

#### Do the work

1. **Do the job**: This task simply [saves the string "Hello, World!" to the local database](./EZ-testing-task/task/submission.js#L15)

#### Review and Audit Work

1. **Submit proofs**: Send the work to be checked. In this case, we are [fetching the string from the local database](./EZ-testing-task/task/submission.js#L54) and [submit it](./EZ-testing-task/task/submission.js#L37)
2. **Review proofs**: Other nodes in the network verify the work. Here we are [verifying whether the submission is the string "Hello, World!"](./EZ-testing-task/task/audit.js#L16).

#### Distribute Rewards

1-3. **Prepare, Submit, and Review Distribution List**: You won't usually need to alter the logic for these steps, but they can be found in [distribution.js](./EZ-testing-task/task/distribution.js)
4. **Distribute Rewards**: Rewards are distributed to each node that completed the work. Here we are penalizing incorrect submissions by [removing 70% of their stake](./EZ-testing-task/task/distribution.js#L123) and equally [distributing the bounty per round to all successful submissions](./EZ-testing-task/task/distribution.js#L140).

We'll revisit this task shortly, but first let's take a look at the Desktop Node. [Part II: Introduction to the Node](./PartII.md)
