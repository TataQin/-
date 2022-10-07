require.config({
    baseUrl: './js',
    paths: {
      m1: "m1",
      m2: "m2",
      lodash: "lodash"
    }
})

define('main',function(){
    require(['m1'],function(m1){
        m1.map([1,2], function(num){
            console.log(num)
        })
        // console.log('name: ', m1.name)
        // console.log('name: ', m1.add(2,8))
    })
})