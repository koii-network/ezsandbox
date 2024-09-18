const slashPercentage = 0.7;

export function distribution(submitters, bounty, roundNumber) {
  /**
   * Generate the reward list for a given round
   * This function should return an object with the public keys of the submitters as keys
   * and the reward amount as values
   */
  console.log(`MAKE REWARD LIST FOR ROUND ${roundNumber}`);
  const rewardList = {};
  const approvedSubmitters = [];
  // Slash the stake of submitters who submitted incorrect values
  // and make a list of submitters who submitted correct values
  for (const submitter of submitters) {
    rewardList[submitter.publicKey] = 0;
    if (submitter.votes < 0) {
      const slashedStake = submitter.stake * slashPercentage;
      rewardList[submitter.publicKey] = -slashedStake;
      console.log('CANDIDATE STAKE SLASHED', submitter.publicKey, slashedStake);
    } else {
      approvedSubmitters.push(submitter.publicKey);
    }
  }
  // reward the submitters who submitted correct values
  const reward = Math.floor(bounty / approvedSubmitters.length);
  console.log('REWARD PER NODE', reward);
  approvedSubmitters.forEach(candidate => {
    rewardList[candidate] = reward;
  });
  return rewardList;
}
