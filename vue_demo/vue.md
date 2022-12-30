meta就是元
meta data就是元数据，用来描述数据的数据；如一个数据1.70，我们并不知道它代表什么，但是身高：1.70我们就知道1.70表示身高，而身高就是元数据，用来描述数据1.70
# vant
预览图片：
import { ImagePreview } from 'vant';
ImagePreview({images: [url], showIndex: false});

<van-overlay :show="true">
    <div class="loading" @click.stop>
      <van-loading size="36px" vertical>加载中...</van-loading>
    </div>
</van-overlay>

调取摄像头：
<van-uploader 
	v-model="fileListBack" 
	:after-read="onReadIdCardBack" 
	:max-size="5012 * 1024" 
	:before-delete='beforeDeleteBack' 
	upload-text="身份证国徽面" 
	multiple 
	:max-count="1" 
	@oversize="onOversize" 
	capture="camera"  
	accept="image/*"
/>

# Vue

vue info
vue create 项目名
vue -V 全局 vue-cli 的版本
npm list vue 当前项目与 vue 相关的依赖

vue2 基于Object.defineProperty  ，但是他有很多缺陷，比如 无法监听数组基于下标的修改，不支持 Map、Set、WeakMap 和 WeakSet等缺陷 ，
区分响应式和双向绑定
响应式一般指：数据改变驱动视图改变，是单向的
双向绑定：是双向的，视图反过来也可以改变数据。也就是说响应式是双向绑定的一环

beforeCreate 在这个生命周期函数中无法通过 vm 访问到 data 中的数据、methods 中配置的方法，所以这里的 this 不是 vm。
created：在这个生命周期函数中可以通过 vm 访问到 data 中的数据、methods 中配置的方法（在内存中），所以这里的 this 是 vm。
与 2.x 版本生命周期相对应的组合式 API：
beforeCreate -> 使用 setup()
created -> 使用 setup()
beforeMount -> onBeforeMount
mounted -> onMounted
beforeUpdate -> onBeforeUpdate
updated -> onUpdated
beforeDestroy -> onBeforeUnmount
destroyed -> onUnmounted
errorCaptured -> onErrorCaptured
————————————————
通过 .native 修饰符来处理组件标签上的原生事件
如果需要在子组件的dom上绑定原生的事件，而不是一个自定义事件，这时，可以通过 Vue 提供的修饰符 .native 来告知绑定的是原生事件。

el-input 内@keyup.enter.native="doLogin" 按回车登录。

v-show 的直接子组件 created 不执行，要用 watch 监视传给子组件的参数来执行，$refs['child'].fun 的执行也可能不及时。

import Loading from '../components/loading'
// 方法一：name 是组件的名字
Vue.component(Loading.name, Loading)
`// 方法二：前提是 Loading 有提供 install 这个方法 `
Vue.use(Loading);

<counter v-model:count="count"></counter>
子组件： name: 'Counter',
props: ['count'],
emits: ['update:count']

<!-- 多个`v-model`绑定、 -->

<vModelText v-model:text="data1" v-model:num.numReg="numData"> </vModelText>
props:['text','num','numModifiers'],
emits:['update:text','update:num'],
this.$emit('update:num',val)
.sync 可以绑定多个父组件的变量, v-model只能一个

'@': resolve('src'),
img: "@/../static/images/quanbu",
或者 'st@tic': resolve('static'),
img: "st@tic/images/quanbu",

webpack 的 process.env 需要自己配置：  
 new webpack.DefinePlugin({
'process.env': require('../config/dev.env')
}),
vue.config.js 有模式的概念，所以不用专门设置 env，vue-cli-service serve 默认是 development。也可以直接用--mode 指定： "serve": "vue-cli-service serve --mode production",
有了模式就不用每次打包时都去更改 vue.config.js 文件了。比如在测试环境和生产环境， publicPath 参数 （部署应用包时的基本 URL） 可能不同。遇到这种情况就可以在 vue.config.js 文件中，将 publicPath 参数设置为：
publicPath: process.env.BASE_URL
设置之后，再在各个 .env.[mode] 文件下对 BASE_URL 变量 进行配置就行了，这样就避免了每次修改配置文件的尴尬。

prop 是单向绑定，不能直接更改数据，只能由父组件传输过来。可以用父组件 sync，子组件 emit 的方式修改。
解决办法：
1、可以在子组件中 声明一个中间变量（value），把父组件传过来的值(item)赋值给中间变量(value),当单选切换时修改的数据为 value,就不会报错
2、使用.sync 修饰符与$emit(update:xxx)
父组件
<comp :item.sync="item"></comp>
子组件
this.$emit('update:item',data)
————————————————
props 写在路由里，可以让组件不必通过$route 传参，实现解耦，使其不必捆绑在某些 url 或父组件里。

