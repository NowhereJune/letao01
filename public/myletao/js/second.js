$(function () {
    // 1. 发送ajax请求 通过模板引擎渲染
    var currentPage = 1 // 当前页
    var pageSize = 5 // 每一页的条数
    // 一进入页面就加载一次 
    render()

    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                // 模板引擎渲染 
                var htmlStr = template('stpl', info)
                $('tbody').html(htmlStr)

                //  进行分页初始化
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    //                         取整大家都在发      数据总数 / 一页分配几条
                    totalPages: Math.ceil(info.total / info.size), // 总页数
                    // 添加点击事件
                    onPageClicked: function (a, b, c, page) {
                        // 更新当前页
                        currentPage = page
                        // 重新渲染
                        render()
                    }


                })
            }
        })
    }
    // 2. 点击添加分类按钮  显示模态框
    $('#addBtn').click(function () {
        $('#addModal').modal('show')

        // 显示模态框 就立刻发送ajax请求，请求一级分类的全部数据 渲染下拉列表
        //  通过 page:1 ，pageSize：100 ，获取数据 模拟获取全部数据的接口
        $.ajax({
            type: "get",
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100 // 在一页上面显示全部的数据
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('dropdownTpl', info)
                $('.dropdown-menu').html(htmlStr)
            }
        })
    })

    // 3.给下拉列表的 a 注册点击事件 让下拉列表可选 (通过事件委托注册)
    $('.dropdown-menu').on('click', 'a', function () {
        // 获取a的文本
        var txt = $(this).text()
        // 设置给按钮
        $('#dropdownText').text(txt)

        //  获取a存的id 一级分类id
        var id = $(this).data('id')
        console.log(id)

       $('[name="categoryId"]').val(id)
       
         $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID")
    })

    // 4. 调用fileupload方法完成文件上传初始化
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            console.log(data);
            var result = data.result // 后台返回的对象
            var picUrl = result.picAddr // 图片路径 
            console.log(picUrl)

            //  设置给 img src 
            $('#imgBox img').attr('src', picUrl)

            //  设置图片地址给隐藏域 用于提交
            $('[name="brandLogo"]').val(picUrl)

            // 更新隐藏域的校验状态 为成功
            $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
        }
    })
    /**
     * 思路：选择完图片完成预览时 发送一个异步文件上传请求 
     *          真正预览时，图片已经上传到了服务器
     * 使用插件步骤：
     *      1.引包  注意依赖问题 jq等
     *      2.指定  name后台接受的name的值  data-url 指定后台接口的地址
     *      3.使用fileupload 初始化，配置 dataType 和 done方法即可
     */
    //  5. 进行表单校验插件初始化
    $('#form').bootstrapValidator({
        // 配置排除项，对隐藏域也进行校验
        excluded: [],
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            categoryId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择一级分类'
                    }


                }
            },
            brandName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入二级分类名称'
                    }
                }
            },
            brandLogo: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择图片'
                    }
                }
            }

        }
    })

    // 6. 阻止默认的提交, 通过ajax提交 (注册表单校验成功事件)
    $('#form').on("success.form.bv", function (e) {

        e.preventDefault(); // 阻止默认的提交

        // 通过 ajax 提交
        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: $('#form').serialize(),
            dataType: "json",
            success: function (info) {
                console.log(info);
                if (info.success) {
                    // 关闭模态框
                    $('#addModal').modal("hide");
                    // 重新渲染第一页
                    currentPage = 1;
                    render();

                    // 重置表单内容和状态
                    $('#form').data("bootstrapValidator").resetForm(true);

                    // 由于下拉列表和图片不是表单元素, 需要手动重置
                    $('#dropdownText').text("请选择一级分类");
                    $('#imgBox img').attr("src", "./images/none.png");
                }
            }
        })

    })


})