/*
 * ------------------------------------------
 * 富媒体编辑器toolbar实现文件
 * @version  1.0
 * @author   hzwujiazhen(hzwujiazhen@corp.netease.com)
 * ------------------------------------------
 */
var f = function(
    s,
    key
){

    var _  = NEJ.P,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _v = _('nej.v'),
        _p = _('nej.ui'),
        _proEduEditorToolbar,
        _supEduEditorToolbar;

    var _htmlTpl = '<div class="ztbar_wrap f-cb"></div>';
    var _seed_css = _e._$pushCSSText('');

    /**
     * 富媒体编辑器基类封装
     * @class   {nej.ui._$$EduEditorToolbar} 富媒体编辑器基类封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *
     */
    var _$$EduEditorToolbar = NEJ.C();
    _proEduEditorToolbar = _$$EduEditorToolbar._$extend(_p._$$Abstract);

    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proEduEditorToolbar.__init = function(){
        this.__supInit();
    };

    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proEduEditorToolbar.__reset = function(_options){
        this.__supReset(_options);

        this.__hasInitBtns = false;

        // 编辑器引用
        this.__editor = _options.editor;
        this.__config = _options.config;
        this.__contentWrap = _options.contentWrap;

        this.__showCmds = this.__config.showCmds || [
                'cleardoc',
                'undo',
                'redo',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'insertorderedlist',
                'insertunorderedlist',
                'image',
                'math',
                'link',
                'insertcode',
                'fontsize',
                'fontcolor'
            ];

        this.__editor.ready(function(){
            if (!this.__hasInitBtns) {  // 只创建一次，因为ready事件可能会触发多次
                this.__initBtns();
                this.__hasInitBtns = true;
            }

            this.__onReady();
        }._$bind(this));


    };

    /**
     * 子类重写
     *
     * @protected
     * @method {__onReady}
     * @return {Void}
     */
    _proEduEditorToolbar.__onReady = function () {

    };

    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proEduEditorToolbar.__destroy = function(){
        // 销毁basebtn
        if (this.__baseBtnUIs) {
            for(var _btn in this.__baseBtnUIs){
                if (this.__baseBtnUIs[_btn]) {
                    this.__baseBtnUIs[_btn] = _p._$$EditorButton._$recycle(this.__baseBtnUIs[_btn]);
                }
            }
        }

        // 销毁dialogbtn
        if (this.__dialogBtnUIs) {
            for(var _dbtn in this.__dialogBtnUIs){
                if (this.__dialogBtnUIs[_dbtn]) {
                    this.__dialogBtnUIs[_dbtn] = this.__dialogBtnUIs[_dbtn].constructor._$recycle(this.__dialogBtnUIs[_dbtn]);
                };
            };
        };

        // 销毁dropListbtn
        if (this.__dropDownBtnUIs) {
            for(var _ddtn in this.__dropDownBtnUIs){
                if (this.__dropDownBtnUIs[_ddtn]) {
                    this.__dropDownBtnUIs[_ddtn] = this.__dropDownBtnUIs[_ddtn].constructor._$recycle(this.__dropDownBtnUIs[_ddtn]);
                };
            };
        };

        // 销毁colorbtn
        if (this.__colorBtnUIs) {
            for(var _cbtn in this.__colorBtnUIs){
                if (this.__colorBtnUIs[_cbtn]) {
                    this.__colorBtnUIs[_cbtn] = _p._$$ColorButton._$recycle(this.__colorBtnUIs[_cbtn]);
                };
            };
        };

        // 清除分割线节点
        if (this.__spNodes) {
            for (var i = 0; i < this.__spNodes.length; i++) {
                _e._$remove(this.__spNodes[i]);
            };
        };

        // 清除事件

        _v._$clearEvent(window, "scroll");

        this.__supDestroy();
    };

    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proEduEditorToolbar.__initXGui = function(){
        this.__seed_css = _seed_css;
        this.__seed_html = _e._$addNodeTemplate(_htmlTpl);
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proEduEditorToolbar.__initNode = function(){
        this.__supInitNode();

        this.__buttonTypeMap = {
            "BASE": "base",
            "COLOR": "color",
            "DIALOG": "dialog",
            "DROPDOWN": "dropdown",
            "ZISP": "zisp"
        };

        this.__baseBtnMaps = {
            // 基本按钮
            "cleardoc": {uitype:'base', name:'cleardoc', title:'labelMap.cleardoc', clazz:'z-i-11', cmd:'cleardoc'},
            "undo": {uitype:'base', name:'undo', title:'labelMap.undo', clazz:'z-i-9', cmd:'undo'},
            "redo": {uitype:'base', name:'redo', title:'labelMap.redo', clazz:'z-i-10', cmd:'redo'},
            "zisp": {uitype:'zisp', name:'zisp'},
            "bold": {uitype:'base', name:'bold', title:'labelMap.bold', clazz:'z-i-0', cmd:'bold'},
            "italic": {uitype:'base', name:'italic', title:'labelMap.italic', clazz:'z-i-1', cmd:'italic'},
            "underline": {uitype:'base', name:'underline', title:'labelMap.underline', clazz:'z-i-2', cmd:'underline'},
            "strikethrough": {uitype:'base', name:'strikethrough', title:'labelMap.strikethrough', clazz:'z-i-3', cmd:'strikethrough'},
            "insertorderedlist": {uitype:'base', name:'insertorderedlist', title:'labelMap.insertorderedlist', clazz:'z-i-4', cmd:'insertorderedlist', value:'decimal'}, // 有序列表暂时简单处理，不提供样式选择
            "insertunorderedlist": {uitype:'base', name:'insertunorderedlist', title:'labelMap.insertunorderedlist', clazz:'z-i-5', cmd:'insertunorderedlist', value:'disc'},// 无序列表暂时简单处理，不提供样式选择

            "indent": {uitype:'base', name:'indent', title:'labelMap.indent', clazz:'z-i-19', cmd:'indent'},
            "justifyleft": {uitype:'base', name:'justifyleft', title:'labelMap.justifyleft', clazz:'z-i-16', cmd:'justify', value:'left'},
            "justifycenter": {uitype:'base', name:'justifycenter', title:'labelMap.justifycenter', clazz:'z-i-17', cmd:'justify', value:'center'},
            "justifyright": {uitype:'base', name:'justifyright', title:'labelMap.justifyright', clazz:'z-i-18', cmd:'justify', value:'right'},

            "horizontal": {uitype:'base', name:'horizontal', title:'labelMap.horizontal', clazz:'z-i-14', cmd:'horizontal'},
            "blockquote": {uitype:'base', name:'blockquote', title:'labelMap.blockquote', clazz:'z-i-15', cmd:'blockquote'},

            // 颜色按钮
            "fontcolor": {uitype:'color', name:'fontcolor', title:'labelMap.forecolor', clazz:'z-i-12'},

            // 弹框按钮
            "link": { uitype:'dialog', name:'link', title:'labelMap.link', clazz:'z-i-6', constructor:_p._$$EditorLinkButton},
            "image": { uitype:'dialog', name:'image', title:'labelMap.insertimage', clazz:'z-i-7', constructor:_p._$$EditorImageButton},
            "math": { uitype:'dialog', name:'math', title:'labelMap.math', clazz:'z-i-8', constructor:_p._$$MathButton},
            "snapscreen": { uitype:'dialog', name:'snapscreen',title:'labelMap.snapscreen', clazz:'z-i-13', constructor:_p._$$SnapScreenButton,cmd:'snapscreen'},
            "video": { uitype:'dialog', name:'video', title:'labelMap.insertvideo', clazz:'z-i-20', constructor:_p._$$EditorVideoButton},
            "audio": { uitype:'dialog', name:'audio', title:'labelMap.insertaudio', clazz:'z-i-20', constructor:_p._$$EditorAudioButton},

            // 下拉框
            "insertcode": { uitype: 'dropdown', name:'insertcode', title:'insertcode', clazz:'z-i-code', constructor:_p._$$InsertCodeSelect , type:'map'},
            "fontsize": { uitype: 'dropdown', name:'fontsize', title:'fontsize', clazz:'z-i-size', constructor:_p._$$FontsizeSelect , type:'list'},
            "paragraph": { uitype: 'dropdown', name:'paragraph', title:'paragraph', clazz:'z-i-paragraph', constructor:_p._$$ParagraphSelect , type:'list'},
            "rowspacingtop": { uitype: 'dropdown', name:'rowspacingtop', title:'rowspacingtop', clazz:'z-i-0', constructor:_p._$$Rowspacing , type:'list'},
            "lineheight": { uitype: 'dropdown', name:'lineheight', title:'lineheight', clazz:'z-i-0', constructor:_p._$$Lineheight , type:'list'},
            "rowspacingbottom": { uitype: 'dropdown', name:'rowspacingbottom', title:'rowspacingbottom', clazz:'z-i-0', constructor:_p._$$Rowspacing , type:'list'}
        };
    };

    _proEduEditorToolbar.__initBtns = function () {
        _u._$forEach(this.__showCmds, function(_item) {
            if (this.__baseBtnMaps[_item].uitype == this.__buttonTypeMap.BASE) {
                this.__initBaseBtns(this.__baseBtnMaps[_item]);
            } else if (this.__baseBtnMaps[_item].uitype == this.__buttonTypeMap.COLOR) {
                this.__initColorBtns(this.__baseBtnMaps[_item]);
            } else if (this.__baseBtnMaps[_item].uitype == this.__buttonTypeMap.DIALOG) {
                this.__initDialogBtns(this.__baseBtnMaps[_item]);
            } else if (this.__baseBtnMaps[_item].uitype == this.__buttonTypeMap.DROPDOWN) {
                this.__initDropDownBtns(this.__baseBtnMaps[_item]);
            } else if (this.__baseBtnMaps[_item].uitype == this.__buttonTypeMap.ZISP) {
                this.__appendSplit();
            }
        }._$bind(this));
    };

    _proEduEditorToolbar.__appendSplit = function(){
        var _spnode = _e._$html2node('<div class="zisp"></div>')
        this.__body.appendChild(_spnode);

        if (!this.__spNodes) {
            this.__spNodes = [];
        };

        this.__spNodes.push(_spnode);
    }

    /**
     * 创建基本功能按钮
     * @return {Void}
     */
    _proEduEditorToolbar.__initBaseBtns = function(_btn){
        this.__baseBtnUIs = this.__baseBtnUIs || {};

        var _ed = this.__editor;
        var _parent = this.__body;
        var _config = this.__config;

        var _btnUI = _p._$$EditorButton._$allocate({
            parent : _parent,
            config : _config,
            title : _ed.getLang(_btn.title),
            clazz : _btn.clazz,
            onclick : function(){
                _ed.execCommand(_btn.cmd, _btn.value);
            }._$bind(this)
        });

        this.__baseBtnUIs[_btn.name] = _btnUI;

        // 绑定事件
        _ed.addListener('selectionchange', function(type, causeByUi, uiReady){
            var _state = _ed.queryCommandState(_btn.cmd);

            if (_state == -1) {
                _btnUI._$setDisabled(true);
                _btnUI._$setChecked(false);
            } else {
                if (!uiReady) {
                    _btnUI._$setDisabled(false);
                    _btnUI._$setChecked(_state);
                }
            }
        });
    };

    /**
     * 创建弹框功能按钮
     * @return {Void}
     */
    _proEduEditorToolbar.__initDialogBtns = function(_btn){
        this.__dialogBtnUIs = this.__dialogBtnUIs || {};

        var _ed = this.__editor;
        var _parent = this.__body;
        var _config = this.__config;


        this.__dialogBtnUIs[_btn.name] = _btn.constructor._$allocate({
            parent : _parent,
            config : _config,
            title : _ed.getLang(_btn.title),
            clazz : _btn.clazz,
            editor : _ed
        });

    }

    /**
     * 创建下拉功能按钮
     * @return {Void}
     */
    _proEduEditorToolbar.__initDropDownBtns = function(_btn){
        this.__dropDownBtnUIs = this.__dropDownBtnUIs || {};

        var _ed = this.__editor;
        var _parent = this.__body;

        this.__dropDownBtnUIs[_btn.name] = _btn.constructor._$allocate({
            parent : _parent,
            config : this.__config,
            data : _ed.getLang(_btn.title),
            editor : _ed,
            clazz : _btn.clazz
        });
    };

    /**
     * 创建颜色选择功能按钮
     * @return {Void}
     */
    _proEduEditorToolbar.__initColorBtns = function(_btn){
        this.__colorBtnUIs = this.__colorBtnUIs || {};

        var _ed = this.__editor;
        var _parent = this.__body;
        var _config = this.__config;

        this.__colorBtnUIs[_btn.name] = _p._$$ColorButton._$allocate({
            parent : _parent,
            config : _config,
            title : _ed.getLang(_btn.title),
            editor : _ed,
            clazz : _btn.clazz
        });

    }

    return _$$EduEditorToolbar;
};

NEJ.define([
    'pool/cache-base/src/setting',
    '../../../key.js',
    '{lib}ui/base.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '../button/button.js',
    '../button/colorButton.js',
    '../button/mathButton.js',
    '../button/linkButton.js',
    '../button/imageButton.js',
    '../button/videoButton.js',
    '../button/audioButton.js',
    '../button/snapscreenButton.js',
    '../dropList/insertCode.js',
    '../dropList/fontsize.js',
    '../dropList/paragraph.js',
    '../button/rowspacing.js',
    '../button/lineheight.js'],f);


