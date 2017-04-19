/*
 * ------------------------------------------
 * 富媒体编辑器toolbar实现文件
 * @version  1.0
 * @author   hzwujiazhen(hzwujiazhen@corp.netease.com)
 * ------------------------------------------
 */
var f = function(
    baseBar,
    s,
    key
){

    var _  = NEJ.P,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _v = _('nej.v'),
        _p = _('nej.ui'),
        _proAutoScrollbar,
        _supEduEditorToolbar;

    /**
     * 富媒体编辑器基类封装
     * @class   {nej.ui._$$EduEditorAutoScrollbar} 富媒体编辑器基类封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *
     */
    var _$$EduEditorAutoScrollbar = NEJ.C();
    _proAutoScrollbar = _$$EduEditorAutoScrollbar._$extend(baseBar);

    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proAutoScrollbar.__init = function(){
        this.__supInit();
    };

    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proAutoScrollbar.__reset = function(_options){
        this.__supReset(_options);

    };

    /**
     * 子类重写
     *
     * @protected
     * @method {__onReady}
     * @return {Void}
     */
    _proAutoScrollbar.__onReady = function () {
        this.__calculateTop();
        this.__setAutoFixed();
    };

    /**
     * 计算toolbar的属性
     * @private
     * @method {__calculateTop}
     * @return {Void}
     */
    _proAutoScrollbar.__calculateTop = function () {
        this.__offset = _e._$offset(this.__body, document);
        this.__boxHeight = this.__parent.clientHeight;
        this.__boxWidth = this.__parent.clientWidth;
        this.__toolbarOffsetTop = s.get(key)['TOOLBAR_AUTO_FIX_TOP_OFFSET'] || 0;
    };

    /**
     * 设置吸顶功能
     * @private
     * @method {__setAutoFixed}
     * @return {Void}
     */
    _proAutoScrollbar.__setAutoFixed = function () {
        _v._$addEvent(window, "scroll", function () {
            var box = _e._$getPageBox(),
                editorHeight = this.__contentWrap.scrollHeight,
                scrollTop = box.scrollTop + this.__toolbarOffsetTop,
                editorBottom = this.__offset.y + editorHeight,
                offsetInner = 0;

            if(scrollTop > this.__offset.y && scrollTop <= editorBottom){
                if(scrollTop >= editorBottom - this.__boxHeight){
                    offsetInner = ( editorBottom - this.__boxHeight ) - scrollTop;
                }

                _e._$style(this.__parent, {
                    "position": "fixed",
                    "top": this.__toolbarOffsetTop + offsetInner + "px",
                    "width": this.__boxWidth + 'px'
                });
                _e._$style(this.__parent.parentNode, {
                    "paddingTop": this.__boxHeight + 'px'
                });
            }else{
                _e._$style(this.__parent, {
                    "position": "relative",
                    "top": "auto",
                    "width": 'auto'
                });
                _e._$style(this.__parent.parentNode, {
                    "paddingTop": '0px'
                });
                this.__calculateTop();
            }
        }._$bind(this));
    };


    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proAutoScrollbar.__destroy = function(){
        // 清除事件

        _v._$clearEvent(window, "scroll");

        this.__supDestroy();
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proAutoScrollbar.__initNode = function(){
        this.__supInitNode();
    };



    return _$$EduEditorAutoScrollbar;
};

NEJ.define([
    './baseBar.js',
    'pool/cache-base/src/setting',
    '../../../key.js'
],f);


