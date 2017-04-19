/**
* 视频数据类
*/
NEJ.define([
    '../base/base.js',
    '../base/component.js',
    '../notification/notificationDefine.js',
    '../model/constant.js',
    'util/ajax/xdr',
    'pool/edu-front-util/src/mobileUtil'
], function(
    _base,
    _component,
    _notificationDefine,
    _constant,
    _xdr,
    _mobileUtil,
    p, o, f, r){

    /*
    *  data 统一的视频数据，部分参数与后台数据结构保持一致，有变更需要双方商定，请勿随意修改！！
    *      包含以下字段，大部分对应后台视频dto
    *          defaultQuality          默认清晰度
    *          flvSdUrl                flash用视频地址
    *          flvHdUrl                flash用视频地址
    *          flvShdUrl               flash用视频地址
    *          mp4SdUrl                h5用视频地址
    *          mp4HdUrl                h5用视频地址
    *          mp4ShdUrl               h5用视频地址          
    *          key                     cdn加密后的key,如果needKeyTimeValidate为true
    *          needKeyTimeValidate     是否进行时间戳校验，true表示前端需要定期发校验请求
    *          playerCollection        二进制值，00值表示两者都不可播放，01表示仅支持flv 10表示仅支持mp4,11表示mp4和flv都支持
    *          isEncrypt               是否加密
    *          clientEncryptKeyVersion 客户端加解密的key的版本1,2,3
    *          encryptionVideoData     视频加密秘钥
    *          mp4Caption              h5字幕
    *          flvCaption              flash字幕
    *          videoImgUrl             视频封面地址
    *          videoId                 视频id
    *          duration                视频时长，直播无效
    *          start                   从哪里开始播放(以秒为单位)，直播无效
    *          adUrl                   片头视频地址，移动端无效
    *          cluPointData            驻点数据, 可能需要外部通过接口获取并传入，直播无效
    *      直播相关字段，在开启直播模式是使用
    *          liveTitle               直播标题
    *          liveStartTime           直播开始时间 
    *          liveEndTime             直播结束时间 
    */
    var MovieData = _base.C();

    MovieData.NAME = 'movieData';

    var _pro = MovieData.extend(_component);

    /**
    * init function
    */
    _pro._init = function(_config){
        this.__super(_config);

        this._config = _config;

        // 封面图片地址
        this.posterUrl = null;
        // 开始播放的时间点
        this.start = 0;
        // 视频总时长
        this.duration = 0;

        // 视频id
        this.videoId = null;

        // 默认清晰度
        this.defaultQuality = 1;

        // 视频item数组
        this.movieItemList = null;
        // 当前选择的视频item
        this.currentMovieItem = null;

        // 驻点数组
        this.cluPointList = null;

        // 字幕文件数据
        this.captionData = null;

        // 片头视频地址
        this.adUrl = null;

        // cdn全部线路信息
        this.cdnSwitchData = null;
        // 当前选择的cdn线路
        this.cdnSwitch = '';


        // 是否获取了cdn线路信息
        this.hasGetCdnSwitchData = false;

        this._checkReadyId = null;

        return this; 
    }

    /**
    * 列出监听的消息
    */
    _pro.listNotificationInterests = function(){
        return [
            _notificationDefine.VIEW_QUALITY,
            _notificationDefine.VIEW_CDN
        ];
    }

    /**
    * 处理消息的方法
    */
    _pro.handleNotification = function(_notificationIns){
        this.__super(_notificationIns);

        switch(_notificationIns.getName()){
            case _notificationDefine.VIEW_QUALITY:
                this._handleViewChangeQuality(_notificationIns.getBody());
                break;
            case _notificationDefine.VIEW_CDN:
                this._handleViewChangeCDN(_notificationIns.getBody());
                break;
        }
    }

    /**
    * 设置新的视频数据
    */
    _pro.setData = function(_data){
        // 发出消息
        this.sendNotification(_notificationDefine.MOVIEDATA_NEW, _data);

        if (!_data.mp4SdUrl && !_data.file) {
            this.sendNotification(_notificationDefine.MOVIEDATA_ERROR, _constant.ERROR_CODE.VIDEO_DATA_ERROR_NO_URL);
            return;
        };

        // 如果是加密视频则报错
        if (_data.isEncrypt) {
            this.sendNotification(_notificationDefine.MOVIEDATA_ERROR, _constant.ERROR_CODE.VIDEO_DATA_ERROR_ENCRYPT);
            return;
        };

        // 预加载和片头的状态
        this.hasDoPreload = false;
        this.hasDoBeforePlay = false;

        // 片头视频地址
        this.adUrl = _data.adUrl;
        // 封面图片地址
        this.posterUrl = _data.videoImgUrl;
        // 开始播放的时间点
        this.start = _data.start || 0;

        // 视频id
        this.videoId = _data.videoId;
        this.duration = _data.duration;

        // 直播信息
        this.liveTitle = _data.liveTitle;
        this.liveStartTime = _data.liveStartTime;
        this.liveEndTime = _data.liveEndTime;

        // 视频地址
        _data.mp4SdUrl = _data.mp4SdUrl || _data.file;

        // 默认清晰度
        this.defaultQuality = _data.defaultQuality || this._config.defaultQuality;

        // 创建item
        this._createMovieItem(_data);

        // 创建字幕
        this._initCaption(_data);

        // 驻点数组
        this.cluPointList = _data.cluPointData;

        // 加载cdn数据
        this._loadCDNData(_data);

        // 检查数据是否准备完毕
        this._checkReadyId = setInterval(this._checkReady._$bind(this), 500);
    }

    /**
    * 检查数据是否准备完毕
    */
    _pro._checkReady = function(){
        // 准备完毕发出消息
        if (this.hasGetCdnSwitchData) {
            clearInterval(this._checkReadyId);

            // 数据完毕，发出消息
            this.sendNotification(_notificationDefine.MOVIEDATA_READY, this);
        };
    }

    /**
    * 创建视频item
    */
    _pro._createMovieItem = function(_data){
        // 视频item数组，重置
        this.movieItemList = [];
        this.currentMovieItem = null;

        if (_data.mp4SdUrl) {
            this.movieItemList.push({
                quality : 1,
                qualityName : '标清',
                urls : [_data.mp4SdUrl] 
            });
        };

        if (_data.mp4HdUrl) {
            this.movieItemList.push({
                quality : 2,
                qualityName : '高清',
                urls : [_data.mp4HdUrl] 
            });
        };

        if (_data.mp4ShdUrl) {
            this.movieItemList.push({
                quality : 3,
                qualityName : '超高清',
                urls : [_data.mp4ShdUrl] 
            });
        };

        // 当前选择的视频item
        for (var i = 0; i < this.movieItemList.length; i++) {
            if(this.movieItemList[i].quality == this.defaultQuality){
                this.currentMovieItem = this.movieItemList[i];
            }
        };

        this.currentMovieItem = this.currentMovieItem || this.movieItemList[0]; // 默认第一个
    }

    /**
    * 加载字幕
    */
    _pro._initCaption = function(_data){
        // 字幕文件数据
        this.captionData = {};

        var ussCaption;

        // h5 web端使用srt，移动端使用vtt。
        // 建议测试一下哪些移动端不支持vtt，那也可以使用srt
        if (!_mobileUtil._$isMobileAll()) {
            ussCaption = _data.mp4Caption;
        }else{
            ussCaption = _data.mobileCaption;
        }

        if (ussCaption && ussCaption.length > 0) {
            this.captionData.hasCaption = true;
        }else{
            this.captionData.hasCaption = false;
        }

        if (this.captionData.hasCaption) {
            this.captionData.data = [];

            for (var i = 0; i < ussCaption.length; i++) {
                var _captionItem = ussCaption[i];

                this.captionData.data.push({
                    name : _captionItem.name,
                    index : _captionItem.index,
                    url : _captionItem.url,
                    lang : _captionItem.name == '中文' ? 'cn' : 'en',
                    isSelect : true
                });
            };
        };
    }

    /**
    * 加载cdn数据
    */
    _pro._loadCDNData = function(_data){
        // 测试
        this._cbloadCDNDataSuccess([
            {"ip":"211.142.22.118","isp":"yd1","ispNmae":"移动一"},
            {"ip":"218.58.206.57","isp":"lt1","ispNmae":"联通一"},
            {"ip":"36.250.240.96","isp":"lt2","ispNmae":"联通二"},
            {"ip":"113.17.140.148","isp":"dx1","ispNmae":"电信一"},
            {"ip":"113.107.112.211","isp":"dx2","ispNmae":"电信二"}
        ]);
        return;


        // 调用应用接口
        var _options = {
            method : 'GET',  
            type : 'json',
            timeout : 5000,
            cookie : false,  
            onload : this._cbloadCDNDataSuccess._$bind(this),
            onerror : this._cbloadCDNDataFail._$bind(this)
        };

        _xdr._$request(_constant.URLMAP.GET_CDN_DATA, _options);
    }

    /**
    * 加载cdn数据成功回调
    */
    _pro._cbloadCDNDataSuccess = function(_data){
        // cdn全部线路信息，一个数组
        if (_data && _data.length > 0) {
            this.cdnSwitchData = _data;

            this._changeCDN(this.cdnSwitch);
        };
         
        this.hasGetCdnSwitchData = true;
    }

    /**
    * 加载cdn数据错误回调
    */
    _pro._cbloadCDNDataFail = function(_data){
        this.hasGetCdnSwitchData = true;
    }

    /**
    * 改变清晰度
    */
    _pro._handleViewChangeQuality = function(_data){
        if (!_data.newData) {
            return;
        };

        for (var i = 0; i < this.movieItemList.length; i++) {
            if(this.movieItemList[i].quality == _data.newData.quality){
                this.currentMovieItem = this.movieItemList[i];
                break;
            }
        };

        // 发出消息
        this.sendNotification(_notificationDefine.MOVIEDATA_CURRENT_ITEM_CHANGE, this);
    }

    /**
    * 改变线路
    */
    _pro._changeCDN = function(_isp){
        var ip = '';
            
        for(var n = 0; n < this.cdnSwitchData.length; n++){
            if(_isp == this.cdnSwitchData[n].isp){
                ip = this.cdnSwitchData[n].ip;
            }
        }
                        
        // 所有视频地址变更，加上cdn节点ip前缀，如果ip参数不存在则恢复所有视频地址
        for(var i = 0; i < this.movieItemList.length; i++){
            for(var j = 0; j < this.movieItemList[i].urls.length; j++){
                var url = this.movieItemList[i].urls[j];
                    
                if(!url){
                    continue;
                }
                    
                if(/^http:\/\/[\d\.]+?\//.test(url)){ // 已经包含ip
                    url = url.replace(/^http:\/\/[\d\.]+?\//, function(){
                        return 'http://' + (ip ? ip + '/' : '');
                    });
                }else{
                    url = url.replace(/^http:\/\//, function(){
                        return 'http://' + (ip ? ip + '/' : '');
                    });
                }
                                        
                this.movieItemList[i].urls[j] = url;
            }
        }
    }

    /**
    * 用户主动改变线路的操作处理
    */
    _pro._handleViewChangeCDN = function(_data){
        this._changeCDN(_data.newData.isp);

        // 保存为当前选择的cdn线路
        this.cdnSwitch = _data;

        // 发出消息
        this.sendNotification(_notificationDefine.MOVIEDATA_CURRENT_CDN_CHANGE, this);
    }

    // 返回结果可注入给其他文件
    return MovieData;
});
