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
  value: 'VALUE'
  description: 'It could be your name, your username,'
- type: ADDON
  value: 'REQUIRE_INTERNET'
- type: CPU
  value: '4-core'
```

If you are writing your own UPnP task, make sure to add this to your `config-task.yml`.

### Create Routes: Your Node as a Server

Head to the `routes.js` file. If you are in the `before` folder, you should see a `setupRoutes()` function with a task state endpoint:

```javascript
function setupRoutes(app) {
  app.get('/taskState', async (req, res) => {
   // Example endpoint; returns task state
    const state = await namespaceWrapper.getTaskState();
    console.log('TASK STATE', state);
    res.status(200).json({ taskState: state });
  });
}

module.exports = setupRoutes;
```

There are two ways you can access this endpoint when the task is running on your node:

1. Visit `http://localhost:30017/task/<taskID>/taskState`
2. Check the task logs. When the task starts, there will be an entry in the logs noting which port the task is running on. You can then view the endpoint by visiting `http://localhost:<port>/taskState`

The endpoints you define in `routes.js` will dictate what kinds of communications can occur between your device and another. Let's create a simple mechanism for passing basic data between two nodes. Below the example endpoint provided in `routes.js`, paste in this code snippet:

```javascript
  app.get('/value', async (req, res) => {
    const value = process.env.VALUE;
    console.log('value', value);
    res.status(200).json({ value: value });
  });
```

This creates a `/value` endpoint that can be accessed as described above - but more importantly, this endpoint is accessible from other Nodes. This allows you to share the information for use by other nodes.

**Note**: You'll also need to add a 'VALUE' entry to your .env file for this to work when you run it. This value can be whatever you like.

### Access Endpoints: Your Node as a Client

With our own endpoints set up, we now need to make calls to other Node's endpoints and access their `value`s.

Find the `task/getData.js` file (it should be empty). Add the following code:

```javascript
class getData {
  async getAddressArray() {
  try {
    // get the task state from K2 (the Koii blockchain)
    const taskState = await namespaceWrapper.getTaskState();

    // get the list of available IP addresses from the task state
    // nodeList is an object with key-value pairs in the form stakingKey: ipAddress
    const nodeList = taskState.ip_address_list;

    // return just the IP addresses
    return Object.values(IPAddressObj);
  } catch (e) {
    console.log('ERROR GETTING TASK STATE', e);
  }
  }

  async getRandomNodeEndpoint(IPAddressArray) {
   //  Choose a random index
    const randomIndex = Math.floor(Math.random() * IPAddressArray.length);
   //  Return the IP address stored at the random index position
    return IPAddressArray[randomIndex];
  }
}

module.exports = getData;
```

`getAddressArray()` grabs the list of IP addresses for all the users running this task. We'll be able to use this to grab the values they're serving on their nodes.

`getRandomNodeEndpoint()` takes the list of IP addresses and chooses one at random, return that node's value.

Next, we'll add the logic needed to execute the task.

Go to `task/submission.js` and find the `task()` function. Here you'll add the following code:

```javascript
async task(round) {
   try {
   console.log('ROUND', round);
   // Get a list of the available IP addresses
   const IPAddressArray = await getData.getAddressArray();

   try {
      // Get a random node from the list
      const randomNode = getData.getRandomNodeEndpoint(IPAddressArray);
      console.log('RANDOM NODE', randomNode);

      // Fetch the value from the random node
      const response = await axios.get(`${randomNode}/task/${TASK_ID}/value`);

      if (response.status === 200) {
         const value = response.data.value;
         console.log('VALUE', value);
         // Store the result in NeDB (optional)
         if (value) {
         await namespaceWrapper.storeSet('value', value);
         }
         // Optional, return your task for JEST testing purposes
         return value;
      } else {
         return null;
      }
   } catch (error) {
      console.log('ERROR IN FETCHING IP ADDRESS', error);
   }
   } catch (err) {
   console.log('ERROR IN EXECUTING TASK', err);
   return 'ERROR IN EXECUTING TASK' + err;
   }
}
```

You learned in [Lesson 1](../Lesson%201/README.md) that this is where the core logic for the task is located. In this case, we are grabbing the value from a particular Node's endpoint using the `getAddressArray()` and `getRandomNodeEndpoint()` functions we just defined.

### Auditing

The last thing we'll need to do is audit the results. Because the value can vary from node to node, we won't be able to check a specific value. Instead, we'll just confirm that the value is a string.

In `task/audit.js` find the `validateNode()` function:

```javascript
  async validateNode(submission_value, round) {
    let vote;
    console.log('SUBMISSION VALUE', submission_value, round);
    try {
      // Verify the value
      if ( /* EDIT HERE: Check the submission value */ ) {
        vote = true;
      } else {
        vote = false;
      }
    } catch (e) {
      console.error(e);
      vote = false;
    }
    return vote;
  }
```

and change the if condition as follows:

```javascript
if (typeof submission_value === 'string' && submission_value.length > 0) {
   ...
}
```

As a result of this basic setup, every Node can provide server endpoints to be reached, and call other Node's endpoints to fetch data, resulting in Node to Node communication!

### Testing

When developing your task, you'll want to iterate quickly, and having to deploy or launch the desktop node can be a hassle. We've provided a simple solution in the form of a testing script that will allow you to simulate rounds and test your task and audit functionality. The script is available in `testing/unitTesting.js` and you can run it via `yarn test`.

### Exercise

Now that you've seen how to create an endpoint and retrieve data from it, try it yourself! Create your own custom endpoint for a Node that sends a message to another Node. Remember to create a new route in `routes.js`, along with a new fetch request in the `task()` function from `submission.js`.

In the next section, we'll learn how to store and share files. [Click here to start Part III. File Storage & Sharing](./PartIII.md)
