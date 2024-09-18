export async function audit(submission, roundNumber) {
	/**
	 * Audit a submission
	 * This function should return true if the submission is correct, false otherwise
	 */
	console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber}`);
	// confirm that the submission is a string and is not empty
	return typeof submission === "string" && submission.length > 0;
}
