<template>
  <div class="px-20 codeManage">
    <div class="container pt-10">
      <div style="height: 32px; margin-bottom: 10px">
        <ByHeaderSlice
          :title="sys_name"
          style="float: left"
        ></ByHeaderSlice>
        <el-button v-debounce @click="goBack" class="goBackBtn button">
          <i class="el-icon-back"></i>返回
        </el-button>
      </div>
    </div>
    <div class="lines"></div>
    <!-- 导航 -->
    <el-menu
      mode="horizontal"
      text-color="#000"
      active-text-color="rgba(255, 0, 0, 0.9)"
      background-color="#F5F7FA"
      :unique-opened="true"
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      @select="handleSelect"
    >
      <!--二级菜单循环-->
      <el-submenu
        v-for="items in menus"
        :key="items.name"
        :index="items.children[0].path"
      >
        <template slot="title">{{ items.title }}</template>
        <div v-for="item in items.children" :key="item.name">
          <el-menu-item :index="item.path">
            <i :class="item.icon"></i>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </div>
      </el-submenu>
    </el-menu>
    <div class="pcontain">
      <el-main class="pbody">
        <router-view v-on:viewIn="changeTitle"></router-view>
      </el-main>
    </div>
  </div>
</template>

<script>
import ByContainerTitle from "@/components/global/ByContainerTitle.vue";
import ByHeaderSlice from "@/components/global/ByHeaderSlice.vue";

