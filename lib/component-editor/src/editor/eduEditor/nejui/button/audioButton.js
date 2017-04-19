/*
 * ------------------------------------------
 * 富媒体编辑器上传视频弹框按钮实现文件
 * @version  1.0
 * @author   hzlixinxin(hzlixinxin@corp.netease.com)
 * ------------------------------------------
 */

define([
    '{lib}ui/base.js',
    '{lib}util/ajax/xdr.js',
    './dialogButton.js',
    '../dialog/audioCard.js',
    'pool/component-upload/src/uploader/constant'
],function(
    _base,
    _j,
    _dialogButton,
    _audioCard,
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
        _proEditorAudioButton,
        _supEditorAudioButton;

    /**
     * 富媒体编辑器按钮
     * @class   {nej.ui._$$EditorAudioButton} 富媒体编辑器基类封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *              title 说明文案
     *              onclick 点击处理
     */
    _p._$$EditorAudioButton = NEJ.C();
    _proEditorAudioButton = _p._$$EditorAudioButton._$extend(_p._$$EditorDialogButton);
    _supEditorAudioButton = _p._$$EditorAudioButton._$supro;

    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proEditorAudioButton.__reset = function(_options){
        this.__supReset(_options);
        this.__imageConfig = _options.config.imageConfig || {setImageWH: false};
        // 绑定事件
    };

    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proEditorAudioButton.__destroy = function(){
        this.__supDestroy();
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proEditorAudioButton.__initNode = function(){
        this.__supInitNode();

        this.__cmd = 'insertaudio';
    };

    /**
     * 点击处理
     * @return {Void}
     */
    _proEditorAudioButton.__onClick = function(){
        if (this.__isDisabled) {
            return;
        };

        _p._$$audioCard._$allocate(this.__dialogOption)._$show();
    };

    /**
     * 弹框关闭处理
     * @return {Void}
     */
    _proEditorAudioButton.__onchange = function(_data){
        this.__editor.execCommand(this.__cmd, _data);
    };

    return _p._$$EditorAudioButton;

});




