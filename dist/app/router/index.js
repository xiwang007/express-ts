"use strict";
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
exports.test = void 0;
// import { NextFunction } from "express";
const fs_1 = __importDefault(require("fs"));
const markdown_it_1 = __importDefault(require("markdown-it"));
const highlight_js_1 = __importDefault(require("highlight.js"));
// import * as console from "../log";
const common = __importStar(require("../../util/common"));
const md = new markdown_it_1.default({
    highlight: function (str, lang) {
        if (lang && highlight_js_1.default.getLanguage(lang)) {
            try {
                // return hljs.highlight(lang, str).value;
                return highlight_js_1.default.highlightAuto(str).value;
            }
            catch (__) { }
        }
        return ""; // 使用额外的默认转义
    }
});
// 使用模板
// 英文文档 https://pugjs.org/api/getting-started.html
// 中文文档 https://www.pugjs.cn/api/getting-started.html
/**
 * 测试展示页面
 */
const test = (req, res) => {
    fs_1.default.readFile(common.GetPath("/README.md"), function (err, data) {
        if (err) {
            return res.json({
                state: 0,
                msg: "Server busy, please try again later!~~~"
            });
        }
        const result = md.render(data.toString());
        res.render("webPage/test/test.pug", { title: "Hey", message: "Hello there!", result });
    });
};
exports.test = test;
//# sourceMappingURL=index.js.map