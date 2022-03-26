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
exports.websiteConfig = exports.signOut = exports.islogin = exports.login = void 0;
// import { NextFunction } from "express";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common = __importStar(require("../../util/common"));
const OperationMySQL = __importStar(require("../../util/OperationMySQL"));
const login = (req, res) => {
    // http://localhost:8080/api/login?userid=1&pwd=8888
    console.log("api login req.userid =", req.userid); // 根据这个唯一用户ID来判断用户身份
    if (!req.body.name || !req.body.password) {
        res.json({
            state: 0,
            msg: "账号或者密码为空！"
        });
        return;
    }
    const name = req.body.name;
    const password = req.body.password;
    const privateKey = common.GetPrivate();
    if (!privateKey) {
        res.json({
            state: 0,
            msg: "系统错误!"
        });
        return;
    }
    new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE name=?  LIMIT 1";
        const add = [name];
        common.Mysql(sql, function (err, data) {
            if (err) {
                res.json({
                    state: 0,
                    msg: "异常错误！"
                });
                reject();
                return;
            }
            if (!data[0] || data[0].password !== password) {
                res.json({
                    state: 0,
                    msg: "用户或密码错误！"
                });
                reject();
                return;
            }
            resolve(data[0]);
        }, add);
    })
        .then((a) => {
        // 加密
        jsonwebtoken_1.default.sign({
            userid: a.id
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
            // res.redirect("/");
            res.json({
                state: 1,
                msg: "token生成成功!"
            });
        });
    });
};
exports.login = login;
/**
 * 是否已经登录
 */
const islogin = (req, res) => {
    if (req.userid != -1) {
        res.json({
            state: 1,
            msg: "已登陆！"
        });
        return;
    }
    else {
        res.json({
            state: 0,
            msg: "未登陆！"
        });
        return;
    }
};
exports.islogin = islogin;
/**
 * 退出登录
 */
const signOut = (req, res) => {
    res.clearCookie("token");
    res.json({
        state: 1,
        msg: "退出成功!"
    });
};
exports.signOut = signOut;
/**
 * 获取站点配置
 */
const websiteConfig = (req, res) => {
    console.log(req.body.website);
    OperationMySQL.QueryConfigVal("websiteConfig")
        .then((data) => {
        return new Promise((resolve, reject) => {
            let newData;
            try {
                newData = JSON.parse(data);
            }
            catch (_a) {
                console.log("websiteConfig 数据异常");
                res.json({
                    state: 0,
                    msg: "websiteConfig 数据异常,获取失败!"
                });
                return;
            }
            res.json({
                state: 1,
                msg: "获取成功!",
                data: newData
            });
        });
    })
        .catch(() => {
        res.json({
            state: 0,
            msg: "获取失败!"
        });
        return common.PromiseStop();
    });
};
exports.websiteConfig = websiteConfig;
//# sourceMappingURL=api.js.map