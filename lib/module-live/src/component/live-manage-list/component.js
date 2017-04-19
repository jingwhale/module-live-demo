/**
 * LiveManageList 组件实现文件
 *
 * @version  1.0
 * @author   hzyuwei <hzyuwei@corp.netease.com>
 * @module   pool/module-/src/component/live-manage-list/component
 */
NEJ.define([
    'text!./obsStartDialogTpl.html',
    'lib/base/util',
    'lib/base/element',
    'pool/component-list-view/src/list_view/component',
    'pool/component-base/src/util',
    'pool/edu-front-util/src/timeUtil',
    'pool/component-modal/src/modal/ui',
    'pool/component-notify/src/notify/ui',
    'pool/cache-live/src/live-manage/cache',
    'pool/component-pager/src/pager_ui',
    'pool/component-button/src/button/web/ui',
    'pool/component-button/src/button-copy/web/ui'
],function(
    obsStartDialogTpl,
    u,
    e,
    ListView,
    util,
    timeUtil,
    Modal,
    Notify,
    LiveManageCache
){
    var g = window;
    /**
     * LiveManageList 组件
     *
     * @class   module:pool/module-/src/component/live-manage-list/component.LiveManageList
     * @extends module:pool/component-list-view/src/list_view/component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var LiveManageList = ListView.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#config
         * @returns {void}
         */
        config: function () {
            // FIXME 设置组件配置信息的默认值
            util.extend(this, {
                listOpt:{
                    sort: 0,
                    status: LiveManageCache.LIVE_LIST_FILTER_STATUS_NOTSTART
                },
                listKey: 'live-list-havenot'
            });
            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {
                LiveManageCache: LiveManageCache
            });
            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#init
         * @returns {void}
         */
        init: function () {
            this.supr(); 
        },

        /**
         * 根据直播状态获取直播列表
         *
         * @public
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#getListByStatus
         * @param status    5 未开始  0 直播中  40 已结束
         * @returns {void}
         */
        getListByStatus: function(status){
            if(status == LiveManageCache.LIVE_LIST_FILTER_STATUS_NOTSTART){
                this.listKey = "live-list-havenot";
                this.listOpt.sort = 0;
            }else if(status == LiveManageCache.LIVE_LIST_FILTER_STATUS_PLAYING){
                this.listKey = "live-list-living";
                this.listOpt.sort = 0;
            }else if(status == LiveManageCache.LIVE_LIST_FILTER_STATUS_END){
                this.listKey = "live-list-finished";
                this.listOpt.sort = 1;
            }

            this.listOpt.status = status;
            this.data.index = 1;
            this.refresh();
        },

        /**
         * 获取cache实例
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#_getCacheInst
         * @param   {Object} options - 缓存事件配置信息
         * @returns {Void}
         */
        _getCacheInst: function (options) {

            /**
             * listView额外的回调事件 options
             * 
             * _onstartlive               --- obs开始直播回调
             * _onstartTechBridge         --- 唐桥开始直播回调
             * _onstoplive                --- obs结束直播回调
             * _onproperteacher           --- obs讲师判断
             */
            options = util.extend(options, {
                onstartlive: this._cbStartObsLive._$bind(this),
                onstartTechBridge: this._cbStartTQLive._$bind(this),
                onstoplive: this._cbEndObsLive._$bind(this),
                onproperteacher: this._cbProperTeacher._$bind(this)
            });
            return LiveManageCache.LiveManage._$allocate(options);
        },

        /**
         * 距直播开始时间大于30min时去直播的弹窗提示
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#showDisableLiveDialog
         * @returns {void}
         */
        showDisableLiveDialog: function(){
            Modal.alert("直播开始前30min方可提前进入直播间，开始准备工作~","","知道了","");
        },

        /**
         * obs点击去直播时讲师校验
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#isProperTeacher
         * @returns {void}
         */
        isProperTeacher: function(termId, unitId){
            this._cache.isProperTeacher(termId);
            this.data.currUnitId = unitId;
        },

        /**
         * obs点击去直播时讲师校验回调
         *
         * @private
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#_cbProperTeacher
         * @param is    接口返回数据
         * @returns {void}
         */
        _cbProperTeacher: function(is){
            if(is){
                this.showObsStartDialog(this.data.currUnitId);
            }else{
                Modal.alert("非该课程讲师，不可以进行直播。您可以选择，成为该课程的讲师后，再来直播~", "", "知道了");
            }
        },

        /**
         * obs开始直播引导弹窗
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#showObsStartDialog
         * @returns {void}
         */
        showObsStartDialog: function(unitId){
            var that = this;
            this._obsStartModal = new Modal({
                data:{
                    title: "开启直播",
                    content: obsStartDialogTpl,
                    okButton: false,
                    class: "obs-pop",
                    rtmpAddr: window.rtmpAddr,
                    unitId: unitId,
                    obsFail: false
                }
            });

            this._obsStartModal.startObsLive = function(){
                that._cache.startlive(this.data.unitId)
            }

            this._obsStartModal.closeObsStartDialog = function(){
                this.close();
            };

            this._obsStartModal.showObsFailTip = function(){
                this.data.obsFail = true;
                this.$update();
            };

            this._obsStartModal.hideObsFailTip = function(){
                this.data.obsFail = false;
                this.$update();
            };
        },

        /**
         * 唐桥开始直播检查
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#startTQLive
         * @returns {void}
         */
        startTQLive: function(unitId){
            this._cache.startTechBridge(unitId);
        },

        /**
         * obs结束直播
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#endObsLive
         * @returns {void}
         */
        endObsLive: function(unitId){
            var that = this;
            var tempModal = new Modal({
                data:{
                    content:"确定要结束直播吗？"
                }
            });
            tempModal.$on('ok', function(event){
                that._cache.stoplive(unitId);
            });
        },

        /**
         * obs开始直播回调
         *
         * @private
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#_cbStartObsLive
         * @param  data  接口返回数据
         * @returns {void}
         */
        _cbStartObsLive: function(data){
            /*开启直播成功，列表跳转到直播中*/
            if(data.status == LiveManageCache.LIVE_START_STATUS_SUCCESS){
                this._obsStartModal.close();
                this.$emit('selectTab', LiveManageCache.LIVE_LIST_FILTER_STATUS_PLAYING);
            }
            /*用户为正确设置串流，给出提示*/
            else if(data.status == LiveManageCache.LIVE_START_STATUS_FAIL){
                this._obsStartModal.showObsFailTip();
            }
            /*用户已经有在进行的直播，给出提示*/
            else if(data.status == LiveManageCache.LIVE_START_STATUS_DUPLICATE){
                this._obsStartModal.close();
                var html = "<p>一个用户同一时间只能进行一场直播。</p><br><p>正在直播中：</p>" + 
                           ((data.name) ? '<p>直播课时名称：{name}</p>' : '') + 
                           ((data.courseName) ? '<p>所属课程：{courseName}</p>' : '');
                var tempModal = Modal.alert(html, "", '知道了', 'warning');
                tempModal.data.name = data.name;
                tempModal.data.courseName = data.courseName;
                tempModal.$update();
            }
            /*已经有讲师在进行该直播，给出提示*/
            else if(data.status == LiveManageCache.LIVE_START_STATUS_NOTALLOWED){
                this._obsStartModal.close();
                var html = "<p>当前有老师正在直播，您不能去直播。</p>" + 
                           ((data.presenterName) ? '<p>当前直播老师：{presenterName}</p>' : '');
                var tempModal = Modal.alert(html, "", '知道了', 'warning');
                tempModal.data.presenterName = data.presenterName;
                tempModal.$update();
            }
            /*直播服务不可用，给出提示*/
            else if(data.status == LiveManageCache.LIVE_START_STATUS_NO_SERVICE){
                this._obsStartModal.close();
                var html = "<p>联系管理员</p>" + 
                           ((data.adminName) ? "<p>管理员：{adminName}</p>" : '');
                var tempModal = Modal.alert(html, "直播服务无法使用", "知道了", 'warning');
                tempModal.data.adminName = data.adminName;
                tempModal.$update();
            }else{
                this._obsStartModal.close();
                Modal.alert("开启直播发生异常", "", "知道了");
            }
        },

        /**
         * 唐桥开始直播检查回调
         *
         * @private
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#_cbStartTQLive
         * @param  data  接口返回数据
         * @returns {void}
         */
        _cbStartTQLive: function(data){
            /*开启直播成功，跳转到直播页面*/
            if(data.status == LiveManageCache.LIVE_START_STATUS_SUCCESS){
                window.location.href = data.liveUrl;
            }
            /*用户已经有在进行的直播，给出提示*/
            else if(data.status == LiveManageCache.LIVE_START_STATUS_DUPLICATE){
                var html = "<p>一个用户同一时间只能进行一场直播。</p><br><p>正在直播中：</p>" + 
                           ((data.name) ? '<p>直播课时名称：{name}</p>' : '') + 
                           ((data.courseName) ? '<p>所属课程：{courseName}</p>' : '');
                var tempModal = Modal.alert(html, "", '知道了', 'warning');
                tempModal.data.name = data.name;
                tempModal.data.courseName = data.courseName;
                tempModal.$update();
            }
            /*已经有讲师在进行该直播，给出提示*/
            else if(data.status == LiveManageCache.LIVE_START_STATUS_NOTALLOWED){
                var html = "<p>当前有老师正在直播，您不能去直播。</p>" + 
                           ((data.presenterName) ? '<p>当前直播老师：{presenterName}</p>' : '');
                var tempModal = Modal.alert(html, "", '知道了', 'warning');
                tempModal.data.presenterName = data.presenterName;
                tempModal.$update();
            }
            /*不是该课程讲师无法直播，给出提示*/
            else if(data.status == LiveManageCache.LIVE_START_STATUS_ERROR_LECTOR){
                Modal.alert("非该课程讲师，不可以进行直播。您可以选择，成为该课程的讲师后，再来直播~", "", "知道了");
            }
            /*直播服务不可用，给出提示*/
            else if(data.status == LiveManageCache.LIVE_START_STATUS_NO_SERVICE){
                var html = "<p>联系管理员</p>" + 
                           ((data.adminName) ? "<p>管理员：{adminName}</p>" : '');
                var tempModal = Modal.alert(html, "直播服务无法使用", "知道了", 'warning');
                tempModal.data.adminName = data.adminName;
                tempModal.$update();
            }else{
                Modal.alert("开启直播发生异常", "", "知道了");
            }
        },

        /**
         * obs结束直播回调
         *
         * @private
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#_cbEndObsLive
         * @param  data  接口返回数据
         * @returns {void}
         */
        _cbEndObsLive: function(data){
            this.$emit('selectTab', LiveManageCache.LIVE_LIST_FILTER_STATUS_END);
            Notify.success("直播状态已置为结束");
        },

        /**
         * 聊天小助手点击抛出事件
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#goChatroom
         * @returns {void}
         */
        goChatroom: function(contentId){
            this.$emit('goChatroom', contentId);
        },

        /**
         * 直播所属课程点击抛出事件
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#goToCourse
         * @returns {void}
         */
        goToCourse: function(termId){
            this.$emit('goToCourse', termId);
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#destroy
         * @returns {void}
         */
        destroy: function () {
            // TODO
            this.supr();
        },

        /**
         * 对外暴露接口
         *
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#api
         * @returns {void}
         */
        api: function () {
            // TODO
        },

        /**
         * 私有接口，外部不可调用
         *
         * @private
         * @method  module:pool/module-/src/component/live-manage-list/component.LiveManageList#_api
         * @returns {void}
         */
        _api: function () {
            // TODO
        }
    }).filter({
        formatTime: function(_start, _finish){
            return timeUtil._$formatTime(_start, 'yyyy-MM-dd') + "  " + timeUtil._$formatTime(_start, 'HH:mm') + "-" + timeUtil._$formatTime(_finish, 'HH:mm');
        }
    });

    return LiveManageList;
});
