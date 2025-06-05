/**
 * 同步首页面
 * @type {[{prop: string, label: string, placeholder: string, type: string},{prop: string, options: *[], label: string, type: string},{prop: string, label: string, type: string}]}
 */
export const formItems=[
	{label : "项目名称", prop:"proName",type : "input", placeholder : ""},
	{label : "补录类型", prop:"dfType",type : "select", options:[]},
	{label : "提交时间", prop:"submitDate",type : "daterange"},
]

export const columnArr=[
	{label :"序号",type : "index",align:'center',width : "70"},
	{label :"项目名称",prop : "pro_name",type : "text",align:'center'},
	{label :"补录类型",prop : "df_type",type : "text",align:'center'},
	{label :"提交人",prop : "submit_user",type : "text",align:'center'},
	{label :"提交时间",prop : "formatDate",type : "text",align:'center'},
	{label :"补录数量",prop : "table_count",type : "text",align:'center'},
	{
		label :"操作",
		type : "operate",
		operateArr :[
			{label: "操作",type : "edit"}
		]
	},
]


export const syncFormItems=[
	{label : "表单名称" , prop : "formName",type : "input"},
	{label : "状态" , prop : "status",type : "select",options : [
			{
				value: 1,
				label: '已同步'
			}, {
				value: 0,
				label: '未同步'
			}
		]},
]

export const synchColumnArr = [
	{label:"序号",type: "index",align : "center",width : "70"},
	{label : "表英文名", prop:"hyren_name",type: "text",align : "center"},
	{label : "部门", prop:"dep_name",type: "text",align : "center"},
	{label : "创建人", prop:"user_name",type: "text",align : "center"},
	{label : "创建时间", prop:"create_date",type: "text",align : "center"},
	{label : "最后更新时间", prop:"update_date",type: "text",align : "center"},
	{label : "状态", prop:"sync",type: "text",align : "center"},
	{
		label : "操作",
		type : "operate",
		operateArr : [
			{
				label : "查看" ,
				type : "view",
			},
			{
				label : "同步" ,
				type : "synch",
				hide : row => {
					if (row.is_sync == 0){
						return true;
					} else {
						return false;
					}
				}
			},
			{
				label : "回滚" ,
				type : "rollback",
				hide : row => {
					if (row.is_sync == 1){
						return true;
					} else {
						return false;
					}
				}
			}
		]
	}
]