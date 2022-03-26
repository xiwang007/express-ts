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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryConfigVal = exports.UpdateConfigVal = void 0;
const common = __importStar(require("./common"));
/**
 * 操作数据库对象
 */
/**
 * 更新config的值
 */
const UpdateConfigVal = (key, val) => {
    return new Promise((resolve, reject) => {
        const UPDATE = [val, key];
        // 这边 UPDATE 数组 是为了防注入的 
        // 有时候查询的信息是用户提供的 防止注入,把所有不放心的数据放到数组里面MySQL会进行处理然后再查询
        // 数组的顺序和查询语句里面的问号是一致的,最后处理好了会进行替换查询
        common.Mysql("UPDATE config SET val=? WHERE config_key=?", function (err, data) {
            if (err) {
                return reject(err);
            }
            // 说明插入成功
            if (data.affectedRows == 1) {
                resolve(undefined);
            }
            else {
                reject();
            }
        }, UPDATE);
    });
};
exports.UpdateConfigVal = UpdateConfigVal;
/**
 * 查询配置的值 返回string
 */
const QueryConfigVal = (key) => {
    return new Promise((resolve, reject) => {
        const SELECT = [key];
        common.Mysql("SELECT val FROM config WHERE config_key=? LIMIT 1;", function (err, data) {
            if (err) {
                return reject(err);
            }
            if (!data[0]) {
                return reject(`this config=${key} is not set!`);
            }
            resolve(data[0].val);
        }, SELECT);
    });
};
exports.QueryConfigVal = QueryConfigVal;
//# sourceMappingURL=OperationMySQL.js.map