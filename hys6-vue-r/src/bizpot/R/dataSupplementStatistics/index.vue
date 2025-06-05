<template>
  <div class="dashboard">
    <div class="header">
      <div :gutter="20">
        <div>
          <el-form ref="counts" :model="counts" label-width="140px">
            <el-row :gutter="2">
              <el-col :span="8">
                <el-form-item label="监管补录发布次数:" prop="countByJianguan">
                  {{counts.countByJianguan}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="临时补录发布次数:" prop="countByLinshi">
                  {{counts.countByLinshi}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="常规补录发布次数:" prop="countByChanggui">
                  {{counts.countByChanggui}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-row>
          <el-col :span="10">
            <span style="color: #606266;font-size: 14px;margin: 0 10px 0 15px">选择日期</span>
            <el-date-picker
                    v-model="value1"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    size="small"
                    style="width:60%"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="8">
            <span class="demonstration" style="color: #606266;font-size: 14px;margin:0 10px 0 -80px ">选择补录类型</span>
            <el-select v-model="dfType" placeholder="请选择" size="small" style="width:28%"
            >
              <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4" style="margin-right: -30px">
            <el-button size="small" class="resetBtn" @click="resetPage()"
            >重置</el-button
            >
            <el-button
                    type="primary"
                    size="small"
                    class="searchBtn"
                    @click="getData()"
            >查询</el-button
            >
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="body">
      <el-card style="width: 36%; border-radius: 10px">
        <div>补录数据按补录类型分布百分比</div>
        <div class="left" style="display: flex; justify-content: space-between">
          <div id="leftEcharts" style="width: 50%"></div>
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              width: 50%;
              height: 160px;
              padding: 10px;
            "
          >
            <div
              class="item"
              v-for="(item, index) in leftPieData"
              :key="index"
              style="margin-top: 10px; fontsize: 10px; position: relative"
            >
              <div
                style="
                  width: 10px;
                  height: 10px;
                  border-radius: 10px;
                  background-color: red;
                  display: inline-block;
                "
                :style="{ backgroundColor: color[index % color.length] }"
              ></div>
              <span style="margin: 10px; fontsize: 10px;">{{ item.label }} :</span>
              <span style="margin-right: 10px; fontsize: 10px;">{{ item.percentage }}%</span>
            </div>
          </div>
        </div>
      </el-card>
      <el-card  style="width: 36%; border-radius: 10px;margin-left: 5px;" >
              <div>补录数据按补录类型分布折线图</div>
        <div style="display: flex; flex-direction: column; height: 100%;">
          <div style="flex: 1">
            <div id="chart" style="height: 90%"></div>
          </div>
        </div>
      </el-card>
      <el-card  style="width: 36%; border-radius: 10px;margin-left: 5px;">
              <div>补录数据按补录类型分布柱状图</div>
        <div style="display: flex; flex-direction: column; height: 100% ">
          <div style="flex: 1">
            <div id="chart2" style="height: 90%"></div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="body" style="margin-top: 20px">
      <el-card style="width: 36%; border-radius: 10px;">
        <div id="basicChart" class="chartStyle" style="border: none"></div>
      </el-card>
      <el-card style="width: 36%; border-radius: 10px;margin-left: 5px;">
        <div id="addChart" class="chartStyle" style="border: none"></div>
      </el-card>
      <el-card style="width: 36%; border-radius: 10px;margin-left: 5px;">
        <div id="examineChart" class="chartStyle" style="border: none"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import * as functionAll from "./countDf";
import {execGetByMenuUrl, execGetByPostModuleUrl} from "@/utils/executeRequest";
import echarts from "echarts";

export default {
  data() {
    return {
      chartData: null,
      pickerOptions: {
        shortcuts: [],
      },
      options: [
        {
          null: null,
          label: "全部",
        },
        {
          value: "1",
          label: "监管补录",
        },
        {
          value: "2",
          label: "常规补录",
        },
        {
          value: "3",
          label: "临时补录",
        },
      ],
      dfType: null,
      startDate: null,
      endDate: null,
      value1: "",
      countForm: {},
      countData: [],
      color: ["#003366", "#006699", "#4cabce", "#e5323e", "green", "skyblue"],
      leftPieData: [],
      centerTopX: [],
      centerTopY: [],
      centerBottomY: [],
      counts: {
        countByJianguan: "",
        countByLinshi: "",
        countByChanggui: "",
      },
      images: [],
      imageBgColor: [
        "rgba(73, 169, 238, 1)",
        "rgba(129, 211, 248, 1)",
        "rgba(255, 216, 110, 1)",
        "rgba(152, 216, 125, 1)",
        "rgba(243, 133, 124, 1)",
      ],
      basicXChart: [],
      basicAddYChart: [],
      basicSubbmitYChart: [],
      basicALXChart: [],
      basicALYChart: [],
      basicALYChart1: [],
      basicEXXChart: [],
      basicEXYChart: [],
      basicEXYChart1: []
    };
  },
  created() {},
  async mounted() {
    await this.getData();
    // await this.getMonthData();
    // this.getBasicChartData();
  },
  methods: {
    resetPage() {
      this.value1 = "";
      this.leftPieData = "";
      this.dfType = null;
      this.location.reload();
    },
    getBasicChartData(){
      this.getBasicStaChartData();
      this.getDfApplyNumber();
      this.getDfExamineNumber();
    },
    getBasicStaChartData(){
      let param = {
        startDate: this.value1[0],
        endDate: this.value1[1]
      };
      // 调用接口获取数据
      this.$executeRequest.execGetByMenuUrl("/dfProInfoApi/getDfProInfoARAndSuNumber",param).then(res =>{
        this.basicXChart=[];
        this.basicAddYChart=[];
        this.basicSubbmitYChart=[];
        res.data.forEach(item => {
          this.basicXChart.push(item.month+"月");
          this.basicAddYChart.push(item.value);
          this.basicSubbmitYChart.push(item.addValue);
        });
        var chartDom = document.getElementById('basicChart');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          title: {
            text: '基础统计',
            x: 'left',
            textStyle: {
              fontWeight: 'normal',
              //字体大小
              fontSize: 16
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['补录次数', '提交次数'],
            top: 'bottom',
          },
          toolbox: {
            show: true,
            feature: {
              magicType: { show: true, type: ['line', 'bar'] }
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: this.basicXChart,
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '补录次数',
              type: 'bar',
              data: this.basicAddYChart
            },
            {
              name: '提交次数',
              type: 'bar',
              data: this.basicSubbmitYChart
            }
          ]
        };
        option && myChart.setOption(option);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      })
      // functionAll.getDfProInfoARAndSuNumber(param).then((res) => {
      //     this.basicXChart=[];
      //     this.basicAddYChart=[];
      //     this.basicSubbmitYChart=[];
      //     res.data.forEach(item => {
      //         this.basicXChart.push(item.month+"月");
      //         this.basicAddYChart.push(item.value);
      //         this.basicSubbmitYChart.push(item.addValue);
      //     });
      //   var chartDom = document.getElementById('basicChart');
      //   var myChart = echarts.init(chartDom);
      //   var option;
      //   option = {
      //     title: {
      //       text: '基础统计',
      //       x: 'left',
      //       textStyle: {
      //         fontWeight: 'normal',
      //         //字体大小
      //         fontSize: 16
      //       },
      //     },
      //     tooltip: {
      //       trigger: 'axis',
      //     },
      //     legend: {
      //       data: ['补录次数', '提交次数'],
      //       top: 'bottom',
      //     },
      //     toolbox: {
      //       show: true,
      //       feature: {
      //         magicType: { show: true, type: ['line', 'bar'] }
      //       }
      //     },
      //     calculable: true,
      //     xAxis: [
      //       {
      //         type: 'category',
      //         data: this.basicXChart,
      //       }
      //     ],
      //     yAxis: [
      //       {
      //         type: 'value'
      //       }
      //     ],
      //     series: [
      //       {
      //         name: '补录次数',
      //         type: 'bar',
      //         data: this.basicAddYChart
      //       },
      //       {
      //         name: '提交次数',
      //         type: 'bar',
      //         data: this.basicSubbmitYChart
      //       }
      //     ]
      //   };
      //   option && myChart.setOption(option);
      //   window.addEventListener("resize", function () {
      //     myChart.resize();
      //   });
      // });
    },
    getDfApplyNumber(){
      let param = {
        startDate: this.value1[0],
        endDate: this.value1[1]
      };
      // 调用接口获取数据
      this.$executeRequest.execGetByMenuUrl("/dfProInfoApi/getDfApplyNumber",param).then(res =>{
        this.basicALXChart=[];
        this.basicALYChart=[];
        this.basicALYChart1=[];
        res.data.forEach(item => {
          this.basicALXChart.push(item.month+"月");
          this.basicALYChart.push(item.counts);
          this.basicALYChart1.push(item.avg_days_to_sync.toString());
        });
        var chartDom = document.getElementById('addChart');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          title: {
            text: '补录统计',
            x: 'left',
            textStyle: {
              fontWeight: 'normal',
              //字体大小
              fontSize: 16
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            },
            formatter: '{b0}: {c0}<br />{b1}: {c1} 天'
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: this.basicALXChart,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '补录表个数',
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '平均停留时间',
              axisLabel: {
                formatter: '{value}天'
              }
            }
          ],
          series: [
            {
              name: '补录表个数',
              type: 'bar',
              data: this.basicALYChart,
            },
            {
              name: '平均停留时间',
              type: 'line',
              data: this.basicALYChart1,
              yAxisIndex: 1,
              tooltip: {
                formatter: function (value) {
                  return value + ' 天';
                }
              },
            }
          ]
        };
        option && myChart.setOption(option);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      })
      // functionAll.getDfApplyNumber(param).then((res) => {
      //   this.basicALXChart=[];
      //   this.basicALYChart=[];
      //   this.basicALYChart1=[];
      //   res.data.forEach(item => {
      //     this.basicALXChart.push(item.month+"月");
      //     this.basicALYChart.push(item.counts);
      //     this.basicALYChart1.push(item.avg_days_to_sync.toString());
      //   });
      //   var chartDom = document.getElementById('addChart');
      //   var myChart = echarts.init(chartDom);
      //   var option;
      //   option = {
      //     title: {
      //       text: '补录统计',
      //       x: 'left',
      //       textStyle: {
      //         fontWeight: 'normal',
      //         //字体大小
      //         fontSize: 16
      //       },
      //     },
      //     tooltip: {
      //       trigger: 'axis',
      //       axisPointer: {
      //         type: 'cross',
      //         crossStyle: {
      //           color: '#999'
      //         }
      //       },
      //       formatter: '{b0}: {c0}<br />{b1}: {c1} 天'
      //     },
      //     calculable: true,
      //     xAxis: [
      //       {
      //         type: 'category',
      //         data: this.basicALXChart,
      //         axisPointer: {
      //           type: 'shadow'
      //         }
      //       }
      //     ],
      //     yAxis: [
      //       {
      //         type: 'value',
      //         name: '补录表个数',
      //         axisLabel: {
      //           formatter: '{value}'
      //         }
      //       },
      //       {
      //         type: 'value',
      //         name: '平均停留时间',
      //         axisLabel: {
      //           formatter: '{value}天'
      //         }
      //       }
      //     ],
      //     series: [
      //       {
      //         name: '补录表个数',
      //         type: 'bar',
      //         data: this.basicALYChart,
      //       },
      //       {
      //         name: '平均停留时间',
      //         type: 'line',
      //         data: this.basicALYChart1,
      //         yAxisIndex: 1,
      //         tooltip: {
      //           formatter: function (value) {
      //             return value + ' 天';
      //           }
      //         },
      //       }
      //     ]
      //   };
      //   option && myChart.setOption(option);
      //   window.addEventListener("resize", function () {
      //     myChart.resize();
      //   });
      // });
    },
    getDfExamineNumber(){
      let param = {
        startDate: this.value1[0],
        endDate: this.value1[1]
      };
      // 调用接口获取数据
      this.$executeRequest.execGetByMenuUrl("/dfProInfoApi/getDfExamineNumber",param).then(res => {
        this.basicEXXChart=[];
        this.basicEXYChart=[];
        this.basicEXYChart1=[];
        res.data.forEach(item => {
          this.basicEXXChart.push(item.month+"月");
          this.basicEXYChart.push(item.counts);
          this.basicEXYChart1.push(item.avg_days_to_sync.toString());
        });
        var chartDom = document.getElementById('examineChart');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          title: {
            text: '审批统计',
            x: 'left',
            textStyle: {
              fontWeight: 'normal',
              //字体大小
              fontSize: 16,
              fontStyle: "normal"
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            },
            formatter: '{b0}: {c0}<br />{b1}: {c1} 天'
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: this.basicEXXChart,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '审批表个数',
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '平均停留时间',
              axisLabel: {
                formatter: '{value}天'
              }
            }
          ],
          series: [
            {
              name: '审批表个数',
              type: 'bar',
              data: this.basicEXYChart,
            },
            {
              name: '平均停留时间',
              type: 'line',
              data: this.basicEXYChart1,
              yAxisIndex: 1,
              tooltip: {
                valueFormatter: function (value) {
                  return value + '天';
                }
              },
            }
          ]
        };
        option && myChart.setOption(option);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      })
      // functionAll.getDfExamineNumber(param).then((res) => {
      //   this.basicEXXChart=[];
      //   this.basicEXYChart=[];
      //   this.basicEXYChart1=[];
      //   res.data.forEach(item => {
      //     this.basicEXXChart.push(item.month+"月");
      //     this.basicEXYChart.push(item.counts);
      //     this.basicEXYChart1.push(item.avg_days_to_sync.toString());
      //   });
      //   var chartDom = document.getElementById('examineChart');
      //   var myChart = echarts.init(chartDom);
      //   var option;
      //   option = {
      //     title: {
      //       text: '审批统计',
      //       x: 'left',
      //       textStyle: {
      //         fontWeight: 'normal',
      //         //字体大小
      //         fontSize: 16,
      //         fontStyle: "normal"
      //       },
      //     },
      //     tooltip: {
      //       trigger: 'axis',
      //       axisPointer: {
      //         type: 'cross',
      //         crossStyle: {
      //           color: '#999'
      //         }
      //       },
      //       formatter: '{b0}: {c0}<br />{b1}: {c1} 天'
      //     },
      //     calculable: true,
      //     xAxis: [
      //       {
      //         type: 'category',
      //         data: this.basicEXXChart,
      //         axisPointer: {
      //           type: 'shadow'
      //         }
      //       }
      //     ],
      //     yAxis: [
      //       {
      //         type: 'value',
      //         name: '审批表个数',
      //         axisLabel: {
      //           formatter: '{value}'
      //         }
      //       },
      //       {
      //         type: 'value',
      //         name: '平均停留时间',
      //         axisLabel: {
      //           formatter: '{value}天'
      //         }
      //       }
      //     ],
      //     series: [
      //       {
      //         name: '审批表个数',
      //         type: 'bar',
      //         data: this.basicEXYChart,
      //       },
      //       {
      //         name: '平均停留时间',
      //         type: 'line',
      //         data: this.basicEXYChart1,
      //         yAxisIndex: 1,
      //         tooltip: {
      //           valueFormatter: function (value) {
      //             return value + '天';
      //           }
      //         },
      //       }
      //     ]
      //   };
      //   option && myChart.setOption(option);
      //   window.addEventListener("resize", function () {
      //     myChart.resize();
      //   });
      // });
    },
    renderChart() {
      const months = [];
      const names = [];
      const labels = [];
      const valuesByNames = {};
      const valuesByLabels = {};
      // 生成横坐标和纵坐标数据
      this.chartData.forEach((item) => {
        if (!months.includes(item.month+"月")) {
          months.push(item.month+"月");
        }
        if (!names.includes(item.name)) {
          names.push(item.name);
          valuesByNames[item.name] = [];
        }
        if (!labels.includes(item.label)) {
          labels.push(item.label);
          valuesByLabels[item.label] = [];
        }
        valuesByNames[item.name].push(item.value);
        valuesByLabels[item.label].push(item.value);
      });
      months.sort();
      // 生成option对象
      const option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: this.legendData,
        },
        xAxis: {
          type: "category",
          data: months,
        },
        yAxis: {
          type: "value",
        },
        legend: {
          data: labels,
        },
        series: [],
      };
      // 生成折线图系列数据
      labels.forEach((label) => {
        option.series.push({
          name: label,
          type: "line",
          data: valuesByLabels[label],
        });
      });
      option.series.push({
        name: "Total",
        type: "bar",
      });
      // 渲染图表
      const chart = this.$echarts.init(document.getElementById("chart"));
      chart.setOption(option);
      window.addEventListener("resize", function () {
        chart.resize();
      });
    },
    renderChartB() {
      const months = [];
      const names = [];
      const labels = [];
      const valuesByNames = {};
      const valuesByLabels = {};
      // 生成横坐标和纵坐标数据
      this.chartData.forEach((item) => {
        if (!months.includes(item.month+"月")) {
          months.push(item.month+"月");
        }
        if (!names.includes(item.name)) {
          names.push(item.name);
          valuesByNames[item.name] = [];
        }
        if (!labels.includes(item.label)) {
          labels.push(item.label);
          valuesByLabels[item.label] = [];
        }
        valuesByNames[item.name].push(item.value);
        valuesByLabels[item.label].push(item.value);
      });
      months.sort();
      // 生成option对象
      const option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: this.legendData,
        },
        xAxis: {
          type: "category",
          data: months,
        },
        yAxis: {
          type: "value",
        },
        legend: {
          data: labels,
        },
        series: [],
      };
      // 生成柱状图系列数据
      labels.forEach((label) => {
        option.series.push({
          name: label,
          type: "bar",
          data: valuesByLabels[label],
        });
      });
      option.series.push({
        name: "Total",
        type: "bar",
      });
      // 渲染图表
      const chart2 = this.$echarts.init(document.getElementById("chart2"));
      chart2.setOption(option);
      window.addEventListener("resize", function () {
        chart2.resize();
      });
    },
    getData() {
      let param = {
        startDate: this.value1[0],
        endDate: this.value1[1],
        dfType: this.dfType,
      };
      // 调用接口获取数据
      this.$executeRequest.execGetByMenuUrl("/dfProInfoApi/getDfProInfoListByDfType",param).then(res =>{
        if (res.code == 999) {
          this.leftPieData = res.data.map((item, idx) => {
            return {
              index: idx + 1,
              label: item.label,
              name: item.label,
              value: item.value,
              percentage: item.percentage,
            };
          });
          this.countData = res.data;
          this.getCounts(), console.log("this.leftPieData", this.leftPieData);
          this.initEchart();
          this.getMonthData();
          this.getBasicChartData();
        }
      })
      // functionAll.getData(param).then((res) => {
      //   if (res.code == 999) {
      //     this.leftPieData = res.data.map((item, idx) => {
      //       return {
      //         index: idx + 1,
      //         label: item.label,
      //         name: item.label,
      //         value: item.value,
      //         percentage: item.percentage,
      //       };
      //     });
      //     this.countData = res.data;
      //     this.getCounts(), console.log("this.leftPieData", this.leftPieData);
      //     this.initEchart();
      //     this.getMonthData();
      //     this.getBasicChartData();
      //   }
      // });
    },
    getCounts() {
      this.countData.forEach((item) => {
        if (item.label === "监管补录") {
          this.counts.countByJianguan = item.value;
        } else if (item.label === "临时补录") {
          this.counts.countByLinshi = item.value;
        } else if (item.label === "常规补录") {
          this.counts.countByChanggui = item.value;
        }
      });
      console.log(this.counts);
      return this.counts;
    },
    getMonthData() {
      let param = {
        startDate: this.value1[0],
        endDate: this.value1[1],
        dfType: this.dfType,
      };
      // 调用接口获取数据
      this.$executeRequest.execGetByMenuUrl("/dfProInfoApi/getDfProInfoListByDfTypeAndMonth",param).then(res =>{
        if (res.code == 999) {
          this.chartData = res.data;
          this.renderChart();
          this.renderChartB();
          this.initEchart();
        }
      })
      // functionAll.getMonthData(param).then((res) => {
      //   if (res.code == 999) {
      //     this.chartData = res.data;
      //     this.renderChart();
      //     this.renderChartB();
      //     this.initEchart();
      //   }
      // });
    },
    initEchart() {
      const leftEcharts = this.$echarts.init(
        document.getElementById("leftEcharts")
      );
      leftEcharts.setOption({
        title: {
          show: true,
          text:
            "合计\n" +
            this.leftPieData
              .map((a) => a.value)
              .reduce((prev, cur) => prev + cur, 0),
          textStyle: {
            fontWeight: 400,
            fontSize: 16,
          },
          left: "center",
          top: "center",
        },
        color: ["#003366", "#006699", "#4cabce", "#e5323e", "green", "skyblue"],
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 14,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.leftPieData,
          },
        ],
      });
    },
  },
};
</script>

<style lang="less" scoped>
.dashboard {
  height: 85vh;
  background-color: #fff;
  .header {
    display: left;
    justify-content: space-around;
    margin-bottom: 20px;
    .top {
      width: 0;
      height: 0;
      display: inline-block;
      border-right: 5px solid transparent;
      border-left: 5px solid transparent;
      border-bottom: 5px solid green;
      line-height: 1;
    }
    .bottom {
      width: 0;
      height: 0;
      display: inline-block;
      border-right: 5px solid transparent;
      border-left: 5px solid transparent;
      border-top: 5px solid red;
      line-height: 1;
    }
  }
  .body {
    height: 68vh;
    display: flex;
    justify-content: space-around;
  }
  ::v-deep .el-card__body {
    padding: 10px;
  }
  ::v-deep .el-table th {
    background-color: #eef0f2 !important;
  }
  ::v-deep .el-card__body {
    height: 100%;
    box-sizing: border-box;
  }
  .chartStyle {
    height: 100%;
    border: 1px solid #D6D8DB;
    margin-left: 5px;
  }
}
</style>