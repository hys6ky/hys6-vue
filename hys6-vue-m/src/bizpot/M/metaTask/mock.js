export const dataSourceColumn = [
  { prop: "tag", type: "selection", width: "70", align: "center" },
  { prop: "dsl_name", type: "text", label: "存储名称", minWidth: "130px" },
  { prop: "dsl_remark", type: "text", label: "备注", minWidth: "130px" },
  {
    prop: "source_name",
    type: "input",
    label: "数据源别名",
    minWidth: "130px",
  },
];

export const dataSourceitem = [
  {
    prop: "source_name",
    label: "数据源名称",
    type: "input",
    span: 19,
  },
];
export const dataSourceConfig = {
  labelWidth: "150px",
  inline: true,
  ref: "dataSource",
};
export const dataSourceRule = {
  source_name: [{ required: true, message: "数据源名称！", trigger: "blur" }],
};

export const taskColumn = [
  { prop: "tag", type: "index", label: "序号", width: "70", align: "center" },
  { prop: "task_name", type: "text", label: "任务名称", minWidth: "130px" },
  {
    prop: "created_dateTime",
    type: "dateTime",
    label: "创建时间",
    minWidth: "130px",
  },
  {
    prop: "lastExecTime",
    type: "dateTime",
    label: "最后执行时间",
    minWidth: "130px",
  },
  { prop: "typeLabel", type: "text", label: "任务类型", minWidth: "130px" },
  {
    prop: "etlStatusValue",
    type: "text",
    label: "是否有作业关联",
    minWidth: "130px",
  },
  {
    type: "operate",
    label: "操作",
    width: "260px",
    operateArr: [
        { label: "立即执行", type: "isRun" },
      { label: "编辑", type: "edit" },
      { label: "删除", type: "del" },
      { label: "生成作业", type: "addJob" },
    ],
  },
];

export const tableColumn = [
  { prop: "tag", type: "selection", width: "70", align: "center" },
  { prop: "en_name", type: "text", label: "英文名", minWidth: "130px" },
  { prop: "ch_name", type: "text", label: "中文名", minWidth: "130px" },
  { prop: "typeLabel", type: "text", label: "类型", minWidth: "130px" },
];
export const quickSearchItem = [
  {
    width: 400,
    prop: "en_name",
    label: "表英文名",
    type: "input",
    placeholder: "多表查询请用|分割",
  },
];
export const taskConfig = {
  labelWidth: "150px",
  inline: true,
  ref: "taskConfig",
};

export const taskFromItem = [
  {
    prop: "task_name",
    label: "采集任务名称",
    type: "input",
    span: 19,
  },
  {
    prop: "task_type",
    label: "采集任务类型",
    type: "select",
    disabled: false,
    options: [
      {
        code: "0",
        value: "0",
        label: "表",
        catValue: "元数据对象类型",
      },
      {
        code: "1",
        value: "1",
        label: "视图",
        catValue: "元数据对象类型",
      },
      {
        code: "2",
        value: "2",
        label: "存储过程",
        catValue: "元数据对象类型",
      },
      {
        code: "3",
        value: "3",
        label: "物化视图",
        catValue: "元数据对象类型",
      },
    ],
    span: 19,
  },
];
export const taskRule = {
  task_name: [{ required: true, message: "不能为空！", trigger: "blur" }],
  task_type: [{ required: true, message: "不能为空！", trigger: "blur" }],
};

export const taskTableColumn = [
  { prop: "tag", type: "selection", width: "70", align: "center" },
  { prop: "en_name", type: "text", label: "英文名", minWidth: "130px" },
  { prop: "ch_name", type: "text", label: "中文名", minWidth: "130px" },
  { prop: "typeLabel", type: "text", label: "类型", minWidth: "130px" },
  {
    type: "operate",
    label: "操作",
    width: "200px",
    operateArr: [{ label: "删除", type: "del" }],
  },
];

// 新增任务
export const taskCheckFromItem = [
  {
    prop: "task_id",
    label: "选中已有任务",
    type: "select",
    options: [],
    span: 19,
  },
];

