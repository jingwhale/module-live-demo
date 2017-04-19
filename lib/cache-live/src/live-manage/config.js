/**
 * 直播管理数据接口配置文件
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
        //

        'live-manage-get': {
            method: 'GET',
            url: '/api/live/get/'
        },

        'live-manage-list': {
            method: 'GET',
            url: '/j/live/getListWithStatus.json',
            format: function(event){
                var res = (event.res || {}).result || {};
        
                event.result = {
                    total  : (res.query || {}).totleCount || 0,
                    list : res.list || []
                };
            }
        },
        
        'live-manage-create': {
            url: '/api/live/create'
        },
        
        'live-manage-delete': {
            url: '/api/live/delete'
        },
        
        'live-manage-update': {
            url: '/api/live/update'
        },

        // 获取直播配置
        'live-manage-getLiveConfig': {
            method: 'GET',
            url: '/j/live/getLiveConfig.json'
        },

        // 获取直播权限和余额信息
        'live-manage-getAuth': {
            method: 'GET',
            url: '/j/live/getAuth.json'
        },

        // 开始直播，obs
        'live-manage-startlive': {
            method: 'POST',
            url: '/j/live/startlive.do'
        },

        // 结束直播，obs
        'live-manage-stoplive': {
            method: 'POST',
            url: '/j/live/stoplive.do'
        },

        // 开始直播，唐桥
        'live-manage-startTechBridge': {
            method: 'POST',
            url: '/j/live/startTechBridge.do'
        },

        //是否是直播课时讲师
        'live-manage-isProperTeacher':{
            method: 'POST',
            url: '/j/live/isProperTeacher.json'
        }

    };
});
