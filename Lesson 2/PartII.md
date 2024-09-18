# Lesson 2: Networking and Storage Task

## Part II: Writing the Task

Now that you've got a basic understanding of how networking is done in the Node, it's time for deploy your own task that utilizes REST APIs!

Prerequisites:

- Understanding of UPnP
- Basic understanding of task template
- Knowledge on task deployment

### Initial Setup

Attached under this lesson is a skeleton template for a task in the [`upnp-basics/before`] folder. Try writing the task yourself; you can check the [`upnp-basics/after`] folder if you get stuck.

Much of the initial setup has been taken care of, but there is one thing to be aware of in the `config-task.yml`. We will discuss this file further in [Lesson 3](../Lesson%203/README.md) but we have specified the `REQUIRE_INTERNET` addon, as shown below:

```yml
requirementsTags:
  - type: TASK_VARIABLE
    value: "SECRET"
    description: "The secret you want to tell other nodes!"
  - type: ADDON
    value: "REQUIRE_INTERNET"
  - type: CPU
    value: "4-core"
```

If you are writing your own UPnP task, make sure to add this to your `config-task.yml`.

### Create Routes: Your Node as a Server

Head to the `routes.js` file. If you are in the `before` folder, you should see a `setupRoutes()` function with a task state endpoint:

```javascript
function setupRoutes(app) {
	app.get("/taskState", async (req, res) => {
		// Example endpoint; returns task state
		const state = await namespaceWrapper.getTaskState();
		console.log("TASK STATE", state);
		res.status(200).json({ taskState: state });
	});
}

module.exports = setupRoutes;
```

There are two ways you can access this endpoint when the task is running on your node:

1. Visit `http://localhost:30017/task/<taskID>/taskState`
2. Check the task logs. When the task starts, there will be an entry in the logs noting which port the task is running on. You can then view the endpoint by visiting `http://localhost:<port>/taskState`. Note that this port changes periodically; it's better to use the first option.

The endpoints you define in `routes.js` will dictate what kinds of communications can occur between your device and another. Let's create a simple mechanism for passing basic data between two nodes. Below the example endpoint provided in `routes.js`, paste in this code snippet:

`routes.js` already has a `/value` endpoint that can be accessed as described above - but more importantly, this endpoint is accessible from other Nodes. This allows you to share the information for use by other nodes.

Try one yourself! Add another endpoint called `/secret`. Save a secret word or phrase of your choice (maximum 512 bytes) in your `.env` file with the key `secret` and return a JSON response `{ secret: <your_secret> }`. (Answer in `upnp-basics/routes.js`)

### Access Endpoints: Your Node as a Client

With our own endpoint set up, we now need to make calls to other Nodes' endpoints and access their secrets.

We've provided a file called `upnpUtils.js` in the `upnp-basics/task` folder; you can use these functions to get a random node's IP address.

`getAddressArray()` grabs the list of IP addresses for all the users running this task. `getRandomNodeEndpoint()` takes the list of IP addresses and chooses one at random, return that node's value.

In your task function, get a random node and retrieve its secret, then save it to the local DB with the key `secret`. (Answer in `upnp-basics/task/1-task.js`)

In your submission function, get the secret from the local DB and return it. (Answer in `upnp-basics/task/2-submission.js`)

### Auditing

The last thing we'll need to do is audit the results. Because the value can vary from node to node, we won't be able to check a specific value. Instead, we'll just confirm that the value is a string.

In your audit function, return a boolean value: `true` if the value is a non-empty string, `false` otherwise. This is your node's vote; it will be combined with all other votes on this submission to decide if it's valid or not. (Answer in `upnp-basics/task/3-audit.js`)

> [!WARNING]
>
> This is not a very good audit! A node could easily pass audit without accessing another node by just submitting any non-empty string. We'll look at ways to write better audits in a later lesson.

As a result of this basic setup, every Node can provide server endpoints to be reached, and call other Node's endpoints to fetch data, resulting in Node to Node communication!

In the next section, we'll learn how to store and share files. [Part III. File Storage & Sharing](./PartIII.md)
