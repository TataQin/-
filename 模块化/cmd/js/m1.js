// js/m1.js
define(function(require, exports, module) {
    // 使用第三方库 lodash.js，script标签导入
    // 优先require，不然使用script
    _.map([1,2], function(item) {
      console.log(item);
    })
  
    // 异步引入
    require.async('m2', function(m2) {
      console.log('异步引入 m2');
    }); 
  
    // 每个函数单独导出
    exports.add = function(x, y) {
      return x + y;
    }
  
    // 或者 先定义，再统一导出
    // function add(x, y) {
    //   return x + y;
    // }
    // modules.exports = {
    //   add: add
    // }
  });