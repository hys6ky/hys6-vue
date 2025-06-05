<template>
  <div>
    <el-row class='topTitle'>
      <span class='el-icon-location'>数据源Agent列表</span>
      <router-link :to="{name:'realtimeCollection'}">
        <el-button type="primary" size="small" class="goIndex">
          <i class="el-icon-s-home" style="font-size: 14px"></i>返回首页
        </el-button>
      </router-link>
    </el-row>
    <el-table stripe :data="sourceData" border size="medium">
      <el-table-column prop="sdm_source_name" label="数据源" show-overflow-tooltip width="300"
                       align="center"></el-table-column>
      <el-table-column label="数据消息流Agent" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.restflag!=0" size="mini" type="primary"
                     @click="deployAgentList(agentTypeData.RestJieShou, scope.row)">部署
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
        <el-table-column property="sdm_agent_name" label="Agent名称" align="center"></el-table-column>
        <el-table-column property="sdm_agent_ip" label="Agent IP" align="center"></el-table-column>
        <el-table-column property="sdm_agent_port" label="Agent 端口" align="center"></el-table-column>
        <el-table-column property="agent_zh_name" label="Agent 类型" align="center"></el-table-column>
        <el-table-column label="Agent 连接状态" align="center" width='150px'>
          <template slot-scope="scope">
            <el-tag :type="scope.row.sdm_agent_status === '1' ? 'success' : 'danger'" disable-transitions>
              {{ scope.row.connection_status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template fixed slot-scope="scope">
            <el-button type="success" size="mini" @click="dialogFormVisible = true;handleEdit(scope.row)">配置及部署</el-button>
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
            <el-form-item label="Agent IP" >
              <el-input v-model="agentDeploy.agent_ip" placeholder="Agent IP" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Agent端口" >
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
<!--          <el-col :span="8">-->
<!--            <el-form-item label="context" prop="agent_context"-->
<!--                          :rules="filter_rules([{required:true,dataType:'webContext'}])">-->
<!--              <el-input v-model="agentDeploy.agent_context" placeholder="agent的context"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="8">-->
<!--            <el-form-item label="访问路径" prop="agent_pattern"-->
<!--                          :rules="filter_rules([{required:true,dataType:'agent_pattern'}])">-->
<!--              <el-input v-model="agentDeploy.agent_pattern" placeholder="agent的访问路径"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="8">
            <el-form-item label="是否启动">
              <el-switch :active-value="isflag.Shi" :inactive-value="isflag.Fou" v-model="deploy" active-color="#13ce66"
                         inactive-color="#ff4949" active-text="是" inactive-text="否">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="存放目录">
              <el-switch :active-value="isflag.Shi" :inactive-value="isflag.Fou" v-model="customPath"
                         active-color="#13ce66" inactive-color="#ff4949" active-text="自定义" inactive-text="系统默认">
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
                <el-input v-model="agentDeploy.log_dir" hide-required-asterisk="true" placeholder="日志文件"></el-input>
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
  </div>
</template>

<script>
import * as validator from "@/utils/validator";

export default {
  data() {
    return {
      sourceData: [],
      agentDataList: [], //Agent信息列表
      agentTypeData: {}, //Agent类型代码项
      isflag: {}, // 是否的代码项
      agentDeploy: {}, //部署Agent信息
      oldAgentDir: "",
      oldLogPath: "",
      rule: validator.default,
      sdm_source_name: "",
      sdm_agent_name: "",
      customPath: '0',
      deploy: "",
      deployAgentName: "",
      outerVisible: false,
      dialogFormVisible: false,
      sdm_agent_type: "",
      loading: false
    }
  },
  mounted() {
    this.getSdmDataSourceInfo();
    /** 获取Agent类型的代码项 */
    this.$Code.getCodeItems({
      'category': 'AgentType'
    }).then(res => {
      this.agentTypeData = res.data;
    })
    /** 获取是否类型的代码项 */
    this.$Code.getCodeItems({
      'category': 'IsFlag'
    }).then(res => {
      this.isflag = res.data;
    })
  },

  methods: {
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
      this.sdm_source_name = '数据源名称 : ' + row.sdm_source_name;
      row['sdm_agent_type'] = sdm_agent_type;
      window.rowValue = row,
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/agentdeploy/getSdmAgentInfo', row).then(res => {
            this.agentDataList = res.data;
            this.outerVisible = true;
          })
    },
    handleEdit(row) {
      this.deployAgentName = 'Agent部署 : ' + row.sdm_agent_name;
      this.sdm_agent_name = row.sdm_agent_name;
      this.customPath = this.isflag.Fou;
      var data = {agent_id: row.sdm_agent_id}
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
    }
  }
}
</script>

<style scoped>
.bg-purple {
  background: #108516;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.cccc >>> .el-badge__content--success {
  background-color: #19d4ae;
}

.cccc >>> .el-badge__content--warning {
  background-color: #5ab1ef !important;
}

.cccc >>> .el-badge__content--primary {
  background-color: #efca69;
}

.items > span {
  position: absolute;
  left: 50%;
  margin-left: -40px;
  width: 80px;
  top: 50%;
  margin-top: -10px;
  height: 20px;
}

.items {
  margin-right: 10%;
  width: 100px;
  height: 100px;
  background: #fff;
  border-radius: 50%;
  text-align: center;
  word-break: break-word;
}

/* 数据管理列表样式 */
.dataManage {
  margin-top: 26px;
  margin-bottom: 10px;
  color: #61c3fa;
}
</style>
