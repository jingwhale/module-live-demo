/**
 *  PagerUI 组件带默认UI实现文件
 *
 *  @version  1.0
 *  @author   edu <edu@corp.netease.com>
 *  @module   pool/component-pager/src/pager_ui
 */
NEJ.define( [
    './pager/component.js',
    'text!./pager/web/component.html',
    'text!./pager/web/component.css'
],function(
    Pager,
    html,
    css
) {
    /**
     *  PagerUI组件
     *
     *  @class   module:pool/component-pager/src/pager_ui.PagerUI
     *  @extends module:pool/component-pager/src/pager/component.Pager
     *
     *  @param {Object} options
     *  @param {Object} options.data 与视图关联的数据模型
     */
    return Pager.$extends({
        name     : 'ux-pager',
        css      : css,
        template : html
    });
});
