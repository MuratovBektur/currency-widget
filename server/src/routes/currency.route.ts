import express from "express";
import currencyController from "../controllers/currency.controller";

const currencyRoute = express.Router();

currencyRoute.get("/", (req, res) => {
  res.json("currencyRoute");
});
currencyRoute.get("/all", currencyController.getAll);
currencyRoute.get("/:id", currencyController.getById);

export default currencyRoute;
