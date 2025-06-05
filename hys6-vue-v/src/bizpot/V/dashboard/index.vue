<template>
  <div class="screenDesign">
    <LeftTool
      :toolIsShow="toolIsShow"
      :widthLeftForTools="widthLeftForTools"
      :widthLeftForToolsHideButton="widthLeftForToolsHideButton"
      :layerList="layerList"
      :currentId="currentId"
      @changeCurrentId="changeCurrentId"
    ></LeftTool>
    <div
      class="layout-left-fold"
      :style="{ width: widthLeftForToolsHideButton + 'px' }"
      @click="toolIsShow = !toolIsShow"
    >
      <i class="el-icon-arrow-right" />
    </div>
    <div
      class="layout-middle"
      :style="{ width: middleWidth + 'px', height: middleHeight + 'px' }"
    >
      <!-- 头部工具栏 -->
      <div class="top-button">
        <span class="btn" @click="$router.go(-1)">
          <el-tooltip
            class="item"
            effect="dark"
            content="返回上一页"
            placement="bottom"
          >
            <i class="el-icon-back"></i>
          </el-tooltip>
        </span>
        <span class="btn" @click="saveData">
          <el-tooltip
            class="item"
            effect="dark"
            content="保存"
            placement="bottom"
          >
            <i class="el-icon-s-management"></i>
          </el-tooltip>
        </span>
        <span class="btn" @click="viewScreen">
          <el-tooltip
            class="item"
            effect="dark"
            content="预览"
            placement="bottom"
          >
            <i class="el-icon-view"></i>
          </el-tooltip>
        </span>
        <span class="btn" @click="handleUndo">
          <el-tooltip
            class="item"
            effect="dark"
            content="撤销"
            placement="bottom"
          >
            <i class="el-icon-refresh-left"></i>
          </el-tooltip>
        </span>
        <span class="btn" @click="handleRedo">
          <el-tooltip
            class="item"
            effect="dark"
            content="恢复"
            placement="bottom"
          >
            <i class="el-icon-refresh-right"></i>
          </el-tooltip>
        </span>
        <span
          :class="{
            btn: true,
            'btn-disable': currentSizeRangeIndex === 0,
          }"
          @click="setSize(0)"
        >
          <el-tooltip
            class="item"
            :disabled="currentSizeRangeIndex === 0"
            effect="dark"
            content="缩小"
            placement="bottom"
          >
            <i class="el-icon-minus" style="font-size: 16px" />
          </el-tooltip>
        </span>
        <span
          :class="{
            btn: true,
            'scale-num': true,
            'btn-disable': currentSizeRangeIndex === defaultSize.index,
          }"
          @click="setSize(2)"
        >
          <el-tooltip
            class="item"
            :disabled="currentSizeRangeIndex === defaultSize.index"
            effect="dark"
            content="默认比例"
            placement="bottom"
          >
            <span> {{ parseInt(scaleNum) }}% </span>
          </el-tooltip>
        </span>
        <span
          :class="{
            btn: true,
            'btn-disable': currentSizeRangeIndex === 8,
          }"
          @click="setSize(1)"
        >
          <el-tooltip
            class="item"
            :disabled="currentSizeRangeIndex === 8"
            effect="dark"
            content="放大"
            placement="bottom"
          >
            <i class="el-icon-plus" style="font-size: 16px" />
          </el-tooltip>
        </span>
      </div>
      <div class="workbench-container">
        <div
          :style="{
            width: (+bigscreenWidth + 18) * bigscreenScaleInWorkbench + 'px',
            height: (+bigscreenHeight + 18) * bigscreenScaleInWorkbench + 'px',
          }"
        >
          <!-- 大屏设计页面的标尺插件 -->
          <vue-ruler-tool
            ref="vue-ruler-tool"
            v-model="dashboard.presetLine"
            class="vueRuler"
            :step-length="50"
            :parent="true"
            :position="'relative'"
            :is-scale-revise="true"
            :visible.sync="dashboard.presetLineVisible"
            :style="{
              width: +bigscreenWidth + 18 + 'px',
              height: +bigscreenHeight + 18 + 'px',
              transform:
                currentSizeRangeIndex === defaultSize.index
                  ? workbenchTransform
                  : `scale(${sizeRange[currentSizeRangeIndex] / 100})`,
              transformOrigin: '0 0',
            }"
          >
            <div
              id="workbench"
              class="workbench"
              :style="{
                width: bigscreenWidth + 'px',
                height: bigscreenHeight + 'px',
                'background-color': dashboard.backgroundColor,
                'background-image': dashboard.backgroundImage
                  ? `url(${require(`../../../assets/images/theme/${dashboard.backgroundImage}.png`)}`
                  : 'none',
              }"
              @click.self="setOptionsOnClickScreen"
              @drop="widgetOnDragged"
              @dragover="dragOver($event)"
              @dragenter.prevent
              @dragover.prevent
            >
              <div v-if="grade" class="bg-grid"></div>
              <widget
                ref="widgets"
                v-for="(widget, index) in widgets"
                :key="index"
                v-model="widget.value"
                :index="index"
                :step="step"
                :type="widget.type"
                :bigscreen="{ bigscreenWidth, bigscreenHeight }"
                @onActivated="setOptionsOnClickWidget"
                @contextmenu.prevent.native="rightClick($event, index)"
                @mousedown.prevent.native="widgetsClick(index)"
                @mouseup.prevent.native="grade = false"
              />
            </div>
          </vue-ruler-tool>
        </div>
      </div>
    </div>
    <RightTool
      :widthLeftForOptions="widthLeftForOptions"
      :activeName.sync="activeName"
      :widgetOptions="widgetOptions"
      :screenCode="screenCode"
      :dashboard="dashboard"
      :layerValue="layerValue"
      :layerPosition="layerPosition"
      @changeDashboard="changeDashboard"
      @changeTab="changeTab"
    ></RightTool>
    <!-- 右键菜单 -->
    <content-menu
      :visible.sync="visibleContentMenu"
      :style-obj="styleObj"
      :widgets="widgets"
      :rightClickIndex="rightClickIndex"
      @clickScreen="setOptionsOnClickScreen"
    />
  </div>
