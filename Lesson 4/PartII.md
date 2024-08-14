# Lesson 4: Auditing & Distribution

## Part II: Distribution Concepts

At this point, you should be familiar with how a task is developed, and how you can verify as task's work. The final piece of the puzzle is looking at how rewards are distributed.

Prerequisites:

- General understanding of [gradual consensus](https://docs.koii.network/concepts/what-are-tasks/what-are-tasks/gradual-consensus) and task flow
- Understanding of [audit mechanisms](./README.md)

### Distributing Rewards

Now that we've figured out different ways to verify if a node is doing honest work, we should also figure out how we want to reward that honesty. Majority of the distribution logic of a task can be found in `task/distribution.js`.

Unlike audit mechanisms, there isn't necessarily a standard for what type of distribution mechanism you should use per task. If one web crawler task wants to distribute rewards evenly, and another wants to distribute based on reputation, that is perfectly viable!

Distributing mechanisms commonly (_but aren't required to_) follow this format:

1. Decide how much you want to reward
2. Decide how much you want to penalize
3. Mark each node as valid (accepted submission) or slashed (rejected submission)
4. Distribute!

The most important function regarding distribution is `generateDistributionList()` so we'll cover this. If you're interested in the other distribution functions, [click here!](https://docs.koii.network/develop/write-a-koii-task/task-development-guide/template-structure/distribute-rewards)

### `generateDistributionList()`

For this example, we'll look at [Lesson 1's Hello World Task distribution logic](../Lesson%201/EZ-testing-task/task/distribution.js), as it provides a good basic framework for how to write distribution logic. Let's break down this function:

1. Fetch Submissions

```javascript
  async generateDistributionList(round, _dummyTaskState) {
    try {
      console.log('GENERATE DISTRIBUTION LIST CALLED WITH ROUND', round);
      /****** SAMPLE LOGIC FOR GENERATING DISTRIBUTION LIST ******/
      let distributionList = {};
      let distributionCandidates = [];
      let taskAccountDataJSON = null;
      let taskStakeListJSON = null;
      try {
        taskAccountDataJSON = await namespaceWrapper.getTaskSubmissionInfo(
          round,
        );
      } catch (error) {
        console.error('ERROR IN FETCHING TASK SUBMISSION DATA', error);
        return distributionList;
      }
      const submissions = taskAccountDataJSON.submissions[round];
      const submissions_audit_trigger = taskAccountDataJSON.submissions_audit_trigger[round];

      if (submissions == null) {
        console.log(`NO SUBMISSIONS FOUND IN ROUND ${round}`);
        return distributionList;
      }
    ...
```

The first thing we do is initialize our distribution lists. We also fetch all the submissions that were made for this round on a particular task. If no submissions were made, we simply return an empty distribution list.

2. Grab Candidate Votes

```javascript
    ...
      else {
        const keys = Object.keys(submissions);
        const values = Object.values(submissions);
        const size = values.length;
        console.log('SUBMISSIONS FROM LAST ROUND: ', keys, values, size);
        taskStakeListJSON = await namespaceWrapper.getTaskState({
          is_stake_list_required: true,
        });
        if (taskStakeListJSON == null) {
          console.error('ERROR IN FETCHING TASK STAKING LIST');
          return distributionList;
        }
        // Slashing the stake of the candidate who has been audited and found to be false
        for (let i = 0; i < size; i++) {
          const candidatePublicKey = keys[i];
          if (
            submissions_audit_trigger &&
            submissions_audit_trigger[candidatePublicKey]
          ) {
            console.log(
              'DISTRIBUTION AUDIT TRIGGER VOTES',
              submissions_audit_trigger[candidatePublicKey].votes,
            );
            const votes = submissions_audit_trigger[candidatePublicKey].votes;

            if (votes.length === 0) {
              // Slash 70% of the stake as still the audit is triggered but no votes are casted
              const stake_list = taskStakeListJSON.stake_list;
              const candidateStake = stake_list[candidatePublicKey];
              const slashedStake = candidateStake * 0.7;
              distributionList[candidatePublicKey] = -slashedStake;
              console.log('CANDIDATE STAKE', candidateStake);
            }
    ...
```

From the submissions, we can grab the public keys of the nodes that participated. Then, we can check if they should have been audited this round. If they should have been audited but received no votes, this means there was some sort of interference preventing voting, so they will be slashed.

Slashing refers to the penalty that's issued to a node for completing a task incorrectly, behaving suspiciously, or trying to exploit rewards. The penalty involves removing some portion of the user's staked KOII. There may be tasks that don't penalize and others that confiscate the entire stake, it just depends on the type of work that's being done and how critical it is. Penalty amounts are completely up to the task creator (that's you!). In this case, we have chosen to confiscate 70% of the node's stake.

3. Tally Votes

```javascript
    ...
        else {
              let numOfVotes = 0;
              for (let index = 0; index < votes.length; index++) {
                if (votes[index].is_valid) numOfVotes++;
                else numOfVotes--;
              }

              if (numOfVotes < 0 && taskStakeListJSON) {
                // slash 70% of the stake as the number of false votes are more than the number of true votes
                // Note that the votes are on the basis of the submission value
                // to do so we need to fetch the stakes of the candidate from the task state
                const stake_list = taskStakeListJSON.stake_list;
                const candidateStake = stake_list[candidatePublicKey];
                const slashedStake = candidateStake * 0.7;
                distributionList[candidatePublicKey] = -slashedStake;
                console.log('CANDIDATE STAKE', candidateStake);
              }

              if (numOfVotes > 0) {
                distributionCandidates.push(candidatePublicKey);
              }
            }
          } else {
            distributionCandidates.push(candidatePublicKey);
          }
        }
      }
    ...
```

If the node **has** received votes, it's time to tally them up. After the votes are tallied, if the node has more people voting against them than for them, then they will be penalized for not completing the task correctly. The slashing logic here can be customized separately from the case where there are no votes. In this case, we have kept it the same and are slashing 70% of the stake.

4. Distribute Rewards

```javascript
    ...
      // Distribute the rewards based on the valid submissions
      // Here it is assumed that all the nodes doing valid submission gets the same reward
      const reward = Math.floor(
        taskStakeListJSON.bounty_amount_per_round /
          distributionCandidates.length,
      );
      console.log('REWARD RECEIVED BY EACH NODE', reward);
      for (let i = 0; i < distributionCandidates.length; i++) {
        distributionList[distributionCandidates[i]] = reward;
      }
      console.log('DISTRIBUTION LIST', distributionList);
      return distributionList;
    } catch (err) {
      console.log('ERROR IN GENERATING DISTRIBUTION LIST', err);
    }
  }
```

Once we have the final list of nodes that should receive rewards, we can begin to distribute the bounty. How you distribute the bounty is entirely up to you. Typically you distribute the round's bounty amount equally between all participants (as we have done here), but if you want to distribute a fixed amount or scale the rewards based on reputation or staked amount, you are free to do so.

### Shared Data

One thing to note about generating distribution lists is that only one node per round is chosen to generate the list. Once this list is generated, it needs to be shared and audited by other nodes, similar to regular audit logic. So remember, there are two audits:

1. Auditing a node's task work
2. Auditing the round's distribution list

Data can be shared to all nodes in the network by fetching a list of all the other nodes, and comparing their stored data with yours. Using timestamps, you can verify who has the most recent data and use the latest information, similar to [Link State routing](https://en.wikipedia.org/wiki/Link-state_routing_protocol).

 If you want to learn more about data sharing across a task, [click here](https://docs.koii.network/develop/linktree/data-sharing).

Just like that we've successfully gone through both audit and distribution mechanisms and we're now ready to write our own.

Now let's try building our own audit and distribution mechanisms in [Part III](./PartIII.md)
