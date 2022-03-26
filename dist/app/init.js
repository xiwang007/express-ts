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
exports.init = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// common
const common = __importStar(require("../util/common"));
const console = __importStar(require("../util/log"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * 应用初始化一些设置
 * 设置模板引擎
 * 设置 session
 * 设置 拦截请求处理
 * 注册静态文件
 */
const init = (app) => {
    // 打印 每个请求
    app.use(function (req, res, next) {
        // 127.0.0.1:8080  localhost:8080
        // 这边可以根据请求的 host 处理
        console.log(req.headers.host, req.method, req.url);
        // 这边简单 把 127.0.0.1 给限制访问了 实际可以是线上服务器的IP
        if (req.headers.host.indexOf("127.0.0.1") == 0 && req.url != "/404") {
            return res.redirect("/404");
        }
        next();
    });
    // 加载 token 所需要的公钥和私钥
    common.GetPrivate();
    common.GetPublic();
    // 设置模板引擎
    app.set("views", common.GetPath("views"));
    app.set("view engine", "pug");
    // 设置 session
    app.use(express_session_1.default({
        // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
        // 目的是为了增加安全性，防止客户端恶意伪造
        secret: "sdjfk#misffng",
        resave: false,
        saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
    }));
    //  设置 req.session.user=1
    // 获取 console.log(req.session.user);
    // domain: 域名 
    // name=value：键值对，可以设置要保存的 Key/Value，注意这里的 name 不能和其他属性项的名字一样
    // Expires： 过期时间（秒），在设置的某个时间点后该 Cookie 就会失效，如 expires=Wednesday, 09-Nov-99 23:12:40 GMT。
    // maxAge： 最大失效时间（毫秒），设置在多少后失效 。
    // secure： 当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效 。
    // Path： 表示 在那个路由下可以访问到cookie。
    // httpOnly：是微软对 COOKIE 做的扩展。如果在 COOKIE 中设置了“httpOnly”属性，则通过程序（JS 脚本、applet 等）将无法读取到COOKIE 信息，防止 XSS 攻击的产生 。
    // singed：表示是否签名cookie, 设为true 会对这个 cookie 签名，这样就需要用 res.signedCookies 而不是 res.cookies 访问它。被篡改的签名 cookie 会被服务器拒绝，并且 cookie 值会重置为它的原始值。
    // 设置 cookie
    app.use(cookie_parser_1.default());
    // 获取
    // console.log(req.cookies.token);
    // 设置
    // res.cookie("token","xxxxxx",{maxAge: 2592000000, httpOnly: true});// 30天过期
    // 清除
    // res.clearCookie("token");
    // 扩展 https://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html
    // 如果有什么敏感操作建议 使用文章 五.CSRF的防御 进行处理 一般站点无敏感操作这样就可以了 如文章失效百度 CSRF 即可
    // 设置解析req的body
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(express_1.default.json());
    // 拦截访问less请求
    app.use(function (req, res, next) {
        const url = req.url.slice(0, req.url.indexOf("?") == -1 ? req.url.length : req.url.indexOf("?"));
        if (url.startsWith("/css/") && url.endsWith(".less")) {
            res.redirect("/404");
        }
        else {
            next();
        }
    });
    // 处理解密token的中间件
    app.use(function (req, res, next) {
        req.userid = -1;
        if (!req.cookies.token)
            return next();
        const privateKey = common.GetPrivate();
        // 解密
        jsonwebtoken_1.default.verify(req.cookies.token, privateKey, 
        //   {
        //   // algorithms:'RS256'
        // },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function (err, decoded) {
            if (err)
                return next();
            if (!decoded.userid)
                return next();
            req.userid = decoded.userid;
            next();
        });
    });
    // 拦截访问index.html请求
    app.use(function (req, res, next) {
        const url = req.url.slice(0, req.url.indexOf("?") == -1 ? req.url.length : req.url.indexOf("?"));
        if (url === "/" || url === "/index.html") {
            if (req.userid != -1) {
                return next();
            }
            return res.redirect("/login.html");
        }
        else {
            next();
        }
    });
    // 静态文件注册
    app.use(express_1.default.static(common.GetPath("/public")));
};
exports.init = init;
//# sourceMappingURL=init.js.map