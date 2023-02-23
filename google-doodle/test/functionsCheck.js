/*
This file helps you in testing the functions that you need to develop for the tasks before submitting it to K2.
*/
const coreLogic = require("../coreLogic");

async function main() {
  console.log("IN TESTING TASK");

  // Testing the task function
  const task = await coreLogic.task();
  console.log("Task", task);

  //Test fetchSubmission function

  const fetchSubmission = await coreLogic.fetchSubmission();
  console.log("FetchSubmission", fetchSubmission);

  // Test generateDistributionList function

  const generateDistributionList = await coreLogic.generateDistributionList();
  console.log("generateDistributionList", generateDistributionList);

  //Test submit distribution function

  const submitDistributionList = await coreLogic.submitDistributionList();
  console.log("submitDistributionList", submitDistributionList);

  // Test ValidateNode function

  const validateNode = await coreLogic.validateNode();
  console.log("ValidateNode", validateNode);

  // Test validateDistribution function

  const validateDistribution = await coreLogic.validateDistribution();
  console.log("Validate Distribution", validateDistribution);

  // Test submit function

  const submitTask = await coreLogic.submitTask();
  console.log("SubmitTask", submitTask);

  // Test Audit function

  const auditTask = await coreLogic.auditTask();
  console.log("auditTask", auditTask);

  //  Test auditDistribution function

  const auditDistribution = await coreLogic.auditDistribution();
  console.log("auditDistribution", auditDistribution);
}

main();
