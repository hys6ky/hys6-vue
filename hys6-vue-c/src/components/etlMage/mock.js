import Vue from "vue";
import * as validator from "@/utils/validator";
const rule = validator.default;
var vm = new Vue();

export const columnArr1 = [
  { label: "序号", type: "index", width: "70" },
  { label: "工程编号", prop: "etl_sys_cd", type: "link", minWidth: "80"},
  { label: "工程名称", prop: "etl_sys_name", type: "text", minWidth: "80" },
  { label: "工程描述", prop: "comments", type: "text", minWidth: "80" },
  {
    label: "当前批量日期",
    prop: "curr_bath_date",
    type: "text",
    minWidth: "80",
  },
  {
    label: "CONTROL",
    type: "operate",
    minWidth: "120",
    operateArr: [
      {
        label: "启动",
        type: "startControl",
      },
      {
        label: "日志信息",
        type: "logControl",
      },
    ],
  },
  {
    label: "TRIGGER",
    type: "operate",
    minWidth: "120",
    operateArr: [
      {
        label: "启动",
        type: "starttri",
      },
      {
        label: "日志信息",
        type: "logtri",
      },
    ],
  },
  {
    label: "操作",
    type: "operate",
    minWidth: "120",
    operateArr: [
      {
        label: "编辑",
        type: "edit",
      },
      {
        label: "部署",
        type: "layout",
      },
      {
        label: "删除",
        type: "detele",
      },
      {
        label: "停止",
        type: "stop",
        hide:row => {
          if(row.sys_run_status != 'S'){
            return true;
          }else{
            return false;
          }
        },
      },
    ],
  },
];
export const columnArr2 = [
  { label: "序号", type: "index", width: "70" },
  {
    label: "数据源编号",
    prop: "datasource_number",
    type: "text",
    minWidth: "120",
  },
  {
    label: "数据源名称",
    prop: "datasource_name",
    type: "text",
    minWidth: "120",
  },
  { label: "Agent名称", prop: "agent_name", type: "text", minWidth: "120" },
  { label: "任务名称", prop: "task_name", type: "text", minWidth: "120" },
  { label: "表名", prop: "table_name", type: "text", minWidth: "120" },
  { label: "jdbcURL", prop: "jdbc_url", type: "text", minWidth: "120" },
];

export const formAdd = {
  etl_sys_cd: "",
  etl_sys_name: "",
  comments: "",
  status: "T",
};

export const modelFormConfig = {
  ref: "formAdd",
  labelWidth: "150px",
};

export const ModelformItems = [
  {
    label: "工程编号",
    prop: "etl_sys_cd",
    span: 18,
    type: "input",
    disabled: false,
    placeholder: "工程编号",
  },
  {
    label: "工程名称",
    prop: "etl_sys_name",
    span: 18,
    type: "input",
    disabled: false,
    placeholder: "工程名称",
  },
  {
    label: "上游工程",
    prop: "pre_etl_sys_ids",
    span: 18,
    type: "select",
    options: [],
    disabled: false,
    multiple: true,
    placeholder: "请选择",
  },
  {
    label: "工程依赖是否有效",
    prop: "status",
    span: 18,
    type: "select",
    options: [],
    disabled: false,
    placeholder: "",
  },
  {
    label: "工程描述",
    prop: "comments",
    span: 18,
    type: "textarea",
    disabled: false,
    placeholder: "工程描述",
  },
];

export const ModeFromRules = {
  etl_sys_cd: vm.filter_rules([{ required: true }]),
  etl_sys_name: vm.filter_rules([{ required: true }]),
  status: rule.selected,
};

export const formDeployConfig = {
  ref: "formDeploy",
  labelWidth: "150px",
};

export const formDeployItems = [
  {
    label: "工程编号",
    prop: "etl_sys_cd",
    type: "input",
    span: 18,
    disabled: true,
  },
  {
    label: "Agent服务器IP",
    prop: "etl_serv_ip",
    type: "input",
    span: 18,
  },
  {
    label: "Agent服务器用户名",
    prop: "user_name",
    type: "input",
    span: 18,
  },
  {
    label: "Agent服务器密码",
    prop: "user_pwd",
    type: "password",
    span: 18,
  },
  ,
  {
    label: "Agent服务器部署目录",
    prop: "isCustomize",
    type: "switch",
    activeValue: "1",
    inactiveValue: "0",
    activeColor: "#13ce66",
    inactiveColor: "#ff4949",
    inactiveText: "系统默认",
    activeText: "自定义",
    span: 18,
  },
  {
    label: "Agent服务器部署路径",
    prop: "serv_file_path",
    type: "input",
    span: 18,
  },
];

export const formDeploy = {
  etl_sys_id:"",
  etl_sys_cd: "",
  etl_serv_ip: "",
  user_name: "",
  user_pwd: "",
  serv_file_path: "",
};
// export const formDeployRules = {
//   etl_sys_cd: vm.filter_rules([{ required: true }]),
//   etl_serv_ip: vm.filter_rules([{ required: true }]),
//   user_name: vm.filter_rules([{ required: true }]),
//   user_pwd: vm.filter_rules([{ required: true }]),
//   serv_file_path: vm.filter_rules([{ required: true }]),
// };

export const controlLogConfig = {
  labelWidth: "100px",
  inline: true,
  class: "demo-form-inline",
};

