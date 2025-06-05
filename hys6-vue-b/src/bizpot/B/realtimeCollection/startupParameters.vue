<template>
  <div>
    <el-row>
      <el-col :span="4" style="margin-top: 10px">
        <span class="nav" style="font-size: 18px"><i class="el-icon-s-data"></i>启动参数</span>
      </el-col>
      <el-col :span="20" style="float: right">
        <router-link :to="{name:'streamDataAnalysis'}">
          <el-button type="primary" size="small" style="margin-left:10px" class="goIndex">返回流计算首页</el-button>
        </router-link>
        <el-button type="primary" size="small" style="margin-left:10px" class="goIndex" @click="saveStartParameters">保存并结束</el-button>
        <router-link :to="{name:'dataConsumptionOutput',query:{ssj_job_id:this.$route.query.ssj_job_id,ssj_job_name:this.$route.query.ssj_job_name,type: this.$route.query.type}}">
          <el-button type="primary" size="small" class="goIndex">上一步</el-button>
        </router-link>
      </el-col>
    </el-row>
    <div class="lines"></div>
    <div slot="title">
      <span class="dialogtitle el-icon-edit">启动参数列表</span>
    </div>
    <div style="margin-bottom:50px">
      <el-form class="form" label-width="180px">
        <el-row>
          <el-col :span='8'>
            <el-form-item label="执行引擎">
              <el-select v-model="engine" class="input">
                <el-option v-for="item in engineGroup" :key="item.value" :label="item.lable" :value="item.value"></el-option>
              </el-select>
              <el-tooltip style="float: right;margin-left: 10px;margin-top: 10px;position: absolute;" placement="top" effect="dark" class="item">
                <div slot="content" style="max-width: 200px">
                  基于什么平台跑
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span='6'>
            <el-form-item label="实时流周期">
              <el-input v-model="period" class="input"></el-input>
              <el-tooltip style="float: right;margin-left: 10px;margin-top: 10px;position: absolute;" placement="top" effect="dark" class="item">
                <div slot="content" style="max-width: 200px;">
                  实时流周期，默认单位为秒
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label=" ">
              <el-button type="primary" @click="advanced = !advanced;"><i class="el-icon-upload2" v-show="advanced == true"></i>
                <i class="el-icon-download" v-show="advanced == false"></i>高级设置</el-button>
              <el-button type="primary" style="position:absolute" @click="addVisible = true">添加自定义参数</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div v-if="advanced" class="clearfix">
            <div v-for="(item, index) in items" :key="index">
              <el-col :span='8'>
                <el-form-item :label="item.lable">
                  <el-input v-model="item.value" class="input"></el-input>
                  <el-tooltip v-show="item.toolTip != ''" style="margin-left: 10px;margin-top: 10px;position: absolute;" placement="top" effect="dark" class="item">
                    <div slot="content" style="max-width: 200px">
                      {{ item.toolTip }}
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </div>
          </div>
          <div v-if="advancedGroup.length != 0">
            <el-row>
              <div class="lines"></div>
              <div>
                <span class="dialogtitle el-icon-edit">自定义参数列表</span>
              </div>
              <div v-for="(item, index) in advancedGroup" :key="index">
                <el-col :span='8'>
                  <el-form-item :label="item.lable">
                    <el-input v-model="item.value" style="width:60%"></el-input>
                    <el-button type="primary" size="small" @click="advancedGroupedit(index)" style="margin-left:10px">编辑</el-button>
                    <el-button type="danger" size="small" style="position: absolute;margin-top:5px" @click="advancedGroupdel(index)">删除</el-button>
                  </el-form-item>
                </el-col>
              </div>
            </el-row>
          </div>
        </el-row>
      </el-form>
    </div>
    <el-dialog title="添加自定义参数" :visible.sync="addVisible" width="600px" :before-close="close">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right">添加自定义参数</span>
      </div>
      <el-form label-position="left" label-width="150px">
        <el-form-item label="自定义的参数key" style="margin-left: 50px">
          <el-input style="width: 300px" v-model="newLable"></el-input>
          <el-tooltip placement="top" effect="dark" class="item" style="margin-left: 10px">
            <div slot="content" style="max-width: 500px;font-size:14px">
              <pre>可以填启动参数,如：</pre>
              <pre>--name则填name；也可以通过启动参数传参到job,</pre>
              <pre>如下：</pre>
              <pre>streaming.sql.source.[name].[参数]则可替换batch/ss/stream.sources中任何一个参数;</pre>
              <pre>streaming.sql.out.[name].[参数]则可替换batch/ss/stream.outputs里面的任何一个参数;</pre>
              <pre>streaming.sql.params.[param-name]则表示在batch/ss/stream.sql中你是可以写表达式的,</pre>
              <pre>比如 select * from :table,</pre>
              <pre>之后你可以通过命令行streaming.sql.params.table传递该table参数</pre>
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="自定义参数的value" style="margin-left: 50px">
          <el-input style="width: 300px" v-model="newValue"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="close" type='danger' size='small'>取 消</el-button>
            <el-button type="primary" size='small' @click="confirmEdit" v-if="editbutton">修 改</el-button>
            <el-button type="primary" size='small' @click="add" v-else>确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  created() {
    if (this.$route.query.type == 'edit') {
      this.getTableData()
    }
  },
  data() {
    return {
      period: 10,
      engine: "ss",
      editbutton: false,
      editIndex: null,
      engineGroup: [
        // { lable: "spark", value: "spark" },
        // { lable: "spark_streaming", value: "spark_streaming" },
        { lable: "structured streaming", value: "ss" },
      ],
      newValue: "",
      newLable: "",
      advanced: false,
      advancedGroup: [],
      addVisible: false,
      items: [{
        params: "streaming_watermark",
        lable: "水印延迟时间",
        value: "",
        toolTip: "使引擎自动跟踪数据中的当前事件时间，并尝试相应地清除旧状态。填写方式为：10 seconds、10 minutes、10 hour 需要搭配sql中字段值为hyren_timestamp使用",
      },
        { params: "master", lable: "master", value: "local", toolTip: "" },
        {
          params: "jars",
          lable: "jars",
          value: "",
          toolTip: "执行脚本所依赖的jar包",
        },
        { params: "driver_memory", lable: "driver-memory", value: "1g", toolTip: "" },
        { params: "executor_memory", lable: "executor-memory", value: "4g", toolTip: "" },
        {
          params: "num_executors",
          lable: "num-executors",
          value: "1",
          toolTip: "用于设置spark执行Executor的数量",
        },
        {
          params: "executor_cores",
          lable: "executor-cores",
          value: "1",
          toolTip: "用于设置每个Executor进程的CPU core数量",
        },
        {
          params: "streaming_jobs",
          lable: "streaming.jobs",
          value: "",
          toolTip: "json配置文件里的job名称，按逗号分隔。如果没有配置该参数，默认运行所有job",
        },
        {
          params: "streaming_checkpoint",
          lable: "streaming.checkpoint",
          value: "",
          toolTip: "spark streaming checkpoint 目录",
        },
        {
          params: "streaming_kafka_offsetPath",
          lable: "streaming.kafka.offsetPath",
          value: "",
          toolTip: "kafka的偏移量保存目录。如果没有设置，会保存在内存中",
        },
        {
          params: "streaming_master",
          lable: "streaming.master",
          value: "",
          toolTip: "等价于第二个参数master",
        },
        {
          params: "streaming_rest",
          lable: "streaming.rest",
          value: "",
          toolTip: "是否提供http接口",
        },
        {
          params: "streaming_spark_service",
          lable: "streaming.spark.service",
          value: "",
          toolTip: "开启该选项时，streaming.platform必须为spark. 该选项会保证spark实例不会退出",
        },
        {
          params: "streaming_driver_port",
          lable: "streaming.driver.port",
          value: "",
          toolTip: "配置streaming.rest使用，streaming.rest为true,你可以设置一个http端口",
        },
        {
          params: "streaming_spark_hadoop",
          lable: "streaming.spark.hadoop.*",
          value: "",
          toolTip: "hadoop configuration,eg. -streaming.spark.hadoop.fs.defaultFS hdfs://name:8020",
        },
        {
          params: "streaming_zk_servers",
          lable: "streaming.zk.servers",
          value: "",
          toolTip: "如果把spark作为一个server,那么streamingpro会把driver地址注册到zookeeper上",
        },
        {
          params: "streaming_zk_conf_root_dir",
          lable: "streaming.zk.conf_root_dir",
          value: "",
          toolTip: "配置streaming.zk.servers使用",
        },
        {
          params: "streaming_enableHiveSupport",
          lable: "streaming.HiveSupport",
          value: "",
          toolTip: "是否支持Hive",
        },
        {
          params: "streaming_thrift",
          lable: "streaming.thrift",
          value: "",
          toolTip: "是否thrift server(jdbc连接)",
        },
      ],
    };
  },
  methods: {
    getTableData() {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdataconsume/startparametermanage/getJobParamsList',{
        ssj_job_id: this.$route.query.ssj_job_id
      }).then((res) => {
        if (!$.isEmptyObject(res.data.typical)) {
          for (let key in res.data.typical) {
            try {
              this.items.forEach(element => {
                if (element.params == key) {
                  element.value = res.data.typical[key]
                  throw new Error(key);
                }
              })
            } catch (e) {
              if (e.message != key) throw e;
            }
          }
          this.period = res.data.typical.streaming_duration
          this.engine = res.data.typical.streaming_platform
          res.data.customize.map((item) => {
            let newValue = {}
            newValue.lable = item.customize_param_key
            newValue.value = item.customize_param_value
            this.advancedGroup.push(newValue)
          })
        }
      })
    },
    //拼接参数
    merge() {
      let result = []
      this.items.map((item) => {
        let newValue = {}
        newValue.ssp_param_key = item.params
        newValue.ssp_param_value = item.value
        newValue.is_customize = '0'
        result.push(newValue)
      })
      this.advancedGroup.map((item) => {
        let newValue = {}
        newValue.ssp_param_key = item.lable
        newValue.ssp_param_value = item.value
        newValue.is_customize = '1'
        result.push(newValue)
      })
      let newValue = {}
      newValue.ssp_param_key = 'streaming_platform'
      newValue.ssp_param_value = this.engine
      newValue.is_customize = '0'
      result.push(newValue)
      newValue = {}
      newValue.ssp_param_key = 'streaming_duration'
      newValue.ssp_param_value = this.period
      newValue.is_customize = '0'
      result.push(newValue)
      return result;
    },
    //保存启动参数
    saveStartParameters() {
      let params = JSON.stringify(this.merge())
      let is_add = ''
      if (this.$route.query.type == 'edit') {
        is_add = '0'
      } else if (this.$route.query.type == 'create') {
        is_add = '0'
      } else {
        this.$Msg.customizTitle('未知编辑状态，请重新进入该页面！', 'error')
        return false
      }
      this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmdataconsume/startparametermanage/saveStartParameters',{
        sdm_sp_param: params,
        ssj_job_id: this.$route.query.ssj_job_id,
        is_add: is_add
      }).then((res) => {
        if (res.success == true) {
          this.$Msg.saveSuccess(res)
          this.$router.push({name:'streamDataAnalysis'})
        }
      })

    },
    //编辑自定义参数
    advancedGroupedit(index) {
      this.editbutton = true
      this.editIndex = index
      this.newValue = this.advancedGroup[index].value;
      this.newLable = this.advancedGroup[index].lable;
      this.addVisible = true;
    },
    //删除自定义参数
    advancedGroupdel(index) {
      this.advancedGroup.splice(index, 1)
    },

    add() { //添加自定义参数执行函数
      if (this.newValue) {
        var newValue = {
          value: this.newValue,
          lable: this.newLable,
        };
        this.advancedGroup.push(newValue);
        this.close()
      } else {
        this.$message({
          message: '请输入参数key',
          type: 'warning'
        })
      }

    },
    //编辑添加的参数
    confirmEdit() {
      var newValue = {
        value: this.newValue,
        lable: this.newLable,
      };
      this.advancedGroup.splice(this.editIndex, 1, newValue)
      this.close()
    },
    close() { //取消添加自定义参数操作
      this.editbutton = false
      this.addVisible = false;
      this.newValue = "";
      this.newLable = "";
    },
  },
};
</script>

<style scoped>
.lines {
  min-height: 1px;
  background: #dddddd;
  margin: 10px 0 15px -15px;
}

.nav {
  font-size: 20px;
  color: #2196f3;

}

.clearfix::after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.input {
  width: 80%;
}

.advancedButton {
  position: relative;
  left: 1130px;
  top: -60px;
}
</style>
