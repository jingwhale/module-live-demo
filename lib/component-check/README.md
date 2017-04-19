# Check 组件

## 组件状态

[![build status](https://g.hz.netease.com/edu-frontend/component-check/badges/master/build.svg)](https://g.hz.netease.com/edu-frontend/component-check/commits/master)

## 组件文档

组件详细文档请查看 [这里](./docs/index.html)

## 样式重写

样式的层级结构如下所示

```bash
ux-check
   |- ux-check_xxx ux-check_xxx__aa   描述描述
   |- ux-check_yyy ux-check_yyy__bb   描述描述
   |- ux-check_zzz                            描述描述
```

可用的控制样式表

| 名称 | 描述 |
| :--- | :--- |
| z-dis | 描述描述 |
| z-crt | 描述描述 |

## 使用范例

### 标签化使用

组件关联的结构可如下所示

```html
<ux-check></ux-check>
<ux-check-group></ux-check-group>
<ux-radio></ux-radio>
<ux-radio-group></ux-radio-group>
<ux-radio2-group></ux-radio2-group>
```

### 脚本中使用

组件内置样式和结构，使用者如果样式与结构同内置一致则可以直接使用，范例如下

```javascript
NEJ.define([
    'pool/component-check/src/check/{mode}/ui',
    'pool/component-check/src/check-gropu/{mode}/ui',
    'pool/component-check/src/radio/{mode}/ui',
    'pool/component-check/src/radio-group/{mode}/ui'
    
],function(
    CheckUI,
    CheckGroupUI,
    RadioUI,
    RadioGroupUI
){
    var Check = new CheckUI({
        data:{
            
        }
    });
    Check.$inject('#parent');
    var CheckGroup = new CheckGroupUI({
        data:{
            
        }
    });
    CheckGroup.$inject('#parent');
    var Radio = new RadioUI({
        data:{
                
        }
    });
    Radio.$inject('#parent');
    var RadioGroup = new RadioGroupUI({
        data:{
            
        }
    });
    RadioGroup.$inject('#parent');      
})
```
