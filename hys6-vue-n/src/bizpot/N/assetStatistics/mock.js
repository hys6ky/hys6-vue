export const headerData = [
  {
    title: "资产目录项",
    num: "18",
    unit: "项",
    icon: "iconfont icon-mulu"
  },
  {
    title: "有效资产目录项",
    num: "7",
    unit: "项",
    icon: "iconfont icon-shouye"
  },
  {
    title: "数据资产总量",
    num: "11",
    unit: "个",
    icon: "iconfont icon-zhibiaoguanli"
  },
  {
    title: "目录资源提供单位",
    num: "7",
    unit: "个",
    icon: "iconfont icon-danwei"
  }
]
export const options = [
  {
    label: "2021数据产品目录",
    value: "0"
  }
];
export const chartOneBar =  {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    formatter: function (params,value) {
      const filter = params.filter(item => item.value !== '-')
      return `${filter[0].marker}${filter[0].seriesName}: ${filter[0].value}`
    },
  },
  legend: {
    top: '30',
    left: 'center',
    data:['不予共享', '有条件共享', '无条件共享'],
    textStyle:{
      color:"#C0C9D7"
    }
  },
  grid: {
    left: '10%',
    right: '20%',
    bottom: '3%',
    top:"30%",
    containLabel: true
  },
  xAxis: {
    name: "资产提供方",
    type: 'category',
    data:['不予共享', '有条件共享', '无条件共享'],
    axisLine: {
      lineStyle: {
        color: "#C0C9D7",
        width: 2
      }
    },
    axisTick: {
      show: false
    },
  },
  yAxis: {
    name:"数量（单位：个）",
    type: 'value',
    axisLine: {
      lineStyle: {
        color: "#C0C9D7",
        width: 2,
      }
    },
    splitLine :{
      lineStyle:{
          type:'dashed'//虚线
      },
      show: true //隐藏
    }
  },
  series: [
    {
      name: '不予共享',
      color:"#51D7CB",
      type: 'bar',
      stack: 'Total',
      data: [1, '-', '-']
    },
    {
      name: '有条件共享',
      type: 'bar',
      stack: 'Total',
      color:"#38B5F2",
      data: ['-', 7, '-']
    },
    {
      name: '无条件共享',
      type: 'bar',
      stack: 'Total',
      color:"#758EFF",
      data: ['-', '-', 11]
    }
  ]
}
export const chartFourBar = {
  grid: {
    left: '10%',
    right: '20%',
    bottom: '3%',
    top:"30%",
    containLabel: true
  },
  tooltip:{
    show:true,
  },
  legend:{
    show:true,
    top:30,
    textStyle:{
      color:"#C0C9D7"
    }
  },
  xAxis: {
    name: "资产类型",
    type: 'category',
    data:['产品','接口'],
    axisLine: {
      lineStyle: {
        color: "#C0C9D7",
        width: 2
      }
    },
    axisTick: {
      show: false
    },
  },
  yAxis: {
    name:"数量（单位：个）",
    type: 'value',
    axisLine: {
      lineStyle: {
        color: "#C0C9D7",
        width: 2,
      }
    },
    splitLine :{
      lineStyle:{
          type:'dashed'//虚线
      },
      show: true //隐藏
    }
  },
  series: [
    {
      name:"资产目录个数",
      color:"#51D7CB",
      data: [11,7],
      type: 'bar'
    },
    {
      name:"资源较量",
      color: '#38B5F2',
      data: [11,3],
      type: 'bar'
    },
  ]
}
export const chartThreePie = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '20',
    left: '20',
    orient:"vertical",
    textStyle:{
      color:"#C0C9D7"
    }
  },
  series: [
    {
      type: 'pie',
      top:'10%',
      radius: ['55%', '80%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
      },
      labelLine: {
        show: true
      },
      data: [
        { value: 70, name: '已上架',labelLine:{
          lineStyle:{
            color:"#51D7CB"
          },
        },
        itemStyle:{
            color:"#51D7CB"
          }
        },
        { value: 29, name: '未上架' ,labelLine:{
          lineStyle:{
            color:"#38B5F2"
          },
        },
        itemStyle:{
            color:"#38B5F2"
          }},
        { value: 1, name: '审批中',labelLine:{
          lineStyle:{
            color:"#758EFF"
          },
        },
        itemStyle:{
            color:"#758EFF"
          } },
      ]
    }
  ]
};
export const chartTwoLine ={
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top: '30',
    left: 'center',
    data: ['资产增加', '资产删除'],
    textStyle:{
      color:"#C0C9D7"
    }
  },
  grid: {
    left: '10%',
    right: '20%',
    bottom: '3%',
    top:"30%",
    containLabel: true
  },
  xAxis: {
    name:"月份",
    type: 'category',
    boundaryGap: false,
    data: ['2023-07'],
    axisLine: {
      lineStyle: {
        color: "#C0C9D7",
        width: 2
      }
    },
    axisTick: {
      show: false
    },
  },
  yAxis: {
    name:"变化量（单位：次）",
    type: 'value',
    axisLine: {
      lineStyle: {
        color: "#C0C9D7",
        width: 2,
      }
    },
    splitLine :{
      lineStyle:{
          type:'dashed'//虚线
      },
      show: true //隐藏
    }
  },
  series: [
    {
      name: '资产增加',
      type: 'line',
      stack: 'Total',
      symbolSize:10,
      itemStyle:{
        color:"#51D7CB"
      },
      data: []
    },
    {
      name: '资产删除',
      type: 'line',
      stack: 'Total',
      symbolSize:10,
      itemStyle:{
        color:"#38B5F2"
      },
      data: [1],
    },
  ]
}