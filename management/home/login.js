//== Class Definition
var SnippetLogin = function() {
    var serverUrl = BaseUtils.serverAddress;
    var login = $('#m_login');

    var showErrorMsg = function(form, type, msg) {
        var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        mUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    //== Private Functions

    var displaySignUpForm = function() {
        login.removeClass('m-login--forget-password');
        login.removeClass('m-login--signin');

        login.addClass('m-login--signup');
        mUtil.animateClass(login.find('.m-login__signup')[0], 'flipInX animated');
    }

    var displaySignInForm = function() {
        $('[data-dismiss="alert"]').alert('close');
        login.removeClass('m-login--forget-password');
        login.removeClass('m-login--signup');

        login.addClass('m-login--signin');
        mUtil.animateClass(login.find('.m-login__signin')[0], 'flipInX animated');
        //login.find('.m-login__signin').animateClass('flipInX animated');
    }

    var displayForgetPasswordForm = function() {
        $('[data-dismiss="alert"]').alert('close');
        login.removeClass('m-login--signin');
        login.removeClass('m-login--signup');

        login.addClass('m-login--forget-password');
        //login.find('.m-login__forget-password').animateClass('flipInX animated');
        mUtil.animateClass(login.find('.m-login__forget-password')[0], 'flipInX animated');

    }

    var handleFormSwitch = function() {
        $('#m_login_forget_password').click(function(e) {
            e.preventDefault();
            displayForgetPasswordForm();
        });

        $('#m_login_forget_password_cancel').click(function(e) {
            e.preventDefault();
            displaySignInForm();
        });

    }

    /**
     * 登录
     */
    var handleSignInFormSubmit = function() {
        $('#m_login_signin_submit').click(function(e) {
            e.preventDefault();
            BaseUtils.formInputTrim("#user-login-form");
            var btn = $(this);
            var form = $(this).closest('form');
            var user_account = $("#user_account").val();
            var user_password = $("#user_password").val();
            if (user_account == "" && user_password != '' ) {
                showErrorMsg(form, 'danger', '请输入用户名.');
            }
            if (user_password == "" && user_account != ''  ) {
                showErrorMsg(form, 'danger', '请输入密码.');
            }
            if (user_password == "" && user_account == ''  ) {
                showErrorMsg(form, 'danger', '请输入用户名和密码进行登录.');
            }
            if (user_password != '' && user_account != '') {
               // BaseUtils.htmPageBlock();
                btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
                $encryptPostAjaxNoToastr({
                    url:serverUrl + "v1/user/login",
                    data:$("#user-login-form").serializeJSON(),
                    headers: BaseUtils.serverHeaders()
                }, function (response) {
                    if (response.success && response.status == 200) {
                        BaseUtils.setCookie(BaseUtils.user_access_token, response.extend, 1 );
                        BaseUtils.setCookie(BaseUtils.user_info, JSON.stringify(response.data), 1);
                        window.location.href = "home.html";
                    } else if ( response.status == 301) {
                        hidenAlerts(btn, form,"用户已被停用,请联系客服.");
                    } else   {
                        hidenAlerts(btn, form);
                    }
                }, function (data) {
                    hidenAlerts(btn, form);
                });
            }
        });
    }

    /**
     * 隐藏提示信息
     * @param msg
     */
    var hidenAlerts = function (btn, form, msg) {
        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
        if (msg  == null || msg == "") {
            showErrorMsg(form, 'danger', '用户名或密码错误。请再试一次.');
        } else {
            showErrorMsg(form, 'danger', msg);
        }
        BaseUtils.htmPageUnblock();
    }

    /**
     *  找回密码
     */
    var handleForgetPasswordFormSubmit = function() {
        $('#m_login_forget_password_submit').click(function(e) {
            e.preventDefault();
            var m_email = $.trim($("#m_email").val());
            $("#m_email").val(m_email)
            var btn = $(this);
            var form = $(this).closest('form');
            if (m_email == "" ) {
                showErrorMsg(form, 'danger', '请输入你注册时的电子邮箱.');
            } else {
                btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

                form.ajaxSubmit({
                    url: '',
                    success: function(response, status, xhr, $form) {
                        // similate 2s delay
                        setTimeout(function() {
                            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false); // remove
                            form.clearForm(); // clear form
                            form.validate().resetForm(); // reset validation states

                            // display signup form
                            displaySignInForm();
                            var signInForm = login.find('.m-login__signin form');
                            signInForm.clearForm();
                            signInForm.validate().resetForm();

                            showErrorMsg(signInForm, 'success', '太酷了!密码恢复说明已发送到您的邮箱.');
                        }, 2000);
                    }
                });
            }
        });
    }

    //== Public Functions
    return {
        // public functions
        init: function() {
            handleFormSwitch();
            handleSignInFormSubmit();
            handleForgetPasswordFormSubmit();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetLogin.init();
});