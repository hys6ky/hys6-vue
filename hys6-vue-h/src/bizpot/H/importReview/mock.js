import Vue from "vue";
var vm = new Vue();
/**
 * @description: 用于数据加工——配置首页的mock数据
 */
const modelFormItems = [
  {
    prop: "mart_name",
    label: "工程名称",
    placeholder: "请输入工程名称",
    type: "input",
    span: 24,
  },
  {
    prop: "mart_number",
    label: "工程编号",
    placeholder: "请输入工程编号",
    type: "input",
    span: 24,
  },
  {
    prop: "mart_desc",
    label: "备注",
    placeholder: "请输入备注",
    type: "textarea",
  },
];
const modelFormConfig = {
  labelWidth: "130px",
  inline: false,
  ref: "dataMartForm",
};
const modelFormData = {
  mart_name: "",
  mart_number: "",
  mart_desc: "",
};
const modelFormRules = {
  mart_name: vm.filter_rules([{ required: true }]),
  mart_number: vm.filter_rules([{ required: true }]),
};
const modelFormGroupItems = [
  {
    prop: "category_name",
    label: "分类名称",
    placeholder: "请输入分类名称",
    type: "input",
    span: 24,
  },
  {
    prop: "category_num",
    label: "分类编号",
    placeholder: "请输入分类编号",
    type: "input",
    span: 24,
  },
  // {
  //   prop: "data_mart_ids",
  //   label: "工程名称",
  //   placeholder: "请输入工程名称",
  //   type: "input",
  //   span: 24,
  // },
  {
    prop: "parent_category_id",
    label: "上级分类",
    placeholder: "请选择上级分类",
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
  {
    prop: "category_desc",
    label: "分类备注",
    placeholder: "请输入分类备注",
    type: "textarea",
    span: 24,
  },
];
const modelFormGroupConfig = {
  labelWidth: "130px",
  inline: false,
  ref: "dataMartGroupForm",
};
const modelFormGroupRules = {
  category_name: vm.filter_rules([{ required: true }]),
  category_num: vm.filter_rules([{ required: true }]),
  // data_mart_ids: vm.filter_rules([{ required: true }]),
  parent_category_id: vm.filter_rules([{ required: true }]),
};
const modelFormGroupData = {
  category_name: "",
  category_num: "",
  // data_mart_ids: "",
  parent_category_id: [],
  category_desc: "",
};
const modelFormGroupNameItems = [
  {
    prop: "category_name",
    label: "分类名称",
    placeholder: "请输入分类名称",
    type: "input",
    span: 24,
  },
];
const modelFormGroupNameData = {
  category_name: "",
  category_id: "",
};
const modelFormGroupNameRules = {
  category_name: vm.filter_rules([{ required: true }]),
};
const modelFormGroupNameConfig = {
  labelWidth: "130px",
  inline: false,
  ref: "dataMartGroupNameForm",
};

export {
  modelFormConfig,
  modelFormData,
  modelFormRules,
  modelFormItems,
  modelFormGroupItems,
  modelFormGroupConfig,
  modelFormGroupRules,
  modelFormGroupData,
  modelFormGroupNameItems,
  modelFormGroupNameData,
  modelFormGroupNameRules,
  modelFormGroupNameConfig,
};
