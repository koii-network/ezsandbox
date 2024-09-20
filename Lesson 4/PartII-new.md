# Lesson 4: Auditing & Distribution

## Part II: Advanced Auditing Techniques

Now that we've covered some of the basics of writing an audit, let's talk about how to write a good one.

Prerequisites:

- General understanding of [gradual consensus and task flow](https://docs.koii.network/concepts/what-are-tasks/what-are-tasks/gradual-consensus)
- Understanding of [audit mechanisms](./PartI.md)

To understand why audits are so important, you need to understand this key fact: *Your task executable can be changed by anyone*. In fact, we used `prod-debug` in Lesson 1 to do just that! And it gets even worse: anyone can make a submission to your task directly on the blockchain, without ever having *seen* your task code.

### Zero Trust

In cybersecurity, there is a principle called zero trust. Its fundamental principle is "never trust, always verify", and that's what we have to do when we write a Koii task. This can seem like an overwhelming task,  so let's talk about some of the common problems you could encounter and how to deal with them.

### Fake Data

In all of the audits we've discussed so far, a node could pass audit by simply supplying data of the correct shape. In the simple crawler example, we have no way of knowing if the post titles we get back are from redflagdeals or not. The strategy to deal with this is simple but resource heavy: auditing nodes perform the same work and confirm whether it matches the submitted proofs or not. You can use sampling and check only a portion of the work if necessary. If there's a possibility the data has changed between submission and audit, you can add some tolerance (e.g. prices can by 5% higher or lower, 80% of results should match). It's important here to balance between ensuring your data is correct and avoiding unfair penalties for honest nodes.

This still may not be enough, however. It is possible for nodes to submit data from the right source, but that doesn't guarantee it's the data you want. Going back to our redflagdeals example, you could check that the post titles belong to actual posts on the forum, but that won't tell you whether or not they showed up for the search query - you don't even know what keyword they chose! A user could simply grab titles from random pages. The solution to this is to make users submit more information in their proofs. In this case, a pretty good options would be to get the search query, the links to the pages that were found, and the titles of those pages. Because search pages keep updating as new content is added, you can check if the pages they provided actually show up in the search results for that query.

### Duplicate Data

Another way for a node to make a valid submission is to copy an existing valid submission. There are a few possibilities here:

1. A node resubmits its own valid submission as a new one.
2. One node provides a valid submission to a group of nodes and all of them make the same submission.
3. A node takes another node's submission from the blockchain and resubmits it as their own before the submission window closes.

#### Resubmitting a valid submission from a previous round

Let's continue with the redflagdeals example - what if the search term they choose is uncommon and the results don't change very often? Then they could keep submitting the same post titles over and over without performing the search again. This could go one for days, the node simply collecting rewards without doing anything to earn them. There are a couple of ways you can deal with this:

- If the data you're collecting is timestamped in some way, you can exclude results that are too old.
- Make sure the task is different each round. For example, you might want to assign a different keyword each round.

#### Passing a valid submission to other nodes

Because many nodes are making the same submission in the same round, the data would be valid for all of them during that round. The solution here is to make sure you're not assigning the exact same task to all nodes, so that they are not able to duplicate their submissions. This requires you to keep track of which work each node should be doing.

#### Stealing a valid submission

The solution here involves 
