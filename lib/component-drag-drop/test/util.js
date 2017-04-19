/**
 * Utility for Unit Test
 *
 * @author edu <edu@corp.netease.com>
 */
NEJ.define([
    'base/util'
],function(
    u,
    exports
){
    /**
     * Regular 组件常规属性验证器初始化
     *
     * @param   {Object} def - 默认属性信息
     * @param   {Object} ret - 待验证结果
     * @returns {Function}     验证执行函数
     */
    exports.setupProChecker = function(def, ret) {
        ret = u._$merge({},def,ret);
        return function(expect, inst) {
            u._$forIn(ret, function(value,key) {
                expect(inst.data[key]).to.equal(value,key);
            });
        };
    };
    /**
     * Regular 组件计算属性验证器初始化
     *
     * @param   {Object} def - 默认属性信息
     * @param   {Object} ret - 待验证结果
     * @returns {Function}     验证执行函数
     */
    exports.setupComputedChecker = function (def, ret) {
        ret = u._$merge({},def,ret);
        return function(expect, inst) {
            u._$forIn(ret, function(value,key) {
                expect(inst.$get(key)).to.equal(value,key);
            });
        };
    }
});