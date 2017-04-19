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
    'pool/edu-front-util/src/extend'
],function(
    Component,
    util,
    u,
    extend
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
    var Tabs = Component.$extends({
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
                tabs: [],
                selected: undefined,
                titleTemplate: null
            });
            this.supr();

            this.$watch('selected', function (newValue, oldValue) {
                /**
                 * @event change 选项卡改变时触发
                 * @property {object} sender 事件发送对象
                 * @property {object} selected 改变后的选项卡
                 */
                this.$emit('change', {
                    sender: this,
                    selected: newValue,
                    lastSelected: oldValue
                });
            });
        },

        /**
         * 模板编译之后(即活动dom已经产生)被调用. 可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method module:module:pool/component-tabs/src/tabs/component.Tabs#init
         * @return {void}
         */
        init: function(){
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

            this.data.selected = {
                param: param,
                id: id
            };
            
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

            this.data.selected = extend({}, this.data.selected, item);

            this.onSelect({
                selected: this.data.selected,
                item: item
            });
        },

        onSelect: function(data){
            // 模块重定向
            var paramStr = data.selected.param || '';
            if(typeof data.selected.param === 'object'){
                paramStr = u._$object2string(data.selected.param,'&');
            }

            if(paramStr.length > 0){
                paramStr = '?' + paramStr;
            }

            /**
             * @event select 选择某一项时触发
             * @property {object} sender 事件发送对象
             * @property {object} selected 当前选择卡
             */
            this.$emit('select', {
                sender: this,
                url: data.selected.id + (paramStr),
                selected: data.item
            });
        },

        /**
         * 组件销毁策略
         *
         * @protected
         * @method module:module:pool/component-tabs/src/tabs/component.Tabs#destroy
         * @return {void}
         */
        destroy:function(){
            this.supr();
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
