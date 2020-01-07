;(function(window, document, $) {
    window.webuploaderUtils = {
        init : function(options){
            var $ = jQuery;
            var disX = 0;
            var disY = 0;
            var minZindex = 1;
            var origin;
            var is_moveing = false;
            var $wrap = $('#' + options.wrapId);
            // 图片容器
            var $queue = $('<ul class="filelist"></ul>').appendTo( $wrap.find('.queueList'));
            var $dnd =  options.wrapId + ' .queueList';
            // 状态栏，包括进度和控制按钮
            var $statusBar = $wrap.find('.statusBar');
            // 文件总体选择信息。
            var $info = $statusBar.find('.info');
            // 上传按钮
            var $upload = $wrap.find('.uploadBtn');
            // 没选择文件之前的内容。
            var $placeHolder = $wrap.find('.placeholder');
            // 进度条
            var $progress = $statusBar.find('.progress').hide();
            // 添加的文件数量
            var fileCount = 0;
            // 添加的文件总大小
            var fileSize = 0;
            // 可能有pedding, ready, uploading, confirm, done.
            var state = 'pedding';
            // 所有文件的进度信息，key为file id
            var percentages = {};
            // 继续添加按钮 id
            var $continueSelectFileId =  options.continueSelectFileId;
            //swf的地址
            var swf_path = "./Uploader.swf";
            // 上传后台服务地址
            var server_path = options.uploadUrl;
            //相册名称
            var $galname = "";
            var supportTransition = (function(){
                var s = document.createElement('p').style,
                    r = 'transition' in s ||
                        'WebkitTransition' in s ||
                        'MozTransition' in s ||
                        'msTransition' in s ||
                        'OTransition' in s;
                s = null;
                return r;
            })(),
            isSupportBase64 = ( function() {
                var data = new Image();
                var support = true;
                data.onload = data.onerror = function() {
                    if( this.width != 1 || this.height != 1 ) {
                        support = false;
                    }
                }
                data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                return support;
            } )();

            // 优化retina, 在retina下这个值是2
            var ratio = window.devicePixelRatio || 1;
            // 缩略图大小
            var thumbnailWidth = options.thumbWidth || 110;
            var thumbnailHeight = options.thumbHeight || 110;

            // 创建WebUploader 实例
            var uploader = WebUploader.create({
                // 指定Drag And Drop拖拽的容器，如果不指定，则不启动
                dnd: '.queueList',

                //是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
                // 默认 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
                disableGlobalDnd: options.disableGlobalDnd || true,

                //指定监听paste事件的容器，如果不指定，不启用此功能。此功能为通过粘贴来添加截屏的图片。建议设置为document.body
                paste: document.body,

                // 不压缩image
                resize: false,

                // 指定选择文件的按钮容器，不指定则不创建按钮。
                pick: {
                    //指定选择文件的按钮容器，不指定则不创建按钮。注意 这里虽然写的是 id, 但是不是只支持 id, 还支持 class, 或者 dom 节点。
                    id: '#' + options.selectFileId,

                    //{String} 指定按钮文字。不指定时优先从指定的容器中看是否自带文字。
                    innerHTML: options.selectFileLabel || '点击选择图片',

                    // {Boolean} 是否开起同时选择多个文件能力
                    multiple: options.selectFileMultiple || false
                },

                //指定接受哪些类型的文件。 由于目前还有ext转mimeType表，所以这里需要分开指定。
                accept: options.accept || {

                    //文字描述
                    title: 'Images',

                    //允许的文件后缀，不带点，多个用逗号分割。
                    extensions: 'gif,jpg,jpeg,bmp,png',

                    //多个用逗号分割。
                    mimeTypes: 'image/!*'
                },

                //配置生成缩略图的选项。默认如下
                thumb: {
                    width: thumbnailWidth,
                    height: thumbnailHeight,

                    // 图片质量，只有type为`image/jpeg`的时候才有效。
                    quality: 100,

                    // true 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify: false,

                    // 是否允许裁剪。
                    crop: true,

                    // 为空的话则保留原有图片格式。
                    // 否则强制转换成指定的类型。
                    type: 'image/jpeg'
                },

                //配置压缩的图片的选项。如果此选项为false, 则图片在上传前不进行压缩。默认如下
                compress: options.compress || {
                    width: 1600,
                    height: 1600,

                    // 图片质量，只有type为`image/jpeg`的时候才有效。
                    quality: 100,

                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify: false,

                    // 是否允许裁剪。
                    crop: false,

                    // 是否保留头部meta信息。
                    preserveHeaders: true,

                    // 如果发现压缩后文件大小比原来还大，则使用原来图片
                    // 此属性可能会影响图片自动纠正功能
                    noCompressIfLarger: false,

                    // 单位字节，如果图片大小小于此值，不会采用压缩。 设置为1MB
                    compressSize: 10 * 1048576
                },

                //{Boolean} [可选] [默认值：false] 设置为 true 后，不需要手动调用上传，有文件选择即开始上传。
                auto: options.auto || false,

                //{Object} [可选] [默认值：html5,flash] 指定运行时启动顺序。默认会想尝试 html5 是否支持，如果支持则使用 html5, 否则则使用 flash.可以将此值设置成 flash，来强制使用 flash 运行时。
                runtimeOrder: options.runtimeOrder || "html5,flash",

                // {Boolean} [可选] [默认值：false] 是否允许在文件传输时提前把下一个文件准备好。 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时。
                prepareNextFile: options.prepareNextFile || false,

                //{Boolean} [可选] [默认值：false] 是否要分片处理大文件上传。
                chunked: options.chunked || false,

                //{Boolean} [可选] [默认值：5242880] 如果要分片，分多大一片？ 默认大小为5M.
                chunkSize: options.chunkSize || 1024 * 1024 * 5,

                //{Boolean} [可选] [默认值：2] 如果某个分片由于网络问题出错，允许自动重传多少次？
                chunkRetry: options.chunkRetry || 2,

                //上传并发数。允许同时最大上传进程数。
                threads: options.threads || 1,

                //设置文件上传域的name。
                fileVal: options.fileVal || "file",

                //文件上传方式，POST或者GET。
                method: options.method || "POST",

                //文件上传请求的参数表，每次发送都会发送此对象中的参数。
                formData: options.formData || {},
                headers : options.headers || {},
                //是否已二进制的流的方式发送文件，这样整个上传内容php://input都为文件内容， 其他参数在$_GET数组中。
                sendAsBinary: options.sendAsBinary || false,

                //验证文件总数量, 超出则不允许加入队列。
                fileNumLimit: options.fileNumLimit || 1,

                //验证文件总大小是否超出限制, 超出则不允许加入队列
                fileSizeLimit: options.fileSizeLimit || 10 * 1024 * 1024,    // 10 M

                //验证单个文件大小是否超出限制, 超出则不允许加入队列。
                fileSingleSizeLimit: options.fileSingleSizeLimit || 10 * 1024 * 1024,    // 10 M

                //{Boolean} [可选] [默认值：undefined] 去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
                duplicate: options.duplicate,

                // swf文件路径
                swf: swf_path,

                //服务器地址
                server: server_path
            });



            /**
             * 图片拖拽交换位置事件
             */
            function setDragEvent(){
                $(this).on('drop', function(e){
                    var $from = $(origin).parents('li');
                    var $to = $(e.target).parents('li');
                    var origin_pos = $from.position();
                    var target_pos = $to.position();
                    var from_sort = $from.attr('data-sort');
                    var to_sort = $to.attr('data-sort');
                    $from.addClass('move').animate(target_pos,"fast", function(){
                        $(this).removeClass('move');
                    }).attr('data-sort', to_sort);
                    $to.addClass('move').animate(origin_pos,'fast', function(){
                        $(this).removeClass('move');
                    }).attr('data-sort', from_sort);
                }).on('dragstart', function(e){
                    if(is_moveing){
                        return false;
                    }
                    is_moveing = true;
                    e.originalEvent.dataTransfer.effectAllowd = 'move';
                    origin = this;
                }).on('dragover', function(e){
                    if( e.preventDefault)
                        e.preventDefault();
                    is_moveing = false;
                    e.originalEvent.dataTransfer.dropEffect = 'move';
                });
            };

            /**
             * 更新服务端附件
             */
            function updateServerFiles(){
                var postData = {};
                $('[data-src="server').each(function(index, obj){
                    postData[$(obj).attr('data-key')] = $(obj).attr('data-sort');
                });
                $.ajax({
                    type:'post',
                    url: options.updateUrl,
                    data: postData,
                    dataType:'json',
                    success:function(data){
                        //setState('finish');
                        alert('更新成功');
                        $upload.removeClass('disabled');
                        setState('ready');
                        uploader.reset();
                    }
                });
            };

            /**
             * 删除服务端附件
             * @param file
             */
            function removeServerFile( file, imageId){
                //询问框
                swal({
                    title: '你确定要删除?',
                    showCancelButton: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消'
                }).then(function(result){
                    if (result.value) {
                        var curImageId = imageId;
                        BaseUtils.pageMsgBlock();
                        $deleteAjax({
                            url: options.removeUrl,
                            data:{id: curImageId},
                            headers: BaseUtils.serverHeaders()
                        }, function (response) {
                            if (response.success) {
                                file.source.del = 1;
                                removeFile(file);
                               // uploader.removeFile( file, true);
                                updateStatus();
                            }
                        }, function (data) {

                        });
                    } else if (result.dismiss === 'cancel') {

                    }
                });

            };

            /**
             * 编辑时初始化回显服务端附件
             */
            function initServerFile(){
                if (options.businessId > 0) {
                    $getAjax({
                        url: options.initServerFileUrl,
                        data:{id: options.businessId},
                        headers: BaseUtils.serverHeaders()
                    }, function (response) {
                        var datas = response.data;
                        if (datas != null ) {
                            $.each(datas, function(index,item){
                                getFileObject(item.pictureLocation, item, function (fileObject) {
                                    var wuFile = new WebUploader.Lib.File(WebUploader.guid('rt_'), fileObject);
                                    var file = new WebUploader.File(wuFile);
                                    uploader.addFiles(file);
                                    //此处是关键，将文件状态改为'已上传完成'
                                    file.setStatus('complete');
                                });
                            });
                        }
                    });
                }
            };

            /**
             * 获取文件信息
             * @param imageUrl
             * @param cb
             */
            function getFileBlob(imageUrl, cb) {
                var xhr = new XMLHttpRequest();
                if (window.ActiveXObject) {
                    xhr = new ActiveXObject("Microsoft.XMLHttp");
                }
                xhr.open("GET", imageUrl, true);
                xhr.responseType = "blob";
                xhr.setRequestHeader("Cache-Control","no-cache");  //这段代码很重要 不缓存数据  由于缓存的问题，当url一样的时间就从上次得到的结果中直接取，而不与后台进行数据交互了
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhr.setRequestHeader("Accept","*/*");
                xhr.setRequestHeader("Access-Control-Allow-Headers","Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
                xhr.setRequestHeader("Content-Type", "image/jpeg");
                xhr.setRequestHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
                xhr.addEventListener('load', function() {
                    if (this.status == 200) {
                        cb(xhr.response);
                    }
                });
                xhr.send();
            };

            /**
             *
             * @param blob
             * @param name  文件名称
             * @param id
             * @returns {*}
             */
            function  blobToFile (blob, fileData) {
                blob.lastModifiedDate = new Date();
                blob.name = fileData.pictureName;
                blob.id = fileData.id;
                blob.fileId = fileData.pictureId;
                blob.fileCategory = fileData.pictureCategory;
                blob.srcUrl = fileData.pictureLocation;
                blob.fileSuffix = fileData.pictureType;
                blob.cover = fileData.cover;
                return blob;
            };

            /**
             * 得到文件对象
             * @param fileData
             * @param filePathOrUrl
             * @param cb
             */
            function getFileObject(filePathOrUrl, fileData, cb) {
                getFileBlob(filePathOrUrl, function (blob) {
                    cb(blobToFile(blob, fileData));
                });
            };


            /**
             * 添加附件到webuploader中
             * @param file
             */
            function addFile( file ){
                var index = $queue.find('li').length;
                var calculateWidth = thumbnailWidth + 6
                var imgLeft = index * calculateWidth;
                var imgTop = 8;
                var wrapHeight = thumbnailHeight + 13;
                var wrapWidth = $queue.width() + 2;
                if( imgLeft >= wrapWidth){
                    imgTop = (parseInt(imgLeft/wrapWidth) * wrapHeight) + 3;
                    wrapHeight = imgTop + wrapHeight;
                    var arrange = Math.round(wrapWidth/calculateWidth);
                    var sequence = index % arrange;;
                    imgLeft = sequence * calculateWidth;
                }
                if (imgLeft == 0) {
                    imgLeft = 2
                }
                $queue.height(wrapHeight);
                var $li = $('<li data-key="'+file.key+'"  data-src="'+file.src+'" data-sort="'+index+'" draggable="true" id="' + file.id + '" style="position:absolute;margin:0;cursor:move;width:'+thumbnailWidth+'px;height:'+thumbnailHeight+'px;left:'+imgLeft+'px;top:'+imgTop+'px">' +
                    '<p class="title">' + file.name + '</p>' +
                    '<p class="imgWrap"></p>' +
                    '<p class="progress"><span></span></p>' + '</li>'
                    ),
                    $btns = $('<div class="file-panel">'
                        + '<span class="cancel">删除</span>'
                        + '<span class="rotateRight">向右旋转</span>'
                        + '<span class="rotateLeft">向左旋转</span></div>').appendTo($li),

                    $progess = $li.find('p.progress span'),
                    $wrap = $li.find('p.imgWrap'),
                    $info = $('<p class="error"></p>'),
                    text,

                    showError = function( code ){
                        switch( code ){
                            case 'exceed_size':
                                text = '文本大小超出';
                                break;
                            case 'interrupt':
                                text = '上传暂停';
                                break;
                            default:
                                text = '上传失败，请重试';
                                break;
                        }
                        $info.text( text ).appendTo( $li );
                    };

                if( file.src == "client"){
                    if( file.getStatus() == 'invalid'){
                        showError( file.statusText );
                    } else {
                        $wrap.text('预览中');
                        uploader.makeThumb( file, function(error, src){
                            if( error ){
                                $wrap.text('不能预览');
                                return ;
                            }
                            if( isSupportBase64 ) {
                                var img = $('<img draggable="true" src="'+src+'">');
                                img.bind('load', setDragEvent);
                                $wrap.empty().append( img );
                            } else {
                                // 图片预览
                               // console.log(" 直接访问图片地址..........")
                                /* $.ajax('../../server/preview.php', {
                                     method: 'POST',
                                     data: src,
                                     dataType:'json'
                                 }).done(function( response ) {
                                     if (response.result) {
                                         img = $('<img src="'+response.result+'">');
                                         $wrap.empty().append( img );
                                     } else {
                                         $wrap.text("预览出错");
                                     }
                                 });*/
                            }

                        }, thumbnailWidth, thumbnailHeight);

                        percentages[ file.id ] = [ fileSize, 0];
                        file.rotation = 0;
                    };

                    file.on('statuschange', function(cur, prev){
                        if( prev == 'progress'){
                            $progress.hide().width(0);
                        } else if( prev == 'queued'){
                            $li.off('mouseenter mouseleave');
                            $btns.remove();
                        }

                        if( cur == 'error' || cur == 'invalid'){
                            showError( file.statusText );
                            percentages[ file.id][ 1 ] = 1;
                        } else if( cur == 'interrupt'){
                            showError('interrupt');
                        } else if( cur == 'queued'){
                            percentages[ file.id ][1] = 0;
                        } else if( cur == 'progress'){
                            $info.remove();
                            $progress.css('display', 'block');
                        } else if( cur == 'complete' ){
                            $li.append('<span class="success"></span>');
                        }

                        $li.removeClass('state-'+prev).addClass('state-'+cur);
                    });
                } else{
                    var img = $('<img draggable="true" src="'+file.path+'">');
                    img.bind('load',setDragEvent);
                    $wrap.empty().append( img );
                }

                $li.on('mouseenter', function(){
                    $btns.stop().animate({height:30});
                });
                $li.on('mouseleave', function(){
                    $btns.stop().animate({height:0})
                });

                $btns.on('click', 'span', function(){
                    var index = $(this).index(), deg;

                    switch( index ){
                        case 0:
                            //修改删除后面所有图片的位置
                            var allImgs = {};
                            var del_sort = parseInt($('#'+file.id).attr('data-sort'));
                            $queue.find('li').each(function(index, obj){
                                if( $(obj).attr('data-sort') > del_sort){
                                    var sort = parseInt($(obj).attr('data-sort'));
                                    var $prevObj = $("li[data-sort="+(sort-1)+"]");
                                    if( $prevObj ){
                                        allImgs[$(obj).attr('id')] = $prevObj.position();
                                    }
                                }
                            });
                            for(var k in allImgs){
                                var sort = parseInt($('#'+k).attr('data-sort'));
                                $('#'+k).attr('data-sort',sort-1).css({left:allImgs[k].left+'px', top:allImgs[k].top+'px'});
                            }
                            allImgs = null;
                            if( file.src == "client")
                                uploader.removeFile( file );
                            else{
                                var newFileId = file.source.source.id;
                                if (newFileId === undefined || typeof (newFileId) == undefined) {
                                    removeFile( file );
                                } else {
                                    //删除服务器上的文件
                                    removeServerFile( file, newFileId );
                                }
                                $('#'+file.id).remove();
                            }
                            return;
                        case 1:
                            file.rotation += 90;
                            break;
                        case 2:
                            file.rotation -= 90;
                            break;
                    }

                    if( supportTransition ){
                        deg = 'rotate(' + file.rotation + 'deg)';
                        $wrap.css({
                            '-webkit-transform': deg,
                            '-mos-transform': deg,
                            '-o-transform': deg,
                            'transform': deg
                        });
                    } else {
                        $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
                    }
                });
                $li.appendTo( $queue );

               /* $(".coverBoard").click(function (e) {
                    e.preventDefault();
                    console.log("设置封面");
                    return false;
                });*/
            }

            /**
             * 删除webupload中的图片
             * @param file
             */
            function removeFile( file ){
                var $li = $('#'+file.id);
                delete percentages[ file.id ];
                updateTotalProgress();
                $li.off().find('.file-panel').off().end().remove();
            }

            /**
             * 更新webuploader中图片上传的进度
             */
            function updateTotalProgress(){
                var loaded = 0,
                    total = 0,
                    spans = $progress .children(),
                    percent;

                $.each(percentages, function( k, v ) {
                    total += v[ 0 ];
                    loaded += v[ 0 ] * v[ 1 ];
                } );

                percent = total ? loaded / total : 0;
                spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
                spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
                updateStatus();
            }

            /**
             * 更新webuploader中的状态
             */
            function updateStatus(){
                var text = '', stats;
                if( state == 'ready'){
                    text = '选中'+fileCount + '张图片，共'+ WebUploader.formatSize( fileSize ) +'.';
                } else if( state == 'confirm'){
                    stats = uploader.getStats();
                    if( stats.uploadFailNum ){
                        text = '已成功上传' + stats.successNum + '张照片至' + $galname + '相册，'+
                            stats.uploadFailNum + '张照片上传失败，<a class="retry" style="color: #2ca189 !important;" href="#">重新上传</a>失败图片或<a class="ignore" style="color: #f4516c !important;" href="#">忽略</a>';
                    }
                } else {
                    stats = uploader.getStats();
                    text = '共' + fileCount +'张('+WebUploader.formatSize(fileSize)+')，已上传'+stats.successNum+'张';
                    if( stats.uploadFailNum){
                        text += ',失败'+ stats.uploadFailNum +'张';
                    } else {
                        if (stats.successNum != 0
                            && stats.successNum == fileCount) {
                            //图片上传成功提示
                           // console.log("图片上传成功.");
                        }
                    }
                }
                $info.html(text);
            }

            /**
             * 设置webuploader的状态
             * @param val
             */
            function setState(val){
                var file,stats;
                if( val == state){
                    return ;
                }
                $upload.removeClass('state-'+state);
                $upload.addClass('state-'+val);
                state = val;

                switch( state ){
                    case 'pedding':
                        $placeHolder.removeClass('element-invisible');
                        $queue.parent().removeClass('filled');
                        $queue.hide();
                        $statusBar.addClass('element-invisible');
                        uploader.refresh();
                        break;
                    case 'ready':
                        $placeHolder.addClass('element-invisible');
                        $($continueSelectFileId).removeClass('element-invisible');
                        $queue.parent().addClass('filled');
                        $queue.show();
                        $statusBar.removeClass('element-invisible');
                        uploader.refresh();
                        break;
                    case 'uploading':
                        $($continueSelectFileId).addClass('element-invisible');
                        $progress.show();
                        $upload.text('暂停上传');
                        break;
                    case 'paused':
                        $progress.show();
                        $upload.text('继续上传');
                        break;
                    case 'confirm':
                        $progress.hide();
                        // $($continueSelectFileId).removeClass( 'element-invisible' );
                        $upload.text('开始上传').addClass('disabled');
                        stats = uploader.getStats();
                        if( stats.successNum && !stats.uploadFailNum ){
                            setState( 'finish' );
                            return ;
                        }
                        break;
                    case 'finish':
                        stats = uploader.getStats();
                        if( stats.successNum ){
                           // console.log('上传成功');
                        } else {
                            state = 'done';
                            location.reload();
                        }
                        break;
                }
                updateStatus();
            }

            /**
             * 文件加入到webuploader中的队列
             * @param file
             */
            function fileQueue(file){
                file.src = file.src || "client";
                fileCount++;
                fileSize += file.size;

                if( fileCount == 1){
                    $placeHolder.addClass('element-invisible');
                    $statusBar.show();
                }
                addFile( file );
                setState( 'ready' );
                updateTotalProgress();
            }


            if( !WebUploader.Uploader.support() ) {
                toastr.warning('WebUploader 不支持');
                throw new Error('WebUploader does not support');
            }

            uploader.on("error", function (type) {
                if (type == "Q_TYPE_DENIED") {
                    toastr.warning("请上传gif,jpg,jpeg,bmp,png格式文件", "图片类型错误");
                } else if (type == "F_EXCEED_SIZE") {
                    toastr.warning("单个文件大小不能超过"+ options.fileSingleSizeLimit +"M", "图片大小错误");
                }else if (type == "Q_EXCEED_NUM_LIMIT"){
                    toastr.warning("图片总数不能超过" + options.fileNumLimit + "张", "图片数量错误");
                } else {
                    toastr.error("上传出错！请检查后重新上传！错误代码：" + type);
                }
            });

            uploader.onError = function( code ) {
                toastr.error( '上传 Eroor: ' + code );
            };

            //当 uploader 被重置的时候触发。
            uploader.on("reset", options.reset || function () {
            });

            //当开始上传流程时触发。
            uploader.on("startUpload", options.startUpload || function () {

            });

            //当开始上传流程暂停时触发。
            uploader.on("stopUpload", options.stopUpload || function () {
            });

            //当所有文件上传结束时触发。
            uploader.on("uploadFinished", options.uploadFinished || function () {
            });

            //某个文件开始上传前触发，一个文件只会触发一次。
            uploader.on("uploadStart", options.uploadStart || function (file) {
               // console.log("uploadStart", file);
            });

            uploader.addButton({
                id: $continueSelectFileId,
                label: '继续添加',
            });


            /* 上传过程中触发，携带上传进度。
               file {File}File对象
               percentage {Number}上传进度
            */
            uploader.on('uploadProgress', function( file, percentage){
                var $li = $('#' + file.id),
                    $percent = $li.find('.progess span');
                $percent.css( "width", percentage * 100 + '%');
                updateTotalProgress();
            });


            //当文件被加入队列以后触发。
            uploader.on('fileQueued', fileQueue);

            //当文件被移除队列后触发。
            uploader.on('fileDequeued', function(file){
                fileCount --;
                fileSize -= file.size;
                if( !fileCount){
                    setState('pedding');
                };
                var itemSource = file.source;
                var curFileId = itemSource.source.id;
                if (curFileId === undefined || typeof (curFileId) == undefined) {
                    removeFile( file );
                } else {
                    if (itemSource.del != 1) {
                        //删除服务器上的文件
                        removeServerFile(file, curFileId);
                    }
                }
                updateTotalProgress();
            });

            /*
                文件上传成功，给item添加成功class, 用样式标记上传成功。
                file {File}File对象
                response {Object}服务端返回的数据
            */
            uploader.on('uploadSuccess', function(file, response){
                $('#' + file.id ).find('p.state').text('已上传');
            });

            /** 当某个文件上传到服务端响应后，会派送此事件来询问服务端响应是否有效。如果此事件handler返回值为false, 则此文件将派送server类型的uploadError事件。
             * object {Object}
             * response {Object}服务端的返回数据，json格式，如果服务端不是json格式，从response中取数据，自行解析。
             */
            uploader.on('uploadAccept', function(object, response){
                if (!response.success || response.status != 200) {
                    // 通过return false来告诉组件，此文件上传有错。
                    return false;
                }
            });


            /* 当文件上传出错时触发。
               file {File}File对象
               reason {String}出错的code
           */
            uploader.on('uploadError', function(file, reason){
               // console.log('uploadError',file, reason ,"上传失败");
            });

            // 不管成功或者失败，文件上传完成时触发。
            uploader.on('uploadComplete', function(file){
                $('#' + file.id ).find('p.state').fadeOut();
               // console.log('uploadComplete', file, "上传结束")
            });

            uploader.on('all', function( type ){
                if( type == 'uploadFinished') {
                    setState('confirm');
                } else if( type == 'startUpload' ){
                    setState('uploading');
                } else if( type == 'stopUpload' ){
                    setState('paused');
                }
            });

            /*当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
                object {Object}
                data {Object}默认的上传参数，可以扩展此对象来控制上传参数。
                headers {Object}可以扩展此对象来控制上传头部。
            */
            uploader.on('uploadBeforeSend', function(block, data, headers){
                data.sort = $('#'+data.id).attr('data-sort');
                headers =$.extend({},  BaseUtils.cloudHeaders() );
            });

            function sortNumber(a, b){
                return a - b;
            }

            $upload.on('click', function(){
                //修改上传的顺序
                uploader.sort(function (obj1, obj2) {
                    return sortNumber($('#' + obj1.id).attr('data-sort'),$('#' + obj2.id).attr('data-sort'));
                });
                if( $(this).hasClass('disabled')){
                    return false;
                }
                if( state == 'ready'){
                    if(uploader.getFiles().length < 1) {
                        updateServerFiles();
                    } else {
                        uploader.upload();
                    }
                } else if(state == 'paused'){
                    uploader.upload();
                } else if( state == 'uploading'){
                    uploader.stop();
                }
            });

            $info.on('click', '.retry', function(){
                uploader.retry();
            });

            //忽略上传失败文件
            $info.on('click', '.ignore', function(){
                // 获取上传失败的文件
                var files = uploader.getFiles('error');
                for (var i = 0; i < files.length; i++) {
                    // 直接删除上传失败的文件
                    uploader.removeFile(files[i]);
                }
            });

            $upload.addClass('state-'+state);
            updateTotalProgress();

            initServerFile();

            return uploader;

        },
        reset: function(options) {
            // 获取上传失败的文件
            var files = options.getFiles;
            for (var i = 0; i < files.length; i++) {
                // 直接删除上传失败的文件
                options.removeFile(files[i]);
            }
            options.refresh();
        }
    };

})(window, document, $);