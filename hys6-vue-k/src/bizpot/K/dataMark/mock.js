const treeData = [
  {
    id: 1,
    label: "目录1",
    showLable: "目录1",
    expanded: false,
    type: "text",
    children: [
      {
        id: 2,
        label: "标准1-1",
        showLable: "标准1-1",
        type: "text",
      },
      {
        id: 3,
        label: "目录1-2",
        showLable: "目录1-2",
        expanded: false,
        type: "text",
        children: [
          {
            id: 4,
            label: "标准1-2-1",
            showLable: "标准1-2-1",
            type: "text",
          },
          {
            id: 5,
            label: "标准1-2-2",
            showLable: "标准1-2-2",
            type: "text",
          },
        ],
      },
      {
        id: 6,
        label: "标准1-3",
        showLable: "标准1-3",
        type: "text",
      },
      {
        id: 7,
        label: "标准1-4",
        showLable: "标准1-4",
        type: "text",
      },
    ],
  },
  {
    id: 8,
    label: "目录2",
    showLable: "目录2",
    type: "text",
    children: [
      {
        id: 9,
        label: "标准2-1",
        showLable: "标准2-1",
        type: "text",
      },
      {
        id: 10,
        label: "标准2-2",
        showLable: "标准2-2",
        type: "text",
      },
      {
        id: 11,
        label: "标准2-3",
        showLable: "标准2-3",
        type: "text",
      },
    ],
  },
  {
    id: 12,
    label: "标准3",
    showLable: "标准3",
    type: "text",
  },
];
const filterTreeData = [
  {
    id: 1,
    label: "目录1",
    showLable: "目录1",
    expanded: false,
    type: "text",
    children: [
      {
        id: 3,
        label: "目录1-2",
        showLable: "目录1-2",
        expanded: false,
        type: "text",
      },
    ],
  },
  {
    id: 8,
    label: "目录2",
    showLable: "目录2",
    type: "text",
  },
];
const formItems = [
  {
    prop: "sysNum",
    label: "系统",
    type: "select",
    labelWidth: "40px",
    options: [
      { label: "S01", value: "1" },
      { label: "S02", value: "2" },
      { label: "S03", value: "3" },
      { label: "数据平台", value: "4" },
    ],
  },
  // {
  //   prop: 'SchemaName',
  //   label: 'SCHEMA名称',
  //   type: 'input',
  //   labelWidth: '100px',
  // },
  {
    prop: "formName",
    label: "检索",
    labelWidth: "60px",
    type: "input",
    placeholder: "请输入表名（中英文）、字段名（中英文）进行检索",
    width: "360",
  },
  {
    prop: "standard",
    label: "标准",
    labelWidth: "40px",
    type: "cascader",
    props: {
      value: "id",
      label: "label",
    },
    options: treeData,
  },
];
const columnArr = [
  { label: "序号", prop: "index", type: "index", width: "70px" },
  // { label: '系统编号', prop: 'source_id', type: 'text', width: "120px" },
  { label: "系统名称", prop: "source_name", type: "text", width: "150px" },
  // { label: 'SCHEMA名称', prop: 'SchemaName', type: 'text', width: "150px" },
  { label: "表中文名", prop: "table_cname", type: "text", width: "150px" },
  { label: "表英文名", prop: "table_ename", type: "text", width: "150px" },
  { label: "字段中文名", prop: "col_cname", type: "text", width: "150px" },
  { label: "字段英文名", prop: "col_ename", type: "text", width: "150px" },
  { label: "引用标准", prop: "norm_cname", type: "text", minWidth: "150px" },
  { label: "落标结果", prop: "imp_result", type: "tag", minWidth: "150px" },
  {
    label: "操作",
    prop: "operate",
    type: "operate",
    fixed: "right",
    width: "120",
    operateArr: [
      { label: "落标", type: "edit" },
      // { label: '删除', type: 'delete' },
    ],
  },
];

const mesureFormItems = [
  {
    prop: "measureCode",
    label: "所属分类",
    type: "cascader",
    props: {
      value: "id",
      label: "label",
    },
    options: filterTreeData,
  },
  {
    prop: "measureName",
    label: "标准名称",
    type: "input",
    labelWidth: "80px",
  },
];
const mesureCulumnArr = [
  { label: "选择", prop: "check", type: "radio", width: "70px" },
  { label: "序号", prop: "index", type: "index", width: "70px" },
  { label: "标准名称", prop: "norm_cname", type: "text" },
  { label: "标准类型", prop: "data_type_name", type: "text" },
  { label: "长度", prop: "col_len", type: "text" },
  { label: "精度", prop: "decimal_POINT", type: "text" },
  { label: "代码名称", prop: "code_type_name", type: "text" },
];

export { formItems, columnArr, mesureFormItems, mesureCulumnArr };
