<template>
  <div :style="styleObj">
    <v-chart ref="myVChart" :option="options" autoresize />
  </div>
</template>
<script>
export default {
  name: "WidgetTreemapchart",
  props: {
    value: Object,
    ispreview: Boolean,
    widgetIndex: {
      type: Number,
      default: 0,
    }, // 当前组件，在工作区变量widgetInWorkbench中的索引
  },
  data() {
    return {
      options: {
        grid: {},
        legend: {
          show: false,
        },
        series: [
          {
            data: [],
            type: "treemap",
          },
        ],
      },
      optionsStyle: {}, // 样式
      optionsData: {}, // 数据
      optionsSetup: {},
      flagInter: null,
    };
  },
  computed: {
    styleObj() {
      return {
        position: this.ispreview ? "absolute" : "static",
        width: this.optionsStyle.width + "px",
        height: this.optionsStyle.height + "px",
        left: this.optionsStyle.left + "px",
        top: this.optionsStyle.top + "px",
        background: this.optionsSetup.background,
      };
    },
  },
  watch: {
    value: {
      handler(val) {
        this.optionsStyle = val.position;
        this.optionsData = val.data;
        this.optionsSetup = val.setup;
        this.editorOptions();
      },
      deep: true,
    },
  },
  created() {
    this.optionsStyle = this.value.position;
    this.optionsData = this.value.data;
    this.optionsSetup = this.value.setup;
    this.editorOptions();
  },
  methods: {
    // 修改图标options属性
    editorOptions() {
      this.setOptionsTitle();
      this.setOptionsTooltip();
      this.setOptionsColor();
      this.setOptionsData();
    },
    // 标题修改
    setOptionsTitle() {
      const optionsSetup = this.optionsSetup;
      const title = {};
      title.text = optionsSetup.titleText;
      title.show = optionsSetup.isNoTitle;
      title.left = optionsSetup.textAlign;
      title.textStyle = {
        color: optionsSetup.textColor,
        fontSize: optionsSetup.textFontSize,
        fontWeight: optionsSetup.textFontWeight,
        fontStyle: optionsSetup.textFontStyle,
      };
      title.subtext = optionsSetup.subText;
      title.subtextStyle = {
        color: optionsSetup.subTextColor,
        fontWeight: optionsSetup.subTextFontWeight,
        fontSize: optionsSetup.subTextFontSize,
        fontStyle: optionsSetup.subTextFontStyle,
      };
      this.options.title = title;
    },
    // tooltip 设置
    setOptionsTooltip() {
      const optionsSetup = this.optionsSetup;
      const tooltip = {
        trigger: "item",
        show: true,
        textStyle: {
          color: optionsSetup.tipsColor,
          fontSize: optionsSetup.tipsFontSize,
        },
      };
      this.options.tooltip = tooltip;
    },
    // 获得位置
    getOptionsPosition() {
      const optionsSetup = this.optionsSetup;
      let position = "";
      if (optionsSetup.verticalShow) {
        position = "right";
      } else {
        position = "top";
      }
      return position;
    },
    // 图例颜色修改
    setOptionsColor() {
      const optionsSetup = this.optionsSetup;
      const customColor = optionsSetup.customColor;
      if (!customColor) return;
      const arrColor = [];
      for (let i = 0; i < customColor.length; i++) {
        arrColor.push(customColor[i].color);
      }
      this.options.color = arrColor;
      this.options = Object.assign({}, this.options);
    },
    // 数据解析
    setOptionsData() {
      const optionsSetup = this.optionsSetup;
      const optionsData = this.optionsData;
      if (!optionsData || optionsData.length === 0) return;
      this.getEchartData(optionsData, optionsSetup);
    },
    getEchartData(optionsData, optionsSetup) {
      // const data = this.analysisChartsData(optionsData);
      this.renderingFn(optionsData);
    },
    //渲染图表
    renderingFn(val) {
      for (const key in this.options.series) {
        this.options.series[key] = {
          type: "treemap",
          data: val,
          roam: false,
          breadcrumb: {
            show: false,
          },
          nodeClick: false,
          label: {
            show: true,
            position: this.optionsSetup.dataPosition,
            distance: this.optionsSetup.distance,
            fontSize: this.optionsSetup.fontSize,
            color: this.optionsSetup.dataColor,
            fontWeight: this.optionsSetup.fontWeight,
          },
          top: this.optionsSetup.marginTop,
          bottom: this.optionsSetup.marginBottom,
          left: this.optionsSetup.marginLeft,
          right: this.optionsSetup.marginRight,
        };
      }
    },
  },
};
</script>

<style scoped lang="less">
.echarts {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
