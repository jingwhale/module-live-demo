/**
 * ButtonCopy 组件实现文件
 *
 * @version  1.0
 * @author   hzshaoyy <hzshaoyy@corp.netease.com>
 * @module   pool/component-button/src/button-copy/component
 */
NEJ.define([
    '../button/component.js',
    'pool/component-base/src/util',
    'base/config',
    'base/util',
    'base/element',
    'util/flash/flash',
    'pool/component-notify/src/notify/ui',
],function(
    Component,
    util,
    c,
    u,
    e,
    t0,
    Notify
){
    /**
     * ButtonCopy 组件
     *
     * 绑定复制操作，服务器放置剪切板操作Flash nej_clipboard.swf，
     * 如果flash文件不在/res/下可以通过以下方式配置
     *
     * 脚本举例
     * ```javascript
     *   // 在引入define之前配置NEJ
     *   window.NEJ_CONF ={
     *       clipboard:'/other/path/nej_clipboard.swf'
     *   };
     * ```
     *
     * @class   module:pool/component-button/src/button-copy/component.ButtonCopy
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var ButtonCopy = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-button/src/button-copy/component.ButtonCopy#config
         * @returns {void}
         */
        config: function () {
            // 设置组件配置信息的默认值
            util.extend(this, {

            });
            // 设置组件视图模型的默认值
            util.extend(this.data, {
                /**
                 * 需要拷贝的内容
                 * 
                 * @member module:pool/component-button/src/button-copy/component.ButtonCopy#copyValue
                 */
                copyValue: "",
                /**
                 * 拷贝成功提示信息
                 * 
                 * @member module:pool/component-button/src/button-copy/component.ButtonCopy#copySuccessText
                 */
                copySuccessText: "拷贝成功"
            });
            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-button/src/button-copy/component.ButtonCopy#init
         * @returns {void}
         */
        init: function () {
            this.supr();

            /* istanbul ignore next */
            this._doCoverClipboard({
                onbeforecopy:function(){
                    Notify.show(this.data.copySuccessText, "success");
                    return this.data.copyValue;
                }._$bind(this)
            });
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-button/src/button-copy/component.ButtonCopy#destroy
         * @returns {void}
         */
        destroy: function () {
            this.supr();
        },

        _doCoverClipboard: function(_options){
            // build holder
            var _element = this.$refs.body,
                _box = this.$refs.box;

            // cover flash
            t0._$flash(u._$merge({
                parent:_box,
                target:_element,
                width:'100%',height:'100%',
                src:c._$get('clipboard.swf'),
                params:{wmode:'transparent',flashvars:'op=0',allowscriptaccess:'always'}
            },_options));
            return _box;
        }
    });

    return ButtonCopy;
});
