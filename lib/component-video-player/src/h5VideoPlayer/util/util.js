/**
 * 字符串工具类
 */
NEJ.define([
    '../model/constant.js',
    'pool/edu-front-util/src/timeUtil'
], function(
    _constant,
    _timeUtil,
    p, o, f, r){
    var _testVideo = document.createElement('video');

    // 是否支持video标签
    p.supportVideo = function(){
        var _support = !!_testVideo.canPlayType;

        try{
            _testVideo.canPlayType('video/mp4');
        }catch(e){
            _support = false;
        }
        
        return _support;
    },

    // 检查视频能否播放
    p.checkVideoCanPlay = function(type){
        var _types = type.split(';');

        var _canplay = false;

        for (var i = 0; i < _types.length; i++) {
            _canplay = _testVideo.canPlayType(_types[i]) != '';

            if (_canplay) {
                return _canplay;
            };
        };

        return _canplay;
    }

    // 获取视频MIMEType
    p.getVideoMIMEType = function(src){
        if(!src) return false;

        var _srcShort = src.split(/\?/)[0]; //判断视频类型
        var _ss = _srcShort.split('.');
        var _fileType = _ss[_ss.length - 1];
        var _mediaType = _constant.VIDEO_SOURSE_MIME_TYPE[_fileType];

        if(!!_mediaType){
            return _mediaType;
        }

        return false;
    },

    // 是否支持texttrack字幕
    p.supportTexttrack = function(){
        // todo

    },

    // 是否支持音量改变
    p.supportVolumeChange = function(){
        try {
            var _volume =  _testVideo.volume;
            _testVideo.volume = (_volume / 2) + 0.1;

            return _volume !== _testVideo.volume;
        } catch(e) {
            return false;
        }
    },

    // 是否支持速率改变
    p.supportRateChange = function(){
        try {
            var _playbackRate = _testVideo.playbackRate;
            _testVideo.playbackRate = (_playbackRate / 2) + 0.1;

            return _playbackRate !== _testVideo.playbackRate;
        } catch(e) {
            return false;
        }

    },

    /**
     * 格式化视频时间
     */
    p.formatVideoTime = function(_seconds){
        _seconds = (_seconds || 0);
        var _minute = parseInt(_seconds / 60);
        var _second = parseInt(_seconds % 60);
        
        return (_minute < 10 ? '0'+_minute : _minute) + ':' + (_second < 10 ? '0'+_second : _second);
    }

    /**
     * 格式化直播时间
     */
    p.formatLiveTime = function(_startTime, _endTime){
        if (new Date(Number(_startTime)).getFullYear() != new Date().getFullYear()) { // 当年
            return _timeUtil._$formatTime(_startTime, 'yyyy年MM月dd日 HH:mm') + ' - ' + _timeUtil._$formatTime(_endTime, 'HH:mm');                
        }

        return _timeUtil._$formatTime(_startTime, 'MM月dd日 HH:mm') + ' - ' + _timeUtil._$formatTime(_endTime, 'HH:mm');
    }


    /**
     * 获取图片尺寸
     * @param   {String}    图片路径
     * @param   {Function}  尺寸就绪
     * @param   {Function}  加载完毕 (可选)
     * @param   {Function}  加载错误 (可选)
     * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
            alert('size ready: width=' + this.width + '; height=' + this.height);
        });
     */
    p.imgReady = (function () {
        var list = [], intervalId = null,

        // 用来执行队列
        tick = function () {
            var i = 0;
            for (; i < list.length; i++) {
                list[i].end ? list.splice(i--, 1) : list[i]();
            };
            !list.length && stop();
        },

        // 停止所有定时器队列
        stop = function () {
            clearInterval(intervalId);
            intervalId = null;
        };

        return function (url, ready, load, error) {
            var onready, width, height, newWidth, newHeight,
                img = new Image();

            img.src = url;

            // 如果图片被缓存，则直接返回缓存数据
            if (img.complete) {
                ready(img);
                load && load(img);
                return;
            };

            width = -1; //img.width;
            height = -1; //img.height;

            // 加载错误后的事件
            img.onerror = function () {
                error && error(img);
                onready.end = true;
                img = img.onload = img.onerror = null;
            };

            // 图片尺寸就绪
            onready = function () {
                newWidth = img.width;
                newHeight = img.height;
                if (newWidth !== width || newHeight !== height) {
                    ready(img);
                    onready.end = true;
                };
            };
            onready();

            // 完全加载完毕的事件
            img.onload = function () {
                // onload在定时器时间差范围内可能比onready快
                // 这里进行检查并保证onready优先执行
                !onready.end && onready();

                load && load(img);

                // IE gif动画会循环执行onload，置空onload即可
                img = img.onload = img.onerror = null;
            };

            // 加入队列中定期执行
            if (!onready.end) {
                list.push(onready);
                // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                if (intervalId === null) intervalId = setInterval(tick, 40);
            };
        };
    })();
        
    // 返回结果可注入给其他文件
    return p;
});
