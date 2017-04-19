/**
 *  drag-drop 工具类文件
 *
 *  @version  1.0
 *  @author   cqh <cqh@corp.netease.com>
 *  @module   pool/component-drag-drop/src/util
 */
NEJ.define( [
    'pool/component-base/src/util'
],function(
    util
){
    /**
     * 获取元素相对于document边界的top,left
     *
     * @method getPosition
     * @param  {Element} elem
     * @return {Object}  {top:xx, left:xx}
     */
    util.dom.getPosition = function (elem) {
        var doc = elem && elem.ownerDocument,
            docElem = doc.documentElement,
            body = doc.body;

        var box = elem.getBoundingClientRect ? elem.getBoundingClientRect() : {top: 0, left: 0};

        var clientTop = docElem.clientTop || body.clientTop || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0;

        return {top: box.top - clientTop, left: box.left - clientLeft};

    };

    /**
     * 获取元素的clientWidth，clientHeight
     *
     * @method getOffset
     * @param  {Element} elem
     * @return {Object}  {width:xx, height:xx}
     */
    util.dom.getOffset = function (elem) {
        return {width: elem.clientWidth, height: elem.clientHeight};
    };

    /**
     * 获取元素的位置信息
     *
     * @method getDimension
     * @param  {Element} elem
     * @return {Object}  {width:xx, height:xx, top:xx ,left:xx}
     */
    util.dom.getDimension = function (elem) {
        return util.extend(util.dom.getOffset(elem), util.dom.getPosition(elem));
    };

    return util;
});

