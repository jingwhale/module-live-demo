/**
 * PC端视频控制条组件
 *
 * 加分号 TODO
 * Created by hzliuzongyuan on 16/7/22.
 */
NEJ.define([
    'text!./videoControlComponent.html',
    '../base/base.js',
    '../base/component.js',
    'lib/base/element',
    'lib/base/event',
    '../notification/notificationDefine.js',
    '../model/constant.js',
    '../util/util.js',
    'pool/edu-front-util/src/mobileUtil',
    './popoverComponent.js',
    './progressBarComponent.js'  // 为什么加js后缀会报错 TODO
], function (_tpl,
             _base,
             _component,
             _e,
             _v,
             _notificationDefine,
             _constant,
             _util,
             _mobileUtil,
             _PopoverComponent,
             _ProgressBarComponent,
             p, o, f, r) {

    var DEFAULT_INTERVAL = 10;  // 快进快退间隔时间

    var VideoControlComponent = _base.C(),
        _pro = VideoControlComponent.extend(_component);

    VideoControlComponent.NAME = 'videoControlComponent';

    /**
     * init function
     */
    _pro._init = function (_config) {
        this.__super(_config);

        var _self = this;

        this._config = _config;
        this.isPreading = false;
        this._isBan = false;    // 是否处于禁用状态
        this._duration = 0; // 播放时长
        this._crtTime = 0;
        this._state = 'PLAYING';
        this._progressbar = null;
        this._hoverTime = null;
        this._movieData = null;
        this._volumeRecord = 1; // 用于记录大于0的音量,用于点击音量按钮时的切换
        this._isViewSeekBackwardOrForward = false;
        this._hasVolumeInited = false;  // volumebar是否已经初始化
        this._isKeyEventActive = true;

        /*==================== dom ====================*/
        this._rootNode = _config.rootNode;

        this._bodyNode = _e._$getByClassName(this._rootNode, 'j-controlwrap')[0];
        this._cover = _e._$getByClassName(this._rootNode, 'j-controlwrap_cover')[0];
        this._controlbar = _e._$getByClassName(this._rootNode, 'j-controlbar')[0];
        this._controlWrap = _e._$getByClassName(this._rootNode, 'j-controlwrap')[0];
        this._bigplaybtn = _e._$getByClassName(this._rootNode, 'j-bigplaybtn')[0];

        this._dragItem = null;
        this._currentTimeElem = _e._$getByClassName(this._controlbar, 'j-current_time')[0];
        this._durationElem = _e._$getByClassName(this._controlbar, 'j-duration')[0];
        this._playbtn = _e._$getByClassName(this._controlbar, 'j-playbtn')[0];
        this._pausebtn = _e._$getByClassName(this._controlbar, 'j-pausebtn')[0];
        this._volumebtn = _e._$getByClassName(this._controlbar, 'j-volumebtn')[0];
        this._volumebar = null;
        this._volumePopover = _e._$getByClassName(this._controlbar, 'j-popover-volume')[0];
        this._rateBtn = _e._$getByClassName(this._controlbar, 'j-ratebtn')[0];
        this._ratePopover = null;
        this._rateBtnTxt = _e._$getByClassName(this._controlbar, 'j-ratebtn_text')[0];
        this._captionBtn = _e._$getByClassName(this._controlbar, 'j-captionbtn')[0];
        this._captionPopover = null;
        this._qualityBtn = _e._$getByClassName(this._controlbar, 'j-qualitybtn')[0];
        this._qualityBtnTxt = _e._$getByClassName(this._controlbar, 'j-qualitybtn_text')[0];
        this._qualityPopover = null;
        this._fullscreen = _e._$getByClassName(this._controlbar, 'j-fullscreen')[0];
        this._notfullscreen = _e._$getByClassName(this._controlbar, 'j-notfullscreen')[0];
        this._cdnPopover = null;
        this._cdnBtn = _e._$getByClassName(this._controlbar, 'j-cdnbtn')[0];
        /*==================== /dom ====================*/

        /*==================== 实例方法 ====================*/
        // 用于键盘事件
        this._viewBack = _throttle(function (_count) {
            _self.sendNotification(_notificationDefine.VIEW_SEEK, _self._crtTime - DEFAULT_INTERVAL * _count);
            _self._isViewSeekBackwardOrForward = false;
        }, 300);

        // 用于键盘事件
        this._viewForward = _throttle(function (_count) {
            _self.sendNotification(_notificationDefine.VIEW_SEEK, _self._crtTime + DEFAULT_INTERVAL * _count);
            _self._isViewSeekBackwardOrForward = false;
        }, 300);

        // 用于键盘事件
        this._viewSeek = function (_direction) {
            var _crtPos = _self._progressbar.crtProgressPos,
                _interval = DEFAULT_INTERVAL / _self._duration;

            _self._isViewSeekBackwardOrForward = true;
            _self._progressbar.setProgressPos(_direction == 'back' ? _crtPos - _interval : _crtPos + _interval);

            if (_direction == 'back') {
                _self._viewBack();
            } else {
                _self._viewForward();
            }
        }
        /*==================== /实例方法 ====================*/

        this._initEvent();

        return this;
    }

    /**
     * 获取组件结构，子类实现
     */
    _pro._getTpl = function () {
        return _tpl;
    }

    /**
     * 列出监听的消息
     */
    _pro.listNotificationInterests = function () {
        return [
            _notificationDefine.MOVIEDATA_READY,
            _notificationDefine.MAINVIDEO_START_LOAD,
            _notificationDefine.MAINVIDEO_TIME,
            _notificationDefine.MAINVIDEO_META,
            _notificationDefine.MAINVIDEO_STATE,
            _notificationDefine.MAINVIDEO_BUFFER,
            _notificationDefine.MAINVIDEO_RATE_CHANGE,
            _notificationDefine.MAINVIDEO_QUALITY_CHANGE,
            _notificationDefine.BOX_FULLSCREEN_CHANGE,
            _notificationDefine.MAINVIDEO_VOLUME,
            _notificationDefine.VIEW_PREAD_START,
            _notificationDefine.VIEW_PREAD_END,
            _notificationDefine.MAINVIDEO_VOLUME_INCREASE,
            _notificationDefine.MAINVIDEO_VOLUME_DECREASE,
            _notificationDefine.MOVIEDATA_CURRENT_CDN_CHANGE
        ];
    }

    /**
     * 集中处理消息
     */
    _pro.handleNotification = function (_notificationIns) {

        var _data = _notificationIns.getBody()

        this.__super(_notificationIns);

        switch (_notificationIns.getName()) {

            case _notificationDefine.MOVIEDATA_READY:
                this._handleMoviedataReady(_data);
                break;

            case _notificationDefine.MAINVIDEO_START_LOAD:
                this._handleMainvideoStartLoad(_data);
                break;

            case _notificationDefine.MAINVIDEO_META:
                this._handleMainvideoMeta(_data);
                break;

            case _notificationDefine.MAINVIDEO_STATE:
                this._handleMainvideoState(_data);
                break;

            case _notificationDefine.MAINVIDEO_BUFFER:
                this._handleMainvideoBuffer(_data);
                break;

            case _notificationDefine.MAINVIDEO_TIME:
                this._handleMainvideoTime(_data);
                break;

            case _notificationDefine.MAINVIDEO_RATE_CHANGE:
                this._rateBtnTxt.innerHTML = _data + 'x';
                this._ratePopover.select(function (_v) {
                    if (_v.data === _data) {
                        return true;
                    }

                    return false;
                }, false);
                break;

            case _notificationDefine.MAINVIDEO_QUALITY_CHANGE:
                this._handleMainvideoQualityChange(_data);
                break;

            case _notificationDefine.MOVIEDATA_CURRENT_CDN_CHANGE:
                this._handleMoviedataCurrentCDNChange(_data);
                break;

            case _notificationDefine.BOX_FULLSCREEN_CHANGE:
                this._handleBoxFullscreenChange(_data);
                break;

            case _notificationDefine.MAINVIDEO_VOLUME:
                this._handleMainvideoVolume(_data);
                break;

            case _notificationDefine.VIEW_PREAD_START:
                this._handleViewPreadStart(_data);
                break;

            case _notificationDefine.VIEW_PREAD_END:
                this._handleViewPreadEnd(_data);
                break;

            case _notificationDefine.MAINVIDEO_VOLUME_INCREASE:
                this._volumebar.setProgressPos(_data);
                break;

            case _notificationDefine.MAINVIDEO_VOLUME_DECREASE:
                this._volumebar.setProgressPos(_data);
                break;
        }
    }

    /**
     * 绑定事件
     */
    _pro._initEvent = function () {
        _v._$addEvent(this._rootNode, 'mousedown', this._onRootNodeMousedown._$bind(this));

        _v._$addEvent(document, 'mousedown', this._onDocumentMousedown._$bind(this));

        _v._$addEvent(document, 'keydown', this._onDocumentKeydown._$bind(this));

        _v._$addEvent(this._playbtn, 'click', (function () {
            this.sendNotification(_notificationDefine.VIEW_PLAY)
        })._$bind(this));

        _v._$addEvent(this._pausebtn, 'click', (function () {
            this.sendNotification(_notificationDefine.VIEW_PAUSE)
        })._$bind(this));

        _v._$addEvent(this._fullscreen, 'click', (function () {
            this.sendNotification(_notificationDefine.VIEW_FULLSCREEN)
        })._$bind(this));

        _v._$addEvent(this._notfullscreen, 'click', (function () {
            this.sendNotification(_notificationDefine.VIEW_FULLSCREEN)
        })._$bind(this));

        // 点击音量按钮toggle音量
        _v._$addEvent(this._volumebtn, 'click', this._onVolumeBtnClick._$bind(this));

        // 点击bigplaybtn发送播放消息
        _v._$addEvent(this._bigplaybtn, 'click', (function () {
            this.sendNotification(_notificationDefine.VIEW_PLAY);
        })._$bind(this));
    }

    /*==================== 处理消息的方法 ====================*/
    _pro._handleMoviedataReady = function (_data) {
        this._movieData = _data;
        this._initControl(_data);
        this._initAnimation();
    }

    _pro._handleMainvideoStartLoad = function (_data) {
        if (this._movieData != _data.movieData) {
            this._initControl(_data.movieData);
        }
    }

    _pro._handleViewPreadStart = function (_data) {
        this.isPreading = true;
        this.ban();
    }

    _pro._handleViewPreadEnd = function (_data) {
        this.isPreading = false;
        this.unban();
    }

    _pro._handleMainvideoQualityChange = function (_data) {
        this._qualityPopover && this._qualityPopover.select(function (_v) {
            if (_v.value == _data.qualityName) {
                return true;
            }
        }, false);
        this._qualityBtnTxt.innerHTML = _data.qualityName;
    }

    _pro._handleMoviedataCurrentCDNChange = function (_data) {
        this._cdnPopover && this._cdnPopover.select(function (_v) {
            if (_v.value == _data.cdnSwitch.newData.ispNmae) {
                return true;
            }
        }, false);
    }

    /**
     * 这个消息在点击cover之后才会被发出,在ready之后;
     * 此时的duration才是最准确的
     */
    _pro._handleMainvideoMeta = function (_data) {
        this._duration = _data.duration;
        this._durationElem.innerHTML = _util.formatVideoTime(_data.duration);    // 设置控制条上的总时间

        function _transferToAnchors(_cluPoints) {

            for (var i = 0; i < _cluPoints.length; i++) {
                _cluPoints[i].position = _cluPoints[i].time / _data._duration;
            }

            return _cluPoints;
        }

        if (this._progressbar) {
            this._progressbar.reset({
                start: 0,
                anchors: this._cluPointList || []
            })
        } else {
            this._initProgressBar(this._crtTime, this._duration, this._cluPointList ? _transferToAnchors(this._cluPointList) : []);
        }
    }

    _pro._handleMainvideoState = function (_data) {
        this._state = _data.newState;

        if (_data.newState == 'PAUSED') {
            _e._$delClassName(this._playbtn, 'z-hide');
            _e._$delClassName(this._pausebtn, 'z-show');
            if (!this.isPreading) {
                _e._$addClassName(this._bigplaybtn, 'z-show');
            }
        } else {
            if (_data.newState == 'PLAYING') {
                _e._$addClassName(this._playbtn, 'z-hide');
                _e._$addClassName(this._pausebtn, 'z-show');
            }
            _e._$delClassName(this._bigplaybtn, 'z-show');
        }
    }

    _pro._handleMainvideoBuffer = function (_data) {
        this._progressbar && this._progressbar.setBufferPos(_data.bufferPercent);
    }

    _pro._handleMainvideoTime = function (_data) {

        var _currentTime = _data.currentTime,
            _duration = _data.duration;

        this._crtTime = _currentTime;
        this._currentTimeElem.innerHTML = _util.formatVideoTime(_currentTime);    // 使控制条上的当前时间发生改变

        if (this._progressbar && !this._progressbar.isDragging && !this._isViewSeekBackwardOrForward) {//&& !this._isViewSeekBackwardOrForward
            this._progressbar.setProgressPos(_currentTime / _duration);
        }
    }

    _pro._handleBoxFullscreenChange = function (_data) {

        if (_data) {  // 全屏状态
            _e._$addClassName(this._fullscreen, 'z-hide');
            _e._$addClassName(this._notfullscreen, 'z-show');
        } else {
            _e._$delClassName(this._fullscreen, 'z-hide');
            _e._$delClassName(this._notfullscreen, 'z-show');
        }
    }

    _pro._handleMainvideoVolume = function (_data) {

        var _self = this;

        if (!this._hasVolumeInited) {
            this._hasVolumeInited = true;
            this._volumeRecord = _data ? _data : 1;
            this._volumebar = new _ProgressBarComponent({
                isChangeInstantly: true,
                klass: 'volumebar',
                type: 4,
                start: _data,
                onMousemove: function (_pos) {
                    _pos = +_pos.toFixed(2);
                    _self.sendNotification(_notificationDefine.VIEW_VOLUME, _pos);
                },
                onMouseup: function (_pos) {
                    _pos = +_pos.toFixed(2);
                    _self.sendNotification(_notificationDefine.VIEW_VOLUME, _pos);
                },
                // MAINVIDEO_VOLUME_INCREASE 或者 DECREASE会触发onChange逻辑
                onChange: function (_pos) {
                    _pos = (+_pos).toFixed(2);
                    _self.sendNotification(_notificationDefine.VIEW_VOLUME, _pos);
                }
            }).insertTo(this._volumePopover);
        } else {
            this._volumebar.setProgressPos(_data, false);
            if (!_data) {  // 没有声音
                _e._$addClassName(_self._volumebtn, 'z-close');
            } else {
                _e._$delClassName(_self._volumebtn, 'z-close');
            }
        }
    }
    /*==================== /处理消息的方法 ====================*/

    /*==================== 事件回调 ====================*/
    /**
     * 键盘监听
     */
    _pro._onRootNodeMousedown = function (_event) {
        _event.stopPropagation();
        this._isKeyEventActive = true;
    }

    _pro._onDocumentMousedown = function () {
        this._isKeyEventActive = false;
    }

    _pro._onDocumentKeydown = function (_event) {

        if (!this._isKeyEventActive) {
            return;
        }

        var _self = this;

        var _keyCode = _event.keyCode;

        if (!_self._isBan) {   // 没有禁用才触发以下逻辑
            _v._$stopDefault(_event);

            switch (_keyCode) {
                case 37:
                    this._viewSeek('back');
                    break;
                case 39:
                    this._viewSeek();
                    break;
                case 32:
                    if (_self._state == 'PLAYING') {
                        _self.sendNotification(_notificationDefine.VIEW_PAUSE);
                    } else {
                        _self.sendNotification(_notificationDefine.VIEW_PLAY);
                    }
                    break;
                case 38:
                    _self.sendNotification(_notificationDefine.VIEW_VOLUME_INCREASE);
                    break;
                case 40:
                    _self.sendNotification(_notificationDefine.VIEW_VOLUME_DECREASE);
                    break;
            }
        }
    }

    _pro._onVolumeBtnClick = function (_event) {

        if (_isAncestor(this._volumePopover, _v._$getElement(_event))) {
            return;
        }

        if (this._volumebar.crtProgressPos) {
            this._volumeRecord = this._volumebar.crtProgressPos;
            this._volumebar.setProgressPos(0);
        } else {
            this._volumebar.setProgressPos(this._volumeRecord);
        }
    }

    /*==================== /事件回调 ====================*/

    /*==================== 初始化UI ====================*/
    /**
     * UI总体初始化(包含回收逻辑)
     */
    _pro._initControl = function (_data) {
        this._movieData = _data;
        this._crtTime = _data.start;
        this._cluPointList = _data.cluPointList;

        // 初始化速率按钮及列表
        if (_util.supportRateChange()) {
            this._ratePopover && this._ratePopover.destroy();
            this._rateBtnTxt.innerHTML = '1x';
            this._initRateList();
        }

        // 初始化字幕按钮及列表
        this._captionPopover && this._captionPopover.destroy();

        if (_data.captionData.hasCaption) {
            _e._$delClassName(this._captionBtn, 'z-hide');
            this._initCaptionList(_data.captionData);
        } else {
            _e._$addClassName(this._captionBtn, 'z-hide');
        }

        // 初始化清晰度按钮及列表
        this._qualityPopover && this._qualityPopover.destroy();
        this._qualityBtnTxt.innerHTML = _data.currentMovieItem.qualityName;

        if (_data.movieItemList.length == 1) {
            _e._$addClassName(this._qualityBtn, 'z-dis');
        } else {
            _e._$delClassName(this._qualityBtn, 'z-dis')
            this._initQualityList(_data);
        }

        // 初始化线路按钮及列表
        this._cdnPopover && this._cdnPopover.destroy();

        if (!_data.cdnSwitchData || !this._config.showCdnSwitch) {
            _e._$addClassName(this._cdnBtn, 'z-hide');
        } else {
            _e._$delClassName(this._cdnBtn, 'z-hide');

            if (_data.cdnSwitchData.length > 1) {
                _e._$delClassName(this._cdnBtn, 'z-dis');
                this._initCdnList(_data.cdnSwitchData, _data.cdnSwitch);
            } else {
                _e._$addClassName(this._cdnBtn, 'z-dis');
            }
        }
    }

    _pro._initProgressBar = function (_start, _duration, _anchors) {

        var _self = this;

        for (var i = 0; i < _anchors.length; i++) {
            _anchors[i].position = _anchors[i].time / _duration;
        }

        this._progressbar = new _ProgressBarComponent({
            klass: 'progresswrap',
            type: 1,
            start: _start / _duration,
            anchors: _anchors,
            init: function () {
                _self._hoverTime = _self._initHoverTime(this.rootNode);
                _self._dragItem = _e._$getByClassName(this.rootNode, 'drag_item')[0];
                _e._$create('div', 'placeholder', this.rootNode); // 增大点击域
            },
            onMouseup: function (_pos) {
                _self.sendNotification(_notificationDefine.VIEW_SEEK, {
                    newData: Math.floor(_pos * _self._duration),
                    oldData: Math.floor(this.preProgressPos * _self._duration)
                });
            },
            onHover: function (_pos) {
                _self._hoverTime.setTime(Math.floor(_pos * _self._duration));
            },
            onAnchor: function (_anchor) {
                _self.sendNotification(_notificationDefine.VIEW_ANCHOR, _anchor);
            }
        }).insertTo(this._bodyNode, 'prepend');

        this.sendNotification(_notificationDefine.VIDEO_CONTROL_DOM_READY, this._bodyNode);
    }

    _pro._initHoverTime = function (_dep) {

        var _self = this,
            _rootNode = _e._$create('div', 'time', _dep);

        _v._$addEvent(_dep, 'mouseleave', function () {
            _e._$delClassName(_rootNode, 'z-show');
        })

        return {
            setTime: function (_seconds) {
                var _depWidth = _dep.offsetWidth,
                    _pos = _seconds / _self._duration * _depWidth,
                    _rootNodeWidth = 0;

                function _getLeft() {

                    if (_pos <= _rootNodeWidth / 2) {
                        return 0;
                    } else if (_pos >= _depWidth - _rootNodeWidth / 2) {
                        return _depWidth - _rootNodeWidth;
                    } else {
                        return _pos - _rootNodeWidth / 2;
                    }
                }

                _e._$addClassName(_rootNode, 'z-show');
                _rootNode.innerHTML = _util.formatVideoTime(_seconds); // 调整内容
                _rootNodeWidth = _rootNode.offsetWidth;
                _e._$style(_rootNode, {left: _getLeft() + 'px'}); // 调整位置
            }
        }
    }

    _pro._initQualityList = function (_data) {

        var _self = this,
            _currentMovieItem = _data.currentMovieItem,
            _item = null,
            _list = [];

        for (var i = 0; i < _data.movieItemList.length; i++) {
            _item = _data.movieItemList[i];
            _list[i] = {};

            if (_item.quality == _currentMovieItem.quality) {
                _list[i].selected = true;
            }

            _list[i].value = _item.qualityName;
            _list[i].data = {
                quality: _item.quality,
                name: _item.qualityName
            }
        }

        this._qualityPopover = new _PopoverComponent({
            dep: this._qualityBtn,
            klass: 'm-popover-quality',
            list: _list,
            onSelect: function (_newData, _oldData) {
                _self.sendNotification(_notificationDefine.VIEW_QUALITY, {newData: _newData, oldData: _oldData});
            }
        })
    }

    _pro._initRateList = function () {
        var _self = this;

        this._ratePopover = new _PopoverComponent({
            dep: this._rateBtn,
            klass: 'm-popover-rate',
            list: [{
                data: 0.75,
                value: '0.75倍速'
            }, {
                data: 1,
                value: '1倍速',
                selected: true
            }, {
                data: 1.25,
                value: '1.25倍速'
            }, {
                data: 1.5,
                value: '1.5倍速'
            }, {
                data: 1.75,
                value: '1.75倍速'
            }, {
                data: 2,
                value: '2倍速'
            }],
            onSelect: function (_newData) {
                _self.sendNotification(_notificationDefine.VIEW_RATE, _newData);
            }
        })
    }

    _pro._initCaptionList = function (_captionData) {

        var _self = this,
            _list = [],
            _item = {};

        for (var i = 0; i < _captionData.data.length; i++) {
            _item = _captionData.data[i];
            _list.push({
                value: _item.name,
                data: _item.name,
                selected: _item.isSelect
            })
        }

        this._captionPopover = new _PopoverComponent({
            dep: this._captionBtn,
            type: 2,
            klass: 'm-popover-caption',
            list: _list,
            onSelect: function (_newData, _oldData, _operation) {

                // 字幕组件需要用到isSelect(表示某项字幕是否被选中)
                for (var i = 0; i < _captionData.data.length; i++) {
                    if (_operation.data == _captionData.data[i].name) {
                        _captionData.data[i].isSelect = _operation.name == 'select';
                        break;
                    }
                }

                _self.sendNotification(_notificationDefine.VIEW_CAPTION_SELECT, {
                    newData: _newData,
                    oldData: _oldData,
                    operation: _operation
                });
            }
        })
    }

    _pro._initCdnList = function (_cdnSwitchData, _cdnSwitch) {

        var _self = this,
            _list = [],
            _item = null;

        _list[0] = {};
        _list[0].value = '默认'
        _list[0].data = '';

        if (!_cdnSwitch) {    // 即cdn为'默认'项
            _list[0].selected = true;
        }

        for (var i = 0; i < _cdnSwitchData.length; i++) {
            _item = _cdnSwitchData[i];
            _list.push({});
            _list[i + 1].value = _item.ispNmae;
            _list[i + 1].data = _item;

            if (_cdnSwitch && (_item.ispNmae == _cdnSwitch.ispNmae)) { // cdn为此项
                _list[i + 1].selected = true;
            }
        }

        this._cdnPopover = new _PopoverComponent({
            dep: this._cdnBtn,
            klass: 'm-popover-cdn' + (_cdnSwitchData.length <= 3 ? ' m-popover-cdn-one_column' : ''),
            list: _list,
            onSelect: function (_newData) {
                _self.sendNotification(_notificationDefine.VIEW_CDN, {newData: _newData});
            }
        })
    }

    // 控制条显隐动画
    _pro._initAnimation = function () {

        var _self = this;

        var _mousemoveFunc = (function () {

            var _t = -1;

            return function () {
                clearTimeout(_t);
                _e._$addClassName(_self._controlWrap, 'z-show');
                _self.sendNotification(_notificationDefine.VIDEO_CONTROL_SHOW);

                _t = setTimeout(function () {
                    _e._$delClassName(_self._controlWrap, 'z-show');
                    _self.sendNotification(_notificationDefine.VIDEO_CONTROL_HIDE);
                }, 5000);
            }
        })();

        _mouseleaveFunc = function () {
            _e._$delClassName(_self._controlWrap, 'z-show');
            _self.sendNotification(_notificationDefine.VIDEO_CONTROL_HIDE);
        }

        _v._$addEvent(this._rootNode, 'mousemove', _mousemoveFunc);
        _v._$addEvent(this._rootNode, 'mouseleave', _mouseleaveFunc);
    }

    /*==================== /初始化UI ====================*/

    /*==================== API ====================*/
    _pro.ban = function () {
        this._isBan = true;
        _e._$addClassName(this._cover, 'z-show');
    }

    _pro.unban = function () {
        this._isBan = false;
        _e._$delClassName(this._cover, 'z-show');
    }
    /*==================== /API ====================*/

    /*==================== 工具函数 ====================*/
    function _isAncestor(anc, desc) {
        while (desc) {
            if (anc == desc || (desc.parentElement == anc)) {
                return true
            } else {
                desc = desc.parentElement;
            }
        }

        return false;
    }

    // 降频函数,第一次会立刻执行
    function _throttle(_callback, _time) {

        var _t = null,
            _count = 0;

        return function () {

            if (!_t) {
                _callback.call(this, 1);
                _t = setTimeout(function () {
                    _t = null;
                }, _time)
                return;
            }

            _count++;   // _count从1开始算
            clearTimeout(_t);
            _t = setTimeout(function () {
                _callback.call(this, _count);
                _count = 0;
                _t = null;
            }, _time)
        }
    }

    /*==================== /工具函数 ====================*/

    // 返回结果可注入给其他文件
    return VideoControlComponent;
})
;