</template>

<script>
import LeftTool from "./components/leftTool.vue";
import RightTool from "./components/rightTool.vue";
import contentMenu from "./components/contentMenu";
import VueRulerTool from "vue-ruler-tool"; // 大屏设计页面的标尺插件
import { dashboard, layerIcon } from "./mock";
import { getToolByCode } from "./tools/index";
import { Revoke } from "@/utils/revoke";
import widget from "./widget/widget.vue";

export default {
  name: "screenDesign",
  components: {
    LeftTool,
    VueRulerTool,
    RightTool,
    widget,
    contentMenu,
  },
  data() {
    return {
      toolIsShow: true, // 左侧工具栏是否显示
      widthLeftForTools: 200, // 左侧工具栏宽度
      widthLeftForToolsHideButton: 15, // 左侧工具栏折叠按钮宽度
      widthLeftForOptions: 300, // 右侧属性配置区
      widthPaddingTools: 18, // 工具栏的padding
      currentSizeRangeIndex: -1, // 当前是哪个缩放比分比,
      scaleNum: 0, // 当前缩放百分比的值
      sizeRange: [20, 40, 60, 80, 100, 150, 200, 300, 400], // 缩放百分比
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
      }, // 大屏设计数据
      layerValue: {}, //图层的值
      layerPosition: {}, //图层的坐标
      grade: false, // 是否显示网格
      // 当前激活组件右侧配置属性
      widgetOptions: {
        setup: [], // 配置
        data: [], // 数据
        position: [], // 坐标
      },
      screenCode: "", // 大屏的标记
      activeName: "first", // 右侧当前激活的tab
      widgets: [], // 工作区中拖放的组件
      revoke: null, //处理历史记录
      layerIcon,
      currentId: null, //当前选中图层
      /**右键菜单 */
      styleObj: {
        left: 0,
        top: 0,
      },
      rightClickIndex: -1,
      visibleContentMenu: false,
    };
  },
  computed: {
    // 左侧折叠切换时，动态计算中间区的宽度
    middleWidth() {
      let widthLeftAndRight = 0;
      if (this.toolIsShow) {
        widthLeftAndRight += this.widthLeftForTools; // 左侧工具栏宽度
      }
      widthLeftAndRight += this.widthLeftForToolsHideButton; // 左侧工具栏折叠按钮宽度
      widthLeftAndRight += this.widthLeftForOptions; // 右侧配置栏宽度

      let middleWidth = this.bodyWidth - widthLeftAndRight;
      return middleWidth;
    },
    middleHeight() {
      return this.bodyHeight;
    },
    // 初始的缩放百分比 和 下标
    defaultSize() {
      const obj = {
        index: -1,
        size: "50",
      };
      this.sizeRange.some((item, index) => {
        if (item <= 100 * this.bigscreenScaleInWorkbench) {
          obj.index = index;
          obj.size = 100 * this.bigscreenScaleInWorkbench;
        }
      });
      if (obj.index === -1) {
        obj.index = 0;
        obj.size = this.sizeRange[0];
      }
      return obj;
    },
    // 网页高度
    bodyWidth() {
      return document.documentElement.clientWidth;
    },
    // 网页宽度
    bodyHeight() {
      return document.documentElement.clientHeight;
    },
    // 设计台按大屏的缩放比例
    bigscreenScaleInWorkbench() {
      let widthScale =
        (this.middleWidth - this.widthPaddingTools) / this.bigscreenWidth;
      let heightScale =
        (this.middleHeight - this.widthPaddingTools) / this.bigscreenHeight;

      return Math.min(widthScale, heightScale);
    },
    workbenchTransform() {
      return `scale(${this.bigscreenScaleInWorkbench}, ${this.bigscreenScaleInWorkbench})`;
    },
    bigscreenWidth: {
      get() {
        return this.dashboard.width || 1920;
      },
      set(val) {
        this.dashboard.width = val;
      },
    },
    bigscreenHeight: {
      get() {
        return this.dashboard.height || 1080;
      },
      set(val) {
        this.dashboard.height = val;
      },
    },
    step() {
      return Number(100 / (this.bigscreenScaleInWorkbench * 100));
    },
    layerList() {
      return this.widgets.map((item) => {
        return {
          type: item.type,
          titleTxt: item.value.setup.layerName,
          icon: this.layerIcon.find((v) => v.type === item.type).icon,
          widgetId: item.value.setup.widgetId,
        };
      });
    },
  },
  watch: {
    defaultSize: {
      handler(val) {
        if (val !== -1) {
          this.currentSizeRangeIndex = val.index;
          this.scaleNum = val.size;
        }
      },
      immediate: true,
    },
    bigscreenWidth() {
      this.initVueRulerTool();
    },
    bigscreenHeight() {
      this.initVueRulerTool();
    },
    widgets: {
      handler(val) {
        //以下部分是记录历史
        this.$nextTick(() => {
          this.revoke.push(this.widgets);
        });
      },
      deep: true,
    },
  },
  created() {
    this.revoke = new Revoke();
    this.getData();
  },
  mounted() {
    window.addEventListener("mouseup", () => {
      this.grade = false;
    });
    this.$nextTick(() => {
      this.setOptionsOnClickScreen();
      this.initVueRulerTool(); // 初始化 修正插件样式
    });
  },
  methods: {
    // 初始化接口数据
    async getData() {
      if (this.$route.query.type === "edit") {
        let data = {
          dashboard_id: this.$route.query.id,
        };
        this.$executeRequest
          .execGetByPostModuleUrl("/dashboardList/gainDashboardData", data)
          .then((res) => {
            this.dashboard = res.data.dashboard;
            const dashboard = res.data.dashboard;
            this.$set(
              this.dashboard,
              "backgroundImage",
              dashboard.backgroundImage
            );
            this.$set(this.dashboard, "title", dashboard.title);
            this.$set(this.dashboard, "width", dashboard.width);
            this.$set(this.dashboard, "height", dashboard.height);
            this.$set(this.dashboard, "description", dashboard.description);
            this.$set(
              this.dashboard,
              "backgroundColor",
              dashboard.backgroundColor
            );
            this.$set(this.dashboard, "id", dashboard.id);
            this.$set(this.dashboard, "presetLine", []);
            this.$set(this.dashboard, "presetLineVisible", true);
            this.widgets = res.data.widget;
          });
      } else {
        this.dashboard = dashboard;
      }
      this.bigscreenWidth = this.dashboard.width;
      this.bigscreenHeight = this.dashboard.height;
    },
    // 初始化 修正插件样式
    initVueRulerTool() {
      const vueRulerToolDom = this.$refs["vue-ruler-tool"].$el; // 操作面板 第三方插件工具
      const contentDom = vueRulerToolDom.querySelector(".vue-ruler-content");
      const vueRulerX = vueRulerToolDom.querySelector(".vue-ruler-h"); // 横向标尺
      const vueRulerY = vueRulerToolDom.querySelector(".vue-ruler-v"); // 纵向标尺
      contentDom.style.width = "100%";
      contentDom.style.height = "100%";
      let xHtmlContent = "";
      let yHtmlContent = "";
      let currentNum = 0;
      while (currentNum < +this.bigscreenWidth) {
        xHtmlContent += `<span class="n" style="left: ${
          currentNum + 2
        }px;">${currentNum}</span>`;
        currentNum += 50;
      }
      currentNum = 0;
      while (currentNum < +this.bigscreenHeight) {
        yHtmlContent += `<span class="n" style="top: ${
          currentNum + 2
        }px;">${currentNum}</span>`;
        currentNum += 50;
      }
      vueRulerX.innerHTML = xHtmlContent;
      vueRulerY.innerHTML = yHtmlContent;
    },
    // 保存大屏设计数据
    saveData() {
      if (this.$route.query.type !== "edit" && this.dashboard.title) {
        const params = {
          dashboard: this.dashboard,
          widget: this.widgets,
        };
        this.$executeRequest
          .execPostByModuleUrl("/dashboardList/saveDashboardData", params)
          .then((res) => {
            this.$message.success("保存成功");
            this.$router.go(-1);
            // this.$router.push({
            //   name: "dashboardList",
            // });
          });
      } else if (this.$route.query.type === "edit" && this.dashboard.title) {
        let dataEdit = {
          widget: this.widgets,
          dashboard: {
            id: this.$route.query.id,
            user_id: this.$route.query.user_id,
            title: this.dashboard.title,
            create_date: this.$route.query.create_date,
            create_time: this.$route.query.create_time,
            dashboard_status: this.$route.query.dashboard_status,
            width: this.dashboard.width,
            height: this.dashboard.height,
            description: this.dashboard.description,
            backgroundColor: this.dashboard.backgroundColor,
            backgroundImage: this.dashboard.backgroundImage,
            presetLine: [],
            presetLineVisible: this.dashboard.presetLineVisible,
          },
        };
        this.$executeRequest
          .execPostByModuleUrl("/dashboardList/editDashboardData", dataEdit)
          .then((res) => {
            this.$message.success("更新成功");
            this.$router.go(-1);
            // this.$router.push({name: 'dashboardList'})
          });
      } else {
        this.$message.error("标题不能为空");
      }
    },
    // 预览大屏设计
    viewScreen() {
      if (this.$route.query.type === "add") {
        let routeUrl = this.$router.resolve({
          path: "dashboard/preview",
          query: {
            id: this.$route.query.id,
            type: this.$route.query.type,
          },
        });
        window.open(routeUrl.href, "_blank");
      } else if (this.$route.query.type === "edit") {
        let routeUrl = this.$router.resolve({
          path: "dashboard/preview",
          query: {
            id: this.$route.query.id,
          },
        });
        window.open(routeUrl.href, "_blank");
      }
    },
    // 撤销
    handleUndo() {
      const record = this.revoke.undo();
      if (!record) {
        return false;
      }
      this.widgets = record;
      this.setOptionsOnClickScreen();
    },
    // 恢复
    handleRedo() {
      const record = this.revoke.redo();
      if (!record) {
        return false;
      }
      this.widgets = record;
      this.setOptionsOnClickScreen();
    },
    /**
     * @param num: 0缩小 1放大 2默认比例
     * sizeRange: [20, 40, 60, 72, 100, 150, 200, 300, 400]
     */
    setSize(num) {
      switch (num) {
        case 0:
          this.currentSizeRangeIndex === 0
            ? ""
            : (this.currentSizeRangeIndex -= 1);
          break;
        case 1:
          this.currentSizeRangeIndex === 8
            ? ""
            : (this.currentSizeRangeIndex += 1);
          break;
        case 2:
          this.currentSizeRangeIndex = this.defaultSize.index;
      }
      this.scaleNum =
        this.currentSizeRangeIndex === this.defaultSize.index
          ? this.defaultSize.size
          : this.sizeRange[this.currentSizeRangeIndex];
    },
    //点击大屏
    setOptionsOnClickScreen() {
      this.activeName = "first";
      this.currentId = null;
      this.screenCode = "screen";
      this.widgetOptions = getToolByCode("screen")["options"];
      const draggableArr = this.$refs.widgets;
      if (draggableArr) {
        draggableArr.map((item, i) => {
          this.$refs.widgets[i].$refs.draggable.setActive(false);
        });
      }
    },
    widgetOnDragged(e) {
      const transferData = JSON.parse(e.dataTransfer.getData("initChart"));
      transferData.value.position.top =
        this.dragPositionCalculate(e).y -
        transferData.value.position.height / 2;
      transferData.value.position.left =
        this.dragPositionCalculate(e).x - transferData.value.position.width / 2;
      const index = this.widgets.length;
      transferData.value.position.index = index;
      this.widgets.push(transferData);
      // console.log(this.widgets);
      const obj = {
        height: transferData.value.position.height,
        width: transferData.value.position.width,
        top: transferData.value.position.top.toFixed(2),
        left: transferData.value.position.left.toFixed(2),
        index: transferData.value.position.index,
        widgetId: transferData.value.setup.widgetId,
      }; //选中图层
      this.$nextTick(() => {
        this.widgetsClick(transferData.value.position.index, false);
        this.setOptionsOnClickWidget(obj);
        this.currentId = transferData.value.setup.widgetId;
      });
      console.log(this.widgets, "看一下数据");
      localStorage.setItem("viewDataPro", this.widgets);
    },
    //拖拽位置计算
    dragPositionCalculate(evt) {
      // 获取结束坐标和列名
      let eventX = evt.clientX; // 结束在屏幕的x坐标
      let eventY = evt.clientY; // 结束在屏幕的y坐标
      let workbenchPosition = this.getDomTopLeftById("workbench");
      let widgetTopInWorkbench = eventY - workbenchPosition.top;
      let widgetLeftInWorkbench = eventX - workbenchPosition.left;
      const targetScale =
        this.currentSizeRangeIndex === this.defaultSize.index
          ? this.bigscreenScaleInWorkbench
          : this.sizeRange[this.currentSizeRangeIndex] / 100;
      const x = widgetLeftInWorkbench / targetScale;
      const y = widgetTopInWorkbench / targetScale;
      return {
        x,
        y,
      };
    },
    // 获取dom在屏幕中的top和left
    getDomTopLeftById(id) {
      let dom = document.getElementById(id);
      let top = 0;
      let left = 0;
      if (dom != null) {
        top = dom.getBoundingClientRect().top;
        left = dom.getBoundingClientRect().left;
      }
      return { top: top, left: left };
    },
    dragOver(e) {
      // console.log('拖拽over', e)
      this.grade = true;
    },
    //大屏配置
    changeDashboard(val) {
      this.dashboard = val;
    },
    //右侧工具tab切换
    changeTab(val) {
      this.activeName = val;
    },
    //点击某一图层
    setOptionsOnClickWidget(obj) {
      this.currentId = obj.widgetId;
      const findItem = this.widgets.find(
        (item) => item.value.setup.widgetId === obj.widgetId
      );
      // console.log(findItem.type);
      const findOptions = JSON.parse(
        JSON.stringify(getToolByCode(findItem.type)["options"])
      );
      this.getOptionsValue(findOptions.setup, findItem.value.setup);
      findItem.value.position = Object.assign(
        {},
        {
          index: obj.index,
          width: obj.width,
          height: obj.height,
          top: obj.top,
          left: obj.left,
        }
      );
      this.getOptionsValue(findOptions.position, findItem.value.position);
      this.screenCode = findItem.type;
      this.layerPosition = findItem.value.position;
      this.widgetOptions = findOptions;
      this.layerValue = findItem.value.setup;
    },
    //把图层的配置数据放到各个配置中的value中
    getOptionsValue(arr, find) {
      arr.map((item) => {
        if (Object.prototype.toString.call(item) === "[object Object]") {
          if (item.list) {
            this.getOptionsValue(item.list, find);
          } else {
            item.value = find[item.name];
          }
        } else {
          this.getOptionsValue(item, find);
        }
      });
    },
    //拖拽结束
    widgetsClick(index, grade = true) {
      const draggableArr = this.$refs.widgets;
      draggableArr.map((item, i) => {
        if (index === i) {
          // console.log(this.$refs.widgets[i].$refs.draggable)
          this.$refs.widgets[i].$refs.draggable.setActive(true);
        } else {
          this.$refs.widgets[i].$refs.draggable.setActive(false);
        }
      });
      this.grade = grade;
    },
    changeCurrentId(val) {
      this.widgets.forEach((element) => {
        if (element.value.setup.widgetId === val) {
          this.widgetsClick(element.value.position.index, false);
          const obj = Object.assign({}, element.value.position, {
            widgetId: val,
          });
          this.setOptionsOnClickWidget(obj);
        }
      });
    },
    //右键菜单
    rightClick(event, index) {
      this.rightClickIndex = index;
      const left = event.clientX;
      const top = event.clientY;
      if (left || top) {
        this.styleObj = {
          left: left + "px",
          top: top + "px",
          display: "block",
        };
      }
      this.visibleContentMenu = true;
      return false;
    },
  },
};
</script>

