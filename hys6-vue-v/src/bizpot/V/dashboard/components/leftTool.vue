<template>
  <div
    v-if="toolIsShow"
    class="layout-left"
    :style="{ width: widthLeftForTools + 'px' }"
  >
    <el-tabs class="layout-left" type="border-card" :stretch="true">
      <el-tab-pane label="工具栏">
        <span slot="label"><i class="el-icon-date icon"></i>工具栏</span>
        <div class="chart-type">
          <div v-for="(item, index) in widgetTools" :key="index">
            <div class="chart-label">
              <span>{{ item.label }}</span>
              <el-button
                type="text"
                v-if="index !== 0"
                size="medium"
                class="addBtn"
                @click="getVisualComponentInfo"
              >
                添加
              </el-button>
            </div>
            <div
              v-for="(tool, num) in item.list"
              :key="num"
              class="tools-item"
              draggable="true"
              @dragstart="dragStart(tool, $event)"
              @dragend="dragend"
            >
              <div class="tools-item-icon">
                <i :class="tool.icon"></i>
              </div>
              <div class="tools-item-text">{{ tool.label }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="图层">
        <span slot="label">图层</span>
        <div class="chart-type">
          <div
            class="tools-item"
            v-for="(item, index) in layerList"
            :key="index"
            :class="item.widgetId === currentId ? 'isActive' : ''"
            @click="$emit('changeCurrentId', item.widgetId)"
          >
            <div class="tools-item-icon">
              <i :class="item.icon"></i>
            </div>
            <div class="tools-item-text">{{ item.titleTxt }}</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <ByModel
      :visible.sync="visible"
      :modelTitle="modelTitle"
      modelWidth="960px"
      @close="visible = false"
      @closed="dialogClosed"
    >
      <ByTable
        :tableData="tableData"
        :columnArr="columnArr"
        ref="componentList"
        @handleMultiple="handleSelectionColumn"
      ></ByTable>
      <template slot="modalFoot">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="getLeftComponentInfo" v-debounce>
          保存
        </el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import { widgetTools, widgetToolsDynamic } from "../tools/index";
import { columnArr } from "../mock";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "LeftTool",
  props: {
    toolIsShow: {
      type: Boolean,
      default: true,
    },
    widthLeftForTools: {
      type: Number,
      default: 200,
    },
    widthLeftForToolsHideButton: {
      type: Number,
      default: 15,
    },
    layerList: {
      type: Array,
      default: [],
    },
    currentId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      widgetTools: JSON.parse(JSON.stringify(widgetTools)), // 左侧工具栏的组件图标，将js变量加入到当前作用域
      widgetToolsDynamic: JSON.parse(JSON.stringify(widgetToolsDynamic)),
      visible: false,
      modelTitle: "添加组件",
      columnArr,
      tableData: [],
      tableDataFilter: [],
    };
  },
  mounted() {
    // console.log(this.widgetTools)
    // this.getL,eftComponentInfo();
  },
  methods: {
    //获取所有组件
    getVisualComponentInfo() {
      const params = {
        currPage: 1,
        pageSize: 99999,
      };
      this.$executeRequest
        .execGetByModuleUrl(
          "/dataVisualization/operate/getVisualComponentInfo",
          params
        )
        .then((res) => {
          if (res && res.success) {
            this.tableData = res.data.visualCompList.map((item) => {
              item.checked = false;
              this.tableDataFilter.map((opt) => {
                if (item.component_id === opt.component_id) {
                  item.checked = true;
                }
              });
              return {
                component_id: item.component_id,
                component_name: item.component_name,
                component_desc: item.component_desc,
                checked: item.checked,
              };
            });
            this.visible = true;
            this.$nextTick(() => {
              if (this.tableDataFilter.length === 0) {
                this.$refs.componentList.$refs.byTable.clearSelection();
                return;
              }
              this.tableData.forEach((row) => {
                if (row.checked) {
                  this.$refs.componentList.$refs.byTable.toggleRowSelection(
                    row,
                    true
                  );
                }
              });
            });
          }
        });
    },
    handleSelectionColumn(val) {
      val.map((item) => {
        item.checked = true;
      });
      this.tableDataFilter = val;
    },
    getLeftComponentInfo() {
      const params = this.tableDataFilter
        .filter((item) => item.checked)
        .map((item) => item.component_id);
      this.$executeRequest
        .execPostByModuleUrl(
          "/dataVisualization/operate/showComponentData",
          params
        )
        .then((res) => {
          this.widgetTools[1].list = [];
          params.map((item) => {
            const result = res.data[item];
            // console.log(result);
            switch (result.chart_type) {
              case "stackingbar":
              case "bar":
                this.stackingbarRender(result);
                break;
              case "line":
                this.stackinglineRender(result);
                break;
              case "pie":
                this.pieRender(result);
                break;
              case "scatter":
                this.scatterRender(result);
                break;
              case "table":
                this.tableRender(result);
                break;
              case "blsimple":
                this.barLineSimpleRender(result);
                break;
              case "bl":
                this.barLineStackRender(result);
                break;
              case "treemap":
                this.treemapRender(result);
                break;
              case "polarbar":
                this.polarbarRender(result);
                break;
              case "fasanpie":
                this.rosepieRender(result);
                break;
              case "huanpie":
                this.huanpieRender(result);
                break;
            }
          });
          this.visible = false;
        });
    },
    dialogClosed() {
      this.tableData = [];
      // this.tableDataFilter = [];
    },
    //堆叠柱图数据整理
    stackingbarRender(result) {
      const obj = JSON.parse(
        JSON.stringify(
          this.widgetToolsDynamic.find(
            (tool) => tool.code === "widget-stackchart"
          )
        )
      );
      obj.options.setup[0].value = result.chart_theme;
      const optlist = obj.options.setup[4].map((opt) => opt.list).flat();
      const a = optlist.find((opt) => opt.name === "legendName");
      const titletext = optlist.find((opt) => opt.name === "titleText");
      a.value = result.legend_data.join("|");
      titletext.value = result.chart_title;
      obj.label = result.chart_theme;
      obj.options.data = {
        xAxis: result.xArray,
        series: result.seriesArray.map((v) => ({
          name: v.name,
          data: v.data,
          type: v.type,
        })),
      };
      this.widgetTools[1].list.push(obj);
    },
    //折线堆叠图数据整理
    stackinglineRender(result) {
      const obj = JSON.parse(
        JSON.stringify(
          this.widgetToolsDynamic.find(
            (tool) => tool.code === "widgetLineStackChart"
          )
        )
      );
      obj.options.setup[0].value = result.chart_theme;
      const optlist = obj.options.setup[3].map((opt) => opt.list).flat();
      const a = optlist.find((opt) => opt.name === "legendName");
      const titletext = optlist.find((opt) => opt.name === "titleText");
      a.value = result.legend_data.join("|");
      titletext.value = result.chart_title;
      obj.label = result.chart_theme;
      obj.options.data = {
        xAxis: result.xArray,
        series: result.seriesArray.map((v) => ({
          name: v.name,
          data: v.data,
          type: v.type,
        })),
      };
      this.widgetTools[1].list.push(obj);
    },
    //饼图数据整理
    pieRender(result) {
      const obj = JSON.parse(
        JSON.stringify(
          this.widgetToolsDynamic.find(
            (tool) => tool.code === "widget-piechart"
          )
        )
      );
      obj.options.setup[0].value = result.chart_theme;
      obj.label = result.chart_theme;
      const optlist = obj.options.setup[3].map((opt) => opt.list).flat();
      const titletext = optlist.find((opt) => opt.name === "titleText");
      titletext.value = result.chart_title;
      (obj.options.data = result.seriesArray.map((v) => v.data).flat()),
        this.widgetTools[1].list.push(obj);
    },
    //环形图数据整理
    huanpieRender(result) {
      const obj = JSON.parse(
        JSON.stringify(
          this.widgetToolsDynamic.find(
            (tool) => tool.code === "widget-piechart"
          )
        )
      );
      obj.options.setup[0].value = result.chart_theme;
      obj.options.setup[2].value = "kongxin";
      obj.label = result.chart_theme;
      const optlist = obj.options.setup[3].map((opt) => opt.list).flat();
      const titletext = optlist.find((opt) => opt.name === "titleText");
      titletext.value = result.chart_title;
      (obj.options.data = result.seriesArray.map((v) => v.data).flat()),
        this.widgetTools[1].list.push(obj);
    },
    //玫瑰图数据整理
    rosepieRender(result) {
      const obj = JSON.parse(
        JSON.stringify(
          this.widgetToolsDynamic.find(
            (tool) => tool.code === "WidgetPieNightingaleRoseArea"
          )
        )
      );
      obj.options.setup[0].value = result.chart_theme;
      obj.label = result.chart_theme;
      const optlist = obj.options.setup[3].map((opt) => opt.list).flat();
      const titletext = optlist.find((opt) => opt.name === "titleText");
      titletext.value = result.chart_title;
      (obj.options.data = result.seriesArray.map((v) => v.data).flat()),
        this.widgetTools[1].list.push(obj);
    },
    //散点图数据整理
    scatterRender(result) {
      const obj = JSON.parse(
        JSON.stringify(
          this.widgetToolsDynamic.find(
            (tool) => tool.code === "widget-scatterchart"
          )
        )
      );
      obj.options.setup[0].value = result.chart_theme;
      obj.label = result.chart_theme;
      const series = {
        data: result.scatterData,
        type: result.chart_type,
        name: result.legend_data[0],
      };
      obj.options.data.push(series);
      const optlist = obj.options.setup[2].map((opt) => opt.list).flat();
      const a = optlist.find((opt) => opt.name === "legendName");
      const titletext = optlist.find((opt) => opt.name === "titleText");
      a.value = result.legend_data.join("|");
      titletext.value = result.chart_title;
      this.widgetTools[1].list.push(obj);
    },
    //表格数据整理
    tableRender(result) {
      const obj = JSON.parse(
        JSON.stringify(
          this.widgetToolsDynamic.find((tool) => tool.code === "widget-table")
        )
      );
      obj.options.setup[0].value = result.chart_theme;
      obj.label = result.chart_theme;
      obj.options.data = result.tableData.map((item, index) => {
        item.index = index + 1;
        return item;
      });
      const column = obj.options.setup.find(
        (opt) => opt.name === "dynamicAddTable"
      );
      const columnList = result.columns.map((v) => ({
        name: v,
        key: v,
        width: "50%",
      }));
      columnList.unshift({
        name: "序号",
        key: "index",
        width: "50%",
      });
      column.value = columnList;
      this.widgetTools[1].list.push(obj);
    },
    //柱线图数据整理
    barLineSimpleRender(result) {
      const obj = JSON.parse(
        JSON.stringify(
          this.widgetToolsDynamic.find(
            (tool) => tool.code === "widget-barlinechart"
          )
        )
      );
      obj.options.setup[0].value = result.chart_theme;
      obj.label = result.chart_theme;
      obj.options.data = {
        xAxis: result.xAxisData,
        series: [
          {
            name: result.series1Name,
            data: result.series1Data,
            type: "bar",
          },
          {
            name: result.series2Name,
            data: result.series2Data,
            type: "line",
          },
        ],
      };
      const a = obj.options.setup[2]
        .map((opt) => opt.list)
        .flat()
        .find((opt) => opt.name === "legendName");
      a.value = [result.series1Name, result.series2Name].join("|");
      this.widgetTools[1].list.push(obj);
    },
    //柱线图数据整理
    barLineStackRender(result) {
      const obj = JSON.parse(
        JSON.stringify(
          this.widgetToolsDynamic.find(
            (tool) => tool.code === "widgetBarLineStackChart"
          )
        )
      );
      obj.options.setup[0].value = result.chart_theme;
      obj.label = result.chart_theme;
      const optlist = obj.options.setup[2].map((opt) => opt.list).flat();
      const a = optlist.find((opt) => opt.name === "legendName");
      const titletext = optlist.find((opt) => opt.name === "titleText");
      a.value = result.legend_data.join("|");
      titletext.value = result.chart_title;
      const allBar = result.seriesArray.every((v) => v.type === "bar");
      if (allBar) {
        const rightY = obj.options.setup[2]
          .map((opt) => opt.list)
          .flat()
          .find((opt) => opt.name === "isShowYRight");
        rightY.value = false;
      }
      obj.options.data = {
        xAxis: result.xArray,
        series: result.seriesArray.map((v) => ({
          name: v.name,
          data: v.data,
          type: v.type,
        })),
      };
      this.widgetTools[1].list.push(obj);
    },
    //矩形柱图
    treemapRender(result) {
      const obj = JSON.parse(
        JSON.stringify(
          this.widgetToolsDynamic.find(
            (tool) => tool.code === "widget-treemapchart"
          )
        )
      );
      obj.options.setup[0].value = result.chart_theme;
      obj.label = result.chart_theme;
      obj.options.data = result.seriesData;
      const optlist = obj.options.setup[2].map((opt) => opt.list).flat();
      const titletext = optlist.find((opt) => opt.name === "titleText");
      titletext.value = result.chart_title;
      this.widgetTools[1].list.push(obj);
    },
    //极坐标柱图
    polarbarRender(result) {
      const obj = JSON.parse(
        JSON.stringify(
          this.widgetToolsDynamic.find(
            (tool) => tool.code === "widget-barpolarchart"
          )
        )
      );
      obj.options.setup[0].value = result.chart_theme;
      obj.label = result.chart_theme;
      const optlist = obj.options.setup[2].map((opt) => opt.list).flat();
      const a = optlist.find((opt) => opt.name === "legendName");
      const titletext = optlist.find((opt) => opt.name === "titleText");
      a.value = result.legend_data.join("|");
      titletext.value = result.chart_title;
      obj.options.data = {
        radiusAxis: result.xArray,
        series: result.seriesArray,
      };
      this.widgetTools[1].list.push(obj);
    },
    dragStart(item, e) {
      const transferData = {
        type: item.code,
        value: {
          setup: Object.assign({}, this.getOptionsValue(item.options.setup), {
            widgetCode: item.code,
            widgetId: uuidv4(),
          }),
          data: item.options.data,
          position: Object.assign(
            {},
            this.getOptionsValue(item.options.position)
          ),
        },
      };
      e.dataTransfer.setData("initChart", JSON.stringify(transferData));
    },
    dragend(event) {
      event.dataTransfer.clearData();
    },
    getOptionsValue(options, obj = {}) {
      options.map((item) => {
        if (Object.prototype.toString.call(item) === "[object Object]") {
          if (item.list) {
            this.getOptionsValue(item.list, obj);
          } else {
            obj[item.name] = item.value;
          }
        } else {
          this.getOptionsValue(item, obj);
        }
      });
      return obj;
    },
  },
};
</script>

