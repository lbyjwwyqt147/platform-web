/***
 *
 * @type {{serverAddress: string, cloudServerAddress: string, secretKey: string, systemCode: string, appId: string, appKey: string, credential: string, saveSuccessMsg: string, saveFailMsg: string, delFailMsg: string, errorMsg: string, networkErrorMsg: string, enable: string, disabled: string, updateMsg: string, syncMsg: string, loadingErrorMsg: string, loginTimeOutMsg: string, functionButtonKey: string, user_access_token: string, ztree: {settingZtreeProperty: function(*): {check: {enable: $.jstree.core.check|check|{enable}|{enable, autoCheckTrigger, chkStyle, nocheckInherit, chkDisabledInherit, radioType, chkboxType}|a.validator.check|$.validator.check|*}, data: {simpleData: {enable: boolean, idKey: string, pIdKey: string, rootPId: number}}, edit: {enable: boolean}, async: {enable: boolean, type: string, headers: *, url: *, autoParam: string[]}}, rereshExpandNode: BaseUtils.ztree.rereshExpandNode, rereshzTree: BaseUtils.ztree.rereshzTree, rereshParentNode: BaseUtils.ztree.rereshParentNode, getZtreeHighlightFontCss: BaseUtils.ztree.getZtreeHighlightFontCss}, getCurrentFunctionButtonGroup: BaseUtils.getCurrentFunctionButtonGroup, checkLoginTimeout: BaseUtils.checkLoginTimeout, checkLoginTimeoutStatus: BaseUtils.checkLoginTimeoutStatus, checkIsLoginTimeOut: BaseUtils.checkIsLoginTimeOut, LoginTimeOutHandler: BaseUtils.LoginTimeOutHandler, setCookie: BaseUtils.setCookie, getCookie: function(*=): *, delCookie: BaseUtils.delCookie, setLocalStorage: BaseUtils.setLocalStorage, getLocalStorage: BaseUtils.getLocalStorage, deleteLocalStorage: BaseUtils.deleteLocalStorage, clearLocalStorage: BaseUtils.clearLocalStorage, textareaTo: function(*): *, toTextarea: function(*): *, datatTimeFormat: function(*=): string, datatHHmmFormat: function(*=): string, datatFormat: function(*=): string, zero_fill_hex: function(*, *): string, rgb2hex: BaseUtils.rgb2hex, statusText: function(*): string, formInputTrim: BaseUtils.formInputTrim, cleanFormData: BaseUtils.cleanFormData, readonlyForm: BaseUtils.readonlyForm, cleanFormReadonly: BaseUtils.cleanFormReadonly, tipsFormat: function(*): string, modalBlock: BaseUtils.modalBlock, modalUnblock: BaseUtils.modalUnblock, pageMsgBlock: BaseUtils.pageMsgBlock, htmPageBlock: BaseUtils.htmPageBlock, htmPageUnblock: BaseUtils.htmPageUnblock, dataEncrypt: function(*=): string, dataDecrypt: function(*=): string, cloudHeaders: function(): {appId: *, appKey: *, credential: *, systemCode: *, sign: *}, serverHeaders: function(): {credential: *, sign: *}}}
 */
