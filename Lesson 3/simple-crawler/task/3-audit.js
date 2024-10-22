import { getFileBlob } from "../../../Lesson 2/file-sharing/task/fileUtils.js";

export async function audit(submission, roundNumber, submitterKey) {
  /**
   * Audit a submission
   * This function should return true if the submission is correct, false otherwise
   */
  console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber} from ${submitterKey}`);

  // Verify the upload exists
  const upload = await getFileBlob(submission);
  if (!upload) {
    return false;
  }

  // Verify the file content is a non-empty string
  const fileContent = await upload.text();
  if (
    !fileContent ||
    fileContent.length === 0 ||
    typeof fileContent !== "string"
  ) {
    return false;
  }
  const postTitles = JSON.parse(fileContent);
  // Verify the file content is a non-empty array
  if (!Array.isArray(postTitles) || postTitles.length === 0) {
    return false;
  }
  // Verify each post title is a non-empty string
  postTitles.forEach((title) => {
    if (typeof title !== "string" || title.length === 0) {
      return false;
    }
  });
  return true;
}
