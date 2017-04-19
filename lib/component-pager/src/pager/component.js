/**
 * 三段分页器组件实现文件
 *
 * @version  1.0
 * @author   edu <edu@corp.netease.com>
 * @module   pool/component-pager/src/pager
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util'
],function(
    Base,
    util
) {
    // constant variables
    var PAGE_START    =  1,
        PAGE_STEPS    =  1,
        // default setting
        DEFAULT_INDEX =  1,
        DEFAULT_TOTAL =  1,
        DEFAULT_COUNT =  5,
        DEFAULT_FROM  = -1,
        DEFAULT_TO    = -2,
        // constant value
        CONST_ZERO    =  0,
        CONST_ONE     =  1,
        CONST_TOW     =  2;
    /**
     * 三段分页器业务逻辑封装，可适配于以下形式的分页器
     *
     * 此结构没有首页，末页，因为首页，末页都可点击
     *
     * ```
     *     _____    _       _   _   _   _   _       ___    _____
     *    |上一页|  |1| ... |5| |6| |7| |8| |9| ... |100|  |下一页|
     *     -----    -       -   -   -   -   -       ---    -----
     * ```
     *
     * @example
     *
     * NEJ.define([
     *      'pool/component-pager/src/pager'
     * ],function(
     *      Pager
     * ){
     *      var pager = new Pager({
     *          data:{
     *              index: 1,
     *              total: 100
     *          }
     *      });
     *      pager.$on('change',function(event){
     *          // event.last
     *          // event.index
     *          // event.total
     *      });
     *      pager.go(5);
     * });
     *
     * @class   module:pool/component-pager/src/pager.Pager
     * @extends module:pool/component-base/src/base.Base
     *
     * @param {Object}  options               - 组件构造参数
     * @param {Number} [options.count=5]      - 中间段页码显示数量，建议使用奇数页
     * @param {Object}  options.data          - 与视图关联的数据模型
     * @param {Number} [options.data.index=1] - 当前页码
     * @param {Number} [options.data.total=1] - 总页码数
     */

    /**
     * 页码变化触发事件
     *
     * @example
     *
     * NEJ.define([
     *      'pool/component-pager/src/pager'
     * ],function(
     *      Pager
     * ){
     *      var pager = new Pager({
     *          data:{
     *              index: 1,
     *              total: 100
     *          }
     *      });
     *      pager.$on('change',function(event){
     *          // event.last
     *          // event.index
     *          // event.total
     *      });
     *      pager.go(5);
     * });
     *
     * @event module:pool/component-pager/src/pager.Pager#change
     * @param {Object} event - 页码信息
     * @param {Number} event.last  - 上一次的页码
     * @param {Number} event.index - 当前的页码
     * @param {Number} event.total - 总页数
     */
    return Base.$extends({
        // computed properties
        computed: {
            /**
             * 是否有下一页操作
             *
             * @member {Boolean} module:pool/component-pager/src/pager.Pager#hasNext
             */
            hasNext: {
                get: function() {
                    return this.data.index<this.data.total;
                }
            },
            /**
             * 是否有下一页操作
             *
             * @member {Boolean} module:pool/component-pager/src/pager.Pager#hasPrev
             */
            hasPrev: {
                get: function() {
                    return this.data.index>PAGE_START;
                }
            },
            /**
             * 是否有左侧分隔符
             *
             * @member {Boolean} module:pool/component-pager/src/pager.Pager#hasLeftSep
             */
            hasLeftSep: {
                get: function() {
                    return this.data.from>CONST_ZERO&&
                        this.data.from>PAGE_START+CONST_ONE;
                }
            },
            /**
             * 是否有右侧分隔符
             *
             * @member {Boolean} module:pool/component-pager/src/pager.Pager#hasRightSep
             */
            hasRightSep: {
                get: function() {
                    return this.data.to>CONST_ZERO&&
                        this.data.to<this.data.total-CONST_ONE;
                }
            }
        },
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method module:pool/component-pager/src/pager.Pager#config
         * @param   {Object} data - 与视图关联的数据模型
         * @returns {void}
         */
        config: function() {
            // set default config
            util.extend(this, {
                // fragment count
                count: DEFAULT_COUNT
            });
            // set default view model value
            util.extend(this.data, {
                /**
                 * 当前页码
                 *
                 * @member {Number} module:pool/component-pager/src/pager.Pager#index
                 */
                index: DEFAULT_INDEX,
                /**
                 * 总页码数
                 *
                 * @member {Number} module:pool/component-pager/src/pager.Pager#total
                 */
                total: DEFAULT_TOTAL,
                /**
                 * 中间段起始页码
                 *
                 * @member {Number} module:pool/component-pager/src/pager.Pager#from
                 */
                from: DEFAULT_FROM,
                /**
                 * 中间段结束页码
                 *
                 * @member {Number} module:pool/component-pager/src/pager.Pager#to
                 */
                to: DEFAULT_TO
            });
            this.supr();
            this.$watch('index',this._onIndexUpdate._$bind(this));
            this.$watch('total',this._onTotalUpdate._$bind(this));
        },

        /**
         * 页面变化事件
         *
         * @private
         * @param   {Number} index - 变化后的页码
         * @param   {Number} last  - 变化前的页码
         * @returns {void}
         */
        _onIndexUpdate: function(index, last) {
            // calculate middle fragment position
            var count = this.count,
                left = Math.floor(count/CONST_TOW);
            this.data.from = Math.max(
                PAGE_START+CONST_ONE,
                Math.min(index-left,this.data.total-count)
            );
            this.data.to = Math.min(
                this.data.total-CONST_ONE,
                this.data.from+count-CONST_ONE
            );
            // format no middle fragment
            if (this.data.to<CONST_ZERO||
                this.data.from<CONST_ZERO||
                this.data.from>this.data.to){
                this.data.from = DEFAULT_FROM;
                this.data.to = DEFAULT_TO;
            }
            // emit change event
            if(last == index) return;
            this.$emit('change',{
                last  : last,
                index : index,
                total : this.data.total
            });
        },

        /**
         * 总数变化事件
         *
         * @private
         * @param   {Number} total - 变化后的总数
         * @param   {Number} last  - 变化前的总数
         * @returns {void}
         */
        _onTotalUpdate: function (total, last) {
            if(last == undefined) return;
            var index = this.data.index;
            this.data.total = total;
            this.data.index = Math.min(
                this.data.index,
                this.data.total
            );
            this._onIndexUpdate(
                this.data.index,index
            );
        },

        /**
         * 定位到指定页面
         *
         * @method  module:pool/component-pager/src/pager.Pager#go
         * @param   {Number} index 跳转的页码
         * @returns {void}
         */
        go: function(index) {
            // illegal page index
            if (!index||
                 index<PAGE_START||
                 index>this.data.total){
                return;
            }
            this.$update('index',index);
        },

        /**
         * 跳转到上一页
         *
         * @method  module:pool/component-pager/src/pager.Pager#prev
         * @returns {void}
         */
        prev: function() {
            this.go(this.data.index-PAGE_STEPS);
        },

        /**
         * 跳转到下一页
         *
         * @method  module:pool/component-pager/src/pager.Pager#next
         * @returns {void}
         */
        next: function() {
            this.go(this.data.index+PAGE_STEPS);
        }
    });
});
