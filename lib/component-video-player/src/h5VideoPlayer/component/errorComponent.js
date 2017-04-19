/**
 * 错误显示组件
 */
NEJ.define([
	'text!./errorComponent.html',
	'text!./errorMobileComponent.html',
	'base/element',
    'base/event',
	'../base/base.js',
	'../base/component.js',
	'../notification/notificationDefine.js',
	'../model/constant.js',
	'pool/edu-front-util/src/mobileUtil'    
], function(
	_tpl,
	_mobileTpl,
	_element,
    _event,
	_base,
	_component,
	_notificationDefine,
	_constant,
	_mobileUtil,
	p, o, f, r){

	var ErrorComponent = _base.C();

	ErrorComponent.NAME = 'errorComponent';

	var _pro = ErrorComponent.extend(_component);

	/**
	 * init function
	 */
	_pro._init = function(_config){
		this.__super(_config);

		this._rootNode = _config.rootNode;
		this._bodyNode = _element._$getByClassName(this._rootNode, 'j-error')[0];
        this._errorTxtNode = _element._$getByClassName(this._bodyNode, 'j-error-txt')[0];
        this._reloadBtnNode = _element._$getByClassName(this._bodyNode, 'j-error-reload')[0];

        this._initEvent();

		return this; 
	}

	/**
     * 获取组件结构，子类实现
     */
    _pro._getTpl = function(){
    	// pc和移动端不一样
	    if (!_mobileUtil._$isMobileAll()) {
	        return _tpl; 
	    }else{
	    	return _mobileTpl; 
	    }
    }

	/**
	 * 列出监听的消息
	 */
	_pro.listNotificationInterests = function(){
		return [
			_notificationDefine.MOVIEDATA_ERROR,
			_notificationDefine.MAINVIDEO_ERROR
		];
	}

	/**
	 * 处理消息的方法
	 */
	_pro.handleNotification = function(_notificationIns){
		this.__super(_notificationIns);

		switch(_notificationIns.getName()){
			case _notificationDefine.MOVIEDATA_ERROR:
			case _notificationDefine.MAINVIDEO_ERROR:
				this._showError(_notificationIns.getBody())
				break;
		}
	}

	/**
	 * 创建view
	 */
	_pro._buidView = function(){

	}

	/**
	 * 绑定event
	 */
	_pro._initEvent = function(){
        if (window.Hammer) {
            if (this._reloadBtnNode) {
                var _reloadmc = new Hammer(this._reloadBtnNode);
                _reloadmc.on('tap', this._onClickReload._$bind(this));
            };
        }else{
            if (this._reloadBtnNode) {
                _event._$addEvent(this._reloadBtnNode, 'click', this._onClickReload._$bind(this));
            }
        }
        
	}

    /**
     * 点击重新加载
     */
    _pro._onClickReload = function(){
        // 隐藏自己
        this._bodyNode.style.display = 'none';

        this.sendNotification(_notificationDefine.VIEW_RELOAD);
    }

	/**
	 * 显示错误
	 */
	_pro._showError = function(_errorCode){
		var _txt = _constant.ERROR_TXT[_errorCode + '']; // 错误文案

		this._errorTxtNode.innerHTML = _txt;

		this._bodyNode.style.display = 'block';
	}

	// 返回结果可注入给其他文件
	return ErrorComponent;
});
