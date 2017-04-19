/**
 * LiveMobilePlayerUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 * @module   pool/module-live/src/component/live-mobile-player/ui
 */
NEJ.define( [
    './component.js',
    'text!./component.html',
    'css!./component.css'
],function(
    LiveMobilePlayer,
    html,
    css
){
    /**
     * LiveMobilePlayer UI组件
     *
     * @class   module:pool/module-live/src/component/live-mobile-player/ui.LiveMobilePlayerUI
     * @extends module:pool/module-live/src/component/live-mobile-player/component.LiveMobilePlayer
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return LiveMobilePlayer.$extends({
        name     : 'ux-live-mobile-player',
        css      : css,
        template : html
    });
});
