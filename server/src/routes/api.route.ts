import express from "express";

import currencyRoute from "./currency.route";

const apiRouter = express.Router();

apiRouter.use("/currency", currencyRoute);

apiRouter.get("/", (req, res) => {
  res.json("api");
});

export default apiRouter;
