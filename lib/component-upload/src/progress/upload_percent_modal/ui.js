/**
 * UploadPercentModal 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hztianxiang <hztianxiang@corp.netease.com>
 * @module   pool/component-upload/src/progress/upload_percent_modal/ui
 */
NEJ.define([
    './component.js',
    'text!./component.html',
    'text!./component.css'
], function (
    UploadPercentModal,
    html,
    css
) {
    /**
     * Upload UI组件
     *
     * @class   module:pool/component-upload/src/progress/upload_percent_modal/ui.UploadPercentModalUI
     * @extends module:pool/component-upload/src/progress/upload_percent_modal/ui.UploadPercentModal
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return UploadPercentModal.$extends({
        name: 'ux-upload-percent-modal',
        css: css,
        template: html
    });
});
