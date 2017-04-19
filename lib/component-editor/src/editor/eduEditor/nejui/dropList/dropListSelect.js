/*
 * ------------------------------------------
 * 富媒体编辑器下拉实现文件
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
        _proDropListSelect,
        _supDropListSelect;

    var _htmlTpl = '<div class="zdlitm zbg">\
                        <div class="up j-up f-thide"></div>\
                        <div class="down f-bg j-list"></div>\
                      </div>';

    /**
     * 富媒体编辑器按钮
     * @class   {nej.ui._$$DropListSelect} 富媒体编辑器基类封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *              onclick 点击处理    
     */
    _p._$$DropListSelect = NEJ.C();
    _proDropListSelect = _p._$$DropListSelect._$extend(_p._$$Popup);
    _supDropListSelect = _p._$$DropListSelect._$supro;

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proDropListSelect.__initNode = function(){
        this.__supInitNode();

        this.__up    = _e._$getByClassName(this.__body,'j-up')[0];
        this.__listP = _e._$getByClassName(this.__body,'j-list')[0];
    };
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proDropListSelect.__initXGui = function(){
        this.__seed_html = _e._$addNodeTemplate(_htmlTpl);
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proDropListSelect.__reset = function(_options){
        this.__supReset(_options);
        this.__editor = _options.editor;
        //选中的value值
        this.__disabled = false;
        this._$setValue(this.__defalutName);

        //处理列表
        this.__dataList = _options.data;
        this._$hideList();
        this.__genItem(this.__dataList);

        _v._$addEvent(this.__listP, 'mousedown', function(_evt){
            _v._$stop(_evt);
        });
        
        //监听点击事件
        this.__doInitDomEvent([[this.__body,'mouseup',function(_event){
                if(!this.__disabled){
                    this.__showDown(_event);
                }
            }._$bind(this)]
        ]);
        //设置disabled
        this._$setDisabled(false);

        // 绑定编辑事件
        this.__editor.addListener('selectionchange', function(type, causeByUi, uiReady){
            var _state = this.__editor.queryCommandState(this.__cmd);

            if (_state == -1) {
                this._$setDisabled(true);
            } else {
                this._$setDisabled(false);
                this._$getSelected();
            }
            
        }._$bind(this));

        this.__editor.addListener('focus', function () {
            this._$hideList();
        }._$bind(this));
    };
    /**
     *生成列表信息
     * @param  {array} || {map} _data 数据
     * @return {void}          
     */
    _proDropListSelect.__genItem = function(_data){
        //清除list内容
        this.__listP.innerHTML = '';

        if(!_data){
            return;
        }
        for (var i in _data) {
            if(_data.hasOwnProperty(i) && !!_data[i]){
                var _itemData = _data[i];
                var _txtNode = this.__genItmTpl(i , _data[i]);
                var _tpl = _e._$html2node(_txtNode);
                this.__doInitDomEvent([
                    [_tpl, 'mouseup', this.__itemClick._$bind(this,i)]
                ]);
                this.__listP.appendChild(_tpl);
            }

        };
    }
    /**
     *构造下拉类别节点数据    
     */
    _proDropListSelect.__genItmTpl = function(_key , _value){
        return '<div class=\"f-thide list" title=\"'+_u._$escape(_key.toString())+'\">'+ _u._$escape(_value.toString()) +'</div>';
    }
    /**
     * 分类点击
     * @param {event} _data类别数据
     * @param  {event} _event 事件
     * @return {void}  
     */
    _proDropListSelect.__itemClick = function(_data,_event){
        if(!!_event){
            _v._$stop(_event);
        }

        //设置选中类别
        this.__selectedData = _data;
        this._$setValue(this.__dataList[this.__selectedData]);
        //隐藏下拉列表
        this._$hideList();
        
    }
    
    /**
     * 设置disable状态
     */
    _proDropListSelect._$setDisabled = function(_disabled){
        if(!!_disabled){
            _e._$addClassName(this.__body,"js-disabled");
        }
        else{
            _e._$delClassName(this.__body,"js-disabled");
        }
        this.__disabled = !!_disabled;
    }

    /**
     * 编辑中动态判断选中
     * @return {Void}
     */
    _proDropListSelect._$getSelected = function(){
        var _value = this.__editor.queryCommandValue(this.__cmd);
        if(!!_value){
            this._$setValue(_value);
        }else{
            this._$setValue(this.__defalutName);
        }
    };
    /**
     * 设置选中文案
     * @return {Void}
     */
    _proDropListSelect._$setValue = function(_value){
        this.__up.innerText = _value;
    };

    /**
     * 下拉分类列表显示控制
     * @param  {enevt} _event 事件
     * @return {void}  
     */
    _proDropListSelect.__showDown = function(_event){
        if(!!_event)_v._$stop(_event);

        if(this.__listP.style.display != "block"){
            //显示下拉列表
            this.__listP.style.display = "block";
        }
        else{
            this._$hideList();
        }
    }
    /**
     * 隐藏下拉分类列表 
     */
    _proDropListSelect._$hideList = function(){
        this.__listP.style.display = "none";
    }
    
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proDropListSelect.__destroy = function(){
        this.__supDestroy();
    };

    _proDropListSelect.__hidePop = _proDropListSelect._$hideList;

    return _p._$$DropListSelect;

};

NEJ.define(
      ['{lib}ui/base.js',
       '../button/popup.js'],f);


