/**
 * 名单数据缓存管理基类实现文件
 *
 * @version  1.0
 * @author   caijf <caijf@corp.netease.com>
 * @module   pool/cache-base/src/users
 */
NEJ.define([
    'base/klass',
    'base/event',
    'base/util',
    'util/event/event',
    './base.js',
    './setting.js'
],function(
    k, v, u, t,
    d, s,
    exports,
    pro
){
    /**
     * 名单数据缓存管理基类
     *
     * @class   module:pool/cache-base/src/users.Users
     * @extends module:pool/cache-base/src/base.Cache
     *
     * @param   {Object} options - 构造参数
     */
    var Users = k._$klass();
    pro = Users._$extend(d.Cache);

    /**
     * 直接从缓存获取名单统计信息
     *
     * @protected
     * @method  module:pool/cache-base/src/users.Users#getStatisticsInCache
     * @param   {String} key - 缓存标识
     * @returns {Object} 统计信息
     */
    pro.getStatisticsInCache = function (key) {
        return this.__getDataInCache(key);
    };

    /**
     * 获取名单统计信息
     *
     * @protected
     * @method  module:pool/cache-base/src/users.Users#getStatistics
     * @returns {void}
     */
    pro.getStatistics = function () {
        // TODO
    };

    /**
     * 更新用户状态
     *
     * @protected
     * @method  module:pool/cache-base/src/users.Users#updateStatus
     * @param   {String} key - 请求标识
     * @param   {Number} id  - 归属标识
     * @param   {Object} opt - 请求数据
     * @returns {void}
     */
    pro.updateStatus = function (key, id, opt) {
        // callback
        var that = this;
        var dispatch = function (ret) {
            that._$dispatchEvent(
                'onstatechange',{
                    id: id,
                    map: ret,
                    data: opt
                }
            );
        };
        // request to server
        this.__doSendRequest(
            key,{
                data: opt,
                onload: function (ret) {
                    dispatch.call(that,ret);
                },
                onerror: function (error) {
                    dispatch.call(that,null);
                }
            }
        );
    };

    /**
     * 执行缓存的同步方法，执行完毕后立即回收缓存
     *
     * ```javascript
     * NEJ.define([
     *     'pool/cache-base/src/users'
     * ],function(t){
     *
     *     // 使用缓存
     *     var ret = t.$do(function(cache){
     *         return cache.getSomething();
     *     });
     *
     *     // TODO something
     * }
     * ```
     *
     * @method module:pool/cache-base/src/users.$do
     * @param  {Function} func - 执行回调
     * @return {Function}        回调返回结果
     */
	exports.$do = d.$do._$bind(null,Users);
    // export config api
    exports.config = d.config;
	// 导出
    exports.Users = Users;
});
