<template>
  <div class="h100">
    <micro-app
      v-if="isChild"
      v-bind="micro"
      destory
      @created="created"
      @beforemount="beforemount"
      @mounted="mounted"
      @unmount="unmount"
      @error="error"
      @datachange="handleDataChange"
      class="h100"
    ></micro-app>
  </div>
</template>
<script>
import { MICRO_APPS } from "../micro/config.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isChild: false,
      micro: {
        name: "",
        url: "",
        destory: false,
        data: {},
      },
    };
  },
  computed: {
    ...mapGetters(["getModelNameAndFuncName"]),
  },
  watch: {
    $route: {
      handler(to, from) {
        /**监听路由变化修改视图显示 */
        this.isChild = false;
        setTimeout(() => {
          this.changeChild(to);
        }, 100);
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    /**初始化时修改视图显示 */
    // this.changeChild(this.$route);
  },
  methods: {
    /**获取子模块 url 和 name */
    getAppUrl(name) {
      return MICRO_APPS.find((app) => app.name === name) || {};
    },
    changeChild(route) {
      /**修改子视图显示 */
      let path = route.path,
        paths = path.split("/");
      /**判断是否为子模块，子模块有固定的前缀，在 micro/config 设置 */
      this.isChild = paths.length >= 1;
      if (this.isChild) {
        let app = this.getAppUrl(paths[1]);
        this.micro = {
          ...app,
          data: {
            serveURL: this.getModelNameAndFuncName,
            baseRouer: this.$router,
          },
          baseroute: `/${paths[1]}`,
          key: this.getModelNameAndFuncName,
        };
      }
    },
    created() {
      /**子模块创建 */
      // console.log(`${this.micro.name}-created`);
    },
    beforemount() {
      /**子模块挂载之前 */
      // console.log(`${this.micro.name}-beforemount`);
    },
    mounted() {
      /**子模块挂载 */
      this.loading = false;
      // console.log(`${this.micro.name}-mounted`);
    },
    unmount() {
      /**子模块卸载 */
      // console.log(`${this.micro.name}-unmount`);
    },
    error() {
      /**子模块异常 */
      // console.log(`${this.micro.name}-error`);
    },
    handleDataChange(event) {
      /**获取子路由传递的信息 */
      const { path } = event.detail.data;
      this.$router.push({ path });
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep micro-app-body {
  height: 100%;
  position: relative;
}
</style>
