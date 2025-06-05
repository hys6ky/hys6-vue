import CryptoJS from 'crypto-js'
import request from '@/utils/request'

/**
 * 获取公共的密钥Key
 */
export function getPublicKey() {
    return request({
        url: '/A/login/getPublicKey',
    })
}

/**
 * 获取私有的密钥Key
 */
export function getPrivateKey() {
    return request({
        url: '/A/login/getPrivateKey',
    })
}
const privateKey = "Rko68l71rLiQBRa5";
const publicKey = "525tPh0CM6t5pa5p";
const keyData = {};
export function getKey(){
    getPrivateKey().then(res=>{
        keyData['publicKey'] = res.data;
    })
    
    getPublicKey().then(res=>{
        keyData['privateKey'] = res.data;
    })

    return keyData;
}

/**
 * 
 * @param {Object} data : 加密的数据信息 
 * @returns 返回加密后的数据
 */
export function Encrypt(data) {

    if(!data) {
        return;
    }
    
    // let key = CryptoJS.enc.Utf8.parse(keyData.privateKey);
    // let iv = CryptoJS.enc.Utf8.parse(keyData.publicKey);
    let key = CryptoJS.enc.Utf8.parse(publicKey);
    let iv = CryptoJS.enc.Utf8.parse(privateKey);
    let srcs = CryptoJS.enc.Utf8.parse(data);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

}

var JSONbig = require('json-bigint')({ storeAsString: true });
/**
 * 
 * @param {Object} data : 需要解密的数据信息 
 * @returns 返回解密后的JSON数据
 */
export function DecryptJSON(data) {
    if(!data) {
        return;
    }
    let key = CryptoJS.enc.Utf8.parse(publicKey);
    let iv = CryptoJS.enc.Utf8.parse(privateKey);
    let base64 = CryptoJS.enc.Base64.parse(data);
    let src = CryptoJS.enc.Base64.stringify(base64);
    let decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    let obj = []
    obj['data'] = JSONbig.parse(decryptedStr)
    return obj;
}

/**
 * 
 * @param {Object} data : 需要解密的数据信息 
 * @returns 返回解密后的字符串数据
 */
 export function Decrypt(data) {
    let key = CryptoJS.enc.Utf8.parse(publicKey);
    let iv = CryptoJS.enc.Utf8.parse(privateKey);
    let base64 = CryptoJS.enc.Base64.parse(data);
    let src = CryptoJS.enc.Base64.stringify(base64);
    let decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr;
}