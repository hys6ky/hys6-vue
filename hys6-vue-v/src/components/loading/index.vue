<template>
  <div class="loading" v-if="this.$store.getters.getloadingStatus"></div>
</template>
<style scoped>
.loading {
  position: fixed;
  left: 0px;
  top: 0;
  background: url("~@/assets/images/loading-ball.svg") center center no-repeat
    rgba(156, 154, 154, 0.6);
  width: 100vw;
  height: 100vh;
  z-index: 10000;
}
</style>
