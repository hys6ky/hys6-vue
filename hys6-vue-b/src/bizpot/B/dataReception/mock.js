const columnArr = [
    // {
    //     label: "选择",
    //     prop: "check",
    //     type: "selection",
    //     width: "60",
    // },
    { label: "序号", type: "index", width: "70" },
    { label: "定义", prop: "dr_anal_name", type: "input", minWidth: "100" },
    { label: "数据解析", prop: "dr_anal", type: "text", minWidth: "170" },
    {
        type: "operate",
        label: "操作",
        width: "150px",
        operateArr: [
            { label: "删除", type: "del" },
        ],
    },
];
export {
    columnArr,
};