export const taskTableItem = [
  {
    prop: "source_name",
    label: "元系统名称",
    type: "input",
    span: 7,
    disabled: true,
  },
  {
    prop: "task_name",
    label: "采集任务名称",
    type: "input",
    span: 7,
    disabled: false,
  },
  {
    prop: "task_type",
    label: "采集任务类型",
    type: "select",
    disabled: true,
    options: [
      {
        code: "0",
        value: "0",
        label: "表",
        catValue: "元数据对象类型",
      },
      {
        code: "1",
        value: "1",
        label: "视图",
        catValue: "元数据对象类型",
      },
      {
        code: "2",
        value: "2",
        label: "存储过程",
        catValue: "元数据对象类型",
      },
      {
        code: "3",
        value: "3",
        label: "物化视图",
        catValue: "元数据对象类型",
      },
    ],
    span: 7,
  },
];
export const taskTbaleConfig = {
  labelWidth: "150px",
  inline: true,
  ref: "dataSource",
};

export const taskCheckConfig = {
  labelWidth: "150px",
  inline: true,
  ref: "taskChech",
};

export const taskCheckRule = {
  task_id: [{ required: true, message: "数据源名称！", trigger: "blur" }],
};

export const taskConfigConfig = {
  labelWidth: "150px",
  inline: true,
  ref: "taskChech",
};
export const taskConfigItem = [
  {
    label: "工程编号",
    placeholder: "工程编号",
    prop: "etl_sys_id",
    type: "selectGroup",
    disabled: false,
    change: "etlSysCd",
    conceal: "true",
    span: 8,
    options: [],
  },
  {
    conceal: "true",
    tag: "A",
    prop: "sub_sys_id",
    label: "子系统编号",
    placeholder: "子系统编号",
    type: "selectGroup",
    disabled: false,
    change: "subSysCd",
    span: 8,
    options: [],
  },
  {
    prop: "dispatching_frequency",
    label: "调度频率",
    placeholder: "调度频率",
    type: "select",
    disabled: false,
    span: 8,
    options: [],
  },
  {
    prop: "dispatching_mode",
    label: "调度触发方式",
    placeholder: "调度触发方式",
    type: "selectLabel",
    disabled: false,
    change: "dispFreq",
    span: 8,
    selectChang: "dispFreq",
    options: [],
  },
  {
    prop: "database_pad",
    label: "作业优先级",
    placeholder: "作业优先级",
    type: "input",
    disabled: false,
    span: 8,
    options: [],
  },
  {
    prop: "curr_batch_date",
    tag: "A",
    label: "跑批日期",
    placeholder: "跑批日期",
    type: "selectLabel",
    disabled: false,
    span: 8,
    options: [
      {
        value: "txdate",
        label: "txdate",
        label1: "当前跑批日期",
      },
      {
        value: "txdate_pre",
        label: "txdate_pre",
        label1: "前一天跑批",
      },
      {
        value: "txdate_net",
        label: "txdate_net",
        label1: "后一天跑批",
      },
    ],
  },
  {
    conceal: "false",
    prop: "upstream_operation",
    label: "上游作业",
    placeholder: "上游作业",
    type: "select",
    multiple: true,
    disabled: false,
    span: 8,
    options: [],
  },
  {
    conceal: "false",
    prop: "dispatching_time",
    tag: "A",
    label: "调度触发时间",
    placeholder: "调度触发时间",
    type: "time",
    disabled: false,
    span: 8,
    options: [],
  },
  {
    conceal: "false",
    prop: "dispatching_timedrift",
    tag: "A",
    label: "调度时间位移",
    placeholder: "调度时间位移",
    type: "input",
    disabled: false,
    span: 8,
    options: [],
  },

  {
    prop: "pro_dic",
    tag: "A",
    label: "作业程序目录",
    placeholder: "作业程序目录",
    type: "input",
    disabled: false,
    span: 8,
    options: [],
  },
  {
    prop: "pro_name",
    tag: "A",
    label: "作业程序名称",
    placeholder: "作业程序名称",
    type: "input",
    disabled: true,
    span: 8,
    options: [],
  },
  {
    prop: "log_dic",
    tag: "A",
    label: "采集作业日志目录",
    placeholder: "采集作业日志目录",
    type: "input",
    disabled: false,
    span: 8,
    options: [],
  },
  {
    prop: "etl_job_desc",
    tag: "A",
    label: "描述",
    placeholder: "描述",
    type: "textarea",
    disabled: false,
    span: 19,
    options: [],
  },
];

