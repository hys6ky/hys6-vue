<template>
<div>
    <el-form :model="form" ref="form" class="demo-form-inlines" :inline="true">
        <el-col :span="12">
            <el-form-item label="作业名称">
                <el-autocomplete :fetch-suggestions="querySearch" size="mini" v-model="form.etl_job" style="width:264px" placeholder="作业名称"></el-autocomplete>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="资源类型">
                <el-input size="mini" v-model="form.resource_type" style="width:264px" placeholder="资源类型"></el-input>
                <el-button class="searchBtn" size="mini" type="primary" @click="searchBtn">搜索</el-button>
            </el-form-item>
        </el-col>
    </el-form>
    <el-divider></el-divider>
    <el-row>
        <div class="subSystemdiv">
            <el-upload class="buttonStyle" accept=".xlsx" action="" :show-file-list="false" :auto-upload="false" :on-change="handleChange" :limit="1" :on-exceed="handleExceed" :fileList="fileList">
                <el-button size="mini" type="primary">导入数据</el-button>
            </el-upload>
            <el-button class="buttonStyle" size="mini" type="primary" @click="downloadModel">下载模板
            </el-button>
            <el-button class="buttonStyle" size="mini" type="primary" @click="handleAdd">新增
            </el-button>
            <el-button class="buttonStyle" size="mini" type="danger" @click="handleBatchDelete">批量删除
            </el-button>
        </div>
    </el-row>
    <el-table size="medium" ref="multipleTable" :data="tableData" tooltip-effect="dark" stripe border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align='center'>
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop="etl_sys_cd" label="工程编号" align='center'>
        </el-table-column> -->
        <el-table-column show-overflow-tooltip prop="etl_job" label="作业名称" align='center'>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="resource_type" label="资源类型" align='center'>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="resource_req" label="资源需求数" align='center'>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="resource_name" label="资源类型名称" align='center'>
        </el-table-column>
        <el-table-column label="操作" align='center'>
            <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑
                </el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-row :gutter="20" class="tabBtns">
        <el-pagination layout="total, sizes,prev, pager, next, jumper" style="float:right" :page-sizes="[5,10,20,25,50,100,1000]"  :page-size="pagesize" :total="pageLength" @current-change="handleCurrentChange" @size-change="handleSizeChange">
        </el-pagination>
    </el-row>
    <!-- 添加/修改资源模态框 -->
    <el-dialog :title="resourceTitle" :visible.sync="dialogFormVisibleAdd" width="40%" :before-close="beforeClosechange">
        <el-form :model="formAdd" ref="formAdd" class="demo-ruleForm" label-width="150px">
            <el-form-item label="工程编号" prop="etl_sys_cd" :rules="filter_rules([{required: true}])">
                <div style="width:193px">
                    <el-input v-model="formAdd.etl_sys_cd" style="width:217px" autocomplete="off" placeholder="工程编号" disabled></el-input>
                </div>
            </el-form-item>
            <el-form-item label="作业名称" prop="etl_job" :rules="rule.selected">
                <el-select style="width:217px" v-model="formAdd.etl_job" placeholder="作业名称">
                    <el-option v-for="item in formSelect.jobName" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="资源类型" prop="resource_type" :rules="rule.selected">
                <el-select style="width:217px" v-model="formAdd.resource_type" placeholder="资源类型">
                    <el-option v-for="item in formSelect.resourceType" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="资源需求数" prop="resource_req" :rules="filter_rules([{required: true,dataType: 'number'}])">
                <div style="width:193px">
                    <el-input style="width:217px" v-model="formAdd.resource_req" autocomplete="off" placeholder="资源需求数"></el-input>
                </div>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancleAdd" size="mini" type="danger">取消</el-button>
            <el-button type="primary" @click="saveAdd('formAdd')" size="mini">保存</el-button>
        </div>
    </el-dialog>
    <!-- 获取上传文件 -->
    <el-dialog title="导入资源分配数据" :visible.sync="dialogImportData" :before-close="importDatacancel">
        <span v-if="fileList != ''">确认导入 “ {{fileList[0].name}} ” </span>
        <div slot="footer" class="dialog-footer">
            <el-button @click="importDatacancel" size="mini" type="danger">取消</el-button>
            <el-button type="primary" @click="importData" :loading="loadingUpload" size="mini">保存</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import * as validator from "@/utils/validator";
