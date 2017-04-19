/*
 * ------------------------------------------
 * 富媒体编辑器弹框按钮实现文件
 * @version  1.0
 * @author   hzwujiazhen(hzwujiazhen@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _v = _('nej.v'),
        _proEditorLinkButton,
        _supEditorLinkButton;

    /**
     * 富媒体编辑器按钮
     * @class   {nej.ui._$$EditorDialogButton} 富媒体编辑器弹框按钮
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *              title 说明文案 
     *              onclick 点击处理    
     */
    _p._$$EditorLinkButton = NEJ.C();
    _proEditorLinkButton = _p._$$EditorLinkButton._$extend(_p._$$EditorDialogButton);
    _supEditorLinkButton = _p._$$EditorLinkButton._$supro;

    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proEditorLinkButton.__reset = function(_options){
        this.__supReset(_options);
    };
    
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proEditorLinkButton.__destroy = function(){
        this.__supDestroy();
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proEditorLinkButton.__initNode = function(){
        this.__supInitNode();

        this.__cmd = 'link';
    };

    /**
     * 点击处理
     * @return {Void}
     */
    _proEditorLinkButton.__onClick = function(){
        if (this.__isDisabled) {
            return;
        };

        _p._$$LinkCard._$allocate(this.__dialogOption)._$show();
    };

    /**
     * 弹框关闭处理
     * @return {Void}
     */
    _proEditorLinkButton.__onchange = function(_data){
        this.__editor.execCommand(this.__cmd, {
            href : _data.href,
            textValue : _data.name,
            target : '_blank'
        });
    };

    return _p._$$EditorLinkButton;

};

NEJ.define(
      ['{lib}ui/base.js',
       './dialogButton.js',
       '../dialog/linkCard.js'],f);


