<template>
<div  class="px-20 codeManage">
  <div  >
<!--    <div class="subSystemdiv2">-->
<!--        <el-input size="mini" placeholder="资源类型" v-model="input">-->
<!--            <el-button size="mini" slot="append" @click="searchBtn">搜索</el-button>-->
<!--        </el-input>-->
<!--    </div>-->
    <div style="height:32px;margin-bottom:10px" >
      <div style="float: right">
        <el-button type="primary" size="small" >
          <el-upload  accept=".xlsx" action="" :show-file-list="false" :auto-upload="false" :on-change="handleChange" :limit="1" :on-exceed="handleExceed" :fileList="fileList">
              <span>导入数据</span>
          </el-upload>
        </el-button>
        <el-button  type="primary" size="small" @click="downloadModel">下载模板
        </el-button>
        <el-button type="primary" size="small" @click="handleAdd">新增
        </el-button>
        <el-button  type="danger" size="small" @click="handleBatchDelete">批量删除
        </el-button>
      </div>
    </div>
    <ByTable :table-data="tableData" :column-arr="columArr"  @tableInput="searchBtn" @selectable="isDisabled" :pagination="pagination" @handleMultiple="handleSelectionChange" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @operateItem="operateHandler" v-if="tableData" ></ByTable>
    <ByEmpty v-else></ByEmpty>
<!--    <el-table size="medium" ref="multipleTable" :data="tableData" tooltip-effect="dark" stripe border style="width: 100%" @selection-change="handleSelectionChange">-->
<!--        <el-table-column type="selection" align='center' disabled='true' :selectable="isDisabled" width="55">-->
<!--        </el-table-column>-->
<!--        &lt;!&ndash; <el-table-column prop="etl_sys_cd" label="工程编号" align='center'>-->
<!--        </el-table-column> &ndash;&gt;-->
<!--        <el-table-column prop="resource_type" label="资源类型" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="resource_max" label="资源阀值" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="resource_used" label="已使用数" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="resource_name" label="资源类型名称" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="操作" align='center'>-->
<!--            <template slot-scope="scope">-->
<!--                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑-->
<!--                </el-button>-->
<!--                <el-button v-if="scope.row.resource_type != 'Thrift' && scope.row.resource_type != 'Yarn' && scope.row.resource_type != 'normalDefType'" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除-->
<!--                </el-button>-->
<!--            </template>-->
<!--        </el-table-column>-->
<!--    </el-table>-->
<!--    <el-row :gutter="20" class="tabBtns">-->

<!--        <el-pagination layout="total, sizes,prev, pager, next, jumper" :page-sizes="[5,10,20,25,50,100,1000]"  :page-size="pagesize" :total="pageLength" @current-change="handleCurrentChange" style="float:right" @size-change="handleSizeChange">-->
<!--        </el-pagination>-->

<!--    </el-row>-->
  </div>
    <!-- 添加资源模态框 -->
  <ByModel :model-title="title" :visible.sync="dialogFormVisibleAdd" :model-width="'42%'" @close="beforeClosechange">
    <ByModelForm :form-data="formAdd" :form-items="fromItem" :form-rules="frolRules" :form-config="issueFromConfig" ref="modelFrom"></ByModelForm>
    <div slot="modalFoot">
      <el-button @click="cancleAdd" >取消</el-button>
      <el-button type="primary" @click="saveAddAndUpdate" >保存</el-button>
    </div>
  </ByModel>
<!--    <el-dialog title="添加资源定义" :visible.sync="dialogFormVisibleAdd" width="42%" :before-close="beforeClosechange">-->
<!--        <el-form :model="formAdd" ref="formAdd" class="demo-ruleForm" label-width="120px">-->
<!--            <el-form-item label="工程编号" prop="etl_sys_cd" :rules="filter_rules([{required: true}])">-->
<!--                <el-input v-model="formAdd.etl_sys_cd" autocomplete="off" placeholder="工程编号" disabled></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="资源类型" prop="resource_type" :rules="filter_rules([{required: true}])">-->
<!--                <el-input v-model="formAdd.resource_type" autocomplete="off" placeholder="资源类型"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="资源阀值" prop="resource_max" :rules="filter_rules([{required: true,dataType: 'number'}])">-->
<!--                <el-input v-model="formAdd.resource_max" autocomplete="off" placeholder="资源阀值"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="资源类型名称" prop="resource_name">-->
<!--                <el-input v-model="formAdd.resource_name" autocomplete="off" placeholder="资源类型名称"></el-input>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="cancleAdd" size="mini" type="danger">取消</el-button>-->
<!--            <el-button type="primary" @click="saveAdd('formAdd')" size="mini">保存</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->
    <!-- 修改资源模态框 -->
