/**
 *  一进入页面  发送ajax请求  获取当前用户的扥估状态
 *      1.如果当前用户登录了 让用户继续访问
 *      2.如果当前用户没登录   将用户拦截到登录页
 */
$.ajax({
    type: 'get',
    url: '/employee/checkRootLogin',
    dataType: 'json',
    success: function (info) {
        if (info.error === 400) {
            //  拦截到登录页
            location.href = "login.html"
        } if (info.success) {
            // 登录成功
            console.log("登录成功");
        }

    }
})