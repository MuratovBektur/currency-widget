"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mongoose_1 = __importDefault(require("mongoose"));
var axios_1 = __importDefault(require("axios"));
var Schema = mongoose_1["default"].Schema;
var currencyScheme = new Schema({ date: String, currencies: [{ name: String, rate: Number }] }, { versionKey: false });
currencyScheme.set("toJSON", {
    transform: function (document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
var Currency = mongoose_1["default"].model("currency", currencyScheme);
var loadToDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data_1, date, transformedData, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, Currency.deleteMany({})];
            case 1:
                _a.sent();
                return [4 /*yield*/, axios_1["default"].get("https://api.openrates.io/latest")];
            case 2:
                data_1 = (_a.sent()).data;
                date = data_1.date;
                transformedData = Object.keys(data_1.rates).map(function (name, index) { return ({
                    name: name,
                    rate: data_1.rates[name]
                }); });
                return [4 /*yield*/, Currency.create({ date: date, currencies: transformedData })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var CurrencyModel = /** @class */ (function () {
    function CurrencyModel() {
    }
    CurrencyModel.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var docs, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, loadToDB()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Currency.find({})];
                    case 2:
                        docs = _a.sent();
                        return [2 /*return*/, JSON.stringify({
                                success: true,
                                date: docs[0].date,
                                currencies: docs[0].currencies.map(function (currency) { return ({
                                    id: currency._id,
                                    name: currency.name,
                                    rate: currency.rate
                                }); })
                            })];
                    case 3:
                        e_2 = _a.sent();
                        return [2 /*return*/, JSON.stringify({
                                success: false,
                                reason: e_2.message
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CurrencyModel.prototype.getById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var doc, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Currency.findOne({ _id: id })];
                    case 1:
                        doc = _a.sent();
                        if (doc === null) {
                            return [2 /*return*/, JSON.stringify({
                                    success: false,
                                    reason: {
                                        message: "Can't found record with received id"
                                    }
                                })];
                        }
                        return [2 /*return*/, JSON.stringify({
                                success: true,
                                currency: doc
                            })];
                    case 2:
                        e_3 = _a.sent();
                        console.error(e_3);
                        return [2 /*return*/, JSON.stringify({
                                success: false,
                                reason: e_3.message
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CurrencyModel;
}());
exports["default"] = new CurrencyModel();
