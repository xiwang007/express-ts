// 👇这个网址可以搜索ts d.ts文件
// https://www.typescriptlang.org/dt/search

import express from "express"
import {init} from "./app/init"


// common
import * as common from "./util/common"
// 这边对原本的log进行了拦截,加上了时间和换行
import * as console from "./util/log"

// router
import * as index from "./app/router/index"

// api
import * as api from "./app/api/api"


/**
 * 监听的端口
 */
const port=8080
const app = express()
init(app)

// router
app.get("/",(req,res)=>res.redirect("/test"))
app.get("/test",index.test)
app.get("/404",(req,res)=>res.render("webPage/404/404.pug"))

//api
app.get("/api",api.test)
app.get("/api/login",api.login)
app.get("/api/mysql",api.mysql)


// 剩下的没有匹配都转到404页面
app.use((req,res)=>res.redirect("/404"))

app.listen(port,function(){
    console.log(`app is running ... at port=${port}`)
})