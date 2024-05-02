# Part III. Dockerized Node Testing

You've successfully written your own networking task, now it's time to test it locally!

Prerequisites:

- Completed upnp-task template
- Basic understanding of Docker
- Koii CLI installed
- Docker and Docker Compose installed

Testing tasks locally through Docker is a process that requires a little set up. Essentially, we have to create a local version of the backend that's used to verify a task's work, which is known as K2. After creating our local K2, we'll deploy the task there for testing!

## Environment Setup

1. Before starting, please ensure your Koii Node app is **NOT** running! To get a local instance of K2, run `koii-test-validator` and leave the terminal running. This will serve as the backend you deploy the task to.

2. Next, we should set your Koii CLI to deploy tasks locally. We can do this using:

```
koii config set --url localhost
```

Verify you're using the correct settings with `koii config get`, which should show something like this:

```
Config File: C:\Users\test\.config\koii\cli\config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: ~/.config/koii/id.json
Commitment: confirmed
```

3. With the backend taken care of, lets make sure our task wants to deploy to the right environment. Within `env.local`, ensure you change `K2_NODE_URL` to point to the right endpoint:

```javascript
K2_NODE_URL = "http://127.0.0.1:8899"; //Linux

K2_NODE_URL = "http://host.docker.internal:8899"; //Windows & Mac
```

4. With that setup, we can deploy the task using `npx @_koii/create-task-cli@latest`. If you forgot how, [click here!](https://docs.koii.network/develop/command-line-tool/create-task-cli/create-task)

NOTE: If you're worried about rent costs, keep in mind that this is a local environment that doesn't reflect your actual wallet. In fact, if you use the command `koii airdrop 10000` you can give yourself plenty of tokens to test with!

5. Now that your task is live, note down the taskID and executable CID. Place your taskID in your `.env.local` as shown below:

```
TASKS="hLt4w79EqmMeWj6FNZKgkf4ZqYWaMWUpSNxnPzvnwHL" //Your task's ID
```

6. If you've previously deployed your task, you'll need to navigate to the `dist` folder and rename `main.js` to `<YOUR CID>.js`. In this case, your CID is the executable's CID you saved!

## Using Docker

Once the task is deployed, we can finally use Docker! Navigate to `docker-compose.yaml` and verify that `~/.config/koii:/app/config` accurately represents your wallet location.

Finally, in a separate terminal from the one running `koii-test-validator`, run `docker compose up` and you'll have a Dockerized instance of your task spun up!

This terminal will now showcase all the logs in real time that you could expect from deploying your task live on the Node. You can observe rounds, submissions, errors, warnings, or anything else you find interesting!

If you ran into any issues or want to understand this topic more in depth, learn more about [Dockerized Tasks here!](https://docs.koii.network/develop/write-a-koii-task/task-development-kit-tdk/test/docker-test)

<br>
<br>

You've reached the end of this lesson which means you're now familiar with building tasks that can network. Additionally, you now know how to test them locally with Docker! The next lesson will introduce using secrets and building our very own web crawler.

[Click here to start Lesson 3](../Lesson%203/README.md)
