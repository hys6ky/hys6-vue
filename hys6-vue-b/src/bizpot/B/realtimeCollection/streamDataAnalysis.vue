<template>
  <div class="streamDataAnalysis">
    <el-row class="elRows">
      <span class='el-icon-location'>任务列表</span>
      <router-link :to="{name:'realtimeCollection'}">
        <el-button type="primary" size="small" class="goIndex">
          <i class="el-icon-s-home"></i>返回首页
        </el-button>
      </router-link>
      <el-button type="primary" size="small" class="addTaskButtonCSS" @click="addStreamTask(null,'create')">
        <i class="el-icon-circle-plus-outline" style="margin-right:5px"/>添加任务
      </el-button>
    </el-row>
    <div class="lines"></div>
    <!-- 页面表单内容 -->
    <div>
      <el-table stripe :data="tableData" border size="medium" :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ 'text-align': 'center' }">
        <el-table-column type="index" label="序号" width="90" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + (currentPage - 1) * pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ssj_job_name" min-width="120" label="任务名称" show-overflow-tooltip
                         align="center"></el-table-column>
        <el-table-column label="流处理框架" min-width="200" prop="ssj_strategy"></el-table-column>
        <el-table-column label="任务描述" min-width="200" prop="ssj_job_desc"></el-table-column>
        <el-table-column label="执行频率" min-width="60" prop="streaming_duration"></el-table-column>
        <el-table-column label="下一步设置" min-width="280" prop="ssj_job_id">
          <template scope="scope">
            <el-button size="medium" type="text"
                       @click="nextStep(scope.row.ssj_job_id, 'consunmptionInput',scope.row.ssj_job_name,'edit',)">输入
            </el-button>
            ->
            <el-button size="medium" type="text"
                       @click="nextStep(scope.row.ssj_job_id, 'dataConsumptionAnalysis',scope.row.ssj_job_name,'edit')"
                       style="margin-left: -5px">分析
            </el-button>
            ->
            <el-button size="medium" type="text"
                       @click="nextStep(scope.row.ssj_job_id, 'dataConsumptionOutput',scope.row.ssj_job_name,'edit')"
                       style="margin-left: -5px">输出
            </el-button>
            ->
            <el-button size="medium" type="text"
                       @click="nextStep(scope.row.ssj_job_id, 'startupParameters',scope.row.ssj_job_name,'edit')"
                       style="margin-left: -5px">作业参数
            </el-button>
            ->
            <el-button size="medium" type="text" @click="startUp(scope.row.ssj_job_id)" style="margin-left: -5px">启动
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="140" prop="" align="center">
          <template scope="scope">
            <el-button size="mini" type="primary" @click="addStreamTask(scope.row,'edit')">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteTask(scope.row.ssj_job_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页内容 -->
    <el-row class="pagination">
      <el-pagination @current-change="handleCurrentChangeList" :current-page="currentPage"
                     @size-change="handleSizeChange" :page-sizes="[5, 10, 20]" :page-size="pageSize"
                     layout=" total,sizes,prev, pager, next,jumper" :total="totalSize"></el-pagination>
    </el-row>
    <!-- 新增任务弹窗 -->
    <el-dialog :visible.sync="addDialogVisible" width="450px" title="添加任务" :before-close="beforeClose">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">添加任务</span>
      </div>
      <el-form ref="resultForm" :model="resultForm" label-position="right" label-width="100px">
        <el-form-item label=" 任务名称" prop="ssj_job_name" :rules="filter_rules([{ required: true }])">
          <el-input v-model="resultForm.ssj_job_name" autocomplete="off" placeholder="请输入任务名称"
                    style="width: 284px"></el-input>
        </el-form-item>
        <el-form-item label=" 流处理框架" :rules="rule.selected">
          <el-input :disabled='true' autocomplete="off" placeholder="Spark" style="width: 284px"></el-input>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input type="textarea" v-model="resultForm.ssj_job_desc" autocomplete="off" placeholder="任务描述"
                    style="width: 284px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
            <el-button type="danger" size="small" @click="beforeClose()">取 消</el-button>
            <el-button type="primary" size="small" @click="saveNewTask()">保 存</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";

export default {
  data() {
    return {
      formLabelWidth: "150px",
      rule: validator.default,
      addDialogVisible: false,
      tableData: [],
      totalSize: null,
      currentPage: 1,
      pageSize: 10,
      resultForm: {
        ssj_job_name: '',
        ssj_job_desc: '',
        ssj_strategy: 'spark',
      },
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    //启动任务
    startUp(id) {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/startparametermanage/startTask', {
        ssj_job_id: id
      }).then((res) => {
        if (res.data == '1') {
          this.$message({
            message: '启动成功',
            type: 'success'
          })
        }
      })
    },
    //页面数据初始化，获取table信息
    getTableData() {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/selectTaskList', {
        currPage: this.currentPage,
        pageSize: this.pageSize,
      }).then((res) => {
        this.tableData = res.data.paramInfo;
        this.totalSize = res.data.totalSize;
      });
    },
    // 任务下一步操作，传出ssj_job_id
    nextStep(id, url, ssj_job_name, type) {
      this.$router.push({name: url, query: {ssj_job_id: id, ssj_job_name, type}});
    },
    //  保存新添加的任务
    saveNewTask() {
      this.$refs.resultForm.validate((valid) => {
        if (valid) {
          if (type == 'create') {
            this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmdataconsume/saveTask', this.resultForm).then((res) => {
              if (res && res.success) {
                this.$Msg.saveSuccess(res)
                this.nextStep(res.data, 'consunmptionInput', this.resultForm.ssj_job_name, type)
              }
              this.beforeClose()
            })

          } else {
            this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/updateTask', this.resultForm).then((res) => {
              if (res && res.success) {
                this.$Msg.updateSuccess(res);
              }
              this.beforeClose()
            });
          }
        }
      })
    },
    // 重置弹窗表单值
    reset() {
      this.resultForm.ssj_job_name = '';
      this.resultForm.ssj_job_desc = '';
      this.resultForm.ssj_strategy = 'spark';
    },
    //  取消添加新任务
    beforeClose() {
      this.addDialogVisible = false
      this.reset()
      this.getTableData();
    },
    // 新增任务，编辑任务信息（根据传入的Type来区分是新增还是编辑）
    addStreamTask(data, type) {
      window.type = type
      this.addDialogVisible = true
      if (type == 'edit') {
        this.resultForm = data;
      } else {
        this.reset()
        delete this.resultForm.streaming_duration;
        delete this.resultForm.ssj_job_id;
        delete this.resultForm.user_id;
      }
    },
    // 删除任务
    deleteTask(ssj_job_id) {
      this.$confirm('确认删除该任务！', '确定删除？', {
        cconfirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/deleteTask', {ssj_job_id})
            .then((res) => {
              this.$Msg.deleteSuccess(res)
              this.getTableData();
            })
      }).catch(() => [
          this.$message.info('取消删除')
      ])
    },
    //用户列表数据实现分页功能
    handleCurrentChangeList(val) {
      this.currentPage = val;
      this.getTableData();
    },
    // 改变每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleCurrentChangeList(1);
    },
  },
};
</script>

<style scoped>
.addTaskButtonCSS {
  float: right;
  margin-right: 10px;
}

.el-row span {
  color: #2196f3;
  font-size: 18px;
}

.elRows {
  height: 40px;
  line-height: 40px;
}

.lines {
  margin-top: 4px;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}

.pagination {
  margin-top: 20px;
}

.el-pagination {
  text-align: center;
}
</style>
