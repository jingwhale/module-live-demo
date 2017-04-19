/**
 * Live 数据缓存管理实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 * @module   pool/cache-live/src/live/cache
 */
NEJ.define([
    'base/klass',
    'util/event/event',
    'pool/cache-base/src/base',
    'pool/cache-base/src/setting',
    './config.js'
], function(
    k, t,
    d, s,
    conf,
    exports,
    pro
) {

    // 直播模式
    exports.LIVE_NORMAL_MODE = 0;  // 非cdn模式
    exports.LIVE_CDN_MODE = 1; // cdn模式

    // 直播推流类型
    exports.LIVE_METHOD_TYPE_TANGQIAO = 0;  // 唐桥
    exports.LIVE_METHOD_TYPE_OBS = 1; // obs
    
    // 兼容1.0直播状态
    if (!window.useOldLiveConstant) {
        // 2.0直播状态
        exports.LIVE_STATUS_NOTSTART = 35; // 未开始
        exports.LIVE_STATUS_PLAYING = 0; // 正在直播中
        exports.LIVE_STATUS_END = 10;  // 直播结束，正在转码总
        exports.LIVE_STATUS_TRANSFORM_COMPLETE = 15; // 转码成功
        exports.LIVE_STATUS_COMING = 20; // 即将开始直播
        exports.LIVE_STATUS_DELAY_START = 25; // 直播主持人未按时开播
        exports.LIVE_STATUS_INVALID = 30; // 直播已经失效
    }else{  
        exports.LIVE_STATUS_NOTSTART = 0; // 未开始
        exports.LIVE_STATUS_PLAYING = 1; // 正在直播中
        exports.LIVE_STATUS_END = 2;  // 直播结束，正在转码总
        exports.LIVE_STATUS_TRANSFORM_COMPLETE = 3; // 转码成功
        exports.LIVE_STATUS_COMING = 4; // 即将开始直播
        exports.LIVE_STATUS_DELAY_START = 5; // 直播主持人未按时开播
        exports.LIVE_STATUS_INVALID = 6; // 直播已经失效
    }

    // 直播频道推流情况
    exports.LIVE_CHANNEL_IDLE = 0;  // 空闲
    exports.LIVE_CHANNEL_PUSHING = 1; // 直播中（推流中）
    exports.LIVE_CHANNEL_DISABLE = 2; // 禁用
    exports.LIVE_CHANNEL_RECORDING = 3; // 直播录制中
    

    /**
     * Live 数据缓存管理
     *
     * @class   module:pool/cache-live/src/live/cache.Live
     * @extends module:pool/cache-base/src/base.Cache
     *
     * @param   {Object} options - 构造参数
     */
    var Live = k._$klass();
    pro = Live._$extend(d.Cache);

    var SETTING_KEY = 'cache-live';

    /**
     * 初始化缓存
     *
     * @private
     * @method  module:pool/cache-term/src/setting-close/cache.SettingClose#__init
     * @param   {Object} options - 配置信息
     * @returns {void}
     */
    pro.__init = function() {
        this._doFlushSetting(
            SETTING_KEY, conf
        );
        this.__super();
    };


    /**
     * 从服务器端载入列表
     *
     * @protected
     * @method  module:pool/cache-live/src/live/cache.Live#_doLoadList
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.offset - 偏移量
     * @param   {Number}   options.limit  - 数量
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doLoadList = function(options) {
        this.__doSendRequest(
            'live-list', options
        );
    };

    /**
     * 从服务器端载入列表项
     *
     * @protected
     * @method  module:pool/cache-live/src/live/cache.Live#_doLoadItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 列表项标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doLoadItem = function(options) {
        this.__doSendRequest(
            'live-get', options
        );
    };

    /**
     * 添加列表项至服务器
     *
     * @protected
     * @method  module:pool/cache-live/src/live/cache.Live#_doAddItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doAddItem = function(options) {
        this.__doSendRequest(
            'live-create', options
        );
    };

    /**
     * 从服务器上删除列表项
     *
     * @protected
     * @method  module:pool/cache-live/src/live/cache.Live#_doDeleteItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 列表项标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doDeleteItem = function(options) {
        this.__doSendRequest(
            'live-delete', options
        );
    };

    /**
     * 获取直播间信息
     *
     * @protected
     * @method  module:pool/cache-live/src/live/cache.Live#_$getLiveInfo
     * @param   {Object}   options                          - 请求信息
     * @param   {String}   options.key                      - 标识
     * @param   {String}   options.data                     - 请求相关数据
     * @param   {String}   options.data.liveContentId       - 直播id
     * @param   {String}   options.data.meetId              - 房间id
     * @param   {Function} options.onload                   - 列表项载入回调
     * @returns {void}
     */
    pro._$getLiveInfo = function(options) {
        this.__doSendRequest(
            'live-getInfo', options
        );
    };

    /**
     * 获取直播拉流地址
     *
     * @protected
     * @method  module:pool/cache-live/src/live/cache.Live#_$getStraamUrl
     * @param   {Object}   options                          - 请求信息
     * @param   {String}   options.key                      - 标识
     * @param   {String}   options.data                     - 请求相关数据
     * @param   {String}   options.data.liveContentId       - 直播id
     * @param   {Function} options.onload                   - 列表项载入回调
     * @returns {void}
     */
    pro._$getStraamUrl = function(options) {
        this.__doSendRequest(
            'live-getStraamUrl', options
        );
    };


    /**
     * 获取聊天室地址
     *
     * @protected
     * @method  module:pool/cache-live/src/live/cache.Live#_$getLiveInfo
     * @param   {Object}   options                          - 请求信息
     * @param   {String}   options.key                      - 标识
     * @param   {String}   options.data                     - 请求相关数据
     * @param   {String}   options.data.roomid              - 聊天室id
     * @param   {String}   options.data.uid                 - 用户云信id
     * @param   {Function} options.onload                   - 列表项载入回调
     * @returns {void}
     */
    pro._$getChatAddress = function(options) {
        this.__doSendRequest(
            'chat-getAddress', options
        );
    };

    /**
     * 获取聊天室当前在线人数
     *
     * @protected
     * @method  module:pool/cache-live/src/live/cache.Live#_$getChatCurrentMemberNum
     * @param   {Object}   options                          - 请求信息
     * @param   {String}   options.key                      - 标识
     * @param   {String}   options.data                     - 请求相关数据
     * @param   {String}   options.data.roomid              - 聊天室id
     * @param   {String}   options.data.uid                 - 用户云信id
     * @param   {Function} options.onload                   - 列表项载入回调
     * @returns {void}
     */
    pro._$getChatCurrentMemberNum = function(options) {
        this.__doSendRequest(
            'chat-getCurrentMemberNum', options
        );
    };

    /**
     * 获取直播对应的聊天室信息
     * @public
     * @method  module:pool/cache-live/src/live/cache.Live#_$getChatRoom
     * @param {String} liveContentId - 直播id
     * @return {Void} 
     */
    pro._$getChatRoom = function(liveContentId){
        var that = this;

        this.__doSendRequest(
            'live-getChatRoom',{
                data : {
                    liveContentId : liveContentId
                },
                onload: function (ret) {
                    that._$dispatchEvent(
                        'ongetChatRoom', ret
                    );
                }
            }
        );
    }

    /**
     * 获取判断推流状态
     * @public
     * @method  module:pool/cache-live/src/live/cache.Live#_$getChannelStatus
     * @param {Number} liveChannelId  - 频道id
     * @return {Void} 
     */
    pro._$getChannelStatus = function(liveChannelId){
        var that = this;
        
        this.__doSendRequest(
            'live-getChannelStatus',{
                data : {
                    liveChannelId : liveChannelId
                },
                onload: function (ret) {
                    that._$dispatchEvent(
                        'ongetChannelStatus', ret
                    );
                }
            }
        );
    }

    /**
     * 更新列表项至服务器
     *
     * @protected
     * @method  module:pool/cache-live/src/live/cache.Live#_doUpdateItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doUpdateItem = function(options) {
        this.__doSendRequest(
            'live-update', options
        );
    };

    // 支持类上的 onlistchange 事件
    t._$$CustomEvent._$allocate({
        element: Live,
        event: 'listchange'
    });

    /**
     * 执行缓存的同步方法，执行完毕后立即回收缓存
     *
     * ```javascript
     * NEJ.define([
     *     'pool/cache-live/src/live/cache'
     * ],function(t){
     *
     *     // 使用缓存
     *     var ret = t.do(function(cache){
     *         return cache.getSomething();
     *     });
     *
     *     // TODO something
     * }
     * ```
     *
     * @method module:pool/cache-live/src/live/cache.do
     * @param  {Function} func - 执行回调
     * @return {Function}        回调返回结果
     */
    exports.$do = d.$do._$bind(null, Live);
    // 导出
    exports.Live = Live;
});
