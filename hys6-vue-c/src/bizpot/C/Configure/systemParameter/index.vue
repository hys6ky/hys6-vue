<template>
<div>
<!--    <div class="subSystemdiv2">-->
<!--        <el-input size="mini" placeholder="变量名称" v-model="input" class="elinput">-->
<!--            <el-button size="mini" slot="append" @click="searchBtn">搜索</el-button>-->
<!--        </el-input>-->
<!--    </div>-->
  <div  style="height:32px;margin-bottom:10px">
    <div style="float: right">
      <el-button  type="primary" size="small">
        <el-upload  accept=".xlsx" action="" :show-file-list="false" :auto-upload="false" :on-change="handleChange" :limit="1" :on-exceed="handleExceed" :fileList="fileList">
            <span>导入数据</span>
        </el-upload>
      </el-button>
        <el-button type="primary" size="small" @click="downloadModel">下载模板
        </el-button>
        <el-button type="primary" size="small" @click="handleAdd">新增
        </el-button>
        <el-button type="danger" size="small" @click="handleBatchDelete">批量删除
        </el-button>
    </div>
  </div>
  <div>
    <ByTable :table-data="tableData" :column-arr="columArr"  @tableInput="searchBtn" :pagination="pagination" @handleMultiple="handleSelectionChange" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @operateItem="operateHandler" v-if="tableData"></ByTable>
    <ByEmpty v-else></ByEmpty>
  </div>
<!--    <el-table size="medium" ref="multipleTable" :data="tableData" tooltip-effect="dark" stripe border style="width: 100%" @selection-change="handleSelectionChange">-->
<!--        <el-table-column type="selection" show-overflow-tooltip align='center' disabled='true' :selectable="isDisabled" width="70">-->
<!--        </el-table-column>-->
<!--        &lt;!&ndash; <el-table-column prop="etl_sys_cd" show-overflow-tooltip label="工程编号" align='center'>-->
<!--        </el-table-column> &ndash;&gt;-->
<!--        <el-table-column prop="para_cd" show-overflow-tooltip label="变量名称" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="para_type" show-overflow-tooltip label="变量类型" align='center' :formatter="paraTypeFormatter">-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="para_val" show-overflow-tooltip label="变量值" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="para_desc" show-overflow-tooltip label="描述" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="操作" align='center'>-->
<!--            <template slot-scope="scope">-->
<!--                <el-button v-if="scope.row.etl_sys_cd != 'SYS'" size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑-->
<!--                </el-button>-->
<!--                <el-button v-if="scope.row.etl_sys_cd != 'SYS'" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除-->
<!--                </el-button>-->
<!--            </template>-->
<!--        </el-table-column>-->
<!--    </el-table>-->
<!--    <el-row :gutter="20" class="tabBtns">-->
<!--        <el-pagination layout="total, sizes,prev, pager, next, jumper" style="float:right" :page-sizes="[5,10,20,25,50,100,1000]"  :page-size="pagesize" :total="pageLength" @current-change="handleCurrentChange" @size-change="handleSizeChange">-->
<!--        </el-pagination>-->
<!--    </el-row>-->
    <!-- 添加/修改系统模态框 -->
  <ByModel :model-title="systemTitle" :visible.sync="dialogFormVisibleAdd" :model-width="'40%'" @close="beforeClosechange">
    <ByModelForm :form-data="formAdd" :form-items="fromItem" :form-config="issueFromConfig" :form-rules="frolRules" ref="formAdd"></ByModelForm>
    <div  slot="modalFoot">
      <el-button @click="cancleAdd" >取消</el-button>
      <el-button type="primary" @click="saveAdd()"  >保存</el-button>
    </div>
  </ByModel>
