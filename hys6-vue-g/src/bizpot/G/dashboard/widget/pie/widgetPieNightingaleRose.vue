<template>
  <div :style="styleObj">
    <v-chart ref="myVChart" :option="options" autoresize />
  </div>
</template>

<script>
export default {
  name: "WidgetPieNightingaleRoseArea", //南丁格尔玫瑰图面积模式 参考：https://echarts.apache.org/examples/zh/editor.html?c=pie-roseType-simple
  props: {
    value: Object,
    ispreview: Boolean,
  },
  data() {
    return {
      options: {
        legend: {
          top: "bottom",
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
          },
        },
        series: [
          {
            //name: "面积模式",
            type: "pie",
            radius: ["10%", "50%"],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
            data: [],
          },
        ],
      },
      optionsStyle: {}, // 样式
      optionsData: {}, // 数据
      optionsCollapse: {}, // 图标属性
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
    allComponentLinkage() {
      return this.$store.state.designer.allComponentLinkage;
    },
  },
  watch: {
    value: {
      handler(val) {
        this.optionsStyle = val.position;
        this.optionsData = val.data;
        this.optionsCollapse = val.setup;
        this.optionsSetup = val.setup;
        this.editorOptions();
      },
      deep: true,
    },
  },
  created() {
    this.optionsStyle = this.value.position;
    this.optionsData = this.value.data;
    this.optionsCollapse = this.value.setup;
    this.optionsSetup = this.value.setup;
    this.editorOptions();
  },
  methods: {
    // 修改图标options属性
    editorOptions() {
      this.setOptionsTitle();
      this.setOptionsValue();
      this.setOptionsTooltip();
      this.setOptionsLegend();
      this.setOptionsColor();
      this.setOptionsData();
      this.setOptionsRosetype();
    },
    // 饼图模式 面积模式"area" 半径模式"radius"
    setOptionsRosetype() {
      this.options.series[0]["roseType"] = this.optionsSetup.nightingleRosetype;
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
    // 数值设定
    setOptionsValue() {
      const optionsSetup = this.optionsSetup;
      const series = this.options.series;
      const numberValue = optionsSetup.numberValue ? "{c}" : "";
      const percentage = optionsSetup.percentage ? "({d})%" : "";
      const label = {
        show: optionsSetup.isShow,
        formatter: `{a|{b}：${numberValue} ${percentage}}`,
        rich: {
          a: {
            padding: [-30, 15, -20, 15],
            color: optionsSetup.dataColor,
            fontSize: optionsSetup.fontSize,
            fontWeight: optionsSetup.fontWeight,
          },
        },
        fontSize: optionsSetup.fontSize,

        fontWeight: optionsSetup.optionsSetup,
      };
      for (const key in series) {
        if (series[key].type == "pie") {
          series[key].label = label;
          series[key].labelLine = { show: optionsSetup.isShow };
        }
      }
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
    // 边距设置
    setOptionsMargin() {
      const optionsSetup = this.optionsSetup;
      const grid = {
        left: optionsSetup.marginLeft,
        right: optionsSetup.marginRight,
        bottom: optionsSetup.marginBottom,
        top: optionsSetup.marginTop,
        containLabel: true,
      };
      this.options.grid = grid;
    },
    // 图例操作 legend
    setOptionsLegend() {
      const optionsSetup = this.optionsSetup;
      const legend = this.options.legend;
      legend.show = optionsSetup.isShowLegend;
      legend.left = optionsSetup.lateralPosition;
      legend.right = optionsSetup.lateralPosition;
      legend.top = optionsSetup.longitudinalPosition;
      legend.bottom = optionsSetup.longitudinalPosition;
      legend.orient = optionsSetup.layoutFront;
      legend.textStyle = {
        color: optionsSetup.legendColor,
        fontSize: optionsSetup.legendFontSize,
      };
      legend.itemWidth = optionsSetup.legendWidth;
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
      const optionsData = this.optionsData; // 数据
      const optionsSetup = this.optionsSetup; // 属性
      this.getEchartData(optionsData, optionsSetup);
    },

    getEchartData(optionsData, optionsSetup) {
      // const data = this.analysisChartsData(optionsData);
      this.renderingFn(optionsData, optionsSetup);
    },
    renderingFn(val) {
      for (const key in this.options.series) {
        if (this.options.series[key].type == "pie") {
          this.options.series[key].data = val;
        }
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
