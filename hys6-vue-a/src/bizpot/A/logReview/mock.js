import Vue from "vue";
import * as validator from "@/utils/validator";
const rule = validator.default;
var vm = new Vue();
const columnArr = [
    { label: "序号", type: "index", width: "70" },
    { label: "浏览器类型", prop: "browser_type", type: "text", minWidth: "120" },
    { label: "浏览器版本", prop: "browser_version", type: "text", minWidth: "120" },
    { label: "系统类型", prop: "system_type", type: "text", minWidth: "120" },
    { label: "登陆 IP", prop: "remoteaddr", type: "text", minWidth: "120" },
    { label: "传输协议版本", prop: "protocol", type: "text", minWidth: "120" },
    { label: "请求日期", prop: "request_date", type: "text", minWidth: "120" },
    { label: "请求时间", prop: "request_time", type: "text", minWidth: "120" },
    { label: "用户ID", prop: "user_id", type: "text", minWidth: "120" },
    { label: "用户名称", prop: "user_name", type: "text", minWidth: "120" },
    { label: "操作内容", prop: "operation_type", type: "text", minWidth: "120" },
];
const modelFormItems = [
    {
        prop: "user_id",
        label: "用户ID",
        placeholder: "请输入用户ID",
        type: "input",
    },
    {
        prop: "request_date",
        label: "请求日期",
        placeholder: "请输入请求日期",
        type: "selectDate",
    },
];

export {
    columnArr,
    modelFormItems,
};
