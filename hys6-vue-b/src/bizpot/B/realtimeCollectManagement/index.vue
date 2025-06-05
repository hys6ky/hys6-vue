<template>
  <div id="realtimeCollectManagement">
    <el-tabs :tab-position="tabPosition" type="border-card">
      <el-tab-pane label="数据源列表">
        <el-row class="loheaderRow">
          <span>数据源列表</span>
          <el-button type="primary" class="el1 els" @click="dialogFormDataSourceAdd = true" size="small">
            <i class="el-icon-s-help"></i> 添加数据源
          </el-button>
        </el-row>
        <el-divider></el-divider>
        <div style="display: flex;">
          <div class="dataSheetmainDiv" v-for="(item,index) in dataAgent" :key="index">
            <div @click="gotoScoureDetail(index)">
              <i class="el-icon-s-data" style="font-size: 50px;color: #fff;"></i>
              <p style="font-size: 16px;color: #fff;">{{ item.sdm_source_name }}</p>
              <p class="postionP">Agent个数为 {{ item.sumSdmAgent }}</p>
              <span>{{ item.sumSdmAgent }}</span>
            </div>
            <div class="boxshletr">
              <el-button type="text" class="editBtn"
                         @click="dialogFormDataSourceUpdate = true;clickEditButton(index)">
                <i class="el-icon-edit" style="font-size: 20px;color: #fff;"></i>
              </el-button>
              <el-button type="text" class="editBtn" v-if="item.sumSdmAgent == 0" @click="deleteDataSource(index)">
                <i class="el-icon-delete" style="font-size: 20px;color: #fff;"></i>
              </el-button>
            </div>
          </div>
        </div>
        <div class="h100 d-flex">
          <ByTree
              :data="treeData"
              class="h100"
              type = 'dataSource'
              :defaultProps="treeProps"
              @contextmenu="contextmenu"
              @logDetail="logDetail"
          >
          </ByTree>
          <div class="px-20 d-flex flex-column" style="width: calc(100% - 295px)">
            <div>
              <div class="d-flex justify-content-between">
                <AddSdmScoure />
              </div>
            </div>
          </div>
        </div>
        <!-- 点击添加流管理数据源-->
        <el-dialog title="添加数据源" :visible.sync="dialogFormDataSourceAdd" width="40%" :before-close="beforeClose">
          <el-form :model="formDataSourceAdd" ref="formDataSourceAdd">
            <el-form-item label=" 数据源编号" :label-width="formLabelWidth" prop="sdm_source_number"
                          :rules="filter_rules([{required: true,dataType:'noLengthVaild'}])">
              <el-input v-model="formDataSourceAdd.sdm_source_number" autocomplete="off" placeholder="数据源编号"
                        style="width:284px"></el-input>
            </el-form-item>
            <el-form-item label=" 数据源名称" :label-width="formLabelWidth" prop="sdm_source_name"
                          :rules="filter_rules([{required: true}])">
              <el-input v-model="formDataSourceAdd.sdm_source_name" autocomplete="off" placeholder="数据源名称"
                        style="width:284px">
              </el-input>
            </el-form-item>
            <el-form-item label=" 数据源详细描述" :label-width="formLabelWidth" prop="sdm_source_des">
              <el-input type="textarea" v-model="formDataSourceAdd.sdm_source_des" autocomplete="off"
                        placeholder="数据源详细描述" style="width:284px"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancleAdd" size="mini" type="danger">取 消</el-button>
            <el-button type="primary" @click="addSdmDataSource('formDataSourceAdd');" size="mini">保 存</el-button>
          </div>
        </el-dialog>
        <!-- 点击编辑流数据管理源 -->
        <el-dialog title="编辑数据源" :visible.sync="dialogFormDataSourceUpdate" width="40%"
                   :before-close="beforeClose">
          <el-form :model="formDataSourceUpdate" ref="formDataSourceUpdate">
            <el-form-item label=" 数据源编号" :label-width="formLabelWidth"
                          :rules="filter_rules([{required: true,dataType:'noLengthVaild'}])">
              <el-input v-model="formDataSourceUpdate.sdm_source_number" autocomplete="off" placeholder="数据源编号"
                        style="width:284px" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label=" 数据源名称" :label-width="formLabelWidth" prop="sdm_source_name"
                          :rules="filter_rules([{required: true}])">
              <el-input v-model="formDataSourceUpdate.sdm_source_name" autocomplete="off" placeholder="数据源名称"
                        style="width:284px">
              </el-input>
            </el-form-item>
            <el-form-item label=" 数据源详细描述" :label-width="formLabelWidth" prop="sdm_source_des">
              <el-input type="textarea" v-model="formDataSourceUpdate.sdm_source_des" autocomplete="off"
                        placeholder="数据源详细描述" style="width:284px"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancleAdd" size="mini" type="danger">取 消</el-button>
            <el-button type="primary" @click="updateSdmDataSource('formDataSourceUpdate');" size="mini">保 存
            </el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane label="消息主题列表">
        <div class="dataManage">
          <el-row class="loheadertopic">
            <span>消息主题列表</span>
            <el-button type="primary" class="el1 els"
                       @click="dialogFormTopicAdd = true;searchSdmTopicInfo(currentPage,pageSize);" size="small">
              <i class="el-icon-folder-add "></i> 添加消息主题
            </el-button>
          </el-row>
          <el-divider></el-divider>
          <el-table stripe :data="tabletopic" border>
            <el-table-column label="序号" align="center">
              <template scope="scope">
                <span>{{ scope.$index + (currentPage - 1) * pageSize + 1 }}</span>
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
              <template slot-scope="scope">
                <el-button size="mini" type="primary"
                           @click="dialogFormTopicUpdate = true;handleEdit(scope.$index, scope.row);">编辑
                </el-button>
                <el-button size="mini" type="danger"
                           @click="deleteSdmTopicInfo(scope.$index, scope.row);">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-row class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="totalSize"/>
          </el-row>
        </div>
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
      </el-tab-pane>

      <el-tab-pane label="消费端申请审核">
        <div class="consumerManage">
          <el-row class="loheaderconsumer">
            <span>消费端申请审核</span>
          </el-row>
          <el-divider></el-divider>
          <el-table stripe :data="tableConsumer" border>
            <el-table-column label="序号" align="center" width="100">
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
          <el-row class="pagination">
            <el-pagination @size-change="handleConsumerSizeChange" @current-change="handleConsumerCurrentChange"
                           :current-page="currentConPage" :page-sizes="[10, 50, 100, 200]" :page-size="pageConSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="totalConSize"/>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import {getFlatArr, parseSimpleTreeData, treeFindPath} from "@/utils/datahandler.js";
