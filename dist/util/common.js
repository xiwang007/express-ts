"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPublic = exports.GetPrivate = exports.Mysql = exports.host = exports.GetPath = exports.sendEmail = exports.checkedType = exports.Log = exports.rootPath = exports.hh = exports.Nowtime = void 0;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mysql_1 = __importDefault(require("mysql"));
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * 获取现在时间的字符串
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
 * 这个变量控制是否打印log
 */
let mylog = true;
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
 * 判断数据类型
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const checkedType = function (target) {
    return Object.prototype.toString.call(target).slice(8, -1);
};
exports.checkedType = checkedType;
/**
 *
 * 发送邮件给自己 (xxxxxx 内容需要自行填入)
 * import * as common from "./common"
 * 使用1:
 * common.sendEmail("主标题","39xxxxxx@qq.cm","副标题","消息内容~",function(err:any){
 *     if(err){
 *         return;
 *     }
 * });
 *
 * 使用2:
 * common.sendEmail("主标题","39xxxxxx@qq.cm","副标题","消息内容~");
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const sendEmail = function (aliasName, to, subject, msg, callback = null) {
    // npm i nodemailer -S
    // npm i @types/nodemailer --save-dev
    // let nodemailer=require("nodemailer")
    // import nodemailer from "nodemailer"
    const options = {
        //QQ邮箱发件服务器是smtp.qq.com，企业邮箱是：smtp.exmail.qq.com
        host: "smtp.qq.com",
        //secureConnection: true, // use SSL
        port: 465,
        secure: true,
        auth: {
            user: "xxxxxx@qq.com",
            pass: "xxxxxx" // generated ethereal password
        }
    };
    const transporter = nodemailer_1.default.createTransport(options);
    const from = "xxxxxx@qq.com";
    transporter.sendMail({
        //from    : '标题别名 <foobar@latelee.org>',
        from: aliasName + " " + "<" + from + ">",
        //'li@latelee.org, latelee@163.com',//收件人邮箱，多个邮箱地址间用英文逗号隔开
        to: to,
        subject: subject,
        //text    : msg,
        html: msg
    }, callback);
};
exports.sendEmail = sendEmail;
/**
 * Path 为项目根目录后面的目录
 * 返回绝对路径
 */
const GetPath = (Path) => {
    return path_1.default.join(exports.rootPath, Path);
};
exports.GetPath = GetPath;
/**
 * 数据库 host
 */
exports.host = {
    host: "localhost",
    user: "root",
    password: "zf2JkTbwAm@N5zZ",
    database: "test",
    // charset:"UTF8MB4_GENERAL_CI",
    // charset:"utf8mb4_unicode_ci",
    charset: "utf8mb4",
};
/**
 * Mysql函数
 * 这边是使用示范
 * 这边add 是为了防注入的
 * 有时候查询的信息是用户提供的 防止注入,把所有不放心的数据放到数组里面MySQL会进行处理然后再查询
 * 数组的顺序和查询语句里面的问号是一致的,最后处理好了会进行替换查询
 * common.Mysql("select * from users WHERE users.id=?;", function (err, data) { }, [1])
 */
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
// web ===============================================================
/**
 * 私钥
 */
let privateKye = "";
/**
 * 公钥
 */
let publicKye = "";
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
//# sourceMappingURL=common.js.map