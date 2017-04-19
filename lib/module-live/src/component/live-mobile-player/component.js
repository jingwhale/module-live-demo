/**
 * LiveMobilePlayer 组件实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 * @module   pool/module-live/src/component/live-mobile-player/component
 */
NEJ.define([
    'lib/base/util',
    'pool/cache-base/src/setting',
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'pool/component-video-player/src/video-player_ui',
    'pool/component-notify/src/notify_mobile/ui',
    'pool/component-clock/src/clock/ui',
    '../../constant.js',
    'eutil/timeUtil'
],function(
    BaseUtil,
    Setting,
    Base,
    util,
    VideoPlayer,
    Notify,
    Clock,
    LiveConstant,
    TimeUtil
){
    // 获取模块配置
    var _liveMobileSetting = Setting.get('live-mobile');

    /**
     * LiveMobilePlayer组件
     *
     * @class   module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer
     * @extends module:pool/component-base/src/base.Base
     *
     * @param {Object}  options                                                         - 组件构造参数
     * @param {Object}  options.data                                                    - 与视图关联的数据模型，主要是播放器的配置
     */
    var LiveMobilePlayer = Base.$extends({
        name     : 'ux-live-mobile-player',

        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#config
         * @returns {Void}
         */
        config: function () {
            util.extend(this, {
                liveConstant : LiveConstant,
                clockUIs : {}
            });

            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {
                // deleted : false,
                liveContentId : '',
                liveMethodType : null,
                meetId : '',
                liveStreamUrl : '', // 直播流地址
                liveCover : '', // 直播封面, 测试
                liveTitle : '', // 直播标题
                liveStartTime : 0, // 直播开始时间
                accurateStartTime : 0, // 实际开始时间
                liveEndTime : 0, // 直播介绍时间
                accurateFinishedTime : 0, // 最晚结束时间
                liveStatus : null,  // 直播状态
                liveProgress : '0' // 直播进度百分比
            });

            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#init
         * @returns {Void}
         */
        init: function () {
            this.supr();

            this._getLiveInfo();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#destroy
         * @returns {Void}
         */
        destroy: function () {
            this._destroyPlayer();
            this._clearClock();
            this._clearStatusHeartbeat();
            
            this.supr();
        },

        /**
         * 获取直播间信息
         *
         * @private
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#_getLiveInfo
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
         * 获取直播间信息回调
         *
         * @private
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#_cbGetLiveInfo
         * @param {Object} data     - 直播间数据
         * @returns {Void}
         */
        updateLiveInfo : function(data){
            if (!data) {
                // 直播可能被删除
                this._destroyPlayer();
                this._clearClock();
                return;
            };

            // 销毁
            this.data.liveTitle = data.name;
            this.data.liveStatus = data.liveStatus;
            this.data.liveStartTime = data.liveStartTime;
            this.data.accurateStartTime = data.accurateStartTime; // 实际开始时间
            this.data.liveEndTime = data.liveFinishedTime;
            this.data.accurateFinishedTime = data.accurateFinishedTime; // 最晚结束时间
            this.data.liveCover = data.liveCoverUrl;
            this.data.liveMethodType = data.liveMethodType;

            this.$update();

            // 设置直播状态检查心跳
            this._setCheckStatusHeartbeat(data.liveStatus);

            this._checkLiveStatus();
        },

        /**
         * 根据直播状态设置直播状态检查心跳
         *
         * @private
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#_setCheckStatusHeartbeat
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
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#_clearStatusHeartbeat
         * @returns {Void}
         */
        _clearStatusHeartbeat : function(){
            if (this.__checkLiveStatusId) { 
                clearInterval(this.__checkLiveStatusId);
                this.__checkLiveStatusId = null;
            };
        },

        /**
         * 直播状态检查
         *
         * @private
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#_checkLiveStatus
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
                this._setClock('coming', (this.data.liveStartTime - TimeUtil._$getCurServerTime())/ 1000, this.$refs.clockNode);

            }else if(this.data.liveStatus == LiveConstant.LIVE_STATUS_DELAY_START){
                
            }else if (this.data.liveStatus == LiveConstant.LIVE_STATUS_PLAYING) {
                this._genPlayer();

                // 直播过程中保持时间进度检查
                if (!this.__checkLiveProgressId) {
                    this.__checkLiveProgressId = setInterval(this._checkLiveProgress._$bind(this, true), 1 * 1000);
                };

                // 同时设置倒计时（设置正常结束时间的范围）
                this._setClock('playing', (this.data.liveEndTime - TimeUtil._$getCurServerTime())/ 1000);

            }else if (this.data.liveStatus == LiveConstant.LIVE_STATUS_INVALID) {
                // 直播失效
                this._clearStatusHeartbeat();

            }else if (this.data.liveStatus == LiveConstant.LIVE_STATUS_END) {
                // 直播提前结束由前端判断并提示
                this._destroyPlayer();

                this._clearStatusHeartbeat();

                // 清除进度检查
                if (this.__checkLiveProgressId) { 
                    clearInterval(this.__checkLiveProgressId);
                    this.__checkLiveProgressId = null;
                };

                this.data.liveProgress = '100%';
                this.$update();

            }else if (this.data.liveStatus == LiveConstant.LIVE_STATUS_TRANSFORM_COMPLETE){
                // 移动端不处理 
                this._clearStatusHeartbeat();
            }

        },

        /**
         * 设置倒计时功能
         *
         * @private
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#_setClock
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
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#_clearClock
         * @returns {Void}
         */
        _clearClock : function(){
            BaseUtil._$forEach(this.clockUIs, function(item, index){
                item && item.destroy();
            });
        },

        /**
         * 生成直播播放器，如果没有拉流地址则抛出消息调用接口
         *
         * @private
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#_genPlayer
         * @returns {Void}
         */
        _genPlayer : function(){
            if (this._playerUI) {
                return;
            };

            if(!this.data.liveStreamUrl){
                this.$emit('getStraamUrl');
            }else{
                this._genVideoPlayer();
            }            
        },

        /**
         * 生成具体的播放器
         *
         * @private
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#_genVideoPlayer
         * @returns {Void}
         */
        _genVideoPlayer : function(){
            this._playerUI = new VideoPlayer({
                data:{
                    mode : 'live',
                    useNative : _liveMobileSetting.useNative,
                    videoData : {
                        liveTitle : this.data.liveTitle,
                        liveStartTime : this.data.liveStartTime,
                        liveEndTime : this.data.liveEndTime,
                        mp4SdUrl : this.data.liveStreamUrl 
                    }
                }
            }).$inject(this.$refs.livePlayerNode);
        },

        /**
         * 获取到拉流地址，生成CDN直播播放器
         *
         * @public
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#onGetStramUrl
         * @returns {Void}
         */
        onGetStramUrl : function(data){
            if(!data){return;}
            this.data.liveStreamUrl = data.liveStreamUrl;
            this._genVideoPlayer();
        },

        /**
         * 模块隐藏或者直播结束后销毁播放器
         *
         * @private
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#_destroyPlayer
         * @returns {Void}
         */
        _destroyPlayer : function(){
            if (this._playerUI) {
                this._playerUI.stop();
                this._playerUI.destroy();
                this._playerUI = null;
            };
            
        },

        /**
         * 获取直播进度
         *
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#_checkLiveProgress
         * @returns {String}
         */
        _checkLiveProgress : function(){

            // 如果结束时间到时直播还未结束则超过一定时间后需要提示（一小时缺15秒的时候提示）
            if (this.data.accurateFinishedTime - TimeUtil._$getCurServerTime() <= (15 * 1000)) {
                if (!this._hasSetTimeoutNotif && LiveConstant.LIVE_METHOD_TYPE_OBS != this.data.liveMethodType) {
                    this._hasSetTimeoutNotif = true;
                    Notify.warning('超时过久，直播将自动结束', 15 * 1000);
                };
            };

            // 结束总体进度
            if (this.data.liveStatus != LiveConstant.LIVE_STATUS_PLAYING ||
                (!this.data.accurateStartTime || !this.data.liveEndTime)) {
                this.data.liveProgress = '0';
            }

            var per = parseInt((TimeUtil._$getCurServerTime()- this.data.accurateStartTime) / (this.data.liveEndTime - this.data.liveStartTime) * 100);
            this.data.liveProgress = (per > 100 ? 100 : per)  + '%';
        },

        // 点击直播提醒，暂时不做
        // onclickBindPhone : function(){

        // },

        /**
         * 格式化直播时间
         *
         * @method  module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer#formatLiveTime
         * @returns {String}
         */
        formatLiveTime : function(_startTime, _endTime){
            if (new Date(Number(_startTime)).getFullYear() != new Date().getFullYear()) { 
                return TimeUtil._$formatTime(_startTime, 'yyyy年MM月dd日 HH:mm') + ' - ' + TimeUtil._$formatTime(_endTime, 'HH:mm');                
            }

            return TimeUtil._$formatTime(_startTime, 'MM月dd日 HH:mm') + ' - ' + TimeUtil._$formatTime(_endTime, 'HH:mm');
        }

    }).filter({
        // 封面模糊效果
        blurPic : function(src){
            if (!src) {
                return '';
            };

            src = (src.split('?') || [])[0];

            return src + '?imageView&blur=20x8';
        }
    });

    return LiveMobilePlayer;
});
