/**
 * dropdown-group 组件实现文件 - （RegularUI-select2Group-搬迁）
 *
 * @version  1.0
 * @author   hzlixinxin <hzlixinxin@corp.netease.com>
 * @module   pool/component-dropdown/src/dropdown-group/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    '../dropdown/ui.js'
],function(
    Component,
    util
){
    /**
     * DropdownGroup 组件
     *
     * @class   module:pool/component-dropdown/src/dropdown-group/component.DropdownGroup
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object}                  [options.service]                       数据服务
     * @param {Object} options.data - 与视图关联的数据模型
     * @param {Object[]}                [options.data.sources=[]               数据源
     * @param {String}                  [options.data.source.name ]             每项的内容
     * @param {Object[]}                [options.data.source.children=[]]       每项的子内容
     * @param {Boolean}                 [options.data.source.disabled=false]    禁用此项
     * @param {Boolean}                 [options.data.source.divider=false]     设置此项为分隔线
     * @param {Number}                  [options.data.depth=1]                  控制层级数
     * @param {Object}                  [options.data.selected                  最后一级的选择项
     * @param {Object[]}                [options.data.selecteds=[]]             所有的选择项
     * @param {String[]|Number[]}       [options.data.values=[]]                所有的选择值
     * @param {String}                  [options.data.key='id']                 数据项的键
     * @param {String[]}                [options.data.placeholders=[]]          默认项的文字
     * @param {Boolean}                 [options.data.readonly=false]           是否只读
     * @param {Boolean}                 [options.data.disabled=false]           是否禁用
     * @param {Boolean}                 [options.data.visible=true]             是否显示
     * @param {String}                  [options.data.class='']                 补充class 
     */
    
    /**
     * 最后的选择项改变时触发
     * 
     * @event module:pool/component-dropdown/src/dropdown-group/component.DropdownGroup#change
     * @param {Object} event - 事件
     * @param {Object} event.sender 事件发送对象
     * @param {Object} event.selected 最后的选择项
     * @param {Object[]} event.selecteds 所有的选择项
     * @param {String} event.key 数据项的键
     * @param {String[]|Number[]} event.values 所有的选择值
     */
    
    /**
     * 选择某一项时触发
     * 
     * @event module:pool/component-dropdown/src/dropdown-group/component.DropdownGroup#select
     * @param {Object} event - 事件
     * @param {Object} event.sender 事件发送对象
     * @param {Object} event.selected 当前选择项
     * @param {Object[]} event.selecteds 当前所有的选择项
     * @param {Number} event.level 当前选择的层级
     */
    var DropdownGroup = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-dropdown/src/dropdown-group/component.DropdownGroup#config
         * @returns {void}
         */
        config: function () {
            //设置组件视图模型的默认值
            util.extend(this.data, {
                /**
                 * 层级数
                 * 
                 * @member {Number} module:pool/component-dropdown/src/dropdown-group/component.DropdownGroup#depth
                 */
                depth: 1,
                /**
                 * 数据源
                 * 
                 * @member {Object[]} module:pool/component-dropdown/src/dropdown-group/component.DropdownGroup#sources
                 */
                sources: [],
                /**
                 * 最后的选择项
                 * 
                 * @member {Object} module:pool/component-dropdown/src/dropdown-group/component.DropdownGroup#selected
                 */
                selected: undefined,
                /**
                 * 所有的选择项
                 * 
                 * @member {Object[]} module:pool/component-dropdown/src/dropdown-group/component.DropdownGroup#selecteds
                 */
                selecteds: [],
                /**
                 * 数据项的键
                 * 
                 * @member {String} module:pool/component-dropdown/src/dropdown-group/component.DropdownGroup#key
                 */
                key: 'id',
                /**
                 * 所有的选择值
                 * 
                 * @member {String[]|Number[]} module:pool/component-dropdown/src/dropdown-group/component.DropdownGroup#values
                 */
                values: [],
                /**
                 * 默认项的文字
                 * 
                 * @member {String[]} module:pool/component-dropdown/src/dropdown-group/component.DropdownGroup#placeholders
                 */
                placeholders: []
            });
            this.supr();
        
            this.$watch('selected', function (newValue) {
                
                this.$emit('change', {
                    sender: this,
                    selected: newValue,
                    selecteds: this.data.selecteds,
                    key: this.data.key,
                    values: this.data.values
                });
            });
            if(this.data.source){
                this.data.sources[0] = this.data.source;
            }
        },

        /**
         * onChange处理
         *
         * @method  module:pool/component-dropdown/src/dropdown-group/component.DropdownGroup#onChange
         * @param {Object} item 选中的item
         * @param {Number} level 第几层级,从0开始
         * @returns {Void}
         */
        onChange: function (item, level) {

            //改变下一层级的内容
            if (level !== this.data.depth - 1){
                this.data.sources[level + 1] = item ? item.children : undefined;
            }
            //改变下一层级之后的内容
            for (var i = level + 2; i < this.data.depth; i++)
                this.data.sources[i] = undefined;
            //选中的已经是最后一级
            if (level === this.data.depth - 1){
                this.data.selected = item;
            }
            this.data.selecteds[level] = item;
            this.data.values[level] = (item ? item[this.data.key] : undefined);

            this.validate();

            this.$emit('select', {
                sender: this,
                selected: item,
                selecteds: this.data.selecteds,
                level: level
            });
            this.$update();
        },

        /**
         * 校验
         * @method module:pool/component-dropdown/src/dropdown.Dropdown#validate
         * @public
         * @param  {Void}
         * @return {Boolean} 校验结果
         */
        validate: function () {
            if(!this.$refs.validation) return;
            return this.$refs.validation.validate(this.data.selecteds ? this.data.selecteds : null);
        }
    });

    return DropdownGroup;
});
