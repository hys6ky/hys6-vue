<template>
  <div class="px-20 pb-20">
    <div class="d-flex py-10 justify-content-between">
      <div style="display: flex;margin: 5px 0px">
        <ByHeaderSlice title="数据存储层定义"/>
        <el-tooltip style="margin-left: 10px;margin-top: 10px" placement="right" effect="dark"
                    content="存储层信息变动，采集Agent需要重新部署！！！">
          <i class="el-icon-info" aria-hidden="true"></i>
        </el-tooltip>
      </div>
      <el-button type="primary" @click="addDataStoreLayer">
        <i class="el-icon-circle-plus-outline"></i>
        <span>新增数据存储层</span>
      </el-button>
    </div>
    <ByTable :tableData="dataStoreLayerTableList" :columnArr="columnArr" @linkTo="linkTo" @operateItem="operateItem"/>
    <!--数据存储层属性弹出层-->
<!--    <ByModel-->
<!--        modelTitle="数据存储层属性"-->
<!--        :visible = "dataSaveConfigure"-->
<!--        width = "60%"-->
<!--        @close="dataSaveConfigure = false"-->
<!--        :footerShow = "false"-->
<!--    >-->
<!--        <ByTable-->
<!--          :tableData="storeLayerAttrData"-->
<!--          :columnArr="storeLayerCols"-->
<!--        >-->

