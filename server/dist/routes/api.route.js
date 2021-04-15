"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var currency_route_1 = __importDefault(require("./currency.route"));
var apiRouter = express_1["default"].Router();
apiRouter.use("/currency", currency_route_1["default"]);
apiRouter.get("/", function (req, res) {
    res.json("api");
});
exports["default"] = apiRouter;
