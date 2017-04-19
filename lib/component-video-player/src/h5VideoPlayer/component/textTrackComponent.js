/**
* 字幕组件，pc和移动端逻辑通用，但是建议在移动端使用
* 只支持vtt格式的字幕
*/
NEJ.define([
    '../base/base.js',
    'lib/base/util',
    '../base/component.js',
    'lib/base/element',
    'lib/base/event',
    '../notification/notificationDefine.js',
    '../model/constant.js',
    '../util/util.js',
    'pool/edu-front-util/src/mobileUtil'
], function(
    _base,
    _util,
    _component,
    _element,
    _event,
    _notificationDefine,
    _constant,
    _playerutil,
    _mobileUtil,
    p, o, f, r){

    var TextTrackComponent = _base.C();

    TextTrackComponent.NAME = 'textTrackComponent';

    var _pro = TextTrackComponent.extend(_component);

    /**
    * init function
    */
    _pro._init = function(_config){
        this.__super(_config);

        // this._config = _config;

        this._initEvent();

        return this; 
    }

    /**
    * 列出监听的消息
    */
    _pro.listNotificationInterests = function(){
        return [
            _notificationDefine.MAINVIDEO_VIDEO_READY,
            _notificationDefine.MOVIEDATA_READY,
            _notificationDefine.MAINVIDEO_START_LOAD
        ];
    }

    /**
    * 处理消息的方法
    */
    _pro.handleNotification = function(_notificationIns){
        this.__super(_notificationIns);

        switch(_notificationIns.getName()){
            case _notificationDefine.MAINVIDEO_VIDEO_READY:
                this._handleVideoReady(_notificationIns.getBody());
                break;
            case _notificationDefine.MOVIEDATA_READY:
                this._handleCaptionData(_notificationIns.getBody());
                break;
            case _notificationDefine.MAINVIDEO_START_LOAD:
                this._handleLoadStart(_notificationIns.getBody());
                break;
        }
    }

    /**
    * 绑定事件
    */
    _pro._initEvent = function(){
        
    }

    /**
    * 设置字幕
    */
    _pro._handleCaptionData = function(_data){
        this._captionChange = true;
        this._captionData = _data.captionData || {};
    }

    /**
    * video
    */
    _pro._handleVideoReady = function(_data){
        this._mainVideoNode = _data;
    }

    /**
    * 加载字幕
    */
    _pro._handleLoadStart = function(_data){
        if (!this._captionChange) return; // 字幕没有改变

        this._captionChange = false;

        if (!this._captionData.hasCaption) return; // 没有字幕

        if (!this._mainVideoNode) return;

        this._setTextTrackNode();
    }

    // 设置text track标签
    _pro._setTextTrackNode = function(){
        this._removeTextTrackNode()

        // 在ios中只支持一个字幕，可能要定一下优先级
        _util._$forEach(this._captionData.data, function(caption, index){
            var track = _base.createEl('track', {
                label : caption.name,
                kind : 'subtitles',
                src : caption.url,
                srclang : caption.lang
            });

            this._mainVideoNode.appendChild(track);
            
        }, this);

        this._textTrackNodes = _base.T('track', this._mainVideoNode);

        // 初始隐藏或者显示
        for (var i = 0; i < this._captionData.data.length; i++) {
            this._showOrHideTextTrack(this._captionData.data[i].lang, this._captionData.data[i].isSelect);
        };
        
    }

    // 删除text track标签
    _pro._removeTextTrackNode = function(){
        if (this._textTrackNodes) {
            _util._$forEach(this._textTrackNodes, function(node, index){
                this._mainVideoNode.removeChild(node);
            }, this);
        };

        this._textTrackNodes = null;
    }

    // 隐藏或者显示一个text track标签
    _pro._showOrHideTextTrack = function(lang, show){
        var texttrackNode, texttrack;

        for (var i = 0; i < this._textTrackNodes.length; i++) {
            if(this._textTrackNodes[i].srclang == lang){
                texttrackNode = this._textTrackNodes[i];
            }
        };

        for (var i = 0; i < this._mainVideoNode.textTracks.length; i++) {
            if(this._mainVideoNode.textTracks[i].language == lang){
                texttrack = this._mainVideoNode.textTracks[i];
            }
        };

        // 为了兼容，两个都设置
        if (texttrackNode && texttrack) {
            if (show) {
                texttrackNode.mode = 'showing';
                texttrack.mode = 'showing';
            }else{
                texttrackNode.mode = 'hidden';
                texttrack.mode = 'hidden';
            }
        };
    }

    // 返回结果可注入给其他文件
    return TextTrackComponent;
});
