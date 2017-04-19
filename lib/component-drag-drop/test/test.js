/**
 * Entry for Unit Test
 * 拖动+放置，动作一起测试
 *
 * @author edu <edu@corp.netease.com>
 */
NEJ.define([
    '../src/draggable.js',
    '../src/droppable.js',
    './eventUtil.js',
    '../src/dragDrop.js'
],function (
    Draggable,
    Droppable,
    eventUtil,
    dragDrop
) {
    var expect = chai.expect;
    var instDrag, instDrop;

    // dray拖拽物
    instDrag = new Draggable({
        data:{
            dragClass: 'test-dragging',
            data: {name:'cqh'},
            proxy: 'clone'
        },
        $body: '<div id="draggable"> draggable </div>'
    }).$inject("#drag-box");

    // drop容器
    instDrop = new Droppable({
        events: {
            drop: function($event){
                var countElement = document.getElementById('count');
                countElement.innerText = +(countElement.innerText) + 1;
            }
        },
        $body: '<div id="droppable"> droppble<div>放置次数：<span id="count" >0</span></div></div>'
    }).$inject("#drop-box");

    function test(proxy){
        instDrag.data.proxy = proxy;
        instDrag.$update();
        describe("拖拽放置整体测试-proxy: " + proxy,function () {

            // 按下
            it("mousedown: 首次mousedown拖拽物，给body添加类名f-unselectable",function(done){

                var event = eventUtil.createMouseDownEvent({});
                Regular.dom.element(instDrag).dispatchEvent(event);
                setTimeout(function(){
                    expect(document.body.className.split(" ").indexOf("f-unselectable")).to.not.equal(-1);
                    done();
                },0)
            });

            // 首次拖动
            it("mousemove: 首次drag拖拽物,触发dragstart事件,传递必要数据,并给代理添加自定义类名(默认z-drag)",function(){

                var event = eventUtil.createMouseMoveEvent({
                    screenX: 11, // drag位置
                    screenY: 20
                });
                instDrag.$on('dragstart',function($event){
                    expect($event.sender).to.equal(instDrag);
                    expect($event.proxy).to.equal(dragDrop.proxy);
                    expect(dragDrop.proxy.className.split(" ").indexOf("test-dragging")).to.not.equal(-1);

                });
                Regular.dom.element(instDrag).dispatchEvent(event);// 异步

            });

            // 拖动到目标，dragenter
            it('mouseenter: 拖拽物进入drop容器，触发容器dragenter事件,传递必要数据；拖拽物触发drag事件',function(){
                var event = eventUtil.createMouseMoveEvent({
                    screenX: 250,
                    screenY: 30,
                    clientX: 413, // 获取下面的drop位置
                    clientY: 178
                });
                instDrop.$on('dragenter',function($event){
                    expect($event.sender).to.equal(instDrop); // 发送事件者对象
                    expect($event.origin).to.equal(instDrag); // 拖拽对象
                    expect($event.target).to.equal(Regular.dom.element(instDrop)); // 拖放目标DOM
                    expect($event.source).to.equal(Regular.dom.element(instDrag)); // 拖拽DOM
                });
                instDrag.$on('drag',function($event){
                    expect($event.sender).to.equal(instDrag);
                    expect($event.origin).to.equal(instDrag);
                    expect($event.source).to.equal(Regular.dom.element(instDrag)); // 拖拽DOM
                });
                Regular.dom.element(instDrag).dispatchEvent(event);
            });

            it('mouseover: 拖拽物在drop容器上方移动，触发容器dragover事件,传递必要数据，并给drop容器添加自定义类名(默认z-dragover)',function(){
                var event = eventUtil.createMouseMoveEvent({
                    screenX: 290,
                    screenY: 30,
                    clientX: 413,
                    clientY: 178
                });
                instDrop.$on('dragover',function($event){
                    expect($event.sender).to.equal(instDrop);
                    expect($event.origin).to.equal(instDrag);
                    expect($event.target).to.equal(Regular.dom.element(instDrop));
                    expect($event.source).to.equal(Regular.dom.element(instDrag));
                    expect(Regular.dom.element(instDrop).className.split(" ").indexOf("z-dragover")).to.not.equal(-1);
                });
                Regular.dom.element(instDrag).dispatchEvent(event);
            });

            it('mouseleave: 拖拽物离开drop容器上方，触发容器leave事件,传递必要数据，并移除容器dragOverClass类名(默认z-dragover)',function(){
                var event = eventUtil.createMouseMoveEvent({
                    screenX: 450,
                    screenY: 30,
                    clientX: 1000,
                    clientY: 1000
                });
                instDrop.$on('dragleave',function($event){
                    expect($event.sender).to.equal(instDrop);
                    expect($event.origin).to.equal(instDrag);
                    expect($event.target).to.equal(Regular.dom.element(instDrop));
                    expect($event.source).to.equal(Regular.dom.element(instDrag));
                    expect(Regular.dom.element(instDrop).className.split(" ").indexOf("z-dragover")).to.equal(-1);
                });
                Regular.dom.element(instDrag).dispatchEvent(event);
            });

            it('mouseup: 拖拽物在drop容器上方释放，;先多拖拽物触发dragend事件，移除代理上的dragClass; 再触发容器drop事件,传递必要数据(**包括拖拽传递的数据**)，并移除容器dragOverClass类名(默认z-dragover)',function(){
                // enter again
                var event = eventUtil.createMouseMoveEvent({
                    screenX: 290,
                    screenY: 30,
                    clientX: 413,
                    clientY: 178
                });
                Regular.dom.element(instDrag).dispatchEvent(event);

                // over again
                event = eventUtil.createMouseMoveEvent({
                    screenX: 290,
                    screenY: 30,
                    clientX: 413,
                    clientY: 178
                });
                Regular.dom.element(instDrag).dispatchEvent(event);

                // first drop
                event = eventUtil.createMouseUpEvent({
                    screenX: 290,
                    screenY: 30,
                    clientX: 413,
                    clientY: 178
                });

                instDrag.$on('dragend',function($event){
                    expect($event.sender).to.equal(instDrag);
                    expect($event.origin).to.equal(instDrag);
                    expect($event.source).to.equal(Regular.dom.element(instDrag));
                });

                instDrop.$on('drop',function($event){
                    expect($event.sender).to.equal(instDrop);
                    expect($event.origin).to.equal(instDrag);
                    expect($event.target).to.equal(Regular.dom.element(instDrop));
                    expect($event.source).to.equal(Regular.dom.element(instDrag));
                    // equal 默认 ===; deep.equal则匹配每个原始值
                    expect(instDrop.data.data).to.deep.equal({name:'cqh'});
                    expect(Regular.dom.element(instDrop).className.split(" ").indexOf("z-dragover")).to.equal(-1);
                });
                Regular.dom.element(instDrag).dispatchEvent(event);
            });
        });

    }

    test('clone');
    test('self');
    test('#draggable');
    test(document.getElementById("draggable"));
    test(function(){
        return document.getElementById("draggable");
    });

    mocha.run();
});