/**
 * --------------------array对象操作相关的util--------------------
 * @module arrayUtil
 * @version  1.0
 * @author   hzshaoyy(hzshaoyy@corp.netease.com)
 * @path     eutil/arrayUtil
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js'], function(){
  var _module = {},
      g = (function(){return this;})();

  /**
   * 判断数组是否包含值
   *
   * @public
   * @method _$arrContains
   * @param {Array} _arr 数组
   * @param {Object} _value 包含的值
   * @return { Boolean} 是否包含
   */
  _module._$arrContains = function(_arr, _value){
    if(!!_arr){
      for(var i = 0; i < _arr.length; i++){
        if(_arr[i] === _value){
          return true;
        }
      }
    }
    return false;
  };

  /**
   * 判断对象数组[{key:123},{},{}]中key对应的是否包含值123
   *
   * @public
   * @method _$arrContainsByKey
   * @param {Array} _arr 数组
   * @param {Object} _value 包含的值
   * @param {String} _key key
   * @return {Boolean} 是否包含
   */
  _module._$arrContainsByKey = function(_arr, _value, _key){
    if(!!_arr){
      for(var i = 0; i < _arr.length; i++){
        if(_arr[i][_key || 0] == _value){
          return true;
        }
      }
    }
    return false;
  };

  /**
   * 判断数组A/B是否有相同的值
   *
   * @public
   * @method _$arrCross
   * @param {Array} _arrA 数组A
   * @param {Array} _arrB 数组B
   * @return {Boolean} 是否有相同的值
   */
  _module._$arrCross = function(_arrA, _arrB){
    for(var i = 0; i < _arrA.length; i++){
      if(_module._$arrContains(_arrB, _arrA[i])){ //判断数组B中是否包含值a
        return true;
      }
    }

    return false;
  };


  return _module;
});
