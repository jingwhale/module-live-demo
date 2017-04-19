/**
 * 监听类
 */
NEJ.define([
	'./base.js'
], function(
	_base,
	p, o, f, r){

	var Observer = _base.C();

    var _pro = Observer.pro;

    /**
     * init function
     */
    _pro._init = function(_notifyMethod, _notifyContext){
        this.__notify = _notifyMethod;
        this.__context = _notifyContext;
        return this; 
    }

    /**
     * 设置消息名称
     */
    _pro.setNotifyMethod = function(_notifyMethod){
        this.__notify = _notifyMethod;
    }
        
    /**
     * 设置消息上下文
     */
    _pro.setNotifyContext = function(_notifyContext){
        this.__context = _notifyContext;
    }

    /**
     * 触发
     */
    _pro.notifyObserver = function(_notification){
        this.__notify.apply(this.__context, [_notification]);
    }
	    
	// 返回结果可注入给其他文件
    return Observer;
});
