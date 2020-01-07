/***
 * 租户
 * @type {{init}}
 */
var SnippetMainPageTenement = function() {
    var serverUrl = BaseUtils.serverAddress;
    var tenementMainPageTable;
    var tenementMainPageFormModal = $('#tenement_mainPage_dataSubmit_form_modal');
    var tenementMainPageSubmitForm = $("#tenement_mainPage_dataSubmit_form");
    var tenementMainPageSubmitFormId = "#tenement_mainPage_dataSubmit_form";
    var tenementMainPageMark = 1;
    var tenementMainPageModuleCode = '10032';
    

    /**
     * 初始化 功能按钮
     */
    var tenementMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(tenementMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#tenement-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#tenement_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增租户">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="tenement_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);


                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" title="修改租户" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);

            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除租户">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="tenement_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" title=" 删除租户" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableToolbarHtml.append(table_del_btn_html);
            }
            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="tenement_mainPage_sync_btn">\n';
                sync_btn_html += '<i class="la la-rotate-right"></i>\n';
                sync_btn_html += '</a>\n';
                sync_btn_html += '</li>\n';
                gridHeadToolsHtml.append(sync_btn_html);
            }
        }
        // Tooltip
        $('[data-toggle="m-tooltip"]').tooltip();
    };

    /**
     *  初始化 dataGrid 组件
     */
    var tenementMainPageInitDataGrid = function () {
        layui.use('table', function(){
            var layuiForm = layui.form;
            tenementMainPageTable =  $initDataGrid({
                elem: '#tenement_mainPage_grid',
                url: serverUrl + 'v1/table/tenement/g',
                method:"get",
                where: {   //传递额外参数

                },
                headers: BaseUtils.serverHeaders(),
                title: '租户列表',
                height: 'full-150',
                initSort: {
                    field: 'id', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true, width:70},
                    {field:'id', title:'租户id', unresize:true,width:70},
                    {field:'tenementPhone', title:'租户电话'},
                    {field:'tenementName', title:'租户名称'},
                    {field:'appId', title:'appId'},
                    {field:'appKey', title:'appKey'},
                    {field:'appSecret', title:'appSecret'},
                    {field:'folder', title:'租户文件夹'},
                    {field:'expireDate', title:'到期时间'},
                    {field:'status', title:'状态', align: 'center', fixed: 'right', unresize:true,
                        templet : function (row) {
                            var value = row.status;
                            var spanCss = "m-badge--success";
                            if (value == 1)  {
                                spanCss = "m-badge--warning";
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + BaseUtils.statusText(value) + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#tenement_mainPage_table_toolbar', align: 'center', width:200}
                ]],
                limit: 20,
                limits: [20,30,40,50]
            }, function(res, curr, count){
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(tenementMainPageModuleCode);
                var status_table_index = $.inArray("3", curFunctionButtonGroup);
                if (status_table_index != -1) {
                    $(".layui-unselect.layui-form-checkbox").show();
                } else {
                    $(".layui-unselect.layui-form-checkbox").hide();
                }
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
            });

            //监听行工具事件
            tenementMainPageTable.on('tool(tenement_mainPage_grid)', function(obj){
                if(obj.event === 'del'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    tenementMainPageDeleteData(obj);
                } else if(obj.event === 'edit'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    tenementMainPageSubmitForm.setForm(obj.data);
                    $("#tenement_mainPage_dataSubmit_form_tenement_seq").val(obj.data.serialNumber);
                    tenementMainPageMark = 2;
                    // 显示 dialog
                    tenementMainPageFormModal.modal('show');
                }
            });

            //监听锁定操作
            layuiForm.on('checkbox(lock)', function(obj){
                var statusValue = 0;
                // 选中返回 true  没有选中返回false
                var isChecked = obj.elem.checked;
                var lockChecked = $(obj.elem).attr("checked");
                if (lockChecked == undefined || lockChecked == 'undefined' || typeof (lockChecked) == undefined) {
                    statusValue = 1;
                }
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    if (statusValue == 1) {
                        obj.othis.removeClass("layui-form-checked");
                        $(obj.elem).removeAttr("checked");
                    } else {
                        obj.othis.addClass("layui-form-checked");
                    }
                    return;
                }
                tenementMainPageUpdateDataStatus(obj, statusValue);
            });

            //监听行双击事件
            tenementMainPageTable.on('rowDouble(tenement_mainPage_grid)', function(obj){
                tenementMainPageMark = 3;
                tenementMainPageSubmitForm.setForm(obj.data);
                $("#tenement_mainPage_dataSubmit_form_tenement_seq").val(obj.data.serialNumber);
                BaseUtils.readonlyForm(tenementMainPageSubmitFormId);
                tenementMainPageFormModal.modal('show');
            });
        });
    };

    /**
     * 刷新grid
     */
    var tenementMainPageRefreshGrid = function () {
        tenementMainPageTable.reload('tenement_mainPage_grid',{
            where: {   //传递额外参数

            },
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
    };

    /**
     * 刷新grid和tree
     */
    var tenementMainPageRefreshGridAndTree = function () {
        tenementMainPageRefreshGrid();
    };

    /**
     * 初始化表单提交
     */
    var tenementMainPageFormSubmitHandle = function() {
        $('#tenement_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            BaseUtils.formInputTrim(tenementMainPageSubmitFormId);
            tenementMainPageSubmitForm.validate({
                rules: {
                    tenementName: {
                        required: true,
                        chcharacterNum:true,
                        maxlength: 32
                    },
                    folder: {
                        required: true,
                        alnumCode:true,
                        maxlength: 32
                    },
                    tenementPhone: {
                        required: true,
                        isMobile:true
                    },
                    description: {
                        illegitmacy:true,
                        maxlength: 50
                    }
                },
                errorElement: "div",                  // 验证失败时在元素后增加em标签，用来放错误提示
                errorPlacement: function (error, element) {   // 验证失败调用的函数
                    error.addClass( "form-control-feedback" );   // 提示信息增加样式
                    element.parent("div").parent("div").addClass( "has-danger" );
                    if ( element.prop( "type" ) === "checkbox" ) {
                        error.insertAfter(element.parent("label"));  // 待验证的元素如果是checkbox，错误提示放到label中
                    } else {
                        error.insertAfter(element);
                    }
                },
                highlight: function (element, errorClass, validClass) {
                    $(element).parent("div").parent("div").addClass( "has-danger" );
                    $(element).addClass("has-danger");     // 验证失败时给元素增加样式
                },
                unhighlight: function (element, errorClass, validClass) {
                    $(element).parent("div").parent("div").removeClass( "has-danger" );
                    $(element).removeClass("has-danger");  // 验证成功时去掉元素的样式

                },

                //display error alert on form submit
                invalidHandler: function(event, validator) {

                },
            });
            if (!tenementMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            BaseUtils.modalBlock("#tenement_mainPage_dataSubmit_form_modal");
            $postAjax({
                url:serverUrl + "v1/verify/tenement/s",
                data:tenementMainPageSubmitForm.serializeJSON(),
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                BaseUtils.modalUnblock("#tenement_mainPage_dataSubmit_form_modal");
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                    // 刷新表格
                    tenementMainPageRefreshGridAndTree();
                    // 关闭 dialog
                    tenementMainPageFormModal.modal('hide');
                } else if (response.status == 409) {
                    tenementMainPageRefreshGridAndTree();
                }
            }, function (data) {
                BaseUtils.modalUnblock("#tenement_mainPage_dataSubmit_form_modal");
            });
            return false;
        });
    };

    /**
     *  清空表单数据和样式
     */
    var tenementMainPageCleanForm = function () {
        BaseUtils.cleanFormData(tenementMainPageSubmitForm);
    };

    /**
     * 删除
     */
    var tenementMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var  ajaxDelUrl = serverUrl + "v1/verify/tenement/d/b";
        var delData = null;
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.id);
        } else {
            // 获取选中的数据对象
            var checkRows = tenementMainPageTable.checkStatus('tenement_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                });
            }
        }
        delData = {
            'ids' : JSON.stringify(idsArray)
        }
        if (idsArray.length > 0) {
            //询问框
            layer.confirm('你确定要删除?', {
                shade: [0.3, 'rgb(230, 230, 230)'],
                btn: ['确定','取消'] //按钮
            }, function(index, layero){   //按钮【按钮一】的回调
                layer.close(index);
                BaseUtils.pageMsgBlock();
                $deleteAjax({
                    url:ajaxDelUrl,
                    data: delData,
                    headers: BaseUtils.serverHeaders()
                }, function (response) {
                    if (response.success) {
                        if (obj != null) {
                            obj.del();
                        } else {
                            tenementMainPageRefreshGridAndTree();
                        }
                    }
                }, function (data) {

                });
            }, function () {  //按钮【按钮二】的回调

            });
        }
    };

    /**
     *  修改状态
     */
    var tenementMainPageUpdateDataStatus = function(obj,status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/tenement/p/b";
        var putData = null;
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.value);
        } else {
            // 获取选中的数据对象
            var checkRows = tenementMainPageTable.checkStatus('tenement_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                });
            }
        }
        putData = {
            'ids': JSON.stringify(idsArray),
            'status' : status
        }
        if (idsArray.length > 0) {
            BaseUtils.pageMsgBlock();
            $putAjax({
                url: ajaxPutUrl,
                data: putData,
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                  if (response.success) {
                    tenementMainPageRefreshGridAndTree();
                  }  else if (response.status == 202) {
                    if (status == 1) {
                        obj.othis.removeClass("layui-form-checked");
                    } else {
                        obj.othis.addClass("layui-form-checked");
                    }
                    layer.tips(BaseUtils.updateMsg, obj.othis,  {
                        tips: [4, '#f4516c']
                    });
                  } else if (response.status == 409) {
                      tenementMainPageRefreshGrid();
                  } else {
                     if (status == 1) {
                        obj.othis.removeClass("layui-form-checked");
                        $(obj.elem).removeAttr("checked");
                     } else {
                        obj.othis.addClass("layui-form-checked");
                     }
                     if (response.status == 504 || response.status == 401) {
                         BaseUtils.LoginTimeOutHandler();
                     } else {
                         layer.tips(response.message, obj.othis,  {
                             tips: [4, '#f4516c']
                         });
                     }

                }
            }, function (data) {

            });
        }
    };

    /**
     *  同步数据
     */
    var tenementMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/tenement/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                tenementMainPageRefreshGridAndTree();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };



    var tenementMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#tenement_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {

            var modalDialogTitle = "新增租户";
            if (tenementMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(tenementMainPageSubmitFormId);
            }
            if (tenementMainPageMark == 2) {
                modalDialogTitle = "修改租户";
                BaseUtils.cleanFormReadonly(tenementMainPageSubmitFormId);
            }
            $(".has-danger-error").show();
            $("#tenement_mainPage_dataSubmit_form_submit").show();
            if (tenementMainPageMark == 3) {
                modalDialogTitle = "租户信息";
                $(".has-danger-error").hide();
                $("#tenement_mainPage_dataSubmit_form_submit").hide();
            }
            var modalDialog = $(this);
            modalDialog.find('.modal-title').text(modalDialogTitle);
            // 剧中显示
            $(this).css('display', 'block');
            var modalHeight = $(window).height() / 2 - $('#tenement_mainPage_dataSubmit_form_modal .modal-dialog').height() / 2;
            $(this).find('.modal-dialog').css({
                'margin-top': modalHeight - 120
            });
        });

        // 当调用 hide 实例方法时触发。
        $('#tenement_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            tenementMainPageCleanForm();
            $(".modal-backdrop").remove();
            BaseUtils.modalUnblock("#tenement_mainPage_dataSubmit_form_modal");
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            tenementMainPageInitFunctionButtonGroup();
            tenementMainPageInitDataGrid();
            tenementMainPageInitModalDialog();
            tenementMainPageFormSubmitHandle();
            $('#tenement_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                tenementMainPageDeleteData(null);
                return false;
            });
            $('#tenement_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                tenementMainPageMark = 1;
                // 显示 dialog
                tenementMainPageFormModal.modal('show');
                return false;
            });
            $('#tenement_mainPage_searchNode_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                return false;
            });
            $('#tenement_mainPage_reload_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                $("#tenement_mainPage_dataSubmit_form_parent_name").val("");
                tenementMainPageRefreshGridAndTree();
                return false;
            });
            $('#tenement_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                tenementMainPageSyncData();
                return false;
            });

            window.onresize = function(){
                tenementMainPageTable.resize("tenement_mainPage_grid");
            }

        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageTenement.init();
});