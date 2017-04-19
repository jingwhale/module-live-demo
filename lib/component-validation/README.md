# validation组件

## 当前状态

[![build status](https://g.hz.netease.com/edu-frontend/component-validation/badges/feature/2c_coverage_syy_20161230/build.svg)](https://g.hz.netease.com/edu-frontend/component-validation/commits/feature/2c_coverage_syy_20161230)

## 使用方法

### 单个组件添加校验
```
<ux-validation rules={rules} value={value} autoValidating={autoValidating} ref="validation">
    <ux-input value={value} />
</ux-validation>

this.refs.validation.validate();
```

### 多个组件一起校验
```
<ux-validation-container ref="validation">
    <ux-validation rules={rules1} value={value1} >
        <input value={value1} />
    </ux-validation>

    <ux-validation rules={rules2} value={value2} >
        <input value={value2} />
    </ux-validation>

    <ux-input />
</ux-validation-container>

this.$refs.validation.validate();
```

## rules
### 缺省校验rules

| 类型名称 | 描述 |
| :--- | :--- |
| is | 使用rule.reg校验是否合法 |
| isRequired | 检测是否填满, 空字符串为true |
| isFilled | 检测是否填满, 空字符串为true |
| isEmail | 检测是否是邮箱格式的内容 |
| isMobilePhone | 检测检测是否是手机号 |
| isURL | 检测是否为合法的url |
| isSoftDecimal2 | 输入的数字是否在rule.min到rule.max这个区间内 |
| isLength | 输入的字符数是否在rule.min到rule.max这个区间内 |
| inputTips | 输入的字符数在rule.min到rule.max这个区间内会提示不同的文案 |

### rules 范例
```
var rules = [{  /* 缺省方法 */
    type: "isFilled",
    message: "课程名不能为空"
}, {            /* 自定义方法 */
    type: "custom",
    method: function(value){
        return true;
    }
}, {            /* 正则方法 */
     type: "is",
     reg: new RegExp('//', 'g')
 }];

```
