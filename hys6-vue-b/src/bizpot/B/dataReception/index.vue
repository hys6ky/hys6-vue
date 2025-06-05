<template>
  <div>
    <div class="d-flex py-10 justify-content-between">
      <ByHeaderSlice title="数据接收列表"/>
      <div>
        <el-button type="primary" size="small" @click="addDataReception">新增</el-button>
        <el-button size="small" @click="batchPublishing">批量发布</el-button>
      </div>
    </div>
    <el-table stripe :data="receptionTableData" border style="width: 100%" :header-cell-style="{'text-align':'center'}"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" width="70" align="center" type="index" :index="hIndex">
      </el-table-column>
      <el-table-column prop="dr_task_name" label="任务名称" align="center"></el-table-column>
      <el-table-column show-overflow-tooltip prop="dr_url" label="URL地址" align="center"></el-table-column>
      <el-table-column prop="dr_request_method" label="请求方式" align="center">
        <template slot-scope="scoped">
          <span v-if="scoped.row.dr_request_method === '1'">GET</span>
          <span v-else="scoped.row.dr_request_method === '2'">POST</span>
        </template>
      </el-table-column>
      <el-table-column prop="dr_file_name" label="文件名称" align="center"></el-table-column>
      <el-table-column prop="dr_plane_url" label="数据落地目录" align="center"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="230">
        <template slot-scope="scope">
          <el-button type="success" size="mini" round @click="sendTask(scope.row)">发布</el-button>
          <el-button type="primary" size="mini" round @click="editBtn(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" round @click="taskDelBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;margin-top: 15px">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total='totalSize'>
      </el-pagination>
    </div>

  </div>
</template>
<script>


import {execGetByPostModuleUrl} from "@/utils/executeRequest";

export default {
  data() {
    return {
      totalSize: 0,
      pageNum: 1,
      pageSize: 10,
      receptionTableData: [],
      editCanShu: {
        dr_task_name: '',
        dr_url: '',
        dr_request_method: '',
        drFormat: '',

      },
      dialogDataCanShu: false,
      selectedItems: [], // 存储选中的发布项

      CollectType: [],
      type: '',
      id: '',
      ParamPlaceholder: '',
      CollectTypeData: [],
      // collect_type: false,
    };
  },
  mounted() {
    this.getSourceInfoList();
  },
  methods: {
    addDataReception() {
      this.$router.push({
        name: 'parameterNew',
        query: {
          isAdd: true,
        }
      })
    },
    // 复选框选中的状态
    handleSelectionChange(selection) {
      // console.log(selection)
      this.selectedItems = selection;
    },
    // 批量发布
    batchPublishing() {
      if (this.selectedItems.length === 0) {
        this.$message.warning("请选择要发布的项");
        return;
      }
      let task_id = [];
      this.selectedItems.forEach(item => {
        task_id.push(item.dr_task_id)
      })
      this.$router.push({
        name:"dataReceptionJob",
        query:{
          task_id : task_id
        }
      })
      // this.$confirm("确定要发布所选项吗?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "info",
      // }).then(() => {
      //   let BatchAnals = []
      //   // 执行批量发布操作
      //   this.selectedItems.forEach((item) => {
      //     const obj = {
      //       dr_task_id: item.dr_task_id,
      //       drParams: null
      //     }
      //     BatchAnals.push(obj)
      //   })
      //   this.$executeRequest.execPostByModuleUrl('/dataReception/batchAnalData', BatchAnals).then((res) => {
      //     // console.log(res, '批量发布')
      //     if (res.success) {
      //       this.selectedItems = [];
      //       this.getSourceInfoList()
      //       this.$message.success("发布成功");
      //     }
      //   })
      // }).catch(() => {
      //   this.$message.info("已取消发布");
      // });
    },
    // 获取列表参数
    getSourceInfoList() {
      this.$executeRequest.execGetByPostModuleUrl('/dataReception/queryReceiveTask', {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        // console.log(res)
        this.receptionTableData = res.data.ReceiveTaskList
        this.totalSize = res.data.total;
      })
    },
    // 发布按钮
    sendTask(row) {
      this.$router.push({
        name: "dataReceptionJob",
        query:{
          task_id:row.dr_task_id
        }
      });
      // console.log(row,'发布数据')
      // let sentData = {
      //   dr_task_id: row.dr_task_id
      // }
      // this.$executeRequest.execGetByPostModuleUrl('/dataReception/unloadAnalData', sentData).then((res) => {
      //   if (res.success) {
      //     // console.log(res, '发布数据')
      //     this.getSourceInfoList()
      //     this.$message.success('发布数据成功')
      //   }
      // })
    },
    editBtn(row) {
      // console.log(row, '编辑数据展示')
      let showData = {
        dr_task_id: row.dr_task_id
      }
      this.$executeRequest.execGetByPostModuleUrl('/dataReception/queryTaskAndFile', showData).then((res) => {
        if (res.success) {
          // console.log(res, '回显的信息')
          console.log(res.data.taskInfo.paramList),

          this.$router.push({
            name: 'parameterNew',
            query: {
              isEdit: true,
              drTask: {
                dr_task_id: res.data.taskInfo.dr_task_id,
                dr_task_name: res.data.taskInfo.dr_task_name,
                dr_format: res.data.taskInfo.dr_format,
                dr_request_method: res.data.taskInfo.dr_request_method,
                dr_url: res.data.taskInfo.dr_url
              },

              paramList: res.data.taskInfo.paramList,
              fileDef: {
                dr_file_id: res.data.fileInfo.dr_file_id,                   //文件ID
                dr_task_id: res.data.fileInfo.dr_task_id,                   //任务ID
                dr_file_name: res.data.fileInfo.dr_file_name,               //文件名称
                dr_file_suffix: res.data.fileInfo.dr_file_suffix,           //文件后缀
                dr_row_separator: res.data.fileInfo.dr_row_separator,       //行分隔符
                dr_database_separator: res.data.fileInfo.dr_database_separator,   //列分隔符
                dr_database_code: res.data.fileInfo.dr_database_code,             //编码格式
                dr_plane_url: res.data.fileInfo.dr_plane_url,                     //数据落地目录
                dbfile_format: res.data.fileInfo.dbfile_format,                   //文件格式
                is_header: res.data.fileInfo.is_header,                           //是否需要表头
                df_remark: res.data.fileInfo.df_remark,
                dr_is_flag:  res.data.fileInfo.dr_is_flag,     //是否是标识文件
              },
              drAnalyses: res.data.taskInfo.analysisList,
            }
          })
        }
      })
    },
    // 删除按钮
    taskDelBtn(row) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          dr_task_id: row.dr_task_id
        }
        this.$executeRequest.execGetByPostModuleUrl('/dataReception/deleteReceiveTask', data).then((res) => {
          if (res.success) {
            // console.log(res, '这里是删除')
            this.getSourceInfoList();
            this.$message('成功删除')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSizeChange(val) {
      // console.log(val,'当前页数大小')
      this.pageSize = val;
      // let params = {};
      // params["pageNum"] = this.pageNum;
      // params["pageSize"] = val;
      this.getSourceInfoList()

    },
    handleCurrentChange(val) {
      // console.log(val,'当前页')
      this.pageNum = val;
      // let params = {};
      // params["pageNum"] = val;
      // params["pageSize"] = this.pageSize;

      this.getSourceInfoList()
    },
    hIndex(index) {
      return (this.pageNum - 1) * this.pageSize + index + 1;
    },

  }

}
;
</script>
<style scoped>

</style>
