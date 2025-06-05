import Vue from "vue";
import * as validator from "@/utils/validator";
const rule = validator.default;
var vm = new Vue();
const columnArr = [
  { label: "序号", type: "index", width: "70"},
  { label: "用户登录账号", prop: "user_id", type: "text"},
  { label: "创建用户名", prop: "user_name", type: "text"},
  { label: "创建时间", prop: "create_date", type: "text"},
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
const modelFormItems = [
  {
    prop: "dep_id",
    label: "所属部门",
    placeholder: "请选择所属部门",
    type: "select",
    span: 24,
    options: [],
  },
  {
    prop: "role_id",
    label: "选择角色",
    placeholder: "请选择角色",
    type: "select",
    span: 24,
    options: [],
  },
  {
    prop: "limitmultilogin",
    label: "多人在线",
    type: "switch",
    span: 24,
    activeColor: "#ff4949",
    inactiveColor: "#13ce66",
    activeText: "不允许",
    inactiveText: "允许",
    activeValue: "0",
    inactiveValue: "1",
  },
  {
    prop: "user_name",
    label: "用户名",
    placeholder: "请输入用户名",
    type: "input",
    span: 24,
  },
  {
    prop: "user_password",
    label: "密码",
    placeholder: "请输入密码",
    type: "password",
    span: 24,
  },
  {
    prop: "user_email",
    label: "邮箱",
    placeholder: "请输入邮箱",
    type: "input",
    span: 24,
  },
  {
    prop: "user_mobile",
    label: "联系电话",
    placeholder: "请输入联系电话",
    type: "input",
    span: 24,
  },
  {
    prop: "user_remark",
    label: "用户信息描述",
    placeholder: "备注",
    type: "textarea",
    span: 24,
  },
];
const modelFormConfig = {
  labelWidth: "130px",
  inline: false,
  ref: "userManagementForm",
};
const modelFormData = {
  dep_id: "",
  role_id: "",
  limitmultilogin: "",
  user_name: "",
  user_password: "",
  user_email: "",
  user_mobile: "",
  user_remark: "",
};
const modelFormRules = {
  dep_id: rule.selected,
  role_id: rule.selected,
  limitmultilogin: rule.selected,
  user_name: vm.filter_rules([{ required: true }]),
  user_password: vm.filter_rules([{ required: true, dataType: "password" }]),
  user_email: vm.filter_rules([{ required: true, dataType: "email" }]),
  user_mobile: vm.filter_rules([{ required: true, dataType: "mobilePhone" }]),
};
export {
  columnArr,
  modelFormItems,
  modelFormConfig,
  modelFormRules,
  modelFormData,
};
