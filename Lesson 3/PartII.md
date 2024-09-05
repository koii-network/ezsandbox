# Lesson 3: Secrets & Config

## Part II. The Task Config File

This is a good point to take a closer look at the `config-task.yml` file and understand what the various options mean.

```yaml
# Task Metadata - this will be displayed in the user's node in the task listing
task_name: 'task name' # Maximum 24 characters
author: 'Koii'
description: 'description'
repositoryUrl: 'https://github.com/koii-network/task-template' # Replace with your own repo URL
imageUrl: 'imageUrl'
infoUrl: 'infoUrl'

# This is the method used to manage the distribution of the task executable to the users' nodes. You will not usually need to change this
# Possible values: DEVELOPMENT, ARWEAVE or IPFS
# IPFS is the default value, as the CLI automatically manages the upload process via the Koii Storage SDK.
task_executable_network: 'IPFS'

# Path to your executable webpack if the selected network is IPFS
# If DEVELOPMENT name it `main`
task_audit_program: 'dist/main.js'

# The total duration of your task, measured in slots (with each slot approximately equal to 408ms).
# There are three stages (rounds). The task stage uses the entire round time.
# The submission stage submits task proofs during the submission window and audits them during the audit window. The remaining round time is a delay where no work is done.
# The distribution stage prepares the distribution list for rewards during the submission window and audits the distribution list during the distribution window. The remaining round time is used to distribute rewards.
round_time: 1500

# The length in slots of the window for submitting task proofs/ditribution list. The submission window should be at least 1/3 of the round time.
submission_window: 600

# The length in slots of the window for auditing submissions/distribution list each round. The audit window should be at least 1/3 of the round time.
audit_window: 600

# Minimum stake amount: The minimum amount of KOII (or KPL token if it's a KPL task) that a user must stake in order to participate in the task.
# Staked tokens can be recovered when the user is finished running the task
# Staked tokens can be lost if the user's submission fails an audit
minimum_stake_amount: 0.1

# Task Bounty Type: Can be KOII or KPL
task_type: 'KOII'

# ONLY if task type is KPL, otherwise ignored
# Token Mint Address. Fire Token address is given as an example here.
token_type: "FJG2aEPtertCXoedgteCCMmgngSZo1Zd715oNBzR7xpR"

# The total bounty amount that will be distributed to the task
# This cannot be changed when updating a task
total_bounty_amount: 10
# The maximum amount that can be distributed each round
# The actual amount distributed can be smaller than this value, but not larger
bounty_amount_per_round: 0.1

# Number of times the distribution list will be re-submitted if it fails audit.
# It's also the number of rounds of submission data that will be kept on chain.
allowed_failed_distributions: 3

# Space: Space in MBs for the account size, that holds the task data.
# For testing tasks this can be set to 0.1, but for production it should be set to at least 1.
space: 0.1

# Note that the value field in RequirementTag is optional, so it is up to you to include it or not based on your use case.
# To add more global variables and task variables, please refer to the type, value, description format shown below.

requirementsTags:
  - type: CPU
    value: '4-core'
  - type: RAM
    value: '5 GB'
  - type: STORAGE
    value: '5 GB'

# ONLY for updating a task, otherwise ignored
# Previous task ID. Every time you update the task, you should use the task ID from the previous update
task_id: ''

# Migration description: Provide the description for changes made in the new version of the task.
migrationDescription: ''
```

<!-- TODO: More explanation of how to choose values for some of these options -->

Now that we've discussed the config options, let's move on to writing our crawler task. [Part III. Building a Crawler](./PartIII.md)
