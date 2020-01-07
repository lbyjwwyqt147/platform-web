/***
 * 组织结构
 * @type {{init}}
 */
var SnippetMainPageOrganization = function() {
    var serverUrl = BaseUtils.serverAddress;
    var organizationMainPageTable;
    var organizationMainPageFormModal = $('#organization_mainPage_dataSubmit_form_modal');
    var organizationMainPageSubmitForm = $("#organization_mainPage_dataSubmit_form");
    var organizationMainPageSubmitFormId = "#organization_mainPage_dataSubmit_form";
    var organizationMainPageMark = 1;
    var organizationMainPagePid = 0;
    var organizationMainPageParentName = "";
    var organizationMainPageZtreeNodeList = [];
    var organizationMainPageModuleCode = '10024';
    var organizationPageLeffTree;

    /**
     * ztree 基础属性
     * @type {{onClick: callback.onClick, onAorganizationMainPageSyncDataSuccess: callback.onAorganizationMainPageSyncDataSuccess}}
     */
    var organizationMainPageZtreeSetting = BaseUtils.ztree.settingZtreeProperty({
        "selectedMulti":false,
        "enable":false,
        "url":serverUrl + "v1/tree/organization/all/z",
        "headers":BaseUtils.serverHeaders(),
    });
    organizationMainPageZtreeSetting.view = {
            selectedMulti:false,
            fontCss: zTreeHighlightFontCss,
            expandSpeed: "slow", //节点展开动画速度
    };
    organizationMainPageZtreeSetting.callback = {
        onClick: function (event, treeId, treeNode) {   //点击节点执行事件
            organizationMainPagePid = treeNode.id;
            organizationMainPageParentName = treeNode.name;
            organizationMainPageRefreshGrid();
        },
        onAsyncSuccess:function(event, treeId, treeNode, msg){ //异步加载完成后执行
            if ("undefined" == $("#organization_mainPage_tree_1_a").attr("title")) {
                $("#organization_mainPage_tree_1").remove();
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
    var organizationMainPageInitTree = function() {
        $.fn.zTree.init($("#organization_mainPage_tree"), organizationMainPageZtreeSetting);
        organizationPageLeffTree = $.fn.zTree.getZTreeObj("organization_mainPage_tree");
    };

    /**
     * 刷新 指定 节点
     * 在指定的节点下面增加子节点之后调用的方法。
     * @param id
     */
    function organizationMainPageRereshExpandNode(id) {
        if (id == 0) {
            organizationMainPageRereshTree();
            return;
        }
        organizationPageLeffTree = $.fn.zTree.getZTreeObj("organization_mainPage_tree");
        var nodes = organizationPageLeffTree.getNodesByParam("id", id, null);
        if (nodes[0].children == null || nodes[0].children == undefined || nodes[0].children.length == 0) {
            organizationMainPageRereshTreeNode(id);
        }
        BaseUtils.ztree.rereshExpandNode(organizationPageLeffTree, id);
    }


    /**
     *  刷新树
     * @param id
     */
    function organizationMainPageRereshTree(){
        organizationPageLeffTree = $.fn.zTree.getZTreeObj("organization_mainPage_tree");
        organizationPageLeffTree.destroy();
        organizationMainPageInitTree();
    };

    /**
     * 异步加载ztree 数数据
     * @param id
     */
    function organizationMainPageRereshTreeNode(id) {
        $getAjax({
            url: serverUrl + "v1/tree/organization/all/z",
            data: {
                id:id
            },
            headers: BaseUtils.serverHeaders()
        }, function (data) {
            organizationPageLeffTree = $.fn.zTree.getZTreeObj("organization_mainPage_tree");
            //获取指定父节点
            var parentZNode = organizationPageLeffTree.getNodeByParam("id", organizationMainPagePid, null);
            organizationPageLeffTree.addNodes(parentZNode,data, false);
        }, function (response) {

        });
    }

    /**
     *  搜索节点
     */
    function organizationMainPageSearchZtreeNode() {
        var searchZtreeValue = $.trim($("#organization-mainPage-nodeName-search").val());
       organizationMainPageZtreeUpdateNodes(organizationMainPageZtreeNodeList,false);
        if (searchZtreeValue == "") {
            return;
        }
        organizationPageLeffTree = $.fn.zTree.getZTreeObj("organization_mainPage_tree");
        var keyType = "name";
        organizationMainPageZtreeNodeList = organizationPageLeffTree.getNodesByParamFuzzy(keyType, searchZtreeValue);
        organizationMainPageZtreeUpdateNodes(organizationMainPageZtreeNodeList, true);
    };

    /**
     *  更新节点
     * @param organizationMainPageZtreeNodeList
     * @param highlight
     */
    function organizationMainPageZtreeUpdateNodes(organizationMainPageZtreeNodeList, highlight) {
        var curOrgParentNodes = [];
        for (var i = 0, l = organizationMainPageZtreeNodeList.length; i < l; i++) {
            var  curNode = organizationMainPageZtreeNodeList[i];
            curNode.highlight = highlight;
            // 获取父节点
            var pNode = curNode.getParentNode();
            if (pNode != null && curOrgParentNodes.indexOf(pNode.id) == -1) {
                curOrgParentNodes.push(pNode.id);
                organizationPageLeffTree.expandNode(pNode);
            }
            //定位到节点并展开
            organizationPageLeffTree.expandNode(curNode);
            organizationPageLeffTree.updateNode(curNode);
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
    function organizationMainPageZtreeMaxHeight() {
         var layGridHeight = $(".layui-form.layui-border-box.layui-table-view").height() + 2;
        $("#organization_mainPage_tree").css("min-height", layGridHeight);
        $("#organization_mainPage_tree").css("max-height", layGridHeight);
        $("#organization_mainPage_tree").css("border-bottom", "1px solid #e6e6e6");
    }

    /**
     * 初始化 功能按钮
     */
    var organizationMainPageInitFunctionButtonGroup = function () {
        //初始化 优先级 控件
        BootstrapTouchspin.initByteTouchSpin("#organization_mainPage_dataSubmit_form_org_seq");
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(organizationMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#organization-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#organization_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增组织结构">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="organization_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);


                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-offset="-20px -20px" data-container="body" data-toggle="tooltip" data-placement="top" title="修改组织结构" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);

            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除组织结构">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="organization_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="tooltip" data-placement="top" title=" 删除组织结构" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableToolbarHtml.append(table_del_btn_html);
            }
            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="organization_mainPage_sync_btn">\n';
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
    var organizationMainPageInitDataGrid = function () {
        layui.use('table', function(){
            var layuiForm = layui.form;
            organizationMainPageTable =  $initEncrypDataGrid({
                elem: '#organization_mainPage_grid',
                url: serverUrl + 'v1/table/organization/g',
                method:"get",
                where: {   //传递额外参数
                    'parentId' : organizationMainPagePid
                },
                headers: BaseUtils.serverHeaders(),
                title: '组织结构列表',
                height: 'full-150',
                initSort: {
                    field: 'seq', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'orgNumber', title:'结构代码'},
                    {field:'orgName', title:'结构名称'},
                    {field:'fullName', title:'结构全名称'},
                    {field:'fullParentCode', title:'上级结构代码'},
                    {field:'seq', title:'排序值'},
                    {field:'description', title:'描述', hide:true},
                    {field:'orgStatus', title:'状态', align: 'center', fixed: 'right', unresize:true,
                        templet : function (row) {
                            var value = row.orgStatus;
                            var spanCss = "m-badge--success";
                            if (value == 1)  {
                                spanCss = "m-badge--warning";
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + BaseUtils.statusText(value) + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#organization_mainPage_table_toolbar', align: 'center', width:200}
                ]],
                limit: 10,
                limits: [10,20,30,50]
            }, function(res, curr, count){
                organizationMainPageZtreeMaxHeight();
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(organizationMainPageModuleCode);
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
            organizationMainPageTable.on('tool(organization_mainPage_grid)', function(obj){
                if(obj.event === 'del'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    organizationMainPageDeleteData(obj);
                } else if(obj.event === 'edit'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    console.log(obj.data);
                    organizationMainPageSubmitForm.setForm(obj.data);
                    $("#organization_mainPage_dataSubmit_form_org_seq").val(obj.data.seq)
                    organizationMainPageMark = 2;
                    // 显示 dialog
                    organizationMainPageFormModal.modal('show');
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
                organizationMainPageUpdateDataStatus(obj, statusValue);
            });

            //监听行双击事件
            organizationMainPageTable.on('rowDouble(organization_mainPage_grid)', function(obj){
                organizationMainPageMark = 3;
                organizationMainPageSubmitForm.setForm(obj.data);
                $("#organization_mainPage_dataSubmit_form_org_seq").val(obj.data.seq)
                BaseUtils.readonlyForm(organizationMainPageSubmitFormId);
                organizationMainPageFormModal.modal('show');
            });
        });
    };

    /**
     * 刷新grid
     */
    var organizationMainPageRefreshGrid = function () {
        organizationMainPageTable.reload('organization_mainPage_grid',{
            where: {   //传递额外参数
                'parentId' : organizationMainPagePid
            },
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
    };

    /**
     * 刷新grid和tree
     */
    var organizationMainPageRefreshGridAndTree = function () {
        organizationMainPageRefreshGrid();
        //刷新树
        organizationMainPageRereshExpandNode(organizationMainPagePid);
    };

    /**
     * 初始化表单提交
     */
    var organizationMainPageFormSubmitHandle = function() {
        $('#organization_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            BaseUtils.formInputTrim(organizationMainPageSubmitFormId);
            if ($("#organization_mainPage_dataSubmit_form_parent_name").val() == "") {
                organizationMainPagePid = 0;
                organizationMainPageParentName = "";
            }
            organizationMainPageSubmitForm.validate({
                rules: {
                    orgNumber: {
                        required: true,
                        alnumCode:true,
                        maxlength: 15
                    },
                    orgName: {
                        required: true,
                        alnumName:true,
                        maxlength: 32
                    },
                    seq: {
                        range: [0,999]
                    },
                    description: {
                        illegitmacy:true,
                        maxlength: 100
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
            if (!organizationMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            BaseUtils.modalBlock("#organization_mainPage_dataSubmit_form_modal");
            $("#organization_mainPage_dataSubmit_form input[name='parentId']").val(organizationMainPagePid);
            $encryptPostAjax({
                url:serverUrl + "v1/verify/organization/s",
                data:organizationMainPageSubmitForm.serializeJSON(),
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                BaseUtils.modalUnblock("#organization_mainPage_dataSubmit_form_modal");
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                    // 刷新表格
                    organizationMainPageRefreshGridAndTree();
                    // 关闭 dialog
                    organizationMainPageFormModal.modal('hide');
                }
            }, function (data) {
                BaseUtils.modalUnblock("#organization_mainPage_dataSubmit_form_modal");
            });
            return false;
        });
    };

    /**
     *  清空表单数据和样式
     */
    var organizationMainPageCleanForm = function () {
        BaseUtils.cleanFormData(organizationMainPageSubmitForm);
    };

    /**
     * 删除
     */
    var organizationMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var  ajaxDelUrl = serverUrl + "v1/verify/organization/d/b";
        var delData = null;
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.id);
        } else {
            // 获取选中的数据对象
            var checkRows = organizationMainPageTable.checkStatus('organization_mainPage_grid');
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
                $encrypDeleteAjax({
                    url:ajaxDelUrl,
                    data: delData,
                    headers: BaseUtils.serverHeaders()
                }, function (response) {
                    if (response.success) {
                        if (obj != null) {
                            obj.del();
                            organizationMainPageRereshExpandNode(organizationMainPagePid);
                        } else {
                            organizationMainPageRefreshGridAndTree();
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
    var organizationMainPageUpdateDataStatus = function(obj,status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/organization/p/b";
        var putData = null;
        var idsArray = [];
        var putParams = [];
        if (obj != null) {
            var dataVersion = $(obj.elem.outerHTML).attr("dataversion");
            var curDataParam = {
                "id":obj.value,
                "dataVersion":dataVersion
            }
            putParams.push(curDataParam);
            idsArray.push(obj.value);
        } else {
            // 获取选中的数据对象
            var checkRows = organizationMainPageTable.checkStatus('organization_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    var curDataParam = {
                        "id":element.id,
                        "dataVersion":element.dataVersion
                    }
                    putParams.push(curDataParam);
                    idsArray.push(element.id);
                });

            }
        }
        putData = {
            'ids' : JSON.stringify(idsArray),
            'putParams' : JSON.stringify(putParams),
            'status' : status
        };
        if (idsArray.length > 0) {
            BaseUtils.pageMsgBlock();
            $encrypPutAjax({
                url: ajaxPutUrl,
                data:putData,
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                if (response.success) {
                    organizationMainPageRefreshGridAndTree();
                }  else if (response.status == 202) {
                    if (status == 1) {
                        obj.othis.removeClass("layui-form-checked");
                    } else {
                        obj.othis.addClass("layui-form-checked");
                    }
                    layer.tips(BaseUtils.updateMsg, obj.othis,  {
                        tips: [4, '#f4516c']
                    });
                }  else if (response.status == 409) {
                    organizationMainPageRefreshGrid();
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
    var organizationMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/organization/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                organizationMainPagePid = 0;
                organizationMainPageZtreeNodeList = [];
                organizationMainPageRefreshGridAndTree();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };



    var organizationMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#organization_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {
            var selectedNodes = organizationPageLeffTree.getSelectedNodes();
            if (selectedNodes.length > 0) {
                var selectedNode = selectedNodes[0];
                organizationMainPageParentName = selectedNode.name;
                organizationMainPagePid = selectedNode.id;
            }
            var modalDialogTitle = "新增组织结构";
            if (organizationMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(organizationMainPageSubmitFormId);
                $("#organization_mainPage_dataSubmit_form_org_seq").val(10);
                $(".glyphicon.glyphicon-remove.form-control-feedback").show();
            }
            $("#organization_mainPage_dataSubmit_form_parent_name").val(organizationMainPageParentName);
            if (organizationMainPageMark == 2) {
                modalDialogTitle = "修改组织结构";
                BaseUtils.cleanFormReadonly(organizationMainPageSubmitFormId);
                $("#organization_mainPage_dataSubmit_form_org_number").addClass("m-input--solid");
                $("#organization_mainPage_dataSubmit_form_org_number").attr("readonly", "readonly");
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
            }
            $("#org-fullName-form-div").hide();
            $(".has-danger-error").show();
            $("#organization_mainPage_dataSubmit_form_submit").show();
            $("#organization_mainPage_dataSubmit_form_parent_name").addClass("m-input--solid");
            $("#organization_mainPage_dataSubmit_form_parent_name").attr("readonly", "readonly");
            if (organizationMainPageMark == 3) {
                modalDialogTitle = "组织结构信息";
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
                $("#org-fullName-form-div").show();
                $(".has-danger-error").hide();
                $("#organization_mainPage_dataSubmit_form_submit").hide();
            }
            var modalDialog = $(this);
            modalDialog.find('.modal-title').text(modalDialogTitle);
            // 居中显示
            $(this).css('display', 'block');
            var modalHeight = $(window).height() / 2 - $('#organization_mainPage_dataSubmit_form_modal .modal-dialog').height() / 2;
            $(this).find('.modal-dialog').css({
                'margin-top': modalHeight - 120
            });
        });

        // 当调用 hide 实例方法时触发。
        $('#organization_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            organizationMainPageCleanForm();
            $(".modal-backdrop").remove();
            BaseUtils.modalUnblock("#organization_mainPage_dataSubmit_form_modal");

        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            organizationMainPageInitFunctionButtonGroup();
            organizationMainPageInitTree();
            organizationMainPageInitDataGrid();
            organizationMainPageInitModalDialog();
            organizationMainPageFormSubmitHandle();
            $('#organization_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                organizationMainPageDeleteData(null);
                return false;
            });
            $('#organization_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                organizationMainPageMark = 1;
                // 显示 dialog
                organizationMainPageFormModal.modal('show');
                return false;
            });
            $('#organization_mainPage_searchNode_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                organizationMainPageSearchZtreeNode();
                return false;
            });
            $('#organization_mainPage_reload_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                organizationMainPagePid = 0;
                $("#organization_mainPage_dataSubmit_form_parent_name").val("");
                organizationMainPageRefreshGridAndTree();
                return false;
            });
            $('#organization_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                organizationMainPageSyncData();
                return false;
            });

            window.onresize = function(){
                organizationMainPageTable.resize("organization_mainPage_grid");
                organizationMainPageZtreeMaxHeight();
            }

        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageOrganization.init();
});