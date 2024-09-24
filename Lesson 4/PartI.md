# Lesson 4: Auditing & Distribution

## Part I: Auditing Concepts

![Lesson 4](https://github.com/koii-network/ezsandbox/assets/66934242/dce7f56b-02e9-4e75-8fef-1e4b8ecf0f95)

If you recall from [Lesson 1](../Lesson%201/PartIII.md), we discussed how tasks are able to do work, verify each other's work, then distribute rewards based on those verified results. We've touched briefly on auditing, but for the most part we've focused on building out the task side of things i.e, we've only built the "work" part of a Koii task.

Auditing is the next big step for us as it helps us ensure that our tasks are being run properly and it prevents bad actors from exploiting us for free rewards. You can typically find a task's audit logic in `task/audit.js`.

Prerequisites:

- General understanding of [gradual consensus and task flow](https://docs.koii.network/concepts/what-are-tasks/what-are-tasks/gradual-consensus)
- Lessons 1-3 completed

### The Purpose of Audits

One of the potential concerns with using other people's machines as a decentralized solution for your compute resources is that you can't necessarily trust them to do it. Without having a way to verify their work, you're essentially hiring an employee and trusting them to do all the work assigned without any sort of reviews.

The solution is to allow other nodes to check each other's work... but this introduces another problem. Think about asking someone to calculate a math sum. How do you verify their answer is correct? You do the calculation yourself. If there were two nodes in the network, each one would only be able to do half as much work, because 50% of their time would be spent repeating the calculations of the other node. The solution to this problem is _controlled redundancy_.

### Controlled Redundancy

When you create your task's audit mechanism, you can decide exactly how much you need to review work. If you have a mission critical task, then you may require 20 nodes to verify a result before you're able to confidently claim that it's correct. For a different task, such as a simple addition, maybe you're confident that only 2 nodes need to verify as result. Koii gives you the freedom to scrutinize work with a customizable level of control, enabling you to make those decisions precisely for your use case.

You could even start off with a highly redundant system and slowly reduce the amount of audits that are done based on a node's reputation. [Learn more about reputation here](https://docs.koii.network/concepts/what-are-tasks/designing-tasks/using-reputation#definition-of-carp)

### Audit Operations

While writing your own audit might seem difficult, you can think of it as a combination of basic operations.

Different types of tasks can be grouped based on their mechanism. For example, every web crawler task will have a similar audit system. With more complicated tasks, you can break down your requirements into more basic steps to better conceptualize the audit mechanism.

We've mentioned some of the audit mechanisms in the previous lessons, but let's go over them again:

#### 0. Trivial Example

```javascript
return true;
```

The simplest possible audit is no audit: we're simply returning true for the vote no matter what. This is useful for tasks that don't require an audit, but if you're distributing rewards, it's a bad idea.

#### 1. Lesson 1: [EZ Testing](../Lesson%201/ez-testing-task/3-audit.js)

```javascript
return submission === "Hello, World!";
```

This task's job is to simply submit a hardcoded value, `Hello, World!`. This makes our audit logic rather simple, if the submitted value is anything other than `Hello, World!` then we know that something has gone wrong and we can vote against this submission.

While this is a great starter example for learning how a Koii task works, you'll almost always want your tasks to return dynamic data as a submission.

#### 2. Lesson 2: [UPnP Basics](../Lesson%202/upnp-basics/src/task/3-audit.js)

```javascript
return typeof submission === "string" && submission.length > 0;
```

#### 3. Lesson 2: [File Sharing](../Lesson%202/file-sharing/task/3-audit.js)

```javascript
const fileContent = await getFileText(submission);
return typeof fileContent === "string" && fileContent.length > 0;
```

In these two tasks, we allowed nodes to return a secret of their choice. This means there isn't a single consistent value to be checked, which is closer to how a real task would work. Here we check the type of the data rather than its value; while this is often a useful step in your audit, it's not enough on its own.

#### 4. Simple Crawler Task - [Lesson 3](../Lesson%203/simple-crawler/task/3-audit.js)

```javascript
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
```

This is a common pattern for scraped data - you want to validate not just the type but also the shape of the data. However, like the audits before it, there are two serious issues:

1. There is no way to know if the data you're getting is the data you want.
2. Any node can make a submission and get a reward, whether they've performed the task or not.

<!-- Let's see how we could make our audits better in [Part II](./PartII.md) -->

Now let's take a look at distribution concepts in [Part II](./PartII.md)
