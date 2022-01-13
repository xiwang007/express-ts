import { Request, Response } from "express"
// import { NextFunction } from "express";
import fs from "fs"
import MarkdownIt from "markdown-it"
import hljs  from "highlight.js"
// import * as console from "../log";
import * as common from "../../util/common"


const md = new MarkdownIt({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                // return hljs.highlight(lang, str).value;
                return hljs.highlightAuto(str).value
            } catch (__) {}
        }
    
        return "" // 使用额外的默认转义
    }
})


// 使用模板
// 英文文档 https://pugjs.org/api/getting-started.html
// 中文文档 https://www.pugjs.cn/api/getting-started.html
/**
 * 测试展示页面
 */
export const test = (req: Request, res: Response): void => {
    fs.readFile(common.GetPath("/README.md"), function(err, data){
        if(err){
            return res.json({
                state:0,
                msg:"Server busy, please try again later!~~~"
            })
        }
        const result = md.render(data.toString())
        res.render("webPage/test/test.pug", { title: "Hey", message: "Hello there!" ,result})
    })
}