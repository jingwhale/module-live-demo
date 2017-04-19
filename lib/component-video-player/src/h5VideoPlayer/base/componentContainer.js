/**
 * 组件容器
 */
NEJ.define([
    './base.js',
    './observer.js'
], function(
	_base,
    Observer,
	p, o, f, r){

	var ComponentContainer = _base.C();

    var _pro = ComponentContainer.pro;
    var _instance;

    /**
     * init function
     */
    _pro._init = function(){
        if (_instance) {
            return;
        };

        this.__componentMap = {};
        this.__observerMap = {};

        return this; 
    }

    /**
     * 增加监听
     */
    _pro.registerObserver = function(_notificationName, _observer){
        var _observers = this.__observerMap[_notificationName];
        
        if(_observers) {
            _observers.push(_observer);
        } else {
            this.__observerMap[_notificationName] = [_observer]; 
        }
    }

    /**
     * 通知监听
     */
    _pro.notifyObservers = function(_notification){
        if(!!this.__observerMap[_notification.getName()]){
            var _observersRef = this.__observerMap[_notification.getName()];

            var _observers = []; 
            var _observer;

            for (var i = 0; i < _observersRef.length; i++) { 
                _observer = _observersRef[i];
                _observers.push(_observer);
            }
                
            for (i = 0; i < _observers.length; i++) {
                _observer = _observers[i];
                _observer.notifyObserver(_notification);
            }
        }
    }

    /**
     * 删除监听
     */
    _pro.removeObserver = function(_notificationName, _notifyContext){
        var _observers = this.__observerMap[_notificationName];

        for(var i = 0; i < _observers.length; i++){
            if (_observers[i].context === _notifyContext) {
                _observers.splice(i,1);
                break;
            }
        }

        if (_observers.length == 0) {
            delete this.__observerMap[_notificationName];     
        }
    } 
    
    /**
     * 是否包含了某个组件
     */
    _pro.hasComponent = function(_componentName){
        return !!this.__componentMap[_componentName];
    }

    /**
     * 注册一个组件
     */
    _pro.registerComponent = function(_component){
        if (!!this.__componentMap[_component.getName()]) return;
            
        this.__componentMap[_component.getName()] = _component;
            
        var _interests = _component.listNotificationInterests();

        if (_interests && _interests.length > 0) {
            var _observer = new Observer(_component.handleNotification, _component);

            for ( var i = 0; i < _interests.length; i++) {
                this.registerObserver(_interests[i], _observer);
            }           
        }
            
        _component.onRegister();    
    }

    /**
     * 获取一个组件
     */
    _pro.retrieveComponent = function(_componentName){
        return this.__componentMap[_componentName];
    }

    /**
     * 删除一个组件
     */
    _pro.removeComponent = function(_componentName){
        var _component = this.__componentMap[_componentName];
            
        if(_component) {
            var _interests = _component.listNotificationInterests();
            
            for(var i = 0; i < _interests.length; i++) {
                this.removeObserver(_interests[i], _component);
            }   
                
            delete this.__componentMap[_componentName];
    
            _component.onRemove();
        }
            
        return _component;
    }
	    
	// 返回结果可注入给其他文件
    return ComponentContainer;
});
