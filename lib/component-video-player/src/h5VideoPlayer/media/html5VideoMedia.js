/**
 * html5视频播放类
 */
NEJ.define([
    'lib/base/util',
    'lib/base/event',
    '../base/base.js',
    '../util/util.js',
    '../event/mediaEvent.js',
    '../event/mediaStateEvent.js',
    '../model/constant.js'
], function(
    _util,
    _event,
    _base,
    _h5util,
    _mediaEvent,
    _mediaStateEvent,
    _constant,
    p, o, f, r){

    var Html5VideoMedia = _base.C();

    var _pro = Html5VideoMedia.pro; 

    _pro._init = function(parentNode, playerConfig, options){
        // 父元素
        this._videoParentNode = parentNode;
        // 配置
        this._cfg = playerConfig;
        // 参数
        this._options = options;

        // 使用配置中的值
        this._mute = this._cfg.mute;
        this._volume = this._cfg.volume;
        this._rate = this._cfg.rate;

        // 播放状态，初始状态
        this._setState(_constant.MEDIA_STATE.IDLE);

        setTimeout(this._setVideoNode._$bind(this,playerConfig), 0);
    }

    _pro._doOptionFn = function(fn, val){
        this._options[fn] && this._options[fn]({
            type : fn,
            data : val
        });
    }

    // 创建video节点
    _pro._setVideoNode = function(cfg){
        if (!_h5util.supportVideo()) {
            this._doOptionFn(_mediaEvent.MEDIA_ERROR, _constant.ERROR_CODE.MEDIA_ERROR_VIDEOTAG_NOT_SUPPORT);
            return;
        };

        if (!!this._videoNode) return;

        var attrs = {};

        if(cfg.useNative){ // 直接使用video标签
            if(cfg.autoStart){
                attrs.autoplay = '';
            } 

            attrs.controls = 'controls';
            attrs.preload = cfg.isPreload ? 'auto' : 'none'; 
            attrs['playsinline'] = '';
            attrs['webkit-playsinline'] = '';
        }else{
            attrs.autoplay = '',
            attrs['playsinline'] = '';
            attrs['webkit-playsinline'] = '';
        }

        // video节点
        this._videoNode = _base.createEl('video', attrs);

        // 添加到父元素
        this._videoParentNode.appendChild(this._videoNode);

        // 绑定video DOM事件
        this._initVideoTagEvent();

        // 抛出事件
        this._doOptionFn(_mediaEvent.MEDIA_VIDEO_READY, this._videoNode);
    }

    // 外部获取video节点
    _pro.getVideoNode = function(){
        return this._videoNode;
    }

    _pro._initVideoTagEvent = function(){
        // _event._$addEvent(this._videoNode, "loadstart", this._onvideoError._$bind(this));
        // _event._$addEvent(this._videoNode, "abort", this._onvideoError._$bind(this));
        // _event._$addEvent(this._videoNode, "stalled", this._onvideoError._$bind(this));
        // _event._$addEvent(this._videoNode, "durationchange", this._onvideoError._$bind(this));
        _event._$addEvent(this._videoNode, "loadedmetadata", this._onvideoLoadedmetadata._$bind(this));
        _event._$addEvent(this._videoNode, "ended", this._onvideoEnded._$bind(this));
        _event._$addEvent(this._videoNode, "error", this._onvideoError._$bind(this));
        _event._$addEvent(this._videoNode, "playing", this._onvideoPlaying._$bind(this));
        _event._$addEvent(this._videoNode, "progress", this._onvideoProgress._$bind(this));
        _event._$addEvent(this._videoNode, "seeked", this._onvideoSeeked._$bind(this));
        _event._$addEvent(this._videoNode, "seeking", this._onvideoSeeking._$bind(this));
        _event._$addEvent(this._videoNode, "timeupdate", this._onvideoTimeupdate._$bind(this));
        _event._$addEvent(this._videoNode, "waiting", this._onvideoWaiting._$bind(this));
        _event._$addEvent(this._videoNode, "play", this._onvideoPlaying._$bind(this));
        _event._$addEvent(this._videoNode, "pause", this._onvideoPause._$bind(this));
        // _event._$addEvent(this._videoNode, "canplay", this._onvideoPlaying._$bind(this));

    }

    // 设置视频source和事件
    _pro._setSourceNode = function(urls){
        this._clearSourceEvent();
        this._removeSourceNode();

        _util._$forEach(urls, function(src, index){
            if(!src) return;

            // 判断视频类型
            var _mimeType = _h5util.getVideoMIMEType(src);

            if(!_mimeType){
                this._doOptionFn(_mediaEvent.MEDIA_ERROR, _constant.ERROR_CODE.MEDIA_ERROR_SOURCETYPE_NOT_SUPPORT);
                return;
            }

            // 个别手机检测不可靠
            if (!_h5util.checkVideoCanPlay(_mimeType)) {
                this._doOptionFn(_mediaEvent.MEDIA_ERROR, _constant.ERROR_CODE.MEDIA_ERROR_SOURCETYPE_NOT_SUPPORT);
                return;
            };

            var se = _base.createEl('source', {
                src : src,
                type : _mimeType.split(';')[0] // 可能有多个
            });

            this._videoNode.appendChild(se);
        }, this);

        this._sourceNodes = _base.T('source', this._videoNode);

        // 绑定事件
        this._initSourceEvent();   

    }

    // 删除source节点
    _pro._removeSourceNode = function(){
        if (this._sourceNodes) {
            _util._$forEach(this._sourceNodes, function(node, index){
                this._videoNode.removeChild(node);
            }, this);
        };

        this._sourceNodes = null;
    }

    // 绑定source节点事件
    _pro._initSourceEvent = function(_sourceNode){
        _util._$forEach(this._sourceNodes, function(_item, _index){
            _event._$addEvent(_item, 'error', this._onsourceError._$bind(this));
        }._$bind(this));
    }

    /**
     * 外部调用load方法开始加载并自动播放，如果设置了beforePlay则加载后先暂停并抛出事件
     */
    _pro.load = function(movieData, isNotFirst, notCallLoad){
        if (!this._videoNode) {
            this._setVideoNode();
        }

        // 视频数据项
        this._movieData = movieData || this._movieData; // 如果没有提供数据，可能是重新再次播放旧数据
        this._item = this._movieData.currentMovieItem; 

        // 加载前操作
        if (!this._doBeforeLoad()) {
            return;
        };

        // 开始加载新视频
        this._doOptionFn(_mediaEvent.MEDIA_START_LOAD, {
            videoNode : this._videoNode,
            movieData : this._movieData
        });

        // 重置状态
        this._hasGetMetaData = false;
        this._hasAutoSeek = false;

        // 重置错误次数
        if(!isNotFirst){ 
            this._errorCount = 0;    
        } 

        // 设置视频地址
        this._setSourceNode(this._item.urls);

        // 发送当前清晰度事件
        this._doOptionFn(_mediaEvent.MEDIA_QUALITY_CHANGE, this._item);

        // 设置音量
        this.volume(this._volume);

        // 设置静音
        this.mute(this._mute);

        // 设置播放速率
        this.rate(this._rate);

        // loading状态
        this._setState(_constant.MEDIA_STATE.BUFFERING);

        if (!notCallLoad) {
            try{
                this._videoNode.load();
            }catch(e){
                this._onvideoError(e);
            }
        };

        this._checkCurrentTime(); // 开始检查进度
    }

    /**
     * 重新播放一个item，可以用于清晰度切换和线路切换
     */
    _pro.reload = function(movieData){
        movieData = movieData || this._movieData;

        // 从上次播放的进度开始播，这里直接修改了item的start，最好不要直接修改
        movieData.start = this._position || this._movieData.start || 0; 

        this.stop();

        this.load(movieData, true);
    }

    // 自动seek，在点播视频加载到meta后执行
    _pro._autoSeek = function(){
        if(this._movieData.start > 0){
            this.seek(this._movieData.start);
        }else{
            this._hasAutoSeek = true;
        }
    }

    // 加载前的操作
    _pro._doBeforeLoad = function(){
        if(this._cfg.beforeLoad && !this._movieData.hasDoBeforeLoad){
            this._movieData.hasDoBeforeLoad = true;

            this._doOptionFn(_mediaEvent.MEDIA_BEFORE_LOAD);
            return false;
        }

        return true;
    }

    // 预加载或者播放前的操作，只支持点播
    _pro._doPreloadAndBeforePlay = function(){
        if(!this._hasGetMetaData || !this._hasAutoSeek || this._cfg.mode == 'live'){
            return;
        }

        // 预加载处理
        if(this._cfg.isPreload && !this._movieData.hasDoPreload){ 
            this._movieData.hasDoPreload = true;

            if (!this._cfg.useNative) {
                this.pause();
            };
            return false;
        }

        // 播放前处理
        if(this._cfg.beforePlay && !this._movieData.hasDoBeforePlay && this._state == _constant.MEDIA_STATE.PLAYING){
            this._movieData.hasDoBeforePlay = true;

            this._doOptionFn(_mediaEvent.MEDIA_BEFORE_PLAY);
            return false;
        }

        return true;
    }

    _pro.play = function(){
        if (this.isCompleted()) {
            this.seek(0); // 重播
            return;
        };

        this._videoNode.play();

        this._setState(_constant.MEDIA_STATE.PLAYING); // 建议去掉，但是可能部分浏览器会出现bug

        this._checkCurrentTime(); // 开始检查进度
    }

    _pro.pause = function(){
        this._videoNode.pause();
        this._setState(_constant.MEDIA_STATE.PAUSE); // 建议去掉，但是可能部分浏览器会出现bug

        this._clearCheckCurrentTime(); // 清除检查进度
    }

    _pro.seek = function(_data){
        if(this._canSeek()){
            var position = _util._$isNumber(_data) ? _data : _data.newData;

            position = (!position || position < 0) ? 0 : position;

            position = position > this._duration ? this._duration : position;

            var old = this._position; 

            try{
                this._videoNode.currentTime = position;
            }catch(error){
                // alert(error.toString());
            }

            this._doOptionFn(_mediaEvent.MEDIA_SEEK, {
                oldData : old,
                newData : position
            });
        }
    }

    _pro.seekForward = function(){
        if(this._canSeek()){
            var _p = this._position + _constant.VARCONST.SEEK_STEP > this._duration ? this._duration : this._position + _constant.VARCONST.SEEK_STEP;

            this._doOptionFn(_mediaEvent.MEDIA_SEEK_FORWARD, {
                oldData : {
                    position : this._position,
                    duration : this._duration
                },
                newData : {
                    position : _p,
                    duration : this._duration
                },
            });

            this.seek(_p);
        }
    }

    _pro.seekBackward = function(){
        if(this._canSeek()){
            var _p = this._position - _constant.VARCONST.SEEK_STEP < 0 ? 0 : this._position - _constant.VARCONST.SEEK_STEP;
        
            this._doOptionFn(_mediaEvent.MEDIA_SEEK_BACKWARD, {
                oldData : {
                    position : this._position,
                    duration : this._duration
                },
                newData : {
                    position : _p,
                    duration : this._duration
                },
            });

            this.seek(_p);
        }
    }

    // 直接改变音量
    _pro.volume = function(value){
        value = value > 1 ? 1 : (value < 0 ? 0 : value);

        this._videoNode.volume = value;
        this._volume = value;

        this._doOptionFn(_mediaEvent.MEDIA_VOLUME, value);
    }

    // 音量递增
    _pro.volumeIncrease = function(){
        var _val = this._videoNode.volume;

        _val = (_val + _constant.VARCONST.VOLUME_STEP) > 1 ? 1 : (_val + _constant.VARCONST.VOLUME_STEP);

        this._videoNode.volume = _val;
        this._volume = _val;

        this._doOptionFn(_mediaEvent.MEDIA_VOLUME_INCREASE, _val);
    }

    // 音量递减
    _pro.volumeDecrease = function(){
        var _val = this._videoNode.volume;

        _val = (_val - _constant.VARCONST.VOLUME_STEP) < 0 ? 0 : (_val - _constant.VARCONST.VOLUME_STEP);

        this._videoNode.volume = _val;
        this._volume = _val;

        this._doOptionFn(_mediaEvent.MEDIA_VOLUME_DECREASE, _val);
    }

    _pro.mute = function(muted){
        this._videoNode.muted = muted;
        this._mute = muted;

        this._doOptionFn(_mediaEvent.MEDIA_MUTE, muted);
    }

    _pro.stop = function(){
        this._videoNode.pause();

        // 删除节点
        this._removeSourceNode();
        this._clearSourceEvent();

        // 清除一些检测
        this._clearCheckCurrentTime();

        // 空闲状态
        this._setState(_constant.MEDIA_STATE.IDLE);
    }

    _pro.state = function(){
        return this._state;
    }

    _pro.getPosition = function(){
        return this._position;
    }

    _pro.isCompleted = function(){
        return this._videoNode.ended;
    }

    _pro.rate = function(value){
        value = value || 1;

        if(this._state == _constant.MEDIA_STATE.IDLE){
            this._videoNode.defaultPlaybackRate = value;
        }else{
            this._videoNode.playbackRate = value;
        }

        this._rate = value;

        // 倍速事件
        this._doOptionFn(_mediaEvent.MEDIA_RATE_CHANGE, value);
    }

    // 检测是否卡顿，与视频云逻辑保持一致
    _pro.isBlock = function(){
        this._isbLastFrameCount = this._isbLastFrameCount || 0;

        var calcFrame;

        if (this._videoNode.webkitDecodedFrameCount) {
            this._isbNowFrameCount = this._videoNode.webkitDecodedFrameCount;
            calcFrame = this._isbNowFrameCount - this._isbLastFrameCount;

            this._isbLastFrameCount = this._isbNowFrameCount;
        } else if (this._videoNode.mozDecodedFrames) {

            this._isbNowFrameCount = this._videoNode.mozDecodedFrames;
            calcFrame = this._isbNowFrameCount - this._isbLastFrameCount;

            this._isbLastFrameCount = this._isbNowFrameCount;
        }

        return calcFrame != undefined && calcFrame <= 10;
    }

    // 原帅帧率，暂时没有
    _pro.metaFPS = function(){
        return 0;
    }

    // 返回距离上次检测后播放的帧数，如果要计算帧率可以每秒调用一次
    _pro.currentFPS = function(){
        this._cfpsLastFrameCount = this._cfpsLastFrameCount || 0;

        var calcFrame = 0;

        if (this._videoNode.webkitDecodedFrameCount) {
            this._cfpsNowFrameCount = this._videoNode.webkitDecodedFrameCount;
            calcFrame = this._cfpsNowFrameCount - this._cfpsLastFrameCount;

            this._cfpsLastFrameCount = this._cfpsNowFrameCount;
        } else if (this._videoNode.mozDecodedFrames) {
            this._cfpsNowFrameCount = this._videoNode.mozDecodedFrames;
            calcFrame = this._cfpsNowFrameCount - this._cfpsLastFrameCount;

            this._cfpsLastFrameCount = this._cfpsNowFrameCount;
        }

        return calcFrame;
    } 

    // 返回下载的字节，如果要计算kbps可以每秒调用一次
    _pro.currentKbps = function(){
        this._cfpslastByteLoaded = this._cfpslastByteLoaded || 0;

        var calcByte = 0;

        if (this._videoNode.webkitVideoDecodedByteCount) {
            this._cfpsNowByteLoaded = this._videoNode.webkitVideoDecodedByteCount;
            calcByte = this._cfpsNowByteLoaded - this._cfpslastByteLoaded;

            this._cfpslastByteLoaded = this._cfpsNowByteLoaded;
        }

        return calcByte * 8 / 1000;
    }

    _pro._canSeek = function(){
        return !!this._duration && isFinite(this._duration) && !!this._hasGetMetaData;
    }

    /** 以下为事件处理 **/

    // 设置状态
    _pro._setState = function(newState){
        if(this._state != newState){
            // 发出事件
            this._doOptionFn(_mediaStateEvent.MEDIA_STATE, {
                newState : newState,
                oldState : this._state
            });

            this._state = newState;
        }
    }

    // 获得meta
    _pro._onvideoLoadedmetadata = function(e){
        if(!!this._hasGetMetaData){
            return;
        }

        var data = {
            duration : Math.floor(this._videoNode.duration)
        }

        // 当前视频时长
        this._duration = this._videoNode.duration;
        this._hasGetMetaData = true;

        this._doOptionFn(_mediaEvent.MEDIA_META, data);
    
        // 点播自动seek
        if (this._cfg.mode == 'playback') {
            if(!this._hasAutoSeek){
                this._autoSeek();
            }else{
                this.play();
            }
        };
    }

    // 播放进度
    _pro._onvideoTimeupdate = function(e){
        this._doPreloadAndBeforePlay();

        var data = {
            currentTime : Math.floor(this._videoNode.currentTime),
            duration : Math.floor(this._videoNode.duration)
        };

        this._position = data.currentTime;

        this._doOptionFn(_mediaEvent.MEDIA_TIME, data);
        
    }

    // 加载进度
    _pro._onvideoProgress = function(e){
        this._doOptionFn(_mediaEvent.MEDIA_BUFFER, {
            bufferPercent : this._getBufferedPercent()
        });
    }

    _pro._getBufferedPercent = function(){
        var buffered = this._videoNode.buffered, end = 0;
        var ba, be;

        if (!buffered || buffered.length < 1) {
            return 0;
        }else if (buffered && buffered.length == 1) {
            end = Math.floor(buffered.end(0));
        }else{
            var _p = this._videoNode.currentTime || 0;

            for(var i = 0, l = buffered.length; i < l ;i++){
                ba = Math.floor(buffered.start(i));
                be = Math.floor(buffered.end(i));

                if (_p <= be && _p >= ba) {
                    end = Math.floor(buffered.end(i));
                };
            }

            if (!end) {
                end = Math.floor(buffered.end(buffered.length - 1));
            };
        }

        return this._duration ? (end / this._duration) : 0;
    }

    // 播放
    _pro._onvideoPlaying = function(e){
        this._setState(_constant.MEDIA_STATE.PLAYING);
    }

    // 暂停
    _pro._onvideoPause = function(e){
        this._setState(_constant.MEDIA_STATE.PAUSE);
    }

    // 等待
    _pro._onvideoWaiting = function(e){
        this._setState(_constant.MEDIA_STATE.BUFFERING);
    }

    // 寻找
    _pro._onvideoSeeking = function(e){
        this._setState(_constant.MEDIA_STATE.BUFFERING);
    }

    // 寻找完毕
    _pro._onvideoSeeked = function(e){
        if(this._state == _constant.MEDIA_STATE.PAUSE){
            this.pause();
        }else{
            this.play();
        }

        // 自动seek完成
        if (!this._hasAutoSeek) {
            this._hasAutoSeek = true;
        };
    }

    // 播放完毕
    _pro._onvideoEnded = function(e){        
        this._setState(_constant.MEDIA_STATE.COMPLETE);

        this._clearCheckCurrentTime();
    }

    // video错误
    _pro._onvideoError = function(e){
        // 一般是网络错误，具体信息见

        if(this._errorCount < 3){
            this._errorCount++;
            this.reload();
            return;
        }

        this._clearCheckCurrentTime(); // 提示错误时关闭检查

        this._doOptionFn(_mediaEvent.MEDIA_ERROR, _constant.ERROR_CODE.MEDIA_ERROR_VIDEO_ERROR);
    }

    // source错误
    _pro._onsourceError = function(e){
        // 一般是网络错误，具体错误信息还不知道用哪个属性
        this._doOptionFn(_mediaEvent.MEDIA_ERROR, _constant.ERROR_CODE.MEDIA_ERROR_SOURCE_ERROR);
    }

    // 开启检查时间进度
    _pro._checkCurrentTime = function () {
        if (!this._checkCurrentTimeTimer) {
            this._checkCurrentTimeTimer = setInterval(this._checkToReload._$bind(this), 10000); // 10秒检查一次
        };
    }

    // 关闭检查时间进度
    _pro._clearCheckCurrentTime = function () {
        if (!!this._checkCurrentTimeTimer) {
            clearInterval(this._checkCurrentTimeTimer);
            this._checkCurrentTimeTimer = null;
        };

        this._lastCheckCurrentTime = undefined;
    }

    // 检查是否重新加载直播流
    _pro._checkToReload = function () {
        var ct = this._videoNode.currentTime;

        if (!ct && ct != 0) { // 拿不到时间的情况
            return;
        };

        if (this._lastCheckCurrentTime == undefined) { // 第一次
            this._lastCheckCurrentTime = ct;
            return;
        };

        // 播放状态下长时间不动需要重新加载，如果拿到当前时间为0则不处理
        if (ct == this._lastCheckCurrentTime && ct != 0 && this._state == _constant.MEDIA_STATE.PLAYING) { 
            // 暂时不算做错误
            
            if (this._cfg.mode == 'live') { // 目前只有直播会重新加载
                this.reload();  
            };
        };

        this._lastCheckCurrentTime = ct; // 保存为上一次
    }

    // 回收
    _pro.clear = function(){
        if (this._videoNode) {
            this._clearVideoEvent();
            this._clearSourceEvent();

            // 删除节点
            this._removeSourceNode();
            this._videoParentNode.removeChild(this._videoNode);

            this._videoNode = null;
        };
    }

    // 解绑事件
    _pro._clearVideoEvent = function(){
        _event._$clearEvent(this._videoNode, "loadedmetadata");
        _event._$clearEvent(this._videoNode, "ended");
        _event._$clearEvent(this._videoNode, "error");
        _event._$clearEvent(this._videoNode, "pause");
        _event._$clearEvent(this._videoNode, "play");
        _event._$clearEvent(this._videoNode, "playing");
        _event._$clearEvent(this._videoNode, "progress");
        _event._$clearEvent(this._videoNode, "seeked");
        _event._$clearEvent(this._videoNode, "seeking");
        _event._$clearEvent(this._videoNode, "timeupdate");
        _event._$clearEvent(this._videoNode, "waiting");
    }

    _pro._clearSourceEvent = function(){
        if (this._sourceNodes) {
            _util._$forEach(this._sourceNodes, function(_item, _index){
                _event._$clearEvent(_item, 'error');
            }._$bind(this));
        };
    }

    return Html5VideoMedia;
});
