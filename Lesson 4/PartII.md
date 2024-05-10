# Part II. Distribution Concepts

At this point, you should be familiar with how a task is developed, and how you can verify as task's work. The final piece of the puzzle is looking at how rewards are distributed!

Prerequisites:

- General understanding of gradual consensus and task flow
- Understanding of audit mechanisms

## Distributing Rewards

Now that we've figured out different ways to verify if a node is doing honest work, we should also figure out how we want to reward that honesty. Majority of the distribution logic of a task can be found in `task/distribution.js`.

Unlike audit mechanisms, there isn't necessarily a standard for what type of distribution mechanism you should use per task. If one web crawler task wants to distribute rewards evenly, and another wants to distribute based on reputation, that is perfectly viable!

Distributing mechanisms commonly (_but aren't required to_) follow this format:

1. Decide how much you want to reward
2. Decide how much you want to penalize
3. Mark each node as valid or slashed
4. Distribute!

The most important function regarding distribution is `generateDistributionList()` so we'll cover this. If you're interested in the other distribution functions, [click here!](https://docs.koii.network/develop/write-a-koii-task/task-development-guide/template-structure/distribute-rewards)

## `generateDistributionList()`

For this example, we've decided to use [Lesson 1's Hello World Task distribution logic](../Lesson%201/hello-world/task/distribution.js), as it provides a good basic framework for how to write distribution logic. Let's break down this function:

1. Fetch Submissions

```javascript
  async generateDistributionList(round, _dummyTaskState) {
    try {
      console.log('GENERATE DISTRIBUTION LIST CALLED WITH ROUND', round);
      /****** SAMPLE LOGIC FOR GENERATING DISTRIBUTION LIST ******/
      let distributionList = {};
      let distributionCandidates = [];
      let taskAccountDataJSON = await namespaceWrapper.getTaskState();
      if (taskAccountDataJSON == null) taskAccountDataJSON = _dummyTaskState;
      const submissions = taskAccountDataJSON.submissions[round];
      const submissions_audit_trigger =
        taskAccountDataJSON.submissions_audit_trigger[round];
      if (submissions == null) {
        console.log(`NO SUBMISSIONS FOUND IN ROUND ${round}`);
        return distributionList;
      }
    ...
```

The first thing we do is initialize our distribution lists. We also fetch all the submissions that were made for this round on a particular task. If no submissions were made, we simply return the empty distribution list!

2. Grab Candidate Votes

```javascript
    ...
      else {
        const keys = Object.keys(submissions);
        const values = Object.values(submissions);
        const size = values.length;
        console.log('SUBMISSIONS FROM LAST ROUND: ', keys, values, size);
        // Slashing the stake of the candidate who has been audited and found to be false
        for (let i = 0; i < size; i++) {
          const candidatePublicKey = keys[i];
          if (
            submissions_audit_trigger &&
            submissions_audit_trigger[candidatePublicKey]
          ) {
            console.log('DISTRIBUTION AUDIT TRIGGER VOTES', submissions_audit_trigger[candidatePublicKey].votes);
            const votes = submissions_audit_trigger[candidatePublicKey].votes;
            if (votes.length === 0) {
              // Slash 70% of the stake as still the audit is triggered but no votes are casted
              // Note that the votes are on the basis of the submission value
              // To do so we need to fetch the stakes of the candidate from the task state
              const stake_list = taskAccountDataJSON.stake_list;
              const candidateStake = stake_list[candidatePublicKey];
              const slashedStake = candidateStake * 0.7;
              distributionList[candidatePublicKey] = -slashedStake;
              console.log('CANDIDATE STAKE', candidateStake);
            }
    ...
```

From the submissions, we can grab the public keys of the nodes that participated. Then, we can check if they should have been audited this round. If they should have been audited but received no votes, this means there was some sort of interference and they will be slashed

Slashing refers to the penalty that's issued to a node for completing a task incorrectly, behaving suspiciously, or trying to exploit rewards. Penalty amounts are completely up to the you, the task creator, but in this case we have gotten rid of 70% of the node's stake. There may be tasks that don't every penalize, or tasks that fully penalize, it just depends on the type of work that's being done and how critical it is.

3. Tally Votes

```javascript
    ...
        else {
              let numOfVotes = 0;
              for (let index = 0; index < votes.length; index++) {
                if (votes[index].is_valid) numOfVotes++;
                else numOfVotes--;
              }

              if (numOfVotes < 0) {
                // slash 70% of the stake as the number of false votes are more than the number of true votes
                // Note that the votes are on the basis of the submission value
                // to do so we need to fetch the stakes of the candidate from the task state
                const stake_list = taskAccountDataJSON.stake_list;
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

If the node **has** received votes, it's time to tally them up! After the votes are tallied, if the node has more people voting against them, then they will be penalized for not completing the task correctly. Again, you can customize the slashing logic in this case but we decided to also slash 70% of the penalized node's stake.

4. Distribute Rewards

```javascript
    ...
      // Distribute the rewards based on the valid submissions
      // Here it is assumed that all the nodes doing valid submission gets the same reward
      const reward = Math.floor(
        taskAccountDataJSON.bounty_amount_per_round /
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

Once we have the final list of nodes who should receive rewards, we can begin to distribute the bounty! Typically, you can distribute a round's bounty equally amongst all participants, but this mechanism is up to you. If you want to hard code your rewards mechanism and give everyone 1 token, you could. If you wanted to give more tokens based on reputation, you could. Whatever you feel is the best way to distribute rewards for your use case, feel free to use that system!

## Shared Data

One thing to note about generating distribution lists is that it's a singular node's responsibility, that is, only one node is chosen to do it per round. Once this list is generated, it needs to be shared and audited by other nodes, similar to regular audit logic. So remember, there are two audits:

1. Auditing a node's task work
2. Auditing the round's distribution list

Data can be shared to all nodes in the network by fetching a list of all the other nodes, and comparing their stored data with yours. Using timestamps, you can verify who has the most recent data and use the latest information, similar to Link State routing. If you want to learn more about data sharing across a task, [click here!](https://docs.koii.network/develop/linktree/data-sharing)

Just like that we've successfully gone through both audit and distribute mechanisms and we're now ready to write our own.

[Click here to start PartIII. Building Audit and Distribution Mechanisms](./PartIII.md)
