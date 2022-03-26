import * as common from "./common"
/**
 * 操作数据库对象
 */


/**
 * 更新config的值
 */
export const UpdateConfigVal = (key: string, val: string) => {
    return new Promise((resolve, reject) => {
        const UPDATE = [val, key]
        // 这边 UPDATE 数组 是为了防注入的 
        // 有时候查询的信息是用户提供的 防止注入,把所有不放心的数据放到数组里面MySQL会进行处理然后再查询
        // 数组的顺序和查询语句里面的问号是一致的,最后处理好了会进行替换查询
        common.Mysql("UPDATE config SET val=? WHERE config_key=?", function (err, data: Record<string, unknown>) {
            if (err) {
                return reject(err)
            }
            // 说明插入成功
            if (data.affectedRows == 1) {
                resolve(undefined)
            } else {
                reject()
            }
        }, UPDATE)
    })
}


/**
 * 查询配置的值 返回string
 */
export const QueryConfigVal = (key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const SELECT = [key]
        common.Mysql("SELECT val FROM config WHERE config_key=? LIMIT 1;", function (err, data: { val: string }[]) {
            if (err) {
                return reject(err)
            }
            if (!data[0]) {
                return reject(`this config=${key} is not set!`)
            }
            resolve(data[0].val)
        }, SELECT)

    })
}