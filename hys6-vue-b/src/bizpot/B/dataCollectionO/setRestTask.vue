<template>
  <div>
    <el-row class='topTitle'>
      <span>数据消息流 Agent服务</span>
      <router-link :to="{name:'dataCollectionO'}">
        <el-button type="primary" size="small" class="goIndex" style="margin-left:8px">
          <i class="el-icon-back"></i>返回上一页
        </el-button>
      </router-link>
      <el-button type="primary" size="small" class="goIndex" style="margin-left:8px" @click="saveSdmReceiveConfManage()">
        保存
      </el-button>
    </el-row>
    <div class="partOne">
      <!-- 页面表单-->
      <el-form ref="form" :model="form" label-width="30%" class="formClass demo-ruleForm ruleFormSe">
        <div>
          <span class="dialogtitle el-icon-edit">数据消息流设置:</span>
        </div>
        <el-form-item label="任务名称" prop="Sdm_receive_conf.sdm_receive_name" :rules="filter_rules([{required: true}])">
          <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.sdm_receive_name" placeholder="任务名称"></el-input>
        </el-form-item>
        <el-form-item label="服务IP" prop="serve_ip">
          <el-input style="width: 300px;" v-model="serve_ip" placeholder="IP" :disabled='true'></el-input>
        </el-form-item>
        <!-- <el-form-item label="文件路径" prop="ra_file_path" hidden='true'>
            <el-input v-model="form.Sdm_receive_conf.ra_file_path" placeholder="ra_file_path"></el-input>
        </el-form-item> -->
        <el-form-item label="接收数据流端口" prop="Sdm_receive_conf.sdm_rec_port" :rules="filter_rules([{required: true}])">
          <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.sdm_rec_port" placeholder="请填写 0-65535 之间的有效端口号" onkeyup="value=value.replace(/[^\d]/g,'')">
          </el-input>
        </el-form-item>
        <el-form-item label="分区" prop="Sdm_receive_conf.sdm_partition" :rules="filter_rules([{required: true}])">
          <el-radio v-model="form.Sdm_receive_conf.sdm_partition" label="1">随机分布</el-radio>
          <el-radio v-model="form.Sdm_receive_conf.sdm_partition" label="2">key</el-radio>
          <el-radio v-model="form.Sdm_receive_conf.sdm_partition" label="3">分区</el-radio>
          <span v-if="form.Sdm_receive_conf.sdm_partition=='2' || form.Sdm_receive_conf.sdm_partition=='3'">
                    <el-input v-model="form.Sdm_receive_conf.sdm_partition_name" placeholder="流，接口" style="width:100px"></el-input>
                </span>
        </el-form-item>
        <el-form-item label="启动方式" prop="Sdm_receive_conf.run_way">
          <el-radio v-model="form.Sdm_receive_conf.run_way" label="1">立即启动</el-radio>
          <el-radio v-model="form.Sdm_receive_conf.run_way" label="2">命令触发</el-radio>
        </el-form-item>
        <el-form-item label="任务描述" prop="Sdm_receive_conf.sdm_rec_des">
          <el-input type="textarea" v-model="form.Sdm_receive_conf.sdm_rec_des" placeholder="任务描述" style="width:300px" :rows="2">
          </el-input>
        </el-form-item>
        <div class="lines"></div>
        <div>
          <span class="dialogtitle el-icon-edit">生产流参数:</span>
        </div>
        <el-row>
          <el-form-item label="消息主题" prop="Sdm_rec_param.topic" :rules="filter_rules([{required: true}])">
            <el-input style="width: 300px;" v-model="form.Sdm_rec_param.topic" placeholder="主题名称" :disabled='this.$route.query.type == "edit" ? true : null'>
            </el-input>
          </el-form-item>
          <el-form-item label="流服务主机" prop="Sdm_rec_param.bootstrap_servers">
            <el-input style="width: 300px;" size="medium" v-model="form.Sdm_rec_param.bootstrap_servers" :disabled='true'>
            </el-input>
            <el-button style="position: relative;margin-left:20px" type="primary" size="small" @click="productStreamVisible=!productStreamVisible"> 高级设置</el-button>
          </el-form-item>
        </el-row>
        <!--                                     隐藏下拉表单                                                     -->
        <div v-show="productStreamVisible">
          <el-row>
            <el-form-item label="发送成功确认等级" prop="Sdm_rec_param.acks">
              <el-input style="width: 300px;" v-model="form.Sdm_rec_param.acks" placeholder="">
              </el-input>
            </el-form-item>
            <el-form-item label="重试次数" prop="Sdm_rec_param.retries">
              <el-input style="width: 300px;" v-model="form.Sdm_rec_param.retries" placeholder="">
              </el-input>
            </el-form-item>
          </el-row>
          <el-form-item label="单条记录阈值" prop="Sdm_rec_param.max_request_size">
            <el-input style="width: 300px;" v-model="form.Sdm_rec_param.max_request_size" placeholder="">
            </el-input>
          </el-form-item>
          <el-form-item label="批量大小" prop="Sdm_rec_param.batch_size">
            <el-input style="width: 300px;" v-model="form.Sdm_rec_param.batch_size" placeholder="">
            </el-input>
          </el-form-item>
          <el-form-item label="批处理等待时间" prop="Sdm_rec_param.linger_ms">
            <el-input style="width: 300px;" v-model="form.Sdm_rec_param.linger_ms" placeholder="">
            </el-input>
          </el-form-item>
          <el-form-item label="缓存大小" prop="Sdm_rec_param.buffer_memory">
            <el-input style="width: 300px;" v-model="form.Sdm_rec_param.buffer_memory" placeholder="">
            </el-input>
          </el-form-item>
          <el-form-item label="键序列化器" prop="Sdm_rec_param.key_serializer">
            <el-select style="width: 300px;" v-model="form.Sdm_rec_param.key_serializer">
              <el-option value="String">String</el-option>
              <el-option value="Byte">Byte</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="值序列化器" prop="Sdm_rec_param.value_serializer">
            <el-select style="width: 300px;" v-model="form.Sdm_rec_param.value_serializer">
              <el-option value="String">String</el-option>
              <el-option value="Avro">Avro</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="压缩类型" prop="Sdm_rec_param.compression_type">
            <el-select style="width: 300px;" v-model="form.Sdm_rec_param.compression_type">
              <el-option value="none">none</el-option>
              <el-option value="gzip">gzip</el-option>
              <el-option value="snappy">snappy</el-option>
              <el-option value="lz4">lz4</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否同步" prop="Sdm_rec_param.sync">
            <el-select style="width: 300px;" v-model="form.Sdm_rec_param.sync">
              <el-option value="0" label="是"></el-option>
              <el-option value="1" label="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="拦截器" prop="Sdm_rec_param.interceptor_classes">
            <el-input style="width: 300px;" v-model="form.Sdm_rec_param.interceptor_classes" placeholder="类使用拦截器的列表">
            </el-input>
          </el-form-item>
        </div>
        <div class="lines"></div>
        <div>
          <span class="dialogtitle el-icon-edit">自定义业务处理:</span>
        </div>
        <el-form-item label="选择业务处理方式" prop="Sdm_receive_conf.cus_des_type">
          <el-select style="width: 300px;" v-model="form.Sdm_receive_conf.cus_des_type">
            <el-option value="0" label="none"></el-option>
            <el-option value="1" label="Java"></el-option>
            <el-option value="2" label="JavaScript"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.Sdm_receive_conf.cus_des_type=='1'" label="Java业务处理类" prop="Sdm_receive_conf.sdm_bus_pro_cla">
          <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.sdm_bus_pro_cla" placeholder="Java业务处理类" size="medium">
          </el-input>
          <el-button type="text" style="position: relative;margin-left:20px" size="small" v-if="form.Sdm_receive_conf.cus_des_type=='1'" @click="programDialog=true">说明</el-button>
        </el-form-item>
        <el-form-item v-if="form.Sdm_receive_conf.cus_des_type=='2'" label="JavaScript业务处理程序" prop="Sdm_receive_conf.sdm_bus_pro_cla">
          <el-input style="width: 300px;" type='textarea' v-model="form.Sdm_receive_conf.sdm_bus_pro_cla" placeholder="JavaScript业务处理程序" size="medium">
          </el-input>
          <el-button type="text" style="position: relative;margin-left:20px" size="small" v-if="form.Sdm_receive_conf.cus_des_type=='2'" @click="businessDialog=true">说明</el-button>
        </el-form-item>
        <div class="lines"></div>
        <div>
          <span class="dialogtitle el-icon-edit">故障报警:</span>
        </div>
        <el-row>
          <el-form-item label="故障报警方式" prop="Sdm_receive_conf.fault_alarm_mode">
            <el-select style="width: 300px;" v-model="form.Sdm_receive_conf.fault_alarm_mode">
              <el-option value="none" label="none"></el-option>
              <el-option value="email" label="Email"></el-option>
              <el-option value="snmp" label="Snmp"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接收报警的email地址" prop="Sdm_receive_conf.sdm_email" v-if="form.Sdm_receive_conf.fault_alarm_mode=='email'">
            <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.sdm_email" placeholder="请填写正确的邮箱格式">
            </el-input>
          </el-form-item>
          <el-form-item v-if="form.Sdm_receive_conf.fault_alarm_mode=='snmp'" label="接收snmp协议发送数据主机ip地址" prop="Sdm_receive_conf.snmp_ip">
            <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.snmp_ip" placeholder="请填写正确的IP地址">
            </el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="故障检查周期" prop="Sdm_receive_conf.check_cycle" v-if="form.Sdm_receive_conf.fault_alarm_mode!='none'">
          <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.check_cycle" placeholder="请填写正整数，单位：分钟">
          </el-input>
        </el-form-item>
        <div class="lines"></div>
        <div>
          <span class="dialogtitle el-icon-edit">消息定义:</span>
        </div>
        <el-form-item label="消息类型" prop="Sdm_receive_conf.msgtype" :rules="filter_rules([{required: true}])">
          <el-select style="width: 300px;" v-model="form.Sdm_receive_conf.msgtype">
            <el-option label="JSON" value="1"></el-option>
            <el-option label="URL" value="0"></el-option>
          </el-select>
        </el-form-item>
        <span v-if="form.Sdm_receive_conf.msgtype=='1'">
                <el-form-item label="参数名" prop="Sdm_receive_conf.msgheader" :rules="form.Sdm_receive_conf.msgtype=='1' ? filter_rules([{required: true}]):null">
                    <el-input style="width: 300px;" v-model="form.Sdm_receive_conf.msgheader" placeholder="参数名">
                    </el-input>
                </el-form-item>
            </span>
        <div>
          <el-button size="small" type="danger" @click="addTable()">添加</el-button>
          <el-button size="small" type="danger" style="float:right" @click="diaVisible=true">快速添加列
          </el-button>
          <el-form-item style="width:100%" label-width="0">
            <el-table stripe border size="medium" :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}" :data="form.sdmMessInfo">
              <el-table-column label="序号" type="index" width="80px"></el-table-column>
              <el-table-column label="变量名（英文）" prop="sdm_var_name_en">
                <template scope="scope">
                  <el-form-item :prop="`sdmMessInfo.${scope.$index}.sdm_var_name_en`" :rules="filter_rules([{required: true}])" style="width:100%" label-width='0'>
                    <el-input v-model="scope.row.sdm_var_name_en" style="width:100%"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="变量名（中文）" prop="sdm_var_name_cn">
                <template scope="scope">
                  <el-form-item :prop="`sdmMessInfo.${scope.$index}.sdm_var_name_cn`" :rules="filter_rules([{required: true}])" style="width:100%" label-width='0'>
                    <el-input v-model="scope.row.sdm_var_name_cn" style="width:100%"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="sdm_describe" label="含义" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="`sdmMessInfo.${scope.$index}.sdm_describe`" style="width:100%" label-width='0'>
                    <el-input size="meduim" v-model="scope.row.sdm_describe" style="width:100%"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="类型" prop="sdm_var_type" width='250px'>
                <template scope="scope">
                  <el-form-item :prop="`sdmMessInfo.${scope.$index}.sdm_var_type`" :rules="filter_rules([{required: true}])" style="width:100%" label-width='0'>
                    <el-select placeholder="请选择" v-model="scope.row.sdm_var_type">
                      <el-option v-for="item in inputTypeGroup" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="sdm_is_send" label="是否发送" align="center" width='120px'>
                <template slot-scope="scope">
                  <el-form-item :prop="`sdmMessInfo.${scope.$index}.sdm_is_send`">
                    <el-checkbox v-model="scope.row.sdm_is_send" true-label="1" false-label="0">
                    </el-checkbox>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                  <el-button type="danger" size="small" @click="deleteMessInfo(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 快速添加列弹窗 -->
    <el-dialog title="快速添加列" width="650px" :visible.sync='diaVisible' style="height:120%">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">快速添加列</span>
      </div>
      <div style="height:150px">
        <el-input :rows="6" type="textarea" v-model="quickAdd"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button type="danger" size="small" @click="diaVisible=false">取 消</el-button>
            <el-button type="primary" size="small" @click="quickAddConfirm();">确 定</el-button>
        </span>
    </el-dialog>
    <!--  Java业务处理类说明弹窗 -->
    <el-dialog :visible.sync="programDialog" title="Java业务处理类说明" width="650px">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">Java业务处理类说明</span>
      </div>
      <div>
        实现接口：BusinessProcess<br>
        发送到分为String、Avro两种方式<br>
        String：有接收两个参数参数<br>
        一：List &lt;String&gt; listColumn （定义的列集合）
        参数二：JSONObject json （json格式数据）<br>
        返回值：JSONObject<br>
        Avro：有接收两个参数<br>
        参数一：List&lt;String&gt; listColumn （定义的列集合）<br>
        参数二：GenericRecord genericRecord （avro格式数据）<br>
        返回值： GenericRecord<br>
      </div>
    </el-dialog>
    <!-- JavaScript业务处理程序说明弹窗 -->
    <el-dialog :visible.sync="businessDialog" title="JavaScript业务处理程序说明" width="35%">
      <div>
        实现JavaScript函数：var recordFunction=function(record){}<br />
        record分为String、Avro两种方式<br>
        String方式参数record为json格式数据<br>
        返回值：JSONObjectAvro<br>
        方式参数record为<br>
        Avro格式数据返回值： GenericRecord'
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      falseDialog: false,
      // dialogTable:false,
      form: {
        Sdm_receive_conf: {
          sdm_receive_name: '',
          file_readtype: "0",
          run_way: '1',
          cus_des_type: "0",
          fault_alarm_mode: "none",
          code: "1",
          ra_file_path: ''
        },
        Sdm_rec_param: {
          acks: "1",
          retries: "0",
          max_request_size: "10485760",
          batch_size: "16384",
          linger_ms: "1",
          buffer_memory: "33554432",
          key_serializer: "String",
          value_serializer: "String",
          compression_type: "none",
          sync: "1",
          messageSize: "1048576",
          topic: "",
          bootstrap_servers: "",
          interceptor_classes: ""
        },
        sdmMessInfo: [],
      },
      serve_ip: '',
      agentList: [],
      sdm_agent_id: "",
      formLabelWidth: "165px",
      size: "medium",
      sdm_param_key: "",
      sdm_param_value: "",
      fileArry: [],
      dialogFileAdd: false,
      formFileAdd: {},
      programDialog: false, //自定义业务处理说明弹窗控制
      businessDialog: false, //自定义业务处理说明弹窗控制
      viewInputFileTypeDialog: false, //查看导入文件格式弹窗控制
      diaVisible: false, //添加弹窗控制
      quickAdd: '', //快速添加
      dialogSelectfolder: false, //选择文件弹窗控制
      data2: [], //文件选择树结构列表
      inputTypeGroup: [ //消息定义的变量类型
        { value: '1', label: '整数' },
        { value: '2', label: '字符串' },
        { value: '3', label: '浮点数' },
        { value: '4', label: '字节数组' },
      ],
      hiddenshow: true, //路径选择是否可勾选
      defaultProps: { //树结构
        children: "children",
        label: "path",
        isLeaf: 'leaf'
      },
      fileMark: '',
      productStreamVisible: false, //高级设置下拉框控制
      param_list: [],
    }
  },
  mounted() {
    this.getBaseInfo()
    this.serve_ip = this.$route.query.sdm_agent_ip
  },
  methods: {
    //进入编辑页面，获取基本信息
    getBaseInfo() {
      if (this.$route.query.type == 'edit') {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmcollecttask/restjieshoutask/selectRestJieShouTask',{
          sdm_agent_id: this.$route.query.agent_id,
          sdm_receive_id: this.$route.query.sdm_receive_id
        }).then((res) => {
          this.form.Sdm_rec_param.bootstrap_servers = res.data.brokerServer
          this.form.Sdm_receive_conf = res.data.sdmReceiveInfo
          res.data.sdmParam_list.map((item) => {
            this.form.Sdm_rec_param[item.sdm_param_key] = item.sdm_param_value
          })
          this.form.sdmMessInfo = res.data.sdmMess_list
        })
      } else {
        this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/agentdeploy/getBrokerServer').then((res) => {
          this.form.Sdm_rec_param.bootstrap_servers = res.data
        })
      }
    },
    //param_list 组装
    mergeForm() {
      for (let key in this.form.Sdm_rec_param) {
        let newValue = {}
        newValue.sdm_param_key = key
        newValue.sdm_param_value = this.form.Sdm_rec_param[key]
        this.param_list.push(newValue)
      }
    },
    //保存信息
    saveSdmReceiveConfManage() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.mergeForm()
          // var data = this.form.Sdm_receive_conf;
          let data = {}
          const sdmReceiveConf = this.form.Sdm_receive_conf;
          sdmReceiveConf.sdm_agent_id = this.$route.query.agent_id;
          sdmReceiveConf.sdm_partition_name = sdmReceiveConf.sdm_partition === '1' ? null : sdmReceiveConf.sdm_partition_name;
          sdmReceiveConf.msgheader = sdmReceiveConf.msgtype === '1' ? sdmReceiveConf.msgheader : null;
          this.form.sdmMessInfo = (sdmReceiveConf.is_data_partition === '0' && sdmReceiveConf.is_obj === '0')
          || (sdmReceiveConf.is_data_partition == null && sdmReceiveConf.is_obj == null) ? [] : this.form.sdmMessInfo;
          sdmReceiveConf.sdm_bus_pro_cla = sdmReceiveConf.cus_des_type === '0' ? null : sdmReceiveConf.sdm_bus_pro_cla;
          sdmReceiveConf.check_cycle = sdmReceiveConf.fault_alarm_mode === 'none' ? null : sdmReceiveConf.check_cycle;
          sdmReceiveConf.sdm_email = sdmReceiveConf.fault_alarm_mode === 'email' ? sdmReceiveConf.sdm_email : null;
          sdmReceiveConf.snmp_ip = sdmReceiveConf.fault_alarm_mode === 'snmp' ? sdmReceiveConf.snmp_ip : null;
          data.sdmReceiveConf = JSON.stringify(sdmReceiveConf)
          data.sdmMessInfo = JSON.stringify(this.form.sdmMessInfo);
          data.sdmRecParam = JSON.stringify(this.param_list);
          // 调用添加方法
          if (this.form.Sdm_receive_conf.msgtype == '0' && this.form.sdmMessInfo.length == 0) {
            this.falseDialog = true
            this.$Msg.customizTitle('消息类型为URL，请至少添加一列消息定义', 'warning')
            return false
          } else {
            if (this.$route.query.type == 'create') {
              this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmcollecttask/restjieshoutask/saveSdmRestManage',data).then(response => {
                if (response.success == true) {
                  this.$Msg.saveSuccess(response)
                  this.$router.push({name:'dataCollectionO'})
                }
              });
            } else if (this.$route.query.type == 'edit') {
              data.sdm_receive_id = this.$route.query.sdm_receive_id
              this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmcollecttask/restjieshoutask/updateSdmRestManage',data).then(response => {
                if (response.success == true) {
                  this.$Msg.updateSuccess(response)
                  this.$router.push({name:'dataCollectionO'})
                }
              });
            } else {
              return false
            }
          }
        } else {
          return false;
        }
      });
    },
    //点击添加消息定义列表输入框
    addTable() {
      this.form.sdmMessInfo.push({
        sdm_var_name_en: "",
        sdm_var_name_cn: "",
        sdm_describe: "",
        sdm_var_type: "",
        sdm_is_send: "1"
      });
    },
    // 快速添加消息定义
    quickAddConfirm() {
      if (this.quickAdd != '') {
        let quickAddArry = []

        function unique(arr) {
          return [...new Set(arr)]
        }
        quickAddArry = unique(this.quickAdd.split(','))
        this.form.sdmMessInfo = []
        quickAddArry.map(item => {
          let newValue = {
            sdm_var_name_en: item,
            sdm_var_name_cn: item,
            sdm_describe: item,
            sdm_var_type: 2,
            sdm_is_send: "1",
          }
          this.form.sdmMessInfo.push(newValue);
        })
      }
      this.quickAdd = '';
      this.diaVisible = false;
    },
    //点击删除列表输入框
    deleteMessInfo(index, row) {
      this.form.sdmMessInfo.splice(index, 1);
    },
    // 点击添加弹出框的取消按钮
    cancleAdd() {
      this.formFileAdd = {},
      this.dialogFileAdd = false;
      this.$refs.formFileAdd.resetFields();
    },
  }
}
</script>

<style scoped>
.el-form-item {
  width: 50%;
  display: inline-block;
}

.el-input {
  width: 350px;
}

.lines {
  min-height: 1px;
  background: #dddddd;
  margin: 4px 0 15px -30px;
}
</style>
