const coreLogic = require("./coreLogic");
const { app, init } = require("./init");
const { namespaceWrapper } = require("./namespaceWrapper");

async function setup() {
  // calling init

  await init();

  console.log("setup function called");
  // Run default setup
  await namespaceWrapper.defaultTaskSetup();
  process.on("message", (m) => {
    console.log("CHILD got message:", m);
    if (m.functionCall == "submitPayload") {
      console.log("submitPayload called");
      coreLogic.submitTask(m.roundNumber);
    } else if (m.functionCall == "auditPayload") {
      console.log("auditPayload called");
      coreLogic.auditTask(m.roundNumber);
    } else if (m.functionCall == "executeTask") {
      console.log("executeTask called");
      coreLogic.task();
    } else if (m.functionCall == "generateAndSubmitDistributionList") {
      console.log("generateAndSubmitDistributionList called");
      coreLogic.submitDistributionList(m.roundNumber);
    } else if (m.functionCall == "distributionListAudit") {
      console.log("distributionListAudit called");
      coreLogic.auditDistribution(m.roundNumber);
    }
  });

  /* GUIDE TO CALLS K2 FUNCTIONS MANUALLY

  If you wish to do the development by avoiding the timers then you can do the intended calls to K2 
  directly using these function calls. 

  To disable timers please set the TIMERS flag in task-node ENV to disable

  NOTE : K2 will still have the windows to accept the submission value, audit, so you are expected
  to make calls in the intended slots of your round time. 


  // Get the task state 
  console.log(await namespaceWrapper.getTaskState());

  //GET ROUND 

  const round = await namespaceWrapper.getRound();
  console.log("ROUND", round);

  // Submission to K2 (Preferablly you should submit the cid received from IPFS)

  await namespaceWrapper.checkSubmissionAndUpdateRound("vjnkjbvbvhj87847" [PASS YOUR ROUND HERE]);


  // Audit submissions 

  await namespaceWrapper.validateAndVoteOnNodes(validateNode, [PASS YOUR ROUND HERE]);


  // Node selection for distribution list 

  const selectedNode = await namespaceWrapper.nodeSelectionDistributionList();
  console.log("SELECTED NODE", selectedNode);

  // Distribution list sample 

  const distributionList = {
    "29SSj6EQARvATESSQbBcmSE3A1iaWwqXFunzAEDoV7Xj": 4,
    "3KUfsjpjCSCjwCBm4TraM5cGx6YzEUo9rrq2hrSsJw3x": 5,
    Avxvdc2efsPqysBZt4VKDSgiP4iuJ8GaAWhsNVUAi5CZ: 6,
  };

  // upload distribution list to K2

  const decider = await namespaceWrapper.uploadDistributionList(
    distributionList
    [PASS YOUR ROUND HERE]
  );
  console.log("DECIDER", decider);

  // Do the submission only if the distribution was uploaded correctly based on decider 

  if (decider) {
    const response = await namespaceWrapper.distributionListSubmissionOnChain();
    console.log("RESPONSE FROM DISTRIBUTION LIST", response);
  }

  // Audit distribution list

  await namespaceWrapper.validateAndVoteOnDistributionList();

  // Payout trigger

  const responsePayout = await namespaceWrapper.payoutTrigger();
  console.log("RESPONSE TRIGGER", responsePayout);



  */
}

setup();

if (app) {
  //  Write your Express Endpoints here.
  //  For Example
  //  namespace.express('post', '/accept-cid', async (req, res) => {})
}
