export async function audit(submission, roundNumber, submitterKey) {
  /**
   * Audit a submission
   * This function should return true if the submission is correct, false otherwise
   */
  console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber} from ${submitterKey}`);
  console.log("Started Audit", new Date(), "EZ TESTING");
  return submission === "Hello, World!";
}
