/**
 * ------------------------------------------
 * 富媒体编辑器超链接控件实现文件
 * @version  1.0
 * @author   hzwujiazhen(hzwujiazhen@corp.netease.com)
 * ------------------------------------------
 */
define([
    'text!./linkCard.html',
    '{lib}ui/layer/window.wrapper.js',
    'pool/cache-base/src/setting',
    '../../../key.js'
], function(
    _template,
    _wrapper,
    s,
    key
){
    var _g = window,
        _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _v = _('nej.v'),
        _proLinkCard,
        _supLinkCard;

    var _seed_html = _template;

    var _seed_css = _e._$pushCSSText('');

    var validateRules = [
        {
            "regex": /^(?:http(s)?:\/\/)[^\s].?/,
            "message": '请输入合法的链接地址（http://或https://）'
        }, {
            "regex": /^(?:http(s)?:\/\/).*/,
            "message": '请输入合法的链接地址'
        }
    ];

    /**
     * 添加超链接控件
     * @class   添加超链接控件
     * @extends {nej.ui.cmd._$$WindowWrapper}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     *                            name 链接名称
     */
    _p._$$LinkCard = NEJ.C();
    _proLinkCard = _p._$$LinkCard._$extend(_p._$$WindowWrapper);
    _supLinkCard = _p._$$LinkCard._$supro;

    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proLinkCard.__initXGui = function(){
        this.__seed_css  = _seed_css;
        this.__seed_html = _e._$addNodeTemplate(this.__getHtmlStr());
    };

    _proLinkCard.__getHtmlStr = function(){
        var _btn_html_str = '<a class="f-fr ux-btn ux-btn-default j-btn">确定</a><a class="f-fr ux-btn-gh ux-btn-primary j-btn">取消</a>';

        return _seed_html.replace('$btn_html_str', _btn_html_str);
    }

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proLinkCard.__initNode = function(){
        this.__supInitNode();

        this.__btns = _e._$getByClassName(this.__body,'j-btn');
        this.__inputs = _e._$getByClassName(this.__body,'j-ipt');
        this.__errorMsg = _e._$getByClassName(this.__body,'j-error')[0];
    };

    /**
     * 取消
     * @protected
     * @method {__onCancel}
     * @return {Void}
     */
    _proLinkCard.__onCancel = function(){
        this._$hide();
    };

    /**
     * 完成链接
     * @protected
     * @method {__onOK}
     * @return {Void}
     */
    _proLinkCard.__onOK = function(){
        var _link = {};

        _link.name = _u._$escape(this.__inputs[0].value);
        _link.href = this.__inputs[1].value;

        if(!this.__validate(_link)){
            return false;
        }

        this._$dispatchEvent('onchange', _link);
        this._$hide();
    };

    /**
     * 校验
     *
     * @param {Object} _link
     * @return {boolean}
     * @private
     */
    _proLinkCard.__validate = function (_link) {
        var rules = validateRules,
            settingRules = s.get(key)['INSERT_OUTER_LINK_RULES'];

        if(settingRules && settingRules.length > 0){
            rules = rules.concat(settingRules);
        }

        for(var i = 0, len = rules.length - 1; i <= len; i++){
            if(!rules[i].regex.test(_link.href)){
                this.__showErrorTips(rules[i].message);
                return false;
            }
        }

        return true;
    };

    /**
     * 重置卡片
     * @param {Object} _options
     */
    _proLinkCard.__reset = function(_options){
        _options = _options || {};

        // 窗体参数
        _options.clazz = 'ux-eduEditorDialog';
        _options.parent = _options.parent || document.body;
        _options.draggable = _options.draggable || false;
        _options.title = _options.title || '超链接';
        _options.mask  = _options.mask || "ux-editor-dialog-mask";

        this.__supReset(_options);

        this.__doInitDomEvent([
            [this.__btns[0],'click',this.__onOK._$bind(this)],
            [this.__btns[1],'click',this.__onCancel._$bind(this)],
            [this.__inputs[0],'focus',this.__showErrorTips._$bind(this, '')],
            [this.__inputs[1],'focus',this.__showErrorTips._$bind(this, '')]
        ]);

        this.__inputs[0].value = _options.name||'';
        this.__inputs[1].value = '';
    };

    /**
     * 重写聚焦到input的接口
     * @return {[type]} [description]
     */
    _proLinkCard._$doFocus = function(){
        this.__inputs[1].focus();
        this.__inputs[1].value = '';
    };

    /**
     * 显示错误信息
     * @protected
     * @method {__showErrorTips}
     * @param  {Object} 错误信息
     * @return {Void}
     */
    _proLinkCard.__showErrorTips = function(_message){
        this.__errorMsg.innerText = _message;
    };

    /**
     * 销毁卡片
     */
    _proLinkCard.__destroy = function(){
        this.__supDestroy();
    };

    return _p._$$LinkCard;

});



