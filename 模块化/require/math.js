
// console.log(require)
// console.log(define)
define(function(){
  var add = function(x,y) {
    return x + y
  }
  return {
    add: add
  }
})

