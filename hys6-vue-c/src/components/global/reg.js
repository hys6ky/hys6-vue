const importFn = require.context("./", false, /\.vue$/); // importFn已经装着所有符合条件的组件
export default {
  install(app) {
    // importFn.keys() //装着组件地址的数组
    importFn.keys().forEach((path) => {
      //遍历这个数组
      // 默认导入组件
      const component = importFn(path).default;
      // 注册组件
      app.component(component.name, component);
    });
  },
};
