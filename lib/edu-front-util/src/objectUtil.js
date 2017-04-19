/**
 * -----------------objectUtil 对象操作相关的util--------------------
 * 
 * @module objectUtil
 * @version  1.0
 * @author   hzcaohuanhuan(hzcaohuanhuan@corp.netease.com)
 * @path     eutil/objectUtil
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js', 'util/encode/md5'], function (_adapter, _md5) {
  var _module = {},
      g = (function(){return this;})();
  /**
   * 深层拷贝 (NEJ.X() 的拷贝只能实现浅拷贝，拷贝的是对象的引用)
   * @method _$deepCopy
   * @param {Object} _originObj 原始数据
   * @return {Object} 深克隆后的对象
   */
  _module._$deepCopy = function(originObj) {
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
  };

  /**
   * 深度清除 对象中值为null 与 undefined 的key
   * @method _$deepCleanObj
   * @param {Object} _originObj 原始数据
   * @return {Object} 返回一个新的清除后的对象
   */
  _module._$deepCleanObj = function deepCleanObj(_obj){
    if(Object.prototype.toString.call(_obj) !== '[object Object]'){
      return _obj;
    }

    var _res = {};
    for(var _p in _obj){
      if(_obj.hasOwnProperty(_p) && _obj[_p] != null){
        _res[_p] = this._$deepCleanObj(_obj[_p]);
      }
    }

    return _res;
  };

  /**
   * 将对象转换为JSON字符串,然后使用hex编码返回对象,主要是用于GA统计日志分析数据
   *  @method _$convertToJSONHex
   *  @param { Object} _obj 需要转换的对象
   *  @return {String} '###'加上hex编码
   */
  _module._$convertToJSONHex = function(_obj){
    return "###"+_md5._$str2hex(JSON.stringify(_obj || {}));
  };


  return _module;
});

