# Lesson 4: Auditing & Distribution

## Part III: Distribution Concepts

At this point, you should be familiar with how a task is developed, and how you can verify as task's work. The final piece of the puzzle is looking at how rewards are distributed.

Prerequisites:

- General understanding of [gradual consensus and task flow](https://docs.koii.network/concepts/what-are-tasks/what-are-tasks/gradual-consensus)
- Understanding of [audit mechanisms](./PartI.md)

### Distributing Rewards

Now that we've figured out different ways to verify if a node is doing honest work, we should also figure out how we want to reward that honesty. For the first time, we're going to look at [the distribution function](../Lesson%201/ez-testing-task/4-distribution.js). We take care of fetching the audit submissions and counting the votes, all you need to do is decide on your compensation logic.

Distributions mechanisms follow this general format:

1. Decide how much you want to reward
2. Decide how much you want to penalize
3. Mark each node as valid (accepted submission) or slashed (rejected submission)
4. Distribute!

### Default Distribution Logic

We've provided some default distribution logic that will work for many tasks. We:

1. Distribute the round bounty equally between all valid submissions
2. Take 70% of the stake for invalid submissions

The full distribution logic is available [here](../Lesson%201/ez-testing-task/4-distribution.js)

This function must return an object with submitter's public keys as the keys and their reward amount (negative if a penalty) as the value.

#### Walkthrough

We start out with an empty list and an array to store the public keys of the submitters who made valid submissions:

```js
const distributionList = {};
const approvedSubmitters = [];
```

Next, we iterate through the list of submitters. If they have no votes, they receive neither a reward nor a penalty. If their votes are negative, we issue a penalty, which is a percentage of the submitter's stake (in this case, we've set SLASH_PERCENT to 0.7). If their votes are positive, we add them to the list of submitters who will receive a reward.

```js
for (const submitter of submitters) {
  if (submitter.votes === 0) {
    distributionList[submitter.publicKey] = 0;
  } else if (submitter.votes < 0) {
    const slashedStake = submitter.stake * SLASH_PERCENT;
    distributionList[submitter.publicKey] = -slashedStake;
    console.log("CANDIDATE STAKE SLASHED", submitter.publicKey, slashedStake);
  } else {
    approvedSubmitters.push(submitter.publicKey);
  }
}
```

Finally, we divide the bounty per round by the number of people who will receive a reward and we distribute the reward equally among them. We finish off by returning the completed distribution list.

```js
const reward = Math.floor(bounty / approvedSubmitters.length);
console.log("REWARD PER NODE", reward);
approvedSubmitters.forEach((candidate) => {
  distributionList[candidate] = reward;
});
return distributionList;
```

### Shared Data

One thing to note about generating distribution lists is that only one node per round is chosen to generate the list. Once this list is generated, it needs to be shared and audited by other nodes, similar to regular audit logic. So remember, there are two audits:

1. Auditing a node's task work
2. Auditing the round's distribution list

Data can be shared to all nodes in the network by fetching a list of all the other nodes, and comparing their stored data with yours. Using timestamps, you can verify who has the most recent data and use the latest information, similar to [Link State routing](https://en.wikipedia.org/wiki/Link-state_routing_protocol).

If you want to learn more about data sharing across a task, [click here](https://docs.koii.network/develop/linktree/data-sharing).

Just like that we've successfully gone through both audit and distribution mechanisms and we're now ready to write our own.

<!-- Now let's try building our own audit and distribution mechanisms in [Part IV](./PartIV.md) -->

Now let's try building our own audit and distribution mechanisms in [Part III](./PartIII.md)
