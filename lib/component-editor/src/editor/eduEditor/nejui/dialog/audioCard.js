/**
 * ------------------------------------------
 * 富媒体编辑器超链接控件实现文件
 * @version  1.0
 * @author   hzwujiazhen(hzwujiazhen@corp.netease.com)
 * ------------------------------------------
 */
define([
    'pool/component-upload/src/custom-file-upload/ui',
    '{lib}ui/layer/window.wrapper.js',
    '{lib}util/tab/tab.js',
    'text!./audioCard.html',
    'pool/component-upload/src/uploader/constant',
    'pool/component-upload/src/uploader/util',
    'util/ajax/xdr'
],function(
    _fileUploader,
    _window,
    _tab,
    _template,
    _constant,
    _uploadUtil,
    xdr
){
    var  _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _v = _('nej.v'),
        _g = window,
        _proAudioCard,
        _supAudioCard;

    /**
     * 图片上传控件
     * @class   图片上传控件
     * @extends {nej.ui.cmd._$$WindowWrapper}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     *                            onselect  [Function] - 字号选中回调函数
     */
    _p._$$audioCard = NEJ.C();
    _proAudioCard = _p._$$audioCard._$extend(_p._$$WindowWrapper);
    _supAudioCard = _p._$$audioCard._$supro;

    /**
     * 初始化外观信息
     * @return {Void}
     */
    _proAudioCard.__initXGui = function(){
        this.__seed_html = _e._$addNodeTemplate(_e._$getHtmlTemplate(_e._$addHtmlTemplate(_template)));
    };

    /**
     * 初始化节点
     */
    _proAudioCard.__initNode = function(){
        this.__supInitNode();

        this.__uploadNode = _e._$getByClassName(this.__body, 'j-uploadArea')[0];
        this.__tipNode = _e._$getByClassName(this.__body, 'j-tips')[0];
    };


    /**
     * 重置卡片
     * @param {Object} _options
     */
    _proAudioCard.__reset = function(_options){
        _options = _options || {};

        _options.clazz = 'ux-eduEditorDialog ux-editor-InsertVideoDialog';
        _options.parent = _options.parent || document.body; // 默认以document为parent
        _options.draggable = _options.draggable || false;
        _options.title = _options.title || '插入音频';
        _options.mask  = "ux-editor-dialog-mask";
        _options.destroyable = true;

        this.__supReset(_options);

        this.__config = _options.config; // 编辑器配置
        this.__videoUrl = null;

        this.__toggleNodesShow(this.__tipNode, true);

        this.__uploaderUI = new _fileUploader({
            data: {
                type : _constant.UPLOAD_FILE_TYPE_AUDIO,
                btnTxt : '选择音频',
                sizeLimit: 100*1024*1024,
                btnClassName : this.__config.imgUploadBtnClassName || 'ux-upload-btn',
                btnDisableClassName : this.__config.imgUploadBtnDisableClassName || 'ux-upload-btn-disabled'
            }
        }).$inject(this.__uploadNode);

        this.__uploaderUI.$on("beginUpload", this.__onbeginUpload._$bind(this));
        this.__uploaderUI.$on("finishUpload", this.__onfinishUpload._$bind(this));
        this.__uploaderUI.$on("abortUpload", this.__onabortUpload._$bind(this));
        this.__uploaderUI.$on("onUploadError", this.__onUploadError._$bind(this));
    };

    /**
     * 上传音频开始
     *
     * @param _data
     * @return {null}
     * @private
     */
    _proAudioCard.__onbeginUpload = function () {
        this.__toggleNodesShow(_e._$get('j-uploadbtnwrap'), false);
        this.__toggleNodesShow(this.__tipNode, false);
    };

    /**
     * 终止上传音频
     *
     * @param _data
     * @return {null}
     * @private
     */
    _proAudioCard.__onabortUpload = function () {
        this.__toggleNodesShow(_e._$get('j-uploadbtnwrap'), true);
        this.__toggleNodesShow(this.__tipNode, true);
    };

    /**
     * 上传音频失败
     *
     * @param _data
     * @return {null}
     * @private
     */
    _proAudioCard.__onUploadError = function () {
        this.__toggleNodesShow(_e._$get('j-uploadbtnwrap'), true);
        this.__toggleNodesShow(this.__tipNode, true);
    };

    /**
     * 上传音频结束
     *
     * @param _data
     * @return {null}
     * @private
     */
    _proAudioCard.__onfinishUpload = function (_data) {
        var _nosPath = "http://edu-media.nosdn.127.net/" + _data.nosKey;
        this.__videoUrl = _nosPath;

        if(!_data.nosKey){
            return null;
        }

        this._$dispatchEvent('onchange', {
            url: this.__videoUrl,
            fileName: _data.fileName || "未命名"
        });

        this._$hide();
    };

    /**
     * 控制节点显示隐藏
     *
     * @param _node
     * @param _bool
     * @return {null}
     * @private
     */
    _proAudioCard.__toggleNodesShow = function(_node, _bool){
        if(_bool){
            _e._$style(_node, {
                "display": "block"
            });
        }else{
            _e._$style(_node, {
                "display": "none"
            });
        }
    }

    /**
     * 销毁卡片
     */
    _proAudioCard.__destroy = function(){
        if (!!this.__uploaderUI) {
            this.__uploaderUI.destroy();
        };

        this.__supDestroy();
    };

    return _p._$$audioCard;

});



