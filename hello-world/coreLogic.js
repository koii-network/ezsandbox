const { namespaceWrapper } = require("./_koiiNode/koiiNode");
const { LAMPORTS_PER_SOL } = require("@_koi/web3.js");
const dummyComputation = require("./dummyComputation.js");

class CoreLogic {
  async task() {
    try {
      dummyComputation();
      const value = "Hello, World!";
      if (value) {
        // store value on NeDB
        await namespaceWrapper.storeSet("value", value);
      }
      return value;
    } catch (err) {
      console.log("ERROR IN EXECUTING TASK", err);
      return "ERROR IN EXECUTING TASK" + err;
    }
  }

  async fetchSubmission() {
    // Write the logic to fetch the submission values here, this is be the final work submitted to K2

    try {
      const value = await namespaceWrapper.storeGet("value"); // retrieves the value
      // console.log("VALUE", value);
      return value;
    } catch (err) {
      console.log("Error", err);
      return null;
    }
  }

  async generateDistributionList(round, _dummyTaskState) {
    try {
      console.log("GenerateDistributionList called");
      console.log("I am selected node");

      // Write the logic to generate the distribution list here by introducing the rules of your choice

      /*  **** SAMPLE LOGIC FOR GENERATING DISTRIBUTION LIST ******/

      let distributionList = {};
      let distributionCandidates = [];
      let taskAccountDataJSON = await namespaceWrapper.getTaskState();
      if (taskAccountDataJSON == null) taskAccountDataJSON = _dummyTaskState;
      const submissions = taskAccountDataJSON.submissions[round];
      const submissions_audit_trigger =
        taskAccountDataJSON.submissions_audit_trigger[round];
      if (submissions == null) {
        console.log("No submisssions found in N-2 round");
        return distributionList;
      } else {
        const keys = Object.keys(submissions);
        const values = Object.values(submissions);
        const size = values.length;

        // Logic for slashing the stake of the candidate who has been audited and found to be false
        for (let i = 0; i < size; i++) {
          const candidatePublicKey = keys[i];
          if (
            submissions_audit_trigger &&
            submissions_audit_trigger[candidatePublicKey]
          ) {
            const votes = submissions_audit_trigger[candidatePublicKey].votes;
            if (votes.length === 0) {
              // slash 70% of the stake as still the audit is triggered but no votes are casted
              // Note that the votes are on the basis of the submission value
              // to do so we need to fetch the stakes of the candidate from the task state
              const stake_list = taskAccountDataJSON.stake_list;
              const candidateStake = stake_list[candidatePublicKey];
              const slashedStake = candidateStake * 0.7;
              distributionList[candidatePublicKey] = -slashedStake;
              console.log("Candidate Stake", candidateStake);
            } else {
              let numOfVotes = 0;
              for (let index = 0; index < votes.length; index++) {
                if (votes[index].is_valid) numOfVotes++;
                else numOfVotes--;
              }

              if (numOfVotes < 0) {
                // slash 70% of the stake as the number of false votes are more than the number of true votes
                // Note that the votes are on the basis of the submission value
                // to do so we need to fetch the stakes of the candidate from the task state
                const stake_list = taskAccountDataJSON.stake_list;
                const candidateStake = stake_list[candidatePublicKey];
                const slashedStake = candidateStake * 0.7;
                distributionList[candidatePublicKey] = -slashedStake;
                console.log("Candidate Stake", candidateStake);
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

      // now distribute the rewards based on the valid submissions
      // Here it is assumed that all the nodes doing valid submission gets the same reward

      // test code to generate 1001 nodes
      // for (let i = 0; i < 1002; i++) {
      //   distributionCandidates.push(`element ${i + 1}`);
      // }

      console.log(
        "LENGTH OF DISTRIBUTION CANDIDATES",
        distributionCandidates.length
      );

      //console.log("LENGTH", distributionCandidates.length);
      console.log("Bounty Amount", taskAccountDataJSON.bounty_amount_per_round);
      // const reward =
      //   taskAccountDataJSON.bounty_amount_per_round /
      //   distributionCandidates.length;
      // the reward is now fixed to 1 KOII per round per node
      const reward = 1 * LAMPORTS_PER_SOL;
      // console.log("REWARD PER NODE IN LAMPORTS", reward);
      // console.log("REWARD RECEIVED BY EACH NODE", reward);
      if (distributionCandidates.length < 20000) {
        for (let i = 0; i < distributionCandidates.length; i++) {
          distributionList[distributionCandidates[i]] = reward;
        }
      } else {
        // randomly select 1000 nodes
        const selectedNodes = [];

        while (selectedNodes.length < 20000) {
          const randomIndex = Math.floor(
            Math.random() * distributionCandidates.length
          );
          const randomNode = distributionCandidates[randomIndex];
          if (!selectedNodes.includes(randomNode)) {
            selectedNodes.push(randomNode);
          }
          //console.log("selected Node length",selectedNodes.length);
          //console.log("SELECTED nodes ARRAY",selectedNodes);
        }
        for (let i = 0; i < selectedNodes.length; i++) {
          distributionList[selectedNodes[i]] = reward;
        }
      }
      //console.log("Distribution List", distributionList);
      return distributionList;
    } catch (err) {
      console.log("ERROR IN GENERATING DISTRIBUTION LIST", err);
    }
  }

  async submitDistributionList(round) {
    console.log("SubmitDistributionList called");

    const distributionList = await this.generateDistributionList(round);

    const decider = await namespaceWrapper.uploadDistributionList(
      distributionList,
      round
    );
    // console.log("DECIDER", decider);

    if (decider) {
      const response = await namespaceWrapper.distributionListSubmissionOnChain(
        round
      );
      console.log("RESPONSE FROM DISTRIBUTION LIST", response);
    }
  }

  validateNode = async (submission_value, round) => {
    // Write your logic for the validation of submission value here and return a boolean value in response
    let vote;
    // console.log("SUBMISSION VALUE", submission_value, round);
    try {
      if (submission_value == "Hello, World!") {
        // For successful flow we return true (Means the audited node submission is correct)
        vote = true;
      } else {
        // For unsuccessful flow we return false (Means the audited node submission is incorrect)
        vote = false;
      }
    } catch (e) {
      console.error(e);
      vote = false;
    }
    return vote;
  };

  async shallowEqual(parsed, generateDistributionList) {
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }

    // Normalize key quote usage for generateDistributionList
    generateDistributionList = JSON.parse(
      JSON.stringify(generateDistributionList)
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

  validateDistribution = async (
    distributionListSubmitter,
    round,
    _dummyDistributionList,
    _dummyTaskState
  ) => {
    try {
      console.log("Distribution list Submitter", distributionListSubmitter);
      const rawDistributionList = await namespaceWrapper.getDistributionList(
        distributionListSubmitter,
        round
      );
      let fetchedDistributionList;
      if (rawDistributionList == null) {
        fetchedDistributionList = _dummyDistributionList;
      } else {
        fetchedDistributionList = JSON.parse(rawDistributionList);
      }
      // console.log("FETCHED DISTRIBUTION LIST", fetchedDistributionList);
      const generateDistributionList = await this.generateDistributionList(
        round,
        _dummyTaskState
      );

      // compare distribution list

      const parsed = fetchedDistributionList;
      // console.log(
      //   "compare distribution list",
      //   parsed,
      //   generateDistributionList
      // );
      const result = await this.shallowEqual(parsed, generateDistributionList);
      console.log("RESULT", result);
      return result;
    } catch (err) {
      console.log("ERROR IN VALIDATING DISTRIBUTION", err);
      return false;
    }
  };

  submitTask = async (roundNumber) => {
    console.log("submitTask called with round", roundNumber);
    try {
      console.log("inside try");
      console.log(
        await namespaceWrapper.getSlot(),
        "current slot while calling submit"
      );
      const value = await this.fetchSubmission();
      // console.log("value", value);
      if (!value) return;
      await namespaceWrapper.checkSubmissionAndUpdateRound(value, roundNumber);
      console.log("after the submission call");
    } catch (error) {
      console.log("error in submission", error);
    }
  };

  async auditTask(roundNumber) {
    console.log("auditTask called with round", roundNumber);
    console.log(
      await namespaceWrapper.getSlot(),
      "current slot while calling auditTask"
    );
    await namespaceWrapper.validateAndVoteOnNodes(
      this.validateNode,
      roundNumber
    );
  }

  async auditDistribution(roundNumber) {
    console.log("auditDistribution called with round", roundNumber);
    await namespaceWrapper.validateAndVoteOnDistributionList(
      this.validateDistribution,
      roundNumber
    );
  }
}

const coreLogic = new CoreLogic();

module.exports = {
  coreLogic,
};
