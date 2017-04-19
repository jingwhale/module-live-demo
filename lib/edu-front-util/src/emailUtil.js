/**
 * ---------邮箱相关处理工具类文件--------------------
 * @module emailUtil
 * @version 1.0
 * @author hzcaohuanhuan(hzcaohuanhuan@corp.netease.com)
 * @path     eutil/emailUtil
 * ----------------------------------------------------
 */
NEJ.define(['./adapter/nej.js'], function() {
  var _module = {},
      g = (function(){return this;})();

  /**
  * 判断是否是网易邮箱
  * @method _$isNeteaseEmail
  * @param {String} email 比如@163.com、@126.com、@yeah.net、@vip.163.com、@vip.126.com、@188.com
  * @returns {Boolean} bool 是否为邮箱
  */
  _module._$isNeteaseEmail = function(_email){
    var _host = _email.substring(_email.indexOf("@")+1);
    if(_host == "163.com" || _host == "126.com" || _host == "yeah.net" || _host == "vip.163.com" || _host == "vip.126.com" || _host == "188.com" ){
      return true;
    }else{
      return false;
    }
  };


  return _module;
});
