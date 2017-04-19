/**
 * ------------------------------------------
 * 富媒体编辑器插入代码下拉控件实现文件
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
        _proInsertCodeSelect,
        _supInsertCodeSelect;

    /**
     * 添加超链接控件
     * @class   添加超链接控件
     * @extends {nej.ui._$$DropListSelect}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     */
    _p._$$InsertCodeSelect = NEJ.C();
    _proInsertCodeSelect = _p._$$InsertCodeSelect._$extend(_p._$$DropListSelect);
    _supInsertCodeSelect = _p._$$InsertCodeSelect._$supro;

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proInsertCodeSelect.__initNode = function(){
        this.__supInitNode();
        this.__cmd = 'insertcode';
    };

	/**
	 * 重置卡片
	 * @param {Object} _options
	 */
	_proInsertCodeSelect.__reset = function(_options){
        this.__defalutName = '代码语言';
		this.__supReset(_options);
        this.__listP.style.width = "135px";
	};
 
    /**
     * 编辑中动态判断选中
     * @return {Void}
     */
    _proInsertCodeSelect._$getSelected = function(){
        var _value = this.__editor.queryCommandValue(this.__cmd);
        if(!!_value){
            this._$setValue(this.__dataList[_value]);
        }else{
            this._$setValue(this.__defalutName);
        }
    };
    /**
     * 分类点击
     * @param {event} _data类别数据
     * @param  {event} _event 事件
     * @return {void}  
     */
    _proInsertCodeSelect.__itemClick = function(_data,_event){
        _supInsertCodeSelect.__itemClick.apply(this,arguments);
        this.__editor.execCommand(this.__cmd, this.__selectedData);
    }
	/**
	 * 销毁卡片
	 */
	_proInsertCodeSelect.__destroy = function(){
		this.__supDestroy();
	};

    return _p._$$InsertCodeSelect;
	
};
define(['./dropListSelect.js'],f);



