<template>
  <div class="consumerManage">
    <el-row>
      <span style="color: #2196f3;font-size: 18px">消费审核</span>
    </el-row>
    <el-divider></el-divider>
    <el-table stripe :data="tableConsumer" border>
      <el-table-column label="序号" align="center" width="70">
        <template scope="scope">
          <span>{{ scope.$index + (currentConPage - 1) * pageConSize + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="produce_user" label="生产用户" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="consume_user" label="申请消费用户" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="sdm_receive_name" label="任务名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="topic_name" label="主题名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="application_status" label="状态" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="审核" align="center" width="300">
        <template slot-scope="scope">
          <el-button v-if="scope.row.application_status == '申请中'" size="mini" type="info"
                     @click="userApplicationPass(scope.$index, scope.row)">审核通过
          </el-button>
          <el-button v-if="scope.row.application_status == '申请中'" size="mini" type="danger"
                     @click="userApplicationNoPass(scope.$index, scope.row)">审核不通过
          </el-button>
          <p v-else>无需操作</p>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="pagination" style="margin-top: 10px;">
      <el-pagination @size-change="handleConsumerSizeChange" @current-change="handleConsumerCurrentChange"
                     :current-page="currentConPage" :page-sizes="[10, 50, 100, 200]" :page-size="pageConSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalConSize"/>
    </el-row>
  </div>
</template>
<script>


export default {
  data() {
    return {
      //消费审核分页相关
      currentConPage: 1,
      totalConSize: 0,
      pageConSize: 10,
      tableConsumer: [],
    };
  },
  mounted() {
    //页面初始化分页查询消费审核信息
    this.searchUserApplication(this.currentConPage, this.pageConSize);
  },
  methods: {
    //分页查询消费审核信息
    searchUserApplication(page, size) {
      // var data = {currPage: page, pageSize: size};
      var data ={};
      data.currPage = page;
      data.pageSize = size;
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/userpermission/searchUserApplication', data).then(res => {
        this.tableConsumer = res.data.sdmUserPermissions
        this.totalConSize = res.data.totalSize
      });
    },
    //更改流数据申请状态,申请审核通过
    userApplicationPass(index, row) {
      this.$confirm('确认审核通过?', '提示', {
        cancelButtonText: '否',
        confirmButtonText: '是',
        type: 'warning',
      }).then(() => {
        var data = {app_id: row.app_id};
        this.$executeRequest.execPostByModuleUrl('/dataCollectionM/userpermission/userApplicationPass', data).then((res) => {
          if (res && res.success) {
            this.$message({
              type: 'success',
              message: '审核通过!'
            })
            this.searchUserApplication(this.currentConPage, this.pageConSize);
          }
        })
      }).catch(() => {
        this.$message.info('取消操作')
      })
    },
    //更改流数据申请状态,申请审核不通过
    userApplicationNoPass(index, row) {
      this.$confirm('确认审核不通过?', '提示', {
        cancelButtonText: '否',
        confirmButtonText: '是',
        type: 'warning',
      }).then(() => {
        var data = {app_id: row.app_id};
        this.$executeRequest.execPostByModuleUrl('/dataCollectionM/userpermission/userApplicationNoPass', data).then((res) => {
          if (res && res.success) {
            this.$message({
              type: 'success',
              message: '审核不通过!'
            })
            this.searchUserApplication(this.currentConPage, this.pageConSize);
          }
        })
      }).catch(() => {
        this.$message.info('取消操作')
      })
    },
    handleConsumerSizeChange(val) {
      this.pageConSize = val
      // 点击每页显示的条数时，显示第一页
      this.searchUserApplication(this.currentConPage, this.pageConSize);
    },
    handleConsumerCurrentChange(val) {
      this.currentConPage = val
      // 切换页码时，要获取每页显示的条数
      this.searchUserApplication(this.currentConPage, this.pageConSize);
    },
  },
}
</script>