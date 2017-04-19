/**
 * 播放器常量 
 */
NEJ.define([

], function(p, o, f, r){

	// 视频媒体的状态
    p.MEDIA_STATE = {
    	IDLE : 'IDLE',
		PLAYING : 'PLAYING',
		BUFFERING : 'BUFFERING',
		PAUSE : 'PAUSED',
		COMPLETE : 'COMPLETE'
	};

	// 支持的视频MIME_TYPE
	p.VIDEO_SOURSE_MIME_TYPE = {
        'mp4' : 'video/mp4',
        'm3u8' : 'application/x-mpegURL;application/vnd.apple.mpegURL;video/MP2T'
    };

    // 错误码
    p.ERROR_CODE = {
    	'VIDEO_DATA_ERROR_NO_URL' : 3, // 缺少视频地址
    	'VIDEO_DATA_ERROR_ENCRYPT' : 4, // 无法播放加密视频
        'MEDIA_ERROR_VIDEOTAG_NOT_SUPPORT' : 5, // video标签不支持
        'MEDIA_ERROR_SOURCETYPE_NOT_SUPPORT' : 6, // 视频文件不支持
        'MEDIA_ERROR_SOURCE_ERROR' : 7, // 视频源错误，一般是网络问题或者是地址错误
        'MEDIA_ERROR_VIDEO_ERROR' : 8 // 视频播放时的错误，一般是网络问题
    };

    // 错误文案
    p.ERROR_TXT = {
    	'3' : '缺少视频地址',
        '4' : '无法播放加密视频',
        '5' : '您的浏览器不支持视频播放',
        '6' : '不支持该视频播放',
        '7' : '网络不给力，请重试',
        '8' : '网络不给力，请重试'
    };

    // url
    p.URLMAP = {
        'GET_CDN_DATA' : 'http://study.163.com/cdn/getCdnPoint.htm' // 获取cdn数据的接口，需要配置跨域
    };

    // 其他常量
    p.VARCONST = {
        'SEEK_STEP' : 10,  // seek步长
        'VOLUME_STEP' : 0.2 // 音量步长
    }

	// 返回结果可注入给其他文件
    return p;
});
