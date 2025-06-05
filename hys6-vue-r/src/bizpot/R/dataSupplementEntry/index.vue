<template>
    <div class="dfproinfo">
        <i class="el-icon-document"><span>项目列表</span></i>
        <ByQuickSearch
            :formItems="formItems"
            :extraButton="button"
            @search="searchSystemLogByNameOrType"
            @reset="reset"
            @btnClick="OpenSavePage('add')"
        ></ByQuickSearch>
        <el-row class="partOne">
            <ByTable
              :tableData="tableData"
              :columnArr="columnArr"
              :pagination="pagination"
              @operateItem="operateItem"
              @sizeChange="handleSizeChange"
              @currentChange="handleCurrentChange"
            ></ByTable>
        </el-row>
        <!-- 新增用户弹出框 -->
        <ByModel
            :modelTitle="title"
            :visible.sync="dialogFormVisibleAdd"
        >
          <ByModelForm
            :formData="form"
            :formConfig="formConfig"
            :formItems="ModelFromItems"
          ></ByModelForm>
          <template slot="modalFoot">
            <el-button type="primary" v-if="this.dfProName == 'add'" @click="saveForm()">保存</el-button>
            <el-button type="primary" v-else @click="updateForm()">编辑</el-button>
            <el-button @click="dialogFormVisibleAdd = false">取消</el-button>
          </template>
        </ByModel>
    </div>
</template>

<script>
    import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import {
  formItems,
  button,
  columnArr,
  formConfig,
  ModelFromItems
} from './mock'
    import ByTable from "@/components/global/ByTable.vue";
    import {execByControllerMappingName} from "@/utils/executeRequest";
    import ByModel from "@/components/global/ByModel.vue";
    import ByModelForm from "@/components/global/ByModelForm.vue";
