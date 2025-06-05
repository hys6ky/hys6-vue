// 年月日转换
export function dateFormat(data){
    data = data.trim()
    if (data === "" || "undefined" === typeof data) return ""
    let year = data.substring(0, 4);
    let month = data.substring(4, 6);
    let day = data.substring(6, 8);
    return year + "-" + month + "-" + day
}

// 时分秒转换
export function hourFormat(data){
    data = data.trim()
    if (data === "" || "undefined" === typeof data) return ""
    let hour = data.substring(0, 2);
    let minutes = data.substring(2, 4);
    let seconds = data.substring(4, 6);
    return hour + ":" + minutes + ":" + seconds
}

// 处理后台传来的日期年月日时分秒在一起
export function dateToMilldate(date){
    date = date.trim().replace(/\s*/g, "")
    let year = date.substring(0, 4);
    let month = date.substring(4, 6);
    let day = date.substring(6, 8);
    let timeh = date.substring(8, 10);
    let timem = date.substring(10, 12)
    let times = date.substring(12, 14)
    return year + "-" + month + "-" + day + " " + timeh + ":" + timem + ":" + times;
}