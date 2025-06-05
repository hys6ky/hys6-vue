import * as validator from "@/utils/regular";

export const columArr = [
    { prop: "tag", type: "selection", width: "70", align: "center" },
    { prop: "para_cd", type: "text",minWidth:'120',  label: "变量名称" },
    { prop: "paraType", type: "text",minWidth:'120',  label: "变量类型" },
    { prop: "para_val", type: "text",minWidth:'120',  label: "变量值" },
    { prop: "para_desc", type: "text",minWidth:'120',  label: "描述" },
    {
        type: "operateInput",
        label: "操作",
        placeholder: '资源类型',
        queryData: '',
        width: "300px",
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
        prop: 'para_cd',
        label: '变量名称',
        placeholder: '变量名称',
        type: 'input',
        prepend: '!',
        disabled: false,
        content: '如果需要添加自定义格式日期，请使用txdate(当前跑批)、txdate_next(后一跑批日)、txdate_pre(前一跑批日)、date(当前系统日)开头的变量参数名,变量值如yyyyMMdd',
        span: 18
    },
    {
        prop: 'para_type',
        label: '变量类型',
        placeholder: '变量类型',
        type: 'select',
        disabled: false,
        options: [],
        span: 18
    },
    {
        prop: 'para_val',
        label: '变量值',
        placeholder: '变量值',
        type: 'input',
        disabled: false,
        span: 18
    },
    {
        prop: 'para_desc',
        label: '描述',
        placeholder: '描述',
        type: 'textarea',
        disabled: false,
        span: 18
    },
]
export const frolRules = {
    etl_sys_cd: {required: true, message: '该输入项为必填项', trigger: 'blur'},
    para_cd: {required: true, message: '该输入项为必填项', trigger: 'blur'},
    para_type: {required: true, message: '该输入项为必填项', trigger: 'blur'},
    para_val: {required: true, message: '该输入项为必填项', trigger: 'blur'},
}