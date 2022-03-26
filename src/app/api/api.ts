import { Request, Response } from "express"
// import { NextFunction } from "express";
import jwt from "jsonwebtoken"
import * as common from "../../util/common"
import * as OperationMySQL from "../../util/OperationMySQL"


export const login = (req: Request, res: Response): void => {
    // http://localhost:8080/api/login?userid=1&pwd=8888
    console.log("api login req.userid =", req.userid)// 根据这个唯一用户ID来判断用户身份

    if (!req.body.name || !req.body.password) {
        res.json({
            state: 0,
            msg: "账号或者密码为空！"
        })
        return
    }
    const name = req.body.name
    const password = req.body.password
    const privateKey = common.GetPrivate()
    if (!privateKey) {
        res.json({
            state: 0,
            msg: "系统错误!"
        })
        return
    }
    new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE name=?  LIMIT 1"
        const add = [name]
        common.Mysql(sql, function (err, data) {
            if (err) {
                res.json({
                    state: 0,
                    msg: "异常错误！"
                })
                reject()
                return
            }
            if (!data[0] || data[0].password !== password) {
                res.json({
                    state: 0,
                    msg: "用户或密码错误！"
                })
                reject()
                return
            }
            resolve(data[0])
        }, add)
    })
        .then((a: { id: number }) => {
            // 加密
            jwt.sign({
                userid: a.id
            },
                privateKey,
                // { // 非对称加密
                //   key:privateKey,
                //   passphrase:"ceshi"
                // }, 
                {
                    expiresIn: "30 days",//过期时间
                    // algorithm:'RS256',// 加密方式默认是HS256（对称的）  RS256是非对称的
                },
                function (err, token) {

                    if (err) {
                        res.json({
                            state: 0,
                            msg: "服务器繁忙，请稍后再试!"
                        })
                        return
                    }

                    res.cookie("token", token, { maxAge: 2592000000, httpOnly: true })// 30天过期
                    // res.redirect("/");
                    res.json({
                        state: 1,
                        msg: "token生成成功!"
                    })
                })
        })


}
/**
 * 是否已经登录
 */
export const islogin = (req: Request, res: Response): void => {
    if (req.userid != -1) {
        res.json({
            state: 1,
            msg: "已登陆！"
        })
        return
    } else {
        res.json({
            state: 0,
            msg: "未登陆！"
        })
        return
    }
}
/**
 * 退出登录
 */
export const signOut = (req: Request, res: Response): void => {
    res.clearCookie("token")
    res.json({
        state: 1,
        msg: "退出成功!"
    })
}

/**
 * 获取站点配置
 */
export const websiteConfig = (req: Request, res: Response): void => {
    console.log(req.body.website)
    OperationMySQL.QueryConfigVal("websiteConfig")
        .then((data: string) => {
            return new Promise((resolve, reject) => {
                let newData
                try {
                    newData = JSON.parse(data)
                } catch {
                    console.log("websiteConfig 数据异常")
                    res.json({
                        state: 0,
                        msg: "websiteConfig 数据异常,获取失败!"
                    })
                    return
                }
                res.json({
                    state: 1,
                    msg: "获取成功!",
                    data: newData
                })

            })

        })
        .catch(() => {
            res.json({
                state: 0,
                msg: "获取失败!"
            })
            return common.PromiseStop()
        })
}