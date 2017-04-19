/**
 * RichContent 组件实现文件
 *
 * @version  1.0
 * @author   hzshaoyy <hzshaoyy@corp.netease.com>
 * @module   pool/module-editor/src/component/rich-content/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    '../editor/eduEditor/parseUtil.js'
],function(
    Component,
    util,
    parseUtil
){
    /**
     * RichContent 组件
     *
     * @class   module:pool/module-editor/src/component/rich-content/component.RichContent
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var RichContent = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/module-editor/src/component/rich-content/component.RichContent#config
         * @returns {void}
         */
        config: function () {
            util.extend(this, {

            });
            util.extend(this.data, {
                /**
                 * 富文本内容
                 *
                 * @member module:pool/module-editor/src/component/rich-content/component.RichContent#value
                 */
                value: ""
            });
            this.supr();

            this.$watch('value', function (_value) {
                parseUtil._$renderRich(this.$refs.des, _value);
            });
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/module-editor/src/component/rich-content/component.RichContent#init
         * @returns {void}
         */
        init: function () {
            this.supr();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/module-editor/src/component/rich-content/component.RichContent#destroy
         * @returns {void}
         */
        destroy: function () {
            this.supr();
        }
    });

    return RichContent;
});
