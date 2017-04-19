Function.prototype.bind = function() {
    var _args = arguments,
            _object = arguments[0],
            _function = this;

    return function(){
        var _argc = [].slice.call(_args,1);
        [].push.apply(_argc,arguments);
        return _function.apply(_object||window,_argc);
    };
};

UE.parse.register('insertcode',function(utils){
    var codeNodes = this.root.getElementsByTagName('code');

    if(codeNodes.length && !!window.SyntaxHighlighter){
        /*if(typeof XRegExp == "undefined"){
            var jsurl;//cssurl;
            if(this.rootPath !== undefined){
                jsurl = utils.removeLastbs(this.rootPath)  + '/third-party/SyntaxHighlighter/shCore.js';
                //cssurl = utils.removeLastbs(this.rootPath) + '/third-party/SyntaxHighlighter/shCoreDefault.css';
            }else{
                jsurl = this.highlightJsUrl;
                //cssurl = this.highlightCssUrl;
            }
            // utils.loadFile(document,{
            //     id : "syntaxhighlighter_css",
            //     tag : "link",
            //     rel : "stylesheet",
            //     type : "text/css",
            //     href : cssurl
            // });
            utils.loadFile(document,{
                id : "syntaxhighlighter_js",
                src : jsurl,
                tag : "script",
                type : "text/javascript",
                defer : "defer"
            },function(){
                utils.each(codeNodes,function(pi){
                    if(pi && /brush/i.test(pi.className)){
                        SyntaxHighlighter.highlight(pi);
                    }
                });
            });
        }else{*/
            var _root = this.root;

            // var _editorInterval = setInterval(function(){
            //     if (!!_root.clientWidth || !!_root.offsetWidth || !!_root.parentNode) {
            //         if (_editorInterval) {
            //              clearInterval(_editorInterval);
            //         };

            //         utils.each(_root.getElementsByTagName('code'),function(pi){
            //             if(pi && /brush/i.test(pi.className)){
            //                 SyntaxHighlighter.highlight(pi);
            //             }
            //         });
            //     };
            // },100);


            // var _count = 0;
            // var _editorInterval;

            /*function t(){
                _editorInterval = setTimeout(function(){
                    if (!!_root.clientWidth || !!_root.offsetWidth || !!_root.parentNode) {
                        p();
                    }else{
                        _count++;

                        if (_count > 3) {
                            return;
                        };

                        t();
                    }
                }, 250);
            }*/
            
            function p(){
                // utils.each(_root.getElementsByTagName('code'),function(pi){
                //     if(pi && /brush/i.test(pi.className)){
                //         console.info(_root.getElementsByTagName('code'));
                //         SyntaxHighlighter.highlight(null,pi);
                //     }
                // }.bind(this));
                //parse之后会改变所选节点，默认选数组头操作
                var _list = _root.getElementsByTagName('code');
                utils.each(_list,function(pi){
                    if(!!_list[0] && /brush/i.test(_list[0].className)){
                         SyntaxHighlighter.highlight(null,_list[0]);
                    }
                }.bind(this));
            }

            if(!!_root.parentNode){
                p();
            }
            
        //}
    }

});