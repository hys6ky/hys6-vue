<template>
    <div id='steps6'>
        <Step :active="active"></Step>
        <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="30%">
            <div class="startupform">
                <el-row type="flex" justify="center">
                    <el-col :span="8">
                        <el-form-item label="工程编号" prop="etl_sys_cd" :rules="filter_rules([{required: true}])">
                            <el-col :span="16">
                                <el-input v-model="ruleForm.etl_sys_cd" size="medium" readonly placeholder="工程编号">
                                    <el-button slot="append" icon="el-icon-zoom-in"
                                               @click="Projectnumdialog=true;getEtlSysDataFun()"></el-button>
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="任务编号" prop="sub_sys_cd" :rules="filter_rules([{required: true}])">
                            <el-col :span="16">
                                <el-input v-model="ruleForm.sub_sys_cd" size="medium" placeholder="任务编号">
                                    <el-button slot="append" icon="el-icon-zoom-in"
                                               @click="getEtlSubSysData()"></el-button>
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="作业程序类型" prop="pro_type" :rules="rule.default">
                            <el-col :span="16">
                                <el-input v-model="ruleForm.pro_type" size="medium" readonly
                                          placeholder="作业程序类型"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="8">
                        <el-form-item label="作业程序名称" prop="pro_name">
                            <el-col :span="16">
                                <el-input v-model="ruleForm.pro_name" size="medium" readonly></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="调度频率" prop="Dispatching_frequency">
                            <el-col :span="16">
                                <el-select style="width:100%" v-model="ruleForm.Dispatching_frequency"
                                           placeholder="频率选择" clearable size="medium"
                                           @change="Dispatching_frequencyFun">
                                    <el-option v-for="item in Dispatch_Frequency" :key="item.value" :label="item.value"
                                               :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" prop="database_pad">
                        <el-form-item label="作业优先级" prop="work_pro">
                            <el-col :span="16">
                                <el-input v-model="ruleForm.work_pro" size="medium" placeholder="0"
                                          @input="getwork_proFun"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="8">
                        <el-form-item label="调度触发方式" prop="Dispatching_mode">
                            <el-col :span="16">
                                <el-select style="width:100%" v-model="ruleForm.Dispatching_mode"
                                           @change="Dispatching_modeFun" placeholder="调度触发方式选择" clearable>
                                    <el-option v-for="item in Dispatching_mode" :key="item.value" :label="item.value"
                                               :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="ruleForm.Dispatching_mode=='T'||ruleForm.Dispatching_mode=='Z'">
                        <el-form-item label="调度触发时间" prop="Dispatching_time">
                            <el-col :span="16">
                                <el-time-picker style="width:100%" v-model="ruleForm.Dispatching_time"
                                                @change="getDispatching_timeFun"
                                                :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                                                placeholder="调度时间 hh:mm:ss" value-format="HH:mm:ss" format="HH:mm:ss">
                                </el-time-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-else-if="ruleForm.Dispatching_mode==='D'">
                        <el-form-item label="上游作业" prop="Upstream_operation">
                            <el-col :span="16">
                                <el-select filterable style="width:100%" v-model="ruleForm.Upstream_operation" multiple
                                           placeholder="上游作业" @focus='getPreJobName' @change="getUpstream_operationFun">
                                    <el-option v-for="item in preJobName" :key="item.value" :label="item.value"
                                               :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-else>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="调度时间位移" prop="Dispatching_timedrift"
                                      v-if="ruleForm.Dispatching_mode==='T'||ruleForm.Dispatching_mode==='Z'">
                            <el-col :span="16">
                                <el-input v-model="ruleForm.Dispatching_timedrift" @input="getDispatching_timedriftFun"
                                          size="medium" placeholder="0"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="10">
                        <el-form-item label="作业程序目录" prop="pro_dic" :rules="rule.default" class='ml_lable'>
                            <el-col :span="24">
                                <el-input v-model="ruleForm.pro_dic" placeholder="作业程序目录" size="medium">
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="日志目录" prop="log_dic" :rules="rule.default" class='ml_lable'>
                            <el-col :span="24">
                                <el-input v-model="ruleForm.log_dic" placeholder="日志目录" size="medium">
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4"></el-col>
                </el-row>
            </div>
            <div class="steps4">
                <el-table :header-cell-style="{background:'#e6e0e0'}" ref="filterTable" stripe
                          :default-sort="{prop: 'date', order: 'descending'}" style="width: 100%" size="medium" border
                          :data="ruleForm.startuptableData.slice((currentPage - 1) * pagesize,currentPage *pagesize)">
                    <el-table-column label="序号" align="center" width="70">
                        <template slot-scope="scope">
                            <span>{{scope.$index+(currentPage - 1) * pagesize + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="作业名称" width="160" align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-form-item :prop="'startuptableData.'+scope.$index+'.etl_job'" :rules="rule.default">
                                <el-input v-model="scope.row.etl_job" placeholder="作业名称" size="mini"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="作业描述" align="center">
                        <template slot-scope="scope">
                            <el-form-item :prop="'startuptableData.'+scope.$index+'.etl_job_desc'"
                                          :rules="rule.default">
                                <el-input v-model="scope.row.etl_job_desc" type="textarea" placeholder="作业描述"
                                          size="mini"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="调度频率" align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-form-item :prop="'startuptableData.'+scope.$index+'.disp_freq'" :rules="rule.default">
                                <el-select style="width:100%" v-model="scope.row.disp_freq" placeholder="频率选择" clearable
                                           size="mini">
                                    <el-option v-for="item in Dispatch_Frequency" :key="item.value" :label="item.value"
                                               :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="作业优先级" align="center" :show-overflow-tooltip="true" width="110">
                        <template slot-scope="scope">
                            <el-form-item :prop="'startuptableData.'+scope.$index+'.job_priority'"
                                          :rules="rule.default">
                                <el-input style="width:100%" v-model="scope.row.job_priority" placeholder="0"
                                          size="mini"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="调度触发方式" align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-form-item :prop="'startuptableData.'+scope.$index+'.disp_type'" :rules="rule.default">
                                <el-select style="width:100%" v-model="scope.row.disp_type" placeholder="调度触发方式"
                                           size="mini" clearable>
                                    <el-option v-for="item in Dispatching_mode" :key="item.value" :label="item.value"
                                               :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="调度时间位移" align="center" :show-overflow-tooltip="true" width="110">
                        <template slot-scope="scope">
                            <el-form-item :prop="'startuptableData.'+scope.$index+'.disp_offset'" :rules="rule.default"
                                          v-if="scope.row.disp_type==='T'||scope.row.disp_type==='Z'">
                                <el-input style="width:100%" v-model="scope.row.disp_offset" placeholder="0"
                                          size="mini"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="调度触发时间" align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-form-item :prop="'startuptableData.'+scope.$index+'.disp_time'" :rules="rule.default"
                                          v-if="scope.row.disp_type==='T'||scope.row.disp_type==='Z'">
                                <el-time-picker style="width:100%" v-model="scope.row.disp_time" size="mini"
                                                :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                                                placeholder="hh:mm:ss" value-format="HH:mm:ss" format="HH:mm:ss">
                                </el-time-picker>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="上游作业" align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-form-item :prop="'startuptableData.'+scope.$index+'.pre_etl_job_id'" :rules="rule.default"
                                          v-if="scope.row.disp_type==='D'">
                                <el-select filterable style="width:100%" v-model="scope.row.pre_etl_job_id" multiple
                                           size="mini" placeholder="上游作业" @focus='getPreJobName'>
                                    <el-option v-for="item in preJobName" :key="item.value" :label="item.value"
                                               :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-form>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                       :page-sizes="[100, 200, 300, 400]" :page-size="pagesize"
                       layout="total, sizes, prev, pager, next, jumper" :total="ruleForm.startuptableData.length"
                       class="locationcenter"></el-pagination>
        <el-row>
            <el-col :span="12">
                <el-button type="primary" size="medium" class="leftbtn" @click="backFun()">返回</el-button>
            </el-col>
            <el-col :span="12">
                <el-button type="primary" size="medium" class='rightbtn' @click="next('ruleForm')">完成</el-button>
                <el-button type="primary" size="medium" class='rightbtn' @click="pre()">上一步</el-button>
            </el-col>
        </el-row>
        <!-- 选择工程编号 -->
        <el-dialog title="选择工程编号" :visible.sync="Projectnumdialog">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">选择工程编号</span>
            </div>
            <el-table stripe
                      :data="ProjectnumData.slice((ProjectnumcurrentPage - 1) * Projectnumpagesize, ProjectnumcurrentPage * Projectnumpagesize)"
                      border size="medium" highlight-current-row>
                <el-table-column property label="选择" width="60px" type="index" align="center">
                    <template slot-scope="scope">
                        <el-radio v-model="projnum_radio" :label="scope.row">&thinsp;</el-radio>
                    </template>
                </el-table-column>
                <el-table-column property label="序号" width="70px" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.$index+(ProjectnumcurrentPage - 1) * Projectnumpagesize + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column property="etl_sys_cd" label="工程编号" align="center"></el-table-column>
                <el-table-column property="etl_sys_name" label="工程名称" align="center"></el-table-column>
            </el-table>
            <el-pagination @size-change="Projectnum_handleSizeChange" @current-change="Projectnum_handleCurrentChange"
                           :current-page="ProjectnumcurrentPage" :page-size="Projectnumpagesize"
                           layout="total, prev, pager, next" :total="ProjectnumData.length"
                           class="locationright"></el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" size="mini" @click="projNumCloseFun(),Projectnumdialog=false">取 消</el-button>
                <el-button type="primary" size="mini" @click="projNumSubmitFun()">确定</el-button>
            </div>
        </el-dialog>
        <!-- 选择任务编号 -->
        <el-dialog title="选择任务编号" :visible.sync="Worknumdialog" width="40%">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">选择任务编号</span>
                <span class="dialogtoptxt">
                工程名称:
                <p class="dialogtopname">{{ruleForm.etl_sys_name}}</p>
            </span>
            </div>
            <el-table stripe
                      :data="WorknumData.slice((WorknumcurrentPage - 1) * Worknumpagesize, WorknumcurrentPage * Worknumpagesize)"
                      border size="medium" highlight-current-row>
                <el-table-column property label="选择" width="60px" type="index" align="center">
                    <template slot-scope="scope">
                        <el-radio v-model="worknum_radio" :label="scope.row">&thinsp;</el-radio>
                    </template>
                </el-table-column>
                <el-table-column property label="序号" width="70px" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.$index+(WorknumcurrentPage - 1) * Worknumpagesize + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column property="sub_sys_cd" label="任务编号" align="center"></el-table-column>
                <el-table-column property="sub_sys_desc" label="任务名称" align="center"></el-table-column>
            </el-table>
            <el-pagination @size-change="Worknum_handleSizeChange" @current-change="Worknum_handleCurrentChange"
                           :current-page="WorknumcurrentPage" :page-size="Worknumpagesize"
                           layout="total, prev, pager, next" :total="WorknumData.length"
                           class="locationright"></el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" size="mini" @click="Worknumdialog=false">取 消</el-button>
                <el-button type="primary" size="mini" @click="worknumSubmitFun()">确定</el-button>

            </div>
        </el-dialog>
        <!--完成  -->
        <el-dialog title="提示信息" :visible.sync="finishDialogVisible" width="30%">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">提示信息</span>
            </div>
            <span>设置完成！请等待Agent运行...不运行请点击取消或按下Esc键</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="finishDialogVisible = false" type="danger" size="mini">取 消</el-button>
            <el-button type="primary" @click="finishSubmit()" size="mini">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 加载过度 -->
        <!-- <transition name="fade">
            <loading v-if="isLoading" />
        </transition> -->
    </div>
</template>

<script>
    import semiStep from "./semiStep.vue";
    import * as validator from "@/utils/validator";

    export default {
        components: {
            semiStep
        },
        data() {
            return {
                active: 4,
                isLoading: false,
                dbid: null,
                aId: null,
                sourId: null,
                sName: null,
                currentPage: 1,
                pagesize: 100,
                ProjectnumcurrentPage: 1,
                Projectnumpagesize: 10,
                WorknumcurrentPage: 1,
                Worknumpagesize: 10,
                finishDialogVisible: false,
                Projectnumdialog: false,
                Worknumdialog: false,
                disableds: false,
                tableloadingInfo: '数据加载中...',
                rule: validator.default,
                ruleForm: {
                    etl_sys_cd: "",
                    etl_sys_id: null,
                    sub_sys_cd: "",
                    sub_sys_id: null,
                    pro_type: "",
                    pro_name: "",
                    pro_dic: "",
                    log_dic: "",
                    Dispatching_frequency: "",
                    Dispatching_timedrift: "",
                    Dispatching_time: "",
                    work_pro: "",
                    Upstream_operation: '', //上游作业
                    ded_id: "",
                    startuptableData: []

                },
                Dispatch_Frequency: [], //调度频率
                Dispatching_mode: [], //调度触发方式
                ProjectnumData: [], //工程编号数据
                projnum_radio: {}, //工程编号选择radio
                WorknumData: [], //工程编号数据
                worknum_radio: '',
                Pro_Type: [], //作业程序类型
                preJobName: [], //上游作业名称
                // TandZ: '0',
            };
        },
        mounted() {
            this.getAgentPath();
            if (this.$route.query.edit === 'yes') {
                this.disableds = true;
                this.getEtlJobConfInfoFromObj();
            } else {
                this.disableds = false;
                this.getPreviewJob();
            }
            // 调度频率
            this.$Code.getCategoryItems({
                'category': 'Dispatch_Frequency'
            }).then(res => {
                if (res.data) {
                    this.Dispatch_Frequency = res.data;
                }
            });
            // 调度触发方式
            this.$Code.getCategoryItems({
                'category': 'Dispatch_Type'
            }).then(res => {
                if (res.data) {
                    let data = res.data
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].code == 'A' || data[i].code == 'B') {
                            data.splice(i, 1);
                            i--
                        }
                    }
                    this.Dispatching_mode = res.data;
                }
            });
            // 作业程序类型
            this.$Code.getCategoryItems({
                'category': 'Pro_Type'
            }).then(res => {
                if (res.data) {
                    this.Pro_Type = res.data;
                }
            });
        },
        methods: {
            // 返回上一步
            pre() {
                if (this.$route.query.edit === 'yes') {
                    this.$router.push({
                        name: "dataStorage",
                        query: {
                            agent_id: this.$route.query.agent_id,
                            odc_id: this.$route.query.odc_id,
                            edit: this.$route.query.edit
                        }
                    })
                } else {
                    this.$router.push({
                        name: "dataStorage",
                        query: {
                            agent_id: this.$route.query.agent_id,
                            odc_id: this.$route.query.odc_id
                        }
                    })
                }
            },
            // 返回采集列表
            backFun() {
                this.$router.push({
                    //path: "/agentList"
                    name: "dataCollectionO"
                });
            },
            // 获取定义启动方式初始值
            getPreviewJob() { //获取当前半结构化采集任务下的作业信息(新增的时候)
                this.$executeRequest.execGetByMenuUrl("/semiStructuredAgent/startmodeconf/getPreviewJob", {
                    odc_id: this.$route.query.odc_id
                }).then(res => {
                  if (res && res.success) {
                    this.ruleForm.startuptableData = res.data
                  }
                })
            },
            getAgentPath() { //获取任务Agent的部署路径及日志目录
                this.$executeRequest.execGetByMenuUrl("/semiStructuredAgent/startmodeconf/getAgentPath", {
                    odc_id: this.$route.query.odc_id
                }).then(res => {
                    if (res && res.success) {
                      this.ruleForm.log_dic = res.data.log_dic.substr(0, res.data.log_dic.lastIndexOf("/") + 1);
                      this.ruleForm.pro_dic = res.data.pro_dic;
                      this.ruleForm.pro_name = res.data.pro_name;
                      this.ruleForm.pro_type = res.data.pro_type;
                    }
                })
            },
            getEtlJobConfInfoFromObj() { //获取半结构化采集作业配置(编辑的时候)
                this.$executeRequest.execGetByMenuUrl("/semiStructuredAgent/startmodeconf/getEtlJobConfInfoFromObj", {
                    odc_id: this.$route.query.odc_id
                }).then(res => {
                  if (res && res.success) {
                    this.ruleForm.etl_sys_cd = res.data[0].etl_sys_cd;
                    this.ruleForm.sub_sys_cd = res.data[0].sub_sys_cd;
                    this.ruleForm.sub_sys_id = res.data[0].sub_sys_id;
                    this.ruleForm.etl_sys_id = res.data[0].etl_sys_id;
                    this.ruleForm.startuptableData = res.data
                  }
                })
            },
            // 获取工程信息
            getEtlSysDataFun() {
                this.tableloadingInfo = '数据加载中...'
                this.$executeRequest.execGetByMenuUrl("/agent/startwayconf/getEtlSysData", null).then(res => {
                    if (res.data.length > 0) {
                        this.ProjectnumData = res.data
                    } else {
                        this.tableloadingInfo = '暂无数据'
                    }
                })
            },
            //点击任务编号按钮
            getEtlSubSysData() {
                //调接口显示内容
                if (this.ruleForm.etl_sys_cd !== undefined && this.ruleForm.etl_sys_cd !== '') {
                    this.Worknumdialog = true
                    this.$executeRequest.execGetByMenuUrl("/agent/startwayconf/getEtlSubSysData", {
                        'etl_sys_id': this.ruleForm.etl_sys_id
                    }).then(res => {
                      if (res && res.success) {
                        this.WorknumData = res.data
                      }
                    })
                } else {
                    this.$Msg.customizTitle('工程编号未选择', 'error')
                }

            },
            // 获取上游作业下拉
            getPreJobName() {
                let arr = [];
                if (this.ruleForm.etl_sys_cd !== undefined && this.ruleForm.etl_sys_cd !== '') {
                    //TODO 跨模块接口改入本模块中
                    this.$executeRequest.execGetByMenuUrl("/otherApi/searchEtlJob", {
                        'etl_sys_cd': this.ruleForm.etl_sys_cd
                    }).then(res => {
                        if (res !== undefined && res.data.length > 0) {
                            res.data.forEach((item) => {
                                arr.push({
                                    'value': item.etl_job,
                                    'code': item.etl_job_id
                                });
                            });
                            this.preJobName = arr;
                        }
                    });
                } else {
                    this.$Msg.customizTitle('工程编号未选择', 'error')
                }
            },
            next(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let arr = this.ruleForm.startuptableData
                         let preJobIds = [];
                        arr.forEach(item => {
                            item.etl_sys_cd = this.ruleForm.etl_sys_cd;
                            item.sub_sys_cd = this.ruleForm.sub_sys_cd;
                            item.etl_sys_id = this.ruleForm.etl_sys_id;
                            item.sub_sys_id = this.ruleForm.sub_sys_id;
                            item.pro_type = this.ruleForm.pro_type;
                            item.pro_name = this.ruleForm.pro_name;
                            item.log_dic = this.ruleForm.log_dic;
                            item.pro_dic = this.ruleForm.pro_dic;
                            if (item.disp_type === 'D') {
                              preJobIds.push(item.pre_etl_job_id)
                            }
                        })
                        let arr2 = [];
                        arr.forEach(item => {
                            arr2.push({
                                pre_etl_job_ids: preJobIds,
                                pro_dic: item.pro_dic,
                                log_dic: item.log_dic,
                                etl_sys_cd: item.etl_sys_cd,
                                etl_sys_id: item.etl_sys_id,
                                etl_job: item.etl_job,
                                etl_job_id: item.etl_job_id,
                                sub_sys_cd: item.sub_sys_cd,
                                sub_sys_id: item.sub_sys_id,
                                ocs_id: item.ocs_id
                            })
                        })
                        this.$executeRequest.execPostByMenuUrl("/semiStructuredAgent/startmodeconf/saveStartModeConfData", {
                            odc_id: this.$route.query.odc_id,
                            etlJobDefs: arr,
                            jobStartConfs: arr2
                        }).then(res => {
                            if (res && res.success) {
                                this.finishDialogVisible = true;
                            }
                        })

                    }
                })
            },
            //通过触发方式value值遍历得到code
            getDispatch_FrequencycodeFun(value) {
                for (let i = 0; i < this.Dispatch_Frequency.length; i++) {
                    if (this.Dispatch_Frequency[i].value == value) {
                        return this.Dispatch_Frequency[i].code
                    }
                }
            },

            // 编辑状态下获取作业信息
            getEtlJobDataFun() {
                this.$executeRequest.execGetByMenuUrl("/agent/startwayconf/getEtlJobData", {
                    'colSetId': this.dbid
                }).then(res => {
                    /*sendTask.getEtlJobData({
                        'colSetId': this.dbid
                    }).then(res => {*/
                    if (res.data.length > 0) {
                        this.ruleForm.startuptableData = res.data
                    } else {
                        this.tableloadingInfo = '暂无数据'
                    }
                })
            },

            finishSubmit() {
              this.$executeRequest.execGetByMenuUrl("/agentList/sendObjectCollectTaskById", {
                odc_id: this.$route.query.odc_id,
              }).then(res => {
                if (res && res.success) {
                  this.$Msg.customizTitle('发送成功', 'success')
                  this.$router.push({
                    name: "dataCollectionO"
                  });
                }
              })
            },
            handleSizeChange(size) {
                this.pagesize = size
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage
            },
            Projectnum_handleSizeChange(size) {
                this.Projectnumpagesize = size
            },
            Projectnum_handleCurrentChange(currentPage) {
                this.ProjectnumcurrentPage = currentPage
            },
            Worknum_handleSizeChange(size) {
                this.Worknumpagesize = size
            },
            Worknum_handleCurrentChange(currentPage) {
                this.WorknumcurrentPage = currentPage
            },
            //触发方式改变
            Dispatching_modeFun(key) {
                let value = this.getDispatching_modeValueFun(key)
                this.ruleForm.startuptableData.forEach((item) => {
                    this.$set(item, 'disp_type', key)
                })
                /*  if (key == 'T' || key == 'Z') {
                     this.TandZ = '1'
                     this.ruleForm.Upstream_operation = ''
                     this.ruleForm.startuptableData.forEach((item) => {
                         item.pre_etl_job = ''
                     })
                 } else if (key == 'D') {
                     this.TandZ = '2'
                     this.ruleForm.Dispatching_timedrift = ''
                     this.ruleForm.Dispatching_time = ''
                     this.ruleForm.startuptableData.forEach((item) => {
                         item.disp_time = ''
                         item.disp_offset = 0
                     })
                 } */
            },
            //通过触发方式key值遍历得到中文value值
            getDispatching_modeValueFun(key) {
                this.Dispatching_mode.forEach((item) => {
                    if (item.code == key) {
                        return item.value
                    }
                })
            },
            projNumCloseFun() {
                this.projnum_radio = {}
            },
            // 选择工程弹框确定
            projNumSubmitFun() {
                this.ruleForm.etl_sys_cd = this.projnum_radio.etl_sys_cd
                this.ruleForm.etl_sys_id = this.projnum_radio.etl_sys_id
                this.ruleForm.etl_sys_name = this.projnum_radio.etl_sys_name
                this.ruleForm.sub_sys_cd = ''
                this.Projectnumdialog = false
            },

            // 任务编号提交
            worknumSubmitFun() {
                this.ruleForm.sub_sys_cd = this.worknum_radio.sub_sys_cd
                this.ruleForm.sub_sys_id = this.worknum_radio.sub_sys_id
                this.Worknumdialog = false
            },
            // 调度频率改变时
            Dispatching_frequencyFun() {
                let code = this.ruleForm.Dispatching_frequency
                this.getstartuptableData(code)
            },
            //遍历全表改变对应列值--调度频率
            getstartuptableData(key) {
                this.ruleForm.startuptableData.forEach((item) => {
                    this.$set(item, 'disp_freq', key)
                })
            },
            // 作业优先级发生改变
            getwork_proFun() {
                let value = this.ruleForm.work_pro
                this.ruleForm.startuptableData.forEach((item) => {
                    this.$set(item, 'job_priority', value)
                })
            },
            //上游作业改变
            getUpstream_operationFun() {
                let value = this.ruleForm.Upstream_operation
                this.ruleForm.startuptableData.forEach((item) => {
                    this.$set(item, 'pre_etl_job_id', value)
                })
            },
            // 调度时间发生改变
            getDispatching_timeFun() {
                let value = this.ruleForm.Dispatching_time
                this.ruleForm.startuptableData.forEach((item) => {
                    this.$set(item, 'disp_time', value)
                    this.$forceUpdate();
                })
                this.$forceUpdate();
            },
            // 调度时间位移发生改变时
            getDispatching_timedriftFun() {
                let value = this.ruleForm.Dispatching_timedrift
                this.ruleForm.startuptableData.forEach((item) => {
                    this.$set(item, 'disp_offset', value)
                })
            }
        }
    };
