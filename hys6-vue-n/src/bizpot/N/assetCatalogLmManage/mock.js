import Vue from "vue";
var vm = new Vue();
export const treeData = []

  export const modelFormItems = [
    {
      prop: "name1",
      label: "类目标题",
      placeholder: "请输入目录版本标题",
      type: "input",
      span: 24,
    },
    {
      prop: "name2",
      label: "类目编码",
      placeholder: "请输入目录类型",
      type: "input",
      span: 24,
    },
    {
      prop: "name3",
      label: "描述",
      placeholder: "请输入描述",
      type: "textarea",
    },
  ];
  export const modelFormConfig = {
    labelWidth: "130px",
    inline: false,
    ref: "dataMartForm",
  };
  export const modelFormData = {
    name1 : '',
    name2 : '',
    name3 : '',
  };
  export const modelFormRules = {
    name1: vm.filter_rules([{ required: true }]),
  };

 export const assetColumnArr = [
  { prop: "tag", label: "全择", type: "selection", width: "70px", align: "center" },
  { prop: 'catalog_name', type: "text", label: '资产类目', width: '100px' },
  { prop: 'dir_name', type: "text", label: '目录名称', minWidth: 130 },
  { prop: 'dir_code', type: "text", label: '目录编码', minWidth: 130 },
  { prop: 'create_by', type: "text", label: '创建人', width: '90px' },
  { prop: 'create_date', type: "text", label: '创建日期',minWidth: 110 },
  { prop: 'create_time', type: "text", label: '创建时间',minWidth: 110 },
  {
    type: "operate", fixed: "right",width: "120px", label: '操作', operateArr: [
      { label: '编辑', type: 'bj' },
      { label: '删除', type: 'del' },
    ] 
  }
 ]

 export const assetTableData = []



 export const modelFormItems1 = [
  {
    prop: "name1",
    label: "类目标题",
    placeholder: "请输入类目标题",
    type: "input",
    span: 24,
  },
  {
    prop: "name2",
    label: "资产类目编码",
    placeholder: "请输入资产类目编码",
    type: "input",
    span: 24,
  },

  {
    prop: "name3",
    label: "资产类目描述",
    placeholder: "请输入资产类目描述",
    type: "textarea",
  },
];
export const modelFormConfig1 = {
  labelWidth: "130px",
  inline: false,
  ref: "dataMartForm1",
};
export const modelFormData1 = {
  name1 : '',
  name2 : '',
  name3 : '',
};
export const modelFormRules1 = {
  name1: vm.filter_rules([{ required: true }]),
  name2: vm.filter_rules([{ required: true }]),
  name3: vm.filter_rules([{ required: true }]),
};



export const modelFormItems2 = [
  {
    prop: "name1",
    label: "类目标题",
    placeholder: "请输入类目标题",
    type: "input",
    span: 24,
  },
  {
    prop: "name2",
    label: "资产类目编码",
    placeholder: "请输入资产类目编码",
    type: "input",
    span: 24,
  },

  {
    prop: "name3",
    label: "资产类目描述",
    placeholder: "请输入资产类目描述",
    type: "textarea",
  },
];
export const modelFormConfig2 = {
  labelWidth: "130px",
  inline: false,
  ref: "dataMartForm2",
};
export const modelFormData2 = {
  name1 : '',
  name2 : '',
  name3 : '',
};
export const modelFormRules2 = {
  name1: vm.filter_rules([{ required: true }]),
  name2: vm.filter_rules([{ required: true }]),
  name3: vm.filter_rules([{ required: true }]),
};



export const modelFormItems3 = [
  {
    prop: "dir_name",
    label: "目录名称",
    placeholder: "请输入目录名称",
    type: "input",
    span: 24,
  },
  {
    prop: "dir_code",
    label: "目录代码",
    placeholder: "请输入目录代码",
    type: "input",
    span: 24,
  },
  {
    prop: "parent_id",
    props : { checkStrictly: true , value : 'id' , emitPath : false},
    label: "上级目录",
    lecels  : false,
    placeholder: "请选择上级目录",
    type: "cascader1",
    options:   []}
];
export const modelFormItems31 = [
  {
    prop: "dir_name",
    label: "目录名称",
    placeholder: "请输入目录名称",
    type: "input",
    span: 24,
  },
  {
    prop: "dir_code",
    label: "目录代码",
    placeholder: "请输入目录代码",
    type: "input",
    span: 24,
  },
  {
    prop: "dir_name",
    label: "编辑目录",
    placeholder: "请输入目录",
    type: "input",
    disabled : true,
    span: 24,
   }
];
export const modelFormConfig3 = {
  labelWidth: "130px",
  inline: false,
  ref: "dataMartForm3",
};
export const modelFormData3 = {
  dir_name : '',
  dir_code : '',
  parent_id : '',
};
export const modelFormRules3 = {
  dir_name: vm.filter_rules([{ required: true }])
};


