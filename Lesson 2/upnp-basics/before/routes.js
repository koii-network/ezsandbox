function setupRoutes(app) {
    app.get('/taskState', async (req, res) => {
     // Example endpoint; returns task state
      const state = await namespaceWrapper.getTaskState();
      console.log('TASK STATE', state);
      res.status(200).json({ taskState: state });
    });

    app.get('/value', async (req, res) => {
        const value = process.env.VALUE;
        console.log('value', value);
        res.status(200).json({ value: value });
      });

      app.get('/value2', async (req, res) => {
        const value = process.env.VALUE;
        console.log('value', value);
        res.status(200).json({ value: value });
      });
  }
  
  module.exports = setupRoutes;