<!--    <el-dialog title="修改资源定义" :visible.sync="dialogFormVisibleModify" width="42%">-->
<!--        <el-form :model="formModify" ref="formModify" class="demo-ruleForm" label-width="120px">-->
<!--            <el-form-item label="工程编号" prop="etl_sys_cd" :rules="filter_rules([{required: true}])">-->
<!--                <el-input v-model="formModify.etl_sys_cd" autocomplete="off" placeholder="工程编号" disabled></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="资源类型" prop="resource_type" :rules="filter_rules([{required: true}])">-->
<!--                <el-input v-model="formModify.resource_type" autocomplete="off" placeholder="资源类型" disabled></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="资源阀值" prop="resource_max" :rules="filter_rules([{required: true,dataType: 'number'}])">-->
<!--                <el-input v-model="formModify.resource_max" autocomplete="off" placeholder="资源阀值"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="资源类型名称" prop="resource_name">-->
<!--                <el-input v-model="formModify.resource_name" autocomplete="off" placeholder="资源类型名称"></el-input>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="cancleModify" size="mini" type="danger">取消</el-button>-->
<!--            <el-button type="primary" @click="saveModify('formModify')" size="mini">保存</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->
  <!-- 获取上传文件 -->
  <ByModel :model-title="'导入资源定义数据'" :visible.sync="dialogImportData"  @close="importDatacancel">
<!--    <el-dialog title="导入资源定义数据" :visible.sync="dialogImportData" :before-close="importDatacancel">-->
        <span v-if="fileList != ''">确认导入 “ {{fileList[0].name}} ” </span>
        <div slot="modalFoot">
            <el-button @click="importDatacancel" >取消</el-button>
            <el-button type="primary" @click="importData" :loading="loadingUpload" >保存</el-button>
        </div>
  </ByModel>
<!--    </el-dialog>-->
</div>
</template>

<script>
import ByTable from "@/components/global/ByTable.vue";
import {columArr,  fromItem, issueFromConfig} from "./mock";
import ByModel from "@/components/global/ByModel.vue";
import ByModelForm from "@/components/global/ByModelForm.vue";
import ByEmpty from "@/components/global/ByEmpty.vue";

