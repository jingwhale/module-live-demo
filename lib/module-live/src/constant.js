/**
 * LiveMobileConstant 模块实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 * @module   pool/module-live/src/component/live-mobile-player/live-mobile-constant
 */
NEJ.define([
    
],function(
    
){ 
    var LiveMobileConstant = {};

    // 直播模式
    LiveMobileConstant['LIVE_NORMAL_MODE'] = 0;  // 非cdn模式
    LiveMobileConstant['LIVE_CDN_MODE'] = 1; // cdn模式

    // 直播推流类型
    LiveMobileConstant['LIVE_METHOD_TYPE_TANGQIAO'] = 0;  // 唐桥
    LiveMobileConstant['LIVE_METHOD_TYPE_OBS'] = 1; // obs
    
    // 兼容1.0直播状态
    if (!window.useOldLiveConstant) {
        // 2.0直播状态
        LiveMobileConstant['LIVE_STATUS_NOTSTART'] = 35; // 未开始
        LiveMobileConstant['LIVE_STATUS_PLAYING'] = 0; // 正在直播中
        LiveMobileConstant['LIVE_STATUS_END'] = 10;  // 直播结束，正在转码总
        LiveMobileConstant['LIVE_STATUS_TRANSFORM_COMPLETE'] = 15; // 转码成功
        LiveMobileConstant['LIVE_STATUS_COMING'] = 20; // 即将开始直播
        LiveMobileConstant['LIVE_STATUS_DELAY_START'] = 25; // 直播主持人未按时开播
        LiveMobileConstant['LIVE_STATUS_INVALID'] = 30; // 直播已经失效
    }else{  
        LiveMobileConstant['LIVE_STATUS_NOTSTART'] = 0; // 未开始
        LiveMobileConstant['LIVE_STATUS_PLAYING'] = 1; // 正在直播中
        LiveMobileConstant['LIVE_STATUS_END'] = 2;  // 直播结束，正在转码总
        LiveMobileConstant['LIVE_STATUS_TRANSFORM_COMPLETE'] = 3; // 转码成功
        LiveMobileConstant['LIVE_STATUS_COMING'] = 4; // 即将开始直播
        LiveMobileConstant['LIVE_STATUS_DELAY_START'] = 5; // 直播主持人未按时开播
        LiveMobileConstant['LIVE_STATUS_INVALID'] = 6; // 直播已经失效
    }

    return LiveMobileConstant;
});
