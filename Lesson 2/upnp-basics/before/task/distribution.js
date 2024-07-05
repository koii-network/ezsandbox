const { namespaceWrapper } = require('@_koii/namespace-wrapper');

class Distribution {
  /**
   * Generates and submits the distribution list for a given round
   * @param {number} round - The current round number
   * @returns {void}
   *
   */
  submitDistributionList = async round => {
    console.log('SUBMIT DISTRIBUTION LIST CALLED WITH ROUND', round);
    try {
      const distributionList = await this.generateDistributionList(round);
      if (Object.keys(distributionList).length === 0) {
        console.log('NO DISTRIBUTION LIST GENERATED');
        return;
      }
      const decider = await namespaceWrapper.uploadDistributionList(
        distributionList,
        round,
      );
      console.log('DECIDER', decider);
      if (decider) {
        const response =
          await namespaceWrapper.distributionListSubmissionOnChain(round);
        console.log('RESPONSE FROM DISTRIBUTION LIST', response);
      }
    } catch (err) {
      console.log('ERROR IN SUBMIT DISTRIBUTION', err);
    }
  };
  /**
   * Audits the distribution list for a given round
   * @param {number} roundNumber - The current round number
   * @returns {void}
   *
   */
  async auditDistribution(roundNumber) {
    console.log('AUDIT DISTRIBUTION CALLED WITHIN ROUND: ', roundNumber);
    await namespaceWrapper.validateAndVoteOnDistributionList(
      this.validateDistribution,
      roundNumber,
    );
  }
  /**
   * Generates the distribution list for a given round in your logic
   * @param {number} round - The current round number
   * @returns {Promise<object>} The distribution list for the given round
   */
  async generateDistributionList(round, _dummyTaskState) {
    try {
      console.log('GENERATE DISTRIBUTION LIST CALLED WITH ROUND', round);
      /****** SAMPLE LOGIC FOR GENERATING DISTRIBUTION LIST ******/
      let distributionList = {};
      let distributionCandidates = [];
      let taskAccountDataJSON = null;
      let taskStakeListJSON = null;
      try {
        taskAccountDataJSON = await namespaceWrapper.getTaskSubmissionInfo(
          round,
        );
      } catch (error) {
        console.error('ERROR IN FETCHING TASK SUBMISSION DATA', error);
        return distributionList;
      }
      if (taskAccountDataJSON == null) {
        console.error('ERROR IN FETCHING TASK SUBMISSION DATA');
        return distributionList;
      }
      const submissions = taskAccountDataJSON.submissions[round];
      const submissions_audit_trigger =
        taskAccountDataJSON.submissions_audit_trigger[round];
      if (submissions == null) {
        console.log(`NO SUBMISSIONS FOUND IN ROUND ${round}`);
        return distributionList;
      } else {
        const keys = Object.keys(submissions);
        const values = Object.values(submissions);
        const size = values.length;
        console.log('SUBMISSIONS FROM LAST ROUND: ', keys, values, size);
        taskStakeListJSON = await namespaceWrapper.getTaskState({
          is_stake_list_required: true,
        });
        if (taskStakeListJSON == null) {
          console.error('ERROR IN FETCHING TASK STAKING LIST');
          return distributionList;
        }
        // Slashing the stake of the candidate who has been audited and found to be false
        for (let i = 0; i < size; i++) {
          const candidatePublicKey = keys[i];
          if (
            submissions_audit_trigger &&
            submissions_audit_trigger[candidatePublicKey]
          ) {
            console.log(
              'DISTRIBUTION AUDIT TRIGGER VOTES',
              submissions_audit_trigger[candidatePublicKey].votes,
            );
            const votes = submissions_audit_trigger[candidatePublicKey].votes;

            if (votes.length === 0) {
              // Slash 70% of the stake as still the audit is triggered but no votes are casted
              // Note that the votes are on the basis of the submission value
              // To do so we need to fetch the stakes of the candidate from the task state
              const stake_list = taskStakeListJSON.stake_list;
              const candidateStake = stake_list[candidatePublicKey];
              const slashedStake = candidateStake * 0.7;
              distributionList[candidatePublicKey] = -slashedStake;
              console.log('CANDIDATE STAKE', candidateStake);
            } else {
              let numOfVotes = 0;
              for (let index = 0; index < votes.length; index++) {
                if (votes[index].is_valid) numOfVotes++;
                else numOfVotes--;
              }

              if (numOfVotes < 0 && taskStakeListJSON) {
                // slash 70% of the stake as the number of false votes are more than the number of true votes
                // Note that the votes are on the basis of the submission value
                // to do so we need to fetch the stakes of the candidate from the task state
                const stake_list = taskStakeListJSON.stake_list;
                const candidateStake = stake_list[candidatePublicKey];
                const slashedStake = candidateStake * 0.7;
                distributionList[candidatePublicKey] = -slashedStake;
                console.log('CANDIDATE STAKE', candidateStake);
              }

              if (numOfVotes > 0) {
                distributionCandidates.push(candidatePublicKey);
              }
            }
          } else {
            distributionCandidates.push(candidatePublicKey);
          }
        }
      }

      // Distribute the rewards based on the valid submissions
      // Here it is assumed that all the nodes doing valid submission gets the same reward
      const reward = Math.floor(
        taskStakeListJSON.bounty_amount_per_round /
          distributionCandidates.length,
      );
      console.log('REWARD RECEIVED BY EACH NODE', reward);
      for (let i = 0; i < distributionCandidates.length; i++) {
        distributionList[distributionCandidates[i]] = reward;
      }
      console.log('DISTRIBUTION LIST', distributionList);
      return distributionList;
    } catch (err) {
      console.log('ERROR IN GENERATING DISTRIBUTION LIST', err);
    }
  }
  /**
   * Validates the distribution list for a given round in your logic
   * The logic can be same as generation of distribution list function and based on the comparision will final object , decision can be made
   * @param {string} distributionListSubmitter - The public key of the distribution list submitter
   * @param {number} round - The current round number
   * @param {object} _dummyDistributionList
   * @param {object} _dummyTaskState
   * @returns {Promise<boolean>} The validation result, return true if the distribution list is correct, false otherwise
   */
  validateDistribution = async (
    distributionListSubmitter,
    round,
    _dummyDistributionList,
    _dummyTaskState,
  ) => {
    try {
      console.log('DISTRIBUTION LIST SUBMITTER', distributionListSubmitter);
      const rawDistributionList = await namespaceWrapper.getDistributionList(
        distributionListSubmitter,
        round,
      );
      let fetchedDistributionList;
      if (rawDistributionList == null) {
        return true;
      } else {
        fetchedDistributionList = JSON.parse(rawDistributionList);
      }
      console.log('FETCHED DISTRIBUTION LIST', fetchedDistributionList);
      const generateDistributionList = await this.generateDistributionList(
        round,
        _dummyTaskState,
      );

      if (Object.keys(generateDistributionList).length === 0) {
        console.log('UNABLE TO GENERATE DISTRIBUTION LIST');
        return true;
      }
      // Compare distribution list
      const parsed = fetchedDistributionList;
      console.log(
        'COMPARE DISTRIBUTION LIST',
        parsed,
        generateDistributionList,
      );
      const result = await this.shallowEqual(parsed, generateDistributionList);
      console.log('RESULT', result);
      return result;
    } catch (err) {
      console.log('ERROR IN VALIDATING DISTRIBUTION', err);
      return false;
    }
  };
  /**
   * Compares two objects for equality
   * @param {object} parsed - The first object
   * @param {object} generateDistributionList - The second object
   * @returns {boolean} The result of the comparison
   */
  async shallowEqual(parsed, generateDistributionList) {
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }

    // Normalize key quote usage for generateDistributionList
    generateDistributionList = JSON.parse(
      JSON.stringify(generateDistributionList),
    );

    const keys1 = Object.keys(parsed);
    const keys2 = Object.keys(generateDistributionList);
    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (parsed[key] !== generateDistributionList[key]) {
        return false;
      }
    }
    return true;
  }
}

const distribution = new Distribution();
module.exports = {
  distribution,
};
