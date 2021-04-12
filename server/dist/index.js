"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var api_route_1 = __importDefault(require("./routes/api.route"));
var app = express_1["default"]();
var port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4000;
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
var start = function () {
    try {
        app.use(express_1["default"].json());
        app.use("/api", api_route_1["default"]);
        app.get("/", function (request, response) {
            response.send("Hello world!");
        });
        app.listen(port, function () { return console.log("Running on port " + port); });
    }
    catch (e) {
        console.error(e);
    }
};
start();
