/**
 * 移动端视频直播控制条组件
 * @author  hzwujiazhen@corp.netease.com
 */
NEJ.define([
    'text!./videoControlMobileLiveComponent.html',
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
    _e,
    _v,
    _notificationDefine,
    _constant,
    _util,
    _mobileUtil,
    p, o, f, r) {

    var VideoControlMobileLiveComponent = _base.C(),
        _pro = VideoControlMobileLiveComponent.extend(_component);

    VideoControlMobileLiveComponent.NAME = 'videoControlMobileLiveComponent';

    /**
     * init function
     */
    _pro._init = function(_config) {
        this.__super(_config);
        this._config = _config;
        this._timmer = null;

        this._rootNode = _config.rootNode;
        this._bodyNode = _e._$getByClassName(this._rootNode, 'j-mliveControlwrap')[0];
        this._pausePlayBtnNode = _e._$getByClassName(this._bodyNode, 'j-pausePlayBtn')[0];
        this._reloadBtnNode = _e._$getByClassName(this._bodyNode, 'j-reloadBtn')[0];
        this._fullScreenBtnNode = _e._$getByClassName(this._bodyNode, 'j-fullScreenBtn')[0];
        this._livehNode = _e._$getByClassName(this._bodyNode, 'j-liveh')[0];
        this._livepNode = _e._$getByClassName(this._bodyNode, 'j-livep')[0];

        this._initEvent();
        this._controlBarAutoDisplay();

        return this;
    }

    /**
     * 获取组件结构，子类实现
     */
    _pro._getTpl = function() {
        return _tpl;
    }

    /**
     * 列出监听的消息
     */
    _pro.listNotificationInterests = function() {
        return [
            _notificationDefine.MOVIEDATA_READY,
            // _notificationDefine.MAINVIDEO_TIME,
            // _notificationDefine.MAINVIDEO_META,
            _notificationDefine.MAINVIDEO_STATE,
            _notificationDefine.BOX_FULLSCREEN_CHANGE
        ];
    }

    /**
     * 处理消息的方法
     */
    _pro.handleNotification = function(_notificationIns) {
        var _data = _notificationIns.getBody()

        this.__super(_notificationIns);
        switch (_notificationIns.getName()) {
            case _notificationDefine.MOVIEDATA_READY:
                this._showLiveInfo(_data);
                break;

            // case _notificationDefine.MAINVIDEO_META:
            //     break;

                // 视频状态
            case _notificationDefine.MAINVIDEO_STATE:
                this._togglePlayState(_data);
                break;

            // 播放进度，暂时没有用到
            // case _notificationDefine.MAINVIDEO_TIME:
            //     break;

            // 全屏状态切换
            case _notificationDefine.BOX_FULLSCREEN_CHANGE:
                this._toggleFullscreen(_data);
                break;
        }
    }

    /*
     * 显示直播状态
     */
    _pro._showLiveInfo = function(_data) {
        if (_data.liveTitle) {
            this._livehNode.innerText = _data.liveTitle;
        };

        if(_data.liveStartTime && _data.liveEndTime){
            this._livepNode.innerText = _util.formatLiveTime(_data.liveStartTime, _data.liveEndTime);            
        }
    }

    /*
     * 播放按钮状态切换
     */
    _pro._togglePlayState = function(_data) {
        if (_data.newState == "PLAYING") {
            //点击播放
            if (_e._$hasClassName(this._pausePlayBtnNode, 'active')) {
                return;
            }

            _e._$addClassName(this._pausePlayBtnNode, 'active');

        } else if (_data.newState == "PAUSED") {
            //暂停
            _e._$delClassName(this._pausePlayBtnNode, 'active');
        }

    }

    /*
     * 全屏状态按钮切换
     */
    _pro._toggleFullscreen = function(_data) {
        if (_e._$hasClassName(this._fullScreenBtnNode, 'active')) {
            _e._$delClassName(this._fullScreenBtnNode, 'active');
            return;
        }

        _e._$addClassName(this._fullScreenBtnNode, 'active');
    }

    /**
     * 控制条自动5s显示隐藏
     */
    _pro._controlBarAutoDisplay = function() {
        var self = this;

        clearTimeout(this._timmer);

        this._timmer = setTimeout(function() {
            if (_e._$hasClassName(self._bodyNode, 'f-vh')) {
                return;
            }

            _e._$addClassName(self._bodyNode, 'f-vh');
        }, 5000);
    }

    /**
     * 绑定事件
     */
    _pro._initEvent = function() {
        var self = this,
           
            //添加事件实例
            _pausePlayEventIns = new Hammer(this._pausePlayBtnNode),
            _reloadEventIns = new Hammer(this._reloadBtnNode),
            _fullScreenEventIns = new Hammer(this._fullScreenBtnNode),
            _bodyNodeEventIns = new Hammer(this._bodyNode),
            _rootNodeEventIns = new Hammer(this._rootNode);

        // 点击控制条阻止冒泡到全局导致隐藏
        _bodyNodeEventIns.on('tap', function(_event){
            _event.srcEvent.cancelBubble = true;
        }, false);
        
        // 点击播放按钮状态切换
        _pausePlayEventIns.on('tap', function(_event) {
            if (_e._$hasClassName(self._pausePlayBtnNode, 'active')) {

                self.sendNotification(_notificationDefine.VIEW_PAUSE);
                return;
            }

            self.sendNotification(_notificationDefine.VIEW_PLAY);
        });

        // 点击重新加载按钮
        _reloadEventIns.on('tap', function(_event) {
            self.sendNotification(_notificationDefine.VIEW_RELOAD);
        });

        // 点击全屏按钮状态切换
        _fullScreenEventIns.on('tap', function(_event) {
            self.sendNotification(_notificationDefine.VIEW_FULLSCREEN);
        });

        // 点击取消自动消失
        _rootNodeEventIns.on('tap', function(_event) {
            if (_e._$hasClassName(self._bodyNode, 'f-vh')) {

                _e._$delClassName(self._bodyNode, 'f-vh');
                self._controlBarAutoDisplay();
            }else{

                _e._$addClassName(self._bodyNode, 'f-vh');
                clearTimeout(this._timmer);
            }

        });

    }

    // 返回结果可注入给其他文件
    return VideoControlMobileLiveComponent;
});
