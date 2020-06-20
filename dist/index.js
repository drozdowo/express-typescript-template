"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var config_js_1 = __importDefault(require("../config.js"));
var app = express_1.default();
app.listen(config_js_1.default.port, function () {
    console.log("Listening on port " + config_js_1.default.port);
});
app.get("/app", function (req, res) {
    res.send("Hello");
});
