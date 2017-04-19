/**
 * ------------------------------------------
 * 富媒体编辑器标题样式下拉控件实现文件
 * @version  1.0
 * @author   hzlixinxin(hzlixinxin@corp.netease.com)
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
        _proParagraphSelect,
        _supParagraphSelect;

    /**
     * 添加超链接控件
     * @class   添加超链接控件
     * @extends {nej.ui._$$DropListSelect}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     */
    _p._$$ParagraphSelect = NEJ.C();
    _proParagraphSelect = _p._$$ParagraphSelect._$extend(_p._$$DropListSelect);
    _supParagraphSelect = _p._$$ParagraphSelect._$supro;

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proParagraphSelect.__initNode = function(){
        this.__supInitNode();
        this.__cmd = 'paragraph';
    };

    /**
     * 重置卡片
     * @param {Object} _options
     */
    _proParagraphSelect.__reset = function(_options){
        this.__defalutName = 'p';
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
    _proParagraphSelect.__genItmTpl = function(_key , _value){
        return '<div class="f-thide list edu-for-'+_key+'" >'+ _u._$escape(_value.toString()) +'</div>';
    }
    
    /**
     * 分类点击
     * @param {event} _data类别数据
     * @param  {event} _event 事件
     * @return {void}  
     */
    _proParagraphSelect.__itemClick = function(_data,_event){
        _supParagraphSelect.__itemClick.apply(this,arguments);
        this.__editor.execCommand(this.__cmd, _data);
    }

    /**
     * 设置选中文案
     * @return {Void}
     */
    _proParagraphSelect._$setValue = function(_value){
        this.__up.innerText = this.__dataList ? this.__dataList[_value] : _value;
    }

    /**
     * 销毁卡片
     */
    _proParagraphSelect.__destroy = function(){
        this.__supDestroy();
    };

    return _p._$$ParagraphSelect;
    
};
define(['./dropListSelect.js'],f);



