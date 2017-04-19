/**
 * Notify 组件实现文件
 *
 * @version  1.0
 * @author   hzlixinxin <hzlixinxin@corp.netease.com>
 * @module   pool/component-notify/src/notify/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util'
],function(
    Component,
    util
){
    var DURATION_ZERO = 0,
        MESSAGE_COUNT_ZERO = 0,
        MESSAGE_INDEX_ZERO = 0,
        MESSAGE_SPLICE_LENGTH = 1;
    /**
     * Notify 组件
     *
     * @class   module:pool/component-notify/src/notify/component.Notify
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object}              options      - 组件构造参数
     * @param {Object}              options.data - 与视图关联的数据模型
     * @param {string}              [options.data.message=[]]                   消息列表
     * @param {string}              [options.data.position='topcenter']         通知的位置，可选参数：
     *                                                                          `topcenter`、`topleft`、`topright`、
     *                                                                          `bottomcenter`、`bottomleft`、`bottomright`、`static`
     * @param {number}              [options.data.duration=2000]                每条消息默认的停留毫秒数，如果为0，则表示消息常驻不消失。
     * @param {boolean}             [options.data.single=false]                 是否始终显示一条
     * @param {string}              [options.data.class='']                     补充class
     */

    /**
     * @event close 关闭某条消息时触发
     * @property {object} sender 事件发送对象
     * @property {object} message 关闭了的消息对象
     */
    var Notify = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-notify/src/notify/component.Notify#config
         * @returns {void}
         */
        config: function () {

            //设置组件视图模型的默认值
            util.extend(this.data, {
                /**
                 * 消息列表
                 *
                 * @member module:pool/component-notify/src/notify/component.Notify#messages
                 * @returns {void}
                 */
                "messages": [],
                /**
                 * notify出现的位置
                 *
                 * @member  module:pool/component-notify/src/notify/component.Notify#position
                 * @returns {void}
                 */
                "position": 'topcenter',
                /**
                 * notify淡入淡出的时间
                 *
                 * @member  module:pool/component-notify/src/notify/component.Notify#duration
                 * @returns {void}
                 */
                "duration": 2000,
                /**
                 * 是否始终显示一条
                 *
                 * @member  module:pool/component-notify/src/notify/component.Notify#single
                 * @returns {void}
                 */
                "single": false,
                /**
                 * 追加的样式
                 *
                 * @member  module:pool/component-notify/src/notify/component.Notify#class
                 * @returns {void}
                 */
                "class": ""
            });

            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-notify/src/notify/component.Notify#init
         * @returns {void}
         */
        init: function () {
            this.supr();

            // 如果不是内嵌组件，则嵌入到document.body中
            if (this.$root === this) {
                this.$inject(document.body);
            }
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-notify/src/notify/component.Notify#destroy
         * @returns {void}
         */
        destroy: function () {
            
            this.supr();
        },

        /**
         * 弹出一个消息
         * @public
         * @method module:pool/component-notify/src/notify/component.Notify#show 
         * @param  {string} [text=''] 消息内容
         * @param  {string} [state='success'] 消息状态，可选参数：`info`、`success`、`warning`、`error`
         * @param  {number} [duration=notify.duration] 该条消息的停留毫秒数。如果为0，则表示消息常驻不消失。如果不填，则使用notify默认的duration。
         * @return {void}
         */
        show: function (text, state, duration) {
            var message = {
                text: text,
                state: state || 'success',
                duration: duration >= DURATION_ZERO ? +duration : +this.data.duration,
                counter: 0
            };
            var messages = this.data.messages;

            if (this.data.single && messages[MESSAGE_INDEX_ZERO]) {
                message = util.extend(messages[MESSAGE_INDEX_ZERO], message, true);
                message.counter++;
            } else {
                messages.unshift(message);
                message.counter = MESSAGE_COUNT_ZERO;
            }

            this.$update();

            if (message.duration) {
                window.setTimeout(function () {
                    if (!message.counter) {
                        this.close(message);
                    }
                    else {
                        message.counter--;
                    }
                }.bind(this), message.duration);
            }

            this.$emit('show', {
                sender: this,
                message: message
            });
        },

        /**
         * 关闭某条消息
         *
         * @method module:pool/component-notify/src/notify/component.Notify#close
         * @public
         * @param  {object} message 需要关闭的消息对象
         * @return {void}
         */
        close: function (message) {
            var index = this.data.messages.indexOf(message);
            if (index < MESSAGE_INDEX_ZERO) {
                return;
            }
            this.data.messages.splice(index, MESSAGE_SPLICE_LENGTH);
            this.$update();

            this.$emit('close', {
                sender: this,
                message: message
            });
        },
        /**
         * 关闭所有消息
         *
         * @method module:pool/component-notify/src/notify/component.Notify#closeAll
         * @public
         * @return {void}
         */
        closeAll: function () {
            this.data.messages = [];
            this.$update();
        },
        /**
         * 设置notify的位置 可选参数：`topcenter`、`topleft`、`topright`、`bottomcenter`、`bottomleft`、`bottomright`、`static`
         * 缺省是topcenter
         *
         * @method module:pool/component-notify/src/notify/component.Notify#setPosition
         * @public
         * @return {void}
         */
        setPosition: function (postion) {
            this.data.position = postion || 'topcenter';
        },
        /**
         * 设置notify是否只显示一条
         *
         * @method module:pool/component-notify/src/notify/component.Notify#setSingle
         * @public
         * @return {void}
         */
        setSingle: function (single) {
            this.data.single = single || false;
        }
    });

    var STATES = ['success', 'warning', 'info', 'error'];
    /**
     * success 弹出特殊类型的消息。为show方法的简写方式。
     *
     * @method module:pool/component-notify/src/notify/component.Notify#success
     * @public
     * @param  {string} [text=''] 消息内容
     * @param  {number} [duration=notify.duration] 该条消息的停留毫秒数。如果为0，则表示消息常驻不消失。如果不填，则使用notify默认的duration。
     * @return {void}
     */
    /**
     * warning  弹出特殊类型的消息。为show方法的简写方式。
     *
     * @method module:pool/component-notify/src/notify/component.Notify#warning
     * @public
     * @param  {string} [text=''] 消息内容
     * @param  {number} [duration=notify.duration] 该条消息的停留毫秒数。如果为0，则表示消息常驻不消失。如果不填，则使用notify默认的duration。
     * @return {void}
     */
    /**
     * info  弹出特殊类型的消息。为show方法的简写方式。
     *
     * @method module:pool/component-notify/src/notify/component.Notify#info
     * @public
     * @param  {string} [text=''] 消息内容
     * @param  {number} [duration=notify.duration] 该条消息的停留毫秒数。如果为0，则表示消息常驻不消失。如果不填，则使用notify默认的duration。
     * @return {void}
     */
    /**
     * error  弹出特殊类型的消息。为show方法的简写方式。
     *
     * @method module:pool/component-notify/src/notify/component.Notify#error
     * @public
     * @param  {string} [text=''] 消息内容
     * @param  {number} [duration=notify.duration] 该条消息的停留毫秒数。如果为0，则表示消息常驻不消失。如果不填，则使用notify默认的duration。
     * @return {void}
     */
    STATES.forEach(function (state) {
        Notify.prototype[state] = function (text, duration) {
            this.show(text, state, duration);
        }
    });
    
    return Notify;
});
