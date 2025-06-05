import Vue from "vue"
import * as validator from "@/utils/validator"
const rule = validator.default
var vm = new Vue()
// 历史耗时_工程耗时记总
const timeBatch_projectData_columnArr=[
    {label:"开始时间",type:"text",align:"center",prop:"curr_st_time"},
    {label:"结束时间",type:"text",align:"center",prop:"curr_end_time"},
    {label:"总任务数",type:"text",align:"center",prop:"taskNum"},
    {label:"总作业数",type:"text",align:"center",prop:"jobNum"},
    {label:"总用时",type:"text",align:"center",prop:"projectConsumeTime"},
    {label:"平均耗时",type:"text",align:"center",prop:"projectConsumeAveTime"},
]
// 历史耗时_任务耗时记总
const timeBatch_taskData_columnArr=[
    {label:"任务名称",type:"text",align:"center",prop:"sub_sys_desc"},
    {label:"开始时间",type:"text",align:"center",prop:"curr_st_time"},
    {label:"结束时间",type:"text",align:"center",prop:"curr_end_time"},
    {label:"总作业数",type:"text",align:"center",prop:"jobNum"},
    {label:"总用时",type:"text",align:"center",prop:"taskConsumeTime"},
    {label:"平均耗时",type:"text",align:"center",prop:"taskConsumeAveTime"},
]
// 历史耗时_作业耗时记总
const timeBatch_jobData_columnArr=[
    {label:"作业名称",type:"text",align:"center",prop:"etl_job"},
    {label:"作业描述",type:"text",align:"center",prop:"etl_job_desc"},
    {label:"开始时间",type:"text",align:"center",prop:"curr_st_time"},
    {label:"结束时间",type:"text",align:"center",prop:"curr_end_time"},
    {label:"作业用时",type:"text",align:"center",prop:"jobTime"},
]



const columnArr = [
    { label: "序号", type: "index", width: "70" },
    { label: "部门名称", prop: "dep_name", type: "text", minWidth: "120" },
    { label: "备注", prop: "dep_remark", type: "text", minWidth: "120" },
    {
        type: "operate",
        label: "操作",
        width: "160px",
        operateArr: [
            {
                label: "编辑",
                type: "edit",
            },
            {
                label: "删除",
                type: "delete",
            },
        ],
    },
]
const modelFormItems = [
    {
        prop: "dep_name",
        label: "部门名称",
        placeholder: "请输入部门名称",
        type: "input",
        span: 24,
    },
    {
        prop: "dep_remark",
        label: "部门信息描述",
        placeholder: "备注",
        type: "textarea",
        span: 24,
    },
]

const modelFormConfig = {
    labelWidth:"130px",
    inline: false,
    ref: "departManagementForm"
}

const modelFormData = {
    dep_name: "",
    dep_remark:"",
}

const modelFormRules = {
    dep_name: vm.filter_rules([{required:true}])
}

export const quickSearchItem =[
    {
        prop: 'dateValue',
        label: '当前批量日期',
        type: 'date',
        valueFormat: 'yyyyMMdd',
        span: 8,
    },
    {
        prop: 'sub_sys_cd_name',
        label: '任务编号或名称',
        type: 'input',
        span: 8,
        options:[]
    },
    {
        prop: 'etl_job_value',
        label: '作业名称',
        type: 'input',
        span: 8,
        options:[]
    },
    {
        prop: 'etl_job_desc',
        label: '作业描述',
        type: 'input',
        span: 8,
        options:[]
    }
]
export const quickButtonItem =[
    {
        prop: 'export',
        label: '导出'
    }
]

export {
    timeBatch_projectData_columnArr,timeBatch_taskData_columnArr,timeBatch_jobData_columnArr
}