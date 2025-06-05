import Vue from "vue";
var vm = new Vue();

export  const formItems =[
    {
        prop: 'point_name',
        label: '要点名称',
        type: 'input',
    },
    {
        prop: 'task_category',
        label: '适用层级',
        type: 'select',
        options:[]
    },
    {
        prop: 'point_type',
        label: '要点类型',
        type: 'select',
        options:[]
    },
]

export const columnArr =[
    {prop: 'tag', type:'selection',width:'70' , align:"center"},
    {type: 'index',label:'序号',width: '80',align:"center"},
    { prop: 'point_name',type:"text",minWidth: '240', label: '要点名称' },
    { prop: 'task_category_value',type:"text", label: '适用层级',minWidth: '220' },
    { prop: 'point_type_value',type:"text", label: '要点类型',minWidth: '140' },
    { prop: 'created_by',type:"text", label: '创建人',minWidth: '160' },
    { prop: 'created_time',type:"text", label: '创建时间',minWidth: '180' },
    { prop: 'updated_by',type:"text", label: '最后修改人',minWidth: '180' },
    { prop: 'updated_time',type:"text", label: '最后修改时间',minWidth: '180' },
    { type:"operate", label: '操作' ,width:'180px',align:"center",
        operateArr:[
            {label:'编辑',type:'edit'  },
            {label:'删除',type:'del'},
        ],
    },

]


export const formItem = [
    {
        prop: 'point_name',
        label: '要点名称',
        placeholder: '请输入要点名称',
        type: 'input',
        disabled: false,
        span: 11
    },
    {
        prop: 'point_type',
        label: '要点类型',
        placeholder: '请输入要点类型',
        type: 'select',
        disabled: false,
        span: 11,
        options: []

    },
    {
        prop: 'task_category',
        label: '适用任务类型',
        placeholder: '请输入适用任务类型',
        type: 'select',
        disabled: false,
        span: 11,
        options: []
    },
    {
        prop: 'point_proc',
        label: '适用流程',
        placeholder: '请输入适用流程',
        type: 'input',
        disabled: false,
        span: 11
    },
    {
        prop: 'test_sql',
        label: '测试SQL模板',
        placeholder: '请输入测试SQL模板',
        type: 'textarea',
        disabled: false,
        span: 22
    },
    {
        prop: 'point_desc',
        label: '要点描述',
        placeholder: '请输入要点描述',
        type: 'textarea',
        disabled: false,
        span: 22
    },
]

export const  modelFormRules = {
    point_name:[{required:true,message:'请输入要点名称',trigger:'blur'}],
    point_type:[{required:true,message:'请输入要点类型',trigger:'blur'}],
    task_category:[{required:true,message:'请输入适用任务类型',trigger:'blur'}],
    test_sql:[{required:true,message:'请输入测试SQL模板',trigger:'blur'}],
}

export const modelFormConfig = {
    labelWidth: "130px",
    inline: false,
    ref: "formRef",
}