let arr = [];
export default {
  components: {ByEmpty, ByModelForm, ByModel, ByTable},
  computed: {
    frolRules() {
      return frolRules
    }
  },
    data() {
        return {
          type: '',
          title: '',
          fromItem,
          frolRules : {
            etl_sys_cd: [{required: true, message: '该输入项为必填项', trigger: 'blur'}],
            resource_type: [{required: true, message: '该输入项为必填项', trigger: 'blur'}],
            resource_max: [{required: true, message: '该输入项为必填项', trigger: 'blur'},
                            { validator: this.validateNumber, trigger: 'blur' } ],
          },
          issueFromConfig,
          columArr,
            input: '',
            sys_cd: '',
            sys_id:'',
            tableData: [],
            multipleSelection: [],
            fileList: [],
            dialogFormVisibleAdd: false,
            dialogFormVisibleModify: false,
            dialogVisibleBatchDelete: false,
            dialogImportData: false,
            loadingUpload: false,
            formAdd: {
                etl_sys_id:null,
                etl_sys_cd: '',
                resource_type: '',
                resource_max: '',
            },
            formModify: {
                etl_sys_id:null,
                etl_sys_cd: '',
                resource_type: '',
                resource_max: '',
            },
            deleteForm: {
                etl_sys_id: '',
                resource_type: '',
            },
            batchDeleteForm: {
                etl_sys_id: '',
                resource_type: '',
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
        this.getTable();
    },
    methods: {
        //刷新表格
        getTable() {
          let input = '';
            this.columArr.map( item =>{
              if (item.type === 'operateInput'){
                input = item.queryData;
              }
            })
            let params = {};
            this.sys_cd = sessionStorage.getItem('sys_cd');
            this.sys_id = sessionStorage.getItem('sys_id');
            params["etl_sys_id"] = this.sys_id;
            params["resource_type"] = input || '';
            params["currPage"] = this.pagination.pageNum;
            params["pageSize"] = this.pagination.pageSize;
            this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig//searchEtlResourceByPage',params).then(res => {
                let arr = [];
                let arr2 = [];
                res.data.etlResourceList.forEach(item => {
                  if (item.resource_type == 'Thrift' || item.resource_type == 'Yarn' || item.resource_type == 'normalDefType') {
                    item.disabled = true;
                  } else {
                    item.disabled = false;
                  }
                    if (item.resource_type == "Thrift" || item.resource_type == "Yarn") {
                      item.resource_used_string = item.resource_used.toString();
                        arr.push(item)
                    } else {
                      item.resource_used_string = item.resource_used.toString();
                      arr2.push(item)
                    }
                })
                this.tableData = [...arr, ...arr2];
                this.pageLength = res.data.totalSize;
            });
        },
        //表格复选框是否禁用
        isDisabled(row, index,check) {
          check = true;
            if (row.resource_type == 'Thrift' || row.resource_type == 'Yarn' || row.resource_type == 'normalDefType') {
                return false;
            } else {
                return true;
            }
        },
      validateNumber(rule, value, callback) {
        if (isNaN(value) || !isFinite(value) || value <= 0) {
          callback(new Error('只能填写0与正整数'));
        } else {
          callback();
        }
      },
      //搜索按钮
        searchBtn(val) {

            let params = {};
            params["etl_sys_id"] = this.sys_id;
            params["resource_type"] = val;
            params["currPage"] = this.pagination.pageNum;
            params["pageSize"] = this.pagination.pageSize;
            this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig//searchEtlResourceByPage',params).then(res => {
              res.data.etlResourceList.map(item =>{
                if (item.resource_type == 'Thrift' || item.resource_type == 'Yarn' || item.resource_type == 'normalDefType') {
                  item.disabled = true;
                } else {
                  item.disabled = false;
                }
                item.resource_used_string = item.resource_used.toString();
              })
              console.log(res.data.etlResourceList,'11111111111111111111111111')
                this.tableData = res.data.etlResourceList;
                this.pageLength = res.data.totalSize;
            });
        },
        //选中的数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
      // 表格点击事件
      operateHandler(type, row){
        if (type === 'edit'){
          this.type = '1';
          this.title = '编辑资源定义';
          this.setDisabled('resource_type',true);
          this.handleEdit(row);
        }else if (type === 'del'){
          this.handleDelete(row);
        }
      },
        //新增按钮
        handleAdd() {
            this.type = '0';
            this.title = '添加资源定义';
          this.setDisabled('resource_type',false);
            this.dialogFormVisibleAdd = true;
            this.formAdd.etl_sys_cd = this.sys_cd;
            this.formAdd.etl_sys_id = this.sys_id;
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
                    let arr = [];
                    this.multipleSelection.forEach((item) => {
                        arr.push(item.resource_type);
                    });
                    this.batchDeleteForm.etl_sys_id = this.sys_id;
                    this.batchDeleteForm.resource_type = arr;
                    let params = new FormData();
                    params.append("etl_sys_id", this.batchDeleteForm.etl_sys_id);
                    params.append("resource_type", JSON.stringify(this.batchDeleteForm.resource_type));
                    this.$executeRequest.execUploadFileByModuleUrl('etlMage/jobconfig//batchDeleteEtlResource',params).then(res => {
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
          console.log(row,'11111111111111111')
            this.dialogFormVisibleAdd = true;
            this.formAdd = Object.assign({}, row);
            this.formAdd.etl_sys_id = this.sys_id;
            this.formAdd.etl_sys_cd = this.sys_cd;
        },
      setDisabled(prop,boolean){
        this.fromItem.map( item =>{
          if (item.prop === prop){
            item.disabled = boolean;
          }
        })
      },
      saveAddAndUpdate(){
        this.$refs.modelFrom.transferData().then( data =>{
            if (this.type === '0'){
            //   新增
              this.saveAdd();
            }else if(this.type === '1'){
            //   修改
              this.saveModify();
            }
        }).catch(err =>{

        })
      },
        //删除按钮
        handleDelete(index, row) {
            this.deleteForm.etl_sys_id = row.etl_sys_id;
            this.deleteForm.resource_type = row.resource_type;
            this.$confirm('确认删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                let params = {};
                params["etl_sys_id"] = this.deleteForm.etl_sys_id;
                params["resource_type"] = this.deleteForm.resource_type;
                this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig//deleteEtlResource',params).then(res => {
                    if (res && res.success) {
                        this.getTable();
                        this.$Msg.customizTitle("删除成功", "success");
                        this.deleteForm = {};
                    }
                });
            }).catch(() => {
                this.$Msg.customizTitle("已取消删除", "info");

            });
        },
        //模态框新增取消按钮
        cancleAdd() {
            this.dialogFormVisibleAdd = false;
            this.formAdd = {};
            // this.$refs.formAdd.resetFields();
        },
        beforeClosechange() {
            this.dialogFormVisibleAdd = false;
            this.formAdd = {};
        },
        //模态框新增保存按钮
        saveAdd(formName) {
          let params = {};
          params["etl_sys_id"] = this.sys_id;
          params["resource_type"] = this.formAdd.resource_type;
          params["resource_max"] = this.formAdd.resource_max;
          params["resource_name"] = this.formAdd.resource_name;
          this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig//saveEtlResource',params).then(res => {
            if (res && res.success) {
              this.$Msg.customizTitle("添加成功", "success");
              this.getTable();
              this.formAdd = {};
              this.dialogFormVisibleAdd = false;
            }
          });
        },
        //模态框修改取消按钮
        cancleModify() {
            // this.getTable();
            this.dialogFormVisibleModify = false;
        },
        //模态框修改保存按钮
        saveModify(formName) {
          let params = {};
          params["etl_sys_id"] = this.sys_id;
          params["resource_type"] = this.formAdd.resource_type;
          params["resource_max"] = this.formAdd.resource_max;
          params["resource_name"] = this.formAdd.resource_name;
          this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig/updateEtlResource',params).then(res => {
            if (res && res.success) {
              this.getTable();
              this.$Msg.customizTitle("修改成功", "success");
              this.formAdd = {};
              this.dialogFormVisibleAdd = false;
            }
          });
        },
        //分页方法
        handleCurrentChange(cpage) {
            this.pagination.pageNum = cpage;
            this.getTable();
        },
        handleSizeChange(psize) {
            this.pagination.pageSize = psize;
            this.getTable();
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
          debugger
            if (arr.length > 0) {
                this.loadingUpload = true;
                let param = new FormData() // 创建form对象
                for (let i = 0; i < arr.length; i++) {
                    param.append('file', arr[i].raw);
                }
                param.append('table_name', 'etl_resource');
                this.$executeRequest.execUploadFileByModuleUrl('etlMage/jobconfig//uploadExcelFile',param).then(res => {
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
            } else {
                this.$Msg.customizTitle("请选择上传文件", "warning");
            }

        },
        //下载按钮
        downloadModel() {
            let that = this;
            this.$executeRequest.execGetByModuleUrl('etlMage/jobconfig//generateExcel',{
                etl_sys_id: that.$route.query.etl_sys_id,
                tableName: 'etl_resource'
            }).then(res => {
                if (res && res.success) {
                    that.downloadFile(res.data)
                }
            })
        },
        // 下载模板表格
        downloadFile(val) {
            this.$executeRequest.execDownloadFileByModuleUrl('etlMage/jobconfig//downloadFile',{
                fileName: val
            }).then(res => {
                this.filename = val;
                this.$file.fileDownload(res, val);
            })
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
</style>
