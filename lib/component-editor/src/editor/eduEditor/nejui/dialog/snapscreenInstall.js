/**
 * ------------------------------------------
 * 富媒体编辑器超链接控件实现文件
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
        _proSnapscreenInstall,
        _supSnapscreenInstall;
    
    var _seed_html = _e._$addNodeTemplate('<div class="ux-snapscreen-install">\
        <div class="content">\
            <p>截图功能需要首先安装UEditor截图插件！</p>\
            <div class="f-fs0">\
                <div><a href="http://ueditor.baidu.com/ueditor/third-party/snapscreen/UEditorSnapscreen.exe" target="_blank" id="downlink">点此下载</a></div>\
                <div>第一步，下载UEditor截图插件并运行安装。</div>\
                <div>第二步，插件安装完成后即可使用，如不生效，请重启浏览器后再试！</div>\
            </div>\
            <div class="b-20"></div>\
            <div><a class="j-btn button tiny">确认</a></div>\
        </div>\
    </div>');

    var _seed_css = _e._$pushCSSText('');

    /**
     * 添加超链接控件
     * @class   添加超链接控件
     * @extends {nej.ui.cmd._$$WindowWrapper}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     *                            name 链接名称
     */
    _p._$$SnapScreenInstall = NEJ.C();
    _proSnapscreenInstall = _p._$$SnapScreenInstall._$extend(_p._$$WindowWrapper);
    _supSnapscreenInstall = _p._$$SnapScreenInstall._$supro;

/**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proSnapscreenInstall.__initXGui = function(){
        this.__seed_css  = _seed_css;
        this.__seed_html = _seed_html;
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proSnapscreenInstall.__initNode = function(){
        this.__supInitNode();

        this.__btns = _e._$getByClassName(this.__body,'j-btn');
    };

    /**
     * 取消
     * @protected
     * @method {__onCancel}
     * @return {Void}
     */
    _proSnapscreenInstall.__onOK = function(){
        this._$hide();
    };

/**
 * 重置卡片
 * @param {Object} _options
 */
_proSnapscreenInstall.__reset = function(_options){
	_options = _options || {};

	// 窗体参数
	_options.clazz = _options.clazz || 'm-basewin u-editor-snapscreenDialog';
	_options.maskclazz = _options.maskclazz || "m-editor-mask"; 
	_options.parent = _options.parent || document.body; 
                    _options.draggable = _options.draggable || false;
                    _options.destroyable = _options.destroyable || false;
                    _options.title = _options.title || '截图';
                    _options.mask  = _options.mask || true;

                    this.__supReset(_options);

                    this.__doInitDomEvent([
                        [this.__btns[0],'click',this.__onOK._$bind(this)]
                    ]);

};

/**
 * 销毁卡片
 */
_proSnapscreenInstall.__destroy = function(){
	this.__supDestroy();
};

return _p._$$SnapScreenInstall;
	
};
define(
      ['{lib}ui/layer/window.wrapper.js'],f);



