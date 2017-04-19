/**
 * ------------------------------------------
 * 富媒体编辑器字号下拉控件实现文件
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
        _proFontsizeSelect,
        _supFontsizeSelect;

    /**
     * 添加超链接控件
     * @class   添加超链接控件
     * @extends {nej.ui._$$DropListSelect}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     */
    _p._$$FontsizeSelect = NEJ.C();
    _proFontsizeSelect = _p._$$FontsizeSelect._$extend(_p._$$DropListSelect);
    _supFontsizeSelect = _p._$$FontsizeSelect._$supro;

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proFontsizeSelect.__initNode = function(){
        this.__supInitNode();
        this.__cmd = 'FontSize';
    };

    /**
     * 重置卡片
     * @param {Object} _options
     */
    _proFontsizeSelect.__reset = function(_options){
        this.__defalutName = '字号';
        this.__supReset(_options);
        this.__listP.style.width = "108px";
        //设置默认数据
        //if(!!this.__dataList){
            //this.__itemClick("14px");
        //}
    };
    
    /**
     *构造下拉类别节点数据    
     */
    _proFontsizeSelect.__genItmTpl = function(_key , _value){
        return '<div class=\"f-thide list" style=\"font-size:'+_u._$escape(_value.toString())+';\">'+ _u._$escape(_value.toString()) +'</div>';
    };
    
    /**
     * 分类点击
     * @param {event} _data类别数据
     * @param  {event} _event 事件
     * @return {void}  
     */
    _proFontsizeSelect.__itemClick = function(_data,_event){
        _supFontsizeSelect.__itemClick.apply(this,arguments);
        this.__editor.execCommand(this.__cmd, this.__dataList[this.__selectedData]);
    }
    /**
     * 销毁卡片
     */
    _proFontsizeSelect.__destroy = function(){
        this.__supDestroy();
    };

    return _p._$$FontsizeSelect;
    
};
define(
      ['./dropListSelect.js'],f);



