/***
 * 角色
 * @type {{init}}
 */
var SnippetMainPageRole = function() {
    var serverUrl = BaseUtils.serverAddress;
    var roleMainPageTable;
    var roleMainPageFormModal = $('#role_mainPage_dataSubmit_form_modal');
    var roleMainPageSubmitForm = $("#role_mainPage_dataSubmit_form");
    var roleMainPageSubmitFormId = "#role_mainPage_dataSubmit_form";
    var roleMainPageMark = 1;
    var roleMainPagePid = 0;
    var roleMainPageParentName = "";
    var roleMainPageZtreeNodeList = [];
    var roleMainPageModuleCode = '10021';
    var rolePageLeffTree;

    /**
     * ztree 基础属性
     * @type {{onClick: callback.onClick, onAroleMainPageSyncDataSuccess: callback.onAroleMainPageSyncDataSuccess}}
     */
    var roleMainPageZtreeSetting = BaseUtils.ztree.settingZtreeProperty({
        "selectedMulti":false,
        "enable":false,
        "url":serverUrl + "v1/tree/role/all/z",
        "headers":BaseUtils.serverHeaders()
    });
    roleMainPageZtreeSetting.view = {
            selectedMulti:false,
            fontCss: zTreeHighlightFontCss,
            expandSpeed: "slow", //节点展开动画速度
    };
    roleMainPageZtreeSetting.callback = {
        onClick: function (event, treeId, treeNode) {   //点击节点执行事件
            roleMainPagePid = treeNode.id;
            roleMainPageParentName = treeNode.name;
            roleMainPageRefreshGrid();
        },
        onAsyncSuccess:function(event, treeId, msg){ //异步加载完成后执行
            if ("undefined" == $("#role_mainPage_tree_1_a").attr("title")) {
                $("#role_mainPage_tree_1").remove();
            }
        },
        onAsyncError:function(){ //异步加载出现异常执行

        },
        beforeAsync:function () { //异步加载之前执行
           if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
        }
    };


    /**
     * 初始化ztree 组件
     */
    var roleMainPageInitTree = function() {
        $.fn.zTree.init($("#role_mainPage_tree"), roleMainPageZtreeSetting);
        rolePageLeffTree = $.fn.zTree.getZTreeObj("role_mainPage_tree");
    };

    /**
     * 刷新 指定 节点
     * 在指定的节点下面增加子节点之后调用的方法。
     * @param id
     */
    function roleMainPageRereshExpandNode(id) {
        if (id == 0) {
            roleMainPageRereshTree();
            return;
        }
        rolePageLeffTree = $.fn.zTree.getZTreeObj("role_mainPage_tree");
        var nodes = rolePageLeffTree.getNodesByParam("id", id, null);
       if (nodes[0].children == null || nodes[0].children == undefined || nodes[0].children.length == 0) {
           roleMainPageRereshTreeNode(id);
       }
       BaseUtils.ztree.rereshExpandNode(rolePageLeffTree, id);
    }


    /**
     *  刷新树
     * @param id
     */
    function roleMainPageRereshTree(){
        rolePageLeffTree = $.fn.zTree.getZTreeObj("role_mainPage_tree");
        rolePageLeffTree.destroy();
        roleMainPageInitTree();
    };

    /**
     * 异步加载ztree 数数据
     * @param id
     */
    function roleMainPageRereshTreeNode(id) {
        $getAjax({
            url: serverUrl + "v1/tree/role/all/z",
            data: {
                id:id
            },
            headers: BaseUtils.serverHeaders()
        }, function (data) {
            //获取指定父节点
            rolePageLeffTree = $.fn.zTree.getZTreeObj("role_mainPage_tree");
            var parentZNode = rolePageLeffTree.getNodeByParam("id", roleMainPagePid, null);
            rolePageLeffTree.addNodes(parentZNode,data, false);
        }, function (response) {

        });
    }

    /**
     *  搜索节点
     */
    function roleMainPageSearchZtreeNode() {
        var searchZtreeValue = $.trim($("#role-mainPage-nodeName-search").val());
       roleMainPageZtreeUpdateNodes(roleMainPageZtreeNodeList,false);
        if (searchZtreeValue == "") {
            return;
        }
        var keyType = "name";
        rolePageLeffTree = $.fn.zTree.getZTreeObj("role_mainPage_tree");
        roleMainPageZtreeNodeList = rolePageLeffTree.getNodesByParamFuzzy(keyType, searchZtreeValue);
        roleMainPageZtreeUpdateNodes(roleMainPageZtreeNodeList, true);
    };

    /**
     *  更新节点
     * @param roleMainPageZtreeNodeList
     * @param highlight
     */
    function roleMainPageZtreeUpdateNodes(roleMainPageZtreeNodeList, highlight) {
        var curroleParentNodes = [];
        for (var i = 0, l = roleMainPageZtreeNodeList.length; i < l; i++) {
            var  curNode = roleMainPageZtreeNodeList[i];
            curNode.highlight = highlight;
            // 获取父节点
            var pNode = curNode.getParentNode();
            if (pNode != null && curroleParentNodes.indexOf(pNode.id) == -1) {
                curroleParentNodes.push(pNode.id);
                rolePageLeffTree.expandNode(pNode);
            }
            //定位到节点并展开
            rolePageLeffTree.expandNode(curNode);
            rolePageLeffTree.updateNode(curNode);
        }
    };

    /**
     * 设置 ztree 高亮时的css
     * @param treeId
     * @param treeNode
     * @returns {*}
     */
     function zTreeHighlightFontCss(treeId, treeNode) {
       return BaseUtils.ztree.getZtreeHighlightFontCss(treeId, treeNode)
    };

    /**
     * 设置 tree 最大高度样式
     */
    function roleMainPageZtreeMaxHeight() {
         var layGridHeight = $(".layui-form.layui-border-box.layui-table-view").height() + 2;
        $("#role_mainPage_tree").css("min-height", layGridHeight);
        $("#role_mainPage_tree").css("max-height", layGridHeight);
        $("#role_mainPage_tree").css("border-bottom", "1px solid #e6e6e6");
    }

    /**
     * 初始化 功能按钮
     */
    var roleMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(roleMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#role-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#role_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增角色">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="role_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);


                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" title="修改角色" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);

            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除角色">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="role_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" title=" 删除角色" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableToolbarHtml.append(table_del_btn_html);
            }
            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="role_mainPage_sync_btn">\n';
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
    var roleMainPageInitDataGrid = function () {
        layui.use('table', function(){
            // roleMainPageTable = layui.table;
            var layuiForm = layui.form;
            roleMainPageTable =  $initDataGrid({
                elem: '#role_mainPage_grid',
                url: serverUrl + 'v1/table/role/g',
                method:"get",
                where: {   //传递额外参数
                    'parentId' : roleMainPagePid
                },
                headers: BaseUtils.serverHeaders(),
                title: '角色列表',
                height: 'full-150',
                initSort: {
                    field: 'id', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'roleNumber', title:'角色编号'},
                    {field:'roleName', title:'角色名称'},
                    {field:'roleAuthorizationCode', title:'授权代码'},
                    {field:'roleDescription', title:'描述'},
                    {field:'roleStatus', title:'状态', align: 'center', fixed: 'right', unresize:true,
                        templet : function (row) {
                            var value = row.roleStatus;
                            var spanCss = "m-badge--success";
                            if (value == 1)  {
                                spanCss = "m-badge--warning";
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + BaseUtils.statusText(value) + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#role_mainPage_table_toolbar', align: 'center', width:200}
                ]],
                limit: 20,
                limits: [20,30,40,50]
            }, function(res, curr, count){
                roleMainPageZtreeMaxHeight();
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(roleMainPageModuleCode);
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
            roleMainPageTable.on('tool(role_mainPage_grid)', function(obj){
                if(obj.event === 'del'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    roleMainPageDeleteData(obj);
                } else if(obj.event === 'edit'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    roleMainPageSubmitForm.setForm(obj.data);
                    roleMainPageMark = 2;
                    // 显示 dialog
                    roleMainPageFormModal.modal('show');
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
                roleMainPageUpdateDataStatus(obj, statusValue);
            });

            //监听行双击事件
            roleMainPageTable.on('rowDouble(role_mainPage_grid)', function(obj){
                roleMainPageMark = 3;
                roleMainPageSubmitForm.setForm(obj.data);
                BaseUtils.readonlyForm(roleMainPageSubmitFormId);
                roleMainPageFormModal.modal('show');
            });
        });
    };

    /**
     * 刷新grid
     */
    var roleMainPageRefreshGrid = function () {
        roleMainPageTable.reload('role_mainPage_grid',{
            where: {   //传递额外参数
                'parentId' : roleMainPagePid
            },
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
    };

    /**
     * 刷新grid和tree
     */
    var roleMainPageRefreshGridAndTree = function () {
        roleMainPageRefreshGrid();
        //刷新树
        roleMainPageRereshExpandNode(roleMainPagePid);
    };

    /**
     * 初始化表单提交
     */
    var roleMainPageFormSubmitHandle = function() {
        $('#role_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            BaseUtils.formInputTrim(roleMainPageSubmitFormId);
            if ($("#role_mainPage_dataSubmit_form_parent_name").val() == "") {
                roleMainPagePid = 0;
                roleMainPageParentName = "";
            }
            roleMainPageSubmitForm.validate({
                rules: {
                    roleNumber: {
                        required: true,
                        alnumCode:true,
                        maxlength: 15
                    },
                    roleName: {
                        required: true,
                        chcharacter:true,
                        maxlength: 32
                    },
                    roleAuthorizationCode: {
                        required: true,
                        englishLetter:true,
                        maxlength: 15
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
            if (!roleMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            BaseUtils.modalBlock("#role_mainPage_dataSubmit_form_modal");
            $("#role_mainPage_dataSubmit_form input[name='parentId']").val(roleMainPagePid);
            $postAjax({
                url:serverUrl + "v1/verify/role/s",
                data:roleMainPageSubmitForm.serializeJSON(),
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                BaseUtils.modalUnblock("#role_mainPage_dataSubmit_form_modal");
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                    // 刷新表格
                    roleMainPageRefreshGridAndTree();
                    // 关闭 dialog
                    roleMainPageFormModal.modal('hide');
                } else if (response.status == 409) {
                    roleMainPageRefreshGridAndTree();
                }
            }, function (data) {
                BaseUtils.modalUnblock("#role_mainPage_dataSubmit_form_modal");
            });
            return false;
        });
    };

    /**
     *  清空表单数据和样式
     */
    var roleMainPageCleanForm = function () {
        BaseUtils.cleanFormData(roleMainPageSubmitForm);
    };

    /**
     * 删除
     */
    var roleMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var  ajaxDelUrl = serverUrl + "v1/verify/role/d/b";
        var delData = null;
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.id);
        } else {
            // 获取选中的数据对象
            var checkRows = roleMainPageTable.checkStatus('role_mainPage_grid');
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
                            roleMainPageRereshExpandNode(roleMainPagePid);
                        } else {
                            roleMainPageRefreshGridAndTree();
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
    var roleMainPageUpdateDataStatus = function(obj,status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/role/p/b";
        var putData = null;
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.value);
        } else {
            // 获取选中的数据对象
            var checkRows = roleMainPageTable.checkStatus('role_mainPage_grid');
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
                    roleMainPageRefreshGridAndTree();
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
                      roleMainPageRefreshGrid();
                  } else {
                     if (status == 1) {
                        obj.othis.removeClass("layui-form-checked");
                        $(obj.elem).removeAttr("checked");
                     } else {
                        obj.othis.addClass("layui-form-checked");
                     }
                      if (response.status == 504 || response.status == 401) {
                          BaseUtils.LoginTimeOutHandler();
                      }else {
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
    var roleMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/role/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                roleMainPagePid = 0;
                roleMainPageZtreeNodeList = [];
                roleMainPageRefreshGridAndTree();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };



    var roleMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#role_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {
            var selectedNodes = rolePageLeffTree.getSelectedNodes();
            if (selectedNodes.length > 0) {
                var selectedNode = selectedNodes[0];
                roleMainPageParentName = selectedNode.name;
                roleMainPagePid = selectedNode.id;
            }
            var $roleParentName = $("#role_mainPage_dataSubmit_form_parent_name");
            var modalDialogTitle = "新增角色";
            if (roleMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(roleMainPageSubmitFormId);
                $(".glyphicon.glyphicon-remove.form-control-feedback").show();
            }
            $roleParentName.val(roleMainPageParentName);
            if (roleMainPageMark == 2) {
                modalDialogTitle = "修改角色";
                BaseUtils.cleanFormReadonly(roleMainPageSubmitFormId);
                $("#role_mainPage_dataSubmit_form_role_number").addClass("m-input--solid");
                $("#role_mainPage_dataSubmit_form_role_number").attr("readonly", "readonly");
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
            }
            $(".has-danger-error").show();
            $("#role_mainPage_dataSubmit_form_submit").show();
            $roleParentName.addClass("m-input--solid");
            $roleParentName.attr("readonly", "readonly");
            if (roleMainPageMark == 3) {
                modalDialogTitle = "角色信息";
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
                $(".has-danger-error").hide();
                $("#role_mainPage_dataSubmit_form_submit").hide();
            }
            var modalDialog = $(this);
            modalDialog.find('.modal-title').text(modalDialogTitle);
            // 剧中显示
            $(this).css('display', 'block');
            var modalHeight = $(window).height() / 2 - $('#role_mainPage_dataSubmit_form_modal .modal-dialog').height() / 2;
            $(this).find('.modal-dialog').css({
                'margin-top': modalHeight - 120
            });
        });

        // 当调用 hide 实例方法时触发。
        $('#role_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            roleMainPageCleanForm();
            $(".modal-backdrop").remove();
            BaseUtils.modalUnblock("#role_mainPage_dataSubmit_form_modal");
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            roleMainPageInitFunctionButtonGroup();
            roleMainPageInitTree();
            roleMainPageInitDataGrid();
            roleMainPageInitModalDialog();
            roleMainPageFormSubmitHandle();
            $('#role_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                roleMainPageDeleteData(null);
                return false;
            });
            $('#role_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                roleMainPageMark = 1;
                // 显示 dialog
                roleMainPageFormModal.modal('show');
                return false;
            });
            $('#role_mainPage_searchNode_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                roleMainPageSearchZtreeNode();
                return false;
            });
            $('#role_mainPage_reload_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                roleMainPagePid = 0;
                $("#role_mainPage_dataSubmit_form_parent_name").val("");
                roleMainPageRefreshGridAndTree();
                return false;
            });
            $('#role_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                roleMainPageSyncData();
                return false;
            });

            window.onresize = function(){
                roleMainPageTable.resize("role_mainPage_grid");
                roleMainPageZtreeMaxHeight();
            }

        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageRole.init();
});