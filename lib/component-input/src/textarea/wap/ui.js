/**
 *  InputUI文件
 *
 *  @version  1.0
 *  @author   hzshaoyy <hzshaoyy@corp.netease.com>
 *  @module   pool/component-input/src/textarea/wap/ui
 */

NEJ.define( [
    '../component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    Textarea,
    html,
    css
) {
    /**
     *  InputUI组件
     *
     *  @class   module:pool/component-input/src/textarea/ui.TextareaUI
     *  @extends module:pool/component-input/src/textarea/ui.Textarea
     *
     *  @param {Object} options
     *  @param {Object} options.data 与视图关联的数据模型
     */
    return Textarea.$extends({
        name: 'ux-textarea',
        template: html,
        css: css
    });
});
