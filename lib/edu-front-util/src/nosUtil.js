/**
 * ---------------------- NOS处理UTIL -----------------------
 *
 * @module nosUtil
 * @version  1.0
 * @author   hzshaoyy(hzshaoyy@corp.netease.com)
 * @path     pro/common/nosUtil
 * ----------------------------------------------------------
 */

NEJ.define([
    'util/ajax/xdr',
    'util/encode/md5',
    './adapter/nej.js'
], function (
    _xdr,
    _md5,
    _adapter
) {

    var _module = {},
        g = (function(){return this;})();

    /**
     * 获取NOS文件中的内容
     *
     * 需要在NEJ.define前配置
     *
     * window.NEJ_CONF = {
     *   // 多个域名在这里配置
     *   p_frame:['http://nos.netease.com/edu-common-public/res/nej_proxy_frame.html']
     * };
     *
     *
     * @method _$getNosText
     * @param  {String} _filePath Nos文本地址
     * @param  {Object} _options
     * @param  {Function} _options.method
     * @param  {Function} _options.onload
     * @param  {Function} _options.onerror
     * @return {Text} 文本内容
     */
    _module._$getNosText = function(_filePath, _options){
        var _sign = "?";

        _options.method = _options.method || 'GET';

        if(!_filePath){
            return false;
        }

        if(_filePath.indexOf('?') > 0){
            _sign = '&';
        }

        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }

        _filePath = [_filePath, _sign, 'from=', _md5._$str2hex(window.location.origin)].join('');

        _xdr._$request(_filePath, {
            onload: _options.onload,
            method: _options.method,
            mode: 0,
            onerror: _options.onerror
        });

    };


    return _module;
});
