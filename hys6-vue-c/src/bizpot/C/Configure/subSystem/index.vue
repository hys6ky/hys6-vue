<template>
<div class="subSystem">
    <div  style="  height:32px;margin-bottom:10px">
      <div style="float: right;">
      <el-button  type="primary" size="small">
        <el-upload  accept=".xlsx" action="" :show-file-list="false" :auto-upload="false" :on-change="handleChange" :limit="1" :on-exceed="handleExceed" :fileList="fileList">
            <span>导入数据</span>
        </el-upload>
      </el-button>
        <el-button   type="primary" size="small" @click="downloadModel">下载模板
        </el-button>
        <el-button   type="primary" size="small" @click="handleAdd">新增
        </el-button>
        <el-button   type="primary" size="small" @click="handleBatchDelete">批量删除
        </el-button>
      </div>
    </div>
    <div style="height: 100%">
      <ByTable :table-data="tableData" :column-arr="columnArr1" @linkTo="linkTo" @tableInput="searchBtn" :pagination="pagination" @handleMultiple="handleMultipleMethod" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @operateItem="operateHandler" v-if="tableData"></ByTable>
      <ByEmpty v-else></ByEmpty>
    </div>
<!--    <el-table size="medium" ref="multipleTable" :data="tableData" tooltip-effect="dark" stripe border style="width: 100%" @selection-change="handleSelectionChange">-->
<!--        <el-table-column type="selection" align='center'  width="55">-->
<!--        </el-table-column>-->
<!--        &lt;!&ndash; <el-table-column prop="etl_sys_cd" show-overflow-tooltip label="工程编号" align='center'>-->
<!--        </el-table-column> &ndash;&gt;-->
<!--        <el-table-column prop="sub_sys_cd" show-overflow-tooltip label="任务编号" align='center'>-->
<!--            <template slot-scope="scope">-->
<!--                <span @click="gotoWorkDetail(scope.row)" style="color:#409EFF;cursor:pointer "> {{scope.row.sub_sys_cd}}</span>-->
<!--            </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="sub_sys_desc" show-overflow-tooltip label="任务名称" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="comments" show-overflow-tooltip label="备注" align='center'>-->
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
<!--        <el-pagination layout=" total, sizes,prev, pager, next, jumper" style="float:right" :page-sizes="[5,10,20,25,50,100,1000]"  :page-size="pagesize" :total="pageLength" @current-change="handleCurrentChange" @size-change="handleSizeChange">-->
<!--        </el-pagination>-->
<!--    </el-row>-->
    <!-- 添加任务模态框 -->
    <ByModel
        :visible.sync="dialogFormVisibleAdd"
        :model-title="title"
        @close="beforeClosechange">
      <ByModelForm :form-data="formAdd" :form-items="fromItem" :form-rules="frolRules" :form-config="modelFormConfig" ref="formAddAndUpdate"></ByModelForm>
      <template slot="modalFoot">
        <el-button @click="beforeClosechange">取 消</el-button>
        <el-button type="primary" @click="saveAddAndUpdate" v-debounce>
          确 认
        </el-button>
      </template>
    </ByModel>

<!--    <el-dialog title="添加任务" :visible.sync="dialogFormVisibleAdd" width="42%" :before-close="beforeClosechange">-->
<!--        <el-form :model="formAdd" ref="formAdd" class="demo-ruleForm" label-width="120px">-->
<!--            <el-form-item label="工程编号" prop="etl_sys_cd" :rules="filter_rules([{required: true}])">-->
<!--                <el-input v-model="formAdd.etl_sys_cd" autocomplete="off" placeholder="工程编号" disabled></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="任务编号" prop="sub_sys_cd" :rules="filter_rules([{required: true}])">-->
<!--                <el-input v-model="formAdd.sub_sys_cd" autocomplete="off" placeholder="任务编号"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="任务名称" prop="sub_sys_desc" :rules="filter_rules([{required: true}])">-->
<!--                <el-input v-model="formAdd.sub_sys_desc" autocomplete="off" placeholder="任务名称"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="备注" prop="comments">-->
<!--                <div style="width:330px">-->
<!--                    <el-input type="textarea" v-model="formAdd.comments" autocomplete="off" placeholder="备注"></el-input>-->
<!--                </div>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="cancleAdd" size="mini" type="danger">取消</el-button>-->
<!--            <el-button type="primary" @click="saveAdd('formAdd')" size="mini">保存</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->
    <!-- 修改任务模态框 -->
