/**重置message，防止重复点击重复弹出message弹框 */
import {
    Message
} from 'element-ui';
// 为了实现Class的私有属性
const showMessage = Symbol('showMessage')
let messageInstance = null;
/** 
 *  重写ElementUI的Message
 *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
 */
class DoneMessage {
    [showMessage](type, options, single) {
        if (messageInstance && single) {
            if (document.getElementsByClassName('el-message').length === 0) {
                messageInstance = Message[type](options)
            }
            else {
                this.close()
                messageInstance = Message[type](options)
            }
        } else {
            messageInstance = Message[type](options)
        }
    }
    info(options, single = true) {
        if (typeof options === 'string') {
            options = { message: options, duration: 0, showClose: true }
        }
        this[showMessage]('info', options, single)
    }
    warning(options, single = true) {
        if (typeof options === 'string') {
            options = { message: options, duration: 0, showClose: true }
        }
        this[showMessage]('warning', options, single)
    }
    error(options, single = true) {
        if (typeof options === 'string') {
            options = { message: options, duration: 0, showClose: true }
        }
        this[showMessage]('error', options, single)
    }
    success(options, single = true) {
        if (typeof options === 'string') {
            options = { message: options, duration: 0, showClose: true }
        }
        this[showMessage]('success', options, single)
    }
    close() {
        if (messageInstance) {
            messageInstance.close()
            messageInstance = null
        }
    }
}
export const resetMessage = new DoneMessage();