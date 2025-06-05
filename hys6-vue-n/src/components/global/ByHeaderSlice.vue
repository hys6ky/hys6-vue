<template>
  <div class="d-flex byHeaderSlice justify-content-between align-items-center">
    <div class="d-flex align-items-center">
      <div class="byHeaderSlice_tip mr-10"></div>
      <div class="byHeaderSlice_txt font-16 fontweight-500">{{ title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ByHeaderSlice",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less" scoped>
.byHeaderSlice {
  margin: 0 0 16px 0;
  &_tip {
    width: 4px;
    height: 16px;
    background: linear-gradient(360deg, #4ed0ff 0%, #407fff 100%);
    border-radius: 2px;
  }
  &_txt {
    font-family: @pingfangMedium;
    color: @primary-color;
  }
}
</style>
