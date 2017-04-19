/**
 * Live 数据接口配置文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 */
NEJ.define(function () {
    /**
     * 请求配置信息，项目中可以统一配置请求信息，可配置项如下表所示
     *
     * | 名称    | 类型     | 描述  |
     * | :----:  | :----:   | :---- |
     * | url     | String   | 请求地址 |
     * | method  | String   | 请求方式，GET/POST/PUT等，默认为POST |
     * | rest    | Boolean  | 是否REST接口 |
     * | filter  | Function | 请求发送之前配置信息过滤接口 |
     * | post    | Function | 请求返回之后结果检查接口 |
     * | format  | Function | 请求返回结果格式化接口 |
     * | finaly  | Function | 回调结束后执行业务逻辑接口 |
     * | onerror | Function | 异常处理接口 |
     * | onload  | Function | 回调处理接口 |
     *
     */
    return {
        // 'live-list': {
        //     method: 'GET',
        //     url: '/api/live/list',
        //     rest: false,
        //     filter: function (event) {
        //         // event.url - 请求地址
        //         // event.req - 请求接口输入对象 options
        //     },
        //     post: function (event) {
        //         // event.req - 请求接口输入对象 options
        //         // event.res - 服务器返回结果，ajax接口的回调输入
        //         // event.error - 重写异常信息，如果验证OK则留空
        //     },
        //     format: function (event) {
        //         // event.req - 请求接口输入对象 options
        //         // event.res - 服务器返回结果，ajax接口的回调输入
        //         // event.result - 重写返回结果
        //     },
        //     onload: function (result) {
        //         // result - 经过格式化的服务器返回结果
        //     },
        //     onerror: function (event) {
        //         // event.req - 请求接口输入对象 options
        //         // event.error - 异常信息
        //     },
        //     finaly: function (event) {
        //         // event.req - 请求接口输入对象 options
        //         // event.res - 服务器返回结果，ajax接口的回调输入
        //     }
        // }
        
        
        // 获取直播间信息
        'live-getInfo': {
            method: 'POST',
            notShowLoading : !0,
            hideError : !0,
            url: '/j/live/getLiveInfo.json'
        },
        
        //获取直播拉流地址
        'live-getStraamUrl': {
            method: 'POST',
            notShowLoading : !0,
            hideError : !0,
            url: '/j/live/getLiveStream.htm'
        },

        // 获取聊天室地址
        'chat-getAddress': {
            method: 'POST',
            notShowLoading : !0,
            hideError : !0, // 组件中特殊处理
            url: '/j/live/getChatroomAddr.json'
        },

        // 获取聊天室当前在线人数
        'chat-getCurrentMemberNum': {
            method: 'GET',
            notShowLoading : !0,
            hideError : !0,
            url: 'http://ls.study.163.com/j/live/getCurrentMemberNum.json'
        },

        // 获取直播对应的聊天室信息
        'live-getChatRoom': {
            method: 'GET',
            url: '/j/live/getChatRoom.json'
        },

        // 获取判断推流状态
        'live-getChannelStatus': {
            method: 'GET',
            notShowLoading : !0,
            hideError : !0,
            url: 'http://ls.study.163.com/j/live/getChannelStatus.json'
        },

        'live-get': {
            method: 'GET',
            url: '/api/live/get/'
        },
        'live-list': {
            method: 'GET',
            url: '/api/live/list'
        },
        'live-create': {
            url: '/api/live/create'
        },
        'live-delete': {
            url: '/api/live/delete'
        },
        'live-update': {
            url: '/api/live/update'
        }
    };
});
