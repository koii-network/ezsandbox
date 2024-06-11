const { namespaceWrapper } = require('../_koiiNode/koiiNode');

class Audit {
  /**
   * Validates the submission value by your logic
   *
   * @param {string} submission_value - The submission value to be validated
   * @param {number} round - The current round number
   * @returns {Promise<boolean>} The validation result, return true if the submission is correct, false otherwise
   */
  async validateNode(submission_value, round) {
    let vote;
    console.log('SUBMISSION VALUE', submission_value, round);
    try {
      // Verify the value
      if (submission_value == 'Hello, World!') {
        vote = true;
      } else {
        vote = false;
      }
    } catch (e) {
      console.error(e);
      vote = false;
    }
    return vote;
  }
  /**
   * Audits the submission value by your logic
   *
   * @param {number} roundNumber - The current round number
   * @returns {void}
   */
  async auditTask(roundNumber) {
    console.log('AUDIT CALLED IN ROUND', roundNumber);
    console.log('CURRENT SLOT IN AUDIT', await namespaceWrapper.getSlot());
    await namespaceWrapper.validateAndVoteOnNodes(this.validateNode, roundNumber);
  }
}
const audit = new Audit();
module.exports = { audit };
