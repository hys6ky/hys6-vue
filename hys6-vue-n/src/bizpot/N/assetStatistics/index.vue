<template>
  <div class="assetStatistics p-20">
    <div class="d-flex align-items-center mb-10">
      <label class="el-form-item__label" style="width: 90px">属性版本：</label>
      <el-select v-model="version" size="small" filterable>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <el-row :gutter="10" class="header">
      <el-col :span="6" v-for="(item, index) in headerData">
        <el-card class="card0 font-16" :class="'card' + index">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div>{{ item.title }}</div>
              <div class="mt-10">
                <span class="number">{{ item.num }}&nbsp;</span>
                <span>{{ item.unit }}</span>
              </div>
            </div>
            <div style="font-size: 30px; color: #fff">
              <i :class="item.icon" class="number header-icons"></i>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12" class="mt-10">
        <el-card class="chart">
          <header class="chart-title">资产目录共享数量统计</header>
          <div class="chart-box" id="chartOne"></div>
        </el-card>
      </el-col>
      <el-col :span="12" class="mt-10">
        <el-card class="chart">
          <header class="chart-title">资产目录数量按月变化统计</header>
          <div class="chart-box" id="chartTwo"></div>
        </el-card>
      </el-col>
      <el-col :span="12" class="mt-10">
        <el-card class="chart">
          <header class="chart-title">资产目录审批情况统计</header>
          <div class="chart-box" id="chartThree"></div>
        </el-card>
      </el-col>
      <el-col :span="12" class="mt-10">
        <el-card class="chart">
          <header class="chart-title">不同资产类型目录数量统计</header>
          <div class="chart-box" id="chartFour"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  headerData,
  options,
  chartOneBar,
  chartFourBar,
  chartThreePie,
  chartTwoLine,
} from "./mock"; // 引入数据
export default {
  name: "assetStatistics",
  data() {
    return {
      headerData,
      options,
      version: "0",
      chartOneBar,
      chartFourBar,
      chartThreePie,
      chartTwoLine,
      legendOne: [
        {
          label: "不予共享",
          color: "#51D7CB",
        },
        {
          label: "有条件共享",
          color: "#38B5F2",
        },
        {
          label: "无条件共享",
          color: "#758EFF",
        },
      ],
    };
  },
  mounted() {
    this.getChartOne();
    this.getChartFour();
    this.getChartThree();
    this.getChartTwo();
  },
  methods: {
    getChartOne() {
      var myChart = this.$echarts.init(document.getElementById("chartOne"));
      myChart.setOption(chartOneBar);
    },
    getChartFour() {
      var myChart = this.$echarts.init(document.getElementById("chartFour"));
      myChart.setOption(chartFourBar);
    },
    getChartThree() {
      var myChart = this.$echarts.init(document.getElementById("chartThree"));
      myChart.setOption(chartThreePie);
    },
    getChartTwo() {
      var myChart = this.$echarts.init(document.getElementById("chartTwo"));
      myChart.setOption(chartTwoLine);
    },
  },
};
</script>

<style lang="less" scoped>
.assetStatistics {
  .header {
    .card0 {
      background: linear-gradient(135deg, #ddf1fc 0%, #44a3eb 100%);
      color: #64abdf;
      font-size: 18px;
      .number {
        color: #278acf;
        font-size: 30px;
        font-weight: 600;
      }
    }
    .card1 {
      background: linear-gradient(135deg, #e7ebff 0%, #6c80ff 100%);
      color: #8a96f1;
      font-size: 18px;
      .number {
        color: #6677f3;
        font-size: 30px;
        font-weight: 600;
      }
    }
    .card2 {
      background: linear-gradient(135deg, #ffe6dc 0%, #fb6d47 100%);
      color: #fc987b;
      font-size: 18px;
      .number {
        color: #f96a3f;
        font-size: 30px;
        font-weight: 600;
      }
    }
    .card3 {
      background: linear-gradient(135deg, #dde7f7 0%, #7990b8 100%);
      color: #969aa6;
      font-size: 18px;
      .number {
        color: #6e7a9a;
        font-size: 30px;
        font-weight: 600;
      }
    }
    ::v-deep .el-card__body,
    .el-main {
      padding: 10px 20px;
    }
    &-icons {
      font-size: 55px !important;
      margin-right: 20px;
      opacity: 0.5;
    }
  }
  .chart {
    height: 400px;
    position: relative;
    &-title {
      font-size: 16px;
      font-weight: 600;
      color: #4f618f;
      padding: 0 20px 20px;
      border-bottom: @border-common;
    }
    &-box {
      height: calc(100% - 42px);
    }
    ::v-deep .el-card__body,
    .el-main {
      padding: 20px 0;
      height: 100%;
      box-sizing: border-box;
    }
  }
  ::v-deep .el-input__inner {
    padding: 0 10px;
  }
}
</style>
