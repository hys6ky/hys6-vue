<template>
  <el-tooltip placement="top" :disabled="boxWidth <= maxWidth">
    <span slot="content">{{ content }}</span>
    <div :style="`width:${maxWidth}px`" class="text-elipsis">
      <span :id="id" style="line-height: 30px">{{ content }}</span>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    content: [String, Number, Boolean],
    maxWidth: {
      type: Number,
    },
  },
  data() {
    return {
      title: "",
      id: Math.random().toString(36).slice(2),
      boxWidth: 0,
    };
  },

  mounted() {
    const el = document.getElementById(this.id);
    this.boxWidth = el.offsetWidth;
  },
};
</script>

<style scoped></style>
