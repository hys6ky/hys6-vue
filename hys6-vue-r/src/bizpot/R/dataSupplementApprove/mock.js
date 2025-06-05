/**
 * <b>录入审批首页</b>
 * @type {[{prop: string, width: string, label: string, type: string},{prop: string, options: *[], label: string, type: string},{prop: string, options: *[], label: string, type: string},{prop: string, label: string, type: string}]}
 */
export const formItems=[
	{label : "项目名称", prop : "proName", type : "input",width : "220"},
	{label : "补录类型", prop : "dfType", type : "select", options : []},
	{label : "审批类型", prop : "dfAppState", type : "select", options : []},
	{label : "提交时间", prop : "submitDate", type : "daterange"},
]

export const extraButton = [
	{label : "通过"},
	{label : "拒绝"},
]

export const columnArr = [
	{type : "selection", width : "55"},
	{label : "项目名称", prop : "pro_name" , type : "text", align:'center'},
	{label : "补录类型", prop : "type" , type : "text", align:'center'},
	{label : "提交人", prop : "submit_user" , type : "text", align:'center'},
	{label : "提交时间", prop : "submit_date" , type : "text", align:'center'},
	{label : "审批状态", prop : "state" , type : "text", align:'center'},
	{label : "补录数量", prop : "table_count" , type : "text", align:'center'},
	{
		label : "操作",
		type : "operate",
		operateArr:[
			{label : "查看" , type : "view"},
			{
				label : "通过" ,
				type : "pass",
				hide : row =>{
					if (row.submit_state == 1){
						return true;
					} else {
						return false;
					}
				}
			},
			{
				label : "拒绝" ,
				type : "refuse",
				hide : row =>{
					if (row.submit_state == 1){
						return true;
					} else {
						return false;
					}
				}
			},
		]
	},
]

export const ModelFormItems = [
	{label : "审批意见", prop : "audit_opinion",type : "input"},
	{label : "备注", prop : "audit_remarks",type : "textarea"}
]

export const formConfig = [
	{ref : "dialogFormRules"}
]

// export const formRules = {
// 	audit_opinion : vm.filter_rules([
// 		{required:true,message:'请输入审批意见',trigger:'blur'},
// 		{max:512,message:'不得超过 512 个字符',trigger:'blur'},
// 	]),
// 	audit_remarks : vm.filter_rules([
// 		{max:512,message:'不得超过 512 个字符',trigger:'blur'},
// 	])
// }



export const applyFormItems = [
	{label : "表单名称", prop : "formName",type : "input"},
	{label : "状态", prop : "status",type : "select", options : [
			{
				value: 1,
				label: '已同步'
			}, {
				value: 0,
				label: '未同步'
			}
		]}
]

export const applyColumnArr = [
	{type : "selection",width :"55"},
	{label : "表英文名" ,prop : "hyren_name", type : "text",align :"center"},
	{label : "部门" ,prop : "dep_name", type : "text",align :"center"},
	{label : "创建人" ,prop : "user_name", type : "text",align :"center"},
	{label : "创建时间" ,prop : "create_date", type : "text",align :"center"},
	{label : "最后更新时间" ,prop : "update_date", type : "text",align :"center"},
	{label : "状态" ,prop : "sync", type : "text",align :"center"},
	{
		label : "操作",
		type : "operate",
		operateArr :[
			{
				label : "查看",
				type : "view",
			}
		]
	}
]