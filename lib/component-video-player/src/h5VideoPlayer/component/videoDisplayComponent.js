/**
* 视频状态展示组件
*/
NEJ.define([
    'text!./videoDisplayComponent.html',
    '../base/base.js',
    '../base/component.js',
    'lib/base/element',
    'lib/base/event',
    '../notification/notificationDefine.js',
    '../model/constant.js'
], function(
    _tpl,
    _base,
    _component,
    _element,
    _event,
    _notificationDefine,
    _constant,
    p, o, f, r){

    var VideoDisplayComponent = _base.C();

    VideoDisplayComponent.NAME = 'videoDisplayComponent';

    var _pro = VideoDisplayComponent.extend(_component);

    /**
    * init function
    */
    _pro._init = function(_config){
        this.__super(_config);

        this._config = _config;

        this._rootNode = _config.rootNode;
        this._bodyNode = _element._$getByClassName(this._rootNode, 'j-display')[0];
        this._statewrapNode = _element._$getByClassName(this._bodyNode, 'j-statewrap')[0];
            
        this._pauseNode = _element._$getByClassName(this._bodyNode, 'j-pause')[0];
        this._replayNode = _element._$getByClassName(this._bodyNode, 'j-replay')[0];
        this._bufferingNode = _element._$getByClassName(this._bodyNode, 'j-buffering')[0];

        this._initEvent();

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
            _notificationDefine.MOVIEDATA_NEW,
            _notificationDefine.VIDEO_CONTROL_SHOW,
            _notificationDefine.VIDEO_CONTROL_HIDE
        ];
    }

    /**
    * 处理消息的方法
    */
    _pro.handleNotification = function(_notificationIns){
        this.__super(_notificationIns);

        switch(_notificationIns.getName()){
            case _notificationDefine.MOVIEDATA_NEW:
                this._handleNewmovie(_notificationIns.getBody());
                break;
            case _notificationDefine.MAINVIDEO_STATE:
                this._handleVideoState(_notificationIns.getBody());
                break;
            case _notificationDefine.VIDEO_CONTROL_SHOW:
                _element._$delClassName(this._bodyNode,'f-cn');
                break;
            case _notificationDefine.VIDEO_CONTROL_HIDE:
                _element._$addClassName(this._bodyNode,'f-cn');
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
    * 显示视频状态
    */
    _pro._handleVideoState = function(_state){
        this._state = _state.newState;

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
        this._statewrapNode.style.display = 'none';
    }

    /**
    * 显示playing
    */
    _pro._showPlaying = function(){
        this._statewrapNode.style.display = 'none';
    }   

    /**
    * 显示loading
    */
    _pro._showLoading = function(){
        this._statewrapNode.style.display = 'block';

        if(this._pauseNode) this._pauseNode.style.display = 'none';
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
            this._bufferingNode.style.cssText = _csstxt;
            this._bufferingNode.style.webkitTransform = _protate;

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
        this._statewrapNode.style.display = 'block';
        this._replayNode.style.display = 'block';

        this._hideLoading();
        if(this._pauseNode) this._pauseNode.style.display = 'none';
    }

    /**
    * 显示pause
    */
    _pro._showPause = function(){
        if(!this._pauseNode) return;

        this._statewrapNode.style.display = 'block';
        if(this._pauseNode) this._pauseNode.style.display = 'block';

        this._hideLoading();
        this._replayNode.style.display = 'none';
    }

    /**
    * 绑定事件
    */
    _pro._initEvent = function(){
        _event._$addEvent(this._bodyNode, 'click', this._onClickDisplay._$bind(this));
        _event._$addEvent(this._bodyNode, 'dblclick', this._ondblClickDisplay._$bind(this));
    }

    /**
    * 点击整个区域
    */
    _pro._onClickDisplay = function(){
        this._isDblClick = false;

        setTimeout(function(){
            if (this._isDblClick) return;

            if (!this._state) {
                return;
            };

            switch(this._state){
                case _constant.MEDIA_STATE.IDLE:
                    return;
                    break;
                case _constant.MEDIA_STATE.COMPLETE:
                case _constant.MEDIA_STATE.PAUSE:            
                    // 发出消息
                    this.sendNotification(_notificationDefine.VIEW_PLAY);
                    break;
                case _constant.MEDIA_STATE.PLAYING:            
                    // 发出消息
                    this.sendNotification(_notificationDefine.VIEW_PAUSE);
            }

        }._$bind(this), 200); // 时间看看能不能再小一点

    }

    /**
    * 双击整个区域
    */
    _pro._ondblClickDisplay = function(){
        this._isDblClick = true;

        // 发出消息
        this.sendNotification(_notificationDefine.VIEW_FULLSCREEN);
    }

    // 返回结果可注入给其他文件
    return VideoDisplayComponent;
});
