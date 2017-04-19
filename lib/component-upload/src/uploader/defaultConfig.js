/**
 * ----------------------------------------------------------------
 *  上传默认配置
 *  @version  1.0
 *  @module   pool/component-upload/src/uploader/defaultConfig
 * ----------------------------------------------------------------
 */
NEJ.define([
	'base/util',
	'./constant.js'
], function(
	_util, 
	_constant,
	p, o, f, r){

	p.isLocal = false;
	p.isdev = false;
	p.txt = '上传'; // 上传按钮文案
	p.btnClassName = ''; // 上传按钮类
	p.btnDisableClassName = ''; // 禁用的按钮类
	p.type = _constant.UPLOAD_FILE_TYPE_VIDEO; // 默认上传的文件类型
	p.mode = 0; // 跨域模式

	// 应用认证接口，不同应用接口不一样
	// 机构课程：study.163.com/j/coursedesign/TermManager/getEduUploaderToken.json
	// 企业课程：*.corp.study.163.com/j/coursedesign/TermManager/getEduUploaderToken.json
	p.initUploadUrl = _constant.DEFAULT_INIT_UPLOAD_URL;  

    p.verifyFile = null; // 文件后缀过滤数组
    p.onBeginUpload = null; // 开始上传事件
    p.onUpdateProgress = null; // 开始上传事件
    p.onFinishUpload = null; // 开始上传事件
    p.onUploadError = null; // 上传出错事件

	var getDefaultConfig = function(){
		// 如果有uploaderDefaultConfig，则覆盖
		if (window.uploaderDefaultConfig) {
			p = _util._$merge(p, window.uploaderDefaultConfig);
		};

		return p;
	}

    return getDefaultConfig;
});
