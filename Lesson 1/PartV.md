# Lesson 1: Introduction to Koii Tasks

## Part V: Containerized ORCA Tasks (optional)

Although many Koii tasks can be written exclusively in Javascript, there are many cases where it may be preferable to use a different language, or you may need advanced configurations with additional services. For these cases, we provide integration with Orca, allowing you to run your task in a Docker container while still interacting with the Koii blockchain.

### Step 1: Get the task template

Orca tasks require a specialized task template that handles the interaction between your container and the blockchain. Clone [this template](https://github.com/koii-network/orca-task-template) to start developing an Orca task. The README covers the specific of how to integrate your container.

### Step 2: Prepare your container

If you're starting from scratch, we provide a simple example container with a minimal Flask server, demonstrating how to set up the necessary endpoints.

If you are modifying an existing container, you will need to ensure that it is running an HTTP server on port 8080 with the following endpoints:

- `/healthz`: To verify your container is running, Orca requires an endpoint at that accepts a post request and returns a 200 response. The content of the response is unimportant.
- `/task/:roundNumber`. This endpoint should kick off the task each round, and store the result of the task (your proofs) with the round number, so it can be retrieved by `submission`. This will require a database solution of your choice, managed from within the container.
- `/submission/:roundNumber` Retrieves the stored submission data.
- `/audit`: Check the submission (using whatever method makes sense for your task) and return a boolean representing whether or not the submission was correct.

### Upload your container

You will need to store your container image in a publicly-accessible container repository like Docker Hub.

### Update the settings file

Once uploaded, update your image url in `OrcaSettings.js`. If you have a more complex configuration, you can define a Kubernetes pod spec. See the example provided; your primary container name _must_ be as shown, and the basePath must be included if adding additional volumes.

### Deploy

Deploy a KOII or KPL task just as you normally would!