export const controlLogIntems = [
  {
    label: "日志行数",
    prop: "readNum",
    type: "input",
  },
  {
    label: "默认显示100行，最多显示1000行(正整数)",
    prop: "",
    placement: "right",
    type: "cascader",
  },
];
export const TABLEDATA = [
  {
    curr_bath_date: "20230629",
    etl_sys_cd: "11111",
    etl_sys_name: "ceshis",
    comments: "ceshi",
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20221218",
    etl_sys_cd: "A123",
    etl_sys_name: "A123",
    comments: null,
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20230329",
    etl_sys_cd: "dtest",
    etl_sys_name: "采集测试",
    comments: "不要动",
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20220303",
    etl_sys_cd: "gc0303",
    etl_sys_name: "gc0303",
    comments: null,
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20230721",
    etl_sys_cd: "HL_1",
    etl_sys_name: "HL_1",
    comments: "HL_1",
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20230726",
    etl_sys_cd: "HL_2",
    etl_sys_name: "HL_2",
    comments: "TEST",
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20230726",
    etl_sys_cd: "HL_3",
    etl_sys_name: "HL_3",
    comments: "TEST",
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20230401",
    etl_sys_cd: "hll",
    etl_sys_name: "hll",
    comments: null,
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20230616",
    etl_sys_cd: "hltest",
    etl_sys_name: "hltest",
    comments: null,
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20230602",
    etl_sys_cd: "import",
    etl_sys_name: "测试数据文件导入工程",
    comments: null,
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20220926",
    etl_sys_cd: "lqcs",
    etl_sys_name: "测试",
    comments: null,
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20220901",
    etl_sys_cd: "qd",
    etl_sys_name: "青岛测试工程",
    comments: null,
    sys_run_status: "E",
  },
  {
    curr_bath_date: "20230525",
    etl_sys_cd: "S01",
    etl_sys_name: "测试",
    comments: null,
    sys_run_status: "E",
  },
  {
    curr_bath_date: "20230523",
    etl_sys_cd: "S02",
    etl_sys_name: "加工",
    comments: null,
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20230524",
    etl_sys_cd: "S03",
    etl_sys_name: "加工",
    comments: null,
    sys_run_status: "S",
  },
  {
    curr_bath_date: "20220828",
    etl_sys_cd: "Y02",
    etl_sys_name: "采集ql",
    comments: "comments-ql",
    sys_run_status: "S",
  },
];

export const quickFromItme = [
  {
    label: "表名",
    prop: "tableName",
    type: "input",
  },
]


export const formStartCONItem = [
  {
    label: "工程编号",
    prop: "etl_sys_cd",
    type: "input",
    span: 18,
    disabled: true,
  },
  {
    label: "是否续跑",
    prop: "isResumeRun",
    type: "radio",
    options: [],
    span: 18,
  },
  {
    label: "是否日切",
    prop: "isAutoShift",
    type: "radio",
    options: [],
    span: 18,
    radioChange: "isAutoShift",
  },
  {
    label: "当前批量日期",
    prop: "curr_bath_date",
    type: "date",
    span: 18,
    disabled: true,
  },
  {
    label: "当前批量结束日期",
    prop: "sys_end_date",
    type: "date",
    conceal: 'false',
    span: 18,
    disabled: true,
    valueFormat: "yyyyMMdd"
  },
]
export const formStartCONConfig = {
  ref: "formstart",
  labelWidth: "150px",
};

export const formStartCONRules= {
  etl_sys_cd: [{ required: true, message: "请输入工程编号", trigger: "blur" }],
  curr_bath_date: [{ required: true, message: "请选择当前批量日期", trigger: "blur" }],
}
export const formStartTRIItem = [
  {
    label: "工程编号",
    prop: "etl_sys_cd",
    type: "input",
    span: 18,
    disabled: true,
  },
]
export const formStartTRIConfig = {
  ref: "formStartTRI",
  labelWidth: "150px",
};


export const formDeployItem = [
  {
    label: "工程编号",
    prop: "etl_sys_cd",
    type: "input",
    span: 18,
    disabled: true,
  },
  {
    label: "Agent服务器IP",
    prop: "etl_serv_ip",
    type: "input",
    span: 18,
    disabled: false,
  },
  {
    label: "Agent服务器用户名",
    prop: "user_name",
    type: "input",
    span: 18,
    disabled: false,
  },
  {
    label: "Agent服务器密码",
    prop: "user_pwd",
    type: "password",
    span: 18,
    disabled: false,
  },
  {
    label: "Agent服务器部署目录",
    prop: "isCustomize",
    type: "switch",
    activeColor: '#13ce66',
    activeText: '自定义',
    activeValue: '1',
    inactiveText: '系统默认',
    inactiveValue: '0',
    inactiveColor: '#ff4949',
    span: 18,
    disabled: false,
  },
  {
    label: "Agent服务器部署路径",
    prop: "serv_file_path",
    type: "input",
    span: 18,
    conceal: 'false',
    disabled: false,
  },
]

export const formDeployConfig111 = {
  ref: "formDeployConfig111",
  labelWidth: "180px",
};

export const formDeployRules= {
  etl_sys_cd: [{ required: true, message: "请输入工程编号", trigger: "blur" }],
  etl_serv_ip: [{ required: true, message: "请输入Agent服务器IP", trigger: "blur" }],
  user_name: [{ required: true, message: "请输入Agent服务器用户名", trigger: "blur" }],
  user_pwd: [{ required: true, message: "请输入Agent服务器密码", trigger: "blur" }],
  serv_file_path: [{ required: true, message: "请输入Agent服务器部署路径", trigger: "blur" }],
}
