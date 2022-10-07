// 作用： 改变函数this的指向
Function.prototype.callFn = function(context, ...args) {
    context = context || window
    let fn = Symbol()
    context.fn = this
    const result = context.fn(...args)
    delete context.fn
    return result
}
// foo.fn = this
// const res = foo.fn()
// delete foo.fn
// return res


// const foo = {
//     value: 1,
//     bar: function() {
//         console.log(this.value)
//     }
// }

Function.prototype.applyFn = function(context, arr) {
    context = context || window
    let fn = Symbol()
    context.fn = this
    const result = context.fn(...arr)
    delete context.fn
    return result
}

var a = {
  name : "Cherry",
}
var b =  function (a,b) {
  console.log( a + b)
}

b.apply(a,[1,2])     // 3

