/**
 * CustomFileUploadUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hztianxiang <hztianxiang@corp.netease.com>
 * @module   pool/component-upload/src/muti-file-upload/ui
 */
NEJ.define([
    './component.js',
    'text!./component.html',
    'text!./component.css',
    'pool/component-notify/src/notify/ui',
    'pool/component-modal/src/modal/ui'
], function (
    MutiFileUpload,
    html,
    css,
    notifyUI,
    modalUI) {
    
    /**
     * Upload UI组件
     *
     * @class   module:pool/component-upload/src/muti-file-upload/ui.MutiFileUploadUI
     * @extends module:pool/component-upload/src/muti-file-upload/component.MutiFileUpload
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return MutiFileUpload.$extends({
        name: 'ux-muti-file-upload',
        css: css,
        template: html,
        init: function () {
            this.data.parent = this.$refs.uploadbtnwrap;
            this.supr();
        },

        /**
         * 私有接口，上传文件超过最大数量
         * @protected
         * @method  module:pool/component-upload/src/muti-file-upload/ui.MutiFileUploadUI#_onMaxCount
         * @returns {void}
         */
        _onMaxCount: function (_maxCount) {
            notifyUI.info('允许同时上传' + _maxCount + '个文件，已达到上限');
            this.supr();
        },

        /**
         * 私有接口，上传错误回调
         * @private
         * @method  module:pool/component-upload/src/muti-file-upload/ui.MutiFileUploadUI#_onUploadError
         * @returns {void}
         */
        _onUploadError:function(_data){
            if (_data.errCode == -3) {
                modalUI.alert((_data.fileName ? ('文件: ' + _data.fileName) : '') +' 校验失败，请重新上传');
            }else{
                notifyUI.warning((_data.data.fileName ? ('文件: ' + _data.fileName) : '') +' 上传失败，请重试');
            }
            this.supr();
        },
    });
});
