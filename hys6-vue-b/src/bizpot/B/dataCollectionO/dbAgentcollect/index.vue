<template>
    <div class="step1">
        <dbStep :active="active"></dbStep>
        <div class="oneContent">
            <el-form ref="form" :model="form" status-icon>
                <el-col :span="12">
                    <el-form-item label="采集任务名" :label-width="formLabelWidth" prop="task_name"
                                  :rules="filter_rules([{required: true}])">
                        <el-input v-model="form.task_name" placeholder="采集任务名" :size="size"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="作业编号" :label-width="formLabelWidth" prop="database_number">
                        <el-col :span="21">
                            <el-input v-model="form.database_number" placeholder="作业编号" :size="size"></el-input>
                        </el-col>
                        <el-tooltip class="item" effect="dark" content="执行采集脚本时,可作为第一个参数使用" placement="right">
                            <i class="fa fa-question-circle" aria-hidden="true" style="margin-left: 4px;"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="分类编号" :label-width="formLabelWidth" prop="classify_num"
                                  :rules="filter_rules([{required: true}])">
                        <el-input v-model="form.classify_num" disabled placeholder="分类编号" :size="size">
                            <el-button slot="append" @click="getNumber()" class="addButton"><i
                                    class="el-icon-circle-plus-outline"></i>设置分类
                            </el-button>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="分类名称" :label-width="formLabelWidth" prop="classify_name"
                                  :rules="filter_rules([{required: true}])">
                        <el-input v-model="form.classify_name" disabled placeholder="分类名称" :size="size"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="18">
                    <el-form-item label="数据字典文件" :label-width="formLabelWidth" prop="plane_url"
                                  :rules="filter_rules([{required: true}])">
                        <el-input v-model="form.plane_url" placeholder="数据字典文件" :size="size">
                            <template slot="prepend">
                                <el-button :size="size" @click="dialogSelectfolder = true;seletFilePath()">选择文件
                                </el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="上传数据字典" :label-width="formLabelWidth">
                        <el-button type="primary" @click="dialogImport" size="medium">选择上传文件</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
        <div class="step1Footer">
            <el-col :span="12">
                <el-button size="medium" type="primary" @click="goBackQuit"> 返回</el-button>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-button size="medium" type="primary" style="float:right" @click="nextCollect('form')">下一步
                    </el-button>
                </div>
            </el-col>
        </div>
        <!-- 选择目录弹出框 -->
        <el-dialog title="选择文件" :visible.sync="dialogSelectfolder">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">选择文件</span>
            </div>
            <div class="mytree"  hight='200'>
                <el-tree ref='tree' :data="data2" :check-strictly="true" :show-checkbox='hiddenshow' node-key="name"
                         lazy :load="loadNode" :props="defaultProps" accordion :indent='0'
                         @check-change="handleCheckChange">
                <span class="span-ellipsis" slot-scope="{ node, data }">
                    <span :title="node.label">{{ node.label }}</span>
                </span>
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelSelect" size="mini" type="danger">取 消</el-button>
                <el-button type="primary" @click="dialogSelectfolder = false;" size="mini">保存</el-button>
            </div>
        </el-dialog>
        <!-- 选择编号弹出框 -->
        <el-dialog title="采集任务分类" :visible.sync="showDiolag" class="collTask">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">采集任务分类</span>
            </div>
            <el-dialog width="40%" title="新增采集任务分类" :visible.sync="innerVisible" append-to-body>
                <div slot="title">
                    <span class="dialogtitle el-icon-caret-right">新增采集任务分类</span>
                </div>
                <el-form :model="addClassTask" ref="addClassTask">
                    <el-form-item label=" 分类编号" prop="classify_num"
                                  :rules="filter_rules([{required: true,dataType:'compositions'}])"
                                  :label-width="formLabelWidth">
                        <el-input v-model="addClassTask.classify_num" style="width:284px"></el-input>
                    </el-form-item>
                    <el-form-item label=" 分类名称" prop="classify_name" :rules="rule.default"
                                  :label-width="formLabelWidth">
                        <el-input v-model="addClassTask.classify_name" style="width:284px"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
                        <el-input v-model="addClassTask.remark" type="textarea" style="width:284px"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button size="mini" type="danger" @click="cancelAdd">取 消</el-button>
                    <el-button type="primary" size="mini" @click="addClassTaskFun('addClassTask')">保存</el-button>
                </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-table :data="CollTaskData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" border
                          size="medium" @row-click="chooseone">
                    <el-table-column property label="选择" width="70px" type="index" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="radio" :label="scope.row.classify_id">&thinsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column property label="序号" width="70px" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.$index+(currentPage - 1) * pagesize + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="classify_num" label="分类编号" show-overflow-tooltip
                                     align="center"></el-table-column>
                    <el-table-column property="classify_name" label="分类名称" show-overflow-tooltip
                                     align="center"></el-table-column>
                    <el-table-column property="remark" label="描述" show-overflow-tooltip
                                     align="center"></el-table-column>
                    <el-table-column label="操作" width="150px" align="center">
                        <template slot-scope="scope">
                            <el-row>
                                <el-col :span="10" style="text-align: center;">
                                    <el-button type="text" circle @click="editText(scope.row)" class='editcolor'>编辑
                                    </el-button>
                                </el-col>
                                <el-col :span="12">
                                    <el-button class='delcolor' type="text" circle @click="deleteText(scope.row)">删除
                                    </el-button>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next"
                               :total="CollTaskData.length"></el-pagination>
                <div class="btntop">
                    <el-button @click="cancelClassNumBtn()" type="danger" size="mini">取 消</el-button>
                    <el-button @click="innerVisible = true" type="success" size="mini">新增</el-button>
                    <el-button @click="saveClassNumBtn(CollTaskData)" type="primary" size="mini">确定</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 点击编辑弹层 -->
        <el-dialog width="40%" title="修改采集任务分类" :visible.sync="ediltVisible" append-to-body>
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">修改采集任务分类</span>
            </div>
            <el-form :model="editClassTask" ref="editClassTask">
                <el-form-item label=" 分类编号" prop="classify_num" :rules="rule.default" :label-width="formLabelWidth"
                              width="130">
                    <el-input v-model="editClassTask.classify_num" style="width:284px" disabled></el-input>
                </el-form-item>
                <el-form-item label=" 分类名称" prop="classify_name" :rules="rule.default" :label-width="formLabelWidth">
                    <el-input v-model="editClassTask.classify_name" style="width:284px"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
                    <el-input v-model="editClassTask.remark" type="textarea" style="width:284px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="mini" type="danger" @click="cancleEdit">取 消</el-button>
                <el-button size="mini" type="primary" @click="editClassTaskSane('editClassTask')">保存</el-button>
            </div>
        </el-dialog>
        <!-- 上传数据字典 -->
        <el-dialog title="上传文件" :visible.sync="dialogFormExcelImport" width="42%" :before-close="cancleImport">
            <el-form :model="formImport" ref="formImport">
                <el-form-item label="数据字典存放路径" :label-width="formLabelWidth" prop="targePath"
                              :rules="filter_rules([{required: true}])">
                    <el-input v-model="formImport.targePath" style="width:284px"></el-input>
                </el-form-item>
                <el-form-item label="选择文件" :label-width="formLabelWidth">
                    <el-upload class="upload-demo" ref="upload" :fileList="fileList" action="" :auto-upload="false"
                               :on-change="handleChange">
                        <el-button size="small" type="primary">选择文件</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancleImport" size="mini" type="danger">取 消</el-button>
                <el-button type="primary" @click="upload('formImport')" size="mini">上传</el-button>
            </div>
        </el-dialog>
        <!-- 加载过度 -->
        <transition name="fade">
            <loading v-if="isLoading"/>
        </transition>
    </div>
