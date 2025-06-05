import request from "./request";
import store from "@/store";

/**
 * POST 请求，参数通过 URL 传递，不进行自动拼接
 * @example url = /sys/user/getAllUser
 * 那么最终的请求地址 = /sys/user/getAllUser
 * @param {String} url : 请求全路径
 * @param {JSON} params : 请求参数
 */
export function execGetByFullUrl(url, params) {
  return request({
    url: checkPreFixDelimiter(url),
    params: params,
    method: "POST",
  });
}
/**
 * POST 请求，参数通过 RequestBody 传递，不进行自动拼接
 * @example url = /sys/user/getAllUser
 * 那么最终的请求地址 = /sys/user/getAllUser
 * @param {String} url : 请求全路径
 * @param {JSON} body : 请求参数
 */
export function execPostByFullUrl(url, body) {
  return request({
    url: checkPreFixDelimiter(url),
    body: body,
    method: "POST",
  });
}


/**
 * POST 请求，参数通过 URL 传递，自动拼接 getway
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
 * POST 请求，参数通过 RequestBody 传递，自动拼接 getway
 * @example url = /sys/user/getAllUser
 * @example getGateWayPrefix() = /hyren-gateway
 * 那么最终的请求地址 = /hyren-gateway/sys/user/getAllUser , 后端方法中需要添加对应的@RequestBody注解
 * @param {String} url : 请求全路径
 * @param {JSON} data : 请求参数
 */
export function execPostByUrl(url, data) {
  return request({
    url: getGateWayPrefix() + checkPreFixDelimiter(url),
    data: data,
    method: "POST",
  });
}


/**
 * POST 请求，参数通过 URL 传递，自动拼接 getway、模块
 * @example url = /getAllUser 或者 url = getAllUser
 * @example getGateWayPrefix() = /hyren-gateway
 * @example 模块 = /H
 * 那么最终的请求地址 = /hyren-gateway/H/getAllUser, 后端方法中需要添加对应的@RequestBody注解
 * @param {String} url : 请求接口
 * @param {JSON} params : 请求参数
 */
export function execGetByModulName(url, params) {
  return request({
    url: getGateWayPrefix() + getModulePrefix() + checkPreFixDelimiter(url),
    params: params,
    method: "POST",
  });
}
/**
 * POST 请求，参数通过 RequestBody 传递，自动拼接 getway、模块
 * @example url = /getAllUser 或者 url = getAllUser
 * @example getGateWayPrefix() = /hyren-gateway
 * @example 模块 = /H
 * 那么最终的请求地址 = /hyren-gateway/sys/user/getAllUser, 后端方法中需要添加对应的@RequestBody注解
 * @param {String} url : 请求接口
 * @param {JSON} params : 请求参数
 */
export function execPostByModulName(url, params) {
  return request({
    url: getGateWayPrefix() + getModulePrefix() + checkPreFixDelimiter(url),
    data: params,
    method: "POST",
  });
}


/**
 * POST 请求，参数通过 RequestBody 传递，自动拼接 getway、模块、目录
 * @example url = /getAllUser 或者 url = getAllUser
 * @example getGateWayPrefix() = /hyren-gateway
 * @example 当前请求所在目录 = /sys/user
 * 那么最终的请求地址 = /hyren-gateway/sys/user/getAllUser, 后端方法中需要添加对应的@RequestBody注解
 * @param {String} url : 请求接口
 * @param {JSON} params : 请求参数
 */
export function execGetByModulMenuName(url, params) {
  return request({
    url: getGateWayPrefix() + getModuleMenuPrefix() + checkPreFixDelimiter(url),
    params: params,
    method: "POST",
  });
}

/**
 * POST 请求，参数通过 RequestBody 传递，自动拼接 getway、模块、目录
 * @example url = /getAllUser 或者 url = getAllUser
 * @example getGateWayPrefix() = /hyren-gateway
 * @example 当前请求所在目录 = /sys/user
 * 那么最终的请求地址 = /hyren-gateway/sys/user/getAllUser, 后端方法中需要添加对应的@RequestBody注解
 * @param {String} url : 请求接口
 * @param {JSON} params : 请求参数
 */
export function execPostByModulMenuName(url, params) {
  return request({
    url: getGateWayPrefix() + getModuleMenuPrefix() + checkPreFixDelimiter(url),
    data: params,
    method: "POST",
  });
}



/**
 * 文件下载，参数通过 url 传递，自动拼接 getway
 * @param url : 请求地址
 * @param params : 请求参数
 * @return  返回下文件的下载流
 */
