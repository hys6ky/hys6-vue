<template>
  <div id="realtimeCollection">
    <el-tabs :tab-position="tabPosition" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="first" label="采集统计">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-divider content-position="left">最近15天进数情况 ( 单位/MB )</el-divider>
            <template>
              <ve-histogram :loading="true" :data="chartData" style="overflow:hidden"
                            :settings="chartSettings"></ve-histogram>
            </template>
            <el-divider content-position="left">采集信息汇总</el-divider>
            <el-row class="cccc" :gutter="10">
              <el-col :span="8">
                <el-badge value="文件采集" class="items" style="border: 4px solid #19D4AE;" type="success">
                  <span size="small">{{ dataCollectInfo.filesize }}</span>
                </el-badge>
              </el-col>
              <el-col :span="8">
                <el-badge value="数据采集" class="items" style="border: 4px solid #5AB1EF;" type="warning">
                  <span size="small">{{ dataCollectInfo.dbsize }}</span>
                </el-badge>
              </el-col>
              <el-col :span="8">
                <el-badge value="采集任务数" class="items" style="border: 4px solid #EFCA69;" type="primary">
                  <span size="small">{{ dataCollectInfo.taskNum }}</span>
                </el-badge>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-divider content-position="left">数据采集信息列表</el-divider>
            <el-row>
                <el-form>
                  <el-form-item label="选择任务">
                    <el-select v-model="database_id" filterable clearable placeholder="请选择任务进行查看">
                      <el-option v-for="item in dataBaseSet" :key="item.taskid" :label="item.taskname"
                                 :value="item.taskid">
                        <span style="float: left">{{ item.taskname }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.agent_type }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
            </el-row>
            <collectTable :tableData="jobTableData"></collectTable>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane name="second" label="Agent列表">
        <el-row class="topTitle">
          <span class='el-icon-location'>Agent列表</span>
        </el-row>
        <el-table
            :data="sourceData.filter(data => !search || data.datasource_name.toLowerCase().includes(search.toLowerCase()))"
            border size="medium">
          <el-table-column label="序号" width="70" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="datasource_name" label="数据源" show-overflow-tooltip
                           align="center"></el-table-column>
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
          <el-table-column label="Ftp" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.ftpflag!=0" size="mini" round type="primary"
                         @click="deployAgentList(agentTypeData.FTP, scope.row)">部署
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="消息流 Agent" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.restflag!=0" size="mini" round type="primary"
                         @click="deploySdmAgentList(agentTypeData.XiaoXiLiu, scope.row)">部署
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="文件流 Agent" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.fileflag!=0" size="mini" round type="primary"
                         @click="deploySdmAgentList(agentTypeData.WenBenLiu, scope.row)">部署
              </el-button>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope" slot="header">
              <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
            </template>
          </el-table-column>
        </el-table>
        <!--     Agent信息列表模态框   -->
        <el-dialog :title="datasource_name" :visible.sync="outerVisible" width="75%">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">{{ datasource_name }}</span>
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

        <!--部署Agent模态框 agentDeploy-->
        <el-dialog :title="deployAgentName" :visible.sync="dialogFormVisible" width="75%">
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
      </el-tab-pane>

      <el-tab-pane name="third" label="Agent状态">
        <el-row class="topTitle">
          <span class='el-icon-location'>Agent状态</span>
        </el-row>
        <el-table
            :data="statusTableData.filter(data => !searchAgentName || data.agent_name.toLowerCase().includes(searchAgentName.toLowerCase()))"
            max-height="50%" style="width: 100%">
          <el-table-column prop="down_id" label="部署Agent ID"></el-table-column>
          <el-table-column sortable prop="datasource_name" label="数据源" align="center"></el-table-column>
          <el-table-column sortable prop="agent_ip" label="Agent IP" align="center"></el-table-column>
          <el-table-column sortable prop="agent_port" label="Agent端口" align="center"></el-table-column>
          <el-table-column sortable prop="agent_name" show-overflow-tooltip label="Agent名称"></el-table-column>
          <el-table-column prop="statuszh" label="运行状态" align="center"></el-table-column>
          <el-table-column prop="agent_date" :formatter="dateFormat" label="启动日期" align="center"></el-table-column>
          <el-table-column prop="agent_time" :formatter="timeFormat" label="启动时间" align="center"></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <template v-if="agentStatusList.WeiLianJie == scope.row.agent_status">
                <el-button type="success" round size="mini" @click="startAgent(scope.row)">
                  <i class="el-icon-video-play"> 启动</i>
                </el-button>
              </template>
              <template v-else-if="agentStatusList.YiLianJie == scope.row.agent_status">
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

      <el-tab-pane name="fourth" label="任务配置">
        <el-row class='topTitle'>
          <span class='el-icon-location'>任务配置</span>
        </el-row>
        <el-table stripe :data="AgenttableData" border :header-cell-style="{'text-align':'center'}">
          <el-table-column label="序号" width="80" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="datasource_name" label="数据源" align="center"></el-table-column>
          <el-table-column label="数据库 Agent" align="center">
            <template slot-scope="scope" v-if="scope.row.dbflag!=0">
              <el-row class='optheight'>
                <el-badge type="warning" :value="scope.row.dbflag">
                  <el-button v-if="scope.row.dbflag!=0" type="success" size="mini" round
                             @click="dialogTableVisible = true;clickTaskflag(scope.row.source_id,agentTypeDataTwo.ShuJuKu)">
                    任务配置
                  </el-button>
                </el-badge>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="数据文件 Agent" align="center">
            <template slot-scope="scope" v-if="scope.row.dfflag!=0">
              <el-row class='optheight'>
                <el-badge type="warning" :value="scope.row.dfflag">
                  <el-button v-if="scope.row.dfflag!=0" type="success" size="mini" round
                             @click="dialogTableVisible = true;clickTaskflag(scope.row.source_id,agentTypeDataTwo.DBWenJian)">
                    任务配置
                  </el-button>
                </el-badge>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="非结构化 Agent" align="center">
            <template slot-scope="scope" v-if="scope.row.nonstructflag!=0">
              <el-row class='optheight'>
                <el-badge type="warning" :value="scope.row.nonstructflag">
                  <el-button v-if="scope.row.nonstructflag!=0" type="success" size="mini" round
                             @click="dialogTableVisible = true;clickTaskflag(scope.row.source_id,agentTypeDataTwo.WenJianXiTong)">
                    任务配置
                  </el-button>
                </el-badge>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="半结构化 Agent" align="center">
            <template slot-scope="scope" v-if="scope.row.halfstructflag!=0">
              <el-row class='optheight'>
                <el-badge type="warning" :value="scope.row.halfstructflag">
                  <el-button v-if="scope.row.halfstructflag!==0" type="success" size="mini" round
                             @click="dialogTableVisible = true; clickTaskflag(scope.row.source_id,agentTypeDataTwo.DuiXiang)">
                    任务配置
                  </el-button>
                </el-badge>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="Ftp" align="center">
            <template slot-scope="scope" v-if="scope.row.ftpflag!=0">
              <el-row class='optheight'>
                <el-badge type="warning" :value="scope.row.ftpflag">
                  <el-button v-if="scope.row.ftpflag!=0" type="success" size="mini" round
                             @click="dialogTableVisible = true;clickTaskflag(scope.row.source_id,agentTypeDataTwo.FTP)">
                    任务配置
                  </el-button>
                </el-badge>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="数据消息流Agent" show-overflow-tooltip align="center">
            <template slot-scope="scope" v-if="scope.row.restflag!==0">
              <el-row class='optheight'>
                <el-badge type="warning" :value="scope.row.restflag">
                  <el-button v-if="scope.row.restflag!==0" size="mini" round type="success"
                             @click="deployAgentListTwo(agentTypeDataTwo.XiaoXiLiu, scope.row)">任务配置
                  </el-button>
                </el-badge>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="文件内容流Agent" show-overflow-tooltip align="center">
            <template slot-scope="scope" v-if="scope.row.fileflag!==0">
              <el-row class='optheight'>
                <el-badge type="warning" :value="scope.row.fileflag">
                  <el-button v-if="scope.row.fileflag!==0" size="mini" round type="success"
                             @click="deployAgentListTwo(agentTypeDataTwo.WenBenLiu, scope.row)">任务配置
                  </el-button>
                </el-badge>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <!-- 点击任务配置显示弹框-->
        <el-dialog title :visible.sync="dialogTableVisible" width="80%">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">数据源名称:{{ sourceName }}</span>
            <span class="dialogtoptxt">采集类型: <p class="dialogtopname">{{ agentType }}</p></span>
          </div>
          <el-table stripe :data="gridData2" border size="medium" :header-cell-style="{'text-align':'center'}">
            <el-table-column label="序号" width="100px" align="center" class>
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column property="agent_name" label="Agent名称" align="center"></el-table-column>
            <el-table-column property="agent_ip" label="Agent IP" align="center"></el-table-column>
            <el-table-column property="agent_port" label="Agent端口" align="center"></el-table-column>
            <el-table-column property="agent_type" label="采集类型" align="center"></el-table-column>
            <el-table-column label="Agent连接状态" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.agent_status==='未连接'" type="danger">{{ scope.row.agent_status }}</el-tag>
                <el-tag v-else-if="scope.row.agent_status==='已连接'" type="success">{{ scope.row.agent_status }}
                </el-tag>
                <el-tag v-else>{{ scope.row.agent_status }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column property="AgentOpt" label="操作" width="400px" align="center">
              <template slot-scope="scope">
                <el-row class='optheight'>
                  <el-col :span="8">
                    <el-button type="success" size="mini" round @click="addtask(scope.row,sourceName)"
                               icon='el-icon-plus'>新增任务
                    </el-button>
                  </el-col>
                  <el-col :span="8">
                    <el-badge type="warning" :value="scope.row.tasknum" class="itemi">
                      <el-button type="primary" size="mini" round @click="taskManagement(scope.row)"
                                 icon='el-icon-s-cooperation'>任务管理
                      </el-button>
                    </el-badge>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="warning" size="mini" round @click="tasklogFun(scope.row)"
                               icon="el-icon-search">日志查看
                    </el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false" type="danger" size="medium">取 消</el-button>
            <el-button type="primary" @click="dialogTableVisible = false" size="medium">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 点击任务管理出现 -->
        <el-dialog title="数据采集任务" :visible.sync="dialogTableTask" width="80%" class="taskEx">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">数据采集任务</span>
          </div>
          <el-table stripe :data="taskMang" border size="medium" :empty-text="tableloadingInfo">
            <el-table-column label="序号" width="70" align="center" class>
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column property="task_name" label="任务名称" align="center"
                             :show-overflow-tooltip="true"></el-table-column>
            <el-table-column property="agent_type" label="采集类型" align="center">
            </el-table-column>
            <el-table-column property='collect_type' v-if="collect_type==true" label="采集方式" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.collect_type=='数据库采集'" type="info">{{ scope.row.collect_type }}</el-tag>
                <el-tag v-else-if="scope.row.collect_type=='数据库抽数'" type="success">{{ scope.row.collect_type }}
                </el-tag>
                <el-tag v-else type="primary">{{ scope.row.collect_type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <template
                    v-if="scope.row.agent_type==='数据库Agent' || scope.row.agent_type==='数据文件Agent' || scope.row.agent_type==='对象Agent' || scope.row.agent_type==='FtpAgent'">
                    <el-button type="text" @click="taskEditBtn(scope.row,sourceName)" class='editcolor'>编辑</el-button>
                  <el-button type="text" @click="taskDelBtn(agentType,scope.row)" class="delcolor">删除</el-button>
                  <el-button type="text" v-show="scope.row.collect_type!=='贴元登记' && scope.row.collect_type != '实时采集'"
                             @click="taskSendBtn(agentType,scope.row)" class="sendcolor">发送
                  </el-button>
                  <!-- <el-button type="text" v-show="scope.row.collect_type=='实时采集'" @click="cdcStartNowBtn(scope.row)" class="sendcolor">立即启动
                  </el-button> -->
                  <el-button type="text" v-show="scope.row.collect_type=='实时采集'" @click="openCdcRunManagerDialog(scope.row.id)" class="sendcolor">运行管理
                  </el-button>
                  <el-button type="text" v-if="scope.row.collect_type==='数据库抽数'||scope.row.agent_type==='数据文件Agent' || scope.row.collect_type==='数据库采集' || scope.row.agent_type==='FtpAgent'"
                             class="workcolor" @click="ProdeceJobsFun(scope.row)">生成作业
                  </el-button>
                  <el-button v-if="scope.row.collect_type==='数据库抽数'" type="text"
                             @click="finishDialogVisible = true;settingDownloadDirc(agentType,scope.row)"
                             class="sendcolor">下载数据字典
                  </el-button>
                </template>
                <template v-if="scope.row.agent_type==='文件系统Agent'">
                  <el-button type="text" @click="taskEditBtn(scope.row,sourceName)" class='editcolor'>编辑</el-button>
                  <el-button type="text" @click="taskDelBtn(agentType,scope.row)" class="delcolor">删除</el-button>
                  <el-button type="text" @click="fileCollectTaskSendBtn(agentType,scope.row)" class="workcolor">发送
                  </el-button>
                  <el-button type="text" @click="executeImmediately(agentType,scope.row)" class="sendcolor">立即执行
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableTask = false" type="danger" size="medium">关闭</el-button>
          </div>
        </el-dialog>
        <!-- 运行管理 -->
        <el-dialog title="运行管理" :visible.sync="dialogCdcRunManage" width="40%" class alltable>
          <el-button type="text" style="float:right" @click="dialogCdcStartNowBtn()" class='editcolor'>全部启动/重启</el-button>
          <br>
          <el-form :model="cdcRunManagerData">
            <el-form-item label="采集任务" prop="collectTaskList" >
              <el-table :data="cdcRunManagerData.collectTaskList">
                <el-table-column prop="pid" label="程序编号"></el-table-column>
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    <!-- <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" disabled></el-switch> -->
                    <span v-show="scope.row.status" style="color:rgb(19, 206, 102)"> 运行中</span>
                    <span v-show="!scope.row.status" style="color:rgb(255, 73, 73)"> 未运行</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" v-if="!scope.row.status" @click="startCollectTask(scope.row.tableName)" class='editcolor'>启动</el-button>
                    <el-button type="text" v-if="scope.row.status" @click="stopCollectTask(scope.row.tableName)" class='editcolor'>停止</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="同步任务" prop="syncTaskList">
              <el-table :data="cdcRunManagerData.syncTaskList">
                <el-table-column prop="pid" label="程序编号"></el-table-column>
                <el-table-column prop="tableName" label="表名"></el-table-column>
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    <!-- <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" disabled></el-switch> -->
                    <span v-show="scope.row.status" style="color:rgb(19, 206, 102)" > 运行中</span>
                    <span v-show="!scope.row.status" style="color:rgb(255, 73, 73)" > 未运行</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" v-if="!scope.row.status" @click="startSyncTask(scope.row.tableName)" class='editcolor'>启动</el-button>
                    <el-button type="text" v-if="scope.row.status" @click="stopSyncTask(scope.row.tableName)" class='editcolor'>停止</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!--生成作业  -->
        <el-dialog title="生成作业" :visible.sync="dialogProdeceJobs" width="40%" class="alltable">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">生成作业</span>
          </div>
          <el-form ref="ProdeceJobsData" :model="ProdeceJobsData" label-width="240px" text-align="left">
            <el-form-item label="选择工程" prop="etl_sys_id" :rules="rule.selected">
              <el-select placeholder="选择工程" filterable v-model="ProdeceJobsData.etl_sys_id" style="width: 190px;"
                         size="medium">
                <el-option v-for="(item,index) in Allproject" :key="index"
                           :label="item.etl_sys_cd+' ('+item.etl_sys_name+')'"
                           :value="item.etl_sys_id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择任务" prop="sub_sys_id" :rules="rule.selected">
              <el-select placeholder="选择任务" filterable v-model="ProdeceJobsData.sub_sys_id" style="width: 190px;"
                         size="medium" @focus="getbyidworkFun()">
                <el-option v-for="(item,index) in Alltask" :key="index"
                           :label="item.sub_sys_cd+' ('+item.sub_sys_desc+')'"
                           :value="item.sub_sys_id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="dialogProdeceJobs=false" size="mini">取 消</el-button>
            <el-button type="primary" size="mini" @click="workSubmitFun()">确 定</el-button>
          </div>
        </el-dialog>
        <!--下载数据字典时,数据库的采集任务中或许存在着SQL占位符,所以这里需要填写-->
        <el-dialog title="下载数据字典" :visible.sync="finishDialogVisible" width="80%">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">下载数据字典</span>
          </div>
          <div>
            <el-form>
              <el-form-item>
                SQL中如果存在占位符,请填写占位符的值...多个参数之间请使用{{ ParamPlaceholder }}进行分割,例如:
                column1=123{{ ParamPlaceholder }}column2=456
                <el-input type="textarea" placeholder="采集任务中的SQL占位参数值" v-model="sqlParam"
                          style="width:100%;"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="finishDialogVisible = false" type="danger" size="mini">取 消</el-button>
            <el-button type="primary" @click="downloadDirc()" size="mini">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 发送的弹框 立即启动-->
        <el-dialog title="设置数据跑批日期" :visible.sync="sendLJQDDialogVisible" width="80%">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">设置数据跑批日期</span>
          </div>
          <div>
            <el-form>
              <el-form-item>
                <el-date-picker type="date" value-format="yyyyMMdd" placeholder="选择启动日期" v-model="etl_date"
                                style="width:100%;"></el-date-picker>
              </el-form-item>
              <el-form-item v-if="dbtype!='数据文件Agent'">
                SQL中如果存在占位符,请填写占位符的值...多个参数之间请使用{{ ParamPlaceholder }}进行分割,例如:
                column1=123{{ ParamPlaceholder }}column2=456
                <el-input type="textarea" placeholder="采集任务中的SQL占位参数值" v-model="sqlParam"
                          style="width:100%;"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="sendLJQDDialogVisible = false" type="danger" size="mini">取 消</el-button>
            <el-button type="primary" @click="sendLJQDSubmit()" size="mini">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 发送弹框 发送作业 -->
        <el-dialog title="提示信息" :visible.sync="sendZYDialogVisible" width="80%">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">提示信息</span>
          </div>
          <span>设置完成！请等待Agent运行...不运行请点击取消或按下Esc键</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="sendZYDialogVisible = false" type="danger" size="mini">取 消</el-button>
            <el-button type="primary" @click="sendLJQDSubmit()" size="mini">确 定</el-button>
        </span>
        </el-dialog>
        <!--                                   Agent信息列表模态框                              -->
        <el-dialog :title="sdm_source_name" :visible.sync="outerVisibleTwo" width="80%" class="taskEx">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">{{ sdm_source_name }}</span>
          </div>
          <el-table :data="agentDataListTwo" border stripe size="medium">
            <el-table-column property="agent_name" label="Agent名称" align="center"></el-table-column>
            <el-table-column property="agent_ip" label="Agent IP" align="center"></el-table-column>
            <el-table-column property="agent_port" label="Agent 端口" align="center"></el-table-column>
            <el-table-column property="agent_type" label="Agent 类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.agent_type==='7'">数据消息流Agent</span>
                <span v-else-if="scope.row.agent_type==='6'">文件内容流Agent</span>
              </template>
            </el-table-column>
            <el-table-column label="Agent 连接状态" align="center" width='150px'>
              <template slot-scope="scope">
                <el-tag v-if="scope.row.agent_status=='1'" type="success">已连接</el-tag>
                <el-tag v-else-if="scope.row.agent_status=='3'" type="success">正在运行</el-tag>
                <el-tag v-else type="danger">未连接</el-tag>
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
        <el-dialog :visible.sync="taskManageDialog" title="Agent参数配置管理" width="80%" class="taskEx">
          <div slot="title">
            <span class="dialogtitle el-icon-caret-right">Agent参数配置管理</span>
          </div>
          <el-table :data="taskManageTableDate" border stripe size="medium">
            <el-table-column prop="sdm_receive_name" label="任务名称" align="center" width="140px"></el-table-column>
            <el-table-column prop="sdm_receive_id" label="任务id" align="center" min-width="85px"></el-table-column>
            <el-table-column prop="sdm_agent_name" label="Agent名称" align="center"></el-table-column>
            <el-table-column prop="agent_type" label="Agent类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.agent_type==='7'">数据消息流Agent</span>
                <span v-else-if="scope.row.agent_type==='6'">文件内容流Agent</span>
              </template>
            </el-table-column>
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
    </el-tabs>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import * as message from "@/utils/message";
import collectTable from "./collectTable.vue";
import {execByUrlFullPathRequest, execGetByMenuUrl} from "@/utils/executeRequest";

let rowName;
export default {
  components: {collectTable},
  data() {
    return {
      tasknum: 0,
      typeFlag: false, //用来区分选中的是stream流还是采集agent
      etl_date: '',
      AgenttableData: [],
      gridData2: [],
      taskMang: [],
      tableloadingInfo: '数据加载中...',
      dialogTableVisible: false,
      dialogFormVisible1: false,
      dialogProdeceJobs: false,
      finishDialogVisible: false,
      agentType: "",
      sourceName: "",
      agentStatus: "",
      dialogTableTask: false,
      CollectType: [],
      AgentStatus: [],
      ProdeceJobsData: {
        etl_sys_id: '',
        sub_sys_id: ''
      },
      Allproject: [],
      Alltask: [],
      getValue: {},
      sqlParam: '',
      type: '',
      id: '',
      ParamPlaceholder: '',
      CollectTypeData: [],
      collect_type: false,
      sendLJQDDialogVisible: false,
      sendZYDialogVisible: false,
      dbid: '',
      dbtype: '',
      dbcollectType: '',
      checkAgentType: '',
      database_id: '',
      datasource_name: '',

      searchAgentName: "",
      activeName: 'first',
      statusTableData: [],
      agentStatusList: {},

      chartSettings: {
        showLine: ["file"],
        labelMap: {
          date: "采集日期",
          data: "数据采集",
          file: "文件采集"
        }
      },
      jobTableData: [],
      dataBaseSet: [], //任采集任务信息
      dataCollectInfo: {},
      chartData: {
        columns: [],
        rows: []
      },
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
      // 实时采集是否未运行过
      sscjIsFirst : false,
      // cdc 任务管理弹窗
      dialogCdcRunManage: false,
      cdcRunManagerData:{
        taskId:null,
        collectTaskList:[],
        syncTaskList:[],
      }
    };
  },
  watch: {
    database_id(newVal, oldVal) {
      if (newVal) {
        this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/getCurrentTaskJob", {database_id: newVal}).then(res => {
          if (res.success) {
            this.jobTableData = res.data;
          }
        });
      }
    }
  },
  created() {
    this.getAgentNumAndSourceNum();
  },
  mounted() {
    this.getType();
    this.getStatus();
    this.getTypeValue();
    this.$executeRequest.execPostByModuleUrl("/dataCollectionO/agentList/getSqlParamPlaceholder", null).then(res => {
      if (res && res.success) {
        this.ParamPlaceholder = res.data
      }
    });
    let params = {};
    params["category"] = "CollectType";
    this.$Code.getCategoryItems(params).then(res => {
      if (res && res.success) {
        this.CollectTypeData = res.data
      }
    });
    this.$executeRequest.execPostByModuleUrl("/dataCollectionO/agentList/getAgentInfoList", null).then(res => {
      if (res && res.success) {
        this.tasknum = 0;
        this.AgenttableData = res.data ? res.data : [];
      }
    });
    this.$executeRequest.execPostByModuleUrl("/dataCollectionO/agentdeploy/getDataSourceInfo", null).then(res => {
      if (res.success) {
        this.sourceData = res.data;
      }
    })
    this.$executeRequest.execPostByModuleUrl("/dataCollectionO/getHoStoryCollect", null).then(res => {
      if (res && res.success) {
        if (typeof res != 'undefined' && res.data !== "") {
          this.chartData.columns = Object.keys(res.data[0]);
          this.chartData.rows = res.data.reverse();
        }
      }
    });
    this.$executeRequest.execPostByModuleUrl("/dataCollectionO/getDatabaseSet", null).then(res => {
      if (res && res.success) {
        this.dataBaseSet = res.data;
      }
    });
    this.$executeRequest.execPostByModuleUrl("/dataCollectionO/getDataCollectInfo", null).then(res => {
      if (res && res.success) {
        this.dataCollectInfo = res.data[0];
      }
    });
    this.$executeRequest.execPostByModuleUrl("/dataCollectionO/getHoStoryCollect", null).then(res => {
      if (res && res.success) {
        if (typeof res != 'undefined' && res.data !== "") {
          this.chartData.columns = Object.keys(res.data[0]);
          this.chartData.rows = res.data.reverse();
        }
      }
    });
    /** 获取Agent类型的代码项 */
    this.$Code.getCodeItems({
      'category': 'AgentType'
    }).then(res => {
      if (res && res.success) {
        this.agentTypeData = res.data;
        this.agentTypeDataTwo = res.data;
      }
    })
    this.$Code.getCodeItems({
      'category': 'AgentStatus'
    }).then(res => {
      if (res && res.success) {
        this.agentStatusList = res.data;
      }
    })
    //
    // this.getSdmDataSourceInfo();
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
    //获取类型
    getType() {
      let params = {};
      params["category"] = "AgentType";
      this.$Code.getCategoryItems(params).then(res => {
        if (res && res.success) {
          this.CollectType = res.data ? res.data : [];
        }
      });
    },
    saveAgentDeploy(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.typeFlag) {
            this.saveSdmAgentDownInfo(formName);
            // this.agentDeploy['customPath'] = this.customPath;
            // this.agentDeploy['deploy'] = this.deploy;
            // this.agentDeploy['oldAgentDir'] = this.oldAgentDir;
            // this.agentDeploy['oldLogPath'] = this.oldLogPath;
            // this.$executeRequest.execPostByModuleUrl('/dataCollectionO/agentdeploy/saveSdmAgentDownInfo', this.agentDeploy).then(res => {
            //   if (typeof res != 'undefined' && res.success) {
            //     this.$Msg.customizTitle("部署完成");
            //     this.dialogFormVisible = false;
            //     this.loading = false;
            //   } else {
            //     this.loading = false;
            //   }
            //   this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/agentdeploy/getSdmAgentInfo', rowValue).then(res => {
            //     this.agentDataList = res.data;
            //     this.outerVisible = true;
            //   })
            // })
          } else {
            this.agentDeploy['customPath'] = this.customPath;
            this.agentDeploy['deploy'] = this.deploy;
            this.agentDeploy['oldAgentDir'] = this.oldAgentDir;
            this.agentDeploy['oldLogPath'] = this.oldLogPath;
            this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentdeploy/saveAgentDownInfo", this.agentDeploy).then(res => {
              //agentDeployFun.saveAgentDownInfo(this.agentDeploy).then(res => {
              if (typeof res != 'undefined' && res.success) {
                this.$Msg.customizTitle("部署完成");
                this.dialogFormVisible = false;
              }
            })
          }
        }
      })
    },
    // 下载配置文件
    downloadAgentConf() {
      if (this.agentDeploy.down_id === undefined || this.agentDeploy.down_id === '') {
        this.$Msg.customizTitle("agent还未部署，请部署后下载", "warning")
        return;
      }
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentdeploy/downloadAgentConf", {
        down_id: this.agentDeploy.down_id
      }).then(res => {
        if (res && res.success) {
          let fileName = res.data;
          this.$executeRequest.execDownloadFileByModuleUrl("/dataCollectionO/agentdeploy/downloadFile", {
            fileName: fileName
          }).then(res => {
            this.$FileOperations.fileDownload(res, fileName);
          });
        }
      })
    },
    stopAgent(row) {
      // 停止Agent
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentdeploy/agentstatus/stopAgent", row).then(res => {
        if (res && res.success) {
          this.$Msg.customizTitle("停止成功")
          this.reloadData()
        }
      })
    },
    startAgent(row) {
      // 启动Agent
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentdeploy/agentstatus/startAgent", row).then(res => {
        if (res && res.success) {
          this.$Msg.customizTitle("启动成功")
          this.reloadData()
        }
      })
    },
    restartAgent(row) {
      // 重启Agent
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentdeploy/agentstatus/restartAgent", row).then(res => {
        if (res.success) {
          this.$Msg.customizTitle("重启成功")
          this.reloadData()
        }
      })
    },
    handleClick(tab, event) {
      // 获取作业Agent所在机器的资源信息
      if (this.activeName == 'third') {
        this.agentInfo();
        this.searchAgentName = "";
      }
    },
    agentInfo() {
      this.$executeRequest.execPostByModuleUrl("/dataCollectionO/agentdeploy/agentstatus/agentInfo", null).then(res => {
        if (res && res.success) {
          this.statusTableData = res.data
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
      this.timerObj = setTimeout(() => {
        this.agentInfo()
      }, 3000);
    },
    // 查询数据源信息及其对应的agent个数
    getAgentNumAndSourceNum() {
      this.$executeRequest.execPostByModuleUrl('/dataCollectionO/agentdeploy/getAgentNumAndSourceNum', {}).then((res) => {
        if (res && res.success) {
          this.agentnum = res.data.agentnum;
          this.sourcenum = res.data.sourcenum;
        }
      });
    },
    getTypeValue() {
      // CollectType
      let params = {};

      params["category"] = "AgentType";
      this.$Code.getCodeItems(params).then(res => {
        if (res && res.success) {
          this.getValue = res.data;
        }
      });
    },
    // 获取状态
    getStatus() {
      let params = {};
      params["category"] = "AgentStatus";
      this.$Code.getCategoryItems(params).then(res => {
        if (res && res.success) {
          this.AgentStatus = res.data ? res.data : [];
        }
      });
    },
    // 任务配置
    clickTaskflag(id, type) {
      this.checkAgentType = type
      this.agentType = "";
      let params = {};
      params["sourceId"] = id;
      params["agentType"] = type;
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/getAgentInfo", params).then(res => {
        if (res && res.success) {
          let arrdata = res.data ? res.data : [];
          for (let i = 0; i < this.CollectType.length; i++) {
            if (this.CollectType[i].code == arrdata[0].agent_type) {
              this.agentType = this.CollectType[i].value;
            }
          }
          for (let i = 0; i < arrdata.length; i++) {
            for (let m = 0; m < this.CollectType.length; m++) {
              if (arrdata[i].agent_type == this.CollectType[m].code) {
                arrdata[i].agent_type = this.CollectType[m].value;
              }
              this.getTaskNum(arrdata[i]);
            }
            for (let n = 0; n < this.AgentStatus.length; n++) {
              if (arrdata[i].agent_status == this.AgentStatus[n].code) {
                arrdata[i].agent_status = this.AgentStatus[n].value;
              }
            }
          }
          this.sourceName = arrdata[0].datasource_name;
          this.gridData2 = arrdata;
        }
      });
    },
    getTaskNum(row) {
      rowName = row.agent_name;
      this.collect_type = row.agent_type == '1' ? true : false
      this.dialogTableTask = false;
      let params = {};
      params["sourceId"] = row.source_id;
      params["agentId"] = row.agent_id;
      this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agentList/getTaskInfo", params).then(res => {
        if (res && res.success) {
          let arrdata = res ? res.data : [];
          this.tasknum = arrdata.length;
        }
      });
    },
    downloadDirc() {
      for (let i = 0; i < this.CollectType.length; i++) {
        if (this.CollectType[i].value == this.type) {
          if (this.CollectType[i].code == this.getValue.ShuJuKu) {
            this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/sendJDBCCollectTaskById", {
              'colSetId': this.id,
              'is_download': 'true',
              'sqlParam': this.sqlParam
            }).then(res => {
              const blob = new Blob([JSON.stringify(res)]);
              if (window.navigator.msSaveOrOpenBlob) {
                // 兼容IE10
                navigator.msSaveBlob(blob, this.filename + ".json");
              } else {
                //  chrome/firefox
                let aTag = document.createElement("a");
                aTag.download = this.filename + ".json";
                aTag.href = URL.createObjectURL(blob);
                if (aTag.all) {
                  aTag.click();
                } else {
                  //  兼容firefox
                  let evt = document.createEvent("MouseEvents");
                  evt.initEvent("click", true, true);
                  aTag.dispatchEvent(evt);
                }
                URL.revokeObjectURL(aTag.href);
              }
              this.finishDialogVisible = false
            });
          }
        }
      }
    },
    // 查询数据源信息及其对应的agent个数
    getSdmDataSourceInfo() {
      this.$executeRequest.execPostByModuleUrl('/dataCollectionO/agentdeploy/getSdmDataSourceInfo', {}).then((res) => {
        if (res && res.success) {
          this.sourceData = res.data;
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
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentdeploy/getAgentInfo", row).then(res => {
        if (res.success) {
          this.agentDataList = res.data;
          this.outerVisible = true;
        }
      })
    },
    // 当前数据源需要部署的Agent列表信息
    deploySdmAgentList(agent_type, row) {
      this.sdm_source_name = '数据源名称 : ' + row.datasource_name;
      row['sdm_agent_type'] = agent_type;
      this.typeFlag = true;
      window.rowValue = row,
          this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/agentdeploy/getSdmAgentInfo', row).then(res => {
            this.agentDataList = res.data;
            this.outerVisible = true;
          })
    },
    handleEdit(row) {
      this.deployAgentName = 'Agent部署 : ' + row.agent_name;
      this.customPath = this.isflag.Fou;
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentdeploy/getAgentDownInfo", row).then(res => {
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
    deployAgentListTwo(agentType, row) {
      this.sdm_source_name = '数据源名称 : ' + row.datasource_name;
      let params = {};
      params["sourceId"] = row.source_id;
      params["agentType"] = agentType;
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/agentList/getAgentInfo', params).then(res => {
        this.agentDataListTwo = res.data;
        this.outerVisibleTwo = true;
      })
    },
    //添加任务
    addFileTaskTwo(data, type) {
      let realPath = ''
      if (data.agent_type == '6') {
        realPath = "setWenBenTask"
      } else {
        realPath = "setRestTask"
      }
      this.$router.push({
        name: realPath,
        query: {
          sdm_source_id: data.source_id,
          sdm_agent_type: data.agent_type,
          agent_id: data.agent_id,
          sdm_receive_id: data.sdm_receive_id,
          sdm_agent_ip: data.agent_ip,
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
          item.agent_type = data.agent_type
          item.sdm_source_id = data.source_id
          item.agent_ip = data.agent_ip
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
    // 新增任务  根据不同类型跳转不同页面
    addtask(row, sourceName) {
      if (row.agent_type == "数据库Agent") {
        this.$router.push({
          name: "agent",
          query: {
            agent_name: this.$Base64.encode(row.agent_name),
            agent_id: row.agent_id,
            source_id: row.source_id,
            source_name: this.$Base64.encode(sourceName),
          }
        });
      }
      if (row.agent_type == "数据文件Agent") {
        this.$router.push({
          name: "dbAgentcollect",
          query: {
            agent_name: this.$Base64.encode(row.agent_name),
            agent_id: row.agent_id,
            source_id: row.source_id,
            source_name: this.$Base64.encode(sourceName),
          }
        });
      }
      console.log(row,sourceName,"-----------------")
      if (row.agent_type == "文件系统Agent") {

        this.$executeRequest.execGetByMenuUrl("unstructuredAgent/searchFileCollectByAgent", {
          agent_id: row.agent_id
        }).then(res => {
          if (res && res.success) {
              if (res.data){
                this.$router.push({
                  name: "unstructuredAgent",
                  query: {
                    // agent_name: this.$Base64.encode(row.agent_name),
                    agent_id: row.agent_id,
                    source_id: row.source_id,
                    id:res.data.id,
                    rowName:this.$Base64.encode(row.agent_name),
                    source_name: this.$Base64.encode(sourceName),
                    edit:'yes'
                  }
                });
              } else {
                this.$router.push({
                  name: "unstructuredAgent",
                  query: {
                    agent_name: this.$Base64.encode(row.agent_name),
                    agent_id: row.agent_id,
                    source_id: row.source_id,
                    source_name: this.$Base64.encode(sourceName),
                  }
                });
              }
          }
        });
      }
      if (row.agent_type == "对象Agent") {
        this.$router.push({
          name: "semiStructuredAgent",
          query: {
            agent_name: this.$Base64.encode(row.agent_name),
            agent_id: row.agent_id,
            source_id: row.source_id,
            source_name: this.$Base64.encode(sourceName),
          }
        });
      }
      if (row.agent_type == "FtpAgent") {
        this.$router.push({
          name: "ftpCollect",
          query: {
            agent_name: this.$Base64.encode(row.agent_name),
            agent_id: row.agent_id,
            source_id: row.source_id,
            source_name: this.$Base64.encode(sourceName),
          }
        });
      }
    },
    // 任务管理里面的编辑  根据不同类型跳转不同页面
    taskEditBtn(row, sourceName) {
      for (let i = 0; i < this.CollectType.length; i++) {
        if (row.agent_type === "数据库Agent" && this.CollectType[i].value == row.agent_type) {
          this.agentType = this.CollectType[i].code;
          this.$router.push({
            name: "agent",
            query: {
              agent_id: row.agent_id,
              id: row.id,
              source_id: row.source_id,
              rowName: this.$Base64.encode(rowName),
              source_name: this.$Base64.encode(sourceName),
              edit: "yes"
            }
          });
        }
        if (row.agent_type === "数据文件Agent" && this.CollectType[i].value == row.agent_type) {
          this.agentType = this.CollectType[i].code;
          this.$router.push({
            name: "dbAgentcollect",
            query: {
              agent_id: row.agent_id,
              id: row.id,
              source_id: row.source_id,
              rowName: this.$Base64.encode(rowName),
              source_name: this.$Base64.encode(sourceName),
              edit: "yes"
            }
          });
        }
        if (row.agent_type === "文件系统Agent" && this.CollectType[i].value == row.agent_type) {
          this.agentType = this.CollectType[i].code;
          this.$router.push({
            name: "unstructuredAgent",
            query: {
              agent_id: row.agent_id,
              id: row.id,
              source_id: row.source_id,
              rowName: this.$Base64.encode(rowName),
              source_name: this.$Base64.encode(sourceName),
              edit: "yes"
            }
          });
        }
        if (row.agent_type === "对象Agent" && this.CollectType[i].value == row.agent_type) {
          this.agentType = this.CollectType[i].code;
          this.$router.push({
            name: "semiStructuredAgent",
            query: {
              agent_id: row.agent_id,
              id: row.id,
              source_id: row.source_id,
              rowName: this.$Base64.encode(rowName),
              source_name: this.$Base64.encode(sourceName),
              edit: "yes"
            }
          });
        }
        if (row.agent_type === "FtpAgent" && this.CollectType[i].value == row.agent_type) {
          this.agentType = this.CollectType[i].code;
          this.$router.push({
            name: "ftpCollect",
            query: {
              agent_id: row.agent_id,
              id: row.id,
              source_id: row.source_id,
              rowName: this.$Base64.encode(rowName),
              source_name: this.$Base64.encode(sourceName),
              edit: "yes"
            }
          });
        }
      }
    },
    // 生成作业
    ProdeceJobsFun(row) {
      this.database_id = row.id;
      this.dialogProdeceJobs = true;
      this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agentList/getProjectInfo").then(res => {
        if (res.success) {
          this.$refs.ProdeceJobsData.resetFields();
          this.Allproject = res.data
        }
      });
    },
    //点击任务编号按钮
    getbyidworkFun() {
      //调接口显示内容
      if (this.ProdeceJobsData.etl_sys_id !== undefined && this.ProdeceJobsData.etl_sys_id !== '') {
        this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agentList/getTaskInfoByTaskId", {
          'etl_sys_id': this.ProdeceJobsData.etl_sys_id
        }).then(res => {
          if (res.success) {
            this.Alltask = res.data
          }
        })
      } else {
        this.$Msg.customizTitle("工程编号未选择", 'error')
      }

    },
    // 生成作业提交按钮
    workSubmitFun() {
      this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agentList/etljobs/saveEtlJobs", {
        database_id: this.database_id,
        agent_type: this.checkAgentType,
        etl_sys_id: this.ProdeceJobsData.etl_sys_id,
        sub_sys_id: this.ProdeceJobsData.sub_sys_id
      }).then(res => {
        if (res && res.success) {
          this.$Msg.customizTitle("作业生成完成")
          this.dialogProdeceJobs = false
        }
      })
    },
    // 下载数据字典
    settingDownloadDirc(type, row) {
      this.type = type;
      this.id = row.id;
      this.filename = row.task_name
    },
    // 任务管理
    taskManagement(row) {
      rowName = row.agent_name;
      this.collect_type = row.agent_type == '数据库Agent' ? true : false
      this.dialogTableTask = true;
      let params = {};
      params["sourceId"] = row.source_id;
      params["agentId"] = row.agent_id;
      this.$executeRequest.execGetByModuleUrl("/dataCollectionO/agentList/getTaskInfo", params).then(res => {
        if (res && res.success) {
          let arrdata = res ? res.data : [];
          for (let i = 0; i < arrdata.length; i++) {
            arrdata[i].agent_type = row.agent_type;
            for (let j = 0; j < this.CollectTypeData.length; j++) {
              if (arrdata[i].collect_type == this.CollectTypeData[j].code) {
                arrdata[i].collect_type = this.CollectTypeData[j].value
              }
            }
          }
          this.taskMang = arrdata;
          if (arrdata.length > 0) {
            this.tableloadingInfo = ''
          } else {
            this.tableloadingInfo = '暂无数据'
          }
          this.tasknum = arrdata.length;
        }
      });
    },
    // 日志查看页面
    tasklogFun(row) {
      this.$router.push({
        name: "taskLog",
        query: {
          agent_id: row.agent_id,
        }
      });
    },
    // 删除任务
    taskDelBtn(type, row) {
      for (let i = 0; i < this.CollectType.length; i++) {
        if (this.CollectType[i].value == type) {
          if (this.CollectType[i].code == '1') {
            message.confirmMsg('确定删除吗').then(res => {
              let params = {};
              params["collectSetId"] = row.id;
              this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/deleteDBTask", params).then(res => {
                if (res.success) {
                  this.taskManagement(row);
                  message.deleteSuccess(res);
                }
              });
            }).catch(() => {
            })
          } else if (this.CollectType[i].code == '2') {
            //文件系统agent--非结构化deleteNonStructTask
            message.confirmMsg('确定删除吗').then(res => {
              let params = {};
              params["collectSetId"] = row.id;
              this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/deleteNonStructTask", params).then(res => {
                if (res.success) {
                  this.taskManagement(row);
                  message.deleteSuccess(res);
                }
              });
            }).catch(() => {
            })
          } else if (this.CollectType[i].code == '3') {
            //ftpagent
            message.confirmMsg('确定删除吗').then(res => {
              let params = {};
              params["collectSetId"] = row.id;
              this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/deleteFTPTask", params).then(res => {
                if (res.success) {
                  this.taskManagement(row);
                  message.deleteSuccess(res);
                }
              });
            }).catch(() => {
            })
          } else if (this.CollectType[i].code == '4') {
            //数据文件agent
            message.confirmMsg('确定删除吗').then(res => {
              let params = {};
              params["collectSetId"] = row.id;
              this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/deleteDFTask", params).then(res => {
                if (res.success) {
                  this.taskManagement(row);
                  message.deleteSuccess(res);
                }
              });
            }).catch(() => {
            })
          } else if (this.CollectType[i].code == '5') {
            //对象agent--半结构化deleteHalfStructTask
            message.confirmMsg('确定删除吗').then(res => {
              let params = {};
              params["collectSetId"] = row.id;
              this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/deleteHalfStructTask", params).then(res => {
                if (res.success) {
                  this.taskManagement(row);
                  message.deleteSuccess(res);
                }
              });
            }).catch(() => {
            })
          }

        }
      }
    },
    // 发送
    taskSendBtn(type, row) {
      let params = {};
      params["colSetId"] = row.id;
      this.dbid = row.id;
      this.dbtype = type;
      this.dbcollectType = row.collect_type;
      if (type === '对象Agent') {
        this.objTaskSendBtn(row)
      } else if (type === 'FtpAgent') {
          this.ftpTaskSendBtn(row)
      } else {
        this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/startJobType", params).then(res => {
          if (res.success) {
            if (res.data) {
              //立即启动
              this.sendLJQDDialogVisible = true
              this.startButtonFun()
            } else {
              //生成作业
              this.sendZYDialogVisible = true
            }
          }
        })
      }
    },
    // flinkcdc 实时采集 立即启动/重启
    dialogCdcStartNowBtn(){
      console.log(this.cdcRunManagerData.taskId);
      var param = {taskId:this.cdcRunManagerData.taskId};
        this.$executeRequest.execGetByModuleUrl("/dataCollectionO/cdcCollect/execute",param).then(res => {
        if(res ){
          if(res.success){
            this.$Msg.customizTitle('启动成功', 'success');
            this.openCdcRunManagerDialog(this.cdcRunManagerData.taskId)
          }else{
            this.$Msg.customizTitle("启动失败:"+res.message,"warning");
          }
        }
      });
    },
    objTaskSendBtn(row) {
      let params = {odc_id:row.id}
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/startObjJobType", params).then(res => {
        if (res.success) {
          if (res.data) {
            //立即启动
            this.sendLJQDDialogVisible = true
            this.startButtonFun()
          } else {
            //生成作业
            this.sendZYDialogVisible = true
          }
        }
      })
    },
    ftpTaskSendBtn(row) {
      let params = {ftp_id:row.id}
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/sendFtpCollect", params).then(res => {
        if (res && res.success) {
          this.$Msg.customizTitle("发送FTP采集任务成功", "success");
        }
      })
    },
    // 点击发送根据返回值不同显示不统
    startButtonFun() {
      let date = new Date();
      this.etl_date = date.getFullYear() + '' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '' + (date.getDate() > 9 ? date.getDate() : '0' + (date.getDate()))
    },
    //发送-立即启动-作业
    sendLJQDSubmit() {
      let type = this.dbtype,
          dbid = this.dbid;
      for (let i = 0; i < this.CollectType.length; i++) {
        if (this.CollectType[i].value == type) {
          if (this.CollectType[i].code == '1') {
            if (this.dbcollectType == '数据库抽数') {
              let params = {};
              params["colSetId"] = dbid;
              params["etl_date"] = this.etl_date;
              params["sqlParam"] = this.sqlParam;
              this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/sendJDBCCollectTaskById", params).then(res => {
                if (this.etl_date && this.etl_date !== '') {
                  this.sendLJQDDialogVisible = false
                } else {
                  this.sendZYDialogVisible = false;
                }
                message.sendSuccess(res);
              });
            } else if (this.dbcollectType == '数据库采集' || this.dbcollectType == '实时采集') {
              this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/sendCollectDatabase", {
                colSetId: dbid,
                etl_date: this.etl_date,
                sqlParam: this.sqlParam
              }).then(res => {
                if (res.success) {
                  if (this.etl_date && this.etl_date !== '') {
                    this.sendLJQDDialogVisible = false
                  } else {
                    this.sendZYDialogVisible = false;
                  }
                  message.sendSuccess(res);
                }
              })
            }
          } else if (this.CollectType[i].code == '2') {
            //文件系统agent--非结构化deleteNonStructTask
            message.confirmMsg('确定发送吗').then(res => {
              let params = {};
              params["colSetId"] = dbid;
            }).catch(() => {
            })
          } else if (this.CollectType[i].code == '3') {
            //ftpagent
            message.confirmMsg('确定发送吗').then(res => {
              let params = {};
              params["colSetId"] = dbid;
            }).catch(() => {
            })
          } else if (this.CollectType[i].code == '4') {
            //数据文件agent
            message.confirmMsg('确定发送吗').then(res => {
              let params = {};
              params["colSetId"] = dbid;
              params["etl_date"] = this.etl_date;
              this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/sendDBCollectTaskById", params).then(res => {
                if (res.success) {
                  this.sendLJQDDialogVisible = false
                  message.sendSuccess(res);
                }
              });
            }).catch(() => {
            })
          } else if (this.CollectType[i].code == '5') {
            //对象agent--半结构化deleteHalfStructTask
            message.confirmMsg('确定发送吗').then(res => {
              let params = {};
              params["odc_id"] = dbid;
              params["etl_date"] = this.etl_date;
              this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agentList/sendObjectCollectTaskById", params).then(res => {
                if (res.success) {
                  if (this.etl_date && this.etl_date !== '') {
                    this.sendLJQDDialogVisible = false
                  } else {
                    this.sendZYDialogVisible = false;
                  }
                  message.sendSuccess(res);
                }
              });
            }).catch(() => {
            })
          }

        }
      }
    },
    //文件采集发送任务
    fileCollectTaskSendBtn(agentType, row) {
      message.confirmMsg('确定发送吗?').then(res => {
        let fcs_id = row.id;
        this.$executeRequest.execGetByModuleUrl("/dataCollectionO/unstructuredAgent/executeJob", {
          'fcs_id': fcs_id,
          'execute_type': 'execute_etl'
        }).then(res => {
          if (res.success) {
            this.$Msg.customizTitle('发送成功!', 'success')
            this.executeDialog = false;
            this.$router.push({
              name: "dataCollectionO"
            })
          } else {
            this.executeDialog = false;
          }
        })
      }).catch(() => {
      });
    },
    // 立即执行任务
    executeImmediately(agentType, row) {
      message.confirmMsg('确定立即执行吗?').then(res => {
        let fcs_id = row.id;
        this.$executeRequest.execGetByModuleUrl("/dataCollectionO/unstructuredAgent/executeJob", {
          'fcs_id': fcs_id,
          'execute_type': 'execute_immediately'
        }).then(res => {
          if (res.success) {
            this.$Msg.customizTitle('立即运行成功!', 'success')
            this.executeDialog = false;
            this.$router.push({
              name: "dataCollectionO"
            })
          } else {
            this.executeDialog = false;
          }
        })
      }).catch(() => {
      });
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
    // 打开 实时采集管理Dialog
    openCdcRunManagerDialog(taskId){
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/cdcCollect/getTaskStatus', {
        taskId: taskId
      }).then((res) => {
        if(res && res.success){
          if(res.data.collectTaskList == 0 && res.data.syncTaskList == 0 ){
            this.sscjIsFirst = true;
            this.$Msg.customizTitle("程序未启动过，无任务数据:","warning");
          }
          this.dialogCdcRunManage = true;
          this.cdcRunManagerData = res.data;
          this.cdcRunManagerData.taskId = taskId;
        }else{
          this.$Msg.customizTitle("获取状态信息失败:"+res.message,"error");
        }
      })
    },// 启动 cdc 采集任务
    startCollectTask(){
      var param = {taskId:this.cdcRunManagerData.taskId};
      console.log("startCollectTask")
      console.log(param)
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/cdcCollect/startCollectTask', param).then((res) => {
        if(res && res.success){
            this.$Msg.customizTitle(res.data);
            this.openCdcRunManagerDialog(this.cdcRunManagerData.taskId)
        }else{
          this.$Msg.customizTitle("获取状态信息失败:"+res.message,"error");
        }
      })

    },
    // 停止 cdc 采集任务
    stopCollectTask(){
      var param = {taskId:this.cdcRunManagerData.taskId};
      console.log("stopCollectTask")
      console.log(param)
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/cdcCollect/stopCollectTask', param).then((res) => {
        if(res && res.success){
          this.$Msg.customizTitle(res.data);
          this.openCdcRunManagerDialog(this.cdcRunManagerData.taskId)
        }else{
          this.$Msg.customizTitle("获取状态信息失败:"+res.message,"error");
        }
      })
    },
    // 启动 cdc 同步任务
    startSyncTask(tableName){
      var param = {taskId:this.cdcRunManagerData.taskId,tableName:tableName};
      console.log("startSyncTask")
      console.log(param)
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/cdcCollect/startSyncTask', param).then((res) => {
        if(res && res.success){
          this.$Msg.customizTitle(res.data);
          this.openCdcRunManagerDialog(this.cdcRunManagerData.taskId)
        }else{
          this.$Msg.customizTitle("获取状态信息失败:"+res.message,"error");
        }
      })
    },
    // 停止 cdc 同步任务
    stopSyncTask(tableName){
      var param = {taskId:this.cdcRunManagerData.taskId,tableName:tableName};
      console.log("stopSyncTask")
      console.log(param)
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/cdcCollect/stopSyncTask', param).then((res) => {
        if(res && res.success){
          this.$Msg.customizTitle(res.data);
          this.openCdcRunManagerDialog(this.cdcRunManagerData.taskId)
        }else{
          this.$Msg.customizTitle("获取状态信息失败:"+res.message,"error");
        }
      })
    },

  },
};
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

.taskEx >>> .el-dialog__body {
  padding: 8px 20px;
}

.taskEx >>> .el-table__row > td {
  padding: 0;
}

.title-sourceName,
.title-agentType {
  font-size: 18px;
}

.successlink {
  color: rgb(3, 97, 3);
}

.unlink {
  color: red;
}

.linking {
  color: #000;
}

.el-badge >>> .is-fixed {
  top: 9px !important;
  right: 15px !important;
}
</style>
