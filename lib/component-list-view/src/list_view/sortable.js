/**
 * 可排序能力支持实现文件
 *
 * @version  1.0
 * @author   caijf <caijf@corp.netease.com>
 * @module   pool/component-list-view/src/list_view/sortable
 */
NEJ.define([
    'base/event',
    'base/element'
],function (
    v, e
) {
    /**
     * 可排序指令开关
     *
     * <div ex-sortable='true'
     *      data-item='j-item'
     *      data-holder='j-holder'>
     *    <div class="j-item" data-id="1"><span class="j-holder"></span>1</div>
     *    <div class="j-item" data-id="2"><span class="j-holder"></span>2</div>
     *    <div class="j-item" data-id="3"><span class="j-holder"></span>3</div>
     *    <div class="j-item" data-id="4"><span class="j-holder"></span>4</div>
     * </div>
     */
    Regular.directive('ex-sortable',function (element, value) {
        // dump config
        var itemClass = e._$dataset(element,'item')||'j-item',
            holdClass = e._$dataset(element,'holder')||'j-item',
            mover = null, item = null, holder = null, delta = null;
        // mouse down handler
        var onMouseDown = function (event) {
            if (!mover){
                mover = v._$getElement(event,'c:'+holdClass);
                if (!mover){
                    return;
                }
                item = e._$getParent(mover,'c:'+itemClass);
                holder = item.cloneNode(true);
                e._$addClassName(holder,'z-holder');
                var offset = e._$offset(item),
                    page = v._$page(event);
                delta = {
                    x: offset.x-page.x,
                    y: offset.y-page.y
                };
            }
        };
        // mouse move handler
        var onMouseMove = function (event) {
            if (!mover){
                return;
            }
            item.style.visibility = 'hidden';
            document.body.appendChild(holder);
            var page = v._$page(event);
            holder.style.top = page.y+delta.y+'px';
            holder.style.left = page.x+delta.x+'px';
        };
        // mouse up handler
        var onMouseUp = function (event) {
            if (!mover){
                return;
            }
            mover = null;
            e._$remove(holder);
            item.style.visibility = 'visible';
        };

        // add event
        var doAddEvent = function () {
            v._$addEvent(document,'mouseup',onMouseUp);
            v._$addEvent(element,'mousedown',onMouseDown);
            v._$addEvent(document,'mousemove',onMouseMove);
        };

        // clear event
        var doClearEvent = function () {
            v._$delEvent(document,'mouseup',onMouseUp);
            v._$delEvent(element,'mousedown',onMouseDown);
            v._$delEvent(document,'mousemove',onMouseMove);
        };

        // watch sortable toggle
        this.$watch(value, function (newValue) {
            if (newValue==='false'||newValue===false){
                doClearEvent();
            }else{
                doAddEvent();
            }
        });

        // destroy directive
        return function () {
            doClearEvent();
        };
    });

});


