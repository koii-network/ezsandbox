const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const { namespaceWrapper } = require('@_koii/namespace-wrapper');

async function storeFile(data, filename = 'value.json') {

  try {
    // Create a new instance of the Koii Storage Client
    const client = new KoiiStorageClient();
    console.log(data, process.env.TEST_KEYWORD)
    const buffer = Buffer.from(JSON.stringify(data));
    const file = new File([buffer], filename, { type: 'application/json' });
    const userStaking = await namespaceWrapper.getSubmitterAccount();
    const { cid } = await client.uploadFile(file, userStaking);
    return cid;
  } catch (error) {
    console.error('Failed to upload file to IPFS:', error);
    throw error;
  }
}

module.exports = storeFile;
