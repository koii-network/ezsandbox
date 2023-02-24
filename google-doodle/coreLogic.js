const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { namespaceWrapper } = require("./namespaceWrapper");

async function task() {
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


  //return {scrapedDoodle};

  
}
async function fetchSubmission() {
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

async function generateDistributionList(round) {
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

async function submitDistributionList(round) {
  console.log("SubmitDistributionList called");

  const distributionList = await generateDistributionList(round);

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

async function validateNode(submission_value) {
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

async function validateDistribution(distributionList) {
  // Write your logic for the validation of submission value here and return a boolean value in response
  // this logic can be same as generation of distribution list function and based on the comparision will final object , decision can be made
  
  // sample list 

//   Distribution list [
//     26, 244, 212,   4, 246, 192,   1, 132,
//    251, 232, 108, 237,  32,  69, 152, 134,
//     76, 144,  37, 211,  61, 163,  53,  12,
//    178,  66,  89,  65,   7,  72, 228, 118
//  ]
  console.log("Distribution list", distributionList.toString());
  
  // let val = Math.random();
  // if (val < 0.5) {
  //   console.log("sending true");
  //   return true;
  // } else {
  //   console.log("sending false");
  //   return false;
  // }
}
// Submit Address with distributioon list to K2
async function submitTask(roundNumber) {
  console.log("submitTask called with round", roundNumber);
  try {
    console.log("inside try");
    console.log(
      await namespaceWrapper.getSlot(),
      "current slot while calling submit"
    );
    const value = await fetchSubmission();
    console.log("value", value);
    await namespaceWrapper.checkSubmissionAndUpdateRound(value, roundNumber);
    console.log("after the submission call");
  } catch (error) {
    console.log("error in submission", error);
  }
}

async function auditTask(roundNumber) {
  console.log("auditTask called with round", roundNumber);
  console.log(
    await namespaceWrapper.getSlot(),
    "current slot while calling auditTask"
  );
  await namespaceWrapper.validateAndVoteOnNodes(validateNode, roundNumber);
}

async function auditDistribution(roundNumber) {
  console.log("auditDistribution called with round", roundNumber);
  await namespaceWrapper.validateAndVoteOnDistributionList(
    validateDistribution,
    75
  );
}

module.exports = {
  task,
  fetchSubmission,
  generateDistributionList,
  submitDistributionList,
  validateNode,
  validateDistribution,
  submitTask,
  auditTask,
  auditDistribution,
};
