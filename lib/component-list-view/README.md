# 列表视图基类

## 组件状态

[![build status](https://g.hz.netease.com/edu-frontend/component-list-view/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-list-view/commits/master)


### 对外注意暴露的方法

 1. destroy() 刷新组件，一般模块中调用此方法
 2. go(index) 跳转到指定页码，分页器可自动绑定此

 3. addItem() 添加列表项，未具体实现，子类需重写
 4. deleteItem() 删除列表项，未具体实现，子类需重写
 5. updateItem() 更新列表项，未具体实现，子类需重写
 6. getItem() 获取列表项详情，未具体实现，子类需重写

### 可以参考消息中心列表
※[可以参考消息中心列表，继承此基类][1]


  [1]: https://g.hz.netease.com/edu-frontend/component-list-view/blob/master/src/list_view/component.js

### 使用举例：(列表需要重写_getCacheInst方法)

```

    NEJ.define([
        'pool/component-list-view/src/list_view/component',
        'pool/component-pager/src/pager_ui',
        'pool/cache-message/src/message/cache'
    ],function(
        ListView,
        Pager,
        mc
    ){

        /**
         * 消息列表组件
         *
         * @class   module:pool/module-message/src/component/message_list_view/component.MessageListView
         * @extends module:pool/component-list-view/src/list_view/component
         *
         * @param   {Object} options - 组件构造参数
         */
        var MessageListView = ListView.$extends({

            /**
             * 获取cache实例
             *
             * @protected
             * @method  module:pool/module-message/src/component/message_list_view/component.MessageListView#_getCacheInst
             * @param   {Object} options - 缓存事件配置信息
             * @returns {Void}
             */
            _getCacheInst: function (options) {
                return mc.Message._$allocate(options);
            }
        });

        return MessageListView;
    });

```