import AddSdmScoure from "./addSdmScoure.vue";

export default {
  name: "",
  components: {AddSdmScoure},
  data() {
    return {

      treeData: [],
      treeProps: {
        children: "children",
        label: "showLable",
      },

      options: [
        {
          value: '19',
          label: '流数据生产'
        },
        {
          value: '23',
          label: '流数据消费'
        },
      ],
      dialogFormDataSourceAdd: false,
      dialogFormTopicAdd: false,
      dialogFormAudit: false,
      dialogFormTopicUpdate: false,
      dialogFormDataSourceUpdate: false,
      // dialogFormUserAdd: false,
      // dialogFormUserUpdate: false,
      rule: validator.default,
      formLabelWidth: "150px",
      //流数据源id
      sdm_source_id: "",
      //流数据源页面数据
      dataAgent: [],
      tabletopic: [],
      tableConsumer: [],
      //主题分页相关配置
      currentPage: 1,
      totalSize: 0,
      pageSize: 10,
      //消费端申请审核分页相关
      currentConPage: 1,
      totalConSize: 0,
      pageConSize: 10,
      create_dateFormat: "",
      //流数据管理源添加
      formDataSourceAdd: {
        sdm_source_number: "",
        sdm_source_name: "",
        sdm_source_des: ""
      },
      // 消息主题添加
      formTopicAdd: {
        sdm_top_name: "",
        sdm_top_cn_name: "",
        sdm_zk_host: "",
        sdm_partition: "",
        sdm_replication: "",
        sdm_top_value: ""
      },
      formTopicUpdate: {},
      formDataSourceUpdate: {
        sdm_source_number: "",
        sdm_source_name: "",
        sdm_source_des: ""
      },
      tabPosition: 'top',
      // formUserAdd: {},
      // formUserUpdate: {
      //   user_type: "",
      //   user_name: "",
      //   user_password: "",
      //   user_remark: ""
      // }
    }
  },
  created() {
  },
  mounted() {
    // 初始化树
    this.initTree();

    //页面初始化分页查询消费端申请审核信息
    this.searchUserApplication(this.currentConPage, this.pageConSize);
    // 页面初始化查询主题信息
    this.searchSdmTopicInfo(this.currentPage, this.pageSize);
    // 页面初始化查询数据源信息
    this.searchSdmDataSource()
  },
  methods: {

    //树初始化
    initTree() {
      this.$executeRequest.execPostByModuleUrl('/dataCollectionM/sdmdatasource/searchSdmDataSourceAndSdmAgentCount')
          .then((res) => {
            const list = JSON.parse(JSON.stringify(res.data));
            list.map((item) => {
              item.kind = "project";
            });
            let arr = getFlatArr(list);
            console.log(arr, '初始化树')
            arr.map((item) => {
              item.id = item.sdm_source_id;
              item.showLable = item.sdm_source_name;
              item.type = "text";
              item.children = [];
              if (item.sumSdmAgent != '0') {
                item.dropList = [
                  {
                    label: "编辑",
                    type: "EDITPROJECT",
                  },
                ];
              } else {
                item.dropList = [
                  {
                    label: "编辑",
                    type: "EDITPROJECT",
                  },
                  {
                    label: "删除",
                    type: "DELETEGROUP",
                  },
                ];
              }
            });
            this.treeData = parseSimpleTreeData(arr, "sdm_source_id", "parent_id");
          });
    },
    //右键菜单
    contextmenu(val) {
      console.log(val, '右键菜单')
      switch (val.command) {
        case "EDITPROJECT":
          this.editProject(val.id);
          break;
        case "DELETEGROUP":
          this.deleteProject(val.id);
          break;
        default:
          break;
      }
    },
    //点击树节点，获取右侧表格数据
    logDetail(data, reload = false) {
      console.log(data, '获取右侧表格数据')
      this.source_id = data.source_id
      // 进行页面的跳转
      // this.$router.push({});
    },
    // 右键编辑
    editProject(row) {
      this.modelTitle = "编辑数据源";
      this.formDataSourceUpdate = row;
      this.dialogFormDataSourceUpdate = true
    },
    // 右键删除
    deleteProject(row) {
      console.log(row, '右键删除')
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let params = {
          sdm_source_id: row.sdm_source_id
        };
        this.$executeRequest.execGetByPostModuleUrl("/dataCollectionM/sdmdatasource/deleteSdmDataSource", params).then((res) => {
          if (res && res.success) {
            this.initTree();
            this.$Msg.customizTitle('删除成功', 'success')
            this.$emit("addEvent");
          }
        })
      }).catch(() => {
        this.$message('取消删除')
      })
    },


    // 查询数据源信息及其对应的agent个数
    searchSdmDataSource() {
      this.$executeRequest.execPostByModuleUrl('/dataCollectionM/sdmdatasource/searchSdmDataSourceAndSdmAgentCount').then((res) => {
        if (res && res.success) {
          this.dataAgent = res.data;
          this.formDataSourceUpdate = res.data;
        }
      })
    },
    // 点击数据源表的内容跳转页面
    gotoScoureDetail(index) {
      //进行页面的跳转
      this.$router.push({
        name: "addSdmScoure",
        query: {
          sdm_source_id: this.dataAgent[index].sdm_source_id
        }
      });
    },
    // 点击编辑数据源信息，获取sdm_source_id
    clickEditButton(index) {
      this.sdm_source_id = this.dataAgent[index].sdm_source_id;
      this.formDataSourceUpdate = this.dataAgent[index];
      this.updateSdmDataSource('formDataSourceUpdate');
    },
    // 删除数据源
    deleteDataSource(index) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.sdm_source_id = this.dataAgent[index].sdm_source_id;
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/sdmdatasource/deleteSdmDataSource', {
          sdm_source_id: this.sdm_source_id
        })
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle('删除成功', 'success')
                this.$emit("addEvent");
                this.searchSdmDataSource();
              }
            })
      })
    },
    // 点击添加弹出框的取消按钮
    cancleAdd() {
      // 表单清空
      this.formDataSourceAdd = {};
      this.formDataSourceUpdate = {};
      this.formTopicAdd = {};
      this.formTopicUpdate = {};
      // this.formUserAdd = {};
      // this.formUserUpdate = {};
      // 隐藏对话框
      this.dialogFormDataSourceAdd = false;
      this.dialogFormTopicAdd = false;
      this.dialogFormTopicUpdate = false;
      this.dialogFormDataSourceUpdate = false;
      // this.dialogFormUserAdd = false;
      // this.dialogFormUserUpdate = false;

      this.$refs.formDataSourceAdd.resetFields();
      this.$refs.formDataSourceUpdate.resetFields();
      this.$refs.formTopicAdd.resetFields();
      this.$refs.formTopicUpdate.resetFields();
    },
    // 关闭弹框之前
    beforeClose() {
      // 表单清空
      this.formDataSourceAdd = {};
      this.formDataSourceUpdate = {};
      this.formTopicAdd = {};
      this.formTopicUpdate = {};
      // this.formUserAdd = {};
      // this.formUserUpdate = {};
      // 隐藏对话框
      this.dialogFormDataSourceAdd = false;
      this.dialogFormTopicAdd = false;
      this.dialogFormTopicUpdate = false;
      this.dialogFormDataSourceUpdate = false;
      // this.dialogFormUserAdd = false;
      // this.dialogFormUserUpdate = false;

      this.$refs.formDataSourceAdd.resetFields();
      this.$refs.formDataSourceUpdate.resetFields();
      this.$refs.formTopicAdd.resetFields();
      this.$refs.formTopicUpdate.resetFields();
    },
    // 新增数据源信息
    addSdmDataSource(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 调用添加方法
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/sdmdatasource/saveSdmDataSource', this.formDataSourceAdd).then(response => {
            if (response && response.success) {
              this.$Msg.customizTitle('添加成功', 'success')
              this.$emit("addEvent");
              // 隐藏对话框
              this.dialogFormDataSourceAdd = false;
              this.initTree();
              // 表单清空
              this.formDataSourceAdd = {};
              this.searchSdmDataSource();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 编辑数据源信息
    updateSdmDataSource(formName) {
      this.dataAgent
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/sdmdatasource/updateSdmDataSource', this.formDataSourceUpdate).then((res) => {
            if (res && res.success) {
              this.$message({
                type: 'success',
                message: '更新成功!'
              })
              this.dialogFormDataSourceUpdate = false;
              this.formDataSourceUpdate = {};
              this.searchSdmDataSource();
            }
          })
        } else {
          return false;
        }
      });
    },
    // 分页查询主题信息
    searchSdmTopicInfo(page, size) {
      var data = {currPage: page, pageSize: size};
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/topic/searchSdmTopicInfo', data).then(res => {
        this.tabletopic = res.data.sdmTopic
        this.totalSize = res.data.totalSize
        this.formTopicAdd.sdm_zk_host = res.data.zk_host;
        res.data.sdmTopic.forEach(val => {
          val.create_dateFormat = this.$Date.dateFormat(val.create_date) + " " + this.$Date.hourFormat(val.create_time);
        })

      });
    },
    // 获取表格当前行数据
    handleEdit(index, row) {
      this.id = row.id;
      this.formTopicUpdate = Object.assign({}, row);
      // this.formUserUpdate = Object.assign({}, row);
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
            this.searchSdmTopicInfo(this.currentPage, this.pageSize);
          }
        })
      }).catch(() => {
        this.$message.info('取消操作')
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      // 点击每页显示的条数时，显示第一页
      this.searchSdmTopicInfo(this.currentPage, this.pageSize);
    },
    handleCurrentChange(val) {
      this.currentPage = val
      // 切换页码时，要获取每页显示的条数
      this.searchSdmTopicInfo(this.currentPage, this.pageSize);
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
              this.searchSdmTopicInfo(this.currentPage, this.pageSize);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 创建并添加新的主题
    saveSdmTopicInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 调用添加方法
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionM/topic/saveSdmTopicInfo', this.formTopicAdd).then(res => {
            if (res && res.success) {
              this.$Msg.customizTitle('添加成功', 'success')
              this.$emit("addEvent");
              // 隐藏对话框
              this.dialogFormTopicAdd = false;
              // 表单清空
              this.formTopicAdd = {};
              this.searchSdmTopicInfo(this.currentPage, this.pageSize);
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
              this.searchSdmTopicInfo(this.currentPage, this.pageSize);
            }
          })
        } else {
          return false;
        }
      });
    },
    //分页查询消费端申请审核信息
    searchUserApplication(page, size) {
      var data = {currPage: page, pageSize: size};
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
  }
}
</script>

