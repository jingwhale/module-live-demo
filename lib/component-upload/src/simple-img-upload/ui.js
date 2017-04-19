/**
 * 图片上传组件 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hztianxiang <hztianxiang@corp.netease.com>
 * @module   pool/component-upload/src/simple-img-upload/ui
 */
NEJ.define([
    './component.js',
    'text!./component.html',
    'text!./component.css',
    'pool/component-notify/src/notify/ui'
], function (SimpleImgUpload,
             html,
             css,
             notifyUI) {
    /**
     * Upload UI组件
     *
     * @class   module:pool/component-upload/src/simple-img-upload/ui.SimpleImgUploadUI
     * @extends module:pool/component-upload/src/simple-img-upload/component.SimpleImgUploadUI
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return SimpleImgUpload.$extends({
        name: 'ux-simple-img-upload',
        css: css,
        template: html,
        init: function () {
            this.data.parent = this.$refs.uploadbtnwrap;
            this.supr();
        },
        /**
         * 私有接口，上传错误回调
         * @protected
         * @method  module:pool/component-upload/src/simple_img_upload/ui.SimpleImgUploadUI#_onUploadError
         * @returns {void}
         */
        _onUploadError: function (_err) {
            notifyUI.warning(_err.errMsg);
            this.supr();
        }
    });
});
