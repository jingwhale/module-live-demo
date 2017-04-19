/**
 * flash 播放器封装模块实现文件
 *
 * @version  1.0
 * @author   hzwujiazhen <hzwujiazhen@corp.netease.com>
 * @module   pool/component-video-player/src/flashVideoPlayer
 */
NEJ.define([
	'lib/base/util',
    'lib/base/klass',
    'lib/base/element',
    'lib/util/event',
    'lib/util/flash/flash',
    'lib/util/cache/cookie',
    'pool/edu-front-util/src/flashUtil',
    'text!./video-player-notsupportflash.html'
],function(
	_util, 
	_k, 
	_e,
	_event, 
	_flash,
	_cookie,
	_flashUtil,
    _notsupportflashHtml,
	_p, _o){

	var _g = window;
	
    /**
     * _$$FlashVideoPlayer类
     *
     * @class   module:pool/component-video-player/src/flashVideoPlayer._$$FlashVideoPlayer
     * @extends module:pool/nej/src/util/event._$$EventTarget
     */
   	_p._$$FlashVideoPlayer = _k._$klass();
    var _pro = _p._$$FlashVideoPlayer._$extend(_event._$$EventTarget);
    
    _pro.__init = function(){
        this.__super();
    }

    _pro.__reset = function(_options){
        this.__super(_options);

        this.__options = _options;
        this.__videoOptions = _options.data;

        // 判断是否支持flash
        if (!_flashUtil._$checkFlash()) {
        	this.__showNotSupportFlash();
        	return;
        };

        this._hasDoLoad = false;

        this.__initInterface();
        this.__genFlashPlayer();
    }

    // 显示为安装fash
    _pro.__showNotSupportFlash = function(){
        this.__options.parent.innerHTML = _notsupportflashHtml;
    }

    // 创建命名空间，注册回调方法
    _pro.__initInterface = function(){
    	var _jsNamespaceStr = 'edu.front.flashVideoPlayer' + _util._$randNumberString(2);
        
        this.__videoOptions.flashNamespace = _jsNamespaceStr;

		this.__jsNamespace = NEJ.P(this.__videoOptions.flashNamespace);

		// 播放事件
        this.__jsNamespace.onStartLoad      = this.__onStartLoad._$bind(this);
        this.__jsNamespace.playComplete     = this.__onPlayEndHandle._$bind(this);
		this.__jsNamespace.anchorHandle 	= this.__onAnchorHandle._$bind(this);
		this.__jsNamespace.changeVolume 	= this.__onChangeVolume._$bind(this);
		this.__jsNamespace.changeMute 		= this.__onChangeMute._$bind(this);
		this.__jsNamespace.onSeek 			= this.__onSeek._$bind(this);
		this.__jsNamespace.onPlay 			= this.__onPlay._$bind(this);
		this.__jsNamespace.onPause			= this.__onPause._$bind(this);
		this.__jsNamespace.onPlayClick		= this.__onPlayClick._$bind(this);
		this.__jsNamespace.onPauseClick		= this.__onPauseClick._$bind(this);
		this.__jsNamespace.selectResolution = this.__onSelectResolution._$bind(this);
		this.__jsNamespace.selectCDN 		= this.__onSelectCDN._$bind(this);
        this.__jsNamespace.selectCaption    = this.__onSelectCaption._$bind(this);
        this.__jsNamespace.liveStreamClosed = this.__onLiveStreamClosed._$bind(this);

  		// 截图事件
		// this.__jsNamespace.onCutComplete 	= this.__onCutPicComplete._$bind(this);
		// this.__jsNamespace.onCutError 		= this.__onCutPicError._$bind(this);
		// this.__jsNamespace.onCutProgress 	= this.__onCutPicProgress._$bind(this);
    }

    // 插入swf
    _pro.__genFlashPlayer = function() {	
		var _swfUrl = '', _uiPath = '';

		if(this.__videoOptions.isLocal){
			// 如果是本地调试
			_swfUrl = this.__videoOptions.videoPlayerSwfLocalPath;
			_uiPath = '&uiLocalPath=' + this.__videoOptions.videoPlayerUISwfLocalPath;
			
		}else{
			_swfUrl = this.__videoOptions.videoPlayerSwfRemoteUrl;
			_uiPath = '&uiRemotePath=' + this.__videoOptions.videoPlayerUISwfRemotePath;
		}

		var _flashvars = 'namespace=' + this.__videoOptions.flashNamespace + 
                         '&host=' + this.__videoOptions.host + 
                         '&isLive=' + (this.__videoOptions.mode == 'live') + //  直播模式
			             '&isAutoPlay=' + this.__videoOptions.autoStart +
			             '&isPreload=' + this.__videoOptions.preload +
			             (this.__videoOptions.volume ? ('&volume=' + this.__videoOptions.volume):'') + 
			             (this.__videoOptions.mute ? ('&mute=' + this.__videoOptions.mute):'') +
			             '&isLocal=' + Boolean(this.__videoOptions.isLocal) + 
			             '&showCdnSwitch=' + (this.__videoOptions.mode == 'live' ? false : this.__videoOptions.showCdnSwitch) + // 直播模式不支持线路选择
                         '&isInnerSite=' + this.__videoOptions.innerSite + 
                         '&showPauseAd=' + this.__videoOptions.showPauseAd + 
			             _uiPath;

    	// 构建flash对象
		_flash._$flash({
			src : _swfUrl,
			width : '100%',
			height : '100%',
			parent : this.__options.parent,
			params : {
				'wmode' : 'transparent',
				'allowscriptaccess' : 'always',
				'allowFullScreen' : !this.__videoOptions.notAllowFullScreen,
				'flashvars' : _flashvars
			},
			onready:function(_flashObj){
				this.__flashObj = _flashObj;
                console && console.log('get flash obj:' + this.__flashObj);
			}._$bind(this)
		});

		this._$load(this.__videoOptions.videoData);
    }

    // 执行flash方法
    _pro.__setFlashFunc = function(_func) {
        console && console.log('do __setFlashFunc:' + _func + ' , '+ this.__flashObj);
        console && console.log('check flash, func:' + _func + ', flashObj:' + this.__flashObj);

		//设置数据
		if(!!_func && !!this.__flashObj){
			try{
                console && console.log('do func 1');
                _func();
            }catch(e){
                console && console.log('do func fail 1:' + e);
            }
			
		}else{
			if(!!this.__timer){
				this.__timer = _g.clearInterval(this.__timer);
			}

            var count = 0;

			//100ms后再调用func
			this.__timer = _g.setInterval(function(){
        
                // 测试
                count++;
                if (count < 10) {
                    console && console.log('check flash.........');
                    console && console.log('check flash, func:' + _func + ', flashObj:' + this.__flashObj);
                };

				if(!!_func && !!this.__flashObj){
					try{
                        console && console.log('do func 2');
                		_func();
            		}catch(e){
                        console && console.log('do func fail 2:' + e);
                    }
					
					this.__timer =  _g.clearInterval(this.__timer);
				}
			}._$bind(this),100);
		}
	};

    // 清楚flash节点
    _pro.__clear = function(){
        if(!!this.__parent){
            var _list = _e._$getChildren(this.__parent);
            if(!!_list){
                for(var i = 0; i < _list.length; i++){
                    this.__parent.removeChild(_list[i]);
                }
            }
        }

        if(!!this.__timer){
            this.__timer = _g.clearInterval(this.__timer);
        }

        delete this.__flashObj;
    }

    _pro.__destroy = function(){
		this.__clear();

		this.__supDestroy();
    }

   	////////////////////////// 以下是播放器提供的方法 /////////////////////////////

   	// 因为跨域问题，截图功能暂时不可用
  //   _pro._$cutVideoPic = function(_uploadUrl){
  //   	this.__setFlashFunc(function(){
		// 	this.__flashObj.cutVideo({
		// 		'uploadUrl' : _uploadUrl || '请提供上传地址'
		// 	});
		// }._$bind(this));
  //   }

    // 停止当前视频播放
	_pro._$stop = function(){
		this.__setFlashFunc(function(){
			this.__flashObj.nejstop();
		}._$bind(this));
	}

	// 加载新视频
	_pro._$load = function(_videoData){
		if (!_videoData) {
            return;
        };

        console && console.log('_$load __setFlashFunc');

        this._hasDoLoad = false;

        // 兼容老的写法，清晰度时放到里面的
        this.__videoOptions.videoData.defaultQuality = this.__videoOptions.defaultQuality; 
        
		this.__setFlashFunc(function(){
            console && console.log('_$load into load');

			this.__flashObj.stop();
			this.__flashObj.load(this.__videoOptions.videoData);
            this._hasDoLoad = true;

            console && console.log('_$load into load finish');
		}._$bind(this));
	}
	
	// 暂停视频
	_pro._$pause = function(){
    	this.__setFlashFunc(function(){
    		this.__flashObj.pause();
    	}._$bind(this));
	}

	// 恢复视频
	_pro._$resume = function(){
    	this.__setFlashFunc(function(){
    		this.__flashObj.nejplay();
    	}._$bind(this));            
	}

	// 获取当前视频播放的时间
	_pro._$getPosition = function(_callback){
        this.__setFlashFunc(function(){
    		_callback(this.__flashObj.getPosition());
    	}._$bind(this));
	}
	
	// 设置跳转到对应的时间,用于驻点播放
	_pro._$seek = function(_seekSecs){
		this.__setFlashFunc(function(){
			this.__flashObj.seekTime(_seekSecs);
		}._$bind(this));
	}

	// 获取播放器的状态
	_pro._$getState = function(_callback){
        this.__setFlashFunc(function(){
            _callback(this.__flashObj.getState());
        }._$bind(this));
	}

	// 获取播放器的状态详细信息
	_pro._$getStateInfo = function(_callback){
        this.__setFlashFunc(function(){
            _callback(this.__flashObj.getStateInfo());
        }._$bind(this));
	}

    // 直播流检查和重新加载，只有flash支持
    _pro._$checkLiveReload = function(){
        if (!this._hasDoLoad) { // 没有加载视频时不能调用
            return;
        };

        this.__setFlashFunc(function(){
            this.__flashObj.checkLiveReload();
        }._$bind(this));
    }

    // 当前是否卡顿
    _pro._$isBlock = function(){
        return this.__flashObj.isBlock();
    }

    // 原始帧率
    _pro._$metaFPS = function(){
        return this.__flashObj.metaFPS();
    }

    // 实际帧率
    _pro._$currentFPS = function(){
        return this.__flashObj.currentFPS();
    }

    // 实际kbps
    _pro._$currentKbps = function(){
        return this.__flashObj.currentKbps();
    }
    
    //////////////////////// 以下是播放器事件 //////////////////////////
    _pro.__onStartLoad = function(_data){
        this._$dispatchEvent('onStartLoad', _data);
    }

    _pro.__onPlayEndHandle = function(){
    	this._$dispatchEvent('onPlayEnd');
    }

    _pro.__onAnchorHandle = function(_data){
    	this._$dispatchEvent('onAnchorPoint', _data);
    }

    _pro.__onChangeVolume = function(_videoVolume){
		this._$dispatchEvent('onChangeVolume', _videoVolume);
    }

    _pro.__onChangeMute = function(_isMute){
		this._$dispatchEvent('onMute', _isMute);
    }

    _pro.__onSeek = function(_seekData){
    	this._$dispatchEvent('onSeek', _seekData);
    }

    _pro.__onSelectResolution = function(_resolutionData){
		this._$dispatchEvent('onSelectResolution', _resolutionData);
    }

    _pro.__onSelectCaption = function(_captionData){
		this._$dispatchEvent('onSelectCaption', _captionData);
    }    

    _pro.__onSelectCDN = function(_cdnData){
    	this._$dispatchEvent('onChangeCDN', _cdnData);
    }

    _pro.__onLiveStreamClosed = function(){
    	this._$dispatchEvent('onLiveStreamClosed');
    }

    _pro.__onPlay = function(){    	
    	this._$dispatchEvent('onPlay');
    }

    _pro.__onPause = function(){
    	this._$dispatchEvent('onPause');
    }

    _pro.__onPlayClick = function(){    	
    	this._$dispatchEvent('onPlayClick');
    }

    _pro.__onPauseClick = function(_position){
    	this._$dispatchEvent('onPauseClick', _position);
    }

    // _pro.__onCutPicComplete = function(_data){
    // 	this._$dispatchEvent('onCutPicComplete', _data);
    // }

    // _pro.__onCutPicError = function(_error){
    // 	this._$dispatchEvent('onCutPicError');
    // }

    // _pro.__onCutPicProgress = function(){
    // 	this._$dispatchEvent('onCutPicProgress');
    // }

    // 返回结果可注入给其他文件
    return _p;
});
