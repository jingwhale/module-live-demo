/**
 * Editor 组件实现文件
 *
 * @version  1.0
 * @author   hzliujunwei <hzliujunwei@corp.netease.com>
 * @module   pool/component-editor/src/editor/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'base/event',
    './eduEditor/nejui/eduEditor.js',
    'pool/component-notify/src/notify/ui',
    'pool/component-button/src/button/ui',
    'pool/component-validation/src/validation',
    'util/event',
    './key.js',
    './setting.js'
], function (
    Component,
    util,
    v,
    EditorNEJ,
    NotifyUI,
    ButtonUI,
    validation,
    editorEvent,
    key,
    conf
) {

    var SETTING_KEY = key;

    /**
     * Editor 组件
     *
     * @example
     * new Editor({
     *     data: {}
     * }).$inject('#j-parentNode');
     *
     * @class   module:pool/component-editor/src/editor/component.Editor
     * @extends module:pool/component-base/src/base.Component
     * @param {object}              options.data                             绑定属性
     * @param {string}             [options.data.value=""]                  内容，值===undefined时，不进行验证，用于第一次默认不验证
     * @param {number}             [options.data.height=200]                编辑器高度的缺省高度（最小高度）
     * @param {number}             [options.data.isolate=0]                 0 <=>; 1 父=>子; 2 <=; 3无关联; 默认双向绑定
     * @param {boolean}            [options.data.autofocus=false]           是否自动获得焦点
     * @param {string}             [options.data.state=undefined]           文本框的状态
     * @param {object}             [options.data.rules=[]]                  验证规则
     * @param {string}             [options.data.class=undefined]           补充class
     * @param {string}             [options.data.editorStyle=""]            补充编辑框样式
     * @param {boolean=false}      [options.data.imageConfig.setImageWH]    => 设置富文本图片是否自动添加width/height属性
     * @param {Array}              [options.data.showCmds]                   => 显示命令数组
     *
     */

    var FACE_REG = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

    var Editor = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-editor/src/editor/component.Editor#config
         * @returns {void}
         */
        config: function () {

            this._flushSetting(SETTING_KEY, conf);

            util.extend(this, {});

            util.extend(this.data, {
                rules: [],
                isLength: true,
                height: 200,
                maxLength: 5000,
                filterFace: true,
                showCmds: null,
                editorStyle: ''
            });
            this.supr();

            // 不建议这样使用，通过rules自定义，为了兼容老代码不删除
            this.data.rules = this.data.rules || [];
            if (this.data.isFilled) {
                this.data.rules.push({type: 'isFilled', message: this.data.fillText || '请输入内容'});
            }
            if (this.data.isLength && this.data.maxLength) {
                this.data.rules.push({
                    message: '内容字数限制在' + this.data.maxLength + '个字以内！',
                    method: function () {
                        return this.data.maxLength >= this.data.wordcount;
                    }._$bind(this)
                });
            }
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-editor/src/editor/component.Editor#init
         * @returns {void}
         */
        init: function () {
            this.__editorEvent = editorEvent._$$EventTarget._$allocate();

            this.__editorEvent._$addEvent('docchanged', this._onDocChanged._$bind(this));
            this.__editorEvent._$addEvent('wordcount', this._onWordCount._$bind(this));

            this.__richUI = EditorNEJ._$$EduEditor._$allocate({
                parent: this.$refs.editor,
                content: this.data.value,
                height: this.data.height || 200,
                focus: this.data.autofocus,
                imageConfig: this.data.imageConfig,
                showCmds: this.data.showCmds,
                editorStyle: this.data.editorStyle,
                editorEvent: this.__editorEvent
            });

            var that = this;

            //如果要实时验证的话就不watch了，不然会造成光标错位。
            this.__richUI.ready(function () {
                that.setContent(that.data.value || '');
                that.setHeight(that.data.height || '');
                // onblur 才发送事件, onfoucs 清除错误提醒
                that.__richUI.change(function (content) {
                    if (content == undefined) return; //不希望一开始就错误提示
                    if(that.data.filterFace && (typeof content=='string') && FACE_REG.test(content)){
                        content = content.replace(FACE_REG, '');
                        NotifyUI.warning('暂不支持输入表情');
                        that.setContent(content);
                    }
                    that.$emit('change', content);
                });
                // 数据双向绑定
                if (that.data.isolate == 1) {
                    that.$watch('value', function (_val) {
                        that.setContent(_val || '');
                    });
                } else if (that.data.isolate == 2) {
                    that.__richUI.change(function (content) {
                        that.data.value = content;
                        that.$update();
                    });
                } else if (that.data.isolate == 3) { //不绑定

                } else { //默认双向绑定
                    that.$watch('value', function (_val) {
                        var content = that.getContent();
                        if ( content != _val ) {  //防止光标移动
                            that.setContent(_val || '');
                        }
                    });
                    that.__richUI.change(function (content) {
                        that.data.value = content;
                        that.$update();
                    });
                }
            });
            this.supr();
        },

        /**
         * 设置内容
         *
         * @method  module:pool/component-editor/src/editor/component.Editor#setContent
         * @param {string}  value               - 编辑器的内容
         * @return {Void}
         */
        setContent: function (_val) {
            this.__richUI._$setContent(_val);
        },

        /**
         * 设置高度
         *
         * @method  module:pool/component-editor/src/editor/component.Editor#setHeight
         * @param {string}  value               - 高度
         * @return {Void}
         */
        setHeight: function (value) {
            this.__richUI._$setHeight(value);
        },

        /**
         * 编辑器聚焦
         *
         * @method  module:pool/component-editor/src/editor/component.Editor#focus
         * @return {Void}
         */
        focus: function () {
            this.__richUI._$focus();
        },

        /**
         * 获取编辑器的内容
         *
         * @method  module:pool/component-editor/src/editor/component.Editor#getContent
         * @return {String}
         */
        getContent: function () {
            return this.__richUI._$getContent();
        },

        /**
         * 获取编辑器的文本内容
         *
         * @method  module:pool/component-editor/src/editor/component.Editor#getTextContent
         * @return {String}
         */
        getTextContent: function () {
            return this.__richUI._$getTextContent();
        },

        /**
         * 取文本内容的字符长度
         *
         * @method  module:pool/component-editor/src/editor/component.Editor#getContentLength
         * @param { Boolean } ingoneHtml 传入true时，只按照纯文本来计算
         * @return {Number}
         */
        getContentLength: function(ingoneHtml){
            return this.__richUI._$getContentLength(ingoneHtml);
        },

        /**
         * doc内容变化
         *
         * @private
         * @method  module:pool/component-editor/src/editor/component.Editor#_onDocChanged
         * @return {Number}
         */
        _onDocChanged: function () {
            NotifyUI.warning("本次粘贴将丢失部分内容格式");
        },

        /**
         * 字数变化事件
         *
         * @private
         * @method  module:pool/component-editor/src/editor/component.Editor#_onWordCount
         * @return {Number}
         */
        _onWordCount: function (_num) {
            this.data.wordcount = (_num || 0)*1;

            if(!this._firstInitialNotCount){
                this._firstInitialNotCount = true;
                return;
            }

            // 校验字数是否符合要求
            if (this.$refs && this.$refs.validation) {
                this.$refs.validation.validate();
            }

            this.$emit("wordcount", this.data.wordcount);
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-editor/src/editor/component.Editor#destroy
         * @returns {void}
         */
        destroy: function () {
            this.__editorEvent._$delEvent('docchanged', this._onDocChanged._$bind(this));
            this.__editorEvent._$delEvent('wordcount', this._onWordCount._$bind(this));

            this.__editorEvent = editorEvent._$$EventTarget._$recycle(this.__editorEvent);

            this.__richUI.__destroy();

            this.supr();
        }
    });

    return Editor;
});
