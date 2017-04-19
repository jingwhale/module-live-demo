/**
 * h5播放器入口类
 */
NEJ.define([
     'text!./player.html',
     'lib/base/util',
     'base/element',
     '../base/base.js',
     '../model/defaultConfig.js',     
     './componentList.js',
     '../base/componentContainer.js',
     '../util/logUtil.js',
     '../base/notification.js',
     '../notification/notificationDefine.js',
     'pool/edu-front-util/src/mobileUtil'
], function(
     _tpl,
     _util,
     _element,
     _base,
     _defaultConfig,
     _componentList,
     _componentContainer,
     _logUtil,
     _notification,
     _notificationDefine,
     _mobileUtil,
     p, o, f, r){
    
    /**
     *   参数：
     *      parent                     父节点
     *    
     *      播放器配置
     *      包含以下字段，默认值见defaultConfig.js
     *      host                    主域名
     *      staticHost              静态域名
     *      isLocal                 是否是本地调试
     *      showPauseAd             是否开启暂停广告功能
     *      innerSite               是否是站内
     *      beforePlay              是否支持片头
     *      autoStart               是否自动播放 
     *      volume                  初始化视频播放器音量，如果没传则从cookie中读取，没有则使用默认值0.8(范围0-1)
     *      mute                    是否静音
     *      defaultQuality          视屏播放清晰度1，2，3，对应标清、高清、超高清，默认从cookie取
     *      showCdnSwitch           是否开启cdn线路功能
     *      notAllowFullScreen      禁止全屏
     *    
     *    回调：
     *      onPlayEnd
     *         参数：无
     *
     *      onPlay
     *          参数：无
     *
     *      onPlayClick
     *          参数：无
     *
     *      onPause
     *          参数：无
     *
     *      onPauseClick
     *          参数：position 暂停的时刻
     *
     *      onSeek
     *          参数：{'oldData':12, 'newData':40}
     *
     *      onAnchorPoint
     *          参数：{'time':10}
     *
     *      onSelectResolution
     *          参数：{'oldData':{'name':'标清', 'quailty':1}, 'newData':{'name':'高清', 'quailty':2}}
     *
     *      onSelectCaption
     *          参数：{'oldData':['英文'], 'newData':['中文', '英文']}
     *
     *      onChangeCDN
     *          参数：{'oldData':{'isp':'sd', 'ispName':'电信'}, 'newData':{'isp':'sd', 'ispName':'电信'}}
     *
     *      onChangeVolume
     *          参数：0.5 音量值
     *
     *      onMute
     *          参数：true/false
     *
     *    暴露的方法:
     *
     *      _$stop
     *          停止当前视频播放
     *          @return {void}
     *
     *      _$load
     *          加载新视频
     *          @param {Object} videoData
     *          videoData : 统一的视频数据，部分参数与后台数据结构保持一致，有变更需要双方商定，请勿随意修改！！
     *               包含以下字段，大部分对应后台视频dto
     *               defaultQuality          默认清晰度
     *               flvSdUrl                flash用视频地址
     *               flvHdUrl                flash用视频地址
     *               flvShdUrl               flash用视频地址
     *               mp4SdUrl                h5用视频地址
     *               mp4HdUrl                h5用视频地址
     *               mp4ShdUrl               h5用视频地址
     *               key                     cdn加密后的key,如果needKeyTimeValidate为true
     *               needKeyTimeValidate     是否进行时间戳校验，true表示前端需要定期发校验请求
     *               playerCollection        二进制值，00值表示两者都不可播放，01表示仅支持flv 10表示仅支持mp4,11表示mp4和flv都支持
     *               isEncrypt               是否加密
     *               clientEncryptKeyVersion 客户端加解密的key的版本1,2,3
     *               encryptionVideoData     视频加密秘钥
     *               mp4Caption              h5字幕
     *               flvCaption              flash字幕
     *               videoImgUrl             视频封面地址
     *               videoId                 视频id
     *               duration                视频时长
     *               start                   从哪里开始播放(以秒为单位)
     *               adUrl                   片头视频地址
     *               cluPointData            驻点数据，可能需要外部通过接口获取并传入
     *              直播相关字段，在开启直播模式是使用
     *               liveTitle               直播标题
     *               liveStartTime           直播开始时间 
     *               liveEndTime             直播结束时间 
     *               
     *          @return {void}
     *
     *      pause
     *          暂停视频
     *          @return {void}
     *
     *      resume
     *          恢复视频
     *          @return {void}
     *
     *      getPosition
     *          获取当前视频播放的时间
     *          @param {Function} 回调对象：function(_positionTime){}
     *          @return {void} 
     *
     *      seek
     *          设置跳转到对应的时间,用于驻点播放
     *          @param {Number}  _seekSecs
     *          @return {void} 
     *      
     *      getState
     *          获取播放器的状态
     *          @param {Function} 回调对象：function(_state){}
     *          @return {String} "IDLE","BUFFERING","PLAYING", "PAUSED"
     *      
     *      getStateInfo
     *          获取播放器的状态详细信息
     *          @param {Function} 回调对象：function(_state){}
     *          @return {Object} 
     */
    var Player = _base.C();

    var _pro = Player.pro;
    
     /**
      * init function
      */
    _pro._init = function(_config){
        this._doConfig(_config);

        // 节点
        this.__playerConfig.parent.innerHTML = _tpl;
        this.__playerConfig.rootNode = _element._$getChildren(this.__playerConfig.parent)[0];

        // 初始化log
        _logUtil.init(this.__playerConfig);

        // 创建组件容器
        this.__componentContainer = new _componentContainer();

        // 获取组件列表
        this.__componentList = _componentList(this.__playerConfig);

        // 注册组件
        _util._$forIn(this.__componentList, function(item, index){
            item.componentContainer = this.__componentContainer;

            this.__componentContainer.registerComponent(new item(this.__playerConfig, this));
        }._$bind(this));

        return this; 
    }

    _pro._doConfig = function(_config){
        // 合并默认配置
        this.__playerConfig = _util._$merge({}, _defaultConfig); // 从默认配置拷贝
        this.__playerConfig = _util._$merge(this.__playerConfig, _config || {}); // 合并传入的配置

        if (_mobileUtil._$isMobileAll()) { // 移动端禁止
            this.__playerConfig.isPreload = false;
            this.__playerConfig.beforePlay = false;
        };

        // 如果开启了自动播放则忽略预加载
        if (this.__playerConfig.autoStart) {
            this.__playerConfig.isPreload = false;
        };
    }

    /**
     * 销毁
     */
    _pro.destory = function(){
        // 删除组件
        _util._$forEach(this.__componentList, function(component, index){
            this.__componentContainer.removeComponent(component.NAME);
        }._$bind(this));

        // 删除节点
        this.__playerConfig.parent.removeChild(this.__playerConfig.rootNode);
    }    

    // 注册一个外部组件
    // Player.resgistComponent = function(_component){
        
    // }

    // 返回结果可注入给其他文件
    return Player;
});
