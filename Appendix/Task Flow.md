# Koii Task Flow

Tasks run in round-based cycles, similar to Epochs in a [Proof-of-History](https://www.youtube.com/watch?v=rywOYfGu4EA) flow. Round time can be configured by setting the `round_time` parameter in your `config-task.yml` file when deploying.

Each task has several different components. These components fall into two main types:

## Continuous

These are processes that start whenever a task is launched or rebooted. They include services such as:

<!-- TODO: Explanation for each of these -->
- REST APIs:
- Databases:
- Utility modules:

## Cyclical

Cyclical programs run every task round. Examples include:

<!-- TODO: Explanation for each of these -->
- Governance functions:
- Timed workloads:
