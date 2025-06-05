<template>
  <div class="px-20 pb-20 dataStoreAction">
    <div class="d-flex py-10 justify-content-between">
      <ByHeaderSlice title="数据存储层定义"/>
      <el-tooltip placement="right" effect="dark" content="存储层信息变动，采集Agent需要重新部署！！！">
        <i class="fa fa-question-circle" aria-hidden="true" style="margin-right: 20px; margin-top: 12px"/>
      </el-tooltip>
    </div>
    <el-row class="partOne">
      <el-form ref="form" :model="form" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-col :span="20">
              <el-form-item label="存储层名称" prop="dsl_name" :rules="filter_rules([{ required: true }])">
                <el-input v-model="form.dsl_name" placeholder="请输入名称"/>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="20">
              <el-form-item label="存储层存储类型" prop="store_type" :rules="rule.selected">
                <el-select v-model="form.store_type" placeholder="请选择存储类型" @change="changedata"
                           style="width: 100%;">
                  <el-option v-for="item in storeType" :key="item.value" :label="item.value" :value="item.code"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-col :span="20">
              <el-form-item label="存储层备注">
                <el-input v-model="form.dsl_remark" placeholder="存储层备注"/>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="20">
              <el-form-item label="存储层类型">
                <el-checkbox true-label="1" false-label="0" v-model="form.dsl_source">源库</el-checkbox>
                <el-checkbox true-label="1" false-label="0" v-model="form.dsl_goal">目标库</el-checkbox>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否支持外部表" prop="is_hadoopclient" :rules="rule.selected" label-width="150px">
              <el-radio-group v-model="form.is_hadoopclient">
                <el-radio v-for="item in YesNo" :key="item.value" :label="item.code" @change="changeHadoopclient">
                  {{ item.value }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附加信息">
              <el-checkbox-group v-model="form.dsla_storelayer">
                <el-checkbox v-for="item in checkboxType" :key="item.value" :label="item.value" :value="item.code"/>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="saveDataSpan">数据存储层属性</el-row>
        <el-tooltip placement="right" effect="light" v-if="showAddBtn">
          <div slot="content">
            <el-link type="primary">{{ store_type_ch }}--存储层可参数说明:</el-link>
            <br/>
            <span v-for="item in storageLayerParamInfo" :key="item.key">
              <el-link type="danger">{{ item.key }}</el-link>
              : {{ item.value }}<br/>
            </span>
          </div>
          <span><i class="el-icon-info"/></span>
        </el-tooltip>
        <el-button size="mini" class="partTwoBtn" v-if="showAddBtn" type="success" @click="addDataStoreLayerAttr('0')">
          添加行
        </el-button>
        <el-button size="mini" class="partTwoBtn" v-if="showAddFileBtn" type="success"
                   @click="addDataStoreLayerAttr('1')">
          添加文件行
        </el-button>
        <el-button type="success" size="mini" class="partTwoBtn" v-if="form.store_type" :loading="linkloading"
                   @click="testConnection()">
          测试连接
        </el-button>
        <el-button type="primary" size="mini" class="partTwoBtn" v-if="form.store_type"
                   @click="dialogFormJarUpload=true">
          上传驱动测试连接
        </el-button>
        <!--数据存储属性-->
        <el-table :data="form.dataStoreLayerAttr" border stripe size="medium">
          <el-table-column type="index" label="序号" width="100" align="center" :key="1"/>
          <el-table-column prop="storage_property_key" label="key" align="center" :key="2">
            <template v-slot="scope">
              <el-form-item :prop="`dataStoreLayerAttr.${scope.$index}.storage_property_key`"
                            :rules="filter_rules([{ required: true }])">
                <!--固定的key-->
                <el-input size="medium" disabled v-if="scope.$index < numberCount"
                          v-model="scope.row.storage_property_key"/>
                <!--增加的key-->
                <el-input size="medium" v-else v-model="scope.row.storage_property_key"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="value" prop="storage_property_val" align="center" :key="3">
            <template v-slot="scope">
              <!--关系型数据库类型参数值value-->
              <el-form-item v-if="scope.row.storage_property_key === 'database_type'" align="left"
                            :prop="`dataStoreLayerAttr.${scope.$index}.storage_property_val`" :rules="rule.selected">
                <el-select v-model="scope.row.storage_property_val" @change="getAttrKeyByDatabaseType"
                           style="width: 90%">
                  <el-option v-for="(item, index) in databaseType" :key="index" :value="item.database_name"/>
                </el-select>
                <el-tooltip class="item" effect="dark"
                            content="数据库类型为DB2,如果直接写数据库名称不行,请在数据库名称后面加上:currentSchema=schema;,最后这个分号不能丢"
                            placement="right">
                  <i class="el-icon-question" aria-hidden="true"
                     style="margin-top: 12px;font-size: 16px;margin-left: 5px;color: #000;"/>
                </el-tooltip>
              </el-form-item>
              <!--非关系型数据库参数值value-->
              <el-form-item v-else-if="scope.row.is_file === '0'" align="left"
                            :prop="`dataStoreLayerAttr.${scope.$index}.storage_property_val`"
                            :rules="filter_rules([{ required: true }])">
                <el-input size="medium" v-model="scope.row.storage_property_val" @input="jdbcUrlFun(scope.row)"
                          style="width: 90%"/>
                <el-tooltip v-if="scope.row.storage_property_key === 'jdbc_url'" class="item" effect="dark"
                            content="数据库类型为DB2,如果直接写数据库名称不行,请在url后面加上:currentSchema=schema;,最后这个分号不能丢"
                            placement="right">
                  <i class="el-icon-question" aria-hidden="true"
                     style="margin-top: 12px;font-size: 16px;margin-left: 5px;color: #000;"/>
                </el-tooltip>
              </el-form-item>
              <el-upload v-else-if="scope.row.is_file === '1'" class="upload-demo" ref="upload" :file-list="fileList"
                         action="" :auto-upload="false" :on-change="handleChange" :on-remove="removeFile"
                         style="width: 90%">
                <el-button size="small" type="info" @click="selectFile(scope.$index, scope.row)">选择文件</el-button>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column prop="dsla_remark" label="描述" align="center">
            <template v-slot="scope">
              <el-form-item>
                <el-input type="textarea" v-model="scope.row.dsla_remark" autosize/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="text" size="small" v-if="scope.$index < numberCount" disabled>删除</el-button>
              <el-button type="text" size="small" v-else @click="deleteArray(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-row>
    <el-row>
      <div class="elButton">
        <el-button type="primary" size="medium" @click="cancelSave">取消</el-button>
        <el-button type="primary" size="medium" @click="saveData('form')">保存</el-button>
      </div>
    </el-row>
    <!-- 上传驱动jar -->
    <el-dialog title="上传驱动jar文件" :visible.sync="dialogFormJarUpload" width="30%" :before-close="cancel">
      <el-form :model="formUpload" ref="formUpload">
        <el-form-item label="选择文件">
          <el-upload  ref="upload" :fileList="driverFileList" action="" :auto-upload="false"
                     :on-change="handleDriverFileChange">
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="mini" type="danger">取 消</el-button>
        <el-button type="primary" @click="testConnectionByDriver('formUpload')" size="mini">测试连接</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import * as message from "@/utils/message";

export default {
  name: "addDataStorelayer",
  data() {
    return {
      dialogFormJarUpload: false,
      formUpload: {},
      formLabelWidth: "150px",
      linkloading: false,
      driverFileList: [],
      form: {
        dsl_name: "",
        store_type: "",
        dsl_remark: "",
        dsl_source: "1",
        dsl_goal: "1",
        dsla_storelayer: [],
        dataStoreLayerAttr: [],
        is_hadoopclient: "0",
      },
      rule: validator.default,
      storeType: [],
      checkboxType: [],
      store_type_ch: "",
      fileArray: [],
      ipPlaceholder: "",
      portPlaceholder: "",
      urlPrefix: "",
      urlSuffix: "",
      db_name: "",
      numberCount: 0,
      showAddBtn: false,
      showAddFileBtn: false,
      storageLayerParamInfo: [],
      databaseData: [
        {
          key: "database_type",
          value: "数据库类型",
        },
        {
          key: "database_driver",
          value: "数据库驱动",
        },
        {
          key: "jdbc_url",
          value: "数据库连接url地址",
        },
        {
          key: "database_name",
          value: "数据库名称",
        },
        {
          key: "database_pwd",
          value: "数据库密码",
        },
        {
          key: "user_name",
          value: "用户名",
        },
        {
          key: "sftp_host",
          value: "数据库服务器所在主机sftp的ip,支持外部表时使用",
        },
        {
          key: "sftp_port",
          value: "数据库服务器所在主机sftp的端口,支持外部表时使用",
        },
        {
          key: "sftp_user",
          value: "数据库服务器所在主机sftp指定的用户名,支持外部表时使用",
        },
        {
          key: "sftp_pwd",
          value: "数据库服务器所在主机sftp用户对应的密码,支持外部表时使用",
        },
        {
          key: "external_root_path",
          value: "指定sftp文件到数据库服务器所在主机的根目录,支持外部表时使用",
        },
        {
          key: "external_director",
          value:
              "oracle服务器外部表loader文件目录对应的对象名称," +
              "oracle的dba需要执行 create directory 'external_directory' as 'external_root_path',支持外部表时使用",
        },
        {
          key: "database_code",
          value:
              "数据库的编码，本系统支持的参数为： UTF-8、GBK、UTF-16、GB2312、ISO-8859-1,支持外部表时使用",
        },
        {
          key: "minPoolSize",
          value: "数据库连接池的参数，最小连接数，非必须",
        },
        {
          key: "maxPoolSize",
          value: "数据库连接池的参数,最大连接数，非必须",
        },
        {
          key: "fetch_size",
          value: "连接是设置拉取批次的大小，非必须",
        },
      ],
      hiveData: [
        {
          key: "database_driver",
          value: "数据库驱动",
        },
        {
          key: "jdbc_url",
          value: "数据库连接url地址",
        },
        {
          key: "database_name",
          value: "数据库名称",
        },
        {
          key: "database_pwd",
          value: "数据库密码",
        },
        {
          key: "user_name",
          value: "用户名",
        },
        {
          key: "database_code",
          value:
              "数据库的编码，本系统支持的参数为： UTF-8、GBK、UTF-16、GB2312、ISO-8859-1,支持外部表时使用",
        },
        {
          key: "external_root_path",
          value: "指定sftp文件到数据库服务器所在主机的根目录,支持外部表时使用",
        },
        {
          key: "platform",
          value:
              "hadoop平台的版本，本系统支持填写参数为： normal、fic50、fic60、fic80、cdh5_13，支持外部表时使用",
        },
        {
          key: "hadoop_user_name",
          value: "操作hdfs的用户名，支持外部表时使用",
        },
        {
          key: "prncipal_name",
          value: "集群认证名称，支持外部表时使用",
        },
        {
          key: "keytab_user",
          value: "集群有Kerberos认证，认证用户名称,可以不填，支持外部表时使用",
        },
        {
          key: "keytab_file",
          value: "kerberos认证文件名称,上传文件参数项，支持外部表时使用",
        },
        {
          key: "hdfs-site.xml",
          value: "hadoop集群hdfs文件，支持外部表时使用",
        },
        {
          key: "core-site.xml",
          value: "hadoop集群核心文件，支持外部表时使用",
        },
      ],
      hbaseData: [
        {
          key: "database_driver",
          value: "数据库驱动",
        },
        {
          key: "jdbc_url",
          value: "数据库连接url地址",
        },
        {
          key: "database_name",
          value: "数据库名称",
        },
        {
          key: "database_pwd",
          value: "数据库密码",
        },
        {
          key: "user_name",
          value: "用户名",
        },
        {
          key: "increment_engine",
          value: "hbase算增量的执行引擎，本系统支持的参数为：hive、phoenix",
        },
        {
          key: "platform",
          value:
              "hadoop平台的版本，本系统支持填写参数为： normal、fic50、fic60、fic80、cdh5_13",
        },
        {
          key: "hadoop_user_name",
          value: "操作hdfs的用户名",
        },
        {
          key: "prncipal_name",
          value: "集群认证名称",
        },
        {
          key: "zkhost",
          value: "solr的zookeeper",
        },
        {
          key: "keytab_user",
          value: "集群有Kerberos认证，认证用户名称,可以不填",
        },
        {
          key: "keytab_file",
          value: "kerberos认证文件名称,上传文件参数项",
        },
        {
          key: "hbase-site.xml",
          value: "hadoop集群hbase文件",
        },
        {
          key: "hdfs-site.xml",
          value: "hadoop集群hdfs文件",
        },
      ],
      solrData: [
        {
          key: "solr_zk_url",
          value: "连接solr的zk连接",
        },
        {
          key: "collection",
          value: "solr指定的collection",
        },
      ],
      elasticSearchData: [],
      mongodbData: [],
      carBonData: [
        {
          key: "database_driver",
          value: "数据库驱动",
        },
        {
          key: "jdbc_url",
          value: "数据库连接url地址",
        },
        {
          key: "database_name",
          value: "数据库名称",
        },
        {
          key: "database_pwd",
          value: "数据库密码",
        },
        {
          key: "user_name",
          value: "用户名",
        },
      ],
      database_name: "xxx",
      YesNo: [],
      databaseType: [],
      markArrindex: [],
      database_type: "",
      old_db_name: "",
      uploadindex: "",
      dataKey: "",
      formDialog: {},
      showValue: true,
      selectVlueOrUpload: false,
      selectedUploadValue: false,
      selectedValue: false,
      change_storelayer: [],
      change_dsl_type: [],
      dataTypeinfo: [],
      typeLengthinfo: [],
      fileList: [],
      elasticSearchDaa: [],
      databaseTypeData: [],
    }
  },
  created() {
    this.getCategoryItems("Store_type");
    this.getCategoryItems("StoreLayerAdded");
    this.getCategoryItems("IsFlag");
    this.searchDBName();
  },
  mounted() {

  },
  methods: {
    // 获取代码项对应的值
    getCategoryItems(e) {
      if (e === "Store_type") {
        this.$Code.getCategoryItems({category: "Store_type"}).then((res) => {
          if (res && res.success) {
            this.storeType = res.data;
          }
        });
      } else if (e === "StoreLayerAdded") {
        this.$Code.getCategoryItems({category: "StoreLayerAdded"}).then((res) => {
          if (res && res.success) {
            this.checkboxType = res.data;
          }
        });
      } else if (e === "IsFlag") {
        this.$Code.getCategoryItems({category: "IsFlag"}).then((res) => {
          if (res && res.success) {
            this.YesNo = res.data;
          }
        });
      }
    },
    searchDBName() {
      this.$executeRequest
          .execGetAllPathByUrl("/dataStoreLayer/searchDBName", {})
          .then((res) => {
            if (res && res.success) {
              this.databaseType = res.data;
            }
          });
    },
    // 根据存储类型动态显示key
    changedata(store_type) {
      this.$refs.form.clearValidate();
      this.storeType.forEach((element) => {
        if (element.code === store_type) {
          this.store_type_ch = element.value;
        }
      });
      // 根据是否外部表查询存储层属性数据
      this.changeHadoopclient();
    },
    // 改变hadoop客户端（是否外部表）
    changeHadoopclient(is_hadoopclient) {
      if (this.form.store_type !== undefined && this.form.store_type !== "") {
        this.fileArray = [];
        if (is_hadoopclient === "1") {
          // 支持外部表
          if (this.form.store_type !== "1") {
            // 只有非关系型数据库时调用此方法
            this.getExternalTableAttrKey(is_hadoopclient, this.form.store_type);
          } else {
            // 关系型数据库数据库类型切换
            this.getAttrKeyByDatabaseType(this.db_name);
          }
        } else {
          // 不支持外部表
          this.getDataLayerAttrKey(this.form.store_type, this.db_name);
        }
      }
    },
    // 获取支持外部表的属性key值
    getExternalTableAttrKey(is_hadoopclient, store_type, db_name) {
      this.db_name = db_name;
      let params = {
        store_type: store_type,
        is_hadoopclient: is_hadoopclient,
      };
      this.$executeRequest.execGetAllPathByUrl("/dataStoreLayer/getExternalTableAttrKey", params).then((res) => {
        if (res && res.success) {
          this.dataProcessing(res.data, this.form.store_type, db_name);
          if (store_type === "1") {
            // 关系型数据库
            this.getDriverAndUrlInfo(db_name);
          } else if (store_type === "2") {
            // hive
            // 关系型数据库db_name 14代表hive
            this.getDriverAndUrlInfo("hive");
          }
        }
      });
    },
    // 根据数据库类型获取数据存储层属性key
    getAttrKeyByDatabaseType(db_name) {
      this.db_name = db_name;
      if (
          this.form.is_hadoopclient === "1" &&
          db_name !== undefined &&
          db_name !== ""
      ) {
        // 只有当支持外部表时才调用此方法
        this.$executeRequest
            .execGetAllPathByUrl("/dataStoreLayer/getAttrKeyByDatabaseType", {
              store_type: this.form.store_type,
              is_hadoopclient: this.form.is_hadoopclient,
              db_name: db_name,
            })
            .then((res) => {
              if (res && res.success) {
                this.dataProcessing(res.data, this.form.store_type, db_name);
              }
            });
      }
      if (db_name !== undefined && db_name !== "") {
        // 获取驱动以及url
        this.getDriverAndUrlInfo(db_name);
      }
    },
    // 根据存储层类型获取数据存储层属性key
    getDataLayerAttrKey(store_type, db_name) {
      this.db_name = db_name;
      this.$executeRequest.execGetAllPathByUrl("/dataStoreLayer/getDataLayerAttrKey", {store_type: store_type}).then((res) => {
        if (res && res.success) {
          this.dataProcessing(res.data, store_type, db_name);
        }
      });
      // 获取驱动以及url
      if (db_name !== "" && db_name !== undefined && store_type === "1") {
        this.getDriverAndUrlInfo(this.db_name);
      } else if (store_type === "2") {
        // 关系型数据库db_name 14代表hive
        this.getDriverAndUrlInfo("hive");
      }
    },
    jdbcUrlFun(row) {
      // oracle，db2不支持动态填写url
      if (this.db_name.toLowerCase().indexOf("oracle9i") === -1 &&
          this.db_name.toLowerCase().indexOf("oracle10g") === -1 &&
          this.db_name.toLowerCase().indexOf("db2") === -1) {
        if (row.storage_property_key === "database_name") {
          this.form.dataStoreLayerAttr.forEach((item) => {
            if (item.storage_property_key === "jdbc_url") {
              let num = item.storage_property_val.lastIndexOf(
                  this.database_name
              );
              let database_name = row.storage_property_val;
              if (database_name === "") {
                database_name = "xxx";
              }
              item.storage_property_val =
                  item.storage_property_val.substring(0, num) +
                  database_name +
                  item.storage_property_val.substring(
                      num + this.database_name.length
                  );
            }
          });
          this.form.dataStoreLayerAttr.forEach((item) => {
            if (item.storage_property_key === "database_name") {
              if (row.storage_property_val === "") {
                this.database_name = "xxx";
              } else {
                this.database_name = item.storage_property_val;
              }
            }
          });
        }
      }
    },
    // 处理存储层属性数据
    dataProcessing(data, store_type, db_name) {
      let array = [];
      for (let i = 0; i < data.jdbcKey.length; i++) {
        let obj = {
          storage_property_key: data.jdbcKey[i],
          is_file: "0",
          storage_property_val: "",
        };
        if (data.jdbcKey[i] === "database_type") {
          if (db_name !== undefined && db_name !== "") {
            obj["storage_property_val"] = db_name;
          }
          array.unshift(obj);
        } else {
          array.push(obj);
        }
      }
      // 排序，将jdbc_url放到最后一位
      array.forEach((item, index) => {
        if (item.storage_property_key === "jdbc_url") {
          array.splice(index, 1);
          array.push(item);
        }
      });
      for (let j = 0; j < data.fileKey.length; j++) {
        array.push({
          storage_property_key: data.fileKey[j],
          is_file: "1",
          storage_property_val: "",
        });
      }
      // 赋值给表格
      this.form.dataStoreLayerAttr = array;
      this.numberCount = this.form.dataStoreLayerAttr.length;
      this.showAddBtn = true;
      if (store_type === "1") {
        // 关系型数据库
        this.showAddFileBtn = false;
        this.storageLayerParamInfo = this.databaseData;
      } else if (store_type === "2") {
        // hive
        this.showAddFileBtn = true;
        this.storageLayerParamInfo = this.hiveData;
      } else if (store_type === "3") {
        // hbase
        this.showAddFileBtn = true;
        this.storageLayerParamInfo = this.hbaseData;
      } else if (store_type === "4") {
        // solr
        this.showAddFileBtn = false;
        this.storageLayerParamInfo = this.solrData;
      } else if (store_type === "5") {
        // elasticSearch
        this.showAddFileBtn = false;
        this.storageLayerParamInfo = this.elasticSearchData;
      } else if (store_type === "6") {
        // mongodb
        this.showAddFileBtn = false;
        this.storageLayerParamInfo = this.mongodbData;
      } else if (store_type === "7") {
        // carbondata
        this.showAddFileBtn = false;
        this.storageLayerParamInfo = this.carBonData;
      }
    },
    // 添加行数据
    addDataStoreLayerAttr(is_file) {
      this.form.dataStoreLayerAttr.push({
        storage_property_key: "",
        storage_property_val: "",
        dsla_remark: "",
        is_file: is_file,
      });
    },
    // 删除表格的当前行
    deleteArray(index, row) {
      this.form.dataStoreLayerAttr.splice(index, 1);
      if (row.is_file === "1") {
        let index = this.fileArray.findIndex(
            (item) => item.name === this.dataKey
        );
        this.fileArray.splice(index, 1);
      }
    },
    // 关系型数据库
    getDriverAndUrlInfo(db_name) {
      this.$executeRequest.execGetAllPathByUrl("/dataStoreLayer/getDBConnectionMsg", {db_name: db_name}).then((res) => {
        if (res && res.success) {
          this.form.dataStoreLayerAttr.forEach((item) => {
            if (item.storage_property_key === "database_driver") {
              item.storage_property_val = res.data.dbDriver;
            }
          });
          this.ipPlaceholder = res.data.ipPlaceholder;
          this.portPlaceholder = res.data.portPlaceholder;
          this.urlPrefix = res.data.urlPrefix;
          this.urlSuffix = res.data.urlSuffix;
          this.form.dataStoreLayerAttr.forEach((item) => {
            if (item.storage_property_key === "jdbc_url") {
              if (this.db_name === "TeraData") {
                // TeraData
                item.storage_property_val =
                    this.urlPrefix +
                    "ip" +
                    this.ipPlaceholder +
                    this.database_name +
                    this.urlSuffix +
                    "port";
              } else {
                item.storage_property_val =
                    this.urlPrefix +
                    "ip" +
                    this.ipPlaceholder +
                    "port" +
                    this.portPlaceholder +
                    this.database_name +
                    this.urlSuffix;
              }
            }
          });
        }
      });
    },
    // 点击取消返回展示页面
    cancelSave() {
      this.$router.push({
        name: "dataStoreLayer",
      });
    },
    // 保存上传文件
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        message.customizTitle("最多上传一条,请删除多余项", "warning");
      } else {
        if (this.dataKey === file.name) {
          this.fileArray.push(file.raw);
          let obj = {
            storage_property_key: this.dataKey,
            storage_property_val: file.name,
            is_file: "1",
          };
          this.markArrindex.push(obj);
        } else {
          let index = fileList.findIndex((item) => item.name === file.name);
          fileList.splice(index, 1);
          message.customizTitle(
              "文件选择失败,请选择与key命名相同的文件",
              "warning"
          );
        }
      }
    },
    selectFile(index, row) {
      this.uploadindex = index;
      this.dataKey = row.storage_property_key;
    },
    // 删除上传文件
    removeFile(file, fileList) {
      if (this.fileArray.length !== 0) {
        if (JSON.stringify(this.fileArray).indexOf(JSON.stringify(file)) !== -1) {
          this.fileArray.splice(file, 1);
        }
        fileList.forEach((item) => {
          if (item.name !== this.dataKey) {
            message.customizTitle("请保留与key命名相同的文件", "warning");
          }
        });
      }
    },
    // 点击保存添加
    saveData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.dataStoreLayerAttr.length > 0) {
            // 处理参数
            this.change_storelayer = [];
            this.form.dsla_storelayer.forEach((item) => {
              if (item === "主键") {
                this.change_storelayer.push("01");
              } else if (item === "rowkey") {
                this.change_storelayer.push("02");
              } else if (item === "索引列") {
                this.change_storelayer.push("03");
              } else if (item === "预聚合列") {
                this.change_storelayer.push("04");
              } else if (item === "排序列") {
                this.change_storelayer.push("05");
              } else if (item === "分区列") {
                this.change_storelayer.push("06");
              } else if (item === "Solr列") {
                this.change_storelayer.push("07");
              }
            });
            let param = new FormData(); // 创建form对象
            param.append("dsl_name", this.form.dsl_name);
            param.append("store_type", this.form.store_type);
            param.append("is_hadoopclient", this.form.is_hadoopclient);
            param.append("dsl_source", this.form.dsl_source);
            param.append("dsl_goal", this.form.dsl_goal);
            param.append("dsl_remark", this.form.dsl_remark);
            // 处理参数dataStoreLayerAttr
            let arrTable = [];
            this.form.dataStoreLayerAttr.forEach((item) => {
              if (item.storage_property_val) {
                arrTable.push(item);
                item["is_file"] = "0";
              }
            });
            // 如果是hbase
            if (this.form.store_type === "3") {
              arrTable.forEach((item) => {
                if (item.radio) {
                  delete item.radio;
                }
              });
              arrTable = [...arrTable, ...this.markArrindex];
              param.append("dataStoreLayerAttr", JSON.stringify(arrTable));
            } else if (this.form.store_type === "2") {
              arrTable = [...arrTable, ...this.markArrindex];
              param.append("dataStoreLayerAttr", JSON.stringify(arrTable));
            } else {
              param.append("dataStoreLayerAttr", JSON.stringify(this.form.dataStoreLayerAttr));
            }
            //    处理参数dsla_storelayer
            for (let index = 0; index < this.change_storelayer.length; index++) {
              param.append("dsla_storelayer", this.change_storelayer[index]);
            }
            if (this.fileArray.length > 0) {
              for (let index = 0; index < this.fileArray.length; index++) {
                param.append("files", this.fileArray[index]);
              }
            }
            this.$executeRequest.execPostByPathUrl("/dataStoreLayer/addDataStore", param).then((res) => {
              if (res && res.success) {
                this.$router.push({
                  name: "dataStoreLayer",
                });
              }
            });
          } else {
            this.$Msg.customizTitle("表格数据信息为必填项", "warning");
          }
        }
      });
    },
    // 点击测试连接
    testConnection() {
      if (this.form.dataStoreLayerAttr.length === 0) {
        this.$Msg.customizTitle('请填写完整数据存储层配置属性', 'warning');
        return;
      }
      let params = {};
      params['store_type'] = this.form.store_type;
      for (let item of this.form.dataStoreLayerAttr) {
        if (!item.storage_property_val) {
          this.$Msg.customizTitle('请填写或者选择数据存储层配置属性key:[ ' + item.storage_property_key + " ]对应value值", 'warning');
          return;
        }
        if (item.storage_property_key === 'jdbc_url' || item.storage_property_key === 'database_pwd') {
          params[item.storage_property_key] = this.$Base64.encode(item.storage_property_val);
        } else {
          params[item.storage_property_key] = item.storage_property_val;
        }
      }
      this.linkloading = true
      this.$executeRequest.execGetByMenuUrl("/testConnection", params).then(res => {
        if (res && res.success) {
          this.linkloading = false
          this.$Msg.customizTitle('连接成功', "success");
        } else {
          this.linkloading = false
        }
      });
    },
    // 获取上传的文件详情excelHandleChange
    handleDriverFileChange(file, fileList) {
      if (fileList.length > 0) {
        this.driverFileList = [fileList[fileList.length - 1]]
      }
    },
    // 上传驱动jar并测试连接
    testConnectionByDriver(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.driverFileList.length === 0) {
            this.$Msg.customizTitle('上传文件不能为空', 'warning')
          } else {
            let params = new FormData() // 创建form对象
            params.append('file', this.driverFileList[0].raw);
            params.append('store_type', this.form.store_type);
            for (let item of this.form.dataStoreLayerAttr) {
              if (!item.storage_property_val) {
                this.$Msg.customizTitle('请填写或者选择数据存储层配置属性key:[ ' + item.storage_property_key + " ]对应value值", 'warning');
                return;
              }
              if (item.storage_property_key === 'jdbc_url' || item.storage_property_key === 'database_pwd') {
                params.append(item.storage_property_key, this.$Base64.encode(item.storage_property_val));
              } else {
                params.append(item.storage_property_key, item.storage_property_val);
              }
            }
            this.$executeRequest.execUploadByMenuUrl("/testConnectionByDriver", params).then(res => {
              if (res && res.success) {
                this.$Msg.customizTitle('测试连接成功', "success");
                this.dialogFormJarUpload = false;
                this.driverFileList = [];
              }
            });
          }
        }
      })
    },
    // 点击上传驱动jar弹框的取消按钮
    cancel() {
      this.dialogFormJarUpload = false;
      this.$refs.formUpload.resetFields();
      this.driverFileList = [];
    },
  }
}
</script>

