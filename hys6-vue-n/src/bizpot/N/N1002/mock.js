import Vue from "vue";
var vm = new Vue();
export const formData = {
  en_name: "ODS_SE7_BHR_FLOW_ORG_ADD",
  cn_name: "机构新增表",
  type: "0",
  business_key: "",
  data_source_type: "0",
  theme: "",
  business_meaning: "",
  level: [1, 2],
  storage_location: "ods_se7_bhr_flow_org_add",
  process_frequency: "0",
  process_date: new Date(2023, 9, 21, 20),
  technical_key: "",
  data_permission_field: "",
  department: "数据管理部",
  person: "吴雅",
  manage_department: "数据管理部",
  manage_person: "吴雅",
  create_time: "2023-9-21 16:25:46",
  create_person: "吴雅"
}
export const formConfig = {
  labelWidth: "130px",
  inline: false,
  ref: "assetForm",
}
export const formRules = {
  cn_name: { required: true, message: '该输入项为必填项', trigger: 'blur' },
  business_key: { required: true, message: '该输入项为必填项', trigger: 'blur' },
  data_source_type: { required: true, message: '该输入项为必填项', trigger: 'blur' },
  theme: { required: true, message: '该选择项为必填项', trigger: 'change' },
  business_meaning: { required: true, message: '该选择项为必填项', trigger: 'change' },
  process_frequency: { required: true, message: '该选择项为必填项', trigger: 'change' },
  process_date: { required: true, message: '该选择项为必填项', trigger: 'change' },
  technical_key: { required: true, message: '该选择项为必填项', trigger: 'change' },
  department: { required: true, message: '该选择项为必填项', trigger: 'change' },
  person: { required: true, message: '该选择项为必填项', trigger: 'change' },
  manage_department: { required: true, message: '该选择项为必填项', trigger: 'change' },
  manage_person: { required: true, message: '该选择项为必填项', trigger: 'change' },
}
const formItem1 = [
  {
    label: '资产英文名称',
    prop: 'asset_ename',
    span: 12,
    type: 'input',
    disabled: true,
  },
  {
    label: '资产中文名称',
    prop: 'asset_cname',
    span: 12,
    type: 'input',
  },
  {
    label: '资产类别',
    prop: 'asset_type',
    span: 12,
    type: 'select',
    disabled: true,
    options: [
      {
        label: "表",
        value: "1"
      },
      {
        label: "视图",
        value: "2"
      },
      {
        label: "物化视图",
        value: "3"
      },
    ],
  },
  {
    label: "业务主键",
    prop: "business_pk",
    span: 12,
    type: "select",
    multiple : true,
    options: [
    ]
  },
  {
    label: '资产代码',
    prop: 'asset_code',
    span: 12,
    type: 'input',
  },
  {
    label: "数据源类型",
    prop: "data_source_type",
    span: 12,
    type: "select",
    options: [{
      label: "内部",
      value: "1"
    },
      {
        label: "外部",
        value: "2"
      }
    ]
  },
  // {
  //   label: "所属主题",
  //   prop: "theme",
  //   span: 12,
  //   type: "select",
  //   options: [{
  //     label: "主题1",
  //     value: "theme1"
  //   }]
  // },
  {
    label: "是否为主数据",
    prop: "is_master_data",
    span: 12,
    type: "radio",
    options: [{
      label: "否",
      value: "0"
    },
      {
        label: "是",
        value: "1"
      }
    ]
  },
  {
    label: "业务含义",
    prop: "business_remark",
    span: 24,
    type: "textarea",
  },

]
const formItem2 = [
  {
    label: '所属层级',
    prop: 'layer',
    span: 12,
    type: 'defined',
    options: [
    ],
  },
  {
    label: '存储位置',
    prop: 'store_path',
    span: 12,
    type: 'input',
  },
  {
    label: '加工频率',
    prop: 'process_frequen',
    span: 12,
    type: 'select',
    options: [{
      label: "日",
      value: "0"
    }],
  },
  {
    label: "处理日期",
    prop: "process_rule",
    span: 12,
    type: "input",
  },
  {
    label: "技术主键",
    multiple : true,

    prop: "tech_pk",
    span: 12,
    type: "select",
    options: [{
      label: "id",
      value: "id"
    }]
  },
  {
    label: "数据权限字段",
    prop: "data_auth_code",
    span: 12,
    type: "select",
    options: [{
      label: "id",
      value: "id"
    }]
  },
  {
    label: "数据量",
    prop: "data_num",
    disabled: true,
    span: 12,
    type: "input",
  }
]
const formItem3 = [{
  label: "归属部门",
  prop: "belong_depart",
  span: 12,
  type: 'defined',
  options: [],
}, {
  label: "归属人",
  prop: "belong_by",
  span: 12,
  type: "defined",
}, {
  label: "管理部门",
  prop: "manage_depart",
  span: 12,
  type: "defined",
}, {
  label: "管理人",
  prop: "manage_by",
  span: 12,
  type: "defined",
}, {
  label: "盘点日期",
  prop: "asset_date",
  span: 12,
  type: "input",
  disabled: true
},
  {
    label: "盘点时间",
    prop: "asset_time",
    span: 12,
    type: "input",
    disabled: true
  }, {
    label: "盘点人",
    prop: "asset_by",
    span: 12,
    type: "input",
    disabled: true
  }]
