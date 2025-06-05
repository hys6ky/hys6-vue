<template>
    <div class="agentdeploy">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-row class='topTitle'>
                <router-link :to="{name: 'dataCollectionO'}">
                    <el-button type="primary" size="small" class="goIndex">
                        <i class="fa fa-home fa-lg"></i>返回首页
                    </el-button>
                </router-link>
            </el-row>
            <el-tab-pane label="部署管理" name="first">
                <el-table
                        :data="sourceData.filter(data => !search || data.datasource_name.toLowerCase().includes(search.toLowerCase()))"
                        max-height="50%" style="width: 100%">
                    <el-table-column label="序号" width="70">
                        <template slot-scope="scope">
                            {{scope.$index + 1}}
                        </template>
                    </el-table-column>
                    <el-table-column sortable prop="datasource_name" label="数据源"></el-table-column>
                    <el-table-column label="数据库 Agent" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.dbflag!=0" size="mini" round type="primary"
                                       @click="deployAgentList(agentTypeData.ShuJuKu, scope.row)">部署
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="数据文件 Agent" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.dfflag!=0" size="mini" round type="primary"
                                       @click="deployAgentList(agentTypeData.DBWenJian, scope.row)">部署
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="非结构化 Agent" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.nonstructflag!=0" size="mini" round type="primary"
                                       @click="deployAgentList(agentTypeData.WenJianXiTong, scope.row)">部署
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="半结构化 Agent" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.halfstructflag!=0" size="mini" round type="primary"
                                       @click="deployAgentList(agentTypeData.DuiXiang, scope.row)">部署
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="Ftp Agent" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.ftpflag!=0" size="mini" round type="primary"
                                       @click="deployAgentList(agentTypeData.FTP, scope.row)">部署
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope" slot="header">
                            <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="状态管理" name="second">
                <el-table
                        :data="tableData.filter(data => !searchAgentName || data.agent_name.toLowerCase().includes(searchAgentName.toLowerCase()))"
                        max-height="50%" style="width: 100%">
                    <el-table-column label="序号" width="70">
                        <template slot-scope="scope">
                            {{scope.$index + 1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="down_id"  label="部署Agent ID"></el-table-column>
                    <el-table-column sortable prop="datasource_name" label="数据源"></el-table-column>
                    <el-table-column sortable prop="agent_ip" label="Agent IP"></el-table-column>
                    <el-table-column sortable prop="agent_port" label="Agent端口"></el-table-column>
                    <el-table-column sortable prop="agent_name" label="Agent名称"></el-table-column>
                    <el-table-column prop="statuszh" label="运行状态"></el-table-column>
                    <el-table-column prop="agent_date" :formatter="dateFormat" label="启动日期"></el-table-column>
                    <el-table-column prop="agent_time" :formatter="timeFormat" label="启动时间"></el-table-column>
                    <el-table-column label="操作" width="300">
                        <template slot-scope="scope">
                            <template v-if="agentStatus.WeiLianJie == scope.row.agent_status">
                                <el-button type="success" round size="mini" @click="startAgent(scope.row)">
                                    <i class="el-icon-video-play"> 启动</i>
                                </el-button>
                            </template>
                            <template v-else-if="agentStatus.YiLianJie == scope.row.agent_status">
                                <el-button type="danger" round size="mini" @click="stopAgent(scope.row)"><i
                                        class="el-icon-video-pause"> 停止</i></el-button>
                                <el-button type="warning" round size="mini" @click="restartAgent(scope.row)"><i
                                        class="el-icon-refresh"> 重启</i></el-button>
                            </template>
                        </template>
                        <template slot-scope="scope" slot="header">
                            <el-input v-model="searchAgentName" size="mini" placeholder="输入关键字搜索"/>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!--Agent信息列表模态框-->
        <el-dialog :title="datasource_name" :visible.sync="outerVisible" width="75%">
            <el-table
                    :data="agentDataList.filter(data => !agentSearch || data.agent_name.toLowerCase().includes(agentSearch.toLowerCase()))"
                    :default-sort="{prop: 'agent_name', order: 'descending'}">
                <el-table-column sortable property="agent_name" label="Agent名称"></el-table-column>
                <el-table-column sortable property="agent_ip" label="Agent IP"></el-table-column>
                <el-table-column sortable property="agent_port" label="Agent 端口"></el-table-column>
                <el-table-column label="连接状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.agent_status === '1' ? 'success' : 'danger'" disable-transitions>
                            {{scope.row.connection_status}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column property="agent_zh_name" label="采集类型"></el-table-column>
                <el-table-column label="操作">
                    <template fixed slot-scope="scope">
                        <el-button type="success" size="mini" @click="dialogFormVisible = true;handleEdit(scope.row)"><i
                                class="el-icon-download">配置及部署</i></el-button>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope" slot="header">
                        <el-input v-model="agentSearch" size="mini" placeholder="输入关键字搜索"/>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" size="mini" @click="outerVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!--部署Agent模态框 agentDeploy-->
        <el-dialog :title="deployAgentName" :visible.sync="dialogFormVisible" width="75%">
            <el-form :model="agentDeploy" status-icon ref="agentDeploy" label-width="120px">
                <input type="hidden" v-model="agentDeploy.down_id" value="">
                <!-- <input type="hidden" name="oldAgentDir" value="{{agentDeploy.save_dir}}">
                <input type="hidden" name="oldLogPath" value="{{agentDeploy.log_dir}}"> -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="部署名称">
                            <el-input v-model="agentDeploy.agent_name" placeholder="Agent名称" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Agent IP">
                            <el-input v-model="agentDeploy.agent_ip" placeholder="Agent IP" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Agent端口">
                            <el-input v-model="agentDeploy.agent_port" placeholder="Agent端口" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="用户名" prop="user_name" :rules="rule.default">
                            <el-input v-model="agentDeploy.user_name" placeholder="用户名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="密码" prop="passwd" :rules="rule.default">
                            <el-input v-model="agentDeploy.passwd" show-password placeholder="密码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否启动">
                            <el-switch :active-value="isflag.Shi" :inactive-value="isflag.Fou" v-model="deploy"
                                       active-color="#13ce66" inactive-color="#ff4949" active-text="是"
                                       inactive-text="否">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>

                    <el-col :span="8" v-show="false">
                        <el-form-item label="context" prop="agent_context"
                                      :rules="filter_rules([{required:true,dataType:'webContext'}])">
                            <el-input v-model="agentDeploy.agent_context" placeholder="agent的context"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-show="false">
                        <el-form-item label="访问路径" prop="agent_pattern"
                                      :rules="filter_rules([{required:true,dataType:'agent_pattern'}])">
                            <el-input v-model="agentDeploy.agent_pattern" placeholder="agent的访问路径"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="存放目录">
                            <el-switch :active-value="isflag.Shi" :inactive-value="isflag.Fou" v-model="customPath"
                                       active-color="#13ce66" inactive-color="#ff4949" active-text="自定义"
                                       inactive-text="系统默认">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <template v-if="customPath==isflag.Shi">
                        <el-col :span="8">
                            <el-form-item label="安装目录" prop="save_dir" :rules="rule.default">
                                <el-input v-model="agentDeploy.save_dir" hide-required-asterisk="true"
                                          placeholder="Agent安装目录"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="日志文件" prop="log_dir" :rules="rule.default">
                                <el-input v-model="agentDeploy.log_dir" hide-required-asterisk="true"
                                          placeholder="日志文件"></el-input>
                            </el-form-item>
                        </el-col>
                    </template>
                    <el-col :span="8">
                        <el-form-item label="批量提交行数" prop="remark"
                                      :rules="filter_rules([{required:true,dataType:'number'}])">
                            <el-input v-model="agentDeploy.remark" placeholder="数据库采集时,使用的批量提交行数"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label="描述">
                            <el-input type="textarea" v-model="agentDeploy.remark" placeholder="描述"></el-input>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <el-row>

                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" size="mini" @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" size="mini" @click="saveAgentDeploy('agentDeploy')">部 署</el-button>
                <el-button type="success" size="mini" @click="downloadAgentConf">下载配置</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import * as validator from '@/utils/validator'
    import {execDownloadFileByMenuUrl} from "@/utils/executeRequest";

    export default {
        data() {
            return {
                activeName: 'first',
                tableData: [],
                searchAgentName: "",
                agentStatus: {},
                sourceData: [],
                agentDataList: [], //Agent信息列表
                agentTypeData: {}, //Agent类型代码项
                isflag: {}, // 是否的代码项
                agentDeploy: {}, //部署Agent信息
                oldAgentDir: '',
                oldLogPath: '',
                rule: validator.default,
                search: "",
                agentSearch: "",
                datasource_name: '',
                customPath: '0',
                deploy: '',
                deployAgentName: '',
                outerVisible: false,
                dialogFormVisible: false,
                requestData: {
                    agent_type: '',
                    source_id: ''
                },
                timerObj: null,
            }
        },
        mounted() {
            this.$executeRequest.execByControllerMappingName("/getDataSourceInfo", null).then(res => {
                if (res.success) {
                    this.sourceData = res.data;
                }
            })

            /** 获取Agent类型的代码项 */
            this.$Code.getCodeItems({
                'category': 'AgentType'
            }).then(res => {
                if (res.success) {
                    this.agentTypeData = res.data;
                }
            })

            this.$Code.getCodeItems({
                'category': 'AgentStatus'
            }).then(res => {
                if (res.success) {
                    this.agentStatus = res.data;
                }
            })

            /** 获取是否类型的代码项 */
            this.$Code.getCodeItems({
                'category': 'IsFlag'
            }).then(res => {
                if (res.success) {
                    this.isflag = res.data;
                }
            })

        },
        methods: {
            // 下载配置文件
            downloadAgentConf() {
                if (this.agentDeploy.down_id === undefined || this.agentDeploy.down_id === '') {
                    this.$Msg.customizTitle("agent还未部署，请部署后下载", "warning")
                    return;
                }
                this.$executeRequest.execByControllerMappingName("/downloadAgentConf", {
                    down_id: this.agentDeploy.down_id
                }).then(res => {
                    if (res && res.success) {
                        let fileName = res.data;
                        this.$executeRequest.execDownloadFileByMenuUrl("/agentdeploy/downloadFile", {
                            fileName: fileName
                        }).then(res => {
                            this.$FileOperations.fileDownload(res, fileName);
                        });
                    }
                })
            },
            /**
             * 当前数据源需要部署的Agent列表信息
             * @param agent_type Agent类型
             * @row 当前行的数据
             */
            deployAgentList(agent_type, row) {
                this.agentSearch = '';
                this.datasource_name = '数据源名称 : ' + row.datasource_name;
                row['agent_type'] = agent_type;
                this.$executeRequest.execByControllerMappingName("/getAgentInfo", row).then(res => {
                    //agentDeployFun.deployAgentList(row).then(res => {
                    if (res.success) {
                        this.agentDataList = res.data;
                        this.outerVisible = true;
                    }
                })

            },
            handleEdit(row) {
                this.deployAgentName = 'Agent部署 : ' + row.agent_name;
                this.customPath = this.isflag.Fou;
                this.$executeRequest.execByControllerMappingName("/getAgentDownInfo", row).then(res => {
                    //agentDeployFun.getAgentDownInfo(row).then(res => {
                    if (res.success) {
                        this.agentDeploy = res.data;
                        if (typeof this.agentDeploy.down_id == 'undefined') {
                            this.agentDeploy.agent_type = row.agent_type;
                            this.agentDeploy.agent_id = row.agent_id;
                            this.agentDeploy.user_id = row.user_id;
                            this.agentDeploy.agent_name = row.agent_name;
                            this.agentDeploy.agent_ip = row.agent_ip;
                            this.agentDeploy.agent_port = row.agent_port;
                            this.deploy = this.isflag.Fou;
                            this.oldAgentDir = row.save_dir;
                            this.oldLogPath = row.log_dir;
                            this.agentDeploy.agent_context = '/agent'
                            this.agentDeploy.agent_pattern = `/${row.agent_port}/*`
                        } else {
                            /* 这里将路径和系统参数中的路径做个对比,如果相同则将存放目录切换到系统默认 */
                            if (this.agentDeploy.save_dir !== this.agentDeploy.agentDeployPath) {
                                this.customPath = this.isflag.Shi;
                            } else {
                                this.customPath = this.isflag.Fou;
                            }
                            this.deploy = this.agentDeploy.deploy;
                            this.oldAgentDir = this.agentDeploy.save_dir;
                            this.oldLogPath = this.agentDeploy.log_dir;
                        }
                        this.$refs['agentDeploy'].resetFields();
                    }
                })
            },
            saveAgentDeploy(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.agentDeploy['customPath'] = this.customPath;
                        this.agentDeploy['deploy'] = this.deploy;
                        this.agentDeploy['oldAgentDir'] = this.oldAgentDir;
                        this.agentDeploy['oldLogPath'] = this.oldLogPath;
                        this.$executeRequest.execByControllerMappingName("/saveAgentDownInfo", this.agentDeploy).then(res => {
                            //agentDeployFun.saveAgentDownInfo(this.agentDeploy).then(res => {
                            if (typeof res != 'undefined' && res.success) {
                                this.$Msg.customizTitle("部署完成");
                                this.dialogFormVisible = false;
                            }
                        })
                    }
                })
            },
            handleClick(tab, event) {
                // 获取作业Agent所在机器的资源信息
                if (this.activeName == 'second') {
                    this.agentInfo();
                    this.searchAgentName = "";
                }
            },
            agentInfo() {
                this.$executeRequest.execByControllerMappingName("/agentstatus/agentInfo", null).then(res => {
                    if (res.success) {
                        this.tableData = res.data
                    }
                })
            },
            stopAgent(row) {
                // 停止Agent
                this.$executeRequest.execByControllerMappingName("/agentstatus/stopAgent", row).then(res => {
                    if (res.success) {
                        this.$Msg.customizTitle("停止成功")
                        this.reloadData()
                    }
                })
            },
            startAgent(row) {
                // 启动Agent
                this.$executeRequest.execByControllerMappingName("/agentstatus/startAgent", row).then(res => {
                    if (res.success) {
                        this.$Msg.customizTitle("启动成功")
                        this.reloadData()
                    }
                })
            },
            restartAgent(row) {
                // 重启Agent
                this.$executeRequest.execByControllerMappingName("/agentstatus/restartAgent", row).then(res => {
                    if (res.success) {
                        this.$Msg.customizTitle("重启成功")
                        this.reloadData()
                    }
                })
            },
            // 日期格式化
            dateFormat(data) {
                const agentDate = data.agent_date;
                if (agentDate) {
                    return this.$Date.dateFormat(data.agent_date)
                }
            },
            // 时间格式化
            timeFormat(data) {
                const agentTime = data.agent_time;
                if (agentTime) {
                    return this.$Date.hourFormat(agentTime)
                }
            },
            reloadData() {

                if (this.timerObj) {
                    clearInterval(this.timerObj)
                }
                this.timerObj = setInterval(() => {
                    this.agentInfo()
                }, 3000);
            }
        },
        destroyed() {
            if (this.timerObj) {
                clearInterval(this.timerObj)
            }
        }
    }
</script>

<style scoped>
    /* 搜索框样式 */
    .agentdeploy >>> .el-table th {
        padding: 0;
    }
</style>