<!--    <el-dialog :title="systemTitle" :visible.sync="dialogFormVisibleAdd" width="40%" :before-close="beforeClosechange">-->
<!--        <el-form :model="formAdd" ref="formAdd" class="demo-ruleForm" label-width="120px">-->
<!--            <el-form-item label="工程编号" prop="etl_sys_cd" :rules="filter_rules([{required: true}])">-->
<!--                <el-input v-model="formAdd.etl_sys_cd" style="width:300px;" autocomplete="off" placeholder="工程编号" disabled></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="变量名称" prop="para_cd" :rules="filter_rules([{required: true}])">-->
<!--                <div>-->
<!--                    <el-input style="width:300px;" v-if="this.systemTitle == '修改系统参数'" placeholder="变量名称" v-model="formAdd.para_cd" disabled>-->
<!--                        <template slot="prepend">!</template>-->
<!--                    </el-input>-->
<!--                    <el-input style="width:300px;" v-if="this.systemTitle == '添加系统参数'" placeholder="变量名称" v-model="formAdd.para_cd">-->
<!--                        <template slot="prepend">!</template>-->
<!--                    </el-input>-->
<!--                    &nbsp;-->
<!--                    <el-tooltip class="item" effect="dark" content="如果需要添加自定义格式日期，请使用txdate(当前跑批)、txdate_next(后一跑批日)、txdate_pre(前一跑批日)、date(当前系统日)开头的变量参数名,变量值如yyyyMMdd" placement="bottom-end">-->
<!--                        <i class="el-icon-question"></i>-->
<!--                    </el-tooltip>-->
<!--                </div>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="变量类型" prop="para_type" :rules="rule.selected">-->
<!--                <div>-->
<!--                    <el-select style="width:300px;" v-model="formAdd.paraType" placeholder="变量类型" @change="selectParaType">-->
<!--                        <el-option v-for="item in paratype" :key="item.code" :label="item.value" :value="item.code">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--                </div>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="变量值" prop="para_val" :rules="filter_rules([{required: true}])">-->
<!--                <div>-->
<!--                    <el-input style="width:300px;" v-model="formAdd.para_val" autocomplete="off" placeholder="变量值"></el-input>-->
<!--                </div>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="描述" prop="para_desc">-->
<!--                <div style="width:330px">-->
<!--                    <el-input style="width:300px;" type="textarea" v-model="formAdd.para_desc" autocomplete="off" placeholder="描述"></el-input>-->
<!--                </div>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="cancleAdd" size="mini" type="danger">取消</el-button>-->
<!--            <el-button type="primary" @click="saveAdd('formAdd')" size="mini">保存</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->
    <!-- 获取上传文件 -->
  <ByModel :model-title="'导入系统参数数据'" :visible.sync="dialogImportData"  @close="importDatacancel">
    <span v-if="fileList != ''">确认导入 “ {{fileList[0].name}} ” </span>
    <div slot="modalFoot">
      <el-button @click="importDatacancel"  >取消</el-button>
      <el-button type="primary" @click="importData" :loading="loadingUpload"  >保存</el-button>
    </div>
  </ByModel>
<!--  <el-dialog title="导入系统参数数据" :visible.sync="dialogImportData" :before-close="importDatacancel">-->

<!--    </el-dialog>-->
</div>
</template>

