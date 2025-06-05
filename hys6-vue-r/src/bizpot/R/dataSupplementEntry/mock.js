/**
 * <b>index页面配置项</b>
 * @type {[{prop: string, label: string, placeholder: string, type: string},{prop: string, options: *[], label: string, type: string}]}
 */
export const formItems=[
	{label : "项目名称",prop:"pro_name",type:"input",placeholder:"请输入项目名称"},
	{label : "补录类型",prop:"df_type",type:"select",options:[]}
]
export const button=[
	{label : "新增"}
]
export const columnArr=[
	{label:"序号",width:"70",type:"index"},
	{label:"项目名称",prop:"pro_name",type:"text",align:"center"},
	{label:"补录类型",prop:"type",type:"text",align:"center"},
	{label:"提交时间",prop:"submit_date",width:"200px",type:"text",align:"center"},
	{label:"状态",prop:"state",type:"text",align:"center"},
	{label:"补录数量",prop:"number",type:"text",align:"center"},
	{
		label:"操作",
		width:"190px",
		type:"operate",
		align:"center",
		operateArr:[
			{
				label:"编辑",
				type : "edit",
				hide : row =>{
					if (row.submit_state != '1'){
						return true;
					} else {
						return false;
					}
				}
			},
			{
				label:"删除",
				type : "delete",
				hide : row =>{
					if (row.submit_state != '1'){
						return true;
					} else {
						return false;
					}
				}
			},
			{
				label:"提交",
				type : "submit",
				hide : row =>{
					if (row.submit_state !== '1' && row.number !== 0){
						return true;
					} else {
						return false;
					}
				}
			},
			{
				label:"撤销",
				type : "rollback",
				hide : row =>{
					if (row.submit_state == '1' && row.number !== 0){
						return true;
					} else {
						return false;
					}
				}
			},
			{
				label:"查看",
				type : "view",
			}
		]
	},
]

export const formConfig={
	ref : "form",
	labelWidth : "100px"
}

export const ModelFromItems=[
	{label : "项目名称", prop : "pro_name",type :"input"},
	{
		label : "补录类型",
		prop : "df_type",
		type :"select",
		options : []
	},
	{
		label : "选择数据源",
		prop : "dsl_id",
		type :"select",
		options : []
	},
	{label : "备注", prop : "df_remarks",type :"textarea"},
]

/**
 * dataSheet页面配置数据
 * @type {[{prop: string, width: string, label: string, placeholder: string, type: string},{prop: string, width: string, label: string, placeholder: string, type: string},{prop: string, label: string, placeholder: string, type: string},{prop: string, label: string, placeholder: string, type: string}]}
 */
export const dataSheetFormItems=[
	{label :"表单名称",prop : "tableName",type : "input",placeholder : "请输入表单名称",width:"300"},
	{label :"创建人",prop : "createUserId",type : "input",placeholder : "请输入创建人",width:"300"},
	{label :"创建时间",prop : "createDate",type : "date",placeholder : "选择日期"},
	{label :"更新时间",prop : "updateDate",type : "date",placeholder : "选择日期"},
]

export const dataSheetExtraButton=[
	{label : "新增"}
]

export const dataSheetColumnArr=[
	{label : "序号", type : "index",width : "70"},
	{label : "表中文名", prop : "table_ch_name",type : "text",align : "center"},
	{label : "表英文名", prop : "table_name",type : "text",align : "center"},
	{label : "部门", prop : "dep_name",type : "text",align : "center"},
	{label : "创建人", prop : "user_name",type : "text",align : "center"},
	{label : "创建时间", prop : "create_date",type : "text",align : "center"},
	{label : "最后更新时间", prop : "update_date",type : "text",align : "center"},
	{label : "状态", prop : "rec",type : "text",align : "center"},
	{
		label : "操作",
		type : "operate",
		operateArr : [
			{
				label : "查看",
				type : "view"
			},
			{
				label : "导出",
				type : "export"
			},
			{
				label : "删除",
				type : "delete",
				hide : row =>{
					if (row.submit_state ==='0' || row.submit_state === '3'){
						return true;
					} else {
						return false;
					}
				}
			}
		]
	}
]


/**
 * <b>补录页配置<b/>
 * @type {[{}]}
 */
export const insertSheetFormItems = [
	{label :"表单名称",prop : "tableName",type : "input",placeholder : "请输入表单名称"},
]

export const insertSheetColumnArr = [
	{label : "序号", type : "index",width : "70"},
	{label : "表中文名", prop : "table_ch_name",type : "text",align : "center"},
	{label : "表英文名", prop : "table_name",type : "text",align : "center"},
	{label : "是否补录", prop : "rec",type : "text",align : "center"},
	{
		label : "数据预览",
		type : "operate",
		operateArr : [
			{
				label : "预览",
				type : "Preview"
			}
		]
	},
	{
		label : "数据导出",
		type : "operate",
		operateArr : [
			{
				label : "导出",
				type : "export"
			}
		]
	},
	{
		label : "操作",
		type : "operate",
		operateArr : [
			{
				label : "查看",
				type : "view",
				hide : row =>{
					if (row.is_rec == '1'){
						return true;
					}else {
						return false;
					}
				}
			},
			{
				label : "编辑",
				type : "edit",
				hide : row =>{
					if (row.is_rec == '1'){
						return true;
					}else {
						return false;
					}
				}
			},
			{
				label : "数据补录",
				type : "record",
				hide : row =>{
					if (row.is_rec !== 1){
						return true;
					}else {
						return false;
					}
				}
			}
		]
	},
]

