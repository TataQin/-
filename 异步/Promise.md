
Promise是一个构造函数，它具有一个参数叫做executor，它是一个函数类型的参数，同时它具有resolve和reject两个方法作为参数的函数
- @param {*} executor 
- 1.应该有两个变量，分别存储resolve&reject处理后的值
- 2.需要一个状态：这个状态就是Promise实例的状态（pending、fulfilled、rejected）
- 3.最后要提供resolve方法及reject方法，这两个方法需要作为executor的参数提供给开发者使用。
- 4.它接受两个参数：
第一个是当Promise的状态变为fulfilled时要调用的函数，与异步操作相关的附加数据都会传递给这个完成函数（fulfillment function）；
第二个是当Promise的状态变为rejected时要调用的函数

``` js
function PromiseFn(executor) {
    const self = this;
    this.value = null;
    this.reason = null;
    this.status = 'pending';
    function resolve(value) {
        self.value = value;
    }
    function reject(reason) {
        self.reason = reason;
    }
    executor(resolve, reject)
}
```

``` js
PromiseFn.prototype.then = function (onfulfilled = Function.prototype, onrejected = Function.prototype) {
    onfulfilled(this.value);
    onrejected(this.reason);
}

let promise = new PromiseFn(resolve => {
    resolve('123')
})

promise.then(data => {
    console.log(data)
})
```
 2.状态完善
    我们知道，Promise实例的状态只能从pending变为fulfilled，或者从pending变为rejected。
    状态一旦变更完毕，就不可再次变化或逆转。也就是说，如果一旦变为fulfilled，就不能再变为rejected
``` js
function PromiseFnState(executor) {
    const self = this;
    this.value = null;
    this.reason = null;
    this.status = 'pending';
    const resolve = value => {
        if (this.status === 'pending') {
            this.value = value;
            this.status = 'fulfilled';
        }
    }
    const reject = reason => {
        if (this.status === 'pending') {
            this.reason = reason;
            this.status = 'rejected'
        }
    }
    executor(resolve, reject)
}
PromiseFnState.prototype.then = function (onfulfilled = Function.prototype, onrejected = Function.prototype) {
    // 当实参不是函数类型时，就需要赋予默认函数值
    onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : data => data
    onrejected = typeof onrejected === 'function' ? onrejected : error => console.error(error)
    if (this.status === 'fulfilled') {
        onfulfilled(this.value); 
    }
    if (this.status === 'rejected') {
        onrejected(this.reason);   
    }
}
```
3.promise异步完善

``` js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
function PromiseFunc(executor) {
    const self = this;
    this.value = null;
    this.reason = null;
    this.status = PENDING;
    this.onFulfilledCallback;
    this.onRejectedCallback;
    function resolve(value) {
        if (self.status === PENDING) {
            self.value = value;
            self.status = FULFILLED;
            self.onFulfilledCallback && self.onFulfilledCallback(value)
        }
    }
    function reject(value) {
        if (self.status === PENDING) {
            self.reason = reason;
            self.status = REJECTED
            self.onRejectedCallback && self.onRejectedCallback(value)
        }
    }
    try {
       executor(resolve, reject)
    } catch (err) {
        reject(err)
    }
}
PromiseFunc.prototype.then = function (onfulfilled, onrejected) {
    let self = this
    const onFullfilledCallback = typeof onfulfilled === 'function' ? onfulfilled : data => data
    const onRejectedCallback = typeof onrejected === 'function' ? onrejected : reason => { throw reason };
    if (self.status === FULFILLED) {
        onFullfilledCallback(self.value); 
    }
    if (self.status === REJECTED) {
        onRejectedCallback(self.reason);   
    }
    // if (self.status === PENDING) {
    // self.onFulfilledCallback = onfulfilled
    // self.onFulfilledCallback = onrejected
    // } 
}

```

// 特殊情况2:按理说应该依次输出1235、1236。将onFulfilledCallback改成数组即可

let promise10= new PromiseFnn((resolve, reject) => { 
    setTimeout(() => {
        resolve(1234)
    }, 2000)
})
promise10.then(v => {
    console.log(v + 1);
});
promise10.then(v => {
    console.log(v + 2);
});


