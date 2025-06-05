const treeData = [
  {
    id: 1,
    label: "目录1",
    showLable: "目录1",
    expanded: false,
    children: [
      {
        id: 3,
        label: "目录1-2",
        showLable: "目录1-2",
        type: "text",
        expanded: false,
      },
    ],
  },
  {
    id: 8,
    label: "目录2",
    showLable: "目录2",
  },
];
const formItems = [
  {
    prop: "status",
    label: "版本状态",
    type: "text",
    span: 8,
    class: "successText widthFrom ",
  },
  {
    prop: 'version',
    label: '版本编号',
    type: 'text',
    span: 8,
    class: 'fontweight-600'
  },
];
const formItem0 = [
  // {
  //   prop: 'norm_code',
  //   label: '标准编号',
  //   placeholder: '请输入标准编号',
  //   type: 'input',
  //   span: 8,
  //   disabled: true
  // },
  {
    prop: "norm_cname",
    label: "中文名称",
    placeholder: "请输入中文名称",
    type: "input",
    span: 8,
    disabled: true,
  },
  {
    prop: "norm_ename",
    label: "英文名称",
    placeholder: "请输入英文名称",
    type: "input",
    span: 8,
    disabled: true,
  },
  {
    prop: "norm_aname",
    label: "标准别名",
    placeholder: "请输入标准别名",
    type: "input",
    span: 8,
    disabled: true,
  },
  {
    prop: "belongsClass",
    label: "归属分类",
    placeholder: "请选择归属分类",
    type: "cascader",
    span: 8,
    disabled: true,
    levels: false,
    props: {
      value: "id",
      label: "label",
      checkStrictly: true,
    },
  },
];
const formItem1 = [
  {
    prop: "data_type",
    label: "数据类型",
    placeholder: "请输入数据类型",
    type: "select",
    span: 8,
    disabled: true,
    options: [],
  },
  {
    prop: "col_len",
    label: "字段长度",
    placeholder: "请输入字段长度",
    type: "number",
    span: 8,
    disabled: true,
  },
  {
    prop: "decimal_point",
    label: "小数长度",
    placeholder: "请输入小数长度",
    type: "number",
    span: 8,
    disabled: true,
  },
  {
    prop: "code_type_id",
    label: "所属代码",
    placeholder: "请输入所属代码",
    type: "select",
    span: 8,
    disabled: true,
    filterable: true,
    props: {
      value: "code_type_id",
      label: "code_type_name",
    },
    options: [],
  },
  {
    type: "link",
    prop: "viewCode",
    span: 8,
    disabled: true,
  },
];
const formItem2 = [
  {
    prop: "business_def",
    label: "业务定义",
    type: "textarea",
    placeholder: "请输入业务定义",
    span: 24,
    disabled: true,
  },
  {
    prop: "business_rule",
    label: "业务规则",
    type: "textarea",
    placeholder: "请输入业务规则",
    span: 24,
    disabled: true,
  },
  {
    prop: "norm_basis",
    label: "标准定义",
    type: "textarea",
    placeholder: "请输入标准定义",
    span: 24,
    disabled: true,
  },
  {
    prop: "dbm_domain",
    label: "值域",
    type: "textarea",
    placeholder: "请输入标准定义",
    span: 24,
    disabled: true,
  },
];
const formItem3 = [
  {
    prop: "manage_department",
    label: "管理部门",
    placeholder: "请输入管理部门",
    type: "input",
    span: 8,
    disabled: true,
  },
  {
    prop: "relevant_department",
    label: "相关部门",
    placeholder: "请输入相关部门",
    type: "input",
    span: 8,
    disabled: true,
  },
  // {
  //   prop: 'norm_status',
  //   label: "分类状态",
  //   type: 'select',
  //   placeholder: '请选择相关标准',
  //   span: 8,
  //   disabled: true,
  //   options: [
  //     {
  //       label: '未发布',
  //       value: '0',
  //       key: '0',
  //     },
  //     {
  //       label: '已发布',
  //       value: '1',
  //       key: '1',
  //     }
  //   ]
  // },
  {
    prop: "origin_system",
    label: "可信系统",
    type: "input",
    placeholder: "请输入可信系统",
    span: 8,
    disabled: true,
  },
  // {
  //   prop: 'related_system',
  //   label: "相关标准",
  //   type: 'select',
  //   placeholder: '请选择相关标准',
  //   span: 8,
  //   disabled: true,
  //   options: [
  //     {
  //       label: '投资币种',
  //       value: '0',
  //       key: '0',
  //     },
  //     {
  //       label: '报表周期',
  //       value: '1',
  //       key: '1',
  //     }
  //   ]
  // },
  {
    prop: "formulator",
    label: "制定人",
    type: "input",
    placeholder: "请输入制定人",
    span: 8,
    disabled: true,
  },
];
const formRules = {
  norm_cname: { required: true, message: "该输入项为必填项", trigger: "blur" },
  norm_ename: [
    { required: true, message: "该输入项为必填项", trigger: "blur" },
    {
      type: "string",
      pattern: /^\s*[a-zA-Z][a-zA-Z0-9_]*(\s*[a-zA-Z0-9_]+)*\s*$/,
      message: "必须为英文字符",
    },
  ],
  norm_aname: { required: true, message: "该输入项为必填项", trigger: "blur" },
  belongsClass: [
    { required: true, message: "该选择项为必填项", trigger: "change" },
  ],
  col_len: [
    { required: true, message: "该输入项为必填项", trigger: "blur" },
    { type: "number", message: "必须为数字值" },
  ],
  // decimal_point: [{ required: true, message: '该输入项为必填项', trigger: 'blur' },
  //                 { type: 'number', message: '必须为数字值'}],
  // code_type_id: { required: true, message: '该输入项为必填项', trigger: 'change' },
  // dbm_domain: { required: true, message: '该输入项为必填项', trigger: 'blur' },
  // norm_status: { required: true, message: '该选择项为必填项', trigger: 'change' },
  // formulator: { required: true, message: '该输入项为必填项', trigger: 'blur' },
};
const formConfig = {
  labelWidth: "100px",
  inline: false,
  ref: "nodeDetailForm",
};

