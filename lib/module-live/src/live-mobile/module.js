/**
 * LiveMobile 模块实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <args.author@corp.netease.com>
 * @module   pool/module-live/src/live/index
 */
NEJ.define([
    'base/element',
    'base/klass',
    'util/template/tpl',
    'pool/module-base/src/base',
    'pool/cache-base/src/setting',
    'text!./module.htm',
    'pool/cache-live/src/live/cache',
    '../../src/component/live-mobile-player/ui.js',
    '../../src/component/live-mobile-chat/ui.js'
],function(
    e,
    k,
    t,
    m,
    s,
    html,
    LiveCache,
    LiveMobilePlayer,
    LiveMobileChat,
    exports, pro
){
    // 获取模块配置
    var _liveMobileSetting = s.get('live-mobile');

    /**
     * LiveMobile 模块
     *
     * @class   module:pool/module-live/src/live/index.LiveMobile
     * @extends module:pool/module-base/src/base.Module
     *
     * @param {Object} options - 模块构造参数
     */
    var LiveMobile = k._$klass();
    pro = LiveMobile._$extend(m.Module);

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
     * @method  module:pool/module-live/src/live/index.LiveMobile#_doBuild
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

        // TODO something
        this._cacheIns = LiveCache.Live._$allocate();
    };

    /**
     * 显示模块业务逻辑实现，这部分主要完成以下逻辑：
     *
     * * 组装/分配第三方组件，形成完整的模块结构
     * * 添加模块生命周期内DOM事件（模块隐藏时回收）
     *
     * @protected
     * @method  module:pool/module-live/src/live/index.LiveMobile#_onShow
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

        // 通过 this.__doInitDomEvent 做生命周期内的事件添加
        // this.__doInitDomEvent([
        // 	  node,'click',
        // 	  this._doSomething._$bind(this)
        // ]);

        if (!_liveMobileSetting.liveContentId || !_liveMobileSetting.meetId) {
            this._showDeleted();
            return;
        }

        // 直播ui测试
        this.__liveMobilePlayer = new LiveMobilePlayer({
            data : {
                liveContentId : _liveMobileSetting.liveContentId,
                meetId : _liveMobileSetting.meetId,
                liveStreamUrl : _liveMobileSetting.liveStreamUrl
            }
        }).$inject('#j-liveplayer-wrap');
        // 绑定直播事件
        this.__liveMobilePlayer.$on('updateLiveInfo', this._updateLiveInfo._$bind(this));
        this.__liveMobilePlayer.$on('getStraamUrl', this._getStraamUrl._$bind(this));

        // chat
        var chatWrapHeight =  (document.documentElement.clientHeight || document.body.clientHeight) - e._$get('j-liveplayer-wrap').offsetHeight;
        this.__liveMobieChat = new LiveMobileChat({
            data: {
                chatWrapHeight: (chatWrapHeight + 'px') || _liveMobileSetting.chatWrapHeight,
                appKey: _liveMobileSetting.appKey,
                account: _liveMobileSetting.account,
                chatroomId: _liveMobileSetting.chatroomId,
                token: _liveMobileSetting.token,
                isSendMsgCreate: _liveMobileSetting.isSendMsgCreate,
                lectorAccount: _liveMobileSetting.lectorAccount,
                // liveStatus: _liveMobileSetting.liveStatus,
                isUserLogin: _liveMobileSetting.isUserLogin,
                goToLogin: _liveMobileSetting.goToLogin,
                isMemberNumFromRequest: _liveMobileSetting.isMemberNumFromRequest
            }
        }).$inject('#j-livechat-wrap');
        // 获取聊天室地址
        this.__liveMobieChat.$on('getChatroomAddress', this._getChatroomAddress._$bind(this));
        // 获取聊天室当前在线人数
        this.__liveMobieChat.$on('getChatroomCurrentNum', this._getChatroomCurrentNum._$bind(this));
    };

    /**
     * 更新直播数据
     *
     * @private
     * @method  module:pool/module-live/src/live/index.LiveMobile#_updateLiveInfo
     */
    pro._updateLiveInfo = function(){
        this._cacheIns._$getLiveInfo({
            data :{
                liveContentId : _liveMobileSetting.liveContentId,
                meetId : _liveMobileSetting.meetId
            },
            onload : function(data){
                if (data.result !== undefined) { // cache有问题，当接口返回result为null时，cache会返回整个原始数据而不是result
                    data = data.result;
                }

                if (data) {
                    this.__liveMobilePlayer.updateLiveInfo(data); // 更新

                    // 如果是正在直播中，则需要计费
                    if(this.liveInfoUpdate){
                        this.liveInfoUpdate(data);
                    }
                }else{
                    this._showDeleted();
                }

            }._$bind(this)
        });
    };

    /**
     * 获取直播拉流地址
     *
     * @private
     * @method  module:pool/module-live/src/live/index.LiveMobile#_getStraamUrl
     */
    pro._getStraamUrl = function(){
        this._cacheIns._$getStraamUrl({
            data : {
                liveContentId : _liveMobileSetting.liveContentId,
                isWeb: "0" 
            },
            onload : function(data) {
                this.__liveMobilePlayer.onGetStramUrl(data); // 更新拉流地址
            }._$bind(this)
        });
    };


    /**
     * 获取聊天室地址
     *
     * @private
     * @method  module:pool/module-live/src/live/index.LiveMobile#_getChatroomAddress
     */
    pro._getChatroomAddress = function(){
        this._cacheIns._$getChatAddress({
            data : {
                    imRoomId: parseInt(_liveMobileSetting.chatroomId),
                    account:  _liveMobileSetting.account
                },
            onload : function(data) {
                this.__liveMobieChat.onGetChatroomAddress(data);
            }._$bind(this)
        });
    };

    /**
     * 获取聊天室当前在线人数
     *
     * @private
     * @method  module:pool/module-live/src/live/index.LiveMobile#_getChatCurrentMemberNum
     */
    pro._getChatroomCurrentNum = function () {
        this._cacheIns._$getChatCurrentMemberNum({
            data : {
                    liveContentId: _liveMobileSetting.liveContentId
                },
            onload : function(data) {
                this.__liveMobieChat.onGetChatroomCurrentNum(data);
            }._$bind(this)
        });
    };

    /**
     * 直播轮询处理，子类继承实现
     *
     * @protected
     * @method  module:pool/module-live/src/live/index.LiveMobile#liveInfoUpdate
     */
    pro.liveInfoUpdate = function(data){

    };

    /**
     * 显示直播已删除
     *
     * @private
     * @method  module:pool/module-live/src/live/index.LiveMobile#_showDeleted
     */
    pro._showDeleted = function(data){
        if(this.__liveMobieChat){
            this.__liveMobieChat.destroy();
        }
        if(this.__liveMobilePlayer){
            this.__liveMobilePlayer.destroy();
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
     * @method  module:pool/module-live/src/live/index.LiveMobile#_onRefresh
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
     * @method  module:pool/module-live/src/live/index.LiveMobile#_onHide
     * @returns {void}
     */
    pro._onHide = function () {
        // TODO something
        this.__super();
    };

    // 扩展暴露接口
    /**
     * 构建模块
     *
     * @method module:pool/module-live/src/live/index.build
     * @see   {@link module:pool/module-base/src/base.build}
     */
    exports.build  = m.build._$bind(m,LiveMobile);
    /**
     * 注册模块
     *
     * @method module:pool/module-live/src/live/index.regist
     * @see   {@link module:pool/module-base/src/base.regist}
     */
    exports.regist = m.regist._$bind2(m,LiveMobile);


    exports.LiveMobile = LiveMobile;
});
