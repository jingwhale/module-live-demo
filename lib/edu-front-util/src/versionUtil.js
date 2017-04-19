/**
 * ---------版本工具类文件------------------------------
 * @module versionUtil
 * @version 1.0
 * @author tangtianliang(tangtianliang@corp.netease.com)
 * @path     eutil/versionUtil
 * ----------------------------------------------------
 */
// !function (name, definition) {
//     if (typeof module != 'undefined' && module.exports) module.exports = definition();
//     else if (typeof NEJ !== 'undefined' && NEJ.define) NEJ.define(['eutil/adapter/nej'],definition);
//     else this[name] = definition()
// }('versionUtil', function () {
//
NEJ.define(['./adapter/nej.js'], function(){

    var _module = {},
        g = (function(){return this;})();
  /**
   * 比较版本大小
   * @method _$versionCompare
   * @param {String} v1 1.0.0版本1
   * @param {String} v2 1.0.0版本2
   * @param {Object} options {
   *                           lexicographical
   *                           zeroExtend 后缀补全0
   *                         }
   * @return {boolean} true v1>v2
   */
  _module._$versionCompare = function(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        }
        else if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
  }

  return _module;
});