export default {
  components: { ByHeaderSlice, ByContainerTitle },
  data() {
    return {
      sys_cd: "",
      defaultActive: "",
      job: "",
      menus: [
        {
          icon: "el-icon-view",
          title: "监控",
          children: [
            {
              icon: "el-icon-location-outline",
              title: "当前批量",
              path: "/currentBatch",
              name: "currentBatch",
            },
            {
              icon: "el-icon-location-outline",
              title: "历史批量",
              path: "/historyBatch",
              name: "historyBatch",
            },
            {
              icon: "el-icon-location-outline",
              title: "历史耗时",
              path: "/timeBatch",
              name: "timeBatch",
            },
            {
              icon: "el-icon-location-outline",
              title: "当前作业",
              path: "/currentJob",
              name: "currentJob",
            },
            {
              icon: "el-icon-location-outline",
              title: "历史作业",
              path: "/historyJob",
              name: "historyJob",
            },
            {
              icon: "el-icon-location-outline",
              title: "依赖作业",
              path: "/relyJob",
              name: "relyJob",
            },
            {
              icon: "el-icon-location-outline",
              title: "系统资源",
              path: "/systemResource",
              name: "systemResource",
            },
          ],
        },
        {
          icon: "el-icon-menu",
          title: "干预",
          children: [
            {
              icon: "el-icon-location-outline",
              title: "系统级干预",
              path: "sysLevelIntervente",
              name: "sysLevelIntervente",
            },
            {
              icon: "el-icon-location-outline",
              title: "作业级干预",
              path: "jobLevelIntervente",
              name: "jobLevelIntervente",
            },
          ],
        },
        {
          icon: "el-icon-document",
          title: "配置",
          children: [
            {
              icon: "el-icon-location-outline",
              title: "任务",
              path: "/subSystem",
              name: "subSystem",
            },
            // { icon: 'el-icon-location-outline', title: '作业模板', path: '/etlJobDefTemplate' },
            {
              icon: "el-icon-location-outline",
              title: "作业",
              path: "/etlJobDef",
              name: "etlJobDef",
            },
            {
              icon: "el-icon-location-outline",
              title: "资源定义",
              path: "/resourcesAvailable",
              name: "resourcesAvailable",
            },
            {
              icon: "el-icon-location-outline",
              title: "资源分配",
              path: "/resourcesUsage",
              name: "resourcesUsage",
            },
            {
              icon: "el-icon-location-outline",
              title: "系统参数",
              path: "/systemParameter",
              name: "systemParameter",
            },
            {
              icon: "el-icon-location-outline",
              title: "作业依赖",
              path: "/etlDependency",
              name: "etlDependency",
            },
            {
              icon: "el-icon-location-outline",
              title: "重试配置",
              path: "/etlAgainManage",
              name: "etlAgainManage",
            },
          ],
        },
      ],
      sys_name: "",
      pTitle: "任务",
      form: {
        runDate: "",
      },
      forms: {
        etl_job: "",
      },
    };
  },
  mounted() {
    if (this.$route.query.name && this.$route.query.dec) {
      this.defaultActive = this.$route.query.name;
      this.pTitle = this.$Base64.decode(this.$route.query.dec);
    }
    this.sys_name = sessionStorage.getItem("sys_name");
  },
  methods: {
    //返回首页按钮
    goBack() {
      this.$router.push({
        path: "/C/etlMage",
      });
    },
    // 改变菜单栏的路径显示
    changeTitle(val, val2) {
      this.defaultActive = val;
      this.pTitle = val2;
    },
    //导航栏路由跳转
    handleSelect(key, keyPath, title) {
      this.defaultActive = key;
      let path = key.replace(/\//g, "");
      let model = "";
      let changeKey;
      switch (key) {
        case "/currentBatch":
        case "currentBatch":
          changeKey = "当前批量";
          model = "/Monitor";
          break;
        case "/historyBatch":
        case "historyBatch":
          changeKey = "历史批量";
          model = "/Monitor";
          break;
        case "/timeBatch":
        case "timeBatch":
          changeKey = "历史耗时";
          model = "/Monitor";
          break;
        case "/currentJob":
        case "currentJob":
          changeKey = "当前作业";
          model = "/Monitor";
          break;
        case "/historyJob":
        case "historyJob":
          changeKey = "历史作业";
          model = "/Monitor";
          break;
        case "/relyJob":
        case "relyJob":
          changeKey = "依赖作业";
          model = "/Monitor";
          break;
        case "/systemResource":
        case "systemResource":
          changeKey = "系统资源";
          model = "/Monitor";
          break;
        case "/sysLevelIntervente":
        case "sysLevelIntervente":
          changeKey = "系统级干预";
          model = "/Intervene";
          break;
        case "/jobLevelIntervente":
        case "jobLevelIntervente":
          changeKey = "作业级干预";
          model = "/Intervene";
          break;
        case "/subSystem":
        case "subSystem":
          changeKey = "任务";
          model = "/Configure";
          break;
        // case '/etlJobDefTemplate':
        //     changeKey = "作业模板";
        //     break;
        case "/etlJobDef":
        case "etlJobDef":
          changeKey = "作业";
          model = "/Configure";
          break;
        case "/resourcesAvailable":
        case "resourcesAvailable":
          changeKey = "资源定义";
          model = "/Configure";
          break;
        case "/resourcesUsage":
        case "resourcesUsage":
          changeKey = "资源分配";
          model = "/Configure";
          break;
        case "/systemParameter":
        case "systemParameter":
          changeKey = "系统参数";
          model = "/Configure";
          break;
        case "/etlDependency":
        case "etlDependency":
          changeKey = "作业依赖";
          model = "/Configure";
          break;
        case "/etlAgainManage":
        case "etlAgainManage":
          changeKey = "重试配置";
          model = "/Configure";
          break;
      }
      //   console.log("key:" + key);
      //   console.log("/C" + model + "/" + path);
      this.$router.push({
        path: "/C/menus" + model + "/" + path,
        //path: "/C/detailsPages/Configure/subSystem/"+path,
        query: {
          etl_sys_name: this.$route.query.etl_sys_name,
          etl_sys_cd: this.$route.query.etl_sys_cd,
          etl_sys_id: this.$route.query.etl_sys_id,
          name: key,
        },
      });
      // this.$router.push({
      //   path: "/C/detailsPages/Configure/"+path,
      //   query: {
      //     etl_sys_name: this.$route.query.etl_sys_name,
      //     etl_sys_cd: this.$route.query.etl_sys_cd,
      //     name: key,
      //   }
      // });
      this.pTitle = title.$slots.default[1].children[0].text;
    },
  },
};
</script>

<style scoped>
.el-header {
  height: 50px;
  line-height: 50px;
  padding: 0;
}

.el-aside {
  background-color: #e5e5e5;
  height: 550px;
}

.el-main {
  padding: 15px;
  margin-bottom: 15px;
}

.el-container {
  min-height: 550px;
  overflow: hidden;
}

i {
  margin-right: 5px;
}

.el1 {
  margin-top: 3px;
  float: right;
}

.titles {
  color: #2196f3;
  font-size: 18px;
}

.pcontain {
  min-height: 550px;
  overflow-x: hidden;
  overflow-y: auto;
  /* border: 1px solid #d5d5d5;
  border-top: none; */
}

.ptitle {
  line-height: 36px;
  padding: 5px;
  width: 100%;
  height: 36px;
  border-bottom: 1px solid #d5d5d5;
  color: #2196f3;
  font-size: 18px;
}

.tops {
  height: 30px;
  margin-bottom: 0;
}

.lines {
  margin-top: 2px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 10px;
}

.elRows {
  height: 40px;
  line-height: 40px;
  width: 100%;
}
.button {
  float: right;
  height: 32px;
  padding: 0 14px;
  margin-right: 10px;
}
.goBackBtn {
  width: 62px;
  height: 28px;
  line-height: 26px;
  padding: 0;
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  font-family: SourceHanSansCNVF-Regular, SourceHanSansCNVF;
}

.menus >>> .el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 50px;
  line-height: 50px;
}

.menus >>> .el-menu.el-menu--horizontal {
  border: solid 1px #e6e6e6;
}
</style>
