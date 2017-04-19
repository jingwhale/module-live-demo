/**
 * CheckGroup 组件实现文件 -  RegularUI -check2Group-搬迁
 *
 * @version  1.0
 * @author   hzlinannan <hzlinannan@corp.netease.com>
 * @module   pool/component-check/src/check-group/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    '../check/{mode}/ui.js',
    'pool/component-validation/src/validation'
], function (Component,
             util) {
    /**
     * CheckGroup 组件
     *
     * @class   module:pool/component-check/src/check-group/component.CheckGroup
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     * @param {object[]}             [options.data.source = []]             - 数据源
     * @param {string}               [options.data.source[].name]           - 每项的内容
     * @param {boolean}              [options.data.textClick=true]          - 点击文字是否可以改变选中结果
     * @param {string}               [options.data.rules]                   - 校验规则
     * @param {boolean}              [options.data.block = false]           - 多行显示
     * @param {boolean}              [options.data.readonly = false]        - 是否只读
     * @param {boolean}              [options.data.disabled = false ]       - 是否禁用
     * @param {boolean}              [options.data.visible = false ]        - 是否显示
     * @param {string}               [options.data.class = '']              - 补充class
     */


    /**
     * @event check 改变选中状态时触发
     * @property {object}  [sender]  - 事件发送对象
     * @property {object} [current] -  当前选中的checkbox
     * @property {array}  [source]     - 所有数据源
     */

    /**
     * @event text 点击文本的时候出发，前提textClick=true
     * @property {object}  [sender]  - 事件发送对象
     * @property {boolean} [checked] - 选中状态
     * @property {number}  [pos]     - 位置
     */
    var CheckGroup = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-check/src/check-group/component.CheckGroup#config
         * @returns {void}
         */
        config: function () {
            // 设置组件配置信息的默认值
            util.extend(this, {});
            // 设置组件视图模型的默认值
            util.extend(this.data, {
                /**
                 * 是否以block方式显示
                 *
                 * @member {String} module:pool/component-check/src/check-group/component.CheckGroup#block
                 */
                block: false,

                /**
                 * 点击文字是否可以改变选中结果
                 *
                 * @member {String} module:pool/component-check/src/check-group/component.CheckGroup#textClick
                 */
                textClick: true
            });
            this.supr();
            // TODO
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-check/src/check-group/component.CheckGroup#init
         * @returns {void}
         */
        init: function () {
            // TODO
            this.supr();
        },

        doCheck: /* istanbul ignore next  */ function ($event) {
            /* istanbul ignore next  */
            var that = this;
            // 异步子UI同步数据
            window.setTimeout(function () {
                /* istanbul ignore next  */
                that.validate();
                this.$emit('check', {
                    sender: this,
                    current: $event.sender,
                    source: this.data.source
                });
            }._$bind(this), 0);
        },

        _doText: /* istanbul ignore next  */ function ($event) {
            window.setTimeout(function () {
                this.$emit('text', {
                    sender: this,
                    current: $event.sender,
                    pos: $event.pos,
                    source: this.data.source
                })
            }._$bind(this), 0)
        },
        /**
         * 根据`rules`验证组件的值是否正确
         *
         * @method  module:pool/component-check/src/check-group/component.CheckGroup#validate
         * @returns {object} result  返回结果
         * @returns {boolean} result.success     => 是否通过
         * @returns {boolean} result.message     => 消息
         */
        validate: function () {
            var value = this.data.source; //校验source
            var result = !!this.$refs.validation && /* istanbul ignore next  */ this.$refs.validation.validate(value);

            return result;
        }
    });

    return CheckGroup;
});
