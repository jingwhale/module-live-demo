/**
 * ----------------------------------------------------------------
 *  文件上传常量，不可做完配置更改
 *  @version  1.0
 *  @author   hzlinannan(hzlinannan@corp.netease.com)
 *  @module   pool/component-upload/src/uploader/constant
 * ----------------------------------------------------------------
 */

NEJ.define([], function(){
    window.swfUrlMap = window.swfUrlMap || {};

    return {
        // 上传swf文件地址
        imgUploaderSwfLocalPath         : '../res/swf/imageUpload.swf',
        imgUploaderSwfRemoteUrl         : window.swfUrlMap.imageUpload,
        customImgUploaderSwfLocalPath   : '../res/swf/DragCutUpload_study2.swf',
        customImgUploaderSwfRemoteUrl   : window.swfUrlMap.DragCutUpload_study2,
        flashUploaderSwfLocalPath       : '../res/swf/EduFileBlobUpload.swf',
        flashUploaderSwfRemoteUrl       : window.swfUrlMap.EduFileBlobUpload,

        // 文件上传相关
        'NOS_FORM_UPLOAD_URL'           : 'http://nos.netease.com',   // nos web post上传的域名
        'NOS_GET_IP_URL'                : 'http://wanproxy.127.net/lbs',   // nos获取上传ip的接口

        'DEFAULT_INIT_UPLOAD_URL'       : 'http://up.study.163.com/j/uploader-server/UploaderCenterManager/getEduUploaderToken.do',  // 默认的应用认证接口
        'EXCHANGE_NOSTOKEN_URL'         : 'http://up.study.163.com/j/uploader-server/UploaderCenterManager/exchangeNosTokenByEduToken.do', // 交换获得nos上传的桶和key
        'GET_UPLOAD_PROGRESS_URL'       : 'http://up.study.163.com/j/uploader-server/UploaderCenterManager/getContext.do', // 获取断点续传信息
        'SAVE_UPLOAD_PROGRESS_URL'      : 'http://up.study.163.com/j/uploader-server/UploaderCenterManager/saveContext.do', // 设置断点续传信息
        'CHECK_FILE_COMPLETE_URL'       : 'http://up.study.163.com/j/uploader-server/UploaderCenterManager/checkUploadSuccess.do', // 文件完整校验

        'BLOBSIZE'                      : 100 * 1024, // 文件分块大小，100k

        // 建议的文件大小限制
        'UPLOAD_SIZE_MAX_PDF'           : 50*1024*1024,  // 50M
        'UPLOAD_SIZE_MAX_VIDEO'         : 3*1024*1024*1024,   // 如果支持断点续传，视频最大为3G
        'UPLOAD_SIZE_MAX_AUDIO'         : 500*1024*1024,   // 音频最大为500
        'UPLOAD_SIZE_IE_MAX_VIDEO'      : 100*1024*1024,   // 如果不支持断点续传则视频最大为100M
        'UPLOAD_SIZE_MAX_ATTACH'        : 50*1024*1024,      // 普通附件 50M
        'UPLOAD_SIZE_MAX_ATTACH_BIG'    : 200*1024*1024,      // 大附件 200M
        'UPLOAD_SIZE_IE_MAX_ATTACH_BIG' : 100*1024*1024,      // ie中大附件 100M
        'UPLOAD_SIZE_MAX_CAPTION'       : 5*1024*1024,  // 5M
        'UPLOAD_SIZE_MAX_IMAGE'         : 20*1024*1024,  // 20M
        'UPLOAD_SIZE_MAX_SCORM'         : 1*1024*1024*1024,   // 如果支持断点续传，scorm最大为3G
        'UPLOAD_SIZE_IE_MAX_SCORM'      : 100*1024*1024,   // 如果不支持断点续传则scorm最大为100M

        // 上传文件类型
        'UPLOAD_FILE_TYPE_PDF'          : 1,
        'UPLOAD_FILE_TYPE_VIDEO'        : 2,
        'UPLOAD_FILE_TYPE_ATTACH'       : 3,
        'UPLOAD_FILE_TYPE_ATTACH_BIG'   : 300, // 大附件类型，前端自定义，后端没有这个类型，请求里面还是发送3
        'UPLOAD_FILE_TYPE_CAPTION'      : 4,
        'UPLOAD_FILE_TYPE_IMAGE'        : 5,
        'UPLOAD_FILE_TYPE_EXCEL'        : 6,
        'UPLOAD_FILE_TYPE_SCORM'        : 7,  // scorm课件，zip格式
        'UPLOAD_FILE_TYPE_AUDIO'        : 8,  // 音频

        'PDF_FILE_EXTENSION'            : ['.pdf'],
        'VIDEO_FILE_EXTENSION'          : ['.mp4', '.avi', '.flv', '.rmvb', '.rm', '.wmv', '.mov', '.mpg', '.mpeg', '.rm', '.mkv'],
        'ATTACH_FILE_EXTENSION'         : ['.exe', '.dmg', '.app', '.xls', '.xlsx', '.ppt', '.pptx', '.doc', '.docx', '.pdf', '.txt', '.rar', '.zip', '.7z', '.gz', '.tar', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.mp3', '.midi', '.mid', '.wma', '.m4a', '.wav'],
        'ATTACH_FILE_EXTENSION_BIG'     : ['.exe', '.dmg', '.app', '.xls', '.xlsx', '.ppt', '.pptx', '.doc', '.docx', '.pdf', '.txt', '.rar', '.zip', '.7z', '.gz', '.tar', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.mp3', '.midi', '.mid', '.wma', '.m4a', '.wav'],
        'AUDIO_FILE_EXTENSION'          : ['.mp3'],
        'CAPTION_FILE_EXTENSION'        : ['.srt'],
        'IMAGE_FILE_EXTENSION'          : ['.jpg', '.png', '.jpeg', '.bmp', '.gif'],
        'EXCEL_FILE_EXTENSION'          : ['.xls', '.xlsx'],
        'SCORM_FILE_EXTENSION'          : ['.zip']
    }
});
