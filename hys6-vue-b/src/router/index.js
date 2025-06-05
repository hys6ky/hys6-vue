import Vue from "vue";
import VueRouter from "vue-router";
import globalProperties from "./globalProperties";
import { customizTitle } from "@/utils/message";

Vue.use(VueRouter);
// 项目所在目录名称
const bizRoot = globalProperties.bizRoot;
// 是否使用占位符
const funcIndexName = globalProperties.funcIndexName;
/**
 * 读取根目录下的文件资源, 只包含index.vue文件目录
 */
const modulesFiles = require.context("../", true, /\.vue$/);
//微应用路由信息
let microRoutes = [];
// 路由文件生成的目录和目下需要检查的文件集合
let dirFileCheckMap = {};
// 文件所属目录名称
let fileDirName;
modulesFiles.keys().reduce((modules, modulePath) => {
  /**
   * 只读取根目录下的vue文件, 来生成router的数据结构
   * 这里只处理目录{globalProperties.bizRoot}下
   * modulePath: ./bizpot/sys/auth/index.vue
   * moduleFuncName: bizpot/sys/auth/index
   */
  const moduleFuncName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  if (moduleFuncName.startsWith(bizRoot)) {
    // 拆分整体路径结构
    let splitPathList = moduleFuncName.split("/");
    // 如果文件路径拆分后目录数少于4个,则对应的目录要求不符合规定抛出异常并提醒
    if (splitPathList.length < 3) {
      customizTitle(
        `文件: <strong>${modulePath}</strong> 所在目录必须定义为三级目录。<br/> 
            否则无法生成路由信息, 请调整目录结构`,
        "error"
      );
      throw Error("文件目录结构定义不合理");
    }
    // 检查当前路径下的最后一个元素是否为index文件, 如果是则生成页面路由信息
    if (splitPathList[splitPathList.length - 1] === funcIndexName) {
      splitPathList.pop();
      fileDirName = splitPathList.join("/");
      dirFileCheckMap[fileDirName] = true;
      /**
       * 这里匹配完成, 动态生成路由信息.
       * 路由格式如下:
       * {
       *    path: 这里使用的是index.vue文件所在目录名称组成, 但不包括主目录${bizRoot}
       *    component: () => import(这里指的是当前modulePath),
       *  }
       * 例如: 目录bizpot/sys/auth,有以下2文件(index.vue, index2.vue),
       * 这里生成的路由path只会有一个/sys/auth,
       * 而且功能目录下必须有一个{funcIndexName}.vue文件 其他的.vue文件这里不做任何处理
       */
      // 剔除第一个业务根目录名称
      splitPathList.shift();
      if (splitPathList[0] !== "c") {
        microRoutes.push({
          path: `/${splitPathList.join("/")}`,
          name: `${splitPathList[splitPathList.length - 1]}`,
          component: (resolve) => require([`@/${moduleFuncName}.vue`], resolve),
        });
      }
    } else {
      /**
       * 这里处理一下其它页面的生成方式, 如:
       *  目录: A
       *        页面1.vue
       *        页面2.vue
       *        ......
       *  需要调整到页面2时, 则直接使用 this.$router.push({path:'A/页面1'}) 或 this.$router.push('页面1')
       */
      let oldList = splitPathList;
      let otherPath = splitPathList.join('/');
      splitPathList.shift();
      microRoutes.push({
        path: `/${splitPathList.join("/")}`,
        name: `${splitPathList[splitPathList.length - 1]}`,
        component: (resolve) => require([`@/${otherPath}.vue`], resolve),
      });
      // console.log(microRoutes,'===================')
      oldList.pop();
      fileDirName = oldList.join("/");
      // 记录该目录下还不存在定义的文件
      if (typeof dirFileCheckMap[fileDirName] == "undefined") {
        dirFileCheckMap[fileDirName] = false;
      } else {
        if (!dirFileCheckMap[fileDirName]) {
          dirFileCheckMap[fileDirName] = false;
        }
      }
    }
  }
  return microRoutes;
}, {});

/**
 * 检查目录下的文件是否符合规定的规则, 也就是每个目录下必须且存在一个index.vue文件
 * @param {JSON} data 含有index.vue文件目录的信息
 * @returns 如果检测通过则返回路由信息
 */
export function checkFileSpecification(data) {
  if (data) {
    Object.keys(data).forEach((v, i) => {
      // 如果列表中没有index文件存在, 则抛出错误提示
      if (!data[v]) {
        customizTitle(
          `文件：<strong>${v} </strong>同级目录中<br/>
                未找到：<strong>${funcIndexName}.vue</strong> 文件。<br/>
                无法生成路由信息，请添加 <strong>${funcIndexName}.vue</strong> 文件`,
          "error"
        );
        throw Error("文件目录定义不合理");
      }
    });
  } else {
    customizTitle(`没有符合的文件信息存在`, "error");
    throw Error("文件文件信息不存在");
  }
  return microRoutes;
}
// 解决两次访问相同路由地址报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
/**
 *
 * 路由配置信息
 *  routes : [{这里的第一层表示为普通的路由地址,children : [{这个里面的是二级路由配置}]
 * 路由配置如 :
 *  {
 *      @param path: "/home"   表示的是路由匹配路径,
 *      @param name: 'home' 路由的名称
 *      @param component: () => import('@/xxxx/login/index.vue') 后面为地址的具体页面
 *  }
 *
 */
const baseRoutes = [
  {
    path: "/*",
    component: () => import("../views/notFound.vue"),
  },
];
const appRoutes = [
  {
    path: "/",
    component: () => import("../views/rootApp.vue"),
    children: [...microRoutes],
  },
];
// console.log(appRoutes, "子应用");
const routes = window.microApp ? appRoutes : baseRoutes;
const router = new VueRouter({
  // base: window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if (window.microApp) {
    const { name, path } = to;
    const findName = routes[0].children.find((item) => item.name === name);
    if (!findName && path !== "/404") {
      window.microApp.dispatch({ path: "/404" });
      next(false);
    }
  }
  next();
});
export default router;
