/**
 * ----------------------------------------------------------
 * 简单图片文件组件
 * @version  1.0
 * @author hzwujiazhen(hzwujiazhen@corp.netease.com)
 * 
 * @module pool/component-upload/src/simple-img-upload/component
 * ----------------------------------------------------------
 */
define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'pool/component-upload/src/uploader/constant',
    'pool/component-upload/src/uploader/fileUploader',
    'pool/component-upload/src/verifyFile'
], function(
    Component,
    util,
    constant,
    fileUploader,
    verifyFile
){

    /**
     * 开始上传时触发
     *
     * @event module:pool/component-upload/src/simple-img-upload/component.Upload#beginUpload
     * @param {object} data 上传相关属性
     */

    /**
     * 更新进度时触发
     *
     * @event module:pool/component-upload/src/simple-img-upload/component.Upload#updateProgress
     * @param {object} data 上传相关属性
     */

    /**
     * 上传结束时触发
     *
     * @event module:pool/component-upload/src/simple-img-upload/component.Upload#finishUpload
     * @param {object} data 上传相关属性
     */

    /**
     * 上传错误时触发
     *
     * @event module:pool/component-upload/src/simple-img-upload/component.Upload#uploadError
     * @param {object} data 上传相关属性
     */
    var SimpleImgUpload = Component.$extends({

        /**
         * 模板编译前用来初始化参数
         * @protected
         * @method  module:pool/component-upload/src/simple-img-upload/component.SimpleImgUpload#config
         * @param {HTMLElement}    [data.parent=null]                              - 容器节点，上传组件注入的DOM节点
         * @param {string}         [data.btnTxt='图片上传']                         - 按钮文字
         * @param {string}         [data.btnClassName='u-btn']                     - 上传按钮样式
         * @param {string}         [data.btnDisableClassName='u-btn-disabled']     - 上传按钮禁用样式
         * @param {number}         [data.boxWidth=100]                             - 图片显示宽度
         * @param {number}         [data.boxHeight=100]                            - 图片显示高度
         * @param {number}         [data.height=0]                                 - 图片实际压缩高度, 不传的话显示原始尺寸
         * @param {number}         [data.width=0]                                  - 图片实际压缩宽度, 不传的话显示原始尺寸
         * @returns {void}
         */
        config : function () {

            // FIXME 设置组件配置信息的默认值
            util.extend(this, {
                $constant: {
                    'UNDO': 0,
                    'UPLOADING': 3,
                    'DONE': 4
                }
            });

            util.extend(this.data, {
                parent: null,
                btnClassName: 'u-btn',
                btnTxt: '图片上传',
                btnDisableClassName: 'u-btn-disable',
                boxWidth: 100,
                boxHeight: 100,
                height: 0,
                width: 0
            });

            this.data.status = this.data.imgSrc?this.$constant.DONE:this.$constant.UNDO;
            
            this.$watch("imgSrc",function(){
                this.data.status = this.data.imgSrc?this.$constant.DONE:this.$constant.UNDO;
            });
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-upload/src/simple-img-upload/component.SimpleImgUpload#init
         * @returns {void}
         */
        init : function(){

            if(this.data.parent){
                this._imgUploaderUI = fileUploader._$$UploadUI._$allocate({
                    parent : this.data.parent,
                    type : constant.UPLOAD_FILE_TYPE_IMAGE,
                    btnClassName : this.data.btnClassName ,
                    btnDisableClassName : this.data.btnDisableClassName,
                    btnTxt : this.data.btnTxt || '',
                    verifyFile : verifyFile._$bind({type:constant.UPLOAD_FILE_TYPE_IMAGE}),
                    onFinishUpload: this._onFinishUpload._$bind(this),
                    onBeginUpload: this._onBeginUpload._$bind(this),
                    onUploadError: this._onUploadError._$bind(this)
                });
            }
            this.supr();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-upload/src/simple-img-upload/component.SimpleImgUpload#destroy
         * @returns {void}
         */
        destroy : function(){
            if (this._imgUploaderUI) {
                this._imgUploaderUI = fileUploader._$$UploadUI._$recycle(this._imgUploaderUI);
            }
            this.supr();
        },

        /**
         * 私有接口，上传开始回调
         * @private
         * @method  module:pool/component-upload/src/simple-img-upload/component.SimpleImgUpload#_onBeginUpload
         * @returns {void}
         */
        _onBeginUpload:function(_data){
            // 建议用全局的loading
            this.data.status = this.$constant.UPLOADING;
            this.$update();
            
            this.$emit('beginUpload',_data);
        },

        /**
         * 私有接口，上传结束回调
         * @private
         * @method  module:pool/component-upload/src/simple-img-upload/component.SimpleImgUpload#_onFinishUpload
         * @returns {void}
         */
        _onFinishUpload:function(_data){
            // 建议用全局的loading
            this.data.status = this.$constant.DONE;
            // this.data.imgSrc = constant.NOS_FORM_UPLOAD_URL+"/"+[_data.bucket, _data.nosKey].join('/');
            this.data.imgSrc = "http://" + _data.bucket + ".nosdn.127.net/" + _data.nosKey;

            this.data.imgSrc = this.data.imgSrc + '?imageView&quality=100';
            if(this.data.height && this.data.width){
                // thumbnail 指定缩略图片的宽和高，有以下几种格式：
                //         WidthxHeight：普通缩略（内缩略）
                //         Widthx0：限定宽度，高度自适应（内缩略）
                //         0xHeight：限定高度，宽度自适应（内缩略）
                //         WidthyHeight：裁剪缩略
                //         WidthzHeight：普通大边缩略（外缩略）

                this.data.imgSrc =  this.data.imgSrc + '&thumbnail='+this.data.width+'y'+this.data.height;
            }

            this.$update();

            // 直接抛出图片地址
            this.$emit('finishUpload', this.data.imgSrc);
        },

        /**
         * 私有接口，上传错误回调
         * @private
         * @method  module:pool/component-upload/src/simple-img-upload/component.SimpleImgUpload#_onUploadError
         * @returns {void}
         */
        _onUploadError:function(_err){
            // 建议用全局的loading
            this.data.status = this.$constant.UNDO;
            this.$update();
            this.$emit('_onUploadError', _err);
        }
    });
    
    return SimpleImgUpload;
});
