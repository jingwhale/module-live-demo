/**
 * LivePcPlayerUI 组件实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 * @module   pool/module-live/src/component/live-pc-player/ui
 */
NEJ.define([
    './component.js',
    'text!./component.html',
    'css!./component.css'
],function(
    LivePcPlayer,
    html,
    css
){ 
    /**
     * LivePcPlayerUI组件
     *
     * @class   module:pool/module-live/src/component/live-pc-player/ui.LivePcPlayerUI
     * @extends module:pool/component-base/src/base.Base
     *
     * @param {Object}  options                                                         - 组件构造参数
     * @param {Object}  options.data                                                    - 与视图关联的数据模型，主要是播放器的配置
     */    
    return LivePcPlayer.$extends({
        name     : 'ux-live-pc-player',
        css      : css,
        template : html
    });
});
