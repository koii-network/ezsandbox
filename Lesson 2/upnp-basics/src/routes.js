export function setupRoutes(app) {
  if (app) {
    app.get("/secret", async (_req, res) => {
      res.status(200).json({ secret: process.env.SECRET });
    });
  }
}
