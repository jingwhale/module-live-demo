/**
* 片头视频组件，pc和移动端逻辑通用
*/
NEJ.define([
    'text!./preAdComponent.html',
    '../base/base.js',
    'lib/base/util',
    '../base/component.js',
    'lib/base/element',
    'lib/base/event',
    '../notification/notificationDefine.js',
    '../model/constant.js',
    'pool/edu-front-util/src/mobileUtil',
    '../media/html5VideoMedia.js',
    '../event/mediaEvent.js',
    '../event/mediaStateEvent.js'
], function(
    _tpl,
    _base,
    _util,
    _component,
    _element,
    _event,
    _notificationDefine,
    _constant,
    _mobileUtil,
    _html5VideoMedia,
    _mediaEvent,
    _mediaStateEvent,
    p, o, f, r){

    var PreAdComponent = _base.C();

    PreAdComponent.NAME = 'preAdComponent';

    var _pro = PreAdComponent.extend(_component);

    /**
    * init function
    */
    _pro._init = function(_config){
        this.__super(_config);

        this._config = _config;

        this._rootNode = _config.rootNode;
        this._bodyNode = _element._$getByClassName(this._rootNode, 'j-pread')[0];

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
            _notificationDefine.MOVIEDATA_READY,
            _notificationDefine.MAINVIDEO_BEFORE_LOAD,
            _notificationDefine.MAINVIDEO_BEFORE_PLAY,
            _notificationDefine.VIEW_VOLUME, // 改变音量
            _notificationDefine.VIEW_VOLUME_INCREASE, // 改变音量
            _notificationDefine.VIEW_VOLUME_DECREASE, // 改变音量
            _notificationDefine.VIEW_MUTE // 静音
        ];
    }

    /**
    * 处理消息的方法
    */
    _pro.handleNotification = function(_notificationIns){
        this.__super(_notificationIns);

        switch(_notificationIns.getName()){
            case _notificationDefine.MOVIEDATA_READY:
                this._handleMoviedataReady(_notificationIns.getBody());
                break;

            // 可以选择在加载前或者播放前播放片头，移动端ios使用video播放片头有问题，暂时不支持
            // case _notificationDefine.MAINVIDEO_BEFORE_LOAD:
            case _notificationDefine.MAINVIDEO_BEFORE_PLAY:
                this._handleBeforeLoad(_notificationIns.getBody());
                break;

            // 播放广告时可以改变音量
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
        }
    }

    /**
     * 创建media对象并绑定事件
     */
    _pro.createMediaIns = function(){
        var _options = {};

        _options[_mediaStateEvent.MEDIA_STATE] = this._mediaStateEventHandler._$bind(this);
        _options[_mediaEvent.MEDIA_META] = this._mediaEventHandler._$bind(this);
        _options[_mediaEvent.MEDIA_ERROR] = this._mediaEventHandler._$bind(this);
        _options[_mediaEvent.MEDIA_VOLUME] = this._mediaEventHandler._$bind(this);
        _options[_mediaEvent.MEDIA_VOLUME_INCREASE] = this._mediaEventHandler._$bind(this);
        _options[_mediaEvent.MEDIA_VOLUME_DECREASE] = this._mediaEventHandler._$bind(this);
        _options[_mediaEvent.MEDIA_MUTE] = this._mediaEventHandler._$bind(this);
        
        this._videoMediaIns = new _html5VideoMedia(this._bodyNode, {
            autoStart : true,
            isPreload : false, 
            beforeLoad : false,
            beforePlay : false,
            volume : this._config.volume, // 音量同步
            mute : this._config.mute
        }, _options);
    }   

    /**
    * 片头数据
    */
    _pro._handleMoviedataReady = function(_data){
        this._preAdMovieUrl = _data.adUrl;

        if (this._preAdMovieUrl && this._config.beforePlay) {
        // if (this._preAdMovieUrl && this._config.beforeLoad) {
            this.createMediaIns();
        };
    }

    /**
    * 播放片头
    */
    _pro._handleBeforeLoad = function(_data){
        if (!this._preAdMovieUrl || _mobileUtil._$isMobileAll()) { // 移动端暂时不支持
            this._playPreAdComplete();
            return;
        };

        this._playPreAdStart();
    }

    // 音量处理
    _pro._handleViewVolume = function(_data){
        this._videoMediaIns && this._videoMediaIns.volume(_data);
    }

    _pro._handleViewVolumeIncrease = function(_data){
        this._videoMediaIns && this._videoMediaIns.volumeIncrease(_data);
    }

    _pro._handleViewVolumeDecrease = function(_data){
        this._videoMediaIns && this._videoMediaIns.volumeDecrease(_data);
    }

    _pro._handleViewMute = function(_data){
        this._videoMediaIns && this._videoMediaIns.mute(_data);
    }

    /**
     * 处理media state事件
     */
    _pro._mediaStateEventHandler = function(_event){
        if (_event.data.newState == _constant.MEDIA_STATE.COMPLETE) {
            this._playPreAdComplete();
        };
    }

    /**
     * 处理media事件
     */
    _pro._mediaEventHandler = function(_event){
        switch(_event.type){
            case _mediaEvent.MEDIA_META:
                this._handleMovieMeta(_event.data);
                break;
            
            case _mediaEvent.MEDIA_ERROR:
                this._playPreAdComplete(_event.data);
                break;   

            // 音量消息
            case _mediaEvent.MEDIA_VOLUME:
                this.sendNotification(_notificationDefine.MAINVIDEO_VOLUME, _event.data);
                break;
            case _mediaEvent.MEDIA_VOLUME_INCREASE:
                this.sendNotification(_notificationDefine.MAINVIDEO_VOLUME_INCREASE, _event.data);
                break;
            case _mediaEvent.MEDIA_VOLUME_DECREASE:
                this.sendNotification(_notificationDefine.MAINVIDEO_VOLUME_DECREASE, _event.data);
                break;
        }

    }

    _pro._handleMovieMeta = function(_data){
        if(_data.duration && _data.duration >= 0){
            this._adduration = _data.duration;
        }else{
            this._adduration = 5;
        }

        // 开始计时，时间到强制跳过
        if(this._jumpTimeout){
            clearTimeout(this._jumpTimeout);
        }
                
        this._jumpTimeout = setTimeout(this._playPreAdComplete._$bind(this), this._adduration * 1000);
    } 

    /**
     * 片头播放开始
     */
    _pro._playPreAdStart = function(){
        // 播放片头时暂停，并且不可操作其他
        this.sendNotification(_notificationDefine.VIEW_PAUSE); 
        this.sendNotification(_notificationDefine.VIEW_PREAD_START); 

        this._bodyNode.style.display = 'block';

        this._videoMediaIns.load({
            currentMovieItem : {
                // quality : 1,
                // qualityName : '标清',
                urls : [this._preAdMovieUrl] 
            }
        });

        // 开始计时，10秒后时间到强制跳过
        if(this._jumpTimeout){
            clearTimeout(this._jumpTimeout);
        }

        this._jumpTimeout = setTimeout(this._playPreAdComplete._$bind(this), 10 * 1000);
    }

    /**
     * 片头播放完毕
     */
    _pro._playPreAdComplete = function(){
        if(this._jumpTimeout){
            clearTimeout(this._jumpTimeout);
        }

        if (this._videoMediaIns) {
            this._videoMediaIns.clear();
            this._videoMediaIns = null;
        };

        this._bodyNode.style.display = 'none';

        this.sendNotification(_notificationDefine.VIEW_PLAY); // 继续播放
        // this.sendNotification(_notificationDefine.VIEW_LOAD); // 继续加载

        // 播放片头完毕可操作其他
        this.sendNotification(_notificationDefine.VIEW_PREAD_END); 
    }

    // 返回结果可注入给其他文件
    return PreAdComponent;
});
