# Lesson 3: Secrets & Crawlers

This lesson covers how to use secrets to build out full web crawlers. Here is the lesson plan:

- [Part I. Secrets](./README.md) - Explains and showcases with an example how to implement and use secrets for tasks
- [Part II. Crawler Task Structure](./PartII.md) - Discusses a conceptual overview on what the crawler task structure entails and what the development plan is
- [Part III. Building a Crawler](./PartIII.md) - Walks through exactly how to build out a simple and customizable template for a web crawler

Prerequisites:

- Familiarity with creation and deployment of tasks

_**DISCLAIMER**: This should only be used for educational and legal purposes such as publicly archiving data. Koii does not condone using tasks to steal data or infringe on personal privacy_

## Part I. Secrets

One of the best use cases for Koii tasks is web crawling. While there are many webpages that allow users to endlessly scroll without having an account, most content-based websites only give a small snippet of content without logging in. An autonomous web crawler has limited usefulness without a means to login.

This is where secrets become very handy!

### Secrets in Your Node

If you have explored the Node enough, you may have noticed that some tasks require **Task Extensions** before you're able to run them. These task extensions are secrets, similar to environment variable in a .env file.

![Archive Twitter Task Extensions](./imgs/secrets-example.png)

Secrets allow a user to save private information so that we can use it without ever having access to the actual values. With the help of secrets, your crawler task can easily utilize a user's account to login, get full access to a webpage's content, and start archiving information - all without knowing their login credentials.

### Secrets in Task Development

In [Lesson 2](../Lesson%202/README.md), we added something to our `task-config.yml` requirements section to make UPnP configuration work. Now, we can see that a task developer can also use the requirements section to specify any number of secrets they may need for a task to function! The image below showcases `Archive Twitter's` requirements section:

<!-- TODO: Change to text -->
![Archive Twitter Requirements](./imgs/twitter-reqs.png)

(You can look at the `Twitter Archive` task more in depth [here](https://github.com/koii-network/task-X).)

As you can see, each task extension has a corresponding value and description, which will be used by the Node. These task extensions will be automatically linked as environment variables for your use and can be accessed just like an entry in your .env, e.g. `process.env.TWITTER_USERNAME`

One final thing to note is that during development, you must specify your own copies of each variable in the `.env` file. In this example, it means your `.env` will contain TWITTER_USERNAME, TWITTER_PASSWORD, TWITTER_PHONE, etc.

Effectively, adding requirements allows you to build a .env on the user's computer, which can be used when they run the task code.
