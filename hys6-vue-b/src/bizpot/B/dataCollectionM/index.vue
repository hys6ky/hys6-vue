<template>
  <div>
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="数据源">
        <lo-header @addEvent="addSuccess"></lo-header>
        <data-sheet-main @addEvent="addSuccess" :data="dataIndexAll"></data-sheet-main>
        <!--        <div class="h100 d-flex">-->
        <!--          &lt;!&ndash;左侧树菜单&ndash;&gt;-->
        <!--          <ByTree-->
        <!--              :data="treeData"-->
        <!--              class="h100"-->
        <!--              :defaultProps="treeProps"-->
        <!--              type="dataSource"-->
        <!--              @contextmenu="contextmenu"-->
        <!--              @logDetail="logDetail"-->
        <!--          >-->
        <!--          </ByTree>-->
        <!--          <div class="px-20 d-flex flex-column" style="width: calc(100% - 295px)">-->
        <!--            <div>-->
        <!--              <div class="d-flex justify-content-between">-->
        <!--                <AgentInfo :id="source_id" />-->
        <!--              </div>-->
        <!--            </div>-->
        <!--            &lt;!&ndash; <ByEmpty v-else class="flex-1" />&ndash;&gt;-->
        <!--          </div>-->
        <!--        </div>-->

        <!--        &lt;!&ndash;编辑弹层&ndash;&gt;-->
        <!--        <ByModel-->
        <!--            :visible.sync="visible"-->
        <!--            :modelTitle="modelTitle"-->
        <!--            modelWidth="650px"-->
        <!--            @close="dialogCancel"-->
        <!--        >-->
        <!--          <div style="padding: 0 20px 0 20px">-->
        <!--            <ByModelForm-->
        <!--                :formData="modelFormData"-->
        <!--                :formItems="modelFormItems"-->
        <!--                :formRules="modelFormRules"-->
        <!--                :formConfig="modelFormConfig"-->
        <!--                ref="dataSourceManagement"-->
        <!--            />-->
        <!--          </div>-->
        <!--          <template slot="modalFoot">-->
        <!--            <el-button @click="dialogCancel">取消</el-button>-->
        <!--            <el-button-->
        <!--                type="primary"-->
        <!--                @click="confirm"-->
        <!--                v-debounce-->
        <!--            >-->
        <!--              保存-->
        <!--            </el-button>-->
        <!--          </template>-->
        <!--        </ByModel>-->
      </el-tab-pane>

      <el-tab-pane label="数据审核">
        <!--    数据审核开始  -->
        <div class="dataManage">
          <el-row>
            <span>数据审核</span>
            <div class="lines"></div>
            <el-table stripe :data="tableDatalist" size="medium" border>
              <el-table-column type="index" label="序号" width="70" align="center">
                <template v-slot="scope">
                  {{ scope.$index + (currentPageList - 1) * pageSize + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="original_name" label="文件名" align="center"
                               show-overflow-tooltip></el-table-column>
              <el-table-column prop="file_suffix" label="文件后缀名" align="center"
                               show-overflow-tooltip></el-table-column>
              <el-table-column prop="file_type" label="文件类型" align="center" show-overflow-tooltip>
                <template v-slot="scope">{{ file_type_map[scope.row.file_type] }}</template>
              </el-table-column>
              <el-table-column prop="user_name" label="提交人" align="center"></el-table-column>
              <el-table-column prop="apply_date" label="提交日期" width="192" align="center"
                               show-overflow-tooltip></el-table-column>
              <el-table-column prop="apply_time" label="提交时间" width="192" align="center"
                               show-overflow-tooltip></el-table-column>
              <el-table-column prop="apply_type" label="申请类型" align="center">
                <template v-slot="scope">{{ apply_type_map[scope.row.apply_type] }}</template>
              </el-table-column>
              <el-table-column prop="agent_id" label="操作" align="center">
                <template v-slot="scope">
                  <!-- 申请类型: 查看 -->
                  <template v-if="scope.row.apply_type ==='1'">
                    <template v-if="scope.row.auth_type ==='0'">
                      <el-button type="text" class="sendcolor"
                                 @click="dataAudit(1,'查看'); handleEdit(scope.$index, scope.row)" size="mini">查看
                      </el-button>
                      <el-button type="text" class='editcolor'
                                 @click="dataAudit(3,'查看一次'); handleEdit(scope.$index, scope.row)" size="mini">查看一次
                      </el-button>
                      <el-button type="text" class="delcolor"
                                 @click="reclaimAuthority(); handleEdit(scope.$index, scope.row)" size="mini">不允许
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button type="text" class="delcolor"
                                 @click="reclaimAuthority(); handleEdit(scope.$index, scope.row)" size="mini">权限回收
                      </el-button>
                    </template>
                  </template>
                  <!-- 申请类型: 下载 -->
                  <template v-else-if="scope.row.apply_type==='2'">
                    <template v-if="scope.row.auth_type ==='0'">
                      <el-button type="text" class="sendcolor"
                                 @click="dataAudit(1,'允许下载'); handleEdit(scope.$index, scope.row)" size="mini">允许
                      </el-button>
                      <el-button type="text" class="delcolor"
                                 @click="reclaimAuthority(); handleEdit(scope.$index, scope.row)" size="mini">不允许
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button type="text" class="delcolor"
                                 @click="reclaimAuthority(); handleEdit(scope.$index, scope.row)" size="mini">权限回收
                      </el-button>
                    </template>
                  </template>
                  <!-- 申请类型: 发布 -->
                  <template v-else-if="scope.row.apply_type==='3'">
                    <template v-if="scope.row.auth_type ==='0'">
                      <el-button type="text" class='sendcolor'
                                 @click="dataAudit(1,'允许发布'); handleEdit(scope.$index, scope.row)" size="mini">允许
                      </el-button>
                      <el-button type="text" class="delcolor"
                                 @click="reclaimAuthority(); handleEdit(scope.$index, scope.row)" size="mini">不允许
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button type="text" class="delcolor"
                                 @click="reclaimAuthority(); handleEdit(scope.$index, scope.row)" size="mini">权限回收
                      </el-button>
                    </template>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <!-- 分页内容 -->
          <el-row class="pagination">
          </el-row>
          <el-pagination
              @current-change="handleCurrentChangeList"
              @size-change="handleSizeChangelist" :page-sizes="[5, 10, 50, 100,500]"
              :page-size="pageSize"
              :current-page="currentPageList"
              :total="totalItemList"
              layout=" total,sizes,prev, pager, next, jumper"
          ></el-pagination>
        </div>
        <!-- 数据审核完 -->
      </el-tab-pane>

      <el-tab-pane label="数据权限">
        <!-- 数据权限开始 -->
        <div class="authorityManagement">
          <span>数据权限</span>
          <div class="lines"></div>
          <!-- 表格 -->
          <el-table :data="tableData" border stripe size="medium">
            <el-table-column type="index" label="序号" width="70" align="center">
              <template v-slot="scope">
                {{ scope.$index + (currentPage - 1) * pageSize + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="datasource_name" label="数据源名称" align="center"></el-table-column>
            <el-table-column prop="dep_name" label="所属部门" align="center" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" width="196" align="center">
              <template v-slot="scope">
                <b @click="dialogFormVisibleAdd = true;handleEdit(scope.$index, scope.row);departmentInfo()">编辑</b>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <!-- 点击操作弹出框 -->
            <el-dialog title="更改部门" :visible.sync="dialogFormVisibleAdd" width="40%">
              <el-form :model="formAdd" ref="formAdd">
                <el-form-item label=" 数据源名称" :label-width="formLabelWidth" prop="datasource_name">
                  <el-input v-model="formAdd.datasource_name" autocomplete="off" placeholder="数据源名称"
                            style="width:284px" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label=" 所属部门" :label-width="formLabelWidth" :rules="rule.selected">
                  <el-select v-model="depIds" filterable placeholder="请选择（可多选）" multiple style="width:284px">
                    <el-option v-for="(item,index) in optionsOne" :key="index" :label="item.dep_name"
                               :value="item.dep_id"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="danger" @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="saveChangeAgent('formAdd')" size="mini">保存</el-button>
              </div>
            </el-dialog>
          </el-row>
          <!-- 分页内容 -->
          <el-row class="pagination">
            <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
                           :page-sizes="[5, 10, 50, 100,500]" :page-size="pageSize"
                           layout=" total, sizes,prev, pager, next, jumper" :total="totalItems"></el-pagination>
          </el-row>
        </div>
        <!-- 数据权限完 -->
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
import LoHeader from "./Loheader";
import dataSheetMain from "./dataSheetMain.vue";
import * as validator from "@/utils/validator";
import Scrollbar from "@/components/global/Scrollbar.vue";
// import {getFlatArr, parseSimpleTreeData, treeFindPath} from "@/utils/datahandler.js";
import {modelFormData, modelFormItems, modelFormRules, modelFormConfig} from './mock'
import AgentInfo from "@/bizpot/B/dataSourceManagement/agentInfo/index.vue";

let arrData;
export default {
  components: {
    Scrollbar,
    "lo-header": LoHeader,
    "data-sheet-main": dataSheetMain,
    AgentInfo,
  },
  data() {
    return {
      tabPosition: 'left',
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
      dialogFormDataSourceUpdate: false,
      sdm_source_id: "", //流数据源id
      //流数据源页面数据
      dataAgent: [],
      //流数据管理源添加
      formDataSourceAdd: {
        sdm_source_number: "",
        sdm_source_name: "",
        sdm_source_des: ""
      },
      formDataSourceUpdate: {
        sdm_source_number: "",
        sdm_source_name: "",
        sdm_source_des: ""
      },
      treeData: [],
      treeProps: {
        children: "children",
        label: "showLable",
      },
      // visible: false,
      // modelTitle: "",
      // modelFormData: JSON.parse(JSON.stringify(modelFormData)),
      // modelFormItems,
      // modelFormRules,
      // modelFormConfig,
      //页面配置
      apply_type_list: [],
      apply_type_map: {},
      auth_type_list: [],
      auth_type_map: {},
      file_type_list: [],
      file_type_list_sub: [],
      file_type_map: {},
      //页面数据
      dataIndexAll: [],
      dialogVisible: false,
      dialogFormVisibleAdd: false,
      formAdd: {},
      formLabelWidth: "150px",
      currentPage: 1,
      currentPageList: 1,
      pageSize: 5,
      totalItems: 0,
      totalItemList: 0,
      optionsOne: [],
      source_id: "",
      da_id: "",
      depIds: [],
      tableData: [],
      rule: validator.default,
      tableDatalist: [],
      page_limit: ''
    };
  },
  // 获取首页数据
  created() {
    this.getIndexData();
    //获取代码类型:数据申请类型
    this.getApplyType();
    //获取代码类型:权限类型
    this.getAuthType();
    //获取代码类型:文件类型
    this.getFileType();
  },
  mounted() {
    // this.initTree();
    this.handleCurrentChangeList(1);
    this.handleCurrentChange(1);
    // 页面初始化查询数据源信息
    this.searchSdmDataSource()
  },
  methods: {
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
      // 隐藏对话框
      this.dialogFormDataSourceAdd = false;
      this.dialogFormDataSourceUpdate = false;
      // this.dialogFormUserAdd = false;
      // this.dialogFormUserUpdate = false;
      this.$refs.formDataSourceAdd.resetFields();
      this.$refs.formDataSourceUpdate.resetFields();
    },
    // 关闭弹框之前
    beforeClose() {
      // 表单清空
      this.formDataSourceAdd = {};
      this.formDataSourceUpdate = {};
      // 隐藏对话框
      this.dialogFormDataSourceAdd = false;
      this.dialogFormDataSourceUpdate = false;
      // this.dialogFormUserAdd = false;
      // this.dialogFormUserUpdate = false;
      this.$refs.formDataSourceAdd.resetFields();
      this.$refs.formDataSourceUpdate.resetFields();
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
    dialogCancel() {
      this.visible = false
    },
    // 编辑保存
    confirm() {
      this.$refs.dataSourceManagement.$refs[this.modelFormConfig.ref].validate(
          (valid) => {
            if (valid) {
              this.$confirm("确认更新吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                this.$executeRequest.execPostByModuleUrl("/dataCollectionM/updateDataSource", this.modelFormData
                ).then((res) => {
                  if (res && res.success) {
                    this.$message.success("更新成功");
                    this.initTree();
                    this.visible = false;
                    this.$refs.dataSourceManagement.$refs[this.modelFormConfig.ref].resetFields();
                  }
                });
              }).catch(() => {
                this.$message({
                  type: "info",
                  message: "取消更新!",
                });
              });
            }
          }
      );
    },
    //树初始化
    // initTree() {
    //   this.$executeRequest.execGetByPostModuleUrl("/dataSourceManagement/searchDataSourceAndAgentCount")
    //       .then((res) => {
    //         const list = JSON.parse(JSON.stringify(res.data));
    //         list.map((item) => {
    //           item.kind = "project";
    //         });
    //         let arr = getFlatArr(list);
    //         arr.map((item) => {
    //           item.id = item.source_id;
    //           item.showLable = item.datasource_name;
    //           item.type = "text";
    //           item.children = [];
    //           if (item.sumAgent != '0') {
    //             item.dropList = [
    //               {
    //                 label: "编辑",
    //                 type: "EDITPROJECT",
    //               },
    //               {
    //                 label: "下载",
    //                 type: "DOWNLOADPROJECT",
    //               },
    //             ];
    //           } else {
    //             item.dropList = [
    //               {
    //                 label: "编辑",
    //                 type: "EDITPROJECT",
    //               },
    //               {
    //                 label: "下载",
    //                 type: "DOWNLOADPROJECT",
    //               },
    //               {
    //                 label: "删除",
    //                 type: "DELETEGROUP",
    //               },
    //             ];
    //           }
    //         });
    //         this.treeData = parseSimpleTreeData(arr, "source_id", "parent_id");
    //       });
    // },
    // //编辑
    // editProject(row) {
    //   this.$executeRequest.execGetByPostModuleUrl("/dataSourceManagement/searchDataSourceById", {
    //     source_id: row.source_id
    //   }).then((res) => {
    //     if (res && res.success) {
    //       let options = res.data.depNameAndId;
    //       options.map((item) => {
    //         item.label = item.dep_name;
    //         item.value = item.dep_id;
    //       });
    //       this.modelTitle = "编辑数据源";
    //       this.modelFormData = res.data;
    //       this.modelFormItems.map(its => {
    //         its.prop === 'datasource_number' && (its.disabled = true)
    //         its.options = options
    //       })
    //       this.visible = true
    //     }
    //
    //   });
    // },
    // // 下载
    // downloadProject(row) {
    //   let params = {source_id: row.source_id};
    //   this.$executeRequest.execDownloadFileByModuleUrl("/dataSourceManagement/downloadFile", params).then((res) => {
    //     let fileName = row.datasource_name + ".hrds";
    //     this.$FileOperations.fileDownload(res, fileName);
    //   })
    // },
    // deleteProject(row) {
    //   this.$confirm('确认删除吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }).then(() => {
    //     let params = {
    //       source_id: row.source_id
    //     };
    //     this.$executeRequest.execByControllerMappingName("/deleteDataSource", params).then((res) => {
    //       if (res && res.success) {
    //         this.initTree();
    //         this.$Msg.customizTitle('删除成功', 'success')
    //         this.$emit("addEvent");
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message('取消删除')
    //   })
    // },
    // //右键菜单
    // contextmenu(val) {
    //   switch (val.command) {
    //     case "EDITPROJECT":
    //       this.editProject(val.id);
    //       break;
    //     case "DOWNLOADPROJECT":
    //       this.downloadProject(val.id);
    //       break;
    //     case "DELETEGROUP":
    //       this.deleteProject(val.id);
    //       break;
    //     default:
    //       break;
    //   }
    // },
    // //点击树节点，获取右侧表格数据
    // logDetail(data, reload = false) {
    //   this.source_id = data.source_id
    //   // 进行页面的跳转
    //   // this.$router.push({
    //   //   name: "agentInfo",
    //   //   query: {
    //   //     source_id: data.source_id
    //   //   }
    //   // });
    // },
    //获取数据申请类型信息
    getApplyType() {
      this.$Code.getCategoryItems({
        'category': 'ApplyType'
      }).then(res => {
        res.data.forEach(row => {
          this.apply_type_map[row.code] = row.value;
          //处理为List
          this.apply_type_list.push(row);
        });
      });
    },
    //获取数据权限信息
    getAuthType() {
      this.$Code.getCategoryItems({
        'category': 'AuthType'
      }).then(res => {
        if (res && res.success) {
          res.data.forEach(row => {
            this.auth_type_map[row.code] = row.value;
            //处理为list
            this.auth_type_list.push(row);
          });
        }
      });
    },
    //获取文件类型信息
    getFileType() {
      this.$Code.getCategoryItems({
        'category': 'FileType'
      }).then(res => {
        //处理数据申请类型信息为map类型
        res.data.forEach(row => {
          this.file_type_map[row.code] = row.value;
          if (row.code === '1013' || row.code === '1023' || row.code === '1033' || row.code === '1043' ||
              row.code === '1053' || row.code === '1063') {
            this.file_type_list_sub.push(row);
          } else {
            this.file_type_list.push(row);
          }
        });
      });
    },
    // 子触发父的事件
    addSuccess() {
      this.handleCurrentChangeList(1);
      this.getIndexData();
      this.handleCurrentChange(1);
    },
    // 封装调用事件
    getIndexData() {
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionM/searchDataSourceAndAgentCount").then(res => {
        if (res && res.success) {
          // 获取所有数据
          this.dataIndexAll = res.data;
        }
      });
    },
    // 获取表格当前行数据
    handleEdit(index, row) {
      this.source_id = row.source_id;
      this.da_id = row.da_id;
    },
    // 数据权限，更新数据源关系部门信息
    saveChangeAgent(formName) {
      // this.formAdd["dep_id"] = this.depIds;
      // this.formAdd["source_id"] = this.source_id;
      let params = {};
      params["dep_id"] = this.depIds;
      params["source_id"] = this.source_id;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$executeRequest.execPostByModuleUrl("/dataCollectionM/updateAuditSourceRelationDep", params).then(res => {
            if (res && res.success) {
              this.$Msg.customizTitle('更改成功', 'success')
              // 传入当前页数和当前需要的条数渲染
              this.handleCurrentChange(this.currentPage);
              // 隐藏对话框
              this.dialogFormVisibleAdd = false;
              // 表单清空
              this.depIds = [];
              this.formAdd = {};
            } else {
            }
          });
        } else {
          return false;
        }
      });
    },
    // 点击添加按钮获取部门信息
    departmentInfo() {
      this.depIds = [];
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionM/searchDepartmentInfo").then(res => {
        if (res && res.success) {
          this.optionsOne = res.data;
          arrData = res.data;
        }
      });
      // 数据回显
      let params = {source_id: this.source_id};
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionM/searchDataSourceById", params).then((res) => {
        if (res && res.success) {
          this.formAdd = res.data;
          res.data.depNameAndId.forEach((item) => {
            this.depIds.push(item.dep_id);
          })
        }
      })
    },
    // 点击取消按钮
    cancelAdd() {
      // 表单清空
      this.formAdd = {};
      this.depIds = [];
      // 隐藏对话框
      this.dialogFormVisibleAdd = false;
    },
    //获取数据权限数据实现分页功能
    handleCurrentChange(val) {
      this.page_limit = val;
      //把val赋给当前页面
      this.currentPage = val;
      let params = {
        currPage: this.currentPage,
        pageSize: this.pageSize
      };
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionM/searchSourceRelationDepForPage", params).then(res => {
        if (res && res.success) {
          this.tableData = res.data;
          // 获取数据权限分页总数
          if (this.tableData.length === 0) {
            this.totalItems = 0;
          } else {
            this.totalItems = this.tableData[0].totalSize;
          }
        }
      })
    },
    // 获取数据审核数据实现分页功能
    handleCurrentChangeList(val) {
      this.page_limit = val;
      //把val赋给当前页面
      this.currentPageList = val;
      let params = {
        currPage: this.currentPageList,
        pageSize: this.pageSize
      };
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionM/getDataAuditInfoForPage", params).then(res => {
        if (res && res.success) {
          // 时间日期格式化
          res.data.forEach(item => {
            if (item.apply_date) {
              item.apply_date = this.$Date.dateFormat(item.apply_date);
            }
            if (item.apply_time) {
              item.apply_time = this.$Date.hourFormat(item.apply_time);
            }
          })
          this.tableDatalist = res.data;
          // 获取数据审核分页总数
          if (this.tableDatalist.length === 0) {
            this.totalItemList = 0;
          } else {
            this.totalItemList = res.data[0].totalSize;
          }
        }
      })
    },
    // 权限审核
    dataAudit(auth_type, auth_type_zh) {
      this.$confirm('确定' + auth_type_zh + ' 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let params = {da_id: this.da_id, auth_type: auth_type}
        this.$executeRequest.execGetByPostModuleUrl("/dataCollectionM/dataAudit", params).then(res => {
          if (res && res.success) {
            this.$Msg.customizTitle('权限审核成功', 'success')
            this.handleCurrentChangeList(this.page_limit);
          }
        })
      })
    },
    // 权限回收
    reclaimAuthority() {
      this.$confirm('确定要回收权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let params = {da_id: this.da_id};
        this.$executeRequest.execGetByPostModuleUrl("/dataCollectionM/deleteAudit", params).then(res => {
          if (res && res.success) {
            this.$Msg.customizTitle('回收权限成功', 'success')
            this.handleCurrentChangeList(this.page_limit);
          }
        })
      }).catch(() => {
      })
    },
    // 改变数据审核每页显示条数
    handleSizeChangelist(val) {
      this.pageSize = val;
      this.currentPageList = 1;
      this.handleCurrentChangeList(this.currentPageList);
    },
    // 改变数据权限显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleCurrentChange(this.currentPage);
    }
  },
}
</script>

<style scoped>

.authorityManagement {
  margin-top: 26px;
  margin-bottom: 10px;
  color: #61c3fa;
}

.authorityManagement span {
  color: #2196f3;
  font-size: 18px;
}

.authorityManagement b {
  font-size: 14px;
  font-weight: normal;
  cursor: pointer;
  color: red;
}

.lines {
  margin-top: 10px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}

/* 分页 */
.pagination {
  margin-top: 15px;
  padding: 5px;
  width: 100%;
}


/* 数据审核样式 */
.dataManage {
  margin-top: 26px;
  margin-bottom: 10px;
  color: #61c3fa;
}

/* 下划线样式 */
.lines {
  margin-top: 10px;
  width: 100%;
  height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}

.dataManage span {
  color: #2196f3;
  font-size: 18px;
}

.loheadertopic {
  height: 34px;
  line-height: 34px;
}

.els {
  float: right;
}

.el1 {
  margin-left: 10px;
}

</style>
