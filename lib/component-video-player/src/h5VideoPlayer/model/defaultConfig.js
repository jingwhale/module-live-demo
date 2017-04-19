/**
 * 播放器默认配置
 */
NEJ.define([

], function(p, o, f, r){

    p.host = 'http://study.163.com';
    p.isLocal = false;
    p.mode = 'playback';  // 点播或者直播：'playback' 'live'
    p.useNative = false;
    p.showPauseAd = true;
    p.innerSite = true;   // 暂时没用到
    p.autoStart = false;
    p.isPreload = false; // 开启预加载
    p.beforeLoad = false; // 支持加载前处理，暂时不暴露 
    p.beforePlay = true; // 支持播放前，不暴露
    p.rate = 1; // 默认播放速率，不暴露
    p.volume = 0.8;
    p.mute = false;
    p.defaultQuality = 1;
    p.showCdnSwitch = true;
    p.notAllowFullScreen = false;

    // 返回结果可注入给其他文件
    return p;
});
