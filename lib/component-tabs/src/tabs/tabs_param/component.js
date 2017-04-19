/**
 *  Tabs 组件实现文件-宽度自适应
 *
 *  @version  1.0
 *  @author   hzwuyao <hzwuyao1@corp.netease.com>
 *  @module   pool/component-tabs/src/tabs/component
 *  @extends  pool/component-base/src/base
 */

NEJ.define( [
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'base/util',
    'pool/edu-front-util/src/extend',
    '../component.js'
],function(
    Component,
    util,
    u,
    extend,
    Tabs
) {
    /**
     *  Tabs组件
     *
     *  @class   module:pool/component-tabs/src/tabs/component.Tabs
     *  @extends module:pool/component-base/src/base.Component
     *
     *  @param {array}  options.data.tabs=[]        - tabs
     *  @param {object}  options.data.tab           - tab
     *  @param {object}  options.data.tab.title      - tab标题
     *  @param {object}  options.data.tab.id         - tab标识
     *  @param {object}  options.data.selected       - 当前选择卡
     *  @param {string}  options.data.titleTemplate  - 标题模板
     *  @param {boolean} options.data.readonly       - 是否只读
     *  @param {boolean} options.data.disabled       - 是否禁用
     *  @param {boolean} options.data.visible        - 是否显示
     *  @param {String}  options.data.class          - 补充class
     */
    var Tabs = Tabs.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method module:pool/component-tabs/src/tabs/component.Tabs#config
         * @param  {Object} data - 与视图关联的数据模型
         * @return {void}
         */
        config: function(){
            util.extend(this.data, {
                temp: {}
            });
            this.supr();
        },
        /**
         * 根据UMI显示tab选项
         *
         * @public
         * @method module:module:pool/component-tabs/src/tabs/component.Tabs#refresh
         * @return {void}
         */
        refresh: function(options){
            var id = options.target,
                param = options.param;

            this.data.selected = {};
            this.data.temp[id] = {
                param: param,
                id: id
            };
            this.data.selected = this.data.temp[id];
            
            this.$update();
        },

        /**
         * @method select(item) 选择某一项
         * @public
         * @param  {object} item 选择项
         * @return {void}
         */
        select: function (item) {
            if (this.data.readonly || this.data.disabled || item.disabled)
                return;

            this.data.curSelected = extend({}, this.data.temp[item.id], item);

            this.onSelect({
                selected: this.data.curSelected,
                item: item
            });
        },

        // 模块重定向
        onSelect: function(data){            
            /**
             * @event select 选择某一项时触发
             * @property {object} sender 事件发送对象
             * @property {object} selected 当前选择卡
             */
            this.$emit('select', {
                sender: this,
                url: data.selected.id,
                param: data.selected.param,
                selected: data.item
            });
        }
    }).filter({
        'judgeSelect': function (id) {
            if(!this.data.selected || this.data.selected.id == null) return;
            if ( this.data.selected.id.indexOf && this.data.selected.id.indexOf('/') != -1){
                return this.data.selected.id.indexOf(id)!= -1;
            }

            return id == this.data.selected.id;
        }
    });

    return Tabs;
});
