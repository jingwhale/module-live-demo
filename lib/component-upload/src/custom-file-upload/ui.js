/**
 * CustomFileUploadUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hztianxiang <hztianxiang@corp.netease.com>
 * @module   pool/component-upload/src/custom-file-upload/ui
 */
NEJ.define([
    './component.js',
    'text!./component.html',
    'text!./component.css',
    'pool/component-notify/src/notify/ui',
    'pool/component-modal/src/modal/ui'
], function (
    CustomFileUpload,
    html,
    css,
    notifyUI,
    modalUI) {
    
    /**
     * Upload UI组件
     *
     * @class   module:pool/component-upload/src/custom-file-upload/ui.CustomFileUploadUI
     * @extends module:pool/component-upload/src/custom-file-upload/component.CustomFileUpload
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return CustomFileUpload.$extends({
        name: 'ux-custom-file-upload',
        css: css,
        template: html,
        init: function () {
            this.data.parent = this.$refs.uploadbtnwrap;
            this.supr();
        },
        /**
         * 私有接口，上传错误回调
         * @protected
         * @method  module:pool/component-upload/src/custom-file-upload/component.CustomFileUpload#_onUploadError
         * @returns {void}
         */
        _onUploadError:function(_data){
            if (_data.errCode == -3) {
                modalUI.alert((_data.fileName ? ('文件: ' + _data.fileName) : '') +' 校验失败，请重新上传');
            }else{
                notifyUI.warning((_data.fileName ? ('文件: ' + _data.fileName) : '') +' 上传失败，请重试');
            };
            this.supr();
        }
    });
});
