/**
 * ----------------------------------------------------------------
 *  可以截取图片的上传组件
 *  @version  1.0
 *  @module   pool/component-upload/src/uploader/customImgUploader
 * ----------------------------------------------------------------
 */
NEJ.define([
	'text!./customImgUploader.html',
	'lib/base/util',
    'lib/base/klass',
    'lib/base/element',
    'lib/ui/base',
    'lib/util/template/tpl',
    'lib/util/flash/flash',
    './constant.js',
    './util.js'
],function(
	_template,
	_util, 
	_k, 
	_e,
	_ui,
	_t, 
	_flash,
	_constant,
	_uploadUtil,
	_p, _o, _f, _r){

	var _g = window;

	/**
	 * 
	 * 自定义，可以截取的图片上传ui控件
	 * @class   _$$CustomImgUploader
	 * @extends _$$Abstract
	 * @param   {Object} _options 可选配置参数，已处理参数列表如下
	 *							  isLocal 	是否是本地调试
	 *                            uploadUrl  用户图片上传链接，如果没有，则使用默认值
	 *                            customSize 用户自定义尺寸，只需传一个，例如：'100x100x1'， 
	 *							  uW  图片宽度限制（最终）
	 *							  uH  图片高度限制（最终）
	 *							  LW  左侧区域宽度
	 *							  LH  左侧区域高度
	 *							  dW  左侧拖动区域宽度
	 *							  dH  左侧拖动区域高度
	 *							  limit  是否启用限制大小 0为不限制 1为限制 默认为1
     *							  usedp 是否使用默认的预览尺寸，默认false
	 *
	 * @Event uploadComplete 上传完成回调
	 * @Event uploadError 上传错误，内容为错误信息
	 * @Event uploadStart 上传开始
	 * @Event emptyError 未选择图片错误
	 *
	 * @method _$save  上传图片
	 * @method _$hasChange  图片是否改变，一般重新选择后就算改变，回调形式
	 * @method _$setDefaultPic  设置默认图片
	 *
	 */
	_p._$$CustomImgUploader = _k._$klass();
    var _pro = _p._$$CustomImgUploader._$extend(_ui._$$Abstract);
	/**
	 * 初始化外观信息
	 *
	 */
	_pro.__initXGui = function() {
        this.__seed_html = _t._$addNodeTemplate(_template);
	};

	/**
	 * 初始化节点
	 * 
	 * @return {Void}
	 */
	_pro.__initNode = function() {
		this.__supInitNode();

		// 初始化flash回调和js回调函数
		this.__initGInterface();

		// 初始化节点
		this.__flashBox = this.__body;
	};

	/**
	 * 初始化全局接口
	 * @return {Void}
	 */
	_pro.__initGInterface = function(){
		this.__jsNamespaceStr = 'edu.u.customImgUpload' + _util._$randNumberString(2);
		this.__jsNamespace = NEJ.P(this.__jsNamespaceStr);

		this.__jsNamespace.progressHandle = this.__uploadProcess._$bind(this);
		this.__jsNamespace.selectNewHandle = this.__selectNew._$bind(this);
		this.__jsNamespace.saveHandle = this.__uploadComplete._$bind(this);
		this.__jsNamespace.errorHandle = this.__uploadError._$bind(this);
		this.__jsNamespace.emptyHandle = this.__emptyError._$bind(this);
	}

	// 对外方法，设置默认图片
	_pro._$setDefaultPic = function(_imgUrl){
		this.__setFlashFunc(function(){
			this.__flashObj.setDefaultPic(_imgUrl);
		}._$bind(this));
	};

	// 对外方法，保存图片
	_pro._$save = function(){
		this.__setFlashFunc(function(){
			this.__flashObj.save();
		}._$bind(this));
	};

	_pro._$hasChange = function(_callBack){
		this.__setFlashFunc(function(){
			_callBack && _callBack(this.__flashObj.hasChange());
		}._$bind(this));
	};

	// 设置预览图片的尺寸大小，根据uW、uH的比列、以及传入的宽度，确定高度
    // [
    //    {
    //        width: 100, // 预览框宽度
    //        x: 20, // 预览框x坐标
    //        y: 30 // 预览框y坐标
    //    },
    // ]
    _pro._$setPreview = function(sizeArr){
        this.__setFlashFunc(function(){
            this.__flashObj.setPreview(sizeArr);
        }._$bind(this));
    };

	/**
	 * 选择了新图片
	 * @return {Void}
	 */
	_pro.__selectNew = function(){
		this._$dispatchEvent('selectNew');
	};

	/**
	 * 上传开始
	 * @return {Void}
	 */
	_pro.__uploadProcess = function(){
		this._$dispatchEvent('_onBeginUpload');
	};

	/**
	 * 上传完成
	 * @return {Void}
	 */
	_pro.__uploadComplete = function(_photo){
		var _photoUrl = _photo.userDef1Url;

		this._$dispatchEvent('_onFinishUpload', _photoUrl);
	};

	/**
	 * 上传失败
	 * @return {Void}
	 */
	_pro.__uploadError = function(_errorMes){
		this._$dispatchEvent('_onUploadError', _errorMes);
	};

	/**
	 * 未选择图片
	 * @return {Void}
	 */
	_pro.__emptyError = function(){
		this._$dispatchEvent('emptyError', '未选择图片');
	};

	/**
	 * 重置
	 * @param   {Object} _options 可选配置参数，已处理参数列表如下
	 *							  isLocal 	是否是本地调试
	 *                            uploadUrl  用户图片上传链接，如果没有，则使用默认值
	 *                            customSize 用户自定义尺寸，只需传一个，例如：'100x100x1'， 
	 *							  uW  图片宽度限制（最终）
	 *							  uH  图片高度限制（最终）
	 *							  LW  左侧区域宽度
	 *							  LH  左侧区域高度
	 *							  dW  左侧拖动区域宽度
	 *							  dH  左侧拖动区域高度
	 *							  limit  是否启用限制大小 0为不限制 1为限制 默认为1

	 */
	_pro.__reset = function(_options){		
		this.__supReset(_options);

		this.__genFlashUploader(_options);
	};

	// 插入swf
    _pro.__genFlashUploader = function(_options) {	
        var _flashvars = 'namespace=' + this.__jsNamespaceStr // js命名空间
                    + (_options.uploadUrl ? '&url=' + _g.encodeURIComponent(_options.uploadUrl) : '') // 上传地址
                    + (_options.customSize ? '&param=' + _options.customSize : '') // 上传参数
                    + (_options.uW ? '&uW=' + _options.uW : '') // 图片宽度限制
                    + (_options.uH ? '&uH=' + _options.uH : '') // 图片高度限制
                    + (_options.LW ? '&LW=' + _options.LW : '&LW=276') // 左侧宽度
                    + (_options.LH ? '&LH=' + _options.LH : '&LH=276') // 左侧高度
                    + (_options.dW ? '&dW=' + _options.dW : '') // 拖动区域宽度
                    + (_options.dH ? '&dH=' + _options.dH : '') // 拖动区域高度
                    + (_options.limit ? '&limit=' + _options.limit : '') // 是否限制大小
                    + (_options.usedp ? '&usedp=' + '0' : '1') // 是否自定义预览框的大小

        var _swfUrl;

		if(_options.isLocal){
			// 如果是本地调试则使用constant中的路径
			_swfUrl = _constant.customImgUploaderSwfLocalPath;			
		}else{
			_swfUrl = _constant.customImgUploaderSwfRemoteUrl;
		}

		_flash._$flash({
			src : _swfUrl,
			width : '100%',
			height : '100%',
			parent : this.__flashBox,
			params : {
				allowScriptAccess:'always',
				wmode:'transparent',
				flashvars:_flashvars
			},
			onready : function(_flash){
				this.__flashObj = _flash;
			}._$bind(this)
		});


	}

	// 执行flash方法
    _pro.__setFlashFunc = function(_func) {
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
     * 控件销毁
     */
	_pro.__destroy = function(){
		//先清空flash和反馈ui
		if(!!this.__flashBox){
			var _list = _e._$getChildren(this.__flashBox);
			if(!!_list){
				for(var i = 0; i < _list.length; i++){
					this.__flashBox.removeChild(_list[i]);
				}
			}
		}

		delete this.__flashObj;
		
		this.__supDestroy();
    }

	// 返回结果可注入给其他文件
    return _p;
});
