/**
 * NotifyUI 组件带默认UI实现文件
 *
 * @version  1.0
 * @author   hzlixinxin <hzlixinxin@corp.netease.com>
 * @module   pool/component-notify/src/notify/ui
 */
NEJ.define( [
    './component.js',
    'text!./component.html',
    'text!./component.css'
],function(
    Notify,
    html,
    css
){
    /**
     * Notify UI组件
     *
     * @class   module:pool/component-notify/src/notify/ui.NotifyUI
     * @extends module:pool/component-notify/src/notify.Notify
     *
     * @param {Object} options
     * @param {Object} options.data 与视图关联的数据模型
     */
    var NotifyUI = Notify.$extends({
        name     : 'ux-notify',
        css      : css,
        template : html
    });

    /**
     * 直接初始化一个实例
     * @state {Notify}
     */
    var notify = new NotifyUI();
    var METHODS = ['show', 'close', 'closeAll', 'success', 'warning', 'info', 'error', 'setPosition'];
    
    NotifyUI.notify = notify;
    NotifyUI.METHODS = METHODS;
    /**
     *  弹出一个消息
     *
     * @method module:pool/component-notify/src/notify/component.Notify.show
     * @public
     * @param  {string} [text=''] 消息内容
     * @param  {string} [state=null] 消息状态，可选参数：`info`、`success`、`warning`、`error`
     * @param  {number} [duration=notify.duration] 该条消息的停留毫秒数。如果为0，则表示消息常驻不消失。如果不填，则使用notify默认的duration。
     * @return {void}
     */
    /**
     * 弹出特殊类型的消息。为show方法的简写方式。
     *
     * @method module:pool/component-notify/src/notify/component.Notify.success
     * @public
     * @param  {string} [text=''] 消息内容
     * @param  {number} [duration=notify.duration] 该条消息的停留毫秒数。如果为0，则表示消息常驻不消失。如果不填，则使用notify默认的duration。
     * @return {void}
     */
    /**
     * 弹出特殊类型的消息。为show方法的简写方式。
     *
     * @method module:pool/component-notify/src/notify/component.Notify.warning
     * @public
     * @param  {string} [text=''] 消息内容
     * @param  {number} [duration=notify.duration] 该条消息的停留毫秒数。如果为0，则表示消息常驻不消失。如果不填，则使用notify默认的duration。
     * @return {void}
     */
    /**
     * 弹出特殊类型的消息。为show方法的简写方式。
     *
     * @method module:pool/component-notify/src/notify/component.Notify.info
     * @public
     * @param  {string} [text=''] 消息内容
     * @param  {number} [duration=notify.duration] 该条消息的停留毫秒数。如果为0，则表示消息常驻不消失。如果不填，则使用notify默认的duration。
     * @return {void}
     */
    /**
     * 弹出特殊类型的消息。为show方法的简写方式。
     *
     * @method module:pool/component-notify/src/notify/component.Notify.error
     * @public
     * @param  {string} [text=''] 消息内容
     * @param  {number} [duration=notify.duration] 该条消息的停留毫秒数。如果为0，则表示消息常驻不消失。如果不填，则使用notify默认的duration。
     * @return {void}
     */
    /**
     * 关闭某条消息
     *
     * @method module:pool/component-notify/src/notify/component.Notify.close
     * @public
     * @param  {object} message 需要关闭的消息对象
     * @return {void}
     */
    /**
     * 关闭所有消息
     *
     * @method module:pool/component-notify/src/notify/component.Notify.closeAll
     * @public
     * @return {void}
     */
    /**
     * 设置notify的位置 可选参数：`topcenter`、`topleft`、`topright`、`bottomcenter`、`bottomleft`、`bottomright`、`static`
     *
     * @method module:pool/component-notify/src/notify/component.Notify.setPosition
     * @public
     * @return {void}
     */
    METHODS.forEach(function (method) {
        NotifyUI[method] = notify[method].bind(notify);
    });

    return NotifyUI;
});
