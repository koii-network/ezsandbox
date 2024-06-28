# Run Your First Task in 2 Min

1. Install and set up the [desktop node](https://www.koii.network/node).

2. Add the EZ testing task ID (`AK2P1L8NWGwWarbHeM7tX2mr4hJA7ZVXGSSSz5PWHBHv`) to your node using the Advanced option in the Add Task tab.

![Add EZ Testing Task](../Lesson%201/imgs/add-task-advanced.png)

3. Clone the [task template repo](https://github.com/koii-network/task-template).

4. Run `yarn prod-debug` to run the task in your node.

That's it! you can make changes to your task and it will update live in your node. You can add `process.env.TEST_KEYWORD` to your console logs to see them in your console, or you can view the entire task output in the task log file.

![View task log](../Lesson%201/imgs/my-node-open-logs.png)

## Going Further

Check out our quick reference guides:

- [Networking](./networking.md)
- [Storage](./storage.md)
- [Secrets](./secrets.md)
- [Security](./security.md)
- [KPL Tokens](./kpl-tokens.md)
- [Testing](./testing.md)
<!-- - [Configuration](./configuration.md) -->
- [Deployment](./deployment.md)
