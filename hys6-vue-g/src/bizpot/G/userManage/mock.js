const formItems = [
    {
        label: "用户名称",
        prop: "user_name",
        type: "input",
        placeholder: "请输入用户名称",
        labelWidth: "80px",
    },
    {
        label: "备注",
        prop: "table_note",
        type: "input",
        placeholder: "请输入备注",
        labelWidth: "80px",
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
    { label: "用户名称", prop: "user_name", type: "text", minWidth: "120" },
    { label: "操作员登录账号", prop: "user_id", type: "text", minWidth: "120" },
    { label: "密码", prop: "user_password", type: "text", minWidth: "120" },
    { label: "邮箱地址", prop: "user_email", type: "text", minWidth: "120" },
    { label: "备注", prop: "user_remark", type: "text", minWidth: "120" },
    {
        type: "operate",
        label: "选择字段",
        width: "200px",
        operateArr: [
            { label: "编辑", type: "edit" },
            { label: "删除", type: "del" },
        ],
    },
];
const modelFormItems = [
    {
        prop: "user_name",
        label: "用户名称",
        placeholder: "请输入用户名称",
        type: "input",
        disabled: false,
        span: 24,
    },
    {
        prop: "user_password",
        label: "用户密码",
        placeholder: "请输入用户密码",
        type: "password",
        disabled: false,
        span: 24,
    },
    {
        prop: "user_email",
        label: "邮箱地址",
        placeholder: "请输入邮箱地址",
        type: "input",
        disabled: false,
        span: 24,
    },
    {
        prop: "user_remark",
        label: "备注",
        placeholder: "请输入备注",
        type: "textarea",
        disabled: false,
        span: 24,
    },
];
const modelFormRules = {
    user_name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
    user_password: [{ required: true, message: "请输入用户名称", trigger: "blur" },
        {pattern: /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{6,18}$/ ,message: "密码不合法(以字母开头，长度在6~18字符之间，只能包含字母、数字和下划线)",trigger: "blur"}],
    user_email: [{ required: true, message: "请输入用户名称", trigger: "blur" },
        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}],

};
const modelFormConfig = {
    labelWidth: "100px",
    inline: false,
    ref: "checkForm",
};

export {
    formItems,
    pagination,
    columnArr,
    modelFormItems,
    modelFormRules,
    modelFormConfig,
};
