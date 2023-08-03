const pcr = require("puppeteer-chromium-resolver");
const cheerio = require("cheerio");
const { namespaceWrapper } = require("./_koiiNode/koiiNode");
const { LAMPORTS_PER_SOL } = require("@_koi/web3.js");
const axios = require("axios");
const fs = require("fs");
class CoreLogic {
  errorCount = 0;
  async task() {
    try {
      let scrapedDoodle = await this.scrapeData();
      console.log({ scrapedDoodle });
      // store this work of fetching googleDoodle to nedb
      await namespaceWrapper.storeSet("doodle", scrapedDoodle);
      return scrapedDoodle;
    } catch (err) {
      console.log("error", err);
    }
  }

  scrapeData = async () => {
    let browser;
    try {
      const options = {};
      const stats = await pcr(options);

      browser = await stats.puppeteer.launch({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        args: ["--disable-gpu"],
        executablePath: stats.executablePath,
      });
      const page = await browser.newPage();
      await this.page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );
      await this.page.setViewport({ width: 1024, height: 768 });
      await page.goto("https://www.google.com/doodles");
      let bodyHTML = await page.evaluate(
        () => document.documentElement.outerHTML
      );
      const $ = cheerio.load(bodyHTML);

      let scrapedDoodle = $(".latest-doodle.on")
        .find("div > div > a > img")
        .attr("src");
      if (scrapedDoodle.substring(0, 2) == "//") {
        scrapedDoodle = scrapedDoodle.substring(2, scrapedDoodle.length);
      }
      //console.log({scrapedDoodle});
      console.log("SUBMISSION VALUE", scrapedDoodle);
      browser.close();
      this.errorCount = 0;
      return scrapedDoodle;
    } catch (err) {
      console.log("error", err);
      if (browser && browser.close) browser.close();
      this.errorCount += 1;
    }
    if (this.errorCount > 4) {
      process.exit(1);
    }
  };

  async fetchSubmission() {
    // Write the logic to fetch the submission values here, this is be the final work submitted to K2

    try {
      const scrappedDoodle = await namespaceWrapper.storeGet("doodle");
      console.log("Receievd Doodle", scrappedDoodle);
      return scrappedDoodle;
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
        console.log("Submissions from last round: ", keys, values, size);

        // Logic for slashing the stake of the candidate who has been audited and found to be false
        for (let i = 0; i < size; i++) {
          const candidatePublicKey = keys[i];
          if (
            submissions_audit_trigger &&
            submissions_audit_trigger[candidatePublicKey]
          ) {
            console.log(
              "distributions_audit_trigger votes ",
              submissions_audit_trigger[candidatePublicKey].votes
            );
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
      // the reward is now fixed to 0.15 KOII per round per node
      const reward = 0.15 * LAMPORTS_PER_SOL;
      console.log("REWARD PER NODE IN LAMPORTS", reward);
      console.log("REWARD RECEIVED BY EACH NODE", reward);
      if (distributionCandidates.length < 1000) {
        for (let i = 0; i < distributionCandidates.length; i++) {
          distributionList[distributionCandidates[i]] = reward;
        }
      } else {
        // randomly select 1000 nodes
        const selectedNodes = [];

        while (selectedNodes.length < 1000) {
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
    console.log("DECIDER", decider);

    if (decider) {
      const response = await namespaceWrapper.distributionListSubmissionOnChain(
        round
      );
      console.log("RESPONSE FROM DISTRIBUTION LIST", response);
    }
  }

  validateNode = async (submission_value) => {
    // Write your logic for the validation of submission value here and return a boolean value in response
    let vote;

    try {
      console.log("SUBMISSION VALUE", submission_value);
      const doodle = submission_value;
      //const doodle = "www.google.com/logos/doodles/2023/lithuania-independence-day-2023-6753651837109677-2xa.gif"
      console.log("URL", doodle);
      const scrapedDoodle = await this.scrapeData();
      console.log({ scrapedDoodle });
      // vote based on the scrapedDoodle
      if (scrapedDoodle == doodle) {
        vote = true;
      } else {
        vote = false;
      }
    } catch (e) {
      console.error(e);
      vote = false;
    }
    return vote;
  };

  async shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  validateDistribution = async (distributionListSubmitter, round) => {
    try {
      // Write your logic for the validation of submission value here and return a boolean value in response
      // this logic can be same as generation of distribution list function and based on the comparision will final object , decision can be made
      console.log("Distribution list Submitter", distributionListSubmitter);
      const fetchedDistributionList = JSON.parse(
        await namespaceWrapper.getDistributionList(
          distributionListSubmitter,
          round
        )
      );
      console.log("FETCHED DISTRIBUTION LIST", fetchedDistributionList);
      const generateDistributionList = await this.generateDistributionList(
        round
      );

      // compare distribution list

      const parsed = JSON.parse(fetchedDistributionList);
      const result = await this.shallowEqual(parsed, generateDistributionList);
      console.log("RESULT", result);
      return result;
    } catch (err) {
      console.log("ERROR IN CATCH", err);
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
      console.log("value", value);
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
