// Define the percentage by which to slash the stake of submitters who submitted incorrect values
// 0.7 = 70%
const SLASH_PERCENT = 0.7;

export async function distribution(submitters, bounty, roundNumber) {
  /**
   * Generate the reward list for a given round
   * This function should return an object with the public keys of the submitters as keys
   * and the reward amount as values
   *
   * IMPORTANT: If the slashedStake or reward is not an integer, the distribution list will be rejected
   * Values are in ROE, or the KPL equivalent (1 Token = 10^9 ROE)
   *
   */
  console.log(`MAKE DISTRIBUTION LIST FOR ROUND ${roundNumber}`);

  // Initialize an empty object to store the final distribution list
  const distributionList = {};

  // Initialize an empty array to store the public keys of submitters with correct values
  const approvedSubmitters = [];

  // Iterate through the list of submitters and handle each one
  for (const submitter of submitters) {
    // If the submitter's votes are 0, they do not get any reward
    if (submitter.votes === 0) {
      distributionList[submitter.publicKey] = 0;

      // If the submitter's votes are negative (submitted incorrect values), slash their stake
    } else if (submitter.votes < 0) {
      // Slash the submitter's stake by the defined percentage
      const slashedStake = Math.floor(submitter.stake * SLASH_PERCENT);
      // Add the slashed amount to the distribution list
      // since the stake is positive, we use a negative value to indicate a slash
      distributionList[submitter.publicKey] = -slashedStake;

      // Log that the submitter's stake has been slashed
      console.log("CANDIDATE STAKE SLASHED", submitter.publicKey, slashedStake);

      // If the submitter's votes are positive, add their public key to the approved submitters list
    } else {
      approvedSubmitters.push(submitter.publicKey);
    }
  }

  // If no submitters submitted correct values, return the current distribution list
  if (approvedSubmitters.length === 0) {
    console.log("NO NODES TO REWARD");
    return distributionList;
  }

  // Calculate the reward for each approved submitter by dividing the bounty per round equally among them
  const reward = Math.floor(bounty / approvedSubmitters.length);

  console.log("REWARD PER NODE", reward);

  // Assign the calculated reward to each approved submitter
  approvedSubmitters.forEach((candidate) => {
    distributionList[candidate] = reward;
  });

  // Return the final distribution list
  return distributionList;
}