const modelFormRules = {
  // attribute:[{required:true,message:'请输入上级分类',trigger:'blur'}],
  sort_name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
  // sort_remark:[{required:true,message:'请输入分类描述',trigger:'blur'}],
};
validationRules: {
  enOnly: (value) => (value.match(/^[a-zA-Z]+$/) ? true : "请只输入英文字母");
}

const formData = {
  norm_code: "",
  norm_cname: "",
  norm_ename: "",
  norm_aname: "",
  belongsClass: "",
  data_type: "",
  col_len: "",
  decimal_point: "",
  code_type_id: "",
  business_def: "",
  business_rule: "",
  norm_basis: "",
  dbm_domain: "",
  manage_department: "",
  relevant_department: "",
  norm_status: "",
  origin_system: "",
  related_system: "",
  formulator: "",
  verSionNum: "1001",
  verSionStatus: "已发布",
};
const formList = [
  {
    index: 0,
    formItems: formItems,
  },
  {
    index: 1,
    title: "基本信息",
    formItems: formItem0,
  },
  {
    index: 2,
    title: "技术属性",
    formItems: formItem1,
  },
  {
    index: 3,
    title: "业务属性",
    formItems: formItem2,
  },
  {
    index: 4,
    title: "管理属性",
    formItems: formItem3,
  },
];
const modelFormData = {
  attribute: "",
  sort_name: "",
  sort_remark: "",
};
const modelFormItems = [
  {
    prop: "attribute",
    label: "上级分类",
    type: "cascader",
    span: 24,
    disabled: true,
    props: {
      value: "id",
      label: "label",
      checkStrictly: true,
    },
  },
  {
    prop: "sort_name",
    label: "分类名称",
    placeholder: "请输入中文名称",
    type: "input",
    disabled: false,
    span: 24,
  },
  {
    prop: "sort_remark",
    label: "分类描述",
    type: "textarea",
    disabled: false,
    span: 24,
  },
];

