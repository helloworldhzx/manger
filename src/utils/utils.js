const utils = {
  formateDate(date, fmt = "yyyy-MM-DD HH:mm:ss") {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear())
    }
    var o = {
      "M+": date.getMonth() + 1,
      "D+": date.getDate(),
      "H+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds()
    }
    for (var k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const val = o[k] + '';
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length))
      }
    }
    return fmt;
  }
}

export default utils