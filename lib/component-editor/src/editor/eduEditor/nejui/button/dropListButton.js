/*
 * ------------------------------------------
 * 富媒体编辑器按钮下拉实现文件
 * @version  1.0
 * @author   hzluoqunfang(hzluoqunfang@corp.netease.com)
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
        _proDropListButton,
        _supDropListButton;

    var _htmlTpl = '<div class="zitm zbg">\
                        <div class="zicn zbg j-up f-thide"></div>\
                        <div class="down f-bg j-list"></div>\
                      </div>';

    /**
     * 富媒体编辑器按钮
     * @class   {nej.ui._$$DropListButton} 富媒体编辑器基类封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *              title 说明文案  
     */
    _p._$$DropListButton = NEJ.C();
    _proDropListButton = _p._$$DropListButton._$extend(_p._$$DropListSelect);
    _supDropListButton = _p._$$DropListButton._$supro;

    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proDropListButton.__initXGui = function(){
        this.__seed_html = _e._$addNodeTemplate(_htmlTpl);
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proDropListButton.__reset = function(_options){
        this.__supReset(_options);

        this.__title = _options.title || '';

        this.__body.title = this.__title;
        this.__up.innerText = '';

    };

    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proDropListButton.__destroy = function(){
        this.__supDestroy();
    };

    return _p._$$DropListButton;
};

NEJ.define(
      ['../dropList/dropListSelect.js'],f);