</template>

<script>
    import dbStep from "./dbStep.vue";
    import * as validator from "@/utils/validator";
    import * as message from "@/utils/message";
    import Loading from '@/components/loading/index.vue'

    export default {
        components: {
            dbStep,
            Loading
        },
        data() {
            return {
                active: 0,
                form: {
                    plane_url: '',
                    classify_num: '',
                    classify_name: ''
                },
                formImport: {
                    targePath: ''
                },
                formLabelWidth: "150px",
                size: "medium",
                showDiolag: false,
                dialogFormExcelImport: false,
                pagesize: 10,
                currentPage: 1,
                data2: [],
                isLoading: false,
                classify_id: '',
                hiddenshow: true,
                addClassTask: {
                    classify_num: '',
                    classify_name: '',
                    remark: ''
                },
                editClassTask: {
                    classify_num: '',
                    classify_name: '',
                    remark: ''
                },
                fileMark: '',
                updateMark: '',
                CollTaskData: [],
                defaultProps: {
                    children: "children",
                    label: "path",
                    isLeaf: 'leaf'
                },
                radio: null,
                innerVisible: false,
                ediltVisible: false,
                dialogSelectfolder: false,
                rule: validator.default,
                fileList: [],
            }
        },
        mounted() {
            this.getAllInfo();
        },
        methods: {
            // 返回上一级
            goBackQuit() {
                this.$router.push({
                    name: "dataCollectionO"
                })
            },
            //获取首页信息
            getAllInfo() {
                if (this.$route.query.edit == 'yes') {
                    this.getInitDataFileData();
                } else {
                    this.$executeRequest.execByControllerMappingName("/addDataFileData", {
                        agent_id: this.$route.query.agent_id,
                        source_id: this.$route.query.source_id
                    }).then(res => {
                        if (res.data.plane_url != undefined && res.data.task_name != undefined) {
                            this.updateMark = "1";
                            this.radio = res.data.classify_id;
                            this.classify_id = res.data.classify_id;
                            this.form = res.data;
                            this.fileMark = res.data.plane_url;
                        }
                    })
                }
            },
            // 点击编辑获取的数据
            getInitDataFileData() {
                this.$executeRequest.execByControllerMappingName("/getInitDataFileData", {
                    agent_id: this.$route.query.agent_id,
                    colSetId: this.$route.query.id
                }).then(res => {
                    if (res.data.plane_url != undefined && res.data.task_name != undefined) {
                        this.updateMark = "1";
                        this.radio = res.data.classify_id;
                        this.classify_id = res.data.classify_id;
                        this.form = res.data;
                        this.fileMark = res.data.plane_url;
                    }
                })
            },
            // 获取分类编号和分类名称
            getNumber() {
                this.$executeRequest.execGetByMenuUrl("/agent/dbconf/getClassifyInfo", {
                    sourceId: this.$route.query.source_id
                }).then(res => {
                    this.showDiolag = true;
                    this.CollTaskData = res.data;
                });
            },
            //编辑任务分类
            editText(val) {
                this.editClassTask = Object.assign({}, val);
                this.ediltVisible = true;
            },
            // 编辑任务保存
            editClassTaskSane(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.editClassTask["agent_id"] = this.$route.query.agent_id;
                        this.editClassTask["sourceId"] = this.$route.query.source_id;
                        let page = this.editClassTask;
                        delete page.user_id;
                        this.$executeRequest.execGetByMenuUrl("/agent/dbconf/updateClassifyInfo", this.editClassTask).then(res => {
                            this.ediltVisible = false;
                            message.updateSuccess(res);
                            this.getNumber();
                        });
                    }
                })
            },
            // 取消编辑任务
            cancleEdit() {
                this.ediltVisible = false;
                this.$refs.editClassTask.resetFields();
            },
            // 删除任务分类
            deleteText(row) {
                message.confirmMsg('确定删除吗').then(res => {
                    let params = {};
                    params["classifyId"] = row.classify_id;
                    this.$executeRequest.execGetByMenuUrl("/agent/dbconf/deleteClassifyInfo", params).then(res => {
                        message.deleteSuccess(res);
                        this.getNumber();
                    });
                }).catch(() => {
                })
            },
            // 保存新增任务
            addClassTaskFun(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let params = {};
                        this.addClassTask["agent_id"] = this.$route.query.agent_id;
                        this.addClassTask["sourceId"] = this.$route.query.source_id;
                        this.$executeRequest.execGetByMenuUrl("/agent/dbconf/saveClassifyInfo", this.addClassTask).then(res => {
                            this.innerVisible = false;
                            message.saveSuccess(res);
                            this.getNumber();
                        });
                    }
                })
            },
            //取消新增保存
            cancelAdd() {
                this.$refs.addClassTask.resetFields();
                this.innerVisible = false;
            },
            //取消选择名称
            cancelClassNumBtn() {
                this.showDiolag = false;
                this.radio = "";
            },
            //保存选择名称
            saveClassNumBtn(row) {
                if (row.length > 0) {
                    if (this.radio != '') {
                        for (let i = 0; i < row.length; i++) {
                            if (row[i].classify_id == this.radio) {
                                this.classify_id = row[i].classify_id;
                                this.showDiolag = false;
                                this.form.classify_name = row[i].classify_name;
                                this.form.classify_num = row[i].classify_num;
                            }
                        }
                    } else {
                        this.$Msg.customizTitle('请至少选择一项', 'error')
                    }

                } else {
                    this.$Msg.customizTitle('请新增任务并选择', 'error')
                }
            },
            // 分页显示
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
            },
            handleSizeChange(size) {
                this.pagesize = size;
            },
            // 取消选择目录文件并且关闭弹出框
            cancelSelect() {
                if (this.fileMark != '') {
                    this.form.plane_url = this.fileMark;
                } else {
                    this.form.plane_url = '';
                }

                this.dialogSelectfolder = false;
            },
            // 获取目录结构
            seletFilePath() {
                this.dialogSelectfolder = true;
                let arry = [],
                    path = '';
                this.$executeRequest.execByControllerMappingName("/selectPath", {
                    agent_id: this.$route.query.agent_id,
                    path: path
                }).then(res => {
                    if (res.data && res.data.length > 0) {
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].isFolder == 'true') {
                                res.data[i].children = [{}];
                                res.data[i].disabled = true;
                                res.data[i].leaf = false;
                            } else if (res.data[i].isFolder == 'false') {
                                res.data[i].disabled = false;
                                res.data[i].leaf = true;
                            }
                        }
                        this.data2 = res.data;
                    } else {
                        this.treenloadingInfo = '暂无数据'
                    }

                });
            },
            //获取选中状态下的数据
            handleCheckChange(data, checked, indeterminate) {
                if (checked) {
                    let arr = [data.name];
                    this.$refs.tree.setCheckedKeys(arr);
                }
                this.form.plane_url = data.path;
            },
            //  获取目录下一级
            loadNode(node, resolve) {
                if (node.level > 0) {
                    let path = node.data.path,
                        id = this.$route.query.agent_id;
                    setTimeout(() => {
                        this.$executeRequest.execByControllerMappingName("/selectPath", {
                            agent_id: id,
                            path: path
                        }).then(res => {
                            for (let i = 0; i < res.data.length; i++) {
                                if (res.data[i].isFolder == 'true') {
                                    res.data[i].children = [{}];
                                    res.data[i].disabled = true;
                                    res.data[i].leaf = false;
                                } else if (res.data[i].isFolder == 'false') {
                                    res.data[i].disabled = false;
                                    res.data[i].leaf = true;
                                }
                            }
                            resolve(res.data);
                        });

                    }, 500);
                }

            },
            // 保存采集任务跳转下一步
            nextCollect(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let object = Object.assign({}, this.form)
                        this.isLoading = true;
                        this.form['classify_id'] = this.classify_id;
                        this.form['agent_id'] = this.$route.query.agent_id;
                        let obj = this.form;
                        delete obj.classify_name;
                        delete obj.classify_num;
                        if (this.updateMark == "1") {
                            this.$executeRequest.execByControllerMappingName("/updateDataFile", obj).then(res => {
                                this.isLoading = false;
                                if (res && res.success) {
                                    let data = {}
                                    if (this.$route.query.edit == 'yes') {
                                        data = {
                                            agent_id: this.$route.query.agent_id,
                                            id: res.data,
                                            source_id: this.$route.query.source_id,
                                            source_name: this.$route.query.source_name,
                                            edit: "yes"
                                        }
                                    } else {
                                        data = {
                                            agent_id: this.$route.query.agent_id,
                                            id: res.data,
                                            source_id: this.$route.query.source_id,
                                            source_name: this.$route.query.source_name,
                                        }
                                    }
                                    this.$router.push({
                                        name: "step2",
                                        query: data
                                    })
                                } else {
                                    this.form = object;
                                }
                            })
                        } else {
                            this.$executeRequest.execByControllerMappingName("/saveDataFile", obj).then(res => {
                                this.isLoading = false;
                                if (res && res.success) {
                                    let data = {}
                                    if (this.$route.query.edit == 'yes') {
                                        data = {
                                            agent_id: this.$route.query.agent_id,
                                            id: res.data,
                                            source_id: this.$route.query.source_id,
                                            source_name: this.$route.query.source_name,
                                            edit: "yes"
                                        }
                                    } else {
                                        data = {
                                            agent_id: this.$route.query.agent_id,
                                            id: res.data,
                                            source_id: this.$route.query.source_id,
                                            source_name: this.$route.query.source_name,
                                        }
                                    }
                                    this.$router.push({
                                        name: "step2",
                                        query: data
                                    })
                                } else {
                                    this.form = object;
                                }
                            })
                        }
                    }
                })
            },
            chooseone(row) { //点击单元格选中一行
                this.radio = row.classify_id;
            },
            dialogImport() { //导入数据字典
                this.dialogFormExcelImport = true;
            },
            // 获取上传的文件详情excelHandleChange
            handleChange(file, fileList) {
                if (fileList.length > 0) {
                    this.fileList = [fileList[fileList.length - 1]]
                }
            },
            // 点击上传数据
            upload(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.fileList.length == 0) {
                            this.$Msg.customizTitle('上传文件不能为空', 'warning')
                        } else {
                            let param = new FormData() // 创建form对象
                            param.append('file', this.fileList[0].raw);
                            param.append('targetPath', this.formImport.targePath);
                            param.append('agent_id', this.$route.query.agent_id);
                            this.$executeRequest.execFormPostByMenuUrl("/agentList/uploadDataDictionary", param).then(res => {
                                //functionAll.uploadDataDictionary(param).then(res => {
                                if (res && res.success) {
                                    this.form.plane_url = res.data
                                    this.dialogFormExcelImport = false;
                                    this.fileList.length = 0;
                                    this.formImport = {
                                        targePath: ''
                                    };
                                }

                            });
                        }

                    }
                })
            },
            // 点击导入弹出框的取消按钮
            cancleImport() {
                this.formImport = {
                    targePath: ''
                };
                this.dialogFormExcelImport = false;
                this.$refs.formImport.resetFields();
            },
        },

    }
</script>

<style scoped>
    /* 采集任务表单 */
    .step1 .oneContent {
        min-height: 230px;
        border: 1px solid #e6e6e6;
        margin-bottom: 20px;
        padding: 2% 4% 2% 0;
    }

    /* 按钮设置 */
    .step1 .addButton {
        color: #909399;
    }

    .step1 >>> .el-input-group__prepend button.el-button {
        background-color: #F56C6C;
        color: white;
    }

    .step1 .netxNUM {
        color: transparent;
    }

    /* 数据分页 */
    .step1 .pageDiv {
        margin-top: 10px;
        height: 30px;
    }

    .step1 .page {
        float: right;
    }
</style>
