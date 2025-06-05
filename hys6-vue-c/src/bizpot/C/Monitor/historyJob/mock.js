import Vue from "vue"
import * as validator from "@/utils/validator"
const rule = validator.default
var vm = new Vue()
const columnArr = [
    { label: "系统名称", prop: "sub_sys_cd", type: "text",align:'center'},
    { label: "作业名称", prop: "etl_job", type: "text",align:'center'},
    { label: "批量日期", prop: "curr_bath_date", type: "text",align:'center'},
    { label: "开始时间", prop: "curr_st_time", type: "text",align:'center'},
    { label: "结束时间", prop: "curr_end_time", type: "text",align:'center'},
    { label: "状态", prop: "job_disp_status", type: "text",align:'center'},
    {
        type: "operate",
        label: "日志",
        align:'center',
        operateArr: [
            {
                label: "日志",
                type: "log",
            }
        ],
    },
]
export const quickSearchItem =[
    {
        prop: 'etlJobIdAndCd',
        label: '作业名称',
        type: 'select',
        valueFormat: 'yyyyMMdd',
        options:[],
    },
    {
        prop: 'start_date',
        label: '开始批量日期',
        type: 'date',
        valueFormat: 'yyyyMMdd',
    },
    {
        prop: 'end_date',
        label: '结束批量日期',
        type: 'date',
        valueFormat: 'yyyyMMdd',
    },

]


export {
    columnArr
}