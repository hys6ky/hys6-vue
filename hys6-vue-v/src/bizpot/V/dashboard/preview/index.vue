<template>
  <div class="preview">
    <div :style="bigScreenWrapStyle">
      <div :style="bigScreenStyle">
        <widget
          v-for="(widget, index) in widgets"
          :key="index"
          v-model="widget.value"
          :type="widget.type"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { dashboard, widgersPreview } from "../mock";
import widget from "../components/temp";
export default {
  name: "preview",
  components: {
    widget,
  },
  data() {
    return {
      bigScreenStyle: {},
      dashboard,
      widgets: [],
      ratioEquipment: 1,
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    bigScreenWrapStyle() {
      return {
        width: this.dashboard.width * this.ratioEquipment + "px",
        height: this.dashboard.height * this.ratioEquipment + "px",
      };
    },
  },
  methods: {
    getData() {
      if(this.$route.query.type === "add"){
        console.log(localStorage.getItem('viewDataPro'),'gggggg')
        this.widgets = localStorage.getItem('viewDataPro');
      }else {
        let data = {
          dashboard_id:this.$route.query.id
        }
        this.$executeRequest.execGetByPostModuleUrl('/dashboardList/gainDashboardData', data).then(res => {
          this.dashboard = res.data.dashboard
          this.widgets = res.data.widget
          // this.bigScreenStyle = res.data.bigScreenStyle
          const equipment = document.body.clientWidth;
          const ratioEquipment = equipment / this.dashboard.width;
          this.ratioEquipment = ratioEquipment;
          this.bigScreenStyle = {
            width: this.dashboard.width + "px",
            height: this.dashboard.height + "px",
            "background-color": this.dashboard.backgroundColor,
            "background-image": this.dashboard.backgroundImage
                ? `url(${require(`../../../../assets/images/theme/${this.dashboard.backgroundImage}.png`)}`
                : "none",
            "background-position": "0% 0%",
            "background-size": "100% 100%",
            "background-repeat": "initial",
            "background-attachment": "initial",
            "background-origin": "initial",
            "background-clip": "initial",
            transform: `scale(${ratioEquipment}, ${ratioEquipment})`,
            "transform-origin": "0 0",
          };
        })
      }
    },
  },
};
</script>

<style lang="less" scoped>
.preview {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
<style>
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
