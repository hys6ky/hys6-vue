import Vue from "vue"
import * as validator from "@/utils/validator"
const rule = validator.default
var vm = new Vue()
// 历史耗时_工程耗时记总

export const quickFormItem = [
    {
        prop: "etl_job",
        label: "作业名称",
        type: "select",
        options: [],
    },
    {
        prop: "sub_sys_desc",
        label: "任务名称",
        type: "input",
    },
    {
        prop: "job_status",
        label: "状态",
        type: "select",
        options: [],
},
]


const jobColumnArr = [
    { label: "",  type: "selection",align:'center' ,width:60},
    { label: "序号",  type: "index",align:'center',width:80},
    { label: "任务名称", prop: "subsysname", type: "text",minWidth:150},
    { label: "作业名称", prop: "etl_job", type: "link",operation: 'etl_job',minWidth:150},
    { label: "批量日期", prop: "curr_bath_date", type: "text",minWidth:100},
    { label: "状态", prop: "status", type: "text",minWidth:100},
    { label: "依赖作业",prop: "relyJob", type: "link",operation: 'relyJob',minWidth:100},
    { label: "配置",prop: "configure", type: "icon",minWidth:80, operation: 'configure',class:"el-icon-setting handeler"},
    {
        type: "operate",
        label: "操作",
        width:150,
        operateArr: [
            {
                label: "停止",
                operation: "stop",
                type:"icon",
                class:"el-icon-circle-close handeler ls",
            },
            {
                label: "跳过",
                operation: "pass",
                type:"icon",
                class:"el-icon-finished handeler ls",
            },
            {
                label: "重跑",
                operation: "refresh",
                type:"icon",
                class:"el-icon-refresh handeler ls",
            },
            {
                label: "强制执行",
                operation: "force",
                type:"icon",
                class:"el-icon-right handeler ls",
            },
            {
                label: "临时调整优先级",
                operation: "adjust",
                type:"icon",
                class:"el-icon-sort handeler ls",
            },
        ],
    },
]
export const jobColumnArr1 = [
    { prop: "event_id", type: "text", label: "事件号" ,minWidth:'100'},
    { prop: "subsysname", type: "text", label: "任务名称" ,minWidth:'120'},
    { prop: "etl_job", type: "text", label: "作业名称" ,minWidth:'120'},
    { prop: "types", type: "text", label: "干预类型" ,minWidth:'120'},
    { prop: "pro_para", type: "text", label: "作业程序参数" ,minWidth:'120'},
    { prop: "status", type: "text", label: "状态" ,minWidth:'120'},
    { prop: "st_time", type: "text", label: "接收时间" ,minWidth:'120'},
    { prop: "warning", type: "text", label: "提示信息" ,minWidth:'120'},
]

export const jobColumnArr2 =[
    { prop: "event_id", type: "text", label: "事件号" ,minWidth:'100'},
    { prop: "subsysname", type: "text", label: "任务名称" ,minWidth:'120'},
    { prop: "etl_job", type: "text", label: "作业名称" ,minWidth:'120'},
    { prop: "types", type: "text", label: "干预类型" ,minWidth:'120'},
    { prop: "pro_para", type: "text", label: "作业程序参数" ,minWidth:'120'},
    { prop: "status", type: "text", label: "状态" ,minWidth:'120'},
    { prop: "st_time", type: "text", label: "接收时间" ,minWidth:'120'},
]
export const formItem =[
    {
        prop: "currentLevel",
        label: "当前等级",
        placeholder: "优先级",
        type: "input",
        disabled: false,
        span: 24,
    }
]

export const modelFormConfig = {
    labelWidth: "130px",
    inline: false,
    ref: "checkForm",
};
export {
    jobColumnArr
}