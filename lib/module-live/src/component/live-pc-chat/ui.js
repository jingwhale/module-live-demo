/**
 * LiveMobileChatUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   zhh <hzzhanghanhui@corp.netease.com>
 * @module   pool/module-live/src/component/live-mobile-chat/ui
 */
NEJ.define( [
    '../live-common-chat/component.js',
    'text!./component.html',
    'css!./component.css'
],function(
    LiveMobileChat,
    html,
    css
){
    /**
     * LiveMobileChat UI组件
     *
     * @class   module:pool/module-live/src/component/live-mobile-chat/ui.LiveMobileChatUI
     * @extends module:pool/module-live/src/component/live-mobile-chat/component.LiveMobileChat
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return LiveMobileChat.$extends({
        name     : 'ux-live-pc-chat',
        css      : css,
        template : html
    });
});
