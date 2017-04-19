/**
 * 纯文本粘贴插件
 * @file
 * @since 1.2.6.1
 */

UE.plugins['pasteplain'] = function(){
    var me = this;
    me.setOpt({
        'pasteplain':true,
        'filterTxtRules' : function(){
            function transP(node){
                node.tagName = 'p';
                node.setStyle();
            }

            function removeClass(node){
                node.className = '';
            }

            function removeNode(node){
                node.parentNode.removeChild(node,true)
            }

            return {
                //直接删除及其字节点内容
                '-':'script style object iframe embed input select',
                'p':{$:{}},
                'br':{$:{}},
                div:function (node) {
                    var tmpNode, p = UE.uNode.createElement('p');
                    while (tmpNode = node.firstChild()) {
                        if (tmpNode.type == 'text' || !UE.dom.dtd.$block[tmpNode.tagName]) {
                            p.appendChild(tmpNode);
                        } else {
                            if (p.firstChild()) {
                                node.parentNode.insertBefore(p, node);
                                p = UE.uNode.createElement('p');
                            } else {
                                node.parentNode.insertBefore(tmpNode, node);
                            }
                        }
                    }
                    if (p.firstChild()) {
                        node.parentNode.insertBefore(p, node);
                    }
                    node.parentNode.removeChild(node);
                },
                ol:removeNode,
                ul:removeNode,
                dl:removeNode,
                dt:removeNode,
                dd:removeNode,
                'li':removeNode,
                
                'caption':removeNode,
                'h1':removeNode,'h2':removeNode,'h3':removeNode,'h4':removeNode,'h5':removeNode,'h6':removeNode,
                'th':removeClass,
                'tr':removeClass,
                'td':removeClass

                // 'caption':transP,
                // 'h1':transP,'h2':transP,'h3':transP,'h4':transP,'h5':transP,'h6':transP,
                // 'th':transP,
                // 'tr':transP,
                // 'td':function(node){
                //     //没有内容的td直接删掉
                //     var txt = !!node.innerText();
                //     if(txt){
                //         node.parentNode.insertAfter(UE.uNode.createText(' &nbsp; &nbsp;'),node);
                //     }
                //     node.parentNode.removeChild(node,node.innerText())
                // }
                
            }
        }()
    });
    //暂时这里支持一下老版本的属性
    var pasteplain = me.options.pasteplain;

    /**
     * 启用或取消纯文本粘贴模式
     * @command pasteplain
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @example
     * ```javascript
     * editor.queryCommandState( 'pasteplain' );
     * ```
     */

    /**
     * 查询当前是否处于纯文本粘贴模式
     * @command pasteplain
     * @method queryCommandState
     * @param { String } cmd 命令字符串
     * @return { int } 如果处于纯文本模式，返回1，否则，返回0
     * @example
     * ```javascript
     * editor.queryCommandState( 'pasteplain' );
     * ```
     */
    me.commands['pasteplain'] = {
        queryCommandState: function (){
            return pasteplain ? 1 : 0;
        },
        execCommand: function (){
            pasteplain = !pasteplain|0;
        },
        notNeedUndo : 1
    };
};