<!--    <el-dialog title="修改任务" :visible.sync="dialogFormVisibleModify" width="42%">-->
<!--        <el-form :model="formModify" ref="formModify" class="demo-ruleForm" label-width="120px">-->
<!--            <el-form-item label="工程编号" prop="etl_sys_cd" :rules="filter_rules([{required: true}])">-->
<!--                <el-input v-model="formModify.etl_sys_cd" autocomplete="off" placeholder="工程编号" disabled></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="任务编号" prop="sub_sys_cd" :rules="filter_rules([{required: true}])">-->
<!--                <el-input v-model="formModify.sub_sys_cd" autocomplete="off" placeholder="任务编号" disabled></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="任务名称" prop="sub_sys_desc" :rules="filter_rules([{required: true}])">-->
<!--                <el-input v-model="formModify.sub_sys_desc" autocomplete="off" placeholder="任务名称"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="备注" prop="comments">-->
<!--                <div style="width:330px">-->
<!--                    <el-input type="textarea" v-model="formModify.comments" autocomplete="off" placeholder="备注"></el-input>-->
<!--                </div>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="cancleModify" size="mini" type="danger">取消</el-button>-->
<!--            <el-button type="primary" @click="saveModify('formModify')" size="mini">保存</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->
    <!-- 获取上传文件 -->
    <el-dialog title="导入任务数据" :visible.sync="dialogImportData" :before-close="importDatacancel">
        <span v-if="fileList !== ''">确认导入 “ {{showName}} ” </span>
        <div slot="footer" class="dialog-footer">
            <el-button @click="importDatacancel" size="mini" type="danger">取消</el-button>
            <el-button type="primary" @click="importData" :loading="loadingUpload" size="mini">保存</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>

