/**
 *  Droppable  放置类文件
 *
 *  @version  1.0
 *  @author   cqh <cqh@corp.netease.com>
 *  @module   pool/component-drag-drop/src/droppable
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
     * drop基类
     *
     * @example
     * <ux-droppable> your html or component</ux-droppable>
     *
     * @class
     * @extend module:pool/component-base/src/base.Base
     * @param {Object}       options.data                                初始化属性
     * @param {Object}       [options.data.data=null]                    拖放后传递过来的数据
     * @param {Boolean}      [options.data.disabled=false]               是否禁用
     * @param {String}       [options.data.class='z-droppable']          可放置时（即disabled=false）给元素附加此class
     * @param {String}       [options.data.dragOverClass='z-dragover']   当有拖拽元素经过时，给drop容器加上次类名
     *
     */
    var Droppable = Base.$extends({
        name: 'ux-droppable',
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
                'class': 'z-droppable',
                dragOverClass: 'z-dragover'
            });
            this.supr();

            dragDrop.droppables.push(this);
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
            this.$watch('disabled', function(newValue) {
                if(newValue)
                    _.dom.delClass(inner, this.data['class']);
                else
                    _.dom.addClass(inner, this.data['class']);
            });
            this.supr();
        },

        /**
         * 销毁-destroy
         *
         * @protected
         * @method
         * @return {Void}
         */
        destroy: function() {
            dragDrop.droppables.splice(dragDrop.droppables.indexOf(this), 1);
            this.supr();
        },

        /**
         * @method  拖拽进入
         * @private
         * @return {Void}
         */
        _dragEnter: function(origin) {

            var element = _.dom.element(this);

            /**
             * @event    dragenter          拖拽进入该元素时触发
             * @property {Object} sender    事件发送对象，为当前droppable
             * @property {Object} origin    拖拽源，为拖拽的draggable
             * @property {Object} source    拖拽起始元素
             * @property {Object} proxy     拖拽代理元素
             * @property {Object} target    拖拽目标元素
             * @property {Object} data      拖拽时接收到的数据
             * @property {Number} screenX   鼠标指针相对于屏幕的水平位置
             * @property {Number} screenY   鼠标指针相对于屏幕的垂直位置
             * @property {Number} clientX   鼠标指针相对于浏览器的水平位置
             * @property {Number} clientY   鼠标指针相对于浏览器的垂直位置
             * @property {Number} pageX     鼠标指针相对于页面的水平位置
             * @property {Number} pageY     鼠标指针相对于页面的垂直位置
             * @property {Number} movementX 鼠标指针水平位置相对于上次操作的偏移量
             * @property {Number} movementY 鼠标指针垂直位置相对于上次操作的偏移量
             * @property {Function} cancel  取消拖拽操作
             */
            this.$emit('dragenter', _.extend({
                sender: this,
                origin: origin,
                source: _.dom.element(origin),
                target: element,
                cancel: origin.cancel
            }, dragDrop));
        },

        /**
         * @method  拖拽离开
         * @private
         * @return {Void}
         */
        _dragLeave: function(origin) {
            if(this.data.disabled){
                this.data.disabled = false;
                this.$update();
                return;
            }
            var element = _.dom.element(this);
            _.dom.delClass(element, this.data.dragOverClass);

            /**
             * @event    dragleave          拖拽离开该元素时触发
             * @property {Object} sender    事件发送对象，为当前droppable
             * @property {Object} origin    拖拽源，为拖拽的draggable
             * @property {Object} source    拖拽起始元素
             * @property {Object} proxy     拖拽代理元素
             * @property {Object} target    拖拽目标元素
             * @property {Object} data      拖拽时接收到的数据
             * @property {Number} screenX   鼠标指针相对于屏幕的水平位置
             * @property {Number} screenY   鼠标指针相对于屏幕的垂直位置
             * @property {Number} clientX   鼠标指针相对于浏览器的水平位置
             * @property {Number} clientY   鼠标指针相对于浏览器的垂直位置
             * @property {Number} pageX     鼠标指针相对于页面的水平位置
             * @property {Number} pageY     鼠标指针相对于页面的垂直位置
             * @property {Number} movementX 鼠标指针水平位置相对于上次操作的偏移量
             * @property {Number} movementY 鼠标指针垂直位置相对于上次操作的偏移量
             * @property {Function} cancel  取消拖拽操作
             */
            this.$emit('dragleave', _.extend({
                sender: this,
                origin: origin,
                source: _.dom.element(origin),
                target: element,
                cancel: origin.cancel
            }, dragDrop));
        },

        /**
         * @method  拖拽在上方
         * @private
         * @return {Void}
         */
        _dragOver: function(origin) {
            if(this.data.disabled){
                return;
            }
            var element = _.dom.element(this);
            var dimension = _.dom.getDimension(element);
            _.dom.addClass(element, this.data.dragOverClass);


            /**
             * @event    dragover           拖拽在该元素上方时触发
             * @property {Object} sender    事件发送对象，为当前droppable
             * @property {Object} origin    拖拽源，为拖拽的draggable
             * @property {Object} source    拖拽起始元素
             * @property {Object} proxy     拖拽代理元素
             * @property {Object} target    拖拽目标元素
             * @property {Object} data      拖拽时接收到的数据
             * @property {Number} ratioX    鼠标指针相对于接收元素所占的长度比
             * @property {Number} ratioY    鼠标指针相对于接收元素所占的高度比
             * @property {Number} screenX   鼠标指针相对于屏幕的水平位置
             * @property {Number} screenY   鼠标指针相对于屏幕的垂直位置
             * @property {Number} clientX   鼠标指针相对于浏览器的水平位置
             * @property {Number} clientY   鼠标指针相对于浏览器的垂直位置
             * @property {Number} pageX     鼠标指针相对于页面的水平位置
             * @property {Number} pageY     鼠标指针相对于页面的垂直位置
             * @property {Number} movementX 鼠标指针水平位置相对于上次操作的偏移量
             * @property {Number} movementY 鼠标指针垂直位置相对于上次操作的偏移量
             * @property {Function} cancel  取消拖拽操作
             */
            this.$emit('dragover', _.extend({
                sender: this,
                origin: origin,
                source: _.dom.element(origin),
                target: element,
                ratioX: (dragDrop.clientX - dimension.left)/dimension.width,
                ratioY: (dragDrop.clientY - dimension.top)/dimension.height,
                cancel: origin.cancel
            }, dragDrop));
        },

        /**
         * @method  拖拽释放入
         * @private
         * @return {Void}
         */
        _drop: function(origin) {
            if(this.data.disabled){
                this.data.disabled = false;
                this.$update();
                return;
            }
            var element = _.dom.element(this);
            _.dom.delClass(element, this.data.dragOverClass);
            var dimension = _.dom.getDimension(element);

            this.data.data = origin.data.data;
            this.$update();

            /**
             * @event    drop            拖拽放置时触发
             * @property {Object} sender 事件发送对象，为当前droppable
             * @property {Object} origin 拖拽源，为拖拽的draggable
             * @property {Object} source 拖拽起始元素
             * @property {Object} proxy 拖拽代理元素
             * @property {Object} target 拖拽目标元素
             * @property {Object} data 拖拽时接收到的数据
             * @property {Number} ratioX 鼠标指针相对于接收元素所占的长度比
             * @property {Number} ratioY 鼠标指针相对于接收元素所占的高度比
             * @property {Number} screenX 鼠标指针相对于屏幕的水平位置
             * @property {Number} screenY 鼠标指针相对于屏幕的垂直位置
             * @property {Number} clientX 鼠标指针相对于浏览器的水平位置
             * @property {Number} clientY 鼠标指针相对于浏览器的垂直位置
             * @property {Number} pageX 鼠标指针相对于页面的水平位置
             * @property {Number} pageY 鼠标指针相对于页面的垂直位置
             * @property {Number} movementX 鼠标指针水平位置相对于上次操作的偏移量
             * @property {Number} movementY 鼠标指针垂直位置相对于上次操作的偏移量
             */
            this.$emit('drop', _.extend({
                sender: this,
                origin: origin,
                source: _.dom.element(origin),
                target: element,
                ratioX: (dragDrop.clientX - dimension.left)/dimension.width,
                ratioY: (dragDrop.clientY - dimension.top)/dimension.height
            }, dragDrop));
        }
    });
    return Droppable;
});
