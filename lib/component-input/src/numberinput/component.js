
/**
 *  numberInput 类文件
 *
 *  @version  1.0
 *  @author   hzshaoyy <hzshaoyy@corp.netease.com>
 *  @module   pool/component-input/src/numberinput/component
 */

NEJ.define([
    '../base/ui.js',
    'pool/component-base/src/util',
    'pool/component-button/src/button/ui'
], function(
Component,
util) {
    /**
     * textarea组件基类
     *
     * @example
     * new NumberInput({
     *     data: {}
     * }).$inject('#j-parentNode');
     *
     * @class  module:pool/component-input/src/numberinput/component.NumberInput
     * @extends module:pool/component-input/src/base/component.BaseInput
     *
     * @param {object}              options.data                            绑定属性
     * @param {string}              [options.data.value=0]                  数值
     * @param {Number}              [options.data.step=1]                   步进的值
     * @param {Number}              [options.data.min=1]                    最小值
     * @param {Number}              [options.data.max=1]                    最大值
     *
     */
    var NumberInput = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method module:pool/component-input/src/numberinput/component.NumberInput#config
         * @return {Void}
         */
        config: function() {

            util.extend(this.data, {
                /**
                 * 数值
                 *
                 * @member {Number} module:pool/component-input/src/numberinput/component.NumberInput#value
                 */
                value: 0,
                /**
                 * 步进的值
                 *
                 * @member {Number} module:pool/component-input/src/numberinput/component.NumberInput#step
                 */
                step: 1,
                /**
                 * 最小值
                 *
                 * @member {Number} module:pool/component-input/src/numberinput/component.NumberInput#min
                 */
                min: undefined,
                /**
                 * 最大值
                 *
                 * @member {Number} module:pool/component-input/src/numberinput/component.NumberInput#max
                 */
                max: undefined
            });

            this.supr();

            this.$watch(['min', 'max'], function(min, max) {
                if (!isNaN(min) && !isNaN(max) && min - max > 0) throw new NumberInput.NumberRangeError(min, max);

                // 如果超出数值范围，则设置为范围边界的数值
                this.data.value = this._isOutOfRange(this.data.value);
            });
        },
        /**
         * 调整数值
         *
         * @method module:pool/component-input/src/numberinput/component.NumberInput#add
         * @public
         * @param  {number} [value=0] 加/减的值
         * @return {number} value 计算后的值
         */
        add: function(value) {
            if (this.data.readonly || this.data.disabled || !value) return;

            if (isNaN(value)) throw new TypeError(value + ' is not a number!');

            this.data.value = this._isOutOfRange(this.data.value += value);

            /**
             * 数值改变时触发
             *
             * @event module:pool/component-input/src/numberinput/component.NumberInput#change
             * @property {number} value 改变后的数值
             */
            this.$emit('change', {
                value: this.data.value
            });

            return this.data.value;
        },
        /**
         * 是否超出规定的数值范围
         *
         * @method module:pool/component-input/src/numberinput/component.NumberInput#_isOutOfRange
         * @private
         * @param {number} value 待测的值
         * @return {boolean} number 如果没有超出数值范围，则返回false；如果超出数值范围，则返回范围边界的数值
         */
        _isOutOfRange: function(value) {
            var min = +this.data.min;
            var max = +this.data.max;

            // min && value < min && min，先判断是否为空，再判断是否超出数值范围，如果超出则返回范围边界的数值
            if (!isNaN(min) && value < min) {
                return max;
            } else if (!isNaN(max) && value > max) {
                return min;
            }

            return value;
        }
    }).filter({
        number: {
            get: function(value) {
                value = '' + (value || 0);
                if (this.data.format) return this.data.format.replace(new RegExp('\\d{0,' + value.length + '}$'), value);
                return value;
            },
            set: function(value) {
                return +value;
            }
        }
    });

    var NumberRangeError = function(min, max) {
        this.type = 'NumberRangeError';
        this.message = 'Wrong Number Range where `min` is ' + min + ' and `max` is ' + max + '!';
    };
    NumberRangeError.prototype = Object.create(RangeError.prototype);
    NumberInput.NumberRangeError = NumberRangeError.prototype.constructor = NumberRangeError;

    return NumberInput;
}); 