<style scoped lang="less">
.el-divider--horizontal {
  margin: 10px 0px;
}

// 数据源列表样式
.loheaderRow {
  height: 34px;
  line-height: 34px;
  margin-bottom: 10px;
}

/* button样式设置 */
.els {
  float: right;
}

.el1 {
  margin-left: 10px;
}

.dataSheetmainDiv {
  margin-bottom: 46px;
  padding-top: 10px;
  width: 100px;
  height: 80px;
  background: #337ab7;
  border-radius: 10px;
  margin-right: 30px;
  text-align: center;
  float: left;
  position: relative;
}

/* 字体描述定位 */
.dataSheetmainDiv .postionP {
  position: absolute;
  bottom: -20px;
  left: 4px;
  font-size: 14px;
  color: black;
}

/* 标签定位 */
.dataSheetmainDiv span {
  display: block;
  width: 18px;
  height: 18px;
  background: #f89406;
  border-radius: 50%;
  color: white;
  position: absolute;
  right: -2px;
  top: -3px;
  font-size: 12px;
}

.dataSheetmainDiv:hover .boxshletr {
  display: block;
}

/* 遮料层样式 */
.boxshletr {
  width: 100px;
  height: 30px;
  line-height: 30px;
  border-radius: 5px;
  background: black;
  opacity: 0.5;
  position: absolute;
  bottom: -30px;
  //left: -3px;
  display: none;
}

/* 按钮设置 */
.editBtn {
  padding: 0;
}

// 消息主题列表样式
.loheadertopic {
  height: 34px;
  line-height: 34px;
}

/* 分页 */
.pagination {
  margin-top: 10px;
  width: 100%;
}

</style>
