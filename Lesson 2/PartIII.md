# Lesson 2: Writing a Networking & Storage Task

## Part III: File Storage & Sharing

Now that we've seen how communication works between nodes, let's try something a little different: working with files.

### IPFS

Koii uses IPFS (the InterPlanetary File System) to store data outside of its blockchain. This helps keep transactions fast and cost-effective. We have developed the [Koii Storage SDK](https://www.npmjs.com/package/@_koii/storage-task-sdk) so you can easily upload and retrieve files, and this lesson will go over how to use it.

### Uploading a File

This time, instead of having an endpoint that directly shares a value, we'll add the value to a file and upload it to IPFS.

First let's add the logic to store a file to IPFS. In `task/fileUtils/storeFile.js` add the following:

```javascript
const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const fs = require('fs');

async function storeFile(data, filename = 'value.json') {
  try {
    // Create a new instance of the Koii Storage Client
    const client = new KoiiStorageClient();
    const basePath = await namespaceWrapper.getBasePath();
    // Write the data to a temp file
    fs.writeFileSync(`${basePath}/${filename}`, JSON.stringify(data));

    // Get the user staking account, to be used for signing the upload request
    const userStaking = await namespaceWrapper.getSubmitterAccount();

    // Upload the file to IPFS and get the CID
    const { cid } = await client.uploadFile(`${basePath}/${filename}`,userStaking);

    console.log(`Stored file CID: ${cid}`);
    // Delete the temp file
    fs.unlinkSync(`${basePath}/${filename}`);

    return cid;
  } catch (error) {
    console.error('Failed to upload file to IPFS:', error);
    fs.unlinkSync(`${basePath}/${filename}`);
    throw error;
  }
}

module.exports = storeFile;
```

Next, let's use it in our task. We upload the file and save the CID in the local DB. In `task/submission.js`, edit your `task()` as follows:

```javascript
async task(round) {
  try {
    console.log('ROUND', round);
    const cid = await storeFile(process.env.VALUE);
    console.log('cid', cid);
    if (cid) {
      await namespaceWrapper.storeSet('cid', cid);
    }
    return cid;
  } catch (err) {
    console.log('ERROR IN EXECUTING TASK', err);
    return 'ERROR IN EXECUTING TASK' + err;
  }
}
```

Finally, we retrieve the CID from the local DB and send it as the submission value:

```javascript
async fetchSubmission(round) {
  console.log('FETCH SUBMISSION');
  // Fetch the cid from NeDB
  const cid = await namespaceWrapper.storeGet('cid'); // retrieves the value
  // Return cid
  return cid;
}
```

### Retrieving a file

Now that we've sent the CID as the submission value, we can use it in the audit to retrieve the file and check its contents. First add the code to retrieve the file and validate its contents in `task/fileUtils/isValidFile.js`:

```javascript
const { KoiiStorageClient } = require('@_koii/storage-task-sdk');

async function isValidFile(cid, filename = 'value.json') {
  const client = new KoiiStorageClient();

  try {
    const fileBlob = await client.getFile(cid, filename);
    if (!fileBlob) return false;

    const fileContent = await fileBlob.text();
    return typeof fileContent === 'string' && fileContent.length > 0;

  } catch (error) {
    console.error('Failed to download or validate file from IPFS:', error);
    throw error;
  }
}

module.exports = isValidFile;
```

Next, we'll use it in `task/audit.js`:

```javascript
async validateNode(submission_value, round) {
  try {
    console.log("AUDIT ROUND", round);
    // The submission value is the CID
    return isValidFile(submission_value);
  } catch (e) {
    console.log('Error in validate:', e);
    return false;
  }
}
```

This takes the submission value, which is the CID, and passes it to `isValidFile()`, which retrieves the file with the Storage SDK and checks that the contents of the file are a string.

And that's it! You've successfully written a task that uses IPFS to store data.

Next up, we'll take a look at secrets and the config options in [Lesson 3: Secrets & Config](../Lesson%203/README.md).
