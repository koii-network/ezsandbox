# Lesson 3: Secrets & Crawlers

## Part II. The Task Config File

This is a good point to take a closer look at the `config-task.yml` file and understand what the various options mean.

```yaml
# Task Metadata - this will be displayed in the user's node in the task listing
task_name: 'task name'
author: 'Koii'
description: 'description'
repositoryUrl: 'https://github.com/koii-network/task-template'
imageUrl: 'imageUrl'

# This is the method used to manage the distribution of the task executable to the users' nodes. You will not usually need to change this
# Possible values: DEVELOPMENT, ARWEAVE or IPFS
# IPFS is the default value, as the CLI automatically manages the upload process via the Koii Storage SDK.
task_executable_network: 'IPFS'

# Path to your executable webpack if the selected network is IPFS
# If DEVELOPMENT name it as main
task_audit_program: 'dist/main.js'

# The total duration of your task, measured in slots (with each slot approximately equal to 408ms)
round_time: 1500
# The length in slots of the window for auditing submissions each round
audit_window: 350
# The length in slots of the window for ??
submission_window: 350

# The minimum amount of KOII that a user must stake in order to participate in the task
# Staked KOII can be retrieved when the user is finished running the task
# Staked KOII can be lost if the user's submission fails an audit
minimum_stake_amount: 1.9


# The total bounty amount that will be distributed to the task
## when updating a task, this cannot be
total_bounty_amount: 100
# must be less than or equal to total_bounty_amount
bounty_amount_per_round: 100

# allowed_failed_distributions: Number of times re-submission is allowed for the distribution list in case of an audit.
allowed_failed_distributions: 3

# space: Space in MBs for the account size, that holds the task data.
space: 1

# Note that the value field in RequirementTag is optional, so it is up to you to include it or not based on your use case.
# To add more global variables and task variables, please refer the type, value, description format shown below

requirementsTags:
  - type: CPU
    value: '4-core'
  - type: RAM
    value: '5 GB'
  - type: STORAGE
    value: '5 GB'

# ONLY provide the task_id and migrationDescription if you are updating the task otherwise leave blank
# Previous task id
task_id: ''

# A description of changes made in new version of task
migrationDescription: ''

```

<!-- TODO: More explanantion of how to choose values for some of these options -->

Now that we've discussed the config options, let's move on to writing our crawler task. [Part III. Building a Crawler](./PartIII.md)
