# Lesson 1: Introduction to Koii Tasks

## Part III: Running a Task

### Setting Up Your First Task

Clone this repository and navigate to the `EZ-testing-task/` directory. This folder contains the code for running your first task.

In order to run a task, you need to build a Task Executable and copy it into your Node. To make this process as easy as possible, we have created the AutoBuild module to do this for you. By default, you can just run `yarn prod-debug` inside the task directory and your task will be rebuilt and copied to the correct folder in your node.

In this case, we have pre-configured the Hello World example to use the EZSandbox task ID. Later, when you want to run your own tasks, you'll learn how to get a unique task ID. You can configure the AutoBuild module by updating the task ID in  your .env file.

Please see [EZ-testing-task's README](./EZ-testing-task/README.md) for more information setting up the EZSandbox task.

### Add the Task to Your Node

If you have not already done so, make sure you [add the EZ Testing task to your node](./PartII.md#run-a-task).

### Your First Debugging

First, we'll add some debug logs, and then we can watch how these functions run over time.

Open the `EZ-testing-task/` folder again and we'll start hacking through some files. Open `EZ-testing-task/task` to get started.

1. Rename .env.example to .env.

2. Start the Debugger
   `yarn prod-debug`

3. Add Debugging logs.

Now, to see the task flow in action you'll want to add some log statements to each of the recurring functions that run each round.

In each case, navigate to the correct file within the `task` directory, then find the target function and paste the code lines that have been supplied.

.env.example has been pre-configured with the `TEST_KEYWORD` environment variable set to "TEST". Change this to whatever you'd like.

a. The Core Task:

- File Name: `submission.js`
- Function: `task()`
- Code: `console.log('Started Task', new Date(), process.env.TEST_KEYWORD )`

b. The Audit Function:

- File Name: `audit.js`
- Function: `validateNode()`
- Code: `console.log('Started Audit', new Date(), process.env.TEST_KEYWORD )`

c. Generate Proofs:

- File Name: `submission.js`
- Function: `fetchSubmission()`
- Code: `console.log('Started Submission Phase', new Date(), process.env.TEST_KEYWORD )`

c. Assign Rewards:

- File Name: `distribution.js`
- Function: `generateDistributionList()`
- Code: `console.log('Started Distribution', new Date(), process.env.TEST_KEYWORD )`

As you save each file, you should see the debugger restart.

Once all changes have been made, locate the EZSandbox task in your node and press the play/pause button twice to ensure it picks up the new executable file.

Now, wait and watch the logs to see the tags you just added. They should be printed in the output of your `yarn debug` command terminal.

Congratulations! You've now covered all the basics necessary to start writing a task of your own. [Lesson 2: Writing a Task](../Lesson%202/README.md)
