const { namespaceWrapper } = require('../_koiiNode/koiiNode');
const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const fs = require('fs');

class Submission {
  constructor() {}

  async task(round) {
    try {
      console.log('task called with round', round);
      // YOUR CODE HERE

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
    try {
      const client = new KoiiStorageClient();
      const basePath = await namespaceWrapper.getBasePath();
      fs.writeFileSync(`${basePath}/${filename}`, JSON.stringify(data));

      const userStaking = await namespaceWrapper.getSubmitterAccount();



      const { cid } = await client.uploadFile(`${basePath}/${filename}`,userStaking);

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
    const cid = await namespaceWrapper.storeGet('cid');
    console.log('cid', cid);
    return cid;
  }
}

const submission = new Submission();
module.exports = { submission };
