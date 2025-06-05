import * as validator from "@/utils/regular";

export const columArr = [
    { prop: "tag", type: "selection", width: "70", align: "center" },
    { prop: "etl_job", type: "text",minWidth:'120',  label: "作业名称" },
    { prop: "resource_type", type: "text",minWidth:'120',  label: "资源类型" },
    { prop: "resource_req", type: "text",minWidth:'120',  label: "资源需求数" },
    { prop: "resource_name", type: "text",minWidth:'120',  label: "资源类型名称" },
    {
        type: "operate",
        label: "操作",
        placeholder: '资源类型',
        queryData: '',
        width: "200px",
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
        type: 'input',
        disabled: true,
        span: 18
    },
    {
        prop: 'etl_job_id',
        label: '作业名称',
        placeholder: '作业名称',
        type: 'select',
        disabled: false,
        options: [],
        span: 18
    },
    {
        prop: 'resource_type',
        label: '资源类型',
        placeholder: '资源类型',
        type: 'select',
        disabled: false,
        options: [],
        span: 18
    },
    {
        prop: 'resource_req',
        label: '资源需求数',
        placeholder: '资源需求数',
        type: 'input',
        disabled: false,
        span: 18
    },
]

