# Lesson 1: Introduction to Koii Tasks

## Part II: Introduction to the Node

The big advantage of building with Koii is that our community of node operators are already prepared and eager to join your new project. Node operators run their Node in the background on personal devices, so they can use excess capacity to run your app. To understand how this process works, let's take a look at the node software.

### Install Your Node

In order to run a task, you'll need to have the Desktop Node installed. Visit [the Koii website](https://koii.network) to download the client and install the node. Follow the prompts to get set up, and get some free tokens from the [faucet](https://faucet.koii.network/) while you're at it. ([1m tutorial video](https://www.youtube.com/watch?v=n2pvrSl01FI&t=1s)). Once your node is running, you can test your web server in the browser by visiting [`http://localhost:30017/tasks`](http://localhost:30017/tasks).

### The Node Application Folder

To see where the node keeps logs about a specific task, click any of the tasks in your Node and select 'View Logs' as shown below:
![Open the logs file](./imgs/my-node-open-logs.png)

The path to your logs will be
`<OS-specific path>/KOII-Desktop-Node/namespace/6iRsCfmqdi7StUGCkbvZXwdxwmAd6txPwupAE76yF67F/task.log`

On Windows, the first part of your path will look something like this:
`/Users/<username>/AppData/Roaming`

On Mac, it would look something like this:
`/Users/<username>/Library/Application Support`

And on Linux, it would look something like this:
`/home/<username>/.config`

The parent directory for your node is up a couple of folders:
`<OS-specific path>/KOII-Desktop-Node`

This parent folder contains a couple of key items, which we will mostly work with from a distance.

```bash
KOII-Desktop-Node % tree -d -L 2./
.
├── executables
├── logs
├── namespace
│   ├── 2H6BDyQrDZp7WgkPB8c29nAKRwgrZjU29ovLUipNUWLy
│   ├── 6GPu4gqQycYVJxw2oXK1QkkqXgtF9geft1L7ZHoDP4MQ
│   ├── 6iRsCfmqdi7StUGCkbvZXwdxwmAd6txPwupAE76yF67F
│   ├── CXjifqMWhR4QJT8MNY7BADJ5nstCbGLTgh7xreT9gmWp
│   ├── DZbRm6qRxy5ERPD61RHhVcS2sFootJ5fzSTWrzgoQmhf
│   ├── Gp2BcsuGgrvcEux3NER3fdtkjWQADY6S2h23c27HTAQ3
│   └── wJme8ZBopdCj54J556AxZeysBjDngnFbzDrKtJHg3E4
├── updater-cache
│   └── desktop-node-updater
└── wallets

14 directories
```

The key here is that each 'namespace' contains one Task, and all requisite logs, databases, and other information are stored here. Tasks cannot access anything outside of their own namespace, so master logs are kept at the node level as well (`<OS-specific path>/KOII-Desktop-Node/logs/main.log`).

### Logs

Before you learn how to develop your own tasks, it's very important to know how to **debug** them.

> _"Give a man a fish and you feed him for a day. Teach him how to fish and you feed him for a lifetime"_

Logs are the bread and butter of tasks and can give you all sorts of information on what's really going on under the hood.

For example, try running `tail -f main.log` and then clicking some buttons in the node (i.e. Play and Pause Tasks). You'll immediately see the logs update in real time.

**NOTE:** Make sure your terminal is in the [`logs`](#the-node-application-folder) directory!

Now that you've had a look at the node, let's run your first task! [Part III: Running a Task](./PartIII.md)
