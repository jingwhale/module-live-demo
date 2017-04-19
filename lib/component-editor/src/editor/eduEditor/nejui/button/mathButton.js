/*
 * ------------------------------------------
 * 公式编辑器
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _v = _('nej.v'),
        _proMathButton,
        _supMathButton;
    if (!!_p._$$MathButton) return;
    /**
     * 超链接执行命令封装
     * @class   {nej.ut.cmd._$$math} 超链接执行命令封装
     * @extends {nej.ut._$$EditorCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *                           
     */
    _p._$$MathButton = NEJ.C();
    _proMathButton = _p._$$MathButton._$extend(_p._$$EditorDialogButton);
    _supMathButton = _p._$$MathButton._$supro;
    
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proMathButton.__reset = function(_options){
        this.__supReset(_options);
    };
    
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proMathButton.__initNode = function(){
        this.__supInitNode();

        this.__cmd = 'insertimage';
    };
    /**
     * 卡片内容变化回调，子类实现具体业务逻辑
     * @protected
     * @method {__onchange}
     * @param  {Object} _math 链接地址
     * @return {Void}
     */
    _proMathButton.__onchange = function(_math){
        if(!_math)
            return;
        if(!!_math.href){
            this.__editor.execCommand(this.__cmd, {
                src : _math.href
            });
        }
    };
    
    /**
     * 点击处理
     * @return {Void}
     */
    _proMathButton.__onClick = function(){
        if (this.__isDisabled) {
            return;
        };

        this.__editor.focus();

        this.__mathCardUI = _p._$$MathCard._$allocate(this.__dialogOption);
        this.__mathCardUI._$show();

        //this.__fopt.name = this.__editor._$getSelectText();
        //this.__mathCard = this.__onShowCard();
        //this.__mathCard._$doFocus();
    };
    
    /**
     * 子类实现显示具体卡片
     * @protected
     * @method {__onShowCard}
     * @return {Void}
     */
    /*_proMathButton.__onShowCard = function(){
    	this.__mathCardUI = _p._$$MathCard._$allocate(this.__fopt);
    	return this.__mathCardUI._$show();
    };*/
    
    /**
    * 控件销毁
    */
    _proMathButton.__destroy = function(){
        if(!!this.__mathCardUI){
            this.__mathCardUI = _p._$$MathCard._$recycle(this.__mathCardUI);
        }
        this.__supDestroy();
    };

    return _p._$$MathButton;
    
};
NEJ.define(['{lib}util/editor/command/card.js',
       './dialogButton.js',
       '../dialog/mathCard.js'],f);
