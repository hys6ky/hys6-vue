<template>
  <div id="indexapp">
    <router-view />
    <Loading />
  </div>
</template>
<script>
import Loading from "@/components/loading";
export default {
  name: "indexApp",
  data() {
    return {
      prefix: window.__MICRO_APP_BASE_ROUTE__ || "",
    };
  },
  components: {
    Loading,
  },
  methods: {
    dataListener(data) {
      // if (data.path && data.path != this.$route.path) {
      //   this.$router.push(data.path);
      //   alert("1");
      // }
    },
  },
  created() {
    // alert("开始");
    /** 绑定数据【data属性】监听事件 */
    if (window.__MICRO_APP_ENVIRONMENT__) {
      const data = window.microApp.getData(); // 返回基座下发的data数据
      this.$store.dispatch("setRequestPath", data.serveURL);
    }
    // window.__MICRO_APP_ENVIRONMENT__ &&
    //   window.microApp.addDataListener(this.dataListener(), true);
  },
  destroyed() {
    // alert("销毁");
    /** 移除数据【data属性】监听事件 */
    // window.__MICRO_APP_ENVIRONMENT__ &&
    //   window.microApp.removeDataListener(this.dataListener);
  },
};
</script>

<style lang="less">
#indexapp {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less">
body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
ul,
ol,
dl,
dd,
input,
textarea,
select,
td,
th {
  margin: 0;
  padding: 0;
}
.el-scrollbar__wrap {
  height: 204px;
}
.el-message--error .el-message__content {
  line-height: 20px;
}
ul li {
  list-style: none;
}
</style>
