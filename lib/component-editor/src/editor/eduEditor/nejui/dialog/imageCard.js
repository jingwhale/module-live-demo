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
    'text!./imageCard.html',
    'pool/component-upload/src/uploader/constant',
    'pool/component-upload/src/uploader/util',
    '{eutil}numUtil.js'
],function(
    _fileUploader,
    _window,
    _tab,
    _template,
    _constant,
    _uploadUtil,
    _numUtil
){
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
        _proImageCard,
        _supImageCard;

    var _seed_html = _template;

    var _seed_css = _e._$pushCSSText('');

    /**
     * 图片上传控件
     * @class   图片上传控件
     * @extends {nej.ui.cmd._$$WindowWrapper}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     *                            onselect  [Function] - 字号选中回调函数
     */
    _p._$$ImageCard = NEJ.C();
    _proImageCard = _p._$$ImageCard._$extend(_p._$$WindowWrapper);
    _supImageCard = _p._$$ImageCard._$supro;

    /**
     * 初始化外观信息
     * @return {Void}
     */
    _proImageCard.__initXGui = function () {
        this.__seed_css = _seed_css;
        this.__seed_html = _e._$addNodeTemplate(this.__getHtmlStr());
   };

    /**
     * 初始化节点
     */
    _proImageCard.__initNode = function () {
        this.__supInitNode();

        this.__desc = _e._$getByClassName(this.__body, 'j-desc');
        this.__desc[0].innerText = '支持JPG、JPEG、GIF、BMP格式的图片，文件需小于20M';
        this.__desc[1].innerText = '网络图片不能超过2M';

        this.__tabs = _e._$getByClassName(this.__body, 'j-tab');
        this.__choose = _e._$getByClassName(this.__body, 'j-choosefile')[0];
        this.__cnts = _e._$getByClassName(this.__body, 'j-cnt');
        this.__imgUrl = _e._$getByClassName(this.__body, 'j-ipturl')[0];
        this.__smtImgUrl = _e._$getByClassName(this.__body, 'j-smturl')[0];
        this.__errorMsg = _e._$getByClassName(this.__body, 'j-error')[0];
        this.__imgBox = _e._$getByClassName(this.__body, 'j-image')[0];

        this.__tabMg = _t._$$Tab._$allocate({
            list: this.__tabs,
            selected: 'j-selected',
            onchange: this.__tabChange._$bind(this)
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
    _proImageCard.__onSubmitImgUrl = function () {
        this.__imgBox.src = this.__imgUrl.value.trim();
    };

    /**
     * 图片链接错误
     * @protected
     * @method {__imageUrlError}
     * @return {Void}
     */
    _proImageCard.__imageUrlError = function () {
        this.__showErrorTips('无法获取链接中的图片，请检查链接或稍后重试');
    };

    /**
     * 图片链接正确
     * @protected
     * @method {__imageOnLoad}
     * @return {Void}
     */
    _proImageCard.__imageOnLoad = function () {
        this.__uploadComplete(this.__imgUrl.value);
    };

    /**
     * 重置卡片
     * @param {Object} _options
     */
    _proImageCard.__reset = function (_options) {
        _options = _options || {};

        _options.clazz = 'ux-eduEditorDialog';
        _options.parent = _options.parent || document.body; // 默认以document为parent
        _options.draggable = _options.draggable || false;
        _options.title = _options.title || '选择图片';
        _options.mask  = "ux-editor-dialog-mask";

        this.__supReset(_options);

        this.__config = _options.config; // 编辑器配置

        this.__imgUploaderUI = _fileUploader._$$UploadUI._$allocate({
            parent: this.__choose,
            btnClassName: this.__config.imgUploadBtnClassName || 'ux-btn',
            btnDisableClassName: this.__config.imgUploadBtnDisableClassName || 'ux-btn-disabled',
            type: _constant.UPLOAD_FILE_TYPE_IMAGE,
            txt: '上传图片',
            verifyFile: this.__verifyFile._$bind(this), // 判断暂时写死了，之后如果有需要可以改成可配置
            onBeginUpload: this.__uploadStart._$bind(this),
            onFinishUpload: function (_data) {
                var _url = _constant.NOS_FORM_UPLOAD_URL + "/" + [_data.bucket, _data.nosKey].join('/');
                if (this.__config.imageSuffix) {
                    _url = _url + this.__config.imageSuffix;
                }
                this.__uploadComplete(_url);
            }._$bind(this),
            onUploadError: this.__uploadError._$bind(this)
        });

        this.__showErrorTips('');
    };

    _proImageCard.__verifyFile = function (_fileName, _fileNode) {
        if (!_fileName) {
            this.__showErrorTips('文件类型错误');
            return false;
        };

        var _fileSuffix = _fileName.slice(_fileName.lastIndexOf('\.') + 1);

        var _suffixReg = /jpg|png|jpeg|bmp|gif/i;

        // 检查文件类型
        if (!!_fileSuffix) {
            if (!!_suffixReg && !_suffixReg.test(_fileSuffix)) {
                this.__showErrorTips('请选择图片文件！');
                return false;
            }
        } else {
            this.__showErrorTips('文件类型错误');
            return false;
        }

        // 再检查文件大小限制 
        var _fileSize = _uploadUtil._$getFileSize(_fileNode);

        if (!_fileSize) { // 不支持判断文件大小
            return true;
        };

        var _sizeLimit = _constant.UPLOAD_SIZE_MAX_IMAGE;
        var _sizeTxt = '图片文件不能大于' + _numUtil._$formatFileSize(_constant.UPLOAD_SIZE_MAX_IMAGE);

        if (_sizeLimit && _fileSize > _sizeLimit) {
            this.__showErrorTips(_sizeTxt);
            return false;
        }

        return true;
    }

    /**
     * 销毁卡片
     */
    _proImageCard.__destroy = function () {
        if (!!this.__tabMg) {
            this.__tabMg = _t._$$Tab._$recycle(this.__tabMg);
        };

        if (!!this.__imgUploaderUI) {
            this.__imgUploaderUI = _fileUploader._$$UploadUI._$recycle(this.__imgUploaderUI);
        };

        this.__supDestroy();
    };


    _proImageCard.__getHtmlStr = function () {
        var _btn1_html_str = '<a class="ux-btn f-pa">选择图片</a>';

        var _btn2_html_str = '<a class="ux-btn f-fl j-smturl">确定</a>';

        return _seed_html.replace('$btn1_html_str', _btn1_html_str).replace('$btn2_html_str', _btn2_html_str);
    }

    /**
     * 开始图片上传
     * @protected
     * @method {__uploadStart}
     * @return {Void}
     */
    _proImageCard.__uploadStart = function () {
        this.__onbeforeupload();
    };

    /**
     * 图片上传完成的回调
     * @protected
     * @method {__uploadComplete}
     * @param  {Object} _data // 见fileUploader的数据结构
     * @return {Void}
     */
    _proImageCard.__uploadComplete = function (_data) {
        if (!_data) {
            this.__showErrorTips('图片上传失败');
            this.__onafterupload();
        } else {
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
    _proImageCard.__showErrorTips = function (_message) {
        this.__errorMsg.innerText = _message;
    };

    /**
     * 图片上传前
     */
    _proImageCard.__onbeforeupload = function () {
        if (typeof this.__config.showLoadingFn == 'function') {
            try {
                this.__config.showLoadingFn();
            } catch (e) {

            }
        }
    };

    /**
     * 图片上传完成后
     */
    _proImageCard.__onafterupload = function () {
        if (typeof this.__config.hideLoadingFn == 'function') {
            try {
                this.__config.hideLoadingFn();
            } catch (e) {

            }
        }
    };

    /**
     * 图片上传出错处理
     * @param {Object} _data // 见fileUploader的错误信息
     */
    _proImageCard.__uploadError = function (_data) {
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
    _proImageCard.__tabChange = function (_event) {
        this.__showErrorTips('');
        var _index = _event.index;

        if (!_index) {
            this.__cnts[0].style.display = '';
            this.__cnts[1].style.display = 'none';
        } else {
            this.__imgUrl.value = '';
            this.__cnts[1].style.display = '';
            this.__cnts[0].style.display = 'none';
        }
    };

    return _p._$$ImageCard;

});
