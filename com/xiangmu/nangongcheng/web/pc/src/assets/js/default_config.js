/*
|--------------------------------------------------------------------------
| 默认项目全局配置信息
|--------------------------------------------------------------------------
*/

let ip = '127.0.0.1';
if (typeof window !== 'undefined' && window.require) {
  const ipFn = window.require('ip');
  ip = ipFn.address();
}

const isDev = process.env.NODE_ENV === 'development';
const config = {
  ip,
  isDev,
  //渲染进程配置
  renderConfig: {
    //布局相关
    layout: {
      size: 'default', //项目中组件库大小
    },
    //全局组件配置
    components: {
      tableConfig: {
        pageSizes: [10, 20, 30, 50, 70, 100], //每页条数
        pageSize: 10, //每页默认显示数量
      },
    },
  },
};
export default config;