provide---inject 跨级传参

computed: {
tempCountPlusTempCount2() {
return this.tempcount+this.tempcount2
},
...mapState(['count','name']), // 映射 this.count 为 store.state.count
...mapState({
nameAlias: 'name', // string 映射 this.nameAlias 为 store.state.name 的值

- // 用普通函数 this 指向 vue 实例,但是在箭头函数中 this 就不是指向 vue 实例了，所以这里必须用普通哈数
  countplustempcount: function (state) {
  return this.tempcount + state.count
  },
  countplustempcount2 (state) {
  return this.tempcount2 + state.count
  }
  })
  }

1、在组件标签上绑定的事件是自定义事件，在组件模板里绑定的事件才是原生的事件。（自定义事件可以通过在子组件中通过 this.$emit 去触发，但是这样太麻烦）
2、给组件标签上的事件添加‘.native’修饰符，就可以使事件变为原生点击事件而不再是自定义事件。

el-form 的 validator 必须每一个 if-else 都有 callback，否则流程中断。
validator: (r, v, cb) => { // rule, value, callback
if (!this.form.eatstarttime || !this.form.eatendtime) {
return cb(new Error("请选择用餐日期"));
} else if (!this.form.eatstarttype || !this.form.eatendtype) {
return cb(new Error("请选择用餐类型"));
} else {
cb();
}
}
复杂属性的设置 <el-form-item  :prop="`attrList[${index}].attrv`">
单个属性的校验 this.$refs['form'].validateField('baseList', valid => {})
表单中的输入框无法输入，则要 @input=$forceUpdate() ！关键是 form 里没有预先定义这个属性！

el-input 嵌套层级太多导致无法输入时（比如在 el-form-item 中），可以使用 @input=$forceUpdate //强制刷新

el-checkbox 的勾选框颜色，不能用逗号来统一设置一组值，只能一个个值的设置：
/deep/ .el-checkbox**input.is-checked .el-checkbox**inner {
background-color:#00B09B;
border-color:#00B09B;
}
/deep/ .el-checkbox**input.is-indeterminate .el-checkbox**inner {
background-color:#00B09B;
border-color:#00B09B;
}
/deep/ .el-checkbox**input.is-checked + .el-checkbox**label {
color: #00B09B;
}
/deep/ .el-checkbox.is-bordered.is-checked{
border-color: #00B09B;
}
/deep/ .el-checkbox**input.is-focus .el-checkbox**inner{
border-color: #00B09B;
}

移动端 el-table 在数据请求后，固定列错位，解决办法就是让 table 重新布局。官方提供了 doLayout 方法。
按照这个方法在请求得到数据的时候，用 nextTick 对 table 的 DOM 重新渲染。
this.$nextTick(() => {
        // el-table加ref="multipleTable"
        this.$refs.multipleTable.doLayout();
});
试了下不生效，说明是别的问题。查看了表格中的最后一列，发现该列的宽度设置的较低，内存已经越出，导致每行错位。将该列的宽度调宽。恢复正常。

el-table 多个属性在一个 prop 里，用逗号隔开。

合并某些行或列，灵活设置合计。
objectSpanMethod({ row, column, rowIndex, columnIndex }) {
if (this.applyInfoForm.resArr && this.applyInfoForm.resArr.length) {
if (rowIndex === this.applyInfoForm.resArr.length - 1) {
if (columnIndex === 0) {
//定位到 6 行 0 列的 ID，告诉该单元格合并 1 行 4 列
return [1, 4];
} else if (columnIndex === 4) {
return [1, 1];
} else {
//定位到 6 行其他列，告诉该单元格不显示
return [0, 0];
}
}
}
}
el-table 表头样式设置 :header-cell-style="{ background: '#F3F5F9' }"
el-table 某一行样式设置 :row-class-name="tableRowClassName"
tableRowClassName({ row, column, rowIndex, columnIndex }) {
if (rowIndex == this.resList.length - 1) {
console.log(row, rowIndex);
return "last-line";
}
return ''
},
/deep/ .last-line {
font-weight: bolder !important;
}

import elImageViewer from "element-ui/packages/image/src/image-viewer";
<el-image-viewer
            v-if="showViewer"
            :on-close="closeViewer"
            :url-list="srcList"
          ></el-image-viewer>
或者main.js里
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
Vue.component('el-image-viewer', ElImageViewer)
移动端使用el及其样式：
import {Form, Button, Input, FormItem} from 'element-ui'
import "element-ui/lib/theme-chalk/index.css";
Vue.use(Form).use(Button).use(Input).use(FormItem)

路由传递数组参数：
this.$router.push({
          path: '/irrgate-manage/audit/audit/batch',
          query: { data: JSON.stringify(this.checkedList)},
        });
