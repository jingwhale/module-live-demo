/*
 * ------------------------------------------
 * 富媒体编辑器颜色选择器实现文件
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
        _proColorPicker,
        _supColorPicker;

    var _htmlTpl = '<div class="ux-ecolorpicker">\
                    <a class="clear j-clearcolor">无颜色</a>\
                    <div class="colors j-colors"></div>\
                    </div>';

    /**
     * 富媒体编辑器按钮
     * @class   {nej.ui._$$EditorButton} 富媒体编辑器基类封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *            onColorPick   颜色选中事件
     *            onClearColor  清空颜色
     */
    _p._$$ColorPicker = NEJ.C();
    _proColorPicker = _p._$$ColorPicker._$extend(_p._$$Abstract);
    _supColorPicker = _p._$$ColorPicker._$supro;

    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proColorPicker.__init = function(){
        this.__supInit();
    };

    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proColorPicker.__reset = function(_options){
        this.__supReset(_options);
            
    };
    
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proColorPicker.__destroy = function(){
        this.__supDestroy();
    };

    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proColorPicker.__initXGui = function(){
        this.__seed_html = _e._$addNodeTemplate(_htmlTpl);
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proColorPicker.__initNode = function(){
        this.__supInitNode();

        // 颜色配置
        this.__colorOpts = [
            '#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500',
            '#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF',
            '#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE',
            '#ffffff', '#cccccc', '#999999', '#666666', '#333333', '#000000'  
        ];

        // 当前选中的颜色
        this.__selectedColor = null;

        this.__clearBtnNode = _e._$getByClassName(this.__body, 'j-clearcolor')[0];
        this.__colorsNode = _e._$getByClassName(this.__body, 'j-colors')[0];

        _v._$addEvent(this.__clearBtnNode, 'mouseup', this.__onClickClearColor._$bind(this));

        this.__buildColors();
    };

    /**
     * 创建颜色按钮
     * @return {Void}
     */
    _proColorPicker.__buildColors = function(){
        var _html = '';

        for (var i = this.__colorOpts.length - 1; i >= 0; i--) {
            _html += '<a class="colorbtn j-colorbtn" title="'+ this.__colorOpts[i] +'"><span></span></a>';
        };

        this.__colorsNode.innerHTML = _html;
        
        this.__colorBtnNodes = _e._$getByClassName(this.__body, 'j-colorbtn');

        _v._$addEvent(this.__body, 'mousedown', function(_evt){
            _v._$stop(_evt);
        });

        _u._$forEach(this.__colorBtnNodes, function(_item, _index){
            _e._$setStyle(_item.childNodes[0], 'background-color', _item.title);

            _v._$addEvent(_item, 'mouseup', this.__onClickPickColor._$bind(this, _index));
        }._$bind(this));
        
    };

    /**
     * 点击清除颜色
     * @return {Void}
     */
    _proColorPicker.__onClickClearColor = function(_evt){
        if (!!_evt) {
            _v._$stop(_evt);
        }

        if (this.__selectedColor != null) {
            _e._$delClassName(this.__colorBtnNodes[this.__selectedColor], 'selected');
        };

        this.__selectedColor = null;

        this._$dispatchEvent('onClearColor');
    };

    /**
     * 点击选择一个颜色
     * @return {Void}
     */
    _proColorPicker.__onClickPickColor = function(_index, _evt){
        if (!!_evt) {
            _v._$stop(_evt);
        };
         
        if (this.__selectedColor != null) {
            _e._$delClassName(this.__colorBtnNodes[this.__selectedColor], 'selected');
        };

        this.__selectedColor = _index;

        var _node = this.__colorBtnNodes[_index];

        var _colorValue = _node.title;

        _e._$addClassName(_node, 'selected');

        this._$dispatchEvent('onColorPick', _colorValue);

    };

    // _proColorPicker._$setColor = function(_color){
    //     if (!_color) {
    //         this.__onClickClearColor();
    //     };

    //     var _index = -1;

    //     for (var i = this.__colorOpts.length - 1; i >= 0; i--) {
    //         if (this.__colorOpts[i] == _color) {
    //             _index = i;
    //             break;
    //         };
    //     };

    //     if (this.__selectedColor != null) {
    //         _e._$delClassName(this.__colorBtnNodes[this.__selectedColor], 'selected');
    //     };

    //     if (_index >= 0) {
    //         this.__selectedColor = _index;
           
    //         _e._$addClassName(this.__colorBtnNodes[_index], 'selected');
    //     }else{
    //         this.__selectedColor = null;
    //     }

    // }

    return _p._$$ColorPicker;
};

NEJ.define(
      ['{lib}ui/base.js'],f);


