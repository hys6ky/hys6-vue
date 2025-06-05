<template>
  <div>
    <el-row>
      <el-col :span="4" style="margin-top: 10px">
        <span class="nav" style="font-size: 18px"><i class="el-icon-s-data"></i>数据消费输出</span>
      </el-col>
      <el-col :span="20" style="float: right">
        <router-link :to="{name:'streamDataAnalysis'}">
          <el-button type="primary" size="small" style="margin-left:10px" class="goIndex">返回流计算首页</el-button>
        </router-link>
        <router-link :to="{name:'startupParameters',query:{ssj_job_id:this.$route.query.ssj_job_id,ssj_job_name:this.$route.query.ssj_job_name,type: this.$route.query.type}}">
          <el-button type="primary" size="small" style="margin-left:10px" class="goIndex">下一步</el-button>
        </router-link>
        <router-link :to="{name:'dataConsumptionAnalysis',query:{ssj_job_id:this.$route.query.ssj_job_id,ssj_job_name:this.$route.query.ssj_job_name,type: this.$route.query.type}}">
          <el-button type="primary" size="small" class="goIndex">上一步</el-button>
        </router-link>
      </el-col>
    </el-row>
    <div class="lines"></div>
    <el-row :gutter='20'>
      <el-col :span="6">
        <div><span class="fontStyle">源表信息</span></div>
        <div style="margin-top:-20px">
          <el-divider />
        </div>
        <div class="mytree">
          <el-tree :data="treeData" node-key="name" :indent='2'>
                    <span class="span-ellipsis" slot-scope="{ node}">
                        <span :title="node.label">
                            <i class="el-icon-folder-opened" v-if="node.label =='文本文件'||node.label =='数据库表'||node.label =='消息主题'||node.label =='分析结果表'" />
                            <i class="el-icon-document" v-else />
                            {{ node.label }}
                        </span>
                    </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="18" style="border-left: 1px #e0dcdc dashed;min-height: 450px;">
        <div><span class="fontStyle">数据消费输出信息列表</span>
          <el-button type="primary" size="small" style="float:right;" @click="dialogVisible = true">添加数据消费输出</el-button>
        </div>
        <div style="margin-top:-10px">
          <el-divider />
        </div>
        <div>
          <el-table stripe border size="medium" :header-cell-style="{ textAlign: 'center' }" :cell-style="{ 'text-align': 'center' }" height="350px" style="max-height:600px" :data="tabledata">
            <el-table-column label="序号" align="center" width="80px" type="index">
            </el-table-column>
            <el-table-column label="输入表名称" min-width="80px" prop="output_table_name">
            </el-table-column>
            <el-table-column label="输出格式" min-width="60" prop="output_type">
              <template scope="scope">
                {{scope.row.output_type=='1'?'文本文件':scope.row.output_type=='2'?'存储目的':scope.row.output_type=='3'?'流式数据':'Rest服务'}}
              </template>
            </el-table-column>
            <el-table-column label="输出文件名/表名" min-width="60" prop="table_name">
            </el-table-column>
            <el-table-column label="输出模式" min-width="60" prop="output_mode">
              <template scope="scope">
                {{scope.row.output_mode=='1'?'Append':scope.row.output_mode=='2'?'Update':'Complete'}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150px">
              <template scope="scope">
                <el-button type="text" @click="edit(scope.row)" class='editcolor'>编辑</el-button>
                <el-button type="text" @click="del(scope.$index,scope.row)" class="delcolor">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- 添加数据消费输出 -->
    <el-dialog :visible.sync="dialogVisible" title="添加数据消费输出" width="900px" :before-close="canceladd">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">添加数据消费输出</span>
      </div>
      <el-row :gutter='20'>
        <el-col :span='12'>
          <span class="outPutRules">输出格式:</span>
          <el-select label="输出格式" v-model="output_type" style="width:60%" :disabled='editButton'>
            <el-option v-for=" (item,index) in output_typeGroup" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div>
        <el-form label-width="100px" :model="textFile_form" v-show="output_type=='1'" :rules="rules" ref="textFile_form">
          <el-row :gutter='20'>
            <el-col :span='12'>
              <el-form-item label="文件格式 :" prop="sst_file_type">
                <el-select v-model="textFile_form.sst_file_type">
                  <el-option v-for=" (item,index) in sst_file_typeGroup" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="输入表名称 :" prop="output_table_name">
                <el-select v-model="textFile_form.output_table_name" placeholder="输入表名称">
                  <el-option v-for=" (item,index) in output_table_nameGroup" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="文件路径 :" prop="sst_file_path">
                <el-input v-model="textFile_form.sst_file_path" placeholder="文件路径"></el-input>
                <!-- <span style="margin-left:20px;">注： 生成的文件路径为/hrds/文件路径</span> -->
                <el-tooltip style="margin-top: 10px;margin-left: 10px" placement="top" effect="dark" class="item">
                  <div slot="content">
                    <!-- 生成的文件路径为：/hrds/文件路径 -->
                    {{tipText}}
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="是否有表头 :" prop="sst_is_header">
                <el-select v-model="textFile_form.sst_is_header">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="输出模式 :" prop="output_mode">
                <el-select v-model="textFile_form.output_mode">
                  <el-option label="追加" value="1"></el-option>
                  <el-option label="完整" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
        <el-form label-width="100px" class="formClass demo-ruleForm ruleFormSe" :model="dataBase_form" v-show="output_type=='2'" :rules="rules" ref="dataBase_form">
          <el-row>
            <div class='chooseStore'>
              <el-button type="primary" size="primary" @click="chooseStorageTierFun()">选择存储层</el-button>
              <span class="dialogtoptxt">
                            <p class="dialogtopname">选择存储层确定后自动回显对应的数据库信息</p>
                        </span>
            </div>

            <el-col :span='12'>
              <el-form-item label="数据库类型 :" prop="ssd_database_type">
                <el-select v-model="dataBase_form.ssd_database_type" :disabled='true' placeholder="数据库类型">
                  <el-option v-for=" (item,index) in ssd_database_typeGroup" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="驱动 :" prop="ssd_database_drive">
                <el-input v-model="dataBase_form.ssd_database_drive" :disabled='true' placeholder="驱动"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="数据库名称 :" prop="ssd_database_name">
                <el-input v-model="dataBase_form.ssd_database_name" placeholder="数据库名称" :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="数据库IP :" prop="ssd_ip">
                <el-input v-model="dataBase_form.ssd_ip" placeholder="数据库IP" :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="数据库端口 :" prop="ssd_port">
                <el-input v-model="dataBase_form.ssd_port" placeholder="数据库端口" :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="url :" prop="ssd_jdbc_url">
                <el-input v-model="dataBase_form.ssd_jdbc_url" :disabled='true' placeholder="数据库地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="用户名 :" prop="ssd_user_name">
                <el-input v-model="dataBase_form.ssd_user_name" placeholder="用户名" :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="密码 :" prop="ssd_user_password">
                <el-input v-model="dataBase_form.ssd_user_password" placeholder="密码" :disabled='true'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="输出表名 :" prop="ssd_table_name">
                <el-input v-model="dataBase_form.ssd_table_name" placeholder="输出表名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="输入表名称 :" prop="output_table_name">
                <el-select v-model="dataBase_form.output_table_name" placeholder="输入表名称">
                  <el-option v-for=" (item,index) in output_table_nameGroup" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="输出模式 :" prop="output_mode">
                <el-select v-model="dataBase_form.output_mode">
                  <el-option label="追加" value="1"></el-option>
                  <el-option label="更新" value="2"></el-option>
                  <el-option label="完整" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-form label-width="100px" :model="topic_form" v-show="output_type=='3'" :rules="rules" ref="topic_form">
          <el-row>
            <el-col :span='12'>
              <el-form-item label="KafKa版本 :" prop="sss_kafka_version">
                <el-select v-model="topic_form.sss_kafka_version">
                  <el-option v-for=" (item,index) in sss_kafka_versionGroup" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="消息主题名 :" prop="sss_topic_name">
                <el-input v-model="topic_form.sss_topic_name" placeholder="消息主题名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="流服务主机 :" prop="sss_bootstrap_server">
                <el-input v-model="topic_form.sss_bootstrap_server" placeholder="流服务主机"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="输入表名称 :" prop="output_table_name">
                <el-select v-model="topic_form.output_table_name" placeholder="输入表名称">
                  <el-option v-for=" (item,index) in output_table_nameGroup" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="输出模式 :" prop="output_mode">
                <el-select v-model="topic_form.output_mode">
                  <el-option label="追加" value="1"></el-option>
                  <el-option label="更新" value="2"></el-option>
                  <el-option label="完整" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form label-width="100px" :model="rest_form" v-show="output_type=='5'" :rules=" this.rest_form.rs_processing =='2' ? rules : null" ref="rest_form">
          <el-row>
            <div class="restButton">
              <el-button type="primary" size="small" @click="restDialogVisible=true;getRestList()">Rest列表</el-button>
              <el-button @click="addPramas" type="primary" size="small">添加参数信息</el-button>
              <el-button type="primary" size="small" @click="testMethodConnection" style="margin-left:20px">测试</el-button>
            </div>
            <el-form-item label="URL地址 :" prop="rs_url">
              <el-select v-model="rest_form.rs_type" style="width:100px">
                <el-option label="POST" value="1"></el-option>
                <el-option label="GET" value="2"></el-option>
              </el-select>
              <el-input v-model="rest_form.rs_url"></el-input>
            </el-form-item>
            <el-form-item label="参数信息 :">
              <div class="taskEx">
                <el-table stripe size="medium" :data="dialog_rest_tableData" :cell-style="{ 'text-align': 'center' }" :header-cell-style="{ 'text-align': 'center' }">
                  <el-table-column label="序号" type="index" width="50px"></el-table-column>
                  <el-table-column label="sql参数" prop="rest_key" width="220px">
                    <template scope="scope">
                      <el-input v-model="scope.row.rest_key" placeholder="New Key" style="width:150px"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="接口参数" prop="rest_val" width="160px">
                    <template scope="scope">
                      <el-input v-model="scope.row.rest_val" placeholder="Value" style="width:150px"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="测试值" prop="rest_test" width="180px">
                    <template scope="scope">
                      <el-input v-model="scope.row.rest_test" style="width:150px"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column width="100px" label="操作">
                    <template scope="scope">
                      <el-button type="text" @click="restTableDel(scope.$index, scope.row)">删 除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

            </el-form-item>
            <el-form-item label="返回值处理 :" prop="rs_processing">
              <el-radio-group v-model="rest_form.rs_processing">
                <el-radio label="0">忽 略</el-radio>
                <!-- <el-radio label="1">数据库</el-radio> -->
                <el-radio label="2">Kafka</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-show="rest_form.rs_processing=='2'">
              <el-col :span='12'>
                <el-form-item label="KafKa版本 :" prop="sss_kafka_version">
                  <el-select v-model="rest_form.sss_kafka_version">
                    <el-option v-for=" (item,index) in sss_kafka_versionGroup" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label="消息主题名 :" prop="sss_topic_name">
                  <el-input v-model="rest_form.sss_topic_name" placeholder="消息主题名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label="流服务主机 :" prop="sss_bootstrap_server">
                  <el-input v-model="rest_form.sss_bootstrap_server" placeholder="流服务主机"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label="输入表名称 :" prop="output_table_name">
                  <el-select v-model="rest_form.output_table_name" placeholder="输入表名称">
                    <el-option v-for=" (item,index) in output_table_nameGroup" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item label="输出模式 :" prop="output_mode">
                  <el-select v-model="rest_form.output_mode">
                    <el-option label="追加" value="1"></el-option>
                    <el-option label="更新" value="2"></el-option>
                    <el-option label="完整" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

            </div>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="addConsumeButton">
            <el-button type="danger" size="small" @click="canceladd">取 消</el-button>
            <el-button v-if="output_type=='2'" type="primary" size="small" @click="testConnection()">测试连接</el-button>
            <el-button type="primary" size="small" v-if="editButton==true" @click="saveEditDataOutputMsg">修 改</el-button>
            <el-button type="primary" size="small" v-else @click="saveDataOutputMsg">保 存</el-button>
        </span>
    </el-dialog>
    <!-- Rest列表信息 -->
    <el-dialog :visible.sync="restDialogVisible" title="Rest列表信息">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">Rest列表信息</span>
      </div>
      <el-table stripe size="medium" :data="dialog_rest_List" :cell-style="{ 'text-align': 'center' }" :header-cell-style="{ 'text-align': 'center' }" style="height:500px;">
        <el-table-column label="URL 地址" prop="rs_url" min-width="150px"></el-table-column>
        <el-table-column label="Rest 参数" prop="rs_para" min-width="180px"></el-table-column>

        <el-table-column label="返回值处理方式" prop="rs_processing" width="120px">
          <template scope="scope">
            {{scope.row.rs_processing=='1'?'数据库':scope.row.rs_processing=='2'?'Kafka':'忽略'}}
          </template>
        </el-table-column>

        <el-table-column label="#" width="80px">
          <template scope="scope">

            <el-button size="small" type='primary' @click="choose(scope.row.rs_id)">选择</el-button>
          </template>
        </el-table-column>

      </el-table>
      <span slot="footer">
            <el-button type="danger" size="small" @click="restDialogVisible=false">关闭</el-button>
        </span>
    </el-dialog>
    <!-- 选择存储层弹框 -->
    <el-dialog title="选择存储层" :visible.sync="dialogChooseStorageTier" width="40%" class="taskEx" :before-close='on_beforeClose'>
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">存储层</span>
      </div>
      <el-table stripe :data="StorageTierData.slice((StorageTier_currentPage - 1) * StorageTier_pagesize,StorageTier_currentPage * StorageTier_pagesize)" border size="medium" highlight-current-row ref="multipleTable" tooltip-effect="dark" :row-key="(row)=>{ return row.dsl_id}">
        <el-table-column property label="选择" width="60px" type="index" align="center">
          <template slot-scope="scope">
            <el-radio v-model="radioSave" :label="scope.row.dsl_id">&thinsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" width="60">
          <template slot-scope="scope">
            <span>{{scope.$index+(StorageTier_currentPage - 1) * StorageTier_pagesize + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column property="dsl_name" label="存储名称" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column property="store_type" label="存储类型" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="详情" width="160px" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="24" class="delbtn">
                <el-button size="medium" type="text" circle @click="getStoDestDetailFun(scope.row)">查看详情</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="StorageTier_handleSizeChange" @current-change="StorageTier_handleCurrentChange" :current-page.sync="StorageTier_currentPage" :page-size="StorageTier_pagesize" layout="total, prev, pager, next" :total="StorageTierData.length" class="locationcenter"></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="on_beforeClose" type="danger" size="mini">取 消</el-button>
        <el-button type="primary" @click="ChooseStorageTierSubmitFun()" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog title=" 查看详情" :visible.sync="dialogViewDetails" width="750px" class="alltable">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">存储层详细信息</span>
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

export default {
  mounted() {
    this.getTableData()
    this.storeTypeFun()
  },
  data() {
    return {
      output_type: '1', //输出格式
      output_typeGroup: [ //输出格式选择
        { value: "1", label: "文本文件" },
        { value: "2", label: "数据库表" },
        { value: "3", label: "消息主题" },
        { value: "5", label: "REST服务" },
      ],
      sst_file_typeGroup: [
        { value: "1", label: "CSV" },
        { value: "2", label: "parquet" },
        { value: "3", label: "json" },
      ],
      output_table_nameGroup: [],
      textFile_form: {
        sst_file_type: '1',
        output_table_name: '',
        output_mode: '1',
        sst_is_header: '1',
        sst_file_path: '',
      },
      ssd_database_typeGroup: [
        { value: "01", label: "MYSQL" },
        { value: "02", label: "Oracle9i及以下" },
        { value: "03", label: "Oracle10g及以上" },
        { value: "04", label: "SQLSERVER2000" },
        { value: "05", label: "SQLSERVER2005" },
        { value: "06", label: "DB2" },
        { value: "07", label: "SybaseASE12.5及以上" },
        { value: "08", label: "Informatic" },
        { value: "09", label: "H2" },
        { value: "10", label: "ApacheDerby" },
        { value: "11", label: "Postgresql" },
        { value: "12", label: "GBase" },
        { value: "13", label: "TeraData" },
        { value: "14", label: "KingBase" },
      ],
      dataBase_form: {
        ssd_database_type: '',
        ssd_database_drive: '',
        ssd_ip: '',
        ssd_database_name: '',
        ssd_port: '',
        ssd_jdbc_url: '',
        ssd_user_name: '',
        ssd_user_password: '',
        ssd_table_name: '',
        output_table_name: '',
        output_mode: '1',
        dsl_id: '',
      },
      sss_kafka_versionGroup: [
        { value: "3", label: "kafka 0.10/1.0" },
        { value: "1", label: "kafka 8" },
        { value: "2", label: "kafka 9" },
      ],
      topic_form: {
        sss_kafka_version: '3',
        sss_topic_name: '',
        sss_bootstrap_server: '',
        output_table_name: '',
        output_mode: '1',
      },
      dialog_rest_tableData: [],
      dialog_rest_List: [],
      StorageTierData: [],
      storeTypeData: [],
      viewDatilsData: [],
      treeData: [],
      treeData1: [],
      sdm_info_id: '',
      radioSave: null, //存储层弹框单选
      StorageTier_currentPage: 1,
      StorageTier_pagesize: 10,
      rest_form: {
        rs_url: '',
        rs_type: '1',
        rs_processing: '0',
        sss_kafka_version: '3',
        sss_topic_name: '',
        sss_bootstrap_server: '',
        output_table_name: '',
        output_mode: '1',
      },
      restDialogVisible: false,
      dialogVisible: false,
      dialogChooseStorageTier: false,
      dialogViewDetails: false,
      ssj_job_id: this.$route.query.ssj_job_id,
      editButton: false,
      tabledata: [],
      rules: {
        sst_file_path: [{ required: true, message: '请输入文件路径 ', trigger: 'blur' }],
        ssd_table_name: [{ required: true, message: '请输入输出表名  ', trigger: 'blur' }],
        output_table_name: [{ required: true, message: '请输入输入表名称   ', trigger: 'blur' }],
        sss_topic_name: [{ required: true, message: '请输入消息主题名 :  ', trigger: 'blur' }],
        sss_bootstrap_server: [{ required: true, message: '请输入流服务主机 :  ', trigger: 'blur' }],
      },

    }
  },

  methods: {
    //测试Rest接口
    testMethodConnection() {
      if (this.rest_form.rs_url) {
        let rest_keyArry = [],
            rest_valArry = [],
            rest_testArry = []
        this.dialog_rest_tableData.map((item) => {
          rest_keyArry.push(item.rest_key)
          rest_valArry.push(item.rest_val)
          rest_testArry.push(item.rest_test)
        })
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/sdmdataoutput/testMethodConnection',{
          url: this.rest_form.rs_url,
          rest_key: rest_keyArry,
          rest_val: rest_valArry,
          rest_test: rest_testArry
        }).then((res) => {
          if (res.success == true) {
            this.$Msg.customizTitle('连接成功！', 'success')
          }
        })
      } else {
        this.$Msg.customizTitle('请先输入URL地址！', 'warning')
      }
    },
    on_beforeClose() {
      this.dialogChooseStorageTier = false
      this.radioSave = null
    },
    //测试数据库连接
    testConnection() {
      if (this.radioSave) {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/sdmdataoutput/testOutPutConnection',{ dsl_id: this.radioSave }).then((res) => {
          if (res.data == true) {
            this.$Msg.customizTitle('连接成功！', 'success')
          }
        })
      } else {
        this.$Msg.customizTitle('请先选择存储层。', 'warning')
      }
    },
    //获取页面列表数据
    getTableData() {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/sdmdataoutput/getSdmSpOutputMsgList',{ ssj_job_id: this.ssj_job_id }).then((res) => {
        res.data.map((item) => { this.tabledata.push(item[0]) })
      })
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/analysesqlmanage/getSdmAnalyseDataInfos',{
        pageStep: '3'
      }).then((res) => {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/analysesqlmanage/getTableDataList',{
          ssj_job_id: this.$route.query.ssj_job_id,
          pageStep: '3'
        }).then((ele) => {
          res.data.forEach((item)=>{
            ele.data.forEach((data)=>{
              if(item.id == data.parent_id){
                item.children = []
                item.children.push(data)
                this.output_table_nameGroup.push({
                  lable: data.label,
                  value: data.label
                })
              }
            })
          })
          this.treeData = res.data
        })
      })
    },
    //查询Rest列表
    getRestList() {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/sdmdataoutput/getRestList').then((res) => {
        this.dialog_rest_List = res.data
      })
    },
    //选择Rest
    choose(data) {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/sdmdataoutput/getCheckedMsg',{ rs_id: data }).then((res) => {
        for (let key in res.data.settingInfo) {
          this.rest_form[key] = res.data.settingInfo[key]
        }
        for (let key in res.data.streamInfo) {
          this.rest_form[key] = res.data.streamInfo[key]
        }
        let trans = JSON.parse(res.data.settingInfo.rs_para)
        for (let key in trans) {
          let newValue = {}
          newValue.rest_key = key
          newValue.rest_val = trans[key]
          this.dialog_rest_tableData.push(newValue)
        }
        this.restDialogVisible = false
      })
    },
    // 选择存储层
    chooseStorageTierFun() {
      this.dialogChooseStorageTier = true
      //    AlldestinationData
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/agent/dbagentconf/stodestconf/getStorageData').then(res => {
        let arr = JSON.parse(JSON.stringify(res.data));
        let data = this.storeTypeData;
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[j].code == arr[i].store_type) {
              arr[i].store_type = data[j].value;
            }
          }
        }
        this.StorageTierData = arr;
      })
    },
    // 点击查看详情
    getStoDestDetailFun(row) {
      this.dialogViewDetails = true;
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getStorageLayerConfInfo',{
        dsl_id: row.dsl_id
      }).then(res => {
        this.viewDatilsData = res.data.dsl_attr_s;
      });
    },
    StorageTier_handleSizeChange(size) {
      this.StorageTier_pagesize = size
    },
    StorageTier_handleCurrentChange(currentpage) {
      this.StorageTier_currentPage = currentpage
    },
    ChooseStorageTierSubmitFun() {
      this.dialogChooseStorageTier = false
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getStorageLayerConfInfo',{ dsl_id: this.radioSave }).then(res => {
        if (res.data.dsl_attr_s) {
          let arr = res.data.dsl_attr_s
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].storage_property_key == 'database_type') {
              this.dataBase_form.ssd_database_type = arr[i].storage_property_val
            }
            if (arr[i].storage_property_key == 'database_driver') {
              this.dataBase_form.ssd_database_drive = arr[i].storage_property_val
            }
            if (arr[i].storage_property_key == "user_name") {
              this.dataBase_form.ssd_user_name = arr[i].storage_property_val
            }
            if (arr[i].storage_property_key == "database_pwd") {
              this.dataBase_form.ssd_user_password = arr[i].storage_property_val
            }
            if (arr[i].storage_property_key == "jdbc_url") {
              this.dataBase_form.ssd_jdbc_url = arr[i].storage_property_val
              var reg = /(\d{1,3}\.){3}\d{1,3}\:\d{1,5}/g
              let detail = reg.exec(this.dataBase_form.ssd_jdbc_url);
              this.dataBase_form.ssd_port = detail[0].split(':')[1];
              this.dataBase_form.ssd_ip = detail[0].split(':')[0];
            }
            if (arr[i].storage_property_key == "database_name") {
              this.dataBase_form.ssd_database_name = arr[i].storage_property_val
            }
            if (arr[i].storage_property_key == "database_ip") {
              this.dataBase_form.ssd_ip = arr[i].storage_property_val
            }
            if (arr[i].storage_property_key == "database_port") {
              this.dataBase_form.ssd_port = arr[i].storage_property_val
            }
          }
        }
      });
    },
    //提交数据前，合并拼接数据
    mergeData() {

      let result = {}
      result.dsl_id = 0
      switch (this.output_type) {
        case '1':
          for (let key in this.textFile_form) {
            result[key] = this.textFile_form[key]
          };
          break
        case '2':
          for (let key in this.dataBase_form) {
            result[key] = this.dataBase_form[key]
          };
          break
        case '3':
          for (let key in this.topic_form) {
            result[key] = this.topic_form[key]
          };
          break
        case '5':
          result.output_mode = '0'
          for (let key in this.rest_form) {
            result[key] = this.rest_form[key]
          };
          result.rest_key = [], result.rest_val = [], result.rest_test = [],
              this.dialog_rest_tableData.map((item) => {
                result.rest_key.push(item.rest_key)
                result.rest_val.push(item.rest_val)
                result.rest_test.push(item.rest_test)
              })
          if (result.output_table_name == '') {
            result.output_table_name = this.output_table_nameGroup[this.output_table_nameGroup.length - 1].value
          }
          break
      }
      result.ssj_job_id = this.ssj_job_id
      result.output_type = this.output_type
      result.dsl_id = result.output_type == '2' ? this.radioSave : 0
      return result
    },
    //添加数据消费输出
    saveDataOutputMsg() {
      let check = this.output_type == '1' ? 'textFile_form' : this.output_type == '2' ? 'dataBase_form' : this.output_type == '3' ? 'topic_form' : 'rest_form'
      if (check == 'rest_form') {
        if (this.dialog_rest_tableData.length == 0 || this.dialog_rest_tableData.rest_key == '' || this.dialog_rest_tableData.rest_val == '') {
          this.$message({
            message: '请填入完整的参数信息!',
            type: 'warning'
          })
          return false
        };
      }
      if (check == 'dataBase_form' && this.radioSave == null) {
        this.$Msg.customizTitle('请选择存储层！', 'warning')
        return false;
      }
      this.$refs[check].validate((valid) => {
        if (valid) {
          let params = this.mergeData()
          this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmdataconsume/sdmdataoutput/saveDataOutputMsg',params).then((res) => {
            if (res.success == true) {
              this.$Msg.saveSuccess(res)
              this.$router.go(0)
            }
          })
        }
      })
    },
    //保存编辑数据消费输出
    saveEditDataOutputMsg() {
      let check = this.output_type == '1' ? 'textFile_form' : this.output_type == '2' ? 'dataBase_form' : this.output_type == '3' ? 'topic_form' : 'rest_form'
      if (check == 'rest_form') {
        if (this.dialog_rest_tableData.length == 0 || this.dialog_rest_tableData.rest_key == '' || this.dialog_rest_tableData.rest_val == '') {
          this.$message({
            message: '请填入完整的参数信息!',
            type: 'warning'
          })
          return false
        };
      }
      this.$refs[check].validate((valid) => {
        if (valid) {
          let params = this.mergeData()
          params.sdm_info_id = this.sdm_info_id
          this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmdataconsume/sdmdataoutput/updateSdmSpOutputMsg',params).then((res) => {
            if (res.success == true) {
              this.$Msg.updateSuccess(res)
              this.$router.go(0)
            }
          })
        }
      })
    },
    //取消操作
    canceladd() {
      this.editButton = false
      this.dialogVisible = false
      this.$refs.textFile_form.resetFields()
      this.$refs.topic_form.resetFields()
      this.$refs.dataBase_form.resetFields()
      this.$refs.rest_form.resetFields()
      this.dialog_rest_tableData.splice(0)
      this.output_type = '1'
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
    //删除消费信息
    del(index, data) {
      this.$confirm('确认删除该条消费输出信息吗？', '删除数据源！', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'info'
      }).then(() => {
        let ssd_info_id = ''
        if (data.output_type == '2') {
          ssd_info_id = data.ssd_info_id
        } else {
          ssd_info_id = '0'
        }
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/sdmdataoutput/deleteSdmSpOutputMsg',{
          sdm_info_id: data.sdm_info_id,
          ssd_info_id: ssd_info_id,
        }).then((res) => {
          if (res.success == true) {
            this.$message({
              message: '删除成功！',
              type: 'success',
            })
            this.tabledata.splice(index, 1)
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    addPramas() {
      let newVlaue = {
        rest_key: '',
        rest_val: '',
        rest_test: ''
      }
      this.dialog_rest_tableData.push(newVlaue)
    },
    restTableDel(index) {
      this.dialog_rest_tableData.splice(index, 1)
    },
    //编辑
    edit(data) {
      this.editButton = true
      this.sdm_info_id = data.sdm_info_id
      this.output_type = data.output_type
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/sdmdataoutput/getSdmSpOutputMsg',{
        sdm_info_id: data.sdm_info_id
      }).then((res) => {
        if (data.output_type == '1') {
          for (let key in res.data.spInfo) {
            this.textFile_form[key] = res.data.spInfo[key]
          }
          for (let key in res.data.textInfo) {
            this.textFile_form[key] = res.data.textInfo[key]
          }
        }
        if (data.output_type == '2') {
          for (let key in res.data.dataInfo) {
            this.dataBase_form[key] = res.data.dataInfo[key]
          }
          for (let key in res.data.spInfo) {
            this.dataBase_form[key] = res.data.spInfo[key]
          }
          this.radioSave = res.data.dataInfo.dsl_id
          this.ChooseStorageTierSubmitFun()
        }
        if (data.output_type == '3') {
          for (let key in res.data.spInfo) {
            this.topic_form[key] = res.data.spInfo[key]
          }
          for (let key in res.data.streamInfo) {
            this.topic_form[key] = res.data.streamInfo[key]
          }
        }
        if (data.output_type == '5') {
          for (let key in res.data.proInfo) {
            this.rest_form[key] = res.data.proInfo[key]
          }
          for (let key in res.data.spInfo) {
            this.rest_form[key] = res.data.spInfo[key]
          }
          for (let key in res.data.streamInfo) {
            this.rest_form[key] = res.data.streamInfo[key]
          }
          let trans = JSON.parse(res.data.proInfo.rs_para)
          for (let key in trans) {
            let newValue = {}
            newValue.rest_key = key
            newValue.rest_val = trans[key]
            this.dialog_rest_tableData.push(newValue)
          }
        }
      })
      this.dialogVisible = true
    },
  },
  computed: {
    tipText: {
      get: function () {
        if (this.textFile_form.sst_file_path != '') {
          let result = ''
          this.sst_file_typeGroup.map(res => {
            if (res.value == this.textFile_form.sst_file_type) {
              result = res.label
            }
          })
          return '生成的文件路径为：/hrds/' + this.textFile_form.sst_file_path + '/' + this.$route.query.ssj_job_name + '/' + result.toLowerCase()
        } else {
          return "生成的文件路径为：/hrds/输入框里面输入的路径/任务名/文件格式"
        }
      }
    }
  }
}
</script>

<style scoped>
.lines {
  margin-top: 4px;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}

.nav {
  font-size: 20px;
  color: #2196f3;
}

.el-input {
  width: 80%;
}

.el-form {
  padding-top: 20px;

}

.el-select {
  width: 80%;
}

.fontStyle {
  color: #2196f3;
  font-size: 18px;
  margin-left: 20px;
}

.outPutRules {
  display: inline-block;
  width: 100px;
  position: relative;
  left: 25px;
}

.chooseStore {
  margin: 10px 0px 30px 50px;
  position: absolute;
  left: 350px;
  top: -70px;

}

.restButton {
  position: absolute;
  left: 400px;
  top: -58px;
}

.addConsumeButton {
  display: inline-block;
  margin-top: -40px;

}
.mailTable {
  margin: 0 auto;
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  box-sizing: border-box;
}

.mailTable>tr>td:nth-child(1) {
  width: 200px;
  text-align: right;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  box-sizing: border-box;
  font-weight: bold;
  background-color: #eff3f6;
}

.mailTable>tr>td:nth-child(2) {
  width: 500px;
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
}
</style>
