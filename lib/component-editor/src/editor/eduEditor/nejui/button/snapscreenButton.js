/*
 * ------------------------------------------
 * 富媒体编辑器弹框按钮实现文件
 * @version  1.0
 * @author   hzwujiazhen(hzwujiazhen@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _v = _('nej.v'),
        _proSnapScreenButton,
        _supSnapScreenButton;

    /**
     * 富媒体编辑器按钮
     * @class   {nej.ui._$$EditorDialogButton} 富媒体编辑器弹框按钮
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     *              title 说明文案 
     *              onclick 点击处理    
     */
    _p._$$SnapScreenButton = NEJ.C();
    _proSnapScreenButton = _p._$$SnapScreenButton._$extend(_p._$$EditorDialogButton);
    _supSnapScreenButton = _p._$$SnapScreenButton._$supro;

    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proSnapScreenButton.__reset = function(_options){
        this.__supReset(_options);
    };
    
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proSnapScreenButton.__destroy = function(){
        this.__supDestroy();
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proSnapScreenButton.__initNode = function(){
        this.__supInitNode();

        this.__cmd = 'snapscreen';
    };

    /**
     * 点击处理
     * @return {Void}
     */
    _proSnapScreenButton.__onClick = function(){
        if (this.__isDisabled) {
            return;
        };


        this.__excute();
    };

    _proSnapScreenButton.__excute = function(){
            var me = this.__editor,
                  doc,
                  snapplugin,
                  lang = me.getLang("snapScreen_plugin");
            if(!snapplugin){
                var container = me.container;
                doc = container.ownerDocument || container.document;
                snapplugin = doc.createElement("object");
                try{snapplugin.type = "application/x-pluginbaidusnap";}catch(e){
                    return;
                }
                snapplugin.style.cssText = "position:absolute;left:-9999px;";
                snapplugin.setAttribute("width","0");
                snapplugin.setAttribute("height","0");
                container.appendChild(snapplugin);
            }


           var editorOptions = me.options;

            var onSuccess = function(rs){
                try{
                    rs = eval("("+ rs +")");
                }catch(e){
                    return;
                }

                if(!!rs.state && rs.state != 'SUCCESS'){
                    return;
                }
                me.execCommand('insertimage', {
                    src: editorOptions.snapscreenPath + rs.url,
                    floatStyle: editorOptions.snapscreenImgAlign,
                    _src:editorOptions.snapscreenPath + rs.url
                });
            };
            var onStartUpload = function(){
                //开始截图上传
            };
            var onError = function(){

            };
            try{
                var port = editorOptions.snapscreenServerPort + '';
                editorOptions.snapscreenServerUrl = editorOptions.snapscreenServerUrl.split( editorOptions.snapscreenHost );
                editorOptions.snapscreenServerUrl = editorOptions.snapscreenServerUrl[1] || editorOptions.snapscreenServerUrl[0];
                if( editorOptions.snapscreenServerUrl.indexOf(":"+port) === 0 ) {
                    editorOptions.snapscreenServerUrl = editorOptions.snapscreenServerUrl.substring( port.length+1 );
                }
                var ret =snapplugin.saveSnapshot(editorOptions.snapscreenHost, editorOptions.snapscreenServerUrl, port);
                onSuccess(ret);
            }catch(e){
                _p._$$SnapScreenInstall._$allocate(this.__dialogOption)._$show();
            }
        }

    /**
     * 弹框关闭处理
     * @return {Void}
     */
    _proSnapScreenButton.__onchange = function(_data){
        this.__editor.execCommand(this.__cmd, {
            href : _data.href,
            textValue : _data.name,
            target : '_blank'
        });
    };

    return _p._$$SnapScreenButton;

};

NEJ.define(['{lib}ui/base.js',
       './dialogButton.js',
       '../dialog/snapscreenInstall.js'],f);


