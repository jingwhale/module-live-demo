/**
 * LivePc 模块实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <args.author@corp.netease.com>
 * @module   pool/module-live/src/live/index
 */
NEJ.define([
    'base/util',
    'base/klass',
    'base/element',
    'pool/module-base/src/base',
    'pool/cache-base/src/setting',
    'text!./module.htm',
    '../component/live-pc-player/ui.js',
    '../component/live-pc-chat/ui.js',
    'pool/cache-live/src/live/cache',
    '../constant.js'
],function(
    u,
    k,
    e,
    m,
    s,
    html,
    LivePcPlayer,
    LivePcChat,
    LiveCache,
    liveConstant,
    exports, pro
){
    /**
     * LivePc 模块
     *
     * @class   module:pool/module-live/src/live-pc/module.LivePc
     * @extends module:pool/module-base/src/base.Module
     *
     * @param {Object} options - 模块构造参数
     */
    var LivePc = k._$klass();
    pro = LivePc._$extend(m.Module);

    /**
     * 构建模块，这部分主要完成以下逻辑：
     *
     * * 构建模块主体DOM树结构
     * * 初始化使用的依赖组件的配置信息（如输入参数、回调事件等）
     * * 一次性添加的事件（即模块隐藏时不回收的事件）
     * * 后续用到的节点缓存（注意如果第三方组件配置信息里已经缓存的节点不需要再额外用变量缓存节点）
     *
     * 在UMI配置时的 config 配置直接做为 _doBuild 的输入参数
     *
     * ```javascript
     * {
     *      "/m/module": {
     *          "module": "/path/to/module/index.html",
     *          "config": {
     *              "a": "aaaa",
     *              "b": "bbbbbb"
     *          }
     *      }
     * }
     * ```
     *
     * @protected
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_doBuild
     * @param   {Object} options - 构建参数，模块UMI配置时config输入参数
     * @returns {void}
     */
    pro._doBuild = function (options) {
        this.__super(html, options);

        // 模块DOM结构根节点为 this._body

        // 通过 _$addEvent 做一次性添加的事件
        // v._$addEvent(
        // 	  node,'click',
        // 	  this._doSomething._$bind(this)
        // );

        // 获取模块配置
        this.__livePcSetting = s.get('live-pc');

        // TODO something

    };

    /**
     * 显示模块业务逻辑实现，这部分主要完成以下逻辑：
     *
     * * 组装/分配第三方组件，形成完整的模块结构
     * * 添加模块生命周期内DOM事件（模块隐藏时回收）
     *
     * @protected
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_onShow
     * @param   {Object} options        - 显示参数
     * @param   {String} options.target - 目标 UMI
     * @param   {String} options.source - 原始 UMI
     * @param   {String} options.href   - 完整地址
     * @param   {Object} options.param  - 模块切入查询参数对象 a=aa&b=bb  -> {a:"aa",b:"bb"}
     * @param   {Array}  options.prest  - REST地址模块之后信息做为参数 如地址 /a/b/c/d 对应的模块为 /a/b 则此参数为 ["c","d"]
     * @returns {void}
     */
    pro._onShow = function (options) {
        this.__super(options);

        /*
            模块需要的数据
            liveContentId  直播id
            meetId 会议id
            liveStreamUrl 直播流地址，如果不提供可以通过接口获取
            liveChannelId 直播频道id，如果不提供可以通过接口获取
            playBackVideoData  回放数据
            appKey  云信key
            token   云信token
            account 用户账号
            chatroomId  房间id
            lectorAccount 讲师账号
         */

        // 合并数据和配置，兼容老版本
        this.__options = u._$merge({}, options, this.__livePcSetting);

        // 默认都是非互动模式
        if(this.__options.cdnMode === undefined){
            this.__options.cdnMode = liveConstant.LIVE_CDN_MODE;
        }

        if (!this.__options.liveContentId || !this.__options.meetId) {
            this._showDeleted();
            return;
        }

        this._cacheIns = LiveCache.Live._$allocate({
            'ongetChannelStatus' : this._onCheckStreamStatus._$bind(this) // 频道检查回调
        });
        
        this._genLivePcPlayer();

        // 如果是互动模式或者回放则不创建讨论区，现在默认都是非互动模式
        if (this.__options.cdnMode != liveConstant.LIVE_CDN_MODE || this.__options.playBackVideoData) {
            e._$addClassName(e._$get('j-liveplayer-wrap'), 'md-live-pc_player-noim');
        }else{
            e._$delClassName(e._$get('j-liveplayer-wrap'), 'md-live-pc_player-noim');

            // chat
            this._genLivePcChat();
        }

    };

    /**
     * 创建直播或者回放播放器
     *
     * @private
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_genLivePcPlayer
     */
    pro._genLivePcPlayer = function(){
        // 直播ui测试
        this.__livePcPlayer = new LivePcPlayer({
            data : {
                liveContentId : this.__options.liveContentId,
                meetId : this.__options.meetId,
                liveStreamUrl : this.__options.liveStreamUrl,
                playBackVideoData : this.__options.playBackVideoData // 回放视频数据
            }
        }).$inject('#j-liveplayer-wrap');

        this.__livePcPlayer.$on('updateLiveInfo', this._updateLiveInfo._$bind(this));
        this.__livePcPlayer.$on('getStraamUrl', this._getStreamUrl._$bind(this));
        this.__livePcPlayer.$on('checkStreamStatus', this._checkStreamStatus._$bind(this));

        this.__livePcPlayer.$on('PlayBackPlay', this.onPlayBackPlay._$bind(this));
        this.__livePcPlayer.$on('PlayBackPauseClick', this.onPlayBackPauseClick._$bind(this));
        this.__livePcPlayer.$on('PlayBackSeek', this.onPlayBackSeek._$bind(this));
        this.__livePcPlayer.$on('PlayBackEnd', this.onPlayBackEnd._$bind(this));
    }

    /**
     * 创建聊天室
     *
     * @private
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_genLivePcChat
     */
    pro._genLivePcChat = function(){
        if(this.__livePcChat){
            this.__livePcChat.destroy();
        }
        this.__livePcChat = new LivePcChat({
            data: {
                appKey: this.__options.appKey,
                account: this.__options.account,
                chatroomId: this.__options.chatroomId,
                token: this.__options.token,
                isSendMsgCreate: this.__livePcSetting.isSendMsgCreate,
                lectorAccount: this.__options.lectorAccount,
                isUserLogin: this.__livePcSetting.isUserLogin,
                goToLogin: this.__livePcSetting.goToLogin,
                isMemberNumFromRequest: this.__livePcSetting.isMemberNumFromRequest
            }
        }).$inject('#j-livechat-wrap');

        // 获取聊天室地址
        this.__livePcChat.$on('getChatroomAddress', this._getChatroomAddress._$bind(this));
        // 获取聊天室当前在线人数
        this.__livePcChat.$on('getChatroomCurrentNum', this._getChatroomCurrentNum._$bind(this));
    }

    /**
     * 更新直播数据
     *
     * @private
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_updateLiveInfo
     */
    pro._updateLiveInfo = function(){
        this._cacheIns._$getLiveInfo({
            data : {
                liveContentId : this.__options.liveContentId,
                meetId : this.__options.meetId
            },
            onload : function(data){
                if (data.result !== undefined) { // cache有问题，当接口返回result为null时，cache会返回整个原始数据而不是result
                    data = data.result;
                }

                if (data) {
                    this.__livePcPlayer.updateLiveInfo(data); // 更新

                    // 如果是正在直播中，可以处理一些需求，比如计费
                    if(this.liveInfoUpdate){
                        this.liveInfoUpdate(data);
                    }
                }else{
                    this._showDeleted();
                }

            }._$bind(this)
        });
    }

    /**
     * 获取直播拉流地址和频道信息
     *
     * @private
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_getStreamUrl
     */
    pro._getStreamUrl = function(){
        this._cacheIns._$getStraamUrl({
            data : {
                liveContentId : this.__options.liveContentId,
                isWeb: "1"
            },
            onload : function(data) {
                this.__options.liveChannelId = data.liveChannelId; // 频道id

                this.__livePcPlayer.onGetStramUrl(data); // 更新拉流地址
            }._$bind(this)
        });
    };

    /**
     * 检查频道推流状态
     *
     * @private
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_checkStreamStatus
     */
    pro._checkStreamStatus = function(){
        if (this.__options.liveChannelId) { // 之前接口可能没有提供频道id
            // 需要延迟10秒后提示，播放器需要显示loading
            setTimeout(function(){
                this._cacheIns._$getChannelStatus(this.__options.liveChannelId);
            }._$bind(this), 10 * 1000); 
        };
    }

    /**
     * 检查频道推流状态回调
     *
     * @private
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_onCheckStreamStatus
     */
    pro._onCheckStreamStatus = function(data){
        if (this.__livePcPlayer) {
            if (data == LiveCache.LIVE_CHANNEL_PUSHING || data == LiveCache.LIVE_CHANNEL_RECORDING) {
                this.__livePcPlayer.showLiveStreamError();   
            }else if(data == LiveCache.LIVE_CHANNEL_IDLE){
                this.__livePcPlayer.showLiveInIdle();
            }

            // 其他情况在直播过程中不应该出现
        }

    };

    /**
     * 获取聊天室地址
     *
     * @private
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_getChatroomAddress
     */
    pro._getChatroomAddress = function(){
        this._cacheIns._$getChatAddress({
            data : {
                imRoomId: parseInt(this.__options.chatroomId),
                account:  this.__options.account
            },
            onload : function(data) {
                this.__livePcChat.onGetChatroomAddress(data);
            }._$bind(this),
            onError : function(evt){
                this.__livePcChat.onGetChatroomAddressError(evt);
            }._$bind(this)
        });
    };

    /**
     * 获取聊天室当前在线人数
     *
     * @private
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_getChatCurrentMemberNum
     */
    pro._getChatroomCurrentNum = function () {
        this._cacheIns._$getChatCurrentMemberNum({
            data : {
                liveContentId: this.__options.liveContentId
            },
            onload : function(data) {
                this.__livePcChat.onGetChatroomCurrentNum(data);
            }._$bind(this)
        });
    };

    /**
     * 直播轮询处理，子类继承实现
     *
     * @protected
     * @method  module:pool/module-live/src/live-pc/module.LivePc#liveInfoUpdate
     */
    pro.liveInfoUpdate = function(data){

    };

    /**
     * 回放播放事件处理，子类继承实现
     *
     * @protected
     * @method  module:pool/module-live/src/live-pc/module.LivePc#onPlayBackPlay
     */
    pro.onPlayBackPlay = function(){

    };

    /**
     * 回放暂停点击事件处理，子类继承实现
     *
     * @protected
     * @method  module:pool/module-live/src/live-pc/module.LivePc#onPlayBackPauseClick
     */
    pro.onPlayBackPauseClick = function(){

    };

    /**
     * 回放完成事件处理，子类继承实现
     *
     * @protected
     * @method  module:pool/module-live/src/live-pc/module.LivePc#onPlayBackEnd
     */
    pro.onPlayBackEnd = function(){

    };

    /**
     * 回放seek事件，子类继承实现
     *
     * @protected
     * @method  module:pool/module-live/src/live-pc/module.LivePc#onPlayBackSeek
     */
    pro.onPlayBackSeek = function(){

    };

    /**
     * 显示直播已删除
     *
     * @private
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_showDeleted
     */
    pro._showDeleted = function(data){
        if(this.__livePcChat){
            this.__livePcChat.destroy();
        }
        if(this.__livePcPlayer){
            this.__livePcPlayer.destroy();
        }

        e._$getByClassName(this.__body, 'j-deleted')[0].style.display = 'block';
    };

    /**
     * 刷先模块业务逻辑实现，这部分主要完成以下逻辑：
     *
     * * 根据输入信息加载数据
     * * 需要数据才能构造的第三方组件分配/组装
     *
     * @protected
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_onRefresh
     * @param   {Object} options        - 刷新参数
     * @param   {String} options.target - 目标 UMI
     * @param   {String} options.source - 原始 UMI
     * @param   {String} options.href   - 完整地址
     * @param   {Object} options.param  - 模块切入查询参数对象 a=aa&b=bb  -> {a:"aa",b:"bb"}
     * @param   {Array}  options.prest  - REST地址模块之后信息做为参数 如地址 /a/b/c/d 对应的模块为 /a/b 则此参数为 ["c","d"]
     * @returns {void}
     */
    pro._onRefresh = function (options) {
        this.__super(options);
        // TODO something
    };

    /**
     * 隐藏模块业务逻辑实现，这部分主要完成以下逻辑：
     *
     * * 回收所有分配的NEJ组件（基类已处理）
     * * 回收所有分配的Regular组件（基类已处理）
     * * 回收所有添加的生命周期事件（基类已处理）
     * * 确保onhide之后的组件状态同onshow之前一致
     *
     * @protected
     * @method  module:pool/module-live/src/live-pc/module.LivePc#_onHide
     * @returns {void}
     */
    pro._onHide = function () {
        // TODO something
        this.__super();

        this._cacheIns && this._cacheIns._$recycle();
    };

    // 扩展暴露接口
    /**
     * 构建模块
     *
     * @method module:pool/module-live/src/live-pc/module.build
     * @see   {@link module:pool/module-base/src/base.build}
     */
    exports.build  = m.build._$bind(m, LivePc);
    /**
     * 注册模块
     *
     * @method module:pool/module-live/src/live-pc/module.regist
     * @see   {@link module:pool/module-base/src/base.regist}
     */
    exports.regist = m.regist._$bind2(m, LivePc);
    exports.LivePc = LivePc;
});
