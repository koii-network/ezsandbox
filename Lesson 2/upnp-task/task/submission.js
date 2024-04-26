const { namespaceWrapper, TASK_ID } = require('../_koiiNode/koiiNode');
const { default: axios } = require('axios');
const { createHash } = require('crypto');
class Submission {
  /**
   * Executes your task, optionally storing the result.
   *
   * @param {number} round - The current round number
   * @returns {void}
   */
  async task(round) {
    try {
      console.log('ROUND', round);
      const IPAddressArray = await this.getAddressArray(); // Get the avaliable IP address array
      // console.log(IPAddressArray);
      let randomNode;

      try {
        const values = Object.values(IPAddressArray);
        const randomIndex = Math.floor(Math.random() * values.length);
        const randomNode = values[randomIndex];

        // pick a random one from nodeList and use axios to fetch data
        console.log('RANDOM NODE', randomNode);
        const response = await axios.get(`${randomNode}/task/${TASK_ID}/value`);
        if (response.status === 200) {
          const value = response.data.value;
          console.log('VALUE', value);
          // Store the result in NeDB (optional)
          if (value) {
            await namespaceWrapper.storeSet('value', value);
          }
          // Optional, return your task for JEST testing purposes
          return value;
        } else {
          return null;
        }
      } catch (error) {
        console.log('ERROR IN FETCHING IP ADDRESS', error);
      }
    } catch (err) {
      console.log('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }
  }

  /**
   * Submits a task for a given round
   *
   * @param {number} round - The current round number
   * @returns {Promise<any>} The submission value that you will use in audit. Ex. cid of the IPFS file
   */
  async submitTask(round) {
    console.log('SUBMIT TASK CALLED ROUND NUMBER', round);
    try {
      console.log('SUBMIT TASK SLOT', await namespaceWrapper.getSlot());
      const submission = await this.fetchSubmission(round);
      console.log('SUBMISSION', submission);
      await namespaceWrapper.checkSubmissionAndUpdateRound(submission, round);
      console.log('SUBMISSION CHECKED AND ROUND UPDATED');
      return submission;
    } catch (error) {
      console.log('ERROR IN SUBMISSION', error);
    }
  }
  /**
   * Fetches the submission value
   *
   * @param {number} round - The current round number
   * @returns {Promise<string>} The submission value that you will use in audit. It can be the real value, cid, etc.
   *
   */
  async fetchSubmission(round) {
    console.log('FETCH SUBMISSION');
    // Fetch the value from NeDB
    const value = await namespaceWrapper.storeGet('value'); // retrieves the value
    // Return cid/value, etc.
    return value;
  }

  async getAddressArray() {
    try {
      // Get the task state from the K2
      const taskState = await namespaceWrapper.getTaskState();
      // console.log('TASK STATE', taskState);
      const nodeList = taskState.ip_address_list;
      console.log('Node List', nodeList);
      return nodeList;
    } catch (e) {
      console.log('ERROR GETTING TASK STATE', e);
    }
  }
}
const submission = new Submission();
module.exports = { submission };
