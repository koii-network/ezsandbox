# Part II. Crawler Task Structure

Before we start writing our own crawler code, it's helpful to understand how many of Koii's web crawler tasks are structured, including this one. In this template, a lot of the IPFS logic is provided for your ease of use.

Prerequisites:

- General understanding of IPFS

## Submission.js

1. `task()`: In this function, we will create an instance of our Crawler Object to start the web crawling for a round. Whatever work gets done by the crawler will then be stored and submitted.

2. `storeFiles()`: This function is used to store the submissions in IPFS. It first has to create a json filed called `dealsData.json`, then, it rights this json file to IPFS. This will be later fetched with functions from the crawler object.

## Crawler Folder

This folder contains the core logic for the web crawling aspect of the task. For simplicity, we create a class called `SimpleCrawlerTask.js` which contains the various functions that will be utilized by the task. Feel free to organize the code in a way that makes sense to you.

Here are the key functions:

1. `crawl()`: If you're familiar with web crawling, this will be very familiar to you. If you're new to puppeteer, [click here](https://pptr.dev/)! In short, we'll be using puppeteer to go through each post on redflagdeals and add the title to a list. This list will be stored in IPFS later.

2. `retrieveAndValidateFile()`: This function is used by `fetchSubmission` in the task logic to grab a particular submission from IPFS. This acts as our `GET` function from the decentralized database.

## Environment Variable

As mentioned in the [first part of this lesson](./README.md), because we're working with secrets/task extensions, we also need to ensure that we have a local `.env` file defined. There is a `.env.example` file that you can use as a reference for your own!

Now that we have a better understanding of what to expect, we can go ahead and implement the crawler now!

[Click here to start PartIII. Building a Crawler](./PartIII.md)