<!--        </ByTable>-->
<!--    </ByModel>-->
    <el-dialog title="数据存储层属性" :visible.sync="dataSaveConfigure" width="60%">
      <el-form>
        <el-table :data="storeLayerAttrData" border stripe size="medium">
          <el-table-column type="index" label="序号" width="100" align="center"/>
          <el-table-column prop="storage_property_key" show-overflow-tooltip label="key" align="center"/>
          <el-table-column prop="storage_property_val" show-overflow-tooltip label="value" align="center"/>
          <el-table-column prop="dsla_remark" label="描述" show-overflow-tooltip align="center"/>
          <el-table-column label="下载" align="center" width="150" v-if="showDownloadButton">
            <template v-slot="scope">
              <el-button @click="downLoadFiles(scope.row)" size="mini" disabled type="info" title="禁止下载文件"
                         v-if="scope.$index < showNumberDisabled">
                下载
              </el-button>
              <el-button @click="downLoadFiles(scope.row)" size="mini" type="primary" plain title="点击下载文件" v-else>
                下载
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="附加信息">
          <el-checkbox-group v-model="form.dsla_storelayer" disabled>
            <el-checkbox v-for="item in checkboxType" :key="item.value" :label="item.value" :value="item.code"/>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dataSaveConfigure = false" size="mini" type="danger">关闭</el-button>
      </div>
    </el-dialog>
    <!--编辑弹出层-->
    <el-dialog title="更新数据存储层（存储层信息变动，采集Agent需要重新部署！！！）" :visible.sync="dialogFormVisibleUpdate"
               :before-close="beforeClose" width="80%">
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
              <el-form-item label="存储层存储类型" prop="store_type" :rules="rule.selected">
                <el-select v-model="form.store_type" placeholder="请选择存储类型" @change="changeData">
                  <el-option v-for="item in storeType" :key="item.value" :label="item.value" :value="item.code"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-col :span="20">
                <el-form-item label="存储层表备注">
                  <el-input v-model="form.dsl_remark" placeholder="存储层表备注"/>
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
              <el-col>
                <el-form-item label="附加信息">
                  <el-checkbox-group v-model="dsla_storelayerEdit">
                    <el-checkbox v-for="item in checkboxType" :key="item.code" :label="item.value" :value="item.code"/>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <span class="saveDataSpan">数据存储层属性</span>
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
          <el-button size="mini" class="partTwoBtn" v-if="showAddBtn" type="success" @click="addTableDataRow('0')">
            添加行
          </el-button>
          <el-button size="mini" class="partTwoBtn" v-if="showAddFileBtn" type="success" @click="addTableDataRow('1')">
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
          <el-table :data="storeLayerAttrData" border stripe size="medium">
            <el-table-column type="index" label="序号" width="100" align="center" :key="1"/>
            <el-table-column label="key" align="center" :key="2">
              <template v-slot="scope">
                <el-input size="medium" disabled v-if="scope.$index < numberCount"
                          v-model="scope.row.storage_property_key"
                          style="width: 90%"></el-input>
                <el-input size="medium" v-else v-model="scope.row.storage_property_key" style="width: 90%"/>
              </template>
            </el-table-column>

            <el-table-column label="value" align="center" :key="3">
              <template v-slot="scope">
                <div v-if="scope.row.storage_property_key === 'database_type'" style="display: flex">
                  <el-select v-model="scope.row.storage_property_val"
                             @change="getAttrKeyByDatabaseType">
                    <el-option v-for="(item, index) in databaseType" :key="index" :value="item.database_name"/>
                  </el-select>
                  <el-tooltip effect="dark" placement="right"
                              content="数据库类型为DB2,如果直接写数据库名称不行,请在数据库名称后面加上:currentSchema=schema;,最后这个分号不能丢">
                    <i class="el-icon-question" aria-hidden="true"
                       style="margin-top: 12px;font-size: 16px;margin-left: 5px;color: #000;"/>
                  </el-tooltip>
                </div>
                <div v-else-if="scope.row.is_file === '0'"
                     :rules="filter_rules([{ required: true }])" style="display: flex">
                  <el-input size="medium" v-model="scope.row.storage_property_val" @input="jdbcUrlFun(scope.row)"
                            style="width: 90%"></el-input>
                  <el-tooltip
                      v-if="scope.row.storage_property_key === 'jdbc_url'" effect="dark" placement="right"
                      content="数据库类型为DB2,如果直接写数据库名称不行,请在url后面加上:currentSchema=schema;,最后这个分号不能丢">
                    <i class="el-icon-question" aria-hidden="true"
                       style="margin-top: 12px;font-size: 16px;margin-left: 5px;color: #000;"/>
                  </el-tooltip>
                </div>
                <el-upload
                    v-else-if="scope.row.is_file === '1'" class="upload-demo" ref="upload" :file-list="fileList"
                    action="" :auto-upload="false" :on-change="handleChange" :on-remove="removeFile" style="width: 80%">
                  <el-button size="small" type="info" @click="selectFile(scope.$index, scope.row)">
                    选择文件
                  </el-button>
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column prop="dsla_remark" label="描述" align="center">
              <template v-slot="scope">
                <el-input type="textarea" size="medium" v-model="scope.row.dsla_remark"/>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot="scope">
                <el-button type="text" size="small" disabled v-if="scope.$index < numberCount">删除</el-button>
                <el-button type="text" size="small" v-else @click="deleteTableDataRow(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate" size="mini" type="danger">取消</el-button>
        <el-button type="primary" @click="upDate('form')" size="mini">更新</el-button>
      </div>
    </el-dialog>
    <!-- 上传驱动jar -->
    <el-dialog title="上传驱动jar文件" :visible.sync="dialogFormJarUpload" width="30%" :before-close="cancel">
      <el-form :model="formUpload" ref="formUpload">
        <el-form-item label="选择文件" :label-width="formLabelWidth">
          <el-upload class="upload-demo" ref="upload" :fileList="driverFileList" action="" :auto-upload="false"
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
import {columnArr, modelFormData,storeLayerCols} from "./mock"
import * as validator from "@/utils/validator";
import ByModel from "@/components/global/ByModel.vue";
import ByTable from "@/components/global/ByTable.vue";
import ByHeaderSlice from "@/components/global/ByHeaderSlice.vue";
import {downloadFile, execDownloadByUrl} from "@/utils/executeRequest";

