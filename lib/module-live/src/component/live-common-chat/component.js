/**
 * LiveMobileChat 组件实现文件
 *
 * @version  1.0
 * @author   zhh <hzzhanghanhui@corp.netease.com>
 * @module   pool/module-live/src/component/live-mobile-chat/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'lib/base/platform',
    'pool/edu-front-util/src/timeUtil',
    '../../constant.js',
    'pool/component-notify/src/notify_mobile/ui',
    './timer.js',
    './queue.js'
], function(
    Component,
    util,
    platform,
    timeUtil,
    LiveMobileConstant,
    Notify,
    Timer,
    Queue
) {
    // 聊天室配置
    var CHAT_DICT = {
        // 消息显示的条数
        msgMaxLen: 200
    };

    /**
     * LiveMobileChat 组件
     *
     * @class   module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var LiveMobileChat = Component.$extends({
        name: 'ux-live-chat',
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#config
         * @returns {void}
         */
        config: function() {

            util.extend(this, {
                // 默认浏览器支持
                isBrowserSupport: true,
                // 聊天室消息列表
                items: [],
                // 输入框的内容
                inputValue: '',
                // 是否写消息模式
                isWriteModel: false,
                // 聊天室状态是否可用，获取聊天室地址异常时会改变此状态
                isChatAvaliable: true,
                // chatroom callback
                chatroomCb: {},
                // chatroom api
                chatroomApi: {}
            });

            util.extend(this.data, {
                // appKey
                appKey: '',
                // 账号
                account: '',
                // 聊天室id
                chatroomId: null,
                // token
                token: '',
                // 聊天室当前在线人数
                onlineMemberNum: 0,
                // 是否需要请求接口获取在线人数
                isMemberNumFromRequest: false,
                //消息输入的字数
                wordsNum: 120,
                // 是否可以发送消息，mobile web聊天室不允许发送消息，app内聊天室才能发送消息
                isSendMsgCreate: true,
                // 讲师Id 用于信息高亮显示
                lectorAccount: '',
                // 聊天室占据高度
                chatWrapHeight: '1000px',
                // 直播状态
                liveStatus: LiveMobileConstant.LIVE_STATUS_PLAYING,
                // is login 是否登录
                isUserLogin: true,
                // 登录按钮方法
                goToLogin: function() {

                }
            });
            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#init
         * @returns {void}
         */
        init: function() {
            this.isBrowserSupport = this.isSupport();
            if(!this.isBrowserSupport) return;

            // 参数不足，提示异常
            if (!this.data.chatroomId || !this.data.account) {
                this._showChatUnavalibale();
                return;
            };

            var that = this;

            // 消息刷新的定时器
            this.msgRefreshTimer = new Timer({
                interval: 1000,
                autoStart: false,
                cb: this._onMsgRefreshTimeout._$bind(this)
            });

            // 缓存的消息队列
            this.msgCacheQueue = new Queue({
                items: [],
                length: 200
            });

            // 当前显示的消息队列
            this.msgCurrentQueue = new Queue({
                items: [],
                length: 200
            });

            // 已经展示的消息队列
            this.msgAlreadyQueue = new Queue({
                items: this.items,
                length: 200
            });

            // 上次消息获取的时间
            this.getLastMsgTime = +new Date();

            // 获取聊天室地址
            this.getChatroomAddress();

            // 30s轮询一次聊天室人数
            function _getNumTimer() {
                that.getChatroomCurrentNum();
                setTimeout(_getNumTimer,30 * 1000);
            }
            if(this.data.isMemberNumFromRequest){
                // 获取人数
                _getNumTimer();
            }

            this.supr();
        },


        /**
         * 浏览器是否支持聊天室
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#isSupport
         * @return {Boolean} true: 支持，false: 不支持
         */
        isSupport: function () {
            // 判断是否是ie10以下
            if(platform._$KERNEL.engine == "trident" && (parseFloat(platform._$KERNEL.release)) < 6){
                return false;
            }
            return true;
        },

        /**
         * 显示聊天室异常，可能不存在或者已经关闭
         *
         * @private
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#_showChat
         * @return {void}
         */
        _showChatUnavalibale : function(){
            this.isChatAvaliable = false;
            this.$update();
            // Notify.warning('获取连接房间地址失败', 3 * 1000);
        },

        /**
         * 获取聊天室地址
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#getChatroomAddress
         * @param  {Boolean} notfirst 是否立即发出
         * @return {void}
         */
        getChatroomAddress: function(notfirst) {
            // 发出消息
            if (notfirst) {
                this.$emit('getChatroomAddress');
            } else {
                setTimeout(function() {
                    this.$emit('getChatroomAddress');
                }._$bind(this), 0);
            }
        },

        /**
         * 获取聊天室当前在线人数
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#getChatroomCurrentNum
         * @param  {Boolean} notfirst 是否立即发出
         * @return {void}
         */
        getChatroomCurrentNum: function(notfirst) {
            // 发出消息
            if (notfirst) {
                this.$emit('getChatroomCurrentNum');
            } else {
                setTimeout(function() {
                    this.$emit('getChatroomCurrentNum');
                }._$bind(this), 0);
            }
        },

        /**
         * 获取聊天室地址回调
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#onGetChatroomAddress
         * @param  {Object} data 接口数据
         * @return {Void}
         */
        onGetChatroomAddress: function(data) {
            var that = this;
            that.chatroomCb = that.getChatroomCb();
            var chatroomData = {
                appKey: that.data.appKey,
                account: that.data.account,
                token: that.data.token,
                chatroomId: that.data.chatroomId,
                chatroomAddresses: data.addr,
                onconnect: that.chatroomCb.onChatroomConnect._$bind(that),
                onmsgs: that.chatroomCb.onChatroomMsgs._$bind(that),
                onerror: that.chatroomCb.onChatroomError._$bind(that),
                onwillreconnect: that.chatroomCb.onChatroomWillReconnect._$bind(that),
                ondisconnect: that.chatroomCb.onChatroomDisconnect._$bind(that)
            };

            if(window.webUser && window.webUser.realName){
                chatroomData.chatroomNick = window.webUser.realName;
            }else if(window.webUser && window.webUser.nickName){
                chatroomData.chatroomNick = window.webUser.nickName;
            }

            // 接口可能返回result为null特殊处理
            if (data.result) {
                data = data.result;
            };

            if (data && data.addr && (data.addr.length > 0)) {
                // 创建聊天室
                this._initChatroom(chatroomData);
            } else {
                that._showChatUnavalibale();
            }
        },

        /**
         * 获取聊天室地址错误回调，code未知
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#onGetChatroomAddressError
         * @param  {Object} evt 接口数据
         * @return {Void}
         */
        onGetChatroomAddressError : function(evt){
            that._showChatUnavalibale();
        },

        /**
         * 初始化聊天室
         *
         * @private
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#_initChatroom
         * @param  {Object} data 接口数据
         * @return {Void}
         */
        _initChatroom: function (options) {
            this.chatroom = Chatroom.getInstance(options);
            this.chatroomApi = this.getChatroomApi(this.chatroom);
        },

        /**
         * 获取聊天室当前在线人数回调
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#onGetChatroomAddress
         * @param  {Object} data 接口数据
         * @return {Void}
         */
        onGetChatroomCurrentNum: function(data) {
            if(data && data > 0){
                this.data.onlineMemberNum = data;
                this.$update();
            }
        },

        /**
         * 定时器结束执行的方法
         *
         * @private
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#onGetChatroomAddress
         * @return {Void}
         */
        _onMsgRefreshTimeout: function () {
            this.updateMsgCurrent(this.msgCacheQueue.items);
            this.msgCacheQueue.empty();
            this.refreshMsgList();
        },

        /**
         * 更新显示的消息队列
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#updateMsgCurrent
         * @param {Array} 需要更新到msgCurrentQueue的数组
         * @return {Void}
         */
        updateMsgCurrent: function (arr) {
            if(arr.length === 0 ) return;
            this.msgCurrentQueue.concat(arr);
        },

        /**
         * 更新缓存的消息队列(在onmsgs的时候)
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#updateMsgCache
         * @param {Array} 需要更新到msgCacheQueue的数组
         * @return {Void}
         */
        updateMsgCache: function (arr) {
            if(arr.length === 0 ) return;
            this.msgCacheQueue.concat(arr);
        },

        /**
         * 刷新消息列表（更新界面）
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#refreshMsgList
         * @return {Void}
         */
        refreshMsgList: function () {
            if(this.msgCurrentQueue.size() === 0) return;
            this.msgAlreadyQueue.item = this.items;
            this.items = this.msgAlreadyQueue.concat(this.msgCurrentQueue.items).items;
            this.$update();
            this.msgCurrentQueue.empty();
            if(this._isToBottom()){
                this._scrollToBottom();
            }
        },

        /**
         * 聊天室注册事件回调
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#getChatroomCb
         * @return {Object} function类型的对象
         */
        getChatroomCb: function() {
            var that = this;
            return {
                // 聊天室连接回调
                onChatroomConnect: function(data) {
                    /*
                    data:
                        {
                            chatroom: {
                                announcement: "公告更新-2 by zq",
                                broadcastUrl: "",
                                createTime: 1453952210212,
                                creator: "wujie",
                                custom: "",
                                id: "3001",
                                name: "功夫熊猫3",
                                onlineMemberNum: 7,
                                updateTime: 1463561297673
                            },
                            member: {
                                account: "test007007"
                                avatar: ""
                                custom: ""
                                enterTime: 1474533150991
                                nick: "test007007"
                                online: true
                                tempMuteDuration: 0
                                tempMuted: false
                                type: "guest"
                            }
                        }
                    */
                    this.data.onlineMemberNum = data.chatroom.onlineMemberNum;
                    this.data.member = data.member;
                    // 取得历史消息
                    that.chatroomApi.getHistoryMsgs(100,that.chatroomCb.onGetHistoryMsgs._$bind(that));
                },
                // 聊天室接收消息回调
                onChatroomMsgs: function(msgs) {
                    /*
                        [{
                            chatroomId: "3001",
                            custom: "{"type":-2}",
                            flow: "out",
                            from: "test007007",
                            fromAvatar: "",
                            fromClientType: "Web",
                            fromCustom: "",
                            fromNick: "test007007",
                            idClient: "a9e082753b020ac02ebc7fbd9e11b472",
                            resend: false,
                            status: "success",
                            text: "ff",
                            time: 1474533889232,
                            type: "text",
                            userUpdateTime: 1474533721479
                        }]
                    */

                    var items = [];
                    for (var i = 0, msg = {}; i < msgs.length; i++) {
                        msg = msgs[i];
                        // 如果没有设置从接口获取人数则根据attach获取
                        if (msg.attach && !that.data.isMemberNumFromRequest) {
                            switch (msg.attach.type) {
                                case 'memberEnter':
                                    if (msg.from != this.data.account) {
                                        this.data.onlineMemberNum++;
                                    }
                                    break;
                                case 'memberExit':
                                    this.data.onlineMemberNum--;
                                    break;
                            }
                            this.$update();
                        }
                        // 文本消息
                        if (msg.text) {
                            items.push(msg);
                            // 判断是讲师消息
                            if(msg.from === this.data.lectorAccount){
                                that.updateMsgCurrent(that.msgCacheQueue.items);
                                that.updateMsgCurrent(items);
                                that.msgCacheQueue.empty();
                                items = [];
                                that.refreshMsgList();
                            }
                        }
                    }
                    // 更新缓存消息队列
                    that.updateMsgCache(items);
                    items = [];
                    // 如果定时器没有激活并且消息频率需要定时器控制
                    if(!that.msgRefreshTimer.active && (+new Date() - that.getLastMsgTime) < 1 * 1000){
                        that.msgRefreshTimer.startTimer();
                    }else if((+new Date() - that.getLastMsgTime) >= 3 * 1000){
                        if(that.msgRefreshTimer.active){
                            that.msgRefreshTimer.stopTimer();
                        }
                        that.updateMsgCurrent(that.msgCacheQueue.items);
                        that.msgCacheQueue.empty();
                        that.refreshMsgList();
                    }
                    // 记录消息获取时候的时间
                    that.getLastMsgTime = +new Date();
                },
                // 聊天室错误回调
                onChatroomError: function(error, obj) {
                    Notify.warning('聊天室错误', 3 * 1000);
                    this.$emit('chatroomError',error);
                },
                // 聊天室即将重连回调
                onChatroomWillReconnect: function(obj) {
                    Notify.warning('聊天室即将重连', 3 * 1000);
                },
                // 聊天室断开链接回调
                onChatroomDisconnect: function(error) {
                    if(this.isChatroomWillSwitch){
                        this.$emit('chatroomSwitch',error);
                        return;
                    }
                    Notify.warning('聊天室链接断开', 3 * 1000);

                    if (error) {
                        switch (error.code) {
                            // 账号或密码错误
                            case 302:
                                Notify.warning('账号或密码错误', 3 * 1000);
                                break;
                                // 被拉黑
                            case 13003:
                                Notify.warning('被拉黑', 3 * 1000);
                                break;
                                // 被踢
                            case 'kicked':
                                if (error.reason === 'managerKick') {
                                    Notify.warning('已被管理员移出', 3 * 1000);
                                } else if (error.reason === 'blacked') {
                                    Notify.warning('你已被管理员拉入黑名单', 3 * 1000);
                                }
                                break;
                            default:
                                Notify.warning(error.message, 3 * 1000);
                                break;
                        }
                    }
                    this.$emit('chatroomDisconnect',error);
                },
                // 获取历史消息回调
                onGetHistoryMsgs: function(error, data) {
                    var items = [];
                    if (!error && data) {
                        data.msgs.sort(function(a, b) {
                            return a.time - b.time;
                        });
                        for (var i = 0; i < data.msgs.length; i++) {
                            if (data.msgs[i].text) {
                                items.push(data.msgs[i]);
                            }
                        }
                        that.updateMsgCurrent(items);
                        items = [];
                        that.refreshMsgList();
                        that._scrollToBottom();
                    } else {
                        Notify.warning(error.message, 5 * 1000);
                    }
                    that.$emit('getHistoryMsgsError',error);
                },
                // 发送消息回调
                onSendText: function(error, data) {
                    that.isSendBtnDisable = false;

                    if (!error) {
                        that.inputValue = '';
                        that.isWriteModel = false;
                        that.updateMsgCurrent([data]);
                        that.refreshMsgList();
                    } else {
                        if(error && error.code){
                            if(error.code == 13004){
                                Notify.warning('您已被管理员禁言', 3 * 1000);
                                return;
                            }else if(error.code == 13006){
                                Notify.warning('管理员已设置全体禁言', 3 * 1000);
                                return;
                            }
                        }
                        Notify.warning('发送失败，请刷新或重新加载页面后再试', 3 * 1000);
                    }
                    that.$emit('sendTextError',error);
                }
            };
        },

        /**
         * 聊天室api
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#getChatroomApi
         * @param  {Object} 聊天室对象
         * @return {Object} function类型的对象
         */
        getChatroomApi: function(room) {
            var that = this;
            return {
                // 发送文本消息
                sendText: function(text, cb) {
                    room.sendText({
                        custom: JSON.stringify({
                            type: -2
                        }),
                        text: text,
                        done: cb
                    });
                },
                // 获取聊天室记录
                getHistoryMsgs: function(num, cb) {
                    room.getHistoryMsgs({
                        limit: num || 20,
                        done: cb
                    });
                }
            };
        },

        /**
         * 验证消息字数是否长度限制
         *
         * @private
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#_verifyWordNum
         * @return {Boolean} 消息是否符合字数限制
         */
        _verifyWordNum: function() {
            var len = this.inputValue.length;
            if (len > this.data.wordsNum) {
                Notify.warning('最多输入' + this.data.wordsNum + '字', 5 * 1000);
                return false;
            }
            return true;
        },

        /**
         * 切换输入模式
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#toggleWriteModel
         * @return {Void}
         */
        toggleWriteModel: function() {
            this.isWriteModel = !this.isWriteModel;
            if (this.isWriteModel) {
                this.$refs.writeInput.focus();
            } else {
                this.$refs.writeInput.blur();
            }
        },

        /**
         * 点击发送按钮执行的方法
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#sendMsg
         * @param {String} 发送的文本字符串
         * @return {Void}
         */
        sendMsg: function(inputValue) {
            if(this.isSendBtnDisable) return;
            if (!inputValue || !inputValue.replace(/^\s*|\s*$/g, '')) {
                Notify.warning('不能发送空消息', 3 * 1000);
                this.isSendBtnDisable = false;
                return;
            }

            if(this.lastSendMsgTime && (+new Date() - this.lastSendMsgTime <= 3 * 1000)){
                Notify.warning('您的发言过于频繁，请稍后再试', 3 * 1000);
                return;
            }

            this.lastSendMsgTime = +new Date();
            if (this._verifyWordNum()) {
                this.lastSendMsgTime = +new Date();
                try {
                    this.chatroomApi.sendText(inputValue, this.chatroomCb.onSendText);
                } catch (e) {
                    this.isSendBtnDisable = false;
                    Notify.warning('聊天室连接异常', 3 * 1000);
                } finally {
                }
            }
        },

        /**
         * 移动端input事件回调
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#onInput
         * @param {String} 发送的文本字符串
         * @return {Void}
         */
        onInput: function (inputValue) {
            if(!this._verifyWordNum()){
                this.inputValue = inputValue.substr(0,this.data.wordsNum);
                this.$update();
                return;
            }
        },

        /**
         * pc端keypress事件回调
         *
         * @protected
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#onKeypress
         * @param {String} 发送的文本字符串
         * @return {Void}
         */
        onKeypress: function ($event,inputValue) {
            if($event.event.keyCode == 13){
                this.sendMsg(inputValue);
            }
        },

        /**
         * 更新消息的滑动时间
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#updateTouchmoveTime
         * @returns {void}
         */
        updateTouchmoveTime: function() {
            this.touchmoveTime = (new Date()).getTime();
        },

        /**
         * 判断消息是否需要滚动到底部
         *
         * @private
         * @method module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#_isToBottom
         * @return {Boolean} 消息是否需要滚动到底部
         */
        _isToBottom: function() {
            // 滚动5s 之后，无后续操作才可以滚到底部
            var nowTime = (new Date()).getTime();
            if (!this.touchmoveTime || (nowTime - this.touchmoveTime) > 5000) {
                return true;
            }
            return false;
        },

        /**
         * 消息滚动到底部
         *
         * @private
         * @method  module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#_scrollToBottom
         * @returns {void}
         */
        _scrollToBottom: function() {
            this.$refs.chatScroll.scrollTop = this.$refs.chatScrollList.offsetHeight - this.$refs.chatScroll.offsetHeight + (16 * 2) + (50);
        },


        /**
         * 退出聊天室
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#disconnectChatroom
         * @returns {void}
         */
        disconnectChatroom: function () {
            // 执行聊天室退出的时候可能聊天室不存在或者已经退出
            if(this.chatroom && (typeof this.chatroom.disconnect === 'function')){
                try {
                    this.isChatroomWillSwitch = true;
                    this.chatroom.disconnect();
                } catch (e) {
                    console.log(e);
                }
            }
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat#destroy
         * @returns {void}
         */
        destroy: function() {
            this.disconnectChatroom();
            this.chatroom = null;
            this.supr();
        }

    }).filter({
        // 显示消息时间
        formatTime: function(timeStamp) {
            return timeUtil._$formatTime(timeStamp, 'HH:mm');
        },
        // 显示讲师title
        formatLectorTitle: function(from) {
            if (from === this.data.lectorAccount) {
                return '［讲师］';
            } else {
                return '';
            }
        },
        // 显示高亮信息
        highlight: function(from) {
            if (from === this.data.account) {
                return 'highlight-reverse';
            }else if (this.data.lectorAccount && (from === this.data.lectorAccount)) {
                return 'highlight';
            }
            return '';
        }
    });

    return LiveMobileChat;
});
