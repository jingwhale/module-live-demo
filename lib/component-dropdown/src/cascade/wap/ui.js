/**
 * CascadeUI 组件带默认UI实现文件,手势依赖于hammerjs,滚动依赖于iscroll
 *
 * @version  1.0
 * @author   hzliuzongyaun <hzliuzongyaun@corp.netease.com>
 * @module   pool/component-dropdown/src/cascade/ui
 */
NEJ.define([
    '../component.js',
    'text!./component.html',
    'css!./component.css',
    'base/element',
    'base/event',
    'pool/component-base/src/util',
    '../util/util.js'
], function (Cascade,
             html,
             css,
             e,
             v,
             util,
            xutil) {

    /**
     * Cascade UI组件
     *
     * @class   module:pool/component-dropdown/src/cascade/ui.CascadeUI
     * @extends module:pool/component-cascade/src/cascade.Cascade
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    var CascadeUI = Cascade.$extends({
        name: 'ux-dropdown-cascade',
        css: css,
        template: html,
        computed: {
            isConfirmDisabled: 'isLoading || !isComplete'
        },
        config: function () {
            this._timeId = -1;
            this._od = {};  // old data,显示时存储
            util.extend(this.data, {
                isSwitching: false,  // 是否正在翻页
                visible: false,
                width: window.innerWidth,   // pane的宽度
                index: 0, // 当前展示的pane
                transTime: 300,   // 过渡动画时间,过渡时不可选择
                depth: 0, // 若>0则tab数量由此指定
                isResetAfterCancel:true // 是否在取消(如点击黑幕)之后重置(selectedIds、index)
            });

            this.supr();
            this._addWatchers();
        },
        init: function () {
            this.supr();

            // resize
            v._$addEvent(window, 'resize', function () {
                if (this.data.visible) {
                    this.updateView();
                }
            }._$bind(this));

            // 阻止浏览器滚动行为
            v._$addEvent(this.$refs.mask, 'touchmove', function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
            });
        },
        _addWatchers: function () {
            // ink变化
            this.$watch('index', function (newVal) {
                window.setTimeout(function () {
                    /* istanbul ignore next */
                    this.transformInk(newVal);
                }._$bind(this), 0);
            });

            // 显示时更新view
            this.$watch('visible', function (newVal) {
                if (newVal) { // 可见
                    this._od = xutil.deepCopy(this.data);
                    this._unableBodyScrolling();
                    window.setTimeout(function () {
                        /* istanbul ignore next */
                        this.updateView();
                    }._$bind(this), 0);
                } else {
                    this._enableBodyScrolling();
                }
            });

            // 添加iscroll(vertical)
            this.$watch('panes', function (newVal) {
                for (var i = 0; i < newVal.length; i++) {
                    window.setTimeout((function (i) {
                         /* istanbul ignore next */
                        return function () {
                            // IScroll && new IScroll(this.$refs['pane' + i]);
                        }._$bind(this);
                    }._$bind(this))(i), 0);
                }
            });
        },
        // index从0算起
        switchTo: function (index) {
            index = index || 0;

            // 边界限制
            if (index >= this.data.panes.length || (index < 0)) {
                return;
            }

            var x = -this.data.width * index;
            this.$update('index', index);

            // panes位移
            e._$style(this.$refs.panes, {transform: 'translate(' + x + 'px, 0) translateZ(0)'});

            this.data.isSwitching = true;
            window.clearTimeout(this._timeId);
            this._timeId = window.setTimeout(function () {
                this.data.isSwitching = false;
            }._$bind(this), this.data.transTime);
        },
        prev: function () {
            if (this.data.index - 1 >= 0) {
                this.switchTo(this.data.index - 1);
            }
        },
        next: function () {
            if (this.data.index + 1 < this.data.panes.length) {
                this.switchTo(this.data.index + 1);
            }
        },
        show: function () {
            this.$update('visible', true);
        },
        hide: function () {
            this.$update('visible', false);
        },
        // 除了隐藏,也涉及到重置逻辑;flag表示是否在隐藏后重置回显示时的值
        cancel: function (flag) {
            flag = flag || false;

            // TODO 如果值没变则不重置
            if(flag){
                this.reset(this._od);
            }

            this.hide();
        },
        transformInk: function (index) {
            var $tabs = this.$refs.tabs,
                $tab = e._$getByClassName($tabs, 'ux-dropdown-cascade_tab')[index],
                x = $tab ? e._$offset($tab).x - e._$offset($tabs).x :0,
                width = $tab ? $tab.offsetWidth:0;

            e._$style(this.$refs.ink, {
                transform: 'translate(' + x + 'px, 0) translateZ(0)',  // 前提是ink没有left margin和left padding
                width: width + 'px'
            });
        },
        confirm: function () {
            if (this.$get('isConfirmDisabled')) {
                return;
            }

            var flag = true;

            this.$emit('confirm', {
                preventDefault: function () {
                    flag = false;
                },
                selecteds: this.data.selecteds,
                selected: this.data.selected,
                sender: this
            });

            if (flag) {
                this.hide();
            }
        },
        select: function (id, level) {
            // 正在翻页则不能选择
            if (this.data.isSwitching) {
                return;
            }

            this._select(id, level, function () {
                this.data.index = level;
                this.next();
            }._$bind(this));

            // 当tab选了之后,长度可能会发生变化,此时需要transform一下
            /* istanbul ignore next */
            window.setTimeout(function () {
                this.transformInk(this.data.index);
            }._$bind(this), 0);
        },
        // 暂时只支持selectedIds,并且只支持已有数据
        // 会抛出select事件
        reset: function (opts, callback) {
            callback = callback ? callback : function () {
            };

            var selectedIds = opts.selectedIds || [],
                index = opts.index>=0?opts.index:0;

            for (var i = 0; i < selectedIds.length; i++) {
                this._select(selectedIds[i],i, function () {
                    this.data.index = i;
                    this.next && this.next();
                }._$bind(this),true,false);
            }

            this.$update('index',index);

            this.updateView();
            callback();

            this.$emit('reset', util.extend({sender: this}, this.data));
        },
        getTabName: function (index) {
            if (this.data.selecteds[index]) {
                return this.data.selecteds[index][this.data.name];
            }

            return this.data.placeholders[index] || ('tab' + (index + 1));
        },
        updateView: function () {
            this.$update('width', window.innerWidth);
            this.switchTo(this.data.index);
            window.setTimeout(function () {    // window resize的时候字体可能变化,tab尺寸可能随字体而变化,所以需要等字体变化之后,再transformInk
                this.transformInk(this.data.index);
            }._$bind(this), 300);
        },
        _unableBodyScrolling: function () {
            e._$addClassName(document.body, 'unableScrolling');
        },
        _enableBodyScrolling: function () {
            e._$delClassName(document.body, 'unableScrolling');
        }
    });

    CascadeUI.event('tap', function (elem, fire) {
        var hm = null;

        if (window.Hammer) {
            hm = new Hammer(elem);
            hm.on("tap", function (ev) {
                fire(ev);
            });
        } else {
            v._$addEvent(elem, 'click', function (ev) {
                fire(ev);
            });
        }
    });

    CascadeUI.event('swipeleft', function (elem, fire) {
        var hm = null;

        if (window.Hammer) {
            hm = new Hammer(elem, {
                // preventDefault: true
            });
            hm.on("swipeleft", function (ev) {
                fire(ev);
            });
        }
    });

    CascadeUI.event('swiperight', function (elem, fire) {
        var hm = null;

        if (window.Hammer) {
            hm = new Hammer(elem, {
                // preventDefault: true
            });
            hm.on("swiperight", function (ev) {
                fire(ev);
            });
        }
    });

    return CascadeUI;
});
