/**
 * Created by cqh on 16/9/18.
 * ------------------------------------------
 *
 * @version  1.0
 * @author   陈钦辉(hzchenqinhui@corp.netease.com)
 * @path   pool/component-drag-drop/test/eventUtil
 * ------------------------------------------
 */

NEJ.define([
],function (
){
    var obj = {};

     function createEvent(type){
         return function(config) {
             var event =document.createEvent('MouseEvent');

             event.initMouseEvent (
                 type, // 事件类型
                 true, // 是否冒泡
                 true, // 是否可以取消
                 window,
                 0,
                 config.screenX, // 事件相当于屏幕x
                 config.screenY, // 事件相当于屏幕y
                 config.clientX, // 事件相当于视口x
                 config.clientY, // 事件相当于视口y
                 config.ctrlKey, // 是否按了ctrl
                 config.altKey ,  // 是否按了alt
                 config.shiftKey, // 是否按了shift
                 config.metaKey,  // 是否按了meta
                 0, // 鼠标左右键按下，默认0左键
                 null
             );
             return event;
         };
     }
    obj.createMouseDownEvent = createEvent('mousedown');
    obj.createMouseMoveEvent = createEvent('mousemove');
    obj.createMouseUpEvent = createEvent('mouseup');

    return obj;
});