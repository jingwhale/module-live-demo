/**
 * Hoverlist 组件实现文件
 *
 * @version  1.0
 * @author   hzshenhongliang <hzshenhongliang@corp.netease.com>
 * @module   pool/component-hover/src/hoverlist/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util'

], function(
    Component,
    util
) {

    /**
     * Hoverlist 组件
     *
     * @class   module:pool/component-hover/src/hoverlist/component.Hoverlist
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var Hoverlist = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-hover/src/hoverlist/component.Hoverlist#config
         * @returns {void}
         */
        config: function() {
            // FIXME 设置组件配置信息的默认值
            util.extend(this, {
                settingKey: 'component-hover'
            });
            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {
                showArrow: true,
                fade: 'on:enter;class:fade fade-in,2;on:leave;class:fade fade-out,2'
            });
            this.supr();
            // TODO
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-hover/src/hoverlist/component.Hoverlist#init
         * @returns {void}
         */
        init: function() {
            // TODO
            this.supr();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-hover/src/hoverlist/component.Hoverlist#destroy
         * @returns {void}
         */
        destroy: function() {
            // TODO
            this.supr();
        },

        /**
         * 对外暴露接口
         *
         * @method  module:pool/component-hover/src/hoverlist/component.Hoverlist#api
         * @returns {void}
         */
        api: function() {
            // TODO
        },

        /**
         * 私有接口，外部不可调用
         *
         * @private
         * @method  module:pool/component-hover/src/hoverlist/component.Hoverlist#_api
         * @returns {void}
         */
        _api: function() {
            // TODO
        }
    });

    return Hoverlist;
});
