import { KoiiStorageClient } from "@_koii/storage-task-sdk";
import { namespaceWrapper } from "@_koii/namespace-wrapper";
import fs from "fs";

export async function storeFile(data, filename = "value.json") {
  // Create a new instance of the Koii Storage Client
  const client = KoiiStorageClient.getInstance({});
  const basePath = await namespaceWrapper.getBasePath();
  try {
    // Write the data to a temp file
    fs.writeFileSync(`${basePath}/${filename}`, JSON.stringify(data));

    // Get the user staking account, to be used for signing the upload request
    const userStaking = await namespaceWrapper.getSubmitterAccount();

    // Upload the file to IPFS and get the CID
    const { cid } = await client.uploadFile(
      `${basePath}/${filename}`,
      userStaking
    );

    console.log(`Stored file CID: ${cid}`);
    // Delete the temp file
    fs.unlinkSync(`${basePath}/${filename}`);

    return cid;
  } catch (error) {
    console.error("Failed to upload file to IPFS:", error);
    fs.unlinkSync(`${basePath}/${filename}`);
    throw error;
  }
}

export async function getFileBlob(cid, filename = "value.json") {
  const client = new KoiiStorageClient();
  return await client.getFile(cid, filename);
}

export async function getFileText(cid, filename = "value.json") {
  const fileBlob = await getFileBlob(cid, filename);
  if (!fileBlob) return null;
  return await fileBlob.text();
}
