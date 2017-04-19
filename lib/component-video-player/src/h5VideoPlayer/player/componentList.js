/**
 * 组件注册列表
 */
NEJ.define([
    'pool/edu-front-util/src/mobileUtil',
    '../component/boxComponent.js',
    '../component/movieDataComponent.js',
    '../component/mainVideoComponent.js',
    '../component/apiComponent.js',
    '../component/logComponent.js',
    '../component/videoDisplayComponent.js',
    '../component/videoCoverComponent.js',
    '../component/errorComponent.js',
    '../component/videoDisplayMobileComponent.js',
    '../component/preAdComponent.js',
    '../component/videoControlComponent.js',
    '../component/videoControlMobileComponent.js',
    '../component/videoMoreMenuMobileComponent.js',
    '../component/textTrackComponent.js',
    '../component/srtCaptionComponent.js',
    '../component/videoControlMobileLiveComponent.js'
], function(
    _mobileUtil,
    _boxComponent,
    _movieDataComponent,
    _mainVideoComponent,
    _apiComponent,
    _logComponent,
    _videoDisplayComponent,
    _videoCoverComponent,
    _errorComponent,
    _videoDisplayMobileComponent,
    _preAdComponent,
    _videoControlComponent,
    _videoControlMobileComponent,
    _videoMoreMenuMobileComponent,
    _textTrackComponent,
    _srtCaptionComponent,
    _videoControlMobileLiveComponent,
    p, o, f, r){
    
    /**
     * 可以根据平台或者浏览器返回不同的组件，顺序随意
     */
    var list = function(_config){
        var map = {};

        if(_config.useNative){
            map[_movieDataComponent.NAME] = _movieDataComponent;
            map[_mainVideoComponent.NAME] = _mainVideoComponent;
            map[_apiComponent.NAME] = _apiComponent;
            map[_logComponent.NAME] = _logComponent;
            return map
        }

        // 必要组件
        map[_boxComponent.NAME] = _boxComponent;
        map[_movieDataComponent.NAME] = _movieDataComponent;
        map[_mainVideoComponent.NAME] = _mainVideoComponent;
        map[_videoCoverComponent.NAME] = _videoCoverComponent;
        map[_errorComponent.NAME] = _errorComponent;
        map[_apiComponent.NAME] = _apiComponent;
        map[_logComponent.NAME] = _logComponent;

        if (_mobileUtil._$isMobileAll()) {
            map[_videoDisplayMobileComponent.NAME] = _videoDisplayMobileComponent;

            if (_config.mode == 'live') {
                map[_videoControlMobileLiveComponent.NAME] = _videoControlMobileLiveComponent;
            }else{
                map[_videoControlMobileComponent.NAME] = _videoControlMobileComponent;
                map[_videoMoreMenuMobileComponent.NAME] = _videoMoreMenuMobileComponent;
                map[_textTrackComponent.NAME] = _textTrackComponent;
            }
            
        }else{
            map[_videoDisplayComponent.NAME] = _videoDisplayComponent;
            map[_preAdComponent.NAME] = _preAdComponent;
            map[_videoControlComponent.NAME] = _videoControlComponent;
            map[_srtCaptionComponent.NAME] = _srtCaptionComponent;
        }

        return map;
    }

    // 返回结果可注入给其他文件
    return list;
});
