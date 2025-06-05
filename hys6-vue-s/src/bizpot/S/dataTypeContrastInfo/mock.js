import Vue from "vue"
import * as validator from "@/utils/validator"
const rule = validator.default
var vm = new Vue()

const columnArr = [
    { label: "序号", type: "index", width: "70" },
    { label: "数据库名称1", prop: "database_name1", type: "text", minWidth: "120" },
    { label: "数据库名称2", prop: "database_name2", type: "text", minWidth: "120" },
    { label: "表对照数据类型个数", prop: "data_type_count", type: "text", minWidth: "120" },
    {
        type: "operate",
        label: "详情",
        width: "120px",
        operateArr: [
            {
                label: "查看详情",
                type: "look",
            }
        ],
    },
]

const modelFormItems = [
    {
        prop: "database_name1",
        label: "数据库名称1",
        placeholder: "请选择数据库名称1",
        type: "input",
        span: 24,
    },
    {
        prop: "database_name2",
        label: "数据库名称2",
        placeholder: "请选择数据库名称2",
        type: "input",
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
}

const modelFormRules = {
    dep_name: vm.filter_rules([{required:true}])
}

const tableDetailCols = [
    {label : "序号", type : "index",width :"60px",align : "center"},
    {label : "数据库字段类型1", prop : "database_type1",type : "text",align : "center"},
    {label : "数据库字段类型2", prop : "database_type2",type : "text", align : "center"},
]

export {
    columnArr,modelFormItems,modelFormConfig,modelFormData,modelFormRules,tableDetailCols
}