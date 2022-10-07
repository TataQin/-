``` js
Promise.MyAll = function (promises) {
  let arr = [],
    count = 0
  return new Promise((resolve, reject) => {
    promises.forEach((item, i) => {
      Promise.resolve(item).then(res => {
        arr[i] = res
        count += 1
        if (count === promises.length) resolve(arr)
      }, reject)
    })
  })
}

```
手写 Promise.allSettled

``` js
Promise.MyAllSettled = function (promises) {
  let arr = [],
    count = 0
  return new Promise((resolve, reject) => {
    promises.forEach((item, i) => {
      Promise.resolve(item).then(res => {
        arr[i] = { status: 'fulfilled', val: res }
        count += 1
        if (count === promises.length) resolve(arr)
      }, (err) => {
        arr[i] = { status: 'rejected', val: err }
        count += 1
        if (count === promises.length) resolve(arr)
      })
    })
  })
}

```