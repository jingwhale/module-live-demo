/**
 * Check 组件实现文件 - RegularUI -check2-搬迁
 *
 * @version  1.0
 * @author   hzlinannan <hzlinannan@corp.netease.com>
 * @module   pool/component-check/src/check/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util'
], function (Component,
             util) {
    /**
     * Check 组件
     *
     * @class   module:pool/component-check/src/check/component.Check
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     * @param {string}        [options.data.name='']            - 多选按钮的文字
     * @param {number}        [options.data.pos=0]              - 当前位置
     * @param {boolean}       [options.data.textClick=true]     - 点击文字是否可以改变选中结果
     * @param {boolean}       [options.data.checked=false]      - 多选按钮的选择状态。`false`表示未选，`true`表示已选，`null`表示半选。
     * @param {boolean}       [options.data.block=false   ]     - 是否以block方式显示
     * @param {boolean}       [options.data.disabled=false]     - 是否禁用
     * @param {boolean}       [options.data.visible=true ]      - 是否显示
     * @param {string}        [options.data.class=''   ]        - 补充class
     * @return {void}
     */

    /**
     * @event check 改变选中状态时触发
     * @property {object}  [sender]  - 事件发送对象
     * @property {boolean} [checked] - 选中状态
     * @property {number}  [pos]     - 位置
     */

    /**
     * @event change 改变选中状态时触发
     * @property {object}  [sender]  - 事件发送对象
     * @property {boolean} [checked] - 选中状态
     */

    /**
     * @event text 点击文本的时候出发，前提textClick=true
     * @property {object}  [sender]  - 事件发送对象
     * @property {boolean} [checked] - 选中状态
     * @property {number}  [pos]     - 位置
     */

    var Check = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-check/src/check/component.Check#config
         * @returns {void}
         */
        config: function () {
            // FIXME 设置组件配置信息的默认值
            util.extend(this, {});
            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {

                /**
                 *  复选框后面文本
                 *  @member {String} module:pool/component-check/src/check/component.Check#name
                 */
                name: '',

                /**
                 * 当前位置
                 *
                 * @member {String} module:pool/component-check/src/check/component.Check#pos
                 */
                pos: 0,

                /**
                 * 点击文字是否可以改变选中结果
                 *
                 * @member {String} module:pool/component-check/src/check/component.Check#textClick
                 */
                textClick: true,

                /**
                 * 选中状态
                 *@member {Boolean} module:pool/component-check/src/check/component.Check#checked
                 */
                checked: false,

                /**
                 * 是否换行显示
                 *@member {Boolean} module:pool/component-check/src/check/component.Check#block
                 */
                block: false,

                /**
                 * 是否禁用组件
                 *@member {Boolean} module:pool/component-check/src/check/component.Check#disabled
                 */
                disabled: false,

                /**
                 *  是否显示该组件
                 *  @member {Boolean} module:pool/component-check/src/check/component.Check#visible
                 */
                visible: true,

                /**
                 *  补充class
                 *  @member {String} module:pool/component-check/src/check/component.Check#class
                 */
                'class': ''
            });
            this.supr();
            /* istanbul ignore next  */
            this.$watch('checked', function (newValue, oldValue) {
                /* istanbul ignore next  */
                if (oldValue === undefined){
                    return;
                }
                /* istanbul ignore next  */
                this.$emit('change', {
                    sender: this,
                    checked: newValue
                });
            });
        },

        /**
         * check(checked) 改变选中状态
         *
         * @method module:pool/component-check/src/check.Check#check
         * @param  {boolean} checked 选中状态。则在true/false之间切换。
         * @return {void}
         */
        check: function (checked) {
            if (this.data.readonly || this.data.disabled){
                return;
            }

            if (checked === undefined){
                checked = !this.data.checked;
            }
            this.data.checked = checked;

            this.$emit('check', {
                sender: this,
                checked: checked,
                pos: this.data.pos
            });
        },

        /**
         * 点击文本事件回调
         */
        clickText: function () {
            if (this.data.textClick) {
                this.check();
            }
            this.$emit('text', {
                sender: this,
                checked: this.data.checked,
                pos: this.data.pos
            })
        }
    });

    return Check;
});