const modelFormConfig = {
  labelWidth: "100px",
  inline: false,
  ref: "formRef",
};
const catelogsFormItems = [
  {
    prop: "search_cond",
    label: "标准名称",
    type: "input",
    labelWidth: "80px",
  },
  {
    prop: "status",
    label: "标准状态",
    type: "select",
    labelWidth: "80px",
    options: [
      { value: "0", label: "未发布", key: "0" },
      { value: "1", label: "已发布", key: "1" },
    ],
  },
  {
    prop: "parent",
    label: "所属分类",
    type: "cascader",
    labelWidth: "80px",
    props: {
      value: "id",
      label: "label",
      checkStrictly: true,
    },
    options: [],
  },
  {
    prop: "createTime",
    label: "创建时间",
    labelWidth: "80px",
    type: "date",
  },
];
const catelogsColumnArr = [
  {
    label: "选择",
    prop: "check",
    type: "selection",
    width: "70px",
    disabled: true,
    align: "center",
  },
  {
    label: "序号",
    prop: "index",
    type: "index",
    width: "80px",
    align: "center",
  },
  // { label: '标准编号', prop: 'norm_code', type: 'text', width: '120px' },
  { label: "标准中文名", prop: "norm_cname", type: "text", minWidth: "120px" },
  { label: "标准英文名", prop: "norm_ename", type: "text", minWidth: "120px" },
  // {label:'标准格式',prop:'format',type:'text',width:'120px'},
  // {label:'业务定义',prop:'businessDefine',type:'text',width:'120px'},
  // {label:'长度',prop:'extend',type:'text',width:'120px'},
  // {label:'精度',prop:'precision',type:'text',width:'120px'},
  {
    label: "关联代码",
    prop: "code_type_name",
    type: "text",
    minWidth: "120px",
  },
  {
    label: "所属部门",
    prop: "manage_department",
    type: "text",
    minWidth: "120px",
  },
  { label: "所属分类", prop: "sort_name", type: "text", minWidth: "120px" },
  { label: "标准状态", prop: "status", type: "text", minWidth: "120px" },
  {
    label: "创建时间",
    prop: "createDateTime",
    type: "text",
    minWidth: "200px",
  },
  {
    label: "操作",
    prop: "operate",
    type: "operate",
    fixed: "right",
    width: "200px",
    operateArr: [
      { label: "查看", type: "check" },
      { label: "编辑", type: "edit" },
      {
        label: "发布",
        type: "issue",
        hide: (row) => {
          if (row.norm_status === "0") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        label: "删除",
        type: "del",
        hide: (row) => {
          if (row.norm_status === "0") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        label: "下线",
        type: "offline",
        hide: (row) => {
          if (row.standardKind === "已发布") {
            return true;
          } else {
            return false;
          }
        },
      },
    ],
  },
];
const catelogsTableData = [
  {
    standardNum: "1001",
    CHname: "公共学历",
    ENname: "PUBLIC_ACADEMIC_DEGREE",
    format: "客户",
    businessDefine: "业务定义",
    extend: "长度",
    precision: "精度",
    codeName: "代码名称",
    department: "所属部门",
    category: "目录1/目录1-2",
    createTime: "2020-12-12 12:12:12",
    standardKind: {
      text: "已发布",
      color: "#3BC698",
    },
  },
  {
    standardNum: "1001",
    CHname: "公共学历",
    ENname: "PUBLIC_ACADEMIC_DEGREE",
    format: "客户",
    businessDefine: "业务定义",
    extend: "长度",
    precision: "精度",
    codeName: "代码名称",
    department: "所属部门",
    category: "目录2",
    createTime: "2020-12-12 12:12:12",
    standardKind: {
      text: "未发布",
      color: "#E6515D",
    },
  },
];
const historyColumnArr = [
  { label: "序号", prop: "index", type: "index", width: "70px" },
  // { label: '标准编号', prop: 'standardNum', type: 'text', width: '120px' },
  { label: "标准中文名", prop: "norm_cname", type: "text", width: "120px" },
  { label: "标准英文名", prop: "norm_ename", type: "text", minWidth: "120px" },
  { label: "版本编号", prop: "version", type: "link", width: "120px" },
  { label: "版本状态", prop: "verSionStatus", type: "tag", width: "120" },
  { label: "发布时间", prop: "create_date", type: "text", width: "200px" },
  { label: "下线时间", prop: "version_date", type: "text", width: "200px" },
];
// const historyTabelData = [
//   {
//     standardNum: "1001",
//     CHname: "公共学历",
//     ENname: "PUBLIC_ACADEMIC_DEGREE",
//     verSionNum: "1001",
//     verSionStatus: {
//       text: "已发布",
//       color: "#3BC698",
//     },
//     onlineTime: "2020-12-12 12:12:12",
//     offlineTime: "2020-12-12 12:35:35",
//   },
//   {
//     standardNum: "1002",
//     CHname: "公共学历",
//     ENname: "PUBLIC_ACADEMIC_DEGREE",
//     verSionNum: "1002",
//     verSionStatus: {
//       text: "已下线",
//       color: "#666666",
//     },
//     onlineTime: "2020-12-12 12:12:12",
//     offlineTime: "2020-12-12 12:35:35",
//   },
// ];
const viewCodeColumnArr = [
  { prop: "code_encode", label: "标准代码编码" },
  { prop: "code_type_name", label: "标准代码名称" },
  { prop: "code_remark", label: "标准描述" },
];
const viewCodeItem = {
  standardCode: "标准代码编码",
  standardCodeName: "标准代码类名",
  standardDesc: "标准描述",
};
const viewCodeTableColumnArr = [
  { prop: "index", label: "序号", type: "index", width: "70px" },
  { prop: "code_value", label: "标准代码值", type: "text" },
  { prop: "code_item_name", label: "标准代码名称", type: "text" },
  { prop: "code_remark", label: "标准代码描述", type: "text", fixed: "right" },
];
const viewCodeTableData = [
  { codeValue: "1001", codeName: "编码名称", codeDesc: "codeDesc" },
];
const rulesFormItems = [
  // {
  //   prop: 'standardNum',
  //   label: '标准编号',
  //   type: 'text',
  //   span: 4,
  //   class: 'fontweight-600'
  // },
  {
    prop: "standardName",
    label: "标准中文名",
    type: "text",
    span: 4,
    class: "fontweight-600",
  },
  {
    type: "link",
    prop: "addRules",
    span: 16,
  },
];
const rulesFormList = [
  {
    formItems: rulesFormItems,
  },
];
const rulesFormData = {
  standardNum: "1001",
  standardName: "XX标准",
};
const rulesFormConfig = {
  labelWidth: "100px",
  inline: false,
};
const rulesColumnArr = [
  { label: "序号", prop: "index", type: "index", width: "70px" },
  {
    label: "数据质量维度编号",
    prop: "dq_num",
    type: "text",
    width: "160px",
  },
  {
    label: "数据质量维度名称",
    prop: "dq_name",
    type: "text",
    width: "160px",
  },
  {
    label: "数据质量标准描述",
    prop: "dq_desc",
    type: "text",
    minWidth: "180px",
  },
  // { label: "引用规则", prop: "dimensionRules", type: "link", width: "100px" },
  // { label: "质量状态", prop: "dimensionState", type: "tag", width: "100px" },
  {
    label: "创建时间",
    prop: "createTime",
    type: "text",
    width: "180px",
  },
  {
    label: "操作",
    prop: "operate",
    type: "operate",
    fixed: "right",
    width: "120px",
    operateArr: [
      { label: "编辑", type: "edit" },
      { label: "删除", type: "del" },
    ],
  },
];
const rulesTableData = [
  {
    dimensionNum: "AR000001_01",
    dimensionName: "01-完整性",
    dimensionDesc:
      "信贷业务担保合同信息中担保合同签订日期不应为空值，且不为默认取值",
    dimensionRules: "GZ1001",
    dimensionState: {
      text: "未发布",
      color: "#E6515D",
    },
    dimensionCreateTime: "2023-05-12 10:31:22:22",
  },
  {
    dimensionNum: "AR000001_02",
    dimensionName: "02-完整性",
    dimensionDesc: "信用证合同信息中的签约日期不应为空值",
    dimensionRules: "GZ1002",
    dimensionState: {
      text: "已发布",
      color: "#3BC698",
    },
    dimensionCreateTime: "2023-05-12 10:31:22:27",
  },
];

const rulesModelFormItems = [
  {
    prop: "dq_num",
    label: "数据质量维度编号",
    type: "input",
    span: 12,
  },
  {
    prop: "dq_name",
    label: "数据质量维度名称",
    type: "input",
    span: 12,
  },
  // {
  //   prop: "dq_num",
  //   label: "数据质量标准编号",
  //   type: "input",
  //   span: 12,
  // },
  {
    prop: "dq_dep",
    label: "对口业务部门",
    type: "input",
    span: 12,
  },
  // {
  //   prop: "referStandardNum",
  //   label: "参照对象标准编号",
  //   type: "input",
  //   span: 12,
  // },
  {
    prop: "dq_refer_basic_id",
    label: "参照对象标准名称",
    type: "select",
    span: 12,
  },
  {
    prop: "dq_sql",
    label: "数据质量标准SQL",
    type: "textarea",
    placeholder: "请输入SQL，变量值用 '{}' 包裹起来。字段使用 '{column}'，表名使用 '{table}'来作为变量名称。 ",
    row: 5,
    span: 24,
  },
  {
    prop: "dq_desc",
    label: "数据质量标准描述",
    type: "textarea",
    span: 24,
  },
  {
    prop: "dq_according",
    label: "制定依据",
    type: "textarea",
    span: 24,
  },
];
const rulesModelFormData = {
};
const rulesModelFormRules = {
  dq_num: {
    required: true,
    message: "该输入项为必填项",
    trigger: "blur",
  },
  dq_name: {
    required: true,
    message: "该输入项为必填项",
    trigger: "blur",
  },
  dq_dep: {
    required: true,
    message: "该输入项为必填项",
    trigger: "blur",
  },
  // dq_refer_basic_id: { required: true, message: "该输入项为必填项", trigger: "blur" },
  dq_sql: {
    required: true,
    message: "该输入项为必填项",
    trigger: "blur",
  },
  // dq_desc: {
  //   required: true,
  //   message: "该输入项为必填项",
  //   trigger: "blur",
  // },
};
const rulesModelFormConfig = {
  labelWidth: "150px",
  inline: true,
  ref: "rulesForm",
};
const rulesModelCulumnArr = [
  { label: "选择", prop: "check", type: "radio", width: "70px" },
  { label: "序号", prop: "index", type: "index", width: "70px" },
  { label: "规则编号", prop: "rulesNum", type: "text" },
  { label: "规则名称", prop: "rulesName", type: "text" },
];
const rulesModelTableData = [
  {
    id: "0",
    checked: false,
    rulesNum: "GZ1001",
    rulesName: "规则名称",
  },
  {
    id: "1",
    checked: true,
    rulesNum: "GZ1001",
    rulesName: "规则名称",
  },
];
const rulesModelSearchFormItems = [
  {
    prop: "rulesNum",
    label: "规则编号",
    type: "input",
    labelWidth: "80px",
  },
  {
    prop: "rulesName",
    label: "规则名称",
    type: "input",
    labelWidth: "80px",
  },
];
export {
  formData,
  formList,
  formConfig,
  formRules,
  modelFormData,
  modelFormItems,
  modelFormRules,
  modelFormConfig,
  catelogsFormItems,
  catelogsColumnArr,
  catelogsTableData,
  historyColumnArr,
  treeData,
  viewCodeColumnArr,
  viewCodeItem,
  viewCodeTableColumnArr,
  viewCodeTableData,
  rulesFormList,
  rulesFormData,
  rulesFormConfig,
  rulesColumnArr,
  rulesTableData,
  rulesModelFormItems,
  rulesModelFormData,
  rulesModelFormRules,
  rulesModelFormConfig,
  rulesModelCulumnArr,
  rulesModelTableData,
  rulesModelSearchFormItems,
};
