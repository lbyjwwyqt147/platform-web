/***
 * 角色资源
 * @type {{init}}
 */
var SnippetMainPageroleResource = function() {
    var serverUrl = BaseUtils.serverAddress;
    var roleResourceMainPageTable;
    var roleResourceMainPagePid = 0;
    var roleResourceMainPageModuleCode = '10025';
    var roleResourcePageLeffTree;
    var roleId = 0;
    var mark = 0;




    /**
     * 初始化ztree 组件
     */
    var roleResourceMainPageInitTree = function() {
        /**
         * ztree 基础属性
         * @type {{onClick: callback.onClick, onAroleResourceMainPageSyncDataSuccess: callback.onAroleResourceMainPageSyncDataSuccess}}
         */
        var roleResourceMainPageZtreeSetting = BaseUtils.ztree.settingZtreeProperty({
            "selectedMulti":true,
            "chkboxType" : {"Y" : "ps", "N" : "ps"},
            "enable":false,
            "url":serverUrl + "v1/tree/role/resource/z?roleId="+ roleId,
            "headers":BaseUtils.serverHeaders()
        });
        roleResourceMainPageZtreeSetting.view = {
            selectedMulti:false,
            expandSpeed: "slow", //节点展开动画速度
        };

        roleResourceMainPageZtreeSetting.callback = {
            onClick: function (event, treeId, treeNode) {   //点击节点执行事件

            },
            onAsyncSuccess:function(event, treeId, treeNode, msg){ //异步加载完成后执行
                if ("undefined" == $("#role-resource_mainPage_tree_1_a").attr("title")) {
                    $("#role-resource_mainPage_tree_1").remove();
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
        $.fn.zTree.init($("#role-resource_mainPage_tree"), roleResourceMainPageZtreeSetting);
        roleResourcePageLeffTree = $.fn.zTree.getZTreeObj("role-resource_mainPage_tree");
    };

    /**
     * 刷新 指定 节点
     * 在指定的节点下面增加子节点之后调用的方法。
     * @param id
     */
    function roleResourceMainPageRereshExpandNode(id) {
        if (id == 0) {
            roleResourceMainPageRereshTree();
            return;
        }
        roleResourcePageLeffTree = $.fn.zTree.getZTreeObj("role-resource_mainPage_tree");
        var nodes = roleResourcePageLeffTree.getNodesByParam("id", id, null);
       if (nodes[0].children == null || nodes[0].children == undefined || nodes[0].children.length == 0) {
           roleResourceMainPageRereshTreeNode(id);
       }
       BaseUtils.ztree.rereshExpandNode(roleResourcePageLeffTree, id);
    }


    /**
     *  刷新树
     * @param id
     */
    function roleResourceMainPageRereshTree(){
        roleResourcePageLeffTree = $.fn.zTree.getZTreeObj("role-resource_mainPage_tree");
        roleResourcePageLeffTree.destroy();
        roleResourceMainPageInitTree();
    };

    /**
     * 异步加载ztree 数数据
     * @param id
     */
    function roleResourceMainPageRereshTreeNode(id) {
        $getAjax({
            url: serverUrl + "v1/tree/role/resource/z",
            data: {
                "roleId" : roleId,
                "resourcePid" : id
            },
            headers: BaseUtils.serverHeaders()
        }, function (data) {
            //获取指定父节点
            roleResourcePageLeffTree = $.fn.zTree.getZTreeObj("role-resource_mainPage_tree");
            var parentZNode = roleResourcePageLeffTree.getNodeByParam("id", roleResourceMainPagePid, null);
            roleResourcePageLeffTree.addNodes(parentZNode,data, false);
        }, function (response) {

        });
    }

    /**
     * 设置 tree 最大高度样式
     */
    function roleResourceMainPageZtreeMaxHeight() {
        var layGridHeight = $(".layui-form.layui-border-box.layui-table-view").height();
        $("#role-resource_mainPage_tree").css("min-height", layGridHeight);
        $("#role-resource_mainPage_tree").css("max-height", layGridHeight);
    }

    /**
     * 初始化 功能按钮
     */
    var roleResourceMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(roleResourceMainPageModuleCode);
        if (functionButtonGroup != null) {
            var tableToolbarHtml = $("#role-resource_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" title="分配资源" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-star-half-full"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);
            }
            var table_look_btn_html = '<a href="javascript:;" class="btn btn-outline-accent m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" data-placement="top" title=" 查看资源" lay-event="look">\n'
            table_look_btn_html += '<i class="la la-eye"></i>\n';
            table_look_btn_html += '</a>\n';
            tableToolbarHtml.append(table_look_btn_html);
        }
        // Tooltip
        $('[data-toggle="m-tooltip"]').tooltip();
    };

    /**
     *  初始化 dataGrid 组件
     */
    var roleResourceMainPageInitDataGrid = function () {
        layui.use('table', function() {
            // roleResourceMainPageTable = layui.table;
            var layuiForm = layui.form;
            roleResourceMainPageTable = $initDataGrid({
                elem: '#role-resource_mainPage_grid',
                url: serverUrl + 'v1/table/role/g',
                method: "get",
                where: {   //传递额外参数
                    'parentId': 0,
                    'roleStatus': 0
                },
                headers: BaseUtils.serverHeaders(),
                title: '角色列表',
                height: 'full-170',
                initSort: {
                    field: 'id', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {type: 'radio', width: 70},
                    {field: 'id', title: 'ID', unresize: true, hide: true},
                    {field: 'roleNumber', title: '角色编号'},
                    {field: 'roleName', title: '角色名称'},
                    {field: 'roleAuthorizationCode', title: '授权代码'},
                    {field: 'roleDescription', title: '描述'},
                    {
                        fixed: 'right',
                        title: '操作',
                        unresize: true,
                        toolbar: '#role-resource_mainPage_table_toolbar',
                        align: 'center',
                        width: 100
                    }
                ]],
                limit: 20,
                limits: [20, 30, 40, 50]
            }, function (res, curr, count) {
                roleResourceMainPageZtreeMaxHeight();
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(roleResourceMainPageModuleCode);
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
            roleResourceMainPageTable.on('tool(role-resource_mainPage_grid)', function (obj) {
                if (obj.event === 'edit') {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    roleId = obj.data.id;
                    mark = 1;
                    var rowIndex = obj.tr[0].rowIndex;
                    $(".layui-table-view[lay-id='role-resource_mainPage_grid'] .layui-table-body tr[data-index = '" + rowIndex + "'] .layui-form-radio").click();
                }
                if (obj.event === 'look') {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    roleId = obj.data.id;
                    mark = 0;
                    var rowIndex = obj.tr[0].rowIndex;
                    $(".layui-table-view[lay-id='role-resource_mainPage_grid'] .layui-table-body tr[data-index = '" + rowIndex + "'] .layui-form-radio").click();
                }
            });

            //监听选中事件
            roleResourceMainPageTable.on('radio(role-resource_mainPage_grid)', function (obj) {
                console.log(roleId);
                if (mark == 1) {
                    $("#role-resource_mainPage_dataSubmit_form_submit").show();
                    mark = 0;
                } else {
                    $("#role-resource_mainPage_dataSubmit_form_submit").hide();
                }
                roleResourceMainPageRereshTree();
            });
        });
    };

    /**
     * 刷新grid
     */
    var roleResourceMainPageRefreshGrid = function () {
        var roleSearchName = $("#role-resource-mainPage-nodeName-search").val();
        roleResourceMainPageTable.reload('role-resource_mainPage_grid',{
            where: {   //传递额外参数
                'parentId' : roleResourceMainPagePid,
                'roleName' : roleSearchName
            },
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
        roleId = 0;
        roleResourceMainPageRereshTree();
    };

    /**
     * 刷新grid和tree
     */
    var roleResourceMainPageRefreshGridAndTree = function () {
        roleResourceMainPageRefreshGrid();
        //刷新树
        roleResourceMainPageRereshExpandNode(roleResourceMainPagePid);
    };

    /**
     * 初始化表单提交
     */
    var roleResourceMainPageFormSubmitHandle = function() {
        $('#role-resource_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var resourceIds = [];
            // 获取所有选中的节点
            var nodes = roleResourcePageLeffTree.getCheckedNodes(true);
            $.each(nodes, function (i, v) {
                resourceIds.push(v.id);
            });
            var formData = {
                roleId: roleId,
                resourceIds: resourceIds.join(",")
            };
            BaseUtils.pageMsgBlock();
            $postAjax({
                url:serverUrl + "v1/verify/role/resource/s",
                data:formData,
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                BaseUtils.htmPageUnblock();
                if (response.success) {
                    $("#role-resource_mainPage_dataSubmit_form_submit").hide();
                    mark == 0
                    toastr.success("资源分配成功.");
                } else if (response.status == 409) {

                }
            }, function (data) {
                BaseUtils.htmPageUnblock();
            });
            return false;
        });
    };

    /**
     *  同步数据
     */
    var roleResourceMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/role/resource/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                roleResourceMainPagePid = 0;
                roleId = 0;
                roleResourceMainPageRefreshGridAndTree();
                $("#role-resource_mainPage_dataSubmit_form_submit").hide();
                mark == 0
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };


    //== Public Functions
    return {
        // public functions
        init: function() {
            roleResourceMainPageInitFunctionButtonGroup();
            roleResourceMainPageInitTree();
            roleResourceMainPageInitDataGrid();
            roleResourceMainPageFormSubmitHandle();

            $('#role-resource_mainPage_searchNode_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                roleResourceMainPageRefreshGrid();
                return false;
            });

            $('#role-resource_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                roleResourceMainPageSyncData();
                return false;
            });

            window.onresize = function(){
                roleResourceMainPageTable.resize("role-resource_mainPage_grid");
                roleResourceMainPageZtreeMaxHeight();
            }

        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageroleResource.init();
});