export default {
  components: {ByModelForm, ByModel, ByTable, ByQuickSearch},
        data() {
            return {
                formItems,
                button,
                columnArr,
                pagination:{
                  pageNum: 1,
                  pageSize:10,
                  pageSizes:[10, 50, 100, 200],
                  total:0,
                },
                title: '',
                formConfig,
                ModelFromItems,
                dfProName: '',
                formInline: {},
                dataStore: [],
                tableData: [],
                labelPosition: 'left',
                dialogFormVisibleAdd: false,
                value: '',
                form: {
                    pro_name: '',
                    df_type: '',
                    dsl_id: '',
                    df_remarks: '',
                    df_pid: ''
                },
            }
        },
        mounted() {
            this.searchDfProInfo();
            this.querydataStore();
            this.queryDfType();
            this.ModelFromItems.forEach(item => {
              if (item.prop =='df_type'){
                  item.options=[];
              } else if (item.prop == 'dsl_id'){
                item.options=[];
              }
            })
        },
        methods: {
            operateItem(type,data){
              if (type == 'edit'){
                this.dialogFormVisibleAdd = true
                this.updateMsg('update',data)
              }else if (type == 'delete'){
                this.deleteMsg(data)
              }else if (type == 'submit'){
                this.updateState(data)
              }else if (type == 'rollback'){
                this.revokeSub(data)
              } else {
                this.showMsg(data)
              }
            },
            //获取补录类型代码项
            queryDfType() {
                this.$Code.getCategoryItems({category: 'DFType'}).then(res =>{
                  res.data.forEach(dftype => {
                    this.formItems.forEach(item =>{
                      if (item.type === 'select'){
                        let param = {};
                        param['value']=dftype.code;
                        param['label']=dftype.value;
                        item.options.push(param);
                      }
                    })
                    this.ModelFromItems.forEach(item =>{
                      if (item.prop == 'df_type'){
                        let param = {};
                        param['value']=dftype.code;
                        param['label']=dftype.value;
                        item.options.push(param);
                      }

                    })
                  })
                })
            },
            // 获取数据补录项目信息
            searchDfProInfo() {
                this.tableData=[]
                this.$executeRequest.execByControllerMappingName("/dfPro/queryDfProInfo",{
                  currPage: this.pagination.pageNum,
                  pageSize: this.pagination.pageSize,
                }).then(res =>{
                  this.dateTimeFormat(res.data.dfProInfoResList);
                  for (let i = 0; i < res.data.dfProInfoResList.length; i++){
                    if (res.data.dfProInfoResList[i].df_type =='1'){
                      res.data.dfProInfoResList[i].type='监管补录'
                    }else if (res.data.dfProInfoResList[i].df_type =='2'){
                      res.data.dfProInfoResList[i].type='常规补录'
                    }else {
                      res.data.dfProInfoResList[i].type='临时补录'
                    }
                    if (res.data.dfProInfoResList[i].submit_state =='0'){
                      res.data.dfProInfoResList[i].state ='草稿'
                    }else if (res.data.dfProInfoResList[i].submit_state =='1'){
                      res.data.dfProInfoResList[i].state ='未审批'
                    }else if (res.data.dfProInfoResList[i].submit_state =='2'){
                      res.data.dfProInfoResList[i].state ='已通过'
                    }else {
                      res.data.dfProInfoResList[i].state ='已拒绝'
                    }
                    this.tableData.push({
                      pro_name : res.data.dfProInfoResList[i].pro_name,
                      df_type : res.data.dfProInfoResList[i].df_type,
                      submit_date : res.data.dfProInfoResList[i].submit_date + " " + res.data.dfProInfoResList[i].submit_time,
                      submit_state : res.data.dfProInfoResList[i].submit_state,
                      df_pid : res.data.dfProInfoResList[i].df_pid,
                      dsl_id : res.data.dfProInfoResList[i].dsl_id,
                      number : res.data.dfProInfoResList[i].number,
                      type : res.data.dfProInfoResList[i].type,
                      state : res.data.dfProInfoResList[i].state,
                    })
                  }
                  this.totalSize = res.data.totalSize
                  this.pagination.total = res.data.totalSize
                })
            },
            // 日期时间格式化
            dateTimeFormat(data) {
                data.forEach(item => {
                    if (item.submit_date) {
                        item.submit_date = this.$Date.dateFormat(item.submit_date);
                    }
                    if (item.submit_time) {
                        item.submit_time = this.$Date.hourFormat(item.submit_time);
                    }
                });
            },
            // 主页面查询
            searchSystemLogByNameOrType(data) {
              this.tableData=[]
              this.$executeRequest.execByControllerMappingName("/dfPro/queryListByNameOrType",{
                currPage: this.pagination.pageNum,
                pageSize: this.pagination.pageSize,
                pro_name:data.pro_name,
                df_type:data.df_type
              }).then(res => {
                this.dateTimeFormat(res.data.dfProInfoResList)
                for (let i = 0; i < res.data.dfProInfoResList.length; i++){
                  if (res.data.dfProInfoResList[i].df_type =='1'){
                    res.data.dfProInfoResList[i].type='监管补录'
                  }else if (res.data.dfProInfoResList[i].df_type =='2'){
                    res.data.dfProInfoResList[i].type='常规补录'
                  }else {
                    res.data.dfProInfoResList[i].type='临时补录'
                  }
                  if (res.data.dfProInfoResList[i].submit_state =='0'){
                    res.data.dfProInfoResList[i].state ='草稿'
                  }else if (res.data.dfProInfoResList[i].submit_state =='1'){
                    res.data.dfProInfoResList[i].state ='未审批'
                  }else if (res.data.dfProInfoResList[i].submit_state =='2'){
                    res.data.dfProInfoResList[i].state ='已通过'
                  }else {
                    res.data.dfProInfoResList[i].state ='已拒绝'
                  }
                  this.tableData.push({
                    pro_name : res.data.dfProInfoResList[i].pro_name,
                    df_type : res.data.dfProInfoResList[i].df_type,
                    submit_date : res.data.dfProInfoResList[i].submit_date + " " + res.data.dfProInfoResList[i].submit_time,
                    submit_state : res.data.dfProInfoResList[i].submit_state,
                    df_pid : res.data.dfProInfoResList[i].df_pid,
                    dsl_id : res.data.dfProInfoResList[i].dsl_id,
                    number : res.data.dfProInfoResList[i].number,
                    type : res.data.dfProInfoResList[i].type,
                    state : res.data.dfProInfoResList[i].state,
                  })
                }
                this.totalSize = res.data.totalSize
                this.pagination.total = res.data.totalSize
              })
            },
            // 主页面重置
            reset() {
                this.formInline = {};
                this.searchDfProInfo()
            },
            // 获取数据源信息
            querydataStore() {
                this.$executeRequest.execPostByControllerMappingName("/dfPro/queryAllDataLayer").then(res =>{
                  this.dataStore = res.data;
                  res.data.forEach(val => {
                    ModelFromItems.forEach(item =>{
                      if (item.prop == 'dsl_id'){
                        let param = {};
                        param['label'] = val.dsl_name;
                        param['value'] = val.dsl_id;
                        item.options.push(param);
                      }
                    })
                  })
                })
            },
            // 编辑按钮
            updateMsg(val, scope) {
                this.dfProName = val;
                this.form.pro_name = scope.pro_name;
                this.form.df_type = scope.df_type;
                this.form.dsl_id = scope.dsl_id;
                this.form.df_remarks = scope.df_remarks;
                this.form.df_pid = scope.df_pid;
                this.ModelFromItems.map(item => item.prop === 'dsl_id' && (item.disabled = true))
            },
            // 编辑弹窗中编辑按钮
            updateForm() {
                this.$executeRequest.execPostByControllerMappingName("/dfPro/updateInfo",this.form).then(res =>{
                  if (res.code == 999 && res.success) {
                    this.$Msg.customizTitle('编辑成功！', 'success')
                    this.searchDfProInfo();
                    this.dialogFormVisibleAdd = false;
                  } else {
                    this.$message.error(res.message);
                    this.searchDfProInfo();
                    this.dialogFormVisibleAdd = true;
                  }
                })
            },
            // 新增按钮
            OpenSavePage(val) {
              this.dfProName = val;
              this.form.pro_name = '';
              this.form.df_type = '';
              this.form.dsl_id = '';
              this.form.df_remarks = '';
              this.form.df_pid = '';
              this.dialogFormVisibleAdd = true
              this.ModelFromItems.map(item => item.prop == 'dsl_id' && (item.disabled = false))
            },
            // 新增保存项目
            saveForm() {
                this.$executeRequest.execPostByControllerMappingName("/dfPro/saveInfo",this.form).then(res => {
                  if (res.code == 999 && res.success) {
                    this.$Msg.customizTitle('添加成功！', 'success')
                    this.searchDfProInfo();
                    // this.form = [];
                    this.dialogFormVisibleAdd = false;
                  } else {
                    this.$message.error(res.message);
                  }
                })
            },
            // 删除按钮
            deleteMsg(scope) {
                let params = {
                    df_pid: scope.df_pid

                }
                this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$executeRequest.execByControllerMappingName("/dfPro/deleteInfoByPid",params).then(res =>{
                      if (res.code == 999 && res.success) {
                        this.searchDfProInfo();
                        this.$Msg.customizTitle('删除成功！', 'success')
                      } else {
                        this.searchDfProInfo();
                        this.$message.error(res.message);
                      }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 提交项目操作
            updateState(scope) {
                let params = {
                    df_pid: scope.df_pid,
                    submit_state: scope.submit_state
                }
                this.$confirm('此操作将提交审批, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$executeRequest.execByControllerMappingName("/dfPro/updateSubmitStateById",params).then(res =>{
                      if (res.code == 999 && res.success) {
                        this.searchDfProInfo();
                        this.$Msg.customizTitle('提交审批成功！', 'success')
                      } else {
                        this.searchDfProInfo();
                        this.$message.error(res.message);
                      }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消提交'
                    });
                });
            },
            // 撤销提交操作
            revokeSub(scope){
              let params = {
                df_pid: scope.df_pid,
                submit_state: scope.submit_state
              }
              this.$confirm('此操作将撤销提交, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$executeRequest.execByControllerMappingName("/dfPro/updateSubmitStateById",params).then(res =>{
                  if (res.code == 999 && res.success) {
                    this.searchDfProInfo();
                    this.$Msg.customizTitle('撤销提交成功！', 'success')
                  } else {
                    this.searchDfProInfo();
                    this.$message.error(res.message);
                  }
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消撤销'
                });
              });
            },
            showMsg(row){
                this.$router.push({
                    name: "dataSheet",
                    query: {"dfPid": row.df_pid,"submit_state":row.submit_state}
                })
            },
            handleSizeChange(val) {
                this.pagesize = val
                this.tableData = [];
                if (this.formInline.pro_name !== undefined || this.formInline.df_type !== undefined){
                  this.searchSystemLogByNameOrType();
                } else {
                  this.searchDfProInfo()
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.tableData = [];
              if (this.formInline.pro_name !== undefined || this.formInline.df_type !== undefined){
                this.searchSystemLogByNameOrType();
              } else {
                this.searchDfProInfo()
              }
            }
        }
    }
</script>

<style scoped>
    .el-icon-document {
        font-size: 18px;
        text-align: center;
        color: #2196f3;
    }
</style>