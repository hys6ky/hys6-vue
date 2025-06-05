









const taskCols = [
	{label : "序号", type : "index", width : "70", align : "center"},
	{label : "Agent名称", prop : "agent_name", type : "text", align : "center"},
	{label : "Agent部署主机IP", prop : "agent_ip", type : "text", align : "center"},
	{label : "采集任务名", prop : "fcs_name", type : "text", align : "center"},
	{label : "任务创建日期", prop : "create_date", type : "text", align : "center"},
	{label : "采集创建日期", prop : "create_time", type : "text", align : "center"},
	{
		label : "操作",
		type : "operate",
		align : "center",
		operateArr : [
			{label : "OCR跑批",type : "ocr",}
		]
	}
]

export  {
	taskCols
}