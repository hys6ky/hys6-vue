import request from "./request";
import store from "@/store";

/**
 * 自定义GET请求方式, 用来跨模块请求,需要保证服务都是通过GateWay进行请求的操作,
 * @example url = /sys/user/getAllUser
 * @example getGateWayPrefix() = /hyren-gateway
 * 那么最终的请求地址 = /hyren-gateway/sys/user/getAllUser
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execGetByUrl(url, params) {
  return request({
    url: getGateWayPrefix() + checkPreFixDelimiter(url),
    params: params,
    method: "POST",
  });
}
/**
 * 自定义GET请求方式, 用来跨模块请求,需要保证服务都是通过GateWay进行请求的操作,
 * @example url = /sys/{id}
 * @example getGateWayPrefix() = /hyren-gateway
 * 那么最终的请求地址 = /hyren-gateway/sys/{id}
 * @param {String} url : 请求全路径
 */
export function execGetByUrlParams(url) {
  return request({
    url: getGateWayPrefix() + getModelNamePrefix() + url,
    method: "GET",
  });
}

/**
 * 自定义POST请求方式,用来跨模块请求, 需要保证服务都是通过GateWay进行请求的操作
 * @example url = /sys/user/getAllUser
 * @example getGateWayPrefix() = /hyren-gateway
 * 那么最终的请求地址 = /hyren-gateway/sys/user/getAllUser , 后端方法中需要添加对应的@RequestBody注解
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execPostByUrl(url, params) {
  return request({
    url: getGateWayPrefix() + getModelNamePrefix(),
    data: params,
    method: "POST",
  });
}

/**
 * 根据用户提供的全路径请求,来进行GET提交
 * @example url = /sys/user/getAllUser
 * 那么最终的请求地址 = /sys/user/getAllUser
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execByUrlFullPathRequest(url, params) {
  return request({
    url: checkPreFixDelimiter(url),
    params: params,
    method: "POST",
  });
}

/**
 * 根据用户提供的全路径请求,来进行POST提交
 * @example url = /sys/user/getAllUser
 * 那么最终的请求地址 = /sys/user/getAllUser ,后端方法中需要添加对应的@RequestBody注解
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execPostByUrlFullPathRequest(url, params) {
  return request({
    url: checkPreFixDelimiter(url),
    data: params,
    method: "POST",
  });
}

/**
 * 默认GET提交方式
 * @example controllerMappingName = /getAllUser 或者 url = getAllUser
 * @example getGateWayPrefix() = /hyren-gateway
 * @example 当前请求所在目录 = /sys/user
 * 那么最终的请求地址 = /hyren-gateway/sys/user/getAllUser
 * @param {String} controllerMappingName : 后端ControllerMapping值
 * @param {JSON} params : 请求参数
 * @returns 请求后端返回的数据
 */
export function execByControllerMappingName(controllerMappingName, params) {
  // 使用指定的提交方式来进行提交
  return request({
    url: getGateWayPrefix() + checkPreFixDelimiter(controllerMappingName),
    params: params,
    method: "POST",
  });
}

export function execGetByControllerMappingName(controllerMappingName, params) {
  // 使用指定的提交方式来进行提交
  return request({
    url: getRequestPathPrefix() + checkPreFixDelimiter(controllerMappingName),
    params: params,
    method: "GET",
  });
}

export function execGetByControllerMapping(controllerMappingName, params) {
  // 使用指定的提交方式来进行提交
  return request({
    url: getGateWayPrefix() + controllerMappingName,
    params: params,
    method: "GET",
  });
}
export function execPostByControllerMapping(controllerMappingName, params) {
  // 使用指定的提交方式来进行提交
  return request({
    url: getGateWayPrefix() + controllerMappingName,
    params: params,
    method: "POST",
  });
}
/**
 * 默认GET提交方式
 * @example controllerMappingName = /getAllUser 或者 url = getAllUser
 * @example getGateWayPrefix() = /hyren-gateway
 * @example 当前请求所在目录 = /sys/user
 * 那么最终的请求地址 = /hyren-gateway/sys/user/getAllUser
 * @param {String} controllerMappingName : 后端ControllerMapping值
 * @param {JSON} params : 请求参数
 * @returns 请求后端返回的数据
 */
export function execDeleteByControllerMappingName(
  controllerMappingName,
  params
) {
  // 使用指定的提交方式来进行提交
  return request({
    url: getRequestPathPrefix() + checkPreFixDelimiter(controllerMappingName),
    params: params,
    method: "DELETE",
  });
}

