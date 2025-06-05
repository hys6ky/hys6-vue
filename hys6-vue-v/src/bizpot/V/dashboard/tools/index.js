import { widgetBarchart } from "./configure/barCharts/widget-barchart";
import { widgetBarpolarchart } from "./configure/barCharts/widget-bar-polar";
import { widgetBarStack } from "./configure/barCharts/widget-bar-stack";
import { widgetLinechart } from "./configure/lineCharts/widget-linechart";
import { widgetLineStack } from "./configure/lineCharts/widget-line-stack";
import { widgetPiechart } from "./configure/pieCharts/widget-piechart";
import { widgetPieNightingale } from "./configure/pieCharts/widget-pie-nightingale";
import { widgetScatterchart } from "./configure/scatterCharts/widget-scatterchart";
import { widgetTable } from "./configure/texts/widget-table";
import { widgetBarlinechart } from "./configure/barlineCharts/widget-barlinechart";
import { widgetBarLineStack } from "./configure/barlineCharts/widget-bar-line-stack";
import { widgetText } from "./configure/texts/widget-text";
import { widgetBorder } from "./configure/styleWidget/widget-border";
import { widgetDecorateFlowLine } from "./configure/styleWidget/widget-decorate-flow-line";
import { widgetTreemapchart } from "./configure/treemapChart/widget-treemapchart";

export const widgetTools = [
  {
    label: "静态数据",
    list: [widgetText, widgetBorder, widgetDecorateFlowLine],
  },
  {
    label: "动态数据",
    list: [],
  },
];
const widgetToolsStatic = [widgetText, widgetBorder, widgetDecorateFlowLine];
export const widgetToolsDynamic = [
  widgetBarchart,
  widgetBarpolarchart,
  widgetBarStack,
  widgetLinechart,
  widgetLineStack,
  widgetPiechart,
  widgetPieNightingale,
  widgetScatterchart,
  widgetTable,
  widgetBarlinechart,
  widgetBarLineStack,
  widgetTreemapchart,
];
const screenConfig = {
  code: "screen",
  type: "screen",
  label: "大屏设置",
  icon: "",
  options: {
    setup: [
      {
        type: "el-input-number",
        label: "大屏宽度",
        name: "width",
        required: false,
        placeholder: "px",
        value: "1920",
      },
      {
        type: "el-input-number",
        label: "大屏高度",
        name: "height",
        required: false,
        placeholder: "px",
        value: "1080",
      },
      {
        type: "el-input-text",
        label: "标题",
        name: "title",
        require: false,
        placeholder: "",
        value: "大屏",
      },
      {
        type: "el-input-textarea",
        label: "大屏简介",
        name: "description",
        required: false,
        placeholder: "",
        value: "",
      },
      {
        type: "vue-color",
        label: "背景颜色",
        name: "backgroundColor",
        required: false,
        placeholder: "",
        value: "#1E1E1E",
      },
      {
        type: "el-select",
        label: "主题背景",
        name: "backgroundImage",
        required: false,
        placeholder: "",
        value: "",
        selectOptions: [
          { code: "screen-bg1", name: "背景一" },
          { code: "screen-bg2", name: "背景二" },
          { code: "screen-bg3", name: "背景三" },
          { code: "screen-bg4", name: "背景四" },
          { code: "screen-bg5", name: "背景五" },
          { code: "screen-bg6", name: "背景六" },
          { code: "screen-bg7", name: "背景七" },
          { code: "screen-bg8", name: "背景八" },
          { code: "screen-bg9", name: "背景九" },
          { code: "screen-bg10", name: "背景十" },
        ],
      },
    ],
    data: [],
    position: [],
  },
};
export const getToolByCode = (code) => {
  // 获取大屏底层设置属性
  if (code == "screen") {
    return screenConfig;
  }
  // 获取组件
  const toolList = [...widgetToolsStatic, ...widgetToolsDynamic];
  return toolList.find((item) => item.code === code);
};
