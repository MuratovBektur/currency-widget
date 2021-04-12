"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var currency_controller_1 = __importDefault(require("../controllers/currency.controller"));
var currencyRoute = express_1["default"].Router();
currencyRoute.get("/", function (req, res) {
    res.json("currencyRoute");
});
currencyRoute.get("/all", currency_controller_1["default"].getAll);
currencyRoute.get("/:id", currency_controller_1["default"].getById);
exports["default"] = currencyRoute;
