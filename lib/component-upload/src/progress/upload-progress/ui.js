/**
 * CustomFileUploadUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hztianxiang <hztianxiang@corp.netease.com>
 * @module   pool/component-upload/src/progress/upload-progress/ui
 */
NEJ.define([
    './component.js',
    'text!./component.html',
    'text!./component.css'
], function (UploadProgress,
             html,
             css) {
    /**
     * Upload UI组件
     *
     * @class   module:pool/component-upload/src/progress/upload-progress/ui.uploadProgressUI
     * @extends module:pool/component-upload/src/progress/upload-progress/component.UploadProgress
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return UploadProgress.$extends({
        name: 'ux-upload-progress',
        css: css,
        template: html
    });
});
