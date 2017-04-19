/**
 * ------------------------------------------
 * 富媒体编辑器超链接控件实现文件
 * @version  1.0
 * @author   hzwujiazhen(hzwujiazhen@corp.netease.com)
 * ------------------------------------------
 */
define([
    'pool/component-upload/src/uploader/fileUploader',
    '{lib}ui/layer/window.wrapper.js',
    '{lib}util/tab/tab.js',
    'text!./videoCard.html',
    'pool/component-upload/src/uploader/constant',
    'pool/component-upload/src/uploader/util'
],function(
    _fileUploader,
    _window,
    _tab,
    _template,
    _constant,
    _uploadUtil
){
    var MAX_UPLOAD_VIDEO_SIZE = 800*1024*1024;
   var  _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _v = _('nej.v'),
        _g = window,
        _provideoCard,
        _supvideoCard;
    
    var _seed_html = _template;

    var _seed_css = _e._$pushCSSText('');

    /**
     * 图片上传控件
     * @class   图片上传控件
     * @extends {nej.ui.cmd._$$WindowWrapper}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     *                            onselect  [Function] - 字号选中回调函数
     */
    _p._$$videoCard = NEJ.C();
    _provideoCard = _p._$$videoCard._$extend(_p._$$WindowWrapper);
    _supvideoCard = _p._$$videoCard._$supro;    

    /**
     * 初始化外观信息
     * @return {Void}
     */
    _provideoCard.__initXGui = function(){
        this.__seed_css  = _seed_css;
        this.__seed_html = _e._$addNodeTemplate(this.__getHtmlStr());
    };

    /**
     * 初始化节点
     */
    _provideoCard.__initNode = function(){
        this.__supInitNode();

        this.__desc = _e._$getByClassName(this.__body,'j-desc');
        this.__desc[0].innerText = '支持mp4格式，文件最大为800M';
        this.__desc[1].innerText = '';

        this.__tabs = _e._$getByClassName(this.__body,'j-tab');
        this.__choose = _e._$getByClassName(this.__body,'j-choosefile')[0];
        this.__cnts = _e._$getByClassName(this.__body,'j-cnt');
        this.__imgUrl = _e._$getByClassName(this.__body,'j-ipturl')[0];
        this.__smtImgUrl = _e._$getByClassName(this.__body,'j-smturl')[0];
        this.__errorMsg = _e._$getByClassName(this.__body,'j-error')[0];
        this.__imgBox = _e._$getByClassName(this.__body,'j-image')[0];

        this.__tabMg = _t._$$Tab._$allocate({
            list:this.__tabs, 
            selected:'j-selected', 
            onchange:this.__tabChange._$bind(this)
        });

        _v._$addEvent(this.__smtImgUrl,'click',this.__onSubmitImgUrl._$bind(this));
        _v._$addEvent(this.__imgBox,'error',this.__imageUrlError._$bind(this));
        _v._$addEvent(this.__imgBox,'load',this.__imageOnLoad._$bind(this));
        _v._$addEvent(this.__imgUrl,'focus',this.__showErrorTips._$bind(this,''));

    };
    
    /**
     * 提交网络图片
     * @protected
     * @method {__onSubmitImgUrl}
     * @return {Void}
     */
    _provideoCard.__onSubmitImgUrl = function(){
        this.__imgBox.src = this.__imgUrl.value.trim();
    };

    /**
     * 图片链接错误
     * @protected
     * @method {__imageUrlError}
     * @return {Void}
     */
    _provideoCard.__imageUrlError = function(){
        this.__showErrorTips('无法获取链接中的视频，请检查链接或稍后重试');
    };
    
    /**
     * 图片链接正确
     * @protected
     * @method {__imageOnLoad}
     * @return {Void}
     */
    _provideoCard.__imageOnLoad = function(){
        this.__uploadComplete(this.__imgUrl.value);
    };
    
    /**
     * 重置卡片
     * @param {Object} _options
     */
    _provideoCard.__reset = function(_options){
        _options = _options || {};

        _options.clazz = 'ux-eduEditorDialog';
        _options.parent = _options.parent || document.body; // 默认以document为parent
        _options.draggable = _options.draggable || false;
        _options.title = _options.title || '选择视频';
        _options.mask  = _options.mask || "ux-editor-dialog-mask";

        this.__supReset(_options);

        this.__config = _options.config; // 编辑器配置

        this.__imgUploaderUI = _fileUploader._$$UploadUI._$allocate({
            parent : this.__choose,
            btnClassName : this.__config.imgUploadBtnClassName || 'ux-btn',
            btnDisableClassName : this.__config.imgUploadBtnDisableClassName || 'ux-btn-disabled',
            type : _constant.UPLOAD_FILE_TYPE_VIDEO,
            txt : '上传视频',
            verifyFile : this.__verifyFile._$bind(this),  // 判断暂时写死了，之后如果有需要可以改成可配置
            onBeginUpload : this.__uploadStart._$bind(this),
            onFinishUpload : function(_data){
                var _url = _constant.NOS_FORM_UPLOAD_URL + "/" + [_data.bucket, _data.nosKey].join('/');

                this.__uploadComplete(_url);
            }._$bind(this),
            onUploadError : this.__uploadError._$bind(this)
        });

        this.__showErrorTips('');
    };

    _provideoCard.__verifyFile = function(_fileName, _fileNode){
        if (!_fileName) {
            this.__showErrorTips('文件类型错误！');
            return false;
        };

        var _fileSuffix = _fileName.slice(_fileName.lastIndexOf('\.') + 1);

        var _suffixReg = /MP4|mp4/i;

        // 检查文件类型
        if (!!_fileSuffix) {
            if (!!_suffixReg && !_suffixReg.test(_fileSuffix)){
                this.__showErrorTips('不支持所选择的文件格式，请重新选择。');
                return false;
            }
        }else{
            
            this.__showErrorTips('请选择视频文件！');
            return false;
        }

        // 再检查文件大小限制 
        var _fileSize = _uploadUtil._$getFileSize(_fileNode);
        
        if (!_fileSize) { // 不支持判断文件大小
            return true;
        };

        var _sizeLimit = MAX_UPLOAD_VIDEO_SIZE;
        var _sizeTxt = '文件不能大于800M';
             
        if (_sizeLimit && _fileSize > _sizeLimit) {
            this.__showErrorTips(_sizeTxt);
            return false;
        }

        return true;
    }
    
    /**
     * 销毁卡片
     */
    _provideoCard.__destroy = function(){
        if (!!this.__tabMg) {
            this.__tabMg = _t._$$Tab._$recycle(this.__tabMg);
        };

        if (!!this.__imgUploaderUI) {
            this.__imgUploaderUI = _fileUploader._$$UploadUI._$recycle(this.__imgUploaderUI);
        };

        this.__supDestroy();
    };
    
    
    _provideoCard.__getHtmlStr = function(){
        var _btn1_html_str = '<a class="ux-btn f-pa">选择视频</a>';

        var _btn2_html_str = '<a class="ux-btn f-fl j-smturl">确定</a>';
        
        return _seed_html.replace('$btn1_html_str', _btn1_html_str).replace('$btn2_html_str', _btn2_html_str);
    }

    /**
     * 开始图片上传
     * @protected
     * @method {__uploadStart}
     * @return {Void}
     */
    _provideoCard.__uploadStart = function(){
        this.__onbeforeupload();
    };

     /**
     * 图片上传完成的回调
     * @protected
     * @method {__uploadComplete}
     * @param  {Object} _data // 见fileUploader的数据结构
     * @return {Void}
     */
    _provideoCard.__uploadComplete = function(_data){
        if(!_data){
            this.__showErrorTips('视频上传失败');
            this.__onafterupload();
        }else{
            this.__showErrorTips('');
            this._$dispatchEvent('onchange', _data);
            this.__onafterupload();
            this._$hide();
        }
    };
    
    /**
     * 上传图片出错信息设置
     * @protected
     * @method {__showErrorTips}
     * @param  {String} 错误信息
     * @return {Void}
     */
    _provideoCard.__showErrorTips = function(_message){
        this.__errorMsg.innerText = _message;
    };

    /**
     * 上传前
     */
    _provideoCard.__onbeforeupload = function(){
        if(typeof this.__config.showLoadingFn == 'function'){
            this.__config.showLoadingFn();
        }
    };
    
    /**
     * 图片上传完成后
     */
    _provideoCard.__onafterupload = function(){
        if(typeof this.__config.hideLoadingFn == 'function'){
            this.__config.hideLoadingFn();
        }
    };

    /**
     * 图片上传出错处理
     * @param {Object} _data // 见fileUploader的错误信息
     */
    _provideoCard.__uploadError = function(_data){
        this.__showErrorTips('上传失败，请重试');

        this.__onafterupload();
    };

    /**
     * 切换tab
     * @protected
     * @method {__tabChange}
     * @param  {Object} 当前Tab对象
     * @return {Void}
     */
    _provideoCard.__tabChange = function(_event){
        this.__showErrorTips('');
        var _index = _event.index;

        if(!_index){
            this.__cnts[0].style.display = '';
            this.__cnts[1].style.display = 'none';
        }else{
            this.__imgUrl.value = '';
            this.__cnts[1].style.display = '';
            this.__cnts[0].style.display = 'none';
        }
    };

    return _p._$$videoCard;
    
});



