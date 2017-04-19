/**
 * CascadeUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzliuzongyaun <hzliuzongyaun@corp.netease.com>
 * @module   pool/component-dropdown/src/cascade/ui
 */
NEJ.define([
    '../component.js',
    'text!./component.html',
    'css!./component.css',
    '../../dropdown/web/ui.js'
], function (Cascade,
             html,
             css) {
    /**
     * Cascade UI组件
     *
     * @class   module:pool/component-dropdown/src/cascade/ui.CascadeUI
     * @extends module:pool/component-cascade/src/cascade.Cascade
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    return Cascade.$extends({
        name: 'ux-dropdown-cascade',
        css: css,
        template: html,
        config: function () {
            this.flag = false;  //用于记录xSelect是否执行过
            this.supr();
        },
        // 暂时只支持selectedIds,并且只支持已有数据   TODO reset会导致dropdown出问题;$update('value',...)可以更新dropdown
        reset: function (opts, callback) {
            callback = callback ? callback : function () {
            };
            var selectedIds = opts.selectedIds || [];

            for (var i = 0; i < selectedIds.length; i++) {
                this._select(selectedIds[i],i,null,true,false);
            }

            callback();
        },
        select: function (id, level) {
           this._select(id,level);
        }
    });
});
