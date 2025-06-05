const formItems = [
    {
        label: "有效日期",
        prop: "use_valid_date",
        type: "date",
        placeholder: "结束日期",
        // labelWidth: "80px",
        size: "small",
    },
    {
        label: "用户选择",
        prop: "user_id",
        type: "select",
        placeholder: "请输入用户选择",
        size: "small",
        //labelWidth: "80px",
        options: [],
        checkStrictly: true,
        props: {
            value: "user_id",
            label: "user_name",
            checkStrictly: true,
        }
    },
];
const formItems1 = [
    {
        label: "用户选择",
        prop: "user_id",
        type: "select",
        placeholder: "请选择",
        size: "small",
        labelWidth: "80px",
        options: [],
        checkStrictly: true,
        props: {
            value: "user_id",
            label: "user_name",
            checkStrictly: true,
        }
    },
];
const pagination = {
    total: 0,
    pageNum: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
};
const columnArr = [
    { label: "序号", type: "index", width: "70" },
    { label: "接口名称", prop: "interface_name", type: "text", minWidth: "100" },
    { label: "接口代码", prop: "interface_code", type: "text", minWidth: "70" },
    { label: "使用用户", prop: "user_name", type: "text", minWidth: "70" },
    { label: "开始日期", prop: "start_use_date_txt", type: "text", minWidth: "70" },
    { label: "结束日期", prop: "use_valid_date_txt", type: "text", minWidth: "70" },
    { label: "响应时间", prop: "response_time", type: "text",minWidth: "160" },
    { label: "接口使用状态", prop: "use_state_Txt", type: "text", minWidth: "80" },
    {
        type: "operate",
        label: "操作",
        width: "130px",
        operateArr: [
            { label: "禁用", type: "ban",hide: row => {
                    if(row.use_state == "1") {
                        return true;
                    } else {
                        return false;
                    }
                } },
            { label: "启用", type: "ban",hide: row => {
                    if(row.use_state == "1") {
                        return false;
                    } else {
                        return true;
                    }
                } },
            { label: "编辑", type: "edit" },
            { label: "删除", type: "del" },
        ],
    },
];
const columnArr1 = [
    { label: "序号", type: "index", width: "70" },
    { label: "系统登记表名", prop: "sysreg_name", type: "text" },
    { label: "原始表中文名", prop: "original_name", type: "text" },
    { label: "使用用户", prop: "user_name", type: "text", width: "160" },
    {
        type: "operate",
        label: "操作",
        width: "130px",
        operateArr: [
            { label: "查看字段", type: "view" },
            { label: "删除", type: "del" },
        ],
    },
];
const form = {
    interface_use_id: '',
    start_use_date: '',
    use_valid_date: ''
};
const modelFormItems = [
    {
        prop: "start_use_date",
        label: "开始日期",
        placeholder: "开始日期",
        type: "date",
        disabled: false,
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyyMMdd',
    },
    {
        prop: "use_valid_date",
        label: "有效截止日期",
        placeholder: "有效截止日期",
        type: "date",
        disabled: false,
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyyMMdd',
    },
];
const modelColumnArr = [
    { label: "序号", type: "index", width: "70" },
    { label: "字段英文名", prop: "table_en_column", type: "text" },
    { label: "字段中文名", prop: "table_ch_column", type: "text",fixed: "right" },
];
const modelFormRules = {
    start_use_date: [{ required: true, message: "该输入项为必填项", trigger: "blur" }],
    use_valid_date: [{ required: true, message: "该输入项为必填项", trigger: "blur" }],

};
const modelFormConfig = {
    labelWidth: "150px",
    inline: false,
    ref: "checkForm",
};

export {
    formItems,
    formItems1,
    pagination,
    columnArr,
    columnArr1,
    modelFormItems,
    modelFormRules,
    modelColumnArr,
    modelFormConfig,
    form
};
