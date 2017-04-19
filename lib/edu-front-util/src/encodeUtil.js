/**
 * --------------------加密Util--------------------
 * @module encodeUtil
 * @version 1.0
 * @author  hzshaoyy(hzshaoyy@corp.netease.com)
 * @path    eutil/encodeUtil
 * ----------------------------------------------------------
 */
NEJ.define(['./adapter/nej.js'], function(){

    var _module = {},
        g = (function(){return this;})();
    /**
     * 编码字符串，
     * 编码规则对象中r正则表达式参数提取字符串需要编码的内容，
     * 然后使用编码规则对象中的映射表进行替换
     *
     * @example
     *```javascript
     * NEJ.define([
     *     'base/util'
     * ],function(_u){
     *     // 把字符串99999根据规则9替换成t，结果：ttttt
     *     var str = _u._$encode({r:/\d/g,'9':'t'},'99999');
     * });
     * ```
     *
     * @method _$encode
     * @param  {Object} arg0 - 编码规则
     * @param  {String} arg1 - 待编码的字串
     * @return {String}        编码后的字串
     *
     */
    _module._$encode = function(_map, _content){
        _content = ''+_content;
        if (!_map||!_content){
            return _content||'';
        }
        return _content.replace(_map.r,function($1){
            var _result = _map[!_map.i?$1.toLowerCase():$1];
            return _result!=null?_result:$1;
        });
    };

    return _module;
});
