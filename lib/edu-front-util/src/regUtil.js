/**
 * ------------输入校验工具类，比如校验邮箱，手机号，身份证等等-----------
 *
 * @module regUtil
 * @version 1.0
 * @author hzshaoyy(hzshaoyy@corp.netease.com)
 * @path eutil/regUtil
 * ----------------------------------------------------------
 */
NEJ.define(['./adapter/nej.js'], function (_adapter) {
  var _module = {},
      g = (function(){return this;})();
  /**
   * 判断对象是否为合法的email
   * @method _$isEmail
   * @param  {String}  _text 输入的字符串
   * @return {Boolean}       返回是否是Email
   */
  _module._$isEmail = function(_text){
    return /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/.test(_text);
  };


  /**
   * 判断对象是否为合法的手机号
   * @method _$isPhone
   * @param  {String}  _number 输入的数字
   * @return {Boolean}       返回是否是合法的手机号
   */
  _module._$isPhone = function(_number){
    return /^1\d{10}$/.test(_number);
  };

  /**
   * 判断对象是否为合法的电话号码
   * 匹配格式：
   * 11位手机号码
   * 3-4位区号，7-8位直播号码，1－4位分机号
   * 如：(0511-4405222、 021-87888822、12345678901、1234-12345678-1234）
   * @method _$isTel
   * @param  {String}  _number 输入的数字
   * @return {Boolean}       返回是否是合法的电话号码
   */
  _module._$isTel = function(_number){
    return /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(_number);
  };    

  /**
   * 判断数字是否是整数，例如0.2 , 1.5 , 8
   * @method _$isPositiveNum
   * @param  {String}  _number 输入的数字
   * @return {Boolean}       返回是否是整数
   */
  _module._$isPositiveNum = function(_number){   
    return /^[1-9]\d*$/.test(_number); 
  };

  /**
   * 判断是否是qq号，例如10000起
   * @method _$isQQ 
   * @param  {String}  _number 输入的数字
   * @return {Boolean}       返回是否是整数
   */
  _module._$isQQ = function(_number){   
    return /^[1-9][0-9]{3,11}$/.test(_number);
  };

      
  return _module;
});
