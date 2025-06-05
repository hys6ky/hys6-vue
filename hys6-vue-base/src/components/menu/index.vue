<template>
  <div class="home h100">
    <!--无菜单页-->
    <router-view
      :key="$route.fullPath"
      v-if="
        $route.path === '/V/dashboard' ||
        $route.path === '/V/dashboard/preview' ||
        $route.path === '/G/dashboard/preview'
      "
    ></router-view>
    <!--有菜单页-->
    <el-container
      style="height: 100%; display: flex; flex-direction: column"
      v-else
    >
      <div class="d-flex">
        <div class="header-logoWrap">
          <img :src="`/static/img/hyrenlogo.png`" alt="" class="header-logo" />
        </div>
        <el-header>
          <el-row>
            <el-col :span="18" style="text-align: left; line-height: 45px">
              <span
                @click="meanClickFun()"
                style="cursor: pointer; color: #409eff"
              >
                <i
                  :class="
                    isCollapse === true ? 'el-icon-s-unfold' : 'el-icon-s-fold'
                  "
                  style="font-size: 22px; margin-right: 12px"
                ></i>
              </span>
              <el-breadcrumb
                separator="/"
                style="display: inline-block; color: #409eff"
              >
                <el-breadcrumb-item
                  v-for="(item, index) in breadcrumbList"
                  :key="index"
                >
                  <router-link
                    v-if="item.url"
                    :to="item.url"
                    style="color: rgb(64, 158, 255)"
                    >{{ item.name }}</router-link
                  >
                  <a v-else style="color: rgb(64, 158, 255)">{{ item.name }}</a>
                </el-breadcrumb-item>
              </el-breadcrumb>
            </el-col>
            <el-col
              :span="2"
              style="text-align: right; position: fixed; right: 50px; top: 0"
            >
              <div class="header-user-con">
                <el-dropdown class="user-name" trigger="click">
                  <div class="avatar-wrapper">
                    <!-- 用户头像，根据需要自行修改图片路径, 用户名下拉菜单 -->
                    <el-image
                      :src="require('@/assets/user.png')"
                      class="user-avatar"
                    />
                    <i class="el-icon-caret-bottom" />
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <i
                        class="el-icon-s-data"
                        style="color: #409eff; font-size: 16px"
                      ></i>
                      <el-popover placement="right" width="400" trigger="click">
                        <el-badge
                          :value="featuresData.loginsum"
                          class="item"
                          type="primary"
                        >
                          <el-button type="text" size="small"
                            >当天登陆次数</el-button
                          >
                        </el-badge>
                        <el-table :data="featuresData.other" height="300">
                          <el-table-column
                            width="150"
                            property="operation_type"
                            label="功能名称"
                            show-overflow-tooltip
                          ></el-table-column>
                          <el-table-column
                            width="150"
                            property="remoteaddr"
                            label="访问地址IP"
                          ></el-table-column>
                          <el-table-column
                            width="100"
                            property="operationnum"
                            label="访问次数"
                          ></el-table-column>
                        </el-table>
                        <el-link
                          type="primary"
                          @click="getTodayFeaturesInfo"
                          slot="reference"
                          >功能统计</el-link
                        >
                      </el-popover>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link :underline="false" @click="logOut">
                        <i class="el-icon-s-custom" style="color: #409eff"
                          >退出登录</i
                        >
                      </el-link>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-col>
          </el-row>
        </el-header>
      </div>
      <el-container
        :class="isCollapse === true ? 'asidewidth1' : 'asidewidth2'"
      >
        <el-aside :class="isCollapse === true ? 'aside1' : 'aside2'">
          <el-scrollbar style="height: 100%" wrap-style="overflow-x:hidden;">
            <!-- 导航 -->
            <el-menu
              :unique-opened="true"
              style="border: 0"
              background-color="#495179"
              text-color="#fff"
              active-text-color="rgba(255, 208, 75, 0.8)"
              router
              :default-active="$route.path"
              :collapse-transition="true"
              :collapse="isCollapse"
            >
              <div v-for="items in menus" :key="items.name">
                <template v-if="items.children">
                  <!--二级菜单循环-->
                  <el-submenu :index="items.children[0].path" class="oneMenu">
                    <template slot="title">
                      <i :class="items.icon"></i>
                      <span
                        slot="title"
                        class="displayno"
                        v-if="isCollapse === false"
                        >{{ items.title }}</span
                      >
                    </template>
                    <div v-for="item in items.children" :key="item.name">
                      <template v-if="item.children">
                        <!--三级菜单循环-->
                        <el-submenu :index="item.children[0].path">
                          <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title" class="displayno">{{
                              item.title
                            }}</span>
                          </template>
                          <el-menu-item
                            v-for="item3 in item.children"
                            :key="item3.name"
                            :index="item3.path"
                          >
                            <i :class="item3.icon" class="displayno"></i>&nbsp;
                            <span class="displayno">{{ item3.title }}</span>
                          </el-menu-item>
                        </el-submenu>
                      </template>
                      <el-menu-item v-else :key="item.name" :index="item.path">
                        <i :class="item.icon" class="displayno"></i>&nbsp;
                        <span class="displayno">{{ item.title }}</span>
                      </el-menu-item>
                    </div>
                  </el-submenu>
                </template>
                <template v-else>
                  <!--一级菜单循环-->
                  <el-menu-item
                    :index="items.path"
                    :class="isCollapse === true ? 'asideW1' : 'asideW2'"
                  >
                    <i :class="items.icon"></i>
                    <span slot="title" class="displayno">{{
                      items.title
                    }}</span>
                  </el-menu-item>
                </template>
              </div>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main style="padding: 6px 16px">
          <div class="mainPage overflow-hidden d-flex flex-column">
            <div class="mainTag">
              <div class="tabWrap">
                <el-tabs
                  class="tabs"
                  closable
                  v-model="activeName"
                  @tab-remove="removeTab"
                  @tab-click="jumpHandler"
                >
                  <el-tab-pane
                    v-for="tag in tagViews"
                    :key="tag.path"
                    :name="tag.name"
                  >
                    <span slot="label" class="tabs-label" :title="tag.label">
                      {{ tag.label }}
                    </span>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <el-dropdown
                v-if="tagViews.length > 0"
                placement="bottom-start"
                type="primary"
                trigger="hover"
                style="width: 30px"
              >
                <div class="action">
                  <i class="el-icon-more"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="closeAllTagsHandler">关闭所有标签页</div>
                  </el-dropdown-item>
                  <el-dropdown-item @click="closeOtherTagHandler">
                    <div @click="closeOtherTagHandler">关闭其他标签页</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <!-- <el-scrollbar style="height:500px;overflow-x: hidden"> -->
            <div class="mainContent flex-1 overflow-auto">
              <router-view :key="$route.fullPath"></router-view>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getFlatArr } from "@/utils/datahandler.js";
