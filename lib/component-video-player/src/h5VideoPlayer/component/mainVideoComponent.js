/**
 * 主视频播放组件
 */
NEJ.define([
    'text!./mainVideoComponent.html',
    '../base/base.js',
    'lib/base/util',
    'lib/base/event',
    'lib/base/element',
    '../base/component.js',
    '../media/html5VideoMedia.js',
    '../notification/notificationDefine.js',
    '../event/mediaEvent.js',
    '../event/mediaStateEvent.js'
], function(
    _tpl,
    _base,
    _util,
    _event,
    _element,
    _component,
    _html5VideoMedia,
    _notificationDefine,
    _mediaEvent,
    _mediaStateEvent,
    p, o, f, r){

    var MainVideoComponent = _base.C();

    MainVideoComponent.NAME = 'mainVideoComponent';

    var _pro = MainVideoComponent.extend(_component);

    /**
     * init function
     */
    _pro._init = function(_config){

        this.__super(_config);

        this._config = _config;
        this._rootNode = _config.rootNode;
        this._bodyNode = _element._$getByClassName(this._rootNode, 'j-mainVideo')[0];

        this.createMediaIns();
        
        return this; 
    }

    /**
     * 获取组件结构，子类实现
     */
    _pro._getTpl = function(){
        return _tpl; 
    }

    /**
     * 列出监听的消息
     */
    _pro.listNotificationInterests = function(){
        return [
            _notificationDefine.MOVIEDATA_NEW,
            _notificationDefine.MOVIEDATA_READY,
            _notificationDefine.MOVIEDATA_CURRENT_ITEM_CHANGE,
            _notificationDefine.MOVIEDATA_CURRENT_CDN_CHANGE,
            _notificationDefine.VIEW_LOAD, // 点击加载
            _notificationDefine.VIEW_RELOAD, // 点击重新加载
            _notificationDefine.VIEW_PLAY, // 点击播放
            _notificationDefine.VIEW_PAUSE, // 点击暂停
            _notificationDefine.VIEW_SEEK, // 拖动
            _notificationDefine.VIEW_SEEK_FORWARD, // 拖动
            _notificationDefine.VIEW_SEEK_BACKWARD, // 拖动
            _notificationDefine.VIEW_VOLUME, // 改变音量
            _notificationDefine.VIEW_VOLUME_INCREASE, // 改变音量
            _notificationDefine.VIEW_VOLUME_DECREASE, // 改变音量
            _notificationDefine.VIEW_MUTE, // 静音
            _notificationDefine.VIEW_RATE, // 改变倍数
            _notificationDefine.VIEW_CDN // 改变线路
        ];
    }

    /**
     * 处理消息的方法
     */
    _pro.handleNotification = function(_notificationIns){
        this.__super(_notificationIns);

        switch(_notificationIns.getName()){

            case _notificationDefine.MOVIEDATA_NEW:
                this._handleMoviedataNew(_notificationIns.getBody());
                break;
            case _notificationDefine.MOVIEDATA_READY:
                this._handleMoviedataReady(_notificationIns.getBody());
                break;
            case _notificationDefine.MOVIEDATA_CURRENT_ITEM_CHANGE:
                this._handleMoviedataCurrentItemChange(_notificationIns.getBody());
                break;
            case _notificationDefine.MOVIEDATA_CURRENT_CDN_CHANGE:
                this._handleMoviedataCurrentCdnChange(_notificationIns.getBody());
                break;  

            case _notificationDefine.VIEW_LOAD:
                this._handleViewLoad(_notificationIns.getBody());
                break;
            case _notificationDefine.VIEW_RELOAD:
                this._handleViewReLoad(_notificationIns.getBody());
                break;
            case _notificationDefine.VIEW_PLAY:
                this._handleViewPlay(_notificationIns.getBody());
                break;
            case _notificationDefine.VIEW_PAUSE:
                this._handleViewPause(_notificationIns.getBody());
                break;

            case _notificationDefine.VIEW_SEEK:
                this._handleViewSeek(_notificationIns.getBody());
                break;
            case _notificationDefine.VIEW_SEEK_FORWARD:
                this._handleViewSeekForward(_notificationIns.getBody());
                break;
            case _notificationDefine.VIEW_SEEK_BACKWARD:
                this._handleViewSeekBackward(_notificationIns.getBody());
                break;

            case _notificationDefine.VIEW_VOLUME:
                this._handleViewVolume(_notificationIns.getBody());
                break;
            case _notificationDefine.VIEW_VOLUME_INCREASE:
                this._handleViewVolumeIncrease(_notificationIns.getBody());
                break;
            case _notificationDefine.VIEW_VOLUME_DECREASE:
                this._handleViewVolumeDecrease(_notificationIns.getBody());
                break;

            case _notificationDefine.VIEW_MUTE:
                this._handleViewMute(_notificationIns.getBody());
                break;
            case _notificationDefine.VIEW_RATE:
                this._handleViewRate(_notificationIns.getBody());
                break;
        }
    }

    /**
     * 创建media对象并绑定事件
     */
    _pro.createMediaIns = function(){
        var _options = {};

        _options[_mediaStateEvent.MEDIA_STATE] = this._mediaStateEventHandler._$bind(this);

        _util._$forIn(_mediaEvent, function(item, index){
            _options[item] = this._mediaEventHandler._$bind(this);
        }._$bind(this), this);

        this._videoMediaIns = new _html5VideoMedia(this._bodyNode, this._config, _options);

    }   

    /**
     * 处理media state事件
     */
    _pro._mediaStateEventHandler = function(_event){
        this.sendNotification(_notificationDefine.MAINVIDEO_STATE, _event.data);
    }

    /**
     * 处理media事件
     */
    _pro._mediaEventHandler = function(_event){
        switch(_event.type){
            case _mediaEvent.MEDIA_VIDEO_READY:
                this.sendNotification(_notificationDefine.MAINVIDEO_VIDEO_READY, _event.data);
                break;
            
            case _mediaEvent.MEDIA_BEFORE_LOAD:
                this.sendNotification(_notificationDefine.MAINVIDEO_BEFORE_LOAD, _event.data);
                break;
            case _mediaEvent.MEDIA_START_LOAD:
                this.sendNotification(_notificationDefine.MAINVIDEO_START_LOAD, _event.data);
                break;

            case _mediaEvent.MEDIA_META:
                this.sendNotification(_notificationDefine.MAINVIDEO_META, _event.data);
                break;
            case _mediaEvent.MEDIA_BEFORE_PLAY:
                this.sendNotification(_notificationDefine.MAINVIDEO_BEFORE_PLAY, _event.data);
                break;
            case _mediaEvent.MEDIA_QUALITY_CHANGE:
                this.sendNotification(_notificationDefine.MAINVIDEO_QUALITY_CHANGE, _event.data);
                break;
            case _mediaEvent.MEDIA_RATE_CHANGE:
                this.sendNotification(_notificationDefine.MAINVIDEO_RATE_CHANGE, _event.data);
                break;
            case _mediaEvent.MEDIA_BUFFER:
                this.sendNotification(_notificationDefine.MAINVIDEO_BUFFER, _event.data);
                break;
            case _mediaEvent.MEDIA_BUFFER_FULL:
                this.sendNotification(_notificationDefine.MAINVIDEO_BUFFER_FULL, _event.data);
                break;
            case _mediaEvent.MEDIA_TIME:
                this.sendNotification(_notificationDefine.MAINVIDEO_TIME, _event.data);
                break;
                
            case _mediaEvent.MEDIA_ERROR:
                this.sendNotification(_notificationDefine.MAINVIDEO_ERROR, _event.data);
                break;
            
            case _mediaEvent.MEDIA_VOLUME:
                this.sendNotification(_notificationDefine.MAINVIDEO_VOLUME, _event.data);
                break;
            case _mediaEvent.MEDIA_VOLUME_INCREASE:
                this.sendNotification(_notificationDefine.MAINVIDEO_VOLUME_INCREASE, _event.data);
                break;
            case _mediaEvent.MEDIA_VOLUME_DECREASE:
                this.sendNotification(_notificationDefine.MAINVIDEO_VOLUME_DECREASE, _event.data);
                break;

            case _mediaEvent.MEDIA_MUTE:
                this.sendNotification(_notificationDefine.MAINVIDEO_MUTE, _event.data);
                break;
            case _mediaEvent.MEDIA_SEEK:
                this.sendNotification(_notificationDefine.MAINVIDEO_SEEK, _event.data);
                break;
            case _mediaEvent.MEDIA_SEEK_FORWARD:
                this.sendNotification(_notificationDefine.MAINVIDEO_SEEK_FORWARD, _event.data);
                break;
            case _mediaEvent.MEDIA_SEEK_BACKWARD:
                this.sendNotification(_notificationDefine.MAINVIDEO_SEEK_BACKWARD, _event.data);
                break;
        }

    }

    /**
     * 消息处理
     */
    _pro._handleMoviedataNew = function(_data){
        // 无操作
    }

    _pro._handleMoviedataReady = function(_data){
        this._movieData = _data; // 保存视频数据

        if (this._config.useNative) {
            setTimeout(function(){
                this._videoMediaIns.load(this._movieData, false, true); // 只设置source，不调用load
            }._$bind(this), 0);
        }else if (this._config.autoStart || this._config.isPreload) { // 如果是自动播放则马上加载，否则等待消息
            setTimeout(function(){
                this._videoMediaIns.load(this._movieData);
            }._$bind(this), 0);
        };
    }

    _pro._handleMoviedataCurrentItemChange = function(_data){
        this._movieData = _data; // 保存视频数据

        this._videoMediaIns.reload(this._movieData);
    }

    _pro._handleMoviedataCurrentCdnChange = function(_data){
        this._movieData = _data; // 保存视频数据
        
        this._videoMediaIns.reload(this._movieData);
    }

    _pro._handleViewLoad = function(_data){
        if (!this._movieData) {
            return;
        };

        this._videoMediaIns.load(this._movieData);
    }

    _pro._handleViewReLoad = function(_data){
        if (!this._movieData) {
            return;
        };

        this._videoMediaIns.reload(this._movieData);
    }

    _pro._handleViewPlay = function(_data){
        // 回调
        this._config.onPlayClick && this._config.onPlayClick();

        this._videoMediaIns.play();
    }

    _pro._handleViewPause = function(_data){
        this._videoMediaIns.pause(_data);
    }   

    _pro._handleViewSeek = function(_data){
        this._videoMediaIns.seek(_data);
    }

    _pro._handleViewSeekForward = function(_data){
        this._videoMediaIns.seekForward(_data);
    }
    _pro._handleViewSeekBackward = function(_data){
        this._videoMediaIns.seekBackward(_data);
    }

    _pro._handleViewVolume = function(_data){
        this._videoMediaIns.volume(_data);
    }

    _pro._handleViewVolumeIncrease = function(_data){
        this._videoMediaIns.volumeIncrease(_data);
    }

    _pro._handleViewVolumeDecrease = function(_data){
        this._videoMediaIns.volumeDecrease(_data);
    }

    _pro._handleViewMute = function(_data){
        this._videoMediaIns.mute(_data);
    }

    _pro._handleViewRate = function(_data){
        this._videoMediaIns.rate(_data);
    }

    /**
     * 删除时的回调，子类实现
     */
    _pro.onRemove = function(){
        this.__super();
    }

    /**
     * 暴露的方法
     */
    _pro.getVideoNode = function(){
        return this._videoMediaIns.getVideoNode();
    }

    _pro.play = function(){
        this._videoMediaIns.play();
    }

    _pro.pause = function(){
        this._videoMediaIns.pause();
    }

    _pro.seek = function(_position){
        this._videoMediaIns.seek(_position);
    }

    _pro.stop = function(){
        this._videoMediaIns.stop();
    }

    _pro.pause = function(){
        this._videoMediaIns.pause();
    }

    _pro.getPosition = function(){
        return this._videoMediaIns.getPosition();
    }

    _pro.getState = function(){
        return this._videoMediaIns.state();
    }

    _pro.isBlock = function(){
        return this._videoMediaIns.isBlock();
    }

    _pro.metaFPS = function(){
        return this._videoMediaIns.metaFPS();
    }

    _pro.currentFPS = function(){
        return this._videoMediaIns.currentFPS();
    }

    _pro.currentKbps = function(){
        return this._videoMediaIns.currentKbps();
    }

    // 返回结果可注入给其他文件
    return MainVideoComponent;
});