var BaseUtils = {
    "serverAddress": "http://127.0.0.1:18080/api/",
    "saveSuccessMsg": "保存数据成功!",
    "saveFailMsg": "保存数据失败,请稍候再试!",
    "delFailMsg": "删除数据失败,请稍候再试!",
    "getFailMsg": "获取数据失败,请稍候再试!",
    "errorMsg": "网络不稳定,请稍候再试!",
    "networkErrorMsg": "网络不稳定,请稍候再试!",
    'enable': '正常',
    'disabled': '禁用',
    'updateMsg': "数据更新失败,请稍候再试!",
    'syncMsg': "数据同步失败,请稍候再试!",
    'loadingErrorMsg': "加载数据失败,请稍候再试!",
    'loginTimeOutMsg':"登录信息已过期,即将重新登录!",
    'functionButtonKey': "platform_function_button_",
    'user_access_token': "platform_user_credential",
    'user_info': "platform_user",
    "encryption":true,
    "secretKey":"dO6+g3+08ELBKtx/1/WBYQ==",

    /**
     * ztree
     */
    ztree: {
        settingZtreeProperty: function (params) {
            var setting = {
                check: {
                    enable: params.selectedMulti,
                    chkStyle: "checkbox",
                    chkboxType: params.chkboxType
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey:"id",
                        pIdKey:"pid",
                        rootPId:0
                    }
                },
                edit: {
                    enable: false
                },
                async: {
                    enable: true, //是否异步加载
                    type: "get",
                    headers:params.headers,
                    url: params.url,
                    autoParam: ["id"]   // 点击节点进行异步加载时默认发送参数
                }
            };
            return setting;
        },

        /**
         * 刷新 指定 节点
         * 在指定的节点下面增加子节点之后调用的方法。
         * @param id
         */
        rereshExpandNode: function (zTree, id) {
            /*获取 zTree 当前被选中的节点数据集合*/
            var nodes = zTree.getNodesByParam("id", id, null);
            var curNode = nodes[0];
            /*强行异步加载父节点的子节点。[setting.async.enable = true 时有效]*/
            zTree.reAsyncChildNodes(curNode, "refresh", false);
        },

        /**
         *  刷新整个树
         * @param id
         */
        rereshzTree: function (zTree) {
            zTree.refresh();
        },

        /**
         * 刷新父节点
         * @param id
         */
        rereshParentNode: function (zTree, id) {
            var nowNode = zTree.getNodesByParam("id", id, null);
            var parent = nowNode[0].getParentNode();
            zTree.reAsyncChildNodes(parent, "refresh", false);
        },

        /**
         * 设置 ztree 高亮时的css
         * @param treeId
         * @param treeNode
         * @returns {*}
         */
        getZtreeHighlightFontCss: function (treeId, treeNode) {
            if (typeof(treeNode) == undefined || undefined == treeNode  || 'undefined' == treeNode) {
                return {
                    color: "#333",
                    "font-weight": "normal"
                };
            }
            return (!!treeNode.highlight) ? {color: "#C50000", "font-weight": "bold"} : {
                color: "#333",
                "font-weight": "normal"
            };
        },

    },

    /**
     * 得到当前页面按钮组
     * @param moduleCode
     */
    getCurrentFunctionButtonGroup:function(moduleCode){
        var item = this.getCookie(BaseUtils.functionButtonKey + moduleCode);
        if (typeof(item) == undefined || undefined == item  || 'undefined' == item) {
            return null;
        }
        return item;
    },

    /**
     * 得到当前页面按钮组
     * @param moduleCode
     */
    getCurrentUser:function(){
        var curUser = null;
        var item = this.getCookie(BaseUtils.user_info);
        if (item == null || typeof(item) == undefined || undefined == item  || 'undefined' == item) {
            curUser = {
                'id' : 1,
                'name' : '超级管理员'
            }
        } else {
            curUser =  $.parseJSON(item);
            curUser.id = curUser.userId;
            curUser.name = curUser.userName;
        }
        return curUser;
    },

    /**
     * 检测登录是否超时
     * @returns {boolean}
     */
    checkLoginTimeout:function() {
        var item = this.getCookie(BaseUtils.user_access_token);
        if (item == null || typeof(item) == undefined || undefined == item  || 'undefined' == item) {
            return true;
        }
        return false;
    },

    /**
     * 检测登录是否超时
     * @returns {boolean}
     */
    checkLoginTimeoutStatus:function() {
        var timeOut = BaseUtils.checkLoginTimeout();
        if (timeOut) {
            BaseUtils.LoginTimeOutHandler();
            return true;
        }
        return false;
    },

    /**
     * 检查是否登录超时
     * @param status
     */
    checkIsLoginTimeOut:function(status) {
        if (status == 504) {
            BaseUtils.LoginTimeOutHandler();
            return true;
        }
        return false;
    },

    /**
     * 登录超时
     * @param status
     */
    LoginTimeOutHandler:function() {
        toastr.warning(BaseUtils.loginTimeOutMsg);
        setTimeout(function (){
            layer.closeAll();
            var $timeoutProgress = $("#session-timeout-dialog");
            if ( $timeoutProgress.is(":hidden")) {
                $("#progress-bar-time-out").css("width",  "100%");
                $('.outValue').html(30);
                $("#session-timeout-dialog").show();
                BaseUtils.countDown(31, 100);
            };
        }, 5000);

    },

    /**
     * 倒计时
     * @param seconds
     * @param progress
     */
    countDown :function(seconds, progress) {
        if (seconds > 0){
            seconds--;
            progress = progress-3.3;
            $("#progress-bar-time-out").css("width", progress + "%");
            $('.outValue').html(seconds);
            if (seconds == 0) {
                window.location.href = "login.html";
            }
            // 定时1秒调用一次
            setTimeout(function(){
               BaseUtils.countDown(seconds, progress);
            },1000);
        }
    },
    /**
     * 获取当前租户id
     */
    getLesseeId : function() {
        return 1;
    },

    /**
     * 设置 cookie 信息
     * @param key
     * @param value
     * @param day
     */
    setCookie: function(key, value, day) {
        if (day == null) {
            day = 1
        }
        this.delCookie(key);
        $.cookie(key, value, {expires: day,path: '/', secure: false});
    },

    /**
     * 获取 cookie 信息
     * @param key
     * @returns {*}
     */
    getCookie: function(key) {
        return $.cookie(key);
    },

    /**
     * 删除 cookie 信息
     * @param key
     */
    delCookie: function (key) {
        $.cookie(key, null,{ expires: -1,path: '/'});
    },


    /**
     * 保存  LocalStorage 数据
     * @param key
     * @param value
     * @param hour
     */
    setLocalStorage: function (key, value, hour) {
        var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列
        if (hour == null) {
            hour = 72
        }
        // 一小时的秒数
        var exp = 60 * 60 * 1000;
        var valueDate = {
            name: key,
            value: value,
            expires: exp * hour,
            startTime: curtime//记录何时将值存入缓存，毫秒级
        }
        this.deleteLocalStorage(key);
        window.localStorage.setItem(key, JSON.stringify(valueDate));
    },

    /**
     * 获取 LocalStorage 数据
     * @param key
     * @param hour 小时
     * @returns {*}
     */
    getLocalStorage: function (key) {
        var item = window.localStorage.getItem(key);
        //先将拿到的试着进行json转为对象的形式
        try {
            item = JSON.parse(item);
        } catch (error) {
            //如果不行就不是json的字符串，就直接返回
            item = item;
        }
        //如果有startTime的值，说明设置了失效时间
        if (item.startTime) {
            var date = new Date().getTime();
            //何时将值取出减去刚存入的时间，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
            if (date - item.startTime > item.expires) {
                //缓存过期，清除缓存，返回false
                window.localStorage.removeItem(key);
                return false;
            } else {
                //缓存未过期，返回值
                return item.value;
            }
        } else {
            //如果没有设置失效时间，直接返回值
            return item;
        }
    },

    /**
     * 删除 LocalStorage 数据
     * @param key
     * @returns {*}
     */
    deleteLocalStorage: function (key) {
        window.localStorage.removeItem(key);
    },
    /**
     * 清空 LocalStorage 数据
     * @param key
     * @returns {*}
     */
    clearLocalStorage: function () {
        window.localStorage.clear();
    },

    /**
     * json 转为 url 参数字符串
     * @param json
     * @returns {string}
     */
    jsonConvertUrlParams : function (json) {
        var params = Object.keys(json).map(function (key) {
            return key + "=" + json[key];
        }).join("&");
        return params;
    },

    /**
     * url 字符串 参数 转为json
     * @param url
     */
    urlParamsConvertJson : function (url){
        var index = -1,
            str = '',
            arr = [],
            length = 0,
            res = {};
        if(url.indexOf('?')!=-1){
            index = url.indexOf('?');
            str = url.substring(index+1);
            arr = str.split('&');
            length = arr.length;
            for(var i=0; i<length-1; i++){
                res[arr[i].split('=')[0]] = decodeURI(arr[i].split('=')[1]);
            }
        }else{
            res = {};
        }
        return res;
    },


