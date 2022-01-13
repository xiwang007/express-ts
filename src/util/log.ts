import * as common from "./common"

// eslint-disable-next-line
export const log=(message?: any, ...optionalParams: any[]):void=>{
    if(common.Log()){
        console.log(`${common.hh}${common.Nowtime()}`,message, ...optionalParams)
    }
}

