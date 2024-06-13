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
