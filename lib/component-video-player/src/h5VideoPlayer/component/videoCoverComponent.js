/**
* 视频封面组件，pc和移动端逻辑通用，节点和样式不统一
*/
NEJ.define([
    'text!./videoCoverComponent.html',
    'text!./videoCoverMobileComponent.html',
    '../base/base.js',
    '../base/component.js',
    'lib/base/element',
    'lib/base/event',
    '../notification/notificationDefine.js',
    '../model/constant.js',
    '../util/util.js',
    'pool/edu-front-util/src/mobileUtil'
], function(
    _tpl,
    _mobileTpl,
    _base,
    _component,
    _element,
    _event,
    _notificationDefine,
    _constant,
    _util,
    _mobileUtil,
    p, o, f, r){

    var VideoCoverComponent = _base.C();

    VideoCoverComponent.NAME = 'videoCoverComponent';

    var _pro = VideoCoverComponent.extend(_component);

    /**
    * init function
    */
    _pro._init = function(_config){
        this.__super(_config);

        this._config = _config;

        this._rootNode = _config.rootNode;
        this._bodyNode = _element._$getByClassName(this._rootNode, 'j-cover')[0];
        this._coverimgNode = _element._$getByClassName(this._bodyNode, 'j-coverimg')[0];

        this._initEvent();

        return this; 
    }

    /**
     * 获取组件结构，子类实现
     */
    _pro._getTpl = function(){
        // pc和移动端不一样
        if (!_mobileUtil._$isMobileAll()) {
            return _tpl; 
        }else{
            return _mobileTpl; 
        }
    }
    
    /**
    * 列出监听的消息
    */
    _pro.listNotificationInterests = function(){
        return [
            _notificationDefine.MOVIEDATA_READY
        ];
    }

    /**
    * 处理消息的方法
    */
    _pro.handleNotification = function(_notificationIns){
        this.__super(_notificationIns);

        if (this._config.autoStart || this._config.isPreload) {
            return;
        };

        this._bodyNode.style.display = 'block';

        var _md = _notificationIns.getBody()

        if (_md.posterUrl) {
            this._loadCover(_md.posterUrl);
        };
    }

    /**
    * 绑定事件
    */
    _pro._initEvent = function(){
        // pc和移动端分开绑定
        if (_mobileUtil._$isMobileAll() && window.Hammer) {
            var _mc = new Hammer(this._bodyNode);

            _mc.on('tap', this._onTapCover._$bind(this));
        }else{
            _event._$addEvent(this._bodyNode, 'click', this._onClickCover._$bind(this));
        }
    }

    /**
    * 点击整个区域
    */
    _pro._onClickCover = function(){
        this._bodyNode.style.display = 'none';

        this.sendNotification(_notificationDefine.VIEW_LOAD);
    }

    /**
    * 移动端触摸整个区域
    */
    _pro._onTapCover = function(){
        this._bodyNode.style.display = 'none';

        // 在移动端如果能检测到处于非wifi环境需要提示
        var _connectTtype = navigator.connection ? navigator.connection.type : null;
        // alert(_connectTtype);
        if (_connectTtype && _connectTtype == 'cellular') { // 移动蜂窝网络
            if(confirm('正在使用移动网络，播放可能会产生流量费用，是否继续？')){
                this.sendNotification(_notificationDefine.VIEW_LOAD);
            }
        }else{
            this.sendNotification(_notificationDefine.VIEW_LOAD);
        }        
    }

    /**
    * 加载图片
    */
    _pro._loadCover = function(_url){
        _util.imgReady(_url, function(){}, this._cbloadCover._$bind(this));
    }

    /**
    * 加载图片完毕
    */
    _pro._cbloadCover = function(_img){
        var imgw, imgh;
        var bodyw, bodyh;

        // 最好是实时更新播放器尺寸，不然播放器尺寸变化时封面图片不会变化
        bodyw = this._bodyNode.offsetWidth;
        bodyh = this._bodyNode.offsetHeight;

        rscale = bodyw / bodyh;
        imgscale = _img.width / _img.height;

        if (rscale >= imgscale) {
            imgh = bodyh;
            imgw = imgh * imgscale;
        }else{
            imgw = bodyw;
            imgh = imgw / imgscale;
        }

        _element._$setStyle(this._coverimgNode, 'width', imgw + 'px');
        _element._$setStyle(this._coverimgNode, 'height', imgh + 'px');
        _element._$setStyle(this._coverimgNode, 'margin-left', '-' + imgw/2 + 'px');
        _element._$setStyle(this._coverimgNode, 'margin-top', '-' + imgh/2 + 'px');

        this._coverimgNode.src = _img.src;
    }

    // 返回结果可注入给其他文件
    return VideoCoverComponent;
});
