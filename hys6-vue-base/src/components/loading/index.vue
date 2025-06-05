<template>
  <div class="loading" v-if="this.$store.getters.getloadingStatus"></div>
</template>
<script>
export default {
  name: "Loading", // 定义的组件名称 使用时写法：loading
  mounted() {
    this.getSysName();
  },
  methods: {
    /**
     * 获取系统参数系统名称
     */
    getSysName() {
      this.$executeRequest.execByUrl("/A/login/getSysName").then((res) => {
        if (res && res.data) {
          $(function () {
            // 开始写 jQuery 代码...
            $("#sysName").empty();
            $("#sysName").text(res.data);
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.loading {
  position: fixed;
  left: 0px;
  top: 0;
  background: url("~@/assets/images/loading-ball.svg") center center no-repeat rgba(156, 154, 154, 0.6);
  width: 100vw;
  height: 100vh;
  z-index: 10000;
}
</style>