this.checkedList = JSON.parse(this.$route.query.data);

// iframe 内部输入框校验（富文本）,如果跨了子域，要在父页面跟子页面都设置 document.domain,值都是域名，不要前面的 www 什么的
mounted() {
let \_this = this;
let frame = document.getElementsByClassName("ke-edit-iframe");
if (frame && frame.length) {
let w = frame[0].contentWindow; // 获取 iframe 内部 body
let b = w.document.body;
let MutationObserver =
window.MutationObserver ||
window.webkitMutationObserver ||
window.MozMutationObserver;
\_this.mutationObserver = new MutationObserver(function (mutations) {
let tmp = \_this.transHtml(); // 给 editForm.dhtml 赋值
\_this.$refs.editForm.validate((valid) => {})
});
// 开始监听 iframe 内部元素变动
\_this.mutationObserver.observe(b, {
childList: true, // 子节点的变动（新增、删除或者更改）
attributes: true, // 属性的变动
characterData: true, // 节点内容或节点文本的变动
subtree: true, // 是否将观察器应用于该节点的所有后代节点
attributeFilter: ["class", "style"], // 观察特定属性
attributeOldValue: true, // 观察 attributes 变动时，是否需要记录变动前的属性值
characterDataOldValue: true, // 观察 characterData 变动，是否需要记录变动前的值
});
}
},
beforeDestroy() {
this.mutationObserver.disconnect(); // 此处以后的不再监听
},

// 对于 editForm.content.totalScore，如何设置校验规则。
<el-col :span="12">
<el-form-item label="总分" prop="totalScore"></el-form-item>
<el-form-item prop="content.totalScore" style="margin-left: -100px" :rules="rules.totalScore">
<el-input
                v-model="editForm.content.totalScore"
                disabled
              ></el-input>
</el-form-item>
</el-col>
let validateZero = (rule, val, callback) => {
if (val == "0") {
return callback(new Error("总分不能为零!"));
} else {
return callback();
}
};
totalScore: [
{ required: true, validator: validateZero, trigger: "change" },
],

computed: {
// 控制显示的内容
computedTxt() {
return function(value) { // computed 带参数
return this.methodGetByteLen(value, 20)
}
}
}

computed 的值不能给 data 赋值，computed 时还没有 this 呢。因为 data 里的数据是在 mouted 中执行函数才获取到数据，是在 computed 之后，所以在第一次 computed 计算时，data 中数据还是空的，所以 computed 找不到 data 里的数据。
computed 里的匿名函数是找不到 this 的，function 可以。

watch 数组 list，可以 computed: {
newList(){
return JSON.parse(JSON.stringify(this.list)) // 深拷贝依赖
}
},
watch: {
newList(newVal, oldVal) {
console.log(newVal， this.list)
console.log(oldVal)
},
},

change 事件中，editForm 的属性已改变，若要拿到旧值，就得用 watch:
watch: {
'editForm.type': {
handler(oldVal, newVal) {
console.log(oldVal, newVal);
},
deep: true // 引用类型数据，需要进行深度监听模式，不然无法进行触发回调
}
},

同一组件在路由变化时不刷新：
watch: {
  '$route.path'(o, n) {
    // console.log(o, n);
    this.getList(1)
  }
},

按下 ENTER 时，进入下一个表单
@keyup.enter="$event.target.nextElementSibling.focus()"


<el-select
        v-model="form.projectname"
        filterable
        remote
        placeholder="请输入或选择"
        :remote-method="remoteMethodProject"
        @change="dataFilterProject"
        :loading="selectLoading"
        style="width: 100%"
      >
        <el-option
          v-for="item in projectList"
          :label="item.xmmc"
          :value="JSON.stringify(item)"
          :key="item.id"
        ></el-option>
      </el-select>
    //搜索项目名称
    remoteMethodProject(query) {
      this.selectLoading = true;
      this.projectList = [];
      if (query !== "") {
        this.common
          .getProjectList(query, 1, 10)
          .then(res => {
            console.log(res);
            this.selectLoading = false;
            if (res.total == 0) {
              this.projectList.push({ xmmc: query + "-(新增)" });
            } else {
              this.projectList = res.items;
            }
          })
          .catch(err => {
            this.selectLoading = false;
            this.projectList = [];
          });
      } else {
        this.selectLoading = false;
        this.projectList = [];
      }
    },
# assets与static文件夹的区别
assets：在项目编译的过程中会被webpack处理解析为模块依赖，只支持相对路径的形式，如< img src=”./logo.png”>和background:url(./logo.png),”./logo.png”是相对资源路径，将有webpack解析为模块依赖 

