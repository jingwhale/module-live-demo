/**
 * pc直播模块组装配置文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 */
NEJ.define(function () {
    return {
        rules: {
            rewrite: {
                '404': 'm/live/manage/'
            },
            alias: {
                'live-manage': 'm/live/manage/'
            }
        },
        modules: {
            'm/live/manage/': 'module-live/src/live-manage/index.html'
        }
    };
});
