/**
 * PC端视频控制条组件
 * @author  hzliaobolin@corp.netease.com
 */
NEJ.define([
    'text!./videoControlMobileComponent.html',
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

    var VideoControlMobileComponent = _base.C(),
        _pro = VideoControlMobileComponent.extend(_component);

    VideoControlMobileComponent.NAME = 'videoControlMobileComponent';

    /**
     * init function
     */
    _pro._init = function(_config) {

        this.__super(_config);
        this._config = _config;
        this._isDragging = false;
        this._timmer = null;
        this._preTime = null; // 上一次时间
        this._cluPointList = null; // 驻点列表
        this._duration = 0; // 播放时长
        this._start = 0; // 起始播放时间

        this._rootNode = _config.rootNode;
        this._bodyNode = _e._$getByClassName(this._rootNode, 'j-mControlwrap')[0];
        this._processBarNode = _e._$getByClassName(this._bodyNode, 'j-mProgressbar')[0];
        this._dragItem = _e._$getByClassName(this._bodyNode, 'j-mDragitem')[0];
        this._timebar = _e._$getByClassName(this._bodyNode, 'j-mTimebar')[0];
        this._bufferbar = _e._$getByClassName(this._bodyNode, 'j-mBufferbar')[0];
        this._anchorNode = _e._$getByClassName(this._bodyNode, 'j-mAnchor')[0];

        this._controlBarNode = _e._$getByClassName(this._bodyNode, 'j-mControlbar')[0];
        this._pausePlayBtnNode = _e._$getByClassName(this._bodyNode, 'j-pausePlayBtn')[0];
        this._nowTimeNode = _e._$getByClassName(this._bodyNode, 'j-nowTime')[0];
        this._allDurationNode = _e._$getByClassName(this._bodyNode, 'j-allDuration')[0];
        this._moreBtnNode = _e._$getByClassName(this._bodyNode, 'j-moreBtn')[0];
        this._fullScreenBtnNode = _e._$getByClassName(this._bodyNode, 'j-fullScreenBtn')[0];
        this._controlbarCoverNode =  _e._$getByClassName(this._bodyNode, 'j-controlbarCover')[0];

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
            _notificationDefine.MAINVIDEO_TIME,
            _notificationDefine.MAINVIDEO_META,
            _notificationDefine.MAINVIDEO_STATE,
            _notificationDefine.MAINVIDEO_BUFFER,
            _notificationDefine.BOX_FULLSCREEN_CHANGE,
            _notificationDefine.VIEW_MORE_MENU_CHANGE,
            _notificationDefine.VIEW_PREAD_START,
            _notificationDefine.VIEW_PREAD_END
        ];
    }

    /**
     * 处理消息的方法
     */
    _pro.handleNotification = function(_notificationIns) {

        var _data = _notificationIns.getBody()

        this.__super(_notificationIns);
        switch (_notificationIns.getName()) {

            // 视频加载完毕，reset 开始时间
            case _notificationDefine.MOVIEDATA_READY:

                this._resetStartTime(_data);
                this._cluPointList = _data.cluPointList || [];
                break;

                // 进度条初始化
            case _notificationDefine.MAINVIDEO_META:

                this._updateVideoTimeline(_data, true);
                this._initVideoPlayTime(_data);
                this._initAnchorPoint(_data);
                break;

                // 视频状态
            case _notificationDefine.MAINVIDEO_STATE:

                this._videoStateHandler(_data);
                break;

                // 缓冲
            case _notificationDefine.MAINVIDEO_BUFFER:

                this._updateBufferTimeline(_data);
                break;


                // 播放逻辑
            case _notificationDefine.MAINVIDEO_TIME:

                this._updateVideoTimeline(_data);
                this._updateVideoPlayTime(_data);
                this._triggerAnchor(_data);
                break;

                // 全屏状态切换
            case _notificationDefine.BOX_FULLSCREEN_CHANGE:

                this._toggleFullscreen(_data);
                break;

                // 菜单按钮切换
            case _notificationDefine.VIEW_MORE_MENU_CHANGE:

                this._toggleMoreMenuBtn(_data);
                break;

                // 播放广告
            case _notificationDefine.VIEW_PREAD_START:

                this._disabledControlBar(_data);
                break;

                // 结束广告
            case _notificationDefine.VIEW_PREAD_END:

                this._enabledControlBar(_data);
                break;
        }
    }

    /**
     * 视频加载完毕
     */
    _pro._resetStartTime = function(_data) {

        this._start = _data.start;
    }

    /**
     * 1. 初始化进度条
     * 2. 根据历史记录续播
     * 3. 视频播放进度条
     * isInit 是否是初始化
     */
    _pro._updateVideoTimeline = function(_data, isInit) {

        var _currentTime = _data.currentTime,
            _duration = _data.duration,
            _processBarNodeWidth = this._processBarNode.offsetWidth,
            _dragItemWidth = this._dragItem.offsetWidth,
            _width = 0;

        //初始化进度条|更新进度条
        if (isInit) {

            _width = this._start / _data.duration * _processBarNodeWidth;
            this._duration = _data.duration;
        } else {

            _width = _currentTime / _duration * _processBarNodeWidth
        }

        function _getLeft() {
            // TODO 改变边界条件以改进用户体验
            if (_width <= _dragItemWidth / 2) { //左边界
                return 0;
            } else if (_width >= _processBarNodeWidth - _dragItemWidth / 2) {
                return _processBarNodeWidth - _dragItemWidth;
            } else {
                return _width - _dragItemWidth / 2;
            }
        }

        function _getWidth() {

            if (_width <= 0) {
                return 0;
            } else if (_width >= _processBarNodeWidth) {
                return _processBarNodeWidth;
            } else {
                return _width;
            }
        }

        if (this._isDragging) { // 如果在拖动则放弃以下逻辑
            return;
        }

        // when start > 0 or update process bar
        _e._$style(this._dragItem, { left: _getLeft() + 'px' });
        _e._$style(this._timebar, { width: _getWidth() + 'px' });
    }

    /**
     * 初始化驻点
     */
    _pro._initAnchorPoint = function(_data){

        var _str = '',
            self = this;

        function getLeft(_time){

            if(!_time){
                return 0;
            }

            return _time / _data.duration * self._processBarNode.offsetWidth;
        }

        for(var i = 0; i < this._cluPointList.length; i++){

            _str += '<div class="anchor" style="left:' + getLeft(this._cluPointList[i].time) + 'px;"></div>';
        }

        this._anchorNode.innerHTML = _str;
    }

    /**
     * 视频缓冲进度条
     */
    _pro._updateBufferTimeline = function(_data) {

        var _width = this._processBarNode.offsetWidth * _data.bufferPercent,
            _temp = this._bufferbar.offsetWidth;

        if (_width < _temp) {

            return;
        }

        _e._$style(this._bufferbar, { width: _width + 'px' });
        _temp = _width;
    }

    /**
     * 视频播放状态
     */
    _pro._videoStateHandler = function(_data) {
        this._togglePlayState(_data);
    }

    /**
     * 设置视频总时间
     */
    _pro._initVideoPlayTime = function(_data) {

        this._allDurationNode.innerHTML = _util.formatVideoTime(_data.duration);
    }

    /**
     * 视频播放时间更新
     */
    _pro._updateVideoPlayTime = function(_data) {

        this._nowTimeNode.innerHTML = _util.formatVideoTime(_data.currentTime);
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
     * 更多按钮状态改变
     */
    _pro._toggleMoreMenuBtn = function(_data) {

        if (_e._$hasClassName(this._moreBtnNode, 'active')) {

            _e._$delClassName(this._moreBtnNode, 'active');
        } else {

            _e._$addClassName(this._moreBtnNode, 'active');
        }
    }

    /**
     * 禁用控制条
     */
    _pro._disabledControlBar = function(_data){

        _e._$delClassName(this._controlbarCoverNode, 'f-dn');
    }

    /**
     * 启用控制条
     */
    _pro._enabledControlBar = function(_data){

        _e._$addClassName(this._controlbarCoverNode, 'f-dn');
    }

    /**
     * 驻点的触发
     */
    _pro._triggerAnchor = function(_data){

        var flag = false;

        for (var i = 0; i < this._cluPointList.length; i++) {

            if (this._cluPointList[i].time == _data.currentTime) {
                flag = true;
                break;
            }
        }

        // 当前时间与某触点时间一致
        if (flag) {

            // _currentTime可能会连续多次同值,这种情况只在第一次触发
            if (this._preTime != _data.currentTime) {

                // 触发驻点事件
                this.sendNotification(_notificationDefine.VIEW_ANCHOR, this._cluPointList[i])
            }
        }

        this._preTime = _data.currentTime;
    }

    /**
     * 绑定事件
     */
    _pro._initEvent = function() {
        var self = this,
            _dragItem = this._dragItem,
            _processBarNode = this._processBarNode,
            _timebar = this._timebar,
            _seekData = {
                oldData: 0,
                newData: 0
            },

            //添加事件实例
            _processBarNodeEventIns = new Hammer(_processBarNode),
            _dragItemEventIns = new Hammer(_dragItem),
            _pausePlayEventIns = new Hammer(this._pausePlayBtnNode),
            _fullScreenEventIns = new Hammer(this._fullScreenBtnNode),
            _bodyNodeEventIns = new Hammer(this._bodyNode),
            _rootNodeEventIns = new Hammer(this._rootNode),
            _moreBtnEventIns = new Hammer(this._moreBtnNode);

        //获取新的播放点时间
        function _getNewTime(_event) {
            if (_event.center.x < 0) {
                return 0;
            }

            var _processBarNodeWidth = _processBarNode.offsetWidth;

            return Math.floor(_event.center.x / _processBarNodeWidth * self._duration);
        }

        //获取旧的播放点时间
        function _getOldTime(_event) {
            var _processBarNodeWidth = _processBarNode.offsetWidth;

            return Math.floor(_dragItem.offsetLeft / _processBarNodeWidth * self._duration);
        }

        //滑动中的position
        function _getPanX(_event) {
            var _processBarNodeWidth = _processBarNode.offsetWidth;
            var _dragItemWidth = _dragItem.offsetWidth;

            if (_event.center.x <= _dragItemWidth / 2) { //左边界
                return 0;
            } else if (_event.center.x >= _processBarNodeWidth - _dragItemWidth / 2) {

                return _processBarNodeWidth - _dragItemWidth;
            } else {

                return _event.center.x - _dragItemWidth / 2;
            }
        }

        // 点击控制条阻止冒泡到全局导致隐藏
        _bodyNodeEventIns.on('tap', function(_event){

            _event.srcEvent.cancelBubble = true;
        }, false);

        // 进度条拖拽逻辑
        _dragItemEventIns.on('panstart pan', function(_event) {

            if (_event.type == 'panstart') {

                _seekData.oldData = _getOldTime();
            }

            if (_event.isFinal) {

                _seekData.newData = _getNewTime(_event);
                self.sendNotification(_notificationDefine.VIEW_SEEK, _seekData);
            } else {

                _e._$style(_dragItem, { left: _getPanX(_event) + 'px' });
            }
        });

        // 进度条点击逻辑
        _processBarNodeEventIns.on('tap', function(_event) {

            // 如果点击的是dragItem则使后续逻辑失效,可以避免offsetX计算错误,并且体验也不错
            if (_v._$getElement(_event) == self._dragItem) {
                return;
            }

            _seekData = {
                oldData: _getOldTime(_event),
                newData: _getNewTime(_event)
            };

            self.sendNotification(_notificationDefine.VIEW_SEEK, _seekData);
        });

        // 点击播放按钮状态切换
        _pausePlayEventIns.on('tap', function(_event) {

            if (_e._$hasClassName(self._pausePlayBtnNode, 'active')) {

                self.sendNotification(_notificationDefine.VIEW_PAUSE);
                return;
            }

            self.sendNotification(_notificationDefine.VIEW_PLAY);
        });

        // 点击全屏按钮状态切换
        _fullScreenEventIns.on('tap', function(_event) {

            self.sendNotification(_notificationDefine.VIEW_FULLSCREEN);
        });

        // 点击取消自动消失
        // vh：visibility：hidden，隐藏了还能取到宽度
        _rootNodeEventIns.on('tap', function(_event) {

            if (_e._$hasClassName(self._bodyNode, 'f-vh')) {

                _e._$delClassName(self._bodyNode, 'f-vh');
                self._controlBarAutoDisplay();
            }else{

                _e._$addClassName(self._bodyNode, 'f-vh');
                clearTimeout(this._timmer);
            }

        });

        // 点击更多显示菜单
        _moreBtnEventIns.on('tap', function(_event) {

            self.sendNotification(_notificationDefine.VIEW_MORE_MENU);

        });
    }

    // 返回结果可注入给其他文件
    return VideoControlMobileComponent;
});
