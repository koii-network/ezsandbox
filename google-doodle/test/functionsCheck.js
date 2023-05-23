/*
This file helps you in testing the functions that you need to develop for the tasks before submitting it to K2.
*/
const { coreLogic } = require("../coreLogic");

async function main() {
  console.log("IN TESTING TASK");

  // Testing the task function
  await coreLogic.task();
  console.log(await coreLogic.validateNode("www.google.com/logos/doodles/2023/barbara-may-camerons-69th-birthday-6753651837110046-2x.png"))

  const _dummyTaskState = {
    stake_list: {
      "2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL": 20000000000,
      "2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH": 10000000000,
    },
    bounty_amount_per_round: 1000000000,

    submissions: {
      1: {
        "2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL": {
          submission_value: "8164bb07ee54172a184bf35f267bc3f0052a90cd",
          slot: 1889700,
          round: 1,
        },
        "2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH": {
          submission_value: "8164bb07ee54172a184bf35f267bc3f0052a90cc",
          slot: 1890002,
          round: 1,
        },
      },
    },
    submissions_audit_trigger: {
      1: {
        // round number
        "2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL": {
          // Data Submitter (send data to K2)
          trigger_by: "2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH", // Audit trigger
          slot: 1890002,
          votes: [
            {
              is_valid: false, // Submission is invalid(Slashed)
              voter: "2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHZ", // Voter
              slot: 1890003,
            },
          ],
        },
        "2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH": {
          // Data Submitter (send data to K2)
          trigger_by: "2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL", // Audit trigger
          slot: 1890002,
          votes: [
            {
              is_valid: true, // Submission is valid
              voter: "2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHZ", // Voter
              slot: 1890003,
            },
          ],
        },
      },
    },
  };

  // const distributionList = await coreLogic.generateDistributionList(
  //   1,
  //   _dummyTaskState
  // );

  // console.log("Distribution List", distributionList);

  //Test fetchSubmission function

  // const fetchSubmission = await coreLogic.fetchSubmission();
  // console.log("FetchSubmission", fetchSubmission);

  // // Test generateDistributionList function

  // const generateDistributionList = await coreLogic.generateDistributionList();
  // console.log("generateDistributionList", generateDistributionList);

  // //Test submit distribution function

  // const submitDistributionList = await coreLogic.submitDistributionList();
  // console.log("submitDistributionList", submitDistributionList);

  // // Test ValidateNode function

  // const validateNode = await coreLogic.validateNode();
  // console.log("ValidateNode", validateNode);

  // // Test validateDistribution function

  // const validateDistribution = await coreLogic.validateDistribution();
  // console.log("Validate Distribution", validateDistribution);

  // // Test submit function

  // const submitTask = await coreLogic.submitTask();
  // console.log("SubmitTask", submitTask);

  // // Test Audit function

  // const auditTask = await coreLogic.auditTask();
  // console.log("auditTask", auditTask);

  // //  Test auditDistribution function

  // const auditDistribution = await coreLogic.auditDistribution();
  // console.log("auditDistribution", auditDistribution);
}

main();
