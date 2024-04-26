function setupRoutes(app) {
  //  Write your Express Endpoints here.
  //  Ex. app.post('/accept-cid', async (req, res) => {})

  // Sample API that return your task state
  app.get('/taskState', async (req, res) => {
    const state = await namespaceWrapper.getTaskState();
    console.log('TASK STATE', state);
    res.status(200).json({ taskState: state });
  });

  // Sample API that return the value stored in NeDB
  app.get('/value', async (req, res) => {
    const value = process.env.VALUE;
    console.log('value', value);
    res.status(200).json({ value: value });
  });
}

module.exports = setupRoutes;
