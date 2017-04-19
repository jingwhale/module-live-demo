/**
 * LivePcPlayer 组件实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 * @module   pool/module-live/src/component/live-pc-player/component
 */
NEJ.define([
    'lib/base/util',
    'lib/base/element',
    'lib/base/platform',
    'lib/util/event',
    'lib/util/flash/flash',
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'pool/component-video-player/src/video-player_ui',
    'pool/component-clock/src/clock/ui',
    'pool/component-notify/src/notify/ui',
    'pool/component-modal/src/modal/ui',
    '../../constant.js',
    'pool/edu-front-util/src/timeUtil',
    'pool/edu-front-util/src/flashUtil'
],function(
    BaseUtil,
    Element,
    Platform,
    Event,
    Flash,
    Base,
    util,
    VideoPlayer,
    Clock,
    Notify,
    Modal,
    LiveConstant,
    TimeUtil,
    FlashUtil
){ 
    /**
     * LivePcPlayer组件
     *
     * @class   module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer
     * @extends module:pool/component-base/src/base.Base
     *
     * @param {Object}  options                                                         - 组件构造参数
     * @param {Object}  options.data                                                    - 与视图关联的数据模型，主要是播放器的配置
     */
    var LivePcPlayer = Base.$extends({
        name     : 'ux-live-pc-player',

        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#config
         * @returns {Void}
         */
        config: function () {
            util.extend(this, {
                liveConstant : LiveConstant,
                clockUIs : {}
            });

            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {
                notSupportFlash : false,
                liveMethodType : null,
                liveContentId : '',
                meetId : '', 
                cdnMode : LiveConstant.LIVE_CDN_MODE,  // cdn模式
                liveCover : '', // 直播封面
                liveTitle : '', // 直播标题
                liveStartTime : 0, // 直播开始时间
                accurateStartTime : 0, // 实际开始时间
                liveEndTime : 0, // 直播结束时间
                accurateFinishedTime : 0, // 最晚结束时间
                liveStatus : null,  // 直播状态
                imChatRoomUrl : '',  // im iframe地址
                liveStreamUrl : '',  // rtmp流地址
                swfLivePlayerLocation : '', // flash直播播放器swf地址 
                playBackVideoData : null,  // 回放视频数据
                showLiveInIdleFlag : false, // 显示主播没来
                showLiveStreamErrorFlag : false // 显示流异常
            });

            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#init
         * @returns {Void}
         */
        init: function () {
            this.supr();

            // 判断是否支持flash
            if (!FlashUtil._$checkFlash()) {
                this.data.notSupportFlash = true;
                this.$update();
                return;
            };

            this._getLiveInfo();
        },

        /**
         * 获取直播间信息
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_getLiveInfo
         * @returns {Void}
         */
        _getLiveInfo : function(notfirst){
            // 发出消息
            if (notfirst) {
                this.$emit('updateLiveInfo');
            }else{
                setTimeout(function(){
                    this.$emit('updateLiveInfo');
                }._$bind(this), 0);
            }
            
        },

        /**
         * 更新直播间信息
         *
         * @public
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#updateLiveInfo
         * @param {Object} data 直播间数据
         * @returns {Void}
         */
        updateLiveInfo : function(data){
            if (!data) {
                // 直播可能被删除
                // 销毁
                this._destroyLivePlayer();
                this._destroyPlayBackPlayer();
                this._clearClock();
                return;
            };

            this.data.liveTitle = data.name;
            this.data.liveStatus = data.liveStatus;
            this.data.liveStartTime = data.liveStartTime;
            this.data.accurateStartTime = data.accurateStartTime; // 实际开始时间
            this.data.liveEndTime = data.liveFinishedTime;
            this.data.accurateFinishedTime = data.accurateFinishedTime; // 最晚结束时间
            this.data.liveCover = data.liveCoverUrl;
            this.data.liveMethodType = data.liveMethodType;

            this.$update();

            // 根据直播状态设置直播状态检查心跳
            this._setCheckStatusHeartbeat(data.liveStatus);

            this._checkLiveStatus();
        },

        /**
         * 根据直播状态设置直播状态检查心跳
         *
         * @private
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_setCheckStatusHeartbeat
         * @returns {Void}
         */
        _setCheckStatusHeartbeat : function(liveStatus){
            if (!this.__checkLiveStatusId) { 
                var du = 10;

                if (liveStatus == LiveConstant.LIVE_STATUS_NOTSTART) {
                    du = 30;
                };

                this.__checkLiveStatusId = setInterval(this._getLiveInfo._$bind(this, true), du * 1000);
            };
        },

        /**
         * 清除直播状态检查心跳
         *
         * @private
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_clearStatusHeartbeat
         * @returns {Void}
         */
        _clearStatusHeartbeat : function(){
            if (this.__checkLiveStatusId) { 
                clearInterval(this.__checkLiveStatusId);
                this.__checkLiveStatusId = null;
            };
        },

        /**
         * 根据直播状态设置直播状态检查心跳
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_checkLiveStatus
         * @returns {Void}
         */
        _checkLiveStatus : function(){
            if (this.data.liveStatus == LiveConstant.LIVE_STATUS_NOTSTART) {
                // 直播未开始时不设置心跳检查，到开始前30分钟时才开始检查
                var _leftDur = this.data.liveStartTime - TimeUtil._$getCurServerTime() - 30 * 60 * 1000;

                // 设置倒计时
                this._setClock('notstart', _leftDur / 1000);
                
            }else if (this.data.liveStatus == LiveConstant.LIVE_STATUS_COMING) {
                // 并设置倒计时
                this._setClock('coming', (this.data.liveStartTime - TimeUtil._$getCurServerTime())/ 1000);

            }else if(this.data.liveStatus == LiveConstant.LIVE_STATUS_DELAY_START){
                
            }else if (this.data.liveStatus == LiveConstant.LIVE_STATUS_PLAYING) {
                this._genLivePlayer();

                // 检查时间进度
                if (!this.__checkLiveProgressId) {
                    this.__checkLiveProgressId = setInterval(this._checkLiveProgress._$bind(this, true), 1 * 1000);
                };

                // 同时设置倒计时
                this._setClock('playing', (this.data.liveEndTime - TimeUtil._$getCurServerTime())/ 1000);

            }else if (this.data.liveStatus == LiveConstant.LIVE_STATUS_INVALID) {
                // 直播失效
                this._clearStatusHeartbeat();

            }else if (this.data.liveStatus == LiveConstant.LIVE_STATUS_END) {
                // 直播提前结束由前端判断并提示
                this._destroyLivePlayer();

                this._clearStatusHeartbeat();

                // 清除进度检查
                if (this.__checkLiveProgressId) { 
                    clearTimeout(this.__checkLiveProgressId);
                    this.__checkLiveProgressId = null;
                };
                
            }else if (this.data.liveStatus == LiveConstant.LIVE_STATUS_TRANSFORM_COMPLETE){
                // 创建回放播放器
                this._genPlayBackPlayer();
            
                this._clearStatusHeartbeat();
            }
        },

        /**
         * 设置倒计时功能
         *
         * @private
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_setClock
         * @param {Number} dur     - 倒计时秒数
         * @returns {Void}
         */
        _setClock : function(name, dur, node){
            if (!!this.clockUIs[name]) {
                return;
            };

            if (dur < 0) {
                dur = 0;
            };

            var _clockUI = new Clock({
                data : {
                    'class' : 'f-ib'
                }
            })

            this.clockUIs[name] = _clockUI;

            if (node) {
                _clockUI.$inject(node);
            };

            _clockUI.$on('finish', function(){
                // 倒计时结束强制更新直播间状态
                this._clearStatusHeartbeat();

                this._getLiveInfo();
            }._$bind(this));

            _clockUI.setTime(parseInt(dur));
            _clockUI.start();

        },

        /**
         * 销毁倒计时功能
         *
         * @private
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_clearClock
         * @returns {Void}
         */
        _clearClock : function(){
            BaseUtil._$forEach(this.clockUIs, function(item, index){
                item && item.destroy();
            });
        },

        /**
         * 获取直播进度
         *
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_checkLiveProgress
         * @returns {String}
         */
        _checkLiveProgress : function(){
            // obs推流没有结束的限制
            if(LiveConstant.LIVE_METHOD_TYPE_OBS == this.data.liveMethodType){
                return;
            }

            // 如果结束时间到时直播还未结束则超过一定时间后需要提示（一小时缺15秒的时候提示）
            if (this.data.accurateFinishedTime - TimeUtil._$getCurServerTime() <= (15 * 1000)) {
                if (!this._hasSetTimeoutNotif) {
                    this._hasSetTimeoutNotif = true;
                    Notify.warning('超时过久，直播将自动结束', 15 * 1000);
                };
            };
        },


        /**
         * 加载直播播放器
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_genPlayer
         * @returns {Void}
         */
        _genLivePlayer : function(){
            if (!this._hasGenLivePlayer) {
                if (this.data.cdnMode != LiveConstant.LIVE_CDN_MODE) {
                    this._hasGenLivePlayer = true;

                    Flash._$flash({
                        src : this.data.swfLivePlayerLocation,
                        width : '100%',
                        height : '100%',
                        parent : this.$refs.livePlayerNode,
                        params : {
                            'wmode' : 'transparent',
                            'allowscriptaccess' : 'always',
                            'allowFullScreen' : 'true',
                            'flashvars' : '' // 由后端拼接在地址里面
                        },
                        onready:function(_flashObj){
                            
                        }._$bind(this)
                    });
                }else{
                    if(!this.data.liveStreamUrl){
                        this.$emit('getStraamUrl');
                    }else{
                        this._genVideoPlayer();
                    }
                }   
            }
        },

        /**
         * 生成CDN直播播放器
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_genVideoPlayer
         * @returns {Void}
         */
        _genVideoPlayer : function(){
            this._hasGenLivePlayer = true;
            
            this._livePlayerUI = new VideoPlayer({
                data:{
                    mode : 'live',
                    useH5 : false,
                    autoStart : true,
                    showCdnSwitch : false,
                    videoData : {
                        liveTitle : this.data.liveTitle,
                        liveStartTime : this.data.liveStartTime,
                        liveEndTime : this.data.liveEndTime,
                        flvSdUrl : this.data.liveStreamUrl 
                    }
                }
            }).$inject(this.$refs.livePlayerNode);

            // 监听断流事件
            this._livePlayerUI.$on('onLiveStreamClosed', this._onLiveStreamClosed._$bind(this));
        },

        /**
         * 获取到拉流地址，生成CDN直播播放器
         *
         * @public
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#onGetStramUrl
         * @returns {Void}
         */
        onGetStramUrl : function(data){
            if(!data){return;}

            this.data.liveStreamUrl = data.liveStreamUrl;
            this._genVideoPlayer();
        },

        /**
         * 断流后的处理
         *
         * @private
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_onLiveStreamClosed
         * @returns {Void}
         */
        _onLiveStreamClosed : function(){
            this.$emit('checkStreamStatus');
        },

        /**
         * 根据流状态显示不同的界面：显示主播没来
         *
         * @public
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#showLiveStreamStatus
         * @param {Number} stauts  - 频道流状态，见cache-live中的常量
         * @returns {Void}
         */
        showLiveInIdle : function(){
            this.data.showLiveInIdleFlag = true;
            this.$update();
        },

        /**
         * 根据流状态显示不同的界面：显示流异常，重新加载按钮
         *
         * @public
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#showLiveStreamStatus
         * @param {Number} stauts  - 频道流状态，见cache-live中的常量
         * @returns {Void}
         */
        showLiveStreamError : function(){
            this.data.showLiveStreamErrorFlag = true;
            this.$update();
        },

        /**
         * 流重连，如果流正常则无效果
         *
         * @public
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#checkReload
         * @returns {Void}
         */
        checkReload : function(){
            if (this._livePlayerUI) { 
                this.data.showLiveStreamErrorFlag = false;
                this.$update();

                try{
                    this._livePlayerUI.checkLiveReload(); // 直播状态为播放中时检查流的状态
                }catch(e){

                }
            };
        },

        /**
         * 销毁直播播放器
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_destroyLivePlayer
         * @returns {Void}
         */
        _destroyLivePlayer : function(){
            if (this._livePlayerUI) {
                this._livePlayerUI.stop();
                this._livePlayerUI.destroy();
                this._livePlayerUI = null;
            };

            if(!!this.$refs.livePlayerNode){
                var _list = Element._$getChildren(this.$refs.livePlayerNode);
                if(!!_list){
                    for(var i = 0; i < _list.length; i++){
                        this.$refs.livePlayerNode.removeChild(_list[i]);
                    }
                }
            }
        },

        /**
         * 加载回放播放器
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_genPlayBackPlayer
         * @returns {Void}
         */
        _genPlayBackPlayer : function(){
            if (!this._playBackPlayerUI) {
                this._playBackPlayerUI = new VideoPlayer({
                    data:{
                        videoData : this.data.playBackVideoData
                    }   
                }).$inject(this.$refs.playBackPlayerNode);

                this._playBackPlayerUI.$on('onPlay', function(data){
                    this.$emit('PlayBackPlay', data);
                }._$bind(this));

                this._playBackPlayerUI.$on('onPauseClick', function(data){
                    this.$emit('PlayBackPauseClick', data);
                }._$bind(this));

                this._playBackPlayerUI.$on('onSeek', function(data){
                    this.$emit('PlayBackSeek', data);
                }._$bind(this));

                this._playBackPlayerUI.$on('onPlayEnd', function(data){
                    this.$emit('PlayBackEnd', data);
                }._$bind(this));

            };
        },

        /**
         * 获取回放播放器的状态
         *
         * @public
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#getPlayBackStateInfo
         * @returns {Void}
         */
        getPlayBackStateInfo : function(callback){
            this._playBackPlayerUI && this._playBackPlayerUI.getStateInfo(callback);
        },

        /**
         * 销毁回放播放器
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#_destroyPlayBackPlayer
         * @returns {Void}
         */
        _destroyPlayBackPlayer : function(){
            if (this._playBackPlayerUI) {
                this._playBackPlayerUI.stop();
                this._playBackPlayerUI.destroy();
                this._playBackPlayerUI = null;
            };

            if(!!this.$refs.playBackPlayerNode){
                var _list = Element._$getChildren(this.$refs.playBackPlayerNode);
                if(!!_list){
                    for(var i = 0; i < _list.length; i++){
                        this.$refs.playBackPlayerNode.removeChild(_list[i]);
                    }
                }
            }
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-pc-player/component.LivePcPlayer#destroy
         * @returns {Void}
         */
        destroy: function () {
            this._destroyLivePlayer();
            this._destroyPlayBackPlayer();
            this._clearClock();
            this._clearStatusHeartbeat();

            this.supr();
        }

    }).filter({
        
    });

    return LivePcPlayer;
});
