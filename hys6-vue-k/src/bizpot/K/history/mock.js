export const detailFormItems = [
  {
    prop: "en_name",
    label: "表名",
    type: "select",
    options: [],
  },
  {
    prop: "col_name",
    label: "字段名",
    type: "input",
  },
  {
    prop: "sort_id",
    label: "标准",
    type: "cascader",
    props: {
      value: "id",
      label: "label",
    },
    options: [],
  },
];
export const columnArr = [
  { label: "序号", type: "index", width: "80" },
  { prop: "source_name", type: "text", label: "系统名称" },
  { prop: "metaColCount", type: "text", label: "系统字段数" },
  { prop: "stanImpCount", type: "text", label: "落标字段数" },
  { prop: "stanImpSHICount", type: "text", label: "落标通过字段数" },
  { prop: "strengthProd", type: "text", label: "贯标率" },
  { prop: "standardthProd", type: "text", label: "落标率" },
  {
    type: "operate",
    label: "操作",
    width: "120px",
    operateArr: [{ label: "详情", type: "detail" }],
  },
];
export const detailColumnArr = [
  { label: "序号", type: "index", width: "80" },
  {
    prop: "table_cname",
    type: "text",
    label: "表中文名",
    minWidth: "110",
  },
  {
    prop: "table_ename",
    type: "text",
    label: "表英文名",
    minWidth: "110",
  },
  {
    prop: "src_col_cname",
    type: "text",
    label: "字段中文名",
    minWidth: "120",
  },
  {
    prop: "src_col_ename",
    type: "text",
    label: "字段英文名",
    minWidth: "120",
  },
  {
    prop: "norm_cname",
    type: "text",
    label: "引用标准",
    minWidth: "100",
  },
  {
    prop: "src_col_type",
    type: "text",
    label: "字段类型",
    minWidth: "100",
  },
  {
    prop: "src_col_len",
    type: "text",
    label: "字段长度",
    minWidth: "100",
  },
  {
    prop: "src_col_preci",
    type: "text",
    label: "字段精度",
    minWidth: "100",
  },
  {
    prop: "imp_result_txt",
    type: "tag",
    label: "落标结果",
    width: "100",
    fixed: "right",
  },
];
