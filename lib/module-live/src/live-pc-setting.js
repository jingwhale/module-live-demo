NEJ.define([

],function () {
    return {
        "live-pc": {
            
        },
        "cache-live": {
            //获取直播拉流地址
            'live-getStraamUrl': {
                method: 'POST',
                notShowLoading : !0,
                hideError : !0,
                url: '/j/live/getLiveStream.json'
            }
        }
    }
});
