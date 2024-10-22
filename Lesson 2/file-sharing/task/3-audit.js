import { getFileText } from "./fileUtils.js";

export async function audit(submission, roundNumber, submitterKey) {
  /**
   * Audit a submission
   * This function should return true if the submission is correct, false otherwise
   */
  console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber} from ${submitterKey}`);
  const fileContent = await getFileText(submission);
  return typeof fileContent === "string" && fileContent.length > 0;
}
