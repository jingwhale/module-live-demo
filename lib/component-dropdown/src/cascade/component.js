/**
 * Cascade 组件实现文件
 *
 * @version  1.0
 * @author   hzliuzongyaun <hzliuzongyaun@corp.netease.com>
 * @module   pool/component-dropdown/src/cascade/component
 */
NEJ.define([
    'pool/component-base/src/base',
    'pool/component-base/src/util',
    'pool/cache-base/src/setting',
    './setting.js',
    'base/util',
    'pool/component-validation/src/validation'
], function (Component,
             util, s, conf, u) {
    var SETTING_KEY = 'component-dropdown-cascade';

    // 设置默认配置
    s.$default(SETTING_KEY, conf);

    /**
     * Cascade 组件
     *
     * @class   module:pool/component-dropdown/src/cascade/component.Cascade
     * @extends module:pool/component-base/src/base.Component
     *
     * @param {Object} options      - 组件构造参数
     * @param {Object} options.data - 与视图关联的数据模型
     */
    var Cascade = Component.$extends({
        /**
         * 模板编译前用来初始化参数
         *
         * @protected
         * @method  module:pool/component-dropdown/src/cascade/component.Cascade#config
         * @returns {void}
         */
        config: function () {
            // FIXME 设置组件配置信息的默认值
            util.extend(this, {
                service: {
                    getList: null
                },
                settingKey: SETTING_KEY
            });
            // FIXME 设置组件视图模型的默认值
            util.extend(this.data, {
                name: 'name',    // web不能指定
                id: 'id',
                source: [],
                panes: [],  // [[{id:1,name:'xxx',children:[]}]],id必须在每个level下唯一
                selected: null,
                selecteds: [],
                selectedIds: [],
                placeholders: [],    // 显示的默认值
                isValidateOnSelect:false,    // 是否在选择时validate

                isLoading: false,
                isComplete: false,  // 是否选择完(selecteds所有项都不为空则为true)

                state: null, // validation组件相关属性
                rules: []    // validation组件相关属性
            });

            this._initPropertys();
            this.supr();
            // TODO

            // 更新isComplete;isComplete应该是selecteds为真实数据时再判断
            // this.$watch('selecteds', function (newVal) {
            //     if(this.data.isLoading){
            //         return;
            //     }
            //
            //     for (var i = 0; i < newVal.length; i++) {
            //         if (!newVal[i]) {
            //             this.data.isComplete = false;
            //             return;
            //         }
            //     }
            //     this.data.isComplete = true;
            //     this.$emit('complete',{
            //         sender:this
            //     });
            // });

            // 更新selectedIds
            this.$watch('selecteds', function (newVal) {
                this.data.selectedIds = [];
                for (var i = 0; i < newVal.length; i++) {
                    if (newVal[i]) {
                        this.data.selectedIds.push(newVal[i][this.data.id]);
                    } else {
                        this.data.selectedIds.push(null);
                    }
                }
            });
        },

        /**
         * 模板编译之后(即活动dom已经产生)处理逻辑，可以在这里处理一些与dom相关的逻辑
         *
         * @protected
         * @method  module:pool/component-dropdown/src/cascade/component.Cascade#init
         * @returns {void}
         */
        init: function () {
            // TODO
            this.supr();
        },

        // TODO 如果source不够或没有,但是给了selectedIds,则自动调getList
        _initPropertys: function () {
            var ids = this.data.selectedIds,
                panes = this.data.panes,
                source = this.data.source;

            panes[0] = source;  // 默认source存在
            this.data.selecteds = [null];
            for (var i = 0; i < ids.length; i++) {
                this._select(ids[i], i);
            }
        },

        /*_getPane: function (s, id) {
            for (var i = 0; i < s.length; i++) {
                if (s[i].id == id) {
                    if (s[i].children) {
                        return s[i].children;
                    } else {
                        return null;
                    }
                }
            }

            throw new Error('不存在对应的id:' + id);
        },*/

        _isFilledArray: function (result) {
            return u._$isArray(result) && result.length > 0 ? true : false;
        },

        /**
         * 组件销毁策略，如果有使用第三方组件务必在此先销毁第三方组件再销毁自己
         *
         * @protected
         * @method  module:pool/component-dropdown/src/cascade/component.Cascade#destroy
         * @returns {void}
         */
        destroy: function () {
            // TODO
            this.supr();
        },

        /**
         * 检查是否complete,并抛出事件
         *
         * @method  module:pool/component-dropdown/src/cascade/component.Cascade#api
         * @returns {void}
         */

        _checkComplete: function () {
            if(this.data.isLoading){
                return;
            }

            for (var i = 0; i < this.data.selecteds.length; i++) {
                if (!this.data.selecteds[i]) {
                    this.$update('isComplete',false);
                    return;
                }
            }

            this.$update('isComplete',true);
            this.$emit('complete',{
                sender:this
            });
        },

        /**
         * 此方法调用的前提是panes已经存在;callback在下层有数据才会被调用;id可以为null(pc端存在选择空的情况)
         *
         * @private
         * @method  module:pool/component-dropdown/src/cascade/component.Cascade#_api
         * @param flag1 {Boolean} 是否开启触发默认事件
         * @param flag2 {Boolean} 是否开启同值判断
         * @returns {void}
         */
        _select: function (id, level, callback, flag1, flag2) {
            var item = null,
                doValidateOnSelect = this.data.doValidateOnSelect;

            // 默认触发事件
            if (flag1 === undefined) {
                flag1 = true;
            }

            // 是否开启触发默认事件
            if (flag2 === undefined) {
                flag2 = true;
            }

            if (isNaN(level)) {
                return;
            }

            if (level >= this.data.panes.length) {
                return;
            }

            item = this.getItem(level, id);

            // 和上次选的一样  TODO 如果加上,比如一开始选择[1,2,3],reset[1,2],第三个仍然会存在,因为2和上次一样,就直接return了
            if (flag2) {
                if (item == this.data.selecteds[level]) {
                    return;
                }
            }

            // 正在加载时不能选择
            if (this.data.isLoading) {
                return;
            }

            callback = callback || function () {
                };

            // 数据变化
            this.data.selected = item;
            this.data.selecteds[level] = item;
            this.data.selecteds = this.data.selecteds.splice(0, level + 1);
            this.data.panes = this.data.panes.splice(0, level + 1);

            // 获取下个level的数据
            if (item) {
                // 是否children是非空数组
                if (this._isFilledArray(item.children)) {
                    this.data.panes[level + 1] = item.children;
                    this.data.selecteds[level + 1] = null;
                    callback(item.children);
                    doValidateOnSelect && this.validate(this.data.selecteds);
                } else {
                    if (this.service.getList) {
                        this.data.isLoading = true;
                        this.service.getList(item, function (result) {  // 若提供了getList,此function必须被调用,否则无法继续选择,也无法确定
                            this.$update('isLoading', false);

                            if (this._isFilledArray(result)) {
                                item.children = result;
                                this.data.panes[level + 1] = item.children;
                                this.data.selecteds[level + 1] = null;
                                this.$update();

                                callback(item.children);
                            }
                            this._checkComplete();

                            doValidateOnSelect && this.validate(this.data.selecteds);

                            if(flag1){
                                // 需要等待所有数据更新完成
                                window.setTimeout(function () {
                                    this.$emit('selectDone',{
                                        id: id,
                                        selected: item,
                                        selecteds: this.data.selecteds,
                                        selectedIds: this.data.selectedIds,
                                        sender: this
                                    });
                                }._$bind(this),0);
                            }
                        }._$bind(this), function () {
                            this.$update('isLoading', false);
                            this._checkComplete();

                            if(flag1){
                                window.setTimeout(function () {
                                    this.$emit('selectDone',{
                                        id: id,
                                        selected: item,
                                        selecteds: this.data.selecteds,
                                        selectedIds: this.data.selectedIds,
                                        sender: this
                                    });
                                }._$bind(this),0);
                            }
                        }._$bind(this));
                    } else {
                        doValidateOnSelect && this.validate(this.data.selecteds);
                    }
                }
            } else {
                doValidateOnSelect && this.validate(this.data.selecteds);
            }

            // this.$update('panes',this.data.panes);
            this.$update(); // 外部调用需要更新

            this._checkComplete();

            if (flag1) {
                // 此方法里面调用update不会立刻更新(比如selectedIds),所以需要setTimeout
                // 并且$emit方法在init之后才有
                // TODO 注意数据的实时性
                window.setTimeout(function () {
                    this.$emit('select', {
                        id: id,
                        selected: item,
                        selecteds: this.data.selecteds,
                        selectedIds: this.data.selectedIds,
                        sender: this
                    });
                }._$bind(this), 0);

                if(!this.data.isLoading){
                    window.setTimeout(function () {
                        this.$emit('selectDone',{
                            id: id,
                            selected: item,
                            selecteds: this.data.selecteds,
                            selectedIds: this.data.selectedIds,
                            sender: this
                        });
                    }._$bind(this),0);
                }
            }
        },

        // 根据level和id获取某item
        getItem: function (level, id) {
            if (!id || isNaN(level)) {
                return null;
            }

            var pane = this.data.panes[level];

            if (!pane) {
                return null;
            }

            for (var i = 0; i < pane.length; i++) {
                if (pane[i][this.data.id] == id) {
                    return pane[i];
                }
            }

            return null;
        },

        // 被执行时可能dom尚未生成
        validate: function (selecteds) {
            var conclusion = {
                success: this.data.isComplete
            };
            window.setTimeout(function() {
                this.$refs.validation && this.$refs.validation.validate(selecteds);
            }._$bind(this), 0);

            // 返回校验状态
            return conclusion;
        }
    });

    return Cascade;
});
