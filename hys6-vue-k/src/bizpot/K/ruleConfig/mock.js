import Vue from "vue";
var vm = new Vue();
export const formItems = [
    {
        prop: 'reg_num',
        label: '规则编号',
        type: 'input',
    },
    {
        prop: 'reg_name',
        label: '规则名称',
        type: 'input',
    },
    {
        prop: 'case_type',
        label: '规则类型',
        type: 'select',
        multiple: true,
        options: [],
    },
    {
        prop: 'rule_tag',
        label: '规则标签',
        type: 'input',
    },
    {
        prop: 'rule_src',
        label: '规则来源',
        type: 'input',
    },
    {
        prop: 'target_tab',
        label: '目标表名',
        type: 'input',
    },
    {
        prop: 'job_status',
        label: '调度状态',
        type: 'select',
        multiple: true,
        options: [],
    },
]


export const columnArr = [
    { prop: "tag", type: "selection", width: "70", align: "center" },
    { label: "序号", type: "index", width: "80", align: "center" },
    { prop: "reg_num", type: "text",minWidth:'180',  label: "规则编号" },
    { prop: "reg_name", type: "text",minWidth:'120',  label: "规则名称" },
    { prop: "case_type_name", type: "text",minWidth:'120',  label: "规则类型" },
    { prop: "rule_tag", type: "text",minWidth:'120',  label: "规则标签" },
    { prop: "rule_src", type: "text",minWidth:'120',  label: "规则来源" },
    { prop: "target_tab", type: "text",minWidth:'120',  label: "目标表名" },
    { prop: "job_status_name", type: "text",minWidth:'120',  label: "调度状态" },
    { prop: "app_updt_dt", type: "date",minWidth:'120',  label: "修改日期" },
    { prop: "app_updt_ti", type: "time",minWidth:'120',  label: "修改时间" },
    {
        type: "operate",
        label: "操作",
        width: "300px",
        operateArr: [
            { label: "手工执行", type: "manual_execution_click" },
            { label: "编辑", type: "edit" },
            { label: "查看调度状态", type: "viewRuleSchedulingStatus" },
            { label: "删除", type: "del" },
            { label: "发布", type: "releaseTrigger" },
        ],
    },
]
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
        change: "changeBatchDate",
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
export const taskConfigRule = {
    etl_sys_id: [{ required: true, message: "请选择工程！", trigger: "blur" }],
    sub_sys_id: [
        { required: true, message: "请选择工程子系统！", trigger: "blur" },
    ],
    pro_dic: [{ required: true, message: "程序目录不能为空！", trigger: "blur" }],
    log_dic: [{ required: true, message: "日志目录不能为空！", trigger: "blur" }],
    // etl_job_desc: [
    //   { required: true, message: "描述不能为空！", trigger: "blur" },
    // ],
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
    etl_job_desc: [
        { required: true, message: "描述不能为空！", trigger: "blur" },
    ],
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


export const issueFromItem = [
    {
        prop: 'etl_sys_id',
        label: '选择工程',
        type: 'selectLabel',
        change: 'getSubSysCd',
        span: 18,
        options:[],
    },
    {
        prop: 'sub_sys_id',
        label: '选择任务',
        type: 'selectLabel',
        span: 18,
        options:[],
    },
]
export const subSysFormConfig = {
    labelWidth: "130px",
    inline: false,
    ref: "checkForm",
};

export const subSysFormRules = {
    etl_sys_cd: { required: true, message: "该输入项为必填项", trigger: "blur" },
    sub_sys_cd: { required: true, message: "该输入项为必填项", trigger: "blur" },
    sub_sys_desc: {
        required: true,
        message: "该输入项为必填项",
        trigger: "blur",
    },
};
export const issueFromRules ={
    etl_sys_id:[{required:true,message:'请选择工程',trigger:'blur'}],
    sub_sys_id:[{required:true,message:'请选择任务',trigger:'blur'}],

}
export const issueFromConfig ={
    labelWidth: "140px",
    inline: false,
    ref: "issueFromConfig",
}

export const tableColumn= [
    { label: "序号", type: "index", width: "80", align: "center" },
    { prop: "etl_sys_id", type: "text",minWidth:'180',  label: "工程编号" },
    { prop: "sub_sys_id", type: "text",minWidth:'120',  label: "任务编号" },
    { prop: "etl_job", type: "text",minWidth:'120',  label: "作业名" },
    { prop: "job_eff_flag_name", type: "text",minWidth:'120',  label: "作业有效标志" },
    { prop: "job_disp_status_name", type: "text",minWidth:'120',  label: "作业调度状态" },
    { prop: "reg_num", type: "text",minWidth:'120',  label: "规则编号" },
    { prop: "case_type", type: "text",minWidth:'120',  label: "规则类型" },
    { prop: "target_tab", type: "date",minWidth:'120',  label: "目标表名" },
]
