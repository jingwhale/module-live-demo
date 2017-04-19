/**
 * 直播管理数据缓存管理实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 * @module   pool/cache-live/src/live-manage/cache
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

    // 直播管理列表筛选常量
    exports.LIVE_LIST_FILTER_STATUS_NOTSTART = 5;  // 未开始
    exports.LIVE_LIST_FILTER_STATUS_PLAYING = 0;  // 直播中
    exports.LIVE_LIST_FILTER_STATUS_END = 40;  // 已结束

    // 直播开启结果返回常量
    exports.LIVE_START_STATUS_SUCCESS = 0; // 成功
    exports.LIVE_START_STATUS_FAIL = -2; // 失败
    exports.LIVE_START_STATUS_NOTALLOWED = -3; // 已经在直播，无法进入
    exports.LIVE_START_STATUS_DUPLICATE = -4; // 一个用户同一时间只能进行一场直播
    exports.LIVE_START_STATUS_ERROR_LECTOR = -5; // 非该课程讲师，不可以进行直播  
    exports.LIVE_START_STATUS_NO_SERVICE = -6; //直播服务不可使用
    exports.LIVE_START_STATUS_FAIL_OTHER = -1; // 失败，其他异常

    /**
     * LiveManage 数据缓存管理
     *
     * | 键 | 描述 |
     * | :--- | :--- |
     * | live-manage-[status] | 直播列表 |
     * 
     * @class   module:pool/cache-live/src/live-manage/cache.LiveManage
     * @extends module:pool/cache-base/src/base.Cache
     *
     * @param   {Object} options - 构造参数
     */
    var LiveManage = k._$klass();
    pro = LiveManage._$extend(d.Cache);

    var SETTING_KEY = 'cache-live-manage';

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
     * @method  module:pool/cache-live/src/live-manage/cache.LiveManage#_doLoadList
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
            'live-manage-list', options
        );
    };

    /**
     * 从服务器端载入列表项
     *
     * @protected
     * @method  module:pool/cache-live/src/live-manage/cache.LiveManage#_doLoadItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 列表项标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doLoadItem = function(options) {
        this.__doSendRequest(
            'live-manage-get', options
        );
    };

    /**
     * 添加列表项至服务器
     *
     * @protected
     * @method  module:pool/cache-live/src/live-manage/cache.LiveManage#_doAddItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doAddItem = function(options) {
        this.__doSendRequest(
            'live-manage-create', options
        );
    };

    /**
     * 从服务器上删除列表项
     *
     * @protected
     * @method  module:pool/cache-live/src/live-manage/cache.LiveManage#_doDeleteItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {Number}   options.id     - 列表项标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doDeleteItem = function(options) {
        this.__doSendRequest(
            'live-manage-delete', options
        );
    };

    /**
     * 更新列表项至服务器
     *
     * @protected
     * @method  module:pool/cache-live/src/live-manage/cache.LiveManage#_doUpdateItem
     * @param   {Object}   options        - 请求信息
     * @param   {String}   options.key    - 列表标识
     * @param   {String}   options.data   - 请求相关数据
     * @param   {Function} options.onload - 列表项载入回调
     * @returns {void}
     */
    pro._doUpdateItem = function(options) {
        this.__doSendRequest(
            'live-manage-update', options
        );
    };


    /**
     * 获取直播配置
     * @public
     * @method  module:pool/cache-live/src/live-manage/cache.LiveManage#getLiveConfig
     * @param {[type]} [varname] [description]
     * @return {Void} 
     */
    pro.getLiveConfig = function(osType){
        var that = this;

        this.__doSendRequest(
            'live-manage-getLiveConfig',{
                data : {
                    osType: osType
                },
                onload: function (ret) {
                    that._$dispatchEvent(
                        'ongetLiveConfig', ret
                    );
                }
            }
        );
    }

    /**
     * 获取直播开通状态和余额  
     * @public
     * @method  module:pool/cache-live/src/live-manage/cache.LiveManage#getLiveConfig
     * @return {Void} 
     */
    pro.getAuth = function(){
        var that = this;

        this.__doSendRequest(
            'live-manage-getAuth',{
                data : null,
                onload: function (ret) {
                    that._$dispatchEvent(
                        'ongetAuth', ret
                    );
                }
            }
        );
    }

    /**
     * 是否是直播课时的讲师
     * @public
     * @method  module:pool/cache-live/src/live-manage/cache.LiveManage#isProperTeacher
     * @param {Number} termId   - 期次id
     * @param {Number} unitId   - 课件id
     * @return {Void} 
     */
    pro.isProperTeacher = function(termId){
        var that = this;

        this.__doSendRequest(
            'live-manage-isProperTeacher',{
                data : {
                    termId : termId
                },
                onload: function (ret) {
                    that._$dispatchEvent(
                        'onproperteacher', ret
                    );
                }
            }
        );
    }

    /**
     * 开始直播，obs
     * @public
     * @method  module:pool/cache-live/src/live-manage/cache.LiveManage#startlive
     * @param {Number} unitId   - 课件id
     * @return {Void} 
     */
    pro.startlive = function(unitId){
        var that = this;

        this.__doSendRequest(
            'live-manage-startlive',{
                data : {
                    unitId : unitId
                },
                onload: function (ret) {
                    that._$dispatchEvent(
                        'onstartlive', ret
                    );
                }
            }
        );
    }

    /**
     * 结束直播，obs
     * @public
     * @method  module:pool/cache-live/src/live-manage/cache.LiveManage#stoplive
     * @param {Number} unitId   - 课件id
     * @return {Void} 
     */
    pro.stoplive = function(unitId){
        var that = this;

        this.__doSendRequest(
            'live-manage-stoplive',{
                data : {
                    unitId : unitId
                },
                onload: function (ret) {
                    that._$dispatchEvent(
                        'onstoplive', ret
                    );
                }
            }
        );
    }

    /**
     * 结束直播，唐桥
     * @public
     * @method  module:pool/cache-live/src/live-manage/cache.LiveManage#startTechBridge
     * @param {Number} unitId   - 课件id
     * @return {Void} 
     */
    pro.startTechBridge = function(unitId){
        var that = this;

        this.__doSendRequest(
            'live-manage-startTechBridge',{
                data : {
                    unitId : unitId
                },
                onload: function (ret) {
                    that._$dispatchEvent(
                        'onstartTechBridge', ret
                    );
                }
            }
        );
    }


    // 支持类上的 onlistchange 事件
    t._$$CustomEvent._$allocate({
        element: LiveManage,
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
    exports.$do = d.$do._$bind(null, LiveManage);
    // 导出
    exports.LiveManage = LiveManage;
});
