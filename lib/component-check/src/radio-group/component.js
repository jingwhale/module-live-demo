/**
 * RadioGroup 组件实现文件 - RegularUI -radio2Group-搬迁
 *
 * @version  1.0
 * @author   hztianxiang <hztianxiang@corp.netease.com>
 * @module   pool/component-check/src/radio-group/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    '../radio/ui.js',
    'pool/component-validation/src/validation'
], function (
    Component,
    util
) {
    /**
     * RadioGroup 组件
     *
     * @class   module:pool/component-check/src/radio-group/component.RadioGroup
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {object}                 [options]                           - 组件构造参数
     * @param {object}                 [options.data]                      - 与视图关联的数据模型
     * @param {array}                  [options.data.source]               - 数据源
     * @param {string}                 [options.data.source[].name]        - 每项的内容
     * @param {string}                 [options.data.key]                  - 判断是否选中的关键字，不传默认name
     * @param {string}            [options.data.source[].contentTemplate] - 动态模板代替每一项name
     * @param {object}                 [options.data.seleced=null]         - 当前选择项
     * @param {boolean}                [options.data.block=false]          - 是否以block方式显示
     * @param {array}                  [options.data.rules=null]           - 验证规则
     * @param {boolean}                [options.data.readonly=false]       - 是否只读
     * @param {boolean}                [options.data.disabled=false]       - 是否禁用
     * @param {boolean}                [options.data.visible=true]         - 是否显示
     * @param {string}                 [options.data.class='']             - 补充class
     */

    /**
     * @event @event pool/component-check/src/radio-group/component.RadioGroup#select
     * @param {Object} event - 事件
     * @param {Number} event.sender - 事件发送对象
     * @property {boolean} event.selected - 选中的对象
     */
    var RadioGroup = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-check/src/radio-group/component.RadioGroup#config
         * @returns {void}
         */
        config: function () {
            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {
                /**
                 * 当前选中态
                 *
                 * @member {String} module:pool/component-check/src/radio-group/component.RadioGroup#selected
                 */
                selected: (this.data.source[0]) || (null),  //  默认不覆盖，即父传入优先级高

                /**
                 * group id
                 *
                 * @member {String} module:pool/component-check/src/radio-group/component.RadioGroup#radioGroupId
                 */
                radioGroupId: new Date(),
                /**
                 * 是否block
                 *
                 * @member {Boolean} module:pool/component-check/src/radio-group/component.RadioGroup#block
                 */
                block: false,

                /**
                 * 验证规则
                 *
                 * @member {Array} module:pool/component-check/src/radio-group/component.RadioGroup#rules
                 */
                rules: [],

                /**
                 * 是否只读
                 *
                 * @member {Boolean} module:pool/component-check/src/radio-group/component.RadioGroup#readonly
                 */
                readonly: false,
                /**
                 * 显示
                 *
                 * @member {Boolean} module:pool/component-check/src/radio-group/component.RadioGroup#visible
                 */
                visible: true,

                /**
                 * 是否禁用
                 *
                 * @member {Boolean} module:pool/component-check/src/radio-group/component.RadioGroup#disabled
                 */
                disabled: false,

                /**
                 * 补充class
                 *
                 * @member {String} module:pool/component-check/src/radio-group/component.RadioGroup#class
                 */
                'class': ''
            });
            this.supr();
            // TODO
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-check/src/radio-group/component.RadioGroup#init
         * @returns {void}
         */
        init: function () {
            // TODO
            this.supr();
        },

        /**
         * 选择某一项
         * @public
         * @method  module:pool/component-check/src/radio-group/component.RadioGroup#select
         * @param  {object} item 选择项
         * @return {void}
         */
        select: function (item) {
            var that = this;
            if (this.data.readonly || this.data.disabled) {
                return;
            }

            this.data.selected = item;

            // 异步子UI同步数据
            window.setTimeout(function() {
                that.validate();
            },0);

            this.$emit('select', {
                sender: this,
                selected: item
            });
        },


        /**
         * 根据`rules`验证组件的值是否正确
         *
         * @public
         * @method  module:pool/component-check/src/radio-group/component.RadioGroup#validate
         * @return {object} result              -验证结果
         * @return {boolean} result.success     -是否通过
         * @return {boolean} result.message     -消息
         */
        validate: function () {
            var value = this.data.seleced;
            var result = !!this.$refs.validation && this.$refs.validation.validate(value);
            return result;
        }
    });

    return RadioGroup;
});
