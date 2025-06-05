import Vue from "vue";
var vm = new Vue();
import {TskCategoryEnum } from './index.vue';

export const formItems = [
    {
        prop: 'biz_name',
        label: '业务需求名称',
        type: 'input',
    },
    {
        prop: 'created_time',
        label: '创建时间',
        type: 'date',
    },
    {
        prop: 'owner_name',
        label: '业务需求提出人',
        type: 'input',
    },
    {
        prop: 'dept',
        label: '业务需求提出部门',
        type: 'input',
    },
    {
        prop: 'biz_status',
        label: '业务需求状态',
        type: 'select',
        multiple: true,
        options:[
            // {value:0,label:'待开发'},
            // {value:1,label:'开发中'},
            // {value:2,label:'已完成'},
            // {value:3,label:'已结项'},
        ]
    },
]
    // , align: 'center',headerAlign: 'center'
export const columnArr=[
    {prop: 'tag', type:'selection',width:'70' , align:"center"},
    {type:'index',label:'序号',width: '80',align:"center"},
    { prop: 'biz_name',type:"text", label: '业务需求名称' ,minWidth: '200'},
    { prop: 'biz_desc',type:"text", label: '需求描述',minWidth: '200' },
    { prop: 'owner_name',type:"text", label: '业务需求提出人',minWidth: '140' },
    { prop: 'dept',type:"text", label: '业务需求提出部门',minWidth: '160' },
    { prop: 'online_date',type:"text", label: '期望上线日期',minWidth: '160' },
    { prop: 'data_num',type:"text", label: '数据需求数量',minWidth: '130'  },
    { prop: 'status',type:"text", label: '业务需求状态',minWidth: '130'  },
    { prop: 'created_time',type:"text", label: '创建时间',minWidth: '180' },
    { type:"operate", label: '操作' ,width:'300px',align:"center",
        operateArr:[
            {label:'查看',type:'check'},
            {label:'编辑',type:'edit'  ,hide:(row)=>{
                if (row.biz_status.replaceAll(" ","") == '3' ){
                    return false;
                }else {
                    return true;
                }
            } },
            {label:'删除',type:'del',hide:(row)=>{
                    if (row.biz_status.replaceAll(" ","") == '3'){
                        return false;
                    }else {
                        return true;
                    }
                }},
            {label:'表资源分配',type:'tableResAssign'},
            {label:'需求分解',type:'BizResolve'},
        ],
        more:(row)=>{
            return true
        },
        moreItem:[
            {label:'下载附件',type:'downloadFile',disabled:(row)=>{
                if (row.att_name  && row.att_path){
                    return false;
                }else {
                    return true;
                }
                }},
            {label:'结项',type:'stopState', hide:(row)=>{
                if (row.biz_status.replaceAll(" ","") == '3'){
                    return false;
                }else {
                    return true;
                }
            }},
        ]
    },
]
export const bizConfig = {
    labelWidth: "140px",
    inline: false,
    ref: "formRef",
}
export const bizItems = [
    {
        prop: 'biz_name',
        label: '需求名称',
        placeholder: '请输入需求名称',
        type: 'input',
        disabled: false,
        span: 18
    },
    {
        prop: 'owner_name',
        label: '需求提出人',
        placeholder: '请输入需求提出人',
        type: 'input',
        disabled: false,
        span: 18,
    },
    {
        prop: 'dept',
        label: '需求提出部门',
        placeholder: '请输入需求提出部门',
        type: 'input',
        disabled: false,
        span: 18,
    },
    {
        prop: 'online_date',
        label: '期望上线日期',
        placeholder: '请输入期望上线日期',
        type: 'date',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd',
        disabled: false,
        blur: 'onlineDate',
        span: 18
    },
    {
        prop: 'biz_desc',
        label: '需求简述',
        placeholder: '请输入需求简述',
        type: 'textarea',
        disabled: false,
        rwos: 5,
        span: 18
    },
]



