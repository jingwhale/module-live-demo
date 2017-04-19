/**
 * ----------------------------------------------------------------
 *  上传适配
 *  @version  1.0
 *  @module   pool/component-upload/src/uploader/fileUploader2
 * ----------------------------------------------------------------
 */
NEJ.define([
	'lib/base/util',
    'lib/base/klass',
    'lib/base/element',
    'lib/util/event',
    'pool/edu-front-util/src/mobileUtil',
    './util.js',
    './constant.js',
    './flashUploader.js',
    './mutiFormUploader.js',
    './defaultConfig.js'
],function(
	_util, 
	_k, 
	_e,
	_event, 
    _mobileUtil,
    _uploadUtil,
    _uploadConstant,
    _flashUploader,
    _mutiFormUploader,
    _defaultConfig,
	_p, _o, _f, _r){

    /**
     *   参数：
     *	 _options:
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
    _p._$$UploadUI = _k._$klass();
    var _pro = _p._$$UploadUI._$extend(_event._$$EventTarget);
    
    _pro.__init = function(){
        this.__super();
    }

    _pro.__reset = function(_options){
        this.__super(_options);

        // 配置
        this.__config = _util._$merge({}, _defaultConfig()); // 从默认配置拷贝
        this.__config = _util._$merge(this.__config, _options || {}, function(val){
            return val === undefined;
        }); // 如果是undefined就不覆盖

        this.__genUploader();
    }

    // 生成具体的上传组件
    _pro.__genUploader = function(){
        if (this.__shouldUseFlash()) {
            this.__uploaderUI = _flashUploader._$$FlashUploadUI._$allocate(this.__config);
        }else{
            this.__uploaderUI = _mutiFormUploader._$$MutiFileUploader._$allocate(this.__config);
        }
    }

    _pro.__shouldUseFlash = function(){
        return !_uploadUtil._$canUseFileUploadByBlobs() && (this.__config.type == _uploadConstant.UPLOAD_FILE_TYPE_VIDEO || this.__config.type == _uploadConstant.UPLOAD_FILE_TYPE_PDF);
    }

    _pro._destroy = function(){
		if (this.__uploaderUI) {
			this.__uploaderUI._$recycle();
		};

		this.__supDestroy();
    }

    //////////////////////////// 暴露的方法 ////////////////////////////////

    /**
     * 停止上传
     * @return _index
     */
    _pro._$abort = function(_index){
        this.__uploaderUI._$abort(_index);
    }


    // 返回结果可注入给其他文件
    return _p;
});
