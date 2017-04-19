/**
 * ButtonExportUI 导出按钮组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzliujunwei <hzliujunwei@corp.netease.com>
 * @module   pool/component-button/src/button_export/web/ui
 */
NEJ.define( [
    '../component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    ButtonExport,
    html,
    css
){
    /**
     * ButtonExport UI组件
     *
     * @class   module:pool/component-button/src/button_export/web/ui.ButtonExportUI
     * @extends module:pool/component-button/src/button_export/component.ButtonExport
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return ButtonExport.$extends({
        name     : 'ux-button-export',
        css      : css,
        template : html
    });
});
