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
        _proEditorDialogButton,
        _supEditorDialogButton;

    var _htmlTpl = '<div class="zitm zbg" title=""><div class="zicn zbg"></div></div>';

    /**
     * 富媒体编辑器按钮
     * @class   {nej.ui._$$EditorButton} 富媒体编辑器基类封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *              title 说明文案 
     *              onclick 点击处理    
     */
    _p._$$EditorDialogButton = NEJ.C();
    _proEditorDialogButton = _p._$$EditorDialogButton._$extend(_p._$$Abstract);
    _supEditorDialogButton = _p._$$EditorDialogButton._$supro;

    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proEditorDialogButton.__init = function(){
        this.__supInit();
    };

    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proEditorDialogButton.__reset = function(_options){
        this.__supReset(_options);
            
        this.__title = _options.title || '';
        this.__editor = _options.editor;
        this.__config = _options.config;

        this.__dialogOption = {
            onchange : this.__onchange._$bind(this),
            config : this.__config
        };

        this.__body.title = this.__title;

        this._$setDisabled(false);

        // 绑定事件
        this.__editor.addListener('selectionchange', function(type, causeByUi, uiReady){
            var _state = this.__editor.queryCommandState(this.__cmd);

            if (_state == -1) {
                this._$setDisabled(true);
            } else {
                if (!uiReady) {
                    this._$setDisabled(false);
                }
            }
        }._$bind(this));
    };
    
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proEditorDialogButton.__destroy = function(){
        this.__supDestroy();
    };

    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proEditorDialogButton.__initXGui = function(){
        this.__seed_html = _e._$addNodeTemplate(_htmlTpl);
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proEditorDialogButton.__initNode = function(){
        this.__supInitNode();

        this.__isDisabled = false;

        _v._$addEvent(this.__body, 'click', this.__onClick._$bind(this));
    };

    /**
     * 不可操作
     * @return {Void}
     */
    _proEditorDialogButton._$setDisabled = function(_isDisabled){
        this.__isDisabled = _isDisabled;

        if (_isDisabled) {
            _e._$addClassName(this.__body, 'js-disabled');
        }else{
            _e._$delClassName(this.__body, 'js-disabled');
        }
    };

    /**
     * 是否不可操作
     * @return {Void}
     */
    _proEditorDialogButton._$isDisabled = function(){
        return this.__isDisabled;
    };

    /**
     * 点击处理
     * @return {Void}
     */
    _proEditorDialogButton.__onClick = function(){
       
    };

    /**
     * 弹框关闭处理
     * @return {Void}
     */
    _proEditorDialogButton.__onchange = function(_data){
        
    };

    return _p._$$EditorDialogButton;
};

NEJ.define(
      ['{lib}ui/base.js'],f);


