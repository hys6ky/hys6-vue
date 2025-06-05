import Vue from "vue"
import * as validator from "@/utils/validator"
const rule = validator.default
var vm = new Vue()
const columnArr = [
    { label: "资源类型", prop: "resource_type", type: "text",align:'center'},
    { label: "系统名称", prop: "sub_sys_cd", type: "text",align:'center'},
    { label: "作业名称", prop: "etl_job", type: "text",align:'center'},
    { label: "占用资源数", prop: "resource_req", type: "text",align:'center'},
    { label: "开始时间", prop: "curr_st_time", type: "text",align:'center'},
    { label: "状态", prop: "job_disp_status", type: "text",align:'center'},
]


export {
    columnArr
}