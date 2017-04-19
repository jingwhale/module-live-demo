/**
 * LiveManage 模块实现文件
 *
 * @version  1.0
 * @author   hzyuwei <hzyuwei@corp.netease.com>
 * @module   pool/module-/src/live-manage/module
 */
NEJ.define([
    'base/klass',
    'pool/module-base/src/base',
    'text!./module.htm',
    'lib/base/element',
    'pool/edu-front-util/src/domUtil',
    'pool/cache-live/src/live-manage/cache',
    'pool/component-tabs/src/tabs/tabs_underline/ui',
    '../component/live-manage-balance/ui.js',
    '../component/live-manage-list/ui.js',
    '../component/live-manage-config/ui.js',
    'pool/component-modal/src/modal/ui'
],function(
    k,
    m,
    html,
    e,
    eu,
    LiveManageCache,
    tabsUI,
    liveBalanceUI,
    liveListUI,
    liveConfigUI,
    Modal,
    exports,
    pro
){
    /**
     * LiveManage 模块
     *
     * @class   module:pool/module-/src/live-manage/module.LiveManage
     * @extends module:pool/module-base/src/base.Module
     *
     * @param {Object} options - 模块构造参数
     */
    var LiveManage = k._$klass();
    pro = LiveManage._$extend(m.Module);

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
     * @method  module:pool/module-/src/live-manage/module.LiveManage#_doBuild
     * @param   {Object} options - 构建参数，模块UMI配置时config输入参数
     * @returns {void}
     */
    pro._doBuild = function (options) {
        this.__super(html, options);
        
        // 模块DOM结构根节点为 this._body
        
        // 通过 _$addEvent 做一次性添加的事件
        // v._$addEvent(
        //    node,'click',
        //    this._doSomething._$bind(this)
        // );
        
        // TODO something
    };

    /**
     * 显示模块业务逻辑实现，这部分主要完成以下逻辑：
     * 
     * * 组装/分配第三方组件，形成完整的模块结构
     * * 添加模块生命周期内DOM事件（模块隐藏时回收）
     *
     * @protected
     * @method  module:pool/module-/src/live-manage/module.LiveManage#_onShow
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
        this._tqTipNode = e._$getByClassName(this.__body,'tq-tip')[0];
        eu._$hiddenNode(this._tqTipNode);

        this.liveCache = LiveManageCache.LiveManage._$allocate({
            ongetLiveConfig: this._cbGetLiveConfig._$bind(this),
            ongetAuth: this._cbGetLiveAuth._$bind(this),
        });
        this.liveCache.getAuth();
    };

    /**
     * tab选择
     *
     * @private
     * @method  module:pool/module-/src/live-manage/module.LiveManage#_selectTab
     * @param   {Object} event        - 选择事件  
     * @returns {void}
     */

    pro._selectTab = function(event){
        this._liveListUI.getListByStatus(event.selected.id);
        this._tabsUI.data.selected= event.selected;
        this._tabsUI.$update();
    };

    /**
     * tab跳转
     *
     * @private
     * @method  module:pool/module-/src/live-manage/module.LiveManage#_selectTabAuto
     * @param   {Object} status        - 5 未直播  0 直播中  40 已结束  
     * @returns {void}
     */

    pro._selectTabAuto = function(status){
        if(status == LiveManageCache.LIVE_LIST_FILTER_STATUS_NOTSTART){
            var _tabIndex = 0;
        }else if(status == LiveManageCache.LIVE_LIST_FILTER_STATUS_PLAYING){
            var _tabIndex = 1;
        }else if(status == LiveManageCache.LIVE_LIST_FILTER_STATUS_END){
            var _tabIndex = 2;
        }
        this._tabsUI.select(this._tabsUI.data.tabs[_tabIndex]);
    };

    /**
     * 获取直播相关配置回调
     *
     * @private
     * @method  module:pool/module-/src/live-manage/module.LiveManage#_cbGetLiveConfig
     * @param   {Object} data        - 接口返回数据  
     * @returns {void}
     */

    pro._cbGetLiveConfig = function(data){
        window.rtmpAddr = data.rtmpAddr;
        if(document.getElementById("j-live-config-wrap")){
            this._liveConfigUI = new liveConfigUI({
                data: data
            }).$inject('#j-live-config-wrap');
        } 

        //如果是唐桥直播，显示tq-tip       
        if(data.liveMethodType == LiveManageCache.LIVE_METHOD_TYPE_TANGQIAO){         
            eu._$showNode(this._tqTipNode);
        }else{
            eu._$hiddenNode(this._tqTipNode);
        }
    };

    /**
     * 获取直播权限及余额回调
     *
     * @private
     * @method  module:pool/module-/src/live-manage/module.LiveManage#_cbGetLiveAuth
     * @param   {Object} data        - 接口返回数据  
     * @param   {Object} data.enable - Number,管理员（禁用0  正常1  未开通2）讲师（禁用10 正常11  未开通12）  
     * @returns {void}
     */

    pro._cbGetLiveAuth = function(data){
        if(!!data){
            this._liveBalanceUI = new liveBalanceUI({
                data: {
                    enable: data.enable,
                    personHour: data.personHour
                }
            }).$inject('.j-live-balance-wrap');

            if(data.enable%10 != 2){
                this.liveCache.getLiveConfig(this._getOsType());
                this._initTabAndList();
            }           
        }
    };

    /**
     * 初始化tab和列表
     *
     * @private
     * @method  module:pool/module-/src/live-manage/module.LiveManage#_initTabAndList
     * @returns {void}
     */
    pro._initTabAndList = function(){
        this._tabsUI = new tabsUI({
            data:{
                class: 'live-tabs',
                tabs: [
                    {title: "未开始直播", id: LiveManageCache.LIVE_LIST_FILTER_STATUS_NOTSTART}, 
                    {title: "直播中", id: LiveManageCache.LIVE_LIST_FILTER_STATUS_PLAYING}, 
                    {title: "已结束直播", id: LiveManageCache.LIVE_LIST_FILTER_STATUS_END}
                ],
                selected: {title: "未开始直播", id: LiveManageCache.LIVE_LIST_FILTER_STATUS_NOTSTART}
            }
        }).$inject('.j-live-tabs-wrap');
        this._tabsUI.$on('select', this._selectTab._$bind(this));

        this._liveListUI = new liveListUI({}).$inject('.j-live-list-wrap');
        this._liveListUI.$on('selectTab', this._selectTabAuto._$bind(this));
        this._liveListUI.$on('goChatroom', this._openChatroom._$bind(this));
        this._liveListUI.$on('goToCourse', this._goToCourse._$bind(this));

        this._liveListUI.getListByStatus(LiveManageCache.LIVE_LIST_FILTER_STATUS_NOTSTART);
    };

    /**
     * 获取用户操作系统类型
     *
     * @private
     * @method  module:pool/module-/src/live-manage/module.LiveManage#_getOsType
     * @returns 0 windows 1 mac
     */

    pro._getOsType = function(){
        if(navigator.platform.substring(0,3) == 'Mac'){
            return 1;
        }else{
            return 0;
        }
    };

    /**
     * 打开聊天室，子类重写
     *
     * @private
     * @method  module:pool/module-/src/live-manage/module.LiveManage#_openChatroom
     * @returns {void}
     */
    pro._openChatroom = function(liveContentId){

    }

    /**
     * 跳转到课程页面，子类重写
     *
     * @private
     * @method  module:pool/module-/src/live-manage/module.LiveManage#_goToCourse
     * @returns {void}
     */
     pro._goToCourse = function(courseId){

     };

    /**
     * 刷新模块业务逻辑实现，这部分主要完成以下逻辑：
     * 
     * * 根据输入信息加载数据
     * * 需要数据才能构造的第三方组件分配/组装
     *
     * @protected
     * @method  module:pool/module-/src/live-manage/module.LiveManage#_onRefresh
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
     * @method  module:pool/module-/src/live-manage/module.LiveManage#_onHide
     * @returns {void}
     */
    pro._onHide = function () {
        this._liveBalanceUI = this._liveBalanceUI? this._liveBalanceUI.destroy() : null;
        this._liveListUI = this._liveListUI? this._liveListUI.destroy() : null;
        this._liveConfigUI = this._liveConfigUI? this._liveConfigUI.destroy() : null;
        this.__super();
    };

    /**
     * 构建模块
     *
     * @method module:pool/module-/src/live-manage/module.build
     * @param {Object} options - 模块配置参数
     * @see   {@link module:pool/module-base/src/base.build}
     */
    exports.build  = m.build._$bind(m,LiveManage);
    
    /**
     * 注册模块
     *
     * @method module:pool/module-/src/live-manage/module.regist
     * @param {String} umi - 模块UMI或者别名
     * @see   {@link module:pool/module-base/src/base.regist}
     */
    exports.regist = m.regist._$bind2(m,LiveManage);
    
    // 导出模块
    exports.LiveManage = LiveManage;
});