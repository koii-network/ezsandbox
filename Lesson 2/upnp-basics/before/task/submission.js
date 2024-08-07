const { namespaceWrapper } = require('@_koii/namespace-wrapper');
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
      // Get a list of the available IP addresses
      const IPAddressArray = await getData.getAddressArray();
   
      try {
         // Get a random node from the list
         const randomNode = getData.getRandomNodeEndpoint(IPAddressArray);
         console.log('RANDOM NODE', randomNode);
   
         // Fetch the value from the random node
         const response = await axios.get(`${randomNode}/task/${TASK_ID}/value`);

         const response2 = await axios.get(`${randomNode}/task/${TASK_ID}/value2`);
   
         if (response.status === 200 && response2.status===200) {
            const value = response.data.value+" "+response2.data.value2;
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
}
const submission = new Submission();
module.exports = { submission };