``` js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
function PromiseFn(executor) {
    let self = this
    self.value = null
    self.reason = null
    self.status = PENDING
    self.onFulfilledCallback = []
    self.onRejectedCallback = []
    function resolve(value) {
        if (self.status === PENDING) {
            self.value = value
            self.status = FULFILLED 
            self.onFulfilledCallback.forEach(callback => {
                callback(value)
            })
        }
    }
    function reject(reason) {
        if (self.status === PENDING) {
            self.reason = reason
            self.status = REJECTED  
            self.onRejectedCallback.forEach(callback => {
                callback(value)
            })
        }
    }
    try {
        executor(resolve, reject)
    } catch (err) {
        reject(err)
    }
}
PromiseFn.prototype.then = function (onfulfilled, onrejected) { 
    let self = this
    const onFulfilledCallback = typeof onfulfilled === 'function' ? onfulfilled : data => data
    const onRejectedCallback = typeof onrejected === 'function' ? onrejected : err => { throw err }
    if (self.status === FULFILLED) {
        onFulfilledCallback(self.value)
    }
    if (self.status === REJECTED) {
        onRejectedCallback(self.reason)
    }
    if (self.status === PENDING) {
        self.onFulfilledCallback.push(onFulfilledCallback)
        self.onRejectedCallback.push(onRejectedCallback)
    }
}
```
特殊情况3: 按理说，应该先输出1，再输出data。因为p.then是微任务，要后于同步任务执行
``` js
let promise1 = new PromiseFnn((resolve, reject) => {
resolve('data')
})
promise1.then(data => {
console.log(data)
})
console.log(1)
```

// 特殊情况4: 链式调用
``` js
let p = new Promise(res => res(2));
let then = p.then(v => v);
then instanceof Promise // true
then === p // false
/*也就是说p.then返回的也是一个Promise，而且是全新的Promise */
```

``` js
function PromiseFnAsync(executor) {
    let self = this;
    self.value = null;
    self.status = PENDING;
    self.onFulfilledCallback = [];
    self.onRejectedCallback = [];
    function resolve(value) {
        setTimeout(() => {
            if (self.status === PENDING) {
                self.status = FULFILLED
                self.value = value
                self.onFulfilledCallback.forEach(cb => cb(value))
            }  
        }, 0)
    }
    function reject(reason) {
        setTimeout(() => {
            if (self.status === PENDING) {
                self.status = REJECTED
                self.reason = reason
                self.onRejectedCallback.forEach(cb => cb(reason))
            }    
        }, 0)
    }
    try {
        executor(resolve, reject)
    } catch (err) {
        reject(err)
    }
}
PromiseFnAsync.prototype.then = function (onfulfilled, onrejected) {
    let self = this
    const onFulfilledCallback = typeof onfulfilled === 'function' ? onfulfilled : data => data
    const onRejectedCallback = typeof onrejected === 'function' ? onrejected : err => { throw err }
    let promise2 = new PromiseFnAsync((resolve, reject) => {
        if (self.status === FULFILLED) {
            try {
               let x = onFulfilledCallback(self.value);
                resolve(x);
            } catch(e) {
                reject(e);
            }
        }
        if (self.status === REJECTED) {
            try {
                let x = onRejectedCallback(self.reason)
                resolve(x)
            } catch (e) {
                reject(e)
            }
        }
        if (self.status === PENDING) {
            self.onFulfilledCallback.push((value) => {
                try {
                   let x = onFulfilledCallback(value)
                   resolve(x)
                } catch (err) {
                    reject(err)
               }
            })
            self.onRejectedCallback.push((reason) => {
                try {
                    let x = onRejectedCallback(reason)
                    resolve(x)
                } catch (err) {
                    reject(err)
                }
            })
        } 
    })
    return promise2
}

```

``` js
console.log('start')
new PromiseFnAsync(res => { 
    setTimeout(() => {
        console.log('resolve')
        res(10)
    }, 3000)
}).then(v => {
    console.log('then1')
    return v + 3
}).then(v => {
    console.log('then2')
    console.log(v)
})
console.log('end')
```

start
end
resolve
then1
then2
13

// 特殊情况4: 链式调用
let p = new Promise(res => res(2));
let then = p.then(v => v);
then instanceof Promise // true
then === p // false
/*也就是说p.then返回的也是一个Promise，而且是全新的Promise */

``` js
PromiseFnAsync.prototype.then = function (onfulfilled, onrejected) {
    let self = this
    const onFulfilledCallback = typeof onfulfilled === 'function' ? onfulfilled : data => data
    const onRejectedCallback = typeof onrejected === 'function' ? onrejected : err => { throw err }
    let promise2 = new PromiseFnAsync((resolve, reject) => {
        if (self.status === FULFILLED) {
            try {
               let x = onFulfilledCallback(self.value);
                resolve(x);
            } catch(e) {
                reject(e);
            }
        }
        if (self.status === REJECTED) {
            try {
                let x = onRejectedCallback(self.reason)
                resolve(x)
            } catch (e) {
                reject(e)
            }
        }
        if (self.status === PENDING) {
            self.onFulfilledCallback.push((value) => {
                try {
                   let x = onFulfilledCallback(value)
                   resolve(x)
                } catch (err) {
                    reject(err)
               }
            })
            self.onRejectedCallback.push((reason) => {
                try {
                    let x = onRejectedCallback(reason)
                    resolve(x)
                } catch (err) {
                    reject(err)
                }
            })
        } 
    })
    return promise2
}

```

