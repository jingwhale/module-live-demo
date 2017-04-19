/**
 * 消息类
 */
NEJ.define([
	'./base.js'
], function(
	_base,
	p, o, f, r){

	var Notification = _base.C();

    var _pro = Notification.pro;

    /**
     * init function
     */
    _pro._init = function(_name, _body){
        this.__name = _name;
        this.__body = _body;
        return this; 
    }
    
    /**
     * 获取组件名称，子类实现
     */
    _pro.getName = function(){
        return this.__name; 
    }
        
    /**
     * 获取组件名称，子类实现
     */
    _pro.getBody = function(){
        return this.__body; 
    }

    /**
     * 获取组件名称，子类实现
     */
    _pro.setBody = function(_name){
        return this.__body; 
    }
       
    /**
     * toString
     */
    _pro.toString = function(){
        var _msg = 'Notification Name:' + this.getName();
        _msg += ' Body:' + (!this.__body ? this.__body : this.__body.toString());

        return _msg;
    }
	    
	// 返回结果可注入给其他文件
    return Notification;
});
