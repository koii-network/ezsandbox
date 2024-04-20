# Part II: Task Flow

Now that your node is up and running, you'll want to start by getting the feel for the logs.

## Debugging 
### Logs
For example, try tail'ing the logs file and then clicking some buttons in the node (i.e. Play and Pause Tasks). You'll immediately see the logs.

i.e. `tail -f main.log`

### AutoBuild
To make building you task as easy as possible, you can use the autobuild module to build your Task Executable and copy it into your Node. 

To configure the module, open .env.sample and update the template to point to the correct Task Node folder (get the url in the last lesson). 

By default, you can just run `yarn debug` inside the `project/` directory and your task will be rebuilt and copied to the correct folder in your node.

## Task Flow
Tasks run in round-based cycles, similar to Epochs in a Proof-of-History flow. 

Tasks include two kinds of programs:
1. Continuous: These run like a normal server, and start whenever the Task reboots
    a. REST APIs
    b. Databases
    c. Utility Modules

2. Cyclical: These run once per round (you'll set the `round_time` when you deploy later on)
    a. Governance Functions
    b. Timed Workloads like Replication 

### Debugging Flow
First, we'll add some debug logs, and then we can watch how these functions run over time.

Open the `project/` folder again and we'll start hacking through some files. Open `project/corelogic.js` to get started.

1. Start the Debugger
`yarn prod-debug`

2. Add Debugs to Cyclical Functions
Now, to see the task flow in action you'll want to add some comments to each of the recurring functions that run each round.

In each case, find the target function in `corelogic.js` and paste the line shown. 
  a. The Core Task: `task()` 
        `console.log('Started Task', new Date(), process.env.KEYWORD )`

  b. The Audit Function: `validateNode()`
        `console.log('Started Audit', new Date(), process.env.KEYWORD )`

  c. Generate Proofs: `fetchSubmission()`
        `console.log('Started Submission Phase', new Date(), process.env.KEYWORD )`

  d. Assign Rewards: `generateDistributionList()`
        `console.log('Started Distribution', new Date(), process.env.KEYWORD )`

As you save each file, you should see the debugger restart. 

Once all changes have been made, locate the EZSandbox task in your node and press the play/pause button twice to ensure it picks up the new executable file.

Now, wait and watch the logs to see the tags you just added. They should be printed in the output of your `yarn debug` command.

In the next section, we'll talk about what the output here means. 

[Click here to start PartIII: Consensus](./PartIII.md)


