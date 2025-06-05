<template>
  <avue-draggable
    :step="step"
    :width="widgetsWidth"
    :height="widgetsHeight"
    :disabled="widgetDisabled"
    :left="widgetsLeft"
    :top="widgetsTop"
    ref="draggable"
    :index="index"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <component :is="type" :widget-index="index" :value="value" />
  </avue-draggable>
</template>

<script>
import widgetText from "./texts/widgetText.vue";
import widgetTable from "./texts/widgetTable.vue";
import widgetBarchart from "./bar/widgetBarchart.vue";
import widgetBarpolarchart from "./bar/widgetBarpolarchart.vue";
import WidgetStackchart from "./bar/widgetBarStackChart.vue";
import widgetLinechart from "./line/widgetLinechart.vue";
import WidgetLineStackChart from "./line/widgetLineStackChart.vue";
import widgetBarlinechart from "./barline/widgetBarlinechart";
import widgetBarLineStackChart from "./barline/widgetBarLineStackChart.vue";
import WidgetPiechart from "./pie/widgetPiechart.vue";
import WidgetPieNightingaleRoseArea from "./pie/widgetPieNightingaleRose.vue";
import WidgetScatterchart from "./scatter/widgetScatterchart.vue";
import WidgetTreemapchart from "./treemap/widgetTreemap.vue";
import widgetBorder from "./styleWidget/widgetBorder.vue";
import widgetDecorateFlowLine from "./styleWidget/widgetDecorateFlowLine.vue";

export default {
  name: "Widget",
  components: {
    widgetText,
    widgetTable,
    widgetBarchart,
    widgetBarpolarchart,
    WidgetStackchart,
    widgetLinechart,
    WidgetLineStackChart,
    widgetBarlinechart,
    widgetBarLineStackChart,
    WidgetPiechart,
    WidgetPieNightingaleRoseArea,
    WidgetScatterchart,
    WidgetTreemapchart,
    widgetBorder,
    widgetDecorateFlowLine,
  },
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    /*
    widget-text widget-marquee widget-href widget-time widget-image widget-slider widget-video widget-table widget-iframe widget-universal
    widget-linechart widget-barlinechart widget-piechart widget-hollow-piechart widget-funnel widget-gauge widget-china-map
    */
    index: Number, // 当前组件，在工作区变量widgetInWorkbench中的索引
    type: String,
    bigscreen: Object,
    value: {
      type: [Object],
      default: () => {},
    },
    step: Number,
  },
  data() {
    return {
      data: {
        setup: {},
        data: {},
        position: {},
        /*        leftMargin: null,
        topMargin: null*/
      },
    };
  },
  computed: {
    widgetsWidth() {
      return this.value.position.width;
    },
    widgetsHeight() {
      return this.value.position.height;
    },
    widgetsLeft() {
      return this.value.position.left; // >= this.leftMargin ? this.leftMargin : this.value.position.left;
    },
    widgetsTop() {
      return this.value.position.top; // >= this.topMargin ? this.topMargin : this.value.position.top;
    },
    widgetsZIndex() {
      return this.value.position.zIndex || 1;
    },
    widgetDisabled() {
      return this.value.position.disabled || false;
    },
  },
  mounted() {},
  methods: {
    handleFocus({ index, left, top, width, height }) {
      const widgetId = this.value.setup.widgetId;
      this.$emit("onActivated", { index, left, top, width, height, widgetId });
      this.$refs.draggable.setActive(true);
    },
    handleBlur({ index, left, top, width, height }) {
      const widgetId = this.value.setup.widgetId;
      this.$emit("onActivated", { index, left, top, width, height, widgetId });
      this.$refs.draggable.setActive(true);
      // 处理widget超出workbench的问题
      //this.handleBoundary({ index, left, top, width, height })
    },
    handleBoundary({ index, left, top, width, height }) {
      // 计算workbench的X轴边界值
      // 组件距离左侧宽度 + 组件宽度 > 大屏总宽度时，右侧边界值 = (大屏宽度 - 组件宽度)；左侧边界值 = 0
      const { bigscreenWidth, bigscreenHeight } = this.bigscreen;
      const xBoundaryValue =
        left + width > bigscreenWidth
          ? bigscreenWidth - width
          : left < 0
          ? 0
          : left;
      // 初始化X轴边界值
      this.leftMargin = left;
      // 计算Y轴边界值
      const yBoundaryValue =
        top + height > bigscreenHeight
          ? bigscreenHeight - height
          : top < 0
          ? 0
          : top;
      // 初始化Y轴边界值
      this.topMargin = top;
      // 若位置超出边界值则重新设置位置
      if (
        this.leftMargin != xBoundaryValue ||
        this.topMargin != yBoundaryValue
      ) {
        this.$nextTick(() => {
          this.leftMargin = xBoundaryValue;
          this.topMargin = yBoundaryValue;
          this.$emit("onActivated", {
            index,
            left: xBoundaryValue,
            top: yBoundaryValue,
            width,
            height,
          });
        });
      }
    },
  },
};
</script>

<style scoped lang="less">
.vue-draggalbe {
  position: absolute;
}

.widget-active {
  cursor: move;
  border: 1px dashed #09f;
  background-color: rgba(115, 170, 229, 0.5);
}

.avue-draggable {
  padding: 0 !important;
}
</style>
