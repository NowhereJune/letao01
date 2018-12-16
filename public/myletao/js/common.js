
//   测试进度条的方法
// NProgress.start(); // 开启进度条


/**
 * 进度条效果
 * 需求 在第一个ajax发送的时候 开启进度条
 *        在全部的ajax回来的时候 关闭进度条
 * 
 * ajax全局事件 
 *      .ajaxComplete() 当每个ajax完成的时候 调用  (不管成不成功)
 *      .ajaxSuccess() 当ajax返回成功是的调用
 *      .ajaxError()    当ajax返回失败时的调用
 *      .ajaxSend()     当ajax发送前调用
 * 
 *      .ajaxStart()       当第一个ajax发送时调用
 *      .ajaxStop()     当全部的ajax请求完成时调用
 */
$(document).ajaxStart(function () {
    //  第一个ajax发送时 开启进度条
    NProgress.start();
    console.log(1);
})

$(document).ajaxStop(function () {
    //这里用延时器模拟网络延迟
    setTimeout(function() {
        NProgress.done()
    }, 500);
})
//  等待页面dom结构加载后执行
// $(function () {
//     // 注册事件完成公共
// })