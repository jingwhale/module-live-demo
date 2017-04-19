/**
 * LiveManageBalanceUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzyuwei <hzyuwei@corp.netease.com>
 * @module   pool/module-/src/component/live-manage-balance/ui
 */
NEJ.define( [
    './component.js',
    'text!./component.html',
    'css!./component.css'
],function(
    LiveManageBalance,
    html,
    css
){
    /**
     * LiveManageBalance UI组件
     *
     * @class   module:pool/module-/src/component/live-manage-balance/ui.LiveManageBalanceUI
     * @extends module:pool/module-/src/component/live-manage-balance/component.LiveManageBalance
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return LiveManageBalance.$extends({
        name     : 'um--live-manage-balance',
        css      : css,
        template : html
    });
});
