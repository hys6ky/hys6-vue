<template>
  <div style="padding: 10px">
    <el-form :model="ruleForm" status-icon inline ref="ruleForm" size="small" label-width="100px"
             class="demo-ruleForm">
      <el-form-item label="目标表" prop="datatable_en_name">
        <el-input disabled v-model.number="ruleForm.module_table_en_name" placeholder="请填写目标表"></el-input>
      </el-form-item>
      <el-form-item label="任务编号" prop="task_number">
        <el-input disabled v-model="ruleForm.task_number" placeholder="请填写任务编号" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="任务名称" prop="task_name">
        <el-input disabled v-model.number="ruleForm.task_name" placeholder="请填写任务名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addTempJobTableLine">增加作业</el-button>
        <!--                <el-button type="success" @click="addTempJobTable('tableDataFrom');">保 存</el-button>-->
        <el-button type="danger" @click="retdataPro();">返 回</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe :data="tableRule.batchList" border size="medium" max-height="760">
      <el-table-column prop="jobtab_step_number" sortable label="作业序号" width="130"></el-table-column>
      <el-table-column prop="jobtab_view_sql" label="作业SQL" align="center">
        <template slot-scope="scope">
          <el-input type="textarea" :rows="1" v-model="scope.row.jobtab_view_sql" size="small" disabled
                    placeholder="SQL处理步骤">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="jobtab_en_name" label="输出表名" align="center" width="200"></el-table-column>
      <el-table-column prop="jobtab_is_temp" label="是否临时表" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.jobtab_is_temp === isFlag.Fou ? "否" : "是" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="text" style="margin-right:10px" class="editcolor"
                     @click="edit(scope.$index, scope.row);">编辑
          </el-button>
          <el-popover placement="top" v-model="scope.row.visible">
            <p style="text-align: right; min-height:30px;"><i class="el-icon-info"></i>&nbsp;确定删除此配置信息吗
              ？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="info" @click="scope.row.visible = false">取消</el-button>
              <el-button type="danger" size="mini"
                         @click="scope.row.visible = false; deleteBatch(scope.$index, scope.row)">确定
              </el-button>
            </div>
            <el-button slot="reference" class="delcolor" type="text">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import validator from '@/utils/validator';

