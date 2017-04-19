/**
 * 移动端直播模块组装配置文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 */
NEJ.define(function () {
    return {
        rules: {
            rewrite: {
                '404': 'm/live/mobile/'
            }
        },
        modules: {
            'm/live/mobile/': 'module-live/src/live-mobile/index.html'
        }
    };
});
