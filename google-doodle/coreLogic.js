const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { namespaceWrapper } = require("./namespaceWrapper");

class CoreLogic{

  async task() {
    // Write the logic to do the work required for submitting the values and optionally store the result in levelDB
  
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com/doodles');
    let bodyHTML = await page.evaluate(() => document.documentElement.outerHTML);
    const $ = cheerio.load(bodyHTML);
  
    let scrapedDoodle = $('.latest-doodle.on').find('div > div > a > img').attr('src');
    if (scrapedDoodle.substring(0, 2) == '//') {
      scrapedDoodle = scrapedDoodle.substring(2, scrapedDoodle.length);
    }
    //console.log({scrapedDoodle});
  
    console.log('SUBMISSION VALUE', scrapedDoodle);
    const stringfy = JSON.stringify(scrapedDoodle);
  
    // store this work of fetching googleDoodle to levelDB
  
    try{
    await namespaceWrapper.storeSet("doodle", stringfy);
    }catch(err){
      console.log("error", err)
    }
    
  }

  async fetchSubmission() {
    // Write the logic to fetch the submission values here, this is be the final work submitted to K2
    
    try {
      const scrappedDoodle = JSON.parse(await namespaceWrapper.storeGet(
        "doodle"
      ));
      console.log("Receievd Doodle", scrappedDoodle);
      return scrappedDoodle;
    } catch (err) {
      console.log("Error", err);
      return err;
    }
  
    
  
  }

  async generateDistributionList(round) {
    console.log("GenerateDistributionList called");
    console.log("I am selected node");
  
    // Write the logic to generate the distribution list here by introducing the rules of your choice
  
    /*  **** SAMPLE LOGIC FOR GENERATING DISTRIBUTION LIST ******/
  
    let distributionList = {};
    const taskAccountDataJSON = await namespaceWrapper.getTaskState();
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
      for (let i = 0; i < size; i++) {
        const candidatePublicKey = keys[i];
        if (
          submissions_audit_trigger &&
          submissions_audit_trigger[candidatePublicKey]
        ) {
          console.log(
            submissions_audit_trigger[candidatePublicKey].votes,
            "distributions_audit_trigger votes "
          );
          const votes = submissions_audit_trigger[candidatePublicKey].votes;
          let numOfVotes = 0;
          for (let index = 0; index < votes.length; index++) {
            if (votes[i].is_valid) numOfVotes++;
            else numOfVotes--;
          }
          if (numOfVotes < 0) continue;
        }
        distributionList[candidatePublicKey] = 1;
      }
    }
    console.log("Distribution List", distributionList);
    return distributionList;
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
  
  async validateNode(submission_value) {
    // Write your logic for the validation of submission value here and return a boolean value in response
  
    let vote;
    console.log('SUBMISSION VALUE', submission_value);
    const doodle = submission_value;
    //const doodle = "www.google.com/logos/doodles/2023/lithuania-independence-day-2023-6753651837109677-2xa.gif"
    console.log('URL', doodle);
  
    // check the google doodle
  
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com/doodles');
    let bodyHTML = await page.evaluate(() => document.documentElement.outerHTML);
    const $ = cheerio.load(bodyHTML);
  
    let scrapedDoodle = $('.latest-doodle.on').find('div > div > a > img').attr('src');
    if (scrapedDoodle.substring(0, 2) == '//') {
      scrapedDoodle = scrapedDoodle.substring(2, scrapedDoodle.length);
    }
    console.log({scrapedDoodle});
  
    // vote based on the scrapedDoodle
  
    try {
      if (scrapedDoodle == doodle) {
        vote = true;
      } else {
        vote = false;
      }
    } catch (e) {
      console.error(e);
      vote = false;
    }
    browser.close();
    return vote;
  
  
    
  }
  

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

  validateDistribution = async(distributionListSubmitter, round) => {

    try{
      // Write your logic for the validation of submission value here and return a boolean value in response
      // this logic can be same as generation of distribution list function and based on the comparision will final object , decision can be made
      round = 75
      console.log("Distribution list Submitter", distributionListSubmitter);
      const fetchedDistributionList = JSON.parse(await namespaceWrapper.getDistributionList(distributionListSubmitter,round));
      console.log("FETCHED DISTRIBUTION LIST",fetchedDistributionList);
      const generateDistributionList = await this.generateDistributionList(round);
  
      // compare distribution list 
  
      const parsed = JSON.parse(fetchedDistributionList);
      const result = await this.shallowEqual(parsed,generateDistributionList);
      console.log("RESULT", result);
      return result;
    }catch(err){
      console.log("ERROR IN CATCH", err);
      return false;
  
    }
  }

  

  async submitTask(roundNumber) {
    console.log("submitTask called with round", roundNumber);
    try {
      console.log("inside try");
      console.log(
        await namespaceWrapper.getSlot(),
        "current slot while calling submit"
      );
      const value = await this.fetchSubmission();
      console.log("value", value);
      await namespaceWrapper.checkSubmissionAndUpdateRound(value, roundNumber);
      console.log("after the submission call");
    } catch (error) {
      console.log("error in submission", error);
    }
  }
  
  async auditTask(roundNumber) {
    console.log("auditTask called with round", roundNumber);
    console.log(
      await namespaceWrapper.getSlot(),
      "current slot while calling auditTask"
    );
    await namespaceWrapper.validateAndVoteOnNodes(this.validateNode, roundNumber);
  }
  
  async auditDistribution(roundNumber) {
    console.log("auditDistribution called with round", roundNumber);
    await namespaceWrapper.validateAndVoteOnDistributionList(
      this.validateDistribution,
      75,
    );
  }

}

const coreLogic = new CoreLogic();

module.exports = {
  coreLogic
};
