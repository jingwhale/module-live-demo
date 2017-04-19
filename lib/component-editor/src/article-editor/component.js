/**
 * ArticleEditor 组件实现文件
 *
 * @version  1.0
 * @author   hzshaoyy <hzshaoyy@corp.netease.com>
 * @module   pool/module-editor/src/component/article-editor/component
 */
NEJ.define([
    '../editor/component.js',
    'text!./web/component.css',
    'pool/component-base/src/util',
    '../editor/key.js',
    './setting.js'
],function(
    Component,
    editorStyle,
    util,
    key,
    conf
){
    /**
     * ArticleEditor 组件
     *
     * @class   module:pool/module-editor/src/component/article-editor/component.ArticleEditor
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var ArticleEditor = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/module-editor/src/component/article-editor/component.ArticleEditor#config
         * @returns {void}
         */
        config: function () {

            this._flushSetting(key, conf);

            util.extend(this, {

            });
            util.extend(this.data, {
                editorStyle: editorStyle
            });
            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/module-editor/src/component/article-editor/component.ArticleEditor#init
         * @returns {void}
         */
        init: function () {
            this.supr();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/module-editor/src/component/article-editor/component.ArticleEditor#destroy
         * @returns {void}
         */
        destroy: function () {
            this.supr();
        }
    });

    return ArticleEditor;
});
