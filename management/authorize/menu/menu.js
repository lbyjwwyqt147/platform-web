/***
 * 菜单资源
 * @type {{init}}
 */
var SnippetMainPageMenu = function() {
    var serverUrl = BaseUtils.serverAddress;
    var menuMainPageTable;
    var menuMainPageFormModal = $('#menu_mainPage_dataSubmit_form_modal');
    var menuMainPageSubmitForm = $("#menu_mainPage_dataSubmit_form");
    var menuMainPageSubmitFormId = "#menu_mainPage_dataSubmit_form";
    var menuMainPageMark = 1;
    var menuMainPagePid = 0;
    var menuMainPageParentName = "";
    var $menuNodeClassify = "";
    var menuMainPageZtreeNodeList = [];
    var menuMainPageModuleCode = '10023';
    var menuPageLeffTree;
    var $menuPathDiv = $("#menu-path-div");
    var $menuAuthorizationCodeDiv = $("#menu-authorization-code-div");
    var $menuIconDiv = $("#menu-icon-div");
    var $menuIcon = $("#menu-icon");
    var $buttonCategoryDiv = $("#button-category-div");
    var $menuNumberDiv = $('#menu-number-div');

    /**
     * ztree 基础属性
     * @type {{onClick: callback.onClick, onAmenuMainPageSyncDataSuccess: callback.onAmenuMainPageSyncDataSuccess}}
     */
    var menuMainPageZtreeSetting = BaseUtils.ztree.settingZtreeProperty({
        "selectedMulti":false,
        "enable":false,
        "url":serverUrl + "v1/tree/menu/all/z",
        "headers":BaseUtils.serverHeaders()
    });
    menuMainPageZtreeSetting.view = {
            selectedMulti:false,
            fontCss: zTreeHighlightFontCss,
            expandSpeed: "slow", //节点展开动画速度
    };
    menuMainPageZtreeSetting.callback = {
        onClick: function (event, treeId, treeNode) {   //点击节点执行事件
            menuMainPagePid = treeNode.id;
            menuMainPageParentName = treeNode.name;
            $menuNodeClassify = treeNode.otherAttributes.menuClassify;
            menuMainPageRefreshGrid();
        },
        onAsyncSuccess:function(event, treeId, treeNode, msg){ //异步加载完成后执行
            if ("undefined" == $("#menu_mainPage_tree_1_a").attr("title")) {
                $("#menu_mainPage_tree_1").remove();
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
    var menuMainPageInitTree = function() {
        $.fn.zTree.init($("#menu_mainPage_tree"), menuMainPageZtreeSetting);
        menuPageLeffTree = $.fn.zTree.getZTreeObj("menu_mainPage_tree");
    };


    /**
     * 刷新 指定 节点
     * 在指定的节点下面增加子节点之后调用的方法。
     * @param id
     */
    function menuMainPageRereshExpandNode(id) {
        if (id == 0) {
            menuMainPageRereshTree();
            return;
        }
        menuPageLeffTree = $.fn.zTree.getZTreeObj("menu_mainPage_tree");
        var nodes = menuPageLeffTree.getNodesByParam("id", id, null);
       if (nodes[0].children == null || nodes[0].children == undefined || nodes[0].children.length == 0) {
           menuMainPageRereshTreeNode(id);
       }
       BaseUtils.ztree.rereshExpandNode(menuPageLeffTree, id);
    }


    /**
     *  刷新树
     * @param id
     */
    function menuMainPageRereshTree(){
        menuPageLeffTree = $.fn.zTree.getZTreeObj("menu_mainPage_tree");
        menuPageLeffTree.destroy();
        menuMainPageInitTree();
    };

    /**
     * 异步加载ztree 数数据
     * @param id
     */
    function menuMainPageRereshTreeNode(id) {
        $getAjax({
            url: serverUrl + "v1/tree/menu/all/z",
            data: {
                id:id
            },
            headers: BaseUtils.serverHeaders()
        }, function (data) {
            //获取指定父节点
            menuPageLeffTree = $.fn.zTree.getZTreeObj("menu_mainPage_tree");
            var parentZNode = menuPageLeffTree.getNodeByParam("id", menuMainPagePid, null);
            menuPageLeffTree.addNodes(parentZNode,data, false);
        }, function (response) {

        });
    }

    /**
     *  搜索节点
     */
    function menuMainPageSearchZtreeNode() {
        var searchZtreeValue = $.trim($("#menu-mainPage-nodeName-search").val());
       menuMainPageZtreeUpdateNodes(menuMainPageZtreeNodeList,false);
        if (searchZtreeValue == "") {
            return;
        }
        var keyType = "name";
        menuPageLeffTree = $.fn.zTree.getZTreeObj("menu_mainPage_tree");
        menuMainPageZtreeNodeList = menuPageLeffTree.getNodesByParamFuzzy(keyType, searchZtreeValue);
        menuMainPageZtreeUpdateNodes(menuMainPageZtreeNodeList, true);
    };

    /**
     *  更新节点
     * @param menuMainPageZtreeNodeList
     * @param highlight
     */
    function menuMainPageZtreeUpdateNodes(menuMainPageZtreeNodeList, highlight) {
        var curmenuParentNodes = [];
        for (var i = 0, l = menuMainPageZtreeNodeList.length; i < l; i++) {
            var  curNode = menuMainPageZtreeNodeList[i];
            curNode.highlight = highlight;
            // 获取父节点
            var pNode = curNode.getParentNode();
            if (pNode != null && curmenuParentNodes.indexOf(pNode.id) == -1) {
                curmenuParentNodes.push(pNode.id);
                menuPageLeffTree.expandNode(pNode);
            }
            //定位到节点并展开
            menuPageLeffTree.expandNode(curNode);
            menuPageLeffTree.updateNode(curNode);
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
    function menuMainPageZtreeMaxHeight() {
        var layGridHeight = $(".layui-form.layui-border-box.layui-table-view").height() + 2;
        $("#menu_mainPage_tree").css("min-height", layGridHeight);
        $("#menu_mainPage_tree").css("max-height", layGridHeight);
        $("#menu_mainPage_tree").css("border-bottom", "1px solid #e6e6e6");
    }

    /**
     * 初始化 功能按钮
     */
    var menuMainPageInitFunctionButtonGroup = function () {
        //初始化 优先级 控件
        BootstrapTouchspin.initByteTouchSpin("#menu_mainPage_dataSubmit_form_menu_seq");
        $(".m_selectpicker").selectpicker({
            noneSelectedText : '请选择'
        });
        $("#menu-classify").on("changed.bs.select",function(e){
            var curSelectedValue = e.target.value;
            initMenuSelected(curSelectedValue);
        });
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(menuMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#menu-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#menu_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增资源">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="menu_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);


                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only"  data-toggle="tooltip" title="修改资源" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);

            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除资源">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="menu_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-toggle="tooltip"  title=" 删除资源" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableToolbarHtml.append(table_del_btn_html);
            }
            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="menu_mainPage_sync_btn">\n';
                sync_btn_html += '<i class="la la-rotate-right"></i>\n';
                sync_btn_html += '</a>\n';
                sync_btn_html += '</li>\n';
                gridHeadToolsHtml.append(sync_btn_html);
            }
        }
        // Tooltip
        $('[data-toggle="m-tooltip"]').tooltip();
    };

    var initMenuSelected = function(curSelectedValue) {
        if (curSelectedValue == 1 )  {
            $menuPathDiv.hide();
            $("#menu-path").val("");
            $menuAuthorizationCodeDiv.hide();
            $("#menu-authorization-code").val("");
            $menuIconDiv.show();
            $menuIcon.removeAttr("readonly");
            $buttonCategoryDiv.hide();
            $menuNumberDiv.show();
        } else if (curSelectedValue == 3) {
            $menuIconDiv.hide();
            $menuIcon.val("");
            $menuPathDiv.show();
            $menuAuthorizationCodeDiv.show();
            $buttonCategoryDiv.show();
            $menuNumberDiv.hide();
        } else if (curSelectedValue == 2) {
            $menuIconDiv.show();
            $menuIcon.val("la-outdent");
            $menuIcon.attr("readonly", "readonly");
            $menuPathDiv.show();
            $menuAuthorizationCodeDiv.hide();
            $buttonCategoryDiv.hide();
            $menuNumberDiv.show();
        }
    };

    /**
     * select 控件回显值
     */
    var initStaffSelected = function (obj) {
        $('#button-category').selectpicker('val', obj.buttonCategory);
        $('#menu-classify').selectpicker('val', obj.menuClassify);
        $("#menu_mainPage_dataSubmit_form_menu_seq").val(obj.serialNumber);
    };

    /**
     *  初始化 dataGrid 组件
     */
    var menuMainPageInitDataGrid = function () {
        layui.use('table', function(){
            // menuMainPageTable = layui.table;
            var layuiForm = layui.form;
            menuMainPageTable =  $initDataGrid({
                elem: '#menu_mainPage_grid',
                url: serverUrl + 'v1/table/menu/g',
                method:"get",
                where: {   //传递额外参数
                    'parentId' : menuMainPagePid
                },
                headers: BaseUtils.serverHeaders(),
                title: '资源列表',
                height: 'full-150',
                initSort: {
                    field: 'serialNumber', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'menuNumber', title:'资源编号'},
                    {field:'menuName', title:'资源名称'},
                    {field:'menuClassify', title:'资源类型',
                        templet : function (row) {
                            var clasValue = row.menuClassify;
                            var vtext = "";
                            if (clasValue == 2)  {
                                vtext = "界面";
                            } else if (clasValue == 3) {
                                vtext = "按钮";
                            } else if (clasValue == 1) {
                                vtext = "目录";
                            }
                            return vtext;
                        }
                     },
                    {field:'menuPath', title:'资源路径'},
                    {field:'serialNumber', title:'排序值'},
                    {field:'menuAuthorizationCode', title:'授权代码'},
                    {field:'menuDescription', title:'描述'},
                    {field:'menuStatus', title:'状态', align: 'center', fixed: 'right', unresize:true,
                        templet : function (row) {
                            var value = row.menuStatus;
                            var spanCss = "m-badge--success";
                            if (value == 1)  {
                                spanCss = "m-badge--warning";
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + BaseUtils.statusText(value) + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#menu_mainPage_table_toolbar', align: 'center', width:200}
                ]],
                limit: 20,
                limits: [20,30,40,50]
            }, function(res, curr, count){
                menuMainPageZtreeMaxHeight();
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(menuMainPageModuleCode);
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
            menuMainPageTable.on('tool(menu_mainPage_grid)', function(obj){
                if(obj.event === 'del'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    menuMainPageDeleteData(obj);
                } else if(obj.event === 'edit'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    menuMainPageSubmitForm.setForm(obj.data);
                    menuMainPageMark = 2;
                    initStaffSelected(obj.data);
                    // 显示 dialog
                    menuMainPageFormModal.modal('show');
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
                menuMainPageUpdateDataStatus(obj, statusValue);
            });

            //监听行双击事件
            menuMainPageTable.on('rowDouble(menu_mainPage_grid)', function(obj){
                menuMainPageMark = 3;
                menuMainPageSubmitForm.setForm(obj.data);
                BaseUtils.readonlyForm(menuMainPageSubmitFormId);
                initStaffSelected(obj);
                menuMainPageFormModal.modal('show');
            });
        });
    };

    /**
     * 刷新grid
     */
    var menuMainPageRefreshGrid = function () {
        menuMainPageTable.reload('menu_mainPage_grid',{
            where: {   //传递额外参数
                'parentId' : menuMainPagePid
            },
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
    };

    /**
     * 刷新grid和tree
     */
    var menuMainPageRefreshGridAndTree = function () {
        menuMainPageRefreshGrid();
        //刷新树
        menuMainPageRereshExpandNode(menuMainPagePid);
    };

    /**
     * 初始化表单提交
     */
    var menuMainPageFormSubmitHandle = function() {
        $('#menu_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            BaseUtils.formInputTrim(menuMainPageSubmitFormId);
            if ($("#menu_mainPage_dataSubmit_form_parent_name").val() == "") {
                menuMainPagePid = 0;
                menuMainPageParentName = "";
            }
            menuMainPageSubmitForm.validate({
                rules: {
                    menuNumber: {
                        required: true,
                        alnumCode:true,
                        maxlength: 15
                    },
                    menuName: {
                        required: true,
                        chcharacter:true,
                        maxlength: 32
                    },
                    menuPath: {
                        maxlength: 255
                    },
                    menuIcon: {
                        maxlength: 32
                    },
                    menuAuthorizationCode: {
                        englishLetter:true,
                        maxlength: 15
                    },
                    menuDescription: {
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
            if (!menuMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            BaseUtils.modalBlock("#menu_mainPage_dataSubmit_form_modal");
            $("#menu_mainPage_dataSubmit_form input[name='parentId']").val(menuMainPagePid);
            if ($("#menu-classify").val() == 3) {
                $("#menu_mainPage_dataSubmit_form_menu_number").val($("#button-category").val());
            }
            $postAjax({
                url:serverUrl + "v1/verify/menu/s",
                data:menuMainPageSubmitForm.serializeJSON(),
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                BaseUtils.modalUnblock("#menu_mainPage_dataSubmit_form_modal");
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                    // 刷新表格
                    menuMainPageRefreshGridAndTree();
                    // 关闭 dialog
                    menuMainPageFormModal.modal('hide');
                } else if (response.status == 409) {
                    menuMainPageRefreshGridAndTree();
                }
            }, function (data) {
                BaseUtils.modalUnblock("#menu_mainPage_dataSubmit_form_modal");
            });
            return false;
        });
    };

    /**
     *  清空表单数据和样式
     */
    var menuMainPageCleanForm = function () {
        BaseUtils.cleanFormData(menuMainPageSubmitForm);
    };

    /**
     * 删除
     */
    var menuMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var  ajaxDelUrl = serverUrl + "v1/verify/menu/d/b";
        var delData = null;
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.id);
        } else {
            // 获取选中的数据对象
            var checkRows = menuMainPageTable.checkStatus('menu_mainPage_grid');
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
        };
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
                            menuMainPageRereshExpandNode(menuMainPagePid);
                        } else {
                            menuMainPageRefreshGridAndTree();
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
    var menuMainPageUpdateDataStatus = function(obj,status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/menu/p/b";
        var putData = null;
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.value);
        } else {
            // 获取选中的数据对象
            var checkRows = menuMainPageTable.checkStatus('menu_mainPage_grid');
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
                    menuMainPageRefreshGridAndTree();
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
                      menuMainPageRefreshGrid();
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
    var menuMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/menu/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                menuMainPagePid = 0;
                menuMainPageZtreeNodeList = [];
                menuMainPageRefreshGridAndTree();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };



    var menuMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#menu_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {
            var selectedNodes = menuPageLeffTree.getSelectedNodes();
            if (selectedNodes.length > 0) {
                var selectedNode = selectedNodes[0];
                menuMainPageParentName = selectedNode.name;
                menuMainPagePid = selectedNode.id;
                $menuNodeClassify = selectedNode.otherAttributes.menuClassify;
            }
            var $menuClassify = $('#menu-classify');
            if ($menuNodeClassify == 1) {
                $menuClassify.selectpicker('val', 2);
            } else if ($menuNodeClassify == 2) {
                $menuClassify.selectpicker('val', 3);
            }
            var $menuParentName = $("#menu_mainPage_dataSubmit_form_parent_name");
            var modalDialogTitle = "新增资源";
            if (menuMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(menuMainPageSubmitFormId);
                $("#menu_mainPage_dataSubmit_form_menu_seq").val(10);
                $(".glyphicon.glyphicon-remove.form-control-feedback").show();
            }
            $menuParentName.val(menuMainPageParentName);
            if (menuMainPageMark == 2) {
                modalDialogTitle = "修改资源";
                BaseUtils.cleanFormReadonly(menuMainPageSubmitFormId);
                $menuClassify.parent(".bootstrap-select").attr("disabled", "true");
                $menuClassify.attr("readonly", "true");
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
            }
            $(".has-danger-error").show();
            $("#menu_mainPage_dataSubmit_form_submit").show();
            $menuParentName.addClass("m-input--solid");
            $menuParentName.attr("readonly", "readonly");
            if (menuMainPageMark == 3) {
                modalDialogTitle = "资源信息";
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
                $(".has-danger-error").hide();
                $("#menu_mainPage_dataSubmit_form_submit").hide();
            }
            initMenuSelected($("#menu-classify").val());
            var modalDialog = $(this);
            modalDialog.find('.modal-title').text(modalDialogTitle);
            // 剧中显示
            $(this).css('display', 'block');
            var modalHeight = $(window).height() / 2 - $('#menu_mainPage_dataSubmit_form_modal .modal-dialog').height() / 2;
            $(this).find('.modal-dialog').css({
                'margin-top': modalHeight - 120
            });
        });

        // 当调用 hide 实例方法时触发。
        $('#menu_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            menuMainPageCleanForm();
            $(".modal-backdrop").remove();
            BaseUtils.modalUnblock("#menu_mainPage_dataSubmit_form_modal");
            $menuIcon.show();
            $menuPathDiv.hide();
            $menuAuthorizationCodeDiv.hide();
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            menuMainPageInitFunctionButtonGroup();
            menuMainPageInitTree();
            menuMainPageInitDataGrid();
            menuMainPageInitModalDialog();
            menuMainPageFormSubmitHandle();
            $('#menu_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                menuMainPageDeleteData(null);
                return false;
            });
            $('#menu_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                if ($menuNodeClassify == 3) {
                    toastr.warning("你选择的按钮资源不符合新增要,请重新选择!");
                    return;
                }
                menuMainPageMark = 1;
                // 显示 dialog
                menuMainPageFormModal.modal('show');
                return false;
            });
            $('#menu_mainPage_searchNode_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                menuMainPageSearchZtreeNode();
                return false;
            });
            $('#menu_mainPage_reload_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                menuMainPagePid = 0;
                $menuNodeClassify = "";
                $("#menu_mainPage_dataSubmit_form_parent_name").val("");
                menuMainPageRefreshGridAndTree();
                return false;
            });
            $('#menu_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                menuMainPageSyncData();
                return false;
            });

            window.onresize = function(){
                menuMainPageTable.resize("menu_mainPage_grid");
                menuMainPageZtreeMaxHeight();
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageMenu.init();
});