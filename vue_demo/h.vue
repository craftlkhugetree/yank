render(createElement) {
    return
        createElement('el-input', {
          props: {
            value: this.itemConfig.value // 这里是自己实现一个 v-model
          },
          on: {
            change: (nVal) => { // 这里是自己实现一个 v-model
              this.itemConfig.value = nVal
            }
          }
        }, [子元素]
        )}


Vue2初始化的时候，会对 data 做一个深度遍历添加 get 、 set 变成响应时数据，并且在组件执行 render函数时，会访问到这些对象的属性。
一旦访问到，就会触发 data属性 的依赖收集动作，如果无脑多的属性时，这个 get方法 将被无脑执行。
for (const key of Object.keys(cur)) {
      if (key === 'value') continue
      // 将不是 value 的属性都进行非响应式优化
      Object.defineProperty(cur, [key], { enumerable: false })
    }

import { ref, h,render,onMounted} from 'vue'
h函数（createVnode）用于创建一个虚拟DOM；
render函数用于输出虚拟DOM；在Vue是无法使用原生的方式将组件当做普通DOM动态加入到其他的DOM中，通过render函数的第二个参数指定需要挂载DOM。


HTML DOM nodeType 属性返回节点类型。

如果节点是一个元素节点，nodeType 属性返回 1。

如果节点是属性节点, nodeType 属性返回 2。

如果节点是一个文本节点，nodeType 属性返回 3。

如果节点是一个注释节点，nodeType 属性返回 8。

该属性是只读的。