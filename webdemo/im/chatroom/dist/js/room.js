/**
 * 聊天室逻辑
 */

NEJ.define([
    'pool/module-live/src/component/live-pc-chat/ui'
],function(
    _liveChatPc
){
    var page = {
        init:function () {
            var options= {
                appKey: CONFIG.appkey,
                account: util.readCookie("uid"),
                id: util.getIdTag(),
                token: util.readCookie("sdktoken"),
                chatroomNick:util.readCookie("nickName"),
                chatroomAvatar:util.readCookie("avatar")
            };
            this.account = util.readCookie("uid");

            this.initLiveChatPcUI(options);
        },
        initLiveChatPcUI: function(info){
            this.__chatUI = new _liveChatPc({
                data: {
                    appKey: info.appKey,
                    account: info.chatroomNick,
                    chatroomId: info.id,
                    token: info.token,
                    isSendMsgCreate: true,
                    lectorAccount: info.chatroomNick,
                    isUserLogin: true,
                    goToLogin: '',
                    isMemberNumFromRequest: true
                }
            }).$inject("#j-chatRoomTest");

            // 获取聊天室地址
            this.__chatUI.$on('getChatroomAddress', this.getChatroomAddress._$bind(this,info));
        },
		getChatroomAddress: function (info) {
            var that = this;
            $.ajax({
                url: CONFIG.url+"/api/chatroom/requestAddress",
                contentType:"application/json",
                type: 'POST',
                beforeSend: function (req) {
                    req.setRequestHeader('appkey', CONFIG.appkey);
                },
                data:JSON.stringify({
                    roomid:info.id,
                    uid:info.account
                })
            }).done(function(data) {
                if(data.res===200){
                    that.__chatUI.onGetChatroomAddress(data.msg);
                }else{
                    alert("获取连接房间地址失败");
                }
            })
        }
    };
    page.init();
});