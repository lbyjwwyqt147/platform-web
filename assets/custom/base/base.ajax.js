var BaseAjaxUtils = {

}

jQuery(document).ready(function() {
    /**
     * 默认post 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $postAjax = function (ajaxParam, successCallback, errorCallback) {
        var _url = ajaxParam.url;
        var _data = ajaxParam.data;
        $.ajax({
            url: _url,
            dataType: "json",
            cache: false,
            async: true,
            type: "POST",
            data: _data,
            headers:ajaxParam.headers,
            crossDomain: true,
            timeout: 60000,
            success: function (response) {
                successCallback(response);
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                }  else if (response.status == 202) {
                    if ($.trim(response.message) != '') {
                        toastr.error(BaseUtils.tipsFormat(response.message));
                    } else {
                        toastr.error(BaseUtils.saveFailMsg);
                    }
                } else if (response.status == 504 || response.status == 401) {
                    BaseUtils.LoginTimeOutHandler();
                }  else {
                    if ($.trim(response.message) != '') {
                        toastr.error(BaseUtils.tipsFormat(response.message));
                    }
                }
            },
            error: function (data) {
                errorCallback(data);
                toastr.error(BaseUtils.networkErrorMsg);
            }
        });
    };

    /**
     * 默认post 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $postAjaxNoToastr = function (ajaxParam, successCallback, errorCallback) {
        var _url = ajaxParam.url;
        var _data = ajaxParam.data;
        $.ajax({
            url: _url,
            dataType: "json",
            cache: false,
            async: true,
            type: "POST",
            data: _data,
            headers:ajaxParam.headers,
            crossDomain: true,
            timeout: 60000,
            success: function (response) {
                successCallback(response);
            },
            error: function (data) {
                errorCallback(data);
            }
        });
    };

    /**
     * 加密数据 以json 字符串传到服务器
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $encryptPostAjax = function (ajaxParam, successCallback, errorCallback) {
        var _url = ajaxParam.url;
        var _data = ajaxParam.data;
        var encryptData = null;
        var formData = JSON.stringify(_data);
        var encryption = BaseUtils.encryption;
        if (encryption) {
            encryptData = BaseUtils.dataEncrypt(formData);
        } else {
            encryptData = formData;
        }
        $.ajax({
            url: _url,
            type: "POST",
            dataType: "text",
            cache: false,
            async: true,
            contentType: "application/json",
            data: encryptData,
            headers: ajaxParam.headers,
            crossDomain: true,
            timeout:60000,
            success: function (data) {
                var response = null;
                if (isJsonObject(data)) {
                    response = JSON.parse(data);
                } else {
                    var decryptData = BaseUtils.dataDecrypt(data.replace("\"",""));
                    response = JSON.parse(decryptData);
                }
                successCallback(response);
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                }  else if (response.status == 202) {
                    if ($.trim(response.message) != '') {
                        toastr.error(BaseUtils.tipsFormat(response.message));
                    } else {
                        toastr.error(BaseUtils.saveFailMsg);
                    }
                } else if (response.status == 504 || response.status == 401) {
                    BaseUtils.LoginTimeOutHandler();
                }  else {
                    if ($.trim(response.message) != '') {
                        toastr.error(BaseUtils.tipsFormat(response.message));
                    }
                }
            },
            error: function (data) {
                errorCallback(data);
                toastr.error(BaseUtils.networkErrorMsg);
            }
        });
    };


    /**
     * 加密数据 以json 字符串传到服务器
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $encryptPostAjaxNoToastr = function (ajaxParam, successCallback, errorCallback) {
        var _url = ajaxParam.url;
        var _data = ajaxParam.data;
        var encryptData = null;
        var formData = JSON.stringify(_data);
        var encryption = BaseUtils.encryption;
        if (encryption) {
            encryptData = BaseUtils.dataEncrypt(formData);
        } else {
            encryptData = formData;
        }
        $.ajax({
            url: _url,
            type: "POST",
            dataType: "text",
            cache: false,
            async: true,
            contentType: "application/json",
            data: encryptData,
            headers: ajaxParam.headers,
            crossDomain: true,
            timeout:60000,
            success: function (data) {
                var response = null;
                if (isJsonObject(data)) {
                    response = JSON.parse(data);
                } else {
                    var decryptData = BaseUtils.dataDecrypt(data.replace("\"",""));
                    response = JSON.parse(decryptData);
                }
                successCallback(response);
            },
            error: function (data) {
                errorCallback(data);
            }
        });
    };

    /**
     * 默认delete 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $deleteAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        _data._method = 'DELETE';
        $.ajax({
            url: _url,
            dataType: "json",
            cache: false,
            async: true,
            type: "POST",
            traditional:true,
            data: _data,
            headers: ajaxParam.headers,
            crossDomain: true,
            timeout: 60000,
            success: function (response) {
                BaseUtils.htmPageUnblock();
                successCallback(response);
                if (response.success) {

                } else if (response.status == 202) {
                    if ($.trim(response.message) != '') {
                        toastr.error(BaseUtils.tipsFormat(response.message));
                    } else {
                        toastr.error(BaseUtils.delFailMsg);
                    }
                } else if (response.status == 504 || response.status == 401) {
                    BaseUtils.LoginTimeOutHandler();
                }  else {
                    if ($.trim(response.message) != '') {
                        toastr.error(response.message);
                    }
                }
            },
            error: function (data) {
                BaseUtils.htmPageUnblock();
                errorCallback(data);
                toastr.error(BaseUtils.networkErrorMsg);
            }
        });
    };


    /**
     * 数据加密方式 delete 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $encrypDeleteAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        var encryptData = null;
        var formData = JSON.stringify(_data);
        var encryption = BaseUtils.encryption;
        if (encryption) {
            encryptData = BaseUtils.dataEncrypt(formData);
        } else {
            encryptData = formData;
        }
        $.ajax({
            url: _url,
            dataType: "text",
            cache: false,
            async: true,
            type: "DELETE",
            contentType: "application/json",
            traditional:true,
            data: encryptData,
            headers: ajaxParam.headers,
            crossDomain: true,
            timeout: 60000,
            success: function (data) {
                BaseUtils.htmPageUnblock();
                var response = null;
                if (isJsonObject(data)) {
                    response = JSON.parse(data);
                } else {
                    var decryptData = BaseUtils.dataDecrypt(data.replace("\"",""));
                    response = JSON.parse(decryptData);
                }
                successCallback(response);
                if (response.success) {

                } else if (response.status == 202) {
                    if ($.trim(response.message) != '') {
                        toastr.error(BaseUtils.tipsFormat(response.message));
                    } else {
                        toastr.error(BaseUtils.delFailMsg);
                    }
                } else if (response.status == 504 || response.status == 401 ) {
                    BaseUtils.LoginTimeOutHandler();
                }  else {
                    if ($.trim(response.message) != '') {
                        toastr.error(response.message);
                    }
                }
            },
            error: function (data) {
                BaseUtils.htmPageUnblock();
                errorCallback(data);
                toastr.error(BaseUtils.networkErrorMsg);
            }
        });
    };

    /**
     * 默认put 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $putAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        _data._method = 'PUT';
        $.ajax({
            url: _url,
            dataType: "json",
            cache: false,
            async: true,
            type: "POST",
            traditional:true,
            data: _data,
            headers: ajaxParam.headers,
            crossDomain: true,
            timeout: 60000,
            success: function (data) {
                BaseUtils.htmPageUnblock();
                successCallback(data);
            },
            error: function (data) {
                BaseUtils.htmPageUnblock();
                errorCallback(data);
                toastr.error(BaseUtils.networkErrorMsg);
            }
        });
    };


    /**
     * 数据加密方式 put 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $encrypPutAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        var encryptData = null;
        var formData = JSON.stringify(_data);
        var encryption = BaseUtils.encryption;
        if (encryption) {
            encryptData = BaseUtils.dataEncrypt(formData);
        } else {
            encryptData = formData;
        }
        $.ajax({
            url: _url,
            dataType: "text",
            cache: false,
            async: true,
            type: "PUT",
            contentType: "application/json",
            traditional:true,
            data: encryptData,
            headers:ajaxParam.headers,
            crossDomain: true,
            timeout: 60000,
            success: function (data) {
                BaseUtils.htmPageUnblock();
                if (isJsonObject(data)) {
                    successCallback(JSON.parse(data));
                } else {
                    var decryptData = BaseUtils.dataDecrypt(data.replace("\"",""));
                    successCallback(JSON.parse(decryptData));
                }
            },
            error: function (data) {
                BaseUtils.htmPageUnblock();
                errorCallback(data);
                toastr.error(BaseUtils.networkErrorMsg);
            }
        });
    };

    /**
     * 默认get 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $getAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        $.ajax({
            url: _url,
            dataType: "json",
            cache: false,
            async: true,
            type: "GET",
            data: _data,
            headers:ajaxParam.headers,
            crossDomain: true,
            timeout: 60000,
            success: function (response) {
                successCallback(response);
                if (response.success) {

                } else if (response.status == 202) {
                    if ($.trim(response.message) != '') {
                        toastr.error(BaseUtils.tipsFormat(response.message));
                    } else {
                        toastr.error(BaseUtils.getFailMsg);
                    }
                } else if (response.status == 504 || response.status == 401) {
                    BaseUtils.LoginTimeOutHandler();
                }  else {
                    if ($.trim(response.message) != '') {
                        toastr.error(response.message);
                    }
                }
            },
            error: function (data) {
                errorCallback(data);
                toastr.error(BaseUtils.networkErrorMsg);
            }
        });
    };

    /**
     * 默认get 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $getAjaxNotToastr = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        $.ajax({
            url: _url,
            dataType: "json",
            cache: false,
            async: true,
            type: "GET",
            data: _data,
            headers:ajaxParam.headers,
            crossDomain: true,
            timeout: 60000,
            success: function (response) {
                successCallback(response);
                if (response.success) {

                } else if (response.status == 202) {

                } else if (response.status == 504 || response.status == 401) {
                    BaseUtils.LoginTimeOutHandler();
                }  else {

                }
            },
            error: function (data) {
                errorCallback(data);
                toastr.error(BaseUtils.networkErrorMsg);
            }
        });
    };

    /**
     * 数据加密方式 get 提交
     * @param ajaxParam
     * @param successCallback
     * @param errorCallback
     */
    $encrypGetAjax = function (ajaxParam, successCallback, errorCallback) {
        _url = ajaxParam.url;
        _data = ajaxParam.data;
        var encryptData = null;
        var formData = JSON.stringify(_data);
        var encryption = BaseUtils.encryption;
        if (encryption) {
            encryptData = BaseUtils.dataEncrypt(formData);
        } else {
            encryptData = formData;
        }
        $.ajax({
            url: _url,
            dataType: "text",
            cache: false,
            async: true,
            type: "GET",
            contentType: "application/json",
            data: encryptData,
            headers: ajaxParam.headers,
            crossDomain: true,
            timeout: 60000,
            success: function (data) {
                var  response = null;
                if (isJsonObject(data)) {
                    response = data;
                } else {
                    var decryptData = BaseUtils.dataDecrypt(data.replace("\"",""));
                    response = JSON.parse(decryptData);
                }
                successCallback(response);

                if (response.success) {

                } else if (response.status == 202) {
                    if ($.trim(response.message) != '') {
                        toastr.error(BaseUtils.tipsFormat(response.message));
                    } else {
                        toastr.error(BaseUtils.getFailMsg);
                    }
                } else if (response.status == 504 || response.status == 401) {
                    BaseUtils.LoginTimeOutHandler();
                }  else {
                    if ($.trim(response.message) != '') {
                        toastr.error(response.message);
                    }
                }

            },
            error: function (data) {
                errorCallback(data);
                toastr.error(BaseUtils.networkErrorMsg);
            }
        });
    };


    /**
     * 初始化 dataGrid
     * @param params
     * @param doneCallback
     * @returns {*|Plugin.table|table|((...tabularData: any[]) => void)|string|Array}
     */
    $initDataGrid = function (params, doneCallback) {
        var layuiTable = layui.table;
        layuiTable.render({
            elem: params.elem,
            url: params.url,
            where: params.where,
            title: params.title,
            method:params.method != null ? params.method : "get",
            text: {
                none: '暂无相关数据'   // 空数据时的异常提示
            },
            cellMinWidth: 50, //全局定义常规单元格的最小宽度
            height: params.height != null ?  params.height : 'full-150', //高度最大化减去差值
            even: true,
            initSort: params.initSort,
            cols: params.cols,
            page: {
                layout:[ 'prev', 'page', 'next', 'count', 'limit', 'skip', 'refresh'],
                curr: 1 ,//设定初始在第 1 页
                groups: 10, //只显示 10 个连续页码
                first: true, //显示首页
                last: true, //显示尾页
                theme: 'cadetblue'
            },
            limit: params.limit,
            limits: params.limits,

            request: {
                pageName: 'pageNumber', //页码的参数名称，默认：page
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
            },
            response: {
                statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
            },
            headers: params.headers,
            parseData: function(res){ //将原始数据解析成 table 组件所规定的数据
                if (res.status == 504) {
                    BaseUtils.checkIsLoginTimeOut(res.status);
                } else if (res.status == 200 && res.data.length == 0) {
                    return {
                        "code": 201,
                        "msg": '暂无相关数据',
                        "count": res.total,
                        "data": res.data
                    };
                } else if (res.status != 200) {
                    toastr.error(res.message);
                }
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.total, //解析数据长度
                    "data": res.data //解析数据列表
                };
            },
            done: function (res, curr, count) {
                doneCallback(res, curr, count);
            }
        });
        return layuiTable;
    };


    /**
     * 初始化 dataGrid (数据加密处理)
     * @param params
     * @param doneCallback
     * @returns {*|Plugin.table|table|((...tabularData: any[]) => void)|string|Array}
     */
    $initEncrypDataGrid = function (params, doneCallback) {
        var layuiTable = layui.table;
        layuiTable.render({
            elem: params.elem,
            url: params.url,
            where: params.where,
            title: params.title,
            method:params.method != null ? params.method : "get",
            text: {
                none: '暂无相关数据'   // 空数据时的异常提示
            },
            cellMinWidth: 50, //全局定义常规单元格的最小宽度
            height: params.height == null ? 'full-164' : params.height, //高度最大化减去差值
            even: true,
            initSort: params.initSort,
            cols: params.cols,
            page: {
                layout:[ 'prev', 'page', 'next', 'count', 'limit', 'skip', 'refresh'],
                curr: 1 ,//设定初始在第 1 页
                groups: 10, //只显示 10 个连续页码
                first: true, //显示首页
                last: true, //显示尾页
                theme: 'cadetblue'
            },
            limit: params.limit,
            limits: params.limits,

            request: {
                pageName: 'pageNumber', //页码的参数名称，默认：page
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
            },
            response: {
                statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
            },
            headers: params.headers,
            parseData: function(res){ //将原始数据解析成 table 组件所规定的数据
                var tableData = [];
                if (res.status == 504) {
                    BaseUtils.checkIsLoginTimeOut(res.status);
                } else if (res.status == 200) {
                    if (isJsonObject(res.data)){
                        tableData = res.data;
                    } else {
                        var decryptData = BaseUtils.dataDecrypt(res.data.replace("\"",""));
                        tableData = JSON.parse(decryptData);
                    }
                    if (tableData.length == 0) {
                        return {
                            "code": 201,
                            "msg": '暂无相关数据',
                            "count": res.total,
                            "data": tableData
                        };
                    }
                } else if (res.status != 200) {
                    if ($.trim(res.message) != '') {
                        toastr.error(res.message);
                    }
                }
                return {
                    "code": res.status, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.total, //解析数据长度
                    "data": tableData //解析数据列表
                };
            },
            done: function (res, curr, count) {
                doneCallback(res, curr, count);
            }
        });
        return layuiTable;
    }


    /**
     * 数据是否为json 对象
     * @param str
     * @returns {boolean}
     */
    function isJsonObject(str) {
        if (typeof str == 'object')  {
            return true;
        } else if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return true;
                }else{
                    return false;
                }
            } catch(e) {
                return false;
            }
        }
    }
});
