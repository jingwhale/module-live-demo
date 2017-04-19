/**
 * 进度条组件
 * @version 0.2
 * @author hzliuzongyuan@corp.netease.com
 * @deps NEJ
 * @property:
 *  this.opts               {object}        传入的配置项
 *  this.isDragging         {boolean}       从mousedown开始到mouseup结束
 *  this.type               {number}        暂时支持1(水平以左为起点),4(垂直以下为起点)
 *  this.anchors            {array}         传入的驻点
 *  this.preProgressPos     {number}        进度条之前的位置
 *  this.crtProgressPos     {number}        进度条现在的位置
 *
 * @api:
 *  this.insertTo           {function}      将节点插入到某元素中
 *  @params:
 *      node                {object}        只能为单个节点
 *      where               {string}        默认为'append',可选'prepend'代表插入到该节点的最前面
 *  @returns                {object}        返回this
 *
 *  this.getCursorPos       {function}      当鼠标在根节点上时,可以对应的位置
 *  @params:
 *      event               {object}        事件对象
 *  @returns                {number}        0-1整数或浮点数
 *
 *  this.setProgressPos     {function}      设置进度条位置
 *  @params:
 *      position            {number}
 *
 *  this.setBufferPos       {function}      设置缓冲条位置
 *  @params:
 *      position            {number}
 *
 *  this.reset              {function}      重置该实例
 *  @params:
 *      opts                {object}        与new时传的参数一样,但不能传type
 *
 * @remark
 *  this 含义 TODO
 *  配置请参考_defaultOpts
 *  事件顺序依次为:mousedown mousemove click mouseup
 *
 * @todos
 */

