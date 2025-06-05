<template>
  <div class="px-20 box-sizing h100">
    <ByContainerTitle title="检核历史" class="pt-10" />
    <div
      class="mt-20"
      v-if="tableData.length > 0"
      style="height: calc(100% - 50px)"
    >
      <ByTable
        :tableData="tableData"
        :columnArr="columnArr"
        :pagination="pagination"
        @operateItem="operate"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        class="h100"
      ></ByTable>
    </div>
    <div style="height: calc(100% - 30px)" v-else>
      <ByEmpty />
    </div>
    <ByDrawer
      :visible.sync="visible"
      drawTitle="检核历史详情"
      :drawFooter="false"
      @closed="drawerClosed"
    >
      <el-descriptions size="medium">
        <template slot="title">
          <ByHeaderSlice title="信息总览" />
        </template>
        <el-descriptions-item
          v-for="item in inforColumnArr"
          :key="item.prop"
          :label="item.label"
        >
          <span>{{ infoData[item.prop] || "--" }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <ByQuickSearch
        :formItems="detailFormItems"
        @search="search"
        @reset="reset"
      />
      <div class="mt-20">
        <ByTable
          :tableData="detailTableData"
          :columnArr="detailColumnArr"
          :pagination="detailPagination"
          @sizeChange="detailSizeChange"
          @currentChange="detailCurrentChange"
        ></ByTable>
      </div>
      <template slot="drawFoot">
        <el-button @click="visible = false">取消</el-button>
      </template>
    </ByDrawer>
  </div>
</template>

<script>
import { detailFormItems, columnArr, detailColumnArr } from "./mock";
export default {
  data() {
    return {
      columnArr,
      tableData: [],
      options: [],
      visible: false,
      detailFormItems: JSON.parse(JSON.stringify(detailFormItems)),
      detailFormData: {
        en_name: "",
        col_name: "",
        sort_id: [],
      },
      treeData: [],
      detailColumnArr,
      detailTableData: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      detailPagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      inforColumnArr: [
        // { label: "系统ID", prop: "source_id" },
        { label: "系统名称", prop: "source_name" },
        { label: "系统字段数", prop: "metaColCount" },
      ], //信息总览
      infoData: {
        source_id: "",
        source_name: "",
        metaColCount: "",
      },
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    //获取列表
    getTableData() {
      const params = {
        source_id: "", //系统id
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      this.$executeRequest
        .execGetByControllerMapping("/K/standardData", params)
        .then((res) => {
          if (res.code === 999) {
            this.tableData = res.data.pageList;
            this.pagination.total = res.data.totalSize;
          }
        });
    },
    //获取标准下拉框treeOption
    getTreeOption(source_id) {
      const params = {
        source_id, //系统id
      };
      this.$executeRequest
        .execPostByControllerMapping(
          "/K/dbm/tree/getDbmSortInfoTreeData",
          params
        )
        .then((res) => {
          if (res.code === 999) {
            // this.treeOption = res.data;
            this.treeData = res.data.dbmSortInfoTreeDataList;
            this.detailFormItems.map((item) =>
              item.prop === "sort_id" ? (item.options = this.treeData) : ""
            );
          }
        });
    },
    //获取表名
    getTableName(source_id) {
      this.$executeRequest
        .execGetByControllerMapping("/K/standardData/getTableName", {
          source_id,
        })
        .then((res) => {
          if (res.code === 999) {
            this.options = res.data.map((item) => {
              return {
                label: item.table_cname,
                value: item.table_ename,
              };
            });
            this.detailFormItems.map((item) =>
              item.prop === "en_name" ? (item.options = this.options) : ""
            );
          }
        });
    },
    //获取详情列表
    getDetailTableData(source_id) {
      const params = {
        source_id: source_id, //系统id
        en_name: this.detailFormData.en_name, //表名
        col_name: this.detailFormData.col_name, //字段名
        currPage: this.detailPagination.pageNum,
        pageSize: this.detailPagination.pageSize,
      };
      //标准
      if (this.detailFormData.sort_id.length === 0) {
        params.sort_id = "";
      } else {
        params.sort_id =
          this.detailFormData.sort_id[this.detailFormData.sort_id.length - 1];
      }
      this.$executeRequest
        .execGetByControllerMapping("/K/standardData/detailsList", params)
        .then((res) => {
          if (res.code === 999) {
            res.data.pageList.map((item) => {
              if (item.imp_result === "1") {
                item.imp_result_txt = {
                  text: "通过",
                  color: "#3BC698",
                };
              } else {
                item.imp_result_txt = {
                  text: "不通过",
                  color: "#E6515D",
                };
              }
            });
            this.detailTableData = res.data.pageList;
            this.detailPagination.total = res.data.totalSize;
          }
        });
    },
    //表格分页
    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getTableData();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getTableData();
    },
    //详情列表分页
    detailSizeChange(val) {
      this.detailPagination.pageSize = val;
      this.detailPagination.pageNum = 1;
      this.getDetailTableData(this.infoData.source_id);
    },
    detailCurrentChange(val) {
      this.detailPagination.pageNum = val;
      this.getDetailTableData(this.infoData.source_id);
    },
    search(val) {
      this.detailFormData = Object.assign({}, val);
      this.getDetailTableData(this.infoData.source_id);
    },
    reset(val) {
      this.detailFormData = {
        en_name: "",
        col_name: "",
        sort_id: [],
      };
    },
    operate(type, row) {
      this.infoData = {
        source_id: row.source_id,
        source_name: row.source_name,
        metaColCount: row.metaColCount,
      };
      this.getTreeOption(row.source_id);
      this.getTableName(row.source_id);
      this.getDetailTableData(row.source_id);
      this.visible = true;
    },
    //关闭弹窗数据init
    drawerClosed() {
      this.detailPagination = {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      };
      this.treeData = [];
      this.options = [];
      this.detailFormData = {
        en_name: "",
        col_name: "",
        sort_id: [],
      };
      this.detailFormItems = JSON.parse(JSON.stringify(detailFormItems));
      this.infoData = {
        source_id: "",
        source_name: "",
        metaColCount: "",
      };
      this.detailTableData = [];
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-descriptions__body {
  margin-top: 10px;
}
</style>
