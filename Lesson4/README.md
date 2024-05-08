# Lesson 4: Data Sharing & Replication Incentives

This lesson covers audit mechanisms and how to write different types of mechanisms for different tasks. Here is the lesson plan:

- [Part I. Auditing Concepts](./README.md) - Explains on a conceptual level how auditing works for tasks and showcases the different kinds of existing audit operations.
- [Part II. Distribution Concepts](./PartII.md) - Discusses how distributions work and showcases different distribution schemes
- [Part III. Building Audit and Distribution Mechanisms](./PartIII.md) - Walks through creating your own audit and distribution mechanism for a task.

Prerequisites:

- General understanding of gradual consensus and task flow
- Lesson 1-3 completion

## Part I. Auditing Concepts

If you recall from [Lesson 1](../Lesson%201/PartIII.md), we discussed gradual consensus and how tasks are able to do work, verify each other's work, then distribute rewards based on those verified results. So far, all we've really done as developers is build out the task side of things i.e, we've only built the "work" part of a Koii task.

Auditing is the next big step for us as it helps us ensure that our tasks are being run properly and it prevents bad actors from exploiting us for free rewards.

### The Purpose of Audits

One of the potential concerns with using other people's machines as a decentralized solution for your compute resources is that you can't necessarily trust them to do it. Without having a way to verify their work, you're essentially hiring an employee and trusting them to do all the work assigned without any sort of reviews.

The solution is to allow other nodes to check each other's work! But this introduces another problem...

For a problem such as calculating a math problem, how can you easily verify this? The only way is to also run through the same computation. With this, you effectively cut your computing resources in half since you have to do the same computation twice! This is where the idea of controlled redundancy is important.

### Controlled Redundancy

When you create your task's audit mechanism, you can decide exactly how much you need to review work. If I have a mission critical task, then I may require 20 nodes to verify a result before I'm able to confidently claim that it's correct. For a different task, such as a simple addition, maybe I'm confident that only 2 nodes need to verify as result. Koii gives you the freedom to scrutinize work with a customizable level of control, enabling you to make those decisions precisely for your use case.

You could even start off with a highly redundant system and slowly reduce the amount of audits that are done based on a node's reputation. [Learn more about reputation here!](https://docs.koii.network/concepts/what-are-tasks/designing-tasks/using-reputation#definition-of-carp)

### Audit Operations

While writing your own audit might seem difficult, you can think of it as a combination of basic operations, similar to BEDMAS. Different types of tasks can be grouped based on their mechanism. For example, every web crawler task will have a similar audit system. With more complicated tasks, you can break down what your requirements into more basic steps to better conceptualize the audit mechanism.

Without realizing it, the three tasks you've worked with so far in Lessons 1-3 all had different examples of basic audit operations. Lets discuss each:

#### 0. Trivial Example

```javascript
  async validateNode(submission_value, round) {
    console.log('SUBMISSION VALUE', submission_value, round);
    return true;
  }
```

As you can see with this audit logic, we're simply returning true for the vote no matter what. While this seems trivial, this kind of audit operation is useful in cases where a task doesn't necessarily require an audit or ACID transactions don't matter too much.

#### 1. Hello World Task - [Lesson 1](../Lesson%201/hello-world/task/audit.js)

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

This audit operation is great when you have a deterministic value that you're looking for as a result. This doesn't necessarily mean you need to hard code For example, if you wanted to build a task that does prime factorization, then the deterministic result would simply be the original number!

#### 2. UPnP Task - Lesson 2

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

Instead, we can create an audit mechanism that health checks the endpoints by ensuring the retrieved value exists and is of an expected type. Another example of where this kind of audit may come in handy is when the fetched data follows a specific kind of structure, such as a `json` file. If you know what kinds of data to expect, then the value of the data can be arbitrary!

#### 3. Simple Crawler Task - Lesson 3

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

```javascript
  async retrieveAndValidateFile(cid) {
    const client = new SpheronClient({ token: this.spheronApiKey });

    try {
      const upload = await client.getUpload(uploadId);
      if (upload) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to download or validate file from IPFS:', error);
      throw error;
    }
  }
```

In this case, we need a way to verify that nodes are correctly storing the data that has been archived from webpages. Because we're using Spheron, we can try to retrieve the data from IPFS based on its CID. You can further verify this data by referencing the link stored to check if it really exists online, but in the above example we excluded this for simplicity.

This type of audit can be extended or simplified as needed, but follows the same general format of fetching the stored data to ensure it exists. All web crawlers can follow this audit pattern.

Additionally, you can see that audit logic can be made to be modular and flexible to your own needs which is why we decide to use a function from the crawler class for better organization.

Now that we understand some of the basic audit operations, lets discuss how we distribute rewards!

[Click here to start PartII. Distribution Concepts](./PartII.md)