export default {
  data() {
    return {
      rule: validator,
      datatable_id: '',
      data_mart_id: '',
      category_id: '',
      dsl_id: null,
      ruleForm: {
        module_table_en_name: '',
        task_number: '',
        task_name: '',
      },
      tableRule: {
        batchList: [],
      },
      isFlag: {},
      allsqlengine: [],
      params: {},
      module_table_default_name: ""
    }
  },
  mounted() {
    this.$Code.getCodeItems({
      category: 'IsFlag'
    }).then(res => {
      this.isFlag = res.data
    });
    this.$Code.getCodeItems({
      category: 'SqlEngine'
    }).then(res => {
      this.allsqlengine = res.data
    });
    this.repJodData()
  },
  methods: {
    // 新增页面跳转
    addTempJobTableLine() {
      sessionStorage.setItem("params", JSON.stringify({
        data_mart_id: this.data_mart_id,
        category_id: this.category_id,
        // dsl_id: this.dsl_id,
        task_id: this.params.task_id,
        module_table_default_name: this.module_table_default_name,
        sourceDataTable_id: this.datatable_id, //使用的datatable_id 为 数据表id  是有值的
        step_number: this.tableRule.batchList.length + 1
      }));
      this.$router.push({
        name: 'addJobTable',
      })
    },
    // 编辑
    edit(index, row) {
      sessionStorage.setItem("params", JSON.stringify({
        // index: index,
        data_mart_id: this.data_mart_id,
        category_id: this.category_id,
        dsl_id: this.dsl_id,
        task_id: row.task_id,
        module_table_default_name: this.module_table_default_name,
        sourceDataTable_id: this.datatable_id, //这个是为数据表准备的
        datatable_id: row.module_table_id,  //这个是为临时表准备的  临时表的时候为空
        step_number: row.jobtab_step_number,
        is_temp: row.jobtab_is_temp,
        job_table_id: row.jobtab_id,
        job_table_view_sql: row.jobtab_view_sql,
        job_table_en_name: row.jobtab_en_name,
        job_table_cn_name: row.jobtab_cn_name,
        //id: row.id,
      }));
      this.$router.push({
        name: 'editJobTable',
        query:{
          datatable_id: row.module_table_id,
          job_table_view_sql: row.jobtab_view_sql,
        }
      })
    },
    // 获取作业表中的信息
    getTempTableJobData(job_id) {
      this.$executeRequest.execGetByModulName("/market/dmJobTableInfo/findJobs", {
        taskId: job_id
      }).then(res => {
        if (res.success) {
          res.data.forEach(data => {
            data.jobtab_view_sql = data.jobtab_view_sql.replace(/\n/g, ' ')
          });
          this.tableRule.batchList = res.data
        }
      })
    },
    // 获取作业与模型表信息
    getJobDataInfoById() {
      this.$executeRequest.execGetByModulName("/market/dmTaskInfo/findDmTaskInfoById", {
        dmTaskInfoId: this.params.task_id,
        //datatable_id: this.params.datatable_id,
        //id: this.id,
      }).then((res) => {
        if (res && res.success) {
          this.ruleForm.task_number = res.data.task_number;
          this.ruleForm.module_table_en_name = res.data.module_table_en_name;
          this.ruleForm.task_name = res.data.task_name;
        }
      });
    },
    deleteBatch(index, row) {
      let param = {
        // module_table_id: row.module_table_id,
        job_table_id: row.jobtab_id,
        // table_name: row.jobtab_en_name
      }
      this.$executeRequest.execGetByModulName("/market/delJob", param).then(res => {
        if (res.success) {
          this.getTempTableJobData(this.params.task_id);
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }
      })
    },
    // addTempJobTable(formName) {
    //     this.$refs[formName].validate((valid) => {
    //         if (valid) {
    //             let param = new FormData();
    //             param.append("jobData",JSON.stringify(this.tableRule.batchList))
    //             param.append("dsl_id",this.dsl_id)
    //             functionAll.addTempJobData(param).then(res => {
    //               if (res && res.success) {
    //                 sessionStorage.setItem("params",JSON.stringify({
    //                   dsl_id: this.dsl_id,
    //                   data_mart_id: this.data_mart_id,
    //                   category_id: this.category_id,
    //                   datatable_id: this.datatable_id,
    //                   job_id: this.params.job_id
    //                 }))
    //                 this.$router.push({
    //                   name: 'market'
    //                 });
    //               }
    //             })
    //         } else {
    //             this.$Msg.customizTitle('有数据未填写', 'warning')
    //         }
    //     });
    // },
    closed() {
    },
    handleClose() {
      this.$Msg.confirmMsg('确定离开吗？离开将丢失此次增加的数据信息!!!')
          .then(_ => {
            this.drawer = false;
          })
          .catch(_ => {
          });
    },
    // 返回页面
    retdataPro() {
      sessionStorage.setItem("params", JSON.stringify({
        dsl_id: this.dsl_id,
        data_mart_id: this.data_mart_id,
        category_id: this.category_id,
        datatable_id: this.datatable_id
      }))
      this.$router.push({
        name: 'market'
      });
    },
    // 接受页面跳转数据
    repJodData() {
      this.params = JSON.parse(sessionStorage.getItem("params"));
      this.ruleForm.task_id = this.params.task_id;
      this.dsl_id = this.params.dsl_id;
      this.module_table_default_name = this.params.module_table_default_name;
      this.getJobDataInfoById();
      this.getTempTableJobData(this.ruleForm.task_id);
      this.data_mart_id = this.params.data_mart_id;
      this.category_id = this.params.category_id;
      if (this.params.datatable_id == '0' || typeof (this.params.datatable_id) == 'undefined') {
        this.datatable_id = this.params.sourceDataTable_id;
      } else {
        this.datatable_id = this.params.datatable_id;
      }
    },
  },
  // destroyed() {
  // 清空数据
  // if (this.$route.path !== "/processingManagement" && this.$route.path !== "/addJob" && this.$route.path !== "/tempTable") {
  //   sessionStorage.clear();
  // }
  // },
}
</script>

<style scoped>
</style>
