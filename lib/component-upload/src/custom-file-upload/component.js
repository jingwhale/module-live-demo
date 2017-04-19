/**
 * ----------------------------------------------------------
 * 上传文件组件（含进度条）
 * @version  1.0
 * @author hzwujiazhen(hzwujiazhen@corp.netease.com)
 *
 * @module pool/component-upload/src/custom-file-upload/component
 * ----------------------------------------------------------
 */
define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    '../uploader/constant.js',
    '../uploader/fileUploader.js',
    '../verifyFile.js',
    '../progress/upload-progress/ui.js'
    // 'rui/module/modal'
], function(
    Component,
    util,
    constant,
    fileUploader,
    verifyFile
    // _uploadProgressUI,
    // _modal
){

    /**
     * 开始上传时触发
     *
     * @event module:pool/component-upload/src/custom-file-upload/component.Upload#beginUpload
     * @param {object} data 上传相关属性
     */

    /**
     * 更新进度时触发
     *
     * @event module:pool/component-upload/src/custom-file-upload/component.Upload#updateProgress
     * @param {object} data 上传相关属性
     */

    /**
     * 上传结束时触发
     *
     * @event module:pool/component-upload/src/custom-file-upload/component.Upload#finishUpload
     * @param {object} data 上传相关属性
     */

    /**
     * 上传错误时触发
     *
     * @event module:pool/component-upload/src/custom-file-upload/component.Upload#uploadError
     * @param {object} data 上传相关属性
     */

    var CustomFileUpload = Component.$extends({

        /**
         * 模板编译前用来初始化参数
         * @protected
         * @method  module:pool/component-upload/src/custom-file-upload/component.CustomFileUpload#config
         * @param {HTMLElement }    [data.parent=null]                              - 容器节点，上传组件注入的DOM节点
         * @param {string}          [data.uploadbtnwrapTemplate='']                 - 上传模板，如果有，需要需要包含ref=uploadbtnwrap的节点
         * @param {string}          [data.fileName='']                              - 文件名
         * @param {string}          [data.beginTime='']                             - 上传时间
         * @param {boolean}         [data.showProcess=false]                        - 是否显示进度条
         * @param {object}          [data.progressData=null]                        - 进度条数据
         * @param {number}          [data.type=6]                                   - 文件类型
         * @param {string}          [data.btnTxt='上传文件']                         - 按钮文字
         * @param {Number}          [data.sizeLimit=null]                           - 上传限制大小 不传取默认类型
         * @param {string }         [data.btnClassName='u-btn']                     - 上传按钮样式
         * @param {string }         [data.btnDisableClassName='u-btn-disabled']     - 上传按钮禁用样式
         * @returns {void}
         */
        config : function () {

            // FIXME 设置组件配置信息的默认值
            // util.extend(this, {
            //     type: constant.UPLOAD_FILE_TYPE_VIDEO,
            //     fileUploaderUI: null
            // });
            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {
                parent: null,
                type: constant.UPLOAD_FILE_TYPE_VIDEO,
                uploadbtnwrapTemplate: '', // 如果提供则使用，,
                fileName : '',
                beginTime : 0,
                showProcess: false,
                progressData : null,
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
         * @method  module:pool/component-upload/src/custom-file-upload/component.CustomFileUpload#config
         * @returns {void}
         */
        init : function(){
            if (this.data.parent) {
                this._fileUploaderUI = fileUploader._$$UploadUI._$allocate({
                    parent : this.data.parent,
                    btnClassName : this.data.btnClassName,
                    btnDisableClassName : this.data.btnDisableClassName,
                    txt : this.data.btnTxt,
                    type : this.data.type,
                    sizeLimit: this.data.sizeLimit,
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
         * 设置是否禁用组件
         *
         * @method  module:pool/component-upload/src/custom-file-upload/component.CustomFileUpload#setDisable
         * @returns {void}
         */
        setDisable : function(_disable){
            if (this._fileUploaderUI) {
                this._fileUploaderUI._$disable(_disable);
            }
        },

        /**
         * 停止上传被触发
         *
         * @method  module:pool/component-upload/src/custom-file-upload/component.CustomFileUpload#abortUpload
         * @returns {void}
         */
        abortUpload : function(){
            this._fileUploaderUI && this._fileUploaderUI._$abort();

            this.data.showProcess = false;
            this.data.fileName = '';
            this.data.progressData = null;

            this.$update();

            this.$emit('abortUpload');
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-upload/src/custom-file-upload/component.CustomFileUpload#destory
         * @returns {void}
         */
        destroy : function(){
            if (this._fileUploaderUI) {
                this._fileUploaderUI = fileUploader._$$UploadUI._$recycle(this._fileUploaderUI);
            }
            this.supr();
        },

        /**
         * 私有接口，上传开始回调
         * @private
         * @method  module:pool/component-upload/src/custom-file-upload/component.CustomFileUpload#setDisable
         * @returns {void}
         */
        _onBeginUpload:function(_data){
            this.data.showProcess = true;
            this.data.fileName = _data.name;
            this.data.beginTime = _data.curTime; // 开始上传的时刻

            this.$update();

            this.$emit('beginUpload',_data);
        },

        /**
         * 私有接口，更新进度回调
         * @private
         * @method  module:pool/component-upload/src/custom-file-upload/component.CustomFileUpload#_onUpdateProgress
         * @returns {void}
         */
        _onUpdateProgress:function(_data){
            this.data.progressData = _data;

            this.$update();

            this.$emit('updateProgress', _data);
        },

        /**
         * 私有接口，上传结束回调
         * @private
         * @method  module:pool/component-upload/src/custom-file-upload/component.CustomFileUpload#_onFinishUpload
         * @returns {void}
         */
        _onFinishUpload:function(_data){
            this.data.showProcess = false;
            this.$update();

            this.$emit('finishUpload', _data);
        },

        /**
         * 私有接口，上传错误回调
         * @private
         * @method  module:pool/component-upload/src/custom-file-upload/component.CustomFileUpload#_onUploadError
         * @returns {void}
         */
        _onUploadError:function(_data){
            this.data.showProcess = false;
            this.$update();

            // 提示
            // _notify.warning((_data.fileName ? ('文件: ' + _data.data.fileName) : '') +' 上传失败，请重试');
            // _modal.alert((_data.fileName ? ('文件: ' + _data.fileName) : '') +' 上传失败，请重试');

            this.$emit('onUploadError', _data);
        }
    });

    return CustomFileUpload;
});
