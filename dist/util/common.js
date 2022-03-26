"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = exports.PromiseResolve = exports.PromiseReject = exports.PromiseStop = exports.DeleteFile = exports.GetPublic = exports.GetPrivate = exports.GetPath = exports.Mysql = exports.host2 = exports.host = exports.sendEmail = exports.checkedType = exports.Log = exports.rootPath = exports.hh = exports.Nowtime = void 0;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mysql_1 = __importDefault(require("mysql"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const request_1 = __importDefault(require("request"));
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
 * 判断数据类型 Object Array Function String Boolean Null Undefined
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
 * 数据库 host 线上的 production
 */
exports.host = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "zf2JkTbwAm@N5zZ",
    database: "test",
    // charset:"UTF8MB4_GENERAL_CI",
    // charset:"utf8mb4_unicode_ci",
    charset: "utf8mb4",
};
/**
 * 数据库host 开发时用的本地数据库 dev
 */
exports.host2 = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "zf2JkTbwAm@N5zZ",
    database: "test",
    // charset:"UTF8MB4_GENERAL_CI",
    // charset:"utf8mb4_unicode_ci",
    charset: "utf8mb4",
};
// 这边根据环境 选择数据库
if (!process.env.NODE_ENV || process.env.NODE_ENV != "production") {
    for (const key in exports.host) {
        exports.host[key] = exports.host2[key];
    }
    console.log(exports.host);
}
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
 * Path 为项目根目录后面的目录
 * 返回绝对路径
 */
const GetPath = (Path) => {
    return path_1.default.join(exports.rootPath, Path);
};
exports.GetPath = GetPath;
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
/**
 * 删除文件 文件全路径
 */
const DeleteFile = (path) => {
    return new Promise((resolve, reject) => {
        fs_1.default.unlink(path, (err) => {
            if (err)
                return reject(err);
            resolve(undefined);
        });
    });
};
exports.DeleteFile = DeleteFile;
/**
 * 用于停止失败的Promise
 */
const PromiseStop = () => {
    //失败则停止执行后面的
    return new Promise(() => { return 1; });
};
exports.PromiseStop = PromiseStop;
/**
 * 用于传递失败的Promise
 */
const PromiseReject = (data) => {
    return new Promise((resolve, reject) => { reject(data); });
};
exports.PromiseReject = PromiseReject;
/**
 * 用于传递成功的Promise
 */
const PromiseResolve = (data) => {
    return new Promise((resolve, reject) => { resolve(data); });
};
exports.PromiseResolve = PromiseResolve;
/**
 * 一个简单封装了的request请求
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const request = function (options) {
    return new Promise((resolve, reject) => {
        // const options = {
        //     method: "GET",// GET POST
        //     url: "https://www.baidu.com/",
        //     isJson_: true,
        //     headers: { "content-type": "application/x-www-form-urlencoded" },
        //     // post 参数
        //     form: { demo: "example" },
        //     // get的参数
        //     qs: { demo: "example" },
        // }
        if (exports.checkedType(options) != "Object" || exports.checkedType(options.url) != "String" || exports.checkedType(options.method) != "String") {
            reject("参数异常!");
            return;
        }
        if (options.method != "GET" && options.method != "POST") {
            reject("请求方法异常!!");
            return;
        }
        request_1.default(options, function (error, response, body) {
            if (error) {
                console.log(options.url + " 请求发生错误! error =", error);
                return reject();
            }
            if (exports.checkedType(options.isJson_) == "Boolean" && options.isJson_) {
                let data;
                try {
                    data = JSON.parse(body);
                }
                catch (_a) {
                    console.log(options.url + "json解析错误了! body =", body);
                    return resolve(body);
                }
                resolve(data);
            }
            else {
                resolve(body);
            }
        });
    });
};
exports.request = request;
//# sourceMappingURL=common.js.map