/**
 * Hover 组件实现文件
 *
 * @version  1.0
 * @author   hzshenhongliang <hzshenhongliang@corp.netease.com>
 * @module   pool/component-hover/src/hover/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    '../hoverlist/ui.js'
], function(
    Component,
    util,
    hoverlist
) {
    // var _event = _e._$$EventTarget._$getInstance();
    var _id = 0;
    var ARROW_WIDTH = 14;
    /**
     * Hover 组件
     *
     * @class   module:pool/component-hover/src/hover/component.Hover
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var Hover = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-hover/src/hover/component.Hover#config
         * @returns {void}
         */
        config: function() {
            // FIXME 设置组件配置信息的默认值
            util.extend(this, {
                settingKey: 'component-hover',
                mouseLeaveHide: true
            });
            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {
                ptop: 0,
                pleft: 0,
                pwidth: 0,
                pheight: 0,
                contentTemplate: '',
                top: 0,
                left: 0,
                arrClass: 'up',
                arrLeft: 0,
                topDiff: 0,
                leftDiff: 0
            });
            this.supr();
            // TODO
            this.mouseenter = this.mouseenter._$bind(this);
            this.mouseleave = this.mouseleave._$bind(this);
            this.keepShow = this.keepShow._$bind(this);
            this.toHide = this.toHide._$bind(this);
            this.checkMouseenter = this.checkMouseenter._$bind(this);
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-hover/src/hover/component.Hover#init
         * @returns {void}
         */
        init: function() {
            // TODO
            this.supr();
            this.btn = this.$refs.btn || this.btn;
            if(!this.$refs.btn&&this.btn){
                Regular.dom.on(this.btn,'mouseenter',this.mouseenter.bind(this));
                Regular.dom.on(this.btn,'mouseleave',this.mouseleave.bind(this));
            }
            this.$on('mouseenter', this.checkMouseenter);
        },

        checkMouseenter: function(_id) {
            if (this.id !== _id) {
                this.hide();
            }
        },
        mouseenter: function() {
            var that = this;
            if (!this.list) {
                this.list = new hoverlist({
                    data: {
                        showArrow: this.data.showArrow,
                        listClass: this.data.listClass
                    },
                    $body: this.$body,
                    mouseenter: this.keepShow,
                    mouseleave: this.toHide
                }).$inject(document.body);

                this.list.$on('$destroy', function () {
                   that.$emit('hide');
                });
            }

            this.keepShow();

            this.updateListPosition();
        },
        mouseleave: function() {
            this.toHide();
        },
        keepShow: function() {
            //广播
            // _event._$dispatchEvent('mouseenter', this.id);
            this.$emit('mouseenter', this.id);
            if (this.timer) {
                clearTimeout(this.timer);
            }
        },
        toHide: function() {
            //广播
            //_event._$dispatchEvent('mouseleave', this.id);
            var _that = this;
            this.timer = setTimeout(function() {
                _that.hide();
            }, +this.data.timeout || 500);
        },

        hide: function() {
            if (this.list && this.mouseLeaveHide) {
                this.list.destroy();
                this.list = null;

            }
            clearTimeout(this.timer);
        },

        updateListPosition: function() {

            var _display = this.btn.style.display;
            //this.btn.style.display = 'block';

            var _h = this.btn.offsetHeight;

            var _w = this.btn.offsetWidth;

            var _tip = this.list.$refs.tip;

            var listWidth = _tip.offsetWidth;
            //var listHeight = _tip.offsetHeight;
            this.data.leftDiff = +this.data.leftDiff;
            this.data.topDiff = +this.data.topDiff;

            var _pos = this.getBoundingClientRect(this.btn);
            this.btn.style.display = _display;
            var _top;
            var _left;
            if (this.data.onLeft) {
                _left = _pos.left;
            } else if (this.data.onRight) {
                _left = _pos.right - listWidth + this.data.leftDiff;
            } else {
                _left = _pos.left + this.scrollLeft() - (listWidth - _w) / 2;
            }

            if (_left < 0) {
                _left = 0;
            } else if (_left + listWidth > document.documentElement.clientWidth) {
                _left = document.documentElement.clientWidth - listWidth;
            }

            _left += this.scrollLeft();

            var _arrLeft = _pos.left + _w / 2 - _left - ARROW_WIDTH / 2;
            if (_arrLeft + ARROW_WIDTH > listWidth) {
                _arrLeft = listWidth - ARROW_WIDTH;
            } else if (_arrLeft < 0) {
                _arrLeft = 0;
            }


            var _bottomDis = document.documentElement.clientHeight - _pos.bottom;
            var _topDis = _pos.top;
            var _direction;
            if (_bottomDis > _topDis) {
                _top = _pos.top + _h + this.scrollTop() + ARROW_WIDTH + this.data.topDiff;
                _direction = 'up';

            } else {
                _top = _pos.top + this.scrollTop() - ARROW_WIDTH - _tip.offsetHeight - this.data.topDiff;
                _direction = 'down';
            }



            this.list.$update({
                'top': _top,
                'left': _left,
                'arrLeft': _arrLeft,
                'direction': _direction
            });
        },
        getBoundingClientRect:function(element){
            var scrollTop = document.documentElement.scrollTop;
            if (element.getBoundingClientRect) {
                return element.getBoundingClientRect();
                //var temp;
                //if (typeof this.getBoundingClientRect.offset != 'number') {
                //    temp = document.createElement('div');
                //    temp.style.cssText = 'position:absolute;left:0;top:0;';
                //    document.body.appendChild(temp);
                //    this.getBoundingClientRect.offset = temp.getBoundingClientRect().top - scrollTop;
                //    document.body.removeChild(temp);
                //    temp = null;
                //}
                //
                //var rect = element.getBoundingClientRect();
                //var offset = this.getBoundingClientRect.offset;
                //
                //return {
                //    left: rect.left + offset,
                //    right: rect.right + offset,
                //    top: rect.top + offset,
                //    bottom: rect.bottom + offset
                //}
            }
        },
        scrollTop: function() {
            return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        },

        scrollLeft: function() {
            return document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
        },
        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-hover/src/hover/component.Hover#destroy
         * @returns {void}
         */
        destroy: function() {
            // TODO
            this.supr();
        },

        /**
         * 对外暴露接口
         *
         * @method  module:pool/component-hover/src/hover/component.Hover#api
         * @returns {void}
         */
        api: function() {
            // TODO
        },

        /**
         * 私有接口，外部不可调用
         *
         * @private
         * @method  module:pool/component-hover/src/hover/component.Hover#_api
         * @returns {void}
         */
        _api: function() {
            // TODO
        }
    });
    return Hover;
});
