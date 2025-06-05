// 列表
const tableData = [
  { code_encode: "", code_type_name: "", code_remark: "", code_status: "" },
];
const formItems = [
  {
    prop: "code_encode",
    label: "标准代码编码",
    type: "input",
  },
  {
    prop: "code_type_name",
    label: "标准代码名称",
    type: "input",
  },
  {
    prop: "code_status",
    label: "标准代码状态",
    type: "select",
    options: [
      { label: "已发布", value: "1" },
      { label: "未发布", value: "0" },
    ],
  },
];
const modelColumnArr = [
  { prop: "index", label: "序号", type: "index", align: "center" },
  { prop: "code_value", label: "标准代码值", type: "input" },
  { prop: "code_item_name", label: "标准代码值名称", type: "input" },
  { prop: "code_remark", label: "标准代码值描述", type: "input" },
];
const columnArr = [
  { prop: "tag", type: "selection", width: "70", align: "center" },
  { label: "序号", type: "index", width: "80", align: "center" },
  { prop: "code_encode", type: "text", label: "标准代码编码" ,minWidth:'180'},
  { prop: "code_type_name", type: "text", label: "标准代码名称" ,minWidth:'180'},
  { prop: "code_status_txt", type: "text", label: "标准代码状态" ,minWidth:'180'},
  { prop: "code_remark", type: "text", label: "标准代码描述" ,minWidth:'180'},
  {
    type: "operate",
    label: "操作",
    width: "200px",
    operateArr: [
      { label: "查看", type: "check" },
      { label: "编辑", type: "edit" },
      { label: "删除", type: "del" },
    ],
  },
];
const formData = {
  tableData: [
    {
      code_encode: "",
      code_item_name: "",
      code_value: "",
      code_remark: "",
      dbm_level: "",
    },
  ],
};
const rules = {
  code_encode: [{ required: true, message: "请输入代码编号", trigger: "blur" }],
  code_type_name: [
    { required: true, message: "请输入代码名称", trigger: "blur" },
  ],
  // code_status: [{ required: true, message: "请选择代码状态", trigger: "blur" }],
  tableData: {
    code_encode: [
      { required: true, message: "请输入代码编号", trigger: "blur" },
    ],
    code_item_name: [
      { required: true, message: "请输入代码名称", trigger: "blur" },
    ],
    code_value: [
      { required: true, message: "请选择代码状态", trigger: "blur" },
    ],
  },
};
const modelRules = {
  code_encode: [{ required: true, message: "请输入代码编号", trigger: "blur" }],
  code_item_name: [
    { required: true, message: "请输入代码名称", trigger: "blur" },
  ],
  code_value: [{ required: true, message: "请选择代码状态", trigger: "blur" }],
};

const modelFormData = {
  code_encode: "",
  code_type_name: "",
  code_remark: "",
  code_status: "",
};
const modelFormItems = [
  {
    prop: "code_encode",
    label: "标准代码编码",
    placeholder: "请输入标准代码编码",
    type: "input",
    disabled: false,
    span: 24,
  },
  {
    prop: "code_type_name",
    label: "标准代码名称",
    placeholder: "请输入标准代码名称",
    type: "input",
    disabled: false,
    span: 24,
  },
  // {
  //   prop: "code_status",
  //   label: "标准代码状态",
  //   placeholder: "请选择",
  //   type: "select",
  //   disabled: false,
  //   span: 24,
  //   options: [
  //     { label: "已发布", value: "1" },
  //     { label: "未发布", value: "0" },
  //   ],
  // },
  {
    prop: "code_remark",
    label: "标准描述",
    placeholder: "请输入标准描述",
    type: "textarea",
    disabled: false,
    span: 24,
  },
];
const modelFormRules = {
  code_encode: {
    required: true,
    message: "该输入项为必填项",
    trigger: "blur",
  },
  code_type_name: {
    required: true,
    message: "该输入项为必填项",
    trigger: "blur",
  },
  // code_status: {
  //   required: true,
  //   message: "该输入项为必填项",
  //   trigger: "blur",
  // },
};
const modelFormConfig = {
  labelWidth: "130px",
  inline: false,
  ref: "checkForm",
};
export {
  tableData,
  columnArr,
  modelColumnArr,
  formData,
  formItems,
  rules,
  modelRules,
  modelFormData,
  modelFormItems,
  modelFormRules,
  modelFormConfig,
};
