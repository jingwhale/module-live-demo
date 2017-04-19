/**
 *  Validation 容器组件实现文件
 *
 *  @version  1.0
 *  @author   edu <edu@corp.netease.com>
 *  @module   pool/component-validation/src/validation-container
 */

NEJ.define( [
    'pool/component-base/src/util'
],function(
    util
) {
    /**
     *  Validation组件
     *
     *  @example
     *  var _comp = Regular.extend({
     *       template: "<ux-validation-container ref='validations'></ux-validation-container>",
     *       data: {
     *           rule1: rule1,
     *           rule2: rule1
     *       },
     *       validate: function (event) {
     *           this.$refs.validations.validate();
     *       }
     *   });
     *
     *  new _comp({}).$inject('#mocha')
     *
     *  @class   module:pool/component-validation/src/validation-container.ValidationContainer
     *  @extends Regular
     *
     *  @param {Object}           options.data                        与视图关联的数据模型
     *  @param {boolean}          [options.data.disabled=false]       是否禁用。当禁用时验证始终通过。
     *  @param {boolean}          [options.data.onlyFirst=false]      是否只验证第一个验证失败的组件。
     *  @param {boolean}          [options.data.scroll=true]          默认滚动第一个错误处，modal请设置为false
     */
    var ValidationContainer = Regular.extend({
        name: "ux-validation-container",
        template: "{#inc this.$body}",
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method module:pool/component-validation/src/validation-container.ValidationContainer#config
         * @param  {Object} data - 与视图关联的数据模型
         * @return {void}
         */
        config: function(data){
            this.controls = [];

            util.extend(this.data, {
                /**
                 * 是否禁用,当禁用时验证始终通过,缺省为true
                 *
                 * @member {Boolean}  module:pool/component-validation/src/validation-container.ValidationContainer#disabled
                 * @member {Boolean}  module:pool/component-validation/src/validation-container.ValidationContainer#scroll
                 */
                disabled: false,
                scroll: true
            });

            this.supr(data);
        },


        /**
         * validate方法
         *
         * @public
         * @method module:pool/component-validation/src/validation-container.ValidationContainer#validate
         * @return {{success: Boolean, message: String, result: Array}}    conclusion
         */
        validate: function () {  //组件实例对象的方法
            if (this.data.disabled)
                return {
                    success: true,
                    message: 'Validation is disabled.'
                };

            var conclusion = {
                results: [],
                success: true,
                message: ''
            };
            var onlyFirst = this.data.onlyFirst,
                control;




            for(var i= 0,len=this.controls.length; i<len; i++){
                control = this.controls[i];
                //只验证第一个validate失败的，随后不验证
                if(onlyFirst&&!conclusion.success){
                    break;
                }
                var result = control.validate();
                /* istanbul ignore next */
                if(!result){
                    continue;
                }
                conclusion.results.push(result);
                if (!result.success) {
                    if(conclusion.success && this.data.scroll){
                        control.scrollToCurrent();
                    }
                    conclusion.success = false;
                    conclusion.message = conclusion.message || result.message;
                }
            }


            return conclusion;
        }
    });

    return ValidationContainer;
});
