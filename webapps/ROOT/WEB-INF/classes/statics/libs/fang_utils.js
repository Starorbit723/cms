
// 设置cookie
var setCookie = function (name, value, days) {
  let exp = new Date()
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000) 
  //document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ";path=/;domain=b.com";
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ";path=/";
}

//读取cookie
var getCookie = function (name) { 
  var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
  return v ? unescape(v[2]) : null
} 

//删除cookie
var deletCookie = function (name) { 
  let exp = new Date()
  exp.setTime(exp.getTime() - 1) 
  let cval = getCookie(name)
  if (cval !== null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ";path=/";
  }     
}
