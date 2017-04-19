/**
 *  InputUI文件
 *
 *  @version  1.0
 *  @author   hzshaoyy <hzshaoyy@corp.netease.com>
 *  @module   pool/component-input/src/input/ui
 */

NEJ.define( [
    './component.js',
    'text!./web/component.html',
    'text!./web/component.css'
],function(
    Input,
    html,
    css
) {
    /**
     *  InputUI组件
     *
     *  @class   module:pool/component-input/src/input/ui.InputUI
     *  @extends module:pool/component-input/src/input/ui.Input
     *
     *  @param {Object} options
     *  @param {Object} options.data 与视图关联的数据模型
     */
    return Input.$extends({
        name: 'ux-input',
        template: html,
        css: css
    });
});