export const importMetaItem = [
  {
    prop: "file_type",
    label: "文件类型",
    type: "selectLabel",
    change: "fileType",
    span: 20,
    options: [
      {
        code: "0",
        value: "0",
        label: "Excel",
        catValue: "Excel类型",
      },
      {
        code: "1",
        value: "1",
        label: "DDL",
        catValue: "DDL类型",
      },
    ],
  },
];

export const importMetaConfig = {
  labelWidth: "150px",
  inline: true,
  ref: "importMeta",
};

export const taskConfigRule = {
  etl_sys_id: [{ required: true, message: "请选择工程！", trigger: "blur" }],
  sub_sys_id: [
    { required: true, message: "请选择工程子系统！", trigger: "blur" },
  ],
  pro_dic: [{ required: true, message: "程序目录不能为空！", trigger: "blur" }],
  log_dic: [{ required: true, message: "日志目录不能为空！", trigger: "blur" }],
  //   etl_job_desc: [
  //     { required: true, message: "描述不能为空！", trigger: "blur" },
  //   ],
  dispatching_frequency: [
    { required: true, message: "请选择调度频率！", trigger: "blur" },
  ],
  dispatching_mode: [
    { required: true, message: "请选择触发方式！", trigger: "blur" },
  ],
  curr_batch_date: [
    { required: true, message: "请选择跑批日期！", trigger: "blur" },
  ],
  upstream_operation: [
    { required: true, message: "请选择上游作业！", trigger: "blur" },
  ],
  dispatching_time: [
    { required: true, message: "调度触发时间不能为空！", trigger: "blur" },
  ],
};
export const importMetaRule = {
  file_type: [{ required: true, message: "数据源名称！", trigger: "blur" }],
};

export const saveEtlItem = [
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

export const saveEtlConfig = {
  ref: "formAdd",
  labelWidth: "150px",
};

export const saveEtlRule = {
  etl_sys_cd: [
    { required: true, message: "请输入工程编号！", trigger: "blur" },
  ],
  etl_sys_name: [
    { required: true, message: "请输入工程名称！", trigger: "blur" },
  ],
  status: [
    { required: true, message: "请输入工程依赖是否有效！", trigger: "blur" },
  ],
};

export const subSysFormItem = [
  {
    prop: "etl_sys_id",
    label: "工程编号",
    placeholder: "请输入标准工程编号",
    type: "select",
    options: [],
    disabled: true,
    span: 18,
  },
  {
    prop: "sub_sys_cd",
    label: "任务编号",
    placeholder: "请输入标准任务编号",
    type: "input",
    disabled: false,
    span: 18,
  },
  {
    prop: "sub_sys_desc",
    label: "任务名称",
    placeholder: "请输入标准任务名称",
    type: "input",
    disabled: false,
    span: 18,
  },
  {
    prop: "comments",
    label: "备注",
    placeholder: "请输入标准工程编号",
    type: "textarea",
    disabled: false,
    span: 18,
  },
];

export const subSysFormRules = {
  etl_sys_cd: { required: true, message: "该输入项为必填项", trigger: "blur" },
  sub_sys_cd: { required: true, message: "该输入项为必填项", trigger: "blur" },
  sub_sys_desc: {
    required: true,
    message: "该输入项为必填项",
    trigger: "blur",
  },
};

export const subSysFormConfig = {
  labelWidth: "130px",
  inline: false,
  ref: "checkForm",
};

export const checkSourceItem = [
  {
    prop: "source_id",
    label: "系统源名称",
    type: "select",
    options: [],
    disabled: false,
    span: 9,
  },
];

export const checkSourceTable= [
  { prop: "tag", type: "index", label: "序号", width: "70", align: "center" },
  { prop: "metaType", type: "text", label: "元数据类型", minWidth: "130px" },
  { prop: "metaDataNum", type: "textNum", label: "元数据库中元数据数量", minWidth: "130px" },
  { prop: "sourceNum", type: "textNum", label: "数据源中元数据数量", minWidth: "130px" },
  { prop: "metaSame", type: "textNum", label: "元数据一致数量", minWidth: "130px" },
  { prop: "metaAndSourceNoSame", type: "textNum", label: "元数据不一致数量", minWidth: "130px" },
  { prop: "metaRedundanceNum", type: "textNum", label: "多余数量", minWidth: "130px" },
  { prop: "metaMissingNum", type: "textNum", label: "缺失数量", minWidth: "130px" },
  { prop: "metaNoSame", type: "textNum", label: "元数据差异的数量", minWidth: "130px" },
]
