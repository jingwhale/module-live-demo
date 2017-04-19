/**
 * -------------- url相关的util-----------------------
 *
 * @module urlUtil
 * @version  1.0
 * @author   hzshaoyy(hzshaoyy@corp.netease.com)
 * @path     eutil/urlUtil
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js', 'base/util', 'util/encode/base64'], function (_adapter, _util, _base64) {
    var _module = {},
        g = (function(){return this;})();

    /**
     * 解析url参数
     *
     * 输入： ?123=dawd&adwd&a1=1
     * 输出： { 123: 'dawd', adwd: '', a1: "1" }
     *
     * @method _$parseUrlParams
     * @param {String} _search url
     * @return   {Object} url参数map对象
     */
    _module._$parseUrlParams = function(_search){
        var query = _search.split('?');

        if(query[1]){
            return _util._$query2object(query[1]);
        }else{
            return {};
        }
    };

    /**
     * 判断当前hash是否是那个umi
     * @method _$isRightUMI
     * @param {String} _hash 当前hash
     * @param {String} _umiP 目标umi
     * @return   {Boolean} 是否符合 
     */
    _module._$isRightUMI = function(_hash, _umiP){
        if(!_hash || !_umiP){
            return false;
        }

        var _umi = g.decodeURIComponent(_hash);
        var _lastIndex = _umi.indexOf('?');

        _lastIndex = (_lastIndex >= 0) ? _lastIndex : _umi.length;
        _umi = _umi.substring(_umi.indexOf('#') + 1, _lastIndex);

        return _umi == _umiP;
    };

    /**
     * 获取当前的Url，注意反编码url
     *
     *
     * @method _$getDecodeCurUrl
     * @param {Object} _urlParams url上带上的参数，可以添加，用于后端判断
     * @return {String} 拼接后的url
     */
    _module._$getDecodeCurUrl = function(_urlParams, _returnUrl) {
        var _returnUrl = _returnUrl || g.returnUrl || location.href;
        _returnUrl = g.encodeURI(g.decodeURI(_returnUrl));

        // 是否有hash
        var _hashIndex = _returnUrl.indexOf('#');
        var _hash = '';
        if (_hashIndex >= 0) {
            _hash = _returnUrl.substring(_hashIndex);
            _returnUrl = _returnUrl.substring(0, _hashIndex);
        }

        // //是否已经有参数
        var _hashParam = _returnUrl.indexOf('?');
        var _paramArr = [];
        if (_hashParam >= 0) {
            _paramArr = _module._$parseUrlParams(_returnUrl.substring(_hashParam));
            if (!_paramArr['from']) {
                _returnUrl += "&from=study";
            }
        } else {
            _returnUrl += "?from=study";
        }

        //加上url参数
        if (!!_urlParams) {
            _util._$forIn(_urlParams, function(_value, _key) {
                _returnUrl += "&" + _key + (!!_value ? ("=" + _value) : '');
            }, this);
        }

        _returnUrl += _hash;

        return _returnUrl;
    }

    /**
     * 获取returnUrl
     *
     *
     * @method _$getReturnUrl
     * @param {Object}  _urlParamsArr url上带上的参数，可以添加，用于后端判断
     * @return {String} 返回的url(base64)
     */
    _module._$getReturnUrl = function(_urlParamsArr, _returnUrl) {

        return _base64._$str2b64(_module._$getDecodeCurUrl(_urlParamsArr, _returnUrl));
    };
  
      
    return _module;
});
