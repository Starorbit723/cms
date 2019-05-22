// var cockTimer = ''
// vm.$notify({
//     title: '提示',
//     dangerouslyUseHTMLString: true,
//     message: '<strong>这是 <i>HTML</i> 片段</strong>'
// });
// cockTimer = setInterval(function () {
//     console.log(111)                     
    
// }, 2000)


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

//时间格式转化
var transformTime = function(timestamp = +new Date()) {
    if (timestamp) {
        var time = new Date(timestamp);
        var y = time.getFullYear();
        var M = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var m = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + addZero(M) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(m) + ':' + addZero(s);
      } else {
          return '';
      }
}
var addZero = function(m) {
    return m < 10 ? '0' + m : m;
}


var pageId = vm.$el.id
console.log('当前页面ID=======>',pageId)

switch(pageId)
{
    case 'edit_article':
        setCookie ('createditreport', '', 1)
        setCookie ('createditfastinfo', '', 1)
        break;
    case 'edit_report':
        setCookie ('createdit', '', 1)
        setCookie ('createditfastinfo', '', 1)
        break;
    case 'edit_fastinfo':
        setCookie ('createdit', '', 1)
        setCookie ('createditreport', '', 1)
        break;
    default:
        setCookie ('createdit', '', 1)
        setCookie ('createditreport', '', 1)
        setCookie ('createditfastinfo', '', 1)
}

var mapErrorStatus = function(res){
    switch(res.code)
    {
        case 7001:
        vm.$message.error('登录已过期');
        setCookie ('JSESSIONID', '', 1)
        setCookie ('esToken', '', 1)
        setCookie ('userId', '', 1)
        setCookie ('createdit', '', 1)
        setCookie ('createditreport', '', 1)
        setCookie ('createditfastinfo', '', 1)
        window.parent.location.href = '/login.html'
        break;
        default:
        vm.$message.error('系统错误，请联系管理员');
    }
    
}

