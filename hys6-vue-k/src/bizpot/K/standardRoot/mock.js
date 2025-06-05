import Vue from "vue";
var vm = new Vue();
export const formItems = [
  {
    label: "词根中文名称",
    prop: "norm_cname",
    type: "input",
    placeholder: "请输入词根中文名称",
    labelWidth: "100px",
  },
  {
    label: "词根英文名称",
    prop: "norm_ename",
    type: "input",
    placeholder: "请输入词根英文名称",
    labelWidth: "100px",
  },
];
export const columnArr = [
  { label: "序号", type: "index", width: "80" },
  { prop: "norm_cname", type: "text", label: "词根中文名称", minWidth: "120" },
  { prop: "norm_ename", type: "text", label: "词根英文名称", minWidth: "120" },
  // {
  //   prop: "norm_enameShort",
  //   type: "text",
  //   label: "词根英文简称",
  //   minWidth: "120",
  // },
  {
    type: "operate",
    label: "操作",
    width: "120px",
    operateArr: [
      { label: "删除", type: "del" },
      { label: "编辑", type: "edit" },
    ],
  },
];
export const modelFormItems = [
  {
    prop: "norm_cname",
    label: "词根中文名称",
    placeholder: "请输入词根中文名称",
    type: "input",
    disabled: false,
    span: 24,
  },
  {
    prop: "norm_ename",
    label: "词根英文名称",
    placeholder: "请输入词根英文名称",
    type: "input",
    disabled: false,
    span: 24,
  },
  // {
  //   prop: "norm_enameShort",
  //   label: "词根英文简称",
  //   placeholder: "请输入词根英文简称",
  //   type: "input",
  //   disabled: false,
  //   span: 24,
  // },
];
export const modelFormConfig = {
  labelWidth: "130px",
  inline: false,
  ref: "standardRootForm",
};
export const modelFormRules = {
  norm_cname: vm.filter_rules([
    { required: true, message: "请输入规则名称" },
    { required: true, dataType: "chinese" },
  ]),
  norm_ename: vm.filter_rules([
    { required: true, message: "请输入规则英文名称" },
    { required: true, dataType: "table" },
  ]),
};
