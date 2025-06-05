export const tbaleColumn =[
    { prop: "etl_sys_cd", type: "text", label: "工程编号" ,minWidth:'100'},
    { prop: "curr_bath_date", type: "text", label: "批量日期" ,minWidth:'120'},
    { prop: "pending_num", type: "text", label: "挂起" ,minWidth:'120'},
    { prop: "waiting_num", type: "text", label: "等待" ,minWidth:'120'},
    { prop: "running_num", type: "text", label: "运行" ,minWidth:'120'},
    { prop: "done_num", type: "text", label: "完成" ,minWidth:'120'},
    { prop: "alarm_num", type: "text", label: "预警" ,minWidth:'120'},
    { prop: "error_num", type: "text", label: "错误" ,minWidth:'120'},
    { prop: "stop_num", type: "text", label: "停止" ,minWidth:'120'},
    {
        type: "operate",
        label: "操作",
        width: "200",
        operateArr: [
            {label: "暂停", operation: "handlePause" ,type: "icon", class:"el-icon-circle-close handeler ls"},
            {label: "续跑", operation: "handlePlay" ,type: "icon",class:"el-icon-caret-right ls handeler ls"},
            {label: "重跑", operation: "handleRefresh",type: "icon",class:"el-icon-refresh handeler ls"},
            {label: "日切", operation: "handleNext",type: "icon", class:"el-icon-d-arrow-right handeler ls"},
            {label: "停止", operation: "handleStop",type: "icon",class:"el-icon-circle-close handeler ls"},
        ],
    }
]

export const tbaleColumn1 =[
    { prop: "event_id", type: "text", label: "事件号" ,minWidth:'100'},
    { prop: "etl_sys_cd", type: "text", label: "工程编号" ,minWidth:'120'},
    { prop: "etl_job", type: "text", label: "作业名称" ,minWidth:'120'},
    { prop: "types", type: "text", label: "干预类型" ,minWidth:'120'},
    { prop: "pro_para", type: "text", label: "作业程序参数" ,minWidth:'120'},
    { prop: "status", type: "text", label: "状态" ,minWidth:'120'},
    { prop: "st_time", type: "text", label: "接收时间" ,minWidth:'120'},
    { prop: "warning", type: "text", label: "提示信息" ,minWidth:'120'},
]
export const tbaleColumn2 =[
    { prop: "event_id", type: "text", label: "事件号" ,minWidth:'100'},
    { prop: "etl_sys_cd", type: "text", label: "工程编号" ,minWidth:'120'},
    { prop: "etl_job", type: "text", label: "作业名称" ,minWidth:'120'},
    { prop: "types", type: "text", label: "干预类型" ,minWidth:'120'},
    { prop: "pro_para", type: "text", label: "作业程序参数" ,minWidth:'120'},
    { prop: "status", type: "text", label: "状态" ,minWidth:'120'},
    { prop: "st_time", type: "text", label: "接收时间" ,minWidth:'120'},
]