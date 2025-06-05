

export const columnArr=[
	{label : "数据源名称", prop : "dsl_name" ,type : "text", align : "center"},
	{label : "类型", prop : "api_type" ,type : "text", align : "center"},
	{label : "接口中午名称", prop : "api_cn_name" ,type : "text", align : "center"},
	{label : "接口名称", prop : "api_name" ,type : "text", align : "center"},
	{label : "表名", prop : "table_name" ,type : "text", align : "center"},
	{label : "接口IP", prop : "api_ip" ,type : "text", align : "center"},
	{label : "接口端口", prop : "api_port" ,type : "text", align : "center"},
	{label : "创建时间", prop : "create_time" ,type : "text", align : "center"},
	{label : "接口描述", prop : "api_remarks" ,type : "text", align : "center"},
	{label : "状态", prop : "status" ,type : "text", align : "center"},
	{
		label : "操作",
		type : "operate",
		align : "center",
		width : "150px",
		operateArr : [
			{
				label : "编辑",
				type : "edit",
				hide : row =>{
					if (row.status == '有效'){
						return true;
					} else {
						return false;
					}
				}
			},
			{
				label : "详情",
				type : "details",
			},
			{
				label : "删除",
				type : "delete",
				hide : row => {
					if (row.status == '有效'){
						return true;
					} else {
						return false;
					}
				}
			}
		]

	},
]