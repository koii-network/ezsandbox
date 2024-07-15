# Lesson 1: Introduction to Koii Tasks

## Part III: How Do Koii Tasks Work?

### The Basics

In the previous lesson, we added 4 console logs for Task, Submission, Audit, and Distribution. These are the four main parts of a Koii task:

1. Do the work
2. Submit the results
3. Verify the work
4. Distribute rewards and penalties

This ensures that each node operator has an incentive to act honestly and perform the task correctly. Their work will be checked, and if they don't perform the task correctly, they will not only miss out on rewards, they could lose some or all of their staked KOII.

When writing a task, you're able to customize each step: what work you want done, what should be submitted as proof, how that proof should be checked, and what rewards and penalties you want to set.

![Runtime flow](./imgs/gradual-consensus.png)

> [!TIP]
>
> For a more in-depth explanation of how Koii Tasks run, see our docs on [runtime flow and gradual consensus](https://docs.koii.network/concepts/what-are-tasks/what-are-tasks/gradual-consensus).

Now let's see how runtime flow works in the EZ Testing example.

### Example

#### Do the work

[`Submission.task()`](./EZ-testing-task/task/submission.js#L9).

This task simply [saves the string "Hello, World!" to the local database](./EZ-testing-task/task/submission.js#L15)

#### Submit Proofs

[`Submission.fetchSubmission()`](./EZ-testing-task/task/submission.js#L51) and [`Submission.sendTask()`](./EZ-testing-task/task/submission.js#L31).

In this case, we are [fetching the string from the local database](./EZ-testing-task/task/submission.js#L54) and [submitting it](./EZ-testing-task/task/submission.js#L37).

#### Review Proofs

[`Audit.validateNode()`](./EZ-testing-task/task/audit.js#L3).

Here we are [verifying whether the submission is the string "Hello, World!"](./EZ-testing-task/task/audit.js#L16).

#### Distribute Rewards

Inside [`Distribution.generateDistributionList()`](./EZ-testing-task/task/distribution.js#L89).

Rewards are distributed to each node that completed the work. Here we are penalizing incorrect submissions by [removing 70% of their stake](./EZ-testing-task/task/distribution.js#L123) and [equally distributing the bounty per round to all successful submissions](./EZ-testing-task/task/distribution.js#L140).

Now that we've seen how tasks work, let's deploy one. [PartIV](./PartIV.md)
