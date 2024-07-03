# Testing Your Task Quick Reference

## unitTest.js

We've provided a simple testing script that will allow you to simulate rounds and test your task and audit functionality. The script is available in `testing/unitTesting.js` and you can run it via

```sh
yarn unitTest
```

## prod-debug.js

If you would like to test integration with the desktop node, you can add the task to the desktop node using the 'Advanced' option under the Add Task list (if you have not yet deployed your task, you can use the EZ Testing Task ID supplied in the task template) and then run

```sh
yarn prod-debug
```

You will then be able to run your task in your desktop node and log debugging information to your console by adding `process.env.TEST_KEYWORD` to your console logs.

## Deploying Locally with Docker

Configure the Koii CLI to use a local validator:

```sh
koii config set --url http://127.0.0.1:8899
```

You can confirm this was successful with

```sh
koii config get
```

which should show that the RPC and Websocket URLs are using localhost:

```sh
Config File: C:\Users\test\.config\koii\cli\config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: ~/.config/koii/id.json
Commitment: confirmed
```

Because this is a local environment, the tokens are not real. You can easily add to your balance to gain tokens for test deployments with

```sh
koii airdrop <amount>
```

Run

```sh
npx @_koii/create-task-cli@latest
```

to begin the [deployment](./deployment.md) process.

You will receive a task ID and an executable CID. Note these down and update your `.env.local` with your new task ID.

If you've previously deployed your task, you'll need to navigate to the `dist` folder and rename `main.js` to `<executable_cid>.js`

Update your wallet location in `docker-compose.yaml` if necessary.

In one terminal window run

```sh
koii-test-validator
```

and in a second run

```sh
docker compose up
```

You now have a Dockerized instance of your task running locally and your terminal will display all the logging information you would normally find in the task log file.
