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
import widget from "../components/temp";
export default {
  name: "preview",
  components: {
    widget,
  },
  data() {
    return {
      bigScreenStyle: {},
      // 大屏设计数据
      dashboard: {
        id: null,
        title: "", //大屏标题
        width: null, // 大屏设计宽度
        height: null, // 大屏设计高度
        description: "", // 大屏描述
        backgroundColor: "", // 大屏背景色
        backgroundImage: "", // 大屏背景图片
        presetLine: [], // 辅助线
        presetLineVisible: true, // 辅助线是否显示
      },
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
      // let data = {
      //   user_id: this.$route.query.user_id,
      //   user_password: this.$route.query.user_password,
      //   url: this.$route.query.url,
      //   interface_code: this.$route.query.interface_code,
      // };
      this.$axios({
        method: "get",
        url: "/G/interfaceService/serviceuser/impl/showReleaseDashboard",
        params: this.$route.query,
        header: {
          "Access-Control-Allow-Origin": "*", //允许跨域
        },
      }).then((res) => {
        if (res.data.code === 999) {
          this.dashboard = res.data.data.dashboard;
          this.widgets = res.data.data.widget;
          console.log(this.dashboard);
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
        }
      });
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
