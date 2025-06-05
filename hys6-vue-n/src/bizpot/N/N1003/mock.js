
export const list =[
  {
  id:'1',
  title:"存款余额表",
  type:["表","共享","保密"],
  content:[
    {
      label:"资产描述",
      value:"存款余额表为2021年数据资产盘点第一批次盘点内容，由xxx部门，xxx进行盘点，该表主要记录全行客户存款余额信息，该数据资产允许通过数据服务调用获取该资产数据。"
    },
    {
      label:"业务描述",
      value:"存款余额表主要记载全行客户存款余额信息。"
    }
  ],
  chat:"2"
},
{
  id:'2',
  title:"分行AUM",
  type:["指标","共享","平密"],
  content:[
    {
      label:"资产描述",
      value:"分行AUM为2021年数据资产盘点第一批次盘点内容，由xxx部门，xxx进行盘点，该表主要记录全行客户存款余额信息，该数据资产允许通过数据服务调用获取该资产数据。"
    },
    {
      label:"业务描述",
      value:"分行AUM主要记载全行客户存款余额信息。"
    },
    {
      label:"业务口径",
      value:"分行AUM主要记载全行客户存款余额信息。"
    }
  ],
  chat:"3"
}]

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
    prop: 'assetNormEName',
    span: 12,
    type: 'text',
    disabled: true,
  },
  {
    label: '资产中文名称',
    prop: 'assetNormCName',
    span: 12,
    type: 'text',
  },
  {
    label: '资产类别',
    prop: 'assetType1',
    span: 12,
    type: 'text',
    disabled: true,
  },
  {
    label: "业务主键",
    prop: "businessCName",
    span: 12,
    type: "text",
  },
  {
    label: '资产代码',
    prop: 'assetCode',
    span: 12,
    type: 'text',
  },
  // {
  //   label: "数据源类型",
  //   prop: "data_source_type",
  //   span: 12,
  //   type: "select",
  //   options: [{
  //     label: "内部",
  //     value: "1"
  //   },
  //   {
  //     label: "外部",
  //     value: "2"
  //   }
  // ]
  // },
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
    label: "业务描述",
    prop: "businessRemark",
    span: 24,
    type: "text",
  },
  {
    label: "资产描述",
    prop: "assetRemark",
    span: 24,
    type: "text",
  }
]
const formItem2 = [
  // {
  //   label: '所属层级',
  //   prop: 'layer',
  //   span: 12,
  //   type: 'defined',
  //   options: [
  //   ],
  // },
  // {
  //   label: '存储位置',
  //   prop: 'store_path',
  //   span: 12,
  //   type: 'input',
  // },
  // {
  //   label: '加工频率',
  //   prop: 'process_frequen',
  //   span: 12,
  //   type: 'select',
  //   options: [{
  //     label: "日",
  //     value: "0"
  //   }],
  // },
  // {
  //   label: "处理日期",
  //   prop: "process_rule",
  //   span: 12,
  //   type: "input",
  // },
  {
    label: "技术主键",
    prop: "techCName",
    span: 12,
    type: "text",
   
  },
  {
    label: "数据权限字段",
    prop: "dataAuthCode",
    span: 12,
    type: "text",
   
  }
]
const formItem3 = [{
  label: "归属部门",
  prop: "belongDepart1",
  span: 12,
  type: 'text',
   
}, {
  label: "归属人",
  prop: "belongBy1",
  span: 12,
  type: "text",
}, {
  label: "管理部门",
  prop: "manageDepart1",
  span: 12,
  type: "text",
}, {
  label: "管理人",
  prop: "manageBy1",
  span: 12,
  type: "text",
}, {
  label: "盘点日期",
  prop: "assetDate",
  span: 12,
  type: "text",
  disabled: true
},
{
  label: "盘点时间",
  prop: "assetTime",
  span: 12,
  type: "text",
}, {
  label: "盘点人",
  prop: "assetBy",
  span: 12,
  type: "text",
}]
const formItem11 = [
  {
    label: '资产英文名称',
    prop: 'assetNormEName',
    span: 12,
    type: 'text',
    disabled: true,
  },
  {
    label: '资产中文名称',
    prop: 'assetNormCName',
    span: 12,
    type: 'text',
  },
  {
    label: '资产类别',
    prop: 'assetType1',
    span: 12,
    type: 'text',
    disabled: true,
  },
  {
    label: '资产代码',
    prop: 'assetCode',
    span: 12,
    type: 'text',
  },
  {
    label: '共享类型',
    prop: 'shareType1',
    span: 12,
    type: 'text',
    disabled: true,
  },
  {
    label: '保密等级',
    prop: 'securityLevel1',
    span: 12,
    type: 'text',
    disabled: true,
  },
  {
    label: '单位 (元)',
    prop: 'amountUnit1',
    span: 12,
    type: 'text',
    disabled: true,
  },
  // {
  //   label: "业务主键",
  //   prop: "businessCName",
  //   span: 12,
  //   type: "text",
  // },
 
  // {
  //   label: "数据源类型",
  //   prop: "data_source_type",
  //   span: 12,
  //   type: "select",
  //   options: [{
  //     label: "内部",
  //     value: "1"
  //   },
  //   {
  //     label: "外部",
  //     value: "2"
  //   }
  // ]
  // },
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
    label: "业务描述",
    prop: "businessRemark",
    span: 24,
    type: "text",
  },
  {
    label: "资产描述",
    prop: "assetRemark",
    span: 24,
    type: "text",
  }
]
const formItem21 = [

]
const formItem31 = [
 {
  label: "盘点日期",
  prop: "assetDate",
  span: 12,
  type: "text",
  disabled: true
},
{
  label: "盘点时间",
  prop: "assetTime",
  span: 12,
  type: "text",
}, {
  label: "盘点人",
  prop: "assetBy",
  span: 12,
  type: "text",
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
export const formList1 = [
  {
    title: '字段资产详情',
    formItems: [...formItem11 ,...formItem21 , ...formItem31 ]
  },

]
export const columnArr = [
  { prop: 'index', label: '序号', type: 'index' },
  { prop: 'en_name', label: '字段中文名称', type: 'input', minWidth: 200 },
  { prop: 'codeName', label: '字段英文名称', type: 'text', minWidth: 200 },
  { prop: 'type', label: '字段类型', type: 'text', minWidth: 120 },
  // { prop: 'length', label: '字段长度', type: 'text', minWidth: 120 },
  // { prop: 'precision', label: '字段精度', type: 'text', minWidth: 120 },
  { prop: "business_meaning", label: '字段业务含义', type: 'input', placeholder: "请输入内容", minWidth: 200 },
  { prop: "code", label: "码值", type: "operate", operateArr: [{ label: "新增码值", type: "addCode" }], width: 150 },
  { prop: "standardName", label: "映射标准名称", type: "slot", minWidth: 200 },
  { prop: "share_type", label: "共享类型", type: "select", minWidth: 200, options: [{ label: "有条件共享", value: "1" }, { label: "无条件共享", value: "2" }, { label: "不共享", value: "3" }], placeholder: "请选择" },
  { prop: "secure_level", label: "保密等级", type: "select", minWidth: 120, options: [{ label: "公开", value: "1" }, { label: "敏感", value: "2" }, { label: "密码", value: "3" }, { label: "机密", value: "4" }], placeholder: "请选择" },
  { prop: "unit", label: "金额（单位）", type: 'select', minWidth: 150, options: [{ label: "元", value: "元" }], placeholder: "请选择" },
  { prop: "update_time", label: "更新日期", type: "text", minWidth: 150, fixed: "right", sortable: "true" },

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
  {
    label: "智能添加",
    prop: "add",
    type: "primary"
  },
  {
    label: "导入",
    prop: "import",
  },
  {
    label: "导出",
    prop: "export",
  }
]
export const treeData = [
  {
    id:'0',
    label:"新增目录",
    showLable:"新增目录",
    expanded:false,
    type:"add"
  },
  {
    id: '1',
    label: "资产业务",
    showLable: "资产业务",
    expanded: false,
    type: "text",
    children: [{
      id: '1-1',
      label: "贷款业务",
      showLable: "贷款业务",
      expanded: false,
      type: "text",
      children: [{
        id: '1-1-1',
        label: "数据库表",
        showLable: "数据库表",
        expanded: false,
        type: "text",
        children: [{
          id: "1-1-1-1",
          label: "贷款明细表",
          showLable: "贷款明细表",
          expanded: false,
          type: "text",
          children: []
        }, {
          id: "1-1-1-2",
          label: "客户贷款表",
          showLable: "客户贷款表",
          expanded: false,
          type: "text",
          children: []
        }, {
          id: "1-1-1-3",
          label: "个人客户信息表",
          showLable: "个人客户信息表",
          expanded: false,
          type: "text",
          children: [
            {
              id: "1-1-1-3-1",
              label: "客户号",
              showLable: "客户号",
              expanded: false,
              type: "text",
            }, {
              id: "1-1-1-3-2",
              label: "客户名称",
              showLable: "客户名称",
              expanded: false,
              type: "text",
            }, {
              id: "1-1-1-3-3",
              label: "国别代码",
              showLable: "国别代码",
              expanded: false,
              type: "text",
            }, {
              id: "1-1-1-3-4",
              label: "性别",
              showLable: "性别",
              expanded: false,
              type: "text",
            }
          ]
        }]
      }, {
        id: '1-1-2',
        label: "报表",
        showLable: "报表",
        expanded: false,
        type: "text",
        children: [{
          id: "1-1-2-1",
          label: "贷款明细报表",
          showLable: "贷款明细报表",
          expanded: false,
          type: "text",
        }, {
          id: "1-1-2-2",
          label: "贷款收益分析报表",
          showLable: "贷款收益分析报表",
          expanded: false,
          type: "text",
        }]
      }, {
        id: "1-1-3",
        label: "指标",
        showLable: "指标",
        expanded: false,
        type: "text",
        children: [{
          id: "1-1-3-1",
          label: "日均存款余额",
          showLable: "日均存款余额",
          expanded: false,
          type: "text",
        }, {
          id: "1-1-3-2",
          label: "分行AUM",
          showLable: "分行AUM",
          expanded: false,
          type: "text",
        }]
      }, {
        id: "1-1-4",
        label: "业务说明文档",
        showLable: "业务说明文档",
        expanded: false,
        type: "text",
        children: [{
          id: "1-1-4-1",
          label: "贷款操作手册",
          showLable: "贷款操作手册",
          expanded: false,
          type: "text",
        }, {
          id: "1-1-4-2",
          label: "贷款产品文档",
          showLable: "贷款产品文档",
          expanded: false,
          type: "text"
        }]
      }]
    }, {
      id: '1-2',
      label: "投资业务",
      showLable: "投资业务",
      expanded: false,
      type: "text",
      children: []
    }]
  },
  {
    id: '2',
    label: "负债业务",
    showLable: "负债业务",
    expanded: false,
    type: "text",
    children: [{
      id: '2-1',
      label: "活期存款",
      showLable: "活期存款",
      expanded: false,
      type: "text",
    }, {
      id: '2-2',
      label: "定期存款",
      showLable: "定期存款",
      expanded: false,
      type: "text",
    }]
  }
]
export const assetColumnArr = [
  { label: '选择', prop: 'check', type: 'selection', width: '70px' },
  { prop: 'index', label: '序号', type: 'index', width: '70px' },
  { prop: "assetCode", label: "数据资产代号", type: "text", minWidth: 120 },
  { prop: "assetTitle", label: "数据资产标题", type: "text", minWidth: 120 },
  { prop: "assetProvide", label: "数据资产提供方", type: "text", minWidth: 120 },
  { prop: "updateTime", label: "最后更改时间", type: "text", minWidth: 120 },
  { prop: "operate", label: "操作", type: "operate", fixed: "right", width:'120px', operateArr: [{ label: "编辑", type: "edit" }, { label: "删除", type: "del" }] }
]
export const assetTableData = [
  {
    assetCode: "BM026/ZWZD200",
    assetTitle: "新增机构表",
    assetProvide: "测试系统",
    updateTime: "2023-11-22 14:26:29"
  },
  {
    assetCode: "BM026/ZWZC035",
    assetTitle: "个人客户信息表",
    assetProvide: "演示系统",
    updateTime: "2023-11-20 17:27:27"
  }
]