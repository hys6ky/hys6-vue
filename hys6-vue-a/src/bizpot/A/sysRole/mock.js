import Vue from "vue";
import * as validator from "@/utils/validator";
const rule = validator.default;
var vm = new Vue();
const columnArr = [
  { label: "序号", type: "index", width: "70" },
  { label: "角色名称", prop: "role_name", type: "text", width: "150" },
  { label: "角色菜单", prop: "role_menu", type: "text", minWidth: "120" },
  {
    type: "operate",
    label: "操作",
    width: "160px",
    operateArr: [
      {
        label: "编辑",
        type: "edit",
      },
      {
        label: "删除",
        type: "delete",
      },
    ],
  },
];
const roleModelFormItems = [
  {
    prop: "is_admin",
    label: "角色类型",
    type: "radio",
    span: 24,
    options: [
      {
        label: "管理员",
        value: "01",
      },
      {
        label: "操作员",
        value: "02",
      },
    ],
  },
  {
    prop: "role_name",
    label: "角色名",
    placeholder: "请输入用户名",
    type: "input",
    span: 24,
  },
  {
    prop: "role_remark",
    label: "角色信息描述",
    placeholder: "备注",
    type: "textarea",
    span: 24,
  },
];
const roleModelFormConfig = {
  labelWidth: "130px",
  inline: false,
  ref: "roleManagementForm",
  width: "600",
};
const roleModelFormRules = {
  is_admin: rule.selected,
  role_name: vm.filter_rules([{ required: true }]),
};
const roleModelFormData = {
  is_admin: "01",
  role_id: "",
  role_remark: "",
};


const modelFromItems = [
  {
    label :"角色类型",
    // span : 24,
    prop : "is_admin",
    type : "radio",
    options :[
      {value : "01",label : "管理员"},
      {value : "02",label : "操作员"}
    ]
  },{
    label : "角色名",
    prop : "role_name",
    type : "input",
    placeholder : "请输入用户名"
  },{
    label : "备注",
    prop : "role_remark",
    type : "textarea",
    placeholder : "备注"
  }
]
const modelFromConfig = {
  ref: "form",
  labelWidth : "160px",
  width : "500"
}

const modelFromRules = {
  is_admin : rule.selected,
  role_name : vm.filter_rules([{ required: true }]),

}

const tableColumns = [
  {type : "selection",width : "60"},
  {label : "菜单名称", prop : "menu_name", type : "text",minWidth : "190"},
  {label : "菜单编号", prop : "menu_id", type : "text",minWidth : "180"},
  {label : "菜单路径", prop : "menu_path", type : "text",minWidth : "180"},
  {label : "菜单类型", prop : "menu_type", type : "text",minWidth : "180"},
  {label : "组件编号", prop : "comp_id", type : "text",minWidth : "180",fixed:"right"},
]



export {
  columnArr,
  roleModelFormItems,
  roleModelFormConfig,
  roleModelFormRules,
  roleModelFormData,
  modelFromItems,
  modelFromConfig,
  modelFromRules,
  tableColumns,
};
