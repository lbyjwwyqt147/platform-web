/***
 * 岗位
 * @type {{init}}
 */
var SnippetMainPagePosition = function() {
    var serverUrl = BaseUtils.serverAddress;
    var positionMainPageTable;
    var positionMainPageFormModal = $('#position_mainPage_dataSubmit_form_modal');
    var positionMainPageSubmitForm = $("#position_mainPage_dataSubmit_form");
    var positionMainPageSubmitFormId = "#position_mainPage_dataSubmit_form";
    var positionMainPageMark = 1;
    var positionMainPagePid = 0;
    var positionMainPageParentName = "";
    var positionMainPageZtreeNodeList = [];
    var positionMainPageModuleCode = '10022';
    var positionPageLeffTree;

    /**
     * ztree 基础属性
     * @type {{onClick: callback.onClick, onApositionMainPageSyncDataSuccess: callback.onApositionMainPageSyncDataSuccess}}
     */
    var positionMainPageZtreeSetting = BaseUtils.ztree.settingZtreeProperty({
        "selectedMulti":false,
        "enable":false,
        "url":serverUrl + "v1/tree/position/all/z",
        "headers":BaseUtils.serverHeaders()
    });
    positionMainPageZtreeSetting.view = {
            selectedMulti:false,
            fontCss: zTreeHighlightFontCss,
            expandSpeed: "slow", //节点展开动画速度
    };
    positionMainPageZtreeSetting.callback = {
        onClick: function (event, treeId, treeNode) {   //点击节点执行事件
            positionMainPagePid = treeNode.id;
            positionMainPageParentName = treeNode.name;
            positionMainPageRefreshGrid();
        },
        onAsyncSuccess:function(event, treeId, treeNode, msg){ //异步加载完成后执行
            if ("undefined" == $("#position_mainPage_tree_1_a").attr("title")) {
                $("#position_mainPage_tree_1").remove();
            }
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            var nodes = treeObj.getNodes();
            if (nodes.length>0) {
                for(var i=0;i<nodes.length;i++){
                    treeObj.expandNode(nodes[i], true, false, false);//默认展开第一级节点
                }
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
    var positionMainPageInitTree = function() {
        $.fn.zTree.init($("#position_mainPage_tree"), positionMainPageZtreeSetting);
        positionPageLeffTree = $.fn.zTree.getZTreeObj("position_mainPage_tree");
    };

    /**
     * 刷新 指定 节点
     * 在指定的节点下面增加子节点之后调用的方法。
     * @param id
     */
    function positionMainPageRereshExpandNode(id) {
        if (id == 0) {
            positionMainPageRereshTree();
            return;
        }
        positionPageLeffTree = $.fn.zTree.getZTreeObj("position_mainPage_tree");
        var nodes = positionPageLeffTree.getNodesByParam("id", id, null);
       if (nodes[0].children == null || nodes[0].children == undefined || nodes[0].children.length == 0) {
           positionMainPageRereshTreeNode(id);
       }
       BaseUtils.ztree.rereshExpandNode(positionPageLeffTree, id);
    }


    /**
     *  刷新树
     * @param id
     */
    function positionMainPageRereshTree(){
        positionPageLeffTree = $.fn.zTree.getZTreeObj("position_mainPage_tree");
        positionPageLeffTree.destroy();
        positionMainPageInitTree();
    };

    /**
     * 异步加载ztree 数数据
     * @param id
     */
    function positionMainPageRereshTreeNode(id) {
        $getAjax({
            url: serverUrl + "v1/tree/position/all/z",
            data: {
                id:id
            },
            headers: BaseUtils.serverHeaders()
        }, function (data) {
            //获取指定父节点
            positionPageLeffTree = $.fn.zTree.getZTreeObj("position_mainPage_tree");
            var parentZNode = positionPageLeffTree.getNodeByParam("id", positionMainPagePid, null);
            positionPageLeffTree.addNodes(parentZNode,data, false);
        }, function (response) {

        });
    }

    /**
     *  搜索节点
     */
    function positionMainPageSearchZtreeNode() {
        var searchZtreeValue = $.trim($("#position-mainPage-nodeName-search").val());
       positionMainPageZtreeUpdateNodes(positionMainPageZtreeNodeList,false);
        if (searchZtreeValue == "") {
            return;
        }
        var keyType = "name";
        positionPageLeffTree = $.fn.zTree.getZTreeObj("position_mainPage_tree");
        positionMainPageZtreeNodeList = positionPageLeffTree.getNodesByParamFuzzy(keyType, searchZtreeValue);
        positionMainPageZtreeUpdateNodes(positionMainPageZtreeNodeList, true);
    };

    /**
     *  更新节点
     * @param positionMainPageZtreeNodeList
     * @param highlight
     */
    function positionMainPageZtreeUpdateNodes(positionMainPageZtreeNodeList, highlight) {
        var curpositionParentNodes = [];
        for (var i = 0, l = positionMainPageZtreeNodeList.length; i < l; i++) {
            var  curNode = positionMainPageZtreeNodeList[i];
            curNode.highlight = highlight;
            // 获取父节点
            var pNode = curNode.getParentNode();
            if (pNode != null && curpositionParentNodes.indexOf(pNode.id) == -1) {
                curpositionParentNodes.push(pNode.id);
                positionPageLeffTree.expandNode(pNode);
            }
            //定位到节点并展开
            positionPageLeffTree.expandNode(curNode);
            positionPageLeffTree.updateNode(curNode);
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
    function positionMainPageZtreeMaxHeight() {
        var layGridHeight = $(".layui-form.layui-border-box.layui-table-view").height() + 2;
        $("#position_mainPage_tree").css("min-height", layGridHeight);
        $("#position_mainPage_tree").css("max-height", layGridHeight);
        $("#position_mainPage_tree").css("border-bottom", "1px solid #e6e6e6");
    }

    /**
     * 初始化 功能按钮
     */
    var positionMainPageInitFunctionButtonGroup = function () {
        //初始化 优先级 控件
        BootstrapTouchspin.initByteTouchSpin("#position_mainPage_dataSubmit_form_position_seq");
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(positionMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#position-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#position_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增岗位">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="position_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);


                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" title="修改岗位" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);

            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除岗位">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="position_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" title=" 删除岗位" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableToolbarHtml.append(table_del_btn_html);
            }
            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="position_mainPage_sync_btn">\n';
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
    var positionMainPageInitDataGrid = function () {
        layui.use('table', function(){
            var layuiForm = layui.form;
            positionMainPageTable =  $initDataGrid({
                elem: '#position_mainPage_grid',
                url: serverUrl + 'v1/table/position/g',
                method:"get",
                where: {   //传递额外参数
                    'parentId' : positionMainPagePid
                },
                headers: BaseUtils.serverHeaders(),
                title: '岗位列表',
                height: 'full-150',
                initSort: {
                    field: 'serialNumber', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'postNumber', title:'岗位编号'},
                    {field:'postName', title:'岗位名称'},
                    {field:'serialNumber', title:'排序值'},
                    /*{field:'postLevel', title:'层级'},*/
                    {field:'postDescription', title:'描述'},
                    {field:'postStatus', title:'状态', align: 'center', fixed: 'right', unresize:true,
                        templet : function (row) {
                            var value = row.postStatus;
                            var spanCss = "m-badge--success";
                            if (value == 1)  {
                                spanCss = "m-badge--warning";
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + BaseUtils.statusText(value) + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#position_mainPage_table_toolbar', align: 'center', width:200}
                ]],
                limit: 20,
                limits: [20,30,40,50]
            }, function(res, curr, count){
                positionMainPageZtreeMaxHeight();
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(positionMainPageModuleCode);
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
            positionMainPageTable.on('tool(position_mainPage_grid)', function(obj){
                if(obj.event === 'del'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    positionMainPageDeleteData(obj);
                } else if(obj.event === 'edit'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    positionMainPageSubmitForm.setForm(obj.data);
                    $("#position_mainPage_dataSubmit_form_position_seq").val(obj.data.serialNumber);
                    positionMainPageMark = 2;
                    // 显示 dialog
                    positionMainPageFormModal.modal('show');
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
                positionMainPageUpdateDataStatus(obj, statusValue);
            });

            //监听行双击事件
            positionMainPageTable.on('rowDouble(position_mainPage_grid)', function(obj){
                positionMainPageMark = 3;
                positionMainPageSubmitForm.setForm(obj.data);
                $("#position_mainPage_dataSubmit_form_position_seq").val(obj.data.serialNumber);
                BaseUtils.readonlyForm(positionMainPageSubmitFormId);
                positionMainPageFormModal.modal('show');
            });
        });
    };

    /**
     * 刷新grid
     */
    var positionMainPageRefreshGrid = function () {
        positionMainPageTable.reload('position_mainPage_grid',{
            where: {   //传递额外参数
                'parentId' : positionMainPagePid
            },
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
    };

    /**
     * 刷新grid和tree
     */
    var positionMainPageRefreshGridAndTree = function () {
        positionMainPageRefreshGrid();
        //刷新树
        positionMainPageRereshExpandNode(positionMainPagePid);
    };

    /**
     * 初始化表单提交
     */
    var positionMainPageFormSubmitHandle = function() {
        $('#position_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            BaseUtils.formInputTrim(positionMainPageSubmitFormId);
            if ($("#position_mainPage_dataSubmit_form_parent_name").val() == "") {
                positionMainPagePid = 0;
                positionMainPageParentName = "";
            }
            positionMainPageSubmitForm.validate({
                rules: {
                    postNumber: {
                        required: true,
                        alnumCode:true,
                        maxlength: 15
                    },
                    postName: {
                        required: true,
                        chcharacter:true,
                        maxlength: 32
                    },
                    serialNumber: {
                        range: [0,127]
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
            if (!positionMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            BaseUtils.modalBlock("#position_mainPage_dataSubmit_form_modal");
            $("#position_mainPage_dataSubmit_form input[name='parentId']").val(positionMainPagePid);
            $postAjax({
                url:serverUrl + "v1/verify/position/s",
                data:positionMainPageSubmitForm.serializeJSON(),
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                BaseUtils.modalUnblock("#position_mainPage_dataSubmit_form_modal");
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                    // 刷新表格
                    positionMainPageRefreshGridAndTree();
                    // 关闭 dialog
                    positionMainPageFormModal.modal('hide');
                } else if (response.status == 409) {
                    positionMainPageRefreshGridAndTree();
                }
            }, function (data) {
                BaseUtils.modalUnblock("#position_mainPage_dataSubmit_form_modal");
            });
            return false;
        });
    };

    /**
     *  清空表单数据和样式
     */
    var positionMainPageCleanForm = function () {
        BaseUtils.cleanFormData(positionMainPageSubmitForm);
    };

    /**
     * 删除
     */
    var positionMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var  ajaxDelUrl = serverUrl + "v1/verify/position/d/b";
        var delData = null;
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.id);
        } else {
            // 获取选中的数据对象
            var checkRows = positionMainPageTable.checkStatus('position_mainPage_grid');
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
                            positionMainPageRereshExpandNode(positionMainPagePid);
                        } else {
                            positionMainPageRefreshGridAndTree();
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
    var positionMainPageUpdateDataStatus = function(obj,status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/position/p/b";
        var putData = null;
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.value);
        } else {
            // 获取选中的数据对象
            var checkRows = positionMainPageTable.checkStatus('position_mainPage_grid');
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
                    positionMainPageRefreshGridAndTree();
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
                      positionMainPageRefreshGrid();
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
    var positionMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/position/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                positionMainPagePid = 0;
                positionMainPageZtreeNodeList = [];
                positionMainPageRefreshGridAndTree();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };



    var positionMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#position_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {
            var selectedNodes = positionPageLeffTree.getSelectedNodes();
            if (selectedNodes.length > 0) {
                var selectedNode = selectedNodes[0];
                positionMainPageParentName = selectedNode.name;
                positionMainPagePid = selectedNode.id;
            }
            var $positionParentName = $("#position_mainPage_dataSubmit_form_parent_name");
            var modalDialogTitle = "新增岗位";
            if (positionMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(positionMainPageSubmitFormId);
                $("#position_mainPage_dataSubmit_form_position_seq").val(10);
                $(".glyphicon.glyphicon-remove.form-control-feedback").show();
            }
            $positionParentName.val(positionMainPageParentName);
            if (positionMainPageMark == 2) {
                modalDialogTitle = "修改岗位";
                BaseUtils.cleanFormReadonly(positionMainPageSubmitFormId);
                $("#position_mainPage_dataSubmit_form_position_number").addClass("m-input--solid");
                $("#position_mainPage_dataSubmit_form_position_number").attr("readonly", "readonly");
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
            }
            $(".has-danger-error").show();
            $("#position_mainPage_dataSubmit_form_submit").show();
            $positionParentName.addClass("m-input--solid");
            $positionParentName.attr("readonly", "readonly");
            if (positionMainPageMark == 3) {
                modalDialogTitle = "岗位信息";
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
                $(".has-danger-error").hide();
                $("#position_mainPage_dataSubmit_form_submit").hide();
            }
            var modalDialog = $(this);
            modalDialog.find('.modal-title').text(modalDialogTitle);
            // 剧中显示
            $(this).css('display', 'block');
            var modalHeight = $(window).height() / 2 - $('#position_mainPage_dataSubmit_form_modal .modal-dialog').height() / 2;
            $(this).find('.modal-dialog').css({
                'margin-top': modalHeight - 120
            });
        });

        // 当调用 hide 实例方法时触发。
        $('#position_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            positionMainPageCleanForm();
            $(".modal-backdrop").remove();
            BaseUtils.modalUnblock("#position_mainPage_dataSubmit_form_modal");
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            positionMainPageInitFunctionButtonGroup();
            positionMainPageInitTree();
            positionMainPageInitDataGrid();
            positionMainPageInitModalDialog();
            positionMainPageFormSubmitHandle();
            $('#position_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                positionMainPageDeleteData(null);
                return false;
            });
            $('#position_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                positionMainPageMark = 1;
                // 显示 dialog
                positionMainPageFormModal.modal('show');
                return false;
            });
            $('#position_mainPage_searchNode_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                positionMainPageSearchZtreeNode();
                return false;
            });
            $('#position_mainPage_reload_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                positionMainPagePid = 0;
                $("#position_mainPage_dataSubmit_form_parent_name").val("");
                positionMainPageRefreshGridAndTree();
                return false;
            });
            $('#position_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                positionMainPageSyncData();
                return false;
            });

            window.onresize = function(){
                positionMainPageTable.resize("position_mainPage_grid");
                positionMainPageZtreeMaxHeight();
            }

        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPagePosition.init();
});