/**
 * 上传组件
 */
NEJ.define([
    'text!./fileUploader.html',
    'base/util',
    'base/element',
    'util/template/tpl',
    'ui/base',
    'util/ajax/xdr',
    'util/encode/md5',
    './util.js',
    './constant.js',
    './defaultConfig.js',
    'pool/edu-front-util/src/mobileUtil',
    'pool/edu-front-util/src/userUtil'
], function(
    _template,
    ut,
    e,
    t,
    ui,
    j,
    md5,
    uploadUtil,
    uploadConst,
    defaultConfig,
    _mobileUtil,
    userUtil,
    p, o, f, r) {

    // 样式
    var _seed_css = e._$pushCSSText('\
        .u-upload{ position:relative; display:inline-block;}\
        .u-upload .showIpt{ text-align:center; overflow:hidden;}\
        .u-upload .filewrap{ overflow:hidden; position:absolute; top:0; left:0; width:100%; height:100%;}\
        .u-upload .realIpt{ font-size:100px; display:block; position:absolute; top:0; left:0; filter:alpha(opacity=0); opacity:0; cursor:pointer; width:100%; height:100%;}');

    // 上传组件类
    p._$$UploadUI = NEJ.C();

    var _proUploadUI;

    _proUploadUI = p._$$UploadUI._$extend(ui._$$Abstract, true);

    /**
     * 初始化外观信息
     *
     */
    _proUploadUI.__initXGui = function() {
        this.__seed_css = _seed_css;
        this.__seed_html = t._$addNodeTemplate(_template);
    };

    /**
     * 初始化节点
     *
     * @return {Void}
     */
    _proUploadUI.__initNode = function() {
        this.__supInitNode();

        //初始化节点
        this.__showUpload = this.__body;

        this.__txtNode = e._$getByClassName(this.__body, 'j-txt')[0];

        this.__fileWrapNode = e._$getByClassName(this.__body, 'j-filewrap')[0];

        this.__uploadForm = e._$getByClassName(this.__body, 'j-uploadForm')[0]; // 表单节点

    };

    /**
     * 统一的错误处理
     */
    _proUploadUI.__errorHandler = function(_msg, _callBack) {
        if (!ut._$isObject(_msg)) {
            _msg = {
                message: _msg
            }
        }

        if (_msg.code == -2) { // edu token 过期错误
            this.__getEduToken();
            return;
        };

        // 如果有其他地址，则重试。取消上传也会触发错误，但是不应该重新上传，这里不好判断
        // if (this.__uploadIPs.length > 1 && this.__posUploadIPIndex < this.__uploadIPs.length - 1) {
        //     this.__posUploadIPIndex++;

        //     this.__checkToUpload();
        //     return;
        // };
        
        var _code = _msg.code || _msg.errCode || '';
        var _str = _msg.errMsg || _msg.msg || _msg.message || '网络错误';

        this.__resetHtmlFileNode();

        if (!this.__isAbort) { // 如果没有__reqId则是主动取消，不抛错
            this.__config.onUploadError && this.__config.onUploadError({
                reqId : this.__reqId,
                errCode : _code,
                errMsg : _str,
                fileName : this.__file
            });
        };
    };

    /**
     * 重置file域
     */
    _proUploadUI.__resetHtmlFileNode = function(_disable) {
        //允许多次选择同一个文件，因此每次都重置file域
        var _html;

        if (!!_disable) { // 禁用
            this.__fileWrapNode.innerHTML = '';
            return
        }

        _html = '<input name="file" type="file" class="j-inputfile realIpt" title="" ';
        switch (this.__config.type){
            case uploadConst.UPLOAD_FILE_TYPE_PDF:
                _html += 'accept="' + uploadConst.PDF_FILE_EXTENSION.join(', ') + '" >';
                break;

            case uploadConst.UPLOAD_FILE_TYPE_VIDEO:
                _html += 'accept="' + uploadConst.VIDEO_FILE_EXTENSION.join(', ') + '" >';
                break;

            case uploadConst.UPLOAD_FILE_TYPE_ATTACH:
                _html += 'accept="' + uploadConst.ATTACH_FILE_EXTENSION.join(', ') + '" >';
                break;
            case uploadConst.UPLOAD_FILE_TYPE_ATTACH_BIG:
                _html += 'accept="' + uploadConst.ATTACH_FILE_EXTENSION_BIG.join(', ') + '" >';
                break;
            case uploadConst.UPLOAD_FILE_TYPE_CAPTION:
                _html += 'accept="' + uploadConst.CAPTION_FILE_EXTENSION.join(', ') + '" >';
                break;
            case uploadConst.UPLOAD_FILE_TYPE_IMAGE:
                //解决安卓微信 webView 上传图片问题 
                if (_mobileUtil._$is('android') && _mobileUtil._$isWeixin()) {
                    _html += ' >';
                } else {
                    _html += 'accept="' + uploadConst.IMAGE_FILE_EXTENSION.join(', ') + '" >';
                }
                break;
            case uploadConst.UPLOAD_FILE_TYPE_EXCEL:
                _html += 'accept="' + uploadConst.EXCEL_FILE_EXTENSION.join(', ') + '" >';
                break;
            case uploadConst.UPLOAD_FILE_TYPE_AUDIO:
                _html += 'accept="' + uploadConst.AUDIO_FILE_EXTENSION.join(', ') + '" >';
                break;
            default:
                _html += '>';
                break;

        }


        this.__fileWrapNode.innerHTML = _html;

        this.__realUpload = e._$getByClassName(this.__body, 'j-inputfile')[0];

        this.__doInitDomEvent([
            [this.__realUpload, 'change', this.__uploadHandler._$bind(this)]
        ]);
    }

    /**
     * 禁用
     */
    _proUploadUI._$disable = function(_disable) {
        this.__isDisable = _disable;

        if (this.__isDisable) {
            if (this.__config.btnDisableClassName) {
                e._$addClassName(this.__showUpload, this.__config.btnDisableClassName);
            }
        } else {
            if (this.__config.btnDisableClassName) {
                e._$delClassName(this.__showUpload, this.__config.btnDisableClassName);
            }
        }

        this.__resetHtmlFileNode(_disable);
    }

    /**
     * 取消上传，该方法暂时不对外
     */
    _proUploadUI._$abort = function() {
        this.__isAbort = true;

        // 所有请求都取消
        if (this.__reqId) {
            j._$abort(this.__reqId);
            this.__reqId = null;
        }

        if (this.__blobUploadId) {
            uploadUtil._$abortFileUploadByBlobs(this.__blobUploadId);
            this.__blobUploadId = null;
        };

        this.__resetHtmlFileNode();
    }

    /**
     * 上传进度事件
     */
    _proUploadUI.__onUploading = function(_data) {
        if (!!_data) {
            _data.initOffset = _data.initOffset || 0;
            _data.beginTime = this.__beginTime;
            _data.fileName = this.__file;

            this.__config.onUpdateProgress && this.__config.onUpdateProgress(_data);
        }
    };

    /**
     * 上传完成处理
     */
    _proUploadUI.__onUploadComplete = function(_data) {
        _data = _data || {};

        this.__resetHtmlFileNode();

        if (_data.errCode) { // nos上传完成的结果也可能出错，包含了错误信息
            this.__errorHandler(_data);
            return;
        }

        // 上传完成需要校验文件，目前只需要校验断点续传的视频和PDF
        if (this.__isSupportAnchor()) {
            this.__checkFileComplete();
            return;
        };

        var _finishDta = {
            fileName : this.__file,    // 视频文件的名称
            nosKey : this.__nosKey,     // 视频文件上传至nos的对象名
            bucket : this.__bucket

        };

        // 触发上传完成事件
        this.__config.onFinishUpload && this.__config.onFinishUpload(_finishDta);
    };

    /**
     * 点击上传按钮的操作
     */
    _proUploadUI.__uploadHandler = function() {
        // 重新选择文件后重置
        this.__isAbort = false;

        var _filePath = this.__realUpload.value,
            _fileName = _filePath;

        while (_fileName.indexOf('\\') != -1) {
            _fileName = _fileName.slice(_fileName.lastIndexOf('\\') + 1);
        }

        // 如果需要对文件格式进行判断，则调用this.__verifyFile进行判断，可由options传入
        // // 提供文件名和节点作为参数，不同浏览器对于file操作和属性不一样，需要自己处理
        if (!!this.__config.verifyFile && !this.__config.verifyFile(_fileName, this.__realUpload, this.__config.sizeLimit)) {
            this.__resetHtmlFileNode();
            return;
        }

        // 保存文件信息
        this.__file = _fileName;
        this.__filePath = md5._$str2hex(_filePath);
        this.__beginTime = new Date().getTime(); // 开始上传的时间戳
        this.__fileSize = uploadUtil._$getFileSize(this.__realUpload);
        this.__fileGmtModifiedTime = uploadUtil._$getFileLastModifiedTime(this.__realUpload);

        // 触发开始上传事件
        if (!!this.__file) {
            this.__config.onBeginUpload && this.__config.onBeginUpload({
                'name': this.__file,
                'fileName': this.__file,
                'curTime': this.__beginTime
            });
        }

        // 调用应用接口获取凭证
        this.__getEduToken();
    }

    /**
     * 调用应用接口获取凭证，用于交换nos数据
     */
    _proUploadUI.__getEduToken = function() {
        var _data = {
            'fileName': encodeURIComponent(this.__file),
            'type': uploadUtil._$getFinalUploadType(this.__config.type), // 实际发送的type
            'fileSize': this.__fileSize,
            'fileGmtModifiedTime': this.__fileGmtModifiedTime
        };

        // 兼容IE8/IE9获取不了fileSize方案
        if(!_data.fileSize){
            _data.filePath = this.__filePath;
            _data.version = 2;
            _data.uuid = userUtil._$getUuidFromCookie();
        };

        // 调用应用接口
        var _options = {
            sync: false,
            type: 'json',
            data: _data,
            query: {},
            method: 'GET',
            timeout: 0,
            headers: {},
            cookie: false, // 跨域请求是否带cookie，仅对CORS方式有效
            mode: this.__config.mode, // 请求模式,针对跨域请求采用的请求方式
            onload: function(_data) {
                if (!!_data) {
                    if (_data.code != 0) { // 错误
                        this.__errorHandler(_data);
                    } else {
                        this.__eduUploaderToken = _data.result;

                        // 交换token
                        this.__getNosToken();
                    }

                } else {
                    this.__errorHandler('上传失败！无数据返回');
                }
            }._$bind(this),
            onerror: this.__errorHandler._$bind(this, '初始化上传失败！')
        };

        this.__reqId = j._$request(this.__config.initUploadUrl, _options);
    }

    /**
     * 调用交换接口获取nos数据
     */
    _proUploadUI.__getNosToken = function() {
        // 调用token接口
        var _options = {
            sync: false,
            type: 'json',
            query: {
                'eduUploaderToken': this.__eduUploaderToken,
                'fileName': encodeURIComponent(this.__file),
                'fileSize': this.__fileSize,
                'fileGmtModifiedTime': this.__fileGmtModifiedTime,
                '_t': (new Date()).getTime()
            },
            method: 'GET',
            timeout: 0,
            headers: {},
            cookie: false, // 跨域请求是否带cookie，仅对CORS方式有效
            mode: this.__config.mode, // 请求模式,针对跨域请求采用的请求方式
            onload: function(_data) {
                if (!!_data) {
                    if (_data.code != 0) {
                        this.__errorHandler(_data); //'上传失败，code:' + _data.code + '，errMsg:' + _data.message);
                    } else {
                        // nos token
                        this.__xNosToken = _data.result.xnosToken;
                        // nos桶名
                        this.__bucket = _data.result.bucketName;
                        // 存储上传文件的object对象名
                        this.__nosKey = _data.result.nosKey;

                        // 开始文件上传操作
                        this.__checkToUpload();
                    }

                } else {
                    this.__errorHandler('上传失败！无数据返回');
                }
            }._$bind(this),
            onerror: this.__errorHandler._$bind(this, '上传失败！')
        };

        this.__reqId = j._$request(uploadConst.EXCHANGE_NOSTOKEN_URL, _options);
    }

    /**
     * 检查文件是否完整
     */
    _proUploadUI.__checkFileComplete = function(){
        // 调用token接口
        var _options = {
            type : 'json',
            query : {
                'bucketName':this.__bucket,
                'nosKey' : this.__nosKey
            },
            method  : 'POST',
            cookie : false,  // 跨域请求是否带cookie，仅对CORS方式有效
            mode : this.__config.mode,   // 请求模式,针对跨域请求采用的请求方式
            onload: function(_data){
                if(!!_data){
                    if(_data.code == 0 && !!_data.result){
                        var _finishDta = {
                            fileName : this.__file,    
                            nosKey : this.__nosKey,     
                            bucket : this.__bucket
                        };

                        // 触发上传完成事件
                        this.__config.onFinishUpload && this.__config.onFinishUpload(_finishDta);
                    }else{
                        this.__errorHandler({
                            errCode : -3,
                            errMsg : '文件校验失败！请重新上传'
                        });
                    }

                }else{
                    this.__errorHandler({
                        errCode : -3,
                        errMsg : '文件校验失败！请重新上传'
                    });
                }
            }._$bind(this),
            onerror:this.__errorHandler._$bind(this, {
                errCode : -3,
                errMsg : '文件校验失败！请重新上传'
            })
        };

        this.__reqId = j._$request(uploadConst.CHECK_FILE_COMPLETE_URL, _options);
    }

    // 判断选择哪种上传
    _proUploadUI.__checkToUpload = function() {
        if (this.__isSupportAnchor()) {
            // 开始断点续传
            if (this.__hasGetIPs) { // 已经获取了ip
                this.__startUploadByBlobs();
            } else {
                this.__getNosIP();
            }

        } else {
            this.__startFromUpload(); // 开始普通表单直传
        }
    }

    /**
     * 开始表单上传
     */
    _proUploadUI.__startFromUpload = function() {
        e._$getByClassName(this.__uploadForm, 'j-noskey')[0].value = this.__nosKey;
        e._$getByClassName(this.__uploadForm, 'j-xnostoken')[0].value = this.__xNosToken;

        // 普通表单上传
        var _options = {
            type: 'json',
            mode: this.__config.mode,
            method: 'POST',
            cookie: false,
            headers: {},
            onuploading: this.__onUploading._$bind(this), // 表单上传没有进度，所以可以不传
            onload: this.__onUploadComplete._$bind(this),
            onerror: this.__errorHandler._$bind(this)
        };

        // nos上传地址
        this.__uploadForm.action = this.__uploadIPs[this.__posUploadIPIndex] + '/' + this.__bucket;
        this.__reqId = j._$upload(this.__uploadForm, _options);
    }

    /**
     * 选择断点续传的ip
     */
    _proUploadUI.__getNosIP = function() {
        var _options = {
            sync: false,
            type: 'json',
            data: {},
            query: {
                'version': '1.0',
                'bucketname': this.__bucket
            },
            method: 'GET',
            timeout: 0,
            cookie: false, // 跨域请求是否带cookie，仅对CORS方式有效
            mode: this.__config.mode, // 请求模式,针对跨域请求采用的请求方式
            onload: function(_data) {
                if (!!_data) {
                    // 目前只使用第一个ip，建议增加重试功能，如果当前ip上传失败，使用下一个ip
                    this.__uploadIPs = _data.upload;
                    this.__hasGetIPs = true;

                    this.__startUploadByBlobs();

                } else {
                    this.__errorHandler('上传失败！无法获得上传地址');
                }
            }._$bind(this),
            onerror: this.__errorHandler._$bind(this, '上传失败！')
        };

        this.__reqId = j._$request(uploadConst.NOS_GET_IP_URL, _options);
    }

    /**
     * 开始断点上传
     */
    _proUploadUI.__startUploadByBlobs = function() {
        this.__blobUploadId = uploadUtil._$fileUploadByBlobs({
            key: this.__blobUploadId, // 如果有key，说明是重试
            ip: this.__uploadIPs[this.__posUploadIPIndex], // 目前只使用第一个ip，建议增加重试功能，如果当前ip上传失败，使用下一个ip
            file: this.__realUpload.files[0],
            fileName: this.__file,
            form: this.__uploadForm,
            mode: this.__config.mode,
            eduUploaderToken: this.__eduUploaderToken,
            xNosToken: this.__xNosToken,
            nosKey: this.__nosKey,
            bucket: this.__bucket,
            onuploading: this.__onUploading._$bind(this),
            onload: this.__onUploadComplete._$bind(this),
            onerror: this.__errorHandler._$bind(this)
        });
    }

    /**
     * 重置ui
     * _options:
     *      配置:
     *      parent
     *      type
     *      txt
     *      verifyFile
     *
     *      事件回调:
     *      onBeginUpload
     *      onUpdateProgress
     *      onFinishUpload
     *      onUploadError
     */
    _proUploadUI.__reset = function(_options) {
        this.__supReset(_options);

        // 配置
        this.__config = ut._$merge({}, defaultConfig()); // 从默认配置拷贝
        this.__config = ut._$merge(this.__config, _options || {}, function(val) {
            return val === undefined;
        }); // 如果是undefined就不覆盖

        this.__txtNode.innerHTML = this.__config.txt;

        if (this.__config.btnClassName) {
            e._$addClassName(this.__showUpload, this.__config.btnClassName);
        }

        ////////////////////////// 上传相关数据 /////////////////////////

        // 文件信息
        this.__file = null;
        this.__fileSize = null;
        this.__fileGmtModifiedTime = null;
        // 请求凭证
        this.__eduUploaderToken = '';

        // 实际上传地址
        this.__uploadIPs = [uploadConst.NOS_FORM_UPLOAD_URL];
        this.__posUploadIPIndex = 0; // 当前使用第几个上传ip

        // 访问nos的token信息
        this.__xNosToken = '';
        // nos桶名
        this.__bucket = '';
        // 存储上传文件的object对象名
        this.__nosKey = '';

        // 请求id
        this.__reqId = null;
        // 断点续传id
        this.__blobUploadId = null;
        // 是否主动中断
        this.__isAbort = false;
        // 是否禁用
        this.__isDisable = false;
        // 是否已经获取的断点续传的ip地址
        this.__hasGetIPs = false;

        // 允许多次选择同一个文件，因此每次都重置file域
        this.__resetHtmlFileNode();
    };

    // 是否可以使用断点续传，只有视频、pdf、scorm支持
    _proUploadUI.__isSupportAnchor = function(){
        return  uploadUtil._$canUseFileUploadByBlobs() &&
            (this.__config.type == uploadConst.UPLOAD_FILE_TYPE_VIDEO || 
            this.__config.type == uploadConst.UPLOAD_FILE_TYPE_PDF ||
            this.__config.type == uploadConst.UPLOAD_FILE_TYPE_SCORM || 
            this.__config.type == uploadConst.UPLOAD_FILE_TYPE_AUDIO ||
            this.__config.type == uploadConst.UPLOAD_FILE_TYPE_ATTACH_BIG);
    }

    /**
     * 销毁ui
     */
    _proUploadUI.__destroy = function() {
        this._$abort();

        // 清除类
        if (this.__config.btnClassName) {
            e._$delClassName(this.__showUpload, this.__config.btnClassName);
        }

        if (this.__config.btnDisableClassName) {
            e._$delClassName(this.__showUpload, this.__config.btnDisableClassName);
        }

        this.__supDestroy();
    }

    // 返回结果可注入给其他文件
    return p;
});
