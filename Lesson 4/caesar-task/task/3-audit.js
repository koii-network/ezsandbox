import { decrypt } from "./cipher.js";

export async function audit(submission, roundNumber, submitterKey) {
  /**
   * Audit a submission
   * This function should return true if the submission is correct, false otherwise
   */
  console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber} from ${submitterKey}`);
  const submissionObj = JSON.parse(submission);
  const shift = submissionObj.shift;
  const encryptedMsg = submissionObj.message;
  const message = decrypt(encryptedMsg, shift);
  return message === "Koii rocks!";
}
