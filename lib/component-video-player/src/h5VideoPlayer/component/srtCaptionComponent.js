/**
 * srt字幕组件，只适用于pc端
 * 只支持srt格式的字幕
 */
NEJ.define([
    'text!./srtCaptionComponent.html',
    '../base/base.js',
    '../base/component.js',
    'lib/base/element',
    'lib/base/event',
    '../notification/notificationDefine.js',
    '../model/constant.js',
    '../util/util.js',
    'pool/edu-front-util/src/mobileUtil',
    'util/ajax/xdr',
    '../util/srtParseUtil.js'
], function (_tpl,
             _base,
             _component,
             _e,
             _v,
             _notificationDefine,
             _constant,
             _util,
             _mobileUtil,
             _xdr,
             _srtParseUtil,
             p, o, f, r) {

    var SrtCaptionComponent = _base.C();

    SrtCaptionComponent.NAME = 'srtCaptionComponent';

    var _pro = SrtCaptionComponent.extend(_component);

    /**
     * init function
     */
    _pro._init = function (_config) {
        this.__super(_config);

        this._config = _config;
        this._rootNode = _config.rootNode;

        this._captionData = null;

        this._duration = 0;
        this._captionHasLoadLength = 0;

        this._rootNode = _config.rootNode;
        this._bodyNode = _e._$html2node(_tpl);

        this._initEvent();

        return this;
    }

    /**
     * 列出监听的消息
     */
    _pro.listNotificationInterests = function () {
        return [
            _notificationDefine.MOVIEDATA_READY, // 视频开始加载
            _notificationDefine.MAINVIDEO_START_LOAD,
            _notificationDefine.MAINVIDEO_META,
            _notificationDefine.MAINVIDEO_TIME,
            _notificationDefine.VIEW_CAPTION_SELECT,
            _notificationDefine.VIDEO_CONTROL_DOM_READY,
            _notificationDefine.BOX_FULLSCREEN_CHANGE   // IE 全屏并不会触发resize事件,所以在这个消息里也需要去改变字幕字体大小
        ];
    }

    /**
     * 处理消息的方法
     */
    _pro.handleNotification = function (_notificationIns) {

        var _data = _notificationIns.getBody();

        this.__super(_notificationIns);

        switch (_notificationIns.getName()) {
            case _notificationDefine.MOVIEDATA_READY :
                this._handleMoviedataReady(_data);
                break;

            case _notificationDefine.MAINVIDEO_START_LOAD :
                this._handleMainvideoStartLoad(_data);
                break;

            case _notificationDefine.MAINVIDEO_META:
                this._handleMainvideoMeta(_data);
                break;

            case _notificationDefine.MAINVIDEO_TIME:
                this._handleMainvideoTime(_data);
                break;

            case _notificationDefine.VIEW_CAPTION_SELECT:
                this._handleViewCaptionSelect(_data);
                break;

            case _notificationDefine.VIDEO_CONTROL_DOM_READY:
                this._handleVideoControlDomReady(_data);
                break;

            case _notificationDefine.BOX_FULLSCREEN_CHANGE:
                this._initCaptionFontSize();
                break;
        }
    }

    /**
     * 绑定事件
     */
    _pro._initEvent = function () {

        // 字幕大小根据video的高度进行变化
        _v._$addEvent(window,'resize', _throttle(this._initCaptionFontSize,100)._$bind(this));
    }

    _pro._handleMoviedataReady = function (_data) {
        this._initCaption(_data.captionData);
    }

    _pro._handleMainvideoStartLoad = function (_data) {
        if(this._captionData != _data.movieData.captionData){
            this._garbageCaption();
            this._initCaption(_data.movieData.captionData);
        }
    }

    // 这里可以获得视频的准确时间
    _pro._handleMainvideoMeta = function (_data) {
        this._duration = _data.duration;
    }

    // 此消息在ready之后,此时必然已经拿到了_captionData,不过未必拿到了解析后的数据
    _pro._handleMainvideoTime = function (_data) {
        var _item = null;

        if(!this._captionData){
            return;
        }

        if(!this._captionData.hasCaption){
            return;
        }

        // 遍历captionData,如果isSelect为true,且字幕数据加载完毕
        for (var i = 0; i < this._captionData.data.length; i++) {
            _item = this._captionData.data[i];
            if(_item.isSelect && _item.arrdata){
                this._changeCaption(_item, _data.currentTime)
            }
        }
    }

    // 控制被选中或者取消选中的元素的显隐
    _pro._handleViewCaptionSelect = function (_data) {

        // 如果有打开字幕,且这些打开的字幕当前有一个不为空,那么则显示 TODO
        var _item = null;

        for (var i = 0; i < this._captionData.data.length; i++) {

            _item = this._captionData.data[i];

            if(_item.name ==_data.operation.data){

                if(_data.operation.name =='select'){
                    _e._$addClassName(_item._bodyNode,'z-show');
                }else{
                    _e._$delClassName(_item._bodyNode,'z-show');
                }

                break;
            }
        }
    }

    _pro._handleVideoControlDomReady = function (_controlWrap) {
        _controlWrap.insertBefore(this._bodyNode,_controlWrap.childNodes[0]);
    }

    /*==================== 初始化及回收 ====================*/
    _pro._initCaption = function (_captionData) {

        var _item = null;

        this._captionData = _captionData;

        if (!this._captionData.hasCaption) {
            return;
        }

        this._captionHasLoadLength = 0;

        for (var i = 0; i < this._captionData.data.length; i++) {
            _item = this._captionData.data[i];
            this._loadOneCaptionFile(_item);
            _item._bodyNode = _e._$create('div','srt_item',this._bodyNode);

            if(_item.isSelect){
                _e._$addClassName(_item._bodyNode,'z-show');
            }else{
                _e._$delClassName(_item._bodyNode,'z-show');
            }
        }

        this._initCaptionFontSize();
    }

    _pro._garbageCaption = function () {
        this._captionData = null;
        this._removeSrtElems();
    }

    /**
     * 该方法会在_captionItem上创建一个_map字段用于保存秒数到字幕索引的映射
     * 这种算法的前提条件是:返回的秒数为正整数
     * 好处是一次建表,之后查找字幕瞬间命中
     * 坏处是如果视频时间过长可能会占用较多内存(如果每一项4B,那一个10h的视频会占掉140KB)
     * @tips:
     * 1.不是所有秒数都有一个映射,比如假设字幕数组的第一项起始时间是5s,那么0-4s都不会有映射
     * 2.由于依赖相关属性如arrdata
     *
     */
    _pro._initMap = function (_captionItem) {

        var _arr = _captionItem.arrdata,
            _left = 0,
            _right = 0;

        _captionItem._map = {};

        try {
            for (var i = 0; i < _arr.length; i++) {
                _left = Math.ceil(_arr[i].begin);
                _right = Math.floor(_arr[i + 1].begin);

                for (var j = _left; j <= _right; j++) {
                    _captionItem._map[j] = i;
                }
            }
        } catch (_err) {  // 此时i=_arr.length-1,即到达字幕的最后一项
            _left = _arr[i].begin;
            for (var j = _left; j <= this._duration; j++) {
                _captionItem._map[j] = i;
            }
        }
    }

    _pro._removeSrtElems = function () {

        var _srtElems = _e._$getByClassName(this._bodyNode,'srt_item');

        for (var i = 0; i < _srtElems.length; i++) {
            _e._$remove(_srtElems[i]);
        }
    }

    _pro._initCaptionFontSize = function () {
        if (!this._captionData) {
            return;
        }

        if (!this._captionData.hasCaption) {
            return;
        }

        var _defaultCnFontSize = 18,
            _defaultEnFontSize = 14,
            _defaultHeight = 300,
            _videoWrap = _e._$getByClassName(this._rootNode,'u-edu-h5player-mainvideo')[0],
            _videoWrapHeight = +/\d*/.exec(_e._$getStyle(_videoWrap,'height'))[0],
            _x = Math.floor((_videoWrapHeight-_defaultHeight)/100),
            _item = null;

        // 分别设置中英文字幕字体大小
        for (var i = 0; i < this._captionData.data.length; i++) {
            _item = this._captionData.data[i];

            if(!_item._bodyNode){
                continue;
            }

            if(_item.name == '中文'){

                if(_x<=0){
                    _e._$style(_item._bodyNode,{'fontSize':_defaultCnFontSize+'px'});
                }else{
                    _e._$style(_item._bodyNode,{'fontSize':_defaultCnFontSize+4*_x+'px'});
                }
            }else {

                if(_x<=0){
                    _e._$style(_item._bodyNode,{'fontSize':_defaultEnFontSize+'px'});
                }else{
                    _e._$style(_item._bodyNode,{'fontSize':_defaultEnFontSize+4*_x+'px'});
                }
            }
        }
    }
    /*==================== /初始化及回收UI ====================*/

    /**
     * 加载一个字幕文件
     */
    _pro._loadOneCaptionFile = function (_captionItem) {
        // 调用应用接口
        var _options = {
            method: 'GET',
            type: 'text',
            timeout: 10000,
            cookie: false,
            onload: this._cbLoadOneCaptionFileSuccess._$bind(this, _captionItem),
            onerror: this._cbLoadOneCaptionFileFail._$bind(this)
        };

        _xdr._$request(_captionItem.url, _options);
    }

    /**
     * 加载到字幕文件回调
     * @tips:arrdata最后一项text为空串
     */
    _pro._cbLoadOneCaptionFileSuccess = function (_captionItem, _data) {
        _captionItem.arrdata = _srtParseUtil.parseSrt(_data); // 字幕文本数据

        this._captionHasLoadLength++;

        this._initMap(_captionItem);

        // 加载完毕
        if (this._captionData.data.length == this._captionHasLoadLength) {
            // this.hasGetCaptionData = true;
        }
    }

    /**
     * 加载到字幕文件回调
     */
    _pro._cbLoadOneCaptionFileFail = function (_data) {
        // this._hasGetCaptionData = true;
    }

    // 前提是有字幕,且有map
    _pro._changeCaption = function (_captionItem, _time) {

        var _index = _captionItem._map[_time],
            _text = '';

        if(_index){
            _text = _captionItem.arrdata[_index].text;
        }else{
            _text = ''
        }

        // 改变字幕内容
        _captionItem._bodyNode.innerHTML = _text;

    }

    // 降频函数
    function _throttle(_callback,_time) {

        var _t = null;

        return function () {

            var _self = this,
                _args = arguments;

            clearTimeout(_t);

            _t = setTimeout(function () {
                _callback.apply(_self,_args);
                _t = null;
            },_time)
        }
    }

    // 返回结果可注入给其他文件
    return SrtCaptionComponent;
});
