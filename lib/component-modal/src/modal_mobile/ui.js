/**
 *  ModalUI 组件带默认UI实现文件
 *
 *  @version  1.0
 *  @author   edu <edu@corp.netease.com>
 *  @module   pool/component-modal/src/ui
 */
NEJ.define( [
    './component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    Component,
    html,
    css
) {
    /**
     *  ModalUI组件
     *
     *  @class   pool/component-modal/src/modal/ui.ModalUI
     *  @extends pool/component-base/src/base.Base
     *
     *  @param {Object} options
     *  @param {Object} options.data 与视图关联的数据模型
     */
    var umModal = Component.$extends({
        name: "um-modal",
        css: css,
        template: html
    });

    /**
     * 弹出一个alert对话框。关闭时始终触发确定事件。
     *
     * @static
     * @method module:pool/component-modal/src/modal/ui.ModalUI#alert
     * @param  {string} [content='']      - 对话框内容
     * @param  {string} [title='提示']    - 对话框标题
     * @param  {bool} [okButton= true]    - 是否展示确定按钮
     * @param  {string} [type='warning']  - 对话框类型
     * @return {Modal} modal              - 返回该对话框
     */
    umModal.alert = function (content, title, okButton,type) {
        var modal = new umModal({
            data: {
                content: content,
                title: title,
                okButton: okButton,
                type:type||'warning'
            }
        });
        return modal;
    };

    /**
     * 弹出一个confirm对话框
     *
     * @static
     * @method module:pool/component-modal/src/modal/ui.ModalUI#confirm
     * @param  {string} [content='']        - 对话框内容
     * @param  {string} [title='提示']      - 对话框标题
     * @param  {bool} [okButton= true]      - 是否展示确定按钮
     * @param  {bool} [cancelButton= true]  - 是否展示取消按钮
     * @param  {string} [type='warning']    - 对话框类型
     * @return {Modal} modal                - 返回该对话框
     */
    umModal.confirm = function (content, title, okButton, cancelButton,type) {
        var modal = new umModal({
            data: {
                content: content,
                title: title,
                okButton: okButton,
                cancelButton: cancelButton == null ? true : cancelButton,
                type:type||'warning'
            }
        });
        return modal;
    };
    return umModal;
});