</script>

<style scoped>
    .leftbtn {
        margin-top: 12px;
        float: left;
        margin: 15px;
        margin-bottom: 10px;
    }

    .rightbtn {
        margin-top: 12px;
        float: right;
        margin: 15px;
        margin-bottom: 10px;
    }

    .startupform {
        border: 1px solid #efebeb;
        padding: 14px 0 0 10px;
        margin: 12px 0;
        border-radius: 4px;
    }

    .locationcenter {
        text-align: center;
        margin-top: 5px;
    }

    .startupform >>> .el-input-group__prepend {
        background-color: #E6A23C;
        color: white;
    }

    .ml_lable >>> .el-form-item__label {
        width: 26% !important;
    }

    .ml_lable >>> .el-form-item__content {
        margin-left: 26% !important;
    }

    .steps4 >>> .el-form-item {
        margin-bottom: 0 !important;
    }

    .steps4 >>> .el-form-item__content {
        margin-left: 0px !important;
    }

    .steps4 >>> .el-form-item__error {
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 6px;
        position: absolute;
        top: 69%;
        left: 4%;
        z-index: 1
    }

    .linefs >>> .el-form-item__content {
        line-height: 23px !important;
    }

    .steps4 >>> .el-form-item__content::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
        display: inline-block;
        position: absolute;
        left: -8px;
    }

    .steps4 >>> tr > td {
        padding: 0;
    }

    .steps4 >>> .el-input-group__prepend {
        color: #FFF !important;
        background-color: #E6A23C !important;
        border-color: #E6A23C !important;
    }

    .steps4 >>> tr > td > .cell {
        padding: 6px 10px;
    }

    .fdcColor >>> .el-input__inner {
        color: #f19b00;
    }

    #steps6 >>> .el-tag.el-tag--info {
        max-width: 88%;
    }

    #steps6 >>> .el-select__tags-text {
        display: inline-flex;
        overflow: hidden;
        max-width: 90%;
    }

    #steps6 >>> .el-select .el-tag__close.el-icon-close {
        right: -1px !important;
    }
</style>
