/**
 * 播放器统计组件
 */
NEJ.define([
    '../base/base.js',
    '../base/component.js',
    '../notification/notificationDefine.js',
    '../model/constant.js'    
], function(
    _base,
    _component,
    _notificationDefine,
    _constant,
    p, o, f, r){
    
    /**
     *    
     */
    var LogComponent = _base.C();

    LogComponent.NAME = 'logComponent';

    var _pro = LogComponent.extend(_component);

    _pro._init = function(_config, _player){
        this.__super(_config);

        this._config = _config;
        this._player = _player;

        // 每个播放器实例对应一个logId
        this._logId = 'edu-log-' + (new Date()).getTime();
    }

    // 调用固定的统计方法，后期可能要改成动态的
    _pro._callLogFunc = function(fn, args){
        try{
            args = args || {};

            args.logId = this._logId; // 带上logid区分实例

            window['eduVideoLog'][fn](args);
        }catch(e){

        };
    }

    /**
     * 列出监听的消息
     */
    _pro.listNotificationInterests = function(){
        return [
            _notificationDefine.MAINVIDEO_START_LOAD,
            _notificationDefine.MAINVIDEO_STATE,
            _notificationDefine.VIEW_PLAY,
            _notificationDefine.VIEW_PAUSE,
            _notificationDefine.MAINVIDEO_ERROR
        ];
    }

    /**
     * 处理消息的方法
     */
    _pro.handleNotification = function(_notificationIns){
        this.__super(_notificationIns);

        switch(_notificationIns.getName()){
            case _notificationDefine.MAINVIDEO_START_LOAD:
                this._handleVideoStartLoad(_notificationIns.getBody())
                break;

            case _notificationDefine.MAINVIDEO_STATE:
                this._handleVideoState(_notificationIns.getBody())
                break;
           
            case _notificationDefine.VIEW_PLAY:
                this._handleViewClickPlay(_notificationIns.getBody())
                break;
            case _notificationDefine.VIEW_PAUSE:
                this._handleViewClickPause(_notificationIns.getBody())
                break;

            case _notificationDefine.MAINVIDEO_ERROR:
                this._handleVideoError(_notificationIns.getBody())
                break;
        }
    }

    _pro._handleVideoStartLoad = function(_data){
        this._callLogFunc('onNewMovie', {
            type : _data.movieData.currentMovieItem.type,  // type暂时没有提供
            url : _data.movieData.currentMovieItem.urls[0],
            quality : _data.movieData.currentMovieItem.quality
        });
    }

    _pro._handleVideoState = function(_data){
        switch(_data.newState){
            case _constant.MEDIA_STATE.IDLE:
                this._callLogFunc('onIdle');
                break;
            case _constant.MEDIA_STATE.PLAYING:
                this._callLogFunc('onPlay');
                break;
            case _constant.MEDIA_STATE.COMPLETE:
                this._callLogFunc('onEnd');
                break;
            case _constant.MEDIA_STATE.PAUSE:
                this._callLogFunc('onPause');
                break;
        }
        
    }

    _pro._handleViewClickPlay = function(_data){
        
    }

    _pro._handleViewClickPause = function(_data){
        
    }

    _pro._handleVideoError = function(_data){
        // 统计
        this._callLogFunc('onError', _data);
    }

    // 返回结果可注入给其他文件
    return LogComponent;
});
