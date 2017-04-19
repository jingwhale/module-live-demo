/**
 * --------------------promise----------------------
 * 
 * @module   promise
 * @version  1.0
 * @author   hzliujunwei(hzliujunwei@corp.netease.com)
 * @path     eutil/promise
 * --------------------------------------------------------
 */

NEJ.define(['./adapter/nej.js'], function () {

    if(typeof window.Promise === 'function'){
        return window.Promise;
    }

    var Promise = function(executor) {
        var self = this;

        self.status = 'pending';
        self.onResolvedCallback = [];
        self.onRejectedCallback = [];
        executor = executor || function(){};
        try {
            executor(function(value){
                resolve(self, value)
            }, function(reason){
                reject(self, reason);
            })
        } catch (reason) {
            reject(reason)
        }
    }

    function resolve(promise, value) {
        var self = promise;
        if (value instanceof Promise) {
            return value.then(resolve, reject)
        }
        setTimeout(function() { // 异步执行所有的回调函数
            if (self.status === 'pending') {
                self.status = 'resolved'
                self.data = value
                for (var i = 0; i < self.onResolvedCallback.length; i++) {
                    self.onResolvedCallback[i](value)
                }
            }
        })
    }

    function reject(promise, reason) {
        var self = promise;
        setTimeout(function() { // 异步执行所有的回调函数
            if (self.status === 'pending') {
                self.status = 'rejected'
                self.data = reason
                for (var i = 0; i < self.onRejectedCallback.length; i++) {
                    self.onRejectedCallback[i](reason)
                }
            }
        })
    }

    function resolvePromise(promise2, x, resolve, reject) {
        var then;
        var thenCalledOrThrow = false;

        if (promise2 === x) {
            return reject(new TypeError('Chaining cycle detected for promise!'))
        }

        if (x instanceof Promise) {
            if (x.status === 'pending') { //because x could resolved by a Promise Object
                x.then(function(v) {
                    resolvePromise(promise2, v, resolve, reject)
                }, reject)
            } else { //but if it is resolved, it will never resolved by a Promise Object but a static value;
                x.then(resolve, reject)
            }
            return
        }

        if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
            try {
                then = x.then //because x.then could be a getter
                if (typeof then === 'function') {
                    then.call(x, function rs(y) {
                        if (thenCalledOrThrow) return
                        thenCalledOrThrow = true
                        return resolvePromise(promise2, y, resolve, reject)
                    }, function rj(r) {
                        if (thenCalledOrThrow) return
                        thenCalledOrThrow = true
                        return reject(r)
                    })
                } else {
                    resolve(x)
                }
            } catch (e) {
                if (thenCalledOrThrow) return
                thenCalledOrThrow = true
                return reject(e)
            }
        } else {
            resolve(x)
        }
    }

    Promise.prototype.then = function(onResolved, onRejected) {
        var self = this
        var promise2
        onResolved = typeof onResolved === 'function' ? onResolved : function(v) {
            return v
        }
        onRejected = typeof onRejected === 'function' ? onRejected : function(r) {
            throw r
        }

        if (self.status === 'resolved') {
            return promise2 = new Promise(function(resolve, reject) {
                setTimeout(function() { // 异步执行onResolved
                    try {
                        var x = onResolved(self.data);
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (reason) {
                        reject(reason)
                    }
                })
            })
        }

        if (self.status === 'rejected') {
            return promise2 = new Promise(function(resolve, reject) {
                setTimeout(function() { // 异步执行onRejected
                    try {
                        var x = onRejected(self.data);
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (reason) {
                        reject(reason)
                    }
                })
            })
        }

        if (self.status === 'pending') {
            // 这里之所以没有异步执行，是因为这些函数必然会被resolve或reject调用，而resolve或reject函数里的内容已是异步执行，构造函数里的定义
            return promise2 = new Promise(function(resolve, reject) {
                self.onResolvedCallback.push(function(value) {
                    try {
                        var x = onResolved(value);
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (r) {
                        reject(r)
                    }
                })

                self.onRejectedCallback.push(function(reason) {
                    try {
                        var x = onRejected(reason);
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (r) {
                        reject(r)
                    }
                })
            })
        }
    };

    Promise.prototype['catch'] = function(onRejected) {
        return this.then(null, onRejected)
    };

    Promise.deferred = Promise.defer = function() {
        var dfd = {};
        dfd.promise = new Promise(function(resolve, reject) {
            dfd.resolve = resolve;
            dfd.reject = reject
        });
        return dfd
    };


//所有方法变成FulFilled或者Rejected后执行之后结果
    Promise.all = function(iterable){
        var length = iterable.length;
        var promise = new Promise();
        for(var i=0; i<length; i++){
            var iterate = iterable[i];
            if((!iterate instanceof Promise)){
                iterate = Promise.resolve(iterate);
            }
            iterate.then(makeAllCallback(iterate, i, 'resolve'), makeAllCallback(iterate, i, 'reject'));
        }

        var result = [];
        var count = 0;

        function makeAllCallback(iterate, index, action){
            return function(value){
                if(action === 'reject'){
                    reject(promise, value);
                    return;
                }

                result[index] = value;

                if(++count === length){
                    resolve(promise, result);
                }
            }
        }

        return promise;

    };
//只要有一个方法Fulfilled或者Rejected后执行之后结果
    Promise.race = function(iterable){
        var length = iterable.length;
        var promise = new Promise();
        var settled = false;
        for(var i=0; i<length; i++){
            var iterate = iterable[i];
            if((!iterate instanceof Promise)){
                iterate = Promise.resolve(iterate);
            }
            iterate.then(resolveRaceCallback, rejectRaceCallback);
        }

        function resolveRaceCallback(data){
            if(settled){
                return;
            }
            settled = true;
            resolve(promise, data);
        }

        function rejectRaceCallback(reason){
            if(settled){
                return;
            }
            settled = true;
            reject(promise, reason);
        }

        return promise;

    };

    Promise.resolve = function(value){
        return new Promise(function(resolve, reject){
            resolve(value);
        });
    };

    Promise.reject = function(reason){
        return new Promise(function(resolve, reject){
            reject(reason);
        });
    };

    return Promise;

});
