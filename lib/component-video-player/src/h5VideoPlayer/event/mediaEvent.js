/**
 * media事件定义
 */
NEJ.define([
	
], function(
	_base,
    p, o, f, r){

	var MediaEvent = {
		MEDIA_VIDEO_READY : 'mediaVideoReady',
		MEDIA_BEFORE_LOAD : 'mediaBeforeLoad',
		MEDIA_START_LOAD : 'mediaStartLoad',
		MEDIA_META : 'mediaMeta',
		MEDIA_BEFORE_PLAY : 'mediaBeforePlay',
		MEDIA_QUALITY_CHANGE : 'mediaQualityChange',
		MEDIA_RATE_CHANGE : 'mediaRateChange',
		MEDIA_BUFFER : 'mediaBuffer',
		MEDIA_BUFFER_FULL : 'mediaBufferFull',
		MEDIA_TIME : 'mediaTime',
		MEDIA_ERROR : 'mediaError',
		MEDIA_VOLUME : 'mediaVolume',
		MEDIA_VOLUME_INCREASE : 'mediaVolumeIncrease',
		MEDIA_VOLUME_DECREASE : 'mediaVolumeDecrease',
		MEDIA_MUTE : 'mediaMute',
		MEDIA_SEEK : 'mediaSeek',
		MEDIA_SEEK_FORWARD : 'mediaSeekForward',
		MEDIA_SEEK_BACKWARD : 'mediaSeekBackward'
	};

	return MediaEvent;
});
