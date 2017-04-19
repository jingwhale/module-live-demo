/**
 * Upload 组件实现文件
 *
 * @version  1.0
 * @author   hztianxiang <hztianxiang@corp.netease.com>
 * @module   pool/component-upload/src/upload/component
 *
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    '../uploader/constant.js',
    '../uploader/fileUploader.js',
    '../verifyFile.js'
],function(
    Component,
    util,
    constant,
    fileUploader,
    verifyFile
){
    /**
     * Upload 组件
     *
     * @class   module:pool/component-upload/src/upload/upload.Upload
     * @extends module:pool/component-base/src/base.Base
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */

    /**
     * 开始上传时触发
     *
     * @event module:pool/component-upload/src/upload/upload.Upload#beginUpload
     * @param {object} data 上传相关属性
     */

    /**
     * 更新进度时触发
     *
     * @event module:pool/component-upload/src/upload/upload.Upload#updateProgress
     * @param {object} data 上传相关属性
     */

    /**
     * 上传结束时触发
     *
     * @event module:pool/component-upload/src/upload/upload.Upload#finishUpload
     * @param {object} data 上传相关属性
     */

    /**
     * 上传错误时触发
     *
     * @event module:pool/component-upload/src/upload/upload.Upload#uploadError
     * @param {object} data 上传相关属性
     */


    var Upload = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         * @protected
         * @method  module:pool/component-upload/src/upload/upload.Upload#config
         * @param {HTMLElement }    [data.parent=null]                              - 容器节点，上传组件注入的DOM节点
         * @param {number}          [data.type=6]                                   - 文件类型
         * @param {string}          [data.btnTxt='上传文件']                         - 按钮文字
         * @param {string }         [data.btnClassName='u-btn']                     - 上传按钮样式
         * @param {string }         [data.btnDisableClassName='u-btn-disabled']     - 上传按钮禁用样式
         * @returns {void}
         */
        config: function () {
            // FIXME 设置组件配置信息的默认值
            // util.extend(this, {
            // });

            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {
                parent: null,
                type: constant.UPLOAD_FILE_TYPE_VIDEO,
                btnTxt: '上传文件',
                btnClassName : 'u-btn',
                btnDisableClassName : 'u-btn-disabled'
            });
            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-upload/src/upload/component.Upload#init
         * @returns {void}
         */
        init: function () {
            if(!!this.data.parent){
                this._fileUploaderUI = fileUploader._$$UploadUI._$allocate({
                    parent : this.data.parent,
                    btnClassName : this.data.btnClassName|| '',
                    txt : this.data.btnTxt,
                    type : this.data.type,
                    verifyFile : verifyFile._$bind({type:this.data.type}),
                    onBeginUpload:this._onBeginUpload._$bind(this),
                    onUpdateProgress:this._onUpdateProgress._$bind(this),
                    onFinishUpload:this._onFinishUpload._$bind(this),
                    onUploadError:this._onUploadError._$bind(this)
                });
            }
            this.supr();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-upload/src/upload/component.Upload#destroy
         * @returns {void}
         */
        destroy: function () {
            // TODO
            if (this._fileUploaderUI) {
                this._fileUploaderUI = fileUploader._$$UploadUI._$recycle(this._fileUploaderUI);
            }
            this.supr();
        },

        /**
         * 私有接口，上传开始回调
         * @private
         * @method  module:pool/component-upload/src/upload/component.Upload#_onBeginUpload
         * @returns {void}
         */
        _onBeginUpload:function(_data){
            // 建议用全局的loading
            // _loading.show();
            // this.$update();
            this.$emit('beginUpload',_data);
        },

        /**
         * 私有接口，更新进度回调
         * @private
         * @method  module:pool/component-upload/src/upload/component.Upload#_onUpdateProgress
         * @returns {void}
         */
        _onUpdateProgress:function(_data){
            //TODO 提示 _loading.show();
            this.$emit('updateProgress', _data);
        },

        /**
         * 私有接口，上传成功回调
         * @private
         * @method  module:pool/component-upload/src/upload/component.Upload#_onFinishUpload
         * @returns {void}
         */
        _onFinishUpload:function(_data){
            // 建议用全局的loading
            // _loading.hide();

            // this.$update();
            this.$emit('finishUpload', _data);
        },

        /**
         * 私有接口，上传失败回调
         * @private
         * @method  module:pool/component-upload/src/upload/component.Upload#_onUploadError
         * @returns {void}
         */
        _onUploadError:function(_data){
            // _loading.hide();

            // this.$update();
            this.$emit('uploadError', _data);
        }


    });

    return Upload;
});