<style scoped lang="less">
.el-button {
  width: 130px;
  height: 32px;
  padding: 8px 0;
}

.elButton {
  float: right;
  margin-top: 20px;
  margin-bottom: 20px;
}

.lines {
  margin-top: 4px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}

/* form边框 */
/deep/ .partOne {
  border: 1px solid #e6e6e6;
  padding: 1%;
  width: 100%;
}

/deep/ .dataSave {
  margin: 20px 0;
  color: #2196f3;
  font-size: 18px;
}

/* 按钮样式 */
/deep/ .elButton {
  float: right;
  margin-top: 20px;
  margin-bottom: 20px;
}

/deep/ .partTwoBtn {
  float: right;
  margin-top: 20px;
  margin-left: 15px;
  margin-bottom: 10px;
}

/* span字体样式 */
/deep/ .saveDataSpan {
  display: inline-block;
  margin-top: 20px;
  color: #2196f3;
  font-size: 18px;
}

/* table的input样式 */
/deep/ .el-table .el-form-item {
  margin-bottom: 0 !important;
}

/deep/ .el-table .el-form-item .el-form-item__content {
  margin-left: 0 !important;
}

/deep/ .el-table .el-form-item .el-form-item__content .el-textarea .el-textarea__inner {
  height: 38px;
  line-height: 38px;
}
</style>
