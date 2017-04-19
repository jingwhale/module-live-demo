/**
 * Dropdown 组件实现文件 - （RegularUI - select2-搬迁）
 *
 * @version  1.0
 * @author   hzlixinxin <hzlixinxin@corp.netease.com>
 * @module   pool/component-dropdown/src/dropdown/web/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'pool/component-validation/src/validation'
], function(
    Component,
    util
){
    var DEFAULT_HEIGHT = 40;

    //  Array.find method，因为Array.find方法是在 ECMAScript 2015新加的，低版本浏览器可能不支持
    if (!Array.prototype.find) {
      Array.prototype.find = function(predicate) {
        'use strict';
        if (this == null) {
          throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
        return undefined;
      };
    } 

    /**
    * Dropdown 下拉列表组件
    * 
    * @example
    *
    * NEJ.define([
    *      'pool/component-dropdown/src/dropdown/ui'
    * ],function(
    *      DropdownUI
    * ){
    *      var dropdown = new DropdownUI({
    *          data:{
    *          }
    *      });
    *      dropdown.$inject('#parent');
    * });
    * 
    * @class    module:pool/component-dropdown/src/dropdown/web/component.Dropdown
    * @extends module:pool/component-base/src/base.Base
    *
    * @param {Object} options      - 组件构造参数
    * @param {Object} options.data - 与视图关联的数据模型
    * @param {Object[]}                [options.data.source=[]]              数据源，输入字符串或数字数组时，会自动加上key，如[1,2],会变为[{id:0,name:1},{id:1,name:2}]
    * @param {String}                  [options.data.source.name]       每项的内容
    * @param {Boolean}                 [options.data.source.disabled=false]   禁用此项
    * @param {Boolean}                 [options.data.source.divider=false]    设置此项为分隔线
    * @param {String}                  [options.data.itemTemplate=null]        单项模板
    * @param {Boolean}                 [options.data.open=false]                当前为展开/收起状态
    * @param {Boolean}                 [options.data.disabled=false]            是否禁用
    * @param {Boolean}                 [options.data.visible=true]             是否显示
    * @param {Boolean}                 [options.data.hoverToggle=false]         hover时候是否需要展开/收起
    * @param {Object}                  [options.data.selected=undefined]            当前选择项
    * @param {String|Number}           [options.data.value]               当前选择值
    * @param {String}                  [options.data.key='id']                 数据项的键
    * @param {String}                  [options.data.placeholder='请选择']         默认项的文字，如果`placeholder`为空并且没有设置选择项时，将会自动选中第一项。
    * @param {Boolean}                 [options.data.readonly=false]            是否只读
    * @param {Object[]}                [options.data.rules=[]]             校验规则
    * @param {String}                  [options.data.class='']               补充class
    *
    */
    
    /**
    * 选择项改变时触发(首次加载时会触发本事件)
    * @event module:pool/component-dropdown/src/dropdown/web/component.Dropdown#change 
    * @param {object} sender -事件发送对象
    * @param {object} selected -改变后的选择项
    * @param {String} key -键
    * @param {String} value -改变后的选择项的值
    */
    
    /**
    *下拉列表展开时触发
    * @event module:pool/component-dropdown/src/dropdown/web/component.Dropdown#open 
    * @param {Void}   
    */
   
    /** 下拉列表toggle
    * @event module:pool/component-dropdown/src/dropdown/web/component.Dropdown#toggle
    * @param {Object} event - 组件构造参数
    * @param {Object} event.sender  - 事件发送对象
    * @param {Boolean} event.oepn - 展开/收起状态
    */
   
    /** 选择下拉列表中某一项时，触发select事件
    * @event module:pool/component-dropdown/src/dropdown/web/component.Dropdown#select
    * @param {Object} event - 组件构造参数
    * @param {Object} event.sender  - 事件发送对象
    * @param {Object} event.selected - 选中的元素
    * @param {Object} event.parent - 选中的元素父元素
    */
   
    var Dropdown = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-dropdown/src/dropdown/web/component.Dropdown#config
         * @returns {Void}
         */
        config: function () {
            // 设置组件视图模型的默认值
            util.extend(this.data, {
                /**
                 * 单项模板
                 * 
                 * @member {String} module:pool/component-dropdown/src/dropdown/web/component.Dropdown#itemTemplate
                 */
                itemTemplate: null,
                /**
                 * 当前为展开/收起状态
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown/web/component.Dropdown#open
                 */
                open: false,
                /**
                 * 是否显示
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown/web/component.Dropdown#visible
                 */
                visible: true,
                /**
                 * hover时候是否需要展开/收起
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown/web/component.Dropdown#hoverToggle
                 */
                hoverToggle: false,
                /**
                 * 默认项的文字，如果`placeholder`为空并且没有设置选择项时，将会自动选中第一项。
                 * 
                 * @member {String} module:pool/component-dropdown/src/dropdown/web/component.Dropdown#placeholder
                 */
                placeholder: '请选择',
                /**
                 * 数据项的键
                 * 
                 * @member {String} module:pool/component-dropdown/src/dropdown/web/component.Dropdown#key
                 */
                key: 'id',
                /**
                 * 是否只读
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown/web/component.Dropdown#readonly
                 */
                readonly: false,
                /**
                 * 当前选择项
                 * 
                 * @member {Object} module:pool/component-dropdown/src/dropdown/web/component.Dropdown#selected
                 */
                selected: undefined,
                /**
                 * 是否禁用
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown/web/component.Dropdown#disabled
                 */
                disabled: false,
                /**
                 * 校验规则
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown/web/component.Dropdown#rules
                 */
                rules: [],
                /**
                 * 当前的值
                 * 
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown/web/component.Dropdown#value
                 */
                value: undefined,
                /**
                 * selected从undefined->object时，是否触发change事件
                 *
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown/component.Dropdown#alwaysChange
                 */
                alwaysChange: false
            });
            this.supr();

            this.$watch('selected', function (newValue,oldValue) {
                
                this.data.value = newValue ? newValue[this.data.key] : newValue;
                
                /*为了避免页面第一次加载dropdown组件就触发change事件，故在oldValue为undefined时直接返回
                * Commit be20741e834ae6d00ec50bbcb1f708d6081fb0d0  by hzwuyao
                * 
                * 把改行移到value赋值语句下面，否则对于没给selected和value的情况，第一次选择某个值后value不会改变
                * update hzlixinxin
                */
                if(!oldValue && !this.data.alwaysChange){
                    return;
                }

                this.$emit('change', {
                    sender: this,
                    selected: newValue,
                    key: this.data.key,
                    value: this.data.value
                });
            });

            this.$watch('value', function (newValue) {
                if (newValue === undefined || newValue === null)
                    return this.data.selected = newValue;
                else if (this.data.source && this.data.source instanceof Array) {
                    if (!this.data.selected || this.data.selected[this.data.key] !== newValue){
                        this.data.selected = this.data.source.find(function (item) {
                            return item[this.data.key] == newValue;
                        }, this);
                    }
                }
            });

            this.$watch('source', function (newValue) {
                if (newValue === undefined){
                    return this.data.selected = undefined;
                }

                if (!(newValue instanceof Array)){
                    throw new TypeError('`source` is not an Array!');
                }

                if (newValue.length && (typeof newValue[0] === 'string' || typeof newValue[0] === 'number')){
                    return this.data.source = newValue.map(function (name, index) {
                        var _obj = {name: name};
                        _obj[this.data.key] = index;
                        return _obj;
                    }._$bind(this));
                }

                if (this.data.selected && newValue.indexOf(this.data.selected) < 0){
                    this.data.selected = undefined;
                }

                // 当placeholder为空且未设置selected时，自动选择第一项
                if (!this.data.placeholder && !this.data.selected) {
                    this.data.selected = newValue[0];
                }
            });

            this.$watch('open', function(newValue){
                if(newValue){
                    this.$emit('open', {});
                }
            });
        },


        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-dropdown/src/dropdown/web/component.Dropdown#destroy
         * @returns {Void}
         */
        destroy: function () {
            var index = Dropdown.opens.indexOf(this);
            index >= 0 && Dropdown.opens.splice(index, 1);
            this.supr();
        },

        /**
         * 展开/收起下拉列表
         *
         * @method  module:pool/component-dropdown/src/dropdown/web/component.Dropdown#toggle
         * @public
         * @param  {Boolean} open 展开/收起状态。如果无此参数，则在两种状态之间切换。
         * @returns {Void}
         */
        toggle: function (open) {
            if (this.data.disabled){
                return;
            }

            if (open === undefined){
                open = !this.data.open;
            }
            
            this._actureToggle(open);
        },

        /**
         * hover展开/收起下拉列表
         *
         * @method  module:pool/component-dropdown/src/dropdown/web/component.Dropdown#hoverToggle
         * @public
         * @param  {Boolean} open 展开/收起状态。如果无此参数，则在两种状态之间切换。
         * @returns {Void}
         */
        hoverToggle: function (open) {
            var hoverTime = 100;
            if (!this.data.hoverToggle || this.data.disabled){
                return;
            }

            if (open === undefined){
                open = !this.data.open;
            }

            
            if(!open){//hover关闭的时候
                this.__onSetTimeHide = window.setTimeout(function(){
                    this._actureToggle(open);
                }._$bind(this), hoverTime);
            }else{
                this.__onSetTimeHide = window.clearTimeout(this.__onSetTimeHide);

                this._actureToggle(open);
            } 
        },

        /**
         * 执行展开/收起下拉列表
         *
         * @method  module:pool/component-dropdown/src/dropdown/web/component.Dropdown#_actureToggle
         * @private
         * @param  {Boolean} open 展开/收起状态。如果无此参数，则在两种状态之间切换。
         * @returns {Void}
         */
        _actureToggle: function(open){
            var index;
            this.data.open = open;

            this._updateOpensArray(open);

            this.$update();

            
            this.$emit('toggle', {
                sender: this,
                open: open
            });
        },

        /**
         * 更新展开的dropdown列表
         *
         * @method  module:pool/component-dropdown/src/dropdown/web/component.Dropdown#_updateOpensArray
         * @private
         * @param  {Boolean} open 展开/收起状态。
         * @returns {Void}
         */
        _updateOpensArray: function(open){
            // 根据状态在Dropdown.opens列表中添加/删除管理项
            index = Dropdown.opens.indexOf(this);
            if (open && index < 0){
                Dropdown.opens.push(this);
            }else if (!open && index >= 0){
                Dropdown.opens.splice(index, 1);
            }
        },   

        /**
         * 判断list是否应当向上展开
         * @deprecated 此方法废弃
         * @method module:pool/component-dropdown/src/dropdown/web/component.Dropdown#upOrDown 
         * @param {Boolean} open this.data.open
         * @param {Number} bdHeight list的高度，默认为list的高度，否则自己定义
         * @param {Number} offsetBottom  默认40 距离视口最底下的距离
         * @return {Boolean} droplist是否向上
         */
        /* istanbul ignore next */
        upOrDown: function(open, bdHeight, offsetBottom){
            /* istanbul ignore next */
            var display,client,bottom,
                up = false;
            /* istanbul ignore next */
            offsetBottom = offsetBottom || DEFAULT_HEIGHT;
            /* istanbul ignore next */
            if(open && this.$refs.element && this.$refs.element.getBoundingClientRect && this.$refs.bd){
                if(bdHeight == undefined) {
                    display = this.$refs.bd.style.display;
                    this.$refs.bd.style.display = 'block';
                    bdHeight = this.$refs.bd.offsetHeight;
                    this.$refs.bd.style.display = display;
                }

                client = this.$refs.element.getBoundingClientRect();
                bottom = document.documentElement.clientHeight -offsetBottom - client.bottom;
                up = this.data.up = (bottom < bdHeight) && (client.top > bottom);
            }
            return up;
        },

        /**
         * 选择某一项
         * @method module:pool/component-dropdown/src/dropdown/web/component.Dropdown#select 
         * @public
         * @param  {Object} item 选择项
         * @param  {Object} parent 父节点
         * @return {Void}
         */
        select: function (item,parent) {
            if (this.data.readonly || this.data.disabled || (item && (item.disabled || item.divider))){
                return;
            }

            this.data.selected = item;
            
            this.$emit('select', {
                sender: this,
                selected: item,
                parent: parent
            });

            this.toggle(false);

            this.validate();
        },

        /**
         * 校验
         * @method module:pool/component-dropdown/src/dropdown/web/component.Dropdown#validate 
         * @public
         * @param  {Void} 
         * @return {Boolean} 校验结果
         */
        validate: function () {
            return this.$refs.validation.validate(this.data.selected ? this.data.selected : null);
        }

        
    });


    Dropdown.opens = [];//当前页面所展开的下拉列表的集合

    // 处理点击dropdown之外的地方后的收起事件。
    Regular.dom.on(document, 'click', function (e) {
        var element,element2;
        Dropdown.opens.forEach(function (dropdown) {
            // 这个地方不能用stopPropagation来处理，因为展开一个dropdown的同时要收起其他dropdown
            element = dropdown.$refs.element;
            element2 = e.target;
            while (element2) {
                if (element == element2){
                    return;
                }
                element2 = element2.parentElement;
            }
            dropdown.toggle(false);
            dropdown.$update();
        });
    });


    return Dropdown;
});
