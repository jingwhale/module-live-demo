/**
 * ------------------------------------------
 * 富媒体编辑器公司编辑控件实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */

 define([
    '{lib}ui/layer/window.wrapper.js',
    './mathEdit.js'
], function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _v = _('nej.v'),
        _proMathCard,
        _supMathCard;
                
    /**
     * 公式编辑上传控件
     * @class   公式编辑上传控件
     * @extends {nej.ui.cmd._$$WindowWrapper}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     *                            onselect  [Function] - 字号选中回调函数
     */
    _p._$$MathCard = NEJ.C();
    _proMathCard = _p._$$MathCard._$extend(_p._$$WindowWrapper);
    _supMathCard = _p._$$MathCard._$supro;
    
     // ui html code
    var _seed_html = _e._$addNodeTemplate('<div class="ux-richeditor-math">\
                        <div class="j-equation"></div>\
                        <input type="hidden" class="j-ipt" />\
                        <input type="hidden" class="j-ipt" />\
                        <div class="btns f-cb">\
                            <a class="f-fr ux-btn ux-btn-default j-btn">确定</a>\
                            <a class="f-fr ux-btn  ux-btn-gh ux-btn-primary j-btn">取消</a>\
                        </div>\
                    </div>');
	

    /**
     * 初始化外观信息
     * @return {Void}
     */
    _proMathCard.__initXGui = function(){
        this.__seed_html = _seed_html;
    };

    /**
     * 初始化节点
     */
    _proMathCard.__initNode = function(){
        this.__supInitNode();

        this.__equation       = _e._$getByClassName(this.__body, 'j-equation')[0];
        this.__inputs         = _e._$getByClassName(this.__body, 'j-ipt');
        this.__btns             = _e._$getByClassName(this.__body,'j-btn');

        this.__doInitDomEvent([
            [this.__btns[0],'click',this.__onOK._$bind(this)],
            [this.__btns[1],'click',this.__onCancel._$bind(this)]
        ]);
    };

	/**
	 * 重置卡片
	 * @param {Object} _options
	 */
	_proMathCard.__reset = function(_options){
		_options = _options || {};

        _options.clazz = 'ux-eduEditorDialog';
		_options.title = "公式编辑";
		_options.draggable = false;
        _options.parent = _options.parent || document.body; // 默认以document为parent
        _options.mask  = _options.mask || "ux-editor-dialog-mask";

		this.__mathEquatuonUI = _p._$$MathEditUI._$allocate({
			parent: this.__equation,
			onGetImgSrc: function(_value){
                this.__inputs[1].value = _value;
            }._$bind(this)
		});
		
		this.__supReset(_options);
	};
	
    _proMathCard.__onCancel = function(){
        this._$hide();
    };

    /**
     * 完成
     * @protected
     * @method {__onOK}
     * @return {Void}
     */
    _proMathCard.__onOK = function(){
        var _link = {};
        _link.name = _u._$escape(this.__inputs[0].value);
        _link.href = this.__inputs[1].value;
    
        this._$dispatchEvent('onchange', _link);
        this._$hide();
    };

	/**
	 * 销毁卡片
	 */
	_proMathCard.__destroy = function(){
		if(!!this.__mathEquatuonUI){
			this.__mathEquatuonUI = _p._$$MathEditUI._$recycle(this.__mathEquatuonUI);
		}

		this.__supDestroy();
	};

    return _p._$$MathCard;
	
});

