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
    <el-dialog :title="datasource_name" :visible.sync="outerVisibleTwo" width="65%" class="taskEx">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">{{ datasource_name }}</span>
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
  </div>
</template>

<script>

export default {
  data() {
    return {
      sourceDataTwo: [],
      agentDataListTwo: {}, //Agent信息列表
      agentTypeDataTwo: {}, //Agent类型代码项
      isflagTwo: {}, // 是否的代码项
      sdm_source_name: "",
      sdm_agent_name: "",
      outerVisibleTwo: false,
      sdm_agent_type: "",
      taskManageDialog: false,
      taskManageTableDate: [],
    }
  },
  mounted() {
    this.getSdmDataSourceInfoTwo();
    /** 获取Agent类型的代码项 */
    this.$Code.getCodeItems({
      'category': 'AgentType'
    }).then(res => {
      this.agentTypeDataTwo = res.data;
    })
    /** 获取是否类型的代码项 */
    this.$Code.getCodeItems({
      'category': 'IsFlag'
    }).then(res => {
      this.isflagTwo = res.data;
    })

  },
  methods: {
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
      this.sdm_source_name = '数据源名称 : ' + row.datasource_name;
      row['sdm_agent_type'] = sdm_agent_type;
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/agentdeploy/getSdmAgentInfo', row).then(res => {
        this.agentDataListTwo = res.data;
        this.outerVisibleTwo = true;
      })
    },
    //添加任务
    addFileTaskTwo(data, type) {
      let realPath = ''
      console.log("data" + JSON.stringify(data))
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
      this.taskManageDialog = true;
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmcollecttask/wenbenliutask/selectTaskManage', {
        sdm_agent_id: data.agent_id,
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

  }
}
</script>

<style scoped>

</style>
