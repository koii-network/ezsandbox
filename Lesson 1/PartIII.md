# Lesson 1: Introduction to Koii Tasks

## Part III: How Do Koii Tasks Work?

### The Basics

In the previous lesson, we added 4 console logs for Task, Submission, Audit, and Distribution. These are the four main parts of a Koii task:

1. Do the work (task)
2. Submit the results (submission)
3. Verify the work (audit)
4. Distribute rewards and penalties (distribution)

This ensures that each node operator has an incentive to act honestly and perform the task correctly. Their work will be checked, and if they don't perform the task correctly, they will not only miss out on rewards, they could lose some or all of their staked KOII.

When writing a task, you're able to customize each step: what work you want done, what should be submitted as proof, how that proof should be checked, and what rewards and penalties you want to set.

![Runtime flow](./imgs/gradual-consensus.png)

> [!TIP]
>
> For a more in-depth explanation of how Koii Tasks run, see our docs on [runtime flow and gradual consensus](https://docs.koii.network/concepts/what-are-tasks/what-are-tasks/gradual-consensus).

Now let's see how runtime flow works in the EZ Testing example.

### Example

#### Do the Work (task)

**File:** `src/task/1-task.js`
**Action:** This task simply saves the string "Hello, World!" to the local database

#### Submit Proofs (submission)

**File:** `src/task/2-submission.js`
**Action:** In this case, we are fetching the string from the local database and submitting it on-chain as our proof. Note that in a real task, we would usually have more complex proofs that cannot be submitted directly. We will discuss how to deal with that in later lessons.

#### Review Proofs (audit)

**File:** `src/task/3-audit.js`
**Action:** Here we are verifying whether the submission is the string "Hello, World!"

#### Distribute Rewards

**File:** `src/task/4-distribution.js`
**Action:** Rewards are distributed to each node that completed the work. Here we are penalizing incorrect submissions by removing 70% of their stake and equally distributing the bounty per round to all successful submissions.

### Alternate Testing

When developing your task, you'll want to iterate quickly, and having to deploy a task or launch the desktop node can be a hassle. We've provided a simple solution in the form of a testing script that will allow you to simulate rounds and test your task functionality. The script is available in `tests/simulateTask.js` and you can run it via `yarn test`. There are three optional command line arguments you can use. The first is the number of rounds you want to run the task (default is 1); the second is the delay between rounds, in ms (default is 5000); and the third is the delay between individual steps in a round, in ms (default is 1000).

Now that we've seen how tasks work, let's deploy one. [PartIV](./PartIV.md)
