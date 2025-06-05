import request from '@/utils/request'
import Qs from 'qs'

//codeMaintenance统一编码
/**(0)
 * 查询统一编码信息
 */
export function getData(data) {
    return request({
        url: '/R/dfProInfoApi/getDfProInfoListByDfType',
        params:data
    })
}
//codeMaintenance统一编码
/**(1)
 * 查询统一编码信息
 */
export function getMonthData(data) {
    return request({
        url: '/R/dfProInfoApi/getDfProInfoListByDfTypeAndMonth',
        params:data
    })
}

export function getDfProInfoARAndSuNumber(data) {
    return request({
        url: '/R/dfProInfoApi/getDfProInfoARAndSuNumber',
        params:data
    })
}

export function getDfApplyNumber(data) {
    return request({
        url: '/R/dfProInfoApi/getDfApplyNumber',
        params:data
    })
}

export function getDfExamineNumber(data) {
    return request({
        url: '/R/dfProInfoApi/getDfExamineNumber',
        params:data
    })
}