export const formList = [
  {
    title: '业务属性',
    formItems: formItem1
  },
  {
    title: '技术属性',
    formItems: formItem2
  },
  {
    title: "管理属性",
    formItems: formItem3
  }
]
export const columnArr = [
  { prop: 'index', label: '序号', type: 'index' },
  { prop: 'col_cname', label: '字段中文名称', type: 'input', minWidth: 200 },
  { prop: 'col_ename', label: '字段英文名称', type: 'text', minWidth: 200 },
  { prop: 'col_type', label: '字段类型', type: 'text', minWidth: 120 },
  { prop: 'col_len', label: '字段长度', type: 'text', minWidth: 120 },
  { prop: 'col_prec"', label: '字段精度', type: 'text', minWidth: 120 },
  { prop: "col_business", label: '字段业务含义', type: 'input', placeholder: "请输入内容", minWidth: 200 },
  { prop: "standardName", label: "映射标准名称", type: "slot", minWidth: 200 },
  { prop: "code", label: "码值", type: "slot", width: 150 },

  { prop: "share_type", label: "共享类型", type: "select", minWidth: 200, options: [{ label: "有条件共享", value: "1" }, { label: "无条件共享", value: "2" }, { label: "不共享", value: "3" }], placeholder: "请选择" },
  { prop: "security_level", label: "保密等级", type: "select", minWidth: 120, options: [{ label: "公开", value: "1" }, { label: "敏感", value: "2" }, { label: "密码", value: "3" }, { label: "机密", value: "4" }], placeholder: "请选择" },
  { prop: "amount_unit", label: "金额（单位）", type: 'select', minWidth: 150, options: [{ label: "元", value: "元" }], placeholder: "请选择" },
  // { prop: "update_data", label: "更新日期", type: "text", minWidth: 150, fixed: "right", sortable: "true" },
  // { prop: "update_time", label: "更新时间", type: "text", minWidth: 150, fixed: "right", sortable: "true" },

]
export const formDataColumn = {
  tableData: [
    { en_name: 'MD5值', codeName: 'CHAIN_MD5', type: 'varchar(100)', length: '2147432', precision: '0', business_meaning: "", standardName: "关联标准", unit: "", update_time: "2023-09-21", share_type: "1", secure_level: "1" },
    { en_name: '数据源表主键ID', codeName: 'ID', type: 'varchar(100)', length: '2147432', precision: '0', business_meaning: "数据源表主键ID", standardName: "数据源表主键ID", unit: "", update_time: "2023-10-12", share_type: "2", secure_level: "2" },
    { en_name: "组织机构名称", codeName: "ORG_NAME", type: "varchar(100)", length: "2147432", precision: "0", business_meaning: "组织机构名称", standardName: "组织机构名称", unit: "", update_time: "2023-10-12", share_type: "3", secure_level: "3" },
    { en_name: "人力资源机构编号", codeName: "ORG_CODE", type: "varchar(100)", length: "2147432", precision: "0", business_meaning: "人力资源机构编号", standardName: "人力资源机构编号", unit: "", update_time: "2023-10-12", share_type: "1", secure_level: "4" },
    { en_name: "上级机构号", codeName: "SUPER_ID", type: "varchar(100)", length: "2147432", precision: "0", business_meaning: "上级机构直接上级机构号", standardName: "上级机构直接上级机构号", unit: "", update_time: "2023-10-12", share_type: "2", secure_level: "1" },
    { en_name: "机构类型", codeName: "ORG_TYPE", type: "varchar(100)", length: "2147432", precision: "0", business_meaning: "", standardName: "关联标准", unit: "", update_time: "2023-09-21", share_type: "3", secure_level: "2" },
    { en_name: "人资系统机构级别", codeName: "ORG_LEVEL", type: "varchar(100)", length: "2147432", precision: "0", business_meaning: "", standardName: "关联标准", unit: "", update_time: "2023-09-21", share_type: "1", secure_level: "3" },
    { en_name: "成立日期", codeName: "ESTABLISH_DATE", type: "varchar(100)", length: "2147432", precision: "0", business_meaning: "上级机构直接上级机构号", standardName: "成立日期", unit: "", update_time: "2023-10-12", share_type: "2", secure_level: "4" },
    { en_name: "注册地址", codeName: "REGISTER_ADDRESS", type: "varchar(100)", length: "2147432", precision: "0", business_meaning: "注册地址", standardName: "注册地址", unit: "", update_time: "2023-10-12", share_type: "3", secure_level: "1" },
    { en_name: "统一社会信用代码", codeName: "SOCIAL_CREDIT_CODE", type: "varchar(100)", length: "2147432", precision: "0", business_meaning: "统一社会信用代码", standardName: "统一社会信用代码", unit: "", update_time: "2023-10-12", share_type: "1", secure_level: "2" },
  ]
}
export const searchFormItems = [
  {
    label: '资产代号',
    prop: 'assetCode',
    type: 'input',
    placeholder: '请输入资产代号',
  },
  {
    label: '资产标题',
    prop: 'assetTitle',
    type: 'input',
    placeholder: '请输入资产标题',
  }
]
export const extraButton = [

  // {
  //   label: "导入",
  //   prop: "import",
  // },
  {
    label: "批量删除",
    prop: "delete",
  }
]
export const treeData = []
export const assetColumnArr = [
  { label: '选择', prop: 'check', type: 'selection', width: '70px' },
  { prop: 'index', label: '序号', type: 'index', width: '70px' },
  // { prop: "asset_id", label: "数据资产代号", type: "text", minWidth: 130 },
  { prop: "asset_cname", label: "数据资产名称", type: "text", minWidth: 130 },
  { prop: "asset_code", label: "资产代码", type: "text", minWidth: 130 },
  { prop: "belong_depart_name", label: "资产所属部门", type: "text", minWidth: 130 },
  { prop: "asset_status", label: "资产状态", type: "tag1", minWidth: 130 },
  { prop: "asset_date", label: "最后更改时间", type: "text", minWidth: 130 },
  { prop: "operate", label: "操作", type: "operate", fixed: "right", width:'120px', operateArr: [{ label: "盘点", type: "edit" }, { label: "删除", type: "del" }] }
]
export const assetTableData = []