/**
 * POST请求方式
 * @example url = /getAllUser 或者 url = getAllUser
 * @example getGateWayPrefix() = /hyren-gateway
 * @example 当前请求所在目录 = /sys/user
 * 那么最终的请求地址 = /hyren-gateway/sys/user/getAllUser, 后端方法中需要添加对应的@RequestBody注解
 * @param {String} url : 请求接口
 * @param {JSON} params : 请求参数
 */
export function execPostByControllerMappingName(url, params) {
  return request({
    url: getRequestPathPrefix() + checkPreFixDelimiter(url),
    data: params,
    method: "POST",
  });
}

/**
 * DELETE请求方式
 * @example url = /getAllUser 或者 url = getAllUser
 * @example getGateWayPrefix() = /hyren-gateway
 * @example 当前请求所在目录 = /sys/user
 * 那么最终的请求地址 = /hyren-gateway/sys/user/getAllUser, 后端方法中需要添加对应的@RequestBody注解
 * @param {String} url : 请求接口
 * @param {JSON} params : 请求参数
 */
export function execDelByControllerMappingName(url, params) {
  return request({
    url: getRequestPathPrefix() + checkPreFixDelimiter(url),
    data: params,
    method: "DELETE",
  });
}
// 全路径请求方式
export function execDelByControllerAllMappingName(url, params) {
  return request({
    url: getGateWayPrefix() + checkPreFixDelimiter(url),
    data: params,
    method: "DELETE",
  });
}
export function execPostByControllerAllMappingName(url, params) {
  return request({
    url: getGateWayPrefix() + checkPreFixDelimiter(url),
    data: params,
    method: "POST",
  });
}

export function execPostByControllerAllMappingNameParams(url, params) {
  return request({
    url: getGateWayPrefix() + checkPreFixDelimiter(url),
    params: params,
    method: "POST",
  });
}
export function execGetByControllerAllMappingName(url, params) {
  return request({
    url: getGateWayPrefix() + checkPreFixDelimiter(url),
    params: params,
    method: "GET",
  });
}
export function execPutByControllerAllMappingName(url, params) {
  return request({
    url: getGateWayPrefix() + checkPreFixDelimiter(url),
    data: params,
    method: "PUT",
  });
}

/**
 * PUT请求方式
 * @example url = /getAllUser 或者 url = getAllUser
 * @example getGateWayPrefix() = /hyren-gateway
 * @example 当前请求所在目录 = /sys/user
 * 那么最终的请求地址 = /hyren-gateway/sys/user/getAllUser, 后端方法中需要添加对应的@RequestBody注解
 * @param {String} url : 请求接口
 * @param {JSON} params : 请求参数
 */
export function execPutByControllerMappingName(url, params) {
  return request({
    url: getRequestPathPrefix() + checkPreFixDelimiter(url),
    data: params,
    method: "PUT",
  });
}

/**
 * 文件下载
 * @param url : 请求地址
 * @param params : 请求参数
 * @return  返回下文件的下载流
 */
export function downloadFile(url, params) {
  return request({
    url: getRequestPathPrefix() + checkPreFixDelimiter(url),
    params: params,
    responseType: "blob",
  });
}

/**
 *  上传文件
 * 	@example
 * 	let param = new FormData() // 创建form对象
 *  param.append('file', this.fileList[0].raw);
 *  param.append('field_key_name', param);
 *  @param url : 请求地址
 * 	@param params : 请求参数
 */
export function uploadFile(url, params) {
  return request({
    url: getRequestPathPrefix() + checkPreFixDelimiter(url),
    method: "post",
    data: params,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * FormData的数据提交方式
 * @param url : 请求地址
 * @param params : 请求参数
 * @returns
 */
export function saveBatchData(url, params) {
  return request({
    url: "/spdbank/batch/saveBatchData",
    data: params,
    headers: { "Content-Type": "multipart/form-data" },
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
  return getGateWayPrefix() + getModelNamePrefix();
}

/**
 * 获取gateway的服务信息
 * @returns 返回gateway的服务信息
 */
export function getGateWayPrefix() {
  return store.getters.getGatewayServiceName;
}

/**
 * 获取当前请求路径的地址路径信息
 * @returns 返回当前请求路径的地址路径信息
 */
export function getModelNamePrefix() {
  return store.getters.getModelNameAndFuncName;
}
