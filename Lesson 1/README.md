# Lesson 1: Introduction to Koii Tasks

## Part 1: What is a Koii Task?

### Overview

A Koii Task is a way for you to run a computing job in a distributed fashion, across our network of Nodes. To distribute the task while ensuring that it's done  correctly, we break the work into rounds with these main components:

1. **Task**: This is the main work the node needs to do in each round.
2. **Submission**: The result of the work is submitted to be checked.
3. **Audit**: The work is verified by other Nodes in the network.
4. **Distribution**: Rewards are handed out to each Node that successfully completed the work.

For more information on how this process works, see [Consensus](./Appendix/Consensus.md).

To understand how a Koii Task works, let's take a look at an existing task.

### Example

To get you started, we've provided the code for a simple task in the [`hello-world/`](./hello-world/) folder. The four job components in this case are:

1. **Task**: Save the string "Hello, World!" to the local database. This can be found in [`Submission.task()`](./hello-world/task/submission.js#L9)
2. **Submission**: Retrieves the value stored in the database and submits it for verification. This can be found in [`Submission.fetchSubmission()`](./hello-world/task/submission.js#L51)
3. **Audit**: Auditing nodes check to confirm that the value submitted was the string "Hello, World!". This can be found in [`Audit.validateNode()`](./hello-world/task/audit.js#L11)
4. **Distribution**: A bounty per round (set in `config-task.yml`, which we'll discuss later) is distributed equally among all successful submissions for the round. This can be found in [`Distribution.generateDistributionList()`](./hello-world/task/audit.js#L50)

Next, let's take a look at the Desktop Node. [Part II: Introduction to the Node](./PartII.md)
