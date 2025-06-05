<template>
  <el-drawer
    :title="drawTitle"
    :visible="visible"
    :size="drawWidth"
    :destroy-on-close="true"
    :wrapperClosable="false"
    @close="$emit('update:visible', false)"
    @closed="$emit('closed')"
  >
    <div class="flex-1 overflow-auto pb-10">
      <slot></slot>
    </div>
    <div class="draw_footer" v-if="drawFooter">
      <slot name="drawFoot">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </slot>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "ByDrawer",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    drawTitle: {
      type: String,
      default: "",
    },
    drawWidth: {
      type: Number,
      default: 1100,
    },
    drawFooter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  watch: {
    visible: {
      handler(val) {
        if (!val) {
          this.$emit("cancel");
        }
      },
    },
  },
  methods: {
    confirm() {
      this.$emit("confirm");
    },
  },
};
</script>

<style lang="less" scoped>
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 8px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  border-radius: 8px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}
</style>
