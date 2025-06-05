<template>
<div>
  <div>
    <ByQuickSearch :form-items="QuickItem"  @search="queryQuick"> </ByQuickSearch>
  </div>
<!--    <el-form :model="form" ref="form" class="demo-form-inlines" :inline="true">-->
<!--        <el-col :span="12">-->
<!--            <el-form-item label="作业名称">-->
<!--                <el-autocomplete :fetch-suggestions="querySearch" size="mini" v-model="form.etl_job" style="width:264px" placeholder="作业名称" @select="handleSelect"></el-autocomplete>-->
<!--            </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--            <el-form-item label="上游作业名称">-->
<!--                <el-input size="mini" v-model="form.pre_etl_job" style="width:264px" placeholder="上游作业名称"></el-input>-->
<!--                <el-button size="mini" class="searchBtn" type="primary" @click="refreshTable">搜索-->
<!--                </el-button>-->
<!--            </el-form-item>-->
<!--        </el-col>-->
<!--    </el-form>-->
<!--    <el-divider></el-divider>-->
  <div class="container pt-10">
    <div style="height:32px;margin-bottom:10px">
      <div style="float: right">
        <el-button type="primary"  size="small">
            <el-upload  accept=".xlsx" action="" :show-file-list="false" :auto-upload="false" :on-change="handleChange" :limit="1" :on-exceed="handleExceed" :fileList="fileList">
                <span>导入数据</span>
            </el-upload>
        </el-button>
            <el-button type="primary" size="small" @click="downloadModel">下载模板
            </el-button>
            <el-button  type="primary" size="small" @click="handleAdd">新增
            </el-button>
            <el-button  type="primary" size="small" @click="handleBatchAdd">批量新增
            </el-button>
            <el-button type="danger" size="small" @click="handleBatchDelete">批量删除
            </el-button>
      </div>
    </div>
  </div>
  <div>
    <ByTable v-if="tableData" :table-data="tableData" :column-arr="columArr" :pagination="pagination" @handleMultiple="handleSelectionChange" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @operateItem="operateHandler"></ByTable>
    <ByEmpty v-else></ByEmpty>
  </div>
<!--    <el-table size="medium" ref="multipleTable" :data="tableData" tooltip-effect="dark" stripe border style="width: 100%" @selection-change="handleSelectionChange">-->
<!--        <el-table-column type="selection" align='center' width="55">-->
<!--        </el-table-column>-->
<!--        &lt;!&ndash; <el-table-column prop="etl_sys_cd" show-overflow-tooltip label="工程编号" align='center'>-->
<!--            <template slot-scope="scope">-->
<!--                <span @click="gotoWorkId(scope.row.etl_sys_cd)" style="color:#409EFF;cursor:pointer "> {{scope.row.etl_sys_cd}}</span>-->
<!--            </template>-->
<!--        </el-table-column> &ndash;&gt;-->
<!--        <el-table-column prop="etl_job" show-overflow-tooltip label="作业名称" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="pre_etl_sys_cd" show-overflow-tooltip label="上游工程编号" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="pre_etl_job" show-overflow-tooltip label="上游作业名称" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="statu" show-overflow-tooltip label="状态" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="操作" align='center'>-->
<!--            <template slot-scope="scope">-->
<!--                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑-->
<!--                </el-button>-->
<!--                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除-->
<!--                </el-button>-->
<!--            </template>-->
<!--        </el-table-column>-->
<!--    </el-table>-->
<!--    <el-row :gutter="20" class="tabBtns">-->
<!--        <el-pagination layout="total, sizes,prev, pager, next, jumper" style="float:right" :page-sizes="[5,10,20,25,50,100,1000]"  :page-size="pagesize" :total="pageLength" @current-change="handleCurrentChange" @size-change="handleSizeChange">-->
<!--        </el-pagination>-->
<!--    </el-row>-->
    <!-- 添加/修改/批量添加作业模态框 -->
  <ByModel :model-title="dependTitle" :model-width="'40%'" :visible.sync="dialogFormVisibleAdd"  @close="beforeClose" >
    <ByModelForm :form-data="formAdd" :form-items="fromItem" :form-config="issueFromConfig" :form-rules="frolRules" ref="formAdd"></ByModelForm>
    <div  slot="modalFoot">
      <el-button @click="cancleAdd" >取消</el-button>
      <el-button type="primary" @click="saveAdd('formAdd')" >保存</el-button>
    </div>
  </ByModel>
