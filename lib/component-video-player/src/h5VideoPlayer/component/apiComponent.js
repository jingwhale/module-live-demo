/**
 * 播放器对外暴露的方法
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
     *    player暴露的方法:
     *
     *      stop
     *          停止当前视频播放
     *          @return {void}
     *
     *      load
     *          加载新视频
     *          @param {Object} videoData
     *          @return {void}
     *
     *      pause
     *          暂停视频
     *          @return {void}
     *
     *      resume
     *          恢复视频
     *          @return {void}
     *
     *      getPosition
     *          获取当前视频播放的时间
     *          @param {Function} 回调对象：function(_positionTime){}
     *          @return {void} 
     *
     *      seek
     *          设置跳转到对应的时间,用于驻点播放
     *          @param {Number}  _seekSecs
     *          @return {void} 
     *      
     *      getState
     *          获取播放器的状态
     *          @return {String} "IDLE","BUFFERING","PLAYING", "PAUSED"
     *      
     *      getStateInfo
     *          获取播放器的状态详细信息
     *          @return {Object} 
     */
    var ApiComponent = _base.C();

    ApiComponent.NAME = 'apiComponent';

    var _pro = ApiComponent.extend(_component);

    _pro._init = function(_config, _player){
        this.__super(_config);

        this._config = _config;
        this._player = _player;

        this._initExternalFunc();
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
            _notificationDefine.VIEW_SEEK,
            _notificationDefine.MAINVIDEO_SEEK_FORWARD,
            _notificationDefine.MAINVIDEO_SEEK_BACKWARD,
            _notificationDefine.VIEW_VOLUME,
            _notificationDefine.VIEW_MUTE,
            _notificationDefine.VIEW_QUALITY,
            _notificationDefine.VIEW_CDN,
            _notificationDefine.VIEW_CAPTION,
            _notificationDefine.VIEW_ANCHOR,
            _notificationDefine.VIEW_RATE
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

            case _notificationDefine.VIEW_SEEK:
                this._handleViewSeek(_notificationIns.getBody())
                break;
            case _notificationDefine.MAINVIDEO_SEEK_FORWARD:
            case _notificationDefine.MAINVIDEO_SEEK_BACKWARD:
                this._handleViewSeekWard(_notificationIns.getBody())
                break;

            case _notificationDefine.VIEW_RATE:
                this._handleViewRateChange(_notificationIns.getBody())
                break;
            case _notificationDefine.VIEW_VOLUME:
                this._handleViewVolume(_notificationIns.getBody())
                break;
            case _notificationDefine.VIEW_MUTE:
                this._handleViewMute(_notificationIns.getBody())
                break;
            case _notificationDefine.VIEW_QUALITY:
                this._handleViewQuality(_notificationIns.getBody())
                break;
            case _notificationDefine.VIEW_CDN:
                this._handleViewCdn(_notificationIns.getBody())
                break;
            case _notificationDefine.VIEW_CAPTION:
                this._handleViewCaption(_notificationIns.getBody())
                break;
            case _notificationDefine.VIEW_ANCHOR:
                this._handleViewAnchor(_notificationIns.getBody())
                break;
        }
    }

    _pro._handleVideoStartLoad = function(_data){
        this._config.onStartLoad && this._config.onStartLoad(_data);
    }

    _pro._handleVideoState = function(_data){
        switch(_data.newState){
            case _constant.MEDIA_STATE.PAUSE:
                this._config.onPause && this._config.onPause(_data);
                break;
            case _constant.MEDIA_STATE.PLAYING:
                this._config.onPlay && this._config.onPlay(_data);
                break;
            case _constant.MEDIA_STATE.COMPLETE:
                this._config.onPlayEnd && this._config.onPlayEnd(_data);
                break;
        }
        
    }

    _pro._handleViewClickPlay = function(_data){
        this._config.onPlayClick && this._config.onPlayClick(_data);
    }

    _pro._handleViewClickPause = function(_data){
        _data = _data || this._getComponent('mainVideoComponent').getPosition(); // 暂停统计需要时间

        this._config.onPauseClick && this._config.onPauseClick(_data);
    }

    _pro._handleViewSeek = function(_data){
        this._config.onSeek && this._config.onSeek(_data);
    }

    _pro._handleViewSeekWard = function(_data){
        this._config.onSeek && this._config.onSeek({
            oldData : _data.oldData.position,
            newData : _data.newData.position 
        });
    }

    _pro._handleViewVolume = function(_data){
        this._config.onChangeVolume && this._config.onChangeVolume(_data);
    }

    _pro._handleViewRateChange = function(_data){
        this._config.onChangeRate && this._config.onChangeRate(_data);
    }

    _pro._handleViewMute = function(_data){
        this._config.onMute && this._config.onMute(_data);
    }

    _pro._handleViewQuality = function(_data){
        this._config.onSelectResolution && this._config.onSelectResolution(_data);
    }

    _pro._handleViewCdn = function(_data){
        this._config.onChangeCDN && this._config.onChangeCDN(_data);
    }

    _pro._handleViewCaption = function(_data){
        this._config.onSelectCaption && this._config.onSelectCaption(_data);
    }

    _pro._handleViewAnchor = function(_data){
        this._config.onAnchorPoint && this._config.onAnchorPoint(_data);
    }

    /**
    * 获取一个组件
    */
    _pro._getComponent = function(_name){
        return this._container.retrieveComponent(_name);
    }

    /**
    * 创建对外方法
    */
    _pro._initExternalFunc = function(){
      
        this._player.load = function(_data){
            this._getComponent('movieData').setData(_data);
        }._$bind(this)
        
        this._player.stop = function(){
            this._getComponent('mainVideoComponent').stop();
        }._$bind(this);

        this._player.resume = function(){
            this._getComponent('mainVideoComponent').play();
        }._$bind(this);
        
        this._player.pause = function(){
            this._getComponent('mainVideoComponent').pause();
        }._$bind(this);

        this._player.getPosition = function(){
            return this._getComponent('mainVideoComponent').getPosition();
        }._$bind(this);
        
        this._player.seek = function(_position){
            this._getComponent('mainVideoComponent').seek(_position);
        }._$bind(this);

        this._player.getState = function(){
            return this._getComponent('mainVideoComponent').getState();
        }._$bind(this);
        
        this._player.getStateInfo = function(){
            var _info = {};

            var _vc = this._getComponent('mainVideoComponent');
            var _mc = this._getComponent('movieData');

            _info.status = _vc.getState();
            _info.position = _vc.getPosition();
            _info.quality = {
                name : _mc.currentMovieItem.qualityName,
                quality : _mc.currentMovieItem.quality
            };
            _info.caption = _mc.captionData.data; 
            _info.isp = _mc.cdnSwitch;

            return _info;
        }._$bind(this);

        this._player.getVideoNode = function(){
            return this._getComponent('mainVideoComponent').getVideoNode();
        }._$bind(this);

        // 是否卡顿
        this._player.isBlock = function(){
            return this._getComponent('mainVideoComponent').isBlock();
        }._$bind(this); 

        // 原始帧率
        this._player.metaFPS = function(){
            return this._getComponent('mainVideoComponent').metaFPS();
        }._$bind(this); 

        // 获取当前帧率
        this._player.currentFPS = function(){
            return this._getComponent('mainVideoComponent').currentFPS();
        }._$bind(this); 

        // 获取当前kbps
        this._player.currentKbps = function(){
            return this._getComponent('mainVideoComponent').currentKbps();
        }._$bind(this); 
    }

    // 返回结果可注入给其他文件
    return ApiComponent;
});
