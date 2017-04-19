/**
 * ----------------------------------------------------------
 * 多文件组件
 * @version  1.0
 * @author hzwujiazhen(hzwujiazhen@corp.netease.com)
 *
 * @module pool/component-upload/src/muti-file-upload/component
 * ----------------------------------------------------------
 */
define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    '../uploader/constant.js',
    '../verifyFile.js',
    '../uploader/mutiFileUploader.js',
    '../progress/upload-progress/ui.js'
    // 'rui/module/notify',
    // 'rui/module/modal'
], function(
    Component,
    util,
    constant,
    verifyFile,
    mutiFileUploader
    // _uploadProgressUI,
    // _notify,
    // _modal
){


    /**
     * 开始上传时触发
     *
     * @event module:pool/component-upload/src/muti-file-upload/component.Upload#beginUpload
     * @param {object} data 上传相关属性
     */

    /**
     * 更新进度时触发
     *
     * @event module:pool/component-upload/src/muti-file-upload/component.Upload#updateProgress
     * @param {object} data 上传相关属性
     */

    /**
     * 上传结束时触发
     *
     * @event module:pool/component-upload/src/muti-file-upload/component.Upload#finishUpload
     * @param {object} data 上传相关属性
     */

    /**
     * 上传错误时触发
     *
     * @event module:pool/component-upload/src/muti-file-upload/component.Upload#uploadError
     * @param {object} data 上传相关属性
     */

    /**
     * 超过最大数量出发
     *
     * @event module:pool/component-upload/src/muti-file-upload/component.Upload#maxCount
     * @param {object} maxCount 最大数量
     */

    var MutiFileUpload = Component.$extends({

        /**
         * 模板编译前用来初始化参数
         * @protected
         * @method  module:pool/component-upload/src/muti-file-upload/component.MutiFileUpload#config
         * @param {HTMLElement}    [data.parent=null]                              - 容器节点，上传组件注入的DOM节点
         * @param {number}         [data.type=6]                                   - 文件类型
         * @param {string}         [data.btnTxt='多文件上传']                       - 按钮文字
         * @param {string}         [data.btnClassName='u-btn']                     - 上传按钮样式
         * @param {string}         [data.btnDisableClassName='u-btn-disabled']     - 上传按钮禁用样式
         * @param {array}          [data.progressList=null]                        - 所有上传的进度数据
         * @returns {void}
         */
        config : function () {
            util.extend(this.data, {
                parent: null,
                type : constant.UPLOAD_FILE_TYPE_VIDEO, // 默认
                btnTxt: '多文件上传',
                btnClassName: 'u-btn',
                btnDisableClassName: 'u-btn-disabled',
                progressList : null
            });
            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-upload/src/muti-file-upload/component.MutiFileUpload#init
         * @returns {void}
         */
        init : function(){
            if (this.data.parent) {
                this._mutiFileUploaderUI = mutiFileUploader._$$MutiFileUploader._$allocate({
                    parent : this.data.parent,
                    // maxUploadCount : 5,
                    btnClassName : 'u-btn ' + (this.data.btnClassName || ''),
                    btnDisableClassName : 'u-btn-disabled',
                    txt : this.data.btnTxt,
                    type : this.data.type,
                    verifyFile : verifyFile._$bind({type:this.data.type}),
                    onBeginUpload:this._onBeginUpload._$bind(this),
                    onUpdateProgress:this._onUpdateProgress._$bind(this),
                    onFinishUpload:this._onFinishUpload._$bind(this),
                    onUploadError:this._onUploadError._$bind(this),
                    onMaxCount:this._onMaxCount._$bind(this)
                });
            }
            this.supr();

        },

        /**
         * 停止上传
         *
         * @method  module:pool/component-upload/src/muti-file-upload/component.MutiFileUpload#abortUpload
         * @returns {void}
         */
        abortUpload:function(_index){
            this._mutiFileUploaderUI._$abortUpload(_index);

            this.$emit('abortUpload', {
                index : _index
            });
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-upload/src/muti-file-upload/component.MutiFileUpload#destroy
         * @returns {void}
         */
        destroy : function(){
            if (this._mutiFileUploaderUI) {
                this._mutiFileUploaderUI = mutiFileUploader._$$MutiFileUploader._$recycle(this._mutiFileUploaderUI);
            };

            this.supr();
        },

        /**
         * 私有接口，上传文件超过最大数量
         * @private
         * @method  module:pool/component-upload/src/muti-file-upload/component.MutiFileUpload#_onMaxCount
         * @returns {void}
         */
        _onMaxCount:function(_maxCount){
            // TODO 提示
            this.$emit('maxCount', _maxCount);
        },

        /**
         * 私有接口，上传开始回调
         * @private
         * @method  module:pool/component-upload/src/muti-file-upload/component.MutiFileUpload#_onBeginUpload
         * @returns {void}
         */
        _onBeginUpload:function(_data){
            this.data.progressList = _data.progressDataList;
            this.$update();

            this.$emit('beginUpload', _data);
        },

        /**
         * 私有接口，更新进度回调
         * @private
         * @method  module:pool/component-upload/src/muti-file-upload/component.MutiFileUpload#_onUpdateProgress
         * @returns {void}
         */
        _onUpdateProgress:function(_data){
            this.data.progressList = _data.progressDataList;
            this.$update();

            this.$emit('updateProgress', _data);
        },

        /**
         * 私有接口，上传错误回调
         * @private
         * @method  module:pool/component-upload/src/muti-file-upload/component.MutiFileUpload#_onUploadError
         * @returns {void}
         */
        _onUploadError:function(_data){
            this.data.progressList = _data.progressDataList;
            this.$update();
            // _modal.alert((_data.data.fileName ? ('文件: ' + _data.data.fileName) : '') +' 上传失败，请重试');

            this.$emit('onUploadError', _data);
        },

        /**
         * 私有接口，结束回调
         * @private
         * @method  module:pool/component-upload/src/muti-file-upload/component.MutiFileUpload#_onFinishUpload
         * @returns {void}
         */
        _onFinishUpload:function(_data){
            this.data.progressList = _data.progressDataList;
            this.$update();

            this.$emit('finishUpload', _data);
        }
    });
    
    return MutiFileUpload;
});
