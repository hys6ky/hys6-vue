/**
 * @param {Object} data 返回的数据
 * @param {String} fileName 设置的文件名称
 */
export function fileDownload(data, fileName) {
    const blob = new Blob([data]);
    if (window.navigator.msSaveOrOpenBlob) {
        // 兼容IE10
        navigator.msSaveBlob(blob, fileName);
    } else {
        //  chrome/firefox
        let aTag = document.createElement("a");
        // document.body.appendChild(aTag);
        aTag.download = fileName;
        aTag.href = URL.createObjectURL(blob);
        if (aTag.all) {
            aTag.click();
        } else {
            //  兼容firefox
            const evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, true);
            aTag.dispatchEvent(evt);
        }
        URL.revokeObjectURL(aTag.href);
    }
}
