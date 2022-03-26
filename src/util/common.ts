import os from "os"
import path from "path"
import fs from "fs"
import mysql from "mysql"
import { MysqlError, FieldInfo } from "mysql"
import nodemailer from "nodemailer"
import request_ from "request"


/**
 * 获取现在时间的字符串
 */
export const Nowtime = (): string => {
    const newdate = new Date()
    const y = newdate.getFullYear()
    const m = (newdate.getMonth() + 1).toString().padStart(2, "0")
    const d = newdate.getDate().toString().padStart(2, "0")
    const h = newdate.getHours().toString().padStart(2, "0")
    const min = newdate.getMinutes().toString().padStart(2, "0")
    const s = newdate.getSeconds().toString().padStart(2, "0")
    const times = y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s
    return times
}
/**
 * 换行
 */
export const hh = os.platform() == "win32" || os.tmpdir().indexOf(":\\") != -1 ? "\r\n" : ""
/**
 * 根目录
 */
export const rootPath = path.join(__dirname, "../../")

/**
 * 这个变量控制是否打印log
 */
let mylog = true

/**
 * 获取是否显示日志状态/设置状态
 */
export const Log = (get?: boolean): boolean => {
    if (get == undefined) {
        return mylog
    }
    if (get) {
        return mylog = true
    } else {
        return mylog = false
    }


}

/**
 * 判断数据类型 Object Array Function String Boolean Null Undefined
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const checkedType = function (target: any) {
    return Object.prototype.toString.call(target).slice(8, -1)
}


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
export const sendEmail = function (aliasName: string, to: string, subject: string, msg: string, callback: any = null) {

    // npm i nodemailer -S
    // npm i @types/nodemailer --save-dev
    // let nodemailer=require("nodemailer")
    // import nodemailer from "nodemailer"

    const options = {
        //QQ邮箱发件服务器是smtp.qq.com，企业邮箱是：smtp.exmail.qq.com
        host: "smtp.qq.com",
        //secureConnection: true, // use SSL
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "xxxxxx@qq.com", // generated ethereal user
            pass: "xxxxxx" // generated ethereal password
        }
    }

    const transporter = nodemailer.createTransport(options)
    const from = "xxxxxx@qq.com"
    transporter.sendMail({
        //from    : '标题别名 <foobar@latelee.org>',
        from: aliasName + " " + "<" + from + ">",
        //'li@latelee.org, latelee@163.com',//收件人邮箱，多个邮箱地址间用英文逗号隔开
        to: to,
        subject: subject,//邮件主题
        //text    : msg,
        html: msg
    }, callback)
}

/**
 * 数据库 host 线上的 production
 */
export const host: { [key: string]: any } = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "zf2JkTbwAm@N5zZ",
    database: "test",
    // charset:"UTF8MB4_GENERAL_CI",
    // charset:"utf8mb4_unicode_ci",
    charset: "utf8mb4",
}

/**
 * 数据库host 开发时用的本地数据库 dev
 */
export const host2: { [key: string]: any } = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "zf2JkTbwAm@N5zZ",
    database: "test",
    // charset:"UTF8MB4_GENERAL_CI",
    // charset:"utf8mb4_unicode_ci",
    charset: "utf8mb4",
}

// 这边根据环境 选择数据库
if (!process.env.NODE_ENV || process.env.NODE_ENV != "production") {
    for (const key in host) {
        host[key] = host2[key]
    }
    console.log(host)
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
export const Mysql = function (sql: string, callback: (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => void, add: unknown[] = null) {
    const connection = mysql.createConnection(host)
    connection.connect()
    //增删改
    if (add !== null) {
        connection.query(sql, add, callback)
    } else {
        //查
        connection.query(sql, callback)
    }
    connection.end()
}



// web ===============================================================

/**
 * Path 为项目根目录后面的目录
 * 返回绝对路径
 */
 export const GetPath = (Path: string): string => {
    return path.join(rootPath, Path)
}

/**
 * 私钥
 */
let privateKye = ""
/**
 * 公钥
 */
let publicKye = ""


/**
 * 获取token的私钥
 * @returns 
 */
export const GetPrivate = (): string => {
    if (privateKye) {
        return privateKye
    }
    let temp = ""
    try {
        temp = fs.readFileSync(GetPath("/key/private.key"), "utf-8")
        // console.log("私钥 =\n",temp);
    } catch (err) {
        temp = ""
        console.log("获取私钥失败 err=", err)
    }
    return privateKye = temp
}
/**
 * 获取token的公钥
 * @returns 
 */
export const GetPublic = (): string => {
    if (publicKye) {
        return publicKye
    }
    let temp = ""
    try {
        temp = fs.readFileSync(GetPath("/key/public.key"), "utf-8")
        // console.log("公钥 =\n",temp);
    } catch (err) {
        temp = ""
        console.log("获取公钥失败 err=", err)
    }
    return publicKye = temp
}


/**
 * 删除文件 文件全路径
 */
export const DeleteFile = (path: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) return reject(err)
            resolve(undefined)
        })
    })
}


/**
 * 用于停止失败的Promise
 */
export const PromiseStop = (): Promise<unknown> => {
    //失败则停止执行后面的
    return new Promise(() => { return 1 })
}

/**
 * 用于传递失败的Promise
 */
export const PromiseReject = (data: any): Promise<unknown> => {
    return new Promise((resolve, reject) => { reject(data) })
}

/**
 * 用于传递成功的Promise
 */
export const PromiseResolve = (data: any): Promise<unknown> => {
    return new Promise((resolve, reject) => { resolve(data) })
}

/**
 * 一个简单封装了的request请求
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const request = function (options: any) {
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
        if (checkedType(options) != "Object" || checkedType(options.url) != "String" || checkedType(options.method) != "String") {
            reject("参数异常!")
            return
        }
        if (options.method != "GET" && options.method != "POST") {
            reject("请求方法异常!!")
            return
        }

        request_(options, function (error: any, response: any, body: any) {
            if (error) {
                console.log(options.url + " 请求发生错误! error =", error)
                return reject()
            }
            if (checkedType(options.isJson_) == "Boolean" && options.isJson_) {
                let data
                try {
                    data = JSON.parse(body)
                } catch {
                    console.log(options.url + "json解析错误了! body =", body)
                    return resolve(body)
                }
                resolve(data)
            } else {
                resolve(body)
            }

        })
    })
}