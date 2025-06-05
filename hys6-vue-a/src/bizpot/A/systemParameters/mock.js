import Vue from "vue";
import * as validator from "@/utils/validator"
const rule = validator.default
var vm = new Vue()

const columnArr = [
    { label: "序号", type: "index", width: "70" },
    { label: "系统参数名称", prop: "para_name", type: "text", minWidth: "140" },
    { label: "系统参数值", prop: "para_value", type: "text", minWidth: "120" },
    { label: "系统参数类型", prop: "para_type", type: "text", minWidth: "150" },
    { label: "系统参数备注", prop: "remark", type: "text", minWidth: "120" },
    // {
    //     type: "operate",
    //     label: "操作",
    //     placeholder: "系统参数名称(Enter)",
    //     filter: true,
    //     width: "200px",
    //     operateArr: [
    //         {
    //             label: "编辑",
    //             type: "edit",
    //         },
    //     ],
    // },
    {
        type: "operateInput",
        // label: "操作",
        placeholder: '输入关键字搜索',
        queryData: '',
        width: "240px",
        operateArr: [
            { label: "编辑", type: "edit" },
        ],
    },
]
const modelFormItems = [
    {
        prop: "para_name",
        label: "系统参数名称",
        placeholder: "请输入系统参数名称",
        type: "input",
        span: 24,
    },
    {
        prop: "para_value",
        label: "系统参数值",
        placeholder: "请输入系统参数值",
        type: "textarea",
        span: 24,
    },
    {
        prop: "para_type",
        label: "系统参数类型",
        placeholder: "请输入系统参数类型",
        type: "input",
        span: 24,
    },
    {
        prop: "remark",
        label: "系统参数备注",
        placeholder: "请输入系统参数备注",
        type: "textarea",
        span: 24,
    },
]

const modelFormConfig = {
    labelWidth:"130px",
    inline: false,
    ref: "systemParametersForm"
}

const modelFormData = {
    para_name: "",
    para_value:"",
    para_type:"",
}

const modelFormRules = {
    para_name: vm.filter_rules([{required:true}]),
    para_value: vm.filter_rules([{required:true}]),
    para_type: vm.filter_rules([{required:true}]),
}

export {
    columnArr,modelFormItems,modelFormConfig,modelFormData,modelFormRules
}
