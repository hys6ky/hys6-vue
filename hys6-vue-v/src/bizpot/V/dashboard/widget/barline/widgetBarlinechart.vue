<template>
  <div :style="styleObj">
    <v-chart ref="myVChart" :option="options" autoresize />
  </div>
</template>

<script>
export default {
  name: "WidgetBarlinechart",
  props: {
    value: Object,
    ispreview: Boolean,
  },
  data() {
    return {
      options: {
        color: [],
        grid: {},
        title: {
          text: "",
          textStyle: {
            color: "#fff",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%",
        },
        legend: {
          textStyle: {
            color: "#fff",
          },
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLabel: {
              show: false,
              color: "#fff",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              show: true,
              color: "#fff",
            },
          },
          {
            type: "value",
            name: "",
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              show: true,
              color: "#fff",
            },
          },
        ],
        series: [
          {
            name: "",
            type: "bar",
            yAxisIndex: 0,
            data: [],
            itemStyle: {
              borderRadius: null,
            },
          },
          {
            name: "",
            type: "line",
            yAxisIndex: 1,
            data: [],
            itemStyle: {},
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
  },
  watch: {
    value: {
      handler(val) {
        this.optionsStyle = val.position;
        this.optionsData = val.data;
        this.optionsCollapse = val.collapse;
        this.optionsSetup = val.setup;
        this.editorOptions();
      },
      deep: true,
    },
  },
  created() {
    this.optionsStyle = this.value.position;
    this.optionsData = this.value.data;
    this.optionsCollapse = this.value.collapse;
    this.optionsSetup = this.value.setup;
    this.editorOptions();
  },
  methods: {
    // 修改图标options属性
    editorOptions() {
      this.setOptionsTitle();
      this.setOptionsX();
      this.setOptionsY();
      this.setOptionsLine();
      this.setOptionsBar();
      this.setOptionsTooltip();
      this.setOptionsData();
      this.setOptionsMargin();
      this.setOptionsLegend();
      this.setOptionsColor();
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
    // X轴设置
    setOptionsX() {
      const optionsSetup = this.optionsSetup;
      const xAxis = {
        type: "category",
        // 坐标轴是否显示
        show: optionsSetup.hideX,
        // 坐标轴名称
        name: optionsSetup.nameX,
        nameTextStyle: {
          color: optionsSetup.nameColorX,
          fontSize: optionsSetup.nameFontSizeX,
        },
        // 轴反转
        inverse: optionsSetup.reversalX,
        axisLabel: {
          show: true,
          interval: optionsSetup.textInterval,
          // 文字角度
          rotate: optionsSetup.textAngleX,
          // 坐标文字颜色
          color: optionsSetup.colorX,
          fontSize: optionsSetup.fontSizeX,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: optionsSetup.lineColorX,
            width: optionsSetup.lineWidthX,
          },
        },
        splitLine: {
          show: optionsSetup.isShowSplitLineX,
          lineStyle: {
            color: optionsSetup.splitLineColorX,
            width: optionsSetup.splitLineWidthX,
          },
        },
      };
      this.options.xAxis = xAxis;
    },
    // Y轴设置
    setOptionsY() {
      const optionsSetup = this.optionsSetup;
      const yAxis = [
        {
          type: "value",
          // 均分
          splitNumber: optionsSetup.splitNumberLeft,
          // 坐标轴是否显示
          show: optionsSetup.isShowYLeft,
          // 坐标轴名称
          name: optionsSetup.textNameYLeft,
          // 别名
          nameTextStyle: {
            color: optionsSetup.nameColorYLeft,
            fontSize: optionsSetup.nameFontSizeYLeft,
          },
          axisLabel: {
            show: true,
            // 文字角度
            rotate: optionsSetup.textAngleYLeft,
            // 坐标文字颜色
            color: optionsSetup.colorYLeft,
            fontSize: optionsSetup.fontSizeYLeft,
          },
          axisTick: {
            // 刻度
            show: optionsSetup.tickLineYLeft,
          },
          axisLine: {
            show: optionsSetup.lineYLeft,
            lineStyle: {
              width: optionsSetup.lineWidthYLeft,
              color: optionsSetup.lineColorYLeft,
            },
          },
          splitLine: {
            show: optionsSetup.isShowSplitLineYLeft,
            lineStyle: {
              color: optionsSetup.splitLineColorYLeft,
              width: optionsSetup.splitLineFontWidthYLeft,
            },
          },
        },
        {
          type: "value",
          // 均分
          splitNumber: optionsSetup.splitNumberRight,
          // 坐标轴是否显示
          show: optionsSetup.isShowYRight,
          // 坐标轴名称
          name: optionsSetup.textNameYRight,
          // 别名
          nameTextStyle: {
            color: optionsSetup.nameColorYRight,
            fontSize: optionsSetup.nameFontSizeYRight,
          },
          axisLabel: {
            show: true,
            // 文字角度
            rotate: optionsSetup.textAngleYRight,
            // 坐标文字颜色
            color: optionsSetup.colorYRight,
            fontSize: optionsSetup.fontSizeYRight,
          },
          axisTick: {
            // 刻度
            show: optionsSetup.tickLineYRight,
          },
          axisLine: {
            show: optionsSetup.lineYRight,
            lineStyle: {
              width: optionsSetup.lineWidthYRight,
              color: optionsSetup.lineColorYRight,
            },
          },
          splitLine: {
            show: optionsSetup.isShowSplitLineYRight,
            lineStyle: {
              color: optionsSetup.splitLineColorYRight,
              width: optionsSetup.splitLineFontWidthYRight,
            },
          },
        },
      ];
      this.options.yAxis = yAxis;
    },
    // 折线设置 数值设置
    setOptionsLine() {
      const optionsSetup = this.optionsSetup;
      const series = this.options.series;
      for (const key in series) {
        if (series[key].type == "line") {
          series[key].symbol = optionsSetup.symbol;
          series[key].showSymbol = optionsSetup.markPoint;
          series[key].symbolSize = optionsSetup.pointSize;
          series[key].smooth = optionsSetup.smoothCurve;
          if (optionsSetup.area) {
            series[key].areaStyle = {
              opacity: optionsSetup.areaThickness / 100,
            };
          } else {
            series[key].areaStyle = {
              opacity: 0,
            };
          }
          series[key].lineStyle = {
            width: optionsSetup.lineWidth,
          };
          series[key].itemStyle.borderRadius = optionsSetup.radius;
          series[key].label = {
            show: optionsSetup.isShowLine,
            position: "top",
            distance: optionsSetup.distanceLine,
            fontSize: optionsSetup.fontSizeLine,
            color: optionsSetup.subTextColorLine,
            fontWeight: optionsSetup.fontWeightLine,
            formatter: !!optionsSetup.percentSignLine ? "{c}%" : "{c}",
          };
        }
      }
      this.options.series = series;
    },
    // 柱体设置 数值设置
    setOptionsBar() {
      const optionsSetup = this.optionsSetup;
      const series = this.options.series;
      for (const key in series) {
        if (series[key].type == "bar") {
          series[key].label = {
            show: optionsSetup.isShowBar,
            position: "top",
            distance: optionsSetup.distanceBar,
            fontSize: optionsSetup.fontSizeBar,
            color: optionsSetup.subTextColorBar,
            fontWeight: optionsSetup.fontWeightBar,
            formatter: !!optionsSetup.percentSignBar ? "{c}%" : "{c}",
          };
          series[key].barWidth = optionsSetup.maxWidth;
          series[key].barMinHeight = optionsSetup.minHeight;
          series[key].itemStyle.borderRadius = optionsSetup.radius;
        }
      }
      this.options.series = series;
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
    setOptionsLegend() {
      const optionsSetup = this.optionsSetup;
      const legend = this.options.legend;
      legend.show = optionsSetup.isShowLegend;
      legend.left = optionsSetup.lateralPosition;
      legend.top = optionsSetup.longitudinalPosition;
      legend.bottom = optionsSetup.longitudinalPosition;
      legend.orient = optionsSetup.layoutFront;
      legend.textStyle = {
        color: optionsSetup.legendColor,
        fontSize: optionsSetup.legendFontSize,
      };
      legend.itemWidth = optionsSetup.legendWidth;
    },
    // 图例名称设置
    setOptionsLegendName(name) {
      const optionsSetup = this.optionsSetup;
      const series = this.options.series;
      const legendName = optionsSetup.legendName;
      // 图例没有手动写则显示原值，写了则显示新值
      if (null == legendName || legendName == "") {
        for (let i = 0; i < name.length; i++) {
          series[i].name = name[i];
        }
        this.options.legend["data"] = name;
      } else {
        const arr = legendName.split("|");
        for (let i = 0; i < arr.length; i++) {
          series[i].name = arr[i];
        }
        this.options.legend["data"] = arr;
      }
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
    // 数据处理
    setOptionsData(e, paramsConfig) {
      const optionsSetup = this.optionsSetup;
      const optionsData = this.optionsData;
      if (!optionsData || optionsData.length === 0) return;
      this.getEchartData(optionsData, optionsSetup);
    },

    getEchartData(optionsData, optionsSetup) {
      this.renderingFn(optionsData, optionsSetup);
    },
    renderingFn(val, optionsSetup) {
      this.options.xAxis.data = val.xAxis;
      // series
      const series = this.options.series;
      const legendName = [];
      for (const i in series) {
        for (const j in val.series) {
          if (series[i].type == val.series[j].type) {
            series[i].data = val.series[j].data;
            legendName.push(val.series[j].name);
          }
        }
      }
      // 根据图表的宽度 x轴的字体大小、长度来估算X轴的label能展示多少个字
      const xAxisDataLength = val.length !== 0 ? val.xAxis.length : 1;
      const rowsNum =
        optionsSetup.textRowsNum !== ""
          ? optionsSetup.textRowsNum
          : parseInt(
              this.optionsStyle.width / xAxisDataLength / optionsSetup.fontSizeX
            );
      const axisLabel = {
        show: true,
        interval: optionsSetup.textInterval,
        // 文字角度
        rotate: optionsSetup.textAngleX,
        // 坐标文字颜色
        color: optionsSetup.colorX,
        fontSize: optionsSetup.fontSizeX,
        // 自动换行
        formatter: function (value, index) {
          const strs = value.split("");
          let str = "";
          for (let i = 0, s; (s = strs[i++]); ) {
            str += s;
            if (!(i % rowsNum)) str += "\n";
          }
          return str;
        },
      };
      if (optionsSetup.textRowsBreakAuto) {
        this.options.xAxis.axisLabel = axisLabel;
      }
      this.options.legend["data"] = legendName;
      this.setOptionsLegendName(legendName);
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
