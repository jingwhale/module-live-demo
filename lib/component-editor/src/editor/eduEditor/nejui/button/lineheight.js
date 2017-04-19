/**
 * ------------------------------------------
 * 富媒体编辑器行高下拉控件实现文件
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
        _proLineheight,
        _supLineheight;

    /**
     * 段前段后控件
     * @class   段前段后控件
     * @extends {nej.ui._$$DropListButton}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     */
    _p._$$Lineheight = NEJ.C();
    _proLineheight = _p._$$Lineheight._$extend(_p._$$DropListButton);
    _supLineheight = _p._$$Lineheight._$supro;

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proLineheight.__initNode = function(){
        this.__supInitNode();
    };

	/**
	 * 重置卡片
	 * @param {Object} _options
	 */
	_proLineheight.__reset = function(_options){
        _options.title = _options.data.title || '';
        _options.data  = _options.data.list;
		this.__supReset(_options);

        this.__listP.style.width = "85px";
        this.__cmd ='lineheight';
       
	};

    /**
     * 分类点击
     * @param {event} _data类别数据
     * @param  {event} _event 事件
     * @return {void}  
     */
    _proLineheight.__itemClick = function(_data,_event){
        _supLineheight.__itemClick.apply(this,arguments);
        this.__editor.execCommand(this.__cmd, this.__dataList[this.__selectedData]);
    }
	/**
	 * 销毁卡片
	 */
	_proLineheight.__destroy = function(){
		this.__supDestroy();
	};

    return _p._$$Lineheight;
	
};
define(['./dropListButton.js'],f);



