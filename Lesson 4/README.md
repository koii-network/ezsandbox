# Lesson 4: Auditing & Distribution

## Part I: Auditing Concepts

![Lesson 4](https://github.com/koii-network/ezsandbox/assets/66934242/dce7f56b-02e9-4e75-8fef-1e4b8ecf0f95)

If you recall from [Lesson 1](../Lesson%201/PartIII.md), we discussed how tasks are able to do work, verify each other's work, then distribute rewards based on those verified results. We've touched briefly on auditing, but for the most part we've focused on building out the task side of things i.e, we've only built the "work" part of a Koii task.

Auditing is the next big step for us as it helps us ensure that our tasks are being run properly and it prevents bad actors from exploiting us for free rewards. You can typically find a task's audit logic in `task/audit.js`.

Prerequisites:

- General understanding of [gradual consensus](https://docs.koii.network/concepts/what-are-tasks/what-are-tasks/gradual-consensus) and task flow
- Lessons 1-3 completed

### The Purpose of Audits

One of the potential concerns with using other people's machines as a decentralized solution for your compute resources is that you can't necessarily trust them to do it. Without having a way to verify their work, you're essentially hiring an employee and trusting them to do all the work assigned without any sort of reviews.

The solution is to allow other nodes to check each other's work... but this introduces another problem. Think about asking someone to calculate a math sum. How do you verify their answer is correct? You do the calculation yourself. If there were two nodes in the network, each one would only be able to do half as much work, because 50% of their time would be spent repeating the calculations of the other node. The solution to this problem is _controlled redundancy_.

### Controlled Redundancy

When you create your task's audit mechanism, you can decide exactly how much you need to review work. If you have a mission critical task, then you may require 20 nodes to verify a result before you're able to confidently claim that it's correct. For a different task, such as a simple addition, maybe you're confident that only 2 nodes need to verify as result. Koii gives you the freedom to scrutinize work with a customizable level of control, enabling you to make those decisions precisely for your use case.

You could even start off with a highly redundant system and slowly reduce the amount of audits that are done based on a node's reputation. [Learn more about reputation here](https://docs.koii.network/concepts/what-are-tasks/designing-tasks/using-reputation#definition-of-carp)

### Audit Operations

While writing your own audit might seem difficult, you can think of it as a combination of basic operations, similar to BEDMAS. Different types of tasks can be grouped based on their mechanism. For example, every web crawler task will have a similar audit system. With more complicated tasks, you can break down what your requirements into more basic steps to better conceptualize the audit mechanism.

We've mentioned some of the audit mechanisms in the previous lessons, but let's go over them again:

#### 0. Trivial Example

```javascript
  async validateNode(submission_value, round) {
    console.log('SUBMISSION VALUE', submission_value, round);
    return true;
  }
```

As you can see with this audit logic, we're simply returning true for the vote no matter what. While this seems trivial, it is useful in cases where a task doesn't require an audit.

#### 1. Hello World Task - [Lesson 1](../Lesson%201/EZ-testing-task/task/audit.js)

```javascript
  async validateNode(submission_value, round) {
    let vote;
    console.log('SUBMISSION VALUE', submission_value, round);
    try {
      // Verify the value
      if (submission_value == 'Hello, World!') {
        vote = true;
      } else {
        vote = false;
      }
    } catch (e) {
      console.error(e);
      vote = false;
    }
    return vote;
  }
```

This task's job is to simply submit a hardcoded value, `Hello, World!`. This makes our audit logic rather simple, if the submitted value is anything other than `Hello, World!` then we know that something wrong has happened and we can vote against this submission.

This audit operation is great when you have a deterministic value that you're looking for as a result, but this doesn't necessarily mean you need to hard code. For example, if you wanted to build a task that does prime factorization, then you could multiply the returned factors and confirm they match the original number.

#### 2. UPnP Task - [Lesson 2](../Lesson%202/upnp-basics/after/task/audit.js)

```javascript
  async validateNode(submission_value, round) {
    let vote;
    console.log('SUBMISSION VALUE', submission_value, round);
    try {
      // Verify the type of value is string
      if (typeof submission_value === 'string' && submission_value.length > 0) {
        vote = true;
      } else {
        vote = false;
      }
    } catch (e) {
      console.error(e);
      vote = false;
    }
    return vote;
  }
```

In this task, we allowed nodes to act as both a server and a client. As servers, nodes were exposing an API endpoint with a value and as clients, nodes were retrieving values from that endpoint. This means there isn't a deterministic value because every nodes endpoint may offer a different value.

Instead, we can create an audit mechanism that health checks the endpoints by ensuring the retrieved value exists and is of an expected type. Another example of where this kind of audit may come in handy is when the fetched data follows a specific kind of structure, such as a `json` file. If you know the type or shape of the data, you can verify that and let the value be arbitrary.

#### 3. Simple Crawler Task - [Lesson 3](../Lesson%203/simple-crawler/after/task/audit.js)

```javascript
  async validateNode(submission_value, round) {
    try {
      return SimpleCrawlerTask.retrieveAndValidateFile(submission_value);
    } catch (e) {
      console.log('Error in validate:', e);
      return false;
    }
  }
```

This type of audit follows the same general format of fetching the stored data to ensure it exists. All web crawlers can follow this audit pattern.

Additionally, you can see that audit logic can be made to be modular and flexible to your own needs which is why we decide to use a function from the crawler class for better organization.

Now that we understand some of the basic audit operations, lets discuss how we distribute rewards!

#### File Sharing Task - [Lesson 2](../Lesson%202/file-sharing/after/task/audit.js)

```javascript
try {
  console.log("AUDIT ROUND", round);
  // The submission value is the CID
  return isValidFile(submission_value);
} catch (e) {
  console.log('Error in validate:', e);
  return false;
}
```

[isValidFile() utility function](../Lesson 2/file-sharing/after/task/fileUtils/isValidFile.js)

```javascript
const { KoiiStorageClient } = require('@_koii/storage-task-sdk');

async function isValidFile(cid, filename = 'value.json') {
  const client = new KoiiStorageClient();

  try {
    const fileBlob = await client.getFile(cid, filename);
    if (!fileBlob) return false;

    const fileContent = await fileBlob.text();
    return typeof fileContent === 'string' && fileContent.length > 0;

  } catch (error) {
    console.error('Failed to download or validate file from IPFS:', error);
    throw error;
  }
}

module.exports = isValidFile;
```

This audit combines elements of the UPnP and Simple Crawler tasks - it verifies that a file exists and also checks that the contents of the file match the expected format.

### Controlling the Number of Auditing Nodes

In some cases, you may want to set the number of nodes you'd like to perform an audit each round. For this, you can add custom logic to the `validateAndVoteOnNodes()` function. Note that unlike other functions we've worked with before, this one is located in [`NamespaceWrapper`](./caesar-task/_koiiNode/koiiNode.js#L657). You can see an example from the Twitter Archive task [here](https://gitlab.com/koii-network/dev-blue/task-X/-/blob/main/namespaceWrapper.js?ref_type=heads#L579-592)

Now let's take a look at distribution concepts in [Part II](./PartII.md)
