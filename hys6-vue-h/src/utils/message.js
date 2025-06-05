import { MessageBox } from "element-ui";
const restMsg = require("@/utils/resetMessage");
const success = "success";
const duration = 3000;
/**
 *
 * @param {Object} data 更新请求处理后的信息
 */
export function updateSuccess(data) {
  if (data && data.success) {
    restMsg.resetMessage[success]({
      message: "更新成功",
      type: "success",
      duration: duration,
      showClose: true,
    });
  }
}

/**
 *
 * @param {Object} data 删除请求处理后的信息
 */
export function deleteSuccess(data) {
  if (data && data.success) {
    restMsg.resetMessage[success]({
      message: "删除成功",
      type: "success",
      duration: duration,
      showClose: true,
    });
  }
}
/**
 *
 * @param {Object} data 保存请求处理后的信息
 */
export function saveSuccess(data) {
  if (data && data.success) {
    restMsg.resetMessage[success]({
      message: "保存成功",
      type: "success",
      duration: duration,
      showClose: true,
    });
  }
}

/**
 *
 * @param {String} message : 操作完成提示的消息
 * @param {String} type : 提示消息的类型(success,warning,error)
 */
export function customizTitle(message, type) {
  let itemType = typeof type != "undefined" ? type : "success";
  restMsg.resetMessage[itemType]({
    message: message,
    dangerouslyUseHTMLString: true,
    duration: duration,
    showClose: true,
  });
}

/**
 *
 * @param {String} titleMsg : 提示的消息
 */
export function confirmMsg(titleMsg) {
  return MessageBox.confirm(titleMsg, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
}

/**
 *
 * @param {Object} data 发布请求处理后的信息
 */
export function issueSuccess(data) {
  if (data && data.success) {
    restMsg.resetMessage[success]({
      message: "发布成功",
      duration: duration,
      showClose: true,
    });
  }
}
export function sendSuccess(data) {
  if (data && data.success) {
    restMsg.resetMessage[success]({
      message: "发送成功",
      duration: duration,
      showClose: true,
    });
  }
}
