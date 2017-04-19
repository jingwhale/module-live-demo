/**
 * Button 上传组件实现文件
 *
 * @version  1.0
 * @author   cqh <hzchenqinhui@corp.netease.com>
 * @module   pool/component-button/src/button_export_polling/component
 */
NEJ.define([
    'pool/component-base/src/base',
    '../button/ui.js',
    'pool/component-base/src/util',
    'pool/component-upload/src/progress/upload_percent_modal/ui'
],function(
    Component,
    Button,
    util,
    ProgressModal
){
    /**
     * Base 组件
     *
     * @class   module:pool/component-button/src/button_export_polling/component.ButtonExport
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
     * @param {Object} options.data.cacheInst   - cache实例
     * @param {Object} options.data.taskData    - 获取URL上传参数
     * @param {Object} options.data.pollingData - 轮询获取参数，默认取taskData
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
         * @method  module:pool/component-button/src/button_export_polling/component.ButtonExport#config
         * @returns {void}
         */
        config: function () {
            // 初始化缓存实例
            this._copt = {};
            this._cache = this.data.cacheInst;
            this.data.cacheInst._$setEvent('onexportprogress', this.doExportProgress._$bind(this));
            util.extend(this, {
                settingKey: 'component-button-export-polling'
            });

            util.extend(this.data, {
                /**
                 * 调用的导出接口
                 *
                 * @member  module:pool/component-button/src/button_export_polling/component.ButtonExport#src
                 */
                src : '',
                width: '',
                size: '',
                /**
                 * 导出时的提示文字
                 *
                 * @member  module:pool/component-button/src/button_export_polling/component.ButtonExport#waitingText
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
         * @method  module:pool/component-button/src/button_export_polling/component.ButtonExport#init
         * @returns {void}
         */
        init: function () {

            this.supr();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-button/src/button_export_polling/component.ButtonExport#destroy
         * @returns {void}
         */
        destroy: function () {
            this.supr();
            this._progress = this._progress? this._progress.destroy() : null;
        },

        /**
         * 点击回调
         *
         * @method  mmodule:pool/component-button/src/button_export_polling/component.ButtonExport#click
         * @returns {void}
         */
        click: function(event){
            event.canExport = true;
            //触发beforeexport事件，可监听事件导入前处理异常情况
            this.$emit('beforeexport', event);
            
            if(event.canExport){
                this._cache.$export(this.data.taskData, this.data.pollingData || this.data.taskData)
            }
        },
        /**
         * 点击回调
         * @private
         * @method  mmodule:pool/component-button/src/button_export_polling/component.ButtonExport#doExportProgress
         * @returns {void}
         */
        doExportProgress: function (event) {
            if(event.loaded >= event.total){
                this._progress = this._progress? this._progress.destroy() : null;
                return;
            }
            if(!this._progress){
                this._progress = new ProgressModal({
                    data: {
                        finished: event.loaded,
                        total: event.total,
                        title: '正在处理,请耐心等待',
                        desc: '处理需要一定时间，请不要关闭本页面，否则将终止处理。'
                    }
                });
            }else{
                this._progress.data.finished = event.loaded;
                this._progress.data.total = event.total;
                this._progress.$update();
            }
        }
    });

    return ButtonExport;
});
