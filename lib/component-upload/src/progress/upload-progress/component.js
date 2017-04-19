/**
 * ----------------------------------------------------------
 * 上传进度条组件
 * @version  1.0
 * @author hzwujiazhen(hzwujiazhen@corp.netease.com)
 * 
 * @module pool/component-upload/src/progress/upload_progress/component
 * ----------------------------------------------------------
 */
define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'pool/edu-front-util/src/numUtil',
    'pool/edu-front-util/src/timeUtil'
], function(
    Component,
    util,
    numUtil,
    timeUtil
){

    var UploadProgressUI = Component.$extends({

        /**
         * 模板编译前用来初始化参数
         * @protected
         * @method  module:pool/component-upload/src/progress/upload_progress/component.UploadProgress#config
         * @param {string}         [data.fileName='']                                      - 文件名
         * @param {boolean}        [data.supportProgress=false]                            - 是否显示进度条
         * @param {number}         [data.beginTime=0]                                      - 上传时间
         * @param {object}         [data.progressData=null]                                - 上传数据
         * @returns {void}
         */
        config : function () {
            util.extend(this.data, {
                fileName : '',
                supportProgress : false,
                beginTime : 0,
                progressData : null // 进度信息
            });

            if ("withCredentials" in new XMLHttpRequest) {//支持xhr跨域的浏览器
                this.data.supportProgress = true;
            }

            this.$watch('progressData', this._onProgressDataChange._$bind(this));
        },


        /**
         * 当进度条数据回调
         *
         * @protected
         * @method  module:pool/component-upload/src/progress/upload_progress/component.UploadProgress#_onProgressDataChange
         * @returns {void}
         */
        _onProgressDataChange : function(newValue, oldValue){
            if (newValue) {
                var _beginTime = newValue.beginTime || this.data.beginTime;

                this.data.total = numUtil._$formatFileSize(newValue.total);

                // 已用时
                this.data.costTime = this.formatTime(newValue.timeStamp - _beginTime); 
                    
                // 全部已经上传的大小
                this.data.loadMb = numUtil._$formatFileSize(newValue.loaded);
    
                // 速度
                this.data.speed = (newValue.loaded - newValue.initOffset) / ((newValue.timeStamp - _beginTime)/1000);
                this.data.speedStr = numUtil._$formatFileSize(this.data.speed);
                   
                // 剩余时间
                this.data.remainTime = timeUtil._$Millisec2Str(Math.ceil( (newValue.total - newValue.loaded)/(this.data.speed > 0 ? this.data.speed : 1) ));
                    
                // 进度百分比
                this.data.finishPercent = (newValue.loaded / newValue.total)*100;
                // 进度数字
                this.data.finishInt = Math.ceil(this.data.finishPercent);

                this.$update();
            }
        },

        /**
         * 时间格式化
         *
         * @protected
         * @method  module:pool/component-upload/src/progress/upload_progress/component.UploadProgress#formatTime
         * @returns {void}
         */
        formatTime : function(_time){
            if(!!_time && _time > 0){
                return Math.ceil(_time/1000) > 0 ? Math.ceil(_time/1000) : 1;
            }

            return 1;
        },

        /**
         * 触发停止上传回调
         *
         * @protected
         * @method  module:pool/component-upload/src/progress/upload_progress/component.UploadProgress#onClickAbort
         * @returns {void}
         */
        onClickAbort:function(){
            this.$emit('abortUpload');
        }
    });
    
    return UploadProgressUI;
});
