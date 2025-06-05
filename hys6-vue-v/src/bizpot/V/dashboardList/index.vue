<template>
  <div class="dashboardList px-20">
    <ByQuickSearch :formItems="formItems" @reset="reset" @search="search"/>
    <div class="d-flex justify-content-between mt-10 title">
      <ByContainerTitle title="数据仪表盘"/>
      <el-button type="primary" @click="addDesign">新建</el-button>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col v-for="item in list" :key="item.id" :span="6">
          <div class="bg">
            <img
                class="bg-img"
                :src="
                item.reportImage == null || item.reportImage == ''
                  ? require('@/assets/images/charts.jpg')
                  : item.reportImage
              "
                alt=""
            />
            <div class="content">
              <header>{{ item.title }}</header>
              <article>
                <span v-if="item.dashboard_status === '1'" style="color: #3bc698">
                  已发布
                </span>
                <span v-else style="color: #e6515d">未发布</span>
              </article>
              <footer>
                <span>{{ (item.create_date + item.create_time) | dateToMilldate }}</span>
                <div class="operation">
                  <el-button
                      icon="el-icon-s-promotion"
                      class="view"
                      type="text"
                      @click="issueDesign(item)"
                      v-debounce
                  />
                  <el-button
                      icon="el-icon-view"
                      class="view"
                      type="text"
                      @click="viewDesign(item)"
                      v-debounce
                  />
                  <el-button
                      icon="el-icon-edit"
                      class="edit"
                      type="text"
                      v-if="item.dashboard_status === '0'"
                      @click="openDesign(item)"
                      v-debounce
                  />
                  <el-button
                      icon="el-icon-delete"
                      class="view"
                      type="text"
                      v-if="item.dashboard_status === '0'"
                      @click="delDesign(item)"
                      v-debounce
                  />
                </div>
              </footer>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div
        v-if="pagination && pagination.total > 0"
        class="d-flex align-items-center justify-content-between pb-20"
    >
      <div class="font-14 totalPageTip">
        共&nbsp;{{ pagination.total }}项数据
      </div>
      <el-pagination
          v-if="pagination && pagination.total > 0"
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
</template>

<script>
import {formItems, list} from "./mock";
import {dateFormat, dateToMilldate} from "@/utils/dateconversion";
export default {
  name: "dashboardList",
  data() {
    return {
      formItems,
      list,
      pagination: {
        total: 12,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
    };
  },
  mounted() {
    this.getDashboardList()
  },
  methods: {
    dateToMilldate,
    dateFormat,
    getDashboardList() {
      let params = {
        "pageNum": this.pagination.pageNum,
        "pageSize": this.pagination.pageSize
      }
      this.$executeRequest.execPostByModuleUrl('/dashboardList/gainDashboardListByName', params).then(res => {
        if(res && res.success){
          this.list = res.data.dashboardList
          this.pagination.total = res.data.totalSize
        }
      })
    },
    // 查询
    search(val) {
      let data = {
        "title": val.title,
        "pageNum": this.pagination.pageNum,
        "pageSize": this.pagination.pageSize
      }
      this.$executeRequest.execGetByPostModuleUrl('/dashboardList/gainDashboardListByName', data).then(res => {
        if(res && res.success){
          this.list = res.data.dashboardList
          this.pagination.pageNum = 1
          this.pagination.total = res.data.totalSize
        }
      })
    },
    // 重置
    reset(val) {
      this.formItems.title = Object.assign({}, val);
      this.getDashboardList()
    },
    // 新建
    addDesign() {
      const data = window.microApp.getData();
      data.baseRouer.push({
        path: "/V/dashboard",
        query: {
          type: "add",
        },
      });
    },
    // 发布
    issueDesign(val) {
      if (val.dashboard_status == 1) {
        let data = {
          dashboard_id: val.id,
          title: val.title,
        }
        this.$confirm('此操作将撤销发布, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$executeRequest.execGetByPostModuleUrl('/dashboardList/releaseDashboardInfo', data).then(res => {
            this.$message({
              type: 'success',
              message: '发布成功!'
            });
            this.getDashboardList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          });
        });
      } else {
        let data = {
          dashboard_id: val.id,
          title: val.title,
        }
        this.$confirm('此操作将发布, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$executeRequest.execGetByPostModuleUrl('/dashboardList/releaseDashboardInfo', data).then(res => {
            this.$message({
              type: 'success',
              message: '发布成功!'
            });
            this.getDashboardList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          });
        });
      }
    },
    // 预览
    viewDesign(item) {
      console.log(item, 'hhhhh')
      let routeUrl = this.$router.resolve({
        path: "dashboard/preview",
        query: {
          id: item.id,
        },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 编辑
    openDesign(item) {
      console.log(item, 'sss')
      const data = window.microApp.getData();
      data.baseRouer.push({
        path: "/V/dashboard",
        query: {
          type: "edit",
          id: item.id,
          user_id: item.user_id,
          title: item.title,
          create_date: item.create_date,
          create_time: item.create_time,
          dashboard_status: item.dashboard_status,
        },
      });
    },
    // 删除
    delDesign(row) {
      let data = {
        dashboard_id: row.id,
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$executeRequest.execGetByPostModuleUrl('/dashboardList/deleteDashboardData', data).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getDashboardList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getDashboardList()
    },
    handleCurrentChange(val) {
      this.pagination.pageNum = val;
      this.getDashboardList()
    },
  },
};
</script>

<style lang="less" scoped>
.dashboardList {
  header {
    font-size: 24px;
    text-align: center;
    line-height: 80px;
  }

  .bg {
    width: 100%;
    height: 200px;
    position: relative;
    overflow: hidden;
    margin: 10px 0;
  }

  .bg .bg-img {
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(6px);
    z-index: 2;
  }

  .content {
    width: 100%;
    height: 100%;
    position: absolute;
    color: #fff;
    left: 0;
    top: 0;
    z-index: 3;
  }

  footer {
    width: 100%;
    font-size: 14px;
    padding: 16px;
    line-height: 30px;
    position: absolute;
    box-sizing: border-box;
    z-index: 3;
    bottom: 0;

    .operation {
      float: right;

      .view,
      .edit {
        color: #fff;
        font-size: 14px;
        padding: 0;
      }
    }
  }

  article {
    font-size: 14px;
    padding: 16px;
    line-height: 30px;
    position: absolute;
    box-sizing: border-box;
    z-index: 3;
    bottom: 50px;
  }

  .pagefoot {
    margin-top: 16px;

    .totalPageTip {
      color: @label-color;
      font-family: @hansan;
    }
  }

  .title {
    .el-button--primary {
      width: 82px;
      height: 32px;
      padding: 8px 0;
    }
  }
}
</style>
