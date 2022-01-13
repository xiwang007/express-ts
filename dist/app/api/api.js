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
exports.mysql = exports.login = exports.test = void 0;
// import { NextFunction } from "express";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common = __importStar(require("../../util/common"));
const test = (req, res) => {
    res.json({
        url: req.url,
        state: 1,
        msg: "获取成功!"
    });
};
exports.test = test;
const login = (req, res) => {
    // http://localhost:8080/api/login?userid=1&pwd=8888
    console.log("api login req.userid =", req.userid); // 根据这个唯一用户ID来判断用户身份
    if (!req.query.userid || !req.query.pwd) {
        res.json({
            state: 0,
            msg: "用户信息错误!"
        });
        return;
    }
    const userid = parseInt(req.query.userid + "");
    if (userid + "" == "NaN") {
        res.json({
            state: 0,
            msg: "用户信息错误!"
        });
        return;
    }
    if (userid < 0) {
        res.json({
            state: 0,
            msg: "用户信息错误!"
        });
        return;
    }
    const privateKey = common.GetPrivate();
    if (!privateKey) {
        res.json({
            state: 0,
            msg: "系统错误!"
        });
        return;
    }
    // 加密
    jsonwebtoken_1.default.sign({
        userid: userid
    }, privateKey, 
    // { // 非对称加密
    //   key:privateKey,
    //   passphrase:"ceshi"
    // }, 
    {
        expiresIn: "30 days", //过期时间
        // algorithm:'RS256',// 加密方式默认是HS256（对称的）  RS256是非对称的
    }, function (err, token) {
        if (err) {
            res.json({
                state: 0,
                msg: "服务器繁忙，请稍后再试!"
            });
            return;
        }
        res.cookie("token", token, { maxAge: 2592000000, httpOnly: true }); // 30天过期
        res.json({
            state: 1,
            msg: "token生成成功!",
            token: token
        });
    });
};
exports.login = login;
/**
 * 这边是演示MySQL的使用
 */
const mysql = (req, res) => {
    // http://localhost:8080/api/mysql?id=2
    let id = parseInt(req.query.id + "");
    if (id + "" == "NaN" || id < 1) {
        id = 1;
    }
    const add = [id];
    // 这边add 是为了防注入的 
    // 有时候查询的信息是用户提供的 防止注入,把所有不放心的数据放到数组里面MySQL会进行处理然后再查询
    // 数组的顺序和查询语句里面的问号是一致的,最后处理好了会进行替换查询
    common.Mysql("select * from users WHERE users.id=?;", function (err, data) {
        if (err) {
            console.log(err);
            res.json({
                state: 0,
                msg: "查询失败!"
            });
            return;
        }
        if (data.length == 0) {
            res.json({
                state: 0,
                msg: "查询失败! id不存在!"
            });
            return;
        }
        res.json({
            state: 1,
            msg: "查询成功!",
            data: data[0]
        });
    }, add);
};
exports.mysql = mysql;
//# sourceMappingURL=api.js.map