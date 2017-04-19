/**
 * UploadUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hztianxiang <hztianxiang@corp.netease.com>
 * @module   pool/component-upload/src/upload/ui
 */
NEJ.define([
    './component.js',
    'text!./component.html',
    'text!./component.css',
    'pool/component-notify/src/notify/ui'
], function (Upload,
             html,
             css,
             notifyUI) {
    /**
     * Upload UI组件
     *
     * @class   module:pool/component-upload/src/ui.UploadUI
     * @extends module:pool/component-upload/src/upload.Upload
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Upload.$extends({
        name: 'ux-upload',
        css: css,
        template: html,
        init: function () {
            this.data.parent = this.$refs.uploadbtnwrap;
            this.supr();
        },

        /**
         * 私有接口，上传失败回调
         * @protected
         * @method  module:pool/component-upload/src/ui.UploadUI#_onUploadError
         * @returns {void}
         */
        _onUploadError:function(_data){
            // _loading.hide();
            // this.$update();
            notifyUI.warning('上传失败');
            this.supr();
        }


    });
});
