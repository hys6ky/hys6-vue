import {right} from "core-js/internals/array-reduce";

const columnArr = [
    { type: "selection", width: "60",align: "center" },
    { label: "序号", type: "index", width: "70" },
    { label: "接口名称", prop: "interface_name", type: "text", minWidth: "120" },
    { label: "接口代码", prop: "interface_code", type: "text", width: "200" },
    { label: "开始日期", prop: "start_use_date", type: "date",minWidth: "200" },
    { label: "结束日期", prop: "use_valid_date", type: "date",minWidth: "200"},
    { label: "接口状态", prop: "use_state", type: "text", width: "100",fixed: "right" },

];
const pagination = {
    total: 0,
    pageNum: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
};
const modelFormItems = [
    {
        prop: "userIds",
        label: "用户名称",
        placeholder: "请选择用户名称",
        type: "select",
        disabled: false,
        span: 11,
        options: [],
        checkStrictly: true,
        multiple: true,
        props: {
            key: "user_id",
            value: "user_id",
            label: "user_name",
            checkStrictly: true,
        },
    },
    {
        prop: "classify_name",
        label: "分类名称",
        placeholder: "请输入分类名称",
        type: "input",
        disabled: false,
        span: 11,
    },
    {
        prop: "start_date",
        label: "开始日期",
        placeholder: "开始日期",
        type: "date",
        disabled: false,
        span: 11,
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyyMMdd',
        blur:'startBlur'
    },
    {
        prop: "end_date",
        label: "结束日期",
        placeholder: "结束日期",
        type: "date",
        disabled: false,
        span: 11,
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyyMMdd',
        blur:'endBlur'
    },
    {
        prop: "interface_note",
        label: "备注",
        placeholder: "请输入备注",
        type: "textarea",
        disabled: false,
        span: 11,
    },
];
const modelFormRules = {
    userIds: [{ required: true, message: "请选择用户名称", trigger: "blur",}],
};
const modelFormConfig = {
    labelWidth: "100px",
    inline: false,
    ref: "checkForm",
};
export {
    pagination,
    columnArr,
    modelFormItems,
    modelFormRules,
    modelFormConfig,
};
