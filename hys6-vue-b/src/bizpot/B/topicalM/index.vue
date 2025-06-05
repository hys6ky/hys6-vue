<template>
  <div class="dataManage">
    <el-row class="loheadertopic">
      <span style="color: #2196f3;font-size: 18px">消息主题</span>
      <el-button type="primary" class="el1 els"
                 @click="dialogFormTopicAdd = true;searchSdmTopicInfo(currentPage,pageSize);" size="small">
        <i class="el-icon-folder-add "></i> 添加消息主题
      </el-button>
    </el-row>
    <el-divider></el-divider>
    <el-table stripe :data="tabletopic" border>
      <el-table-column label="序号" align="center">
        <template v-slot="scope">
          <span>{{ scope.$index + (currentPageZhuTi - 1) * pageSizeZhuTi + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sdm_top_name" label="消息主题英文名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="sdm_top_cn_name" label="消息主题中文名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="create_dateFormat" label="创建时间" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="sdm_zk_host" label="控制节点" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="sdm_partition" label="分区数" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="sdm_replication" label="副本值个数" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="sdm_top_value" label="消息主题描述" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template v-slot="scope">
          <el-button size="mini" type="primary"
                     @click="dialogFormTopicUpdate = true;handleEditZhuTi(scope.$index, scope.row);">编辑
          </el-button>
          <el-button size="mini" type="danger"
                     @click="deleteSdmTopicInfo(scope.$index, scope.row);">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="pagination">
      <el-pagination @size-change="handleSizeChangeZhuTi" @current-change="handleCurrentChangeZhuTi"
                     :current-page="currentPageZhuTi" :page-sizes="[10, 20, 50, 100]" :page-size="pageSizeZhuTi"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalSizeZhuTi"/>
    </el-row>

    <!------------    添加主题    --------------->
    <el-dialog title="添加消息主题" :visible.sync="dialogFormTopicAdd" width="40%" :before-close="beforeClose">
      <el-form :model="formTopicAdd" ref="formTopicAdd">
        <el-form-item label="消息主题英文名称" :label-width="formLabelWidth" prop="sdm_top_name"
                      :rules="filter_rules([{required: true,dataType:'noLengthVaild'}])">
          <el-input v-model="formTopicAdd.sdm_top_name" autocomplete="off" placeholder="消息主题英文名称"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label="消息主题中文名称" :label-width="formLabelWidth" prop="sdm_top_cn_name"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="formTopicAdd.sdm_top_cn_name" autocomplete="off" placeholder="消息主题中文名称"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label="控制节点" :label-width="formLabelWidth" prop="sdm_zk_host"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="formTopicAdd.sdm_zk_host" autocomplete="off" placeholder="控制节点"
                    style="width:284px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分区数" :label-width="formLabelWidth" prop="sdm_partition"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="formTopicAdd.sdm_partition" autocomplete="off" placeholder="分区数"
                    style="width:284px">
          </el-input>
        </el-form-item>
        <el-form-item label="副本值个数" :label-width="formLabelWidth" prop="sdm_replication"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="formTopicAdd.sdm_replication" autocomplete="off" placeholder="副本值个数"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label="消息主题描述" :label-width="formLabelWidth" prop="sdm_top_value">
          <el-input type="textarea" v-model="formTopicAdd.sdm_top_value" autocomplete="off"
                    placeholder="消息主题描述" style="width:284px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleAdd" size="mini" type="danger">取 消</el-button>
        <el-button style="width: 120px" type="primary" @click="saveExistSdmTopicInfo('formTopicAdd')" size="mini">
          登记已存在的主题
        </el-button>
        <el-button style="width: 120px" type="primary" @click="saveSdmTopicInfo('formTopicAdd')" size="mini">
          添加并创建新主题
        </el-button>
      </div>
    </el-dialog>
    <!--更新主题-->
    <el-dialog title="更新消息主题" :visible.sync="dialogFormTopicUpdate" width="40%" :before-close="beforeClose">
      <el-form :model="formTopicUpdate" ref="formTopicUpdate">
        <el-form-item label="消息主题英文名称" :label-width="formLabelWidth" prop="sdm_top_name"
                      :rules="filter_rules([{required: true,dataType:'noLengthVaild'}])">
          <el-input v-model="formTopicUpdate.sdm_top_name" autocomplete="off" placeholder="消息主题英文名称"
                    style="width:284px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="消息主题中文名称" :label-width="formLabelWidth" prop="sdm_top_cn_name"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="formTopicUpdate.sdm_top_cn_name" autocomplete="off" placeholder="消息主题中文名称"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label="控制节点" :label-width="formLabelWidth" prop="sdm_zk_host"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="formTopicUpdate.sdm_zk_host" autocomplete="off" placeholder="控制节点"
                    style="width:284px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分区数" :label-width="formLabelWidth" prop="sdm_partition"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="formTopicUpdate.sdm_partition" autocomplete="off" placeholder="分区数"
                    style="width:284px"></el-input>
        </el-form-item>
        <el-form-item label="副本值个数" :label-width="formLabelWidth" prop="sdm_replication"
                      :rules="filter_rules([{required: true}])">
          <el-input v-model="formTopicUpdate.sdm_replication" autocomplete="off" placeholder="副本值个数"
                    style="width:284px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="消息主题描述" :label-width="formLabelWidth" prop="sdm_top_value">
          <el-input type="textarea" v-model="formTopicUpdate.sdm_top_value" autocomplete="off"
                    placeholder="消息主题描述" style="width:284px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleAdd" size="mini" type="danger">取 消</el-button>
        <el-button type="primary" @click="updateSdmTopicInfo('formTopicUpdate')" size="mini">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>

import * as validator from "@/utils/validator";

export default {
  data() {
    return {
      formLabelWidth: "150px",
      // 消息主题添加
      formTopicAdd: {
        sdm_top_name: "",
        sdm_top_cn_name: "",
        sdm_zk_host: "",
        sdm_partition: "",
        sdm_replication: "",
        sdm_top_value: ""
      },
      dialogFormTopicAdd: false,
      dialogFormTopicUpdate: false,
      rule: validator.default,
      formTopicUpdate: {},
      // 主题分页
      currentPageZhuTi: 1,
      pageSizeZhuTi: 10,
      totalSizeZhuTi: 0,
      tabletopic: [],
      currentPage: 1,
      currentPageList: 1,
      pageSize: 5,
    };
  },
  mounted() {
    // 页面初始化查询主题信息
    this.searchSdmTopicInfo(this.currentPageZhuTi, this.pageSizeZhuTi);
  },
  methods: {
    // 关闭弹框之前
    beforeClose() {
      // 表单清空
      this.formTopicAdd = {};
      this.formTopicUpdate = {};
      // 隐藏对话框
      this.dialogFormTopicAdd = false;
      this.dialogFormTopicUpdate = false;
      this.$refs.formTopicAdd.resetFields();
      this.$refs.formTopicUpdate.resetFields();
    },
    // 点击添加弹出框的取消按钮
    cancleAdd() {
      // 表单清空
      this.formTopicAdd = {};
      this.formTopicUpdate = {};
      this.dialogFormDataSourceAdd = false;
      this.dialogFormTopicAdd = false;
      this.dialogFormTopicUpdate = false;
      this.$refs.formTopicAdd.resetFields();
      this.$refs.formTopicUpdate.resetFields();
    },
    // 分页查询主题信息
    searchSdmTopicInfo(page, size) {
      var data = {currPage: page, pageSize: size};
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/topic/searchSdmTopicInfo', data).then(res => {
        this.tabletopic = res.data.sdmTopic
        this.totalSizeZhuTi = res.data.totalSize
        this.formTopicAdd.sdm_zk_host = res.data.zk_host;
        res.data.sdmTopic.forEach(val => {
          val.create_dateFormat = this.$Date.dateFormat(val.create_date) + " " + this.$Date.hourFormat(val.create_time);
        })
      });
    },
    // 创建并添加新的主题
    saveSdmTopicInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 调用添加方法
          // 来源为默认
          this.formTopicAdd.topic_source = 1;
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/topic/saveSdmTopicInfo', this.formTopicAdd).then(res => {
            if (res && res.success) {
              this.$Msg.customizTitle('添加成功', 'success')
              this.$emit("addEvent");
              // 隐藏对话框
              this.dialogFormTopicAdd = false;
              // 表单清空
              this.formTopicAdd = {};
              this.searchSdmTopicInfo(this.currentPageZhuTi, this.pageSizeZhuTi);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 登记已存在的主题
    saveExistSdmTopicInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 调用添加方法
          this.$executeRequest.execPostByModuleUrl('/dataCollectionM/topic/saveExistSdmTopicInfo', this.formTopicAdd).then(res => {
            if (res && res.success) {
              this.$Msg.customizTitle('登记成功', 'success')
              this.$emit("addEvent");
              // 隐藏对话框
              this.dialogFormTopicAdd = false;
              // 表单清空
              this.formTopicAdd = {};
              this.searchSdmTopicInfo(this.currentPageZhuTi, this.pageSizeZhuTi);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 更新主题信息
    updateSdmTopicInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formTopicUpdate["id"] = this.id;
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/topic/updateSdmTopicInfo', this.formTopicUpdate).then((res) => {
            if (res && res.success) {
              this.$message({
                type: 'success',
                message: '更新成功!'
              })
              this.dialogFormTopicUpdate = false;
              this.formTopicUpdate = {};
              this.searchSdmTopicInfo(this.currentPageZhuTi, this.pageSizeZhuTi);
            }
          })
        } else {
          return false;
        }
      });
    },
    // 获取表格当前行数据
    handleEditZhuTi(index, row) {
      this.id = row.id;
      this.formTopicUpdate = Object.assign({}, row);
    },
    //删除主题
    deleteSdmTopicInfo(index, row) {
      this.$confirm('确认删除该主题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        var data = {topic_id: row.topic_id};
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/topic/deleteSdmTopicInfo', data).then((res) => {
          if (res && res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.searchSdmTopicInfo(this.currentPageZhuTi, this.pageSizeZhuTi);
          }
        })
      }).catch(() => {
        this.$message.info('取消操作')
      })
    },
    handleSizeChangeZhuTi(val) {
      this.pageSizeZhuTi = val
      // 点击每页显示的条数时，显示第一页
      this.searchSdmTopicInfo(this.currentPageZhuTi, this.pageSizeZhuTi);
    },
    handleCurrentChangeZhuTi(val) {
      this.currentPageZhuTi = val
      // 切换页码时，要获取每页显示的条数
      this.searchSdmTopicInfo(this.currentPageZhuTi, this.pageSizeZhuTi);
    },
  },
}
</script>

<style>
.loheadertopic {
  height: 34px;
  line-height: 34px;
}

.els {
  float: right;
  margin-right: 2%;
}

.el1 {
  margin-left: 10px;
}
.pagination{
  margin-top: 10px;
}
</style>