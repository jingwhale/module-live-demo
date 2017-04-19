/**
 * --------------------mobile相关的util---------------------
 *
 * @module  mobileUtil
 * @version  1.0
 * @author   hzcaohuanhuan(hzcaohuanhuan@corp.netease.com)
 * @path     eutil/mobileUtil
 * --------------------------------------------------------
 */
NEJ.define(['./adapter/nej.js', './versionUtil.js'], function(_adapter, _versionUtil){

    var _module = {},
        g = (function(){return this;})();
    /**
     * 判断是否是webView显示, 用来跳转到相应app页面
     *
     *  @study
     *  NetEaseEdu (aphone;study; *.*.*; channel=***; )
     *  NetEaseEdu (apad;study; *.*.*; channel=***; )
     *  NetEaseEdu (iphone:study: *.*.*; channel=appstore; )
     *  NetEaseEdu (ipad:study: *.*.*; channel=appstore; )
     *
     *  @mooc
     *  NetEaseEdu (aphone; EDUMOOC; %s; channel=%s; imei=%s)
     *  Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13B143 EDUMOOC/1.1.3
     *
     *  @k12
     *  NetEaseEdu (aphone;k12; *.*.*; channel=***; )
     *  NetEaseEdu (iphone:k12: *.*.*; channel=appstore; )
     *
     * @enterprise
     *  NetEaseEdu.*study-enterprise:(.*);channel=(.*)  iphone
     *  NetEaseEdu.*study-enterprise; (.*); channel=(.*) android
     */

    var _androidWebView = new RegExp("NetEaseEdu.*study; (.*); channel=(.*)",'i'),
        _androidEnterpriseWebView = new RegExp("NetEaseEdu.*study-enterprise; (.*); channel=(.*)",'i'), //企业
        _iosWebView = new RegExp("NetEaseEdu.*study:(.*);channel=(.*)",'i'),
        _iosEnterpriseWebView = new RegExp("NetEaseEdu.*study-enterprise:(.*);channel=(.*)",'i'), //企业
        _moocAndroidWebView = new RegExp("NetEaseEdu.*EDUMOOC; (.*); channel=(.*)",'i'),
        _moocIosWebView= new RegExp(".*EDUMOOC\/(.*)",'i'),
        _K12AndroidWebView = new RegExp("NetEaseEdu.*k12; (.*); channel=(.*)",'i'),
        _k12IosWebView = new RegExp("NetEaseEdu.*k12:(.*);channel=(.*)",'i'),
        _useragent = g.navigator.userAgent,
        ctrlDMobile = g.isMobilePhone;

    /**
     * 获取userAgnet
     * @method _$getUserAgent
     * @param {Void}
     * @return {String} useragent
     */
    /* istanbul ignore next */
    _module._$getUserAgent = function(){
        return _useragent;
    };


    /**
     * 判断是否安卓study WebView
     * @method _$isAndroidWebView
     * @param {Void}
     * @return {Array | null}
     */
    _module._$isAndroidWebView = function(){
        var _useragent = _module._$getUserAgent();
        return _useragent.match(_androidWebView);
    };

    /**
     * 判断是否ios study WebView
     * @method _$isIosWebView
     * @param {Void}
     * @return {Array | null}
     */
    _module._$isIosWebView = function(){
        var _useragent = _module._$getUserAgent();
        return _useragent.match(_iosWebView);
    };


    /**
     * 判断是否android  study enterprise WebView
     * @method _$isAndroidEnterpriseWebView
     * @param {Void}
     * @return {Array | null}
     */
    _module._$isAndroidEnterpriseWebView = function(){
        var _useragent = _module._$getUserAgent();
        return _useragent.match(_androidEnterpriseWebView);
    }



    /**
     * 判断是否ios study enterprise WebView
     * @method _$isIosEnterpriseWebView
     * @param {Void}
     * @return {Array | null}
     */
    _module._$isIosEnterpriseWebView = function(){
        var _useragent = _module._$getUserAgent();
        return _useragent.match(_iosEnterpriseWebView);
    }

    /**
     * 判断是否安卓mocc webView
     * @method _$isAndroidMoocWebView
     * @param {Void}
     * @return {Arrya| null}
     */
    _module._$isAndroidMoocWebView = function(){
        var _useragent = _module._$getUserAgent();
        return _useragent.match(_moocAndroidWebView);
    };

    /**
     * 判断是否IOS mooc webView
     * @method _$isIosMoocWebView
     * @param {Void}
     * @return {Array | null}
     */
    _module._$isIosMoocWebView = function(){
        var _useragent = _module._$getUserAgent();
        return _useragent.match(_moocIosWebView);
    };

    /**
     * 判断是否android k12 webView
     * @method _$isAndroidK12webView
     * @param {Void}
     * @return {Array | null}
     */
    _module._$isAndroidK12webView = function () {
        var _useragent = _module._$getUserAgent();
        return _useragent.match(_K12AndroidWebView);
    };

    /**
     * 判断是否ios k12 webView
     * @method _$isIosK12webView
     * @param {Void}
     * @return {Array | null}
     */
    _module._$isIosK12webView = function () {
        var _useragent = _module._$getUserAgent();
        return _useragent.match(_k12IosWebView);
    };

    /**
     * 判断是否k12 webView
     * @method _$isK12webView
     * @param {Void}
     * @return {Array | null}
     */
    _module._$isK12webView = function () {
        return _module._$isAndroidK12webView() || _module._$isIosK12webView();
    };

    /**
     * 判断是否study webView
     * @method _$isStudywebView
     * @param {Void}
     * @return {Array | null}
     */
    _module._$isStudywebView = function () {
        return _module._$isAndroidWebView() || _module._$isIosWebView();
    };

    /**
     * 判断是否mooc webView
     * @method _$isMoocwebView
     * @param {Void}
     * @return {Array | null}
     */
    _module._$isMoocwebView = function () {
        return _module._$isAndroidMoocWebView() || _module._$isIosMoocWebView();
    };

    /**
     * 判断是否企业云 webView
     * @method _$isEnterprisewebView
     * @param {Void}
     * @return {Array | null}
     */
    _module._$isEnterprisewebView = function () {
        return _module._$isAndroidEnterpriseWebView() || _module._$isIosEnterpriseWebView();
    };


    /**
     * 判断是否WebView
     * @method _$isWebView
     * @param {Void}
     * @return {Boolean}
     */
    _module._$isWebView = function(){
        return !!(_module._$isK12webView() || _module._$isStudywebView() || _module._$isMoocwebView() || _module._$isEnterprisewebView());
    };

    /**
     * 判断是否WebView 且支持jsbridge 唤醒app登陆
     * @method _$isWebViewSupportJB
     * @param {Void}
     * @return {Boolean}
     */
    _module._$isWebViewSupportJB = function(){
        var _isAWV = _module._$isAndroidWebView(),
            _isIWV = _module._$isIosWebView(),
            _isMoocAWV = _module._$isAndroidMoocWebView(),
            _isMoocIWV = _module._$isIosMoocWebView();

        if(_isAWV || _isIWV || _isMoocAWV || _isMoocIWV){
            if(_isAWV != null){
                return (_versionUtil._$versionCompare(_isAWV[1], '2.0.0') >= 0); //study android 2.0.0版本
            }else if(_isIWV != null){
                return (_versionUtil._$versionCompare(_isIWV[1], '3.0.0') >= 0); //study iOS 3.0.0版本
            }else if(_isMoocAWV != null){
                return (_versionUtil._$versionCompare(_isMoocAWV[1], '1.2.2') >= 0); //mooc android 1.2.2版本
            }else if(_isMoocIWV != null){
                return (_versionUtil._$versionCompare(_isMoocIWV[1], '1.1.3') >= 0); //mooc iOS 1.1.3版本
            }
        }else{
            return false;
        }
    };

    /**
     * 判断是否是移动端非适配页面
     * @method _$isMobile
     * @param {Void}
     * @return {Boolean}
     */
    _module._$isMobile = function(){
        /* istanbul ignore if */
        if(_module._$isWap()){
            return !0;
        }

        return _module._$isMobileAll();
    };


    /**
     * 判断是否是该平台
     * @method _$is
     * @param {String} platform
     * @return {Boolean} 是否是该平台
     */
    _module._$is = function(_platform){
        var regx = new RegExp('('+_platform+')','ig'),
            _useragent = _module._$getUserAgent();
        return regx.test(_useragent);
    };

    /**
     * 判断是否是移动端
     * @method _$isMobileAll
     * @param {Void}
     * @return {Boolean}
     */
    _module._$isMobileAll = function(){
        var _useragent = _module._$getUserAgent(),
            _regx = new RegExp('(iPhone|iPod|Android|BlackBerry|mobile|Windows Phone)','ig');
        //return _useragent.match(/(iPhone|iPod|Android|BlackBerry|mobile|Windows Phone)/);
        return _regx.test(_useragent);
    };

    /**
     * 判断是否是Ipad端
     * @method _$isIpad
     * @param {Void}
     * @return {Boolean}
     */
    _module._$isIpad = function(){
        return _module._$is('iPad');
    };

    /**
     * 判断是否是iphone端
     * @method _$isIphone
     * @param {Void}
     * @return {Boolean}
     */
    _module._$isIphone = function(){
        var _useragent = _module._$getUserAgent();
        return _useragent.indexOf('iPhone') > -1 ;
    };

    /**
     * 判断是否是android端
     * @method _$isAndroid
     * @param {Void}
     * @return {Boolean}
     */
    _module._$isAndroid = function(){
        var _useragent = _module._$getUserAgent();
        return _useragent.indexOf('Android') > -1 || _useragent.indexOf('Adr') > -1 ;
    };

    /**
     * 判断是否是移动端适配页面
     * @method _$isWap
     * @param {Void}
     * @return {Boolean} 是否有ctrlMobile
     */
    _module._$isWap = function(){
        /* istanbul ignore next */
        return (ctrlDMobile == 'true');
    };

    /**
     * 判断是否是微信打开
     * @method _$isWeixin
     * @param {Void}
     * @return {Boolean}
     */
    _module._$isWeixin = function(){
        return _module._$is('micromessenger');
    };

    /**
     * 获取ios的版本号
     * @method _$getIosVersion
     * @param {Void}
     * @return {Number} iosVersion 获取的版本号，如 8，9，10等，未获取到版本号返回0
     * @author  hzchenbo2014
     */
    _module._$getIosVersion = function(){
        var agent = navigator.userAgent.toLowerCase(),
            version = 0,
            regStr_saf = /os [\d._]*/gi ,
            verinfo = agent.match(regStr_saf) ;
        if(agent.indexOf("like mac os x") > 0){
            version = (verinfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");
        }
        return parseInt(version, 10);
    };

    /**
     * 打开移动端页面
     *
     * @deprecated
     * @method _$openMobilePage
     * @param {Void}
     */
    /* istanbul ignore next */
    _module._$openMobilePage = function(param, callback){
        var _lookUrl = '';
        if (!_module.isWebView()) {
            return;
        }

        if(_module._$is('android')){
            if(!!param.lessonId){
                //android打开课时直接学习
                _lookUrl = 'yktaphone://open.lesson.ykt/'+param.courseId+'_'+param.lessonId;
            }else{
                //android打开课程
                _lookUrl = 'yktaphone://open.course.ykt/'+param.courseId;
            }
        }else{
            if(!!param.lessonId){
                //ios打开课时直接学习
                _lookUrl = 'yktiphone://type=4-&-content='+param.courseId+'_'+param.lessonId;
            }else{
                //ios打开课程
                _lookUrl = 'yktiphone://type=0-&-content='+param.courseId;
            }
        }

        var _frame = document.createElement("iframe");
        _frame.setAttribute("style", "display:none;width:0;height:0;position: absolute;top:0;left:0;border:0;height:0;width:0;");
        _frame.src = _lookUrl;
        document.body.appendChild(_frame);
    };

    /**
     * 唤起app，如果失败去下载
     * 微信打开，去中间页，提示用浏览器打开
     * iphone，不论是否唤起，都有下一步操作，跳转到下载页中间页，传_type = fromCallApp
     * android,唤起app，失败跳转到下载页中间页
     *
     * @deprecated
     * @author hzchenbo2014
     * @method _$callAppDownload
     * @param {Void}
     */
    /* istanbul ignore next */
    _module._$callAppDownload = function(_type , _param){
        /* istanbul ignore next */
        var _openUrl = '';
        _param = _param || {};

        /* istanbul ignore next */
        if(_module._$is('android')){
            if(!!_param.termId && !!_param.courseId){
                //android打开课时直接学习
                _openUrl = 'yktaphone://open.course.yoc/'+_param.courseId+'_'+_param.termId;
            }else if(!!_param.courseId){
                //android打开课程
                _openUrl = 'yktaphone://open.course.ykt/'+_param.courseId;
            }else{
                _openUrl = "yktaphone://launch.app";
            }
        }else{
            if(!!_param.termId && !!_param.courseId){
                //ios打开课时直接学习
                _openUrl = 'yktiphone://type=6-&-content='+_param.courseId+'_'+_param.termId;
            }else if(!!_param.courseId){
                //ios打开课程
                _openUrl = 'yktiphone://type=0-&-content='+_param.courseId;
            }else{
                _openUrl = "yktiphone://";
            }
        }

        if(_module._$isWeixin()){
            window.location.href = g.callAppDownloadHref+ "?source=fromWeixin&courseId=" + (_param.courseId || '') + "&termId=" + (_param.termId || '');
        }else if(_module._$is('iphone')){
            //ios9以下用iframe方式，ios9用openAppByForm
            if(_module._$getIosVersion() > 8){
                //window.location.href = _openUrl;
                this._$openAppByForm(_openUrl);
            }else{
                this._$openAppByIframe(_openUrl);
            }
            if(_type == "fromCallApp"){
                setTimeout(function(){
                    window.location.href = g.callAppDownloadHref+ "?source=fromCallApp&courseId=" + (_param.courseId || '') + "&termId=" + (_param.termId || '');
                },2000);
                return;
            }
        }else if(_module._$is('android')){
            this._$openAppByIframe(_openUrl);
        }

        // 超时未打开则跳转到下载页面
        setTimeout(function(){
            window.location.href = g.appDownloadHref + "?from=mobileTopbar";
        },2000);
    };


    /**
     * app 支付唤起（common）
     *
     *
     * @param {object} _options
     * @param {object} _options.productType
     * @param {object} _options.productId
     * @param {object} _options.ids 购物车下单
     * @param {object} cb 回掉函数
     *
     * @return {boolean} 是否支持该种方式
     */
    /* istanbul ignore next */
    _module._$callPayApp = function(_options, cb){
        /* istanbul ignore next */
        if(!!_module._$isWebViewSupportJB() && !!g.YixinJSBridge){

            //调用JSbridge唤醒Native
            g.YixinJSBridge.call('toPay',{
                'productType': _options.productType || 0,
                'productId': _options.productId || 0,
                'ids' : _options.ids || []
            }, function(e){
                //成功
                cb && cb(e);
            });

            return true;
        }
        return false;
    };

    /**
     * app 唤起分享
     *
     * @param {object} _options
     * @param {String} _options.title 分享标题
     * @param {String} _options.description 分享的描述
     * @param {String} _options.pic 分享图片的链接
     * @param {String} _options.type=1
     * @param {object} _options.data
     * @param {String} _options.data.url 分享页面的链接
     * @param {String} _options.data.courseId 课程ID (可以不填)
     * @param {String} _options.data.weiboDesc 微博分享描述
     *
     * @return {boolean} 是否支持该种方式
     */
    /* istanbul ignore next */
    _module._$callShareApp = function(_options, cb){
        if(!!_module._$isWebViewSupportJB() && !!g.YixinJSBridge){
            _options.type = _options.type || 1;

            //调用JSbridge唤醒Native
            g.YixinJSBridge.call('share', _options, function(e){
                window.alert("分享成功")
                //成功
                cb && cb(e);
            });

            return true;
        }

        return false;
    };

    /**
     * 微信设置分享朋友圈内容, 以及app webview 的分享
     *
     * @param {object} share
     * @param {String} share.title
     * @param {String} share.url
     * @param {String} share.description
     * @param {String} share.pic
     */
    /* istanbul ignore next */
    _module._$setThirdShare = function(share){
        var wx = g.wx,
            defaultShareImg = "http://img2.ph.126.net/rqkJ8avE5_3Dn1l4TtnYDw==/6630541099630412039.png",
            title = document.title,
            href = document.location.href;

        if(_module._$isWeixin() && wx){
            /*分享到朋友圈*/
            wx.onMenuShareTimeline({
                title: share.title || title, /* 分享标题*/
                link: share.url || href, /* 分享链接*/
                imgUrl: share.pic || defaultShareImg, /* 分享图标*/
                success: function () {
                    /* 用户确认分享后执行的回调函数*/
                },
                cancel: function () {
                    /* 用户取消分享后执行的回调函数*/
                }
            });
            /*发送给朋友*/
            wx.onMenuShareAppMessage({
                title: share.title || title, /* 分享标题*/
                desc: share.description || '', /* 分享描述*/
                link: share.url || href, /* 分享链接*/
                imgUrl: share.pic || defaultShareImg, /* 分享图标*/
                type: '', /* 分享类型,music、video或link，不填默认为link*/
                dataUrl: '', /* 如果type是music或video，则要提供数据链接，默认为空*/
                success: function () {
                    /* 用户确认分享后执行的回调函数*/
                },
                cancel: function () {
                    /* 用户取消分享后执行的回调函数*/
                }
            });
        }else{
            /** 给app塞的分享数据 */
            g.appShareData = {
                title : share.title || title,
                description : share.description || '',
                pic : share.pic || defaultShareImg,
                weiboDesc : share.description || '',
                weiboPic : share.pic || defaultShareImg,
                url : share.url || href,
                type : 1
            };

            // 易信的分享
            g.shareData = {
                "imgUrl": share.pic || defaultShareImg,
                "timeLineLink": share.url || href,
                "sendFriendLink": share.url || href,
                "weiboLink": share.url || href,
                "tTitle": share.title || title,
                "tContent":  share.description || '',
                "fTitle": share.title || title,
                "fContent": share.description || '',
                "wContent":  share.description || ''
            };
        }
    };

    return _module;
});