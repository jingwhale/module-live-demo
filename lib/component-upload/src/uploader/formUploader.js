/**
 * ----------------------------------------------------------------
 *  表单文件上传，用于小文件，无进度
 *  @version  1.0
 *  @module   pool/component-upload/src/uploader/formUploader
 * ----------------------------------------------------------------
 */
NEJ.define([
    'text!./formUploader.html',
    'base/util',
    'base/element',
    'util/template/tpl',
    'ui/base',
    'util/ajax/xdr',
    './util.js',
    './constant.js',
    './uploaderBase.js'
],function(
    _template,
    ut, 
    e, 
    t, 
    ui, 
    j, 
    uploadUtil, 
    uploadConst,
    uploaderBase,
    p, o, f, r){

    // 样式
    var _seed_css = e._$pushCSSText('\
        .u-formUpload{ position:relative; display:inline-block;}\
        .u-formUpload .showIpt{ text-align:center; overflow:hidden;}\
        .u-formUpload .filewrap{ overflow:hidden; position:absolute; top:0; left:0; width:100%; height:100%;}\
        .u-formUpload .realIpt{ font-size:100px; display:block; position:absolute; top:0; left:0; filter:alpha(opacity=0); opacity:0; cursor:pointer; width:100%; height:100%;}');
    
    // 上传组件类
    p._$$FormUploadUI = NEJ.C();

    var _proFormUploadUI;

    _proFormUploadUI = p._$$FormUploadUI._$extend(uploaderBase._$$UploadBase, true);    

    /**
     * 初始化外观信息
     *
     */
    _proFormUploadUI.__initXGui = function() {
        this.__seed_css  = _seed_css;
        this.__seed_html = t._$addNodeTemplate(_template);
    };

    /**
     * 初始化节点
     * 
     * @return {Void}
     */
    _proFormUploadUI.__initNode = function() {
        this.__supInitNode();

        //初始化节点
        this.__showUpload = this.__body;
        
        this.__txtNode = e._$getByClassName(this.__body,'j-txt')[0];      

        this.__fileWrapNode = e._$getByClassName(this.__body,'j-filewrap')[0];        
        
        this.__uploadForm = e._$getByClassName(this.__body, 'j-uploadForm')[0]; // 表单节点
        
    };  

    /**
     * 重置file域
     */
    _proFormUploadUI.__resetHtmlFileNode = function(_disable){
        //允许多次选择同一个文件，因此每次都重置file域
        var _html;

        if (!!_disable) { // 禁用
            this.__fileWrapNode.innerHTML = '';
            return
        }
        
        _html = '<input name="file" type="file" class="j-inputfile realIpt" title="">';
        
        this.__fileWrapNode.innerHTML = _html;

        this.__realUpload = e._$getByClassName(this.__body, 'j-inputfile')[0];

        this.__doInitDomEvent([[this.__realUpload, 'change', this.__uploadHandler._$bind(this)]]);
    }

    /**
     * 禁用
     */
    _proFormUploadUI._$disable = function(_disable){
        this.__super(_disable);

        if (this.__isDisable) {
            if(this.__config.btnDisableClassName){
                e._$addClassName(this.__showUpload, this.__config.btnDisableClassName);
            }
        }else{
            if(this.__config.btnDisableClassName){
                e._$delClassName(this.__showUpload, this.__config.btnDisableClassName);
            }
        }

        this.__resetHtmlFileNode(_disable);
    }
    
    /**
     * 取消上传
     */
    _proFormUploadUI._$abort = function(_index){
        this.__super(_index);

        this.__resetHtmlFileNode();
    }

    /**
     * 上传进度事件
     */
    _proFormUploadUI.__onUploading = function(_index, _data){
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
    _proFormUploadUI.__onUploadComplete = function(_index, _data){
        _data = _data || {};
        
        this.__resetHtmlFileNode();

        if(_data.errCode){ // nos上传完成的结果也可能出错，包含了错误信息
            this.__errorHandler(_index, _data);
            return;
        }

        _data = {
            fileName : this.__file,    // 视频文件的名称
            nosKey : this.__nosKey,     // 视频文件上传至nos的对象名
            bucket : this.__bucket
        };

        // 触发上传完成事件
        this.__config.onFinishUpload && this.__config.onFinishUpload(_data);            
    };

    /**
     * 统一的错误处理
     */
    _proFormUploadUI.__errorHandler = function(_index, _msg){
        if (!ut._$isObject(_msg)) {
            _msg = {
                message : _msg
            }
        }

        var _str = (_msg.code || _msg.errCode || '') + (_msg.errMsg || _msg.msg || _msg.message || '网络错误');

        this.__resetHtmlFileNode();

        if (!this.__dataCache[_index].isAbort) { // 如果是主动取消，不抛错
            this.__config.onUploadError && this.__config.onUploadError({
                errMsg : _str,
                fileName : this.__file
            });
        };
    }

    /**
     * edu接口错误处理
     */
    _proFormUploadUI.__eduErrorHandler = function(_index, _data){
        // 出错重试
        if (_data.code == -2) { // edu token 过期错误
            // 重新调用应用接口获取凭证
            this.__getEduToken(_index);
            return;
        };

        this.__errorHandler(_index, _data);
    }

    /**
     * nos接口错误处理
     */
    _proFormUploadUI.__nosErrorHandler = function(_index, _msg){
        // 可以添加出错重试
        this.__dataCache[_index].nosErrorCount++;

        if(this.__dataCache[_index].nosErrorCount <= 3){
            // 重新调用应用接口获取凭证
            this.__getEduToken(_index);
            return;
        }

        this.__errorHandler(_index, _msg);
    }

    /**
     * 点击上传按钮的操作
     */
    _proFormUploadUI.__uploadHandler = function(){
        var _fileName = this.__realUpload.value;

        while (_fileName.indexOf('\\') != -1){
            _fileName = _fileName.slice(_fileName.lastIndexOf('\\') + 1);
        }
        
        // 如果需要对文件格式进行判断，则调用this.__verifyFile进行判断，可由options传入
        // 提供文件名和节点作为参数，不同浏览器对于file操作和属性不一样，需要自己处理
        if(!!this.__config.verifyFile && !this.__config.verifyFile(_fileName, uploadUtil._$getFileSize(this.__realUpload), this.__realUpload)){ 
            this.__resetHtmlFileNode();
            return;
        }
        
        // 触发开始上传事件。等待外部获取nos信息后，需要主动调用_$startUpload开始上传
        this.__config.onBeginUpload && this.__config.onBeginUpload({
            'name':this.__file,
            'curTime':this.__beginTime
        });

        var _index = this.__dataCache.length;

        // 缓存
        this.__dataCache.push({
            isAbort : false,
            nosErrorCount : 0, // nos上传出错次数
            index : _index,
            fileName : _fileName,
            beginTime : new Date().getTime(), // 开始上传的时间戳
            fileSize : uploadUtil._$getFileSize(this.__realUpload),
            fileGmtModifiedTime : uploadUtil._$getFileLastModifiedTime(this.__realUpload)
        });

        // 调用应用接口获取凭证
        this.__getEduToken(_index);
    }

    // 上传方法。判断选择哪种上传
    _proFormUploadUI.__startUpload = function(_index){
        this.__super();

        if (this.__isSupportAnchor()) {
            // 开始断点续传
            this.__getNosIP(_index, function(){
                this.__startUploadByBlobs(_index);
            }._$bind(this));
            
        }else{
            this.__startFromUpload(_index); // 开始普通表单直传
        }
    }

    /**
     * 开始表单上传
     */
    _proFormUploadUI.__startFromUpload = function(_index){
        var _data = this.__dataCache[_index];

        e._$getByClassName(this.__uploadForm, 'j-noskey')[0].value = _data.nosKey;
        e._$getByClassName(this.__uploadForm, 'j-xnostoken')[0].value = _data.xNosToken;

        // 普通表单上传
        var _options = {
            type:'json',
            mode:this.__config.mode,
            method:'POST', 
            cookie:false,
            headers:{},
            onuploading:this.__onUploading._$bind(this, _index), // 表单上传没有进度，所以可以不传
            onload:this.__onUploadComplete._$bind(this, _index),
            onerror:this.__nosErrorHandler._$bind(this, _index)
        };

        // nos上传地址
        this.__uploadForm.action = uploadConst.NOS_FORM_UPLOAD_URL + '/' + _data.bucket;
        
        _data.reqId = j._$upload(this.__uploadForm, _options);
    }

    /**
     * 开始断点上传
     */
    _proFormUploadUI.__startUploadByBlobs = function(_index){
        var _data = this.__dataCache[_index];

        var _reqdata = {
            'fileName' : encodeURIComponent(_data.fileName),
            'fileSize' : _data.fileSize,
            'fileGmtModifiedTime' : _data.fileGmtModifiedTime, 
            'eduUploaderToken' : _data.eduUploaderToken,
            '_t' : (new Date()).getTime()
        }

        // 获取断点续传初始信息
        _data.reqId = j._$request(uploadConst.GET_UPLOAD_PROGRESS_URL, {
            type: 'json',
            method: 'GET',
            query : _reqdata,
            mode: this.__config.mode,
            cookie: false,
            onload: function(_index, _data) {
                if (_data.code != 0) { // 错误
                    this.__eduErrorHandler(_index, _data);
                }else{
                    var _res = _data.result; // result里面包含了context和offset

                    if (!ut._$isObject(_res)) {
                        _res = {};
                        _res.context = '';
                        _res.offset = 0;
                    }

                    // 请求回来之前就完成了
                    if (!this.__dataCache[_index]) return;
                    // 请求回来之前就被abort了
                    if (this.__dataCache[_index].isAbort) return;

                    if (_res.offset >= this.__dataCache[_index].fileSize - 1) { // 上传已经完成
                        this.__dataCache[_index] = null;

                        this.__onUploadComplete(_index);
                        return;
                    }

                    _res.initOffset = _res.offset; // 第一次的偏移

                    this.__dataCache[_index].blobUploadData = _res;

                    this.__uploadBlob(_index);
                }

            }._$bind(this, _index),
            onerror:this.__errorHandler._$bind(this, _index, '获取上传初始化信息失败！')
        });

    };

    // 上传分块
    _proFormUploadUI.__uploadBlob = function (_index) {
        var _obj = this.__dataCache[_index];
            
        if (!_obj) return; // 不存在可能是已经完成了
        if (_obj.isAbort) return; // 不存在可能是已经abort了

        // 新的blob
        var _nosKey = _obj.nosKey,
            _bucket = _obj.bucket,
            _xNosToken = _obj.xNosToken;

        // 分段字节数据
        _obj.blob = uploadUtil.__blobSlice(this.__realUpload.files[0], _obj.blobUploadData.offset, uploadConst.BLOBSIZE);

        var _complete = (_obj.blobUploadData.offset + _obj.blob.size >= _obj.fileSize); // 是否是最后一块

        this.__uploadForm.action = this.__uploadIPs[_obj.bucket][0] + '/' + _bucket + '/' + _nosKey + '?' +
                        'offset=' + _obj.blobUploadData.offset + 
                        '&complete=' + _complete + 
                        (_obj.blobUploadData.context ? '&context=' + _obj.blobUploadData.context : '') + // 第一次可能没有context
                        '&version=1.0';
            
        var _uploading = function(_obj, _data) {
            var _proData = {
                timeStamp : (new Date()).getTime(), //_data.timeStamp,  // 时间戳
                loaded : _obj.blobUploadData.offset + _data.loaded,
                total : _obj.fileSize,
                initOffset : _obj.blobUploadData.initOffset
            }

            this.__onUploading(_proData);
        }

        var _onload = function(_obj, _data) {
            // 检查是否结束
            if (_data.errMsg) { // nos上传出错
                this.__nosErrorHandler(_obj.index, _data);

            }else if (_obj.blobUploadData.offset + _obj.blob.size >= _obj.fileSize) {
                // 完成上传
                this.__dataCache[_obj.index] = null;

                // 调用云课堂接口清空context和进度
                _obj.blobUploadData.offset = 0;
                _obj.blobUploadData.context = '';

                this.__saveUploadProgress(_obj, function(_data){
                    this.__onUploadComplete(_data);
                }._$bind(this, _data));
                
            } else {
                // 缓存进度
                _obj.blobUploadData.offset = _obj.blobUploadData.offset + _obj.blob.size; // 或者直接用_data.offset
                _obj.blobUploadData.context = _data.context;

                // 调用云课堂接口保存上传进度
                this.__saveUploadProgress(_obj, function(){
                    // 继续上传
                    this.__uploadBlob(_obj.index);
                })
            }
        }

        var _onerror = function(_obj, _data) {
            this.__nosErrorHandler(_obj.index, _data);
        }

        var _options = {
            type: 'json',
            mode: this.__config.mode,
            method: 'POST',
            timeout: 30 * 60 * 1000, // 超时：30分钟
            cookie: false,
            headers: {
                'Content-Type' : 'multipart/form-data',
                'x-nos-token' : _xNosToken
            },
            data: _obj.blob,
            onuploading: _uploading._$bind(this, _obj),
            onload: _onload._$bind(this, _obj),
            onerror: _onerror._$bind(this, _obj)
        }

        _obj.reqId = j._$request(this.__uploadForm.action, _options);

    }

    // 保存文件上传的进度
    _proFormUploadUI.__saveUploadProgress = function(_obj, _callBack){
        var _data = {
            'fileName' : encodeURIComponent(_obj.fileName),
            'fileSize' : _obj.fileSize,
            'context' : _obj.blobUploadData.context,
            'offset' : _obj.blobUploadData.offset,
            'fileGmtModifiedTime' : _obj.fileGmtModifiedTime,
            'eduUploaderToken' : _obj.eduUploaderToken,
            '_t' : (new Date()).getTime()
        }

        // 保存断点续传上传进度
        _data.reqId = j._$request(uploadConst.SAVE_UPLOAD_PROGRESS_URL, {
            type: 'json',
            method: 'GET',
            query : _data,
            mode: this.__config.mode,
            cookie: false,
            onload: function(_obj, _callBack, _data) {
                if (_data.code != 0) { // 错误
                    this.__eduErrorHandler(_obj.index, _data);
                }else{
                    _callBack && _callBack();
                }

            }._$bind(this, _obj, _callBack),
            onerror:this.__errorHandler._$bind(this, _obj.index, '保存上传信息失败！')
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
     *      initUploadUrl
     *    
     *      事件回调:
     *      onBeginUpload
     *      onUpdateProgress 
     *      onFinishUpload  
     *      onUploadError
     */
     _proFormUploadUI.__reset = function(_options){
        this.__supReset(_options);

        this.__txtNode.innerHTML = this.__config.txt;

        if(this.__config.btnClassName){
            e._$addClassName(this.__showUpload, this.__config.btnClassName);
        }

        // 允许多次选择同一个文件，因此每次都重置file域
        this.__resetHtmlFileNode();
    };
    
     // 是否可以使用断点续传，只有视频和pdf支持
    _proFormUploadUI.__isSupportAnchor = function(){
        return  uploadUtil._$canUseFileUploadByBlobs() &&
                (this.__config.type == uploadConst.UPLOAD_FILE_TYPE_VIDEO || this.__config.type == uploadConst.UPLOAD_FILE_TYPE_PDF);
    }
    
    /**
     * 销毁ui
     */
    _proFormUploadUI.__destroy = function(){
        // 清除类
        if(this.__config.btnClassName){
            e._$delClassName(this.__showUpload, this.__config.btnClassName);
        }

        if(this.__config.btnDisableClassName){
            e._$delClassName(this.__showUpload, this.__config.btnDisableClassName);
        }

        this.__supDestroy();
    }

    // 返回结果可注入给其他文件
    return p;
});