<!--    <el-dialog :title="dependTitle" :visible.sync="dialogFormVisibleAdd" width="40%" :before-close="beforeClose">-->
<!--        <el-form :model="formAdd" ref="formAdd" class="demo-ruleForm" label-width="150px">-->
<!--            <el-form-item label="工程编号" prop="etl_sys_cd" :rules="filter_rules([{required: true}])">-->
<!--                <div style="width:193px">-->
<!--                    <el-input v-model="formAdd.etl_sys_cd" style="width:218px;" autocomplete="off" placeholder="工程编号" disabled></el-input>-->
<!--                </div>-->
<!--            </el-form-item>-->

<!--            <el-form-item v-if="this.dependTitle == '添加作业依赖'" prop="etl_job_id" label="作业名称" :rules="rule.selected ">-->
<!--                <el-select v-model="formAdd.etl_job_id" placeholder="请选择作业名称" style="width:218px;">-->
<!--                    <el-option v-for="item in formSelect.job" :key="item.value" :label="item.label" :value="item.value">-->
<!--                    </el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item v-if="this.dependTitle == '修改作业依赖'" prop="etl_job_id" label="作业名称" :rules="rule.selected ">-->
<!--                <el-select v-model="formAdd.etl_job_id" placeholder="请选择作业名称" style="width:218px;">-->
<!--                    <el-option v-for="item in formSelect.job" :key="item.value" :label="item.label" :value="item.value">-->
<!--                    </el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item v-if="this.dependTitle == '批量添加作业依赖'" prop="sub_sys_id" label="任务名称" :rules="rule.selected ">-->
<!--                <el-select v-model="formAdd.sub_sys_id" placeholder="请选择任务名称" style="width:218px;">-->
<!--                    <el-option v-for="item in formSelect.pro" :key="item.value" :label="item.label" :value="item.value">-->
<!--                    </el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->

<!--            <el-form-item label="上游工程编号" prop="pre_etl_sys_cd">-->
<!--                <div style="width:193px">-->
<!--                    <el-input v-model="formAdd.pre_etl_sys_cd" autocomplete="off" style="width:218px;" placeholder="上游工程编号" disabled></el-input>-->
<!--                </div>-->
<!--            </el-form-item>-->
<!--            <el-form-item v-if="this.dependTitle != '批量添加作业依赖'" prop="pre_etl_job_id" label="上游作业名称" :rules="rule.selected ">-->
<!--                <el-select v-model="formAdd.pre_etl_job_id" placeholder="请选择上游作业" style="width:218px;">-->
<!--                    <el-option v-for="item in formSelect.job" :key="item.value" :label="item.label" :value="item.value">-->
<!--                    </el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->

<!--            <el-form-item v-if="this.dependTitle == '批量添加作业依赖'" prop="pre_sub_sys_id" label="上游任务名称" :rules="rule.selected ">-->
<!--                <el-select v-model="formAdd.pre_sub_sys_id" placeholder="请选择上游任务" style="width:218px;">-->
<!--                    <el-option v-for="item in formSelect.pro" :key="item.value" :label="item.label" :value="item.value">-->
<!--                    </el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->