<style lang="less" scoped>
.screenDesign {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  height: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  .layout-left-fold {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    // height: 100%;
    font-size: 12px;
    overflow: hidden;
    background-color: #242a30;
    cursor: pointer;
    padding-top: 26%;

    i {
      font-size: 18px;
      width: 18px;
      height: 23px;
      margin-left: 0px;
      color: #bfcbd9;
    }
  }

  .layout-middle {
    position: relative;
    height: 100%;
    background-color: rgb(36, 42, 48);
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    border: 1px solid rgb(36, 42, 48);
    align-items: center;
    vertical-align: middle;
    text-align: center;

    .top-button {
      display: flex;
      flex-direction: row;
      height: 40px;
      line-height: 40px;
      margin-left: 9px;

      .btn {
        color: #788994;
        width: 55px;
        text-align: center;
        display: block;
        cursor: pointer;

        &:hover {
          background: rgb(25, 29, 34);
        }
      }

      .btn-disable {
        opacity: 0.3;
        cursor: no-drop;
      }

      .scale-num {
        color: #788994;
        opacity: 1;
        cursor: pointer;

        &.btn-disable {
          cursor: no-drop;

          &:hover {
            background: #20262c;
          }
        }
      }
    }

    .workbench-container {
      position: relative;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      overflow: auto;

      .vueRuler {
        // width: 100%;
        // padding: 18px 0px 0px 18px;
        padding: 0;
      }

      .workbench {
        background-color: #1e1e1e;
        position: relative;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        margin: 0;
        padding: 0;
        background-position: 0% 0%;
        background-size: 100% 100%;
        background-repeat: initial;
        background-attachment: initial;
        background-origin: initial;
        background-clip: initial;
      }

      .bg-grid {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: 30px 30px, 30px 30px;
        background-image: linear-gradient(
            hsla(0, 0%, 100%, 0.1) 1px,
            transparent 0
          ),
          linear-gradient(90deg, hsla(0, 0%, 100%, 0.1) 1px, transparent 0);
        // z-index: 2;
      }
    }

    .bottom-text {
      width: 100%;
      color: #a0a0a0;
      font-size: 16px;
      position: absolute;
      bottom: 20px;
    }
  }
}

