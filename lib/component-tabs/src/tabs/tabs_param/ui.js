/**
 * TabsParamUI 组件实现文件(每个选项卡参数独立，不会像tabs一样公用一个params)
 *
 * @version  1.0
 * @author   hzwuyao <hzwuyao1@corp.netease.com>
 * @module   pool/component-tabs/src/tabs/tabs_param/ui
 */
NEJ.define( [
    './component.js',
    'text!../component.html',
    'text!../component.css'
],function(
    Tabs,
    html,
    css
){
    /**
     * TabsParamUI UI组件
     *
     * @class   module:pool/component-tabs/src/tabs/tabs_param/ui.TabsParamUI
     * @extends module:pool/component-tabs/src/tabs.Tabs
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Tabs.$extends({
        name     : 'ux-tabs-param',
        css      : css,
        template : html
    });
});
