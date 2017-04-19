/**
 * html5 播放器封装模块实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 * @module   pool/component-video-player/src/html5VideoPlayer
 */
NEJ.define([
	'lib/base/util',
    'lib/base/klass',
    'lib/base/element',
    'lib/util/event',
    './h5VideoPlayer/player/player.js'
],function(
	_util, 
	_k, 
	_e,
	_event, 
    _player,
	_p, _o){

    /**
     * _$$Html5VideoPlayer类
     *
     * @class   module:pool/component-video-player/src/html5VideoPlayer._$$Html5VideoPlayer
     * @extends module:pool/nej/src/util/event._$$EventTarget
     */
   	_p._$$Html5VideoPlayer = _k._$klass();
    var _pro = _p._$$Html5VideoPlayer._$extend(_event._$$EventTarget);
    
    /**
     * 初始化
     *
     * @protected
     * @method  module:pool/component-video-player/src/html5VideoPlayer._$$Html5VideoPlayer#__init
     * @returns {Void}
     */
    _pro.__init = function(){
        this.__super();
    }

    /**
     * 重置数据
     *
     * @protected
     * @method  module:pool/component-video-player/src/html5VideoPlayer._$$Html5VideoPlayer#__reset
     * @returns {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);

        this.__options = _options;
        this.__videoOptions = _options.data;

        this.__genH5Player();
    }

    /**
     * 创建播放器
     *
     * @private
     * @method  module:pool/component-video-player/src/html5VideoPlayer._$$Html5VideoPlayer#__genH5Player
     * @returns {Void}
     */
    _pro.__genH5Player = function() {
        this.__playerUI = new _player({
            parent : this.__options.parent,
            isLocal : Boolean(this.__videoOptions.isLocal),
            mode : this.__videoOptions.mode,
            host : this.__videoOptions.host,
            useNative : this.__videoOptions.useNative,
            autoStart : this.__videoOptions.autoStart,
            defaultQuality : this.__videoOptions.defaultQuality,
            rate : this.__videoOptions.rate,
            mute : this.__videoOptions.mute,
            volume : this.__videoOptions.volume,
            isPreload : this.__videoOptions.preload,
            showPauseAd : this.__videoOptions.showPauseAd,
            showCdnSwitch : false, //this.__videoOptions.showCdnSwitch, // cdn线路接口未配置跨域
            notAllowFullScreen : this.__videoOptions.notAllowFullScreen,

            // 回调
            onStartLoad : this.__onStartLoad._$bind(this),
            onSeek : this.__onSeek._$bind(this),
            onPlay : this.__onPlay._$bind(this),
            onPause : this.__onPause._$bind(this),
            onPlayClick : this.__onPlayClick._$bind(this),
            onPauseClick : this.__onPauseClick._$bind(this),
            onPlayEnd : this.__onPlayEndHandle._$bind(this),
            onChangeRate : this.__onChangeRate._$bind(this),
            onChangeVolume : this.__onChangeVolume._$bind(this),
            onMute : this.__onChangeMute._$bind(this),
            onSelectResolution : this.__onSelectResolution._$bind(this),
            onSelectCaption : this.__onSelectCaption._$bind(this),
            onChangeCDN : this.__onSelectCDN._$bind(this),
            onAnchorPoint : this.__onAnchorHandle._$bind(this)
        });
    
        // 开始加载
        if (this.__videoOptions.videoData) {
            this.__playerUI.load(this.__videoOptions.videoData);
        };
        
    }

    /**
     * 销毁
     *
     * @protected
     * @method  module:pool/component-video-player/src/html5VideoPlayer._$$Html5VideoPlayer#__destroy
     * @returns {Void}
     */
    _pro.__destroy = function(){
		this.__supDestroy();

        this.__playerUI.destory();
        this.__playerUI = null;
    }

    //////////////////////////// 暴露的方法 ////////////////////////////////

    // 停止当前视频播放
    _pro._$stop = function(){
        this.__playerUI.stop();
    }

    // 加载新视频
    _pro._$load = function(_videoData){
        if (!_videoData) {
            return;
        };
        
        this.__playerUI.load(_videoData);
    }
    
    // 暂停视频
    _pro._$pause = function(){
        this.__playerUI.pause();
    }

    // 恢复视频
    _pro._$resume = function(){
        this.__playerUI.resume();
    }

    // 获取当前视频播放的时间
    _pro._$getPosition = function(_callback){
        _callback && _callback(this.__playerUI.getPosition(_callback));
    }
    
    // 设置跳转到对应的时间,用于驻点播放
    _pro._$seek = function(_seekSecs){
        this.__playerUI.seek(_seekSecs);
    }

    // 获取播放器的状态
    _pro._$getState = function(_callback){
        _callback && _callback(this.__playerUI.getState());
    }

    // 获取播放器的状态
    _pro._$getStateInfo = function(_callback){
        _callback && _callback(this.__playerUI.getStateInfo());
    }

    // 直播流检查和重新加载，只有flash支持
    _pro._$checkLiveReload = function(){
        
    }

    // 当前是否卡顿
    _pro._$isBlock = function(){
        return this.__playerUI.isBlock();
    }

    // 原始帧率
    _pro._$metaFPS = function(){
        return this.__playerUI.metaFPS();
    }

    // 实际帧率
    _pro._$currentFPS = function(){
        return this.__playerUI.currentFPS();
    }

    // 实际kbps
    _pro._$currentKbps = function(){
        return this.__playerUI.currentKbps();
    }

    /*/////////////////////// 以下是播放器事件 /////////////////////////*/
    _pro.__onStartLoad = function(data){
        this._$dispatchEvent('onStartLoad', data);
    }

    _pro.__onPlayEndHandle = function(){
        this._$dispatchEvent('onPlayEnd');
    }

    _pro.__onAnchorHandle = function(_data){
        this._$dispatchEvent('onAnchorPoint', _data);
    }

    _pro.__onChangeVolume = function(_videoVolume){
        this._$dispatchEvent('onChangeVolume', _videoVolume);
    }

    _pro.__onChangeRate = function(_rate){
        this._$dispatchEvent('onChangeRate', _rate);
    }

    _pro.__onChangeMute = function(_isMute){
        this._$dispatchEvent('onMute', _isMute);
    }

    _pro.__onSeek = function(_seekData){
        this._$dispatchEvent('onSeek', _seekData);
    }

    _pro.__onSelectResolution = function(_resolutionData){
        this._$dispatchEvent('onSelectResolution', _resolutionData);
    }

    _pro.__onSelectCaption = function(_captionData){
        this._$dispatchEvent('onSelectCaption', _captionData);
    }    

    _pro.__onSelectCDN = function(_cdnData){
        this._$dispatchEvent('onChangeCDN', _cdnData);
    }

    _pro.__onPlay = function(){     
        this._$dispatchEvent('onPlay');
    }

    _pro.__onPause = function(){
        this._$dispatchEvent('onPause');
    }

    _pro.__onPlayClick = function(){        
        this._$dispatchEvent('onPlayClick');
    }

    _pro.__onPauseClick = function(_position){
        this._$dispatchEvent('onPauseClick', _position);
    }
    

    // 返回结果可注入给其他文件
    return _p;
});
