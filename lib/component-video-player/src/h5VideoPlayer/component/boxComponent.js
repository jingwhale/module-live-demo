/**
 * 容器组件，处理全屏、屏幕变化等
 */
NEJ.define([
	'../base/base.js',
	'lib/base/util',
	'lib/base/event',
	'lib/base/element',
	'../base/component.js',
	'../notification/notificationDefine.js'
], function(
	_base,
	_util,
	_event,
	_element,
	_component,
	_notificationDefine,
	p, o, f, r){

	var BoxComponent = _base.C();

	BoxComponent.NAME = 'boxComponent';

	var _pro = BoxComponent.extend(_component);

	/**
	 * init function
	 */
	_pro._init = function(_config){

		this.__super(_config);

		this._config = _config;
		this._rootNode = _config.rootNode;

		return this; 
	}

	/**
	 * 列出监听的消息
	 */
	_pro.listNotificationInterests = function(){
		return [
			_notificationDefine.VIEW_FULLSCREEN // 全屏
		];
	}

	/**
	 * 处理消息的方法
	 */
	_pro.handleNotification = function(_notificationIns){
		this.__super(_notificationIns);

		switch(_notificationIns.getName()){
			case _notificationDefine.VIEW_FULLSCREEN:
				this._handleViewFullscreen(_notificationIns.getBody());
				break;
		}
	}

	_pro._handleViewFullscreen = function(_data){
        if (this._config.notAllowFullScreen) {
            return;
        };

		if(!!this._isFullScreenMode){
            this._existfullScreen();
        }else{
            this._enterfullScreen();
        }
	}

    // 获取当前全屏状态
    _pro._getfullScreenState = function(){
        if(document.fullscreen !== undefined){
            return document.fullscreen;
        }else if(document.webkitIsFullScreen !== undefined){
            return document.webkitIsFullScreen;
        }else if(document.mozFullScreen !== undefined){
            return document.mozFullScreen;
        }else{
            return this._isFullScreenMode;
        }
    }

	// 进入全屏
    _pro._enterfullScreen = function(){
        this._isFullScreenMode = true;

        // 绑定fullscreenchange事件
        if(!this._hasBindFullscreenchange){
            document.onfullscreenchange = this._onfullScreenChange.bind(this);
            document.onwebkitfullscreenchange = this._onfullScreenChange.bind(this);
            document.onmozfullscreenchange = this._onfullScreenChange.bind(this);

            this._hasBindFullscreenchange = true;
        }

        if(_base.isFunction(this._rootNode.requestFullScreen)){
            this._rootNode.requestFullScreen();
        }else if(_base.isFunction(this._rootNode.webkitRequestFullScreen)){
            this._rootNode.webkitRequestFullScreen();
        }else if(_base.isFunction(this._rootNode.mozRequestFullScreen)){
            this._rootNode.mozRequestFullScreen();
        }else{
            this._enterfullWindow();
        }

    }

    // 退出全屏
    _pro._existfullScreen = function(){
        this._isFullScreenMode = false;

        // 退出全屏是document的方法
        if(_base.isFunction(document.exitFullscreen)){
            document.exitFullscreen();
        }else if(_base.isFunction(document.webkitCancelFullScreen)){
            document.webkitCancelFullScreen();
        }else if(_base.isFunction(document.mozCancelFullScreen)){
            document.mozCancelFullScreen();
        }else{
            this._existfullWindow();
        }

    }

    // 进入fullwindow
    _pro._enterfullWindow = function(){
        _event._$addEvent(document, 'keydown', this._fullWindowOnEscKey.bind(this));

        _element._$addClassName(document.body, 'u-edu-h5player-bodyfullWindow');
        _element._$addClassName(this._rootNode, 'u-edu-h5player-fullWindow');

		// 发出消息
        this.sendNotification(_notificationDefine.BOX_FULLSCREEN_CHANGE, this._isFullScreenMode);
    }

    // 退出fullwindow
    _pro._existfullWindow = function(){
        _event._$delEvent(document, 'keydown', this._fullWindowOnEscKey.bind(this));

        _element._$delClassName(document.body, 'u-edu-h5player-bodyfullWindow');
        _element._$delClassName(this._rootNode, 'u-edu-h5player-fullWindow');

        // 发出消息
        this.sendNotification(_notificationDefine.BOX_FULLSCREEN_CHANGE, this._isFullScreenMode);
    }

    // 监听fullscreenchange事件
    _pro._onfullScreenChange = function(_event){
        this._isFullScreenMode = this._getfullScreenState(); // 同步一下状态，否则可能会混乱

    	// 发出消息
	    this.sendNotification(_notificationDefine.BOX_FULLSCREEN_CHANGE, this._isFullScreenMode);
    }

    // 按esc键退出fullwindow
    _pro._fullWindowOnEscKey = function(_event){
        _event = _base.getEvent(_event);

        if (_event.keyCode === 27) {
            if (this._isFullScreenMode == true) {
                this._existfullScreen();
            }
        }
    }

	// 返回结果可注入给其他文件
	return BoxComponent;
});
