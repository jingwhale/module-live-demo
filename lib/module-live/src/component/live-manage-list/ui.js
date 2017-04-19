/**
 * LiveManageListUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzyuwei <hzyuwei@corp.netease.com>
 * @module   pool/module-/src/component/live-manage-list/ui
 */
NEJ.define( [
    './component.js',
    'text!./component.html',
    'css!./component.css'
],function(
    LiveManageList,
    html,
    css
){
    /**
     * LiveManageList UI组件
     *
     * @class   module:pool/module-/src/component/live-manage-list/ui.LiveManageListUI
     * @extends module:pool/module-/src/component/live-manage-list/component.LiveManageList
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return LiveManageList.$extends({
        name     : 'um-live-manage-list',
        css      : css,
        template : html
    });
});