<!--            <el-form-item label="状态" prop="status" :rules="rule.selected ">-->
<!--                <el-select v-model="formAdd.status" placeholder="请选择状态" style="width:218px;">-->
<!--                    <el-option v-for="item in formSelect.statu" :key="item.value" :label="item.label" :value="item.value">-->
<!--                    </el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="cancleAdd" size="mini" type="danger">取消</el-button>-->
<!--            <el-button type="primary" @click="saveAdd('formAdd')" size="mini">保存</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->
    <!-- 获取上传文件 -->
  <ByModel :model-title="'导入作业依赖数据'" :visible.sync="dialogImportData"  @close="importDatacancel" >
    <span v-if="fileList != ''">确认导入 “ {{fileList[0].name}} ” </span>
    <div  slot="modalFoot">
      <el-button @click="importDatacancel" >取消</el-button>
      <el-button type="primary" @click="importData" :loading="loadingUpload" >保存</el-button>
    </div>
  </ByModel>
<!--  <el-dialog title="导入作业依赖数据" :visible.sync="dialogImportData" :before-close="importDatacancel">-->
<!--        <span v-if="fileList != ''">确认导入 “ {{fileList[0].name}} ” </span>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="importDatacancel" size="mini" type="danger">取消</el-button>-->
<!--            <el-button type="primary" @click="importData" :loading="loadingUpload" size="mini">保存</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->
</div>
</template>

