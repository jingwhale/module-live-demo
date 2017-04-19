/**
 * LiveManageBalance 组件实现文件
 *
 * @version  1.0
 * @author   hzyuwei <hzyuwei@corp.netease.com>
 * @module   pool/module-/src/component/live-manage-balance/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'pool/component-button/src/button/ui'
],function(
    Component,
    util
){
    /**
     * LiveManageBalance 组件
     *
     * @class   module:pool/module-/src/component/live-manage-balance/component.LiveManageBalance
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var LiveManageBalance = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-balance/component.LiveManageBalance#config
         * @returns {void}
         */
        config: function () {
            // FIXME 设置组件配置信息的默认值
            util.extend(this, {

            });
            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {
                enable: null,
                personHour: 0
            });
            this.supr();
            // TODO
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-balance/component.LiveManageBalance#init
         * @returns {void}
         */
        init: function () {
            this._handleBalanceData();
            this.supr();
        },

        /**
         * 处理直播权限及余额数据
         *
         * @private
         * @method  module:pool/module-/src/component/live-manage-balance/component.LiveManageBalance#_handleBalanceData
         * @returns {void}
         */

        _handleBalanceData: function () {
            if(this.data.enable < 10){
                //是管理员
                this.data.isAdmin = true;
            }
            if(this.data.enable%10 == 2){
                //直播未开通
                this.data.showNoService = true;
                this.$update();
                return;
            }
            this.data.price = this.data.personHour * 2;
            if (this.data.price<0) {
                this.data.priceText = '-￥' + Math.abs(this.data.price);
            } else {
                this.data.priceText = '￥' + this.data.price;
            }
            this.$update();
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/module-/src/component/live-manage-balance/component.LiveManageBalance#destroy
         * @returns {void}
         */
        destroy: function () {
            // TODO
            this.supr();
        },

        /**
         * 对外暴露接口
         *
         * @method  module:pool/module-/src/component/live-manage-balance/component.LiveManageBalance#api
         * @returns {void}
         */
        api: function () {
            // TODO
        },

        /**
         * 私有接口，外部不可调用
         *
         * @private
         * @method  module:pool/module-/src/component/live-manage-balance/component.LiveManageBalance#_api
         * @returns {void}
         */
        _api: function () {
            // TODO
        }
    });

    return LiveManageBalance;
});
