<template>
  <div class="flex-1 d-flex align-items-center justify-content-center flex-column h100">
    <img
      :src="require('@/assets/images/empty.png')"
      alt=""
    >
    <span class="emptyTxt font-16 font-weight-600 mt-20">暂无数据</span>
  </div>
</template>

<script>
export default {
  name: 'ByEmpty'
}
</script>

<style lang="less" scoped>
.emptyTxt {
	color: #999999;
  font-family: @pingfang;
}
</style>