<style lang="less" scoped>
.layout-left {
  width: 200px;
  background: #242a30;
  overflow-x: hidden;
  overflow-y: auto;
  .chart-type {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .chart-label {
      font-size: 14px;
      line-height: 36px;
      font-weight: bold;
      text-align: center;
    }
    .type-left {
      width: 100%;
      height: calc(100vh - 80px);
      text-align: center;
      /deep/.el-tabs__header {
        width: 30%;
        margin-right: 0;

        .el-tabs__nav-wrap {
          &::after {
            background: transparent;
          }

          .el-tabs__item {
            text-align: center;
            width: 100% !important;
            color: #fff;
            padding: 0;
            font-size: 12px !important;
          }
        }
      }

      /deep/.el-tabs__content {
        width: 70%;
      }
    }
    .addBtn {
      margin-left: 10px;
      position: absolute;
    }
  }
  //工具栏一个元素
  .tools-item {
    display: flex;
    position: relative;
    width: 100%;
    height: 48px;
    align-items: center;
    -webkit-box-align: center;
    padding: 0 6px;
    cursor: pointer;
    font-size: 12px;
    margin-bottom: 1px;
    .tools-item-icon {
      color: #409eff;
      margin-right: 10px;
      width: 53px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      display: block;
      border: 1px solid #3a4659;
      background: #282a30;
      margin-left: 38px;
    }
  }
  /deep/.el-tabs__content {
    padding: 0;
  }
  .isActive {
    background: #31455d !important;
    color: #bfcbd9 !important;
  }
}
</style>
