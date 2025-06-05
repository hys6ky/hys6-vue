<template>
  <div :style="styleObj">
    <v-chart ref="myVChart" :option="options" autoresize />
  </div>
</template>

<script>
export default {
  name: "widgetBarLineStackChart",
  props: {
    value: Object,
    ispreview: Boolean,
  },
  data() {
    return {
      options: {
        grid: {},
        legend: {
          textStyle: {
            color: "#fff",
          },
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            show: true,
            color: "#fff",
          },
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#cdd5e2",
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              color: "#666666",
            },
          },
          {
            type: "value",
            nameTextStyle: {
              color: "#666666",
            },
            axisLine: {
              lineStyle: {
                color: "#cdd5e2",
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: "#666666",
            },
          },
        ],
        series: [
          {
            data: [],
            name: "",
            type: "bar",
            barGap: "0%",
            itemStyle: {
              borderRadius: null,
            },
          },
          {
            data: [],
            name: "",
            type: "line",
            itemStyle: {},
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
      this.setOptionsX();
      this.setOptionsY();
      this.setOptionsTooltip();
      this.setOptionsMargin();
      this.setOptionsLegend();
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
              color: optionsSetup.lineColorYLeft,
              width: optionsSetup.lineWidthYLeft,
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
    // tooltip 提示语设置，鼠标放置显示
    setOptionsTooltip() {
      const optionsSetup = this.optionsSetup;
      const tooltip = {
        show: optionsSetup.isShowTooltip,
        trigger: optionsSetup.tooltipTrigger,
        axisPointer: {
          type: optionsSetup.tooltipAxisPointerType,
        },
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
    //获取堆叠样式
    getStackStyle() {
      const optionsSetup = this.optionsSetup;
      let style = "";
      if (optionsSetup.stackStyle == "upDown") {
        style = "total";
      }
      return style;
    },
    // 数据解析
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
      //颜色
      const customColor = optionsSetup.customColor;
      const arrColor = [];
      for (let i = 0; i < customColor.length; i++) {
        arrColor.push(customColor[i].color);
      }
      this.options.xAxis.data = val.xAxis;
      this.options.yAxis.data = [];
      this.options.xAxis.type = "category";
      this.options.yAxis.type = "value";
      const series = [];
      let legendName = [];
      for (const i in val.series) {
        legendName.push(val.series[i].name);
      }
      legendName = this.setUnique(legendName);
      for (let i = 0; i < legendName.length; i++) {
        const bar = this.getDynamicSeriesData(legendName[i], val.series, "bar");
        series.push({
          name: legendName[i],
          type: "bar",
          data: bar,
          barGap: "0%",
          stack: this.getStackStyle(),
          barWidth: optionsSetup.maxWidth,
          label: {
            show: optionsSetup.isShowBar,
            position: "top",
            distance: optionsSetup.distanceBar,
            fontSize: optionsSetup.fontSizeBar,
            color: optionsSetup.subTextColorBar,
            fontWeight: optionsSetup.fontWeightBar,
            formatter: !!optionsSetup.percentSignBar ? "{c}%" : "{c}",
          },
          //颜色，圆角属性
          itemStyle: {
            color: arrColor[i],
            borderRadius: optionsSetup.radius,
          },
        });
      }
      for (let i = 0; i < legendName.length; i++) {
        const line = this.getDynamicSeriesData(
          legendName[i],
          val.series,
          "line"
        );
        series.push({
          name: legendName[i],
          type: "line",
          data: line,
          yAxisIndex: 1,
          symbol: optionsSetup.symbol,
          showSymbol: optionsSetup.markPoint,
          symbolSize: optionsSetup.pointSize,
          smooth: optionsSetup.smoothCurve,
          itemStyle: {
            color: arrColor[i],
          },
          // 线条
          lineStyle: {
            color: arrColor[i],
            width: optionsSetup.lineWidth,
          },
          label: {
            show: optionsSetup.isShowLine,
            position: "top",
            distance: optionsSetup.distanceLine,
            fontSize: optionsSetup.fontSizeLine,
            color: optionsSetup.subTextColorLine,
            fontWeight: optionsSetup.fontWeightLine,
            formatter: !!optionsSetup.percentSignLine ? "{c}%" : "{c}",
          },
        });
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
      this.options.series = series;
      this.options.legend["data"] = legendName;
      this.setOptionsLegendName(legendName);
    },
    //去重
    setUnique(arr) {
      let newArr = [];
      arr.forEach((item) => {
        return newArr.includes(item) ? "" : newArr.push(item);
      });
      return newArr;
    },
    getDynamicSeriesData(legend, series, type) {
      let data = [];
      for (const i in series) {
        if (series[i].name == legend && series[i].type == type) {
          data = series[i].data;
        }
      }
      return data;
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