特殊情况5: x是一个Promise
``` js
function PromiseAsync(execute) {
    let self = this
    self.value = null
    self.reason = null
    self.status = PENDING
    self.onFulfilledCallback = []
    self.onRejectedCallback = []
    function resolve(value) {
        setTimeout(() => {
            if (self.status === PENDING) {
                self.status = FULFILLED
                self.value = value
                self.onFulfilledCallback.forEach(cb => cb(value))
            }
        },0)
    }
    function reject(reason) {
        setTimeout(() => {
            if (self.status === PENDING) {
                self.status = REJECTED
                self.reason = reason
               self.onRejectedCallback.forEach(cb => cb(reason)) 
           }  
        }, 0);
    }
    try {
        execute(resolve, reject)
    } catch (err) {
        reject(err)
    }
}
function resolvePromise(promise2, x, resolve, reject) {
    if (x instanceof PromiseAsync) {
        try {
            let then = x.then
            then.call(x, y => {
               resolvePromise(promise2, y, resolve, reject) 
            }, r => {
               reject(r)     
            })
        } catch(err) {
           reject(err)
        }
    } else {
        resolve(x)
    }
}
PromiseAsync.prototype.then = function (onfulfilled, onrejected) {
    const self = this
    const onFulfilledCallback = typeof onfulfilled === 'function' ? onfulfilled : data => data
    const onRejectedCallback = typeof onrejected === 'function' ? onrejected : err => { throw err } 
    let promise2 = new PromiseAsync((resolve, reject) => {
        if (self.status === FULFILLED) {
            try {
                let x = onFulfilledCallback(self.value)
                resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
                reject(err)
            }
        }
        if (self.status === REJECTED) {
            try {
                let x = onRejectedCallback(self.reason)
                // resolve(x)
                resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
                reject(err)
            }
        }
        if (self.status === PENDING) {
            self.onFulfilledCallback.push((value) => {
                try {
                    let x = onFulfilledCallback(value)
                    // resolve(x)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (err) {
                    reject(err)
                }
            })
            self.onRejectedCallback.push((reason) => {
                try {
                    let x = onRejectedCallback(reason)
                    resolvePromise(promise2, x, resolve, reject)
                    // resolve(x)
                } catch (err) {
                    reject(err)
                }
            })
        }
    })
    return promise2
}
```

``` js
PromiseAsync.all = function(promiseArray) {
    if(!Array.isArray(promiseArray)) {
        throw new TypeError('')
    }
    return new PromiseAsync(resolve, reject) => {
        try {
            let resultArray = []
            const length = promiseArray.length
            for(let i = 0 ; i< length.length; i++) {
                 promiseArray[i].then(data => {
                    resultArray.push(data)
                    if (resultArray.length === length) {
                        resolve(resultArray)
                    }
                }, reject)
            }
        } catch(e) {
            reject(e)
        }
    }
}
```

6. x 是一个 thenable
``` js
new Promise(res => res(10)).then(v => {
    return {
        other: v,
        then: v + 2
    }
}).then(ans => {
    console.log(ans);
});

new Promise(res => res(10)).then(v => {
    return {
        other: v,
        then: () => {
            return v + 2;
        }
    }
}).then(ans => {
    console.log(ans);
});

new Promise(res => res(10)).then(v => {
    return {
        other: v,
        then: (res, rej) => {
            res(v + 2);
        }
    }
}).then(ans => {
    console.log(ans);
});
```
``` js
// 第一个
{
    other: 10,
    then: 12
}
// 第二个 
// 不会打印，即不会then方法里的代码（Promise状态一直在pending）
// 第三个
12
```

综上，Promise对thenable做特殊处理，将其也当做一个Promise来进行处理

``` js
function resolvePromise(promise2, x, resolve, reject) {
+   
    if (typeof x === 'object' && x || typeof x === 'function') {
       try {
            let then = x.then;
+           if (type of then === 'function')
                then.call(x, y => {
                    resolvePromise(promise2, y, resolve, reject);
                }, r => {
                    reject(r);
                });
+           } else {
+               resolve(x);
+           }
        } catch (e) {
            reject(e);
        }
    } else {
        /** 省略 **/
    }
}
```
当 x === promise2时，产生了循环引用
``` js
function resolvePromise(promise2, x, resolve, reject) {
+   if (x === promise2) {
+       reject(new TypeError('chaining cycle'));
+   } else if (typeof x === 'object' && x || typeof x === 'function') {
        /** 省略 **/
    } else {
        resolve(x);
    }
}
```