/**
     * 转换textarea存入数据库的回车换行和空格
     * @param str
     * @returns {*}
     */
    textareaTo: function (str) {
        var reg = new RegExp("\n", "g");
        var regSpace = new RegExp(" ", "g");

        str = str.replace(reg, "<br>");
        str = str.replace(regSpace, "&nbsp;");

        return str;
    },

    /**
     *  将文本转换为了HTML的格式，'\n'   转换为   <br/>，' ' 转换为 &nbsp;
     * @param str
     * @returns {*}
     */
    toTextarea: function (str) {
        var reg = new RegExp("<br>", "g");
        var regSpace = new RegExp("&nbsp;", "g");

        str = str.replace(reg, "\n");
        str = str.replace(regSpace, " ");

        return str;
    },

    /**
     * ajax 获取select 字典下拉框值
     * @param dictCode  字典编码
     * @param successCallback  成功后回调函数
     */
    dictDataSelect : function(dictCode, successCallback) {
        $.ajax({
            type: "get",
            url: BaseUtils.serverAddress + 'v1/ignore/dict/combox',
            data:{
                parentCode : dictCode
            },
            async:false,
            dataType: "json",
            headers: BaseUtils.serverHeaders(),
            success: function(data){
                if (data != null) {
                    successCallback(data);
                }
            }
        });
    },


    /**
     * ajax 获取 省市区 select 下拉框值
     * @param code 区划编码
     * @param successCallback  成功后回调函数
     */
    distDataSelect : function(code, successCallback) {
        $.ajax({
            type: "get",
            url: BaseUtils.serverAddress + 'v1/ignore/area/combox',
            data:{
                pid : code
            },
            async:false,
            dataType: "json",
            headers: BaseUtils.serverHeaders(),
            success: function(data){
                if (data != null) {
                    successCallback(data);
                }
            }
        });
    },

    /**
     * ajax 获取select 下拉框值
     * @param url  url
     * params 参数
     * @param successCallback  成功后回调函数
     */
    dropDownDataSelect : function(url, params, headers, successCallback) {
        $.ajax({
            type: "get",
            url: url,
            data: params,
            async:false,
            dataType: "json",
            headers: headers,
            success: function(res){
                var curData = res.data;
                if (curData != null) {
                    successCallback(curData);
                }
            }
        });
    },

    /**
     * ajax 获取 员工 select 下拉框值
     * @param params 参数
     * @param successCallback  成功后回调函数
     */
    staffDataSelect : function(params, successCallback) {
        $.ajax({
            type: "get",
            url: BaseUtils.serverAddress + 'v1/table/staff/select',
            data:params,
            async:false,
            dataType: "json",
            headers: BaseUtils.serverHeaders(),
            success: function(res){
                var curData = res.data;
                if (curData != null) {
                    successCallback(curData);
                }
            }
        });
    },

    /**
     * 获取地址栏中的参数
     * @param name
     * @returns {string}
     */
    getUrlParams: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        //获取url中"?"符后的字符串并正则匹配
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },

    /**
     *  时间戳格式化为日期 返回 2018-08-09 13:48:10
     *  @param time
     * @param timestamp yyyy-MM-dd HH:mm:ss
     */
    datatTimeFormat: function (time) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },

    /**
     *  时间戳格式化为日期  2018-08-09 13:48
     *  @param time
     * @param timestamp yyyy-MM-dd HH:mm
     */
    datatHHmmFormat: function (time) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute
    },

    /**
     *  时间戳格式化为日期  2018-08-09
     *  @param time
     * @param timestamp yyyy-MM-dd
     */
    datatFormat: function (time) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        return year + "-" + month + "-" + date;
    },

    zero_fill_hex: function (num, digits) {
        var s = num.toString(16);
        while (s.length < digits) {
            s = "0" + s;
        }
        return s;
    },


    /**
     * rgb 值转为 #ffff
     * @param rgb
     * @returns {*}
     */
    rgb2hex: function (rgb) {
        if (rgb.charAt(0) == '#') {
            return rgb;
        }
        var ds = rgb.split(/\D+/);
        var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
        return "#" + BaseUtils.zero_fill_hex(decimal, 6);
    },

    /**
     *  获取状态值
     * @param value
     */
    statusText: function (value) {
        var text = null;
        switch (value) {
            case 0:
                text = "正常";
                break;
            case 1:
                text = "禁用";
                break;
            default:
                text = "正常";
                break;
        }
        return text;
    },

    /**
     * 清空文本框前后空格
     * @param form
     */
    formInputTrim: function (form) {
        $(form + " input").each(function () {
            var trimValue = $.trim($(this).val());
            var curValue = trimValue.replace(/\s+/g,"");
            $(this).val($.trim(curValue));
        });
        $(form + " textarea").each(function () {
            var trimValue = $.trim($(this).val());
            var curValue = trimValue.replace(/\s+/g,"");
            $(this).val($.trim(curValue));
        });
    },

    /**
     *  清除 form 数据
     * @param formId
     */
    cleanFormData: function (form) {
        form.resetForm();
        form[0].reset();
        var input = form.find("input");
        $.each(input, function (i, v) {
            var curReset = true;
            if ($(v).attr("type") == "radio" ) {
              curReset = false;
                $(v).removeAttr('checked');
            }
            if ($(v).attr("type") == "checkbox" ) {
                curReset = false;
                $(v).removeAttr('checked');
            }
            if (curReset) {
                $(v).removeAttr("value");
            }
        });
        var textarea = form.find("textarea");
        $.each(textarea, function (i, v) {
            $(v).removeAttr("value");
        });
        var select = form.find("select");
        $.each(select, function (i, v) {
            $(v).parent(".bootstrap-select").removeAttr("disabled");
            $(v).removeAttr("disabled");
            $(v).selectpicker('refresh');
        });

        var formControlFeedback = $(".error.form-control-feedback");
        formControlFeedback.parent("div").parent("div").removeClass("has-danger");
        formControlFeedback.remove();

    },

    /**
     *  将 form 全部设置为 readonly
     * @param formId
     */
    readonlyForm: function (form) {
        $(form + " input").each(function () {
            $(this).addClass("m-input--solid");
            $(this).attr("readonly", "readonly");
        });
        $(form + " textarea").each(function () {
            $(this).addClass("m-input--solid");
            $(this).attr("readonly", "readonly");
        });
        $(form + " select").each(function () {
            $(this).parent(".bootstrap-select").attr("disabled", "true");
            $(this).attr("disabled", "true");
        });
    },

    /**
     *  将 form 全部设置为 readonly
     * @param formId
     */
    cleanFormReadonly: function (form) {
        $(form + " input").each(function () {
            $(this).removeClass("m-input--solid");
            $(this).removeAttr("readonly", "readonly");
        });
        $(form + " textarea").each(function () {
            $(this).removeClass("m-input--solid");
            $(this).removeAttr("readonly", "readonly");
        });
        $(form + " select").each(function () {
            $(this).parent(".bootstrap-select").removeAttr("disabled");
            $(this).removeAttr("disabled");
        });
    },

    tipsFormat: function (msg) {
        var msgArray = msg.split(".");
        var result = "";
        var arraySize = msgArray.length - 1;
        $.each(msgArray, function (i, v) {
            result += v
            if (i < arraySize) {
                result += "<br/>"
            }
        });
        return result;
    },

    /**
     * modal 中显示加载提示
     * @param modalId
     */
    modalBlock: function (modalId, message) {
        var msg = message == null || message == "" ? "数据处理中....." : $.trim(message);
        mApp.block($.trim(modalId) + ' .modal-content', {
            overlayColor: '#000000',
            type: 'loader',
            state: 'success',
            size: 'lg',
            message: msg
        });
    },

    /**
     * modal 中关闭加载提示
     * @param modalId
     */
    modalUnblock: function (modalId) {
        mApp.unblock($.trim(modalId) + ' .modal-content');
    },

    /**
     * 整个页面 中显示加载提示信息
     * @param modalId
     */
    pageMsgBlock: function (message) {
        var msg = message == null || message == "" ? "数据处理中....." : $.trim(message);
        mApp.blockPage({
            overlayColor: '#000000',
            type: 'loader',
            state: 'success',
            size: 'lg',
            message: msg
        });
    },

    /**
     * 整个页面 中显示加载提示
     * @param modalId
     */
    htmPageBlock: function () {
        mApp.blockPage({
            overlayColor: '#000000',
            type: 'loader',
            state: 'success',
            size: 'lg'
        });
    },

    /**
     * 整个页面中 中关闭加载提示
     * @param modalId
     */
    htmPageUnblock: function () {
        mApp.unblockPage();
    },

    /**
     * AES 加密
     * @param data
     */
    dataEncrypt: function (data) {
        var key = CryptoJS.enc.Utf8.parse(BaseUtils.secretKey);
        var srcData = CryptoJS.enc.Utf8.parse(data);
        var encrypted = CryptoJS.AES.encrypt(srcData, key, {
            mode : CryptoJS.mode.ECB,
            padding : CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },

    /**
     * AES 解密
     * @param data
     */
    dataDecrypt: function (data) {
        var key = CryptoJS.enc.Utf8.parse(BaseUtils.secretKey);
        var decrypt = CryptoJS.AES.decrypt(data, key, {
            mode : CryptoJS.mode.ECB,
            padding : CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    },


    /**
     * 访问自身系统 需要的 headers
     * @returns {{appId: string, appKey: string, credential: string, systemCode: string}}
     */
    serverHeaders: function () {
        var sign = BaseUtils.dataEncrypt(JSON.stringify({
            "signTime":new Date().getTime(),
            "secret":BaseUtils.secretKey,
            "parameter":false
        }));
        var access_token =  BaseUtils.getCookie(BaseUtils.user_access_token);
        var authorization =  access_token != null && access_token != '' ? "bearer " + access_token : "";
        var headers = {
            "sign":sign,
            "Authorization" :  authorization
        };
        return headers;
    },

    /**
     * 根据身份证获取出生日期 和性别
     * @param userCard
     */
    birthdayCard : function (userCard){
        if (isIdCardNo(userCard))  {
            var birthday = "";
            var sex = "";
            //获取出生日期 
            birthday = userCard.substring(6, 10) + "-" + userCard.substring(10, 12) + "-" + userCard.substring(12, 14);
            //获取性别 
            if (parseInt(userCard.substr(16, 1)) % 2 == 1) {
                // 男
                sex = '0'
            } else {
                // 女
                sex = '1';
            }
            var obj = {
                birthday : birthday,
                sex : sex
            }
            return obj;
        } else {
            return null;
        }
    },

    /***
     *  动按比例显示图片，按比例压缩图片显示
     */
     imageAutoSize: function(Img, maxWidth, maxHeight) {
        var image = new Image();
        //原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）
        image.src = Img.src;
        // 当图片比图片框小时不做任何改变
        if (image.width < maxWidth&& image.height < maxHeight) {
            Img.width = image.width;
            Img.height = image.height;
        }
        else //原图片宽高比例 大于 图片框宽高比例,则以框的宽为标准缩放，反之以框的高为标准缩放
        {
            if (maxWidth/ maxHeight  <= image.width / image.height) //原图片宽高比例 大于 图片框宽高比例
            {
                Img.width = maxWidth;   //以框的宽度为标准
                Img.height = maxWidth* (image.height / image.width);
            }
            else {   //原图片宽高比例 小于 图片框宽高比例
                Img.width = maxHeight  * (image.width / image.height);
                Img.height = maxHeight  ;   //以框的高度为标准
            }
        }
    },

    /***
     *  动按比例显示图片，按比例压缩图片显示
     */
    autoResizeImage : function (maxWidth,maxHeight,objImg) {
        var img = new Image();
        img.src = objImg.src;
        var hRatio;
        var wRatio;
        var Ratio = 1;
        var w = img.width;
        var h = img.height;
        wRatio = maxWidth / w;
        hRatio = maxHeight / h;
        if (maxWidth ==0 && maxHeight==0){
            Ratio = 1;
        }else if (maxWidth==0){//
            if (hRatio<1) Ratio = hRatio;
        }else if (maxHeight==0){
            if (wRatio<1) Ratio = wRatio;
        }else if (wRatio<1 || hRatio<1){
            Ratio = (wRatio<=hRatio?wRatio:hRatio);
        }
        if (Ratio<1){
            w = w * Ratio;
            h = h * Ratio;
        }
        objImg.height = h;
        objImg.width = w;
    },

    /**
     * 页面可视区滚动到指定位置
     * @param element   位置区域ID属性
     * @param speed
     */
    scrollTo : function(element,speed) {
        if(!speed){
            speed = 300;
        }
        if(!element){
            $("html,body").animate({scrollTop:0},speed);
        }else{
            if(element.length>0){
                $("html,body").animate({scrollTop:$(element).offset().top-80},speed);
            }
        }
    }

};