export function downloadFile(url, params) {
  return request({
    url: getGateWayPrefix() + checkPreFixDelimiter(url),
    params: params,
    method: "POST",
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
/**
 *  上传文件，参数通过 RequestBody 传递，自动拼接 getway
 * 	let param = new FormData() // 创建form对象
 *  param.append('file', this.fileList[0].raw);
 *  param.append('field_key_name', param);
 *  @param url : 请求地址
 * 	@param params : 请求参数
 */
export function uploadFile(url, params) {
  return request({
    url: getGateWayPrefix() + checkPreFixDelimiter(url),
    method: "post",
    data: params,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * 文件下载，参数通过 url 传递，自动拼接 getway、模块
 * @param url : 请求地址
 * @param params : 请求参数
 * @return  返回下文件的下载流
 */
export function downloadModuleFile(url, params) {
  return request({
    url: getGateWayPrefix() + getModulePrefix() + checkPreFixDelimiter(url),
    params: params,
    method: "POST",
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
/**
 *  上传文件，参数通过 RequestBody 传递，自动拼接 getway、模块
 * 	let param = new FormData() // 创建form对象
 *  param.append('file', this.fileList[0].raw);
 *  param.append('field_key_name', param);
 *  @param url : 请求地址
 * 	@param params : 请求参数
 */
export function uploadModuleFile(url, params) {
  return request({
    url: getGateWayPrefix() + getModulePrefix() + checkPreFixDelimiter(url),
    method: "post",
    data: params,
    headers: { "Content-Type": "multipart/form-data" },
  });
}


/**
 * 文件下载，参数通过 url 传递，自动拼接 getway、模块、目录
 * @param url : 请求地址
 * @param params : 请求参数
 * @return  返回下文件的下载流
 */
export function downloadModulMenuFile(url, params) {
  return request({
    url: getGateWayPrefix() + getModuleMenuPrefix() + checkPreFixDelimiter(url),
    params: params,
    method: "POST",
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
/**
 *  上传文件，参数通过 RequestBody 传递，自动拼接 getway、模块、目录
 * 	let param = new FormData() // 创建form对象
 *  param.append('file', this.fileList[0].raw);
 *  param.append('field_key_name', param);
 *  @param url : 请求地址
 * 	@param params : 请求参数
 */
export function uploadModulMenuFile(url, params) {
  return request({
    url: getGateWayPrefix() + getModuleMenuPrefix() + checkPreFixDelimiter(url),
    method: "post",
    data: params,
    headers: { "Content-Type": "multipart/form-data" },
  });
}










/**
 * 如果请求接口名称未设置'/'则拼接一个
 * @param {接口名称} url 
 * @returns 
 */
export function checkPreFixDelimiter(url) {
  //如果请求接口名称未设置'/'则拼接一个
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  return url;
}
/**
 * 获取gateway的服务信息 /hyren-gateway
 * @returns 返回gateway的服务信息
 */
export function getGateWayPrefix() {
  return store.getters.getGatewayServiceName;
}

/**
 * 获取当前请求路径的地址路径信息 /H/{{目录}}
 * @returns 返回当前请求路径的地址路径信息
 */
export function getModelNamePrefix() {
  return store.getters.getModelNameAndFuncName;
}

/**
 *  获取模块前缀 /H
 *
 * @returns {string} 返回菜单路由
 */
export function getModulePrefix() {
  // 当前页面路由
  let modelNamePrefix = store.getters.getModelNameAndFuncName;
  //如果请求接口名称未设置'/'则拼接一个
  if (!modelNamePrefix.startsWith("/")) {
      modelNamePrefix = "/" + modelNamePrefix;
  }
  // 分隔路由
  const splice = modelNamePrefix.split("/");
  // 菜单路由 如：/B
  let modulePath = "";
  if (splice.length > 0) {
      modulePath = "/" + splice[1]
  }
  return modulePath;
}

/**
 *  获取菜单路由 /H/{{目录}}
 *
 * @returns {string} 返回菜单路由
 */
export function getModuleMenuPrefix() {
    // 当前页面路由
    let modelNamePrefix = store.getters.getModelNameAndFuncName;
    //如果请求接口名称未设置'/'则拼接一个
    if (!modelNamePrefix.startsWith("/")) {
        modelNamePrefix = "/" + modelNamePrefix;
    }
    // 分隔路由
    const splice = modelNamePrefix.split("/");
    // 菜单路由 如：/B/batchCollection
    let modulePath = "";
    if (splice.length > 1) {
        modulePath = "/" + splice[1] + "/" + splice[2]
    } else {
        if (splice.length > 0) {
            modulePath = "/" + splice[1]
        }
    }
    return modulePath;
}
