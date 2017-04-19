/*
 * ------------------------------------------
 * 富媒体编辑器字体颜色选择按钮实现文件
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
        _proColorButton,
        _supColorButton;

    var _htmlTpl = '<div class="zitm zbg colorbtn" title="">\
                        <div class="zicn zbg"></div>\
                        <div class="colordown j-down"></div>\
                    </div>';

    /**
     * 富媒体编辑器按钮
     * @class   {nej.ui._$$ColorButton} 富媒体编辑器基类封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *              title 说明文案 
     *              editor 
     */
    _p._$$ColorButton = NEJ.C();
    _proColorButton = _p._$$ColorButton._$extend(_p._$$Popup);
    _supColorButton = _p._$$ColorButton._$supro;

    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proColorButton.__init = function(){
        this.__supInit();
    };

    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proColorButton.__reset = function(_options){
        this.__supReset(_options);
            
        this.__title = _options.title || '';
        this.__editor = _options.editor;
        // this.__config = _options.config; // 

        this.__body.title = this.__title;

        this._$setDisabled(false);

        // 检查状态
        this.__editor.addListener('selectionchange', function () {
            var _val = this.__editor.queryCommandState(this.__cmd);

            if (_val == -1) {
                this._$setDisabled(true);
            }else{
                // if (this.__colorPickerUI) {
                //     this.__colorPickerUI._$setColor(_val);
                // };

                this._$setDisabled(false);
            }
            
        }._$bind(this));

        this.__editor.addListener('focus', function () {
            this.__hideColorPicker();
        }._$bind(this));
        
    };
    
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proColorButton.__destroy = function(){
        if (this.__colorPickerUI) {
            this.__colorPickerUI = _p._$$ColorPicker._$recycle(this.__colorPickerUI);
        };

        this.__supDestroy();
    };

    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proColorButton.__initXGui = function(){
        this.__seed_html = _e._$addNodeTemplate(_htmlTpl);
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proColorButton.__initNode = function(){
        this.__supInitNode();

        this.__cmd = 'forecolor'; // 命令

        this.__isDisabled = false;

        this.__downNode = _e._$getByClassName(this.__body, 'j-down')[0];

        _v._$addEvent(this.__body, 'mouseup', this.__onClick._$bind(this));

    };

    /**
     * 不可操作
     * @return {Void}
     */
    _proColorButton._$setDisabled = function(_isDisabled){
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
    _proColorButton._$isDisabled = function(){
        return this.__isDisabled;
    };

    /**
     * 点击处理
     * @return {Void}
     */
    _proColorButton.__onClick = function(_evt){
        if (this.__isDisabled) {
            return;
        };

        if (!this.__colorPickerUI) {
            this.__colorPickerUI = _p._$$ColorPicker._$allocate({
                parent : this.__downNode,
                onColorPick : this.__onColorPick._$bind(this),
                onClearColor : this.__onClearColor._$bind(this)
            }); 
        };

        if (_e._$getStyle(this.__downNode, 'display') == 'block') {
            this.__hideColorPicker();
        }else{
            this.__showColorPicker();
        }
        
    };

    /**
     * 显示
     * @return {Void}
     */
    _proColorButton.__showColorPicker = function(){
        this.__downNode.style.display = 'block';
    };

    /**
     * 隐藏
     * @return {Void}
     */
    _proColorButton.__hideColorPicker = function(){
        this.__downNode.style.display = 'none';
    };

    /**
     * 选择颜色处理
     * @return {Void}
     */
    _proColorButton.__onColorPick = function(_color){
        this.__hideColorPicker();

        this.__editor.execCommand(this.__cmd, _color);

    };

    /**
     * 清空颜色处理
     * @return {Void}
     */
    _proColorButton.__onClearColor = function(){
        this.__hideColorPicker();

        this.__editor.execCommand(this.__cmd, 'default');
    };

    _proColorButton.__hidePop = _proColorButton.__hideColorPicker;

    return _p._$$ColorButton;
};

NEJ.define(
      ['{lib}ui/base.js',
       './popup.js',
       '../panel/colorPicker.js'],f);