<script>
import * as validator from "@/utils/validator";
import {execFormPostByModuleUrl, execGetByModuleUrl, execPostByModuleUrl} from "@/utils/executeRequest";
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import {columArr, frolRules, fromItem, issueFromConfig, QuickItem} from "./mock";
import ByTable from "@/components/global/ByTable.vue";
import ByModel from "@/components/global/ByModel.vue";
import ByModelForm from "@/components/global/ByModelForm.vue";
import ByEmpty from "@/components/global/ByEmpty.vue";
let arr = [];
export default {
  components: {ByEmpty, ByModelForm, ByModel, ByTable, ByQuickSearch},
    data() {
        return {
          frolRules,
          issueFromConfig,
          fromItem,
          columArr,
          QuickItem,
            etl_sys_id: null,
            etl_sys_cd: null,
            etl_job_id: null,
            // sys_cd: '',
            rule: validator.default,
            form: {
                etl_job: null,
                pre_etl_job: null,
            },
            listDatas: [],
            tableData: [],
            dependTitle: '',
            deleteTitle: '',
            multipleSelection: [],
            fileList: [],
            dialogFormVisibleAdd: false,
            dialogVisibleDelete: false,
            dialogImportData: false,
            loadingUpload: false,
            statusNum: [],
            formAdd: {
                etl_sys_id:null,
                etl_sys_cd: null,
                etl_job_id: null,
                etl_job: null,
                pre_etl_sys_id: null,
                pre_etl_job_id: null,
                status: '',
                sub_sys_id: null,
                pre_sub_sys_id: null,
            },
            formDelete: {
                etl_sys_id: null,
                etl_sys_cd: null,
                etl_job_id: null,
                etl_job: null,
                pre_etl_job_id: null,
                pre_etl_sys_id: null,
            },
            formSelect: {
                job: [],
                pro: [],
                statu: [],
            },
            formOld: {
                oldEtlJobId: '',
                oldPreEtlJobId: '',
            },
            // pagesize: 5,
            // currpage: 1,
            // pageLength: 0,
          pagination: {
            total: 5,
            pageNum: 1,
            pageSize: 10,
            pageSizes: [10, 20, 50, 100],
          },
        };
    },
    mounted() {
        this.etl_sys_id = this.$route.query.etl_sys_id;
        this.etl_sys_cd = this.$route.query.etl_sys_cd;
        this.etl_job_id = this.$route.query.etl_job_id;
        this.getCodeItems("Status");
        this.getStatu();
        // this.sys_cd = sessionStorage.getItem('sys_cd');
        this.getProName();
        this.getJobName();
        if (this.$route.query.etl_job_id != undefined && this.$route.query.name != "etlJobDef") { //判断从哪里来的
            // this.form.etl_job_id = this.$route.query.etl_job_id;
        }
        this.refreshTable();
    },
    methods: {
      queryQuick(val){
        this.form = val;
        this.refreshTable();
      },
        //刷新表格
        refreshTable() {
            var params = {
                etl_sys_id : this.etl_sys_id,
                etl_job_id: this.etl_job_id,
                etl_job: this.form.etl_job,
                pre_etl_job : this.form.pre_etl_job,
                currPage: this.pagination.pageNum,
                pageSize: this.pagination.pageSize
            };
            if (this.$route.query.etl_job != undefined && this.$route.query.name == "etlJobDef"){
                params.pageType = "etlJobDef";
            }
            this.$executeRequest.execGetByModuleUrl('/etlMage/jobconfig/searchEtlDependencyByPage',params).then(res => {
                if (res && res.success){
                  let dates = res.data.etlDependencyList;
                  this.pagination.total = res.data.totalSize;
                  dates.forEach((item) => {
                    //状态
                    this.statusNum.forEach(val => {
                      if (item.status == val.code) {
                        item.statu = val.value;
                      }
                    })
                  });
                  this.tableData = dates;
                }
            });
        },
        // 判断是新增 还是批量新增 1 为新增 2 为批量新增
      checkFromAdd(tag){
        this.fromItem.map(item =>{
            if (item.tag === '0'){
              item.conceal  = 'true';
            } else if (tag === item.tag){
              item.conceal  = 'true';
            }else {
              item.conceal  = 'false';
            }
        })
      },
        // 获取表格代码项
        getCodeItems(val) {
            if (val == "Status") { //调度频率
              this.$Code.getCategoryItems({category: 'Status'}).then(res => {
                    this.statusNum = res.data;
                })
            }
        },
        //获取作业名称/上游作业名称下拉框数据
        getJobName(val) {
            // let params = {};
            // params["etl_sys_cd"] = this.sys_cd;
            var params ={
                etl_sys_id : this.etl_sys_id
            };
            let arr = [];
            let obj = {};
            this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig/findJobByEtlSysId',params).then(res => {
                if(res && res.data && res.success){
                    res.data.forEach((item) => {
                        obj.id = item.etl_job_id;
                        obj.label = item.etl_job;
                        obj.value = item.etl_job_id;
                        arr.push(obj);
                        obj = {};
                    });
                    this.formSelect.job = arr;
                  this.setOptions("pre_etl_job_id",arr);
                    this.setOptions("etl_job_id",arr);
                    this.listDatas = arr;
                }
            });
        },
        // input框的历史信息
        querySearch(queryString, cb) {
            var res = this.listDatas;
            var results = queryString ? res.filter(this.createFilter(queryString)) : res;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        // input框的回调
        handleSelect(item){
            this.form.etl_job = item.label;
            this.form.etl_job_id = item.id;
        },
        // input框的回调
        handleSelect2(item){
            this.form.pre_etl_job = item.label;
            this.form.pre_etl_job_id = item.id;
        },
        createFilter(queryString) {
            return (res) => {
                return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
            };
        },
        //获取任务名称/上游任务名称下拉框数据
        getProName() {
            // let params = {};
            // params["etl_sys_cd"] = this.sys_cd;
            let arr = [];
            var params = {
                etl_sys_id : this.etl_sys_id
            };
            this.$executeRequest.execGetByModuleUrl('/etlMage/jobconfig/searchEtlSubSys',params).then(res => {
                if(res && res.success && res.data){
                    arr = res.data;
                    arr.forEach((item) => {
                        item.label = item.sub_sys_desc + '(' + item.sub_sys_cd + ')';
                        item.value = item.sub_sys_id;
                    });
                    this.formSelect.pro = arr;
                    this.setOptions("sub_sys_id",arr);
                  this.setOptions("pre_sub_sys_id",arr);

                }
            });
        },
      setOptions(prop,data){
        this.fromItem.map(item =>{
          if (item.prop === prop){
            item.options = data;
          }
        })
      },
        //获取状态下拉框数据
        getStatu() {
            // let params = {};
            // params["category"] = "Status";
            let arr = [];
            var params = {
                category: "Status"
            };
            this.$Code.getCategoryItems(params).then(res => {
                if(res && res.success && res.data){
                    arr = res.data;
                    arr.forEach((item) => {
                        item.label = item.value;
                        item.value = item.code;
                    });
                    this.formSelect.statu = arr;
                    this.setOptions('status',arr);
                }
            });
        },
        //选中的数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //新增按钮
        handleAdd() {
        this.checkFromAdd('1');
            this.dialogFormVisibleAdd = true;
            this.dependTitle = '添加作业依赖';
            this.formAdd.etl_sys_id = this.etl_sys_id;
            this.formAdd.etl_sys_cd = this.etl_sys_cd;
            this.formAdd.pre_etl_sys_id = this.etl_sys_id;
            this.formAdd.pre_etl_sys_cd = this.etl_sys_cd;
        },
        //批量新增按钮
        handleBatchAdd() {
        this.checkFromAdd('2');
            this.dialogFormVisibleAdd = true;
            this.dependTitle = '批量添加作业依赖';
            this.formAdd.etl_sys_id = this.etl_sys_id;
            this.formAdd.etl_sys_cd = this.etl_sys_cd;
            this.formAdd.pre_etl_sys_id = this.etl_sys_id;
            this.formAdd.pre_etl_sys_cd = this.etl_sys_cd;
            // this.formAdd.sub_sys_id = this.sub_sys_id;
            // this.formAdd.pre_sub_sys_id = this.pre_sub_sys_id;

        },
      operateHandler(type, row){
        if (type === 'edit'){
          this.handleEdit(row);
        }else if (type === 'del'){
          this.handleDelete(row);
        }
      },
        //批量删除按钮
        handleBatchDelete() {
            if (this.multipleSelection.length == 0) {
                this.$Msg.customizTitle("请选择需要删除的数据", "warning");
            } else {
                this.$confirm('确认批量删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    let params = new FormData();
                    params.append("etlDependencies", JSON.stringify(this.multipleSelection));
                    // var params = this.multipleSelection;
                    console.log("handleBatchDelete")
                    console.log(this.multipleSelection)
                    this.$executeRequest.execFormPostByModuleUrl('/etlMage/jobconfig/batchDeleteEtlDependency', params).then(res => {
                        if (res && res.success) {
                            this.refreshTable();
                            this.$Msg.customizTitle("批量删除成功", "success");
                        }
                    })
                }).catch(() => {
                    this.$Msg.customizTitle("已取消批量删除", "info");
                });
            }
        },
        //编辑按钮
        handleEdit( row) {
          console.log(row)
            this.dialogFormVisibleAdd = true;
            this.dependTitle = '修改作业依赖';
            this.formAdd = Object.assign({}, row);
            this.formAdd.etl_sys_cd = this.etl_sys_cd;
            // this.formAdd.etl_job_id = row.etl_job_id;
            this.formOld.oldEtlJobId = row.etl_job_id;
            this.formOld.oldPreEtlJobId = row.pre_etl_job_id;
        },
        //删除按钮
        handleDelete(row) {
            console.log(row);
            // this.formDelete.etl_sys_cd = row.etl_sys_cd;
            this.formDelete.etl_job_id = row.etl_job_id;
            this.formDelete.etl_sys_id = row.etl_sys_id;
            this.formDelete.pre_etl_job_id = row.pre_etl_job_id;
            this.formDelete.pre_etl_sys_id = row.pre_etl_sys_id;
            this.$confirm('确认删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                // let params = {};
                // params["etl_sys_cd"] = this.formDelete.etl_sys_cd;
                // params["etl_job"] = this.formDelete.etl_job;
                // params["pre_etl_job"] = this.formDelete.pre_etl_job;
                // params["pre_etl_sys_cd"] = this.formDelete.pre_etl_sys_cd;
                var params = {
                    etl_sys_id : this.formDelete.etl_sys_id,
                    etl_job_id : this.formDelete.etl_job_id,
                    pre_etl_job_id : this.formDelete.pre_etl_job_id,
                    pre_etl_sys_id : this.formDelete.pre_etl_sys_id
                };
                this.$executeRequest.execGetByModuleUrl('/etlMage/jobconfig/deleteEtlDependency',params).then(res => {
                    if (res && res.success) {
                        this.refreshTable();
                        this.$Msg.customizTitle("删除成功", "success");
                    }
                })
            }).catch(() => {
                this.$Msg.customizTitle("已取消删除", "info");
            });

        },
        //模态框添加/修改/批量添加取消按钮
        cancleAdd() {
            this.dialogFormVisibleAdd = false;
            this.formAdd = {};
            this.formOld = {};
            // this.$refs.formAdd.resetFields();
        },
        //模态框添加/修改/批量添加保存按钮
        saveAdd(formName) {
        this.$refs.formAdd.transferData().then(data =>{
          if (this.dependTitle == '添加作业依赖') {
            // let params = {};
            // params["etl_sys_cd"] = this.formAdd.etl_sys_cd;
            // params["etl_job"] = this.formAdd.etl_job;
            // params["pre_etl_sys_cd"] = this.formAdd.pre_etl_sys_cd;
            // params["pre_etl_job"] = this.formAdd.pre_etl_job;
            // params["status"] = this.formAdd.status;
            var params = {
              etl_sys_id: this.formAdd.etl_sys_id,
              etl_job_id: this.formAdd.etl_job_id,
              pre_etl_sys_id: this.formAdd.pre_etl_sys_id,
              pre_etl_job_id: this.formAdd.pre_etl_job_id,
              status: this.formAdd.status
            };
            this.$executeRequest.execPostByModuleUrl('/etlMage/jobconfig/saveEtlDependency',params).then(res => {
              if (res && res.code == 999) {
                this.refreshTable();
                this.$Msg.customizTitle("添加成功", "success");
                this.dialogFormVisibleAdd = false;
                this.formAdd = {};
                // this.$refs.formAdd.resetFields();
              }
            });

          } else if (this.dependTitle == '修改作业依赖') {
            // let params = {};
            // params["etl_sys_cd"] = this.formAdd.etl_sys_cd;
            // params["etl_job"] = this.formAdd.etl_job;
            // params["pre_etl_sys_cd"] = this.formAdd.pre_etl_sys_cd;
            // params["pre_etl_job"] = this.formAdd.pre_etl_job;
            // params["status"] = this.formAdd.status;
            // params["oldEtlJob"] = this.formOld.oldEtlJob;
            // params["oldPreEtlJob"] = this.formOld.oldPreEtlJob;
            var params = {
              etl_sys_id: this.formAdd.etl_sys_id,
              etl_job_id: this.formAdd.etl_job_id,
              pre_etl_sys_id: this.formAdd.pre_etl_sys_id,
              pre_etl_job_id: this.formAdd.pre_etl_job_id,
              status: this.formAdd.status,
              oldEtlJobId: this.formOld.oldEtlJobId,
              oldPreEtlJobId: this.formOld.oldPreEtlJobId
            }
            this.$executeRequest.execGetByModuleUrl('/etlMage/jobconfig/updateEtlDependency',params).then(res => {
              if (res.code == 999) {
                this.refreshTable();
                this.$Msg.customizTitle("修改成功", "success");
                this.dialogFormVisibleAdd = false;
                this.formAdd = {};
                this.formOld = {};
                // this.$refs.formAdd.resetFields();
              }
            });
          } else if (this.dependTitle == '批量添加作业依赖') {
            // let params = {};
            // params["etl_sys_cd"] = this.formAdd.etl_sys_cd;
            // params["sub_sys_cd"] = this.formAdd.sub_sys_cd;
            // params["pre_etl_sys_cd"] = this.formAdd.pre_etl_sys_cd;
            // params["pre_sub_sys_cd"] = this.formAdd.pre_sub_sys_cd;
            // params["status"] = this.formAdd.status;
            var params = {
              etl_sys_id : this.formAdd.etl_sys_id,
              sub_sys_id : this.formAdd.sub_sys_id,
              pre_etl_sys_id: this.formAdd.pre_etl_sys_id,
              pre_sub_sys_id: this.formAdd.pre_sub_sys_id,
              status: this.formAdd.status
            };
            this.$executeRequest.execGetByModuleUrl('/etlMage/jobconfig/batchSaveEtlDependency',params).then(res => {
              if (res.code == 999) {
                this.refreshTable();
                this.$Msg.customizTitle("批量添加成功", "success");
                this.dialogFormVisibleAdd = false;
                this.formAdd = {};
                // this.$refs.formAdd.resetFields();
              }
            });

          }
        }).catch( err =>{

        })
        },
        beforeClose() {
            this.formAdd = {};
            // this.$refs.formAdd.resetFields();
            this.dialogFormVisibleAdd = false;
            this.dialogVisibleDelete = false;
        },
        //分页方法
        handleCurrentChange(cpage) {
            this.pagination.pageNum = cpage;
            this.refreshTable();
        },
        handleSizeChange(psize) {
            this.pagination.pageSize = psize;
            this.refreshTable();
        },
        //文件超出个数限制时的钩子
        handleExceed(files, fileList) {
            this.$Msg.customizTitle("只能选择一个文件", "warning");
        },
        // 获取上传的文件详情
        handleChange(file, fileList) {
            this.fileList = fileList;
            if (fileList.length != 0) {
                this.dialogImportData = true;
            } else {
                this.dialogImportData = false;
            }
            arr = fileList;
        },
        // 取消数据导入
        importDatacancel() {
            this.dialogImportData = false;
            this.fileList = [];
            // this.$Msg.customizTitle("已取消导入数据", "info");
        },
        //导入数据按钮
        importData() {
            if (arr.length > 0) {
                this.loadingUpload = true;
                let param = new FormData() // 创建form对象
                for (let i = 0; i < arr.length; i++) {
                    param.append('file', arr[i].raw);
                }
                param.append('table_name', 'etl_dependency');
                this.$executeRequest.execUploadFileByModuleUrl('/etlMage/jobconfig/uploadExcelFile',param).then(res => {
                    if (res && res.success) {
                        this.$Msg.customizTitle("导入数据成功", "success");
                        this.refreshTable();
                        this.fileList = [];
                        this.dialogImportData = false;
                        this.loadingUpload = false;
                    } else {
                        this.loadingUpload = false;
                    }
                });
            } else {
                this.$Msg.customizTitle("请选择上传文件", "warning");
            }

        },
        //下载按钮
        downloadModel() {
            let that = this;
            this.$executeRequest.execGetByModuleUrl('/etlMage/jobconfig/generateExcel',{
                etl_sys_id: that.$route.query.etl_sys_id,
                tableName: 'etl_dependency'
            }).then(res => {
                if (res&&res.success) {
                    that.downloadFile(res.data)
                }
            })
        },
        // 下载模板表格
        downloadFile(val) {
            this.$executeRequest.execDownloadFileByModuleUrl('/etlMage/jobconfig/downloadFile',{
                fileName: val
            }).then(res => {
                this.filename = val;
                this.$file.fileDownload(res, val);
            })
        },
        gotoWorkId() { // 返回任务页面
            this.$router.push({
                name: 'menus',
                query: {
                    name: '/subSystem',
                    dec: this.$Base64.encode('任务'),
                    etl_sys_name: this.$route.query.etl_sys_name,
                    etl_sys_id: this.$route.query.etl_sys_id,
                    etl_sys: this.$route.query.etl_sys,
                }
            });
            this.$emit('viewIn', '/subSystem', '任务');
        }
    },
};
</script>

<style scoped>
.tabBtns {
    margin-top: 15px;
}

.demo-form-inlines {
    height: 32px;
}

.searchBtn {
    margin-left: 10px;
}

.buttonStyle {
    display: block;
    float: left;
    margin-right: 10px;
    margin-left: 0px;
}

.subSystemdiv {
    float: right;
    margin-bottom: 14px;
}
</style><style>
.el-autocomplete-suggestion li {
    overflow: visible;
    /* text-overflow: ellipsis; */
}
</style>
