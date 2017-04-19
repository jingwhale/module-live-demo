/**
 * ------------------------------------------
 * 富媒体编辑器段前段后下拉控件实现文件
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
        _proRowspacing,
        _supRowspacing;

    /**
     * 段前段后控件
     * @class   段前段后控件
     * @extends {nej.ui._$$DropListButton}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     */
    _p._$$Rowspacing = NEJ.C();
    _proRowspacing = _p._$$Rowspacing._$extend(_p._$$DropListButton);
    _supRowspacing = _p._$$Rowspacing._$supro;

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proRowspacing.__initNode = function(){
        this.__supInitNode();
    };

	/**
	 * 重置卡片
	 * @param {Object} _options
	 */
	_proRowspacing.__reset = function(_options){
        _options.title = _options.data.title || '';
        _options.data  = _options.data.list;
		this.__supReset(_options);

        this.__listP.style.width = "85px";
        if(_options.title == "段前距"){
            this.__cmd ='top';
        }else{
            this.__cmd ='bottom';
        }
	};

    /**
     *构造下拉类别节点数据    
     */
    _proRowspacing.__genItmTpl = function(_key , _value){
        return '<div class=\"f-thide list\">'+ _u._$escape(_value.toString()) +'px</div>';
    }
    /**
     * 分类点击
     * @param {event} _data类别数据
     * @param  {event} _event 事件
     * @return {void}  
     */
    _proRowspacing.__itemClick = function(_data,_event){
        _supRowspacing.__itemClick.apply(this,arguments);
        this.__editor.execCommand('rowspacing', this.__dataList[this.__selectedData],this.__cmd);
    }
	/**
	 * 销毁卡片
	 */
	_proRowspacing.__destroy = function(){
		this.__supDestroy();
	};

    return _p._$$Rowspacing;
	
};
define(['./dropListButton.js'],f);