import ByTable from "@/components/global/ByTable.vue";
import {columnArr1,fromItem,modelFormConfig,frolRules} from "./mock";
import ByModel from "@/components/global/ByModel.vue";
import ByModelForm from "@/components/global/ByModelForm.vue";
import ByEmpty from "@/components/global/ByEmpty.vue";
let arr = [];
export default {
  components: {ByEmpty, ByModelForm, ByModel, ByTable},
    data() {
        return {
          title: '新增任务',
          frolRules,
          modelFormConfig,
            fromItem,
            columnArr1,
            input: '',
            sys_id:'',
            sys_cd: '',
            tableData: [],
            multipleSelection: [],
            fileList: [],
            showName:"",
            dialogFormVisibleAdd: false,
            dialogFormVisibleModify: false,
            dialogImportData: false,
            loadingUpload: false,
            formAdd: {
                etl_sys_cd: '',
                sub_sys_cd: '',
                sub_sys_desc: '',
                comments: ''
            },
            deleteForm: {
                etl_sys_id: '',
                sub_sys_id: ''
            },
            // pagesize: 5,
            // currpage: 1,
            // pageLength: 0,
          // 0 为新增 1为编辑
          type: '',
          pagination: {
            total: 5,
            pageNum: 1,
            pageSize: 10,
            pageSizes: [10, 20, 50, 100],
          },
        };
    },
    mounted() {
      this.getTable();
    },
  methods: {
    saveAddAndUpdate(){
      this.$refs.formAddAndUpdate.transferData().then( data =>{ // 表单校验
        if (this.type === '0'){
        //   新增
          this.saveAdd();
        }else  if (this.type === '1'){
        //  修改
          this.saveModify();
        }
      }).catch(err =>{

      })
    },
    //勾选
    handleMultipleMethod(val) {
      this.multipleSelection = val;
    },
    operateHandler(type, row){
      if (type === 'edit'){
        this.type = '1';
        this.title = '编辑任务';
       this.handleEdit(row);
      }else if (type === 'del'){
        this.handleDelete(row);
      }
    },
        //刷新表格
        getTable() {
            let params = {};
            this.sys_cd = sessionStorage.getItem('sys_cd');
            this.sys_id = sessionStorage.getItem('sys_id');
            params["etl_sys_id"] = this.sys_id,
            params["sub_sys_cd"] = '';
            params["currPage"] = this.pagination.pageNum;
            params["pageSize"] = this.pagination.pagesize;
            this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig/searchEtlSubSysByPage',params).then(res => {
              if (res && res.success) {
                this.tableData = res.data.etlSubSysList;
                this.pagination.total = res.data.totalSize;
              }
            });
        },
        //选中的数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        //搜索按钮
        searchBtn(val) {
          console.log(val)
            let params = {};
            this.sys_cd = sessionStorage.getItem('sys_cd');
            this.sys_id = sessionStorage.getItem('sys_id');
          params["etl_sys_id"] = this.sys_id;
            params["etl_sys_cd"] = this.sys_cd;
            params["sub_sys_cd"] = val;
            params["currPage"] = this.pagination.pageNum;
            params["pageSize"] = this.pagination.pagesize;
            this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig/searchEtlSubSysByPage',params).then(res => {
                this.tableData = res.data.etlSubSysList;
                this.pagination.total = res.data.totalSize;
            });
        },
        //新增按钮
        handleAdd() {
          this.setDisabled(false);
            this.type = '0';
            this.title = "添加任务";
            this.formAdd = {etl_sys_cd: this.sys_cd};
            this.dialogFormVisibleAdd = true;
        },
        //批量删除按钮
        handleBatchDelete() {
            if (this.multipleSelection.length === 0) {
                this.$Msg.customizTitle("请选择需要删除的数据", "warning");
            } else {
                this.$confirm('确认批量删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    let arr = [];
                    this.multipleSelection.forEach((item) => {
                        arr.push(item.sub_sys_id);
                    });
                    let params = new FormData();
                    params.append("etl_sys_id", this.sys_id);
                    params.append("sub_sys_ids", arr);
                    this.$executeRequest.execFormPostByModuleUrl('etlMage/jobconfig/batchDeleteEtlSubSys',params).then(res => {
                        if (res && res.success) {
                            this.getTable();
                            this.$Msg.customizTitle("批量删除成功", "success");
                        }
                    })
                }).catch(() => {
                    this.$Msg.customizTitle("已取消批量删除", "info");

                });

            }
        },
        //编辑按钮
        handleEdit(row) {
          debugger
            this.setDisabled(true);
            this.dialogFormVisibleAdd = true;
            this.formAdd = Object.assign({}, row);
            this.formAdd['etl_sys_cd'] = this.sys_cd;
        },
        setDisabled(boolean){
          this.fromItem.map( item =>{
            if (item.prop === 'sub_sys_cd'){
              item.disabled = boolean;
            }
          })
        },
        linkTo(row){
          this.gotoWorkDetail(row);
        },
        //删除按钮
        handleDelete(row) {
            this.deleteForm.etl_sys_id = this.sys_id;
            this.deleteForm.sub_sys_id = row.sub_sys_id;
            this.$confirm('确认删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                let params = {};
                params["etl_sys_id"] = this.deleteForm.etl_sys_id;
                params["sub_sys_id"] = this.deleteForm.sub_sys_id;
                this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig/deleteEtlSubSys',params).then(res => {
                    if (res && res.success) {
                        this.getTable();
                        this.$Msg.customizTitle("删除成功", "success");
                    }
                })
            }).catch(() => {
                this.$Msg.customizTitle("已取消删除", "info");
            });
        },
        //模态框新增取消按钮
        cancleAdd() {
            this.formAdd = {};
            this.dialogFormVisibleAdd = false;
        },
        // 关闭弹出框之前触发事件
        beforeClosechange() {
          this.formAdd = {etl_sys_cd: this.sys_cd};
          this.dialogFormVisibleAdd = false;
        },
        //模态框新增保存按钮
        saveAdd(formName) {
             let params = {};
             params["etl_sys_id"] = this.sys_id;
             params["sub_sys_cd"] = this.formAdd.sub_sys_cd;
             params["sub_sys_desc"] = this.formAdd.sub_sys_desc;
             params["comments"] = this.formAdd.comments;
             this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig/saveEtlSubSys',params).then(res => {
                 if (res && res.success) {
                     this.getTable();
                     this.$Msg.customizTitle("保存成功", "success");
                     this.dialogFormVisibleAdd = false;
                     this.formAdd = {};
                 }
             })
        },
        //模态框修改取消按钮
        cancleModify() {
            this.dialogFormVisibleAdd = false;
        },
        //模态框修改保存按钮
        saveModify() {
          let params = {};
          params["etl_sys_id"] = this.sys_id;
          params["sub_sys_id"] = this.formAdd.sub_sys_id;
          params["sub_sys_cd"] = this.formAdd.sub_sys_cd;
          params["sub_sys_desc"] = this.formAdd.sub_sys_desc;
          params["comments"] = this.formAdd.comments;
          this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig/updateEtlSubSys',params).then(res => {
            if (res && res.success) {
              this.getTable();
              this.$Msg.customizTitle("保存成功", "success");
              this.dialogFormVisibleAdd = false;
              this.formModify = {};
            }
          })
        },
        //分页方法
        handleCurrentChange(cpage) {
            this.pagination.pageNum = cpage;
            this.getTable();
        },
        handleSizeChange(psize) {
            this.pagination.pagesize = psize;
            this.getTable();
        },
        //文件超出个数限制时的钩子
        handleExceed(files, fileList) {
            this.$Msg.customizTitle("只能选择一个文件", "warning");

        },
        // 获取上传的文件详情
        handleChange(file, fileList) {
            this.fileList = fileList;
            this.showName = fileList[0].name;
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
            this.$Msg.customizTitle("已取消导入数据", "info");
        },
        //导入数据按钮
        importData() {
            if (arr.length > 0) {
                this.loadingUpload = true;
                let param = new FormData() // 创建form对象
                for (let i = 0; i < arr.length; i++) {
                    param.append('file', arr[i].raw);
                }
                param.append('table_name', 'etl_sub_sys_list');
                this.$executeRequest.execUploadFileByModuleUrl('etlMage/jobconfig/uploadExcelFile',param).then(res => {
                    if (res && res.success) {
                        this.$Msg.customizTitle("导入数据成功", "success");
                        this.getTable();
                        this.fileList = [];
                        this.dialogImportData = false;
                        this.loadingUpload = false;
                    } else {
                        this.loadingUpload = false;
                    }
                });
                this.getTable();
            } else {
                this.$Msg.customizTitle("请选择上传文件", "warning");
            }

        },
        //下载按钮
        downloadModel() {
            let that = this;
            this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig/generateExcel',{
                etl_sys_id: that.$route.query.etl_sys_id,
                tableName: 'etl_sub_sys_list'
            }).then(res => {
                if (res && res.success) {
                    that.downloadFile(res.data)
                }
            })
        },
        // 下载模板表格
        downloadFile(val) {
            this.$executeRequest.execDownloadFileByModuleUrl('etlMage/jobconfig/downloadFile',{
                fileName: val
            }).then(res => {
                this.filename = val;
                this.$file.fileDownload(res, this.filename)
            })
        },
        gotoWorkDetail(row) { //根据作业编号跳转作业
            this.$router.push({
                name: 'etlJobDef',
                query: {
                    name: '/etlJobDef',
                    dec: this.$Base64.encode('作业'),
                    etl_sys_name: this.$route.query.etl_sys_name,
                    etl_sys_cd: sessionStorage.getItem("sys_cd"),
                    etl_sys_id:sessionStorage.getItem("sys_id"),
                    sub_sys_cd: row.sub_sys_cd,
                    sub_sys_id:row.sub_sys_id,

                }
            });
            this.$emit('viewIn', '/etlJobDef', '作业');
        }
    },

};
</script>

<style scoped>
.el-input {
    width: 330px;
    margin-bottom: 12px;
}

.tabBtns {
    margin-top: 15px;
}

.buttonStyle {
    display: block;
    float: left;
    margin-right: 10px;
    margin-left: 0px;
}

.subSystemdiv {
    float: right;
}

.subSystemdiv2 {
    float: left;
}
.el-checkbox .el-checkbox__input {
  appearance: none !important;
  -moz-appearance: none !important;
  -webkit-appearance: none !important;
  border-radius: 0;
  outline: none;
  box-shadow: none;
}
</style>
