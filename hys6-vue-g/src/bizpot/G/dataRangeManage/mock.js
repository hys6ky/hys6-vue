const pagination = {
    total: 0,
    pageNum: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
};
const columnArr = [
    { type: "selection", width: "60",align: "center" },
    { label: "序号", type: "index", width: "70" },
    { label: "采集原始表名", prop: "table_name", type: "text", minWidth: "120" },
    { label: "原始表中文名", prop: "original_name", type: "text", minWidth: "120" },
    { label: "系统内对应表名", prop: "hyren_name", type: "text", minWidth: "120" },
    {
        type: "operate",
        label: "选择字段",
        width: "150",
        fixed: "right",
        operateArr: [
            { label: "选择字段", type: "selectColumn" },
        ],
    },
];
const columnArr1 = [
    { type: "selection", width: "60",align: "center" },
    { label: "序号", type: "index", width: "70" },
    { label: "字段英文名", prop: "column_name", type: "text" },
    { label: "字段中文名", prop: "column_ch_name", type: "text",fixed: "right" },
];
const modelFormItems = [
    {
        label: "用户选择",
        prop: "user_id",
        type: "select",
        placeholder: "请输入用户选择",
        labelWidth: "80px",
        span: 12,
        options: [],
        checkStrictly: true,
        multiple: true,
        props: {
            value: "user_id",
            label: "user_name",
            checkStrictly: true,
        }
    },
    {
        label: "备注",
        prop: "table_note",
        type: "input",
        placeholder: "请输入备注",
        labelWidth: "50px",
        span: 12
    },
];
const modelFormRules = {
    user_id: [{ required: true, message: "请至少选择一项", trigger: "blur" }],

};
const modelFormConfig = {
    labelWidth: "100px",
    inline: false,
    ref: "checkForm",
};

export {
    pagination,
    columnArr,
    columnArr1,
    modelFormItems,
    modelFormRules,
    modelFormConfig,
};
