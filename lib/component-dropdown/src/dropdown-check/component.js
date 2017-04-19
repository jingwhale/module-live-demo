/**
 * DropdownCheck 组件实现文件
 *
 * @version  1.0
 * @author   hzlixinxin <hzlixinxin@corp.netease.com>
 * @module   pool/component-dropdown/src/dropdown-check/component
 */
NEJ.define([
    'base/util',
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'pool/component-validation/src/validation',
    'pool/component-check/src/check/ui'
], function(
    u,
    Component,
    util
){
    var DEFAULT_HEIGHT = 40;

    /**
    * DropdownCheck 下拉列表组件
    *
    * @example
    *
    * NEJ.define([
    *      'pool/component-dropdown/src/dropdown-check/ui'
    * ],function(
    *      DropdownCheckUI
    * ){
    *      var dropdown = new DropdownCheckUI({
    *          data:{
    *          }
    *      });
    *      dropdown.$inject('#parent');
    * });
    *
    * @class    module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck
    * @extends module:pool/component-base/src/base.Base
    *
    * @param {Object} options      - 组件构造参数
    * @param {Object} options.data - 与视图关联的数据模型
    * @param {Object[]}                [options.data.source=[]]              数据源
    * @param {String}                  [options.data.source.name]            每项的内容
    * @param {Boolean}                 [options.data.open=false]             当前为展开/收起状态
    * @param {Object}                  [options.data.allCheck={}]            全部选项
    * @param {Boolean}                 [options.data.allCheck.checked]       全部选项是否选中
    * @param {Boolean}                 [options.data.disabled=false]         是否禁用
    * @param {Boolean}                 [options.data.hoverToggle=false]      hover时候是否需要展开/收起
    * @param {Object}                  [options.data.selected=[]]            当前选择项
    * @param {String}                  [options.data.text='显示更多']         默认项的文字
    * @param {Object[]}                [options.data.rules=[]]               校验规则
    * @param {String}                  [options.data.class='']               补充class
    *
    */


    /**
    *下拉列表展开时触发
    * @event module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#open
    * @param {Void}
    */

    /** 下拉列表toggle
    * @event module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#toggle
    * @param {Object} event - 组件构造参数
    * @param {Object} event.sender  - 事件发送对象
    * @param {Boolean} event.oepn - 展开/收起状态
    */

    /** 触发select事件
    * @event module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#select
    * @param {Object} event - 组件构造参数
    * @param {Object} event.sender  - 事件发送对象
    * @param {Object} event.selected - 选中的元素
    * @param {Object} event.parent - 选中的元素父元素
    */

    var DropdownCheck = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#config
         * @returns {Void}
         */
        config: function () {
            // 设置组件视图模型的默认值
            util.extend(this.data, {
                /**
                 * 单项模板
                 *
                 * @member {String} module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#itemTemplate
                 */
                itemTemplate: null,
                /**
                 * 当前为展开/收起状态
                 *
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#open
                 */
                open: false,
                /**
                 * 是否显示
                 *
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#visible
                 */
                visible: true,
                /**
                 * hover时候是否需要展开/收起
                 *
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#hoverToggle
                 */
                hoverToggle: false,
                /**
                 * 默认项的文字，如果`placeholder`为空并且没有设置选择项时，将会自动选中第一项。
                 *
                 * @member {String} module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#placeholder
                 */
                text: '显示更多',
                /**
                 * 当前选择项
                 *
                 * @member {Object} module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#selected
                 */
                selected: [],
                /**
                 * 是否禁用
                 *
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#disabled
                 */
                disabled: false,
                /**
                 * 校验规则
                 *
                 * @member {Boolean} module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#rules
                 */
                rules: []
            });
            if(this.data.allCheck&&this.data.allCheck.checked){
                this.data.source.forEach(function(item){
                    item.checked = true;
                });
                this.data.selected = this.data.source.slice(0);

            }
            this.supr();

            this.$watch('source', function(newValue){
                if(newValue){
                    for(var key in newValue){
                        var item = newValue[key];
                        var index = this.data.selected.indexOf(item);
                        if(item.checked && index == -1){
                            this.data.selected.push(item);

                        }else if(!item.checked && index > 0){
                            this.data.selected.splice(index,1);
                        }
                    }
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
         * @method  module:pool/component-dropdown/src/dropdown-check/component.DropdownCheck#destroy
         * @returns {Void}
         */
        destroy: function () {
            var index = DropdownCheck.opens.indexOf(this);
            index >= 0 && DropdownCheck.opens.splice(index, 1);
            this.supr();
        },

        /**
         * 展开/收起下拉列表
         *
         * @method  module:pool/component-dropdown/src/dropdown.DropdownCheck#toggle
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
         * @method  module:pool/component-dropdown/src/dropdown.DropdownCheck#hoverToggle
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
         * @method  module:pool/component-dropdown/src/dropdown.DropdownCheck#_actureToggle
         * @private
         * @param  {Boolean} open 展开/收起状态。如果无此参数，则在两种状态之间切换。
         * @returns {Void}
         */
        _actureToggle: function(open){
            var index;
            this.data.open = open;

            // 根据状态在DropdownCheck.opens列表中添加/删除管理项
            index = DropdownCheck.opens.indexOf(this);
            if (open && index < 0){
                DropdownCheck.opens.push(this);
            }else if (!open && index >= 0){
                DropdownCheck.opens.splice(index, 1);
            }

            this.$update();


            this.$emit('toggle', {
                sender: this,
                open: open
            });
        },

        /**
         * 判断list是否应当向上展开
         * @method module:pool/component-dropdown/src/dropdown.DropdownCheck#upOrDown
         * @param {Boolean} open this.data.open
         * @param {Number} bdHeight list的高度，默认为list的高度，否则自己定义
         * @param {Number} offsetBottom  默认40 距离视口最底下的距离
         * @return {Boolean} droplist是否向上
         */
        upOrDown: function(open, bdHeight, offsetBottom){
            var display,client,bottom,
                up = false;

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
         * @method module:pool/component-dropdown/src/dropdown.DropdownCheck#select
         * @public
         * @param  {Object} item 选择项
         * @param  {Object} parent 父节点
         * @return {Void}
         */
        select: function (item,parent) {
            if (this.data.readonly || this.data.disabled || (item && (item.disabled || item.divider))){
                return;
            }
            item.checked = !item.checked;
            var index = this.data.selected.indexOf(item);
            if(item.checked && index == -1){
                this.data.selected.push(item);

            }else if(!item.checked && index >= 0){
                this.data.selected.splice(index,1);
            }
            if(this.data.allCheck){
                if(this.data.selected.length == this.data.source.length){
                    this.data.allCheck.checked = true;
                }else{
                    this.data.allCheck.checked = false;
                }
            }

            this.$emit('select', {
                sender: this,
                selected: this.data.selected,
                parent: parent
            });

            this.validate();
        },

        selectAll: function(allCheck,parent){
            if (this.data.readonly || this.data.disabled ){
                return;
            }
            allCheck.checked = !allCheck.checked;
            this.data.source.forEach(function(obj){
                obj.checked = allCheck.checked;
            });
            if(this.data.allCheck.checked){
                this.data.selected = this.data.source.slice(0);
            }else{
                this.data.selected = [];
            }

            this.$emit('select', {
                sender: this,
                selected: this.data.selected,
                parent: parent
            });
        },
        /**
         * 校验
         * @method module:pool/component-dropdown/src/dropdown.DropdownCheck#validate
         * @public
         * @param  {Void}
         * @return {Boolean} 校验结果
         */
        validate: function () {
            return this.$refs.validation.validate(this.data.selected ? this.data.selected : null);
        }


    });

    DropdownCheck.opens = [];//当前页面所展开的下拉列表的集合

    // 处理点击dropdown之外的地方后的收起事件。
    Regular.dom.on(document, 'click', function (e) {
        var element,element2;
        DropdownCheck.opens.forEach(function (dropdown) {
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

    return DropdownCheck;
});
