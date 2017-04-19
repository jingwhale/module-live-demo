/**
 * MediaLog 视频统计（点播、直播）模块实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 * @module   pool/component-video-player/src/log
 */
NEJ.define([
	'lib/base/util',
    'lib/base/klass',
    'lib/base/element',
    'lib/util/event',
    'util/ajax/xdr',
    'util/encode/md5',
    'pool/edu-front-util/src/userUtil'
],function(
	_util, 
	_k, 
	_e,
	_event, 
    _j,
    _md5,
    _userUtil,
	_p, _o){

    /**
     * _$$MediaLog类
     *
     * @class   module:pool/component-video-player/src/log._$$MediaLog
     * @extends module:pool/nej/src/util/event._$$EventTarget
     */
   	_p._$$MediaLog = _k._$klass();
    var _pro = _p._$$MediaLog._$extend(_event._$$EventTarget);
        
    /**
     * 初始化
     *
     * @protected
     * @method  module:pool/component-video-player/src/log._$$MediaLog#__init
     * @returns {Void}
     */
    _pro.__init = function(){
        this.__super();
    }

    /**
     * 重置数据
     *
     * @protected
     * @method  module:pool/component-video-player/src/log._$$MediaLog#__reset
     * @returns {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);

        this._player = _options.player; // 具体播放器对象

        this._initEvent();

        // 基本统计信息
        this._statObjStart = {
            create_time : new Date().getTime().toString(),
            device_id : this._genDeviceID(),
            manufacturer : navigator.userAgent,
            platform : 'web',
            sdk_version : 'eduPlayer v0.0.26',  // 暂时定为组件版本
            session_id : this._genSessionId()
        };

        this._statTimes = 0; // 累计采集的次数
        this._currentMovie = null; // 当前视频信息
        this._blockNumArr = [];
        this._printTimeArr = [];
        this._vfpsArr = [];
        this._pvfpsArr = [];
        this._kbpsArr = [];
        this._errorCode = null;  // 错误信息
        this._errorMessage = null;

    }

    /**
     * 销毁
     *
     * @protected
     * @method  module:pool/component-video-player/src/log._$$MediaLog#__destroy
     * @returns {Void}
     */
    _pro.__destroy = function(){
		this.__super();

        this._clearSecTimer();

        this._jsNamespace = null;
    }

    /**
     * 绑定事件（设置命名空间）
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_initEvent
     * @returns {Void}
     */
    _pro._initEvent = function(){
        this._jsNamespace = NEJ.P('window.eduVideoLog');

        this._jsNamespace.onNewMovie   = this._onNewMovie._$bind(this);
        this._jsNamespace.onError      = this._onError._$bind(this);
        this._jsNamespace.onPlay       = this._onPlay._$bind(this);
        this._jsNamespace.onPause      = this._onPause._$bind(this);
        this._jsNamespace.onEnd        = this._onEnd._$bind(this);
        this._jsNamespace.onIdle       = this._onIdle._$bind(this);
    }

    /**
     * 生成设备id，与视频云逻辑保持一致
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_genDeviceID
     * @returns {String}
     */
    _pro._genDeviceID = function() {
        var device_id,
            exp = new Date(),
            arr,
            reg = new RegExp("(^| )eduplayer_device_id=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            device_id = arr[2];
        } else {
            device_id = new Date().getTime().toString() + Math.round(Math.random()*1E10).toString();
            exp.setTime(exp.getTime() + 1000*60*60*24*365);
            document.cookie = 'eduplayer_device_id='+ device_id + ';path=/;expires=' + exp.toGMTString();
        }

        return device_id;
    },

    /**
     * 生成会话id，与视频云逻辑保持一致
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_genSessionId
     * @returns {String}
     */
    _pro._genSessionId = function(){
        if(!this._sessionId){
            this._sessionId = new Date().getTime().toString() + Math.round(Math.random()*1E10).toString();
        } 

        return this._sessionId;
    }

    /**
     * 选择发送log到哪里
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_choosePostLog
     * @returns {Void}
     */
    _pro._choosePostLog = function(){
        if (this._isLive) {
            this._postLiveLog();
        }else{
            this._postPlayBackLog();
        }
    }

    /**
     * 发送点播log到云课堂
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_postPlayBackLog
     * @returns {Void}
     */
    _pro._postPlayBackLog = function(){
        var statObj = {
            action : this._errorCode ? 'videoPlayError' : 'videoPlay',
            manufacturer : this._statObjStart.manufacturer,
            platform : this._statObjStart.platform,
            memberId : (_userUtil._$getWebUser() || {}).id, // 用户id，未登录则不填
            videoUrl : this._currentMovie.url, // 视频url
            flashPlayerVer : this._currentMovie.flashPlayerVersion // flash中可以获得
        }

        if (this._errorCode) {
            statObj.errorCode = this._errorCode; // 错误码(播放器错误码),
        };

        if (this._errorMessage) {
            statObj.errorMsg = this._errorMessage;
        };

        // 额外信息
        statObj.printTime = this._printTimeArr.join(',');
        statObj.blockNum = this._blockNumArr.join(',');
        statObj.metaFPS = this._vfpsArr.join(',');
        statObj.realFPS = this._pvfpsArr.join(',');
        statObj.kbps = this._kbpsArr.join(',');

        var _product = (window.eduProduct && window.eduProduct.gaProduct) || window.gaProduct;

        if (!_product) {
            return;
        };

        // 调用接口
        var _options = {
            type : 'json',
            data : {
                p : _product,
                dt : _md5._$str2hex(JSON.stringify(statObj))
            },
            method  : 'POST',
            cookie : true,  // 跨域请求带cookie
            onload: function(_data){
                
            }._$bind(this),
            onerror: function(){

            }
        };

        _j._$request('//log.study.163.com/__utm.gif', _options);
    }

    /**
     * 发送直播log到视频云
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_postLiveLog
     * @returns {Void}
     */
    _pro._postLiveLog = function(){
        if(!this._currentMovie){
            return;
        }

        // 基本信息
        var statObj = {
            create_time : this._statObjStart.create_time,
            device_id : this._statObjStart.device_id,
            manufacturer : this._statObjStart.manufacturer,
            platform : this._statObjStart.platform,
            sdk_version : this._statObjStart.sdk_version,
            session_id : this._statObjStart.session_id,
            pull_url : this._currentMovie.url,
            isp : '', // 暂无
            cdn_type : '' // 暂无
        };

        // 额外信息
        statObj.print_time = this._printTimeArr.join(',');
        statObj.real_block_num = this._blockNumArr.join(',');
        statObj.real_v_fps = this._vfpsArr.join(',');
        statObj.real_p_v_fps = this._pvfpsArr.join(',');
        statObj.real_v_kbps = this._kbpsArr.join(',');
        
        // 调用接口
        var _options = {
            type : 'json',
            data : JSON.stringify(statObj),
            method  : 'POST',
            headers : {'Content-Type': 'application/json'},
            cookie : false,  // 跨域请求是否带cookie，仅对CORS方式有效
            onload: function(_data){
                
            }._$bind(this),
            onerror: function(){

            }
        };

        _j._$request('//sdkstats.live.126.net/sdkstats/report/type=4', _options);
    }

    /**
     * 设置定时采集数据的定时器
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_setSecTimer
     * @returns {Void}
     */
    _pro._setSecTimer = function(){
        if (this._secTimer){ 
            return;
        };

        this._secTimer = setInterval(this._getDataSec._$bind(this), 1000);
    }

    /**
     * 清除定时采集数据的定时器
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_clearSecTimer
     * @returns {Void}
     */
    _pro._clearSecTimer = function(){
        if(this._secTimer){
            clearInterval(this._secTimer);
            this._secTimer = null;
        }
    }

    /**
     * 采集播放器的数据
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_getDataSec
     * @returns {Void}
     */
    _pro._getDataSec = function(){
        // 采集的时刻
        this._printTimeArr.push(new Date().getTime());

        // 调用播放器方法
        if (!!this._player._$isBlock) {
            try{
                this._blockNumArr.push(this._player._$isBlock() ? 1 : 0);
            }catch(e){
                this._blockNumArr.push(0);
            }            
        }else{
            this._blockNumArr.push(0);
        }

        if (!!this._player._$metaFPS) {
            try{
                this._vfpsArr.push(Math.round(this._player._$metaFPS()));
            }catch(e){
                this._vfpsArr.push(0);
            }            
        }else{
            this._vfpsArr.push(0);
        }

        if (!!this._player._$currentFPS) {
            try{
                this._pvfpsArr.push(Math.round(this._player._$currentFPS()));
            }catch(e){
                this._pvfpsArr.push(0);
            }            
        }else{
            this._pvfpsArr.push(0);
        }

        if (!!this._player._$currentKbps) {
            try{
                this._kbpsArr.push(Math.round(this._player._$currentKbps()));
            }catch(e){
                this._kbpsArr.push(0);
            }            
        }else{
            this._kbpsArr.push(0);
        }
        
        this._statTimes++;

        if (this._statTimes == 60) { // 一分钟发送一次
            this._statTimes = 0;

            this._choosePostLog();

            // 每次发送后重置数据
            this._printTimeArr = [];
            this._blockNumArr = [];
            this._vfpsArr = [];
            this._pvfpsArr = [];
            this._kbpsArr = [];
        };
    }

    /**
     * 处理新视频事件
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_onNewMovie
     * @param {Object} data - 视频item数据，见具体播放器文档
     * @returns {Void}
     */
    _pro._onNewMovie = function(data){
        if (!this._currentMovie || (this._currentMovie && data.url != this._currentMovie.url)) { // 换了流才重置
            this._clearSecTimer();

            this._currentMovie = data;

            this._logId = data.logId;

            // 目前只统计直播流
            if (this._currentMovie.url.substr(0,4) == 'rtmp' || /m3u8$/i.test(this._currentMovie.url)) {
                this._isLive = true;
            }else{
                this._isLive = false;
            }

            // 清空数据
            this._blockNumArr = [];
            this._printTimeArr = [];
            this._vfpsArr = [];
            this._pvfpsArr = [];
            this._kbpsArr = [];

            // 重置
            this._statTimes = 0;
        };
    }

    /**
     * 检查是否要处理统计数据，根据logId判断
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_checkDoLog
     * @returns {Void}
     */
    _pro._checkDoLog = function(data){
        if (!data || !this._logId) {
            return true;
        };

        if (this._logId && data.logId && this._logId != data.logId) { // 如果统计id不匹配则不处理
            return false;
        }else{
            return true;
        }
    }

    /**
     * 处理播放事件
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_onPlay
     * @param {Object} data - 事件，见具体播放器文档
     * @returns {Void}
     */
    _pro._onPlay = function(data){
        if (this._checkDoLog()) {
            this._setSecTimer();
        };
    }

    /**
     * 处理暂停事件
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_onPause
     * @param {Object} data - 事件，见具体播放器文档
     * @returns {Void}
     */
    _pro._onPause = function(data){
        if (this._checkDoLog()) {
            this._clearSecTimer();
        };
    }

    /**
     * 处理播放完毕事件
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_onEnd
     * @param {Object} data - 事件，见具体播放器文档
     * @returns {Void}
     */
    _pro._onEnd = function(data){
        if (this._checkDoLog()) {
            this._clearSecTimer();
        }
    }

    /**
     * 处理错误事件
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_onError
     * @param {Object} data - 事件，见具体播放器文档
     * @returns {Void}
     */
    _pro._onError = function(data){
        if (this._checkDoLog()) {
            this._clearSecTimer();

            // 立即上报，只上报点播
            if (_util._$isObject(data)) {
                this._errorCode = data.errorType || data.errorCode;
                this._errorMessage = data.errorMessage;
            }else{
                this._errorCode = data;  // 
                this._errorMessage = null; // h5还没有具体信息
            }
            
            this._choosePostLog();
        }
    }

    /**
     * 处理空闲事件
     *
     * @private
     * @method  module:pool/component-video-player/src/log._$$MediaLog#_onIdle
     * @param {Object} data - 事件，见具体播放器文档
     * @returns {Void}
     */
    _pro._onIdle = function(data){
        if (this._checkDoLog()) {
            this._clearSecTimer();
        }
    }

    return _p;
});
