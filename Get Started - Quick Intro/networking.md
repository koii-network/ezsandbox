# Networking Quick Reference

## Configuration

Koii nodes use UPnP for node-to-node communication. This is disabled by default and must be activated by the user, so fewer nodes will be available for these tasks. In order to identify users that can perform these tasks, add `REQUIRE_INTERNET` to your `requirementTags` in `config-task.yml`:

```yml
requirementsTags:
- type: ADDON
  value: 'REQUIRE_INTERNET'
```

## Serving Endpoints

Endpoint routes can be added to index.js. Two are already defined in the task template:

```js
if (app) {
  //  Write your Express Endpoints here.
  //  Ex. app.post('/accept-cid', async (req, res) => {})

  // Sample API that return your task state
  app.get('/taskState', async (req, res) => {
    const state = await namespaceWrapper.getTaskState({
      is_stake_list_required: true,
    });
    console.log('TASK STATE', state);
    res.status(200).json({ taskState: state });
  });

  // Sample API that return the value stored in NeDB
  app.get('/value', async (req, res) => {
    const value = await namespaceWrapper.storeGet('value');
    console.log('value', value);
    res.status(200).json({ value: value });
  });
}
```

You can access endpoints like so when you are running `prod-debug`: `http://localhost:30017/task/<taskID>/<endpoint>`

## Accessing Endpoints from Other Nodes

To access other nodes' endpoints, you can access the list of IP addresses currently running the task, then choose which nodes you will access. In this example, we're selecting a single random node:

```javascript
async function getAddressArray() {
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

async function getRandomNodeEndpoint(IPAddressArray) {
  // choose a random index
  const randomIndex = Math.floor(Math.random() * IPAddressArray.length);
  //  Return the IP address stored at the random index position
  return IPAddressArray[randomIndex];
}
```

You can access the endpoint(s) you've chosen during the task or audit phases

```javascript
// Get a random node from the list
const IPAddressObj = getAddressArray();
const randomNode = getRandomNodeEndpoint(IPAddressObj);

// Fetch the data from the node
const response = await axios.get(`${randomNode}/task/${TASK_ID}/<endpoint>`);

if (response.status === 200) {
  const data = response.data;
} else {
  return null;
}
```
