/**
 * eduPlaer JavaScript Base Library v0.0.1
 *
 *
 * Copyright 2014 NetEase
 * Released under the MIT license
 *
 * Date: 2014-11-27
 * @auther hzwjz@corp.netease.com hzlinannan@corp.netease.com hzluoqunfang@corp.netease.com hzliufh@corp.netease.com 
**/
NEJ.define([

], function(p, o, f, r){

	var _base = {};

	_base.f = function(){};

	_base.toString = Object.prototype.toString;

	_base.trim = function(str){
		return (str || '').replace(/(^\s*)|(\s*$)/g, "");
	}

	_base.isFunction = function(fn){
	    return _base.toString.call(fn) === '[object Function]';
	}
	_base.slice = Array.prototype.slice;

	_base.hasOwnProperty = Object.prototype.hasOwnProperty;

	_base.stringify = function(Object){
	    return JSON.stringify(Object);
	}

	_base.isEmpty = function(obj){
	    for(var p in obj){
	        if(p !== undefined && _base.hasOwnProperty.call(obj, p)){
	           return false; 
	        }
	    }
	    return true;
	}

	/************************* 勿动 *************************/
		var _forIn = function(_obj,_callback,_this){
            if (!_obj||!_callback){
                return;
            }
            // iterate
            var _ret;
            for(var x in _obj){
                if (!_obj.hasOwnProperty(x)) continue;
                _ret = _callback.call(_this,_obj[x],x,_obj);
                if (!!_ret){
                    return x;
                }
            }
        };

		var _doFindIn = function(_method,_klass){
            while(!!_klass){
                var _pro = _klass.prototype,
                    _key = _forIn(_pro,function(v){
                        return _method===v;
                    });
                if (_key!=null){
                    return {
                        name:_key,
                        klass:_klass
                    };
                }
                _klass = _klass._$super;
            }
        };
    /************************* 勿动 *************************/

	/**
	 * create Class, has extend function
	 */
	_base.C = function(){
	    var _class = function(){
	        return this._init.apply(this, arguments);
	    }
	    
	    _class.pro = _class.prototype;
	    
	    _class.extend = function(_super){
	        if(!_base.isFunction(_super)){
	            throw new TypeError('SuperClass must be a function');
	        }
	        
	        // 继承原型
	        var _tmpf = function(){};
	        _tmpf.prototype = _super.prototype;
	        this.prototype = new _tmpf(); // extend _super's prototype
	        
	        var _prototype = this.prototype;
	        _prototype.constructor = this; 
	        
	        if(_prototype._init === undefined){
	            _prototype._init = _base.f;     
	        }
	        	
	        // 父类的引用
	        this._$super = _super;

	        // for super method call
            var _stack = [],
                _phash = {};
            var _doUpdateCache = function(_method,_klass){
                var _result = _doFindIn(_method,_klass);
                if (!_result) return;
                // save state
                if (_stack[_stack.length-1]!=_result.name){
                    _stack.push(_result.name);
                }
                _phash[_result.name] = _result.klass._$super;
                return _result.name;
            };
	        // 调用父类方法
	        this.prototype.__super = function(){
                var _name = _stack[_stack.length-1],
                    _method = arguments.callee.caller;
                if (!_name){
                    _name = _doUpdateCache(_method,this.constructor);
                }else{
                    var _parent = _phash[_name].prototype;
                    // switch caller name
                    if (!_parent.hasOwnProperty(_method)||
                        _method!=_parent[_name]){
                        _name = _doUpdateCache(_method,this.constructor);
                    }else{
                        _phash[_name] = _phash[_name]._$super;
                    }
                }
                // call parent method
                var _ret = _phash[_name].prototype[_name].apply(this,arguments);
                // exit super
                if (_name==_stack[_stack.length-1]){
                    _stack.pop();
                    delete _phash[_name];
                }
                return _ret;
            };
	        
	        return _prototype;
	    }
	    
	    return _class;
	}

	/**
	 * create element by tag name
	 */
	_base.createEl = function(tagName, attrs){
	    var el = document.createElement(tagName || 'div');
	    
	    if(attrs && el.setAttribute){
	        for(var p in attrs){
	            if(_base.hasOwnProperty.call(attrs, p)){
	                el.setAttribute(p, attrs[p]);
	            }
	        }
	    }
	    
	    return el;
	}

	/**
	 * 根据标签名获取元素
	 */ 
	_base.T = function(tag, ele){
	    ele = !!ele[0] ? ele[0] : (ele || document);
	    return !tag ? null : ele.getElementsByTagName(tag);
	}

	/**
	 * 获取事件对象
	 */ 
	_base.getEvent = function(event){
	    if(document.all) return window.event;
	    
	    var func = this.getEvent.caller;
	    
	    while(func != null){
	        var arg0 = func.arguments[0];
	        
	        if (arg0){
	            if((arg0.constructor  == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)){
	                return arg0;
	            }
	        }
	        
	        func = func.caller;
	    }
	    
	    return null;
	}

	/**
	 * 获取鼠标位置
	 */ 
	_base.getMousePos = function(e){
	    if (!e) {
	        e = getEvent();
	    };
	    
	    if(e.pageX || e.pageY){
	        return {x : e.pageX, y : e.pageY};
	    }
	    
	    if(document.documentElement && document.documentElement.scrollTop){
	        return {x : e.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft,
	                y : e.clientY + document.documentElement.scrollTop - document.documentElement.clientTop}
	    }
	    
	    if(document.body){
	        return {x : e.clientX + document.body.scrollLeft - document.body.clientLeft,
	                y : e.clientY + document.body.scrollTop - document.body.clientTop};
	    }
	}

	/**
	 * 获取水平滚动距离
	 */ 
	_base.getScrollX = function(){
	    if(typeof window.pageXOffset == 'number'){
	        return window.pageXOffset;
	    }
	    
	    var d = document.documentElement;
	    if(d && (typeof d.scrollLeft == 'number')){
	        return d.scrollLeft;
	    }

	    var b = document.body;
	    if (b && (typeof b.scrollLeft == 'number')){
	        return b.scrollLeft;
	    }
	    
	    return 0;
	}

	/**
	 * 获取垂直滚动高度
	 */ 
	_base.getScrollY = function(){
	    if(typeof window.pageYOffset == 'number'){
	        return window.pageYOffset;
	    }
	    
	    var d = document.documentElement;
	    if(d && (typeof d.scrollTop == 'number')){
	        return d.scrollTop;
	    }

	    var b = document.body;
	    if (b && (typeof b.scrollTop == 'number')){
	        return b.scrollTop;
	    }
	    
	    return 0; //防止出现undefined的情况
	}

	/**
	 * 获取元素在页面中的绝对位置
	 */ 
	_base.getElePos = (function(){
	    if (document.documentElement.getBoundingClientRect) {
	        return function(ele){
	            var box = ele.getBoundingClientRect();
	            return {x : box.left + _base.getScrollX(), y : box.top + _base.getScrollY()};
	        }
	    } else{
	        return function(ele){
	            var x = 0, y = 0;
	            
	            if(!!window.opera){
	                do{
	                    x += ele.offsetLeft;
	                    y += ele.offsetTop;
	                }while(ele = ele.offsetParent);
	            }else {
	                do{
	                    x += ele.offsetLeft + parseInt(getStyle(ele, 'border-left-width'));
	                    y += ele.offsetTop + parseInt(getStyle(ele, 'border-top-width'));
	                }while(ele = ele.offsetParent);
	            }
	            
	            return {x : x, y : y};
	        }
	    };
	})()

	/**
	* 参照jquery offset实现
	**/
	_base.offset = function(elem){
		var box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument,
			docElem = doc.documentElement;

		if ( elem.getBoundingClientRect ) {
			box = elem.getBoundingClientRect();
		}
		return {
			top: box.top  + ( window.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( window.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	}

    return _base;
});
