<template>
  <div>
    <el-row class="topTitle">
      <span class="el-icon-s-data">数据源配置</span>
      <router-link :to="{name:'streamDataAnalysis'}">
        <el-button type="primary" size="small" style="margin-left:10px" class="goIndex">返回流计算首页</el-button>
      </router-link>
      <el-button type="primary" size="small" @click="nextStep" class="goIndex">下一步</el-button>
    </el-row>
    <div class="pageConent">
      <!-- 左侧添加数据源面板开始 -->
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-tabs type="border-card" class="leftTab" v-model="activeName">
            <!-- 添加内部数据源选择面板 -->
            <el-tab-pane label="选择内部数据源" name="leftPane">
              <div class="mytree" height='260'>
                <el-tree class="filter-tree" :data="treeData" :indent='0' @node-click="handleNodeClick"
                         :highlight-current="true" ref="tree">
                  <span class="span-ellipsis" slot-scope="{ node, data }">
                    <span :title="data.description"
                          v-if="(data.file_id)">
                      <i class="el-icon-document"></i>{{ node.label }}
                      <template v-if="('undefined' !== typeof data.original_name && data.original_name !== '')">
                        {{ data.original_name }}</template>
                      <template v-else-if="(data.original_name === '' && data.table_name!=='')">{{
                          data.table_name
                        }}</template>
                      <template v-else>{{ data.hyren_name }}</template>
                    </span>
                    <span :title="data.description" v-else>
                      <i class="el-icon-folder-opened"></i>{{ node.label }}
                    </span>
                  </span>
                </el-tree>
              </div>
            </el-tab-pane>
            <!-- 添加外部数据源选择面板 -->
            <el-tab-pane label="添加外部数据源" name="rightPane">
              <el-form label-width="100px" class="formClass demo-ruleForm ruleFormSe">
                <el-form-item label="数据格式 :">
                  <el-select v-model="input_type" class="Input" :disabled='editDisable'>
                    <el-option v-for="item in input_typeGroup" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <div>
                  <el-form-item v-for="(item, index) in judgeArray" :key="index" :label="item.name" :prop="item.value">
                    <el-input v-model="item.value" class="Input" v-show="item.type == 'input'"
                              :placeholder="item.placeholder"></el-input>
                    <el-select v-model="item.value" class="selectClass" v-show="item.type == 'select'"
                               :placeholder="item.placeholder">
                      <el-option v-for="item in item.options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="映射表名称">
                    <el-input v-model="input_table_name" class="Input" placeholder="映射表名称（英文、数字、下划线组合）"
                              required></el-input>
                  </el-form-item>
                  <el-form-item v-show="this.textFileRuleform[0].value == '2'" label="schema">
                    <el-input v-model="schema" class="Input" placeholder="schema"></el-input>
                  </el-form-item>
                </div>
              </el-form>
              <el-button v-if="editButtonVisible==false" type='primary' size="medium" class="saveButton"
                         @click="submitSaveJobSource('create')">保存
              </el-button>
              <el-button v-else class="saveButton " type='primary' size="medium" @click="submitSaveJobSource('edit')">
                修改
              </el-button>
              <el-button class="testButton" type='primary' size="medium" v-show="this.input_type=='2'"
                         @click="testConnection()">测试链接
              </el-button>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <!-- 左侧添加数据源面板结束 -->
        <!-- 右侧数据源列表开始 -->
        <el-col :span="16" style="border-left: 1px #e0dcdc dashed;min-height: 600px;">
          <div slot="header" class="dialogtitle el-icon-caret-right">
            <span>数据源输入列表</span>
          </div>
          <div>
            <el-table stripe border size="medium" :header-cell-style="{ textAlign: 'center' }"
                      :cell-style="{ 'text-align': 'center'}" :data="tableData"
                      style="min-height: 300px;max-height: 600px;">
              <el-table-column label="序号" type="index" width="80px"></el-table-column>
              <el-table-column label="数据源" prop="input_en_name"></el-table-column>
              <el-table-column label="映射表" prop="input_table_name"></el-table-column>
              <el-table-column label="数据来源" min-width="100" prop="input_source"></el-table-column>
              <el-table-column label="数据模式" min-width="60" prop="input_data_type">
                <template scope="scope">
                  {{ scope.row.input_data_type == '1' ? '批量表' : '流表' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="81" prop="" align="center">
                <template scope="scope">
                  <el-button size="medium" type="text" @click="clickEdit(scope.row)">编辑</el-button>
                  <el-button size="medium" type="text" @click="del(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <!-- 右侧数据源列表结束 -->
      <!-- 添加内部数据源弹窗开始 -->
    </div>
    <el-dialog :visible.sync="interiorDialog" title="添加内部数据源" id="interiorDialog" width="700px"
               :before-close="()=>{inteiorEdit = true;interiorDialog = false;closeInterior()}">
      <el-form style="width:600px;padding:0 50px" label-width="100px" label-position="left" :model="externalForm"
               ref="interiorDialog" :rules="rules">
        <el-form-item label="消息主题">
          <el-input :disabled="true" style="float:left;width:350px" v-model="externalForm.input_en_name"></el-input>
        </el-form-item>
        <el-form-item label="映射表名称" prop="outputTableName">
          <el-input placeholder="请填写映射表名称（英文、数字、下划线组合）" style="float:left;width:350px"
                    v-model="externalForm.outputTableName"></el-input>
        </el-form-item>
        <el-form-item label="偏移量设置" prop="sss_consumer_offset">
          <el-select style="float:left;width:350px" v-model="externalForm.sss_consumer_offset">
            <el-option label="earliest" value="earliest"></el-option>
            <el-option label="latest" value="latest"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="interiorDialog = false;closeInterior()" type="danger" size="small">取 消</el-button>
            <el-button v-if="inteiorEdit" type="primary" @click="saveJobInteriorSource()" size="small">确 定</el-button>
            <el-button v-else type="primary" @click="interiorDialog = false;updateJobInteriorSource()"
                       size="small">修 改</el-button>
        </span>
    </el-dialog>
    <!-- 添加内部数据源弹窗结束 -->
  </div>
</template>

<script>

export default {
  created() {
    this.judgeArray = this.textFileRuleform;
    this.resuleForm.input_data_type = '1';
    this.getDataSourceList()
  },
  watch: {
    'textFileRuleform': {
      handler() {
        this.textFileRuleform[1].value = this.fixed + '文件-' + this.getDataSoureName(this.textFileRuleform[0].value);
        this.input_source = this.textFileRuleform[1].value
      },
      immediate: true,
      deep: true
    },
    input_type() {
      if (this.input_type == "2") {
        this.judgeArray = this.dataBaseRuleform;
        this.resuleForm.input_data_type = '1';
      } else if (this.input_type == "3") {
        this.judgeArray = this.consumetopicRuleform;
        this.resuleForm.input_data_type = '2';
        this.input_source = this.fixed + 'Kafka';
      } else {
        this.judgeArray = this.textFileRuleform;
        this.resuleForm.input_data_type = '1';
      }
    },
    'dataBaseRuleform': {
      handler(newName) {
        this.input_source = this.fixed + newName[0].options[parseInt(newName[0].value) - 1].label
        switch (newName[0].value) {
          case '01':
            this.dataBaseRuleform[1].value = 'com.mysql.jdbc.Driver'
            this.dataBaseRuleform[5].value = 'jdbc:mysql://' + this.dataBaseRuleform[3].value + ':' + this.dataBaseRuleform[4].value + '/' + this.dataBaseRuleform[2].value + '?characterEncoding=utf8&zeroDateTimeBehavior=convertToNull'
            break;
          case '02':
            this.dataBaseRuleform[1].value = 'oracle.jdbc.driver.OracleDriver'
            this.dataBaseRuleform[5].value = 'jdbc:oracle:thin:@' + this.dataBaseRuleform[3].value + ':' + this.dataBaseRuleform[4].value + ':' + this.dataBaseRuleform[2].value
            break;
          case '03':
            this.dataBaseRuleform[1].value = 'oracle.jdbc.OracleDriver'
            this.dataBaseRuleform[5].value = 'jdbc:oracle:thin:@' + this.dataBaseRuleform[3].value + ':' + this.dataBaseRuleform[4].value + ':' + this.dataBaseRuleform[2].value
            break;
          case '04', '05':
            this.dataBaseRuleform[1].value = 'com.microsoft.sqlserver.jdbc.SQLServerDriver'
            this.dataBaseRuleform[5].value = 'jdbc:sqlserver://' + this.dataBaseRuleform[3].value + ':' + this.dataBaseRuleform[4].value + ';DatabaseName=' + this.dataBaseRuleform[2].value
            break;
          case '06':
            this.dataBaseRuleform[1].value = 'com.ibm.db2.jcc.DB2Driver'
            this.dataBaseRuleform[5].value = 'jdbc:db2://' + this.dataBaseRuleform[3].value + ':' + this.dataBaseRuleform[4].value + '/' + this.dataBaseRuleform[2].value
            break;
          case '07':
            this.dataBaseRuleform[1].value = 'com.sybase.jdbc2.jdbc.SybDriver'
            this.dataBaseRuleform[5].value = 'jdbc:sybase:Tds:' + this.dataBaseRuleform[3].value + ':' + this.dataBaseRuleform[4].value + '/' + this.dataBaseRuleform[2].value
            break;
          case '08':
            this.dataBaseRuleform[1].value = 'com.informix.jdbc.IfxDriver'
            this.dataBaseRuleform[5].value = 'jdbc:informix-sqli://' + this.dataBaseRuleform[3].value + ':' + this.dataBaseRuleform[4].value + '/' + this.dataBaseRuleform[2].value + ':INFORMIXSERVER=myserver'
            break;
          case '09':
            this.dataBaseRuleform[1].value = 'org.h2.Driver'
            this.dataBaseRuleform[5].value = 'jdbc:h2:tcp://' + this.dataBaseRuleform[3].value + ':' + this.dataBaseRuleform[4].value + '/' + this.dataBaseRuleform[2].value
            break;
          case '10':
            this.dataBaseRuleform[1].value = 'org.apache.derby.jdbc.EmbeddedDriver'
            this.dataBaseRuleform[5].value = 'jdbc:derby://' + this.dataBaseRuleform[3].value + ':' + this.dataBaseRuleform[4].value + '/' + this.dataBaseRuleform[2].value + ';create=true'
            break;
          case '11':
            this.dataBaseRuleform[1].value = 'org.postgresql.Driver'
            this.dataBaseRuleform[5].value = 'jdbc:postgresql://' + this.dataBaseRuleform[3].value + ':' + this.dataBaseRuleform[4].value + '/' + this.dataBaseRuleform[2].value
            break;
          case '12':
            this.dataBaseRuleform[1].value = 'com.gbase.jdbc.Driver'
            this.dataBaseRuleform[5].value = 'jdbc:gbase://' + this.dataBaseRuleform[3].value + ':' + this.dataBaseRuleform[4].value + '/' + this.dataBaseRuleform[2].value
            break;
          case '13':
            this.dataBaseRuleform[1].value = 'com.teradata.jdbc.TeraDriver'
            this.dataBaseRuleform[5].value = 'jdbc:teradata://' + this.dataBaseRuleform[3].value + '/TMODE=TERA,CHARSET=ASCII,CLIENT_CHARSET=cp936,DATABASE=' + this.dataBaseRuleform[2].value + ',lob_support=off,DBS_PORT=' + this.dataBaseRuleform[4].value
            break;
          case '14':
            this.dataBaseRuleform[1].value = 'org.postgresql.Driver'
            this.dataBaseRuleform[5].value = 'undefined' + this.dataBaseRuleform[3].value + 'undefined' + this.dataBaseRuleform[4].value + 'undefined' + this.dataBaseRuleform[2].valueundefined
            break;
          default:
            break;
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      rules: {
        outputTableName: [{required: true, message: '请输入映射表名称', trigger: 'blur'}],
        sss_consumer_offset: [{required: true, message: '请输入偏移量', trigger: 'blur'}],
      },
      editDisable: false, //编辑时不可更改数据格式。
      input_data_type: '', //1:批量表   2：流表
      ssj_job_id: this.$route.query.ssj_job_id,
      type: this.$route.query.type,
      is_in: null,
      is_out: null,
      inputTableName: '',
      editButtonVisible: false, // 保存 还是编辑 按钮的显示隐藏控制
      treeData: [], //内部数据源树信息
      interiorDialog: false, //添加内部数据源弹窗
      externalForm: {
        ssj_job_id: this.$route.query.ssj_job_id,
        outputTableName: '',
        sss_consumer_offset: '',
        input_en_name: '',
        // dsl_id input_number input_table_name: ,
        input_data_type: '2',
        input_source: '',
        input_cn_name: '',
        input_type: '3',
        sdm_info_id: '',
      },
      inteiorEdit: true,
      fixed: "外部-",
      judgeArray: [],
      isshow: false,
      schema: '',
      tabledata: {},
      tableData: [],
      activeName: 'leftPane',
      resuleForm: {},
      input_table_name: '',
      input_source: '',
      textFileRuleform: [{
        name: "文件格式 :",
        value: '1',
        type: "select",
        label: 'sst_file_type',
        description: 'type:1-Csv<CSV> 2-Parquent<PARQUENT> 3-Json<JSON>文件格式(SdmSpFileType):1-Csv<CSV> 2-Parquent<PARQUENT> 3-Json<JSON>',
        options: [
          {value: '1', label: "CSV",},
          {value: '2', label: "Parquet",},
          {value: '3', label: "Json",},
        ],
      },
        {name: "数据源名称 :", value: '', type: "input", label: 'input_source', description: '数据源名称:',},
        {
          name: "文件路径 :",
          value: "",
          type: "input",
          placeholder: "文件路径",
          label: 'sst_file_path',
          description: '文件输入输出路径:',
        },
        {
          name: "是否有表头 :",
          value: '0',
          type: "select",
          label: 'sst_is_header',
          description: '是否有表头(IsFlag):1-是<Shi> 0-否<Fou>',
          options: [{value: '0', label: "是"}, {value: '1', label: "否"},],
        },
      ],
      dataBaseRuleform: [{
        name: "数据库类型 :",
        value: '01',
        type: "select",
        label: 'ssd_database_type',
        description: '数据库类型',
        options: [
          {value: '01', label: "MYSQL"},
          {value: '02', label: "Oracle9i及以下"},
          {value: '03', label: "Oracle10g及以上"},
          {value: '04', label: "SQLSERVER2000"},
          {value: '05', label: "SQLSERVER2005"},
          {value: '06', label: "DB2"},
          {value: '07', label: "SybaseASE12.5及以上"},
          {value: '08', label: "Informatic"},
          {value: '09', label: "H2"},
          {value: '10', label: "ApacheDerby"},
          {value: '11', label: "Postgresql"},
          {value: '12', label: "GBase"},
          {value: '13', label: "TeraData"},
          {value: '14', label: "KingBase"},
        ],
      },
        {name: "驱动 :", value: "", type: "input", label: 'ssd_database_drive', description: '数据库驱动:'},
        {
          name: "数据库名称 :",
          value: "",
          type: "input",
          placeholder: "数据库名称",
          label: 'ssd_database_name',
          description: '数据库名称:'
        },
        {
          name: "数据库ip :",
          value: "",
          type: "input",
          placeholder: "数据库IP",
          label: 'ssd_ip',
          description: '数据库ip:'
        },
        {
          name: "数据库端口 :",
          value: "",
          type: "input",
          placeholder: "数据库端口",
          label: 'ssd_port',
          description: '端口:'
        },
        {name: "url ：", value: "", type: "input", label: 'ssd_jdbc_url', description: '数据库jdbc连接的url:'},
        {
          name: "用户名 ：",
          value: "",
          type: "input",
          placeholder: "用户名",
          label: 'ssd_user_name',
          description: '数据库用户名:'
        },
        {
          name: "密码 ：",
          value: "",
          type: "input",
          placeholder: "密码",
          label: 'ssd_user_password',
          description: '用户密码:'
        },
        {
          name: "原表名 ：",
          value: "",
          type: "input",
          placeholder: "原表名",
          label: 'ssd_table_name',
          description: '表名称:'
        },
      ],
      consumetopicRuleform: [{
        name: "数据来源 :",
        value: '3',
        type: "select",
        label: 'sss_kafka_version',
        description: 'kafka版本',
        options: [
          {value: '3', label: "kafka 0.10/1.0"},
          // {value: '1', label: "kafka 8"},
          // {value: '2', label: "kafka 9"},
        ],
      },
        {
          name: "消息主题 :",
          value: "",
          type: "input",
          label: 'sss_topic_name',
          description: '主题:',
          placeholder: '主题名称'
        },
        {name: "流服务主机 :", value: "", type: "input", label: 'sss_bootstrap_server', placeholder: '流服务主机'},
        {
          name: "偏移量设置 :",
          value: "",
          type: "select",
          label: 'sss_consumer_offset',
          description: '偏移量设置:',
          placeholder: '偏移量设置',
          options: [
            {value: "earliest", label: "earliest"},
            {value: "latest", label: "latest"},
          ],
        },
      ],
      input_type: '1',
      input_typeGroup: [
        {value: '1', label: "文本文件", description: ''},
        {value: '2', label: "数据库表", description: ''},
        {value: '3', label: "消息主题", description: ''},
      ],
    };
  },

  methods: {
    // 根据文件格式返回对应的value
    getDataSoureName(type) {
      if (type == '1') {
        return 'CSV'
      } else if (type == '2') {
        return 'Parquet'
      } else {
        return 'Json'
      }
    },
    //下一步
    nextStep() {
      this.$router.push({
        name: 'dataConsumptionAnalysis',
        query: {
          ssj_job_id: this.$route.query.ssj_job_id,
          ssj_job_name: this.$route.query.ssj_job_name,
          type: this.$route.query.type
        }
      })
    },
    //测试数据库连接
    testConnection() {
      let databaseTest = {}
      for (let index in this.dataBaseRuleform) {
        databaseTest[this.dataBaseRuleform[index].label] = this.dataBaseRuleform[index].value
      }
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/sdmdataoutput/testOutPutConnection', databaseTest).then((res) => {
        if (res.data == true) {
          this.$message({
            message: '链接成功',
            type: 'success'
          })
        }
      })
    },
    //表单输入内容校验
    checkForm(data) {
      if (data.input_type == '1') {
        for (let index in this.textFileRuleform) {
          if (this.textFileRuleform[index].value == "") {
            this.$message.error('请输入: ' + "'  " + this.textFileRuleform[index].name + "  '");
            return false
          }
        }
        if (data.sst_file_type == '2' && data.sst_schema == "") {
          this.$message.error('请输入: ' + "'  schema  '");
          return false
        }
      } else if (data.input_type == '2') {
        for (let index in this.dataBaseRuleform) {
          if (this.dataBaseRuleform[index].value == "") {
            this.$message.error('请输入: ' + "'  " + this.dataBaseRuleform[index].name + "  '");
            return false
          }
        }
      } else {
        for (let index in this.consumetopicRuleform) {
          if (this.consumetopicRuleform[index].value == "") {
            this.$message.error('请输入: ' + "'  " + this.consumetopicRuleform[index].name + "  '");
            return false
          }
        }
      }
      if (data.input_table_name == "" || /^\w+$/.test(data.input_table_name) == false) {
        this.$message.error('请输入: ' + "'  映射表名称!  '" + "(若已输入,请检查输入格式为:英文、数字、下划线组合)");
        return false
      }
      return true
    },
    //保存添加外部数据源
    submitSaveJobSource(type) {
      for (let index in this.textFileRuleform) {
        this.resuleForm[this.textFileRuleform[index].label] = this.textFileRuleform[index].value
      }
      for (let index in this.dataBaseRuleform) {
        this.resuleForm[this.dataBaseRuleform[index].label] = this.dataBaseRuleform[index].value
      }
      for (let index in this.consumetopicRuleform) {
        this.resuleForm[this.consumetopicRuleform[index].label] = this.consumetopicRuleform[index].value
      }
      this.resuleForm.input_type = this.input_type
      this.resuleForm.ssj_job_id = this.$route.query.ssj_job_id
      this.resuleForm.sst_schema = this.schema
      this.resuleForm.input_source = this.input_source
      this.resuleForm.input_table_name = this.input_table_name
      // this.resuleForm.input_cn_name = this.textFileRuleform[2].value
      // this.resuleForm.input_en_name = this.textFileRuleform[2].value
      if (!this.checkForm(this.resuleForm)) {
        return false
      }
      if (type == 'create') {
        delete this.resuleForm.sdm_info_id;
        this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmdataconsume/saveJobSource', this.resuleForm).then((res) => {
          if (res.success == true) {
            this.$Msg.saveSuccess(res)
            //this.getDataSourceList()
            this.$router.go(0)
          }
        });
      } else if (type == 'edit') {
        this.resuleForm.is_inner = this.resuleForm.input_source.split('-')[0] == '外部' ? 1 : 0,
            this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/updateSourceInfo', this.resuleForm).then((res) => {
              if (res.success == true) {
                this.$Msg.updateSuccess(res)
                // this.getDataSourceList()
                this.$router.go(0)
              }
            })
      }
    },
    // 获取数据源列表和内部数据源树信息
    getDataSourceList() {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/getDataSourceList', {
        ssj_job_id: this.ssj_job_id
      }).then((res) => {
        this.tableData = res.data
      });
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/geKFKTreeData').then((res) => {
        this.treeData = res.data
      })
    },
    //点击添加内部数据源信息弹窗打开
    handleNodeClick(data, e) {
      this.data_layer = data.data_layer;
      this.file_id = data.file_id;
      this.externalForm.input_cn_name = e.label
      if (e.childNodes.length == 0) {
        while (e.parent != null && e.parent.label != undefined) {
          e = e.parent
        }
      }
      this.externalForm.input_source = '内部-' + e.label
      if (data.file_id) {
        let params = {};
        params["data_layer"] = data.data_layer;
        params["data_own_type"] = data.data_own_type;
        params["file_id"] = data.file_id;
        this.$confirm('确认将该表或者消息主题添加到数据源输入列表吗？', '添加内部数据源！', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'info'
        }).then(async () => {
          this.interiorDialog = true
          this.externalForm.input_en_name = data.table_name
        }).catch(() => {
          this.$message('取消添加')
        })
      }
    },
    //保存添加内部数据源
    saveJobInteriorSource() {
      this.$refs.interiorDialog.validate(valid => {
        if (valid) {
          this.interiorDialog = false;
          delete this.externalForm.sdm_info_id
          this.externalForm.ssj_job_id = this.ssj_job_id
          this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmdataconsume/saveJobInteriorSource', this.externalForm).then((res) => {
            if (res.success == true) {
              this.$Msg.saveSuccess(res)
              this.getDataSourceList()
              this.closeInterior()
            }
          })
        }
      })
    },
    //编辑内部数据源
    updateJobInteriorSource() {
      this.externalForm.is_inner = this.externalForm.input_source.split('-')[0] == '外部' ? 1 : 0,
          this.externalForm.input_table_name = this.externalForm.outputTableName,
          this.externalForm.ssj_job_id = this.ssj_job_id
      this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmdataconsume/updateSourceInfo', this.externalForm).then((res) => {
        if (res.success == true) {
          this.$Msg.updateSuccess(res)
          this.getDataSourceList()
          this.closeInterior()
        }
      })
    },
    externalEdit(res) {
      let test = res.data.sp_jobInfo.input_source.split('-')[1]
      if (test == '文件') {
        this.input_type = res.data.sp_jobInfo.input_type
        this.textFileRuleform.forEach((item, index) => {
          for (let key in res.data.sp_jobInfo) {
            if (item.label == key) {
              item.value = res.data.sp_jobInfo[key]
            }
          }
          for (let key in res.data.sp_textInfo) {
            if (item.label == key) {
              item.value = res.data.sp_textInfo[key]
            }
          }
        })
      } else if (test == 'Kafka') {
        this.consumetopicRuleform.forEach((item, index) => {
          this.textFileRuleform[1].value = res.data.sp_jobInfo.input_source
          this.input_type = res.data.sp_jobInfo.input_type
          for (let key in res.data.sp_jobInfo) {
            if (item.label == key) {
              item.value = res.data.sp_jobInfo[key]
            }
          }
          for (let key in res.data.sp_streamInfo) {
            if (item.label == key) {
              item.value = res.data.sp_streamInfo[key]
            }
          }
        })
      } else {
        this.dataBaseRuleform.forEach((item, index) => {
          this.textFileRuleform[1].value = res.data.sp_jobInfo.input_source
          this.input_type = res.data.sp_jobInfo.input_type
          for (let key in res.data.sp_jobInfo) {
            if (item.label == key) {
              item.value = res.data.sp_jobInfo[key]
            }
          }
          for (let key in res.data.sp_dataInfo) {
            if (item.label == key) {
              item.value = res.data.sp_dataInfo[key]
            }
          }
        })
      }
      this.editButtonVisible = true;
    },
    interiorEdit(res) {
      this.interiorDialog = true
      this.externalForm.ssj_job_id = res.data.sp_jobInfo.ssj_job_id
      this.externalForm.outputTableName = res.data.sp_jobInfo.input_table_name
      this.externalForm.sss_consumer_offset = res.data.sp_streamInfo.sss_consumer_offset
      this.externalForm.input_en_name = res.data.sp_jobInfo.input_en_name
      this.externalForm.input_source = res.data.sp_jobInfo.input_source
      this.externalForm.input_cn_name = res.data.sp_jobInfo.input_cn_name
      this.externalForm.sdm_info_id = res.data.sp_streamInfo.sdm_info_id
    },
    //点击编辑
    clickEdit(data) {
      this.editDisable = true;
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/getSourceInfo', {
        sdm_info_id: data.sdm_info_id,
        is_inner: data.input_source.split('-')[0] == '外部' ? 1 : 0,
      }).then((res) => {
        this.resuleForm.sdm_info_id = res.data.sp_jobInfo.sdm_info_id
        this.input_table_name = res.data.sp_jobInfo.input_table_name
        if (res.data.sp_jobInfo.input_source.split('-')[0] == '外部') {
          this.activeName = 'rightPane'
          this.externalEdit(res)
        } else (
            this.activeName = 'leftPane',
                this.inteiorEdit = false,
                this.interiorDialog = true,
                this.interiorEdit(res)
        )
      })
    },
    //删除数据源
    del(data) {
      this.$confirm('确认删除该任务！', '确定删除？', {
        cconfirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/deleteSourceInfo', {
          sdm_info_id: data.sdm_info_id,
          is_inner: data.input_source.split('-')[0] == '外部' ? 1 : 0,
        }).then((res) => {
          this.getDataSourceList()
          if (res.success == 'true') {
            this.$Msg.deleteSuccess(res)
          }
        })
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    closeInterior() {
      this.externalForm.outputTableName = '',
          this.externalForm.sss_consumer_offset = '',
          this.externalForm.input_data_type = '2',
          this.externalForm.input_source = '',
          this.externalForm.input_cn_name = '',
          this.externalForm.input_type = '5'
    }
  },
};
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


.testButton {
  float: right;
  margin-right: 10px;
}

.saveButton {
  float: right;
  margin-right: 10px;
}

.selectClass {
  width: 100%;
  float: left;
  margin-right: 5%;
}

.formClass {
  width: 80%;
  margin: 0 auto;
}

.Input {
  width: 100%;
  float: left;
  margin-right: 5%;
}

.leftTab {
  height: 600px;
  overflow: auto;
}
</style>
