function setupRoutes(app) {
  //  Write your Express Endpoints here.
  //  Ex. app.get('/value', async (req, res) => {})

  // Sample API that return your task state
  app.get('/taskState', async (req, res) => {
    const state = await namespaceWrapper.getTaskState();
    console.log('TASK STATE', state);
    res.status(200).json({ taskState: state });
  });
}

module.exports = setupRoutes;
