import Vue from "vue";
var vm = new Vue();


const codeColumns =[
	{label : "序号", type : "index", width : "70"},
	{label : "编码分类",prop : "code_classify", type : "text"},
	{label : "编码分类名称", prop : "code_classify_name",type : "text"},
	{label : "编码名称" , prop : "code_type_name", type : "text"},
	{label : "编码值", prop : "code_value", type :"text"},
	{
		label : "操作",
		width : "200",
		type : "operate",
		operateArr :[
			{label : "编辑", type : "edit"},
			{label : "删除", type : "del"}
		]
	}
]

const origColumns = [
	{label : "序号", type : "index", width : "80", align : "center"},
	{label : "源系统编码", prop : "orig_sys_code", type : "link", align : "center"},
	{label : "源系统名称", prop : "orig_sys_name", type : "text", align : "center"},
	{label : "描述", prop : "orig_sys_remark", type : "text", align : "center"}
]

const scoureColumns = [
	{label : "序号", type : "index", width : "62", align : "center"},
	{label : "编码分类" , prop : "code_classify" , type : "text", align : "center"},
	{label : "编码分类名称" , prop : "code_classify_name" , type : "text", align : "center"},
	{label : "编码名称" , prop : "code_type_name" , type : "text", align : "center"},
	{label : "编码值" , prop : "code_value" , type : "text", align : "center"},
	{label : "源系统编码值" , prop : "orig_value" , type : "input", align : "center", placeholder : "源系统编码值"},
	{
		label : "操作" ,
		type : "operate",
		align : "center",
		width : "160",
		operateArr :[
			{
				label : "编辑",
				type : "edit",
				hide:row => {
					if(row.show){
						return true;
					}else{
						return false;
					}
				},
			},
			{label : "删除", type : "del"}
		]
	}
]

const formConfig={
	ref : "formScoure",
	labelWidth : "140px"
}

const formItems = [
	{label : "源系统编码", prop : "orig_sys_code", type : "input", span : 24, placeholder : "源系统编码"},
	{label : "源系统名称", prop : "orig_sys_name", type : "input", span : 24, placeholder : "源系统名称"},
	{label : "描述", prop : "orig_sys_remark", type : "input", span : 24, placeholder : "描述"},
]

const formRules = {
	orig_sys_code : vm.filter_rules([{ required: true }]),
	orig_sys_name : vm.filter_rules([{ required: true }]),

}

const oneConfig = {
	ref :"form",
	labelWidth : "140px"
}

const twoConfig = {
	ref :"formUpdate",
	labelWidth : "140px"
}

const threeConfig ={
	ref :"formScoureRef",
	labelWidth : "140px"
}

const oneFormItems = [
	{label : "编码分类", prop : "code_classify", type : "input", span : 12, placeholder : "编码分类"},
	{label : "编码分类名称", prop : "code_classify_name", type : "input", span : 12, placeholder : "编码分类名称"},
	{label : "备注", prop : "code_remark", type : "input", span : 12, placeholder : "描述"},
]

const twoFromItems = [
	{label : "编码分类", prop : "code_classify", type : "input", span : 12, placeholder : "编码分类"},
	{label : "编码分类名称", prop : "code_classify_name", type : "input", span : 12, placeholder : "编码分类名称"},
	{label : "备注", prop : "code_remark", type : "input", span : 12, placeholder : "描述"},
]
const threeFromItems = [
	{label : "编码分类", prop : "code_classify", type : "input", span : 12, placeholder : "编码分类"},
	{label : "编码分类名称", prop : "code_classify_name", type : "input", span : 12, placeholder : "编码分类名称"},
]

const oneTableCols = [
			{label : "序号", type : "index", width : "70",align : "center"},
			{label : "编码名称", prop : "code_type_name",type : "input",align : "center"},
			{label : "编码值", prop : "code_value",type : "input", align : "center"},
			{
				label : "操作",
				type : "operate",
				width : "100",
				align : "center",
				operateArr : [
					{label : "删除", type : "delete"}
				]
			},
]

const twoTableCols = [
	{label : "序号", type : "index", width : "70",align : "center"},
	{label : "编码名称", prop : "code_type_name",type : "input",align : "center"},
	{label : "编码值", prop : "code_value",type : "input", align : "center"},
	{
		label : "操作",
		type : "operate",
		width : "100",
		align : "center",
		operateArr : [
			{label : "删除", type : "delete"}
		]
	},
]

const threeTableCols = [
	{label : "编码名称", prop: "code_type_name", type : "text",align : "center"},
	{label : "编码值", prop : "code_value",type : "text",align : "center"},
	{label : "源系统编码值", prop : "orig_value",type : "input", align : "center"},
]



const oneFormRules = {
	code_classify : vm.filter_rules([{ required: true }]),
	code_classify_name : vm.filter_rules([{ required: true }]),
	code_type_name : vm.filter_rules([{ required: true }]),
	code_value : vm.filter_rules([{ required: true }]),

}

const threeFormRules = {
	code_classify : vm.filter_rules([{ required: true }]),
	code_classify_name : vm.filter_rules([{ required: true }])

}


export {
	codeColumns,
	origColumns,
	scoureColumns,
	formConfig,
	formItems,
	formRules,
	oneConfig,
	oneFormItems,
	oneFormRules,
	oneTableCols,
	twoConfig,
	twoFromItems,
	twoTableCols,
	threeConfig,
	threeFromItems,
	threeFormRules,
	threeTableCols
}