
define('m1', ['lodash', 'm2'], function(_, m2) {
    _.map([1,2], function(num){
      // console.log('num: ', num);
    });

    // console.log(m2);
  
    var add = function(x, y) {
      return x + y;
    };
  
    return {
      name: 'm1.js',
      add: add,
      map: _.map,
    };
})