.border-left {
  border-left: 1px solid #273b4d;
}

.nav {
  width: 40px;
  padding: 0;
  list-style: none;
  /* overflow: hidden; */
}

/deep/ .el-tabs--border-card {
  border: 0;

  .el-tabs__header {
    .el-tabs__nav {
      .el-tabs__item {
        background-color: #242f3b;
        border: 0px;
      }

      .el-tabs__item.is-active {
        background-color: #31455d;
      }
    }
  }

  .el-tabs__content {
    background-color: #242a30;
    height: calc(100vh - 39px);
    overflow-x: hidden;
    overflow-y: auto;

    .el-tab-pane {
      color: #bfcbd9;
      padding-bottom: 15px;
    }

    &::-webkit-scrollbar {
      width: 5px;
      height: 14px;
    }

    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb {
      border-radius: 1px;
      border: 0 solid transparent;
    }

    &::-webkit-scrollbar-track-piece {
      /*修改滚动条的背景和圆角*/
      background: #29405c;
    }

    &::-webkit-scrollbar-track {
      box-shadow: 1px 1px 5px rgba(116, 148, 170, 0.5) inset;
    }

    &::-webkit-scrollbar-thumb {
      min-height: 20px;
      background-clip: content-box;
      box-shadow: 0 0 0 5px rgba(116, 148, 170, 0.5) inset;
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }

    /*修改垂直滚动条的样式*/

    &::-webkit-scrollbar-thumb:vertical {
      background-color: #00113a;
      // -webkit-border-radius: 7px;
    }

    /*修改水平滚动条的样式*/

    &::-webkit-scrollbar-thumb:horizontal {
      background-color: #00113a;
      // -webkit-border-radius: 7px;
    }
  }
}

&::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

&::-webkit-scrollbar-track {
  background-color: transparent;
}

&::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 7px;
}

&::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
