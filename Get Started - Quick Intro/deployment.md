# Deployment Quick Reference

Before deploying your task, you can apply for our [grant program](https://www.koii.network/founders) that can help you out with initial funding.

1. Make sure all dependencies are installed:

```sh
npm install
```

2. Build the executable:

```sh
npm run webpack
```

3. Run the create task CLI:

```sh
npx @_koii/create-task-cli@latest
```

4. Choose "Deploy a New Task".

5. At this point you will be asked how you'd like to configure your task, via the CLI or the config YML. We recommend using the YML file.

6. Enter the path to your staking wallet. If you have installed the desktop node, visit `<OS-specific path>/KOII-Desktop-Node/namespace/` and you should see a file with the name `<name>stakingWallet.json`. Enter the full path to this file (`<OS-specific path>/KOII-Desktop-Node/namespace/<name>stakingWallet.json`).

The OS-specific paths are as follows:

**Windows**: `/Users/<username>/AppData/Roaming`

**Mac**: `/Users/<username>/Library/Application Support`

**Linux**: `/home/<username>/.config`

7. Press 'y' to confirm you would like to deploy the task.

Once your task is deployed, you will have to apply to have it [whitelisted](https://docs.koii.network/develop/write-a-koii-task/task-development-guide/task-development-flow/whitelist-task) if you would like your task to be listed in the desktop node's Add Task list.
