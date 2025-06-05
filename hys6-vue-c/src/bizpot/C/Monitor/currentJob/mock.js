import Vue from "vue"
import * as validator from "@/utils/validator"
const rule = validator.default
var vm = new Vue()
// 历史耗时_工程耗时记总
const formItems=[
    {label:"作业描述",type:"input",align:"center",prop:"etl_job_desc",disabled:true,span:8,placeholder:" "},
    {label:"作业程序类型",type:"input",align:"center",prop:"pro_type",disabled:true,span:8,placeholder:" "},
    {label:"调度时间位移",type:"input",align:"center",prop:"disp_offset",disabled:true,span:8,placeholder:" "},
    {label:"作业程序参数",type:"input",align:"center",prop:"pro_para",disabled:true,span:8,placeholder:" "},
    {label:"调度触发时间",type:"input",align:"center",prop:"disp_time",disabled:true,span:8,placeholder:" "},
    {label:"调度频率",type:"input",align:"center",prop:"disp_freq",disabled:true,span:8,placeholder:" "},
    {label:"作业程序名称",type:"input",align:"center",prop:"pro_name",disabled:true,span:8,placeholder:" "},
    {label:"当前批量日期",type:"input",align:"center",prop:"curr_bath_date",disabled:true,span:8,placeholder:" "},
    {label:"调度触发方式",type:"input",align:"center",prop:"disp_type",disabled:true,span:8,placeholder:" "},
    {label:"作业程序目录",type:"input",align:"center",prop:"pro_dic",disabled:true,span:8,placeholder:" "},
    {label:"开始时间",type:"input",align:"center",prop:"curr_st_time",disabled:true,span:8,placeholder:" "},
    {label:"作业有效标志",type:"input",align:"center",prop:"job_eff_flag",disabled:true,span:8,placeholder:" "},
    {label:"日志目录",type:"input",align:"center",prop:"log_dic",disabled:true,span:8,placeholder:" "},
    {label:"结束时间",type:"input",align:"center",prop:"curr_end_time",disabled:true,span:8,placeholder:" "},
    {label:"当天是否调度",type:"input",align:"center",prop:"today_disp",disabled:true,span:8,placeholder:" "},
    {label:"备注信息",type:"input",align:"center",prop:"comments",disabled:true,span:8,placeholder:" "},
    {label:"超时阀值",type:"input",align:"center",prop:"overtime_val",disabled:true,span:8,placeholder:" "},
    {label:"作业调度状态",type:"input",align:"center",prop:"job_disp_status",disabled:true,span:8,placeholder:" "},
    {label:"主服务器同步标志",type:"input",align:"center",prop:"main_serv_sync",disabled:true,span:8,placeholder:" "},
    {label:"超长阀值",type:"input",align:"center",prop:"overlength_val",disabled:true,span:8,placeholder:" "},
    {label:"作业优先级",type:"input",align:"center",prop:"job_priority",disabled:true,span:8,placeholder:" "},
]

export const quickSearchItem =[
    {
        prop: 'etl_job_id',
        label: '作业名称',
        type: 'select',
        span: 8,
        options:[],
        value : "",
    }
]
export const quickButtonItem =[
    {
        prop: 'intervene',
        label: '干预'
    }
]

export  const modelFormConfig={
    labelWidth:"140px",
    ref:"forms",
    width:null,
}
const columnArr=[
    {label:"资源类型",type:"text",align:"center",prop:"resource_type"},
    {label:"需求数",type:"text",align:"center",prop:"resource_req"},
]
const formConfig={
    labelWidth:"140px",
    ref:"forms",
    width:null,
}


export {
    formItems,formConfig,columnArr
}