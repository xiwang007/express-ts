"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mysql = exports.host = exports.GetPublic = exports.GetPrivate = exports.GetPath = exports.Log = exports.rootPath = exports.hh = exports.Nowtime = void 0;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mysql_1 = __importDefault(require("mysql"));
/**
 * 这个变量控制是否打印log
 */
let mylog = true;
/**
 * 私钥
 */
let privateKye = "";
/**
 * 公钥
 */
let publicKye = "";
/**
 * 获取现在时间的字符串
 * @returns
 */
const Nowtime = () => {
    const newdate = new Date();
    const y = newdate.getFullYear();
    const m = (newdate.getMonth() + 1).toString().padStart(2, "0");
    const d = newdate.getDate().toString().padStart(2, "0");
    const h = newdate.getHours().toString().padStart(2, "0");
    const min = newdate.getMinutes().toString().padStart(2, "0");
    const s = newdate.getSeconds().toString().padStart(2, "0");
    const times = y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
    return times;
};
exports.Nowtime = Nowtime;
/**
 * 换行
 */
exports.hh = os_1.default.platform() == "win32" || os_1.default.tmpdir().indexOf(":\\") != -1 ? "\r\n" : "";
/**
 * 根目录
 */
exports.rootPath = path_1.default.join(__dirname, "../../");
/**
 * 获取是否显示日志状态/设置状态
 */
const Log = (get) => {
    if (get == undefined) {
        return mylog;
    }
    if (get) {
        return mylog = true;
    }
    else {
        return mylog = false;
    }
};
exports.Log = Log;
/**
 * Path 为项目根目录后面的目录
 * 返回绝对路径
 */
const GetPath = (Path) => {
    return path_1.default.join(exports.rootPath, Path);
};
exports.GetPath = GetPath;
/**
 * 获取token的私钥
 * @returns
 */
const GetPrivate = () => {
    if (privateKye) {
        return privateKye;
    }
    let temp = "";
    try {
        temp = fs_1.default.readFileSync(exports.GetPath("/key/private.key"), "utf-8");
        // console.log("私钥 =\n",temp);
    }
    catch (err) {
        temp = "";
        console.log("获取私钥失败 err=", err);
    }
    return privateKye = temp;
};
exports.GetPrivate = GetPrivate;
/**
 * 获取token的公钥
 * @returns
 */
const GetPublic = () => {
    if (publicKye) {
        return publicKye;
    }
    let temp = "";
    try {
        temp = fs_1.default.readFileSync(exports.GetPath("/key/public.key"), "utf-8");
        // console.log("公钥 =\n",temp);
    }
    catch (err) {
        temp = "";
        console.log("获取公钥失败 err=", err);
    }
    return publicKye = temp;
};
exports.GetPublic = GetPublic;
exports.host = {
    host: "localhost",
    user: "root",
    password: "zf2JkTbwAm@N5zZ",
    database: "test",
    // charset:"UTF8MB4_GENERAL_CI",
    // charset:"utf8mb4_unicode_ci",
    charset: "utf8mb4",
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Mysql = function (sql, callback, add = null) {
    const connection = mysql_1.default.createConnection(exports.host);
    connection.connect();
    //增删改
    if (add !== null) {
        connection.query(sql, add, callback);
    }
    else {
        //查
        connection.query(sql, callback);
    }
    connection.end();
};
exports.Mysql = Mysql;
//# sourceMappingURL=common.js.map