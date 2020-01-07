$(function () {
  'use strict';

  var console = window.console || { log: function () {} };
  var URL = window.URL || window.webkitURL;
  var $image = $('#head_portrait_image');
  var options = {
    aspectRatio: 4 / 3, //裁剪框比例  16 / 9     4 / 3    1 / 1
    preview: '.img-preview',
    crop: function (e) {
    /*  console.log(Math.round(e.detail.x));
      console.log(Math.round(e.detail.y));
      console.log(Math.round(e.detail.height));
      console.log(Math.round(e.detail.width));
      console.log(e.detail.rotate);
      console.log(e.detail.scaleX);
      console.log(e.detail.scaleY);*/
    }
  };
  var originalImageURL = $image.attr('src');
  var uploadedImageName = 'cropped.jpg';
  var uploadedImageType = 'image/jpeg';
  var uploadedImageURL;

  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Cropper
  $image.on({
    ready: function (e) {
     // console.log(e.type);
    },
    cropstart: function (e) {
      //console.log(e.type, e.detail.action);
    },
    cropmove: function (e) {
     // console.log(e.type, e.detail.action);
    },
    cropend: function (e) {
     // console.log(e.type, e.detail.action);
    },
    crop: function (e) {
     // console.log(e.type);
    },
    zoom: function (e) {
      console.log(e.type, e.detail.ratio);
    }
  }).cropper(options);

  // Buttons
  if (!$.isFunction(document.createElement('canvas').getContext)) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }



  // Options
  $('.docs-toggles').on('change', 'input', function () {
    var $this = $(this);
    var name = $this.attr('name');
    var type = $this.prop('type');
    var cropBoxData;
    var canvasData;

    if (!$image.data('cropper')) {
      return;
    }

    if (type === 'checkbox') {
      options[name] = $this.prop('checked');
      cropBoxData = $image.cropper('getCropBoxData');
      canvasData = $image.cropper('getCanvasData');

      options.ready = function () {
        $image.cropper('setCropBoxData', cropBoxData);
        $image.cropper('setCanvasData', canvasData);
      };
    } else if (type === 'radio') {
      options[name] = $this.val();
    }

    $image.cropper('destroy').cropper(options);
  });

  // Methods
  $('.docs-buttons').on('click', '[data-method]', function () {
    var $this = $(this);
    var data = $this.data();
    var cropper = $image.data('cropper');
    var cropped;
    var $target;
    var result;

    if ($this.prop('disabled') || $this.hasClass('disabled')) {
      return;
    }

    if (cropper && data.method) {
      data = $.extend({}, data); // Clone a new one

      if (typeof data.target !== 'undefined') {
        $target = $(data.target);

        if (typeof data.option === 'undefined') {
          try {
            data.option = JSON.parse($target.val());
          } catch (e) {
           // console.log(e.message);
          }
        }
      }

      cropped = cropper.cropped;

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            $image.cropper('clear');
          }

          break;

        case 'getCroppedCanvas':
          if (uploadedImageType === 'image/jpeg') {
            if (!data.option) {
              data.option = {};
            }

            data.option.fillColor = '#fff';
          }

          break;
      }

      result = $image.cropper(data.method, data.option, data.secondOption);

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            $image.cropper('crop');
          }

          break;

        case 'scaleX':
        case 'scaleY':
          $(this).data('option', -data.option);
          break;

        case 'getCroppedCanvas':  //上传头像
          if (result) {
            // 将图片转为 base64 数据
           //   var imgBase = result.toDataURL('image/jpeg');
           //  var iamgeData = {imgBase : imgBase};
            // Bootstrap's Modal
            $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

            if (!$download.hasClass('disabled')) {
              download.download = uploadedImageName;
              $download.attr('href', result.toDataURL(uploadedImageType));
            }
          }

          break;

        case 'destroy':
          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            $image.attr('src', originalImageURL);
          }

          break;
      }

      if ($.isPlainObject(result) && $target) {
        try {
          $target.val(JSON.stringify(result));
        } catch (e) {
          //console.log(e.message);
        }
      }
    }
  });

  // Keyboard
  $(document.body).on('keydown', function (e) {
    if (e.target !== this || !$image.data('cropper') || this.scrollTop > 300) {
      return;
    }

    switch (e.which) {
      case 37:
        e.preventDefault();
        $image.cropper('move', -1, 0);
        break;

      case 38:
        e.preventDefault();
        $image.cropper('move', 0, -1);
        break;

      case 39:
        e.preventDefault();
        $image.cropper('move', 1, 0);
        break;

      case 40:
        e.preventDefault();
        $image.cropper('move', 0, 1);
        break;
    }
  });

  // Import image
  var $inputImage = $('#inputImage');

  if (URL) {
    $inputImage.change(function () {
      var files = this.files;
      var file;

      if (!$image.data('cropper')) {
        return;
      }

      if (files && files.length) {
        file = files[0];

        if (/^image\/\w+$/.test(file.type)) {
          uploadedImageName = file.name;
          uploadedImageType = file.type;

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
          }

          uploadedImageURL = URL.createObjectURL(file);
          $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
          $inputImage.val('');
        } else {
          $("#no-select-image").show();
        }
      }
    });
  } else {
    $inputImage.prop('disabled', true).parent().addClass('disabled');
  }


  //绑定上传事件
  $('#portait_up-btn-ok').on('click',function(){
    var img_src = $image.attr("src");
    if(img_src == "" || img_src.indexOf("user/profile-photo.jpg") != -1){
      $("#no-select-image").show();
      return false;
    }
    var businessId = 0;
    var businessType = 0;
    var curUrl = location.search; //获取url中"?"符后的字串
    if (curUrl.indexOf("?") != -1) {    //判断是否有参数
      var param = curUrl.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
      var params = param.split("&");   //用&进行分隔 （如果只有一个参数 直接用等号进分隔； 如果有多个参数 要用&号分隔 再用等号进行分隔）
      var businessIdParams = params[0].split("=");
      businessId = businessIdParams[1];
      var businessTypeParams = params[1].split("=");
      businessType = businessTypeParams[1];
    }
    BaseUtils.pageMsgBlock("头像上传中....");
    $image.cropper('getCroppedCanvas').toBlob(function(blob){
      var formData = new FormData();  //这里创建FormData()对象
      formData.append('file', blob);  //给表单对象中添加一个name为file的文件  blod是这个插件选择文件后返回的文件对象
      formData.append('systemCode', BaseUtils.systemCode);
      var businessCode = "100";
      // 更新头像url
      var _url = BaseUtils.serverAddress;
      switch (businessType) {
        case "1":
          // 员工头像处理
          _url =  _url + "v1/ignore/staff/p/portrait"
          break;
        case "2":
          // 顾客头像处理
          businessCode = "200";
          _url =  _url + ""
          break;
        default:
          break;
      }
      formData.append('businessCode', businessCode);
      $.ajax({
        url: BaseUtils.cloudServerAddress + "v1/verify/file/upload/batch",  //上传文件服务器
        type: "POST",
        headers: BaseUtils.cloudHeaders(),
        crossDomain: true,
        cache: false,
        timeout: 60000,
        data: formData,
        contentType: false,  //这里需要注意
        processData: false,
        success: function(data, textStatus){
          if(data.success){
            var portaintObj = data.data[0];
            // 上传后的头像url
            var portraitUrl = portaintObj.fileCallAddress;
            var portraitId = portaintObj.id;
            //异步更新头像地址
            $.ajax({
              url: _url,
              dataType: "json",
              cache: false,
              async: true,
              type: "POST",
              traditional:true,
              data: {
                id: businessId,
                portrait: portraitUrl,
                portraitId: portraitId,
                _method :'PUT'
              },
              headers: BaseUtils.serverHeaders(),
              crossDomain: true,
              timeout: 60000,
              success: function (data) {
                BaseUtils.htmPageUnblock();
                //获取窗口索引
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
              },
              error: function (data) {
                $("#up-error").show();
              }
            });
          } else {
            $("#up-error").show();
          }
        },
        error: function(){
          $("#up-error").show();
        }
      });
    })
  });


});