export default {
  name: "",
  components: {ByHeaderSlice, ByTable, ByModel},
  data() {
    return {
      storeLayerCols,
      dialogFormJarUpload: false,
      formUpload: {},
      formLabelWidth: "150px",
      driverFileList: [],
      dataStoreLayerTableList: [],
      columnArr,
      modelTitle: '',
      visible: false,
      modelFormData: JSON.parse(JSON.stringify(modelFormData)),
      linkloading: false,
      storeLayerAttrData: [],
      showDownloadButton: false,
      showNumberDisabled: "",
      form: {
        dsl_name: "",
        dtcs_id: "",
        dlcs_id: "",
        is_hadoopclient: "",
        store_type: "",
        dsl_remark: "",
        dsl_source: "",
        dsl_goal: "",
        dsl_type: [],
        dsla_storelayer: [],
      },
      dsla_storelayerEdit: [],
      oldDataArry: [],
      db_name1: "",
      showValue: true,
      selectedUploadValue: false,
      selectedValue: false,
      numberCount: "",
      deleteLength: "",
      fileList: [],
      dsl_id: "",
      storeType: [],
      checkboxType: [],
      YesNo: [],
      databaseType: [],
      store_type_ch: "",
      markArrIndex: [],
      dataSaveConfigure: false,
      dialogFormVisibleUpdate: false,
      rule: validator.default,
      uploadIndex: "",
      dataKey: "",
      fileArray: [],
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
      elasticSearchDaa: [],
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
      ipPlaceholder: "",
      portPlaceholder: "",
      urlPrefix: "",
      urlSuffix: "",
      database_name: "xxx",
      old_database_name: "",
      old_database_type: "",
      db_name: "",
      old_db_name: "",
      showAddBtn: false,
      showAddFileBtn: false,
    }
  },
  mounted() {
    this.getDataStoreLayerTableList()
  },
  methods: {
    // 新增数据存储层
    addDataStoreLayer() {
      this.$router.push({
        name: 'addDataStoreLayer',
      })
    },
    operateItem(type, row) {
      if (type === 'edit') {
        this.handleEdit(row)
      } else {
        this.deleteDataStore(row)
      }
    },
    // 获取存储层数据列表
    getDataStoreLayerTableList() {
      this.$executeRequest.execGetAllPathByUrl("/dataStoreLayer/searchDataStore")
          .then((res) => {
            if (res && res.success) {
              res.data.forEach((item) => {
                if (item.is_hadoopclient === "1") {
                  item.is_hadoopclient = "是";
                } else if (item.is_hadoopclient === "0") {
                  item.is_hadoopclient = "否";
                }
                if (item.dsl_source === "1") {
                  item['dsl_source_ch'] = "是";
                } else if (item.dsl_source === "0") {
                  item['dsl_source_ch'] = "否";
                }
                if (item.dsl_goal === "1") {
                  item['dsl_goal_ch'] = "是";
                } else if (item.dsl_goal === "0") {
                  item['dsl_goal_ch'] = "否";
                }
                this.$Code.getValue({
                  category: "Store_type",
                  code: item.store_type,
                }).then((res) => {
                  if (res && res.success) {
                    item.store_type = res.data
                  }
                });
              });
              this.dataStoreLayerTableList = res.data;
            }
          });
    },
    // 点击编辑按钮
    handleEdit(e, row) {
      this.searchDBName();
      this.dsl_id = e.dsl_id;
      this.form = e
      this.fixedError(e, row);
      this.getCategoryItems("Store_type");
      this.getCategoryItems("IsFlag");
      this.dialogFormVisibleUpdate = true
    },
    // 查询驱动类型
    searchDBName() {
      this.$executeRequest.execByControllerMappingName("/searchDBName").then(res => {
        if (res && res.success) {
          this.databaseType = res.data;
        }
      })
    },
    // 点击数据存储层属性
    linkTo(row) {
      this.dataSaveConfigure = true
      this.checkboxType = [];
      this.$executeRequest.execGetPathByUrl("/dataStoreLayer/searchDataStoreById", {dsl_id: row.dsl_id,}).then((rsData) => {
        if (rsData && rsData.success) {
          let res = this.$Secret.DecryptJSON(rsData.data);
          // 是否显示下载按钮
          let storeType = res.data.store_type;
          if (storeType === "2" || storeType === "3") {
            this.showDownloadButton = true;
            let i = 0;
            res.data.layerAndAttr.forEach((item) => {
              if (item.is_file === "0") {
                i++;
              }
            });
            if (storeType === "2") {
              this.showNumberDisabled = i;
            } else if (storeType === "3") {
              this.showNumberDisabled = i;
            }
          } else {
            this.showDownloadButton = false;
          }
          res.data.layerAndAttr.forEach((item) => {
            if (item.storage_property_key === "database_type") {
              this.databaseType.forEach((database) => {
                if (database.code === item.storage_property_val) {
                  item.storage_property_val = database.value;
                }
              });
            }
          });
          this.storeLayerAttrData = res.data.layerAndAttr;
          this.form.dsl_name = res.data.dsl_name;
          this.form.store_type = storeType;
          res.data.layerAndAdded.forEach((item) => {
            if (item.dsla_storelayer) {
              this.$Code.getValue({
                category: "StoreLayerAdded",
                code: item.dsla_storelayer,
              }).then((res) => {
                if (res && res.success) {
                  this.checkboxType.push({
                    value: res.data,
                    code: item.dsla_storelayer,
                  });
                  this.form.dsla_storelayer.push(res.data);
                }
              });
            }
          });
        }
      });
    },
    // 点击测试连接
    testConnection() {
      if (this.storeLayerAttrData.length === 0) {
        this.$Msg.customizTitle('请填写完整数据存储层配置属性', 'warning');
        return;
      }
      let params = {};
      params['store_type'] = this.form.store_type;
      for (let item of this.storeLayerAttrData) {
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
    //更新数据
    upDate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 处理参数
          if (this.storeLayerAttrData.length == 0) {
            this.$Msg.customizTitle("表格数据信息为必填项", "warning");
          } else if (this.storeLayerAttrData.length > 0) {
            this.change_storelayer = [];
            this.dsla_storelayerEdit.forEach((item) => {
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
            param.append("dsl_remark", this.form.dsl_remark);
            param.append("dsl_source", this.form.dsl_source);
            param.append("dsl_goal", this.form.dsl_goal);
            param.append("dslad_remark", this.form.dslad_remark);
            param.append("dsl_id", this.dsl_id);
            // 处理参数dataStoreLayerAttr
            let valueArr = [];
            this.storeLayerAttrData.forEach((item) => {
              if (item.is_file !== "1" || JSON.stringify(item).indexOf("is_file") === -1) {
                valueArr.push(item);
              }
            });
            let arrTable = [];
            valueArr.forEach((item) => {
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
              arrTable = [...arrTable, ...this.markArrIndex];
              param.append("dataStoreLayerAttr", JSON.stringify(arrTable));
            } else if (this.form.store_type === "2") {
              arrTable = [...arrTable, ...this.markArrIndex];
              param.append("dataStoreLayerAttr", JSON.stringify(arrTable));
            } else {
              param.append("dataStoreLayerAttr", JSON.stringify(this.storeLayerAttrData));
            }
            // 处理参数dsla_storelayer
            for (let index = 0; index < this.change_storelayer.length; index++) {
              param.append("dsla_storelayer", this.change_storelayer[index]);
            }
            param.append("dtcs_id", this.form.dtcs_id);
            param.append("dlcs_id", this.form.dlcs_id);
            // 处理上传文件参数
            if (this.fileArray.length > 0) {
              for (let index = 0; index < this.fileArray.length; index++) {
                param.append("files", this.fileArray[index]);
              }
            } else {
              param.append("files", "");
            }
            this.$executeRequest.execPostByPathUrl("/dataStoreLayer/updateDataStore", param).then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("更新成功", "success");
                // 重新渲染页面
                this.getDataStoreLayerTableList();
                // 关闭弹出层
                this.dialogFormVisibleUpdate = false;
                this.fileList = [];
              }
            });
          }
        }
      });
    },
    // 取消更新触发事件
    cancelUpdate() {
      this.getDataStoreLayerTableList();
      this.dialogFormVisibleUpdate = false;
      this.$refs.form.resetFields();
      this.storeLayerAttrData = [];
    },
    // 点击删除按钮
    deleteDataStore(row) {
      this.$confirm("确定删除存储层" + row.dsl_name + "吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$executeRequest.execGetAllPathByUrl("/dataStoreLayer/deleteDataStore", {dsl_id: row.dsl_id}).then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle("删除成功", "success");
            // 重新渲染页面
            this.getDataStoreLayerTableList();
          }
        });
      }).catch(() => {
        this.$Msg.customizTitle("已取消删除", "info");
      });
    },
    // 下载文件
    downLoadFiles(val) {
      let param = {
        fileName: val.storage_property_key,
        filePath: val.storage_property_val,
      };
      this.$executeRequest.downloadFile("/downloadConfFile", param).then((res) => {
        this.filename = val.storage_property_key;
        this.$file.fileDownload(res, this.filename);
      });
    },
    // 编辑的新增
    addTableDataRow(is_file) {
      this.storeLayerAttrData.push({
        storage_property_key: "",
        storage_property_val: "",
        dsla_remark: "",
        is_file: is_file,
        dsl_id: this.dsl_id,
      });
    },
    // 删除一行信息
    deleteTableDataRow(index, row) {
      this.storeLayerAttrData.splice(index, 1);
      if (row.is_file === "1") {
        let index = this.fileArray.findIndex(
            (item) => item.name === this.dataKey
        );
        this.fileArray.splice(index, 1);
      }
    },
    // 保存上传文件
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        this.$Msg.customizTitle("最多上传一条,请删除多余项", "warning");
      } else {
        if (this.dataKey === file.name) {
          this.fileArray.push(file.raw);
          let obj = {
            storage_property_key: this.dataKey,
            storage_property_val: file.name,
            is_file: "1",
          };
          this.markArrIndex.push(obj);
        } else {
          this.fileArray.splice(file, 1);
          let index = fileList.findIndex((item) => item.name === file.name);
          fileList.splice(index, 1);
          this.$Msg.customizTitle("文件选择失败,请选择与key命名相同的文件", "warning");
        }
      }
    },
    // 删除上传文件
    removeFile(file, fileList) {
      if (this.fileArray.length !== 0) {
        if (JSON.stringify(this.fileArray).indexOf(JSON.stringify(file)) !== -1) {
          this.fileArray.splice(file, 1);
        }
        fileList.forEach((item) => {
          if (item.name !== this.dataKey) {
            this.$Msg.customizTitle("请保留与key命名相同的文件", "warning");
          }
        });
      }
    },
    // 关闭弹出框之前触发事件
    beforeClose() {
      this.getDataStoreLayerTableList();
      this.dialogFormVisibleUpdate = false;
      this.$refs.form.resetFields();
    },
    // 获取表格当前行数据
    selectFile(index, row) {
      this.uploadIndex = index;
      this.dataKey = row.storage_property_key;
    },
    // 处理编辑附加信息冲突问题的方法
    fixedError(e, row) {
      this.checkboxType = [];
      this.$executeRequest.execByControllerMappingName("/searchDataStoreById", {dsl_id: e.dsl_id,}).then((rsData) => {
        if (rsData && rsData.success && rsData.data.length > 0) {
          let res = this.$Secret.DecryptJSON(rsData.data);
          // 获取存储层类型
          this.form.store_type = res.data.store_type;
          this.storeType.forEach((element) => {
            if (element.code === res.data.store_type) {
              this.store_type_ch = element.value;
            }
          });
          this.numberCount = res.data.layerAndAttr.length;
          // 编辑显示选择文件
          this.storeLayerAttrData = res.data.layerAndAttr;
          this.storeLayerAttrData.forEach((item) => {
            if (item.storage_property_key === "database_name") {
              this.old_database_name = item.storage_property_val;
            }
            if (item.storage_property_key === "database_type") {
              this.old_db_name = item.storage_property_val;
            }
          });
          this.showAddBtn = true;
          if (e.store_type === "hive" || e.store_type === "Hbase") {
            this.showAddFileBtn = true;
            if (e.store_type === "hive") {
              this.storageLayerParamInfo = this.hiveData;
            } else if (e.store_type === "Hbase") {
              this.storageLayerParamInfo = this.hbaseData;
            }
          } else {
            this.showAddFileBtn = false;
            if (e.store_type === "solr") {
              this.storageLayerParamInfo = this.solrData;
            } else if (e.store_type === "ElasticSearch") {
              this.storageLayerParamInfo = this.elasticSearchDaa;
            } else if (e.store_type === "mongodb") {
              this.storageLayerParamInfo = this.mongodbData;
            } else if (e.store_type === "关系型数据库") {
              this.storageLayerParamInfo = this.databaseData;
            }
          }
          this.form.dsl_name = res.data.dsl_name;
          this.form.dtcs_id = res.data.dtcs_id;
          this.form.dlcs_id = res.data.dlcs_id;
          if (res.data.dsl_remark) {
            this.form.dsl_remark = res.data.dsl_remark;
          }
          this.form.store_type = res.data.store_type;
          if (res.data.layerAndAdded.length > 0) {
            if (res.data.layerAndAdded[0].dslad_remark !== "undefined") {
              this.form.dslad_remark = res.data.layerAndAdded[0].dslad_remark;
            } else {
              this.form.dslad_remark = "";
            }
          }
          this.form.is_hadoopclient = res.data.is_hadoopclient;
          this.dsla_storelayerEdit = [];
          if (res.data.layerAndAdded.length == 0) {
            this.getCategoryItems("StoreLayerAdded");
          } else {
            res.data.layerAndAdded.forEach((item) => {
              if (item.dsla_storelayer) {
                this.$Code.getValue({
                  category: "StoreLayerAdded",
                  code: item.dsla_storelayer,
                }).then((res) => {
                  if (res && res.success) {
                    let arr = [];
                    arr.push({
                      value: res.data,
                      code: item.dsla_storelayer,
                    });
                    this.fixedError2(arr);
                  }
                });
              }
            });
          }
        }
      });
    },
    // 封装调用方法处理冲突2
    fixedError2(arr) {
      this.$Code.getCategoryItems({category: "StoreLayerAdded",}).then((res) => {
        if (res && res.success) {
          arr.forEach((item) => {
            res.data.forEach((select) => {
              if (item.code === select.code) {
                this.checkboxType = res.data;
                this.dsla_storelayerEdit.push(item.value);
              }
            });
          });
        }
      });
    },
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
    // 根据存储类型动态显示key
    changeData(store_type) {
      this.$refs.form.clearValidate();
      this.storeType.forEach((element) => {
        if (element.code === store_type) {
          this.store_type_ch = element.value;
        }
      });
      // 根据hadoop客户端不同调用后台不同方法
      this.changeHadoopclient();
    },
    // 改变hadoop客户端（是否外部表）
    changeHadoopclient() {
      if (this.db_name === "" || this.db_name === undefined) {
        this.db_name = this.old_db_name;
      }
      // 根据存储层定义表主键ID与存储层存储类型查询存储层属性信息
      if (this.form.store_type !== undefined && this.form.store_type !== "") {
        let params = {
          store_type: this.form.store_type,
          dsl_id: this.dsl_id,
          is_hadoopclient: this.form.is_hadoopclient,
        };
        this.$executeRequest.execByControllerMappingName("/getLayerAttrByIdAndType", params).then((res) => {
          if (res && res.success) {
            this.storeLayerAttrData = res.data;
            if (res.data.length === 0) {
              this.dataStoreLayerTableList.forEach((item) => {
                if (item.storage_property_key === "database_name") {
                  item.storage_property_val === "";
                }
              });
              // 非回显数据切换
              if (this.form.store_type !== undefined && this.form.store_type !== "") {
                this.fileArray = [];
                if (this.form.is_hadoopclient === "1") {
                  // 支持外部表
                  if (this.form.store_type !== "1") {
                    // 只有非关系型数据库时调用此方法
                    this.getExternalTableAttrKey(this.form.is_hadoopclient, this.form.store_type);
                  } else {
                    // 关系型数据库数据库类型切换
                    this.getAttrKeyByDatabaseType(this.db_name);
                  }
                } else {
                  // 不支持外部表
                  this.getDataLayerAttrKey(this.form.store_type, this.db_name);
                }
              }
            } else {
              this.dataStoreLayerTableList.forEach((item) => {
                if (item.storage_property_key === "database_name") {
                  this.old_database_name === item.storage_property_val;
                }
              });
              // 数组排序，回显数据
              res.data.sort(function (a, b) {
                const x = a["is_file"];
                const y = b["is_file"];
                return x < y ? -1 : x < y ? 1 : 0;
              });
            }
          }
        });
      }
    },
    // 获取支持外部表的属性key值
    getExternalTableAttrKey(is_hadoopclient, store_type, db_name) {
      this.db_name = db_name;
      let params = {
        store_type: store_type,
        is_hadoopclient: is_hadoopclient
      };
      this.$executeRequest.execByControllerMappingName("/getExternalTableAttrKey", params).then((res) => {
        if (res && res.success) {
          this.dataProcessing(res.data, this.form.store_type, db_name);
          this.old_database_name = "xxx";
          // 获取驱动以及url
          if (db_name !== "" && db_name !== undefined && store_type === "1") {
            this.getDriverAndUrl(this.db_name);
          } else if (store_type === "2") {
            // 关系型数据库database_type 14代表hive
            this.getDriverAndUrl("hive");
          }
        }
      });
    },
    // 根据存储层类型获取数据存储层属性key
    getDataLayerAttrKey(store_type, db_name) {
      this.db_name = db_name;
      this.$executeRequest.execByControllerMappingName("/getDataLayerAttrKey", {store_type: store_type,}).then((res) => {
        if (res && res.success) {
          this.dataProcessing(res.data, store_type, db_name);
          this.old_database_name = "xxx";
          // 获取驱动以及url
          if (db_name !== "" && db_name !== undefined && store_type === "1") {
            this.getDriverAndUrl(this.db_name);
          } else if (store_type === "2") {
            // 关系型数据库db_name 14代表hive
            this.getDriverAndUrl("hive");
          }
        }
      });
    },
    // 根据数据库类型获取数据存储层属性key
    getAttrKeyByDatabaseType(db_name) {
      if (db_name !== this.old_db_name) {
        this.storeLayerAttrData.forEach((item) => {
          if (item.storage_property_key === "database_name") {
            item.storage_property_val = "";
          }
        });
        this.old_database_name = "xxx";
        this.getDriverAndUrl(db_name);
      } else {
        this.$executeRequest.execByControllerMappingName("/searchDataStoreById", {dsl_id: this.dsl_id,}).then((resData) => {
          if (resData && resData.success) {
            let res = this.$Secret.DecryptJSON(resData.data);
            this.storeLayerAttrData = res.data.layerAndAttr;
            this.storeLayerAttrData.forEach((item) => {
              if (item.storage_property_key === "database_name") {
                this.old_database_name = item.storage_property_val;
              }
            });
          }
        });
      }
      this.db_name = db_name;
      if (this.form.is_hadoopclient === "1" && db_name !== undefined && db_name !== "") {
        // 只有当支持外部表时才调用此方法
        let params = {
          store_type: this.form.store_type,
          is_hadoopclient: this.form.is_hadoopclient,
          db_name: db_name,
        };
        this.$executeRequest.execByControllerMappingName("/getAttrKeyByDatabaseType", params).then((res) => {
          if (res && res.success) {
            this.old_database_name = "xxx";
            this.dataProcessing(res.data, this.form.store_type, db_name);
          }
        });
      }
      if (db_name !== undefined && db_name !== "") {
        // 获取驱动以及url
        this.getDriverAndUrl(db_name);
      }
    },
    // 获取数据库驱动以及url
    getDriverAndUrl(db_name) {
      this.db_name1 = db_name;
      this.$executeRequest.execByControllerMappingName("/getDBConnectionMsg", {db_name: db_name,}).then((res) => {
        if (res && res.success) {
          this.ipPlaceholder = res.data.ipPlaceholder;
          this.portPlaceholder = res.data.portPlaceholder;
          this.urlPrefix = res.data.urlPrefix;
          this.urlSuffix = res.data.urlSuffix;
          this.storeLayerAttrData.forEach((item) => {
            if (item.storage_property_key === "database_driver") {
              item.storage_property_val = res.data.dbDriver;
            }
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
            if (item.storage_property_key === "database_type") {
              item.storage_property_val = this.db_name1;
            }
          });
        }
      });
    },
    jdbcUrlFun(row) {
      if (this.db_name === "") {
        this.db_name = this.old_db_name;
      }
      if (this.form.store_type === "2") {
        this.db_name = "hive";
      }
      // oracle，db2不支持动态填写url
      if (this.db_name.toLowerCase().indexOf("oracle9i") === -1 &&
          this.db_name.toLowerCase().indexOf("oracle10g") === -1 &&
          this.db_name.toLowerCase().indexOf("db2") === -1) {
        // 非oracle数据库才做动态生成url
        if (row.storage_property_key === "database_name") {
          this.storeLayerAttrData.forEach((item) => {
            if (item.storage_property_key === "jdbc_url") {
              let num = item.storage_property_val.lastIndexOf(
                  this.old_database_name
              );
              let database_name = row.storage_property_val;
              if (database_name === "") {
                database_name = "xxx";
              }
              item.storage_property_val =
                  item.storage_property_val.substring(0, num) +
                  database_name +
                  item.storage_property_val.substring(num + this.old_database_name.length);
            }
          });
          this.storeLayerAttrData.forEach((item) => {
            if (item.storage_property_key === "database_name") {
              if (row.storage_property_val === "") {
                this.old_database_name = "xxx";
              } else {
                this.old_database_name = item.storage_property_val;
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
      // 添加文件项
      for (let j = 0; j < data.fileKey.length; j++) {
        array.push({
          storage_property_key: data.fileKey[j],
          is_file: "1",
          storage_property_val: "",
        });
      }
      // 赋值给表格
      this.storeLayerAttrData = array;
      this.numberCount = this.storeLayerAttrData.length;
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
            for (let item of this.storeLayerAttrData) {
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
    // 点击导入弹出框的取消按钮
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

.lines {
  margin-top: 4px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}

.elButton {
  float: right;
  margin-top: 20px;
  margin-bottom: 20px;
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
/deep/ .el-table_2_column_10 .el-form-item {
  margin-bottom: 0 !important;
}

/deep/ .el-table_2_column_10 .el-form-item .el-form-item__content {
  margin-left: 0 !important;
}

/deep/ .el-table_2_column_11 .cell .el-textarea .el-textarea__inner {
  height: 38px;
  line-height: 38px;
}
</style>
