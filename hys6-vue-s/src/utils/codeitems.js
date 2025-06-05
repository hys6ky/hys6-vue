import * as executeRequest from '@/utils/executeRequest';

/**
 *
 * @param {String} data.category  代码项的类名
 * @returns {JSON} 返回指定的代码项类型数据,数据结构如 :
 * [{"catCode":"35","code":"1","catValue":"Agent类别","value":"数据库Agent"},
 * {"catCode":"35","code":"2","catValue":"Agent类别","value":"文件系统Agent"},
 * {"catCode":"35","code":"3","catValue":"Agent类别","value":"FtpAgent"},
 * {"catCode":"35","code":"4","catValue":"Agent类别","value":"数据文件Agent"},
 * {"catCode":"35","code":"5","catValue":"Agent类别","value":"对象Agent"}]
 */
export async function getCategoryItems(data) {
    return executeRequest.execGetByUrl('/Base/code/getCategoryItems', data)
}

/**
 *
 * @param {String} data.category  代码项的类名
 * @param {String} data.code  代码项的编号
 * @returns {JSON} 返回指定代码项的中文名称,数据结构如 :
 * {"code": 200,"data": "数据库Agent","message": "OK","success": true}
 */
export async function getValue(data) {
    return executeRequest.execGetByUrl('/Base/code/getValue', data)
}

/**
 *
 * @param {String} data.category  代码项的类名
 */
export async function getCodeItems(data) {
    return executeRequest.execGetByUrl('/Base/code/getCodeItems', data)
}