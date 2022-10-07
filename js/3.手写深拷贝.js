
// step1:
function deepClone(target) {
  let cloneVal = Array.isArray(target) ? [] : {};
  if (typeof target !== 'object') return target
  for (let i in target) {
    if (target.hasOwnProperty(i)) { //判断是不是自身的key
      cloneVal[i] = deepClone(target[i]);//每一项就算是基本类型也需要走deepclone方法进行拷贝
    }
  }
  return cloneVal;
}
// let A = [1, 2, 3, { a: 1, b: 2 }]
// A[4] = A
// let B = deepClone(A)

// 如果 A.A = A
// let B = deepClone(A) 会有栈溢出的情况

// 解决循环引用问题，我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题。
// 这个存储空间，需要可以存储key-value形式的数据，且key可以是一个引用类型，我们可以选择Map这种数据结构：


function deepClone(target, map = new WeakMap()) {
    let cloneVal = Array.isArray(target) ? [] : {};
    if (typeof target !== 'object') return target
    if(map.has(target)) {
      return map.get(target)
    }
    map.set(target, cloneVal)
    for (let i in target) {
      if (target.hasOwnProperty(i)) { //判断是不是自身的key
        cloneVal[i] = deepClone(target[i], map);//每一项就算是基本类型也需要走deepclone方法进行拷贝
      }
    }
    return cloneVal;
}

let obj = { name : 'ConardLi'}
const target = new WeakMap();
target.set(obj,'code秘密花园');
obj = null;
// 如果是WeakMap的话，target和obj存在的就是弱引用关系，当下一次垃圾回收机制执行时，这块内存就会被释放掉。
// 如果我们要拷贝的对象非常庞大时，使用Map会对内存造成非常大的额外消耗，而且我们需要手动清除Map的属性才能释放这块内存，而WeakMap会帮我们巧妙化解这个问题。


//判断是否是引用类型
function isObj(val) {   
    return (typeof val == 'object' || typeof val == 'function') && val != null
}
function getType(data) { //获取类型
    var s = Object.prototype.toString.call(data);
    return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};


let A = {
    a: 1,
    b: [1,2,3],
    date: new Date(),
    reg: /\d+/,
    error: new Error(),
    fun: () => { console.log('叽里呱啦，阿巴阿巴') }
}

function deepClone(target, map = new WeakMap()) {
    let cloneVal = Array.isArray(target) ? [] : {};
    if (typeof target !== 'object') return target
    switch(getType(target)) {
        case 'date':
            return new Date(target)
        case 'regexp':
            return new RegExp(target)
        default:
            if(map.has(target)) {
                return map.get(target)
              }
              map.set(target, cloneVal)
              for (let i in target) {
                if (target.hasOwnProperty(i)) { //判断是不是自身的key
                  cloneVal[i] = deepClone(target[i], map);//每一项就算是基本类型也需要走deepclone方法进行拷贝
                }
              }
              return cloneVal;

    }
  
}