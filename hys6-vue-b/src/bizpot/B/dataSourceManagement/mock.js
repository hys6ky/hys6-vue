import Vue from "vue";
var vm = new Vue();
/**
 * @description: 用于数据加工——配置首页的mock数据
 */
const modelFormItems = [
  {
    prop: "datasource_number",
    label: "数据源编号",
    placeholder: "请输入数据源编号",
    type: "input",
    span: 24,
  },
  {
    prop: "datasource_name",
    label: "数据源名称",
    placeholder: "请输入数据源名称",
    type: "input",
    span: 24,
  },
  {
    prop: "dep_id",
    label: "所属部门",
    placeholder: "请选择所属部门",
    type: "select",
    span: 24,
    options: [],
  },
  {
    prop: "source_remark",
    label: "数据源详细描述",
    placeholder: "请输入数据源详细描述",
    type: "textarea",
  },
];
const modelFormConfig = {
  labelWidth: "130px",
  inline: false,
  ref: "dataSourceManagement",
};
const modelFormData = {
  datasource_name: "",
  datasource_number: "",
  dep_id:'',
  source_remark: "",
};
const modelFormRules = {
  datasource_name: vm.filter_rules([{ required: true }]),
};

export {
  modelFormConfig,
  modelFormData,
  modelFormRules,
  modelFormItems,
};
