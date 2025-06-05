import Vue from "vue";
var vm = new Vue();
export const formItems = [
  {
    prop: "task_name",
    label: "任务名称",
    type: "input",
  },
  {
    prop: "start_date",
    label: "任务开始日期",
    type: "date",
  },
  {
    prop: "end_date",
    label: "任务结束日期",
    type: "date",
  },
  {
    prop: "owner_name",
    label: "开发人员",
    type: "select",
    multiple: true,
    options: [],
  },
  {
    prop: "task_category",
    label: "任务类别",
    type: "select",
    multiple: true,
    options: [],
  },
  {
    prop: "task_status",
    label: "任务状态",
    multiple: true,
    type: "select",
    options: [],
  },
];
export const formData = {
  task_name: "",
  biz_id: "",
  data_req_id: "",
  owner_id: [],
  owner_name: [],
  start_data: "",
  end_data: "",
  task_status: [],
  task_category: [],
};
export const columnArr = [
  { prop: "tag", type: "selection", width: "70", align: "center" },

  { type: "index", label: "序号", width: "80px", align: "center" },
  { prop: "task_name", type: "text", label: "任务名称", minWidth: "160px" },
  { prop: "task_desc", type: "text", label: "任务描述", minWidth: "160px" },
  {
    prop: "owner_name",
    type: "text",
    label: "开发人员",
    minWidth: "160px",
  },
  {
    prop: "task_category_txt",
    type: "text",
    label: "任务类别",
    minWidth: "160px",
  },
  {
    prop: "task_status_txt",
    type: "text",
    label: "任务状态",
    minWidth: "160px",
  },
  { prop: "start_date", type: "text", label: "任务开始日期", minWidth: "160px" },
  { prop: "end_date", type: "text", label: "任务结束日期", minWidth: "160px" },

  {
    type: "operate",
    label: "操作",
    width: "260px",
    align: "center",
    operateArr: [
      {
        label: "查看",
        type: "check",
      },
      {
        label: "编辑",
        type: "edit",
        hide: (row) => {
          if (row.task_status.replaceAll(" ", "") == 2) {
            return false;
          } else {
            return true;
          }
        },
      },
      {
        label: "删除",
        type: "del",
        hide: (row) => {
          if (row.task_status.replaceAll(" ", "") == 2) {
            return false;
          } else {
            return true;
          }
        },
      },
      {
        label: "提交测试",
        type: "changeStatus",
        hide: (row) => {
          let status = row.task_status;
          if (
            !(
              (status && status.replaceAll(" ", "")) == 0 ||
              (status && status.replaceAll(" ", "")) == 1
            )
          ) {
            return false;
          } else {
            return true;
          }
        },
      },
      {
        label: "资产盘点",
        type: "assetsInventory",
        hide: (row) => {
          if (((row.task_category && row.task_category.replaceAll(" ", "")) === '5')) {
            return true;
          } else {
            return false;
          }
        },
      },
    ],
  },
];
export const tableData = [
  {
    task_id: "12",
    task_name: "xxx",
    start_date: "2001-12-1",
    end_date: "2002-12-1",
    owner_id: [],
    owner_name: [],
    task_desc: "xxx",
    task_category: "xxx",
  },
];

export const form = {
  task_name: "",
  start_date: "",
  end_date: "",
  owner_id: [],
  owner_name: [],
  task_desc: "",
  task_category: "",
};
export const taskItems = [
  {
    prop: 'task_name',
    label: '任务名称',
    placeholder: '请输入任务名称',
    type: 'input',
    disabled: false,
    span: 11
  },
  {
    prop: 'owner_name',
    label: '开发人员',
    placeholder: '请输入开发人员',
    type: 'select',
    disabled: false,
    multiple: true,
    change: 'owner',
    options: [],
    span: 11,
  },
  {
    prop: 'start_date',
    label: '开始日期',
    placeholder: '请输入开始日期',
    type: 'date',
    format: 'yyyy-MM-dd',
    valueFormat: 'yyyy-MM-dd',
    disabled: false,
    blur: 'startDate',
    span: 11
  },
  {
    prop: 'end_date',
    label: '结束日期',
    placeholder: '请输入结束日期',
    type: 'date',
    format: 'yyyy-MM-dd',
    valueFormat: 'yyyy-MM-dd',
    disabled: false,
    blur: 'endDate',
    span: 11
  },
  {
    prop: 'task_category',
    label: '任务类别',
    placeholder: '请输入任务类别',
    type: 'select',
    disabled: false,
    options: [],
    span: 11,
  },
  {
    prop: 'task_desc',
    label: '任务描述',
    placeholder: '请输入任务描述',
    type: 'textarea',
    disabled: false,
    rwos: 5,
    span: 22
  },
];

export  const taskConfig = {
  labelWidth: "120px",
  inline: false,
  ref:"from"
};