<script>
import * as validator from "@/utils/validator";
import {execPostByModuleUrl} from "@/utils/executeRequest";
import ByTable from "@/components/global/ByTable.vue";
import {columArr, frolRules, fromItem, issueFromConfig} from "./mock";
import ByModel from "@/components/global/ByModel.vue";
import ByModelForm from "@/components/global/ByModelForm.vue";
import ByEmpty from "@/components/global/ByEmpty.vue";
let arr = [];
export default {
  components: {ByEmpty, ByModelForm, ByModel, ByTable},
    data() {
        return {
          frolRules,
          issueFromConfig,
          fromItem,
          columArr,
            etl_sys_id: null,
            etl_sys_cd: null,
            input: '',
            systemTitle: '',
            deleteTitle: '',
            tableData: [],
            multipleSelection: [],
            fileList: [],
            paratype: [],
            dialogFormVisibleAdd: false,
            dialogImportData: false,
            loadingUpload: false,
            rule: validator.default,
            formAdd: {
                etl_sys_id:null,
                etl_sys_cd: '',
                para_cd: '',
                para_type: '',
                para_val: '',
                para_desc: '',
            },
            formDelete: {
                para_cd: '',
            },
            formSelect: {
                para_type: [],
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
        this.getCodeItems("ParamType");
        this.getTable();
    },
    methods: {
        // 选择类型时间
        selectParaType(value){
            console.log("paraTypeClick");
            console.log(value)
            for(var type of this.paratype){
                console.log(type)
                if(type.code == value){
                    this.formAdd.para_type = type.code;
                    this.formAdd.paraType = type.value;
                }
            }
        },
        // 变量类型格式化
        paraTypeFormatter(row, column){
            console.log(row);
            console.log(column);
            for(var type of this.paratype){
                if(type.code == row.para_type){
                    return type.value;
                }
            }
        },
      setDisabled(prop,boolean){
          this.fromItem.map(item =>{
            if (item.prop === prop){
              item.disabled = boolean;
            }
          })
      },
      // 表格点击事件
      operateHandler(type, row){
        if (type === 'edit'){
          this.setDisabled('para_cd',true);
          this.handleEdit(row);
        }else if (type === 'del'){
          this.handleDelete(row);
        }
      },
        //刷新表格
        getTable() {
            // let params = {};
            // params["etl_sys_cd"] = this.sys_cd;
            // params["para_cd"] = '';
            // params["currPage"] = this.currpage;
            // params["pageSize"] = this.pagesize;
            var params = {
                etl_sys_id: this.etl_sys_id,
                para_cd: '',
                currPage: this.pagination.pageNum,
                pageSize:this.pagination.pageSize
            };
            this.searchEtlParaByPage(params);
        },
        // 获取表格数据封装
        searchEtlParaByPage(params) {
            this.$executeRequest.execGetByModuleUrl('/etlMage/jobconfig//searchEtlParaByPage',params).then(res => {
                if(res && res.success){
                    let dates = res.data.etlParaList;
                    this.pagination.total = res.data.totalSize;
                    dates.forEach((item) => {
                        //变量类型
                        console.log(this.paratype)
                        console.log(this.paratype.length)
                        this.paratype.forEach(val => {
                            if (item.para_type == val.code) {
                                item.paraType = val.label;
                            }
                        })
                    });
                    this.tableData = dates;
                }
            });
        },
        getCodeItems(val) {
            if (val == "ParamType") {
              let arr = [];
              this.$Code.getCategoryItems({category: 'ParamType'}).then(res => {
                    this.paratype = res.data;
                    arr = res.data;
                    arr.forEach((item) => {
                      item.label = item.value;
                      item.value = item.code;
                    });
                console.log(this.paratype,1111111111111111)
                    this.setOptions('para_type',res.data);
                })
            }
        },
        setOptions(prop,data){
          this.fromItem.map( item =>{
            if (item.prop === prop){
              item.options = data;
            }
          })
        },
        // //获取变量名称下拉框数据
        // getParaName() {
        //     // let params = {};
        //     // params["category"] = "ParamType";
        //     let arr = [];
        //     var params={
        //         category:"ParamType"
        //     };
        //    this.$Code.getCategoryItems(params).then(res => {
        //         if(res && res.success){
        //             console.log()
        //             arr = res.data;
        //             arr.forEach((item) => {
        //                 item.label = item.value;
        //                 item.value = item.code;
        //             });
        //             this.formSelect.paraType = arr;
        //         }
        //     });
        // },
        //表格复选框是否禁用
        isDisabled(row, index) {
            if (row.etl_sys_cd == 'SYS') {
                return 0;
            } else {
                return 1;
            }
        },
        //搜索按钮
        searchBtn(input) {
            // let params = {};
            // params["etl_sys_cd"] = this.sys_cd;
            // params["para_cd"] = this.input;
            // params["currPage"] = this.currpage;
            // params["pageSize"] = this.pagesize;
            var params = {
                etl_sys_id: this.etl_sys_id,
                para_cd : input,
                currPage: this.pagination.pageNum,
                pageSize: this.pagination.pageSize
            };
            this.searchEtlParaByPage(params);
        },
        //选中的数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //新增按钮
        handleAdd() {
          this.setDisabled('para_cd',false);
          this.dialogFormVisibleAdd = true;
            this.formAdd.etl_sys_id = this.etl_sys_id;
            this.formAdd.etl_sys_cd = this.etl_sys_cd;
            this.systemTitle = '添加系统参数';
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
                        arr.push(item.para_cd);
                    });
                    // let params = new FormData();
                    // params.append("etl_sys_cd", this.sys_cd);
                    // params.append("para_cd", JSON.stringify(arr));
                    var params = {
                        etl_sys_id:this.etl_sys_id,
                        para_cd : arr
                    };
                    this.$executeRequest.execPostByModuleUrl('/etlMage/jobconfig//batchDeleteEtlPara',params).then(res => {
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
        handleEdit( row) {
            this.dialogFormVisibleAdd = true;
            this.systemTitle = '修改系统参数';
            this.formAdd = Object.assign({}, row);
            this.formAdd.etl_sys_cd = this.etl_sys_cd;
            this.formAdd.etl_sys_id = this.etl_sys_id;
            this.formAdd.paraType = this.paraTypeFormatter(row);
        },
        //删除按钮
        handleDelete( row) {
            this.formDelete.para_cd = row.para_cd;
            this.$confirm('确认删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                // let params = {};
                // params["etl_sys_cd"] = this.sys_cd;
                // params["para_cd"] = this.formDelete.para_cd;
                var params = {
                    etl_sys_id: this.etl_sys_id,
                    para_cd : this.formDelete.para_cd
                };
                this.$executeRequest.execGetByModuleUrl('/etlMage/jobconfig//deleteEtlPara',params).then(res => {
                    if (res && res.success) {
                        this.getTable();
                        this.$Msg.customizTitle("删除成功", "success");
                    }
                })
            }).catch(() => {
                this.$Msg.customizTitle("已取消删除", "info");
            });
        },
        //模态框新增/修改取消按钮
        cancleAdd() {
            this.dialogFormVisibleAdd = false;
            this.formAdd = {};
            // this.$refs.formAdd.resetFields();
        },
        beforeClosechange() {
            this.dialogFormVisibleAdd = false;
            this.formAdd = {};
            // this.$refs.formAdd.resetFields();
        },
        //模态框新增/修改保存按钮
        saveAdd() {
          this.$refs.formAdd.transferData().then( data =>{
            var params = {
              etl_sys_id: this.formAdd.etl_sys_id,
              para_cd: this.formAdd.para_cd,
              para_val: this.formAdd.para_val,
              para_type: this.formAdd.para_type,
              para_desc: this.formAdd.para_desc
            };
            if (this.systemTitle == '添加系统参数') {
              this.$executeRequest.execGetByModuleUrl('/etlMage/jobconfig//saveEtlPara',params).then(res => {
                if (res && res.success) {
                  this.getTable();
                  this.$Msg.customizTitle("添加成功", "success");
                  this.dialogFormVisibleAdd = false;
                  this.formAdd = {};
                  // this.$refs.formAdd.resetFields();
                }
              });
            } else if (this.systemTitle == '修改系统参数') {
              this.$executeRequest.execGetByModuleUrl('/etlMage/jobconfig//updateEtlPara',params).then(res => {
                if (res && res.success) {
                  this.getTable();
                  this.$Msg.customizTitle("修改成功", "success");
                  this.dialogFormVisibleAdd = false;
                  this.formAdd = {};
                  // this.$refs.formAdd.resetFields();
                }
              });
            }
          }).catch(err =>{

          })
                    // let params = {};
                    // params["etl_sys_cd"] = this.formAdd.etl_sys_cd;
                    // params["para_cd"] = this.formAdd.para_cd;
                    // params["para_val"] = this.formAdd.para_val;
                    // params["para_type"] = this.formAdd.para_type;
                    // params["para_desc"] = this.formAdd.para_desc;



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
            if (arr.length > 0) {
                this.loadingUpload = true;
                let param = new FormData() // 创建form对象
                for (let i = 0; i < arr.length; i++) {
                    param.append('file', arr[i].raw);
                }
                param.append('table_name', 'etl_para');
                this.$executeRequest.execUploadFileByModuleUrl('/etlMage/jobconfig//uploadExcelFile',param).then(res => {
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
            this.$executeRequest.execGetByModuleUrl('/etlMage/jobconfig//generateExcel',{
                etl_sys_id: this.etl_sys_id,
                tableName: 'etl_para'
            }).then(res => {
                if (res && res.success) {
                    this.downloadFile(res.data)
                }
            })
        },
        // 下载模板表格
        downloadFile(val) {
            this.$executeRequest.execDownloadFileByModuleUrl('/etlMage/jobconfig//downloadFile',{
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
.elinput {
    width: 330px;
    margin-bottom: 15px;
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
