import Vue from "vue";
var vm = new Vue();
export const formItems = [
  {
    label: "英文名称",
    prop: "en_name",
    type: "input",
    placeholder: "请输入英文名称",
    labelWidth: "80px",
  },
  {
    label: "中文名称",
    prop: "ch_name",
    type: "input",
    placeholder: "请输入中文名称",
    labelWidth: "80px",
  },
  {
    label: "对象类型",
    prop: "type",
    type: "select",
    placeholder: "请选择指标类型",
    labelWidth: "80px",
    value: "",
    disabled: false,
    options: [
      {
        value: "0",
        label: "表",
      },
      {
        value: "1",
        label: "视图",
      },
      {
        value: "2",
        label: "存储过程",
      },
      {
        value: "3",
        label: "物化视图",
      },
    ],
  },
];
export const columnArr = [
  // { prop: "tag", type: "selection", width: "70px", align: "center" },
  { label: "序号", type: "index", width: "80" },
  { label: "英文名", prop: "en_name", type: "text", minWidth: "120" },
  { label: "中文名", prop: "ch_name", type: "text", minWidth: "120" },
  { label: "对象类型", prop: "typeText", type: "text", minWidth: "120" },
  { label: "创建时间", prop: "created_dateTime", type: "text", minWidth: "200" },
  { label: "最后修改时间", prop: "update_dateTime", type: "text", minWidth: "200" },
  { label: "版本号", prop: "version", type: "text", minWidth: "170" },
  // { label: "所属存储层", prop: "",type:"",minWidth:"120"},
  {
    type: "operate",
    label: "操作",
    width: "200px",
    fixed: "right",
    operateArr: [
      {
        label: "编辑",
        type: "edit",
      },
      {
        label: "版本对比",
        type: "version",
      },
      {
        label: "历史版本",
        type: "history",
        hide: (row) => {
          return row.type !== "2";
        },
      },
      // {
      //   label: "对标",
      //   type: "benchmark",
      //   hide: (row) => {
      //     return row.type === "0";
      //   },
      // },
      // {
      //   label: "血缘查看",
      //   type: "blood",
      // },
    ],
  },
];
export const editModelFormItems = [
  {
    prop: "en_name",
    label: "英文名",
    type: "text",
    span: 8,
  },
  {
    prop: "ch_name",
    label: "中文名",
    placeholder: "请输入中文名",
    type: "input",
    span: 8,
  },
  {
    prop: "type_text",
    label: "对象类型",
    type: "text",
    span: 8,
  },
  {
    prop: "source_name",
    label: "所属存储层",
    type: "text",
    span: 8,
  },
  {
    prop: "version",
    label: "当前版本号",
    type: "text",
    span: 8,
  },
  {
    prop: "updated_time",
    label: "最后修改时间",
    type: "text",
    span: 8,
  },
];
export const editModelFormData = {
  en_name: "",
  ch_name: "",
  type_text: "",
  source_name: "",
  version: "",
  updated_time: "",
};
export const editModelFormConfig = {
  labelWidth: "120px",
  inline: false,
  ref: "editForm",
};
export const editModelFormRules = {
  ch_name: vm.filter_rules([{ required: true }]),
};
export const tableDataInfo = {
  tableData: [],
};
export const columnArrInfo = [
  { prop: "index", label: "序号", type: "index", width: "70px" },
  {
    label: "字段英文名",
    prop: "col_en_name",
    type: "text",
    minWidth: "120px",
  },
  {
    label: "字段中文名",
    prop: "col_ch_name",
    type: "input",
    minWidth: "120px",
    // rules: vm.filter_rules([{ required: true }]),
  },
  {
    label: "字段类型",
    prop: "col_type",
    type: "text",
    minWidth: "120px",
  },
  {
    label: "操作",
    type: "operate",
    width: "160px",
    fixed: "right",
    operateArr: [
      // {
      //   label: "查看标准元",
      //   type: "viewStandard",
      // },
      {
        label: "保存",
        type: "saveSingle",
      },
    ],
  },
];
export const compareData = [
  {
    obj_id: 2,
    created_id: null,
    updated_id: null,
    created_by: null,
    updated_by: null,
    created_date: null,
    created_time: null,
    updated_date: null,
    updated_time: null,
    source_id: null,
    en_name: "tbl_b",
    ch_name: "表B",
    type: "0",
    version: 1,
    source_name: null,
    colQueryVoList: [
      // 当type!=2 时取此字段
      {
        dtl_id: 1,
        created_time: null,
        updated_time: null,
        obj_id: 1,
        col_en_name: "col1", //字段英文名
        col_ch_name: "字段1", // 字段中文名
        col_type: "varchar", // 字段类型
        col_len: 10, // 字段长度
        col_prec: null, // 字段精度
        biz_desc: "业务描述", // 业务描述
        version: 1,
      },
    ],
    funcQueryVo: {
      // 当type==2 时取此字段
      dtl_id: 1,
      created_time: null,
      updated_time: null,
      obj_id: 5,
      ori_sql: "select * from tbl", // 原sql
      fm_sql: "select * from tbl", // 格式化后的sql
      biz_desc: "yw描述", // 业务描述
      version: 1,
    },
  },
  {
    obj_id: 2,
    created_id: null,
    updated_id: null,
    created_by: null,
    updated_by: null,
    created_date: null,
    created_time: null,
    updated_date: null,
    updated_time: null,
    source_id: null,
    en_name: "tbl_b",
    ch_name: "表B",
    type: "0",
    version: 2,
    source_name: null,
    colQueryVoList: [
      // 当type!=2 时取此字段
      {
        dtl_id: 1,
        created_time: null,
        updated_time: null,
        obj_id: 1,
        col_en_name: "col1", //字段英文名
        col_ch_name: "字段1", // 字段中文名
        col_type: "varchar", // 字段类型
        col_len: 10, // 字段长度
        col_prec: null, // 字段精度
        biz_desc: "业务描述", // 业务描述
        version: 1,
      },
    ],
    funcQueryVo: {
      // 当type==2 时取此字段
      dtl_id: 1,
      created_time: null,
      updated_time: null,
      obj_id: 5,
      ori_sql: "select * from tbl", // 原sql
      fm_sql: "select * from tbl", // 格式化后的sql
      biz_desc: "yw描述", // 业务描述
      version: 1,
    },
  },
];
