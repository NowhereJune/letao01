$(function () {

    /**
     * 1.进行表单校验配置
     *      校验要求
     *         (1) 用户名不能为空 长度为2-6位
     *         (2) 密码不能为空 长度为6-12位
     *  */


    $('#form').bootstrapValidator({
        //  指定校验时候的图标显示 默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //  配置校验字段 需要先给input框配置name
        fields: {
            // 指定校验字段
            username: {
                // 配置校验规则
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '用户名长度必须在2到6之间'
                    },
                    callback:{
                        message:'用户名不存在'
                    },
                }
            },
            password: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码长度必须在6到12位之间'
                    },
                     callback: {
                         message: "密码错误"
                     }
                }
            }
        }

    })

    /**
     * 2.注册表单校验成功事件，在校验成功时，会触发
     *  在事件中阻止默认的提交（会跳转），通过ajax进行提交（异步）
     */
    $('#form').on('success.form.bv', function (e) {
        //  阻止默认的提交
        e.preventDefault();

        //通过ajax提交
        $.ajax({
            type: "post",
            url: '/employee/employeeLogin',
            data: $('#form').serialize(), // 表单序列化
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.success) {
                    location.href = 'index.html';
                }
                if (info.error === 1000) {
                    //  调用实例的更新校验方法
                    //  参数1：字段名称 
                    // 参数2 ： 校验状态 NOT_VALIDATED： 未校验的 VALIDATING： 校验中的  INVALID： 校验失败的  VALID： 校验成功的。

                    $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback')
                }
                if (info.error === 1001) {
                    $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback")
                }
            },
        })
    })

    /**
     * 3,表单重置功能
     * $('#form').data("bootstrapValidator") 创建插件实例
     * resetFrom() 没传参数或者传false 只会重置校验状态
     * resetForm(true) 内容和校验状态都重置
     * 
     * 由于reset按钮 本身就可以重置内容 所以上面两个都可以 需要的是重置状态
     */
    $('.btn1').click(function () {
        $('#form').data("bootstrapValidator").resetForm();
    })
})