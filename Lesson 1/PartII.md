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

### Install Yarn

While you can use NPM or another package manager of your choice, we have found NPM causes issues for some people, so we recommend [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/), and use it in all the EZSandbox instructions. Installing it is simple:

```sh
npm install --global yarn
```

### Debugging Your First Task

We will overwrite the task executable with our local copy, so we can change the code and see the results. This is simple with the `prod-debug` tool that is provided.

1. First, clone the [task template repository](https://github.com/koii-network/task-template). This repo contains the code needed to build a task executable.

Copy the `.env.example` file and rename it to `.env`. It has already been set up with the environment variables you need.

```sh
cp .env.example .env
```

Run

```sh
yarn
```

to install the necessary dependencies, then run

```sh
yarn prod-debug
```

to start the live debugger.

### Adding Debug Logs

Open the `src/task` folder and we'll start hacking through some files. To see the task flow in action you'll want to add some log statements to each of the recurring functions that run each round.

In each case, navigate to the correct file then paste the code lines that have been supplied into each function. If you run into any difficulties, the completed code is available in `ez-testing-task/task`.

We have pre-configured the `TEST_KEYWORD` environment variable to "TEST". Change this to whatever you'd like.

> [!TIP]
>
> You may need to wait a minute while the task starts up before you see any logging.

a. Task:

- File Name: `1-task.js`
- Code: `console.log("Started Task", new Date(), "TEST")`

b. Submission:

- File Name: `2-submission.js`
- Code: `console.log("Started Submission", new Date(), "EZ TESTING")`

c. Audit:

- File Name: `3-audit.js`
- Code: `console.log("Started Audit", new Date(), "EZ TESTING")`

d. Distribution:

- File Name: `4-distribution.js`
- Code: `console.log("Started Distribution", new Date(), "TEST")`

As you save each file, the task executable will be rebuilt and you should see the debugger restart. If you check your desktop node, you'll also see a message that the task has changed.

Once all changes have been made, locate the EZ Testing Task in your node and press the play button to restart the task with the new executable file.

Now, wait and watch the logs to see the console logs you just added. All the output for the task will be shown in your terminal, and any lines containing a watched keyword will be colored magenta to make them easier to spot.

### Accessing Your Node

By using UPnP (Universal Plug and Play), each node can expose Express.js endpoints in the `src/routes.js` file. We will cover UPnP and how to make and access endpoints within tasks in the next lesson, but we have defined a couple already, so you can see them on your node.

Any endpoints running on your node are located at `http://localhost:30017/task/{taskID}/{endpoint}`.

You can find the task ID for the EZ Testing Task in your `.env` file. With the EZ Testing Task running, visit the `value` endpoint. You should see

```json
{ "value": "Hello, World!" }
```

You can also visit the `taskState` endpoint to see information about the task.

Now that we've run a task and done some debugging, let's learn a bit more about what it's doing. [Part III](./PartIII.md)
