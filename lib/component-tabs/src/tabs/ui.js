/**
 * TabsUI 组件实现文件
 *
 * @version  1.0
 * @author   hzwuyao <hzwuyao1@corp.netease.com>
 * @module   pool/component-tabs/src/tabs/ui
 */
NEJ.define( [
    './component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    Tabs,
    html,
    css
){
    /**
     * Tabs UI组件
     *
     * @class   module:pool/component-tabs/src/tabs/ui.TabsUI
     * @extends module:pool/component-tabs/src/tabs.Tabs
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Tabs.$extends({
        name     : 'ux-tabs',
        css      : css,
        template : html
    });
});
