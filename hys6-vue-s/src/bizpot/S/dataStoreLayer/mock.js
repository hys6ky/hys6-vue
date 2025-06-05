import Vue from "vue"
import * as validator from "@/utils/validator"
const rule = validator.default
var vm = new Vue()

const columnArr = [
    { label: "序号", type: "index", width: "70" },
    { label: "存储层名称", prop: "dsl_name", type: "text",align:"center", minWidth: "120" },
    { label: "存储类型", prop: "store_type", type: "text",align:"center", minWidth: "100" },
    { label: "hadoop客户端", prop: "is_hadoopclient", type: "text",align:"center", minWidth: "100" },
    { label: "源存储层", prop: "dsl_source_ch", type: "text",align:"center", minWidth: "80" },
    { label: "目标存储层", prop: "dsl_goal_ch", type: "text",align:"center", minWidth: "80" },
    { label: "备注", prop: "dsl_remark", type: "text",align:"center", minWidth: "120" },
    { label: "数据存储层属性", prop: "store_type", type: "link", minWidth: "160" },
    {
        type: "operate",
        label: "操作",
        width: "140px",
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
        prop: "dsl_name",
        label: "存储层名称",
        placeholder: "请输入存储层名称",
        type: "input",
        span: 24,
    },
    {
        prop: "store_type",
        label: "存储层存储类型",
        placeholder: "请输入存储层存储类型",
        type: "input",
        span: 24,
    },
    {
        prop: "dsl_remark",
        label: "存储层备注",
        placeholder: "请输入存储层备注",
        type: "input",
        span: 24,
    },
    {
        prop: "is_hadoopclient",
        label: "是否支持外部表",
        placeholder: "请选择是否支持外部表",
        type: "input",
        span: 24,
    },
    {
        prop: "dsla_storelayer",
        label: "附加信息",
        placeholder: "请选择附加信息",
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
    dsl_name: "",
    store_type: "",
    dsl_remark: "",
    is_hadoopclient: "",
    dsla_storelayer: "",
}

const modelFormRules = {
    dsl_name: vm.filter_rules([{required:true}]),
    store_type: vm.filter_rules([{required:true}]),
    is_hadoopclient: vm.filter_rules([{required:true}])
}

const storeLayerCols = [
    {label : "序号", type : "index", width : "64", align : "center"},
    {label : "key", prop : "storage_property_key", type : "text", align: "center"},
    {label : "value", prop : "storage_property_val", type : "text", align : "center"},
    {label : "描述", prop : "dsla_remark", type : "text", align : "center"},
    {
        label : "下载",
        type : "operate",
        width : "150",
        align : "center",
        operateArr : [
            {
                label : "下载",
                type : "download",
            }
        ]
    },


]

export {
    columnArr,modelFormItems,modelFormConfig,modelFormData,modelFormRules,storeLayerCols
}
