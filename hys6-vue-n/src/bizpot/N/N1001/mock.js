import Vue from "vue";
var vm = new Vue();
export const columnArr = [
  {
    prop: "index",
    label: "序号",
    type: "index",
    width: "70px",
    align: "center",
  },
  { prop: "catalog_name", type: "text", label: "编目名称", minWidth: "120px" },
  { prop: "catalog_code", type: "text", label: "编目代码", minWidth: "170px" },
  { prop: "publish_status", type: "tag2", label: "状态", minWidth: "120px" },
  { prop: "create_by", type: "text", label: "创建人", minWidth: "100px" },
  { prop: "create_date", type: "text", label: "创建日期", minWidth: "170px" },
  { prop: "create_time", type: "text", label: "创建时间", minWidth: "170px" },
  {
    type: "operate",
    width: "150px",
    label: "操作",
    operateArr: [
      { label: "编辑", type: "bj" },
      { label: "类目", type: "lm" },
      { label: "删除", type: "del" },
    ],
  },
];

export const table = [];

export const formItems = [
  {
    label: "编目代码",
    prop: "bbbt",
    type: "input",
    placeholder: "请输入编目代码",
    Width: "180px",
  },
];

export const modelFormItems = [
  {
    prop: "catalog_name",
    label: "编目名称",
    placeholder: "请输入编目",
    type: "input",
    span: 24,
  },
  {
    prop: "catalog_code",
    label: "编目代码",
    placeholder: "请输入编目代码",
    type: "input",
    span: 24,
  },
];
export const modelFormConfig = {
  labelWidth: "130px",
  inline: false,
  ref: "dataMartForm",
};
export const modelFormData = {
  catalog_id: 0,
  catalog_name: "",
  catalog_code: "",
};
export const modelFormRules = {
  catalog_name: vm.filter_rules([{ required: true }]),
};
