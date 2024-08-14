const { KoiiStorageClient } = require('@_koii/storage-task-sdk');

async function isValidFile(cid, filename = 'value.json') {
  const client = new KoiiStorageClient();

  try {
    // get the file from IPFS
    const fileBlob = await client.getFile(cid, filename);
    // if the file can't be found, it's not valid
    if (!fileBlob) return false;

    // read the contents of the file (only works with text files)
    const fileContent = await fileBlob.text();

    // check that the file contains a string of at least 1 character
    return typeof fileContent === 'string' && fileContent.length > 0;

  } catch (error) {
    console.error('Failed to download or validate file from IPFS:', error);
    throw error;
  }
}

module.exports = isValidFile;