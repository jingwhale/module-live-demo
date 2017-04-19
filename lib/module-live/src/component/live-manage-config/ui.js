/**
 * LiveManageConfigTplUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzyuwei <hzyuwei@corp.netease.com>
 * @module   pool/module-/src/component/live-manage-config-tpl/ui
 */
NEJ.define( [
    './component.js',
    'text!./component.html',
    'css!./component.css'
],function(
    LiveManageConfigTpl,
    html,
    css
){
    /**
     * LiveManageConfigTpl UI组件
     *
     * @class   module:pool/module-/src/component/live-manage-config-tpl/ui.LiveManageConfigTplUI
     * @extends module:pool/module-/src/component/live-manage-config-tpl/component.LiveManageConfigTpl
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return LiveManageConfigTpl.$extends({
        name     : 'um-live-manage-config',
        css      : css,
        template : html
    });
});
