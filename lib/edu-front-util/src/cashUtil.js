/**
 * 
 * --------------------cash对象操作相关的util--------------------
 * @module cashUtil
 * @version  1.0
 * @author   hzcaohuanhuan(hzcaohuanhuan@corp.netease.com)
 * @path     eutil/cashUtil
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js'], function(){
	var _module = {},
        g = (function(){return this;})();

  /**
   * 格式化cash
   * @method _$formatCash
   * @param {number} _value 价格数值
   * @returns {String} 价格字符串
   * @example   2  => ￥2.00  null => 免费
   */
  _module._$formatCash = function(_value){
      _value = _value || 0;
      if(_value){
        return '￥' + _module._$formatNumber(_value, 2);
      }else{
        return '免费';
      }
  }

  /**
   * 格式化cash（不加￥符号）
   * @method _$formatCashNoRMB
   * @param {number} _value 价格数值
   * @returns {String} 价格字符串
   * @example   2  => 2.00  null => 免费
   */
  _module._$formatCashNoRMB = function(_value){
      _value = _value || 0;
      if(_value){
          return _module._$formatNumber(_value, 2);
      }else{
          return '免费';
      }
  }
  
  /**
   * 格式化数值
   * @method _$formatNumber
   * @param {number} _value 需要格式化的数字
   * @param {number} _precision 精度
   * @returns {number} 按精度格式化的数据
   * @example（0.3+0.2）=> 0.5
   */
  _module._$formatNumber = function(_value, _precision){
      if(Number(_value)){
          return Number(_value).toFixed(_precision);
      }else{
          return 0.0.toFixed(_precision);
      }

  }

  return _module;
});
