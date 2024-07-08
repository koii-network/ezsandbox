const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const { namespaceWrapper } = require('@_koii/namespace-wrapper');
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
