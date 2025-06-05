import Vue from "vue";
var vm = new Vue();
export const formItems = [
  {
    prop: "verify_date",
    label: "检查日期",
    type: "date",
  },
  {
    prop: "start_date",
    label: "执行日期",
    type: "date",
  },
  {
    prop: "rule_src",
    label: "规则来源",
    type: "input",
  },
  {
    prop: "rule_tag",
    label: "规则标签",
    type: "input",
  },
  {
    prop: "reg_name",
    label: "规则名称",
    type: "input",
  },
  {
    prop: "reg_num",
    label: "规则编号",
    type: "input",
  },
  {
    prop: "exec_mode",
    label: "执行方式",
    type: "select",
    multiple: true,
    options: [],
  },
  {
    prop: "verify_result",
    label: "检查结果",
    type: "select",
    multiple: true,
    options: [],
  },
  {
    prop: "case_type",
    label: "规则类型",
    type: "select",
    multiple: true,
    options: [],
  },
];

export const columnArr = [
  { prop: "tag", type: "selection", width: "70", align: "center" },
  { label: "序号", type: "index", width: "80", align: "center" },
  { prop: "verify_date", type: "date", label: "检查日期", minWidth: "130px" },
  { prop: "reg_name", type: "text", label: "规则名称", minWidth: "130px" },
  { prop: "reg_num", type: "text", label: "规则编号", minWidth: "130px" },
  { prop: "flags_name", type: "text", label: "规则级别", minWidth: "130px" },
  { prop: "rule_src", type: "text", label: "规则来源", minWidth: "130px" },
  { prop: "rule_tag", type: "text", label: "规则标签", minWidth: "130px" },
  { prop: "target_tab", type: "text", label: "目标表名", minWidth: "130px" },
  {
    prop: "start_date_time",
    type: "dateTime",
    label: "执行开始时间",
    width: "180px",
  },
  {
    prop: "verify_result_txt",
    type: "text",
    label: "检查结果",
    width: "130px",
  },
  { prop: "exec_mode_txt", type: "text", label: "执行方式", width: "130px" },
  {
    type: "operate",
    label: "操作",
    width: "200px",
    operateArr: [{ label: "查看详情", type: "check" }],
  },
];

export const historyColumnArr = [
  { label: "序号", type: "index", width: "80px", align: "center" },
  { prop: "task_id", type: "text", label: "任务编号", minWidth: 130 },
  { prop: "verify_date", type: "text", label: "检测数据日期", minWidth: 130 },
  { prop: "verify_resultValue", type: "text", label: "检测结果", minWidth: 130 },
  {
    type: "operate",
    label: "操作",
    width: "200px",
    operateArr: [
      { icon: "el-icon-s-unfold", label: "查看详情", type: "check" },
    ],
  },
];


export const ruleDeteItem = [
  {
    prop: "task_id",
    label: "任务编号",
    type: "input",
    disabled: true,
    span: 6,
  },
  {
    prop: "reg_num",
    label: "规则编号",
    type: "input",
    disabled: true,
    span: 6,
  },{
    prop: "case_type_txt",
    label: "规则类型",
    type: "input",
    disabled: true,
    span: 6,
  },
  {
    prop: "exec_mode_txt",
    label: "执行方式",
    type: "input",
    disabled: true,
    span: 6,
  },{
    prop: "verify_date",
    label: "检查日期",
    type: "input",
    disabled: true,
    span: 6,
  },
  {
    prop: "target_tab",
    label: "检测表名",
    type: "input",
    disabled: true,
    span: 6,
  },{
    prop: "target_key_fields",
    label: "检测字段",
    type: "input",
    disabled: true,
    span: 6,
  },
  {
    prop: "verify_result_txt",
    label: "检测结果",
    type: "input",
    disabled: true,
    span: 6,
  },
  {
    prop: "start_date_time",
    label: "开始时间",
    type: "input",
    disabled: true,
    span: 6,
  },{
    prop: "end_date_time",
    label: "结束时间",
    type: "input",
    disabled: true,
    span: 6,
  },
  {
    prop: "elapsed_ms",
    label: "执行耗时(ms)",
    type: "input",
    disabled: true,
    span: 6,
  },{
    prop: "check_index1",
    label: "指标结果1",
    type: "input",
    disabled: true,
    span: 6,
  },
  {
    prop: "check_index2",
    label: "指标结果2",
    type: "input",
    disabled: true,
    span: 6,
  }
]

export const rulesDeteFormConfig = {
  labelWidth: "150px",
  inline: true,
  ref: "aaaa",
}