import Vue from "vue";
var vm = new Vue();
export const formItems = [
  {
    prop: "data_req_name",
    label: "数据需求名称",
    type: "input",
  },
  {
    prop: "req_status",
    label: "数据需求状态",
    multiple: true,
    type: "select",
    options: [
      // { value: 0, label: "待开发" },
      // { value: 1, label: "开发中" },
      // { value: 2, label: "已完成" },
    ],
  },
  {
    prop: "created_time",
    label: "数据需求创建日期",
    type: "date",
  },
];
export const columnArr = [
  { prop: "tag", type: "selection", width: "70px", align: "center" },
  { label: "序号", type: "index", width: "80px", align: "center" },
  {
    prop: "data_req_name",
    type: "text",
    label: "数据需求名称",
    minWidth: "230px",
  },
  {
    prop: "biz_name",
    type: "text",
    label: "所属业务需求名称",
    minWidth: "230px",
  },
  {
    prop: "dept",
    type: "text",
    label: "需求提出部门",
    minWidth: "180px",
  },
  {
    prop: "task_num",
    type: "text",
    label: "任务数量",
    minWidth: "160px",
  },
  {
    prop: "req_status_txt",
    type: "text",
    label: "数据需求状态",
    minWidth: "220px",
  },

  { prop: "online_date", type: "text", label: "上线日期", minWidth: "160px" },
  { prop: "created_time", type: "text", label: "创建日期", minWidth: "200px" },

  {
    type: "operate",
    label: "操作",
    width: "330px",
    align: "center",
    operateArr: [
      {
        label: "查看",
        type: "check",
      },
      {
        label: "编辑",
        type: "edit",
        hide: (item) => {
          if (item.req_status.replaceAll(" ", "") == 3) {
            return false;
          } else {
            return true;
          }
        },
      },
      {
        label: "删除",
        type: "del",
        hide: (item) => {
          if (item.req_status.replaceAll(" ", "") == 3) {
            return false;
          } else {
            return true;
          }
        },
      },
      {
        label: "表资源分配",
        type: "fenpei",
      },
      {
        label: "任务分解",
        type: "cengjiqueren",
      },
      {
        label: "结项",
        type: "close",
        hide: (item) => {
          if (item.req_status.replaceAll(" ", "") == 3) {
            return false;
          } else {
            return true;
          }
        },
      },
    ],
    // more: (row) => {
    //   return true;
    // },
    // moreItem: [
    //   { label: "表资源分配", type: "fenpei" },
    //   { label: "任务层级确认", type: "cengjiqueren" },
    // ],
  },
];
//新增弹窗数据
export const formValue = {
  biz_id: "1",
  // owner_id: "",
  // owner_name: [],
  data_req_name: "",
  data_req_desc: "",
  dept: "",
  // req_status_txt: "",
  // create_name: "",
  online_date: "",
};

export const dataItems = [
  {
    prop: 'data_req_name',
    label: '数据需求名称',
    placeholder: '请输入数据需求名称',
    type: 'input',
    disabled: false,
    span: 11
  },
  {
    prop: 'dept',
    label: '需求提出部门',
    placeholder: '请输入需求提出部门',
    type: 'input',
    disabled: false,
    span: 11,
  },
  {
    prop: 'online_date',
    label: '上线日期',
    placeholder: '请输入上线日期',
    type: 'date',
    format: 'yyyy-MM-dd',
    valueFormat: 'yyyy-MM-dd',
    disabled: false,
    blur: 'onlineDate',
    span: 11
  },
  {
    prop: 'data_req_desc',
    label: '数据需求描述',
    placeholder: '请输入数据需求描述',
    type: 'textarea',
    disabled: false,
    rwos: 5,
    span: 22
  },
];
export  const dataConfig = {
  labelWidth: "140px",
  inline: false,
  ref: "formRef",
};