export const columnArr1 = [
  { prop: "tag", label: "单择", type: "selection", width: "70px", align: "center" },

  { prop: 'norm_cname', type: "text", label: '标准中文', minWidth: '170px' },
  { prop: 'norm_ename', type: "text", label: '标准英文', minWidth: '130px' },
  { prop: 'data_type_name', type: "text", label: '数据类型', minWidth: '100px' },
  { prop: 'col_len', type: 'text', label: '字段长度', minWidth: '120px' },
  { prop: 'decimal_POINT', type: "text", label: '字段精度', minWidth: '120px' },
];

export const columnArr2 = [
  { prop: "tag", label: "单择", type: "selection", width: "70px", align: "center" },
  { prop: 'code_type_name', type: "popover", label: '标准代码类名', minWidth: '170px' },
  { prop: 'code_encode', type: "text", label: '标准代码编码', minWidth: '170px' },
  { prop: 'code_remark', type: 'text', label: '标准描述', minWidth: '120px' },
  { prop: 'create_user', type: 'text', label: '创建人', minWidth: '120px' },
  { prop: 'create_date', type: 'text', label: '创建日期', minWidth: '120px' },
  { prop: 'create_time', type: 'text', label: '创建时间', minWidth: '120px' },
];
export const columnArr3 = [
  { prop: 'code_item_name', type: "text", label: '码值项名称', minWidth: '170px' },
  { prop: 'code_item_id', type: "text", label: '码值', minWidth: '170px' },
];