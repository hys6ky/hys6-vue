
export const columnArr = [
    { prop: "etl_sys_cd", type: "input", disabled: true, label: "任务编号" ,minWidth:'280'},
    { prop: "start_number", type: "input", label: "作业失败重试次数" ,minWidth:'280'},
    { prop: "start_interval", type: "input", label: "作业失败重试间隔(单位为秒)" ,minWidth:'280',
        content: '关于作业执行失败后自动重试的处理方式: 当工程中所有作业都执行结束后，对执行失败的作业进行自动重试，其重试次数为XX，且间隔XX秒开始启动重试'},
    { prop: "eer_remark", type: "input", label: "备注" ,minWidth:'280'},
]