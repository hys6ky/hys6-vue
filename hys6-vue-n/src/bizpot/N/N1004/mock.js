export const formItems = [
  {
    label: '选择资产视图',
    prop: 'assetView',
    type: 'select1',
    placeholder: '请选择资产视图',
    options: [{
      label:'科目视图',
      value:'0'
    }]
  }, 
  {
    label: '资产所属部门',
    prop: 'assetDepartment',
    type: 'select',
    placeholder: '请选择资产所属部门',
    options: [{
      label:"数据管理部",
      value:"0"
    }]
  }
]
export const treeData = []
const content1 = {
  0:[
    {
      label:"资产中文名称",
      prop:"asset_cname",
    },
    {
      label:"资产英文名称",
      prop:"asset_ename",
    },
    {
      label:"安全级别",
      prop:"security_level",
    },
    {
      label:"资产级别",
      prop:"asset_level",
      span:'1.5'
    },
    {
    label: '资产类别',
    prop: 'asset_type',
    span:'1.5'
  },

  
    {
      label:"资产描述",
      prop:"col_business",
      span:'1.5'
    },
    {
      label:"业务含义",
      prop:"business_remark",
      span:'1.5'
    }
  ],
}
const content2 = {
  0:[
    {
      label:"原字段中文名",
      prop:"col_cname",
    },
    {
      label:"原字段英文名",
      prop:"col_ename",
    },
    {
      label:"加工频率",
      prop:"process_frequen",
    },
    {
      label:"处理时间",
      prop:"process_rule",
      span:'1.5'
    },
    {
      label:"存储空间",
      prop:"storage_space",
      span:'1.5'
    },
    {
      label:"所属层级",
      prop:"layer",
      span:'3'
    },
  ],
  1:[
    {
      label:"字段类型",
      prop:"col_type",
    },
    {
      label:"字段长度",
      prop:"col_len",
    },
    {
      label:"字段精度",
      prop:"col_prec",
    }
  ]
}
const content3 = {
  0:[
    {
      label:"所属部门",
      prop:"manage_depart",
    },
    {
      label:"登记人",
      prop:"asset_by",
    },
    {
      label:"登记时间",
      prop:"asset_date",
    },
  ]
}
export const baseInfoContentList=[
  {
    title:"业务属性",
    name:"business",
    content:content1
  },
  {
    title:"技术属性",
    name:"technology",
    content:content2
  },
  {
    title:"管理属性",
    name:"management",
    content:content3
  }
]
export const contentData={
  asset_cn_Name:"客户号",
  asset_en_Name:"CUST_NUM",
  security_level:"保密",
  asset_level:"共享",
  asset_type:"字段",
  asset_version:"1.0.1",
  asset_description:"客户号是客户的唯一标识，由系统自动生成，不可修改。",
  business_meaning:"这是一段可换行的业务含义,这是一段可换行的业务含义,这是一段可换行的业务含义,这是一段可换行的业务含义,这是一段可换行的业务含义,这是一段可换行的业务含义,这是一段可换行的业务含义,这是一段可换行的业务含义。",
  sub_level:"近源层",
  original_cn_name:"客户号",
  original_en_name:"CUST_NUM",
  process_frequency:"每日",
  process_time:"2021-09-08 11:23:11",
  storage_space:"TDH",
  field_type:"代码类型",
  field_length:"",
  field_precision:"",
  sub_department:"信息技术部",
  register:"邓知知",
  register_time:"2021-09-08 11:23:11",
}




const content11 = {
  0:[
    {
      label: '资产英文名称',
      prop: 'asset_ename',
  
    },
    {
      label: '资产中文名称',
      prop: 'asset_cname',

    },
    {
      label: '资产类别',
      prop: 'asset_type',
    },
    {
      label: "业务主键",
      prop: "business_pk",
    },
    {
      label: '资产代码',
      prop: 'asset_code',
    },
    {
      label: "数据源类型",
      prop: "data_source_type",
    },
    {
      label: "所属主题",
      prop: "theme",
    },
    {
      label: "业务含义",
      prop: "business_remark",
    }
  ],
}
const content21 = {
  0:[
    {
      label: '所属层级',
      prop: 'layer',
      props: {
        value: 'id',
        label: 'label',
      },
      span:'3',
      options: [
        {
          id: '1',
          label: "贴源层",
          children: [{
            id: '2',
            label: "同心人事系统",
          },],
        }],
  
    },
    {
      label: '存储位置',
      prop: 'store_path',

    },
    {
      label: '加工频率',
      prop: 'process_frequen',

    },
    {
      label: "处理日期",
      prop: "process_rule",

    },
    {
      label: "技术主键",
      prop: "tech_pk",

    },
    {
      label: "数据权限字段",
      prop: "data_auth_code",

    }
  ],
}



export const baseInfoContentList1 = [
  {
    title:"业务属性",
    name:"business",
    content:content11
  },
  {
    title:"技术属性",
    name:"technology",
    content:content21
  },
  {
    title:"管理属性",
    name:"management",
    content:content3
  }
]
export const columnArr3 = [
  { prop: 'item_cname', type: "text", label: '码值项名称', minWidth: '170px' },
  { prop: 'item_value', type: "text", label: '码值', minWidth: '170px' },
];