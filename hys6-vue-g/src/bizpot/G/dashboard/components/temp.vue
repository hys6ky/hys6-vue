<template>
  <div>
    <component :is="type" :value="value" :ispreview="true" />
  </div>
</template>

<script>
import widgetText from "../widget/texts/widgetText.vue";
import widgetTable from "../widget/texts/widgetTable.vue";
import widgetBarchart from "../widget/bar/widgetBarchart.vue";
import widgetBarpolarchart from "../widget/bar/widgetBarpolarchart.vue";
import WidgetStackchart from "../widget/bar/widgetBarStackChart.vue";
import widgetLinechart from "../widget/line/widgetLinechart.vue";
import WidgetLineStackChart from "../widget/line/widgetLineStackChart.vue";
import widgetBarlinechart from "../widget/barline/widgetBarlinechart";
import widgetBarLineStackChart from "../widget/barline/widgetBarLineStackChart.vue";
import WidgetPiechart from "../widget/pie/widgetPiechart.vue";
import WidgetPieNightingaleRoseArea from "../widget/pie/widgetPieNightingaleRose.vue";
import WidgetScatterchart from "../widget/scatter/widgetScatterchart.vue";
import WidgetTreemapchart from "../widget/treemap/widgetTreemap.vue";
import widgetBorder from "../widget/styleWidget/widgetBorder.vue";
import widgetDecorateFlowLine from "../widget/styleWidget/widgetDecorateFlowLine.vue";

export default {
  name: "WidgetTemp",
  components: {
    widgetText,
    widgetTable,
    widgetBarchart,
    widgetBarpolarchart,
    WidgetStackchart,
    widgetLinechart,
    WidgetLineStackChart,
    widgetBarlinechart,
    widgetBarLineStackChart,
    WidgetPiechart,
    WidgetPieNightingaleRoseArea,
    WidgetScatterchart,
    WidgetTreemapchart,
    widgetBorder,
    widgetDecorateFlowLine,
  },
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    type: String,
    value: {
      type: [Object],
      default: () => {},
    },
  },
};
</script>
