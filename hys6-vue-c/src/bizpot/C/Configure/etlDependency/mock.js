import * as validator from "@/utils/regular";

export const QuickItem =[
    {
        prop: "etl_job",
        label: "作业名称",
        type: "input",
    },
    {
        prop: "pre_etl_job",
        label: "上游作业名称",
        type: "input",
    },
]
export const columArr = [
    { prop: "tag", type: "selection", width: "70", align: "center" },
    { prop: "etl_job", type: "text",minWidth:'120',  label: "作业名称" },
    { prop: "pre_etl_sys_cd", type: "text",minWidth:'120',  label: "上游工程编号" },
    { prop: "pre_etl_job", type: "text",minWidth:'120',  label: "上游作业名称" },
    { prop: "statu", type: "text",minWidth:'120',  label: "状态" },
    {
        type: "operate",
        label: "操作",
        width: "180px",
        operateArr: [
            { label: "编辑", type: "edit" },
            { label: "删除", type: "del"},
        ],
    },
]


export const issueFromConfig ={
    labelWidth: "140px",
    inline: false,
    ref: "tableFrom",
}
export const formItems= [
    {
        prop: 'etl_job',
        label: '作业名称',
        type: 'input',
    },
    {
        prop: 'resource_type',
        label: '资源类型',
        type: 'input',
    },
]
export const fromItem =[
    {
        prop: 'etl_sys_cd',
        label: '工程编号',
        placeholder: '工程编号',
        tag: '0',
        type: 'input',
        disabled: true,
        span: 18
    },
    {
        prop: 'sub_sys_id',
        label: '任务名称',
        placeholder: '任务名称',
        tag: '2',
        type: 'select',
        conceal: 'false',
        disabled: false,
        options: [],
        span: 18
    },
    {
        prop: 'etl_job_id',
        label: '作业名称',
        placeholder: '作业名称',
        tag: '1',
        type: 'select',
        disabled: false,
        options: [],
        span: 18
    },
    {
        prop: 'pre_etl_sys_cd',
        label: '上游工程编号',
        placeholder: '上游工程编号',
        tag: '0',
        type: 'input',
        disabled: true,
        span: 18
    },
    {
        prop: 'pre_etl_job_id',
        label: '上游作业名称',
        placeholder: '上游作业名称',
        tag: '1',
        type: 'select',
        disabled: false,
        options: [],
        span: 18
    },
    {
        prop: 'pre_sub_sys_id',
        label: '上游任务名称',
        placeholder: '上游任务名称',
        tag: '2',
        conceal: 'false',
        type: 'select',
        disabled: false,
        options: [],
        span: 18
    },
    {
        prop: 'status',
        label: '状态',
        placeholder: '状态',
        type: 'select',
        tag: '0',
        disabled: false,
        options: [],
        span: 18
    },
]
export const frolRules = {
    etl_sys_cd: {required: true, message: '该输入项为必填项', trigger: 'blur'},
    etl_job_id: {required: true, message: '该输入项为必填项', trigger: 'blur'},
    sub_sys_id: {required: true, message: '该输入项为必填项', trigger: 'blur'},
    pre_etl_job_id: {required: true, message: '该输入项为必填项', trigger: 'blur'},
    status: {required: true, message: '该输入项为必填项', trigger: 'blur'},
}