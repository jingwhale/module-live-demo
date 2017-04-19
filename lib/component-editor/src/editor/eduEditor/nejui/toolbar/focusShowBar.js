/*
 * ------------------------------------------
 * 富媒体编辑器toolbar实现文件
 * @version  1.0
 * @author   hzwujiazhen(hzwujiazhen@corp.netease.com)
 * ------------------------------------------
 */
var f = function(
    v,
    baseBar,
    s,
    key
){

    var _  = NEJ.P,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _proFocusShowBar,
        _supEduEditorToolbar;

    /**
     * 富媒体编辑器基类封装
     * @class   {nej.ui._$$EduEditorFocusShowBar} 富媒体编辑器基类封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *
     */
    var _$$EduEditorFocusShowBar = NEJ.C();
    _proFocusShowBar = _$$EduEditorFocusShowBar._$extend(baseBar);

    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proFocusShowBar.__init = function(){
        this.__supInit();

        v._$addEvent(this.__body, 'mouseover', this.__onPannelOver._$bind(this));
        v._$addEvent(this.__body, 'click', this.__onPannelClick._$bind(this));
        v._$addEvent(this.__body, 'mouseout', this.__onPannelOut._$bind(this));
    };

    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proFocusShowBar.__reset = function(_options){
        this.__supReset(_options);

        this.__toggleNodeDisplay(false);

        this.__editorEvent = _options.config.editorEvent;
        this.__editorEvent._$addEvent('focus',this.__onEditorFocus._$bind(this));
        this.__editorEvent._$addEvent('blur',this.__onEditorBlur._$bind(this));

    };

    /**
     * 子类重写
     *
     * @protected
     * @method {__onReady}
     * @return {Void}
     */
    _proFocusShowBar.__onReady = function () {
        _e._$style(this.__parent, {
            "top": "-39px",
            "position": "absolute"
        });
    };

    _proFocusShowBar.__onPannelOver = function () {
        this.__show();
    };

    _proFocusShowBar.__onPannelClick = function () {
        this.__show();
    };

    _proFocusShowBar.__onPannelOut = function () {
        if(!this.__focused){
            this.__hide();
        }
    };

    _proFocusShowBar.__onEditorFocus = function (event) {
        this.__focused = true;
        this.__show();
    };

    _proFocusShowBar.__onEditorBlur = function (event) {
        this.__focused = false;
        this.__hide();
    };

    _proFocusShowBar.__hide = function () {
        this.__hideTimeout = setTimeout(function () {
            this.__toggleNodeDisplay(false);
        }._$bind(this), 200);
    };

    _proFocusShowBar.__show = function () {
        if(this.__hideTimeout){
            this.__hideTimeout = clearTimeout(this.__hideTimeout);
        }

        this.__toggleNodeDisplay(true);
    };


    _proFocusShowBar.__toggleNodeDisplay = function (_bool) {
        if(_bool){
            _e._$style(this.__parent, {
                "display": "block"
            });
        }else{
            _e._$style(this.__parent, {
                "display": "none"
            });
        }
    };

    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proFocusShowBar.__destroy = function(){
        this.__editorEvent._$delEvent('focus',this.__onEditorFocus._$bind(this));
        this.__editorEvent._$delEvent('blur',this.__onEditorBlur._$bind(this));

        // 清除事件
        this.__supDestroy();
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proFocusShowBar.__initNode = function(){
        this.__supInitNode();
    };



    return _$$EduEditorFocusShowBar;
};

NEJ.define([
    'base/event',
    './baseBar.js',
    'pool/cache-base/src/setting',
    '../../../key.js'
],f);


