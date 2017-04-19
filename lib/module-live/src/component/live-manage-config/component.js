/**
 * LiveManageConfig 组件实现文件
 *
 * @version  1.0
 * @author   hzyuwei <hzyuwei@corp.netease.com>
 * @module   pool/module-/src/component/live-manage-config/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'lib/base/element',
    'lib/base/event',
    'pool/edu-front-util/src/domUtil',
    'pool/cache-live/src/live-manage/cache',
    'pool/component-notify/src/notify/ui',
    'pool/component-hover/src/hover/ui',
    'pool/component-button/src/button-copy/web/ui'
],function(
    Component,
    util,
    e,
    v,
    eu,
    LiveManageCache,
    Notify,
    hoverUI
){
    /**
     * LiveManageConfigTpl 组件
     *
     * @class   module:pool/module-/src/component/live-manage-config/component.LiveManageConfigTpl
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var LiveManageConfigTpl = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-config/component.LiveManageConfigTpl#config
         * @returns {void}
         */
        config: function () {
            // FIXME 设置组件配置信息的默认值
            util.extend(this, {

            });
            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {
                guideUrl: "#",
                clientUrl: "#",
                LiveManageCache: LiveManageCache
            });
            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-config/component.LiveManageConfigTpl#init
         * @returns {void}
         */
        init: function () {        
            this.supr();
            this.data.os = this._getOsType();
            this.$update();
        },

        /**
         * 获取用户操作系统类型
         *
         * @private
         * @method  module:pool/module-/src/live-manage/module.LiveManage#_getOsType
         * @returns 0 windows 1 mac
         */

        _getOsType: function(){
            if(navigator.platform.substring(0,3) == 'Mac'){
                return 1;
            }else{
                return 0;
            }
        },

        /**
         * 不支持用户操作系统时的直播教程点击提示
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-config/component.LiveManageConfigTpl#noGuide
         * @returns {void}
         */

        noGuide: function(){
            Notify.error("直播暂不支持您的系统");
        },

        /**
         * 不支持用户操作系统时的直播客户端下载点击提示
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-config/component.LiveManageConfigTpl#noClient
         * @returns {void}
         */

        noClient: function(){
            Notify.error("直播客户端暂不支持您的系统");
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-config/component.LiveManageConfigTpl#destroy
         * @returns {void}
         */
        destroy: function () {
            // TODO
            this.supr();
        },

        /**
         * 对外暴露接口
         *
         * @method  module:pool/module-/src/component/live-manage-config/component.LiveManageConfigTpl#api
         * @returns {void}
         */
        api: function () {
            // TODO
        },

        /**
         * 私有接口，外部不可调用
         *
         * @private
         * @method  module:pool/module-/src/component/live-manage-config/component.LiveManageConfigTpl#_api
         * @returns {void}
         */
        _api: function () {
            // TODO
        }
    });

    return LiveManageConfigTpl;
});
