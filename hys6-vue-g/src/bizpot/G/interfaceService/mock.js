const columnArr = [
    { label: "序号", type: "index", width: "70" },
    { label: "接口名称", prop: "interface_name", type: "text", minWidth: "100" },
    { label: "开始日期", prop: "start_use_date_txt", type: "text", minWidth: "80" },
    { label: "结束日期", prop: "use_valid_date_txt", type: "text", minWidth: "80" },
    { label: "接口使用API查看", prop: "interface_name", type: "link",minWidth: "160",placeholder: "接口名称(Enter)",
        filter: true, fixed: "right"},
    // {
    //     type: "operate_select",
    //     label: "操作",
    //     placeholder: "系统参数名称(Enter)",
    //     filter: true,
    //     width: "200px",
    //     operateArr: [
    //         { label: "查看接口", type : "view", }
    //     ],
    // },
];
const columnArr1 = [
    { label: "序号", type: "index", width: "70" },
    { label: "系统登记表名", prop: "sysreg_name", type: "text", minWidth: "100" },
    { label: "原始表中文名", prop: "original_name", type: "text", minWidth: "80" },
    {
        type: "operate",
        label: "表列信息查看",
        placeholder: "表名称(Enter)",
        filter: true,
        minWidth: "130px",
        operateArr: [
            { label: "表字段查看", type : "view", }
        ],
    },
];
const ApiColumnArr = [
    { label: "字段", prop: "field", type: "text", width: "200"},
    { label: "类型", prop: "fieldType", type: "text", width: "100" },
    { label: "是否必填", prop: "isRequired", type: "text" },
    { label: "描述", prop: "remark", type: "text",fixed: "right" },
];
const modelColumnArr = [
    { label: "序号", type: "index", width: "70" },
    { label: "字段英文名", prop: "table_en_column", type: "text" },
    { label: "字段中文名", prop: "table_ch_column", type: "text" },
];
const pagination = {
    total: 0,
    pageNum: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
};
export {
    columnArr,
    pagination,
    columnArr1,
    modelColumnArr,
    ApiColumnArr
};
