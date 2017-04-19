/*
 * ------------------------------------------
 * 富媒体编辑器实现文件
 * @version  1.0
 * @author   hzwujiazhen(hzwujiazhen@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}ui/base.js',
    '../edueditor.all.js',
    './toolbar/toolbar.js',
    '{lib}util/animation/easein.js',
    'text!../scss/editor.css'
], function (
    _base,
    _edueditorall,
    _toolbar,
    _easein,
    _instyle,
    _p, _o, _f, _r) {
    var _ = NEJ.P,
        _g = window,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _nejui = _('nej.ui'),
        _eu = _('edu.u'),
        _proEduEditor,
        _supEduEditor;


    //图片点击事件代理 hzliujunwei
    var eduEditorImgReg = /(^|\s+)eduEditor-img($|\s+)/g;
    UE.dom.domUtils.on(document.body, 'click', function (event) {
        var _target = event.target || event.srcElement;
        if (eduEditorImgReg.test(_target.className) && _target.src && (!window.eduEditorImgNotClick)) {
            window.open(_target.src);
        }
    });




    var _htmlTpl = '<div class="ux-richeditor">\
                        <div class="ztbar j-toolbar"></div>\
                        <div class="zarea j-area"></div>\
                    </div>';

    var _seed_css = _e._$pushCSSText('');

    // 编辑区域iframe的样式，与f-richEditorText保持一致，默认字体为12px
    var _iframeStyle = _instyle;

    /**
     * 富媒体编辑器基类封装
     * @class   {nej.ui._$$EduEditor} 富媒体编辑器基类封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *              height          // 可以影响局部
     *              content         // 可以影响局部
     *              focus           // 可以影响局部
     *              showCmds        // 显示的功能列表，可以影响局部
     *              isLocal         // 是否是本地测试，全局
     *              showLoadingFn   // 显示loading的方法，全局
     *              hideLoadingFn   // 隐藏loading的方法，全局
     *              coreOptions : {  // 编辑器core的配置，详细见core源码，可以影响局部
     *                  autoHeightEnabled // 高度是否自动
     *              },
     *              imageConfig: {   //富文本编辑器图片配置
     *                  setImageWH: false 是否添加图片的宽度和高度，只对nos资源有效
     *              }
     *
     *  编辑器会读取全局的配置：window.eduEditor_options，优先使用以上的局部配置，如果局部配置未设置则使用全局配置
     */
    _nejui._$$EduEditor = _p._$$EduEditor = NEJ.C();
    _proEduEditor = _p._$$EduEditor._$extend(_nejui._$$Abstract);
    _supEduEditor = _p._$$EduEditor._$supro;

    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proEduEditor.__init = function () {
        this.__supInit();
    };

    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proEduEditor.__reset = function (_options) {
        this.__supReset(_options);

        // 合并配置
        this.__options = NEJ.X(_g.eduEditor_options || {}, _options || {});

        this.__height = this.__options.height || 200;
        this.__initContent = this.__options.content;
        this.__isFocus = this.__options.focus || false;

        this.__editorEvent = this.__options.editorEvent;

        // 需要显示的按钮配置，为null表示全部，空数组表示全部不显示
        this.__showCmds = this.__options.showCmds;

        this.__initEditorCore();
        this.__initToolBar();
    };

    //ready后的回调
    _proEduEditor.ready = function (_callback) {
        this.__editor.ready.apply(this.__editor, arguments);
    };

    _proEduEditor.change = function (_callback) {
        this.__editor.addListener('contentChange', function () {
            if (typeof _callback === 'function') {
                _callback(this.getContent());
            }
        });
    };

    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proEduEditor.__destroy = function () {
        if (!!this.__toolBarUI) {
            this.__toolBarUI = _nejui._$$EduEditorToolbar._$recycle(this.__toolBarUI);
        };

        // ueditor的destroy方法会用textarea代替编辑器，并且会调用UE.delEditor()方法，如果未定义该方法则会报错
        //this.__editor.destroy(); 

        // 如果不用this.__editor.destroy方法回收，则必须手动清空iframe
        this.__editor.fireEvent('destroy'); // 需要抛出destroy事件，这样很多事件绑定可以被解绑
        this.__areaNode.innerHTML = '';
        for (var _n in this.__editor) {
            if (this.__editor.hasOwnProperty(_n)) {
                delete this.__editor[_n];
            }
        }

        this.__editor = undefined;

        this.__supDestroy();
    };

    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proEduEditor.__initXGui = function () {
        this.__seed_css = _seed_css;
        this.__seed_html = _e._$addNodeTemplate(_htmlTpl);
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proEduEditor.__initNode = function () {
        this.__supInitNode();

        this.__toolbarNode = _e._$getByClassName(this.__body, 'j-toolbar')[0];
        this.__areaNode = _e._$getByClassName(this.__body, 'j-area')[0];
    };

    /**
     * 初始化toolbar
     * @return {Void}
     */
    _proEduEditor.__initToolBar = function () {

        this.__toolBarUI = _nejui._$$EduEditorToolbar._$allocate({
            parent: this.__toolbarNode,
            contentWrap: this.__body,
            editor: this.__editor,
            config: this.__options
        });

    };

    /**
     * 初始化 UE Editor 
     * @return {Void}
     */
    _proEduEditor.__initEditorCore = function () {
        var _defaultOptions = {
            UEDITOR_HOME_URL: '/',
            iframeCssUrl: undefined,
            initialStyle: _iframeStyle + this.__options.editorStyle || '',
            initialFrameWidth: '100%',
            snapscreenHost: "upload.icourse163.org", //屏幕截图的server端文件所在的网站地址或者ip，请不要加http://
            snapscreenServerUrl: "/common/photo/upload.htm?_upload_mth_=sync_parse" //屏幕截图的server端保存程序，UEditor的范例代码为“URL +"server/upload/jsp/snapImgUp.jsp"”
                ,
            snapscreenPath: "",
            snapscreenServerPort: location.port //屏幕截图的server端端口
        };
        var _utils = _g.baidu.editor.utils;

        // 编辑器core的配置
        this.__editorOptions = NEJ.X(_defaultOptions, this.__options.coreOptions || {});

        this.__editor = new UE.Editor(this.__editorOptions);

        this.__initEditorEvent();

        // 初始化高度和内容
        this.__editor.ready(function (_isReady) {
            this._$setHeight(this.__height);

            if (this.__initContent) this._$setContent(this.__initContent);

            if (this.__isFocus) this._$focus();
        }._$bind(this));



        // 必须在dom准备好后渲染，否则编辑器容器尺寸可能出现问题
        _utils.domReady(function () {
            if (this.__editorInterval) {
                clearInterval(this.__editorInterval);
            };

            this.__editorInterval = setInterval(function () {
                if (!!this.__areaNode.offsetWidth) {
                    if (this.__editorInterval) {
                        clearInterval(this.__editorInterval);
                    };

                    this.__editor.render(this.__areaNode);
                };
            }._$bind(this), 10);

        }._$bind(this));

    };

    /**
     * 初始化富文本编辑器的所有事件
     * @private
     */
    _proEduEditor.__initEditorEvent = function () {
        this.__editor.addListener('focus', function(name, evt){
            this.__editorEvent._$dispatchEvent('focus', evt);
        }._$bind(this));
        this.__editor.addListener('blur', function(name, evt){
            this.__editorEvent._$dispatchEvent('blur', evt);
        }._$bind(this));
        //注册复制时文件被变更事件
        this.__editor.addListener('docChanged', function(){
            this.__editorEvent._$dispatchEvent('docChanged');
        }._$bind(this));
        this.__editor.addListener('contentchange', function(){
            this.__editorEvent._$dispatchEvent('contentchange', this.__editor.getContent());
        }._$bind(this));
        this.__editor.addListener('wordcount', function(){
            this.__editorEvent._$dispatchEvent('wordcount', this.__editor.getContentLength(true) + '');
        }._$bind(this));
    };

    /**
     * 焦点
     * @method {_$getContent}
     * @return {String} 内容
     */
    _proEduEditor._$focus = function () {
        return this.__editor.focus();
    };


    /**
     * 取编辑内容
     * @method {_$getContent}
     * @return {String} 内容
     */
    _proEduEditor._$getContent = function () {
        return this.__editor.getContent();
    };

    /**
     * 取纯文本编辑内容
     * @method {_$getTextContent}
     * @return {String} 内容
     */
    _proEduEditor._$getTextContent = function () {
        return this.__editor.getContentTxt();
    };

    /**
     * 取文本内容的字符长度
     * @method {_$getContentLength}
     * @param { Boolean } ingoneHtml 传入true时，只按照纯文本来计算
     * @return {String} 内容
     */
    _proEduEditor._$getContentLength = function (ingoneHtml) {
        return this.__editor.getContentLength(ingoneHtml);
    };

    /**
     * 设置编辑内容
     * @method {_$setContent}
     * @param  {String} 内容
     * @return {nej.ui._$$EduEditor}
     */
    _proEduEditor._$setContent = function (_content) {
        this.__editor.setContent(_content);
        return this;
    };

    /**
     * 设置高度
     * @method {_$setHeight}
     * @param  {String} 内容
     * @return {nej.ui._$$EduEditor}
     */
    _proEduEditor._$setHeight = function (_height) {
        this.__editor.setHeight(_height);
        return this;
    };

    /**
     * 显示编辑器
     * @method {_$show}
     * @return {nej.ui._$$EduEditor}
     */
    _proEduEditor._$show = function () {
        this.__body.style.display = '';
        return this;
    };

    /**
     * 隐藏编辑器
     * @method {_$hide}
     * @return {nej.ui._$$EduEditor}
     */
    _proEduEditor._$hide = function () {
        this.__body.style.display = 'none';
        return this;
    };

    /**
     * 取编辑内容里的图片id和url列表
     * @method {_$getContent}
     * @return {Array} 编辑内中的图片ID+@+图片地址的列表，根据ID是否为0判断是否需要放入列表
     */
    _proEduEditor._$getPhotoIdsAndUrls = (function () {
        var _filter = function (_item) {
            if (_item.id != 0)
                this.__idsAndUrls.push(_item.id + '@' + _item.src);
        }

        return function () {
            this.__idsAndUrls = [];

            var _photoIdsAndUrls = [],
                _content = this.__editor.getContent(),
                _div = document.createElement('div');

            _div.innerHTML = _content;

            var _document = _e._$get(_div),
                _list = _document.getElementsByTagName('img');

            _u._$forEach(_list, _filter, this);

            var _idsAndUrlsLength = this.__idsAndUrls.length;

            for (var i = 0; i < _idsAndUrlsLength; i++) {
                _photoIdsAndUrls.push(this.__idsAndUrls[i]);
            }

            return _photoIdsAndUrls;
        }

    })();
    /**
     * 设置富文本编辑器iframe内部默认样式,请在初始化编辑器之前调用
     * @method {_$addStyle}
     * @return {String} 内容
     */
    _p._$addStyle = function (_style) {
        _iframeStyle = _iframeStyle + _style;
    };
    return _p;
});
