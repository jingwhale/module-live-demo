/**
 *  Validation 组件实现文件
 *
 *  @version  1.0
 *  @author   edu <edu@corp.netease.com>
 *  @module   pool/component-validation/src/validation
 */

NEJ.define( [
    'pool/component-base/src/base',
    'text!./validation.html',
    'text!./validation.css',
    'pool/cache-base/src/setting',
    'pool/component-base/src/util',
    './util/validator.js',
    './validation-container.js',
    'base/element'
],function(
    Component,
    template,
    css,
    setting,
    util,
    Validator,
    ValidationContainer,
    element
) {

    var Regular = window.Regular;
    /**
     *  Validation组件
     *
     * @example
     *
     * <ux-validation rules={rules} value={value} ref="validation"></ux-validation>
     *
     * 在组件中校验的时候可以this.$refs.validation.validate()
     *
     *
     *  @class   module:pool/component-validation/src/validation.Validation
     *  @extends Regular
     *
     *  @param {Object}                 options.data                            与视图关联的数据模型
     *  @param {Array}                  [options.data.rules=null]               传入的校验规则, 没有传值不校验或者校验始终通过
     *  @param {Array}                  [options.data.value=null]               校验的数值
     *  @param {Array}                  [options.data.class=null]               个性化类名，作用在错误提示上
     */

    /**
     * @event: module:pool/component-validation/src/validation.validated
     * @param  {String}                 options.messge                           提示信息
     * @param  {Boolean}                options.success                          校验是否正确
     */
    return Component.$extends({
        name: "ux-validation",
        template: template,
        css: css,
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method module:pool/component-validation/src/validation.Validation#config
         * @return {void}
         */
        config: function(){

            this._setting = setting.get('component-validation');

            this.supr();

            this.$watch('rules', function(newVal){
                if(newVal == '' || newVal == undefined){
                    this.data.message = '';
                    this.$update();
                }
            })
        },
        /**
         * 模板编译 之后(即活动dom已经产生)被调用. 你可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method module:pool/component-validation/src/validation.Validation#init
         * @return {void}
         */
        init: function () {
            this.addToControl();

            this.supr();
        },

        /**
         * 检测组件外部是否含有校验容器,如果有,则加入到最近一个父亲容器中去
         *
         * @private
         * @method module:pool/component-validation/src/validation.Validation#addToControl
         * @return {void}
         */
        addToControl: function () {
            var $parent = this;
            var $outer = this.$outer;

            do {
                var _isGetContainer;
                while($outer){
                    if ($outer instanceof ValidationContainer){
                        $outer.controls.push(this);
                        this.$on('destroy', function(){
                            var index = this.parentContainer.controls.indexOf(this);
                            this.parentContainer.controls.splice(index, 1);
                        });

                        this.parentContainer = $outer;
                        _isGetContainer = true;
                        break;
                    }else{
                        $outer = $outer.$outer;
                    }
                }

                if(_isGetContainer){
                    break;
                }

                $parent = $parent.$parent;
                $outer = ($parent || {}).$outer;

            } while($parent)
        },
        /**
         * 页面滚动到这个校验的dom节点位置, 可以在外部容器中控制当出错的时候滚动到出错的校验位置
         *
         * @publich
         * @method module:pool/component-validation/src/validation.Validation#scrollToCurrent
         * @return {void}
         */
        scrollToCurrent: function () {
            var _offset = element._$offset(Regular.dom.element(this));
            window.scrollTo(_offset.x, _offset.y - ((this._setting.offset || {}).y || 0));
        },

        /**
         * 校验方法
         *
         * @publich
         * @method module:pool/component-validation/src/validation.Validation#validate
         * @return {{success: Boolean, message: String}}    conclusion
         */
        validate: function (value, isRealTime) {
            var  conclusion = {
                    success: true,
                    message: ""
                },
                success = true,
                rule;

            if(value === undefined){
                value = this.data.value;
            }

            if(!this.data.rules || this.data.rules.length == 0){
                return conclusion;
            }

            for(var i= 0, len=this.data.rules.length; i<len; i++){
                rule = this.data.rules[i];

                switch (rule.type){
                    case 'is':
                        success = rule.reg.test(value);//个性化的正则表达式校验
                        break;
                    case 'isRequired':
                        success = !!Validator.toString(value);
                        break;
                    case 'isFilled':
                        success = !!Validator.toString(value).trim();
                        break;
                    case 'isEmail':
                        success = Validator.isEmail(value);
                        break;
                    case 'isMobilePhone':
                        success = Validator.isMobilePhone(value, 'zh-CN');
                        break;
                    case 'isURL':
                        success = Validator.isURL(value);
                        break;
                    case 'isNumber':
                        success = Validator.isInt(value, rule);  //同int
                        break;

                    case 'isId':
                        success = Validator.isId(value); //isInt 的首位不能为0， isID可以
                        break;
                    case 'isInt':
                        success = Validator.isInt(value, rule);
                        break;
                    case 'isFloat':
                        success = Validator.isFloat(value, rule);
                        break;
                    case 'isSoftDecimal2':
                        success = Validator.isSoftDecimal2(value, rule.min, rule.max);
                        break;
                    case 'isLength':
                        success = Validator.isLength(value, rule.min, rule.max);
                        break;
                    case 'inputTips':
                        conclusion = Validator.inputTips(value, rule.min, rule.max, isRealTime||this.data.isRealTime, rule.afterText);
                        break;
                    default:
                        if(!rule.method){
                            conclusion = {
                                success: false,
                                message: "找不到此规则的校验方法"
                            }
                        }else {
                            success = rule.method(value); //个性化函数,校验特定的变量+特定规则
                        }
                        break;
                }
                if(!success || !conclusion.success){
                    conclusion.message = rule.message || conclusion.message;
                    conclusion.success = false;
                    break; // 有错误则跳出
                }else{
                    this.data.message = '';
                }
            }

            this.data.message = conclusion.message;
            this.data.success = conclusion.success;
            this.data.state = conclusion.success ? 'success' : 'error';
            this.$update();

            return conclusion;
        },
        /**
         * 模板销毁
         *
         * @protected
         * @method module:pool/component-validation/src/validation.Validation#destroy
         * @return {void}
         */
        destroy: function () {
            // {#if a} <A_UI>{/if} 当a true/false A_UI是会被销毁||再创建

            this.supr();
        }
    });
});