NEJ.define([
    'lib/base/element',
    'lib/base/event',
    'lib/base/util'
], function (_e,
             _v,
             _u,
             p, o, f, r) {

    var _pro = ProgressBar.prototype;

    // 提供控制buffer、进度条位移的方法
    function ProgressBar(_opts) {

        var _rootNode = null;

        var _defaultOpts = {
            klass: '',
            type: 1, // h:horizonal v:vertical t:top r:right b:bottom l:left。1:hl,2:hr,3:vt,4:vb
            start: 0,    // 进度条起始位置
            anchors: [],    // [{position:0.1}]
            init: function () { // 此时实例已完成初始化(属性、dom及事件),但尚未插入文档

            },
            onAnchor: function (_anchor) {

            },
            onMousedown: function (_pos, _event) {

            },
            onMousemove: function (_pos, _event) {

            },
            onMouseup: function (_pos, _event) {

            },
            onHover: function (_pos, _event) {

            },
            onChange: function (_crtProgressPos, _preProgressPos) {

            }
        }

        _opts = _u._$merge({}, _defaultOpts, _opts);  // 合并配置

        this._initProperty(_opts);

        // dom
        _rootNode = _e._$create('div');
        _rootNode.innerHTML = '<div class="backgroundbar"></div>\
            <div class="bufferbar"></div>\
            <div class="progressbar"></div>\
            <div class="drag_item"></div>';

        // 初始化类名
        this._initClass(_rootNode);

        // 初始化实例属性(dom)
        this.rootNode = _rootNode;
        this._dragItem = _e._$getByClassName(this.rootNode, 'drag_item')[0];
        this._progressbar = _e._$getByClassName(this.rootNode, 'progressbar')[0];
        this._bufferbar = _e._$getByClassName(this.rootNode, 'bufferbar')[0];
        this._anchorsElems = [];

        this._initEvent();

        // init在整个生命周期里只执行一次
        this.opts.init.call(this);

        return this;
    }

    /*==================== 内部方法 ====================*/
    _pro._initProperty = function (_opts) {
        this.opts = _opts;
        this.isDragging = false;    // 给外部用,从mousedown开始到mouseup结束
        this.type = this.opts.type;
        this.anchors = this.opts.anchors || [];
        this.preProgressPos = -1;

        if (this.opts.start <= 0) {
            this.crtProgressPos = 0;
        } else if (this.opts.start >= 1) {
            this.crtProgressPos = 1;
        } else {
            this.crtProgressPos = this.opts.start;
        }
    }

    _pro._initClass = function (_rootNode) {

        var _classStr = 'm-progressbar';

        switch (this.type) {
            case 2:
                _classStr += ' m-progressbar-hr';
                break;
            case 3:
                _classStr += ' m-progressbar-vt';
                break;
            case 4:
                _classStr += ' m-progressbar-vb';
                break;
            default:
                _classStr += '';
                break;
        }

        _classStr += ' ' + this.opts.klass;

        _e._$addClassName(_rootNode, _classStr);
    }

    _pro._initEvent = function () {

        var _self = this;

        // hover
        _v._$addEvent(this.rootNode, 'mousemove', this._onHover._$bind(this));

        // 拖动dragItem
        _v._$addEvent(this.rootNode, 'mousedown', this._onMousedown._$bind(this));

        // hack,用来在resize时重置UI元素的位置,否则会出现样式问题
        // 根本原因是因为部分UI元素(如dragItem、驻点)的位置本应该用相对值-绝对值的方式来表示,但css不支持
        // 如果都用相对值表示,在屏幕尺寸发生变化的时候,就需要进行调整
        // 这并不能涵盖所有情况,进度条的长宽可能因为其它因素发生变化 TODO
        _v._$addEvent(window, 'resize', _throttle(function () {
            _self._setBarPos(_self.crtProgressPos, 'progress');
            _self._setDragItemPos(_self.crtProgressPos);
            _self._removeAnchors();
            _self._initAnchors();
        }, 0));
    }

    _pro._initProgress = function () {
        this._setBarPos(this.crtProgressPos, 'progress');
        this._setDragItemPos(this.crtProgressPos);
    }

    _pro._initAnchors = function () {
        var _self = this,
            _type = this.type,
            _anchors = this.anchors;

        function _setAnchor(_pos) {

            var _rootNodeWidth = _self.rootNode.offsetWidth,
                _rootNodeHeight = _self.rootNode.offsetHeight,
                _node = _e._$create("div", "anchor", _self.rootNode),
                _nodeWidth = _node.offsetWidth,
                _nodeHeight = _node.offsetHeight;

            function _getPos() {
                switch (_type) {
                    case 1 :
                        if (_pos * _rootNodeWidth <= _nodeWidth) {
                            return 0;
                        } else {
                            return _pos - _nodeWidth / _rootNodeWidth;
                        }
                        break;
                    case 4 :
                        if (_pos * _rootNodeHeight <= _nodeHeight) {
                            return 0;
                        } else {
                            return _pos - _nodeHeight / _rootNodeHeight;
                        }
                        break;
                }
            }

            switch (_type) {
                case 1 :
                    _e._$style(_node, {left: _getPos() * 100 + '%'});
                    break;
                case 4 :
                    _e._$style(_node, {bottom: _getPos() * 100 + '%'});
                    break;
            }

            _self._anchorsElems.push(_node);
        }

        for (var i = 0; i < _anchors.length; i++) {
            _setAnchor(_anchors[i].position);
        }

        this._isAnchor(this.crtProgressPos);
    }

    _pro._removeAnchors = function () {
        for (var i = 0; i < this._anchorsElems.length; i++) {
            _e._$remove(this._anchorsElems[i]);
        }

        this._anchorsElems = [];
    }

    _pro._onHover = function (_event) {
        this.opts.onHover.call(this, this.getPosByCursor(_event), _event);
    }

    _pro._onMousedown = function (_mouseDownEvent) {

        var _self = this;

        function _mousemoveCallback(_mousemoveEvent) {
            _self.preProgressPos = _self.crtProgressPos;
            _self.crtProgressPos = _self.getPosByCursor(_mousemoveEvent);
            _self._setProgressPos(_self.crtProgressPos);
            _self.opts.onMousemove.call(_self, _self.crtProgressPos, _mousemoveEvent);
        }

        function _mouseupCallback(_mouseupEvent) {
            _self.isDragging = false;
            _self.preProgressPos = _self.crtProgressPos;
            _self.crtProgressPos = _self.getPosByCursor(_mouseupEvent);
            _self._setProgressPos(_self.crtProgressPos);
            _self.opts.onMouseup.call(_self, _self.crtProgressPos, _mouseupEvent);

            _v._$delEvent(document, 'mousemove', _mousemoveCallback)
            _v._$delEvent(document, 'mouseup', _mouseupCallback);
        }

        this.isDragging = true;
        this.preProgressPos = this.crtProgressPos;
        this.crtProgressPos = this.getPosByCursor(_mouseDownEvent);
        this._setProgressPos(this.crtProgressPos);
        this.opts.onMousedown.call(this, this.crtProgressPos, _mouseDownEvent);

        _v._$addEvent(document, 'mousemove', _mousemoveCallback)
        _v._$addEvent(document, 'mouseup', _mouseupCallback);
    }

    _pro._setBarPos = function (_pos, _name) {
        var _type = this.type,
            _bar = _name === 'progress' ? this._progressbar : this._bufferbar;

        switch (_type) {
            case 1:
                _e._$style(_bar, {width: _pos * 100 + '%'});
                break;
            case 4:
                _e._$style(_bar, {height: _pos * 100 + '%'});
                break;
        }
    }

    _pro._setDragItemPos = function (_pos) {

        var _type = this.type,
            _rootNodeWidth = this.rootNode.offsetWidth,
            _rootNodeHeight = this.rootNode.offsetHeight,
            _dragItemWidth = this._dragItem.offsetWidth,
            _dragItemHeight = this._dragItem.offsetHeight;

        switch (_type) {
            case 1:
                _e._$style(this._dragItem, {left: _rootNodeWidth * _pos - _dragItemWidth * _pos + 'px'});
                break;

            case 4:
                _e._$style(this._dragItem, {bottom: _rootNodeHeight * _pos - _dragItemHeight * _pos + 'px'});
                break;
        }
    }

    _pro._setProgressPos = function (_pos) {
        this._setBarPos(_pos, 'progress');
        this._setDragItemPos(_pos);
    }

    // 判断是否到达anchor,若到达则触发onAnchor
    _pro._isAnchor = function (_pos) {
        for (var i = 0; i < this.anchors.length; i++) {
            if (this.anchors[i].position == _pos) {
                this.opts.onAnchor.call(this, this.anchors[i]);
                break;
            }
        }
    }
    /*==================== /内部方法 ====================*/

    // UI都在这里初始化
    _pro.insertTo = function (_node, _where) {
        _where || (_where = 'append');

        if (typeof _where != 'string') {
            _where = 'append';
        }

        _where = _where.toLowerCase();

        if (_where == 'prepend') {
            _node.insertBefore(this.rootNode, _node.childNodes[0]);
        } else if (_where == 'append') {
            _node.appendChild(this.rootNode);
        }

        // 初始化UI
        this._initProgress();
        this._initAnchors();

        return this;
    }

    _pro.getPosByCursor = function (_event) {

        var _type = this.type,
            _cursorX = _v._$clientX(_event),
            _cursorY = _v._$clientY(_event),
            _rootNodeX = _e._$offset(this.rootNode).x,
            _rootNodeY = _e._$offset(this.rootNode).y,
            _rootNodeWidth = this.rootNode.offsetWidth,
            _rootNodeHeight = this.rootNode.offsetHeight;

        switch (_type) {
            case 1:
                if (_cursorX <= _rootNodeX) {
                    return 0;
                } else if (_cursorX >= _rootNodeX + _rootNodeWidth) {
                    return 1;
                } else {
                    return (_cursorX - _rootNodeX) / _rootNodeWidth;
                }
                break;
            case 4:
                if (_cursorY >= _rootNodeY + _rootNodeHeight) {
                    return 0;
                } else if (_cursorY <= _rootNodeY) {
                    return 1;
                } else {
                    return (_rootNodeHeight + _rootNodeY - _cursorY) / _rootNodeHeight;
                }
                break;
        }
    }

    _pro.setBufferPos = function (_pos) {
        this._setBarPos(_pos, 'buffer');
    }

    // 提供给外部的控制进度条位移的方法,和内部的有区别
    // 对_pos进行限制 TODO
    // _flag控制是否调用事件回调
    _pro.setProgressPos = function (_pos,_flag) {

        if(_flag === undefined){
            _flag = true;
        }

        if (this.crtProgressPos == _pos) {   //如果位移相同不做任何操作
            return _pos;
        } else {
            this.preProgressPos = this.crtProgressPos;
            this.crtProgressPos = _pos;

            this._setBarPos(_pos, 'progress');
            this._setDragItemPos(_pos);

            if(_flag){
                this.opts.onChange.call(this, this.crtProgressPos, this.preProgressPos);
            }

            this._isAnchor(_pos);
        }
    }

    // 不允许重置type
    _pro.reset = function (_opts) {

        var _isAnchorsSame = false;

        _isAnchorsSame = _opts.anchors == this.opts.anchors ? true : false;

        // 与原有参数合并
        _opts = _u._$merge({}, this.opts, _opts);

        // 重置实例属性
        this._initProperty(_opts);

        // 重置class
        this._initClass(this.rootNode);

        // 重置UI
        this._initProgress();
        if (!_isAnchorsSame) {
            this._removeAnchors();
            this._initAnchors();
        }
    }

    /*==================== 工具函数 ====================*/
    // 降频函数
    function _throttle(_callback, _time) {

        var _t = null;

        return function () {

            var _self = this,
                _args = arguments;

            clearTimeout(_t);

            _t = setTimeout(function () {
                _callback.apply(_self, _args);
            }, _time)
        }
    }

    return ProgressBar;
})