static：在这个目录下文件不会被被webpack解析。他会直接被复制到最终的打包目录(默认是dist/static)下。必须使用绝对路径引用这些文件，这是通过config.js文件中的build.assetsPublic和build.assertsSubDirectory链接来确定的。任何放在static/中文件需要以绝对路径的形式引用：/static[filename] 
根据webpack的特性，总的来说就是static放不会变动的文件，asserts放可能会变动的文件

:src=变量  对于弹窗内的图片，必须在js代码里先require('相对路径');  或者在config.js里设置绝对路径作为前缀。  页面上的图片可以在html里写require()。

# vue2 源码
        class Observer {
            defineReactive(data) {
                if (!data || typeof data != 'object') return
                // 生成一个dep闭包
                let dep = new Dep()
                Object.keys(data).forEach(key => {
                    let value = data[key]
                    this.defineReactive(value)  //如果value还是对象，则对该对象递归继续使用defineReactive方法，实现深度绑定
                    Object.defineProperty(data, key, { //使用该方法监听对象属性的变化
                        enumerable: true,
                        configurable: true,
                        get: function () {
                            console.log(value, 'get method')
                            dep.depend()
                            return value
                        },
                        set: function (newValue) {
                            console.log(value, 'set method')
                            if (value === newValue) return
                            value = newValue
                            dep.notify()
                        }
                    })
                })
            }
        }

        class Dep { //dep实例的作用是收集依赖
            constructor() {
                this.subs = []
            }
            addSub(sub) {
                this.subs.push(sub)
            }
            depend() {
                if (Dep.target) {
                    // push一个watcher
                    this.addSub(Dep.target)
                    console.log(this.subs)
                }
            }
            notify() {
                const subs = this.subs.slice()
                // data中没有被使用的属性，是不被depend()的，自然也不在subs里，所以也不会被notify。
                for (let i = 0; i < subs.length; i++) {
                    subs[i].update()
                }
            }
        }

        class Watcher { //
            constructor(vm, exp, cb) {
                this.vm = vm
                this.exp = exp
                this.cb = cb
                this.value = this.get() //在watcher被实例化的时候调用下文的get方法
            }
            get() {
                Dep.target = this //缓存当前的this，this是一个watcher对象
// 这段是精髓，通过获取对应属性的值，调用了被监听数据的get方法，由此调用了dep.depend()方法。
// 由于Dep.target是存在的，于是往Dep实例中的subs数组添加了一个依赖，也就是watcher对象。
                const value = this.vm.data[this.exp] 
                Dep.target = null
                return value
            }
            update() { //在data发生改变的时候，监听数据的set方法被调用，dep实例调用notify方法，通知subs数组中的每一个watcher调用update方法，update方法会调用回调函数，更新元素的内容。
                const value = this.vm.data[this.exp]
                this.cb.call(this.vm,value)
            }
        }

        class Vue {
            constructor(options = {}) {
                this.el = options.el
                this.exp = options.exp
                this.data = options.data
                el.innerHTML = this.data[this.exp] //初始化页面内容
                let observer = new Observer()
                observer.defineReactive(this.data) //监听数据
                new Watcher(this, this.exp, function(val) { //创建watcher实例，调用构造函数。
                    el.innerHTML = val
                })
                return this
            }
        }
* 事实上，window.target或者Dep.target其实就是一个watcher对象，我们在dep实例中收集watcher对象的目的就是在数据发生更新时，能够调用已经收集到的watcher对象的update方法来更新视图。
1）初始化过程：
实例化Vue——调用defineReactive方法监听对象中的数据——Watcher构造函数被调用——触发被监听数据的get方法——Dep收集到依赖。
2）数据被修改后的过程：
数据被修改——触发被监听数据的set方法——调用dep.notify方法——触发已经收集到subs数组中的每一个依赖的update方法（定义在watcher中）—— 视图更新。

# 当对data上的对象进行修改值的时候会触发它的setter，那么取值的时候自然就会触发getter事件，所以我们只要在最开始进行一次render，那么所有被渲染所依赖的data中的数据就会被getter收集到Dep的subs中去。在对data中的数据进行修改的时候setter只会触发Dep的subs的函数。
# 首先通过一次渲染操作触发Data的getter（这里保证只有视图中需要被用到的data才会触发getter）进行依赖收集，这时候其实Watcher与data可以看成一种被绑定的状态（实际上是data的闭包中有一个Deps订阅者，在修改的时候会通知所有的Watcher观察者），在data发生变化的时候会触发它的setter，setter通知Watcher，Watcher进行回调通知组件重新渲染的函数，之后根据diff算法来决定是否发生视图的更新。

Vue在初始化组件数据时，在生命周期的beforeCreate与created钩子函数之间实现了对data、props、computed、methods、events以及watch的处理。

