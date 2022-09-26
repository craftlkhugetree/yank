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


# vant

预览图片：
import { ImagePreview } from 'vant';
ImagePreview({images: [url], showIndex: false});

<van-overlay :show="true">
    <div class="loading" @click.stop>
      <van-loading size="36px" vertical>加载中...</van-loading>
    </div>
</van-overlay>
