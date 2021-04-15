import express from "express";

import apiRouter from "./routes/api.route";
import connectBD from "./connectBD";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json("error");
});

const start = async (): Promise<void> => {
  try {
    await connectBD();
    app.use(express.json());
    app.use("/api", apiRouter);

    app.get("/", (request, response) => {
      response.send("Hello world!");
    });
    app.listen(port, () => console.log(`Running on port ${port}`));
  } catch (e) {
    console.error(e);
  }
};

start();
