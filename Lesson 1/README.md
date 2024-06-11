# Lesson 1: Introduction to Koii Tasks

## Part 1: What is a Koii Task?

### Overview

A Koii Task is a decentralized computing job across our network of nodes. Below is a runtime picture to help you understand better.

![Lesson_1_Know_Koii_Task_Basic](https://github.com/koii-network/ezsandbox/blob/main/Lesson%201/imgs/gradual-consensus.png)

To understand how a Koii Task works, let's take a look at an existing task.

### Example

To get you started, we've provided the code for a simple task in the [`EZ-testing-task/`](./EZ-testing-task/) folder. 


1. **Submission**: Submit the local computing result. Here it [saves a "Hello, World!" string to the database](./EZ-testing-task/task/submission.js#L15), [gets the value stored in the database](./EZ-testing-task/task/submission.js#L51) and [submits it](./EZ-testing-task/task/submission.js#L37). 
2. **Audit**: Verification by other nodes in the network. Here it [verifies whether the submitter submitted "Hello, World!"](./EZ-testing-task/task/audit.js#L16). 
3. **Distribution**: Rewards are distributed to each node that completed the work. Here it equally [distributes](./EZ-testing-task/task/audit.js#L50) the bounty per round to all successful submissions. 

Next, let's take a look at the Desktop Node. [Part II: Introduction to the Node](./PartII.md)
