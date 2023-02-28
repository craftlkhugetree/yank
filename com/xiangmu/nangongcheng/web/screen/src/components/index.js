export default function registeGlobalComponent(app) {
  const requireComponent = require.context(
    // 其组件目录的相对路径
    './el/',
    // 是否查询其子目录
    true,
    // 匹配基础组件文件名的正则表达式
    /g-.+\.(vue)$/
  );
  requireComponent.keys().forEach((fileName) => {
    // 获取组件实例
    const componentConfig = requireComponent(fileName);
    // console.log(componentConfig, fileName);
    let componentName = '';
    const gName = fileName.match(/\/([^/]*)\.(vue)/);
    if (!gName) {
      throw new Error('公共组件必须在components下');
    } else {
      componentName = `s-${gName[1].replace(/g-/, '')}`;
    }
    app.component(componentName, componentConfig.default || componentConfig);
  });
}
