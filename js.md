# // 数组去重的三种办法
let arr4 = [1, 3, 2, 5, 3, 1, 2, 7, 8];
let newArr = arr4.reduce((pre,cur)=>{
    if (!pre.includes(cur)) {
        return pre.concat(cur)
    } else {
        return pre
    }
}, []);
console.log(newArr, '数组去重')
// [1, 3, 2, 5, 7, 8] 

const tmp = new Set(arr4);
console.log(Array.from(tmp), tmp.length)

const filtArr = arr4.filter((cur,index,arr)=>{
    return arr.indexOf(cur) === index
})
console.log(filtArr)



# // 将二维数组转换成一维数组
let arr5 = [[1, 2], [3, 4], [5, 7]];
let newArr2 = arr5.reduce((pre,cur)=>{
    return pre.concat(cur)
}, []);
console.log(newArr2, '二维转成一维')
// [1, 2, 3, 4, 5, 7]

const tmp = arr5.flat(1)
console.log(tmp)
// flat() 函数将删除原始数组中存在的所有空值。默认深度为1。

# // 将多维数组转换成一维数组
    let arr6 = [1,3,[4,5,6,[7,8,4]],[7,0,[2,4],9]];
    let newArr3 = this.flatArr(arr6);
    console.log(newArr3, '多维转一维') // [1, 3, 4, 5, 6, 7, 8, 4, 7, 0, 2, 4, 9]
   
   flatArr(arr){
      return arr.reduce((pre,cur)=>{
        return pre.concat(Array.isArray(cur)?this.flatArr(cur):cur)
      },[])
   }

# //4、操作对象数组中的对象属性
const data = [
      {
        id:1,
        name:'安徽'
      },
      {
        id:2,
        name:'南京'
      },
      {
        id:3,
        name:'上海'
      },
      {
        id:4,
        name:'杭州'
      },
      {
        id:5,
        name:'天津'
      },
      {
        id:6,
        name:'北京'
      },
      {
        id:7,
        name:'山东'
      },
      {
        id:8,
        name:'河南'
      },
      {
        id:9,
        name:'重庆'
      },
      {
        id:10,
        name:'成都'
      },
      {
        id:11,
        name:'合肥'
      },
    ]
    const city_list = data.reduce((prev, item, idx) => {
      let key =
      idx > 8
        ? `${idx + 1}00`
        : `0${idx + 1}00`;
      prev[key] = item.name;
      return prev;
    }, {});
    console.log(city_list, '转换后的城市列表')

  # // 计算数组中每个元素出现的次数
    let arr7 =['红','黄','黑','黄','蓝','红']
    let num = arr7.reduce((pre,cur)=>{
      if(cur in pre){
        pre[cur]++
      }else {
        pre[cur] = 1
      }
      return pre
    },{})
    console.log(num,'num对象') //{红: 2, 黄: 2, 黑: 1, 蓝: 1} 


  # // 在数组中查找最大值和最小值
const arr = [1, 2, 3]; 
Math.max(…arr); // 3