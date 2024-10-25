# Lesson 2: Networking and Storage Task

## Part II: Writing the Task

Now that you've got a basic understanding of how networking is done in the Node, it's time for deploy your own task that utilizes REST APIs!

Prerequisites:

- Understanding of UPnP
- Basic understanding of task template
- Knowledge on task deployment

### Initial Setup

Clone the [task template repo](https://github.com/koii-network/task-template) to get started. We'll walk you through how to edit the template files for this task.

In order to enable node to node communication, we must edit the `config-task.yml`. We will discuss this file further in [Lesson 3](../Lesson%203/README.md) but for now, just add the `REQUIRE_INTERNET` addon and a `SECRET` variable as shown below:

```yml
requirementsTags:
  - type: TASK_VARIABLE
    value: "SECRET"
    description: "The secret you want to tell other nodes!"
  - type: ADDON
    value: "REQUIRE_INTERNET"
```

See [`upnp-basics/config-task.yml`](./upnp-basics/config-task.yml) if you're stuck.

### Create Routes: Your Node as a Server

Head to the `src/routes.js` file in the task template. You should see a `setupRoutes()` function with an example endpoint:

```javascript
export async function setupRoutes(app) {
  if (app) {
    app.get("/value", async (_req, res) => {
      const value = await namespaceWrapper.storeGet("value");
      console.log("value", value);
      res.status(200).json({ value: value });
    });
  }
}
```

This endpoint is accessible from other Nodes, allowing you to share the information for use by other nodes.

There are two ways you can access this endpoint when the task is running on your node:

1. Visit `http://localhost:30017/task/<taskID>/value`
2. Check the task logs. When the task starts, there will be an entry in the logs noting which port the task is running on. You can then view the endpoint by visiting `http://localhost:<port>/value`. Note that this port changes periodically; it's better to use the first option.

The endpoints you define in `routes.js` will dictate what kinds of communications can occur between your device and another. Let's create a simple mechanism for passing basic data between two nodes.

Try one yourself! Change the endpoint to `/secret`. Save a secret word or phrase of your choice (maximum 512 bytes) in your `.env` file with the key `secret` and return a JSON response `{ secret: <your_secret> }`. ([Answer here](./upnp-basics/src/task/5-routes.js))

### Access Endpoints: Your Node as a Client

With our own endpoint set up, we now need to make calls to other Nodes' endpoints and access their secrets.

We've provided a file called [`upnpUtils.js`](./upnp-basics/src/task/upnpUtils.js); you can use these utility functions to help you work with other nodes.

`getAddressArray()` grabs the list of IP addresses for all the nodes running this task. `getRandomNodeEndpoint()` takes the list of IP addresses and chooses one at random, return that node's value.

In your task function, get a random node and retrieve its secret, then save it to the local DB with the key `secret`. ([Answer here](./upnp-basics/src/task/1-task.js))

### Submitting

In your submission function, get the secret from the local DB and return it. ([Answer here](./upnp-basics/src/task/2-submission.js))

### Auditing

The last thing we'll need to do is audit the results. Because the value can vary from node to node, we won't be able to check a specific value. Instead, we'll just confirm that the value is a string.

In your audit function, return a boolean value: `true` if the value is a non-empty string, `false` otherwise. This is your node's vote; it will be combined with all other votes on this submission to decide if it's valid or not. ([Answer here](./upnp-basics/src/task/3-audit.js))

> [!WARNING]
>
> This is not a very good audit! A node could easily pass audit without accessing another node by just submitting any non-empty string. We'll look at ways to write better audits in a later lesson.

> [!IMPORTANT]
> In order to test this task, you must set `SECRET` in your .env file

With this simple setup, every Node can provide server endpoints to be reached, and call other Node's endpoints to fetch data, resulting in Node to Node communication!

In the next section, we'll learn how to store and share files. [Part III. File Storage & Sharing](./PartIII.md)
