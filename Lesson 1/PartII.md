# Lesson 1: Introduction to Koii Tasks

## Part II: Debugging a Task

### Prerequisites

- [Part I](./README.md) complete
- [Node.js](https://nodejs.org/en/download/package-manager) installed

### The Task Executable

When you add a task to your node, a Task Executable will be downloaded. This is a JavaScript file that contains all the code needed to run the task. When you deploy a task to the Koii network, you will build a Task Executable and receive a task ID. We'll walk through that process at the end of this lesson, but to get started quickly, we're going to use an existing task that has already been deployed for us. This is the `EZ Testing Task`, which you should have added to your Node in [part I](./README.md#run-the-task). Because we have already added it to the Node, its executable has been downloaded.

> [!TIP]
>
> **Why EZ Testing Task?**
>
> We have deployed EZ Testing Task and provided its task ID to get you up and running quicker. In later lessons, we'll talk about how to deploy your own task; if you'd prefer to jump ahead and do that now

### Debugging Your First Task

To run live debugging on a task, we'll use the `prod-debug` tool. This will build a local task executable that will be overwrite the EZ Testing Task's downloaded executable, allowing us to change the code and see the results.

First, clone this repository and navigate to the `Lesson 1/EZ-testing-task/` directory. This folder contains the code needed to build a task executable.

Copy the `.env.example` file and rename it to `.env`. It has already been set up with the environment variables you need.

Run

```sh
npm install
```

to install the necessary dependencies, then run

```sh
npm run prod-debug
```

to start the live debugger.

### Adding Debug Logs

Open the `EZ-testing-task/task` folder and we'll start hacking through some files. To see the task flow in action you'll want to add some log statements to each of the recurring functions that run each round.

In each case, navigate to the correct file within the `task` directory, then find the target function and paste the code lines that have been supplied.

We have pre-configured the `TEST_KEYWORD` environment variable to "TEST". Change this to whatever you'd like.

a. Task:

- File Name: `submission.js`
- Function: [`task()`](./EZ-testing-task/task/submission.js#L9)
- Code: `console.log('Started Task', new Date(), process.env.TEST_KEYWORD)`

b. Submission:

- File Name: `submission.js`
- Function: [`fetchSubmission()`](./EZ-testing-task/task/submission.js#L51)
- Code: `console.log('Started Submission', new Date(), process.env.TEST_KEYWORD)`

c. Audit:

- File Name: `audit.js`
- Function: [`validateNode()`](./EZ-testing-task/task/audit.js#L11)
- Code: `console.log('Started Audit', new Date(), process.env.TEST_KEYWORD)`

d. Distribution:

- File Name: `distribution.js`
- Function: [`generateDistributionList()`](./EZ-testing-task/task/distribution.js#L50)
- Code: `console.log('Started Distribution', new Date(), process.env.TEST_KEYWORD)`

As you save each file, the task executable will be rebuilt and you should see the debugger restart. If you check your desktop node, you'll also see a message that the task has changed.

Once all changes have been made, locate the EZ Testing Task in your node and press the play button to restart the task with the new executable file.

Now, wait and watch the logs to see the console logs you just added. They should be printed in the output of your terminal.

### Accessing Your Node

By using UPnP, each node can expose [Express.js endpoints](https://github.com/labrocadabro/ezsandbox/blob/725f274bbdfa923fe0bae64c70e08c1e03c5f379/Lesson%201/EZ-testing-task/index.js#L13). We will cover UPnP and how to make and access endpoints within tasks in the next lesson, but we have defined a couple already, so you can see them on your node.

Any endpoints running on your node are located at `http://localhost:30017/task/{taskID}/{endpoint}`

With the EZ Testing Task running, visit [http://localhost:30017/task/AK2P1L8NWGwWarbHeM7tX2mr4hJA7ZVXGSSSz5PWHBHv/value](http://localhost:30017/task/AK2P1L8NWGwWarbHeM7tX2mr4hJA7ZVXGSSSz5PWHBHv/value). You should see

```json
{"value":"Hello, World!"}
```

You can also visit [http://localhost:30017/task/AK2P1L8NWGwWarbHeM7tX2mr4hJA7ZVXGSSSz5PWHBHv/taskState](http://localhost:30017/task/AK2P1L8NWGwWarbHeM7tX2mr4hJA7ZVXGSSSz5PWHBHv/taskState) to see information about the task.

Now that we've run a task and done some debugging, let's learn a bit more about what it's doing. [Part III](./PartIII.md)
