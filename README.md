![banner_with_icon](https://github.com/koii-network/ezsandbox/assets/113378734/40046741-843f-47f4-9bf8-76a57198cc81)

Powered by [Koii](https://koii.network) - Over 60,000 community devices at your fingertips

Curious to see the source code? [Learn More](#open-source-roadmap)

# Welcome to EZSandbox

<img src="http://imagetracker.api.koii.network/tracker.png" width="350" title="hover text" style="max-width: 100%;" class="__web-inspector-hide-shortcut__">


In this series of workshops, we'll get you up and running to build your first community-hosted application in no time.

This sandbox will take you through a few phases of development to try using Koii Tasks at all levels.

1. Deploy Locally on your Koii Task Node to Debug and Iterate Rapidly

2. Deploy to Docker to test audits and incentive mechanisms

3. Launch on the Community Cloud

# Lessons and Code Samples

In this project, we'll start by demonstrating the key features of the Node compute environment. After some local testing, we'll harden our incentive mechanism and deploy it to the Koii cloud.

Koii is a network of people, using their nodes to support a diverse ecosystem of products and services, all operated by community members like you.

Decentralized Applications on the Koii Cloud run in modules called 'Tasks' and anyone can join by running a Koii Node, a program users install which manages and runs Tasks.

At the end of these tutorials, you'll be ready to build your first Koii Application that other community members can then run on their Node.

<br />
<br />

![Koii tasks](https://github.com/koii-network/ezsandbox/assets/113378734/04edd56a-04e8-4a9f-9b89-752ba046b3ad)

## Lesson 1: Introduction to Koii Tasks

In the first lesson, we'll set up a Koii Node and start debugging an existing Task.

This lesson will teach you:

- How to debug tasks live with your Node
- How Tasks run in the node
- How to connect to your node

[Start Here](./Lesson%201/README.md)

<br />
<br />

![Networking and storage](https://github.com/koii-network/ezsandbox/assets/5794319/14abeb3f-3cb3-4c08-b553-2aa5e2839828)

## Lesson 2: Networking and Storage Task

Once we've got the basics down, we can move on to writing a task of our own. We'll learn how to use networking and storage with the example of a simple file server. We'll also see how to deploy our app on a Dockerized node and test it out locally.

[Start Here](./Lesson%202/README.md)

<br />
<br />

![Secrets & Config](https://github.com/koii-network/ezsandbox/assets/113378734/2d6c43e6-d51b-4eca-80ce-2365ebafa881)

## Lesson 3: Secrets & Config

One of the best use cases for Koii nodes is to gather data from the web. In this tutorial, we'll show you how to use local secrets on your node, take a closer look at the config options, and learn how to build out a full web crawler that runs on any participating Task Nodes.

[Start Here](./Lesson%203/README.md)

<br />
<br />

![Auditing & Distribution](https://github.com/koii-network/ezsandbox/assets/113378734/d9ecac0d-7c89-4f8e-8038-5f0d77425c63)

## Lesson 4: Auditing & Distribution

We can now start to add audit and distribution mechanisms, learning more about how to verify work and define incentives. We'll also learn how data can be shared between nodes by looking at an example.

[Start Here](./Lesson%204/README.md)

<br />
<br />

![Security & Hardening](https://github.com/koii-network/ezsandbox/assets/113378734/a2c81c09-a108-483c-80f3-d1271cb2d339)

## Lesson 5: Security & Hardening

Now that you've seen several different types of tasks, this lesson will cover how to add authorized accounts, verify signatures, and manage general authentication and data authority issues.

[Start Here](./Lesson%205/README.md)

<br />
<br />

![Custom Tokens](https://github.com/koii-network/ezsandbox/assets/113378734/3b3c5c4b-ab28-4a49-9462-de7753586bdf)

## Lesson 6: Using Custom Tokens for Tasks

This lesson will teach you how to deploy your own custom KPL token on Koii.

[Start Here](./Lesson%206/README.md)

<br />
<br />

![Deployment](https://github.com/koii-network/ezsandbox/assets/113378734/e8bccde8-f815-41fc-9467-26cf982157e0)

## Lesson 7: Deploying your Task

Once everything is tightened down, it's time to get your community and start running nodes. We'll get you a small grant in KOII to fund your task bounty, deploy the task, and run it on your node.

[Start Here](./Lesson%207/README.md)

<br />
<br />

![Performance Improvements](https://github.com/koii-network/ezsandbox/assets/113378734/65327ccd-8abd-41d4-8719-c1b4f3ed9da4)

## Lesson 8: Performance Improvements

After your task is live, it's time to consider improving your work. In this final lesson, we'll cover some tips on debugging, multi-node simulations, and how to publish an update to your Task.

[Start Here](./Lesson%208/README.md)

<br />
<br />

# Open Source Roadmap
Koii is committed to being an open source project, but we are a small team and focused on improving developer and user experience at the moment.
- K2 has been audited by Halborn, a leading security firm and the original auditor of the Solana codebase which it was forked from. K2 is planned to be open sourced in mid July 2024. [Click here for the Full Audit Report](https://twitter.com/HalbornSecurity/status/1784862949581938785)
- The Task Node is currently being audited, and we plan to open source that codebase as soon as it has been fully audited. This decision was made to protect the community of node operators from any critical vulnerabilities, but we do offer the source code to community members, and you can ask to receive access by contacting us on [discord](discord.gg/koii-network). Usually these requests are resolved within 48 hrs.

## We are sorry that we can't do this sooner.
This code base has been rapidly iterated, with now over 70 versions, so it was only recently possible to begin audits and we are keen to open source the codebase right away.
