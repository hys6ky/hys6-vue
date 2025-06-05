import Vue from "vue";
import * as validator from "@/utils/validator";
const rule = validator.default;
var vm = new Vue();
/**
 * @description: 用于数据加工——配置数据表的mock数据
 */
const formData = {
  datatable_en_name: "",
  datatable_cn_name: "",
  repeat_flag: "",
  sql_engine: "",
  datatable_desc: "",
  storage_type: "",
  table_storage: "",
  datatable_lifecycle: "",
  category_id: "",
  datatable_due_date: "",
};
const formList = [
  {
    title: "基础配置",
    formItems: [
      {
        label: "表英文名",
        prop: "datatable_en_name",
        span: 12,
        type: "input",
      },
      {
        label: "表中文名",
        prop: "datatable_cn_name",
        span: 12,
        type: "input",
      },
      {
        label: "是否已存在表",
        prop: "repeat_flag",
        span: 12,
        type: "radio",
        options: [],
      },
      {
        label: "数据存储方式",
        prop: "table_storage",
        span: 12,
        type: "radio",
        options: [],
      },
      {
        label: "执行引擎",
        prop: "sql_engine",
        span: 24,
        type: "radio",
        options: [],
      },
      {
        label: "进数方式",
        prop: "storage_type",
        span: 24,
        type: "radio",
        options: [],
      },
      {
        label: "数据生命周期",
        prop: "datatable_lifecycle",
        span: 12,
        type: "radio",
        options: [],
      },
      {
        label: "选择分类信息",
        prop: "category_id",
        span: 12,
        type: "select",
        options: [],
      },
      {
        label: "数据表到期日期",
        prop: "datatable_due_date",
        span: 12,
        type: "date",
      },
      {
        label: "表描述",
        prop: "datatable_desc",
        span: 24,
        type: "textarea",
      },
    ],
  },
];
const formRules = {
  datatable_en_name: vm.filter_rules([{ required: true }]),
  datatable_cn_name: rule.default,
  repeat_flag: rule.selected,
  sql_engine: rule.selected,
  storage_type: rule.selected,
  table_storage: rule.selected,
  datatable_lifecycle: rule.selected,
  category_id: rule.selected,
  datatable_due_date: rule.selected,
};
const formConfig = {
  labelWidth: "160px",
  inline: false,
  ref: "marketTableForm",
};
const columnArr = [
  {
    label: "选择",
    prop: "checked",
    type: "radio",
    width: "70px",
  },
  { label: "序号", type: "index", width: "70" },
  { label: "名称", prop: "dsl_name", type: "text", minWidth: "120" },
  { label: "存储类型", prop: "store_type", type: "text", minWidth: "120" },
  { label: "备注", prop: "dsl_remark", type: "text", minWidth: "120" },
  {
    label: "hadoop客户端",
    prop: "is_hadoopclient",
    type: "text",
    minWidth: "120px",
  },
  {
    label: "操作",
    type: "operate",
    width: "260px",
    filter: true,
    placeholder: "请输入内容",
    operateArr: [
      {
        label: "数据存储层属性",
        type: "storeConfig",
      },
    ],
  },
];
const columnArrConfig = [
  { label: "序号", type: "index", width: "70" },
  { label: "key", type: "text", prop: "storage_property_key", minWidth: "100" },
  {
    label: "value",
    type: "text",
    prop: "storage_property_val",
    minWidth: "100",
  },
  {
    label: "描述",
    type: "text",
    prop: "dsla_remark",
    minWidth: "100",
    fixed: "right",
  },
];
const modalFormItems = [
  {
    label: "附加信息",
    prop: "dsla_storelayer",
    span: 24,
    type: "checkbox",
    disabled: true,
    options: [],
  },
];
const modalFormData = {
  dsla_storelayer: true,
};
const modalFormConfig = {
  labelWidth: "100px",
  inline: false,
  ref: "storeConfigForm",
};
const sqlColumnArr = [
  { label: "序号", type: "index", width: "70" },
  {
    label: "字段英文名",
    prop: "field_en_name",
    type: "input",
    minWidth: "200",
    placeholder: "英文名",
  },
  {
    label: "字段中文名",
    prop: "field_cn_name",
    type: "input",
    minWidth: "200",
    placeholder: "英文名",
  },
  {
    label: "字段类型",
    prop: "field_type",
    type: "select",
    allowCreate: true,
    filterable: true,
    minWidth: "150",
    options: [],
  },
  {
    label: "字段长度",
    prop: "field_length",
    type: "definedInput",
    minWidth: "130",
    placeholder: "长度",
  },
  {
    label: "处理方式",
    prop: "field_process",
    type: "select",
    minWidth: "200",
    options: [],
    placeholder: "处理方式",
    headerToolTip:
      "映射仅赋值：源表字段的值直接给模型表；\n映射且修改：源表的值通过写映射规则进行修改，改变后的值给模型表；\n分组映射：源表字段的值直接给模型表，同时映射规则填写模型表的字段=某个类别，如type=1的格式进行分组（横表转竖表时用） ",
  },
  {
    label: "来源值",
    prop: "process_mapping",
    type: "definedInput",
    minWidth: "300",
  },
  // {
  //   label: "主键",
  //   prop: "",
  //   type: "check",
  //   minWidth: "70",
  // },
  {
    label: "描述",
    prop: "field_desc",
    type: "input",
    minWidth: "200",
    placeholder: "描述",
  },
  {
    label: "操作",
    type: "operate",
    width: "160px",
    operateArr: [
      {
        label: "上移",
        type: "up",
      },
      {
        label: "下移",
        type: "down",
      },
      {
        label: "删除",
        type: "delete",
      },
    ],
  },
];
const step3FormList = [
  {
    title: "",
    formItems: [
      {
        label: "SQL",
        prop: "querysql",
        span: 24,
        type: "textarea",
        readonly: true,
        autosize: { minRows: 12, maxRows: 16 },
      },
      {
        label: "变量",
        prop: "parameter",
        span: 18,
        type: "input",
        placeholder: "参数如: 自定义名称=123;自定义名称2=456,中间用分号;隔开",
      },
      {
        label: "日期",
        prop: "date",
        span: 6,
        type: "date",
      },
    ],
  },
];
const step3FormConfig = {
  labelWidth: "100px",
  inline: false,
  ref: "step3Form",
};
const prodeceJobsFormItems = [
  {
    label: "选择工程",
    prop: "selectedetlsys",
    placeholder: "选择工程",
    span: 24,
    type: "select",
    valueShow: "true",
    options: [],
  },
  {
    label: "选择任务",
    prop: "selectedetltask",
    span: 24,
    type: "select",
    placeholder: "选择任务",
    valueShow: "true",
    options: [],
  },
];
const prodeceJobsFormConfig = {
  labelWidth: "100px",
  inline: false,
  ref: "prodeceJobsForm",
};
const databyColumnArr = [{ label: "序号", type: "index", width: "70" }];
const columnTableArr = [
  { label: "序号", type: "index", width: "70" },
  {
    label: "字段英文名",
    prop: "value",
    type: "text",
    minWidth: "120",
  },
  {
    label: "操作",
    type: "operate",
    width: "300px",
    filter: true,
    placeholder: "输入列名搜索",
    operateArr: [
      {
        label: "选择",
        type: "select",
      },
    ],
  },
];
const tablecolumnArr = [
  {
    type: "selection",
    width: 60,
  },
  { label: "序号", type: "index", width: "70" },
  {
    label: "字段英文名",
    prop: "column_name",
    type: "text",
    minWidth: "120",
  },
  {
    label: "字段类型",
    prop: "data_type",
    type: "text",
    minWidth: "120",
  },
  {
    label: "长度",
    prop: "data_len",
    type: "text",
    minWidth: "120",
    fixed: "right",
  },
];
const selectTableCreateFormItems = [
  {
    label: "select",
    prop: "selectColumns",
    placeholder: "选择列",
    type: "input",
    span: 14,
  },
  {
    label: "表名称",
    prop: "table_name",
    placeholder: "表名称",
    type: "inputDefined",
    slot: "append",
    span: 14,
  },
  {
    prop: "addRelationTable",
    type: "otherDefined",
    span: 8,
  },
  {
    prop: "relationNums",
    type: "listInForm",
    span: 24,
  },
  {
    label: "where",
    prop: "whereColumns",
    type: "input",
    placeholder: "过滤条件,如果使用占位符，使用方式如：column=#{column}",
    span: 14,
  },
  {
    label: "group by",
    prop: "groupByColumns",
    type: "input",
    placeholder: "分组条件",
    span: 14,
  },
];
const selectTableCreateConfig = {
  labelWidth: "100px",
  inline: false,
  ref: "createTableForm",
};
const selectTablecolumnArr = [
  {
    label: "选择",
    type: "radio",
    width: 70,
    prop: "checked",
  },
  { label: "序号", type: "index", width: "70" },
  {
    label: "采集原始表名",
    prop: "table_name",
    type: "text",
    minWidth: "120",
  },
  {
    label: "原始表中文名",
    prop: "original_name",
    type: "text",
    minWidth: "120",
  },
  {
    label: "系统内对应表名",
    prop: "hyren_name",
    type: "text",
    minWidth: "120",
  },
  {
    label: "选择字段",
    type: "operate",
    width: "100px",
    operateArr: [
      {
        label: "选择字段",
        type: "select",
      },
    ],
  },
];
const hbasesortColumnArr = [
  {
    label: "序号",
    type: "index",
    width: "70",
  },
  {
    label: "字段英文名",
    prop: "field_en_name",
    type: "input",
    minWidth: "120",
  },
  {
    label: "操作",
    type: "operate",
    width: "120px",
    operateArr: [
      {
        label: "上移",
        type: "up",
      },
      {
        label: "下移",
        type: "down",
      },
    ],
  },
];
export {
  formData,
  formList,
  formRules,
  formConfig,
  columnArr,
  columnArrConfig,
  modalFormItems,
  modalFormData,
  modalFormConfig,
  sqlColumnArr,
  step3FormList,
  step3FormConfig,
  prodeceJobsFormItems,
  prodeceJobsFormConfig,
  databyColumnArr,
  columnTableArr,
  tablecolumnArr,
  selectTableCreateFormItems,
  selectTableCreateConfig,
  selectTablecolumnArr,
  hbasesortColumnArr,
};
