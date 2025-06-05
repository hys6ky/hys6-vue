export const columnArr = [
  { label: "序号", type: "index", width: "80" },
  { label: "英文名", prop: "en_name", type: "text", minWidth: "120" },
  { label: "中文名", prop: "ch_name", type: "text", minWidth: "120" },
  { label: "对象类型", prop: "typeText", type: "text", minWidth: "120" },
  { label: "最后修改时间", prop: "create_time", type: "text", minWidth: "200" },
  { label: "版本号", prop: "version", type: "text", minWidth: "120" },
  {
    type: "operate",
    label: "操作",
    width: "100px",
    fixed: "right",
    operateArr: [
      {
        label: "查看",
        type: "view",
      },
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
    type: "text",
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
    prop: "col_en_name",
    type: "text",
    minWidth: "120px",
  },
  {
    label: "字段类型",
    prop: "col_type",
    type: "text",
    minWidth: "120px",
    fixed: "right",
  },
];
