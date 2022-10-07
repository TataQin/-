// 冒泡排序
// 分两层循环，外循环比较趟数，内循环比较次数
let arr = [3, 1, 2, 5, 4, 8, 9, 7, 6];

function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {       // 外层for循环，循环的是比较的趟数，
        for (let j = 0; j < arr.length - 1; j++) {   // 内层for循环，循环的是比较的次数
            if (arr[j] > arr[j + 1]) {  // 判断比较的两个数，如果前面的大于后面的一位，交换位置
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr 
}

// https://juejin.cn/post/7057546951260110878
// 快速排序: 是根据性能来的，归分排序
// 快排采用的思想是分治的思想，的处理过程是由上而下的，先分区，然后再处理子问题。
function quickSort(arr) {
  partition(arr, 0, arr.length - 1);
  return arr;
}

function partition(arr, lo, hi) {
    if (lo >= hi) return; // 递归跳出条件，能够直接求解的子问题
    const pivot = arr[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
        swap(arr, i, j) // 交换 
        i++;
        }
    }
    swap(arr, i, hi);
    partition(arr, lo, i - 1);
    partition(arr, i + 1, hi);
}
  
function swap(arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

// https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/23/16c1f400af40f991~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp
// 归并排序
// https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/9/7/16d09aebbc5cd5b3~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp
function merge(left, right) {
    let result = []
    let i = 0, j = 0
    while(i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i++])
      } else {
        result.push(right[j++])
      }
    }
    if (i < left.length) {
      result.push(...left.slice(i))
    } else {
      result.push(...right.slice(j))
    }
    return result
}

function mergeSort(array) {
    if (array.length < 2) {
      return array
    }
    let m = Math.floor(array.length / 2) // 分
    let left = mergeSort(array.slice(0, m)) // 归
    let right = mergeSort(array.slice(m)) // 归
    return merge(left, right) // 并
} 
mergeSort([6,4,2,5,3,1])
// 1.数组分成两半，left和right
// 2.递归处理left
// 3.递归处理right
// 4.合并两者结果
// 选择排序
// 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。



