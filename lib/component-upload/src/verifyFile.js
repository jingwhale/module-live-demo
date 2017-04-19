/**
 * ------------------ 统一的文件上传验证 ----------------------------
 * verifyFile
 * @version  1.0
 * @author hzwujiazhen(hzwujiazhen@corp.netease.com)
 *
 * @module pool/component-upload/src/util/verifyFile
 * ----------------------------------------------------------
 */
define([
    'pool/component-notify/src/notify/ui',
    './uploader/constant.js',
    'pool/edu-front-util/src/numUtil',
    './uploader/util.js'
], function(
    notifyUI,
    constant,
    numUtil,
    util
){

    // _fileNode是file节点，可以获取文件信息，不同浏览器有差异
    var verifyFile = function(fileName, fileNode, _sizeLimit){
        if (!fileName) {
            notifyUI && notifyUI.warning('文件类型错误');
            return false;
        };

        var _fileSuffix = fileName.slice(fileName.lastIndexOf('\.') + 1);

        var _suffixReg, _typeTxt;

        switch(+this.type){
            case constant.UPLOAD_FILE_TYPE_PDF:
                _suffixReg = /pdf/i;
                _typeTxt = '仅支持pdf格式的文件！';
                break;
            case constant.UPLOAD_FILE_TYPE_VIDEO:
                _suffixReg = /mp4|avi|rmvb|flv|wmv|mov|mpg|mpeg|rm|mkv/i;
                _typeTxt = '不支持该视频文件格式！';
                break;
            case constant.UPLOAD_FILE_TYPE_AUDIO:
                _suffixReg = /mp3/i;
                _typeTxt = '不支持该音频文件格式！';
                break;
            case constant.UPLOAD_FILE_TYPE_ATTACH:
            case constant.UPLOAD_FILE_TYPE_ATTACH_BIG:
                _suffixReg = /exe|dmg|app|xls|xlsx|ppt|pptx|doc|docx|pdf|txt|rar|zip|7z|gz|tar|png|jpg|jpeg|gif|bmp|mp3|midi|mid|wma|m4a|wav/i;
                _typeTxt = '不支持该附件文件格式！';
                break;
            
            case constant.UPLOAD_FILE_TYPE_CAPTION:
                _suffixReg = /srt/i;
                _typeTxt = '仅支持srt格式的字幕文件！';
                break;
            case constant.UPLOAD_FILE_TYPE_EXCEL:
                _suffixReg = /xls|xlsx/i;
                _typeTxt = '仅支持xls格式的文件！';
                break;
            case constant.UPLOAD_FILE_TYPE_IMAGE: // 图片
                _suffixReg = /jpg|png|jpeg|bmp|gif/i;
                _typeTxt = '请选择图片文件！';
                break;
            case constant.UPLOAD_FILE_TYPE_SCORM: // scorm
                _suffixReg = /zip/i;
                _typeTxt = '请选择zip文件！';
                break;
            default:
                break;
        }

        // 检查文件类型
        if (!!_fileSuffix) {
            if (!!_suffixReg && !_suffixReg.test(_fileSuffix)){
                notifyUI && notifyUI.warning(_typeTxt);
                return false;
            }
        }else{
            notifyUI && notifyUI.warning('文件类型错误');
            return false;
        }

        // 再检查文件大小限制
        var _fileSize = util._$getFileSize(fileNode);

        if (!_fileSize) { // 不支持判断文件大小
            return true;
        };

        var _sizeTxt;

        switch(+this.type){
            case constant.UPLOAD_FILE_TYPE_PDF:
                _sizeLimit = _sizeLimit ||  constant.UPLOAD_SIZE_MAX_PDF;
                _sizeTxt = 'pdf文件不能大于';
                break;
            case constant.UPLOAD_FILE_TYPE_VIDEO:
                if(util._$canUseFileUploadByBlobs()){
                    _sizeLimit = constant.UPLOAD_SIZE_MAX_VIDEO;
                    _sizeTxt = '视频文件不能大于';
                }else{
                    _sizeLimit = constant.UPLOAD_SIZE_IE_MAX_VIDEO;
                    _sizeTxt = '您的浏览器版本较低，视频文件不能大于';
                }
                break;

            case constant.UPLOAD_FILE_TYPE_AUDIO:
                _sizeLimit = _sizeLimit ||  constant.UPLOAD_SIZE_MAX_AUDIO;
                _sizeTxt = '音频文件不能大于';
                break;

            case constant.UPLOAD_FILE_TYPE_ATTACH:
                _sizeLimit = _sizeLimit ||  constant.UPLOAD_SIZE_MAX_ATTACH;
                _sizeTxt = '附件文件不能大于';
                break;

            case constant.UPLOAD_FILE_TYPE_ATTACH_BIG:
                if(util._$canUseFileUploadByBlobs()){
                    _sizeLimit = constant.UPLOAD_SIZE_MAX_ATTACH_BIG;
                    _sizeTxt = '附件文件不能大于';
                }else{
                    _sizeLimit = constant.UPLOAD_SIZE_IE_MAX_ATTACH_BIG;
                    _sizeTxt = '您的浏览器版本较低，附件文件不能大于';
                }
                break;

            case constant.UPLOAD_FILE_TYPE_CAPTION:
                _sizeLimit = _sizeLimit ||  constant.UPLOAD_SIZE_MAX_CAPTION;
                _sizeTxt = '字幕文件不能大于';
                break;
            case constant.UPLOAD_FILE_TYPE_EXCEL:
                _sizeLimit = _sizeLimit ||  constant.UPLOAD_SIZE_MAX_CAPTION;
                _sizeTxt = 'EXCEL文件不能大于';
                break;
            case constant.UPLOAD_FILE_TYPE_IMAGE: // 图片
                _sizeLimit = _sizeLimit ||  constant.UPLOAD_SIZE_MAX_IMAGE;
                _sizeTxt = '图片文件不能大于';
                break;
            case constant.UPLOAD_FILE_TYPE_SCORM:
                if(util._$canUseFileUploadByBlobs()){
                    _sizeLimit = constant.UPLOAD_SIZE_MAX_SCORM;
                    _sizeTxt = 'Scorm文件不能大于';
                }else{
                    _sizeLimit = constant.UPLOAD_SIZE_IE_MAX_SCORM;
                    _sizeTxt = '您的浏览器版本较低，Scorm文件不能大于';
                }

                break;
            default:
                break;
        }

        _sizeTxt = _sizeTxt + numUtil._$formatFileSize(_sizeLimit);

        if (_sizeLimit && _fileSize > _sizeLimit) {
            notifyUI && notifyUI.warning(_sizeTxt);
            return false;
        }

        return true;
    };

    return verifyFile;
});

