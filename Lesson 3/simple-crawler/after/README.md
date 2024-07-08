# Koii Simple Crawler

This is a simple web crawler that scavenges redflagdeals!

## How to Setup

1. Clone this repo
2. Run `npm install`
3. Run `npm test` to simulate rounds or `npm run prod-debug` for the live debugger

## Structure Breakdown

The task template contains three separate JavaScript files in the task folder that contain all of the functions for a Koii task to function properly.

```bash
📦simple-crawler
 ┣ 📂_koiiNode
 ┃ ┗ 📜koiiNode.js // Contains all the components that task connect to K2.
 ┣ 📂crawler
 ┃ ┗ 📜SimpleCrawlerTask.js // Contains web crawler logic
 ┣ 📂task
 ┃ ┣ 📜index.js // Main file that contains the task function.
 ┃ ┣ 📜submission.js // Contains the logic for using keyword for submissions.
 ┃ ┣ 📜audit.js // Contains the auditTask function.
 ┃ ┗ 📜distribution.js // Contains the submitDistributionList and auditDistribution function.
 ┣ 📂tests
 ┣ 📜config-task.yml
 ┣ 📜debugger.js
 ┣ 📜prod-debug.js // used for live debugging
 ┣ 📜coreLogic.js
 ┗ 📜index.js
```

## What's in the Template

### Core files

- index.js — is the hub of your app, and ties the other pieces together. This will be the entry point when your task runs on task nodes.

- \_koiiNode — is a directory that contains koiiNode.js which has the interfaces to make API calls to the core of the task node. It contains all the necessary functions required to submit and audit the work, as well as the distribution lists. Check [here](https://docs.koii.network/develop/write-a-koii-task/task-development-kit-tdk/using-the-task-namespace/the-namespace-object) to learn more about namespace functions.

### Task Directory

It houses three key files: submission.js, audit.js and distribution.js. These files are where you define your task, audit, and distribution logic, enabling you to control the core functionality of the task.

This structure allows a modular approach to task development. By only utilizing these three files, you can easily modify and test your task logic without having to worry about the other aspects. To understand the theory behind this, please refer to the
[Runtime Flow](https://docs.koii.network/concepts/gradual-consensus/runtime-flow).

Finally, in the index.js file, all these functions are combined as a task, which is then imported and used in corelogic.js. It is advisable to organize separate features into sub-files and import them into the relevant files before web-packing for better code management and maintainability. This modular approach allows for a more organized and efficient development process.

For more information about how to customize your own task, please check our docs [here](https://docs.koii.network/develop/write-a-koii-task/task-development-guide/introduction).