import { nonMenuRoutes } from "./mock";
import { mapGetters } from "vuex";
import { del } from "vue";
export default {
  data() {
    return {
      menus: [],
      defLink: "",
      isCollapse: false,
      featuresData: {},
      activeName: "",
      breadcrumbList: [],
      defaultMenu: this.$store.getters.getDefaultMenu,
    };
  },
  computed: {
    ...mapGetters(["tagViews"]),
  },
  watch: {
    $route: {
      handler(to, from) {
        let newArr = [...getFlatArr(this.menus), ...nonMenuRoutes];
        newArr.map((item) => {
          if (item.path && item.path === to.fullPath) {
            this.activeName = item.name;
            this.breadcrumbList = item.breadcrumb;
            const tag = {
              path: item.path,
              name: item.name,
              label: item.title,
            };
            // console.log(tag);
            this.$store.commit("tagView/ADD_VISITED_VIEW", tag);
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    if (this.$route.path === "/G/dashboard/preview") {
      return;
    }
    // 这里是菜单默认路径
    this.$executeRequest.execByUrl("/Base/menu/getMenu").then((res) => {
      if (res.success) {
        const menu = this.$Secret.DecryptJSON(res.data).data;
        // const menu = res.data;
        console.log(menu, "菜单");
        this.menuDataHandler(menu);
        this.menus = menu;
        this.addTagHandler(this.menus);
        if (this.menus.length > 0) {
          if (this.$route.path === "/menu") {
            this.$router.push(this.menus[0].auth_url);
          }
        }
        if (this.menus) {
          let menuUrl = [];
          this.menus.forEach((itme) => {
            menuUrl.push(itme.auth_url);
          });
          //this.$cookies.set("menu", menuUrl.join(","));
        }
      }
    });
  },
  methods: {
    // 标签add
    addTagHandler(menus) {
      let newArr = [...getFlatArr(this.menus), ...nonMenuRoutes];
      let path = this.$router.currentRoute;
      newArr.map((item) => {
        if (item.parent_id === 0 && item.children && item.children.length > 0) {
          delete item.path;
        }
        if (item.path && item.path === path.fullPath) {
          this.breadcrumbList = item.breadcrumb;
          this.activeName = item.name;
          const tag = {
            path: item.path,
            name: item.name,
            label: item.title,
          };
          // console.log(tag);
          this.$store.commit("tagView/ADD_VISITED_VIEW", tag);
        }
      });
      this.$store.commit("SET_MENU_LIST", newArr);
    },
    //菜单路由
    menuDataHandler(arr, breadcrumb = []) {
      arr.map((item, index) => {
        if (item.parent_id === 0) {
          item.breadcrumb = [{ name: item.title }];
        } else {
          item.breadcrumb = [...breadcrumb, { name: item.title }];
        }
        if (item.children && item.children.length > 0) {
          this.menuDataHandler(item.children, [{ name: item.title }]);
        }
      });
    },
    // 注销
    logOut() {
      // let tokenInfo = JSON.parse(this.$Base64.decode(this.$store.getters.getToken));
      // this.$executeRequest.execGetByUrl('/hyren_gateway/logout', {user_id: tokenInfo.userId}).then(res => {
      //   if (res.code === 200) {
      //     this.$store.dispatch('logOut')
      //     this.$router.push('/');
      //   }
      // })
      this.$store.commit("tagView/DEL_ALL_VISITED_VIEWS");
      this.$router.push("/");
    },
    meanClickFun() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse === true) {
        let arr = document.getElementsByClassName("displayno");
        for (let i = 0; i < arr.length; i++) {
          arr[i].style.display = "none";
        }
      } else {
        let arr = document.getElementsByClassName("displayno");
        for (let i = 0; i < arr.length; i++) {
          arr[i].style.display = "block";
        }
      }
    },
    // 功能统计
    getTodayFeaturesInfo() {
      this.$executeRequest
        .execByUrl("/Base/menu/getTodayFeaturesInfo")
        .then((res) => {
          if (res.success) {
            this.featuresData = res.data;
          }
        });
    },
    //删除当前标签
    removeTab(targetName) {
      if (targetName === this.defaultMenu && this.tagViews.length === 1) return;
      const currentTag = this.tagViews.find((item) => item.path === targetName);
      this.closeSelectedTag(currentTag);
    },
    closeSelectedTag(tag) {
      this.$store.dispatch("tagView/delView", tag).then(({ tagViews }) => {
        if (tag.path === this.$route.path) {
          this.toLastView(tagViews, tag);
        }
      });
    },
    toLastView(tagViews) {
      const latestView = tagViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.path);
      } else {
        this.$router.push(this.defaultMenu);
      }
    },
    //切换当前标签
    jumpHandler(item) {
      this.$router.push(item.name);
    },
    //关闭所有标签
    closeAllTagsHandler() {
      if (
        this.tagViews.length === 1 &&
        this.tagViews[0].path === this.defaultMenu
      )
        return;
      this.$store.commit("tagView/DEL_ALL_VISITED_VIEWS");
      this.$router.push(this.defaultMenu);
    },
    //关闭其他标签
    closeOtherTagHandler() {
      const currentTag = this.tagViews.find(
        (item) => item.path === this.activeName
      );
      this.$store.commit("tagView/DEL_OTHERS_VISITED_VIEWS", currentTag);
    },
  },
};
</script>

<style scoped>
.home >>> .happy-scroll-container {
  overflow: visible !important;
  width: 0 !important;
}

/* .home >>> .focusing {
  background-color: rgb(73, 81, 121);
  border: 0 !important;
} */

.home >>> .el-menu--collapse {
  width: 50px;
}

.home >>> .el-menu--collapse > div > .el-menu-item .el-submenu__icon-arrow,
.home
  >>> .el-menu--collapse
  > div
  > .el-submenu
  > .el-submenu__title
  .el-submenu__icon-arrow {
  display: none;
}

/**
宽菜单样式
 */
.aside2 {
  background-color: #495179;
  min-height: 89.1vh;
  width: 200px !important;
  transition: 0.5s;
  height: 100%;
}

/**
窄菜单样式
 */
.aside1 {
  background-color: #495179;
  min-height: 89.1vh;
  width: 50px !important;
  transition: 0.5s;
  height: 100%;
}

/**
宽菜单下,页面容器样式
 */
.asidewidth2 {
  transition: 0.5s;
}

/**
窄菜单下,页面容器样式
 */
.asidewidth1 {
  transition: 0.5s;
}

/**
每个菜单样式,窄样式
 */
.asideW1 {
  width: 50px;
  transition: 0.2s;
}

/**
每个菜单样式,宽样式
 */
.asideW2 {
  width: 200px;
  transition: 0.2s;
}

/**
窄菜单下,页面容器样式,头部
 */
.header1 {
  position: fixed !important;
  left: 50px !important;
  top: 0 !important;
  transition: 0.5s;
}

/**
宽菜单下,页面容器样式,头部
 */
.header2 {
  position: fixed !important;
  left: 200px !important;
  top: 0 !important;
  transition: 0.5s;
}

/*.leftmean >>> .el-menu-vertical-demo:not(.el-menu--collapse) {*/
/*  width: 200px;*/
/*  min-height: 400px;*/
/*}*/

/* .home >>> .el-tooltip,
.home >>> .el-submenu__title,
.home >>> .el-menu > div > .el-menu-item {
  padding: 0 10px !important;
} */

/*.el-header >>> .el-breadcrumb__separator {*/
/*  color: rgb(64, 158, 255)*/
/*}*/

.el-header {
  background-color: #fff;
  text-align: center;
  color: #000;
  /* position: fixed; */
  top: 0%;
  width: calc(100% - 200px);
  z-index: 10;
  left: 0;
  height: 45px !important;
  /* line-height: 45px; */
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
    0 0 6px 0 rgba(0, 0, 0, 0.04);
  padding: 0 20px;
}
.header-user-con {
  display: flex;
  height: 45px;
  align-items: center;
  justify-content: flex-end;
}

/*.el-main {*/
/*  padding: 14px 20px;*/
/*}*/

/* .el-container {*/
/*  min-height: 93vh;*/
/*} */

/*.el-footer {*/
/*  height: 0px !important;*/
/*  line-height: 30px;*/
/*  font-size: 12px;*/
/*  position: fixed;*/
/*  bottom: 0%;*/
/*  width: 100%;*/
/*  z-index: 10;*/
/*  background-color: #495179;*/
/*  text-align: center;*/
/*  color: #fff;*/
/*}*/

/*.el-main >>> .el-backtop {*/
/*  right: 5px !important;*/
/*}*/
.el-main .mainPage {
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.7) 0%,
    #ffffff 100%
  );
  box-shadow: 0px 0px 6px 0px rgba(81, 156, 234, 0.5);
}
.el-main .mainTag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e3e4e5;
  height: 30px;
}
.el-main .tabWrap {
  width: calc(100% - 30px);
}
.el-main .action {
  width: 30px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  position: relative;
  cursor: pointer;
  border-left: 1px solid #ececec;
}
.tabWrap >>> .el-tabs .el-tabs__nav-next,
.tabWrap >>> .el-tabs__nav-prev {
  line-height: 30px;
}
.tabWrap >>> .el-tabs__nav-wrap::after {
  display: none;
}
.tabWrap >>> .el-tabs__header {
  margin: 0px;
}
.tabWrap >>> .el-tabs__item {
  min-width: 104px;
  padding: 0px !important;
  text-align: center;
  font-family: PingFangSC-Regular, PingFang SC;
  position: relative;
  height: 31px;
  line-height: 31px;
}
.tabWrap >>> .el-tabs__item::after {
  content: "";
  position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px;
  height: 16px;
  margin: auto;
  border-right: 1px solid #cad0db;
}
.tabWrap >>> .el-tabs__item.is-active {
  background: linear-gradient(
    315deg,
    rgba(78, 208, 255, 0.1) 0%,
    rgba(64, 127, 255, 0.1) 100%
  );
}
.tabWrap >>> .el-tabs .tabs-label {
  padding-left: 12px;
  padding-right: 4px;
}
.tabWrap >>> .el-tabs .el-tabs__active-bar {
  width: 100%;
  background: linear-gradient(315deg, #4ed0ff 0%, #407fff 100%);
}
.tabWrap >>> .el-tabs__item .el-icon-close {
  margin-right: 10px;
  float: right;
  margin-top: 9px;
}
.el-container {
  height: calc(100vh - 50px);
}
/* .mainContent {
  height: calc(100% - 70px);
} */
.aside1 >>> .happy-scroll {
  overflow: scroll;
  position: fixed;
  width: 50px !important;
  scrollbar-width: none;
}

.aside2 >>> .happy-scroll {
  overflow: scroll;
  position: fixed;
  width: 200px !important;
  scrollbar-width: none;
}

.up-style {
  height: 100%;
  width: 100%;
  background-color: #f2f5f6;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  text-align: center;
  line-height: 40px;
  color: #1989fa;
}

.avatar-wrapper {
  margin-top: 2px;
  position: relative;
}

.avatar-wrapper >>> .user-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.avatar-wrapper >>> .el-icon-caret-bottom {
  cursor: pointer;
  position: absolute;
  right: -20px;
  top: 25px;
  font-size: 12px;
}

.el-submenu .el-menu-item {
  padding: 0;
}
.header-logo {
  /* width: 200px; */
  height: 40px;
  width: 130px;
  margin-left: 5px;
  margin-top: 5px;
}
.header-logoWrap {
  width: 200px;
  height: 46px;
  background: #495179;
  position: relative;
}
.header-title {
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #ffffff;
  line-height: 14px;
  position: absolute;
  top: 42px;
  left: 43px;
  letter-spacing: 18px;
}
.headerWrap {
  display: flex;
}
.sidebar-title {
  display: inline-block;
  margin: 0;
  color: #fff;
  font-weight: 500;
  line-height: 50px;
  font-size: 22px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  vertical-align: middle;
}
</style>
