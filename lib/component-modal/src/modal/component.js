/**
 *  Modal 组件实现文件
 *
 *  @version  1.0
 *  @author   edu <edu@corp.netease.com>
 *  @module   module:pool/component-modal/src/modal.Modal
 *  @extends  module:pool/component-base/src/base.Base
 */

NEJ.define( [
    'pool/component-base/src/base',
    'pool/component-drag-drop/src/draggable',
    'pool/component-button/src/button/ui',
    'pool/component-base/src/util'
],function(
    Base,
    Draggable,
    ButtonUI,
    util
) {
    /**
     *  Modal组件
     *
     * NEJ.define([
     *      'pool/component-modal/src/modal'
     * ],function(
     *      Modal
     * ){
     *      var modal = new Modal({
     *          data:{
     *              title: 'test',
     *              total: 'content test'
     *          }
     *      });
     *      modal.$on('close',function(event){
     *          // event
     *      });
     * });
     *
     *  @class   module:pool/component-modal/src/modal.Modal
     *  @extends module:pool/component-base/src/base.Base
     *
     *  @param {object}  options.data                                          - 绑定属性 | Binding Properties
     *  @param {string}  [options.data.title='提示']                           - 对话框标题 | Title of Dialog
     *  @param {string}  [options.data.content='']                             - 对话框内容,局部content，也支持模板
     *  @param {string}  [options.data.contentTemplate='']                     - 对话框内容全部自定义，支持模板
     *  @param {string|boolean}  [options.data.okButton=true]                  - 是否显示确定按钮。值为`string`时显示该段文字。
     *  @param {string|boolean}  [options.data.cancelButton=false]             - 是否显示取消按钮。值为`string`时显示该段文字。
     *  @param {boolean} [options.data.draggable=false]                        - 是否可以拖拽对话框
     *  @param {string}  [options.data.type="warning, info, error, success"]   - 显示的图标样式
     *  @param {string}  [options.data.class='']                               - 补充class
     *  @param {string}  [options.data.notDestroy='']                          - notDestroy设置为true阻止modal销毁
     *  @param {string}  [options.data.maskClickHide=false]                    - 点击遮罩关闭弹窗，默认关闭该功能
     *  @param {String}  options.template                                      - 组件关联视图结构
     */
    /**
     * 关闭对话框时触发事件
     *
     * @example
     *
     * NEJ.define([
     *      'pool/component-modal/src/modal'
     * ],function(
     *      Modal
     * ){
     *      var modal = new Modal({
     *          data:{
     *              title: 'test',
     *              total: 'content test'
     *          }
     *      });
     *      modal.$on('close',function(event){
     *          // event
     *      });
     * });
     *
     * @event    module:pool/component-modal/src/modal.Modal#close
     * @param   {boolean} result 点击了确定(true)还是取消(false)
     */
    /**
     * 点击确定按钮时触发事件
     *
     * @event    module:pool/component-modal/src/modal.Modal#ok
     */
    /**
     * 点击取消按钮时触发事件
     *
     * @event    module:pool/component-modal/src/modal.Modal#cancel
     */
    var Modal = Base.$extends({
        name: "ux-modal",
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method module:pool/component-modal/src/modal.Modal#config
         * @param  {Object} data - 与视图关联的数据模型
         * @return {void}
         */
        config: function(data){
            util.extend(this.data, {
                /**
                 * 默认弹窗标题
                 *
                 * @member {string} module:pool/component-modal/src/modal.Modal#title
                 */
                title: '',
                /**
                 * 默认弹窗内容
                 *
                 * @member {string} module:pool/component-modal/src/modal.Modal#content
                 */
                content: '',
                /**
                 * 自定义弹窗内容模板
                 *
                 * @member {string} module:pool/component-modal/src/modal.Modal#contentTemplate
                 */
                /**
                 * 是否显示确定按钮，值为`string`时显示该段文字。
                 *
                 * @member {string|boolean} module:pool/component-modal/src/modal.Modal#okButton
                 */
                okButton: true,
                /**
                 * 是否显示取消按钮，值为`string`时显示该段文字。
                 *
                 * @member {string|boolean} module:pool/component-modal/src/modal.Modal#cancelButton
                 */
                cancelButton: false,
                /**
                 * 是否可以拖动
                 *
                 * @member {string|boolean} module:pool/component-modal/src/modal.Modal#draggable
                 */
                draggable: false,
                /**
                 * 弹窗类型
                 *
                 * @member {string} module:pool/component-modal/src/modal.Modal#type
                 */
                type:"warning",
                /**
                 * 是否点击遮罩隐藏弹窗，默认关闭
                 *
                 * @member {boolean} module:pool/component-modal/src/modal.Modal#maskClickHide
                 */
                maskClickHide: false
            });
            this.supr(data);
        },

        /**
         * 模板编译之后(即活动dom已经产生)被调用. 可以在这里处理一些与dom相关的逻辑
         * 如果不是内嵌组件，则嵌入到document.body中,这样就不要$inject
         *
         * @protected
         * @method module:pool/component-modal/src/modal.Modal#init
         * @return {void}
         */
        init: function(){
            this.supr();
            if (this.$root === this){
                this.$inject(document.body);
            }
        },

        /**
         * 组件销毁策略
         *
         * @protected
         * @method module:pool/component-modal/src/modal.Modal#destroy
         * @return {void}
         */
        destroy:function(){
            this.supr();

        },
        /**
         * 点击阴影
         *
         * @protected
         * @method module:pool/component-modal/src/modal.Modal#clickMask
         * @return {void}
         */
        clickMask: function(){
            if(this.data.maskClickHide){
                this.cancel();
            }
        },
        /**
         * 阻止事件冒泡
         *
         * @protected
         * @method module:pool/component-modal/src/modal.Modal#cancelProgation
         * @return {void}
         */
        cancelProgation: function(event){
            if(this.data.maskClickHide){
                event.stopPropagation();
            }
        },

        /**
         * 关闭对话框
         *
         * @public
         * @method  module:pool/component-modal/src/modal.Modal#close
         * @param  {boolean} result 点击确定还是取消
         * @return {void}
         */
        close: function (result) {
            this.$emit('close', {
                result: result
            });
            if(result == "null"){
                this.destroy();
                return;
            }else{
                result ? this.ok() : this.cancel();
            }
        },

        /**
         * 点击对话框确定按钮
         *
         * @public
         * @method @method  module:pool/component-modal/src/modal.Modal#ok
         * @return {void}
         */
        ok: function () {
            this.$emit('ok');
            if(this.data.notDestroy){
                this.data.notDestroy = false;
                return;
            }
            this.destroy();
        },
        /**
         * 点击对话框取消按钮
         *
         * @public
         * @method @method  module:pool/component-modal/src/modal.Modal#cancel
         * @return {void}
         */
        cancel: function () {
            this.$emit('cancel');
            this.destroy();
        },
        /**
         * 开始拖动时触发
         *
         * @private
         * @method  module:pool/component-modal/src/modal.Modal#onDragStart
         * @param  {event} $event 拖拽事件对象
         * @return {void}
         */
        onDragStart: function ($event) {
            var dialog = $event.proxy;
            dialog.style.left = dialog.offsetLeft + 'px';
            dialog.style.top = dialog.offsetTop + 'px';
            dialog.style.zIndex = '1000';
            dialog.style.position = 'absolute';
        }
    });

    return Modal;
});
