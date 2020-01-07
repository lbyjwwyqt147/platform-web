//== Class Definition
var SnippetMainPageHomeIndex = function() {
    var serverUrl = BaseUtils.serverAddress;
    var layer;
    /**
     * 初始化菜单数据项
     */
    var  initHomeMenuData = function () {
        // 测试使用代码
        BaseUtils.setCookie(BaseUtils.user_access_token, "123456", 1 );

        var userInfo = BaseUtils.getCurrentUser();
        var loginUserId = userInfo.userId;
        $.ajax({
            type: "GET",
            url: "module.json",
           // url: serverUrl + "v1/tree/role/resource/menu",
            data: {
                userId: loginUserId
            },
            dataType: "json",
            headers: BaseUtils.serverHeaders(),
            success:function (response) {
                if (response.success) {
                    var $menuHtml = $("#home_menu_home_page");
                    var ulHtml = "\n";
                    $.each(response.data, function (i, v) {
                        var root = v;
                        // 将页面功能按钮信息存放到本地
                        if (root.functionButtonGroup != null && root.functionButtonGroup.length > 0) {
                             BaseUtils.setCookie(BaseUtils.functionButtonKey + root.moduleCode, root.functionButtonGroup.join(';'));
                        }
                        var liRootHtml = '<li class="m-menu__item m-menu__item--submenu" aria-haspopup="true">\n';
                        if (root.moduleType == 2) {
                            liRootHtml += '<a href="javascript:;" class="m-menu__link m-menu__toggle m-menu__link_css" id="left_menu_' +  root.id + '"   data-type="tabAdd" data-index="' + root.id + '" data-title="' + root.moduleName + '" data-url="' + root.menuOpenUrl + '">\n';
                        } else {
                            liRootHtml += '<a href="javascript:;" class="m-menu__link m-menu__toggle m-menu__link_css">\n';
                        }
                        liRootHtml += '<i class="m-menu__link-icon ' + root.menuIcon + '"></i>\n';
                        liRootHtml += '<span class="m-menu__link-text">' + root.moduleName + '</span>\n';
                        liRootHtml += '<i class="m-menu__ver-arrow la la-angle-right"></i>\n';
                        liRootHtml += '</a>\n';

                        var children = v.children;
                        if (children != null && children.length > 0) {
                            var liChildrenRootHtml = '<div class="m-menu__submenu ">\n';
                            liChildrenRootHtml += '<span class="m-menu__arrow"></span>\n';
                            liChildrenRootHtml += '<ul class="m-menu__subnav">\n';
                            $.each(children, function (ci, cv) {
                                if (cv.functionButtonGroup != null && cv.functionButtonGroup.length > 0) {
                                    BaseUtils.setCookie(BaseUtils.functionButtonKey + cv.moduleCode, cv.functionButtonGroup.join(';'));
                                }
                                    var liChildrenHtml = '<li class="m-menu__item " aria-haspopup="true">\n';
                               if (cv.moduleType == 2) {
                                   liChildrenHtml += '<a href="javascript:;" class="m-menu__link m-menu__link_css" id="left_menu_' +  cv.id + '"  data-type="tabAdd" data-index="' + cv.id + '" data-title="' + cv.moduleName + '" data-url="' + cv.menuOpenUrl + '">\n';
                               }else {
                                   liChildrenHtml += '<a href="javascript:;" class="m-menu__link m-menu__link_css">\n';
                               }
                               liChildrenHtml += '<i class="m-menu__link-icon la ' + cv.menuIcon + '"></i>\n\n';
                               liChildrenHtml += '<span class="m-menu__link-text">'+ cv.moduleName +'</span>\n';
                               liChildrenHtml += '</a>\n';
                               liChildrenHtml += '</li>\n';
                               liChildrenRootHtml += liChildrenHtml;
                            });
                            liChildrenRootHtml += '</ul>\n';
                            liRootHtml += liChildrenRootHtml;
                        }
                        liRootHtml += '</li>\n';
                        ulHtml += liRootHtml + "\n";
                    });
                    $menuHtml.after(ulHtml);
                } else {

                }
                initHomeMenuEvent();
                initHomeContentTab();
            },
            error:function () {
                toastr.error(BaseUtils.networkErrorMsg);
            }
        });
        $("#home_m_card_user_name").html(userInfo.userName);
        $("#home_m_card_user_phone").html(userInfo.mobilePhone);
        if (userInfo.portrait != null && userInfo.portrait != '')  {
            $("#m-user-img").attr("src", userInfo.portrait);
        }
    };

    /**
     * 菜单点击事件
     */
    var initHomeMenuEvent = function () {
        // 鼠标移到菜单事件
        $('.m-menu__link_css').mouseout(function(element){
            $(this).children('i').css('color','#0C0C0C');
            $(this).children('span').css('color','#0C0C0C');
        }).mouseover(function(element){
            $(this).children('i').css('color','white');
            $(this).children('span').css('color','white');
        });

        //退出按钮事件
        $(".home_m_card_user_flaticon_logout").click(function (e) {
            e.preventDefault();
            var ajaxDelUrl = serverUrl + "v1/user/out";
            var accessToken =  BaseUtils.getCookie(BaseUtils.user_access_token);
            $deleteAjax({
                url:ajaxDelUrl,
                data: {
                    access_token: accessToken
                },
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                if (response.success) {
                    BaseUtils.delCookie(BaseUtils.user_access_token);
                    BaseUtils.delCookie(BaseUtils.user_info);
                    toastr.success("退出系统,即将重新登录!");
                    setTimeout(function (){
                        window.location.href = "login.html";
                    }, 2000);
                }
            }, function (data) {

            });
            return false;
        });

        $('#session-timeout-dialog-login').click(function(e) {
            e.preventDefault();
            window.location.href = "login.html";
            return false;
        });

        $('#session-timeout-dialog-close').click(function(e) {
            e.preventDefault();
            $("#session-timeout-dialog").hide();
            return false;
        });
    };


    /**
     * 初始化 Tab
     */
    var initHomeContentTab = function () {
        layui.use('layer', function() {
            layer = layui.layer;
        });
        layui.use('element', function(){
            var $ = layui.jquery
                ,element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
            //触发事件
            var active = {
                tabAdd: function(othis){
                    var index = othis.data('index'), title = othis.data('title'), target = othis.data('url');
                    var flag = true;
                    $(".layui-tab-title li").each(function () {
                        var layId = $(this).attr("lay-id");
                        if (index == layId) {
                            setingMenuCheckedCss($("#left_menu_" + index));
                            //切换到指定Tab项
                            element.tabChange('home_menu_content_tab', layId);
                            flag = false;
                        }
                    });
                    //新增一个Tab项
                    if (flag && target != null && target != '') {
                        // 添加选中样式
                        setingMenuCheckedCss(othis);
                        var tabHtmlContent  = "";
                        $.get(""+target+"",function(data) {
                            tabHtmlContent = data;
                            element.tabAdd('home_menu_content_tab', {
                                title:  title,
                                content:  tabHtmlContent,
                                id:  index
                            });
                            element.tabChange('home_menu_content_tab', index);
                        });

                        setTimeout(function(){
                                // 监听tab点击事件
                                $('.layui-tab-title > li').on('click', function(e){
                                    e.preventDefault();
                                    var curLayId = $(this).attr("lay-id");
                                    setingMenuCheckedCss($("#left_menu_" + curLayId));
                                })
                        },3000);
                    }
                }
            };

            // 监听菜单点击事件
            $('.m-menu__link_css').on('click', function(e){
                e.preventDefault();
                var othis = $(this), type = othis.data('type') ;
                active[type] ? active[type].call(this, othis) : '';
            });

            // 监听选项卡切换 Tab选项卡点击切换时触发
            element.on('tab(home_menu_content_tab)', function(data){
                $(".layui-tab.layui-tab-card ul li[lay-id]").css("border-right","1px solid lightgrey");
                $(this).css("border-right","none");
            });

            // 监听选项卡删除 ab选项卡被删除时触发
            element.on('tabDelete(home_menu_content_tab)', function(data){
                var curLayId = $(".layui-this").attr("lay-id");
                setingMenuCheckedCss($("#left_menu_" + curLayId))
            });
        });
    };

    /**
     * 设置 菜单选中样式
     * @param element
     */
    var setingMenuCheckedCss = function (element) {
        var menuClickCss = '<span class="m-menu__item-here"></span>'
        $(".m-menu__item--active").removeClass("m-menu__item--active");
        element.parent('.m-menu__item').addClass("m-menu__item--active");
        $(".m-menu__item-here").remove();
        element.children('i').before(menuClickCss);
    }

    //== Public Functions
    return {
        // public functions
        init: function() {
            initHomeMenuData();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageHomeIndex.init();
});