JS 的 event loop 执行时会区分 task 和 microtask，引擎在每个 task 执行完毕，从队列中取下一个 task 来执行之前，会先执行完所有 microtask 队列中的 microtask。
setTimeout 回调会被分配到一个新的 task 中执行，而 Promise 的 resolver、MutationObserver 的回调都会被安排到一个新的 microtask 中执行，会比 setTimeout 产生的 task 先执行。
要创建一个新的 microtask，优先使用 Promise，如果浏览器不支持，再尝试 MutationObserver。
实在不行，只能用 setTimeout 创建 task 了。
为啥要用 microtask？
根据 HTML Standard，在每个 task 运行完以后，UI 都会重渲染，那么在 microtask 中就完成数据更新，当前 task 结束就可以得到最新的 UI 了。
反之如果新建一个 task 来做数据更新，那么渲染就会进行两次。

# vue3
Proxy不能代理原始值类型，@vue/reactivity 提供了一个Ref对象，通过代理内部的.value属性来实现。在使用Ref对象时，需要显示指明.value属性。ref本质也是reactive，ref(obj)等价于reactive({value: obj})

在模板中使用ref的值，不用通过.value获取
在js中使用ref的值，必须通过.value获取

ref和reactive都属于递归监听，也就是数据的每一层都是响应式的，如果数据量比较大，非常消耗性能，非递归监听只会监听数据的第一层。
shallowRef定义的数据，只有第一层是响应式的，即只有在更改.value的时候才能实现响应式
注意：shallowReactive没有类似triggerRef()的方法

toRaw的出现是解决什么问题呢？
有些时候我们不希望数据进行响应式实时更新，可以通过toRaw获取ref或reactive引用的原始数据，通过修改原始数据，不会造成界面的更新，只有通过修改ref和reactive包装后的数据时才会发生界面响应式变化。
let state = reactive(obj1);
//通过toRaw方法获取到原始数据，其实是获取到obj1的内存地址，obj2和obj1是完全相等的
let obj2 = toRaw(state)
console.log(obj1 === obj2); // true
那直接使用obj1来修改数据不就行了吗？可关键是我们在使用reactive定义数据时一般不会先定义一个obj1，再将他传给reactive，都是直接在reactive中写数据的。

当ref数据作为props传递给子组件的时候，在子组件里需要使用toRef或者toRefs建立引用，否则数据不是响应式的，在子组件里修改这个ref，会同时修改作为props传入的ref。
toRef只能处理对象中一个属性，而toRefs是把这个对象的所有属性创建成多个ref对象。

只有以 VUE_APP_ 开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中。你可以在应用的代码中这样访问它们：
console.log(process.env.VUE_APP_SECRET)
在构建过程中，process.env.VUE_APP_SECRET 将会被相应的值所取代。在 VUE_APP_SECRET=secret 的情况下，它会被替换为 "secret"。

除了 VUE_APP_* 变量之外，在你的应用代码中始终可用的还有两个特殊的变量：

NODE_ENV - 会是 "development"、"production" 或 "test" 中的一个。具体的值取决于应用运行的模式。
BASE_URL - 会和 vue.config.js 中的 publicPath 选项相符，即你的应用会部署到的基础路径。
所有解析出来的环境变量都可以在 public/index.html 中以 HTML 插值中介绍的方式使用。

public/index.html 文件是一个会被 html-webpack-plugin 处理的模板。在构建过程中，资源链接会被自动注入。另外，Vue CLI 也会自动注入 resource hint (preload/prefetch、manifest 和图标链接 (当用到 PWA 插件时) 以及构建过程中处理的 JavaScript 和 CSS 文件的资源链接。

插值#
因为 index 文件被用作模板，所以你可以使用 lodash template 语法插入内容：
<%= VALUE %> 用来做不转义插值；
<%- VALUE %> 用来做 HTML 转义插值；
<% expression %> 用来描述 JavaScript 流程控制。
除了被 html-webpack-plugin 暴露的默认值之外，所有客户端环境变量也可以直接使用。例如，BASE_URL 的用法：
<link rel="icon" href="<%= BASE_URL %>favicon.ico">

https://cli.vuejs.org/zh/guide/html-and-static-assets.html
当 prefetch 插件被禁用时，你可以通过 webpack 的内联注释手动选定要提前获取的代码区块：

import(/* webpackPrefetch: true */ './someAsyncComponent.vue')
Prefetch 链接将会消耗带宽。如果你的应用很大且有很多 async chunk，而用户主要使用的是对带宽较敏感的移动端，那么你可能需要关掉 prefetch 链接并手动选择要提前获取的代码区块。

// fetch.js 封装组合式异步函数，组合式函数约定用驼峰命名法命名，并以“use”作为开头。
import { ref, isRef, unref, watchEffect } from 'vue'
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // 在请求之前重设状态...
    data.value = null
    error.value = null
    // unref() 解包可能为 ref 的值
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  if (isRef(url)) {
    // 若输入的 URL 是一个 ref，那么启动一个响应式的请求
    watchEffect(doFetch)
  } else {
    // 否则只请求一次
    // 避免监听器的额外开销
    doFetch()
  }
  return { data, error }
}

