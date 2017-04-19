/**
 * ----------------------------------------------------------------
 *  flash多文件上传，用于低版本浏览器，有进度
 *  @version  1.0
 *  @module   pool/component-upload/src/uploader/flashUploader
 * ----------------------------------------------------------------
 */
NEJ.define([
    'text!./flashUploader.html',
    'base/util',
    'base/element',
    'util/template/tpl',
    'ui/base',
    'util/ajax/xdr',
    './util.js',
    './constant.js',
    './uploaderBase.js',
    'lib/util/flash/flash',
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
    flash,
    p, o, f, r){

    var _g = window;

    // 样式
    var _seed_css = e._$pushCSSText('\
        .u-flashUpload{ position:relative; display:inline-block;}\
        .u-flashUpload .btnwrap{ text-align:center; overflow:hidden;}\
        .u-flashUpload .flashwrap{ overflow:hidden; position:absolute; top:0; left:0; width:100%; height:100%;}');
    
    // 上传组件类
    p._$$FlashUploadUI = NEJ.C();

    var _proFlashUploadUI;

    _proFlashUploadUI = p._$$FlashUploadUI._$extend(uploaderBase._$$UploadBase, true);    

    /**
     * 初始化外观信息
     *
     */
    _proFlashUploadUI.__initXGui = function() {
        this.__seed_css  = _seed_css;
        this.__seed_html = t._$addNodeTemplate(_template);
    };

    /**
     * 初始化节点
     * 
     * @return {Void}
     */
    _proFlashUploadUI.__initNode = function() {
        this.__supInitNode();

        // 初始化节点        
        this.__txtNode = e._$getByClassName(this.__body,'j-txt')[0];      

        this.__flashBox = e._$getByClassName(this.__body,'j-flashwrap')[0];        
        
        // 初始化flash回调和js回调函数
        this.__initGInterface();

    };  

    /**
     * 初始化全局接口
     * @return {Void}
     */
    _proFlashUploadUI.__initGInterface = function(){
        this.__jsNamespaceStr = 'edu.u.flashUpload' + ut._$randNumberString(2);
        this.__jsNamespace = NEJ.P(this.__jsNamespaceStr);

        this.__jsNamespace.onselectFile = this.__onSelectFile._$bind(this);
        this.__jsNamespace.onuploading = this.__onUploading._$bind(this);
        this.__jsNamespace.onload = this.__onUploadComplete._$bind(this);

        this.__jsNamespace.onerror = function(_data){
            this.__errorHandler(_data.index, _data);
        }._$bind(this);

        this.__jsNamespace.oneduError = function(_data){
            this.__eduErrorHandler(_data.index, _data);
        }._$bind(this);

        this.__jsNamespace.onnosError = function(_data){
            this.__nosErrorHandler(_data.index, _data);
        }._$bind(this);
            
        this.__jsNamespace.onmaxCount = this.__onMaxCount._$bind(this);
    }

    /**
     * 禁用
     */
    _proFlashUploadUI._$disable = function(_disable){
        this.__super(_disable);

        if (this.__isDisable) {
            if(this.__config.btnDisableClassName){
                e._$addClassName(this.__body, this.__config.btnDisableClassName);
            }
        }else{
            if(this.__config.btnDisableClassName){
                e._$delClassName(this.__body, this.__config.btnDisableClassName);
            }
        }

        this.__setFlashFunc(function(){
            this.__flashObj.disable(_disable);
        }._$bind(this));

    }
    
    /**
     * 取消上传
     */
    _proFlashUploadUI._$abort = function(_index){
        this.__super(_index);

        this.__setFlashFunc(function(_index){
            this.__flashObj.abortFileUpload(_index);
        }._$bind(this, _index));

    }

    /**
     * 上传进度事件
     */
    _proFlashUploadUI.__onUploading = function(_data){
        if (!!_data) {
            this.__config.onUpdateProgress && this.__config.onUpdateProgress(_data);
        }
    };

    /**
     * 上传完成处理
     */
    _proFlashUploadUI.__onUploadComplete = function(_data){
        if (!!_data) {
            this.__config.onFinishUpload && this.__config.onFinishUpload(_data);            
        }
    };

    /**
     * 统一的错误处理
     */
    _proFlashUploadUI.__errorHandler = function(_index, _data){
        var _errdata = _data.data;

        if (!ut._$isObject(_errdata)) {
            _errdata = {
                message : _errdata
            }
        }

        var _str = (_errdata.code || _errdata.errCode || '') + (_errdata.errMsg || _errdata.msg || _errdata.message || '网络错误');

        _data.data = {
            errMsg : _str,
            fileName : this.__dataCache[_data.index].fileName
        }

        this.__config.onUploadError && this.__config.onUploadError(_data);
    }

    /**
     * edu接口错误处理
     */
    _proFlashUploadUI.__eduErrorHandler = function(_index, _data){
        // 出错重试
        if (_data.data.code == -2) { // edu token 过期错误
            // 重新调用应用接口获取凭证
            this.__getEduToken(_index);
            return;
        };

        this.__errorHandler(_index, _data);
    }

    /**
     * nos接口错误处理
     */
    _proFlashUploadUI.__nosErrorHandler = function(_index, _msg){
        // 可以添加出错重试
        this.__dataCache[_index].nosErrorCount++;

        if(this.__dataCache[_index].nosErrorCount <= 3){
            // 重新调用应用接口获取凭证
            this.__getEduToken(_index);
            return;
        }

        this.__errorHandler(_index, _msg);
    }

    // 超出个数限制
    _proFlashUploadUI.__onMaxCount = function(_data) {  
        this.__config.onMaxCount && this.__config.onMaxCount(_data);
    }

    // 插入swf
    _proFlashUploadUI.__genFlashUploader = function(_options) {  
        var _swfUrl;

        if(_options.isLocal){
            // 如果是本地调试则使用constant中的路径
            _swfUrl = uploadConst.flashUploaderSwfLocalPath;          
        }else{
            _swfUrl = uploadConst.flashUploaderSwfRemoteUrl;
        }

        flash._$flash({
            src : _swfUrl,
            width : '100%',
            height : '100%',
            parent : this.__flashBox,
            params : {
                allowScriptAccess:'always',
                wmode:'transparent'
            },
            onready : function(_flash){
                this.__flashObj = _flash;

                // 设置上传参数
                this.__initFlashUploadParam();
                
            }._$bind(this)
        });
    }

    // 执行flash方法
    _proFlashUploadUI.__setFlashFunc = function(_func) {
        //设置数据
        if(!!_func && !!this.__flashObj){
            _func();
            
        }else{
            if(!!this.__timer){
                this.__timer = _g.clearInterval(this.__timer);
            }
            //100ms后再调用func
            this.__timer = _g.setInterval(function(){
                if(!!_func && !!this.__flashObj){
                    _func();
                    
                    this.__timer =  _g.clearInterval(this.__timer);
                }
            }._$bind(this),100);
        }
    };

    /**
     * 设置上传的参数
     */
    _proFlashUploadUI.__initFlashUploadParam = function(){
        this.__setFlashFunc(function(){
            this.__flashObj.initUpload({
                getUploadUrl : uploadConst.GET_UPLOAD_PROGRESS_URL,
                saveUploadUrl : uploadConst.SAVE_UPLOAD_PROGRESS_URL,
                nameSpace : this.__jsNamespaceStr,
                blobSize : uploadConst.BLOBSIZE
            });
        }._$bind(this));
    }

    /**
     * 点击上传按钮的操作
     */
    _proFlashUploadUI.__onSelectFile = function(_data){
        // 重新选择文件后重置
        this.__isAbort = false;

        var _fileData = _data.data;

        var _fileName = _fileData.fileName;

        while (_fileName.indexOf('\\') != -1){
            _fileName = _fileName.slice(_fileName.lastIndexOf('\\') + 1);
        }
        
        // 如果需要对文件格式进行判断，则调用this.__verifyFile进行判断，可由options传入
        // 提供文件名和节点作为参数，不同浏览器对于file操作和属性不一样，需要自己处理
        if(!!this.__config.verifyFile && !this.__config.verifyFile(_fileName, _fileData.fileSize)){ 
            return;
        }

        // 触发开始上传事件。等待外部获取nos信息后，需要主动调用_$startUpload开始上传
        this.__config.onBeginUpload && this.__config.onBeginUpload(_data);

        // 缓存
        this.__dataCache.push({
            isAbort : false,
            nosErrorCount : 0, // nos上传出错次数
            index : _data.index,
            fileName : _fileName,
            beginTime : new Date().getTime(), // 开始上传的时间戳
            fileSize : _fileData.fileSize,
            fileGmtModifiedTime : _fileData.fileGmtModifiedTime
        });

        // 调用应用接口获取凭证
        this.__getEduToken(_data.index);
    }

    // 上传方法
    _proFlashUploadUI.__startUpload = function(_index){
        this.__super(_index);

        // 开始断点续传
        this.__getNosIP(_index, function(){

            this.__setFlashFunc(function(_index){
                var _data = this.__dataCache[_index];

                this.__flashObj.fileUploadByBlobs({
                    index : _index,
                    ip : this.__uploadIPs[_data.bucket][0], // 只用第一个地址
                    eduUploaderToken : _data.eduUploaderToken,
                    nosKey : _data.nosKey,
                    bucket : _data.bucket,
                    xNosToken : _data.xNosToken
                });
            }._$bind(this, _index));

        }._$bind(this));

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
     *      maxUploadCount
     *    
     *      事件回调:
     *      onBeginUpload
     *      onUpdateProgress 
     *      onFinishUpload  
     *      onUploadError
     *      onMaxCount
     */
     _proFlashUploadUI.__reset = function(_options){
        this.__supReset(_options);

        this.__txtNode.innerHTML = this.__config.txt;

        if(this.__config.btnClassName){
            e._$addClassName(this.__body, this.__config.btnClassName);
        }

        this.__genFlashUploader(_options);
    };
    
    /**
     * 销毁ui
     */
    _proFlashUploadUI.__destroy = function(){
        //先清空flash和反馈ui
        if(!!this.__flashBox){
            var _list = e._$getChildren(this.__flashBox);
            if(!!_list){
                for(var i = 0; i < _list.length; i++){
                    this.__flashBox.removeChild(_list[i]);
                }
            }
        }

        // 清除类
        if(this.__config.btnClassName){
            e._$delClassName(this.__body, this.__config.btnClassName);
        }

        if(this.__config.btnDisableClassName){
            e._$delClassName(this.__body, this.__config.btnDisableClassName);
        }

        delete this.__flashObj;

        this.__supDestroy();
    }

    // 返回结果可注入给其他文件
    return p;
});

