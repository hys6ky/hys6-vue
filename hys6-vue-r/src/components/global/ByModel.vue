<template>
  <el-dialog
    :title="modelTitle"
    :visible="visible"
    :width="modelWidth"
    :top="modelTop"
    :destroy-on-close="true"
    @close="$emit('close')"
    @closed="$emit('closed')"
  >
    <slot></slot>
    <div slot="footer" class="dialog-footer" v-if="footerShow">
      <slot name="modalFoot">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ByModel",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    modelTitle: {
      type: String,
      default: "",
    },
    modelWidth: {
      type: String,
      default: "660px",
    },
    modelTop: {
      type: String,
      default: "15vh",
    },
    footerShow: {
      type: Boolean,
      default: true,
    },
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

<style lang="less" scoped></style>
