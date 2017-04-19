/**
 * Suggest 组件实现文件 - （RegularUI-云课堂2.0 - suggest2-搬迁）
 *
 * @version  1.0
 * @author   hzlixinxin <hzlixinxin@corp.netease.com>
 * @module   pool/component-dropdown/src/suggest/component
 */
NEJ.define([
    'pool/component-base/src/base',
    '../dropdown/component.js',
    'pool/component-input/src/input/ui',
    'pool/component-validation/src/validation',
    'pool/component-base/src/util',
    'base/platform',
    '../dropdown/ui.js'
],function(
    Component,
    Dropdown,
    Input,
    validation,
    util,
    platform
){
    var LINE_HEIGHT = 32; //list中每个li的行高，用于计算样式的高度
    /**
    * Suggest 组件
    *
    * @class   module:pool/component-dropdown/src/suggest/component.Suggest
    * @extends module:pool/component-base/src/base.Base
    *
    * @param {Object} options      - 组件构造参数
    * @param {Object} options.data - 与视图关联的数据模型
    * @param {Object}             [options.data.service=null]              - 数据服务
    * @param {Object[]}             [options.data.source=[]]               - 数据源
    * @param {String}                  [options.data.source[].name         - 每项的内容
    * @param {Boolean}           [options.data.source[].disabled=false]    - 禁用此项
    * @param {Object}             [options.data.selected=null]             - 当前选择项
    * @param {String}               [options.data.initValue='']            - 文本框的初始值
    * @param {String}            【options.data.matchType='all']           - 匹配方式，`all`表示匹配全局，`start`表示只匹配开头，`end`表示只匹配结尾
    * @param {String}         [options.data.placeholder='请输入']          - 文本框的占位文字
    * @param {Boolean}         [options.data.hasDown=false]                - 是否需要下拉小箭头
    * @param {Number}                [options.data.startLength=0]          - 开始提示长度。当输入长度>=该值后开始提示
    * @param {Number}                [options.data.current=0]              - 当前选中项的index
    * @param {Number}                [options.data.cacheCurrent=0]         - 缓存的选中项index
    * @param {Boolean}           [options.data.strict=false]               - 是否为严格模式。当为严格模式时，`value`属性必须在source中选择，否则为空。
    * @param {Boolean}           [options.data.autofocus=false]            - 是否自动获得焦点
    * @param {Boolean}           [options.data.autofill=true]              - 上下移动鼠标是否自动填充到 input里 
    * @param {String}             [options.data.itemTemplate=null]         - 单项模板
    * @param {Boolean}           [options.data.open=false]                 - 当前为展开/收起状态
    * @param {Boolean}           [options.data.readonly=false]             - 是否只读
    * @param {Boolean}           [options.data.disabled=false]             - 是否禁用
    * @param {Boolean}            [options.data.visible=true]              - 是否显示
    * @param {Boolean}                 [options.data.eltIE9 ]              - 浏览器版本是否低于IE9
    * @param {String}               [options.data.class='']                - 补充class
    *
     */
    
    /**
    * 选择触发事件
    * 
    * @event module:pool/component-dropdown/src/suggest/component.Suggest#select
    * @param {Object} event - 事件
    * @param {Object} event.sender  - 事件发送对象
    * @param {Object} event.selected - 选中的元素
    */
    
    /**
    * 触发empty事件
    * @event module:pool/component-dropdown/src/suggest/component.Suggest#empty
    * @param {Object} event - 事件
    * @param {Object} event.sender - 事件发送对象
    * @param {Object} event.selected - 选中的对象，总是为{}
     */
    
    /**
    * 触发toggle事件
    * @event module:pool/component-dropdown/src/suggest/component.Suggest#toggle
    * @param {Object} event - 事件
    * @param {Object} event.sender  - 事件发送对象
    * @param {Boolean} event.oepn - 展开/收起状态
     */
    
    /**
     * keyup触发事件
     * @event module:pool/component-dropdown/src/suggest/component.Suggest#keyup
     * @param {String} value - 输入框的值
     */
    
    /**
    * 下拉列表show触发事件
    * @event module:pool/component-dropdown/src/suggest/component.Suggest#show
    * @param {Object} event - 事件
    * @param {Object} event.sender - 事件发送对象
     */
    
    var Suggest = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#config
         * @returns {Void}
         */
        config: function () {

            // 设置组件视图模型的默认值
            util.extend(this.data, {
                /**
                 * 当前选择项
                 * 
                 * @member {Object} module:pool/component-dropdown/src/suggest/component.Suggest#selected
                 */
                selected: {},
                /**
                 * 文本框的初始值
                 * 
                 * @member {String} module:pool/component-dropdown/src/suggest/component.Suggest#initValue
                 */
                initValue: '',
                value: '',
                /**
                 * 文本框的占位文字
                 * 
                 * @member {String} module:pool/component-dropdown/src/suggest/component.Suggest#placeholder
                 */
                placeholder: '请输入',
                /**
                 * 开始提示长度。当输入长度>=该值后开始提示
                 * 
                 * @member {Number} module:pool/component-dropdown/src/suggest/component.Suggest#startLength
                 */
                startLength: 0,
                /**
                 * 是否为严格模式。当为严格模式时，`value`属性必须在source中选择，否则为空。
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/suggest/component.Suggest#strict
                 */
                strict: false,
                /**
                 * 是否自动获得焦点
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/suggest/component.Suggest#autofocus
                 */
                autofocus: false,
                /**
                 * 当前为展开/收起状态
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/suggest/component.Suggest#open
                 */
                open: false,
                /**
                 * 是否需要下拉小箭头
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/suggest/component.Suggest#hasDown
                 */
                hasDown: false,
                /**
                 * 数据服务
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/suggest/component.Suggest#service
                 */
                service: null,
                /**
                 * 自动填充
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/suggest/component.Suggest#autofill
                 */
                autofill: true,
                /**
                 * 匹配规则
                 *
                 * @member {Boolean} module:pool/component-dropdown/src/suggest/web/component.Suggest#matchType
                 */
                matchType: 'all',
                cacheCurrent: 0,
                current:0,
                eltIE9: platform.browser == 'ie' && platform.version*1 <= 9              
            });
            this.supr();
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#init
         * @returns {void}
         */
        init: function () {
            this.upOrDown = Dropdown.prototype.upOrDown._$bind(this); 
            this.supr();

            this.list = this.$refs.list; 
            this.input = this.$refs.input;
            //初始值
            if(this.data.selected && this.data.selected.name){
                this.data.initValue = this.data.selected.name
            }
            if(this.data.initValue){
                this.data.value = this.data.initValue;
                //更新缓存数据
                this.data.cacheValue = this.data.value;
            }

            this.$on('$destroy', function(){

                var index = Dropdown.opens.indexOf(this);

               if (index >= 0){
                    Dropdown.opens.splice(index, 1);
               }

            })

            this.$watch('source.length', function(length){
                this.upOrDown(this.data.open, length * LINE_HEIGHT);
            });
        },

        /**
         * 选择某一项
         *
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#select
         * @public
         * @param  {Object} item 选择项
         * @return {Void}
         */
        select: function (item,index) {
            if(typeof index == 'undefined'){
                index = this.data.current;
            }
            if (this.data.readonly || this.data.disabled || !item || item.disabled || item.divider){
                return;
            }

            this.data.selected = item;
            this.data.current = index;
            this.data.value = item.name;
            //更新缓存数据
            this.data.cacheValue = this.data.value;

            this.validate();
            
            this.$emit('select', {
                sender: this,
                selected: item
            });
            
            this.toggle(false);
        },

        /**
         * 展开/收起
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#toggle
         * @public
         * @param  {boolean} open 展开/收起状态。如果无此参数，则在两种状态之间切换。
         * @param  {boolean} _isInput 是否从input框触发
         * @return {void}
         */
        toggle: function (open, _isInput) {
            if (this.data.readonly || this.data.disabled){
                return;
            }

            if (open === undefined){
                open = !this.data.open;
            }
            this.data.open = open;

            if(!open && typeof this.input == 'function'){
                this.input.blur();
            }
            var index = Dropdown.opens.indexOf(this);
            if (open && index < 0){
                Dropdown.opens.push(this);
            }
            else if (!open && index >= 0) {
                Dropdown.opens.splice(index, 1);

                if (!_isInput && this.data.strict){
                    this.data.value = this.data.selected ? this.data.selected.name : '';
                }
            }

            //关闭的时候还原数据,但是如果value为空则不还原
            if(!open){
                if(this.data.value){
                    this.data.value = this.data.cacheValue;
                }else{
                    this.data.selected = {};
                    this.data.current = 0;
                    this.data.value = '';
                    //更新缓存数据
                    this.data.cacheValue = this.data.value;

                    this.$emit('empty', {
                        sender: this,
                        selected: this.data.selected
                    });
                }

            }

            this.upOrDown(open, (this.data.source|| []).length * LINE_HEIGHT);

            this.$emit('toggle', {
                sender: this,
                open: open
            });
        },

        /**
         * focus input或输入值
         *
         * @public
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#onInput
         * @param {Void} 
         * @returns {void}
         */
        onInput: function () {
  
            var value = this.data.value || '';

            this._updateSource(value);
        },

        /**
         * click列表
         *
         * @public
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#click
         * @param {Object} item 点击的元素
         * @param {Number} index 点击的元素的index
         * @returns {void}
         */
        click: function(item, index){
            this.select(item, index);
            this.$update();
        },

        /**
         * keyup input
         *
         * @public
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#keyup
         * @param {Object} eventObj input触发keyup事件后抛出的对象
         * @returns {void}
         */
        keyup: function(eventObj) {
            var $event = eventObj.sender.data.$event;
            //ie9以下先赋值，否则validate更新不够及时
            this.data.value = this.input.data.value;
            this.onInput();

            if($event.event.keyCode == 38){ // up
                this._selectUpDown(true);
            }else if($event.event.keyCode == 40){ // down
                this._selectUpDown(false);
            }else if($event.event.keyCode == 13){ //enter
                this.select(this.data.source[this.data.current || 0]);
            }else{
                this.data.current = 0;

                this.$emit('keyup', {
                    sender: this,
                    data: eventObj
                });
            }
        },

        /**
         * enter list
         *
         * @public
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#enter
         * @param {Object} item 点击的元素
         * @param {Number} index 点击的元素的index
         * @returns {void}
         */
        enter: function(item, index){
            this.data.current = index;
            this.data.value = this.data.source[this.data.current].name;
        },


        /**
         * 点击小icon后显示下拉列表
         *
         * @public
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#showDropDown
         * @param {Void}
         * @returns {void}
         */
        showDropDown: function(){

            if(this.data.open && this.data.source.length){
                this.toggle(false);
            }else{

                this.eltIE9 ? this.onInput() : this.focus();

                this.$emit('show', {
                    sender: this
                });
            }
        },

        /**
         * focus，调用input的focus事件
         *
         * @public
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#focus
         * @param {Void} 
         * @returns {void}
         */
        focus: function(){
            if(typeof this.input.focus === 'function'){
                this.input.focus();
            }
        },

        /**
         * 选择下拉列表中当前的上一项或者下一项
         *
         * @private
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#_selectUpDown
         * @param {Boolean} _bool 是否向上
         * @returns {void}
         */
        _selectUpDown: function(_bool){

            if(typeof(this.data.current) === 'undefined'){
                this.data.current = -1;
            }
            this.data.current += (_bool ? -1:1);

            if(this.data.current < 0){
                this.data.current = this.data.source.length -1;
            }

            if(this.data.current >= this.data.source.length){
                this.data.current = 0;
            }

            if(this.data.autofill){
                this.data.value = this.data.source[this.data.current].name;
            }

            this.$update();
        },

        /**
         * 更新下拉列表的数据source
         *
         * @private
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#_updateSource
         * @param {String} value input的值
         * @returns {void}
         */
        _updateSource: function(value) {
            if (value.length >= this.data.startLength) {
                this.toggle(true);
                if (this.data.service){
                    this.data.service.getList(this._getParams(), function (result) {
                                    this.$update('source', result);
                                }.bind(this));
                }
            }else{
                this.toggle(false, true);
            }
        },

        /**
         * 更新下拉列表的数据source
         *
         * @private
         * @method  module:pool/component-dropdown/src/suggest/component.Suggest#filterItem
         * @param {Object} item, 某一项的值
         * @returns {void}
         */
        filterItem: function(item) {
            var value = this.data.value;

            if(!value && this.data.startLength)
                return false;

            if(this.data.matchType === 'all')
                return item.name.indexOf(value) >= 0;
            else if(this.data.matchType === 'startLength')
                return item.name.slice(0, value.length) === value;
            else if(this.data.matchType === 'end')
                return item.name.slice(-value.length) === value;
        },

        /**
        * 获取参数
        * @private
        * @method  module:pool/component-dropdown/src/suggest/component.Suggest#_getParams
        * @param {Void} 
        * @returns {Object} value
        */
        _getParams: function () {
            return {value: this.data.value};
        },

        /**
         * 校验
         * @method module:pool/component-dropdown/src/suggest/component.Suggest#validate
         * @public
         * @param  {Void}
         * @return {Boolean} 校验结果
         */
        validate: function () {
            if(this.$refs.validation) {
                return this.$refs.validation.validate(this.data.selected ? this.data.selected : null);
            }
        }


    });

    return Suggest;
});
