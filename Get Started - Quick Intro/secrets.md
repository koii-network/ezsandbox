# Secrets Quick Reference

Secrets (referred to as task extensions in the desktop node) are environment variables stored by node users. These can be accessed just as you would any other environment variable, using `process.env`. During development, these should be added to your .env file.

You can specify which environment variables a user must define in the `requirementsTags` section of your `config-task.yml` file, using the `TASK_VARIABLE` type.

Example:

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
```
