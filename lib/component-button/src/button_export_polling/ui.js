/**
 * ButtonExportUI 导出按钮组件带默认UI实现文件
 *
 * @version  1.0
 * @author   cqh <hzchenqinhui@corp.netease.com>
 * @module   pool/component-button/src/button_export_polling/ui
 */
NEJ.define( [
    './component.js',
    'text!./web/component.html',
    'text!./web/component.css'
],function(
    ButtonExport,
    html,
    css
){
    /**
     * ButtonExport UI组件
     *
     * @class   module:pool/component-button/src/button_export_polling/ui.ButtonExportUI
     * @extends module:pool/component-button/src/button_export_polling/component.ButtonExport
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return ButtonExport.$extends({
        name     : 'ux-button-export-polling',
        css      : css,
        template : html
    });
});
