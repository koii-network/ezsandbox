# Storage Quick Reference

## Local Database

Koii tasks use a local key-value store that can be used to pass data between functions.

### Setting a value

```js
const value = await namespaceWrapper.storeSet('value', '<your_value>');
```

### Getting a value

```js
const value = await namespaceWrapper.storeGet('value');
```

## IPFS

You can use IPFS in a Koii task to pass files between nodes.

### Uploading a file

```js
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
    const { cid } = await client.uploadFile(`${basePath}/${filename}`, userStaking);

    // Delete the temp file
    fs.unlinkSync(`${basePath}/${filename}`);

    return cid;
  } catch (error) {
    console.error('Failed to upload file to IPFS:', error);
    fs.unlinkSync(`${basePath}/${filename}`);
    throw error;
  }
}
```

The CID can then be sent as part of the submission to be used by other nodes.

## Retrieving a file

```js
const { KoiiStorageClient } = require('@_koii/storage-task-sdk');

// Create a new instance of the Koii Storage Client
const client = new KoiiStorageClient();

try {
  // get file from IPFS
  const fileBlob = await client.getFile(cid, filename);
  if (!fileBlob) return false;

  // if it's a text file, you can read the contents
  const fileContent = await fileBlob.text();

} catch (error) {
  console.error('Failed to download or validate file from IPFS:', error);
  throw error;
}
```
