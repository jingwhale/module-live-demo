/**
 * VideoPlayer 组件实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 * @module   pool/component-video-player/src/video-player_ui
 */
NEJ.define([
    'text!./video-player.html',
    'css!./video-player.css',
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'lib/util/cache/cookie',
    './flashVideoPlayer.js',
    './html5VideoPlayer.js',
    './log.js',
    './h5VideoPlayer/util/util.js'
],function(
    html,
    css,
    Base,
    util,
    Cookie,
    FlashVideoPlayer,
    Html5VideoPlayer,
    Log,
    H5util
){ 
    /**
     * VideoPlayer组件
     *
     * @class   module:pool/component-video-player/src/video-player.VideoPlayer_ui
     * @extends module:pool/component-base/src/base.Base
     *
     * @param {Object}  options                                                         - 组件构造参数
     * @param {Object}  options.data                                                    - 与视图关联的数据模型，主要是播放器的配置
     * @param {String}  [options.data.host="http://study.163.com"]                      - 主域名
     * @param {Boolean} [options.data.useH5=true]                                                    - 使用html5播放器。如果浏览器不支持video，或者是加密视频，则使用flash
     * @param {Boolean} [options.data.isLocal=false]                                    - 是否是本地调试
     * @param {Boolean} [options.data.mode="playback"]                                  - 点播或者直播模式：'playback' live'
     * @param {Boolean} [options.data.preload=false]                                    - 是否开启预加载
     * @param {Boolean} [options.data.showPauseAd=false]                                - 是否开启暂停广告功能
     * @param {Boolean} [options.data.innerSite=true]                                   - 是否是站内
     * @param {Boolean} [options.data.autoStart=false]                                  - 是否自动播放 true表示自动播放
     * @param {Number}  [options.data.volume=0.8]                                       - 初始化视频播放器音量，如果没传则从cookie中读取，没有则使用默认值0.8(范围0-1)
     * @param {Boolean} [options.data.mute=false]                                       - 是否静音
     * @param {Boolean} [options.data.showCdnSwitch=true]                               - 是否开启cdn线路功能
     * @param {Boolean} [options.data.notAllowFullScreen=false]                         - 禁止全屏
     * @param {String}  [options.data.videoPlayerSwfRemoteUrl=window.swfUrlMap.CloudPlayer]          - 静态服务器上播放器swf文件地址
     * @param {String}  [options.data.videoPlayerSwfLocalPath="../res/swf/CloudPlayer.swf"]          - 本地上播放器swf文件地址
     * @param {String}  [options.data.videoPlayerUISwfRemotePath=window.swfUrlMap.cloudPlayerUI]     - 静态服务器上播放器UI swf文件地址
     * @param {String}  [options.data.videoPlayerUISwfLocalPath="../res/swf/ui/cloudPlayerUI.swf"]   - 本地上播放器UI swf文件地址
     * 
     * @param {Object}              options.data.videoData                                  - 视频数据
     * @param {Number}              [options.data.videoData.defaultQuality=1]               - 视屏播放默认清晰度，取值：1，2，3，对应标清、高清、超高清，默认从cookie取
     * @param {String}              options.data.videoData.flvSdUrl                         - flash用视频地址
     * @param {String}              [options.data.videoData.flvHdUrl]                       - flash用视频地址
     * @param {String}              [options.data.videoData.flvShdUrl]                      - flash用视频地址
     * @param {String}              options.data.videoData.mp4SdUrl                         - h5用视频地址
     * @param {String}              [options.data.videoData.mp4HdUrl]                       - h5用视频地址
     * @param {String}              [options.data.videoData.mp4ShdUrl]                      - h5用视频地址
     * @param {String}              [options.data.videoData.key]                            - cdn加密后的key,如果needKeyTimeValidate为true
     * @param {Boolean}             [options.data.videoData.needKeyTimeValidate]            - 是否进行时间戳校验，true表示前端需要定期发校验请求
     * @param {Number}              [options.data.videoData.playerCollection]               - 前端暂时没有用这个字段。0值表示两者都不可播放，1表示仅支持flv，2表示仅支持mp4，3表示mp4和flv都支持
     * @param {Boolean}             [options.data.videoData.isEncrypt=flase]                - 是否加密
     * @param {Number}              [options.data.videoData.clientEncryptKeyVersion]        - 客户端加解密的key的版本1,2,3
     * @param {String}              [options.data.videoData.encryptionVideoData]            - 视频加密秘钥
     * @param {Array.<Object>}      [options.data.videoData.mp4Caption]                     - h5 pc端字幕，srt格式
     * @param {String}              [options.data.videoData.mp4Caption.name]                - 字幕中文名称
     * @param {String}              [options.data.videoData.mp4Caption.url]                 - 字幕文件地址
     * @param {Array.<Object>}      [options.data.videoData.flvCaption]                     - flash字幕，srt格式
     * @param {String}              [options.data.videoData.flvCaption.name]                - 字幕中文名称
     * @param {String}              [options.data.videoData.flvCaption.url]                 - 字幕文件地址
     * @param {Array.<Object>}      [options.data.videoData.mobileCaption]                  - 移动端字幕，vtt格式
     * @param {String}              [options.data.videoData.mobileCaption.name]             - 字幕中文名称
     * @param {String}              [options.data.videoData.mobileCaption.url]              - 字幕文件地址
     * @param {String}              [options.data.videoData.videoImgUrl]                    - 视频封面地址
     * @param {String}              [options.data.videoData.videoId]                        - 视频id
     * @param {Number}              [options.data.videoData.duration]                       - 视频时长
     * @param {Number}              [options.data.videoData.start=0]                        - 从哪里开始播放(以秒为单位)
     * @param {Array.<Object>}      [options.data.videoData.cluPointData]                   - 驻点数据。可能需要外部通过接口获取并传入
     * @param {Number}              [options.data.videoData.cluPointData.time]              - 驻点时间
     */
    
    /**
     * 开始加载事件，事件参数未统一，暂时不要使用
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onStartLoad
     * @param {Object} event        - 视频数据
     */
    
    /**
     * 播放结束事件
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onPlayEnd
     */
    
    /**
     * 驻点触发事件
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onAnchorPoint
     * @param {Object} event
     * @param {Number} event.time   - 驻点时间
     */
    
    /**
     * 声音改变事件
     *
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onChangeVolume
     * @param {Object} event
     * @param {Number} event.volume   - 音量值，0~1
     */

    /**
     * 静音事件
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onMute
     * @param {Object}  event
     * @param {Boolean} event.mute   - 是否静音
     */

    /**
     * 拖动seek事件
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onSeek
     * @param {Object} event
     * @param {Number} event.oldData    - seek前时刻，单位秒
     * @param {Number} event.newData    - seek后时刻，单位秒
     * 
     */

    /**
     * 清晰度改变事件
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onSelectResolution
     * @param {Object} event
     * @param {Object} event.oldData        
     * @param {String} event.oldData.name       - 旧清晰度名称
     * @param {Number} event.oldData.quality    - 旧清晰度
     * @param {Object} event.newData
     * @param {String} event.newData.name       - 新清晰度名称
     * @param {Number} eventnewData.quailty     - 新清晰度
     */

    /**
     * 字幕选择改变事件
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onSelectCaption
     * @param {Object} event
     * @param {Array}  event.oldData    - 旧的字幕数组，例如：['英文']
     * @param {Array}  event.newData    - 新选择的字幕数组，例如：['中文', '英文']
     */

    /**
     * 线路改变事件
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onChangeCDN
     * @param {Object} event
     * @param {Object} event.oldData
     * @param {String} event.oldData.isp        - 旧线路英文名称
     * @param {String} event.oldData.ispName    - 旧线路中文名称
     * @param {Object} event.newData
     * @param {String} event.newData.isp        - 新线路英文名称
     * @param {String} event.newData.ispName    - 新线路中文名称
     */

    /**
     * 播放事件
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onPlay
     */

    /**
     * 暂停事件
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onPause
     */

    /**
     * 点击播放事件
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onPlayClick
     */

    /**
     * 点击暂停事件
     * @event module:pool/component-video-player/src/video-player.VideoPlayer_ui#onPauseClick
     * @param {Object} event
     * @param {Number} event.position   - 暂停的时刻
     */
    
    var VideoPlayer = Base.$extends({
        name     : 'ux-video-player',
        
        css      : css,
        
        template : html,

        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-video-player/src/video-player.VideoPlayer_ui#config
         * @returns {Void}
         */
        config: function () {
            var _defaultConfig = {
                /**
                 * 主域名
                 * @member {String} module:pool/component-video-player/src/video-player.VideoPlayer_ui#host
                 */
                host : (location.protocol + '//' + location.host),     
                /**
                 * 是否强制使用html5
                 * @member {Boolean} module:pool/component-video-player/src/video-player.VideoPlayer_ui#useH5
                 */
                useH5 : true,    
                /**
                 * 如果使用h5播放，是否强制使用原生video标签
                 * @member {Boolean} module:pool/component-video-player/src/video-player.VideoPlayer_ui#useNative
                 */
                useNative : false,                        
                /**
                 * 是否是本地调试
                 * @member {Boolean} module:pool/component-video-player/src/video-player.VideoPlayer_ui#isLocal
                 */
                isLocal : false,       
                /**
                 * 点播还是直播
                 * @member {String} module:pool/component-video-player/src/video-player.VideoPlayer_ui#mode
                 */
                mode : 'playback',                     
                /**
                 * 是否开启预加载
                 * @member {Boolean} module:pool/component-video-player/src/video-player.VideoPlayer_ui#preload
                 */
                preload : true,                               
                /**
                 * 是否开启暂停广告功能
                 * @member {Boolean} module:pool/component-video-player/src/video-player.VideoPlayer_ui#showPauseAd
                 */
                showPauseAd : false,                           
                /**
                 * 是否是站内
                 * @member {Boolean} module:pool/component-video-player/src/video-player.VideoPlayer_ui#innerSite
                 */
                innerSite : true,                             
                /**
                 * 是否自动播放 true表示自动播放
                 * @member {Boolean} module:pool/component-video-player/src/video-player.VideoPlayer_ui#autoStart
                 */
                autoStart : false,                 
                /**
                 * 初始化视频播放器音量，如果没传则从cookie中读取，没有则使用默认值0.8(范围0-1)
                 * @member {Number} module:pool/component-video-player/src/video-player.VideoPlayer_ui#volume
                 */
                volume : 0.8,                               
                /**
                 * 是否静音
                 * @member {Boolean} module:pool/component-video-player/src/video-player.VideoPlayer_ui#mute
                 */
                mute : false,                                                     
                /**
                 * 是否开启cdn线路功能
                 * @member {Boolean} module:pool/component-video-player/src/video-player.VideoPlayer_ui#showCdnSwitch
                 */
                showCdnSwitch : true,                          
                /**
                 * 禁止全屏
                 * @member {Boolean} module:pool/component-video-player/src/video-player.VideoPlayer_ui#notAllowFullScreen
                 */
                notAllowFullScreen : false,     
                /**
                 * 静态服务器上播放器swf文件地址
                 * @member {String} module:pool/component-video-player/src/video-player.VideoPlayer_ui#videoPlayerSwfRemoteUrl
                 */
                videoPlayerSwfRemoteUrl : (window.swfUrlMap || {}).CloudPlayer,
                /**
                 * 本地上播放器swf文件地址
                 * @member {String} module:pool/component-video-player/src/video-player.VideoPlayer_ui#videoPlayerSwfLocalPath
                 */
                videoPlayerSwfLocalPath : '../res/component-video-player/swf/eduPlayer.swf',
                /**
                 * 静态服务器上播放器UI swf文件地址
                 * @member {String} module:pool/component-video-player/src/video-player.VideoPlayer_ui#videoPlayerUISwfRemotePath
                 */
                videoPlayerUISwfRemotePath : (window.swfUrlMap || {}).cloudPlayerUI,
                /**
                 * 本地上播放器UI swf文件地址
                 * @member {String} module:pool/component-video-player/src/video-player.VideoPlayer_ui#videoPlayerUISwfLocalPath
                 */
                videoPlayerUISwfLocalPath : '../res/component-video-player/swf/ui/cloudPlayerUI.swf',

                /**
                 * 视频数据
                 * @member {Object} module:pool/component-video-player/src/video-player.VideoPlayer_ui#videoData
                 */
                videoData : null
            };

            // 本地配置覆盖默认配置
            _defaultConfig = this._mergeLocalConfig(_defaultConfig);       

            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, _defaultConfig);

            this.supr();
        },

        /**
         * 合并本地配置
         *
         * @private
         * @method  module:pool/component-video-player/src/video-player.VideoPlayer_ui#_mergeLocalConfig
         * @returns {Void}
         */
        _mergeLocalConfig : function(_defaultConfig){
            var _lc = this._readLocalConfig();

            if (_lc.volume !== undefined) {
                _defaultConfig.volume = _lc.volume;
            };

            if (_lc.mute !== undefined) {
                _defaultConfig.mute = _lc.mute;
            };

            if (_lc.cdnSwitch !== undefined) {
                _defaultConfig.cdnSwitch = _lc.cdnSwitch;
            };

            if (_lc.defaultQuality !== undefined) {
                _defaultConfig.defaultQuality = _lc.defaultQuality;
            };

            if (_lc.rate !== undefined) {
                _defaultConfig.rate = _lc.rate;
            };

            return _defaultConfig;
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-video-player/src/video-player.VideoPlayer_ui#init
         * @returns {Void}
         */
        init: function () {
            this.supr();

            this._genPlayer();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-video-player/src/video-player.VideoPlayer_ui#destroy
         * @returns {Void}
         */
        destroy: function () {
            this.__playerUI && this.__playerUI._$recycle();

            this._log && this._log._$recycle();

            this.supr();
        },

        /**
         * 读取本地配置
         *
         * @private
         * @method  module:pool/component-video-player/src/video-player.VideoPlayer_ui#_readLocalConfig
         * @returns {Void}
         */
        _readLocalConfig : function(){
            // 清楚旧的cookie
            this._clearOldCookie();

            // cookie中的信息
            var _videoVolume = Cookie._$cookie('videoVolume');
            var _hasVolume = Cookie._$cookie('hasVolume');
            var _cdnSwitch = Cookie._$cookie('cdnName');
            var _defaultQuality = (Cookie._$cookie('videoResolutionType') || 1)*1;
            var _rate = (Cookie._$cookie('videoRate') || 1)*1;
            
            _videoVolume = (_videoVolume == '' ? undefined : _videoVolume);
            _hasVolume = (_hasVolume == '' ? undefined : _hasVolume);
            _cdnSwitch = (_cdnSwitch == '' ? undefined : _cdnSwitch);       
            _defaultQuality = (isNaN(_defaultQuality) ? undefined : _defaultQuality);
            _rate = (isNaN(_rate) ? undefined : _rate);

            return {
                volume : _videoVolume,
                mute : _hasVolume !== undefined ? !_hasVolume : _hasVolume,
                cdnSwitch : _cdnSwitch,
                defaultQuality : _defaultQuality,
                rate : _rate
            };
        },

        /**
         * 清楚旧的cookie
         *
         * @private
         * @method  module:pool/component-video-player/src/video-player.VideoPlayer_ui#_clearOldCookie
         * @returns {Void}
         */
        _clearOldCookie : function(){
            Cookie._$cookie('videoVolume', {
                domain: '.' + location.host,
                expires:-1
            });
            Cookie._$cookie('hasVolume', {
                domain: '.' + location.host,
                expires:-1
            });
            Cookie._$cookie('videoResolutionType', {
                domain: '.' + location.host,
                expires:-1
            });
            Cookie._$cookie('videoRate', {
                domain: '.' + location.host,
                expires:-1
            });
        },

        /**
         * 判断是否要可以创建h5播放器
         *
         * @private
         * @method  module:pool/component-video-player/src/video-player.VideoPlayer_ui#_shouldGenH5Player
         * @returns {Void}
         */
        _shouldGenH5Player : function(){
            if (this.data.videoData && this.data.videoData.isEncrypt) {
                return false; // 加密的只能用flash
            }

            return H5util.supportVideo() && this.data.useH5;
        },

        /**
         * 生成具体的播放器
         *
         * @private
         * @method  module:pool/component-video-player/src/video-player.VideoPlayer_ui#_genPlayer
         * @returns {Void}
         */
        _genPlayer : function(){
            var _shouldGenH5Player = this._shouldGenH5Player();

            if (_shouldGenH5Player) {
                this.__playerUI = Html5VideoPlayer._$$Html5VideoPlayer._$allocate({
                    parent : this.$refs.playerNode,
                    data : this.data
                });
            }else{
                this.__playerUI = FlashVideoPlayer._$$FlashVideoPlayer._$allocate({
                    parent : this.$refs.playerNode,
                    data : this.data
                });
            }

            this._initPlayerEvent(); // 绑定事件

            this._initLog(this.__playerUI); // 初始化log
        },

        /**
         * 绑定flash播放器的事件
         *
         * @private
         * @method  module:pool/component-video-player/src/video-player.VideoPlayer_ui#_initPlayerEvent
         * @returns {Void}
         */
        _initPlayerEvent : function(){
            this.__playerUI._$addEvent('onStartLoad', this._onStartLoad._$bind(this));
            this.__playerUI._$addEvent('onPlayEnd', this._onPlayEndHandle._$bind(this));
            this.__playerUI._$addEvent('onPlay', this._onPlay._$bind(this));
            this.__playerUI._$addEvent('onPause', this._onPause._$bind(this));
            this.__playerUI._$addEvent('onPlayClick', this._onPlayClick._$bind(this));
            this.__playerUI._$addEvent('onPauseClick', this._onPauseClick._$bind(this));
            this.__playerUI._$addEvent('onSeek', this._onSeek._$bind(this));
            this.__playerUI._$addEvent('onSelectResolution', this._onSelectResolution._$bind(this));
            this.__playerUI._$addEvent('onAnchorPoint', this._onAnchorHandle._$bind(this));
            this.__playerUI._$addEvent('onChangeCDN', this._onSelectCDN._$bind(this));
            this.__playerUI._$addEvent('onSelectCaption', this._onSelectCaption._$bind(this));
            this.__playerUI._$addEvent('onChangeVolume', this._onChangeVolume._$bind(this));
            this.__playerUI._$addEvent('onChangeRate', this._onChangeRate._$bind(this));
            this.__playerUI._$addEvent('onMute', this._onChangeMute._$bind(this));
            this.__playerUI._$addEvent('onLiveStreamClosed', this._onLiveStreamClosed._$bind(this));
        },

        /**
         * 初始化log
         *
         * @private
         * @method  module:pool/component-video-player/src/video-player.VideoPlayer_ui#_initLog
         * @returns {Void}
         */
        _initLog : function(_playerUI){
            this._log = Log._$$MediaLog._$allocate({
                player : _playerUI
            });
        },

        /**
         * 加载新视频
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#load
         * @param {Object}              options.data.videoData                                  - 视频数据
         * @param {String}              options.data.videoData.flvSdUrl                         - flash用视频地址
         * @param {String}              [options.data.videoData.flvHdUrl]                       - flash用视频地址
         * @param {String}              [options.data.videoData.flvShdUrl]                      - flash用视频地址
         * @param {String}              options.data.videoData.mp4SdUrl                         - h5用视频地址
         * @param {String}              [options.data.videoData.mp4HdUrl]                       - h5用视频地址
         * @param {String}              [options.data.videoData.mp4ShdUrl]                      - h5用视频地址
         * @param {String}              [options.data.videoData.key]                            - cdn加密后的key,如果needKeyTimeValidate为true
         * @param {Boolean}             [options.data.videoData.needKeyTimeValidate]            - 是否进行时间戳校验，true表示前端需要定期发校验请求
         * @param {Number}              [options.data.videoData.playerCollection]               - 前端暂时没有用这个字段。0值表示两者都不可播放，1表示仅支持flv，2表示仅支持mp4，3表示mp4和flv都支持
         * @param {Boolean}             [options.data.videoData.isEncrypt=flase]                - 是否加密
         * @param {Number}              [options.data.videoData.clientEncryptKeyVersion]        - 客户端加解密的key的版本1,2,3
         * @param {String}              [options.data.videoData.encryptionVideoData]            - 视频加密秘钥
         * @param {Array.<Object>}      [options.data.videoData.mp4Caption]                     - h5 pc端字幕，srt格式
         * @param {String}              [options.data.videoData.mp4Caption.name]                - 字幕中文名称
         * @param {String}              [options.data.videoData.mp4Caption.url]                 - 字幕文件地址
         * @param {Array.<Object>}      [options.data.videoData.flvCaption]                     - flash字幕，srt格式
         * @param {String}              [options.data.videoData.flvCaption.name]                - 字幕中文名称
         * @param {String}              [options.data.videoData.flvCaption.url]                 - 字幕文件地址
         * @param {Array.<Object>}      [options.data.videoData.mobileCaption]                  - 移动端字幕，vtt格式
         * @param {String}              [options.data.videoData.mobileCaption.name]             - 字幕中文名称
         * @param {String}              [options.data.videoData.mobileCaption.url]              - 字幕文件地址
         * @param {String}              [options.data.videoData.videoImgUrl]                    - 视频封面地址
         * @param {String}              [options.data.videoData.videoId]                        - 视频id
         * @param {Number}              [options.data.videoData.duration]                       - 视频时长
         * @param {Number}              [options.data.videoData.start=0]                        - 从哪里开始播放(以秒为单位)
         * @param {Array.<Object>}      [options.data.videoData.cluPointData]                   - 驻点数据。可能需要外部通过接口获取并传入
         * @param {Number}              [options.data.videoData.cluPointData.time]              - 驻点时间
         * @return {Void}
         */
        load : function(videoData){
            this.__playerUI._$load(videoData);
        },

        /**
         * 停止当前视频播放
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#stop
         * @return {Void}
         */
        stop : function(){
            this.__playerUI._$stop();
        },
        
        /**
         * 暂停视频
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#pause
         * @return {Void}
         */
        pause : function(){
            this.__playerUI._$pause();
        },

        /**
         * 恢复视频
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#resume
         * @return {Void}
         */
        resume : function(){
            this.__playerUI._$resume();        
        },

        /**
         * 获取当前视频播放的时间
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#getPosition
         * @param {module:pool/component-video-player/src/video-player.VideoPlayer_ui~getPositionCallback} callback 回调方法
         * @return {Void}
         */
        getPosition : function(callback){
            this.__playerUI._$getPosition(callback); 
        },
        /**
         * 获取当前视频播放的时间回调
         * @callback module:pool/component-video-player/src/video-player.VideoPlayer_ui~getPositionCallback
         * @param {Number} number      - 当前播放时间
         */
        
        /**
         * 设置跳转到对应的时间,用于驻点播放
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#seek
         * @param {Number} seekSecs    - seek时间点，单位秒
         * @return {Void}
         */
        seek : function(seekSecs){
            this.__playerUI._$seek(seekSecs);
        },

        /**
         * 获取播放器的状态
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#getState
         * @param  {module:pool/component-video-player/src/video-player.VideoPlayer_ui~getStateCallback} callback 回调方法
         * @return {Void} 
         */
        getState : function(callback){
            this.__playerUI._$getState(callback); 
        },
        /**
         * 获取播放器的状态回调
         * @callback module:pool/component-video-player/src/video-player.VideoPlayer_ui~getStateCallback
         * @param {string} state   - 播放器状态
         */

        /**
         * 获取播放器的状态详细信息
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#getStateInfo
         * @param  {module:pool/component-video-player/src/video-player.VideoPlayer_ui~getStateInfoCallback} callback 回调方法
         * @return {Void} 
         */
        getStateInfo : function(callback){
            this.__playerUI._$getStateInfo(callback); 
        },
        /**
         * 获取播放器的状态详细信息回调
         * @callback module:pool/component-video-player/src/video-player.VideoPlayer_ui~getStateInfoCallback
         * @param {Object}          stateInfo                      - 播放器详细状态
         * @param {String}          stateInfo.status               - 当前播放状态
         * @param {Number}          stateInfo.position             - 当前播放进度
         * @param {Object}          stateInfo.quality              - 当前清晰度信息
         * @param {String}          stateInfo.quality.name         - 当前清晰度名称
         * @param {Number}          stateInfo.quality.quality      - 当前清晰度值
         * @param {Array.<Object>}  stateInfo.caption              - 当前字幕信息，最多两个
         * @param {String}          stateInfo.caption.name         - 字幕名称
         * @param {Number}          stateInfo.caption.index        - 字幕序号
         * @param {String}          stateInfo.caption.url          - 字幕文件地址
         * @param {String}          stateInfo.caption.lang         - 字幕语言，cn或者en
         * @param {Boolean}         stateInfo.caption.isSelect     - 字幕是否被选中
         * @param {String}          stateInfo.isp                  - 当前CDN标识
         */
        
        /**
         * 直播流检查和重新加载，只有flash支持
         * 
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#checkLiveReload
         * @return {Void} 
         */
        checkLiveReload : function(){
            this.__playerUI._$checkLiveReload(); 
        },

        /**
         * 播放结束事件处理
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onPlayEndHandle
         * @private
         */
        _onStartLoad : function(data){
            this.$emit('onStartLoad', data);
        },

        /**
         * 播放结束事件处理
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onPlayEndHandle
         * @private
         */
        _onPlayEndHandle : function(){
            this.$emit('onPlayEnd');
        },

        /**
         * 驻点触发事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onAnchorHandle
         * @private
         * @param {Object} data
         * @param {Number} data.time    - 驻点时间
         */
        _onAnchorHandle : function(data){
            this.$emit('onAnchorPoint', data);
        },

        /**
         * 声音改变事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onChangeVolume
         * @private
         * @param {Number} videoVolume    - 音量
         */
        _onChangeVolume : function(videoVolume){
            //将声音大小记录在缓存中
            Cookie._$cookie('videoVolume',{
                path:'/',
                value:videoVolume + '',
                // domain:'.' + location.host,
                expires:365
            });

            this.$emit('onChangeVolume', {
                volume : videoVolume
            });
        },

        /**
         * 速率改变事件，flash没有该事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onChangeRate
         * @private
         * @param {Number} rate    - 速率
         */
        _onChangeRate : function(rate){
            //将声音大小记录在缓存中
            Cookie._$cookie('videoRate',{
                path:'/',
                value:rate + '',
                expires:365
            });

            this.$emit('onChangeRate', {
                rate : rate
            });
        },

        /**
         * 静音事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onChangeMute
         * @private
         * @param {Boolean} isMute    - 是否静音
         */
        _onChangeMute : function(isMute){
            //将是否静音记录在缓存中
            Cookie._$cookie('hasVolume',{
                path:'/',
                value:!isMute + '',
                expires:365
            });

            this.$emit('onMute', {
                mute : isMute
            });
        },

        /**
         * 拖动seek事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onSeek
         * @private
         * @param {object} seekData
         * @param {Number} seekData.oldData     - seek前时刻
         * @param {Number} seekData.newData     - seek后时刻
         * 
         */
        _onSeek : function(seekData){
            this.$emit('onSeek', seekData);
        },

        /**
         * 清晰度改变事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onSelectResolution
         * @private
         * @param {Object} resolutionData
         * @param {Object} resolutionData.oldData
         * @param {String} resolutionData.oldData.name      - 旧清晰度名称
         * @param {Number} resolutionData.oldData.quality   - 旧清晰度
         * @param {Object} resolutionData.newData
         * @param {String} resolutionData.newData.name      - 新清晰度名称
         * @param {Number} resolutionData.newData.quailty   - 新清晰度
         */
        _onSelectResolution : function(resolutionData){
            //将清晰度记录在缓存中
            Cookie._$cookie('videoResolutionType',{
                path:'/', 
                value:resolutionData.newData.quality, 
                expires:365
            });

            this.$emit('onSelectResolution', resolutionData);
        },

        /**
         * 字幕选择改变事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onSelectCaption
         * @private
         * @param {Object} captionData
         * @param {Array}  captionData.oldData  - 之前选择的字幕，例如：['英文']
         * @param {Array}  captionData.newData  - 当前选择的字幕，例如：['中文', '英文']
         */
        _onSelectCaption : function(captionData){
            this.$emit('onSelectCaption', captionData);
        },

        /**
         * 线路改变事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onSelectCDN
         * @private
         * @param {Object} cdnData
         * @param {Object} cdnData.oldData
         * @param {String} cdnData.oldData.isp      - 旧线路
         * @param {Number} cdnData.oldData.ispName  - 旧线路名称
         * @param {Object} cdnData.newData
         * @param {String} cdnData.newData.isp      - 旧线路
         * @param {Number} cdnData.newData.ispName  - 旧线路名称
         */
        _onSelectCDN : function(cdnData){
            // 将cdn线路名称记录在缓存中，session粒度
            Cookie._$cookie('cdnName', {
                path:'/', 
                value:cdnData.newData.isp
            });

            this.$emit('onChangeCDN', cdnData);
        },

        /**
         * 播放事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onPlay
         * @private
         */
        _onPlay : function(){        
            this.$emit('onPlay');
        },

        /**
         * 暂停事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onPause
         * @private
         */
        _onPause : function(){
            this.$emit('onPause');
        },

        /**
         * 点击播放事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onPlayClick
         * @private
         */
        _onPlayClick : function(){        
            this.$emit('onPlayClick');
        },

        /**
         * 点击暂停事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onPauseClick
         * @private
         * @param {Number} position - 暂停时的时间
         */
        _onPauseClick : function(position){
            this.$emit('onPauseClick', position);
        },

        /**
         * 直播流中断事件
         * @method module:pool/component-video-player/src/video-player.VideoPlayer_ui#_onLiveStreamClosed
         * @private
         */
        _onLiveStreamClosed : function(){
            this.$emit('onLiveStreamClosed');
        }

    });

    return VideoPlayer;
});
