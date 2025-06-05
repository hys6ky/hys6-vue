<template>
    <div>
        <StepTy :active="active"></StepTy>
        <div>
            <el-tabs v-model="activeNames" type="border-card" key='3'>
                <el-tab-pane label="贴源登记" name="second">
                    <div>
                        <el-form :model="ruleFormSecond" status-icon ref="ruleFormSecond" label-width="30%"
                                 class="demo-ruleForm ruleFormSe">
                            <el-row type="flex" justify="start">
                                <el-col :span="10">
                                    <el-form-item label="数据采集任务名" prop="task_name"
                                                  :rules="filter_rules([{required: true}])">
                                        <el-col :span="16">
                                            <el-input v-model="ruleFormSecond.task_name" size="medium"></el-input>
                                        </el-col>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <!-- :rules="filter_rules([{required: true,dataType:'noLengthVaild'}])" -->
                                    <el-form-item label="作业编号" prop="database_number">
                                        <el-col :span="16">
                                            <el-input v-model="ruleFormSecond.database_number" size="medium"
                                                      v-if="show==true" disabled placeholder="作业编号"></el-input>
                                            <el-input v-model="ruleFormSecond.database_number" size="medium" v-else
                                                      placeholder="作业编号"></el-input>
                                        </el-col>
                                        <el-tooltip class="item" effect="dark" content="手动执行采集作业脚本时,此参数可作为第一个参数"
                                                    placement="right">
                                            <i class="el-icon-question" aria-hidden="true"
                                               style="margin-left: 4px;"></i>
                                        </el-tooltip>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row type="flex" justify="start">
                                <el-col :span="10">
                                    <el-form-item label="分类编号" prop="classify_num"
                                                  :rules="filter_rules([{required: true,dataType:'compositions'}])">
                                        <el-col :span="16">
                                            <el-input v-model="ruleFormSecond.classify_num" size="medium" readonly
                                                      placeholder="分类编号">
                                                <el-button slot="append" icon="el-icon-zoom-in"
                                                           @click="collTaskClassFun();outerVisible = true">设置分类
                                                </el-button>
                                            </el-input>
                                        </el-col>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="分类名称" prop="classify_name" :rules="rule.default">
                                        <el-col :span="16">
                                            <el-input v-model="ruleFormSecond.classify_name" size="medium" disabled
                                                      placeholder="分类名称"></el-input>
                                        </el-col>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row type="flex" justify="start">
                                <el-col :span="10">
                                    <el-form-item label="数据源" prop="sourceName">
                                        <el-col :span="16">
                                            <el-input v-model="sourceName" size="medium" disabled></el-input>
                                        </el-col>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10" prop="fetch_size">
                                    <el-form-item label="FETCH_SIZE" prop="fetch_size"
                                                  :rules="filter_rules([{required: true,dataType:'numberAll'}])">
                                        <el-col :span="16">
                                            <el-input v-model="ruleFormSecond.fetch_size" size="medium"></el-input>
                                        </el-col>
                                        <el-tooltip class="item" effect="dark" content="数据库类型为MYSQL,请设置大小为-2"
                                                    placement="right">
                                            <i class="el-icon-question" aria-hidden="true"
                                               style="margin-top:12px;"></i>
                                        </el-tooltip>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                  <div slot="title">
                    <span class="dialogtitle el-icon-caret-right">存储层</span>
                  </div>
                  <el-table stripe
                            :data="AlldestinationData.slice((Alldestination_currentPage - 1) * Alldestination_pagesize,Alldestination_currentPage * Alldestination_pagesize)"
                            border size="medium" highlight-current-row ref="multipleTable" tooltip-effect="dark"
                            :row-key="(row)=>{ return row.dsl_id}">
                    <el-table-column width="55" align="center" prop="selectionState">
                      <template slot-scope="scope">
                        <el-checkbox :checked="scope.row.usedflag" v-model="scope.row.usedflag"
                                     @change="handleCheckboxChange(scope.row)"></el-checkbox>
                      </template>
                    </el-table-column>
                    <el-table-column label="序号" align="center" width="100px">
                      <template slot-scope="scope">
                        <span>{{ scope.$index + (StorageTier_currentPage - 1) * StorageTier_pagesize + 1 }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column property="dsl_name" label="存储名称" align="center"
                                     :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column property="store_type" label="存储类型" align="center"
                                     :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="详情" width="160px" align="center">
                      <template slot-scope="scope">
                        <el-row>
                          <el-col :span="24" class="delbtn">
                            <el-button size="medium" type="text" circle @click="getStoDestDetailFun(scope.row)">
                              查看详情
                            </el-button>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination @size-change="Alldestination_handleSizeChange"
                                 @current-change="Alldestination_handleCurrentChange"
                                 :current-page.sync="Alldestination_currentPage" :page-size="Alldestination_pagesize"
                                 layout="total, prev, pager, next" :total="AlldestinationData.length"
                                 class="locationcenter"></el-pagination>
                  <el-row :gutter="20">
                    <el-col :span="6" style="text-align:right;">
                      <el-button type="primary" :loading="linkloading" @click="testLinkFun('1')"
                                 size="mini">测试连接
                      </el-button>
                    </el-col>
                    <el-col :span="2">
                      <el-button type="success" @click="viewLogFun()" size="mini">查看日志</el-button>
                    </el-col>
                  </el-row>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-row>
            <el-col :span="12">
                <el-button type="primary" size="medium" class="leftbtn" @click="backFun()">返回</el-button>
            </el-col>
            <el-col :span="12">
                <el-button type="primary" size="medium" class='rightbtn' @click="next('ruleFormSecond')">下一步
                </el-button>
                <el-button type="primary" size="medium" class='rightbtn' disabled>上一步</el-button>
            </el-col>
        </el-row>
        <!-- 分类编号弹层-->
        <el-dialog title="采集任务分类" :visible.sync="outerVisible" class="collTask">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">采集任务分类</span>
            </div>
            <el-dialog width="40%" title="新增采集任务分类" :visible.sync="innerVisible" append-to-body>
                <div slot="title">
                    <span class="dialogtitle el-icon-caret-right">新增采集任务分类</span>
                </div>
                <el-form :model="addClassTask" ref="addClassTask">
                    <el-form-item label=" 分类编号" prop="class_num"
                                  :rules="filter_rules([{required: true,dataType:'compositions'}])"
                                  :label-width="formLabelWidth">
                        <el-input v-model="addClassTask.class_num" style="width:284px"></el-input>
                    </el-form-item>
                    <el-form-item label=" 分类名称" prop="class_name" :rules="rule.default" :label-width="formLabelWidth">
                        <el-input v-model="addClassTask.class_name" style="width:284px"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="class_des" :label-width="formLabelWidth">
                        <el-input v-model="addClassTask.class_des" type="textarea" style="width:284px"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button size="mini" type="danger" @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" size="mini" @click="innerVisible = false;addClassTaskFun(addClassTask)">
                        保存
                    </el-button>
                </div>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-table stripe :data="CollTaskData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" border
                          size="medium" highlight-current-row @current-change="handleSelectionChange"
                          @row-click="chooseone">
                    <el-table-column property label="选择" width="90px" type="index" align="center">
                        <template slot-scope="scope">
                            <el-radio v-model="radio2" :label="scope.row.classify_id">
                                &thinsp;
                            </el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column property label="序号" width="100px" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.$index+(currentPage - 1) * pagesize + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="classify_num" label="分类编号" align="center" width="230px"></el-table-column>
                    <el-table-column property="classify_name" label="分类名称" width="230px"
                                     align="center"></el-table-column>
                    <el-table-column property="remark" label="描述" width="225px" align="center"></el-table-column>
                    <el-table-column label="操作" width="150px" align="center">
                        <template slot-scope="scope">
                            <el-row>

                                <el-col :span="8" style="text-align: center;">
                                    <el-button type="text" circle @click="colltaskEditBtn(scope.row)" class='editcolor'>
                                        编辑
                                    </el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button class='delcolor' type="text" circle @click="colltaskDeleBtn(scope.row)"
                                               @row-click="chooseone">删除
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
                    <el-button @click="addClassNumBtn();innerVisible = true" type="success" size="mini">新增</el-button>

                    <el-button @click="updataClassNumBtn(CollTaskData)" type="primary" size="mini">确定</el-button>

                </div>
            </div>
        </el-dialog>

        <!-- 点击编辑弹层 -->
        <el-dialog width="40%" title="修改采集任务分类" :visible.sync="ediltVisible" append-to-body>
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">修改采集任务分类</span>
            </div>
            <el-form :model="editClassTask" ref="addClassTask">
                <el-form-item label=" 分类编号" prop="class_num" :rules="rule.default" :label-width="formLabelWidth"
                              width="130">
                    <el-input v-model="editClassTask.class_num" style="width:284px" disabled></el-input>
                </el-form-item>
                <el-form-item label=" 分类名称" prop="class_name" :rules="rule.default" :label-width="formLabelWidth">
                    <el-input v-model="editClassTask.class_name" style="width:284px"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="class_des" :label-width="formLabelWidth">
                    <el-input v-model="editClassTask.class_des" type="textarea" style="width:284px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="mini" type="danger" @click="ediltVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="editClassTaskSane(editClassTask)">保存</el-button>
            </div>
        </el-dialog>

        <!-- 测试连接弹层 -->
        <el-dialog title="提示信息" :visible.sync="testLink" width="30%">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">提示信息</span>
            </div>
            <div class="testLinnk">
                <span>{{linkTip}}</span>
            </div>
        </el-dialog>
        <!-- 查看详情 -->
        <el-dialog title=" 查看详情" :visible.sync="dialogViewDetails" width="60%" class="alltable">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">查看详情</span>
            </div>
            <table v-if="viewDatilsData.length==0" class="mailTable" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="nocontent">暂无信息</td>
                </tr>
            </table>
            <table v-else class="mailTable" border="0" cellspacing="0" cellpadding="0">
                <tr v-for="(item,index) in viewDatilsData" :key="index">
                    <td>{{item.storage_property_key}}：</td>
                    <td>
                        <p>{{item.storage_property_val}}</p>
                    </td>
                </tr>
            </table>
        </el-dialog>
    </div>
</template>

<script>
    import * as validator from "@/utils/validator";
    import * as message from "@/utils/message";
    import StepTy from "./step_ty.vue";
    import Loading from '../../../../components/loading/index.vue'

    export default {
        components: {
            StepTy,
            Loading
        },
        data() {
            return {
              selectedOption: null,
              Allis_destination: false,
              Alldestination_pagesize: 10,
              Alldestination_currentPage: 1,
              AlldestinationData: [],
              ex_destinationcurrentPage: 1,
              ex_destinationpagesize: 100,
              destination_currentPage: 1,
              destination_pagesize: 10,
                tableloadingInfo: "数据加载中...",
                dialogChooseStorageTier: false,
                dialogViewDetails: false,
                activeNames: "",
                active:0,
                radio2: null,
                linkTip: "",
                isLoading: false,
                linkloading: false,
                CollTaskData: [],
                currentPage: 1,
                pagesize: 10,
                ruleFormSecond: {
                    task_name: "",
                    database_number: "",
                    classify_num: "",
                    classify_name: "",
                    database_drive: "",
                    database_name: "",
                    database_ip: "",
                    database_port: "",
                    user_name: "",
                    database_pad: "",
                    jdbc_url: "",
                    database_type: "",
                    fetch_size: 500
                },
                sourceName: "",
                sourceId: null,
                agentId: null,
                rule: validator.default,
                outerVisible: false,
                innerVisible: false,
                ediltVisible: false,
                testLink: false,
                viewLog: false,
                input0: "",
                addClassTask: {
                    class_num: "",
                    class_name: "",
                    class_des: ""
                },
                editClassTask: {
                    class_id: "",
                    class_num: "",
                    class_name: "",
                    class_des: ""
                },
                currentSelectItem: {},
                classifyName: "",
                classifyNum: "",
                DatabaseType: [],
                ipPlaceholder: "",
                portPlaceholder: "",
                urlPrefix: "",
                urlSuffix: "",
                dbid: null,
                activelink: "",
                formLabelWidth: "150px",
                show: false,
                lognum: 100,
                logMsg: '',
                StorageTierData: [],
                storeTypeData: [],
                StorageTier_currentPage: 1,
                StorageTier_pagesize: 10,
                viewDatilsData: [],
                radioSave: null, //存储层弹框单选
                tyAddSave: false,
                dbcollect_AddSave: false,
                dsl_id: '',
                dialogChooseSatabase: false,
                databaseData: [],
                choiceDatabase: {},
                collectType: false,
                collect_type: {},
                fetch_size: null,
            };
        },
        created() {
            this.sourceName = this.$Base64.decode(this.$route.query.source_name);
            this.sourceId = this.$route.query.source_id;
            this.agentId = this.$route.query.agent_id;
            this.dbid = this.$route.query.id;
            this.edit = this.$route.query.edit;
            this.storeTypeFun();
            this.$Code.getCodeItems({category: 'CollectType'}).then(res => {
                this.collect_type = res.data
            })
          this.AllSettingDestinationFun();
        },
        mounted() {
            if (this.edit == "yes") {
              this.show = true;
              let params = {};
              params["databaseId"] = this.dbid;
              this.$executeRequest.execByControllerMappingName("/register/editStorageData", params).then(res => {
                if (res.data.length != 0) {
                  this.isshow = 'second'
                  this.activeNames = 'second'
                  this.ruleFormSecond.task_name = res.data[0].task_name;
                  this.ruleFormSecond.database_number = res.data[0].database_number;
                  this.ruleFormSecond.classify_num = res.data[0].classify_num;
                  this.ruleFormSecond.classify_name = res.data[0].classify_name;
                  this.ruleFormSecond.dsl_id = res.data[0].dsl_id;
                  this.ruleFormSecond.fetch_size = res.data[0].fetch_size;
                  this.fetch_size = res.data[0].fetch_size;
                  this.dbid = res.data[0].database_id;
                  this.radio2 = res.data[0].classify_id;
                  this.AllSettingDestinationFun(this.ruleFormSecond.dsl_id);
                }
              })
            } else {
              let params = {};
              params["source_id"] = this.sourceId;
              this.$executeRequest.execByControllerMappingName("/register/getInitStorageData", params).then(res => {
                  console.log(res.data,"/register/getInitStorageData")
                  if (res.data.length !== 0) {
                      this.showStep('second', false)
                      this.tyAddSave = true
                      this.ruleFormSecond.task_name = res.data[0].task_name,
                      this.ruleFormSecond.database_number = res.data[0].database_number,
                      this.ruleFormSecond.classify_num = res.data[0].classify_num,
                      this.ruleFormSecond.classify_name = res.data[0].classify_name,
                      this.ruleFormSecond.fetch_size = res.data[0].fetch_size
                      this.fetch_size = res.data[0].fetch_size;
                      this.ruleFormSecond.dsl_id = res.data[0].dsl_id;
                      this.dbid = res.data[0].database_id
                      this.radio2 = res.data[0].classify_id
                      this.AllSettingDestinationFun(this.ruleFormSecond.dsl_id);
                  } else {
                    this.showStep('second', false)
                  }
              })
            }
        },

        methods: {
          ex_destination_handleSizeChange(size) {
            this.ex_destinationpagesize = size;
          },
          ex_destination_handleCurrentChange(current) {
            this.ex_destinationcurrentPage = current;
          },
          destination_handleSizeChange(size) {
            this.destination_pagesize = size;
          },
          destination_handleCurrentChange(current) {
            this.destination_currentPage = current;
          },
          Alldestination_handleSizeChange(size) {
            this.Alldestination_pagesize = size;
          },
          Alldestination_handleCurrentChange(current) {
            this.Alldestination_currentPage = current;
          },
          // 点击查看详情
          getStoDestDetailFun(row) {
            this.dialogViewDetails = true;
            let params = {};
            params["dslId"] = row.dsl_id;
            this.$executeRequest.execGetByModuleUrl("/dataRegister/agent/stodestconf/getStoDestDetail", params).then(rs => {
              if (rs.success) {
                this.viewDatilsData = this.$Secret.DecryptJSON(rs.data).data
              }
            });
          },
          // 获取所有存储层信息
          AllSettingDestinationFun(val) {
            this.$executeRequest.execGetByModuleUrl("/dataRegister/agent/stodestconf/getStorageDataBySource").then(res => {
              let arr = JSON.parse(JSON.stringify(res.data));
              let data = this.storeTypeData;
              for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < data.length; j++) {
                  if (data[j].code == arr[i].store_type) {
                    arr[i].store_type = data[j].value;
                  }
                }
              }
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].usedflag == "1" || arr[i].dsl_id == val) {
                  arr[i].usedflag = true;
                } else {
                  arr[i].usedflag = false;
                }
                for (let j = 0; j < data.length; j++) {
                  if (data[j].code == arr[i].store_type) {
                    arr[i].store_type = data[j].value;
                  }
                }
              }
              this.AlldestinationData = arr;
            })
          },
          handleCheckboxChange(option) {
            if (option.usedflag) {
              this.selectedOption = option;
                this.ruleFormSecond.dsl_id = option.dsl_id;
            } else {
              this.selectedOption = null;
              this.ruleFormSecond.dsl_id = null;
            }
            // 将其他选项设置为未选中
            this.AlldestinationData.forEach((item) => {
              if (item.dsl_id != option.dsl_id) {
                item.usedflag = false;
              }
            });
          },
            next(formName) {
                this.isLoading = true
                let that = this;
                that.$refs[formName].validate(valid => {
                    if (valid) {
                        that.testLinkFun("2"); //如果是1就是点击了测试按钮，是需要loding直接出现的
                    } else {
                        this.isLoading = false
                    }
                });
            },
            nextLink(data) {
                if (data == "true") {
                    // 根据activeNames值判断传值？？？？？？
                    let params = {};
                    params["task_name"] = this.ruleFormSecond.task_name;
                    params["database_number"] = this.ruleFormSecond.database_number;
                    params["classify_id"] = this.radio2;
                    params["collect_type"] = this.collect_type.TieYuanDengJi;
                    params["fetch_size"] = this.ruleFormSecond.fetch_size;
                    params["source_id"] = this.sourceId;
                    params["database_id"] = this.dbid;
                    params["dsl_id"] = this.ruleFormSecond.dsl_id;
                    if (this.edit == "yes") {
                        // 编辑保存 updateRegisterData
                        this.$executeRequest.execByControllerMappingName("/register/updateRegisterData", params).then(res => {
                            this.isLoading = false;
                            if (res.success) {
                                let data = {};
                                data = {
                                    agent_id: this.agentId,
                                    id: this.dbid,
                                    source_id: this.sourceId,
                                    source_name: this.$Base64.encode(this.sourceName),
                                    dsl_id: this.ruleFormSecond.dsl_id,
                                    edit: "yes"
                                };
                                this.$router.push({
                                    name: "register",
                                    query: data
                                });
                            }
                        });
                    } else {
                        if (this.dbid) {
                            this.$executeRequest.execByControllerMappingName("/register/updateRegisterData", params).then(res => {
                                this.isLoading = false
                                if (res.success) {
                                    let data = {};
                                    data = {
                                        agent_id: this.agentId,
                                        id: this.dbid,
                                        source_id: this.sourceId,
                                        source_name: this.$Base64.encode(this.sourceName),
                                        dsl_id: this.ruleFormSecond.dsl_id,
                                    };
                                    this.$router.push({
                                        name: "register",
                                        query: data
                                    });
                                }
                            });
                        } else {
                            this.$executeRequest.execByControllerMappingName("/register/saveRegisterData", params).then(res => {
                                this.isLoading = false
                                if (res.success) {
                                    let data = {};
                                    data = {
                                        id: res.data,
                                        source_id: this.sourceId,
                                        dsl_id: this.ruleFormSecond.dsl_id,
                                        source_name: this.$Base64.encode(this.sourceName)
                                    };
                                    this.$router.push({
                                        name: "register",
                                        query: data
                                    });
                                }
                            });
                        }
                    }
                }
            },
            backFun() {
                this.$router.push({
                    name: "dataRegister"
                });
            },
            handleSizeChange(size) {
                this.pagesize = size;
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
            },

            // 采集任务分类单选选择时
            handleSelectionChange(row) {
                if (row) {
                    this.currentSelectItem = row;
                    this.classifyName = row.classify_name;
                    this.classifyNum = row.classify_num;
                }
            },
            chooseone(row) {
                    this.radio2 = row.classify_id;
            },
            // 采集任务分类确定提交时
            updataClassNumBtn(row) {
                if (row.length > 0) {
                    if (this.activeNames == 'second') {
                        if (this.radio2 != '') {
                            for (let i = 0; i < row.length; i++) {
                                if (row[i].classify_id == this.radio2) {
                                    this.outerVisible = false;
                                    this.ruleFormSecond.classify_name = row[i].classify_name;
                                    this.ruleFormSecond.classify_num = row[i].classify_num;
                                }
                            }
                        } else {
                            this.$Msg.customizTitle('请至少选择一项', 'error')
                        }
                    }
                } else {
                    this.$Msg.customizTitle('请新增任务并选择', 'error')
                }
            },
            // 采集任务取消时
            cancelClassNumBtn() {
                this.outerVisible = false;
                this.radio = "";
                this.currentSelectItem = {};
                this.classifyName = "";
                this.classifyNum = "";
            },
            // 点击分类编号时调
            collTaskClassFun(num) {
                this.ruleFormSecond.classify_name = "";
                this.ruleFormSecond.classify_num = "";
                this.radio2 = '';
                let params = {};
                params["sourceId"] = this.sourceId;
                this.$executeRequest.execByControllerMappingName("/dbconf/getClassifyInfo", params).then(res => {
                    if (res.data) {
                        if (res.data.length == 0) {
                            this.tableloadingInfo = "暂无数据";
                            this.CollTaskData=[];
                        } else {
                            this.CollTaskData = res.data
                        }
                    }
                });
            },
            // 点击编辑按钮回显之前数据
            colltaskEditBtn(row) {
                this.ediltVisible = true;
                this.editClassTask.class_id = row.classify_id;
                this.editClassTask.class_name = row.classify_name;
                this.editClassTask.class_num = row.classify_num;
                this.editClassTask.class_des = row.remark;
            },
            // 点击编辑后-提交
            editClassTaskSane(data) {
                this.ediltVisible = false;
                let params = {};
                params["classify_id"] = data.class_id;
                params["classify_num"] = data.class_num;
                params["classify_name"] = data.class_name;
                params["remark"] = data.class_des;
                params["agent_id"] = this.agentId;
                params["sourceId"] = this.sourceId;
                this.$executeRequest.execByControllerMappingName("/dbconf/updateClassifyInfo", params).then(res => {
                    message.updateSuccess(res);
                    this.collTaskClassFun();
                });
            },
            // 点击任务采集-删除
            colltaskDeleBtn(row) {
                let that = this
                message.confirmMsg('确定删除吗').then(res => {
                    let params = {};
                    params["classifyId"] = row.classify_id;
                    this.$executeRequest.execByControllerMappingName("/dbconf/deleteClassifyInfo", params).then(res => {
                        message.deleteSuccess(res);
                        that.collTaskClassFun();
                    });
                }).catch(() => {
                })
            },
            // 点击新增
            addClassNumBtn() {
                this.addClassTask.class_num = "",
                    this.addClassTask.class_name = "",
                    this.addClassTask.class_des = "";
            },
            // 点击新增后的弹框保存
            addClassTaskFun(data) {
                let params = {};
                params["classify_num"] = data.class_num;
                params["classify_name"] = data.class_name;
                params["remark"] = data.class_des;
                params["agent_id"] = this.agentId;
                params["sourceId"] = this.sourceId;
                this.$executeRequest.execByControllerMappingName("/dbconf/saveClassifyInfo", params).then(res => {
                    message.saveSuccess(res);
                    this.collTaskClassFun();
                });
            },
            // 点击测试连接
            testLinkFun(n) {
                if (n === '1') { //等于1是点击了测试链接按钮需要loding出现
                    this.linkloading = true
                }
                let params = {};
              params["task_name"] = this.ruleFormSecond.task_name;
              params["database_number"] = this.ruleFormSecond.database_number;
              params["classify_id"] = this.radio2;
              params["collect_type"] = this.collect_type.ShuJuKuCaiJi
              params["fetch_size"] = this.ruleFormSecond.fetch_size
              params["dsl_id"] = this.ruleFormSecond.dsl_id;
              params["agent_id"] = this.agentId;
              params["source_id"] = this.sourceId
              params["database_id"] = this.dbid;
              params["agent_id"] = this.agentId;
                if (!params.dsl_id) {
                    this.$Msg.customizTitle('请先选中数据库链接信息之后再测试连接', 'warning')
                    this.linkloading = false;
                    return;
                }
                this.$executeRequest.execByControllerMappingName("/dbconf/testConnection", params).then(res => {
                    if (res && res.success) {
                        this.activelink = "true";
                        if (n === '1') {
                            this.linkloading = false
                            this.$Msg.customizTitle('连接成功', "success");
                        } else if (n === "2") {
                            this.nextLink(this.activelink);
                        }
                    } else {
                        this.linkloading = false
                        this.activelink = "false";
                        this.isLoading = false
                    }
                });
            },
            storeTypeFun() {
                let params = {};
                params["category"] = "Store_type";
                this.$Code.getCategoryItems(params).then(res => {
                    if (res) {
                        this.storeTypeData = res.data;
                    }
                });
            },
            StorageTier_handleSizeChange(size) {
                this.StorageTier_pagesize = size
            },
            StorageTier_handleCurrentChange(currentpage) {
                this.StorageTier_currentPage = currentpage
            },
            handleClose() {
                this.collectType = false;
                this.activeNames = 'third';
            },
            showStep(data, isShow) {
              this.activeNames = data
            }
        }
    };
