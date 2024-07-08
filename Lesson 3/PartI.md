# Lesson 3: Secrets & Config

_**DISCLAIMER**: This should only be used for educational and legal purposes such as publicly archiving data. Koii does not condone using tasks to steal data or infringe on personal privacy_

## Part I. Secrets

One of the best use cases for Koii tasks is web crawling. While there are many webpages that allow users to endlessly scroll without having an account, most content-based websites only give a small snippet of content without logging in. An autonomous web crawler has limited usefulness without a means to login.

This is where secrets become very handy!

### Secrets in Your Node

If you have explored the Node enough, you may have noticed that some tasks require **Task Extensions** before you're able to run them. These task extensions are secrets, similar to environment variable in a .env file.

![Archive Twitter Task Extensions](./imgs/secrets-example.png)

Secrets allow a user to save private information so that we can use it without ever having access to the actual values. With the help of secrets, your crawler task can easily utilize a user's account to login, get full access to a webpage's content, and start archiving information.

### Secrets in Task Development

In [Lesson 2](../Lesson%202/README.md), we added something to our `task-config.yml` requirements section to make UPnP configuration work. Now, we can see that a task developer can also use the requirements section to specify any number of secrets they may need for a task to function! For example, this is `Archive Twitter's` requirements section:

```yml
requirementsTags:
- type: TASK_VARIABLE
  value: 'TWITTER_USERNAME'
  description: 'The username of your volunteer Twitter account.'
- type: TASK_VARIABLE
  value: 'TWITTER_PASSWORD'
  description: 'The password of your volunteer Twitter account.'
- type: TASK_VARIABLE
  value: 'TWITTER_PHONE'
  description: 'If verification is required, will use your phone number to login.'
- type: CPU
  value: '4-core'
- type: RAM
  value: '5 GB'
- type: STORAGE
  value: '5 GB'
```

(You can look at the `Twitter Archive` task more in depth [here](https://github.com/koii-network/task-X).)

As you can see, each task extension has a corresponding value and description, which will be used by the Node. These task extensions will be automatically linked as environment variables for your use and can be accessed just like an entry in your .env, e.g. `process.env.TWITTER_USERNAME`

One final thing to note is that during development, you must specify your own copies of each variable in the `.env` file. In this example, it means your `.env` will contain TWITTER_USERNAME, TWITTER_PASSWORD, TWITTER_PHONE, etc.

Effectively, adding requirements allows you to build a .env on the user's computer, which can be used when they run the task code.
