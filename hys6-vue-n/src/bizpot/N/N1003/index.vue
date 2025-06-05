<template>
  <div class="assetSearch h100">
    <div
      class="header d-flex align-items-center justify-content-center flex-column"
    >
      <!-- <span class="text-white">资产检索</span> -->
      <el-input placeholder="请输入内容" v-model="keyWords">
        <template slot="prepend">资产检索</template>
        <el-button
          slot="append"
          @click="serch"
          icon="el-icon-search"
        ></el-button>
      </el-input>
    </div>
    <div style="height: calc(100% - 100px)" v-if="zlist.length > 0">
      <div
        style="height: calc(100% - 52px)"
        class="overflow-auto"
        @scroll="closeTooltip"
      >
        <el-card class="mx-20 my-20" v-for="item in list">
          <div class="d-flex">
            <el-tooltip
              v-model="item.assetId === currentId"
              content="查看详情"
              placement="top-start"
              manual
            >
              <h3
                style="cursor: pointer"
                @click="xq(item)"
                class="title"
                @mouseenter="currentId = item.assetId"
                @mouseleave="currentId = null"
              >
                {{ item.assetNormCName }}
              </h3>
            </el-tooltip>
          </div>
          <div class="py-10">
            <el-tag type="primary" class="mr-10" size="small">{{
              item.assetType1
            }}</el-tag>
          </div>
          <el-row>
            <el-col :span="6">
              <div class="content">
                <span>资产代码：</span>
                <span>{{ item.assetCode || "--" }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="content">
                <span>业务主键：</span>
                <span>{{ item.businessCName || "--" }}</span>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="content">
                <span>业务描述：</span>
                <span>{{ item.businessRemark || "--" }}</span>
              </div>
            </el-col>
            <el-col v-if="item.assetType !== '1'" :span="24">
              <div class="content">
                <span>资产描述：</span>
                <span>{{ item.assetRemark || "--" }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="mx-20 my-20" v-for="item in zdlist">
          <el-tooltip
            v-model="item.assetId === currentId"
            content="查看详情"
            placement="top-start"
            manual
          >
            <h3
              style="cursor: pointer"
              @click="xq(item)"
              class="title"
              @mouseenter="currentId = item.assetId"
              @mouseleave="currentId = null"
            >
              {{ item.assetNormCName }}
            </h3>
          </el-tooltip>
          <div class="py-10">
            <el-tag type="primary" class="mr-10" size="small">{{
              item.assetType1
            }}</el-tag>
            <el-tag
              v-if="item.shareType !== null"
              type="primary"
              class="mr-10"
              size="small"
              >{{ item.shareType1 }}</el-tag
            >
            <el-tag
              v-if="item.securityLevel !== null"
              type="primary"
              class="mr-10"
              size="small"
              >{{ item.securityLevel1 }}</el-tag
            >
          </div>
          <el-row>
            <el-col :span="6">
              <div class="content">
                <span>资产代码：</span>
                <span>{{ item.assetCode || "--" }}</span>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="content">
                <span>业务描述：</span>
                <span>{{ item.businessRemark || "--" }}</span>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="content">
                <span>资产描述：</span>
                <span>{{ item.assetRemark || "--" }}</span>
              </div>
            </el-col>
          </el-row>
          <div class="pt-10"></div>
        </el-card>
      </div>
      <div
        class="d-flex align-items-center justify-content-between my-10 px-20"
      >
        <div class="font-14 totalPageTip">
          共&nbsp;{{ pagination.total }}&nbsp;项数据
        </div>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.pageNum"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout=" prev, pager, next, sizes,jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </div>
    <div v-else style="height: calc(100% - 100px)">
      <ByEmpty />
    </div>
    <ByDrawer
      :visible.sync="visible"
      :drawTitle="drawTitle"
      :drawWidth="800"
      :drawFooter="false"
      @close="clone"
    >
      <Info :sj="sj" :activeName="activeName" />
    </ByDrawer>
  </div>
</template>

<script>
import Info from "./components/info.vue";
import { dateFormat, hourFormat } from "@/utils/dateconversion";
export default {
  name: "assetSearch",
  data() {
    return {
      zlist: [],
      drawTitle: "",
      keyWords: "",
      zdlist: [],
      list: [],
      activeName: "",
      visible: false,
      sj: {},
      pagination: {
        total: 2,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      currentId: null,
    };
  },
  components: { Info },
  mounted() {
    let pageText = document.getElementsByClassName("el-pagination__jump")[0];
    if (pageText) {
      //可能存在不显示页码的情况，所以最好判断一下避免报错~
      pageText.childNodes[0].nodeValue = "跳至 ";
    }
    this.$nextTick(() => {
      this.closeTooltip();
    });
  },
  methods: {
    //滚动关闭tooltip
    closeTooltip(val) {
      let list = document.getElementsByClassName("el-tooltip__popper");
      if (list.length > 0) {
        list[list.length - 1].style.display = "none";
      }
    },
    clone() {
      this.visible = false;
    },
    serch() {
      this.init();
    },
    xq(val) {
      this.sj = JSON.parse(JSON.stringify(val));
      this.sj.assetDate = dateFormat(this.sj.assetDate);
      this.sj.assetTime = hourFormat(this.sj.assetTime);
      this.drawTitle = this.sj.assetNormCName;
      if (this.sj.assetType === "5") {
        this.activeName = "second";
      } else {
        this.activeName = "first";
      }
      this.visible = true;
    },
    getMetaObjInfo() {
      this.init();
    },
    handleCurrentChange(val) {
      this.pagination.pageNum = val;
      this.pagination.pageSize = 10;
      this.getMetaObjInfo();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getMetaObjInfo();
    },
    init() {
      this.$executeRequest
        .execPostByControllerMapping("/N/N1004/searchDataAsset", {
          searchText: this.keyWords,
          assetType: null,
          currPage: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
        })
        .then((res) => {
          this.pagination.total = res.data.totalSize;
          this.zlist = res.data.pageList;
          this.list = res.data.pageList.filter((item) => {
            return item.assetType !== "5";
          });
          this.zdlist = res.data.pageList.filter((item) => {
            return item.assetType === "5";
          });
          let assettype = [
            {
              type: "1",
              label: "表",
            },
            {
              type: "2",
              label: "视图",
            },
            {
              type: "3",
              label: "文件",
            },
            {
              type: "4",
              label: "指标",
            },
            {
              type: "5",
              label: "字段",
            },
          ];
          this.zdlist.forEach((item) => {
            assettype.forEach((typeitem) => {
              if (item.assetType === typeitem.type) {
                item.assetType1 = typeitem.label;
              }
            });
          });
          this.list.forEach((item) => {
            assettype.forEach((typeitem) => {
              if (item.assetType === typeitem.type) {
                item.assetType1 = typeitem.label;
              }
            });
          });
          let zdshare = [
            { label: "有条件共享", value: "1" },
            { label: "无条件共享", value: "2" },
            { label: "不共享", value: "3" },
          ];
          this.zdlist.forEach((item) => {
            zdshare.forEach((typeitem) => {
              if (item.shareType === typeitem.value) {
                item.shareType1 = typeitem.label;
              }
            });
          });
          let zdsecurity = [
            { label: "公开", value: "1" },
            { label: "敏感", value: "2" },
            { label: "密码", value: "3" },
            { label: "机密", value: "4" },
          ];
          this.zdlist.forEach((item) => {
            zdsecurity.forEach((typeitem) => {
              if (item.securityLevel === typeitem.value) {
                item.securityLevel1 = typeitem.label;
              }
            });
          });
          this.zdlist.forEach((item) => {
            if (item.amountUnit) {
              item.amountUnit1 = "元";
            }
          });
        });
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.assetSearch {
  .header {
    height: 100px;
    // background: linear-gradient(135deg, rgba(84, 137, 277, 0.8) 0%, rgba(85, 131, 234, 0.8) 50%, rgba(117, 219, 235, 0.8) 100%);
    background: linear-gradient(135deg, #394e99 0%, #60a3ed 100%);
    color: #fff;
    // .text-white {
    // 	font-size: 30px;
    // 	letter-spacing: 3px;
    // 	font-family: @hansan;
    // }
    ::v-deep .el-input {
      width: 600px;
    }
    ::v-deep .el-input__inner {
      padding: 0 10px;
    }
    ::v-deep .el-input-group__append,
    ::v-deep .el-input-group__prepend {
      background-color: transparent;
      font-weight: bold;
      color: #fff;
    }
  }
  .title {
    width: fit-content;
  }
  .title:hover {
    color: #409eff;
  }
  .content {
    color: #666;
    font-size: 14px;
    padding: 5px 0;
  }
  .chatIcon {
    cursor: pointer;
    color: #407fff;
    font-weight: 600;
  }
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 8px;
  }
  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    border-radius: 8px;
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
