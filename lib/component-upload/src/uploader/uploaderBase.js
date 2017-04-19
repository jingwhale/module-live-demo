/**
 * ----------------------------------------------------------------
 *  上传文件基类
 *  这种方案不太好，只是创建了多个formUploader。建议在formUploader中直接实现多个同时上传。当然复杂度其实差不多
 *  @version  1.0
 *  @module   pool/component-upload/src/uploader/uploaderBase
 * ----------------------------------------------------------------
 */
NEJ.define([
    'base/util',
    'base/element',
    'util/template/tpl',
    'ui/base',
    'util/ajax/xdr',
    './constant.js',
    './defaultConfig.js'
],function(
    ut, 
    e, 
    t, 
    ui, 
    j, 
    uploadConst,
    defaultConfig,
    p, o, f, r){
 
    // 上传组件类
    p._$$UploadBase = NEJ.C();

    var _proUploadBase;

    _proUploadBase = p._$$UploadBase._$extend(ui._$$Abstract, true);    

    /**
     * 调用应用接口获取凭证，用于交换nos数据
     */
    _proUploadBase.__getEduToken = function(_index, _callBack){ 
        // 调用应用接口
        var _options = {
            sync : false,  
            type : 'json',   
            data : {
                'fileName': encodeURIComponent(this.__dataCache[_index].fileName), 
                'type':this.__config.type,
                'fileSize' : this.__dataCache[_index].fileSize, 
                'fileGmtModifiedTime' : this.__dataCache[_index].fileGmtModifiedTime 
            },    
            query : {},  
            method  : 'POST', 
            timeout : 0, 
            headers : {}, 
            cookie : false,  // 跨域请求是否带cookie，仅对CORS方式有效
            mode : this.__config.mode,   // 请求模式,针对跨域请求采用的请求方式
            onload: function(_index, _data){
                if(!!_data){
                    if (_data.code != 0) { // 错误
                        this.__eduErrorHandler(_index, _data);
                    }else{
                        this.__dataCache[_index].eduUploaderToken = _data.result;

                        if (_callBack) {
                            _callBack();
                        }else{
                            // 交换token
                            this.__getNosToken(_index);
                        }
                        
                    }
          
                }else{
                    this.__errorHandler(_index, '上传失败！无数据返回');
                }
            }._$bind(this, _index),
            onerror:this.__errorHandler._$bind(this, _index, '初始化上传失败！')
        };

        this.__dataCache[_index].reqId = j._$request(this.__config.initUploadUrl, _options);
    }

    /**
     * 调用交换接口获取nos数据
     */
    _proUploadBase.__getNosToken = function(_index, _callBack){
        // 调用token接口
        var _options = {
            sync : false,  
            type : 'json',     
            query : {
                'eduUploaderToken':this.__dataCache[_index].eduUploaderToken,
                'fileName' : encodeURIComponent(this.__dataCache[_index].fileName),
                'fileSize' : this.__dataCache[_index].fileSize, 
                'fileGmtModifiedTime' : this.__dataCache[_index].fileGmtModifiedTime, 
                '_t' : (new Date()).getTime()
            },  
            method  : 'GET', 
            timeout : 0, 
            headers : {}, 
            cookie : false,  // 跨域请求是否带cookie，仅对CORS方式有效
            mode : this.__config.mode,   // 请求模式,针对跨域请求采用的请求方式
            onload: function(_index, _data){
                if(!!_data){
                    if(_data.code != 0){
                        this.__eduErrorHandler(_index, _data);
                    }else{

                        this.__dataCache[_index].xNosToken = _data.result.xnosToken; // nos token
                        this.__dataCache[_index].bucket = _data.result.bucketName; // nos桶名
                        this.__dataCache[_index].nosKey = _data.result.nosKey; // 存储上传文件的object对象名

                        if (_callBack) {
                            _callBack();
                        }else{
                            // 开始文件上传操作
                            this.__startUpload(_index);
                        }
                    }
          
                }else{
                    this.__errorHandler(_index, '上传失败！无数据返回');
                }
            }._$bind(this, _index),
            onerror:this.__errorHandler._$bind(this, _index, '上传失败！')
        };

        this.__dataCache[_index].reqId = j._$request(uploadConst.EXCHANGE_NOSTOKEN_URL, _options);
    }

    /**
     * 选择断点续传的ip
     */
    _proUploadBase.__getNosIP = function(_index, _callBack){
        var _bucket = this.__dataCache[_index].bucket;

        if (this.__uploadIPs[_bucket]) { // 已经获取了则马上开始
            _callBack && _callBack();
            return;
        };

        var _options = {
            sync : false,  
            type : 'json',   
            data : {},   
            query : {'version':'1.0', 'bucketname':_bucket},  
            method  : 'GET', 
            timeout : 0, 
            cookie : false,  // 跨域请求是否带cookie，仅对CORS方式有效
            mode : this.__config.mode,   // 请求模式,针对跨域请求采用的请求方式
            onload: function(_data){
                if(!!_data){
                    // 目前只使用第一个ip，建议增加重试功能，如果当前ip上传失败，使用下一个ip
                    this.__uploadIPs[_bucket] = _data.upload;

                    _callBack && _callBack();
          
                }else{
                    this.__errorHandler('上传失败！无法获得上传地址');
                }
            }._$bind(this),
            onerror:this.__errorHandler._$bind(this, _index, '上传失败！')
        };

        this.__dataCache[_index].reqId = j._$request(uploadConst.NOS_GET_IP_URL, _options);
    }

    /**
     * 上传错误事件，子类实现具体逻辑
     */
    _proUploadBase.__errorHandler = function(_index, _msg){

    }

    /**
     * edu接口错误处理，子类实现具体逻辑
     */
    _proUploadBase.__eduErrorHandler = function(_index, _data){
        
    }

    /**
     * nos接口错误处理，子类实现具体逻辑
     */
    _proUploadBase.__nosErrorHandler = function(_index, _msg){
        
    }

    /**
     * 上传进度事件，子类实现具体逻辑
     */
    _proUploadBase.__onUploading = function(_data){

    }

    /**
     * 上传完成事件，子类实现具体逻辑
     */
    _proUploadBase.__onUploadComplete = function(_data){

    }

    /**
     * 获取nos数据后判断选择哪种上传，子类实现具体逻辑
     */
    _proUploadBase.__startUpload = function(_index){

    }

    /**
     * 禁用，子类实现具体逻辑
     */
    _proUploadBase._$disable = function(_disable){
        this.__isDisable = _disable;

    }

    /**
     * 取消上传，子类实现具体逻辑
     */
    _proUploadBase._$abort = function(_index){
        var _data = this.__dataCache[_index];

        if (!_data) {
            return;
        };

        _data.isAbort = true; 

        // 所有请求都取消
        if(_data.reqId){
            j._$abort(_data.reqId);
            _data.reqId = null; 
        }
    }

    /**
     * 重置ui
     * _options:
     *      配置:
     *      parent
     *      type
     *      txt
     *      initUploadUrl
     *      verifyFile
     *    
     *      事件回调:
     *      onBeginUpload
     *      onUpdateProgress 
     *      onFinishUpload  
     *      onUploadError
     */
     _proUploadBase.__reset = function(_options){
        this.__supReset(_options);

        this.__config = _options;

        ////////////////////////// 上传相关数据 /////////////////////////
        // 上传ip地址
        this.__uploadIPs                = {};

        // 是否主动中断
        this.__isAbort                  = false;
        // 是否禁用
        this.__isDisable                = false;

        // 缓存上传数据
        this.__dataCache                = [
            /*
            {
                // 文件信息
                fileName                 
                fileSize
                fileGmtModifiedTime     
                // 请求凭证
                eduUploaderToken        
                // 访问nos的token信息
                xNosToken               
                // nos桶名
                bucket                  
                // 存储上传文件的object对象名
                nosKey                  
                // 请求id
                reqId   

                // 其他信息                
                // 断点续传id
                blobUploadId            
            }
            */
        ];
    };
    
    /**
     * 销毁ui
     */
    _proUploadBase.__destroy = function(){
        // 停止全部
        for (var i = this.__dataCache.length - 1; i >= 0; i--) {
            if(this.__dataCache[i]){
                this._$abort(i);
            }
        };
        
        this.__supDestroy();
    }

    // 返回结果可注入给其他文件
    return p;
});

