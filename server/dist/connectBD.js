"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mongoose_1 = __importDefault(require("mongoose"));
var connectBD = function () {
    mongoose_1["default"].connect("mongodb+srv://user:user@cluster0.cnakz.mongodb.net/currencies?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true });
};
mongoose_1["default"].set("useFindAndModify", false);
process.on("SIGINT", function () {
    mongoose_1["default"].connection.close(function () {
        console.log("Mongoose disconnected on app termination");
        process.exit(0);
    });
});
exports["default"] = connectBD;
