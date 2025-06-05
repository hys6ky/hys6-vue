<template>
  <div id="realtimeCollection">
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="Agent列表">
        <el-row class="topTitle">
          <span class='el-icon-location'>实时Agent列表</span>
        </el-row>
        <el-table stripe :data="sourceData" border size="medium">
          <el-table-column prop="datasource_name" label="数据源" show-overflow-tooltip width="300"
                           align="center"></el-table-column>
          <el-table-column label="数据消息流Agent" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.restflag!=0" size="mini" type="primary"
                         @click="deployAgentList(agentTypeData.XiaoXiLiu, scope.row)">部署
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="文件内容流Agent" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.fileflag!=0" size="mini" type="primary"
                         @click="deployAgentList(agentTypeData.WenBenLiu, scope.row)">部署
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--     Agent信息列表模态框   -->
        <el-dialog :title="sdm_source_name" :visible.sync="outerVisible" width="75%">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">{{ sdm_source_name }}</span>
          </div>
          <el-table stripe :data="agentDataList" border size="medium">
            <el-table-column property="agent_name" label="Agent名称" align="center"></el-table-column>
            <el-table-column property="agent_ip" label="Agent IP" align="center"></el-table-column>
            <el-table-column property="agent_port" label="Agent 端口" align="center"></el-table-column>
            <el-table-column property="agent_zh_name" label="Agent 类型" align="center"></el-table-column>
            <el-table-column label="Agent 连接状态" align="center" width='150px'>
              <template slot-scope="scope">
                <el-tag :type="scope.row.agent_status === '1' ? 'success' : 'danger'" disable-transitions>
                  {{ scope.row.connection_status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template fixed slot-scope="scope">
                <el-button type="success" size="mini" @click="dialogFormVisible = true;handleEdit(scope.row)">
                  配置及部署
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" size="mini" @click="outerVisible = false">取 消</el-button>
          </div>
        </el-dialog>
        <!--   部署Agent模态框  -->
        <el-dialog :title="deployAgentName" :visible.sync="dialogFormVisible" width="900px">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">{{ deployAgentName }}</span>
          </div>
          <el-form :model="agentDeploy" status-icon ref="agentDeploy" label-width="120px">
            <input type="hidden" v-model="agentDeploy.down_id" value="">
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
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="是否启动">
                  <el-switch :active-value="isflag.Shi" :inactive-value="isflag.Fou" v-model="deploy"
                             active-color="#13ce66"
                             inactive-color="#ff4949" active-text="是" inactive-text="否">
                  </el-switch>
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
            </el-row>
            <el-row>
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
              <el-col :span="16">
                <el-form-item label="描述">
                  <el-input type="textarea" v-model="agentDeploy.remark" placeholder="描述"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" size="mini" @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" size="mini" :loading="loading" @click="saveSdmAgentDownInfo('agentDeploy')">部 署
            </el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane label="任务配置">
        <el-row class='topTitle'>
          <span class='el-icon-location'>实时任务配置</span>
        </el-row>
        <el-table size="medium" :data="sourceDataTwo" border stripe>
          <el-table-column prop="datasource_name" label="数据源" show-overflow-tooltip width="300"
                           align="center"></el-table-column>
          <el-table-column label="数据消息流Agent" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.restflag!=0" size="mini" type="success"
                         @click="deployAgentListTwo(agentTypeDataTwo.XiaoXiLiu, scope.row)">任务配置
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="文件内容流Agent" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.fileflag!=0" size="mini" type="success"
                         @click="deployAgentListTwo(agentTypeDataTwo.WenBenLiu, scope.row)">任务配置
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--                                   Agent信息列表模态框                              -->
        <el-dialog :title="sdm_source_name" :visible.sync="outerVisibleTwo" width="65%" class="taskEx">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">{{ sdm_source_name }}</span>
          </div>
          <el-table :data="agentDataListTwo" border stripe size="medium">
            <el-table-column property="agent_name" label="Agent名称" align="center"></el-table-column>
            <el-table-column property="agent_ip" label="Agent IP" align="center"></el-table-column>
            <el-table-column property="agent_port" label="Agent 端口" align="center"></el-table-column>
            <el-table-column property="agent_zh_name" label="Agent 类型" align="center"></el-table-column>
            <el-table-column label="Agent 连接状态" align="center" width='150px'>
              <template slot-scope="scope">
                <el-tag :type="scope.row.agent_status === '1' ? 'success' : 'danger'" disable-transitions>
                  {{ scope.row.connection_status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="350">
              <template fixed slot-scope="scope">
                <el-button v-if="scope.row.agent_type=='6'" type="success" size="mini"
                           @click="addFileTaskTwo(scope.row,'create')"><i class="el-icon-circle-plus-outline">
                  添加文件内容流采集任务</i>
                </el-button>
                <el-button v-if="scope.row.agent_type=='7'" type="success" size="mini"
                           @click="addFileTaskTwo(scope.row,'create')"><i class="el-icon-circle-plus-outline">
                  添加数据消息流采集任务</i>
                </el-button>
                <el-button type="primary" size="mini" @click="taskManageTwo(scope.row)">
                  <i class="el-icon-s-cooperation"> 任务管理</i>
                </el-button>
                <el-tooltip v-if="scope.row.agent_type=='7'" class="item" effect="dark"
                            content="消息流使用方法:页面点击发送,接着使用URL(例: http://服务ip:接收数据流端口/FILEAGNETFIL/hrds/agent/trans/biz/systemfile/getSystemFileInfo?A=A)发送数据"
                            placement="right">
                  <i class="el-icon-info" aria-hidden="true" style="margin-left: 4px;"></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" size="small" @click="outerVisibleTwo = false">取 消</el-button>
            <el-button type="primary" @click="outerVisibleTwo = false" size="small">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="taskManageDialog" title="Agent参数配置管理" width="70%" class="taskEx">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">Agent参数配置管理</span>
          </div>
          <el-table :data="taskManageTableDate" border stripe size="medium">
            <el-table-column prop="sdm_receive_name" label="任务名称" align="center" width="140px"></el-table-column>
            <el-table-column prop="sdm_receive_id" label="任务id" align="center" min-width="85px"></el-table-column>
            <el-table-column prop="sdm_agent_name" label="Agent名称" align="center"></el-table-column>
            <el-table-column prop="agent_zh_name" label="Agent类型" align="center"></el-table-column>
            <el-table-column prop="create_date" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="sdm_receive_id" label="操作" align="center" width="180px">
              <template scope="scope">
                <el-button type="text" @click="addFileTaskTwo(scope.row,'edit')" class='editcolor'>编辑</el-button>
                <el-button type="text" @click="deleteWenBenTaskTwo(scope.row)" class="delcolor">删除</el-button>
                <el-button type="text" @click="sendWenBenTaskTwo(scope.row)" class="sendcolor">发送</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="taskManageDialog = false" type="danger" size="medium">关闭</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane label="数据分发">
        <el-row class="topTitle">
          <span class='el-icon-location' style="color: #2196f3;font-size: 18px;">实时数据分发</span>
          <router-link :to="{name:'consumptionList'}">
            <el-button type="primary" size="small" class="goIndex">查看消费列表</el-button>
          </router-link>
        </el-row>
        <div class="lines"></div>
        <div class="tableBlock">
          <el-table size="medium" stripe :data="tableData" :header-cell-style="{ textAlign: 'center' }"
                    :cell-style="{ 'text-align': 'center'}">
            <el-table-column label="序号" width="80" type="index"></el-table-column>
            <el-table-column label="消息主题" prop="sdm_top_name"></el-table-column>
            <el-table-column label="生产端任务" prop="sdm_receive_name"></el-table-column>
            <el-table-column label="生产端Agent" prop="agent_name"></el-table-column>
            <el-table-column label="生产端数据源" prop="datasource_name"></el-table-column>
            <el-table-column label="生产用户" prop="user_id"></el-table-column>
            <el-table-column label="状态" prop="application_status"></el-table-column>
            <el-table-column label="操作" width="350px">
              <template scope="scope">
                <el-button type="text" @click="cancelApplicantion(scope.row)"
                           v-if="scope.row.application_status=='申请中'||tableData.application_status=='申请不通过'"
                           style="color:green">取消申请
                </el-button>
                <el-button type="text" @click="againApplicantion(scope.row)"
                           v-if="scope.row.application_status=='申请不通过'">再次申请
                </el-button>
                <el-button type="text" @click="applyConsume(scope.row)" v-if="scope.row.application_status=='未申请'"
                           style="color:green">申请消费
                </el-button>
                <el-button type="text" @click="checkDataStructure(scope.row)">查看生产端数据结构</el-button>
                <el-button type="text" @click="getDataPreview(scope.row)">数据预览</el-button>
                <el-button type="text" @click="consumerTopic(scope.row)" v-if="scope.row.application_status=='申请通过'"
                           style="color:green">添加消费
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-dialog :visible.sync="dataStructureDialog" title="生产端数据结构" width="1000px">
            <div slot="title">
              <span class="dialogtitle el-icon-caret-right">生产端数据结构</span>
            </div>
            <div>
              <el-table :data="dataStructureTable" stripe size="medium" height="400px" style="overflow:auto"
                        :cell-style="{'text-align':'center'}" :header-cell-style="{ textAlign: 'center' }">
                <el-table-column label="序号" prop="num"></el-table-column>
                <el-table-column label="变量名" prop="sdm_var_name_en"></el-table-column>
                <el-table-column label="变量中文名" prop="sdm_var_name_cn"></el-table-column>
                <el-table-column label="变量类型" prop="sdm_var_type"></el-table-column>
                <el-table-column label="描述" prop="sdm_describe"></el-table-column>
                <el-table-column label="是否发送" prop="sdm_is_send"></el-table-column>
              </el-table>
            </div>
            <div class="pagination">
              <el-pagination @current-change="handleCurrentDataChangeList" :current-page="currDataPage"
                             @size-change="handleSizeDataChange" :page-sizes="[5, 10, 20,50]" :page-size="pageDataSize"
                             layout=" total,sizes,prev, pager, next,jumper" :total="totalDataSize"
                             class='locationcenter'/>
            </div>
            <span slot="footer">
                <el-button @click="dataStructureDialog = false" type="danger" size="small">关闭</el-button>
            </span>
          </el-dialog>
          <el-dialog :visible.sync="dataPreView" title="数据预览" width="1000px">
            <el-table :data="dataPreViewTableData"
                      height="450"
                      stripe
                      border
                      size="medium"
                      :header-cell-style="thStyleFun"
                      :cell-style="cellStyleFun">
              <template v-for="(index,column) in dataPreViewTableData[0]">
                <el-table-column :key="column" :label="column" :prop="column">
                  <template slot-scope="scope">{{
                      scope.row[scope.column.property]
                    }}
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </el-dialog>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";

export default {
  data() {
    return {
      tabPosition: 'left',
      agentnum: 0,
      sourcenum: 0,

      sourceData: [],
      agentDataList: [], //Agent信息列表
      agentTypeData: {}, //Agent类型代码项
      isflag: {}, // 是否的代码项
      agentDeploy: {}, //部署Agent信息
      oldAgentDir: "",
      oldLogPath: "",
      rule: validator.default,
      search: "",
      agentSearch: "",
      sdm_source_name: "",
      sdm_agent_name: "",
      customPath: '0',
      deploy: "",
      deployAgentName: "",
      outerVisible: false,
      dialogFormVisible: false,
      sdm_agent_type: "",
      loading: false,


      sourceDataTwo: [],
      agentDataListTwo: {}, //Agent信息列表
      agentTypeDataTwo: {}, //Agent类型代码项
      isflagTwo: {}, // 是否的代码项
      outerVisibleTwo: false,
      taskManageDialog: false,
      taskManageTableDate: [],


      dataStructureDialog: false,
      dataPreView: false,
      currDataPage: 1,
      pageDataSize: 10,
      totalDataSize: 0,
      dataStructureTable: [],
      tableData: [],
      sdm_receive_id: '',
      dataPreViewTableData: [],
    };
  },
  created() {
    this.getAgentNumAndSourceNum();
    this.getTableData();
    if (this.dataPreViewTableData.length > 0) {
      // 获取第一个对象的属性作为表头列
      this.tableColumns = Object.keys(this.dataPreViewTableData[0]).map(key => {
        return {key: key, label: key};
      });
    }
  },
  mounted() {
    this.getSdmDataSourceInfo();
    /** 获取Agent类型的代码项 */
    this.$Code.getCodeItems({
      'category': 'AgentType'
    }).then(res => {
      this.agentTypeData = res.data;
      this.agentTypeDataTwo = res.data;
    })
    /** 获取是否类型的代码项 */
    this.$Code.getCodeItems({
      'category': 'IsFlag'
    }).then(res => {
      this.isflag = res.data;
      this.isflagTwo = res.data;
    })
    this.getSdmDataSourceInfoTwo();
  },
  methods: {
    // 查询数据源信息及其对应的agent个数
    getAgentNumAndSourceNum() {
      this.$executeRequest.execPostByModuleUrl('/dataCollectionO/agentdeploy/getAgentNumAndSourceNum', {}).then((res) => {
        if (res && res.success) {
          this.agentnum = res.data.agentnum;
          this.sourcenum = res.data.sourcenum;
        }
      });
    },


    // 查询数据源信息及其对应的agent个数
    getSdmDataSourceInfo() {
      this.$executeRequest.execPostByModuleUrl('/dataCollectionO/agentdeploy/getSdmDataSourceInfo', {}).then((res) => {
        if (res && res.success) {
          this.sourceData = res.data;
        }
      })
    },
    // 当前数据源需要部署的Agent列表信息
    deployAgentList(sdm_agent_type, row) {
      this.sdm_source_name = '数据源名称 : ' + row.datasource_name;
      row['sdm_agent_type'] = sdm_agent_type;
      window.rowValue = row,
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/agentdeploy/getSdmAgentInfo', row).then(res => {
            this.agentDataList = res.data;
            this.outerVisible = true;
          })
    },
    handleEdit(row) {
      this.deployAgentName = 'Agent部署 : ' + row.agent_name;
      this.sdm_agent_name = row.agent_name;
      this.customPath = this.isflag.Fou;
      var data = {agent_id: row.agent_id}
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/agentdeploy/getSdmAgentDownInfo', data).then(res => {
        this.agentDeploy = res.data;
        if (typeof this.agentDeploy.down_id == 'undefined') {
          this.agentDeploy.agent_type = row.sdm_agent_type;
          this.agentDeploy.agent_id = row.sdm_agent_id;
          this.agentDeploy.user_id = row.user_id;
          this.agentDeploy.agent_name = row.sdm_agent_name;
          this.agentDeploy.agent_ip = row.sdm_agent_ip;
          this.agentDeploy.agent_port = row.sdm_agent_port;
          this.deploy = this.isflag.Fou;
          this.oldAgentDir = row.save_dir;
          this.oldLogPath = row.log_dir;
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

      })
    },
    saveSdmAgentDownInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.agentDeploy['customPath'] = this.customPath;
          this.agentDeploy['deploy'] = this.deploy;
          this.agentDeploy['oldAgentDir'] = this.oldAgentDir;
          this.agentDeploy['oldLogPath'] = this.oldLogPath;
          if (!this.agentDeploy.down_id) {
            this.$executeRequest.execPostByModuleUrl('/dataCollectionO/agentdeploy/saveSdmAgentDownInfo', this.agentDeploy).then(res => {
              if (typeof res != 'undefined' && res.success) {
                this.$Msg.customizTitle("部署完成");
                this.dialogFormVisible = false;
                this.loading = false;
              } else {
                this.loading = false;
              }
              this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/agentdeploy/getSdmAgentInfo', rowValue).then(res => {
                this.agentDataList = res.data;
                this.outerVisible = true;
              })
            })
          } else {
            this.$executeRequest.execPostByModuleUrl('/dataCollectionO/agentdeploy/updateSdmAgentDownInfo', this.agentDeploy).then(res => {
              if (typeof res != 'undefined' && res.success) {
                this.$Msg.customizTitle("部署完成");
                this.dialogFormVisible = false;
                this.loading = false;
              } else {
                this.loading = false;
              }
              this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/agentdeploy/getSdmAgentInfo', rowValue).then(res => {
                    this.agentDataList = res.data;
                  },
                  this.outerVisible = true
              )
            })
          }
        } else {
          this.loading = false;
          return;
        }
      })
    },
    // 查询数据源信息及其对应的agent个数
    getSdmDataSourceInfoTwo() {
      this.$executeRequest.execPostByModuleUrl('/dataCollectionO/agentdeploy/getSdmDataSourceInfo', {}).then((res) => {
        if (res && res.success) {
          this.sourceDataTwo = res.data;
        }
      })
    },
    // 当前数据源需要部署的Agent列表信息
    deployAgentListTwo(sdm_agent_type, row) {
      this.sdm_source_name = '数据源名称 : ' + row.sdm_source_name;
      row['sdm_agent_type'] = sdm_agent_type;
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/agentdeploy/getSdmAgentInfo', row).then(res => {
        this.agentDataListTwo = res.data;
        this.outerVisibleTwo = true;
      })
    },
    //添加任务
    addFileTaskTwo(data, type) {
      let realPath = ''
      if (data.sdm_agent_type === '6' || data.agent_type === '6') {
        realPath = "setWenBenTask"
      } else {
        realPath = "setRestTask"
      }
      this.$router.push({
        name: realPath,
        query: {
          sdm_source_id: data.sdm_source_id,
          sdm_agent_type: data.sdm_agent_type,
          sdm_agent_id: data.sdm_agent_id,
          sdm_receive_id: data.sdm_receive_id,
          sdm_agent_ip: data.sdm_agent_ip,
          type: type,
        },
      });
    },
    //任务管理弹窗数据获取
    taskManageTwo(data) {
      console.log(data,'这是数组还是对象')
      this.taskManageDialog = true;
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/selectTaskManage', {
        sdm_agent_id: data.sdm_agent_id,
      }).then((res) => {
        this.taskManageTableDate = res.data.map((item) => {
          item.sdm_agent_name = data.agent_name;
          item.agent_zh_name = data.agent_zh_name
          item.create_date = this.$Date.dateFormat(item.create_date)
          item.sdm_agent_type = data.agent_type
          item.sdm_source_id = data.source_id
          item.sdm_agent_ip = data.agent_ip
          return item
        })
      })

    },
    //删除任务管理弹窗中的任务
    deleteWenBenTaskTwo(data) {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/deleteWenBenTask', {
        sdm_receive_id: data.sdm_receive_id
      }).then((res) => {
        if (res.success == true) {
          this.taskManageDialog = false
          this.$Msg.deleteSuccess(res)
        }
      })
    },
    //发送任务管理弹窗中的任务
    sendWenBenTaskTwo(data) {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/sendWenBenTask', {
        sdm_receive_id: data.sdm_receive_id
      }).then((res) => {
        if (res.success == true) {
          this.taskManageDialog = false
          this.$Msg.customizTitle('发送成功', 'success')

        }
      })
    },


    //表头居中
    thStyleFun() {
      return "text-align:center";
    },
    //数据居中
    cellStyleFun() {
      return "text-align:center";
    },
    //获取页面列表数据
    getTableData() {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/getConsumerTopicList').then((res) => {
        this.tableData = res.data.map((item) => {
          let result = JSON.parse(item)
          item.split(',').map((ele) => {
            if (ele.indexOf('sdm_receive_id') != -1) {
              result.sdm_receive_id = ele.split(':')[1]
            }
            if (ele.indexOf('topic_id') != -1) {
              result.topic_id = ele.split(':')[1]
            }
            if (ele.indexOf('app_id') != -1) {
              result.app_id = ele.split(':')[1]
            }
          })
          return result
        });
      })
    },
    //再次申请
    againApplicantion(data) {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/againApplicantion', {
        app_id: data.app_id
      }).then((res) => {
        this.getTableData()
      })
    },
    //取消申请
    cancelApplicantion(data) {
      this.$Msg.confirmMsg('确定取消申请？').then(() => {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/cancelApplicantion', {
          app_id: data.app_id
        }).then((res) => {
          this.$Msg.customizTitle('取消申请成功！', 'success')
          this.getTableData()
        })
      })

    },
    //消费
    consumerTopic(data) {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumerTopic', {
        topic_id: data.topic_id,
      }).then((res) => {
        if (res.success == true) {
          res.data.type = 'create'
          this.$router.push({
            name: 'consumptionDataConfig',
            query: res.data
          })
        }
      })
    },
    //申请消费
    applyConsume(data) {
      if (data.sdm_receive_name == undefined) {
        this.$Msg.customizTitle('请创建生产端任务！', 'warning');
      } else {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/applyConsume', {
          topic_id: data.topic_id,
          sdm_receive_id: data.sdm_receive_id,
          user_id: data.user_id
        }).then((res) => {
          if (res.success) {
            this.$Msg.customizTitle('申请成功！', 'success')
            this.getTableData()
          }
        })
      }

    },
    //数据预览
    getDataPreview(data) {
      if (data.sdm_receive_id == undefined) {
        this.$Msg.customizTitle('暂未配置！', 'warning')
      } else {
        this.dataPreView = true
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/getDataPreview', {
          sdm_receive_id: data.sdm_receive_id
        }).then((res) => {
          if (res && res.success) {
            this.dataPreViewTableData = res.data.data
          }
        })
      }
    },
    //查看消费数据结构
    checkDataStructure(data) {
      this.sdm_receive_id = data.sdm_receive_id;
      if (data.sdm_receive_id == undefined) {
        this.$Msg.customizTitle('暂未配置！', 'warning')
      } else {
        this.dataStructureDialog = true
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/getTopicMessInfo', {
          sdm_receive_id: data.sdm_receive_id,
          currPage: this.currDataPage,
          pageSize: this.pageDataSize,
        }).then((res) => {
          this.totalDataSize = res.data.totalSize
          this.dataStructureTable = res.data.messInfoList
        })
      }
    },
    //表数据实现分页功能
    handleCurrentDataChangeList(currPage) {
      //把val赋给当前页面
      this.currDataPage = currPage;
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/getTopicMessInfo', {
        sdm_receive_id: this.sdm_receive_id,
        currPage: this.currDataPage,
        pageSize: this.pageDataSize,
      }).then((res) => {
        this.totalDataSize = res.data.totalSize
        this.dataStructureTable = res.data.messInfoList
      })
    },
    // 改变表数据每页显示条数
    handleSizeDataChange(pageSize) {
      this.pageDataSize = pageSize;
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/getTopicMessInfo', {
        sdm_receive_id: this.sdm_receive_id,
        currPage: this.currDataPage,
        pageSize: this.pageDataSize,
      }).then((res) => {
        this.totalDataSize = res.data.totalSize
        this.dataStructureTable = res.data.messInfoList
      })
    },
  },
};
</script>

<style scoped>

</style>