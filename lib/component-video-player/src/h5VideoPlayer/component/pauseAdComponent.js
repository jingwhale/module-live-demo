/**
* 暂停广告组件，pc和移动端逻辑通用
*/
NEJ.define([
    '../base/component.js',
    'lib/base/element',
    'lib/base/event',
    '../notification/notificationDefine.js',
    '../model/constant.js',
    '../util/util.js',
    'pool/edu-front-util/src/mobileUtil'
], function(
    _component,
    _element,
    _event,
    _notificationDefine,
    _constant,
    _util,
    _mobileUtil,
    p, o, f, r){

    var PauseAdComponent = _base.C();

    PauseAdComponent.NAME = 'pauseAdComponent';

    var _pro = PauseAdComponent.extend(_component);

    /**
    * init function
    */
    _pro._init = function(_config){
        this.__super(_config);

        this._config = _config;

        this._rootNode = _config.rootNode;
        // this._bodyNode = _element._$getByClassName(this._rootNode, 'j-cover')[0];

        this._initEvent();

        return this; 
    }

    /**
    * 列出监听的消息
    */
    _pro.listNotificationInterests = function(){
        return [
            _notificationDefine.MOVIEDATA_READY
        ];
    }

    /**
    * 处理消息的方法
    */
    _pro.handleNotification = function(_notificationIns){
        this.__super(_notificationIns);

        
    }

    /**
    * 绑定事件
    */
    _pro._initEvent = function(){
        
    }

    // 返回结果可注入给其他文件
    return PauseAdComponent;
});
