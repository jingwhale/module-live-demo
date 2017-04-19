/**
 * @author: hzliuzongyuan@corp.netease.com
 * popover组件
 * 鼠标悬浮在dep上则显示,离开则消失;
 * 选定某一项之后执行回调;
 * 可能由于疏忽为多个项填写了selected:true,
 * 始终以列表项中第一个出现selected:true的为选中项。
 *
 * @param _opts
 *  dep     挂载的元素
 *  type    为1单选,为2复选
 *  klass   附加类名,空格隔开
 *  list            {array}
 *      selected    {boolean}    选中
 *      value       {string}     innerHTML
 *      data        {object}     该列表项附带的数据
 *
 *  onSelect        {function}   选择某项时触发的回调函数
 *      _newData    {object}     被选择的项带有的数据,对应上面的data
 *      _oldData    {object}     上一个选择项带有的数据
 *      _operation  {object}     type为2才有此参数,_operation.name代表操作名称('select','unselect');_operation.data代表对应的数据
 *
 * @method select   TODO 暂不支持复选
 *  callback 该回调函数会在遍历list的过程中被执行,为true则选择此项
 *      _v          {object}
 *      _i          {number}
 *      _list       {array}
 *
 * @constructor
 */
NEJ.define([
    'lib/base/element',
    'lib/base/event',
    'lib/base/util'
], function (_e,
             _v,
             _u,
             p, o, f, r) {

    var _pro = Popover.prototype;

    function Popover(_opts) {

        var _defaultOpts = {
            dep: document.body,
            type:1,
            klass: '',
            list: [{selected: true, value: 'item', data: null}],
            onSelect: function (_data) {
            }
        };

        var _ul = null,
            _lis = '',
            _item = null,
            _itemClassStr = '',
            _selectedFlag = false;  // li上的class值

        // 判断列表项是否是第一个被选中的
        var _isFirstSelected = (function () {
            var _flag = true;

            return function (_item) {
                if (_item.selected && _flag) {
                    _flag = false;
                    return true;
                } else {
                    return false;
                }
            }
        })();

        _opts = _u._$merge({},_defaultOpts,_opts);  // 合并配置

        // 初始化实例
        this.opts = _opts;
        this.list = this.opts.list;
        this.type = this.opts.type;
        this.crtSelData = null;
        this.crtSelElem = null;
        this.preSelData = null;
        this.preSelElem = null;

        this.mouseenterCb = null;
        this.mouseleaveCb = null;

        this.rootNode = null;

        // 创建DOM
        this.rootNode = _e._$create('div', 'm-popover ' + (this.type==2?'m-popover-multi ':'') +_opts.klass, _opts.dep);
        _ul = _e._$create('ul', '', this.rootNode);

        if(this.type == 2){
            this.crtSelData = [];
        }else{

        }

        for (var i = 0; i < _opts.list.length; i++) {
            _item = _opts.list[i];

            if(this.type == 2){
                _selectedFlag = _item.selected;
            }else{
                _selectedFlag = _isFirstSelected(_item);
            }

            if (_selectedFlag) {

                if(this.type == 2){
                    this.crtSelData.push[_item.data];
                }else{
                    this.crtSelData = _item.data;
                }

                _itemClassStr = 'class="item z-sel"';
            } else {
                _itemClassStr = 'class="item"';
            }

            _lis += '<li ' + _itemClassStr + ' data-index="' + i + '">' + _item.value + '</li>';
            _itemClassStr = '';
        }

        _ul.innerHTML = _lis;

        if(this.type == 2){

        }else{
            this.crtSelElem = _e._$getByClassName(_ul, 'z-sel')[0];
        }

        this._initEvent();
    }

    _pro._initEvent = function () {

        var _self = this,
            _opts = this.opts;

        function _getSelData(_selElems){

            var _data = [];

            for (var i = 0; i < _selElems.length; i++) {
                _data.push(_self.list[_e._$dataset(_selElems[i],'index')].data)
            }

            return _data;
        }

        this.mouseenterCb = function () {
            _e._$addClassName(_self.rootNode, 'z-show');
        }

        this.mouseleaveCb = function () {
            _e._$delClassName(_self.rootNode, 'z-show');
        }

        // 添加显示逻辑
        _v._$addEvent(_opts.dep, 'mouseenter', this.mouseenterCb);

        // 添加隐藏逻辑
        _v._$addEvent(_opts.dep, 'mouseleave', this.mouseleaveCb);

        // 选择逻辑,不同类型有不同选择逻辑
        if(this.type == 2){
            _v._$addEvent(this.rootNode, 'click', function (_event) {

                var _target = _v._$getElement(_event),
                    _operation = {};

                if (_target.nodeName.toUpperCase() == 'LI') {

                    _operation.data = _opts.list[_e._$dataset(_target,'index')].data;

                    _self.preSelData = _getSelData(_e._$getByClassName(_self.rootNode,'z-sel'));

                    if(_e._$hasClassName(_target,'z-sel')){
                        _operation.name = 'unSelect';
                        _e._$delClassName(_target,'z-sel');
                    }else{
                        _operation.name = 'select';
                        _e._$addClassName(_target,'z-sel');
                    }

                    _self.crtSelData = _getSelData(_e._$getByClassName(_self.rootNode,'z-sel'));

                    // 选择回调
                    _opts.onSelect(_self.crtSelData, _self.preSelData,_operation);
                }
            })
        }else{
            _v._$addEvent(this.rootNode, 'click', function (_event) {

                var _target = _v._$getElement(_event);

                if (_target.nodeName.toUpperCase() == 'LI') {

                    if (_target == _self.crtSelElem) {    // 避免重复点击
                        return;
                    } else {

                        // 数据变化
                        _self.preSelElem = _self.crtSelElem;
                        _self.crtSelElem = _target;
                        _self.preSelData = _self.crtSelData;
                        _self.crtSelData = _opts.list[+_e._$dataset(_self.crtSelElem, 'index')].data;

                        // 添加选定样式
                        _e._$delClassName(_self.preSelElem, 'z-sel');
                        _e._$addClassName(_self.crtSelElem, 'z-sel');

                        // 选择回调
                        _opts.onSelect(_self.crtSelData, _self.preSelData);
                    }
                }
            })
        }
    }

    _pro.select = function (_cb,_onSelectFlag) {

        var _index = -1,
            _selData = null;

        if(_onSelectFlag === undefined){
            _onSelectFlag = true
        }

        for (var i = 0,_item; i < this.list.length; i++) {
            _item = this.list[i];

            if (_cb.call(this,_item,i,this.list)) {
                _selData = _item.data;
                _index = i;
                break;
            }
        }

        // 没找到该项
        if (_index == -1) {
            return;
        } else {
            // 不允许重复选择
            if (this.crtSelData == _selData) {
                return;
            } else {
                // 数据变化
                this.preSelElem = this.crtSelElem;
                this.crtSelElem = _e._$getByClassName(this.rootNode, 'item')[_index];
                this.preSelData = this.crtSelData;
                this.crtSelData = _selData;

                // 添加选定样式
                _e._$delClassName(this.preSelElem, 'z-sel');
                _e._$addClassName(this.crtSelElem, 'z-sel');

                // 选择回调
                if(_onSelectFlag){
                    this.opts.onSelect(this.crtSelData, this.preSelData);
                }
            }
        }

        return this.crtSelData;
    }

    _pro.destroy = function () {
        _e._$remove(this.rootNode);
        _v._$delEvent(this.opts.dep, 'mouseenter', this.mouseenterCb);
        _v._$delEvent(this.opts.dep, 'mouseleave', this.mouseleaveCb);
    }

    return Popover;
})