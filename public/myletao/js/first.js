$(function () {
    var currentPage = 1
    var pageSize = 5

    render()

    function render() {
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                var htmlStr = template('ftpl', info)
                $('tbody').html(htmlStr)

                //  根据返回的数据 完成分页标签初始化
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),

                    onPageClicked: function (a, b, c, page) {
                        currentPage = page
                        render()
                    }
                })
            }
        })
    }


    //  添加按钮 button 注册点击事件 显示模态框
    $('#addBtn').click(function () {
        $('#addModal').modal('show')
    })
    // 调用表单校验插件 完成校验
    $('#form').bootstrapValidator({
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', // 校验成功
            invalid: 'glyphicon glyphicon-remove', // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },
        // 校验字段     先给input设置name
        fields: {
            categoryName: {
                // 校验规则
                validators: {
                    // 非空
                    notEmpty: {
                        // 提示信息
                        message: "请输入一级分类名称"
                    }
                }
            }
        }
    })
    // 阻止默认的提交 通过ajax提交
    $('#form').on('success.form.bv',function (e) {
        // 阻止默认的提交
        e.preventDefault()
        console.log(1);
        // 发送ajax
        $.ajax({
            type:'post',
             url: "/category/addTopCategory",
            data:$('#form').serialize(),
            dataType:'json',
            success:function  (info) {
                console.log(info)
                if( info.success ){
                    // 关闭模态框
                    $('#addModal').modal('hide')

                    currentPage = 1
                    render()

                        //  重置表单状态     true  重置表单状态和内容
                    $('#form').data("bootstrapValidator").resetForm(true)
                }
            }
        })
    })

})