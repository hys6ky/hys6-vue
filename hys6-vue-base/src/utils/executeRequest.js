import request from "./request";
import store from "@/store";

/**
 * 自定义GET请求方式
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execGetByUrl(url, params) {
  return request({
    url: checkPreFixDelimiter(url),
    params: params,
    method: "GET",
  });
}

/**
 * 自定义POST请求方式
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execByUrl(url, params) {
  return request({
    url: store.getters.getGatewayServiceName + checkPreFixDelimiter(url),
    params: params,
    method: "POST",
  });
}
export function useExecByUrl(url, params) {
  return request({
    url: checkPreFixDelimiter(url),
    data: params,
    method: "POST",
  });
}

export function Url(url, params) {
  return request({
    url: checkPreFixDelimiter(url),
    params: params,
    method: "POST",
  });
}

/**
 * 自定义POST上传文件请求方式
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execUploadByUrl(url, params) {
  return request({
    url: checkPreFixDelimiter(url),
    data: params,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function Request(url) {
  return request({
    url: url,
    method: "POST",
  });
}

/**
 * 自定义POST下载请求方式
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execDownloadByUrl(url, params) {
  return request({
    url: checkPreFixDelimiter(url),
    responseType: "blob",
    method: "post",
    params: params,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 自定义GET请求方式
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execGetCustomizMappingUrl(url, params) {
  return request({
    url: getCustomizPath() + checkPreFixDelimiter(url),
    params: params,
    method: "GET",
  });
}

/**
 * 自定义GET请求方式
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execGetByControllerMappingUrl(url, params) {
  return request({
    url: getRequestPathPrefix() + checkPreFixDelimiter(url),
    params: params,
    method: "GET",
  });
}

/**
 * 默认的提交方式 POST
 * @param {String} controllerMappingName : 后端ControllerMapping值
 * @param {JSON} params : 请求参数
 * @returns 请求后端返回的数据
 */
export function execByControllerMappingUrl(controllerMappingName, params) {
  // 使用指定的提交方式来进行提交
  return request({
    url: getRequestPathPrefix() + checkPreFixDelimiter(controllerMappingName),
    params: params,
    method: "POST",
  });
}

/**
 * 使用post的方式将实体数组数据提交到后台请使用此方法
 * @param {String} controllerMappingName : 后端ControllerMapping值
 * @param {JSON} params : 请求参数
 * @returns 请求后端返回的数据
 */
export function useDataExecByControllerMappingUrl(
  controllerMappingName,
  params
) {
  // 使用指定的提交方式来进行提交
  return request({
    url: getRequestPathPrefix() + checkPreFixDelimiter(controllerMappingName),
    data: params,
    method: "POST",
  });
}

/**
 * 自定义POST上传文件请求方式
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execUploadByControllerMappingUrl(url, params) {
  return request({
    url: getRequestPathPrefix() + checkPreFixDelimiter(url),
    data: params,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * 自定义POST下载请求方式
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execDownloadByControllerMappingUrl(url, params) {
  return request({
    url: checkPreFixDelimiter(url),
    responseType: "blob",
    method: "post",
    params: params,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function checkPreFixDelimiter(url) {
  //如果请求接口名称未设置'/'则拼接一个
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  return url;
}

/**
 * 请求路径的前缀
 * @returns 返回请求前缀地址信息
 */
export function getRequestPathPrefix() {
  return getCustomizPath() + store.getters.getModelNameAndFuncName;
}

/**
 * 请求路径的前缀
 * @returns 返回请求前缀地址信息
 */
export function getCustomizPath() {
  return store.getters.getGatewayServiceName;
}
