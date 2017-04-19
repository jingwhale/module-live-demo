/**
 * 
 * --------------------dom对象操作相关的util--------------------
 * @module domUtil
 * @version  1.0
 * @author   hzcaohuanhuan(hzcaohuanhuan@corp.netease.com)
 * @path     eutil/domUtil
 * --------------------------------------------------------
 */
NEJ.define(['./adapter/nej.js', 'base/element'], function (_adapter, _e) {
  var _module = {},
      g = (function(){return this;})();

  /**
   * 隐藏节点
   * @method _$hiddenNode
   * @param {Object} _node，html节点
   */
  _module._$hiddenNode = function(_node){
    if (!!_node) {
    _node.style.display = 'none';
    }
  };
  
  /**
   * 判断节点是否显示出来
   * @method _$isNodeShown
   * @param {Object} _node，html节点
   */
  _module._$isNodeShown = function(_node){
    if (!!_node) {
      return (_node.style.display != 'none');
    }else{
      return false;
    }
  };
  
  /**
   * 显示节点
   * @method _$showNode
   * @param {Object} _node
   */
  _module._$showNode = function(_node){
    if (!!_node) {
      _node.style.display = '';
    }
  };

  /**
   * 控制是否显示节点
   * @method _$toggleNodeDisplay
   * @param {Object} _node
   * @param {boolean} _bool
   */
  _module._$toggleNodeDisplay = function(_node,_bool){
    if(_bool){
      _module._$showNode(_node);
    }else{
      _module._$hiddenNode(_node);
    }
  };

  /**
   * 切换节点样式
   * @method _$toggleClassName
   * @param {Boolean} 是否显示类名
   * @param {Object} 节点
   * @param {String} 类名
   */
  _module._$toggleClassName = function(_bool,_node,_clazz){
    if(_bool){
      _e._$addClassName(_node,_clazz);
    }else{
      _e._$delClassName(_node,_clazz);
    }
  };


  
  return _module;
});
