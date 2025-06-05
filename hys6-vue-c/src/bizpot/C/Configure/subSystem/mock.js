import Vue from "vue";
import * as validator from "@/utils/validator";
const rule = validator.default;
var vm = new Vue();

export const columnArr1 = [
    { label: "tag", type: "selection", width: "70" },
    { label: "任务编号", prop: "sub_sys_cd", type: "link", minWidth: "130"},
    { label: "任务名称", prop: "sub_sys_desc", type: "text", minWidth: "130" },
    { label: "备注", prop: "comments", type: "text", minWidth: "80" },
    {
        type: "operateInput",
        // label: "操作",
        placeholder: '任务编号',
        queryData: '',
        width: "300px",
        operateArr: [
            { label: "编辑", type: "edit" },
            { label: "删除", type: "del" },
        ],
    },
]

export const fromItem = [
    {
        prop: "etl_sys_cd",
        label: "工程编号",
        placeholder: "请输入标准工程编号",
        type: "input",
        disabled: true,
        span: 18,
    },
    {
        prop: "sub_sys_cd",
        label: "任务编号",
        placeholder: "请输入标准任务编号",
        type: "input",
        disabled: false,
        span: 18,
    },
    {
        prop: "sub_sys_desc",
        label: "任务名称",
        placeholder: "请输入标准任务名称",
        type: "input",
        disabled: false,
        span: 18,
    },
    {
        prop: "comments",
        label: "备注",
        placeholder: "请输入标准工程编号",
        type: "textarea",
        disabled: false,
        span: 18,
    },
]
export const modelFormConfig = {
    labelWidth: "130px",
    inline: false,
    ref: "formAddAndUpdate",
};
export const frolRules = {
    etl_sys_cd: {required: true, message: '该输入项为必填项', trigger: 'blur'},
    sub_sys_cd: {required: true, message: '该输入项为必填项', trigger: 'blur'},
    sub_sys_desc: {required: true, message: '该输入项为必填项', trigger: 'blur'},
}