/**
 * 配置管理实现文件
 *
 * @version  1.0
 * @author   caijf <caijf@corp.netease.com>
 * @module   pool/cache-base/src/setting
 */
NEJ.define([
    'base/util'
],function (
    u,
    exports
){
    // setting cache
    var DT_SETTING = {},
        DT_PERMISSION = {},
        CTRL_PERMISSION = {};
    /**
     * 批量添加配置信息
     *
     * @example
     *
     * NEJ.define([
     *      'pool/cache-base/src/setting'
     * ],function(setting){
     *      // 批量更新设置
     *      setting.batch({
     *          "component-ui-abc": {
     *              "funcABC": true
     *          },
     *          "component-ui-def": {
     *              "funcDEF": true
     *          }
     *      });
     *     // 取设置配置信息
     *     var set = setting.get("component-ui-abc");
     * });
     *
     * @method  module:pool/cache-base/src/setting.batch
     * @param   {Object} map - 配置信息
     * @returns {void}
     */
    exports.batch = function (map) {
        var func = function (value, key) {
            this.set(key,value);
        };
        u._$loop(map,func,this);
    };

    /**
     * 设置配置默认值
     *
     * @method  module:pool/cache-base/src/setting.$default
     * @param   {Object} map - 配置信息
     * @returns {void}
     */
    exports.$default = function (map) {
        // set default value
        var def = function (key, value) {
            var ret = u._$merge(
                value, exports.get(key)
            );
            DT_SETTING[key] = ret;
        };
        // use map or single setting
        if (typeof map==='string'){
            var ARG_START = 1;
            def(map,arguments[ARG_START]);
        }else{
            u._$loop(map, def);
        }
    };

    /**
     * 添加单项配置信息，配置信息与已有配置进行合并
     *
     * @example
     *
     * NEJ.define([
     *      'pool/cache-base/src/setting'
     * ],function(setting){
     *      // 单项设置更新，设置项合并
     *      setting.set(
     *          "component-ui-abc", {
     *              "funcDEF": true
     *          }
     *     );
     *     // 取设置配置信息
     *     var set = setting.get("component-ui-abc");
     * });
     *
     * @method  module:pool/cache-base/src/setting.set
     * @param   {String} key - 配置标识
     * @param   {Object} map - 配置信息
     * @returns {void}
     */
    exports.set = function (key, map) {
        var ret = this.get(key);
        u._$merge(ret,map);
        DT_SETTING[key] = ret;
    };
    /**
     * 获取设置配置信息
     *
     * @example
     *
     * NEJ.define([
     *      'pool/cache-base/src/setting'
     * ],function(setting){
     *      // 单项设置更新，设置项合并
     *      setting.set(
     *          "component-ui-abc", {
     *              "funcDEF": true
     *          }
     *     );
     *     // 取设置配置信息
     *     var set = setting.get("component-ui-abc");
     *     // set.funcDEF
     * });
     *
     * @method  module:pool/cache-base/src/setting.get
     * @param   {String} key - 配置标识
     * @returns {Object}       设置信息
     */
    exports.get = function (key) {
        return DT_SETTING[key]||{};
    };

    /**
     * 设置权限并转换成所包含的功能map并保存
     *
     * @example
     *
     * NEJ.define([
     *      'pool/cache-base/src/setting'
     * ],function(setting){
     *      // 单项设置更新，设置项合并
     *      setting.setPermission(
     *          ['has_a_permission', 'has_b_permission']
     *     );
     * });
     *
     * @method  module:pool/cache-base/src/setting.setPermission
     * @param   {Array} arr - 字符串数组
     * @param   {Array} funcMap - 权限和功能的映射
     * @returns {void}
     */
    exports.setPermission = function (arr, funcMap) {
        u._$forIn(funcMap, function (map) {
            CTRL_PERMISSION = u._$merge(CTRL_PERMISSION, map);
        });

        u._$forEach(arr, function (permission) {
            DT_PERMISSION = u._$merge(DT_PERMISSION, funcMap[permission]);
        });
    };

    /**
     * 根据功能开关和权限查看是否显示
     *
     * @example
     *
     * NEJ.define([
     *      'pool/cache-base/src/setting'
     * ],function(setting){
     *      // 单项设置更新，设置项合并
     *      setting.isShow(
     *          "key": "module-backend-admin",
     *          "switcher": "SHOW_MODULE_OK"
     *     );
     * });
     *
     * @method  module:pool/cache-base/src/setting.isShow
     * @param   {Object} options
     * @param   {String} options.key           模块key
     * @param   {String} options.switcher      开关
     * @returns {Boolean}
     */
    exports.isShow = function (options) {
        var hasSet = (DT_SETTING[options.key]||{})[options.switcher] !== false;  // 默认不配置就返回显示true
        if(CTRL_PERMISSION[options.switcher]){
            hasSet = hasSet && ((DT_PERMISSION[options.key]||{})[options.switcher] === true)
        }
        return hasSet;
    };
});
