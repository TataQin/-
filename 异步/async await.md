理解async/await
Async/Await就是一个自执行的generate函数。利用generate函数的特性把异步的代码写成“同步”的形式。

async 函数是什么？一句话，它就是 Generator 函数的语法糖。

``` js
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

上面代码的函数gen可以写成async函数，就是下面这样
``` js
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```
一比较就会发现，async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await，仅此而已。

async相比于Generator的优化，有如下几点：
● 内置执行器。
● 更好的语义：async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。
● 更适用性：async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。
● 返回值是Promise：async函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而await命令就是内部then命令的语法糖

- 返回promise对象
``` js
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```
async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态。抛出的错误对象会被catch方法回调函数接收到。

``` js
async function f() {
  throw new Error('出错了');
}

f().then(
  v => console.log(v),
  e => console.log(e)
)
// Error: 出错了
```

手写async/await实现
``` js
function simple() {
  return new Promise((resolve, reject) => {
    setTimeout( function() {
      console.log('success!');
      resolve();
    }, 250)
  })
}

function awesome(){
  console.log('awesome');
}

function asyncAutoGenerator() {
    function *generatorFn() {
        const f1 = yield simple();
        const f2 = yield awesome();
        return 1;
    }
    function autoGenerator(gen) {
        return new Promsie((resolve,reject)=> {
            var genFn = gen()
            function _next(value) {
                try {  
                  var result = genFn.next(value);
                } catch (err) {
                  return reject(err); 
                }
                if(result.done){ // 递归结束
                  return resolve(result.value);
                }
                Promise.resolve(result.value).then(data=>{ 
                  _next(data); // //等待Promise完成就自动执行下一个next，并传入resolve的值
                })
            }
            _next(); // 第一次执行
        })
    }
    return autoGenerator(generatorFn);

}

asyncAutoGenerator().then(v=>{console.log(v)});
```