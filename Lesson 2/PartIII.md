# Lesson 2: Networking and Storage Task

## Part III: File Storage & Sharing

Now that we've seen how communication works between nodes, let's try something a little different: working with files.

### IPFS

Koii uses IPFS (the InterPlanetary File System) to store data outside of its blockchain. This helps keep transactions fast and cost-effective. We have developed the [Koii Storage SDK](https://www.npmjs.com/package/@_koii/storage-task-sdk) so you can easily upload and retrieve files, and this lesson will go over how to use it.

### Uploading a File

To begin, clone the [task template repo](https://github.com/koii-network/task-template). Since we're going to be using the Koii Storage SDK for IPFS, we'll need to add this to the package.json:

```sh
yarn add @_koii/storage-task-sdk
```

This time, instead of having an endpoint that directly shares a value, we'll add the value to a file and upload it to IPFS. When the upload is successful, you'll receive a content identifier (CID) that can be used to retrieve the file later.

We've provided [some useful utility functions](./file-sharing/task/fileUtils.js) for working with IPFS.

In your task function, get a value from your `.env` file (don't forget to add the variable to your `config-task.yml` if you're going to deploy the task). and save it to a file on IPFS, then save the CID to your local DB. ([Answer here](./file-sharing/task/1-task.js))

### Submitting

This is very similar to the previous submissions you've done; see if you can work out what you need to do! ([Answer here](./file-sharing/task/2-submission.js))

### Retrieving a file

We've provided the necessary functions to get the file content, make use of them to validate the file content. Just like in the UPnP lesson, check if the value is a string and is not empty. ([Answer here](./file-sharing/task/3-audit.js))

> [!WARNING]
>
> Like the UPnP task, this is a poor audit. In particular, if a user uploads a file that isn't text, or if they provide an invalid CID, we simply let an error be thrown and don't vote on their submission, but it would be more appropriate to vote false.
> However, voting false to every error isn't an ideal solution either - if, for example, a node has network issues and can't retrieve the file from IPFS, it could end up voting false when it shouldn't.

And that's it! You've successfully written a task that uses IPFS to store data.

Next up, we'll take a look at secrets and the config options in [Lesson 3](../Lesson%203/README.md).
