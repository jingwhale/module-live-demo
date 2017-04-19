/**
 * Button 组件实现文件
 *
 * @version  1.0
 * @author   hzshaoyy <hzshaoyy@corp.netease.com>
 * @module   pool/component-button/src/button/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util'
],function(
    Component,
    util
){
    /**
     * Base 组件
     *
     * @class   module:pool/component-button/src/button/component.Button
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options                  - 组件构造参数
     * @param {Object} options.data             - 与视图关联的数据模型
     * @param {String} options.data.state       - 按钮状态 disabled/primary/warning/gh/buy/info/error/deny
     * @param {String} [options.data.size='']   - 按钮大小xs/sm/lg/xl
     * @param {String} [options.data.width='']  - 按钮宽度,w100~w220/w300/ww400/w500/w600
     * @param {String} options.data.value       - 按钮内容
     * @param {String} options.data.class       - 自定义样式
     */

    /**
     * 点击按钮
     * 
     * @event module:pool/component-button/src/button/component.Button#click 
     */
    var Button = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-button/src/button/component.Button#config
         * @returns {void}
         */
        config: function () {

            util.extend(this, {
                settingKey: 'component-button'
            });

            util.extend(this.data, {
                /**
                 * @member module:pool/component-button/src/button/component.Button#state
                 */
                "state": "base",
                /**
                 * @member module:pool/component-button/src/button/component.Button#size
                 */
                "size": "",
                /**
                 * @member module:pool/component-button/src/button/component.Button#width
                 */
                "width": "",
                /**
                 * @member module:pool/component-button/src/button/component.Button#value
                 */
                "value": "",
                /**
                 * @member module:pool/component-button/src/button/component.Button#class
                 */
                "class": ""
            });
            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-button/src/button/component.Button#init
         * @returns {void}
         */
        init: function () {
            this.supr();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-button/src/button/component.Button#destroy
         * @returns {void}
         */
        destroy: function () {
            // TODO
            this.supr();
        },

        /**
         * 点击事件
         *
         * @method  module:pool/component-button/src/button/component.Button#onClick
         * @returns {void}
         */
        click: function ($event) {
            if(this.data.state == 'disabled') return;
            this.$emit('click', $event);
        }
    });

    return Button;
});
