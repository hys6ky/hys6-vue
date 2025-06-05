<template>
  <div class="d-flex align-items-center justify-content-between containerTitle">
    <span class="containerTitle-txt font-14 fontweight-600">{{ title }}</span>
    <el-button
      v-if="addBtn"
      type="primary"
      @click="add"
      icon="el-icon-plus"
      v-debounce
      >新建
    </el-button>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ByContainerTitle",
  props: {
    title: {
      type: String,
      default: "任务列表",
    },
    addBtn: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    add() {
      this.$emit("add");
    },
  },
};
</script>

<style lang="less" scoped>
.containerTitle {
  &-txt {
    color: @titletxt-color;
    font-family: @pingfang;
  }
  .el-button {
    min-width: 80px;
    height: 32px;
    padding: 8px 25px;
    font-family: @hansan;
  }
}
</style>
