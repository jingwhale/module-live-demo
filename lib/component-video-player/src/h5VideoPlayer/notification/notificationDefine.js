/**
 * 所有组件消息定义
 */
NEJ.define([
	
], function(
	_base,
    p, o, f, r){

	// 消息名称命名规则：大写，组件名称 + 下划线 + 动作或者逻辑名称
	var allNotifications = {

		// movieData组件消息
		'MOVIEDATA_NEW' : 'moviedata_new', // 新的视频数据
		'MOVIEDATA_ERROR' : 'moviedata_error', // 视频数据错误消息
		'MOVIEDATA_READY' : 'moviedata_ready', // 视频数据完毕
		'MOVIEDATA_CURRENT_ITEM_CHANGE' : 'moviedata_current_item_change', // 当前清晰度变化
		'MOVIEDATA_CURRENT_CDN_CHANGE' : 'moviedata_current_cdn_change', // 当前线路变化

		// mianVideo组件消息
		'MAINVIDEO_VIDEO_READY' : 'mainvideo_videoready', // video就绪
		'MAINVIDEO_BEFORE_LOAD' : 'mainvideo_beforeload', // 加载视频之前
		'MAINVIDEO_START_LOAD' : 'mainvideo_startload', // 开始加载新视频
		'MAINVIDEO_STATE' : 'mainvideo_state', // 视频状态
		'MAINVIDEO_META' : 'mainvideo_meta', // 获得meta
		'MAINVIDEO_BEFORE_PLAY' : 'mainvideo_beforePlay', // 开始播放之前
		'MAINVIDEO_QUALITY_CHANGE' : 'mainvideo_qualitychange', // 清晰度改变
		'MAINVIDEO_RATE_CHANGE' : 'mainvideo_ratechange', // 速率改变
		'MAINVIDEO_BUFFER' : 'mainvideo_buffer', // 正在缓冲
		'MAINVIDEO_BUFFER_FULL' : 'mainvideo_bufferfull', // 缓冲满
		'MAINVIDEO_TIME' : 'mainvideo_time', // 播放进度
		'MAINVIDEO_ERROR' : 'mainvideo_error', // 视频错误
		'MAINVIDEO_VOLUME' : 'mainvideo_volume', // 音量改变
		'MAINVIDEO_VOLUME_INCREASE' : 'mainvideo_volume_increase', // 音量递增反馈
		'MAINVIDEO_VOLUME_DECREASE' : 'mainvideo_volume_decrease', // 音量递减反馈
		'MAINVIDEO_MUTE' : 'mainvideo_mute', // 静音
		'MAINVIDEO_SEEK' : 'mainvideo_seek', // 拖动
		'MAINVIDEO_SEEK_FORWARD' : 'mainvideo_seek_forward', // 快进反馈
		'MAINVIDEO_SEEK_BACKWARD' : 'mainvideo_seek_backward', // 快退反馈

		// box组件消息，目前只有全屏消息，有需要可以添加resize消息
		'BOX_FULLSCREEN_CHANGE' : 'mainvideo_fullscreen_change', // 全屏

		// 其他通用组件消息
		'VIEW_LOAD' : 'view_load', // 点击加载，内容：无
        'VIEW_RELOAD' : 'view_reload', // 点击重新加载，内容：无
		'VIEW_PLAY' : 'view_play', // 点击播放，内容：无
		'VIEW_PAUSE' : 'view_pause', // 点击暂停，内容：position 暂停的时刻
		'VIEW_SEEK' : 'view_seek', // 拖动，内容：{'oldData':12, 'newData':40}
		'VIEW_SEEK_FORWARD' : 'view_seek_forward', // 快进，内容：无
		'VIEW_SEEK_BACKWARD' : 'view_seek_backward', // 快退，内容：无
		'VIEW_VOLUME' : 'view_volume', // 改变音量，内容：0.5 音量值
		'VIEW_VOLUME_INCREASE' : 'view_volume_increase', // 音量递增，内容：无
		'VIEW_VOLUME_DECREASE' : 'view_volume_decrease', // 音量递减，内容：无
		'VIEW_MUTE' : 'view_mute', // 静音，内容：true/false
		'VIEW_QUALITY' : 'view_quality', // 改变清晰度，内容：{'oldData':{'name':'标清', 'quailty':1}, 'newData':{'name':'高清', 'quailty':2}}
		'VIEW_CAPTION' : 'view_caption', // 改变字幕状态，内容：{'oldData':['英文'], 'newData':['中文', '英文']}
		'VIEW_FULLSCREEN' : 'view_fullscreen', // 全屏，内容：无
		'VIEW_RATE' : 'view_rate', // 改变倍数，内容：0.5 倍数
		'VIEW_CDN' : 'view_cdn', // 改变线路，内容：{'oldData':{'isp':'sd', 'ispName':'电信'}, 'newData':{'isp':'sd', 'ispName':'电信'}}
		'VIEW_ANCHOR' : 'view_anchor', // 驻点触发，内容：{'time':10}
		'VIEW_MORE_MENU': 'view_more_munu', //更多菜单 内容：无
		
		'VIEW_CAPTION_SELECT': 'view_caption_select', // 显示字幕 内容：{'oldData':['英文'], 'newData':['中文', '英文']}

		'VIEW_PREAD_START': 'view_pread_start', // 片头广告开始 内容：无
		'VIEW_PREAD_END': 'view_pread_end', // 片头广告结束 内容：无

		'VIDEO_CONTROL_DOM_READY':'video_control_dom_ready',   // 用于监听,控制条组件dom已插入文档 内容:根元素 顺序:在MAINVIDEO_META之后
		'VIDEO_CONTROL_SHOW':'video_control_show',			// 控制条组件显示 内容:无
		'VIDEO_CONTROL_HIDE':'video_control_hide'			// 控制条组件隐藏 内容:无
	};

	return allNotifications;
});
