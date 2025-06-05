// 筛选数据
const formItems = [
  {
    prop: "task_name",
    label: "任务名称",
    type: "input",
  },
  {
    prop: "end_date",
    label: "任务完成时间",
    type: "date",
  },
  {
    prop: "owner_id",
    label: "开发人员",
    multiple: true,
    type: "select",
    options: [],
  },
  {
    prop: "tester_id",
    label: "测试人员",
    multiple: true,
    type: "select",
    options: [],
  },
  {
    prop: "task_status_txt",
    label: "测试状态",
    type: "select",
    options: [],
  },
  // {
  //   prop: "test_status",
  //   label: "测试结果",
  //   type: "select",
  //   options: [
  //     { value: 1, label: "--" },
  //     { value: 2, label: "未通过" },
  //     { value: 3, label: "已通过" },
  //   ],
  // },
];

// 列表数据
const columnArr = [
  { type: "index", label: "序号", width: "80px", align: "center" },
  { prop: "task_name", type: "text", label: "任务名称", minWidth: "180px" },
  { prop: "data_req_name", type: "text", label: "数据需求", minWidth: "180px" },
  { prop: "biz_name", type: "text", label: "业务需求", minWidth: "180px" },
  { prop: "end_date", type: "text", label: "任务完成时间", minWidth: "180px" },
  {
    prop: "task_category_txt",
    type: "text",
    label: "任务类型",
    minWidth: "180px",
  },
  { prop: "task_status_txt", type: "text", label: "测试状态", minWidth: "180px" },
  { prop: "owner_name", type: "text", label: "开发人员", minWidth: "180px" },
  {
    prop: "tester_name",
    type: "text",

    label: "测试人员",
    minWidth: "180px",
  },

  // { prop: "test_status", type: "text", label: "测试结果", width: "130px" },

  {
    type: "operate",
    label: "操作",
    width: "180px",
    operateArr: [
      { label: "测试", type: "test" },
      {
        label: "测试反馈",
        type: "feedBack",
        hide: (row) => {
          let status = row.task_status;
          if (
            !(
              (status && status.replaceAll(" ", "")) == 3 ||
              (status && status.replaceAll(" ", "")) == 4 ||
              (status && status.replaceAll(" ", "")) == 6
            )
          ) {
            return false;
          } else {
            return true;
          }
        },
      },
    ],
  },
];
// 列表数据;
const tableData = [];

const testColumnArr = [
  { prop: "point_name", type: "text", label: "测试要点名称" },
  { prop: "point_type_txt", type: "text", label: "测试要点类型" },
  { prop: "rel_user", type: "text", label: "要点关联人员" },
  {
    type: "operate",
    label: "操作",
    width: "200px",
    operateArr: [
      { label: "删除", type: "del" },
      { label: "配置变量", type: "configuration" },
    ],
  },
];
const testTableData = [
  {
    point_id: "测试要点名称",
    point_type: "测试要点类型",
    rel_user: "要点关联人员",
  },
];

// 要点数据
const pointsTableData = [
  {
    point_name: "",
    task_category: "",
    point_type: "",
    created_by: "",
    create_time: "",
    updated_by: "",
    updated_time: "",
  },
];
const pointsColumnArr = [
  { prop: "tag", type: "selection", align: "center", width: "70" },
  { prop: "point_name", type: "text", label: "要点名称" },
  { prop: "task_category_txt", type: "text", label: "适用层级" },
  { prop: "point_type_txt", type: "text", label: "要点类型" },
  { prop: "created_by", type: "text", label: "创建人" },
  { prop: "created_time", type: "text", label: "创建时间" },
  { prop: "updated_by", type: "text", label: "最后修改人" },
  { prop: "updated_time", type: "text", label: "最后修改时间" },
];

// 配置变量
const variableColumnArr = [
  { prop: "var_key", type: "text", label: "变量" },
  { prop: "var_val", type: "text", label: "值" },
  {
    type: "operate",
    label: "操作",
    width: "200px",
    operateArr: [
      { label: "添加", type: "addVariable" },
      { label: "删除", type: "delVariable" },
    ],
  },
];
const rules = {
  var_key: { required: true, message: "请输入变量", trigger: "blur" },
  var_val: { required: true, message: "请输入值", trigger: "blur" },
};

//测试反馈
const feedbackTableData = [];
const feedbackColumnArr = [
  { prop: "point_name", type: "text", label: "测试要点名称", width: "150px" },
  {
    prop: "point_type_txt",
    type: "text",
    label: "测试要点类型",
    width: "150px",
  },
  {
    prop: "task_category_txt",
    type: "text",
    label: "适用层级",
    width: "150px",
  },
  { prop: "rel_user", type: "text", label: "要点关联人员" },
  { prop: "test_result", type: "text", label: "测试结果", width: "350px" },
];
export {
  formItems,
  columnArr,
  rules,
  tableData,
  testTableData,
  testColumnArr,
  pointsColumnArr,
  pointsTableData,
  variableColumnArr,
  feedbackColumnArr,
  feedbackTableData,
};
