const { namespaceWrapper } = require('../_koiiNode/koiiNode');
const SimpleCrawlerTask = require('../crawler/SimpleCrawlerTask');
const { SpheronClient, ProtocolEnum } = require('@spheron/storage');
const fs = require('fs');

class Submission {
  constructor() {}

  async task(round) {
    try {
      const newTask = new SimpleCrawlerTask(process.env.KEYWORD);
      const newTitles = await newTask.crawl();
      await namespaceWrapper.storeSet('titles', newTitles);
      return 'Done';
    } catch (err) {
      console.error('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }
  }

  async submitTask(roundNumber) {
    console.log('submitTask called with round', roundNumber);
    try {
      const submission = await this.fetchSubmission(roundNumber);
      console.log('SUBMISSION', submission);
      await namespaceWrapper.checkSubmissionAndUpdateRound(
        submission,
        roundNumber,
      );

      console.log('after the submission call');
    } catch (error) {
      console.log('error in submission', error);
    }
  }

  async storeFiles(data, filename = 'dealsData.json') {
    const client = new SpheronClient({ token: process.env.Spheron_Storage });
    const basePath = await namespaceWrapper.getBasePath();
    fs.writeFileSync(`${basePath}/${filename}`, JSON.stringify(data));

    let currentlyUploaded = 0;

    try {
      const { uploadId, bucketId, protocolLink, dynamicLinks, cid } =
        await client.upload(`${basePath}/${filename}`, {
          protocol: ProtocolEnum.IPFS,
          name: 'taskData',
          onUploadInitiated: uploadId => {
            console.log(`Upload with id ${uploadId} started...`);
          },
          onChunkUploaded: (uploadedSize, totalSize) => {
            currentlyUploaded += uploadedSize;
            console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
          },
        });

      console.log(`Stored file CID: ${cid}`);
      fs.unlinkSync(`${basePath}/${filename}`);

      return cid;
    } catch (error) {
      console.error('Failed to upload file to IPFS:', error);
      fs.unlinkSync(`${basePath}/${filename}`);
      throw error;
    }
  }

  async fetchSubmission(round) {
    console.log('fetchSubmission called with round', round);
    const deals = await namespaceWrapper.storeGet('titles');
    console.log('deals', deals);
    const cid = await this.storeFiles(deals);
    console.log('cid', cid);
    return cid;
  }
}

const submission = new Submission();
module.exports = { submission };
