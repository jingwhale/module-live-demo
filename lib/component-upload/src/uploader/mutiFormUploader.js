/**
* ----------------------------------------------------------------
* 多文件同时上传（表单形式）
* 这种方案不太好，只是创建了多个formUploader。建议在formUploader中直接实现多个同时上传。当然复杂度其实差不多
*  @version  1.0
*  @module   pool/component-upload/src/uploader/mutiFormUploader
* ----------------------------------------------------------------
*/
NEJ.define([
'text!./mutiFileUploader.html',
'lib/base/util',
'lib/base/klass',
'lib/base/element',
'lib/ui/base',
'lib/util/template/tpl',
'./constant.js',
'./util.js',
'./formUploader.js'
],function(
    _template,
    _util,
    _k,
    _e,
    _ui,
    _t,
    _constant,
    _uploadUtil,
    _formUploader,
    _p, _o, _f, _r){

    var _g = window;

    // 样式
    var _seed_css = _e._$pushCSSText('.u-mutiFormUpload{position:relative; display:inline-block;}');

    /**
     *
     * uploadUtil
     * @class   _$$MutiFileUploader
     * @extends _$$Abstract
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     *
     * @Event uploadComplete 上传完成回调
     * @Event uploadError 上传错误，内容为错误信息
     * @Event uploadStart 上传开始
     *
     */
    _p._$$MutiFileUploader = _k._$klass();
    var _pro = _p._$$MutiFileUploader._$extend(_ui._$$Abstract);

    /**
     * 初始化外观信息
     *
     */
    _pro.__initXGui = function() {
        this.__seed_html = _t._$addNodeTemplate(_template);
    };

    /**
     * 初始化节点
     *
     * @return {Void}
     */
    _pro.__initNode = function() {
        this.__supInitNode();

    };

    /**
     * 重置
     * _options:
     *      配置:
     *      parent
     *      type
     *      txt
     *      verifyFile
     *      initUploadUrl
     *      maxUploadCount
     *
     *      事件回调:
     *      onBeginUpload
     *      onUpdateProgress
     *      onFinishUpload
     *      onUploadError
     *      onMaxCount
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);

        this.__config = _options;

        this.__uilist = [];
        this.__posUIcount = 0;
        this.__progressDataList = []; // 进度数据数组

        this.__maxUploadCount = _options.maxUploadCount || 5; // 同时上传个数上限

        // 回调
        this.__optionOnBeginUpload = _options.onBeginUpload;
        this.__optionOnUpdateProgress = _options.onUpdateProgress;
        this.__optionOnFinishUpload = _options.onFinishUpload;
        this.__optionOnUploadError = _options.onUploadError;
        this.__optionOnMaxCount = _options.onMaxCount; // 超过个数限制的回调

        this.__createOneUploadUI();
    };

    _pro.__createOneUploadUI = function(){
        var _uiWrapNode = _e._$create('div', '', this.__body);

        var _ui = _formUploader._$$FormUploadUI._$allocate({
            parent : _uiWrapNode,
            btnClassName : this.__config.btnClassName,
            btnDisableClassName : this.__config.btnDisableClassName,
            type : this.__config.type,
            txt : this.__config.txt,
            verifyFile : this.__config.verifyFile,
            initUploadUrl : this.__config.initUploadUrl,
            onBeginUpload : this.__onBeginUpload._$bind(this, this.__uilist.length),
            onUpdateProgress : this.__onUploadProgress._$bind(this, this.__uilist.length),
            onFinishUpload : this.__onFinishUpload._$bind(this, this.__uilist.length),
            onUploadError : this.__onUploadError._$bind(this, this.__uilist.length)
        });

        // 考虑到ui重用，需要重置状态
        _ui.wrapNode = _uiWrapNode; // 父节点引用

        _ui.isUsing = false;
        _ui.progress = null;

        this.__uilist.push(_ui);
        this.__posUIcount++;

        // 限制上传的数量
        if (this.__posUIcount > this.__maxUploadCount) {
            // 禁用
            _ui._$disable(true);

            // 抛出事件
            this.__optionOnMaxCount && this.__optionOnMaxCount(this.__maxUploadCount);
        }else{
            _ui._$disable(false);
        }
    };

    // 是否能创建下一个
    _pro.__canCreateNext = function(){
        for (var i = this.__uilist.length - 1; i >= 0; i--) {
            if(this.__uilist[i] && !this.__uilist[i].isUsing){ // 检查是否有空闲的
                return false;
            }
        };

        return true;
    }

    // 更新全部进度数组
    _pro.__genProgressDataList = function(){
        this.__progressDataList = [];

        for (var i = 0; i <= this.__uilist.length - 1; i++) {
            if(this.__uilist[i] && this.__uilist[i].progress){
                this.__progressDataList.push(this.__uilist[i].progress);
            }
        };

        return this.__progressDataList;
    }

    _pro.__onBeginUpload = function(_index, _data){
        if(this.__uilist[_index]){
            this.__uilist[_index].isUsing = true;
            // 隐藏在使用的ui
            this.__uilist[_index].wrapNode.style.display = 'none';

            this.__uilist[_index].progress = {
                index : _index,
                fileName : _data.name,
                beginTime : _data.curTime,
                progressData : null // 开始时没有进度
            }; // 更新单个ui的上传进度
        }

        if (this.__canCreateNext()) {
            this.__createOneUploadUI(); // 创建下一个
        };

        this.__optionOnBeginUpload && this.__optionOnBeginUpload({
            index : _index,
            data : _data,
            progressDataList : this.__genProgressDataList()
        });
    }

    _pro.__onUploadProgress = function(_index, _data){
        if(this.__uilist[_index] && this.__uilist[_index].progress) this.__uilist[_index].progress.progressData = _data; // 更新单个ui的上传进度

        this.__optionOnUpdateProgress && this.__optionOnUpdateProgress({
            index : _index,
            progressDataList : this.__genProgressDataList()
        });
    }

    _pro.__onUploadError = function(_index, _data){
        // 错误后销毁
        this.__finishOne(_index);

        this.__optionOnUploadError && this.__optionOnUploadError({
            index : _index,
            data : _data,
            progressDataList : this.__genProgressDataList()
        });
    }

    _pro.__onFinishUpload = function(_index, _data){
        // 上传完成后销毁
        this.__finishOne(_index);

        this.__optionOnFinishUpload && this.__optionOnFinishUpload({
            index : _index,
            data : _data,
            progressDataList : this.__genProgressDataList()
        });
    }

    _pro._$abortUpload = function(_index){
        this.__uilist[_index] && this.__uilist[_index]._$abort();

        // 取消也销毁
        this.__finishOne(_index);

        // 发送一次进度
        this.__optionOnUpdateProgress && this.__optionOnUpdateProgress({
            index : _index,
            progressDataList : this.__genProgressDataList()
        });
    }

    // 销毁一个
    _pro.__finishOne = function(_index){
        // 销毁
        if(this.__uilist[_index]){
            _formUploader._$$FormUploadUI._$recycle(this.__uilist[_index]);
            this.__uilist[_index] = null;
            this.__posUIcount--;
        }

        // 激活
        if (this.__posUIcount <= this.__maxUploadCount) {
            this.__uilist[this.__uilist.length - 1]._$disable(false); // 一般是最后一个
        }
    }

    /**
     * 控件销毁
     */
    _pro.__destroy = function(){
        // 销毁
        if(this.__uilist){
            var _uiwrap;

            for (var i = this.__uilist.length - 1; i >= 0; i--) {
                if(this.__uilist[i]){
                    _uiwrap = this.__uilist[i].wrapNode;

                    this.__uilist[i] = _formUploader._$$FormUploadUI._$recycle(this.__uilist[i]);

                    // 移除节点
                    if (_uiwrap) {
                        _e._$remove(_uiwrap, false);
                    };
                }

            };
        }

        this.__supDestroy();
    }

    // 返回结果可注入给其他文件
    return _p;
});
