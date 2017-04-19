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
                '404': 'm/live/pc/'
            }
        },
        modules: {
            'm/live/pc/': 'module-live/src/live-pc/index.html'
        }
    };
});
