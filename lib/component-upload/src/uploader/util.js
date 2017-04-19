/**
 * ---------文件上传工具类处理------------------------------
 * 
 * @version 1.0
 * @author tangtianliang(tangtianliang@corp.netease.com)
 * @module   pool/component-upload/src/uploader/util
 * ---------------------------------------------------------
 */

NEJ.define([
    'base/util',
    'base/element',
    'util/template/tpl',
    './constant.js',
    'util/ajax/xdr'
], function(
    _u,
    _e,
    _t,
    _constant,
    _j,
    _util){

    var _g = window;
    var _cache = {};

    /**
     * 判断是否可以使用分块上传功能
     * @param {Void}
     *
     * @return {Boolean}
     */
    _util._$canUseFileUploadByBlobs = (function() {
        var _canCutUpload = !!_g.XMLHttpRequest && !!_g.Blob && !!Blob.prototype.hasOwnProperty("slice");

        return function() {
            return _canCutUpload;
        }
    })();

    /**
     * 分块上传文件
     * @param {Object} _options 支持的选项如下
     *        {FileObject} file 待上传的文件对象
     *        {Node}    form 
     *        {Number}  mode 请求代理模式
     *        {String}  bucket
     *        {String}  nosKey
     *        {String}  xNosToken 
     *        {Function} onload 上传成功的回调
     *        {Function} onuploading    progress回调
     *        {Function} onerror 上传失败的回调
     *
     * @return {String} 这次上传的id，用于终止上传
     */
    _util._$fileUploadByBlobs = function(_options) {
        var _file = _options.file;
            
        if (!_file) return;
            
        if (!_options.key) { // 如果有key说明是更新
            _options.key = _u._$randNumberString(); 
        };

        // 保存或者更新
        _cache[_options.key] = _cache[_options.key] || {};
        _cache[_options.key].options = _options; // 更新数据

        var _data = {
            'fileName' : encodeURIComponent(_options.fileName),
            'fileSize' : _file.size,
            'fileGmtModifiedTime' : _util._$getFileLastModifiedTime(_file), 
            'eduUploaderToken' : _options.eduUploaderToken,
            '_t' : (new Date()).getTime()
        }

        // 获取断点续传初始信息
        _j._$request(_constant.GET_UPLOAD_PROGRESS_URL, {
            type: 'json',
            method: 'GET',
            query : _data,
            mode: _options.mode,
            cookie: false,
            onload: function(_options, _data) {
                if (_data.code != 0) { // 错误
                    _options.onerror && _options.onerror(_data);
                }else{
                    var _res = _data.result; // result里面包含了context和offset

                    if (!_u._$isObject(_res)) {
                        _res = {};
                        _res.context = '';
                        _res.offset = 0;
                    }

                    // 请求回来之前就被abort了
                    if (!_cache[_options.key]) return;

                    if (_res.offset >= _file.size - 1) { // 上传已经完成
                        delete _cache[_options.key];

                        !!_options.onload && _options.onload();
                        return;
                    }

                    _res.initOffset = _res.offset; // 第一次的偏移

                    _cache[_options.key].data = _res;

                    _util.__uploadBlob(_options.key);
                }

            }._$bind(this, _options)
        });

        return _options.key;
    };

    // 分割文件
    _util.__blobSlice = function (_file, _offset, _len) {
        var _end = Math.min(_offset + _len, _file.size);
        return _file.slice(_offset, _end);
    }

    // 上传分块
    _util.__uploadBlob = function (_key) {
        var _obj = _cache[_key];
            
        if (!_obj) return; // 不存在可能是已经abort了

        // 新的blob
        var _op = _obj.options,
            _nosKey = _op.nosKey,
            _bucket = _op.bucket,
            _xNosToken = _op.xNosToken;

        _obj.blob = _util.__blobSlice(_op.file, _obj.data.offset, _constant.BLOBSIZE);

        var _complete = (_obj.data.offset + _obj.blob.size >= _op.file.size); // 是否是最后一块

        _op.form.action = _op.ip + '/' + _bucket + '/' + _nosKey + '?' +
                        'offset=' + _obj.data.offset + 
                        '&complete=' + _complete + 
                        (_obj.data.context ? '&context=' + _obj.data.context : '') + // 第一次可能没有context
                        '&version=1.0';
            
        var _uploading = function(_obj, _data) {
            var _proData = {
                timeStamp : (new Date()).getTime(), //_data.timeStamp,  // 时间戳
                loaded : _obj.data.offset + _data.loaded,
                total : _op.file.size,
                initOffset : _obj.data.initOffset
            }

            _op.onuploading(_proData);
        }

        var _onload = function(_obj, _data) {
            // 检查是否结束
            if (_data.errMsg) { // nos上传出错
                _op.onerror(_data);
            }else if (_obj.data.offset + _obj.blob.size >= _op.file.size) {
                // 完成上传
                delete _cache[_key];

                // 调用云课堂接口清空context和进度
                _obj.data.offset = 0;
                _obj.data.context = '';

                _util.__saveUploadProgress(_obj, function(_op, _data){
                    _op.onload(_data);
                }._$bind(this, _op, _data));
                
            } else {
                // 缓存进度
                _obj.data.offset = _obj.data.offset + _obj.blob.size; // 或者直接用_data.offset
                _obj.data.context = _data.context;

                // 调用云课堂接口保存上传进度
                _util.__saveUploadProgress(_obj, function(){
                    // 继续上传
                    _util.__uploadBlob(_key);
                })
            }
        }

        var _onerror = function(_data) {
            _op.onerror(_data);
        }

        var _options = {
            type: 'json',
            mode: _obj.options.mode,
            method: 'POST',
            timeout: 30 * 60 * 1000, // 超时：30分钟
            cookie: false,
            headers: {
                'Content-Type' : 'multipart/form-data',
                'x-nos-token' : _xNosToken
            },
            data: _obj.blob,
            onuploading: _uploading._$bind(this, _obj),
            onload: _onload._$bind(this, _obj),
            onerror: _onerror._$bind(this)
        }

        _cache[_key].reqId = _j._$request(_op.form.action, _options);

    }

    // 保存文件上传的进度
    _util.__saveUploadProgress = function(_obj, _callBack){
        var _options = _obj.options;

        var _data = {
            'fileName' : encodeURIComponent(_options.fileName),
            'fileSize' : _options.file.size,
            'context' : _obj.data.context,
            'offset' : _obj.data.offset,
            'fileGmtModifiedTime' : _util._$getFileLastModifiedTime(_options.file),
            'eduUploaderToken' : _options.eduUploaderToken,
            '_t' : (new Date()).getTime()
        }

        // 保存断点续传上传进度
        _j._$request(_constant.SAVE_UPLOAD_PROGRESS_URL, {
            type: 'json',
            method: 'GET',
            query : _data,
            mode: _options.mode,
            cookie: false,
            onload: function(_obj, _callBack, _data) {
                if (_data.code != 0) { // 错误
                    _options.onerror && _options.onerror(_data); 
                }else{
                    _callBack && _callBack();
                }

            }._$bind(this, _obj, _callBack)
        });

    }

    /**
     * 终止分块上传文件
     * @param {String} _key 上传id
     *
     * @return {Void}
     */
    _util._$abortFileUploadByBlobs = function(_key) {
        if (!!_cache[_key]) {
            _j._$abort(_cache[_key].reqId);

            _cache[_key] = null;
        }
    };

    // 获取文件大小
    _util._$getFileSize = function(_fileNode){
        if (!_fileNode.files) {
            return '';
        };

        if (!_fileNode.files[0]) {
            return '';
        };

        return _fileNode.files[0].size || '';
        
    }

    // 获取文件最后修改时间
    _util._$getFileLastModifiedTime = function(_fileNode){
        if (!_fileNode.files) {
            return '';
        };

        var _fileObj = _fileNode.files[0];

        if (!_fileObj) {
            return '';
        };

        if (_fileObj.lastModified) {
            return _fileObj.lastModified;
        }else if (_fileObj.lastModifiedDate) {
            return _fileObj.lastModifiedDate.getTime();
        }

        return '';
    };

    // 获取最终发送的上传类型
    _util._$getFinalUploadType = function(_type){
        if (_type == _constant.UPLOAD_FILE_TYPE_ATTACH_BIG) { // 大附件 跟 普通附件 一样
            return _constant.UPLOAD_FILE_TYPE_ATTACH;
        }else{
            return _type;
        }
    }

    return _util;
});
