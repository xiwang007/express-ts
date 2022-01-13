import MarkdownIt from "markdown-it";
declare module "express"{
    export interface Request {
        md: MarkdownIt
        userid:number
    }
}