const formItem1 = [

  {
    label: '规则',
    prop: 'type1',
    span: 8,
    type: 'select',
    options: [
      {
        label: "规则1",
        value: "0"
      },
      {
        label: "规则2",
        value: "1"
      },
    ],
  },
  {
    label: '编码位数',
    prop: 'bmws1',
    span: 8,
    type: 'el-input-number',
  },
  {
    label: '范围',
    prop: 'f1',
    span: 8,
    type: 'inputFanw',
  },

]
const formItem2 = [
  {
    label: '规则',
    prop: 'type2',
    span: 8,
    type: 'select',
    options: [
      {
        label: "规则1",
        value: "0"
      },
      {
        label: "规则2",
        value: "1"
      },
    ],
  },
  {
    label: '编码位数',
    prop: 'bmws2',
    span: 8,
    type: 'el-input-number',
  },
  {
    label: '范围',
    prop: 'f2',
    span: 8,
    type: 'inputFanw',
  },
]
const formItem3 = [
  {
    label: '规则',
    prop: 'type3',
    span: 8,
    type: 'select',
    options: [
      {
        label: "规则1",
        value: "0"
      },
      {
        label: "规则2",
        value: "1"
      },
    ],
  },
  {
    label: '编码位数',
    prop: 'bmws3',
    span: 8,
    type: 'el-input-number',
  },
  {
    label: '范围',
    prop: 'f3',
    span: 8,
    type: 'inputFanw',
  },
 ]
const formItem4 = [
  {
    label: '使用编码分隔符',
    prop: 'pd',
    span: 8,
    type: 'radio',
    options: [
      {
        label: "是",
        value: "0"
      },
      {
        label: "否",
        value: "1"
      },
    ],
  },
 ]
 const formItem5 = [
  {
    label: '规则',
    prop: 'type5',
    span: 8,
    type: 'select',
    options: [
      {
        label: "规则1",
        value: "0"
      },
      {
        label: "规则2",
        value: "1"
      },
    ],
  },
  {
    label: '编码位数',
    prop: 'bmws5',
    span: 8,
    type: 'el-input-number',
  },
  {
    label: '范围',
    prop: 'f5',
    span: 8,
    type: 'inputFanw',
  },
 ]
export const formData = {
  type1: "0",
  bmws1 : 1,
  f1 :{
    'qs' : '1221',
    'js' : '54565'
  },
  type2: "0",
  bmws2 : 1,
  f2 :{
    'qs' : '1221',
    'js' : ''
  },
  type3: "0",
  bmws3 : 4,
  f3 :{
    'qs' : '',
    'js' : '54565'
  },
  pd : '0',
  type5: "1",
  bmws5 : 4,
  f5 :{
    'qs' : '',
    'js' : '54565'
  },
}
export const formConfig = {
  labelWidth: "130px",
  inline: false,
  ref: "assetForm",
}
export const formRules = {
  type1: { required: true, message: '该输入项为必填项', trigger: 'blur' },
  type2: { required: true, message: '该输入项为必填项', trigger: 'blur' },
  type3: { required: true, message: '该输入项为必填项', trigger: 'blur' },
  type5: { required: true, message: '该输入项为必填项', trigger: 'blur' },
   bmws1: { required: true, message: '该选择项为必填项', trigger: 'blur' },
   bmws2: { required: true, message: '该选择项为必填项', trigger: 'blur' },
   bmws3: { required: true, message: '该选择项为必填项', trigger: 'blur' },
   bmws5: { required: true, message: '该选择项为必填项', trigger: 'blur' },
}

export const formList = [
  {
    title: '一级编码',
    formItems: formItem1
  },
  {
    title: '二级编码',
    formItems: formItem2
  },
  {
    title: "三级编码",
    formItems: formItem3
  },
  {
    title: "编码分隔符",
    formItems: formItem4
  },
  {
    title: "资产编码",
    formItems: formItem5
  }
]