Tips：如果只有setup方法的话，可以直接在defineComponent中传入setup函数： setup() {} 或 () => {}

# reactive使用interface
import { defineComponent, reactive } from 'vue'

interface Student {
  name: string
  class?: string
  age: number
}

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    const student = reactive<Student>({ name: '阿勇', age: 16 })
    // or
    const student: Student = reactive({ name: '阿勇', age: 16 })
    // or
    const student = reactive({ name: '阿勇', age: 16, class: 'cs' }) as Student
  }
})

# vue3 this
import {getCurrentInstance} from vue-router;
setup(){
​	const {proxy} from getCurrentInstance;
 proxy.$router.push()
}

import { getCurrentInstance, ComponentInternalInstance } from "vue";
const { appContext } = getCurrentInstance() as ComponentInternalInstance;
const proxy = appContext.config.globalProperties;

const app = createApp(App)
app.provide('name','xianyu')

import {inject} from 'vue'
setup(){
	const name = inject('name')
}

#  v-bind="$attrs" v-on="$listeners"
<!-- $attrs property 包含了传递给一个组件的 attribute 名和 attribute 值， -->
用在 父-子-孙 三重组件中被子调用的孙， 使得孙组件可以获得子组件props中没有继承的父属性，可以触发父组件方法。
# 『单向数据流』总结起来其实也就8个字：『数据向下，事件向上』。

# 组件上使用v-model
v-model其实是可以在组件上使用的，而且适用范围还是挺广的，尤其是在我们写组件的时候，在父组件展示一个子组件的行为，但是子组件里面有关闭整个组件的功能，我们所做的就是在子组件当中通过$emit触发父组件对应的方法，改变父组件上v-if对应的变量控制显示隐藏。

但是有了v-model，这一切都变得很简单，最主要的是父组件减少了关闭的方法，如果你关闭之后需要回调，那么通过监听你的是否显示的flag即可，所以大可放心使用。

父组件:
<template>
  <div id="app">
    <HelloWorld v-model="showFlag" v-if="showFlag"></HelloWorld>
    <button @click="showFlag=true">打开组件</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  data(){
    return {
       showFlag: false
    }
  },
  components: {
    HelloWorld
  }
}
</script>
这里我们引入了子组件HelloWorld，通过showFlag来控制组件的显示隐藏，当然，组件上还用v-model绑定了showFlag。
这里的 showFlag 的值将会传入这个名为 checked 的 prop。同时当子组件触发一个 change 事件并附带一个新的值的时候，这个showFlag的property将会被更新。
<template>
  <div class="hello">
    <h1>这是组件里面的内容</h1>
    <button @click="close">关闭组件</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: {
      type: Boolean
    }
  },
  methods: {
    close(){
      this.$emit('change', false)
    }
  }
}
// 对于子组件来说，允许自定义使用v-model时定制prop和event，v-model中的prop就是把value用作prop，input用作event，但是为了避免冲突，我们使用model的选项可以回避这些冲突，当然，你也得使用props声明checked这个prop。

# 将原生事件绑定到组件,你可能有很多次想要在一个组件的根元素上直接监听一个原生事件。这时，你可以使用 v-on 的 .native 修饰符：
<base-input v-on:focus.native="onFocus"></base-input>
// 在有的时候这是很有用的，不过在你尝试监听一个类似 <input> 的非常特定的元素时，这并不是个好主意。比如上述 <base-input> 组件可能做了如下重构，所以根元素实际上是一个 <label> 元素：

<label>
  {{ label }}
  <input
    v-bind="$attrs"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</label>
// 这时，父级的 .native 监听器将静默失败。它不会产生任何报错，但是 onFocus 处理函数不会如你预期地被调用。
// 为了解决这个问题，Vue 提供了一个 $listeners property，它是一个对象，里面包含了作用在这个组件上的所有监听器。例如：

{
  focus: function (event) { /* ... */ }
  input: function (value) { /* ... */ },
}
有了这个 $listeners property，你就可以配合在base-input增加 v-on="$listeners" 将所有的事件监听器指向这个组件的某个特定的子元素。对于类似 <input> 的你希望它也可以配合 v-model 工作的组件来说，为这些监听器创建一个类似下述 inputListeners 的计算属性通常是非常有用的：

