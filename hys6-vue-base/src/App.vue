<template>
  <div id="app">
    <router-view />
    <Loading />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    Loading: () => import("@/components/loading/index.vue"),
  },
  mounted() {
    this.getConfig();
  },
};
</script>

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
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
}
.el-scrollbar__wrap {
  //height: 204px;
}
.el-message--error .el-message__content {
  line-height: 20px;
}
ul li {
  list-style: none;
}
#app {
  width: 100%;
  height: 100%;
}
</style>
