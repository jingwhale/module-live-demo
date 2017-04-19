/**
 * --------------------jsbridge相关的util---------------------
 *
 * @module   jsbridgeUtil
 * @version  1.0
 * @author   hzzhanghanhui(hzzhanghanhui@corp.netease.com)
 * @path     eutil/jsbridgeUtil
 * --------------------------------------------------------
 */

NEJ.define([
    './adapter/nej.js',
    './versionUtil.js',
    './mobileUtil.js'],function(
        _adapter,
        _versionUtil,
        _mobileUtil
    ) {

        /**
         * jsbridge包含的方法(begin)---------------------------------------------
         *
         * _$isSupportOpenLiveRoom() 是否支持打开聊天室
         * _$openLiveRoom({liveRoomId:10000},function(){}) 打开聊天室
         *
         * jsbridge包含的方法(end)-----------------------------------------------
         */

        var g =  window,
            _module = {},
            _isAWV = _mobileUtil._$isAndroidWebView(),
            _isIWV = _mobileUtil._$isIosWebView();

        /**
         * _module._$isSupportOpenLiveRoom - 是否支持打开App内聊天室
         *
         * @param  {String} _platForm 平台，取值为 'iPhone' 'Android'
         * @param  {String} _v        版本，取值格式为 'x.x.x'
         * @return {Boolean}          是否支持，默认为发生了，true表示支持，false表示不支持
         */
        _module._$isSupportOpenLiveRoom = function() {
            // iPhone app 需要4.0.0以上
            if(_isIWV && (_isIWV.length > 1)){
                return !_versionUtil._$versionCompare('4.0.0',_isIWV[1]);
            // Android app 需要4.0.0以上
            }else if(_isAWV && (_isAWV.length > 1)){
                return !_versionUtil._$versionCompare('4.0.0',_isAWV[1]);
            }
            return false;
        };

        /**
         * _module._$openLiveRoom - 打开app内原生直播间模块
         *
         * @param  {Object} data 数据对象
         * @param  {Number} data.liveRoomId 直播间Id
         * @param  {type} cb   成功之后回调
         * @return {type}      description
         */
        _module._$openLiveRoom = function (data,cb) {
            // 不支持的话跳转
            if(!g.YixinJSBridge || !this._$isSupportOpenLiveRoom()) return;
            g.YixinJSBridge.call('openLiveRoom',{
                liveRoomId: data.liveRoomId // 直播间Id
            },cb);
        };

        return _module;
});
