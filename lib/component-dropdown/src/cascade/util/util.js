/*
 * ------------------------------------------
 * cascade工具
 * @version  1.0
 * @author   dophin(hzliuzongyuan@corp.netease.com)
 * @module pool/component-dropdown/src/cascade/util/util
 * ------------------------------------------
 */

define([], function () {
    var Utils = {
        deepCopy: function (originObj) {
            if (originObj == null)return null;
            if (typeof originObj !== "object") {
                return originObj;
            }
            var clone = {};

            if (originObj.constructor == Array) {
                clone = [];
            }

            for (var i in originObj) {
                clone[i] = arguments.callee(originObj[i]);
            }
            return clone;
        }
    }

    return Utils
});