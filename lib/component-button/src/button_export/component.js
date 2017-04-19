/**
 * Button 上传组件实现文件
 *
 * @version  1.0
 * @author   hzliujunwei <hzliujunwei@corp.netease.com>
 * @module   pool/component-button/src/button_export/component
 */
NEJ.define([
    'pool/component-base/src/base',
    '../button/ui.js',
    'pool/component-base/src/util'
],function(
    Component,
    Button,
    util
){
    /**
     * Base 组件
     *
     * @class   module:pool/component-button/src/button_export/component.ButtonExport
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options                  - 组件构造参数
     * @param {Object} options.data             - 与视图关联的数据模型
     * @param {String} options.data.state       - 按钮状态
     * @param {String} [options.data.size='']   - 按钮大小xs/sm/lg/xl
     * @param {String} [options.data.width='']  - 按钮宽度,w100~w220/w300/ww400/w500/w600
     * @param {String} options.data.value       - 按钮内容
     * @param {String} options.data.class       - 自定义样式
     * @param {String} options.data.src         - 调用的导出接口
     */

    /**
     * @event click 点击按钮
     * @property {Boolean} true
     */
    var ButtonExport = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-button/src/button_export/component.ButtonExport#config
         * @returns {void}
         */
        config: function () {

            util.extend(this, {
                settingKey: 'component-button-export'
            });

            util.extend(this.data, {
                /**
                 * 调用的导出接口(window.location.origin+src)
                 *
                 * @member  module:pool/component-button/src/button_export/component.ButtonExport#src
                 */
                src : '',
                /**
                 * 调用的导出接口(完整的接口url：openUrl)
                 *
                 * @member  module:pool/component-button/src/button_export/component.ButtonExport#src
                 */
                openUrl: '',
                width: '',
                size: '',
                /**
                 * 导出时的提示文字
                 *
                 * @member  module:pool/component-button/src/button_export/component.ButtonExport#waitingText
                 * @returns {void}
                 */
                waitingText: '导出中，请稍后...'
            });
            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-button/src/button_export/component.ButtonExport#init
         * @returns {void}
         */
        init: function () {

            this.supr();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-button/src/button_export/component.ButtonExport#destroy
         * @returns {void}
         */
        destroy: function () {
            this.supr();
        },

        /**
         * 点击回调
         *
         * @method  mmodule:pool/component-button/src/button_export/component.ButtonExport#click
         * @returns {void}
         */
        // 导出已购课程
        click: function(){
            //IE8下兼容处理
            /* istanbul ignore if */
            if (!window.location.origin) {
                window.location.origin = window.location.protocol + "//"
                    + window.location.hostname
                    + (window.location.port ? ':' + window.location.port : '');
            }

            /* istanbul ignore next */
            var _openUrl = this.data.openUrl ? this.data.openUrl : (window.location.origin + this.data.src);

            this.$emit('click', {
                src: _openUrl
            });
            window.open(_openUrl);
            // _notify.show(this.data.waitingText, "success");
        }
    });

    return ButtonExport;
});
