<template>
  <div class="text" :style="styleColor">{{ styleColor.text }}</div>
</template>
<script>
export default {
  name: "WidgetText",
  components: {},
  props: {
    value: Object,
    ispreview: Boolean,
  },
  data() {
    return {
      options: {},
      optionsData: {},
      flagInter: null,
    };
  },
  computed: {
    transStyle() {
      return this.objToOne(this.options);
    },
    styleColor() {
      return {
        position: this.ispreview ? "absolute" : "static",
        color: this.transStyle.color,
        "font-weight": this.transStyle.fontWeight,
        text: this.transStyle.text,
        "font-size": this.transStyle.fontSize + "px",
        "letter-spacing": this.transStyle.letterSpacing + "em",
        background: this.transStyle.background,
        "text-align": this.transStyle.textAlign,
        width: this.transStyle.width + "px",
        height: this.transStyle.height + "px",
        left: this.transStyle.left + "px",
        top: this.transStyle.top + "px",
        right: this.transStyle.right + "px",
        whiteSpace: this.transStyle.whiteSpace ? "pre-line" : "normal",
      };
    },
  },
  watch: {
    value: {
      handler(val) {
        this.options = val;
        this.optionsData = val.data;
      },
      deep: true,
    },
  },
  created() {
    this.options = this.value;
    this.optionsData = this.value.data;
  },
  methods: {
    objToOne(obj) {
      let tmpData = {};
      for (let index in obj) {
        if (typeof obj[index] == "object" && !this.isArrayFn(obj[index])) {
          let resObj = this.objToOne(obj[index]);
          Object.assign(tmpData, resObj); // 这里使用对象合并
        } else {
          tmpData[index] = obj[index];
        }
      }
      return tmpData;
    },
    isArrayFn(value) {
      if (typeof Array.isArray === "function") {
        return Array.isArray(value);
      } else {
        return Object.prototype.toString.call(value) === "[object Array]";
      }
    },
  },
};
</script>

<style scoped lang="less">
.text {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
