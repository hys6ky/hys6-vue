<template>
  <div>
    <el-row>
      <span style="color: #2196f3;font-size: 18px;">消费到Hbase设置</span>
      <el-button type="primary" size="small" style="margin-left:10px" class="goIndex" @click="submit">保存</el-button>
      <router-link :to="{name:'consumptionDataConfig',query:{sdm_consum_id:this.$route.query.sdm_consum_id,type:'edit'}}">
        <el-button type="primary" size="small" class="goIndex"><i class="el-icon-s-home" style="margin-right:5px" />上一步</el-button>
      </router-link>
    </el-row>
    <div class="lines"></div>
    <div class="content">
      <!-- Hbase参数配置  -->
      <div slot="title">
        <span class="dialogtitle el-icon-edit">Hbase参数配置:</span>
      </div>
      <el-form label-width="30%" label-position="right" :model="tableData" ref="tableData">
        <!-- 数据库信息 -->
        <el-form-item label="数据库 :" prop="dsl_name">
          <el-input placeholder="数据库" v-model="dataBase_form.dsl_name" :disabled='true'></el-input>
        </el-form-item>
        <!-- <el-form-item label="数据库服务器IP :" prop="sdm_db_ip">
                <el-input v-model="dataBase_form.sdm_db_ip" placeholder="数据库服务器IP"></el-input>
            </el-form-item> -->
        <el-form-item label="数据库驱动 :" prop="sdm_db_driver">
          <el-input v-model="dataBase_form.ssd_database_drive" placeholder="数据库驱动" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="数据库地址 :" prop="jdbc_url">
          <el-input v-model="dataBase_form.jdbc_url" placeholder="数据库端口" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="用户名 :" prop="sdm_db_user">
          <el-input v-model="dataBase_form.ssd_user_name" placeholder="用户名" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="数据库名称 :" prop="database_name">
          <el-input v-model="dataBase_form.database_name" placeholder="数据库名称" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="密码 :" prop="sdm_db_pwd">
          <el-input type="password" v-model="dataBase_form.ssd_user_password" placeholder="密码" :disabled='true'></el-input>
        </el-form-item>
        <div class="lines" style="margin-top:15px"></div>
        <!-- Hbase表信息 -->
        <div>
          <span class="dialogtitle el-icon-edit">Hbase表信息:</span>
        </div>
        <el-form-item label="hbase表名 :" prop="hbase_name" :rules="filter_rules([{required: true}])">
          <el-input placeholder="hbase表名" v-model="tableData.hbase_name"></el-input>
        </el-form-item>
        <el-form-item label="columnFamily :" prop="hbase_family" :rules="filter_rules([{required: true}])">
          <el-input placeholder="列簇:" v-model="tableData.hbase_family"></el-input>
        </el-form-item>
        <el-form-item label="选择业务处理方式 :" prop="hbase_bus_type">
          <el-select v-model="tableData.hbase_bus_type">
            <el-option value="0" label="none"></el-option>
            <el-option value="1" label="Java"></el-option>
            <el-option value="2" label="JavaScript"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Java业务处理类 :" prop="hbase_bus_class" v-if="tableData.hbase_bus_type=='1'">
          <el-input placeholder="Java业务处理类" v-model="tableData.hbase_bus_class"></el-input>
          <el-popover placement="bottom" title="Java业务处理类说明" trigger="click">
            <p>继承基类：HbaseOperator<br>
              重写方法：getMessage<br>
              方法接收的参数存在两种类型<br>
              第一种：<br>
              参数：JSONObject message （json类型数据）<br>
              返回值：JSONObject<br>
              第二种：<br>
              参数：GenericRecord message （avro类型数据）<br>
              返回值：GenericRecord<br>
              注：操作List类型的columns变量可以添加新的列和删除已有的列<br>
            </p>
            <el-button type="text" size="small" style="margin-left:10px" slot="reference">说明</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="JavaScript业务处理程序 :" prop="hbase_bus_class" v-if="tableData.hbase_bus_type=='2'">
          <el-input placeholder="JavaScript业务处理程序" v-model="tableData.hbase_bus_class"></el-input>
          <el-popover placement="bottom" title="JavaScript业务处理程序说明" trigger="click">
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
          <el-form-item label="生产端 :" label-width="70px"> {{productName}}
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="defineRowKey">自定义rowKey和预分区</el-button>
          </el-form-item>
          <div>
            <el-form-item label-width="0" style="width:100%">
              <el-table size="medium" :data="productData" ref="productData" @selection-change="handleSelectionChange" stripe :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="变量名（英文）" min-width="200px" prop="sdm_var_name_en"></el-table-column>
                <el-table-column label="变量名（中文）" min-width="200px" prop="sdm_var_name_cn"></el-table-column>
                <el-table-column label="含义" min-width="100px" prop="sdm_describe"></el-table-column>
                <el-table-column label="是否为空" min-width="100px" prop="is_null">
                  <template scope="scope">
                    <el-checkbox v-model="scope.row.is_null" true-label="1" false-label="0"></el-checkbox>
                  </template>
                </el-table-column>
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
              <el-table-column label="字段英文" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-form-item :prop="'selfConfig.'+scope.$index+'.column_name'" style="width:100%">
                    <el-input v-model="scope.row.column_name" placeholder="字段英文" style="width:100%"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="字段中文名称" align="center">
                <template slot-scope="scope">
                  <el-form-item :prop="'selfConfig.'+scope.$index+'.field_ch_name'" style="width:100%">
                    <el-input v-model="scope.row.field_ch_name" placeholder="字段中文名称" style="width:100%"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="字段类型" prop="column_type">
                <template scope="scope">
                  <el-form-item :prop="'selfConfig.'+scope.$index+'.column_type'" style="width:100%">
                    <el-select placeholder="请选择" v-model="scope.row.column_type" style="width:100%">
                      <el-option v-for="item in inputTypeGroup" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="是否为空" align="center" width="100">
                <template slot-scope="scope">
                  <el-checkbox :true-label="1" :false-label="0" v-model="scope.row.is_null"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column v-if='iskey' label="是否为主键" align="center">
                <template slot-scope="scope">
                  <el-checkbox :true-label="'1'" :false-label="'0'" v-model="scope.row.iskey"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column v-if='isrowkey' label="是否为rowkey" align="center">
                <template slot-scope="scope">
                  <el-checkbox :true-label="'1'" :false-label="'0'" v-model="scope.row.isrowkey"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column v-if='issyl' label="是否为索引列" align="center">
                <template slot-scope="scope">
                  <el-checkbox :true-label="'1'" :false-label="'0'" v-model="scope.row.issyl"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column v-if='isyjhl' label="是否为预聚合列" align="center">
                <template slot-scope="scope">
                  <el-checkbox :true-label="'1'" :false-label="'0'" v-model="scope.row.isyjhl"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column v-if='ispxl' label="是否为排序列" align="center">
                <template slot-scope="scope">
                  <el-checkbox :true-label="'1'" :false-label="'0'" v-model="scope.row.ispxl"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column v-if='isfql' label="是否为分区列" align="center">
                <template slot-scope="scope">
                  <el-checkbox :true-label="'1'" :false-label="'0'" v-model="scope.row.isfql"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.dq_remark" type="textarea" placeholder="备注" size="mini"></el-input>
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
        <!-- 自定义rowKey和预分区弹窗 -->
        <el-dialog :visible.sync='defineRowKeyDialog' width="1000px">
                <span slot="title">
                    <i class="el-icon-warning" />
                    请选择自定义列作为Hbase的rowkey(不选默认为一行所有列计算的MD5值)
                </span>
          <el-form-item label="定义多列做rowkey的分隔符:" style="width:500px" label-width="200px" prop="rowkey_separator">
            <el-input style="width:250px" v-model="tableData.rowkey_separator"></el-input>
          </el-form-item>
          <el-form-item label="预分区数:" style="width:400px" prop="pre_partition">
            <el-input style="width:250px" v-model="tableData.pre_partition"></el-input>
          </el-form-item>
          <el-form-item style="width:100%" label-width="0">
            <el-table :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}" stripe>
              <el-table-column label="多列作rowkey的顺序"></el-table-column>
              <el-table-column label="字段英文名"></el-table-column>
              <el-table-column label="操作" width="100px">
                <template scope="scope">
                  <el-button @click="topMove(scope.row,scope.$index)">上移</el-button>
                  <el-button>[]</el-button>
                  <el-button @click="downMove(scope.row,scope.$index)">下移</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="defineRowKeyDialog = false">确 定</el-button>
                </span>
        </el-dialog>
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

      advanceConfig: false,
      tableData: {
        hbase_name: '',
        hbase_family: '',
        pre_partition: '',
        rowkey_separator: '',
        hbase_bus_class: '',
        hbase_bus_type: '0',
      },
      sdm_partition: '',
      defineRowKeyDialog: false,
      inputTypeGroup: [], //消息定义的变量类型
      iskey: false, //是否主键
      isrowkey: false, //是否rowkey
      issyl: false, //是否索引列
      isyjhl: false, //是否预聚合列
      isfql: false, //是否分区列
      ispxl: false, //是否排序
      iskeyId: '', //是否主键
      isrowkeyId: '', //是否rowkey
      issylId: '', //是否索引列
      isyjhlId: '', //是否预聚合列
      isfqlId: '', //是否分区列
      ispxlId: '', //是否排序
      CollectType: [],
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
    this.getTableData()
    this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getProduceParamsMsg',{
      sdm_receive_id: this.$route.query.sdm_receive_id,
    }).then(res => {
      this.productData = res.data
    })
    let params = {};
    params["category"] = "StoreLayerAdded";
    this.$Code.getCategoryItems(params).then(res => {
      this.CollectType = res.data ? res.data : [];
    });
    this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getStorageLayerConfInfo',{
      dsl_id: this.$route.query.dsl_id,
    }).then(res => {
      this.inputTypeGroup = res.data.filedTypes
      if (res.data.dsl_added_s.length > 0) {
        let typeArr = res.data.dsl_added_s
        for (let i = 0; i < typeArr.length; i++) {
          for (let j = 0; j < this.CollectType.length; j++) {
            if (typeArr[i].dsla_storelayer == this.CollectType[j].code) {
              if (this.CollectType[j].value == '主键') {
                this.iskey = true
                this.iskeyId = typeArr[i].dslad_id
              } else if (this.CollectType[j].value == 'rowkey') {
                this.isrowkey = true
                this.isrowkeyId = typeArr[i].dslad_id
              } else if (this.CollectType[j].value == '索引列') {
                this.issyl = true
                this.issylId = typeArr[i].dslad_id
              } else if (this.CollectType[j].value == '预聚合列') {
                this.isyjhl = true
                this.isyjhlId = typeArr[i].dslad_id
              } else if (this.CollectType[j].value == '分区列') {
                this.isfql = true
                this.isfqlId = typeArr[i].dslad_id
              } else if (this.CollectType[j].value == '排序列') {
                this.ispxl = true
                this.ispxlId = typeArr[i].dslad_id
              }
            }
          }
        }
      }
    });
    if (this.$route.query.type == 'edit') {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getManageMsg',{
        sdm_consum_id: this.$route.query.sdm_consum_id,
        sdm_des_id: this.$route.query.sdm_des_id
      }).then((res) => {
        if (res.data.dataMsg) {
          for (let key in res.data.dataMsg) {
            this.dataBaseTable[key] = res.data.dataMsg[key]
          }
          if (res.data.paramsList) {
            let tran = JSON.parse(res.data.paramsList[1])
            tran.map(res => {
              if (res.is_custom == '1') {
                let newValue = this.add()
                newValue.field_ch_name = res.sdm_col_name_cn,
                    newValue.column_name = res.sdm_col_name_en,
                    newValue.column_type = res.sdm_var_type == 'VARCHAR(30)' ? 'VARCHAR' : res.sdm_var_type,
                    newValue.is_null = res.is_empty,
                    newValue.dq_remark = res.remark
                this.selfConfigObj.selfConfig.push(newValue);
              } else {
                this.productData.forEach((ele, index) => {
                  if (res.sdm_col_name_en == ele.sdm_var_name_en) {
                    ele.is_null = res.is_empty
                    ele.sdm_var_type = ele.sdm_var_type == 'VARCHAR(30)' ? 'VARCHAR' : ele.sdm_var_type
                    this.$refs.productData.toggleRowSelection(ele)
                  }
                })
              }
            })
            let tranadd = JSON.parse(res.data.paramsList[0])
            tranadd.map(res => {
              let newValue = this.add()
              newValue.field_ch_name = res.sdm_col_name_cn,
                  newValue.column_name = res.sdm_col_name_en,
                  newValue.column_type = res.sdm_var_type == 'VARCHAR(30)' ? 'VARCHAR' : res.sdm_var_type,
                  newValue.is_null = res.is_empty,
                  newValue.dq_remark = res.remark,
                  res.dsla_storelayer.map(ele => {
                    this.CollectType.map(ele1 => {
                      if (ele == ele1.code) {
                        if (ele1.value == '主键') {
                          newValue.iskey = true
                        } else if (ele1.value == 'rowkey') {
                          newValue.isrowkey = true
                        } else if (ele1.value == '索引列') {
                          newValue.issyl = true
                        } else if (ele1.value == '预聚合列') {
                          newValue.isyjhl = true
                        } else if (ele1.value == '分区列') {
                          newValue.isfql = true
                        } else if (ele1.value == '排序列') {
                          newValue.ispxl = true
                        }
                      }
                    })
                  })
              this.selfConfigObj.selfConfig.push(newValue);
            })
          }
        } else {
          this.$route.query.type = 'create'
        }
      })
    }
  },
  methods: {
    //获取数据库信息
    getTableData() {
      this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/getStorageLayerConfInfo',{
        "dsl_id": this.$route.query.dsl_id
      }).then((res) => {
        if (res.data.store_type == '2') {
          this.hiveType = true
        };
        this.dataBase_form.dsl_name = res.data.dsl_name
        if (res.data.dsl_attr_s) {
          let arr = res.data.dsl_attr_s
          for (let i = 0; i < arr.length; i++) {
            // if (arr[i].storage_property_key == 'database_type') {
            //     this.dataBase_form.ssd_database_type = arr[i].storage_property_val
            // }
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
              this.dataBase_form.jdbc_url = arr[i].storage_property_val
            }
            if (arr[i].storage_property_key == "database_name") {
              this.dataBase_form.database_name = arr[i].storage_property_val
            }
            // if (arr[i].storage_property_key == "database_ip") {
            //     this.dataBase_form.ssd_ip = arr[i].storage_property_val
            // }
            if (arr[i].storage_property_key == "database_port") {
              this.dataBase_form.ssd_port = arr[i].storage_property_val
            }
          };
          //从地址中获取ip和端口
          //      var reg = /(\d{1,3}\.){3}\d{1,3}\:\d{1,5}/g
          //  let detail =   reg.exec(this.dataBase_form.jdbc_url);
          // this.prot = detail[0].split(':')[1],
          // this.ip = detail[0].split(':')[0];
        }
      })
    },
    //列表勾选
    handleSelectionChange(val) {
      this.selected = val
    },
    //自定义rowKey
    defineRowKey() {
      this.defineRowKeyDialog = true
    },
    //增加自定义行
    addTable() {
      let newValue = this.add()
      this.selfConfigObj.selfConfig.push(newValue)
    },
    add() {
      let newValue = {}
      newValue.field_ch_name = '',
          newValue.column_name = '',
          newValue.column_type = '',
          newValue.is_null = 0,
          newValue.dq_remark = '',
          newValue.is_custom = '1'
      return newValue
    },
    //自定义删除行
    deleteMessInfo(index, row) {
      this.selfConfigObj.selfConfig.splice(index, 1);
    },
    //提交数据
    submit() {
      let resultForm = {}
      resultForm = JSON.parse(JSON.stringify(this.$route.query))
      delete resultForm.type
      resultForm.sdm_consum_id
      for (let key in this.tableData) {
        resultForm[key] = this.tableData[key]
      }
      resultForm.is_add = this.$route.query.type == 'edit' ? '0' : '1'
      try {
        this.$refs.tableData.validate(valid => {
          // if (valid) {
          //     if (this.selfConfigObj.selfConfig.length == 0) {
          //         this.$Msg.customizTitle("至少新增一行字段", 'warning');
          //         throw SyntaxError()
          //     } else {
          this.$refs.selfConfigObj.validate(valid => {
            if (valid) {
              for (let i = 0; i < this.selfConfigObj.selfConfig.length; i++) {
                this.selfConfigObj.selfConfig[i].dslad_id_s = []
                if (this.selfConfigObj.selfConfig[i].iskey == '1') {
                  this.selfConfigObj.selfConfig[i].dslad_id_s.push(this.iskeyId)
                }
                if (this.selfConfigObj.selfConfig[i].isrowkey == '1') {
                  this.selfConfigObj.selfConfig[i].dslad_id_s.push(this.isrowkeyId)
                }
                if (this.selfConfigObj.selfConfig[i].issyl == '1') {
                  this.selfConfigObj.selfConfig[i].dslad_id_s.push(this.issylId)
                }
                if (this.selfConfigObj.selfConfig[i].isyjhl == '1') {
                  this.selfConfigObj.selfConfig[i].dslad_id_s.push(this.isyjhlId)
                }
                if (this.selfConfigObj.selfConfig[i].isfql == '1') {
                  this.selfConfigObj.selfConfig[i].dslad_id_s.push(this.isfqlId)
                }
                if (this.selfConfigObj.selfConfig[i].ispxl == '1') {
                  this.selfConfigObj.selfConfig[i].dslad_id_s.push(this.ispxlId)
                }
              }
              this.selected.map(res => {
                let newValue = this.add()
                newValue.column_name = res.sdm_var_name_en
                newValue.field_ch_name = res.sdm_var_name_cn
                newValue.is_null = res.is_null == '1' ? '1' : '0',
                    newValue.is_custom = '0'
                newValue.column_type = res.sdm_var_type == '1' ? 'INT' : res.sdm_var_type == '2' ? 'STRING' : res.sdm_var_type == '3' ? 'FLOAT' : 'VARCHAR'
                this.selfConfigObj.selfConfig.push(newValue)
              })
              this.selfConfigObj.selfConfig.forEach(res => {
                res.column_type = res.column_type == 'VARCHAR' ? 'VARCHAR(30)' : res.column_type
              })
              resultForm.dqTableColumnBeans = JSON.stringify(this.selfConfigObj.selfConfig)
              this.$executeRequest.execGetByPostModuleUrl('/dataCollectionO/sdmdatadistribute/consumeroperation/saveHbaseMsg',resultForm).then((res) => {
                if (res.success != undefined && res.success == true) {
                  this.$Msg.saveSuccess(res)
                  this.$router.push({
                    name: 'consumptionList',
                    query: { sdm_consum_id: this.$route.query.sdm_consum_id, type: 'edit' }
                  })
                }
              })
            } else {
              var t = document.body.clientHeight;
              window.scroll({ top: t, left: 0, behavior: 'smooth' });
              throw SyntaxError()
            }
          })
          // }
          // } else {
          //     throw SyntaxError()
          // }
        })
      } catch (error) {
        return false
      }
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
