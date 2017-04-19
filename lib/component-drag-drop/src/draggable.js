/**
 *  Draggable 拖拽类文件
 *
 *  @version  1.0
 *  @author   cqh <cqh@corp.netease.com>
 *  @module   pool/component-drag-drop/src/draggable
 */
NEJ.define([
    'pool/component-base/src/base',
    './util.js',
    './dragDrop.js'
],function(
    Base,
    _,
    dragDrop
){
    /**
     * drag基类
     *
     * @example
     * <ux-draggable> your html or component</ux-draggable>
     *
     * @class
     * @extend module:pool/component-base/src/base.Base
     * @param {Object}                   options.data                            初始化属性
     * @param {Object}                   [options.data.data=null]                拖拽传递的数据
     * @param {String|Element|Function}  [options.data.proxy="clone"]            拖拽代理，即拖拽时显示的元素。支持clone/self/选择器,直接传入代理元素，函数(返回代理元素)，<draggable.proxy>包裹代理元素
     * @param {String}                   [options.data.direction="all"]          拖拽代理可以移动的方向，`all`为任意方向，`horizontal`为水平方向，`vertical`为垂直方向
     * @param {Boolean}                  [options.data.disabled=false]           是否禁用
     * @param {String}                   [options.data.class='z-draggable']      可拖拽时（即disabled=false）给元素附加此class
     * @param {String}                   [options.data.dragClass='z-drag']       拖拽该元素时给元素附加此class
     * @param {Boolean}                  [options.data.notPreventDefault=false]  mousedown的时候是否preventDefault,默认阻止
     *
     */

    // 解决点击一下，两个事件mouseDown
    var _mouseDownFlag =  false;

    var _useragent = window.navigator.userAgent;
    // ie8有offsetLeft兼容性问题，直接不显示代理元素
    var isIe8 = new RegExp("MSIE 8.0",'i').test(_useragent);

    var Draggable = Base.$extends({
        name: 'ux-draggable',
        template: '{#inc this.$body}',

        /**
         * 初始化-config
         *
         * @protected
         * @method
         * @return {Void}
         */
        config: function() {
            _.extend(this.data, {
                data: null,
                proxy: 'clone',
                direction: 'all',
                'class': 'z-draggable',
                dragClass: 'z-drag'
            });
            this.supr();

            this._onMouseDown = this._onMouseDown.bind(this);
            this._onBodyMouseMove = this._onBodyMouseMove.bind(this);
            this._onBodyMouseUp = this._onBodyMouseUp.bind(this);
            this.cancel = this.cancel.bind(this);
        },

        /**
         * 初始化-init
         *
         * @protected
         * @method
         * @return {Void}
         */
        init: function() {

            var inner = _.dom.element(this);
            _.dom.on(inner, 'mousedown', this._onMouseDown);
            this.supr();

            this.$watch('disabled', function(newValue) {
                if(newValue){
                    _.dom.delClass(inner, this.data['class']);

                }else{
                    _.dom.addClass(inner, this.data['class']);
                }
            });
        },

        /**
         * @method  获取拖拽代理
         * @private
         * @return {Element} 拖拽代理元素
         */
        _getProxy: function() {
            var dimension, proxy, oldProxy;
            if(typeof this.data.proxy === 'function'){
                oldProxy = this.data.proxy();
                if(!oldProxy){return}
                proxy =  oldProxy.cloneNode(true);
                dimension = _.dom.getDimension(_.dom.element(this));
                this._initProxy(proxy, dimension);
                oldProxy.parentElement.appendChild(proxy);
                return proxy;
            }
            else if(this.data.proxy.nodeType && this.data.proxy instanceof Element) {
                // 直接传入页面中有的元素进行代理
                proxy = this.data.proxy.cloneNode(true);
                dimension = _.dom.getDimension(_.dom.element(this));
                this._initProxy(proxy, dimension);
                this.data.proxy.parentElement.appendChild(proxy);
                return proxy;
            }
            else if(this.data.proxy instanceof Draggable.Proxy) {
                proxy = _.dom.element(this.data.proxy);
                dimension = _.dom.getDimension(_.dom.element(this));
                this._initProxy(proxy, dimension);
                document.body.appendChild(proxy);
                return proxy;

            } else if(this.data.proxy === 'clone') {
                var self = _.dom.element(this);
                dimension = _.dom.getDimension(self);
                proxy = self.cloneNode(true);
                this._initProxy(proxy, dimension);
                self.parentElement.appendChild(proxy);
                return proxy;

            } else if(this.data.proxy === 'self') {
                proxy = _.dom.element(this);
                dimension = _.dom.getDimension(proxy);
                this._initProxy(proxy, dimension);
                return proxy;
            }
            else if(typeof this.data.proxy === 'string'){ // 选择器
                oldProxy = _.dom.find(this.data.proxy);
                if(!oldProxy){return}
                proxy =  oldProxy.cloneNode(true);
                dimension = _.dom.getDimension(_.dom.element(this));
                this._initProxy(proxy, dimension);
                oldProxy.parentElement.appendChild(proxy);
                return proxy;
            }
        },

        /**
         * @method 初始化拖拽代理
         * @private
         * @return {void}
         */
        _initProxy: function(proxy, dimension) {
            proxy.style.left = dimension.left + (this.data.leftFix||0) + 'px'; //可以传入leftFix topFix进行修正
            proxy.style.top = dimension.top + (this.data.topFix||0) + 'px';
            proxy.style.zIndex = '2000';
            proxy.style.position = 'fixed';
            proxy.style.display = '';
            if(isIe8){
                proxy.style.display = 'none';

            }
        },

        /**
         * @method mouseDown函数
         * @private
         * @return {void}
         */
        _onMouseDown: function($event) {
            if(_mouseDownFlag||this.data.disabled){
                return;
            }
            _mouseDownFlag = true;

            if(!this.data.notPreventDefault){
                $event.preventDefault();
            }
            //避免选中元素
            _.dom.addClass(document.body, 'f-unselectable');
            _.dom.on(document, 'mousemove', this._onBodyMouseMove);
            _.dom.on(document, 'mouseup', this._onBodyMouseUp);
        },

        /**
         * @method mouseMove函数
         * @private
         * @return {void}
         */
        _onBodyMouseMove: function($event) {
            _mouseDownFlag = false;
            var e = $event.event;
            $event.preventDefault();
            if(dragDrop.dragging === false) {
                _.extend(dragDrop, {
                    dragging: true,
                    data: this.data.data,
                    proxy: this._getProxy(),
                    screenX: e.screenX,
                    screenY: e.screenY,
                    clientX: e.clientX,
                    clientY: e.clientY,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    movementX: 0,
                    movementY: 0,
                    droppable: undefined
                }, true);

                this._dragStart();
            } else {
                _.extend(dragDrop, {
                    screenX: e.screenX,
                    screenY: e.screenY,
                    clientX: e.clientX,
                    clientY: e.clientY,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    movementX: e.screenX - dragDrop.screenX,
                    movementY: e.screenY - dragDrop.screenY
                }, true);

                if(dragDrop.proxy) {
                    if(this.data.direction === 'all' || this.data.direction === 'horizontal')
                        dragDrop.proxy.style.left = dragDrop.proxy.offsetLeft + dragDrop.movementX + 'px';

                    if(this.data.direction === 'all' || this.data.direction === 'vertical')
                        dragDrop.proxy.style.top = dragDrop.proxy.offsetTop + dragDrop.movementY + 'px';
                }

                this._drag();
                if(!dragDrop.dragging)
                    return;

                // Drop
                var pointElement = null;
                if(dragDrop.proxy) {
                    dragDrop.proxy.style.display = 'none';
                    pointElement = document.elementFromPoint(e.clientX, e.clientY);
                    if(!isIe8){
                        dragDrop.proxy.style.display = '';
                    }

                } else{
                    pointElement = document.elementFromPoint(e.clientX, e.clientY);

                }

                var element = pointElement;
                var pointDroppable = null;
                while(element) {
                    pointDroppable = dragDrop.droppables.find(function(droppable){
                        var target = _.dom.element(droppable);
                        if(element === target){
                            return true;
                        }
                    });
                    if(pointDroppable){
                        break;
                    }
                    element = element.parentElement;
                }


                if(dragDrop.droppable !== pointDroppable) {
                    dragDrop.droppable && dragDrop.droppable._dragLeave(this);
                    if(!dragDrop.dragging)
                        return;
                    pointDroppable && pointDroppable._dragEnter(this);
                    if(!dragDrop.dragging)
                        return;
                    dragDrop.droppable = pointDroppable;
                } else
                    pointDroppable && pointDroppable._dragOver(this);
            }

        },

        /**
         * @method mouseUp函数
         * @private
         * @return {void}
         */
        _onBodyMouseUp: function($event) {
            _mouseDownFlag = false;
            $event.preventDefault();
            _.dom.delClass(document.body, 'f-unselectable');
            this._dragEnd();
            dragDrop.droppable && dragDrop.droppable._drop(this);
            this.cancel();
        },

        /**
         * 组件change的响应方法
         *
         * @private
         * @method
         * @return {Void}
         */
        cancel: function() {

            if(dragDrop.proxy) {
                if(this.data.proxy != 'self' && dragDrop.proxy.parentElement) //销毁
                    dragDrop.proxy.parentElement.removeChild(dragDrop.proxy);

                _.dom.delClass(dragDrop.proxy, this.data.dragClass);
            }

            _.extend(dragDrop, {
                dragging: false,
                data: null,
                proxy: null,
                screenX: 0,
                screenY: 0,
                clientX: 0,
                clientY: 0,
                pageX: 0,
                pageY: 0,
                movementX: 0,
                movementY: 0,
                droppable: undefined
            }, true);

            _.dom.off(document, 'mousemove', this._onBodyMouseMove);
            _.dom.off(document, 'mouseup', this._onBodyMouseUp);
        },
        /**
         * @private
         */
        _dragStart: function() {
            if(dragDrop.proxy)
                _.dom.addClass(dragDrop.proxy, this.data.dragClass);

            /**
             * @event          dragstart 拖拽开始时触发
             * @param {Object} sender    事件发送对象，为当前draggable
             * @param {Object} origin    拖拽源，为当前draggable
             * @param {Object} source    拖拽起始元素
             * @param {Object} proxy     拖拽代理元素
             * @param {Object} data      拖拽时需要传递的数据
             * @param {Number} screenX   鼠标指针相对于屏幕的水平位置
             * @param {Number} screenY   鼠标指针相对于屏幕的垂直位置
             * @param {Number} clientX   鼠标指针相对于浏览器的水平位置
             * @param {Number} clientY   鼠标指针相对于浏览器的垂直位置
             * @param {Number} pageX     鼠标指针相对于页面的水平位置
             * @param {Number} pageY     鼠标指针相对于页面的垂直位置
             * @param {Number} movementX 鼠标指针水平位置相对于上次操作的偏移量
             * @param {Number} movementY 鼠标指针垂直位置相对于上次操作的偏移量
             * @param {Function} cancel  取消拖拽操作
             */
            this.$emit('dragstart', _.extend({
                sender: this,
                origin: this,
                source: _.dom.element(this),
                proxy: dragDrop.proxy,
                cancel: this.cancel
            }, dragDrop));
        },

        /**
         * @method 正在拖拽函数
         * @private
         * @return {void}
         */
        _drag: function() {
            /**
             * @event drag     正在拖拽时触发
             * @param {Object} sender       事件发送对象，为当前draggable
             * @param {Object} origin       拖拽源，为当前draggable
             * @param {Object} source       拖拽起始元素
             * @param {Object} proxy        拖拽代理元素
             * @param {Object} data         拖拽时需要传递的数据
             * @param {Number} screenX      鼠标指针相对于屏幕的水平位置
             * @param {Number} screenY      鼠标指针相对于屏幕的垂直位置
             * @param {Number} clientX      鼠标指针相对于浏览器的水平位置
             * @param {Number} clientY      鼠标指针相对于浏览器的垂直位置
             * @param {Number} pageX        鼠标指针相对于页面的水平位置
             * @param {Number} pageY        鼠标指针相对于页面的垂直位置
             * @param {Number} movementX    鼠标指针水平位置相对于上次操作的偏移量
             * @param {Number} movementY    鼠标指针垂直位置相对于上次操作的偏移量
             * @param {Function} cancel     取消拖拽操作
             */
            this.$emit('drag', _.extend({
                sender: this,
                origin: this,
                source: _.dom.element(this),
                proxy: dragDrop.proxy,
                cancel: this.cancel
            }, dragDrop));
        },
        /**
         * @method 拖拽结束函数
         * @private
         * @return {void}
         */
        _dragEnd: function() {
            /**
             * @event dragend           拖拽结束时触发
             * @param {Object} sender   事件发送对象，为当前draggable
             * @param {Object} origin   拖拽源，为当前draggable
             * @param {Object} source   拖拽起始元素
             * @param {Object} proxy    拖拽代理元素
             */
            this.$emit('dragend', {
                sender: this,
                origin: this,
                source: _.dom.element(this),
                proxy: dragDrop.proxy
            });

            if(dragDrop.proxy) {
                if(this.data.proxy != 'self' && dragDrop.proxy.parentElement) //销毁
                    dragDrop.proxy.parentElement.removeChild(dragDrop.proxy);

                _.dom.delClass(dragDrop.proxy, this.data.dragClass);
            }
        }
    });

    Draggable.Proxy = Base.extend({
        name: 'draggable.proxy',
        template: '{#inc this.$body}',
        init: function() {
            if(this.$outer instanceof Draggable) {
                _.dom.element(this).style.display = 'none';
                this.$outer.data.proxy = this;
            }
        }
    });
    return Draggable;
});