let arr = [];
export default {
    data() {
        return {
            sys_cd: '',
            form: {
                etl_job: '',
                resource_type: '',
            },
            listDatas: [],
            tableData: [],
            resourceTitle: '',
            multipleSelection: [],
            fileList: [],
            rule: validator.default,
            dialogFormVisibleAdd: false,
            dialogVisibleDelete: false,
            dialogImportData: false,
            loadingUpload: false,
            formAdd: {
                etl_sys_cd: '',
                etl_job: '',
                resource_type: '',
                resource_req: '',
            },
            formDelete: {
                etl_job: '',
            },
            formSelect: {
                jobName: [],
                resourceType: [],
            },
            pagesize: 5,
            currpage: 1,
            pageLength: 0,
        };
    },
    mounted() {
        this.getTable();
        this.getJobName();
        this.getResourceType();
    },
    methods: {
        //刷新表格
        getTable() {
            let params = {};
            this.sys_cd = sessionStorage.getItem('sys_cd');
            if(undefined != this.$route.query.etl_job) {
                params["etl_job"] = this.$route.query.etl_job;
                if (this.$route.query.name == "etlJobDef"){
                    params["pageType"] = "etlJobDef";
                } else {
                    this.form.etl_job = this.$route.query.etl_job;
                }
            } else {
                params["etl_job"] = '';
            }
            params["etl_sys_cd"] = this.sys_cd;
            params["resource_type"] = '';
            params["currPage"] = this.currpage;
            params["pageSize"] = this.pagesize;
            this.$executeRequest.execGetByModuleUrl('/jobconfig/searchEtlJobResourceRelaByPage',params).then(res => {
                this.tableData = res.data.jobResourceRelation;
                this.pageLength = res.data.totalSize;
            });
        },
        //获取作业名称下拉框数据
        getJobName() {
            let params = {};
            let arr = [];
            let obj = {};
            params["etl_sys_cd"] = this.sys_cd;
            this.$executeRequest.execGetByModuleUrl('/jobconfig/searchEtlJob',params).then(res => {
                res.data.forEach((item) => {
                    obj.label = item;
                    obj.value = item;
                    arr.push(obj);
                    obj = {};
                });
                this.formSelect.jobName = arr;
                this.listDatas = arr;
            });
        },
        // input框的历史信息
        querySearch(queryString, cb) {
            var res = this.listDatas;
            var results = queryString ? res.filter(this.createFilter(queryString)) : res;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (res) => {
                return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
            };
        },
        //获取资源类型下拉框数据
        getResourceType() {
            let params = {};
            let arr = [];
            let obj = {};
            params["etl_sys_cd"] = this.sys_cd;
            this.$executeRequest.execGetByModuleUrl('/jobconfig/searchEtlResourceType',params).then(res => {
                res.data.forEach((item) => {
                    if(item.substring(0,1) == '('){
                        obj.value = item.substring(1,item.length-1);
                        obj.label = item.substring(1,item.length-1) + '(' + item.substring(1,item.length-1) + ')';
                    } else {
                        obj.label = item;
                        obj.value = item.substring(item.indexOf('(') + 1, item.length-1);
                    }
                    arr.push(obj);
                    obj = {};
                });
                console.info(arr);
                this.formSelect.resourceType = arr;

            });
        },
        //搜索按钮
        searchBtn() {
            let params = {};
            this.sys_cd = sessionStorage.getItem('sys_cd');
            params["etl_sys_cd"] = this.sys_cd;
            params["etl_job"] = this.form.etl_job;
            params["resource_type"] = this.form.resource_type;
            params["currPage"] = this.currpage;
            params["pageSize"] = this.pagesize;
            this.$executeRequest.execGetByModuleUrl('/jobconfig/searchEtlJobResourceRelaByPage',params).then(res => {
                this.tableData = res.data.jobResourceRelation;
                this.pageLength = res.data.totalSize;
            });
        },
        //选中的数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //新增按钮
        handleAdd() {
            this.dialogFormVisibleAdd = true;
            this.formAdd.etl_sys_cd = this.sys_cd;
            this.resourceTitle = '添加资源分配';
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
                        arr.push(item.etl_job);
                    });
                    let params = new FormData();
                    params.append("etl_sys_cd", this.sys_cd);
                    params.append("etl_job", JSON.stringify(arr));
                    this.$executeRequest.execUploadFileByModuleUrl('/jobconfig/batchDeleteEtlJobResourceRela',params).then(res => {
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
        handleEdit(index, row) {
            this.dialogFormVisibleAdd = true;
            this.resourceTitle = '修改资源分配';
            this.formAdd = Object.assign({}, row);
        },
        //删除按钮
        handleDelete(index, row) {
            this.formDelete.etl_job = row.etl_job;
            this.$confirm('确认删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                let params = {};
                params["etl_sys_cd"] = this.sys_cd;
                params["etl_job"] = this.formDelete.etl_job;
                this.$executeRequest.execGetByModuleUrl('/jobconfig/deleteEtlJobResourceRela',params).then(res => {
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
            this.$refs.formAdd.resetFields();
        },
        beforeClosechange() {
            this.dialogFormVisibleAdd = false;
            this.formAdd = {};
            this.$refs.formAdd.resetFields();
        },
        //模态框新增/修改保存按钮
        saveAdd(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let params = {};
                    params["etl_sys_cd"] = this.formAdd.etl_sys_cd;
                    params["etl_job"] = this.formAdd.etl_job;
                    params["resource_type"] = this.formAdd.resource_type;
                    params["resource_req"] = this.formAdd.resource_req;
                    if (this.resourceTitle == '添加资源分配') {
                        this.$executeRequest.execGetByModuleUrl('/jobconfig/saveEtlJobResourceRela',params).then(res => {
                            if (res && res.success) {
                                this.getTable();
                                this.$Msg.customizTitle("添加成功", "success");
                                this.dialogFormVisibleAdd = false;
                                this.formAdd = {};
                                this.$refs.formAdd.resetFields();
                            }
                        });
                    } else if (this.resourceTitle == '修改资源分配') {
                        this.$executeRequest.execGetByModuleUrl('/jobconfig/updateEtlJobResourceRela',params).then(res => {
                            if (res && res.success) {
                                this.getTable();
                                this.$Msg.customizTitle("修改成功", "success");
                            }
                            this.dialogFormVisibleAdd = false;
                            this.formAdd = {};
                            this.$refs.formAdd.resetFields();
                        });
                    }

                }
            })
        },
        //分页方法
        handleCurrentChange(cpage) {
            this.currpage = cpage;
            this.getTable();
        },
        handleSizeChange(psize) {
            this.pagesize = psize;
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
                param.append('table_name', 'etl_job_resource_rela');
                this.$executeRequest.execUploadFileByModuleUrl('/jobconfig/uploadExcelFile',param).then(res => {
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
            this.$executeRequest.execGetByModuleUrl('/jobconfig/generateExcel',{
                etl_sys_cd: that.$route.query.etl_sys_cd,
                tableName: 'etl_job_resource_rela'
            }).then(res => {
                if (res && res.success) {
                    that.downloadFile(res.data)
                }
            })
        },
        // 下载模板表格
        downloadFile(val) {
            this.$executeRequest.execDownloadFileByModuleUrl('/jobconfig/downloadFile',{
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
