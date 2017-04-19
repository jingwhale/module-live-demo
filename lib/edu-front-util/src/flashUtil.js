/**
 * ---------flash相关处理工具类文件--------------------
 * @module flashUtil
 * @version 1.0
 * @author hzlixinxin(hzlixinxin@corp.netease.com)
 * @path     eutil/flashUtil
 * ----------------------------------------------------
 */
NEJ.define(['./adapter/nej.js'], function() {
  var _module = {},
      g = (function(){return this;})();

  /**
  * 判断是否安装了flash
  * @method _$isNeteaseEmail
  * @param {Void} email 
  * @returns {Boolean} bool 是否安装了flash
  */
  _module._$checkFlash = function(){
      var hasFlash = false;

      try {
          hasFlash = Boolean(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
      } catch(exception) {
          hasFlash = ('undefined' != typeof navigator.mimeTypes['application/x-shockwave-flash']);
      }

      return hasFlash;
  };

  return _module;
});
