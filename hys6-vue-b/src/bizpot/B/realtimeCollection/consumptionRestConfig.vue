<template>
  <div>
    <el-row>
      <span style="color: #2196f3;font-size: 18px;">消费到Rest设置</span>
      <el-button type="primary" size="small" style="margin-left:10px" class="goIndex" @click="submit">保存</el-button>
      <router-link :to="{name:'consumptionDataConfig',query:{sdm_consum_id:this.$route.query.sdm_consum_id,type:'edit'}}">
        <el-button type="primary" size="small" class="goIndex"><i class="el-icon-s-home" style="margin-right:5px" />上一步</el-button>
      </router-link>
    </el-row>
    <div class="lines"></div>
    <div class="content">
      <!-- Rest参数配置 -->
      <div slot="title" class="clearfix">
        <span class="dialogtitle el-icon-edit">Rest参数配置</span>
      </div>
      <el-form label-width="30%" label-position="right" :model="tableData" ref="tableData">
        <el-form-item label="rest服务ip :" prop="rest_ip" :rules="filter_rules([{required: true}])">
          <el-input placeholder="rest服务ip" v-model="tableData.rest_ip"></el-input>
        </el-form-item>
        <el-form-item label="rest服务port :" prop="rest_port" :rules="filter_rules([{required: true}])">
          <el-input placeholder="请填写0-65535之间的有效端口" v-model="tableData.rest_port"></el-input>
        </el-form-item>
        <el-form-item label="选择业务处理方式 :" prop="rest_bus_type">
          <el-select v-model="tableData.rest_bus_type">
            <el-option value="0" label="none"></el-option>
            <el-option value="1" label="Java"></el-option>
            <el-option value="2" label="JavaScript"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Java业务处理类 :" prop="rest_bus_class" v-if="tableData.rest_bus_type=='1'" :rules="filter_rules([{required: true}])">
          <el-input placeholder="Java业务处理类" v-model="tableData.rest_bus_class"></el-input>
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
        <el-form-item label="JavaScript业务处理程序 :" prop="rest_bus_class" v-if="tableData.rest_bus_type=='2'" :rules="filter_rules([{required: true}])">
          <el-input placeholder="JavaScript业务处理程序" v-model="tableData.rest_bus_class"></el-input>
          <el-popover placement="bottom" title="JavaScript业务处理程序说明" width="400" trigger="click">
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
        <!-- 生产端列表 -->
        <div>
          <el-form-item label="生产端 :" label-width="70px">
            {{productName}}
          </el-form-item>
          <div>
            <el-form-item label-width="0" style="width:100%">
              <el-table size="medium" :data="productData" ref="productData" @selection-change="handleSelectionChange" stripe :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
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
      tableData: {
        rest_port: '',
        rest_ip: '',
        //rest_parameter:'',
        //remark:'',
        rest_bus_class: '',
        rest_bus_type: '0',
        sdm_des_id: this.$route.query.sdm_des_id,
        //user_id:'',
      },

      productData: [{
        //sdm_col_id:'',
        sdm_col_name_en: '',
        sdm_col_name_cn: '',
        sdm_describe: '',
        sdm_var_type: '',
        //remark:'',
      }],
      selfConfigObj: {
        selfConfig: [],
      },

      is_add: this.$route.query.type == 'edit' ? '0' : '1',

      inputTypeGroup: [ //消息定义的变量类型
        { value: '1', label: '整数' },
        { value: '2', label: '字符串' },
        { value: '3', label: '浮点数' },
        { value: '4', label: '字节数组' },
      ],
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
        if (res.data.restMsg) {
          for (let key in res.data.restMsg) {
            this.tableData[key] = res.data.restMsg[key]
          }
          res.data.restExtMsg.map(res => {
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
    //保存信息至Rest
    submit() {
      let resultForm = {}
      resultForm = this.tableData
      resultForm.sdm_des_id = this.$route.query.sdm_des_id
      resultForm.sdm_receive_id = this.$route.query.sdm_receive_id
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
              this.$executeRequest.execPostByModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/saveRestMsg',resultForm).then((res) => {
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
</style>
