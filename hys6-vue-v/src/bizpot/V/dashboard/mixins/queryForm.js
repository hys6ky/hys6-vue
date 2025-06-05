export default {
  methods: {
    // 解析不同图标的数据
    analysisChartsData(params) {
      // widget-barchart 柱线图、widget-linechart 折线图、 widget-barlinechart 柱线图
      // widget-piechart 饼图
      // widget-text 文本框
      // widge-table 表格(数据不要转)
      // widget-stackchart 柱形堆叠图
      if (
        params.chartType == "widget-barchart" ||
        params.chartType == "widget-linechart" ||
        params.chartType == "widget-barlinechart"
      ) {
        return this.barOrLineChartFn(params.chartProperties, params.chartData);
      } else if (params.chartType == "widget-piechart") {
        return this.piechartFn(params.chartProperties, params.chartData);
      } else if (params.chartType == "widget-text") {
        return this.widgettext(params.chartProperties, params.chartData);
      } else if (params.chartType == "widget-stackchart") {
        return this.stackChartFn(params.chartProperties, params.chartData);
      } else {
        return params.chartData;
      }
    },
    // 柱状图、折线图、柱线图
    barOrLineChartFn(chartProperties, data) {
      const analysisData = {};
      const xAxisList = [];
      const series = [];
      for (const key in chartProperties) {
        const obj = {};
        const seriesData = [];
        const value = chartProperties[key];
        obj["type"] = value;
        obj["name"] = key;
        for (let i = 0; i < data.length; i++) {
          if (value.startsWith("xAxis")) {
            // 代表为x轴
            xAxisList[i] = data[i][key];
          } else {
            // 其他的均为series展示数据
            seriesData[i] = data[i][key];
          }
        }
        obj["data"] = seriesData;
        if (!obj["type"].startsWith("xAxis")) {
          series.push(obj);
        }
      }
      analysisData["xAxis"] = xAxisList;
      analysisData["series"] = series;
      return analysisData;
    },
    // 饼图、漏斗图
    piechartFn(chartProperties, data) {
      const analysisData = [];
      for (let i = 0; i < data.length; i++) {
        const obj = {};
        for (const key in chartProperties) {
          const value = chartProperties[key];
          if (value === "name") {
            obj["name"] = data[i][key];
          } else {
            obj["value"] = data[i][key];
          }
        }
        analysisData.push(obj);
      }
      return analysisData;
    },
    widgettext(chartProperties, data) {
      const analysisData = [];
      for (let i = 0; i < data.length; i++) {
        const obj = {};
        for (const key in chartProperties) {
          const value = chartProperties[key];
          if (value === "name") {
          } else {
            obj["value"] = data[i][key];
          }
        }
        analysisData.push(obj);
      }
      return analysisData;
    },
    //堆叠图
    stackChartFn(chartProperties, data) {
      const analysisData = {};
      const series = [];
      //全部字段字典值
      const types = Object.values(chartProperties);
      //x轴字段、y轴字段名
      const xAxisField = Object.keys(chartProperties)[types.indexOf("xAxis")];
      const yAxisField = Object.keys(chartProperties)[types.indexOf("yAxis")];
      const dataField = Object.keys(chartProperties)[types.indexOf("bar")];
      //x轴数值去重，y轴去重
      const xAxisList = this.setUnique(data.map((item) => item[xAxisField]));
      const yAxisList = this.setUnique(data.map((item) => item[yAxisField]));
      const dataGroup = this.setGroupBy(data, yAxisField);
      for (const key in chartProperties) {
        if (
          chartProperties[key] !== "yAxis" &&
          !chartProperties[key].startsWith("xAxis")
        ) {
          Object.keys(dataGroup).forEach((item) => {
            const data = new Array(xAxisList.length).fill(0);
            dataGroup[item].forEach((res) => {
              data[xAxisList.indexOf(res[xAxisField])] = res[key];
            });
            series.push({
              name: yAxisList[item],
              type: chartProperties[key],
              data: data,
            });
          });
        }
      }
      analysisData["xAxis"] = xAxisList;
      analysisData["series"] = series;
      console.log(analysisData, "analysisData");
      return analysisData;
    },
    setGroupBy(array, name) {
      const groups = {};
      array.forEach(function (o) {
        const group = JSON.stringify(o[name]);
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) {
        return groups[group];
      });
    },
  },
};