</script>

<style scoped>
    .leftbtn {
        margin-top: 12px;
        margin-top: 12px;
        float: left;
        margin: 15px;
        margin-bottom: 10px;
    }

    .rightbtn {
        margin-top: 12px;
        margin-top: 12px;
        float: right;
        margin: 15px;
        margin-bottom: 10px;
    }

    .ruleFormSe {
        margin-top: 15px;
        border-top: 1px dotted #ccc;
        padding-top: 10px;
    }

    #jdbcUrl > lable {
        width: 20% !important;
    }

    .testLinnk {
        text-align: center;
    }

    .testLinnk > span {
        font-size: 14px;
        color: #e84d45
    }

    .logseach {
        width: 25%;
        position: absolute;

        top: 18px;

        left: 160px;
    }

    .logseach > div > input {
        height: 20px;
    }

    #dataAcquisition >>> .el-dialog__header {
        border-bottom: 1px solid #f3f0f0;
    }

    .collTask >>> .el-dialog__body {
        padding: 0;
    }

    .btntop {
        margin: 10px 0;
    }

    .mailTable {
        width: 66%;
        margin: 0 auto;
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-left: 1px solid #ccc;
        box-sizing: border-box;
    }

    .mailTable > tr > td:nth-child(1) {
        width: 25%;
        text-align: right;
        padding: 10px;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
        box-sizing: border-box;
        font-weight: bold;
        background-color: #eff3f6;
    }

    .mailTable > tr > td:nth-child(2) {
        width: 40%;
        text-align: left;
        padding: 10px;
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;
    }

    .el-col >>> .el-input-group__append {
        padding: 0 8px !important;
    }

    .el-collapse >>> .el-collapse-item__header {
        font-size: 20px !important;
    }

    .el-collapse >>> div {
        font-size: 13px !important;
    }
</style>