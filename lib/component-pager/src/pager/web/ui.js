/**
 *  PagerUI 组件带默认UI实现文件
 *
 *  @version  1.0
 *  @author   edu <edu@corp.netease.com>
 *  @module   pool/component-pager/src/pager/web/ui
 */
NEJ.define( [
    '../component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    Pager,
    html,
    css
) {
    /**
     *  PagerUI组件
     *
     *  @class   module:pool/component-pager/src/pager/web/ui.PagerUI
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
