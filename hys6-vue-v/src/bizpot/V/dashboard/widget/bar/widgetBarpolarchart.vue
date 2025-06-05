<template>
  <div :style="styleObj">
    <v-chart ref="myVChart" :option="options" autoresize />
  </div>
</template>

<script>
export default {
  name: "widgetBarpolarchart",
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
        legend: {
          textStyle: {
            color: "#fff",
          },
        },
        angleAxis: {
          type: "value",
          data: [],
          axisLabel: {
            show: true,
            color: "#fff",
          },
        },
        radiusAxis: {
          type: "category",
          data: [],
          axisLabel: {
            show: true,
            color: "#fff",
          },
        },
        polar: {},
        series: [
          {
            data: [],
            type: "bar",
            coordinateSystem: "polar",
            itemStyle: {
              borderRadius: null,
            },
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
    // console.log(this.options, "options");
  },
  methods: {
    // 修改图标options属性
    editorOptions() {
      this.setOptionsTitle();
      this.setOptionsRadiusAxis();
      this.setOptionsAngleAxis();
      this.setOptionsLegend();
      this.setOptionsTooltip();
      this.setOptionsData();
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
    // 图例名称设置
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
    // 半径轴设置
    setOptionsRadiusAxis() {
      const optionsSetup = this.optionsSetup;

      const radiusAxis = {
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
      this.options.radiusAxis = radiusAxis;
    },
    // 角度轴设置
    setOptionsAngleAxis() {
      const optionsSetup = this.optionsSetup;
      const angleAxis = {
        type: "value",
        // 坐标轴是否显示
        max: optionsSetup.maxY !== "" ? optionsSetup.maxY : null,
        show: optionsSetup.isShowY,
        scale: optionsSetup.scale,
        startAngle: optionsSetup.startAngle,
        // 均分
        splitNumber: optionsSetup.splitNumberY,
        // 轴反转
        inverse: optionsSetup.reversalY,
        axisLabel: {
          show: true,
          // 坐标文字颜色
          color: optionsSetup.colorY,
          fontSize: optionsSetup.fontSizeY,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: optionsSetup.lineColorY,
            width: optionsSetup.lineWidthY,
          },
        },
        splitLine: {
          show: optionsSetup.isShowSplitLineY,
          lineStyle: {
            color: optionsSetup.splitLineColorY,
            width: optionsSetup.splitLineWidthY,
          },
        },
      };
      this.options.angleAxis = angleAxis;
    },
    // 数据解析
    setOptionsData() {
      const optionsSetup = this.optionsSetup;
      const optionsData = this.optionsData;
      if (!optionsData || optionsData.length === 0) return;
      this.renderingFn(optionsData, optionsSetup);
    },
    renderingFn(val, optionsSetup) {
      // console.log(val, optionsSetup, "*****");
      //颜色
      const customColor = optionsSetup.customColor;
      const arrColor = [];
      for (let i = 0; i < customColor.length; i++) {
        arrColor.push(customColor[i].color);
      }
      const series = [];
      const legendName = [];
      for (const i in val.series) {
        legendName.push(val.series[i].name);
        const obj = {};
        if (val.series[i].type == "bar") {
          obj.type = "bar";
          obj.barWidth = optionsSetup.maxWidth;
          obj.barMinAngle = optionsSetup.minAngle;
          obj.label = {
            show: optionsSetup.isShow,
            position: "middle",
            fontSize: optionsSetup.fontSize,
            color: optionsSetup.dataColor,
            fontWeight: optionsSetup.fontWeight,
            formatter: !!optionsSetup.percentSign ? "{c}%" : "{c}",
          };
          // 获取颜色样式
          if (optionsSetup.colorStyle == "same") {
            obj.itemStyle = {
              color: arrColor[i],
              borderRadius: optionsSetup.radius,
            };
          } else {
            obj.itemStyle = {
              color: (params) => {
                return arrColor[params.dataIndex] || "";
              },
              borderRadius: optionsSetup.radius,
            };
          }
          //柱体背景属性
          obj.showBackground = optionsSetup.isShowBackground;
          obj.backgroundStyle = {
            color: optionsSetup.backgroundStyleColor,
            borderColor: optionsSetup.backgroundStyleBorderColor,
            borderWidth: optionsSetup.backgroundStyleBorderWidth,
            borderType: optionsSetup.backgroundStyleBorderType,
            shadowBlur: optionsSetup.backgroundStyleShadowBlur,
            shadowColor: optionsSetup.backgroundStyleShadowColor,
            opacity: optionsSetup.backgroundStyleOpacity / 100,
          };
          obj.data = val.series[i].data;
          obj.coordinateSystem = val.series[i].coordinateSystem || "polar";
          series.push(obj);
        }
      }
      // 根据图表的宽度 x轴的字体大小、长度来估算X轴的label能展示多少个字
      const xAxisDataLength = val.length !== 0 ? val.radiusAxis.length : 1;
      const rowsNum =
        optionsSetup.textRowsNum !== ""
          ? optionsSetup.textRowsNum
          : parseInt(
              this.optionsStyle.width / xAxisDataLength / optionsSetup.fontSizeX
            );
      const formatter = function (value, index) {
        const strs = value.split("");
        let str = "";
        for (let i = 0, s; (s = strs[i++]); ) {
          str += s;
          if (!(i % rowsNum)) str += "\n";
        }
        return str;
      };
      this.options.radiusAxis.data = val.radiusAxis;
      this.options.angleAxis.data = [];
      this.options.radiusAxis.type = "category";
      this.options.angleAxis.type = "value";
      this.options.series = series;
      this.options.legend["data"] = legendName;
      if (optionsSetup.textRowsBreakAuto) {
        this.options.radiusAxis.axisLabel.formatter = formatter;
      }
      this.setOptionsLegendName(legendName);
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
