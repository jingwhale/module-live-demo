/*
 * ------------------------------------------
 * 富媒体编辑器弹框按钮实现文件
 * @version  1.0
 * @author   hzwujiazhen(hzwujiazhen@corp.netease.com)
 * ------------------------------------------
 */

 define([
    '{lib}ui/base.js',
    '{lib}util/ajax/xdr.js',
    './dialogButton.js',
    '../dialog/imageCard.js',
    'pool/component-upload/src/uploader/constant'
],function(
    _base,
    _j,
    _dialogButton,
    _imageCard,
    _constant
){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _v = _('nej.v'),
        _proEditorImageButton,
        _supEditorImageButton;

    /**
     * 富媒体编辑器按钮
     * @class   {nej.ui._$$EditorImageButton} 富媒体编辑器基类封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *              title 说明文案
     *              onclick 点击处理
     */
    _p._$$EditorImageButton = NEJ.C();
    _proEditorImageButton = _p._$$EditorImageButton._$extend(_p._$$EditorDialogButton);
    _supEditorImageButton = _p._$$EditorImageButton._$supro;

    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proEditorImageButton.__reset = function(_options){
        this.__supReset(_options);
        this.__imageConfig = _options.config.imageConfig || {setImageWH: false};
    };

    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proEditorImageButton.__destroy = function(){
        this.__supDestroy();
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proEditorImageButton.__initNode = function(){
        this.__supInitNode();

        this.__cmd = 'insertimage';
    };

    /**
     * 点击处理
     * @return {Void}
     */
    _proEditorImageButton.__onClick = function(){
        if (this.__isDisabled) {
            return;
        };

        _p._$$ImageCard._$allocate(this.__dialogOption)._$show();
    };

    /**
     * 弹框关闭处理
     * @return {Void}
     */
    _proEditorImageButton.__onchange = function(_data){
        // 图片缩放暂时不可用，因为涉及到editor.ui，主要是editor父元素的问题
        //this.__editor.setOpt('imageScaleEnabled', false);

        // this.__id = 0;

        this.__url = _data;
        var _nosInfoUrl = this.__url + '?imageInfo';
        if ((_nosInfoUrl.indexOf(_constant.NOS_FORM_UPLOAD_URL) != -1) && this.__imageConfig.setImageWH) {
            _j._$request(_nosInfoUrl, {
                type: 'json',
                method: 'get',
                mode: 0,
                headers: {
                    'x-nos-entity-type': 'json'
                },
                onload: function (_data) {
                    this.__editor.execCommand(this.__cmd, {
                        src: this.__url,
                        "class": 'eduEditor-img',
                        // id : this.__id
                        width: _data.Width,
                        height: _data.Height
                    });
                }._$bind(this),
                onerror: function () {
                    this.__editor.execCommand(this.__cmd, {
                        src: this.__url,
                        "class": 'eduEditor-img'
                    });
                }._$bind(this)
            });
        } else {
            this.__editor.execCommand(this.__cmd, {
                src: this.__url,
                "class": 'eduEditor-img'
            });
        }
    };

    return _p._$$EditorImageButton;

});




