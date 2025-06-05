const formItems = [
    // {
    //     label: "部门名称",
    //     prop: "dep_name",
    //     type: "input",
    //     placeholder: "请输入部门名称",
    //     labelWidth: "80px",
    // },
];
const treeData = [
    {
        id: 0,
        label: "添加目录",
        showLabel: "添加目录",
        expanded: false,
        type: "add",
    },
];
const pagination = {
    total: 0,
    pageNum: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
};
const columnArr = [
    { label: "序号", type: "index", width: "80" },
    { label: "部门名称", prop: "dep_name", type: "text", minWidth: "120" },
    { label: "上级部门ID", prop: "sup_dep_id", type: "text", minWidth: "120" },
    { label: "上级部门", prop: "sup_dep_Txt", type: "text", minWidth: "120" },
    { label: "备注", prop: "dep_remark", type: "text", minWidth: "120" },
    {
        type: "operate",
        label: "操作",
        width: "200px",
        operateArr: [
            { label: "编辑", type: "edit" },
            { label: "删除", type: "del" },
        ],
    },
];
const modelFormItems = [
    {
        prop: "dep_name",
        label: "部门名称",
        placeholder: "请输入部门名称",
        type: "input",
        disabled: false,
        span: 24,
    },
    {
        prop: "dep_remark",
        label: "备注",
        placeholder: "请输入备注",
        type: "input",
        disabled: false,
        span: 24,
    },
    {
        prop: "sup_dep_id",
        label: "上级部门",
        placeholder: "请选择上级部门",
        type: "cascader",
        span: 24,
        options: [],
        checkStrictly: true,
        disabled: true,
        props: {
            value: "id",
            label: "label",
            checkStrictly: true,
        },
    },
];
const modelFormRules = {
    dep_name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
    // sup_dep_id: [{ required: true, message: "请选择上级部门", trigger: "blur" }],
};
const modelFormConfig = {
    labelWidth: "100px",
    inline: false,
    ref: "checkForm",
};
export {
    treeData,
    formItems,
    pagination,
    columnArr,
    modelFormItems,
    modelFormRules,
    modelFormConfig,
};