Vue.component('base-input', {
  // 不希望组件的根元素继承 attribute， 这个模式允许你在使用基础组件的时候更像是使用原始的 HTML 元素，而不会担心哪个元素是真正的根元素：
  inheritAttrs: false,  
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
// 现在 <base-input> 组件是一个完全透明的包裹器了，也就是说它可以完全像一个普通的 <input> 元素一样使用了：所有跟它相同的 attribute 和监听器都可以工作，不必再使用 .native 监听器。

# .sync 修饰符
在有些情况下，我们可能需要对一个 prop 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以变更父组件，且在父组件和子组件两侧都没有明显的变更来源。

这也是为什么我们推荐以 update:myPropName 的模式触发事件取而代之。举个例子，在一个包含 title prop 的假设的组件中，我们可以用以下方法表达对其赋新值的意图：

this.$emit('update:title', newTitle)
然后父组件可以监听那个事件并根据需要更新一个本地的数据 property。例如：

<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
为了方便起见，我们为这种模式提供一个缩写，即 .sync 修饰符：

<text-document v-bind:title.sync="doc.title"></text-document>
注意带有 .sync 修饰符的 v-bind 不能和表达式一起使用 (例如 v-bind:title.sync=”doc.title + ‘!’” 是无效的)。取而代之的是，你只能提供你想要绑定的 property 名，类似 v-model。

当我们用一个对象同时设置多个 prop 的时候，也可以将这个 .sync 修饰符和 v-bind 配合使用：

<text-document v-bind.sync="doc"></text-document>
// 这样会把 doc 对象中的每一个 property (如 title) 都作为一个独立的 prop 传进去，然后各自添加用于更新的 v-on 监听器。

// 将 v-bind.sync 用在一个字面量的对象上，例如 v-bind.sync=”{ title: doc.title }”，是无法正常工作的，因为在解析一个像这样的复杂表达式的时候，有很多边缘情况需要考虑。

# 一般情况下，我们只是使用了computed中的gettter属性get: function() {return}，如果直接修改那就会用到 set 属性，可以对父组件对象直接进行修改：
<child :form.sync="form"></child>
form:{
    provinces_id:'',
},

child组件：
 props: {
            form: Object,
        },
  computed: {
      // 若修改provinces则通过set修改父组件中值。
      provinces: {
          get: function () {
              return this.form.provinces_id
          },
          set: function (val) {
              this.emit('updata:form.provinces_id',val)
          }
      },
  }

# el-tabs组件内的每一个<el-tab-pane><div v-if></div></el-tab-pane>都会重新渲染，所以要在其内部添加v-if
若子组件需要父组件接口返回的数据，那么子组件上也要v-if这个数据，确保有了该数据才会渲染子组件。

官方解释：当 ref 和 v-for 一起使用的时候，你得到的 ref 将会是一个包含了对应数据源的这些子组件的***数组***要用this.$refs.acadeDetail[0]。
由于用v-if所以ref数组只有一个元素，每次tab切换要重新获取ref时，必须下一跳   this.$nextTick(() => this.genRef());

el-form 动态rules会立刻校验，变红，所以：
    :validate-on-rule-change="false"
  
# 给el-select增加slot日期图标作为前缀
   <el-select
              v-model="editForm.publishMonth"
              placeholder="月（可省）"
              class="elsel"
              size="small"
            >
              <div slot="prefix">
                <i class="el-input__icon el-icon-date"></i>
              </div>
              <el-option
                v-for="item in genNum(12)"
                :key="item"
                :label="item + '月'"
                :value="item"
              ></el-option>
            </el-select>

vue.config.js里设置scss全局变量和函数：
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "./src/assets/css/global.scss";
          `,
      },
    },
  },


# 默认情况下，任何被传递给组件的额外参数都会自动应用于根元素（以及所有有 $attrs 绑定的元素）。
为了关闭这个功能，并控制哪些元素可接受这个额外的属性，我们可以使用一个名为 inheritAttrs 的标志，并将其设置为false。

# HTML 中的特性名是大小写不敏感的，所以浏览器会把所有大写字符解释为小写字符。这意味着当使用 DOM 中的模板时，camelCase (驼峰命名法) 的 prop 名需要使用其等价的 kebab-case (短横线分隔命名) 命名。  如果使用字符串模板，那么这个限制就不存在了。

注意$attrs不传递value时，例如<component disabled/> 此刻$attrs.disabled拿到的值是""，这符合html attribute特性。

# 一些内容属性（例如 required, readonly, disabled）是布尔值属性。如果一个布尔值属性存在，则其值是 true，如果不存在，其值是  false。
HTML5 定义了布尔值属性允许的取值：如果属性存在，其值必须是一个空字符串（即该属性的值未分配），或者是一个大小写无关的 ASCII 字符串，该字符串与属性名严格相同，前后都没有空格。下述例子是为一个布尔值属性取值的几个有效方式。

<div itemscope> This is valid HTML but invalid XML. </div>
<div itemscope=itemscope> This is also valid HTML but invalid XML. </div>
<div itemscope=""> This is valid HTML and also valid XML. </div>
<div itemscope="itemscope"> This is also valid HTML and XML, but perhaps a bit verbose. </div>
再明确一点，布尔值属性不能取值为 "true" 和 "false"。如果需要表示 false 值，布尔值属性需要整个忽略不写。这个限制澄清了一些常见误会：比如在元素中设置 checked="false" ，元素的 checked 属性会被解读为 true，因为这个属性出现了。

// 源码赏析   src/core/util/props.js
export function validateProp (key,propOptions,propsData,vm) {
  const prop = propOptions[key]
  const absent = !hasOwn(propsData, key)
  let value = propsData[key]
  // boolean casting
  const booleanIndex = getTypeIndex(Boolean, prop.type)
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      const stringIndex = getTypeIndex(String, prop.type)
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key)
    // since the default value is a fresh copy,
    // make sure to observe it.
    const prevShouldObserve = shouldObserve
    toggleObserving(true)
    observe(value)
    toggleObserving(prevShouldObserve)
  }
  if (process.env.NODE_ENV !== 'production') {
    assertProp(prop, key, value, vm, absent)
  }
  return value
}


# 插件开发：
    "scripts": {
        "serve": "vue-cli-service serve",
        "build": "vue-cli-service build",
        "lib": "vue-cli-service build --target lib --name base-upload --dest lib packages/index.js"
    },
执行npm run lib后，去lib目录执行npm init -y，然后修改生成的package.json，注意每次都得改version。最后npm publish。
不管有无scoped，style标签里的样式会被打包成一个css文件，插件安装后需要在main.js里单独引入。
插件就是要提供一个install方法，来给Vue.use(plugin)
use的源码如下：

Vue.use = function (plugin) {
  var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
  // 防止重复注册插件
  if (installedPlugins.indexOf(plugin) > -1) {
    return this
  }
  var args = toArray(arguments, 1);
  // 这里的this是Vue构造函数，把它放在参数的第一个位置，这就是install第一个参数是Vue的原因
  args.unshift(this);
  //如果插件中有install方法就执行插件的install方法
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args);
  // 如果插件是一个方法，就直接执行这个方法
  } else if (typeof plugin === 'function') {
    plugin.apply(null, args);
  }
  installedPlugins.push(plugin);
  return this
};


启动服务器的时候，一般会 listen 一个 IP 和端口，等待客户端的连接。如果此时 listen 的是本机的 0.0.0.0 , 那么它表示本机上的所有IPV4地址。
"serve": "vue-cli-service serve --host 0.0.0.0",
或者在config.js里改为  dev: {host: '0.0.0.0'}; 这样localhost和ip都能访问

// 替换el组件内文字内容
.el-image .el-image__error {
  font-size: 0;
  &::after{
    font-size: 14px;
    content: '暂无封面';
  }
}

alias用法
background: url('~@/assets/img/1-body.png') no-repeat

// 问题：在 vue 项目中，使用了 keep-alive 后，可以缓存组件。但在实际使用中，会经常出现一个场景，那就是 列表-详情 的页面，从列表跳转到详情页后，再返回列表页时，我们就会期望列表页是缓存了的；但是如果是切换到其他列表页后再返回该列表页，我们就期望它重新获取数据；

// 方法：要解决这个问题，我们需要用一个标识符来判断当前页面到底是从详情页返回的还是重新进入的；这里我使用的是在路由里面的 meta 增加一个属性来控制：
const routes = [
	{
		name: 'xxx',
		path: 'xxxx',
		component: component,
		meta: {
			keepAlive: true,
			isPush: true       // 用于标识是否为push进入该页面
		}
	}
]
// 我们在这里定义了 isPush 属性来控制，这里我们的思路是默认都是push进来的，去详情页时就将其设置为false，然后在activated里面判断如果该值为 true 就重新刷新一下，为false就将该值重新变为true。代码如下：

// 去详情页面的方法
goDetail(){
	this.$route.meta.isPush = false;
	this.$router.push('detail');
},

// 再次激活的钩子，没有被<keep-alive>包裹的话，activated是不起作用的
acitvated(){
	// 如果isPush为true，证明不是详情页返回的，否则就是从详情页返回的
	if(this.$route.meta.isPush){
		// 重置这个页面的信息
		this.resetTable()
	}else{
		// 重置isPush的状态
		this.$route.meta.isPush = true;
	}
}