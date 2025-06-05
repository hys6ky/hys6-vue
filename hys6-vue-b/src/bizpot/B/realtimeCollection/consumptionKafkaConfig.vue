<template>
  <div>
    <el-row>
      <span style="color: #2196f3;font-size: 18px;">消费到KAFKA设置</span>
      <el-button type="primary" size="small" style="margin-left:10px" class="goIndex" @click="submit">保存</el-button>
      <router-link :to="{name:'consumptionDataConfig',query:{sdm_consum_id:this.$route.query.sdm_consum_id,type:'edit'}}">
        <el-button type="primary" size="small" class="goIndex"><i class="el-icon-s-home" style="margin-right:5px" />上一步</el-button>
      </router-link>
    </el-row>
    <div class="lines"></div>
    <div class="content">
      <!-- 分区设置 -->
      <div slot="title" class="clearfix">
        <span class="dialogtitle el-icon-edit">分区设置</span>
      </div>
      <el-form label-width="30%" label-position="right" :model="tableData" ref="tableData">
        <el-form-item label="分区 :" label-width="40%" prop="sdm_partition" :rules="filter_rules([{required: true}])" style="width:380px;">
          <el-radio-group v-model="tableData.sdm_partition">
            <el-radio label="1">随机</el-radio>
            <el-radio label="2">Key</el-radio>
            <el-radio label="3">分区</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="sdm_partition_name" v-if="tableData.sdm_partition=='2'||tableData.sdm_partition=='3'" :rules="filter_rules([{required: true}])" label-width="0">
          <el-input placeholder="流，接口" v-model="tableData.sdm_partition_name"></el-input>
        </el-form-item>
        <div class="lines" style="margin-top:15px"></div>
        <!-- 参数设置 -->
        <div>
          <span class="dialogtitle el-icon-edit">参数设置</span>
        </div>
        <el-form-item label="消息主题 :" prop="topic" :rules="filter_rules([{required: true}])">
          <el-input placeholder="消息主题" v-model="tableData.topic"></el-input>
        </el-form-item>
        <el-form-item label="流服务主机 :" prop="bootstrap_servers" :rules="filter_rules([{required: true}])">
          <el-tooltip class="item" effect="dark" content="多个用逗号隔开" placement="top">
            <el-input placeholder="127.0.0.1：0000" v-model="tableData.bootstrap_servers" style="width:340px"></el-input>
          </el-tooltip>
          <el-button type="primary" class="advanceButton" size="small" @click="advanceConfig=!advanceConfig"><i v-if="advanceConfig==false" class="el-icon-bottom" /><i v-else class="el-icon-top" />高级设置</el-button>
        </el-form-item>
        <!--参数设置-- 高级设置 -->
        <div v-show="advanceConfig" style="display:inline">
          <el-form-item label="发送成功确认等级 :" prop="acks">
            <el-input placeholder="发送成功确认等级" v-model="tableData.acks"></el-input>
          </el-form-item>
          <el-form-item label="重试次数 :" prop="retries">
            <el-input placeholder="重试次数" v-model="tableData.retries"></el-input>
          </el-form-item>
          <el-form-item label="单条记录阀值 :" prop="max_request_size">
            <el-input placeholder="单条记录阀值" v-model="tableData.max_request_size"></el-input>
          </el-form-item>
          <el-form-item label="批量大小 :" prop="batch_size">
            <el-input placeholder="批量大小" v-model="tableData.batch_size"></el-input>
          </el-form-item>
          <el-form-item label="批处理等待时间 :" prop="linger_ms">
            <el-input placeholder="批处理等待时间" v-model="tableData.linger_ms"></el-input>
          </el-form-item>
          <el-form-item label="缓存大小 :" prop="buffer_memory">
            <el-input placeholder="缓存大小" v-model="tableData.buffer_memory"></el-input>
          </el-form-item>
          <el-form-item label="压缩类型 :" prop="compression_type">
            <el-select v-model="tableData.compression_type" placeholder="压缩类型">
              <el-option label="none" value="none"></el-option>
              <el-option label="gzip" value="gzip"></el-option>
              <el-option label="snappy" value="snappy"></el-option>
              <el-option label="lz4" value="lz4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否同步 :" prop="sync">
            <el-select v-model="tableData.sync">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="拦截器 :" prop="interceptor_classes">
            <el-input placeholder="类使用拦截器的列表" v-model="tableData.interceptor_classes"></el-input>
          </el-form-item>
        </div>
        <!-- 高级设置结束 -->
        <el-form-item label="选择业务处理方式 :" prop="kafka_bus_type">
          <el-select v-model="tableData.kafka_bus_type">
            <el-option value="0" label="none"></el-option>
            <el-option value="1" label="Java"></el-option>
            <el-option value="2" label="JavaScript"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Java业务处理类 :" prop="kafka_bus_class" v-if="tableData.kafka_bus_type=='1'" :rules="filter_rules([{required: true}])">
          <el-input placeholder="Java业务处理类" v-model="tableData.kafka_bus_class"></el-input>
          <el-popover placement="bottom" title="Java业务处理类说明" width="450" trigger="click">
            <p>继承基类：KafkaToKafka<br>
              重写方法：getMessage<br>
              方法接收存在两种类型<br>
              第一种：<br>
              参数：JSONObject message （json类型数据）<br>
              返回值：JSONObject<br>
              第二种：<br>
              参数：GenericRecord message （avro类型数据）<br>
              返回值：GenericRecord<br>
              注：操作List类型的columns变量可以添加新的列、删除已有的列<br>
            </p>
            <el-button type="text" size="small" style="margin-left:10px" slot="reference">说明</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="JavaScript业务处理程序 :" prop="kafka_bus_class" v-if="tableData.kafka_bus_type=='2'" :rules="filter_rules([{required: true}])">
          <el-input placeholder="JavaScript业务处理程序" v-model="tableData.kafka_bus_class"></el-input>
          <el-popover placement="bottom" title="JavaScript业务处理程序说明" width="40" trigger="click">
            <p>实现JavaScript函数：var recordFunction=function(record){}<br>
              record分为String、Avro两种方式<br>
              String方式参数record为json格式数据<br>
              Avro方式参数record为avro格式数据<br>
              返回值只能为为stop,skip和keep中的一个<br>
              三个值代表的含义：<br>
              Stop：遇到当前数据则停止消费，进程终止。<br>
              skip：跳过，当前数据不处理。<br>
              keep：正常处理。</p>
            <el-button type="text" size="small" style="margin-left:10px" slot="reference">说明</el-button>
          </el-popover>
        </el-form-item>
        <!-- 生产端参数列表 -->
        <div>
          <el-form-item label="生产端 :" label-width="70px">
            {{productName}}
          </el-form-item>
          <div>
            <el-form-item label-width="0" style="width:100%">
              <el-table :data="productData" size="medium" ref="productData" @selection-change="handleSelectionChange" stripe :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="变量名（英文）" min-width="200px" prop="sdm_var_name_en"></el-table-column>
                <el-table-column label="变量名（中文）" min-width="200px" prop="sdm_var_name_cn"></el-table-column>
                <el-table-column label="含义" min-width="100px" prop="sdm_describe"></el-table-column>
                <el-table-column label="类型" min-width="150px" prop="sdm_var_type">
                  <template scope="scope">
                    {{scope.row.sdm_var_type=='1'?'整型':scope.row.sdm_var_type=='2'?'字符串':scope.row.sdm_var_type=='3'?'浮点数':'字节数组'}}
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </div>
        </div>
        <!-- 自定义添加列 -->
        <div style="margin-bottom:20px">
          <span class="dialogtitle el-icon-edit">自定义添加列:</span>
          <el-button size="small" type="primary" style="margin-left:50px" @click="addTable()">添加</el-button>
          <h2 style="font-weight:400;margin-bottom:20px;display:inline"></h2>
        </div>
        <el-form-item style="width:100%" label-width="0">
          <el-form :model="selfConfigObj" ref="selfConfigObj">
            <el-table stripe border size="medium" :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}" :data="selfConfigObj.selfConfig">
              <el-table-column label="序号" type="index" width="100px"></el-table-column>
              <el-table-column label="变量名（英文）" prop="sdm_col_name_en">
                <template scope="scope">
                  <el-form-item :prop="'selfConfig.'+scope.$index+'.sdm_col_name_en'" :rules="filter_rules([{required: true}])" style="width:100%">
                    <el-input v-model="scope.row.sdm_col_name_en" style="width:100%"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="变量名（中文）" prop="sdm_col_name_cn">
                <template scope="scope">
                  <el-form-item :prop="'selfConfig.'+scope.$index+'.sdm_col_name_cn'" :rules="filter_rules([{required: true}])" style="width:100%">
                    <el-input v-model="scope.row.sdm_col_name_cn" style="width:100%"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="sdm_describe" label="含义">
                <template scope="scope">
                  <el-input type='textarea' v-model="scope.row.sdm_describe" style="width:100%"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="类型" prop="sdm_var_type" width='300px'>
                <template scope="scope">
                  <el-form-item :prop="'selfConfig.'+scope.$index+'.sdm_var_type'" :rules="filter_rules([{required: true}])" style="width:100%">
                    <el-select placeholder="请选择" v-model="scope.row.sdm_var_type" style="width:100%">
                      <el-option v-for="item in inputTypeGroup" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
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
          </el-form>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      selfConfigObj: {
        selfConfig: [],
      },

      productData: [],
      dataBase_form: {},

      cus_des_type: '',
      bottomForm: {},

      inputTypeGroup: [ //消息定义的变量类型
        { value: '1', label: '整数' },
        { value: '2', label: '字符串' },
        { value: '3', label: '浮点数' },
        { value: '4', label: '字节数组' },
      ],
      advanceConfig: false,
      tableData: {
        sdm_partition: '',
        sdm_partition_name: '',
        topic: '',
        bootstrap_servers: '',
        acks: '1',
        max_request_size: '1048576',
        retries: '0',
        batch_size: '16384',
        linger_ms: '1',
        buffer_memory: '33554432',
        compression_type: 'none',
        sync: '0',
        interceptor_classes: '',
        kafka_bus_class: '',
        kafka_bus_type: '0',
        sdm_des_id: this.$route.query.sdm_des_id,
        //user_id:'',
      },
      sdm_partition: '',
      selected: [],
      productName: '',
    }
  },
  mounted() {
    this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getProducerNameMsg',{
      topic_name: this.$route.query.topic_name,
    }).then(res => {
      this.productName = res.data.toString()
    })
    this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getProduceParamsMsg',{
      sdm_receive_id: this.$route.query.sdm_receive_id,
    }).then(res => {
      this.productData = res.data
    })
    if (this.$route.query.type == 'edit') {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getManageMsg',{
        sdm_consum_id: this.$route.query.sdm_consum_id,
        sdm_des_id: this.$route.query.sdm_des_id
      }).then((res) => {
        if (res.data.kafkaMsg) {
          for (let key in res.data.kafkaMsg) {
            this.tableData[key] = res.data.kafkaMsg[key]
          }
          if (res.data.kafkaExtMsg) {
            res.data.kafkaExtMsg.map(res => {
              if (res.is_custom == '1') {
                let newValue = {}
                newValue.sdm_col_name_cn = res.sdm_col_name_cn,
                    newValue.sdm_col_name_en = res.sdm_col_name_en,
                    newValue.sdm_var_type = res.sdm_var_type,
                    newValue.is_custom = res.is_custom
                newValue.sdm_describe = res.sdm_describe
                this.selfConfigObj.selfConfig.push(newValue);
              } else {
                this.productData.forEach((ele, index) => {
                  if (res.sdm_col_name_en == ele.sdm_var_name_en) {
                    this.$refs.productData.toggleRowSelection(ele)
                  }
                })
              }
            })
          }
        } else {
          this.$route.query.type = 'create'
        }
      })
    }
  },
  methods: {
    //增加自定义行
    addTable() {
      this.selfConfigObj.selfConfig.push({
        sdm_col_name_en: "",
        sdm_col_name_cn: "",
        sdm_describe: "",
        sdm_var_type: "",
        is_custom: '1'
      })
    },
    //自定义删除行
    deleteMessInfo(index, row) {
      this.selfConfigObj.selfConfig.splice(index, 1);
    },

    //提交数据
    submit() {
      let resultForm = {}
      resultForm = this.tableData
      resultForm.sdm_des_id = this.$route.query.sdm_des_id
      resultForm.sdm_receive_id = this.$route.query.sdm_receive_id
      //resultForm.sdm_partition = this.sdm_partition
      resultForm.is_add = this.$route.query.type == 'edit' ? '0' : '1'
      this.$refs.tableData.validate(valid => {
        if (valid) {
          this.$refs.selfConfigObj.validate(valid => {
            if (valid) {
              this.selected.map(res => {
                let newValue = {}
                newValue.sdm_col_name_en = res.sdm_var_name_en
                newValue.sdm_col_name_cn = res.sdm_var_name_cn
                newValue.sdm_var_type = res.sdm_var_type
                newValue.is_custom = '0'
                this.selfConfigObj.selfConfig.push(newValue)
              })
              resultForm.sdm_con_ext_col = JSON.stringify(this.selfConfigObj.selfConfig)
              this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/saveKafkaMsg',resultForm).then(res => {
                if (res.success == true) {
                  this.$Msg.saveSuccess(res)
                  this.$router.push({
                    name: 'consumptionList',
                    query: {
                      sdm_consum_id: this.$route.query.sdm_consum_id,
                      type: 'edit'
                    }
                  })
                }
              })
            } else {
              var t = document.body.clientHeight;
              window.scroll({ top: t, left: 0, behavior: 'smooth' });
            }
          })
        }
      })
    },
    //勾选
    handleSelectionChange(val) {
      this.selected = val
    },
  }
}
</script>

<style scoped>
.nav {
  font-size: 20px;
  color: #2196f3;
}

.lines {
  min-height: 1px;
  background: #dddddd;
  margin: 4px 0 15px -30px;
}


.el-form-item {
  width: 50%;
  display: inline-block;
}

.el-input {
  width: 350px;
}

.el-select {
  width: 350px;
}

.advanceButton {
  position: absolute;
  margin-left: 10px;
}
</style>
