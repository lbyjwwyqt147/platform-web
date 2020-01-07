/***
 * 角色角色
 * @type {{init}}
 */
var SnippetMainPageRoleUser = function() {
    var serverUrl = BaseUtils.serverAddress;
    var roleUserMainPageTable;
    var userRoleMainPageTable;
    var userRoleNotMainPageTable;
    var roleUserMainPageModuleCode = '10026';
    var userId = 0;
    
    /**
     * 初始化 功能按钮
     */
    var roleUserMainPageInitFunctionButtonGroup = function () {
        $('.m_selectpicker').selectpicker({
            noneSelectedText : '请选择'//默认显示内容
        });
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(roleUserMainPageModuleCode);
        if (functionButtonGroup != null) {
            var tableToolbarHtml = $("#role-user_mainPage_table_toolbar");
            var gridHeadToolsHtml = $("#role-user-mainPage-grid-head-tools");
            var gridRoleHeadToolsHtml = $("#user-role-mainPage-grid-head-tools");
            var tableRoleToolbarHtml = $("#user-role_mainPage_table_toolbar");


            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {

                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="分配角色">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="role_user_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);

                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" title="分配角色" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-star-half-full"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);
            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="移除角色">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="user_role_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridRoleHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" data-placement="top" title=" 移除角色" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableRoleToolbarHtml.append(table_del_btn_html);

            }
            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="role-user_mainPage_sync_btn">\n';
                sync_btn_html += '<i class="la la-rotate-right"></i>\n';
                sync_btn_html += '</a>\n';
                sync_btn_html += '</li>\n';
                gridHeadToolsHtml.append(sync_btn_html);
            }
            var table_look_btn_html = '<a href="javascript:;" class="btn btn-outline-accent m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" data-placement="top" title=" 查看角色" lay-event="look">\n'
            table_look_btn_html += '<i class="la la-eye"></i>\n';
            table_look_btn_html += '</a>\n';
            tableToolbarHtml.append(table_look_btn_html);
        }
        // Tooltip
        $('[data-toggle="m-tooltip"]').tooltip();
    };

    /**
     *  初始化 人员 dataGrid 组件
     */
    var roleUserMainPageInitDataGrid = function () {
        layui.use('table', function() {
            // roleUserMainPageTable = layui.table;
            var layuiForm = layui.form;
            roleUserMainPageTable = $initDataGrid({
                elem: '#role-user_mainPage_grid',
                url: serverUrl + 'v1/table/staff/g',
                method: "get",
                where: {   //传递额外参数
                    userStatus : 0,
                },
                headers: BaseUtils.serverHeaders(),
                title: '人员列表',
                height: 'full-170',
                initSort: {
                    field: 'id', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'userAccountsId', title:'ID', unresize:true, hide:true },
                    {field:'userNumber', title:'工号'},
                    {field:'userFullName', title:'姓名'},
                    {field:'userNickName', title:'昵称'},
                    {field:'mobilePhone', title:'手机号'},
                    {field:'staffOrgName', title:'所属部门'},
                    {field:'userPositionText', title:'职位'},
                    {field:'userCategory', title:'类别', align: 'center',
                        templet : function (row) {
                            // 0：超级管理员 1：普通管理员 2：内部职工 3：普通用户
                            var value = row.userCategory;
                            var spanHtml = "";
                            if (value == 0)  {
                                spanHtml = "超级管理员";
                            } else if (value == 1)  {
                                spanHtml = "普通管理员";
                            }else if (value == 2)  {
                                spanHtml = "职工";
                            }else if (value == 3)  {
                                spanHtml = "普通用户";
                            }
                            return spanHtml;
                        }
                    },
                    {
                        fixed: 'right',
                        title: '操作',
                        unresize: true,
                        toolbar: '#role-user_mainPage_table_toolbar',
                        align: 'center',
                        width: 100
                    }
                ]],
                limit: 20,
                limits: [20, 30, 40, 50]
            }, function (res, curr, count) {
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(roleUserMainPageModuleCode);
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
            roleUserMainPageTable.on('tool(role-user_mainPage_grid)', function (obj) {
                if (obj.event === 'edit') {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    userId = obj.data.userAccountsId;
                    userRoleMainPageRefreshGrid();
                    $('#role_user_mainPage_dataSubmit_form_modal').modal('show');
                }
                if (obj.event === 'look') {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    userId = obj.data.userAccountsId;
                    userRoleMainPageInitDataGrid();
                }
            });

        });
    };

    /**
     *  初始化角色 dataGrid 组件
     */
    var userRoleMainPageInitDataGrid = function () {
        layui.use('table', function() {
            // roleUserMainPageTable = layui.table;
            var layuiForm = layui.form;
            userRoleMainPageTable = $initDataGrid({
                elem: '#user-role_mainPage_grid',
                url: serverUrl + 'v1/table/role/user/g',
                method: "get",
                where: {   //传递额外参数
                    userId: userId
                },
                headers: BaseUtils.serverHeaders(),
                title: '角色列表',
                height: 'full-170',
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
                    {
                        fixed: 'right',
                        title: '操作',
                        unresize: true,
                        toolbar: '#user-role_mainPage_table_toolbar',
                        align: 'center',
                        width: 100
                    }
                ]],
                limit: 20,
                limits: [20, 30, 40, 50]
            }, function (res, curr, count) {
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(roleUserMainPageModuleCode);
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
            userRoleMainPageTable.on('tool(user-role_mainPage_grid)', function (obj) {
                if (obj.event === 'del') {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    roleUserMainPageDeleteData(obj);
                }
            });

        });
    };


    /**
     *  初始化角色 dataGrid 组件
     */
    var userRoleNotMainPageInitDataGrid = function () {
        layui.use('table', function() {
            // roleUserMainPageTable = layui.table;
            var layuiForm = layui.form;
            userRoleNotMainPageTable = $initDataGrid({
                elem: '#user-role-not_mainPage_grid',
                url: serverUrl + 'v1/table/role/user/g',
                method: "get",
                where: {   //传递额外参数
                    userId: userId,
                    roleId: 0
                },
                headers: BaseUtils.serverHeaders(),
                title: '角色列表',
                height: 'full-160',
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
                    {field:'roleDescription', title:'描述'}
                ]],
                limit: 20,
                limits: [20, 30, 40, 50]
            }, function (res, curr, count) {
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
            });
        });
    };

    /**
     * 刷新人员grid
     */
    var roleUserMainPageRefreshGrid = function () {
        var userSearchName = $("#userFull-name").val();
        var userSearchType = $("#query-userCategory").val();
        roleUserMainPageTable.reload('role-user_mainPage_grid',{
            where: {   //传递额外参数
                'userFullName' : userSearchName,
                'userCategory' : userSearchType
            },
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
        userId = 0;
        userRoleMainPageRefreshGrid();
    };

    /**
     * 刷新角色grid
     */
    var userRoleMainPageRefreshGrid = function () {
        userRoleMainPageTable.reload('user-role_mainPage_grid',{
            where: {   //传递额外参数
                userId: userId
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    };

    /**
     * 刷新角色grid
     */
    var userRoleNotMainPageRefreshGrid = function () {
        userRoleNotMainPageTable.reload('user-role-not_mainPage_grid',{
            where: {   //传递额外参数
                userId: userId
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    };

    /**
     * 重置查询条件
     */
    var roleUserMainPageRefreshGridQueryCondition = function () {
        $("#userFull-name").val("");
        $("#query-userCategory").selectpicker('val', '');
    };


    /**
     * 初始化表单提交
     */
    var roleUserMainPageFormSubmitHandle = function() {
        $('#role_user_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var userIds = [];
            // 获取选中的人员数据对象
            var checkUserRows = userRoleMainPageTable.checkStatus('role-user_mainPage_grid');
            var checkUserData = checkUserRows.data;
            if (checkUserData.length > 0) {
                $.each(checkUserData, function(index,element){
                    userIds.push(element.userAccountsId);
                });
            } else {
                if (userId != 0) {
                    userIds.push(userId);
                }
            }
            var roleIds = [];
            // 获取选中的角色数据对象
            var checkRoleRows = userRoleMainPageTable.checkStatus('user-role-not_mainPage_grid');
            var checkRoleData = checkRoleRows.data;
            if (checkRoleData.length > 0) {
                $.each(checkRoleData, function(index,element){
                    roleIds.push(element.id);
                });
            }
            var formData = {
                userIds: userIds.join(","),
                roleIds: roleIds.join(",")
            };
            if (roleIds.length > 0) {
                BaseUtils.modalBlock("#role_user_mainPage_dataSubmit_form_modal");
                $postAjax({
                    url:serverUrl + "v1/verify/role/user/s",
                    data:formData,
                    headers: BaseUtils.serverHeaders()
                }, function (response) {
                    BaseUtils.modalUnblock("#role_user_mainPage_dataSubmit_form_modal");
                    if (response.success) {
                        userRoleMainPageRefreshGrid();
                        $('#role_user_mainPage_dataSubmit_form_modal').modal('hide');
                    } else if (response.status == 409) {

                    }
                }, function (data) {
                    BaseUtils.htmPageUnblock();
                });
            }
            return false;
        });
    };

    /**
     * 删除角色
     */
    var roleUserMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        // 获取选中的人员数据对象
        var checkUserRows = userRoleMainPageTable.checkStatus('role-user_mainPage_grid');
        var checkUserData = checkUserRows.data;
        if (checkUserData.length > 0) {
            toastr.warning("一次只能对一个人员进行操作,请取消多选项!");
            return;
        }
        var  ajaxDelUrl = serverUrl + "v1/verify/role/user/d/b";
        var delData = null;
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.id);
        } else {
            // 获取选中的数据对象
            var checkRows = userRoleMainPageTable.checkStatus('user-role_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                });
            }
        }
        delData = {
            'id': userId,
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
                            userRoleMainPageRefreshGrid();
                        }
                    }
                }, function (data) {

                });
            }, function () {  //按钮【按钮二】的回调

            });
        }
    };


    /**
     *  同步数据
     */
    var roleUserMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/role/user/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                userId = 0;
                roleUserMainPageRefreshGrid();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };


    var roleUserMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#role_user_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {
            userRoleNotMainPageRefreshGrid();
            // 剧中显示
            $(this).css('display', 'block');;
            $(this).find('.modal-dialog').css({
                'margin-top': 10,
                'min-width': 750
            });
        });

        // 当调用 hide 实例方法时触发。
        $('#role_user_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {

        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            roleUserMainPageInitFunctionButtonGroup();
            roleUserMainPageInitDataGrid();
            userRoleMainPageInitDataGrid();
            userRoleNotMainPageInitDataGrid();
            roleUserMainPageFormSubmitHandle();
            roleUserMainPageInitModalDialog();
            $('#role-user-page-grid-query-btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                roleUserMainPageRefreshGrid();
                return false;
            });

            $('#role-user-page-grid-query-rotate-btn').click(function(e) {
                e.preventDefault();
                roleUserMainPageRefreshGridQueryCondition();
                return false;
            });

            $('#role-user_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                roleUserMainPageSyncData();
                return false;
            });
            $('#user_role_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                roleUserMainPageDeleteData(null);
                return false;
            });
            $('#role_user_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                // 获取选中的人员数据对象
                var checkUserRows = userRoleMainPageTable.checkStatus('role-user_mainPage_grid');
                var checkUserData = checkUserRows.data;
                if (checkUserData.length > 0) {
                    $('#role_user_mainPage_dataSubmit_form_modal').modal('show');
                }
                if (userId != 0) {

                }
                return false;
            });
            window.onresize = function(){
                roleUserMainPageTable.resize("role-user_mainPage_grid");
                userRoleMainPageTable.resize("user-role_mainPage_grid");
            }

        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageRoleUser.init();
});