NEJ.define([
    'base/klass'
],function(
    k
) {
    var Queue = k._$klass();
    var pro = Queue.prototype;

    pro.__init = function (options) {
        this.items = options.items;
        this.length = options.length;
    };

    pro.limitLength = function (arr,diffLen) {
        arr.splice(0,diffLen);
        return arr;
    };

    pro.concat = function (arr) {
        var totalLength = arr.length + this.items.length;
        if(arr.length >= this.length){
            this.items = this.limitLength(arr,arr.length - this.length);
        }else if(totalLength >= this.length){
            this.items = this.limitLength(this.items,totalLength - this.length);
        }
        this.items = this.items.concat(arr);
        return this;
    };

    pro.push = function (item) {
        if(options.length <= this.items.length){
            this.pop();
        }
        this.items.push(item);
    };

    pro.pop = function (item) {
        this.items.pop();
    };

    pro.empty = function () {
        this.items = [];
    };

    pro.size = function () {
        return this.items.length;
    };

    return Queue;

});
