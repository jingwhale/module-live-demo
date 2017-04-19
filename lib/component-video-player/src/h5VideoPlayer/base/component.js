/**
 * 组件基类
 */
NEJ.define([
	'./base.js',
    'lib/base/element',
    './componentContainer.js',
    './notification.js',
    '../util/logUtil.js' 
], function(
	_base,
    _element,
	_componentContainer,
    _notification,
    _logUtil,
	p, o, f, r){

	var Component = _base.C();

    var _pro = Component.pro;

    Component.NAME = 'component';
    Component.componentContainer = null;

    /**
     * init function
     */
    _pro._init = function(_config){
        this._name = this.constructor.NAME;

        this._container = this.constructor.componentContainer;

        this._initComponetNode(_config);

        return this; 
    }

    /**
     * 获取组件结构，子类实现
     */
    _pro._getTpl = function(){
        return ''; 
    }

    /**
     * 初始化组件结构
     */
    _pro._initComponetNode = function(_config){
        if(!_config.rootNode){
            return;
        }

        if (this._getTpl()) {
            _config.rootNode.appendChild(_element._$html2node(this._getTpl()));
        };
    }
    
    /**
     * 获取组件名称，子类实现
     */
    _pro.getName = function(){
        return this._name; 
    }
    
    /**
     * 列出监听的消息，子类实现
     */
    _pro.listNotificationInterests = function(){
        return [];
    }

    /**
     * 处理消息的方法，子类实现
     */
    _pro.handleNotification = function(_notificationIns){
        _logUtil.info('handle notification:' + _notificationIns.getName() + ' handler:' + this.getName());
    }

    /**
     * 发送消息的方法
     */
    _pro.sendNotification = function(_notificationName, _body){ 
        var _newnotification = new _notification(_notificationName, _body);

        _logUtil.infoObj(_newnotification.toString() + ' From:' + this.getName(), _body);

		this._container.notifyObservers(_newnotification);
	}

    /**
     * 注册时的回调，子类实现
     */
    _pro.onRegister = function(){
        
    }

    /**
     * 删除时的回调，子类实现
     */
    _pro.onRemove = function(){
        
    }
	    
	// 返回结果可注入给其他文件
    return Component;
});
