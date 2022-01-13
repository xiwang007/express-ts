"use strict";
// 👇这个网址可以搜索ts d.ts文件
// https://www.typescriptlang.org/dt/search
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const init_1 = require("./app/init");
// 这边对原本的log进行了拦截,加上了时间和换行
const console = __importStar(require("./util/log"));
// router
const index = __importStar(require("./app/router/index"));
// api
const api = __importStar(require("./app/api/api"));
/**
 * 监听的端口
 */
const port = 8080;
const app = express_1.default();
init_1.init(app);
// router
app.get("/", (req, res) => res.redirect("/test"));
app.get("/test", index.test);
app.get("/404", (req, res) => res.render("webPage/404/404.pug"));
//api
app.get("/api", api.test);
app.get("/api/login", api.login);
app.get("/api/mysql", api.mysql);
// 剩下的没有匹配都转到404页面
app.use((req, res) => res.redirect("/404"));
app.listen(port, function () {
    console.log(`app is running ... at port=${port}`);
});
//# sourceMappingURL=app.js.map