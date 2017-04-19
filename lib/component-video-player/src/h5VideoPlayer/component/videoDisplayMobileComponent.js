/**
* 移动端视频状态展示组件
*/
NEJ.define([
    'text!./videoDisplayMobileComponent.html',
    '../base/base.js',
    '../base/component.js',
    'lib/base/element',
    'lib/base/event',
    '../notification/notificationDefine.js',
    '../model/constant.js',
    '../util/util.js',
    'pool/edu-front-util/src/mobileUtil'
], function(
    _tpl,
    _base,
    _component,
    _element,
    _event,
    _notificationDefine,
    _constant,
    _util,
    _mobileUtil,
    p, o, f, r){

    var VideoDisplayMobileComponent = _base.C();

    VideoDisplayMobileComponent.NAME = 'videoDisplayMobileComponent';

    var _pro = VideoDisplayMobileComponent.extend(_component);

    /**
    * init function
    */
    _pro._init = function(_config){
        this.__super(_config);

        this._config = _config;

        this._rootNode = _config.rootNode;
        this._bodyNode = _element._$getByClassName(this._rootNode, 'j-display')[0];

        this._replayNode = _element._$getByClassName(this._bodyNode, 'j-replay')[0];
        this._bufferingNode = _element._$getByClassName(this._bodyNode, 'j-buffering')[0];
        this._bufferingcNode = _element._$getByClassName(this._bodyNode, 'j-bufferingc')[0];

        this._seekwrapNode = _element._$getByClassName(this._bodyNode, 'j-seekwrap')[0];
        this._seekicNode = _element._$getByClassName(this._seekwrapNode, 'j-seekic')[0];
        this._seekTimeNode = _element._$getByClassName(this._seekwrapNode, 'j-seekwrap-time')[0];
        this._seekDurNode = _element._$getByClassName(this._seekwrapNode, 'j-seekwrap-dur')[0];
        this._volumewrapNode = _element._$getByClassName(this._bodyNode, 'j-volumewrap')[0];
        this._volumevconNode = _element._$getByClassName(this._volumewrapNode, 'j-volume-vcon')[0];
        this._volumevbNode = _element._$getByClassName(this._volumewrapNode, 'j-volume-vb')[0];
        this._volumevpNode = _element._$getByClassName(this._volumewrapNode, 'j-volume-vp')[0];

        this._canShowState = true;

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
            _notificationDefine.MAINVIDEO_STATE,
            _notificationDefine.MAINVIDEO_VIDEO_READY,
            _notificationDefine.MOVIEDATA_NEW,
            _notificationDefine.MAINVIDEO_VOLUME_INCREASE,
            _notificationDefine.MAINVIDEO_VOLUME_DECREASE,
            _notificationDefine.MAINVIDEO_SEEK_FORWARD,
            _notificationDefine.MAINVIDEO_SEEK_BACKWARD
        ];
    }

    /**
    * 处理消息的方法
    */
    _pro.handleNotification = function(_notificationIns){
        this.__super(_notificationIns);

        switch(_notificationIns.getName()){
            case _notificationDefine.MAINVIDEO_VIDEO_READY:
                this._handleVideoReady(_notificationIns.getBody());
                break;
            case _notificationDefine.MOVIEDATA_NEW:
                this._handleNewmovie(_notificationIns.getBody());
                break;
            case _notificationDefine.MAINVIDEO_STATE:
                this._handleVideoState(_notificationIns.getBody());
                break;
            case _notificationDefine.MAINVIDEO_SEEK_FORWARD:
                this._handleSeekForward(_notificationIns.getBody());
                break;
            case _notificationDefine.MAINVIDEO_SEEK_BACKWARD:
                this._handleSeekBackward(_notificationIns.getBody());
                break;
            case _notificationDefine.MAINVIDEO_VOLUME_INCREASE:
            case _notificationDefine.MAINVIDEO_VOLUME_DECREASE:
                this._handleVolumeChange(_notificationIns.getBody());
                break;
        }
    }

    /**
    * 新视频
    */
    _pro._handleNewmovie = function(){
        this._showLoading();
    }

    /**
    * video
    */
    _pro._handleVideoReady = function(_data){
        this._initEvent(_data);
    }
    
    /**
    * 显示视频状态
    */
    _pro._handleVideoState = function(_state){
        this._state = _state.newState;

        if (!this._canShowState) {
            return;
        };

        switch(this._state){
            case _constant.MEDIA_STATE.IDLE:
                this._showIDLE();
                break;
            case _constant.MEDIA_STATE.PAUSE:
                this._showPause();
                break;
            case _constant.MEDIA_STATE.PLAYING:
                this._showPlaying();
                break;
            case _constant.MEDIA_STATE.BUFFERING:
                this._showLoading();
                break;
            case _constant.MEDIA_STATE.COMPLETE:
                this._showReplay();
                break;
        }
    }

    /**
    * 显示IDLE
    */
    _pro._showIDLE = function(){
        this._bufferingNode.style.display = 'none';
        this._replayNode.style.display = 'none';
    }

    /**
    * 显示playing
    */
    _pro._showPlaying = function(){
        this._bufferingNode.style.display = 'none';
        this._replayNode.style.display = 'none';
    }   

    /**
    * 显示playing
    */
    _pro._showPause = function(){
        this._bufferingNode.style.display = 'none';
        this._replayNode.style.display = 'none';
    }   

    /**
    * 显示loading
    */
    _pro._showLoading = function(){
        this._bufferingNode.style.display = 'block';
        this._replayNode.style.display = 'none';

        if (this._loadingInter) {
            clearInterval(this._loadingInter);
        };

        this._loadingInter = setInterval(function(){
            if (!this._loadingRotate) {
                this._loadingRotate = 0;
            };

            this._loadingRotate = (this._loadingRotate >= 7 ? 0 : (++this._loadingRotate));

            var _protate = 'rotate('+ this._loadingRotate * 45 + 'deg)';
            var _csstxt = 'display:block;-moz-transform:' + _protate + ';-o-transform:' + _protate + ';-ms-transform:' + _protate ;
            this._bufferingcNode.style.cssText = _csstxt;
            this._bufferingcNode.style.webkitTransform = _protate;

        }._$bind(this), 50);
    }

    _pro._hideLoading = function(){
        if (this._loadingInter) {
            clearInterval(this._loadingInter);
        };

        this._bufferingNode.style.display = 'none';
    }

    /**
    * 显示replay
    */
    _pro._showReplay = function(){
        // 直播模式时不显示重播按钮
        if (this._config.mode != 'live') {
            this._replayNode.style.display = 'block';
        };

        this._hideLoading();
    }

    /**
    * 绑定事件
    */
    _pro._initEvent = function(_video){
        if (window.Hammer) {
            var _tapSourceNode;

            // 在某些浏览器中video标签无法触发手势事件，只能绑定在浮层上，目前还不确定这种浏览器的范围
            if (false){ //_mobileUtil._$isWeixin()) {
                _tapSourceNode = this._bodyNode;
                _element._$addClassName(_tapSourceNode, 'f-pa full');
            }else{
                _tapSourceNode = _video;
            }

            var _videomc = new Hammer(_tapSourceNode);

            _videomc.get('pan').set({
                direction : Hammer.DIRECTION_ALL
            });

            _videomc.on('panright', this._onPanRight._$bind(this));
            _videomc.on('panleft', this._onPanLeft._$bind(this));

            // 在ios中video的音量是不能通过js设置的（只能通过物理按键），所以ios中不绑定
            if (_util.supportVolumeChange()) {
                _videomc.on('panup', this._onPanUp._$bind(this));
                _videomc.on('pandown', this._onPanDown._$bind(this));
            }

            var _replaymc = new Hammer(this._replayNode);
            _replaymc.on('tap', this._onTapDisplay._$bind(this));
        }else{
            _event._$addEvent(this._bodyNode, 'click', this._onTapDisplay._$bind(this));
        }        
    }

    /**
    * tap整个区域
    */
    _pro._onTapDisplay = function(){
        if (!this._state) {
            return;
        };

        switch(this._state){
            case _constant.MEDIA_STATE.COMPLETE:
                // 发出消息
                this.sendNotification(_notificationDefine.VIEW_PLAY);
                break;
        }
    }

    /**
    * 向右滑动
    */
    _pro._onPanRight = function(){
        // 发出消息
        if (this._isShowBk || this._isShowVol) return; // 防止频率过高
        this.sendNotification(_notificationDefine.VIEW_SEEK_FORWARD);
    }

    /**
    * 向左滑动
    */
    _pro._onPanLeft = function(){
        // 发出消息
        if (this._isShowFk || this._isShowVol) return; // 防止频率过高
        this.sendNotification(_notificationDefine.VIEW_SEEK_BACKWARD);
    }

    /**
    * 向上滑动
    */
    _pro._onPanUp = function(){
        // 发出消息
        if (this._isShowFk || this._isShowBk) return; // 防止频率过高
        this.sendNotification(_notificationDefine.VIEW_VOLUME_INCREASE);
    }

    /**
    * 向下滑动
    */
    _pro._onPanDown = function(){
        // 发出消息
        if (this._isShowFk || this._isShowBk) return; // 防止频率过高
        this.sendNotification(_notificationDefine.VIEW_VOLUME_DECREASE);
    }

    /**
    * 显示快进状态
    */
    _pro._handleSeekForward = function(_data){
        _element._$delClassName(this._seekicNode, 'backward');
        _element._$addClassName(this._seekicNode, 'forward');

        this._seekTimeNode.innerHTML = _util.formatVideoTime(_data.newData.position);
        this._seekDurNode.innerHTML = _util.formatVideoTime(_data.newData.duration);

        this._seekwrapNode.style.display = 'block';

        this._isShowFk = true;
        this._canShowState = false;

        if (this._hideForwardTimout) {
            clearTimeout(this._hideForwardTimout);
        };

        this._hideForwardTimout = setTimeout(this._hideForwardSeek._$bind(this), 800);
    }

    /**
    * 显示快退状态
    */
    _pro._handleSeekBackward = function(_data){
        _element._$delClassName(this._seekicNode, 'forward');
        _element._$addClassName(this._seekicNode, 'backward');

        this._seekTimeNode.innerHTML = _util.formatVideoTime(_data.newData.position);
        this._seekDurNode.innerHTML = _util.formatVideoTime(_data.newData.duration);

        this._seekwrapNode.style.display = 'block';

        this._isShowBk = true;
        this._canShowState = false;

        if (this._hideBackwardTimout) {
            clearTimeout(this._hideBackwardTimout);
        };

        this._hideBackwardTimout = setTimeout(this._hideBackwardSeek._$bind(this), 800);
    }

    /**
    * 隐藏快进状态
    */
    _pro._hideForwardSeek = function(){
        this._isShowFk = false;
        this._canShowState = true;
        this._seekwrapNode.style.display = 'none';
    }

    /**
    * 隐藏快退状态
    */
    _pro._hideBackwardSeek = function(){
        this._isShowBk = false;
        this._canShowState = true;
        this._seekwrapNode.style.display = 'none';
    }

    /**
    * 显示音量变化
    */
    _pro._handleVolumeChange = function(_vol){
        this._isShowVol = true;
        this._canShowState = false;

        this._volumewrapNode.style.display = 'block';

        _element._$setStyle(this._volumevpNode, 'bottom', (this._volumevconNode.offsetHeight * _vol - this._volumevpNode.offsetHeight/2) + 'px');
        _element._$setStyle(this._volumevbNode, 'height', (this._volumevconNode.offsetHeight * _vol) + 'px');

        if (this._hideVolumeTimout) {
            clearTimeout(this._hideVolumeTimout);
        };

        this._hideVolumeTimout = setTimeout(this._hideVolume._$bind(this), 1000);
    }

    /**
    * 隐藏音量状态
    */
    _pro._hideVolume = function(){
        this._isShowVol = false;
        this._canShowState = true;
        this._volumewrapNode.style.display = 'none';
    }


    // 返回结果可注入给其他文件
    return VideoDisplayMobileComponent;
});
