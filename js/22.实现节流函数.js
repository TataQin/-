/**
- 频率控制，返回函数连续调用时，action 执行频率限定为 1次 / delay
- @param delay  {number}    延迟时间，单位毫秒
- @param action {function}  请求关联函数，实际应用需要调用的函数
- @return {function}    返回客户调用函数 */
function throttle(action, delay) {
    var previous = 0;
    // 使用闭包返回一个函数并且用到闭包函数外面的变量previous
    return function() {
      var _this = this;
      var args = arguments;
      var now = new Date();
      if(now - previous > delay) {
          action.apply(_this, args);
          previous = now;
      }
    }
  }