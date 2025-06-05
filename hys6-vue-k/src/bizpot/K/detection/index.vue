<template>
  <div class="px-20 h100">
    <ByQuickSearch :formItems="formItems" @search="search" @reset="reset" />
    <div style="margin-top: 20px; height: calc(100% - 102px)">
      <ByContainerTitle title="落标检测任务">
        <el-button type="primary" v-debounce @click="addTask">
          新增任务
        </el-button>
      </ByContainerTitle>
      <div class="mt-20" v-if="tableData.length > 0">
        <ByTable
          :tableData="tableData"
          :columnArr="columnArr"
          :pagination="pagination"
          @operateItem="operate"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></ByTable>
      </div>
      <div style="height: calc(100% - 32px)" v-else>
        <ByEmpty />
      </div>
    </div>
    <el-dialog
      :title="modelTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px"
      top="5vh"
      @closed="dialogClosed"
    >
      <ByHeaderSlice title="基本信息" class="mb-20"></ByHeaderSlice>
      <el-form ref="form" :model="form" label-width="80px" :rules="formRules">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="task_name" label="任务名称">
              <el-input
                v-model="form.task_name"
                size="small"
                placeholder="请输入任务名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="source_id" label="检测系统">
              <el-select
                v-model="form.source_id"
                placeholder="请选择检测系统"
                size="small"
                @change="isAllTable"
              >
                <el-option
                  v-for="item in sysOptions"
                  :key="item.source_id"
                  :value="item.source_id + '|&|@!&|' + item.source_name"
                  :label="item.source_name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="task_desc" label="任务描述">
          <el-input
            type="textarea"
            size="small"
            placeholder="请输入任务描述"
            v-model="form.task_desc"
          ></el-input>
        </el-form-item>
      </el-form>
      <ByHeaderSlice title="检测表信息" class="mb-20"></ByHeaderSlice>
      <div style="margin-left: 8px">
        <span>是否检测所有表：</span>
        <el-radio-group v-model="is_all_test" @change="isAllTable">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </div>
      <div v-if="is_all_test === '0' && validForm">
        <ByQuickSearch
          :formItems="modelFormItems"
          @search="modelSearch"
          @reset="modelReset"
        />
        <div class="mt-20">
          <ByTable
            :tableData="modelTableData"
            :columnArr="modelColumnArr"
            :pagination="modelPagination"
            @handleMultiple="selectionChange"
            @sizeChange="modelSizeChange"
            @currentChange="modelCurrentChange"
            ref="tabelList"
          ></ByTable>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd"> 保存 </el-button>
      </span>
    </el-dialog>
    <ByModel
      :visible.sync="taskConfigModel"
      :model-title="'作业配置'"
      :model-width="'80%'"
      @close="taskConfigModel = false"
    >
      <ByModelForm
        :form-data="taskCOnfigData"
        :form-config="taskConfigConfig"
        :form-items="taskConfigItem"
        :form-rules="taskConfigRule"
        @etlSysCd="getSubSysCd"
        @dispFreq="dispFreq"
        @subSysCd="setSubSysCd"
        ref="taskCon"
      >
      </ByModelForm>
      <div slot="modalFoot">
        <el-button @click="taskConfigModel = false">取消</el-button>
        <el-button type="primary" @click="saveJobData">生成作业</el-button>
      </div>
    </ByModel>
    <ByModel
      :visible.sync="saveEtlModel"
      :model-title="'新增工程'"
      :model-width="'40%'"
      @close="saveEtlModel = false"
    >
      <ByModelForm
        :form-data="saveEtlData"
        :form-config="saveEtlConfig"
        :form-items="saveEtlItem"
        :form-rules="saveEtlRule"
        @etlSysCd="getSubSysCd"
        @dispFreq="dispFreq"
        ref="saveEtl"
      >
      </ByModelForm>

      <div slot="modalFoot">
        <el-button @click="saveEtlModel = false">取消</el-button>
        <el-button type="primary" @click="saveEtl">生成作业</el-button>
      </div>
    </ByModel>
    <!-- 添加/修改任务模态框 -->
    <ByModel
      :model-title="'添加任务'"
      :visible.sync="addSubSys"
      :model-width="'40%'"
      @close="addSubSys = false"
    >
      <ByModelForm
        :form-data="subSysForm"
        :form-items="subSysFormItem"
        :form-rules="subSysFormRules"
        :form-config="subSysFormConfig"
        ref="subSysFromRef"
      >
      </ByModelForm>
      <template slot="modalFoot">
        <el-button @click="addSubSys = false">取 消</el-button>
        <el-button type="primary" @click="saveSubSysCd" v-debounce>
          确 定
        </el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import {
  taskConfigConfig,
  taskConfigItem,
  taskConfigRule,
  saveEtlRule,
  saveEtlConfig,
  saveEtlItem,
  subSysFormItem,
  subSysFormRules,
  subSysFormConfig,
} from "./mock";
export default {
  data() {
    return {
      dialogVisible: false,
      modelTitle: "",
      form: {
        task_name: "",
        source_id: "",
        task_desc: "",
      },
      formRules: {
        task_name: this.filter_rules([
          { required: true, message: "请输入任务名称" },
        ]),
        source_id: this.filter_rules([
          { required: true, message: "请选择检测系统" },
        ]),
      },
      formItems: [
        {
          prop: "source_name",
          label: "系统名称",
          type: "input",
        },
        {
          prop: "dateRange",
          label: "检测日期",
          type: "daterange",
        },
      ],
      formData: {
        source_name: "",
        dateRange: [],
      },
      columnArr: [
        { label: "序号", type: "index", width: "80" },
        { prop: "task_id", type: "text", label: "任务编号" },
        { prop: "task_name", type: "text", label: "任务名称" },
        // { prop: "source_id", type: "text", label: "系统编号" },
        { prop: "source_name", type: "text", label: "系统名称" },
        { prop: "etl_time_txt", type: "text", label: "最新检测时间" },
        { prop: "etl_status_txt", type: "tag", label: "是否生成作业" },
        {
          type: "operate",
          label: "操作",
          width: "240px",
          operateArr: [
            { label: "立即执行", type: "execution" },
            { label: "编辑", type: "edit" },
            { label: "删除", type: "del" },
            { label: "作业管理", type: "job" },
          ],
        },
      ],
      tableData: [],
      is_all_test: "1",
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      modelPagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      modelFormItems: [
        {
          label: "表名",
          prop: "table_name",
          type: "input",
          placeholder: "请输入表名（支持表中英文名）",
          width: 220,
        },
      ],
      modelFormData: {
        table_name: "",
      },
      modelColumnArr: [
        { label: "选择", prop: "checked", type: "selection", width: "70" },
        { label: "序号", type: "index", width: "80" },
        { prop: "ch_name", type: "text", label: "表中文名" },
        { prop: "en_name", type: "text", label: "表英文名", fixed: "right" },
      ],
      modelTableData: [],
      sysOptions: [],
      validForm: false,
      objIds: [], //选中表格
      multipleSelection: [], //选中的表格勾选
      //作业管理
      taskConfigModel: false,
      taskCOnfigData: {},
      taskConfigConfig,
      taskConfigItem,
      taskConfigRule,
      saveEtlModel: false,
      saveEtlData: {},
      saveEtlRule,
      saveEtlConfig,
      saveEtlItem,
      task_name: "",
      task_id: "",
      addSubSys: false,
      subSysFormItem,
      subSysFormRules,
      subSysFormConfig,
      subSysForm: {},
    };
  },
  mounted() {
    this.getSystermList();
    this.getTableList();
    // this.getCode("MetaObjTypeEnum");
    this.getCode("Dispatch_Type");
    this.getCode("Dispatch_Frequency");
    this.getCode("Status");
  },
  methods: {
    addTask() {
      this.dialogVisible = true;
      this.modelTitle = "新增任务";
    },
    confirmAdd() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.modelTitle === "新增任务") {
            this.addTaskApi();
          } else {
            this.editTaskApi();
          }
        }
      });
    },
    //确认新增
    addTaskApi() {
      const params = {
        task_name: this.form.task_name,
        source_id: this.form.source_id.split("|&|@!&|")[0],
        source_name: this.form.source_id.split("|&|@!&|")[1],
        task_desc: this.form.task_desc,
        is_all_test: this.is_all_test,
      };
      if (this.is_all_test === "0") {
        params.objIds = this.multipleSelection.map((item) => item.obj_id);
      }
      // console.log(params);
      this.$executeRequest
        .execPostByControllerAllMappingName("/K/detection", params)
        .then((res) => {
          if (res.code === 999) {
            this.$Msg.customizTitle("新增成功");
            this.dialogVisible = false;
            this.getTableList();
          }
        });
    },
    //确认编辑
    editTaskApi() {
      console.log(this.form);
      const params = Object.assign({}, this.form, {
        task_id: this.form.task_id,
        source_id: this.form.source_id.split("|&|@!&|")[0],
        source_name: this.form.source_id.split("|&|@!&|")[1],
        is_all_test: this.is_all_test,
      });
      if (this.is_all_test === "0") {
        params.objIds = this.multipleSelection.map((item) => item.obj_id);
      }
      // console.log(params);
      this.$executeRequest
        .execPutByControllerMappingName("", params)
        .then((res) => {
          if (res.code === 999) {
            this.$Msg.customizTitle("编辑成功");
            this.dialogVisible = false;
            this.getTableList();
          }
        });
    },
    search(val) {
      if (val.dateRange.length > 1) {
        this.formData = val;
      } else {
        this.formData = {
          source_name: val.source_name,
          dateRange: [],
        };
      }
      this.getTableList();
    },
    //重置
    reset(val) {
      this.formData = {
        source_name: "",
        dateRange: [],
      };
      this.getTableList();
    },
    getTableList(task_id) {
      const params = {
        source_name: this.formData.source_name,
        start_date:
          this.formData.dateRange.length > 0
            ? this.formData.dateRange[0].split("-").join("")
            : "",
        end_date:
          this.formData.dateRange.length > 0
            ? this.formData.dateRange[1].split("-").join("")
            : "",
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        task_id,
      };
      this.$executeRequest
        .execGetByControllerMappingName("", params)
        .then((res) => {
          if (res.code === 999) {
            res.data.pageList.map((item) => {
              if (item.upcheck_data && item.upcheck_data.length > 0) {
                item.upcheck_data_txt =
                  item.upcheck_data.slice(0, 4) +
                  "-" +
                  item.upcheck_data.slice(4, 6) +
                  "-" +
                  item.upcheck_data.slice(6, 8);
              } else {
                item.upcheck_data_txt = "";
              }
              if (item.etl_status === "1") {
                item.etl_status_txt = {
                  text: "是",
                  color: "#3BC698",
                };
              } else {
                item.etl_status_txt = {
                  text: "否",
                  color: "#E6515D",
                };
              }
              if (item.etl_time && item.etl_time.length > 0) {
                const date = item.etl_time.split(" ")[0];
                const time = item.etl_time.split(" ")[1];
                item.etl_time_txt =
                  date.slice(0, 4) +
                  "-" +
                  date.slice(4, 6) +
                  "-" +
                  date.slice(6, 8) +
                  " " +
                  time.slice(0, 2) +
                  ":" +
                  time.slice(2, 4) +
                  ":" +
                  time.slice(4, 6);
              }
            });
            this.tableData = res.data.pageList;
            this.pagination.total = res.data.totalSize;
          }
        });
    },
    //弹窗搜索及重置
    modelSearch(val) {
      this.modelFormData = val;
      if (this.modelTitle === "编辑任务") {
        this.getTabelList("1");
      } else {
        this.getTabelList("0");
      }
    },
    modelReset(val) {
      this.modelFormData = val;
      if (this.modelTitle === "编辑任务") {
        this.getTabelList("1");
      } else {
        this.getTabelList("0");
      }
    },
    //表格操作
    operate(type, row) {
      if (type === "del") {
        this.delHandler(row.task_id);
      } else if (type === "edit") {
        this.editHandler(row.task_id);
      } else if (type === "job") {
        this.task_name = row.task_name;
        this.task_id = row.task_id;
        this.jobHandler(row);
      } else if (type === "execution") {
        this.executionHandler(row.task_id);
      }
    },
    //立即执行
    executionHandler(taskId) {
      this.$executeRequest
        .execGetByControllerMappingName("/isRun", { taskId })
        .then((res) => {
          if (res.code === 999) {
            this.$Msg.customizTitle("执行成功");
          }
        });
    },
    //删除
    delHandler(task_id) {
      this.$executeRequest
        .execDelByControllerMappingName("", [task_id])
        .then((res) => {
          if (res.code === 999) {
            this.$Msg.customizTitle("删除成功");
            this.getTableList();
          }
        });
    },
    //编辑
    editHandler(task_id) {
      this.$executeRequest
        .execGetByControllerMappingName("/getVime", { task_id })
        .then((res) => {
          if (res.code === 999) {
            this.modelTitle = "编辑任务";
            this.form = Object.assign({}, res.data, {
              task_name: res.data.task_name,
              source_id: res.data.source_id + "|&|@!&|" + res.data.source_name,
              task_desc: res.data.task_desc,
            });
            this.is_all_test = res.data.is_all_test;
            if (this.is_all_test === "0") {
              this.objIds = res.data.objList;
              this.getTabelList("1");
              this.validForm = true;
            }
            this.dialogVisible = true;
          }
        });
    },
    selectionChange(row) {
      this.multipleSelection = row;
    },
    dialogClosed() {
      this.validForm = false;
      this.modelTableData = [];
      this.modelPagination = {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      };
      this.modelFormData = {
        table_name: "",
      };
      this.form = {
        task_name: "",
        source_id: "",
        task_desc: "",
      };
      this.is_all_test = "1";
      this.objIds = [];
      this.modelTitle = "";
    },
    //获取所有检测系统options
    getSystermList() {
      this.$executeRequest
        .execPostByControllerAllMappingName("/K/standardImp/queryMeta")
        .then((res) => {
          if (res && res.success) {
            // console.log(res);
            res.data.map( item =>{
              item.source_id = item.id;
              item.source_name = item.label;
            })
            this.sysOptions = res.data;
          }
        });
    },
    //是否检测所有表radio切换
    isAllTable() {
      this.modelFormData.table_name = "";
      this.$refs.form.validateField("source_id", (valid) => {
        // console.log(valid);
        if (valid.length === 0) {
          this.validForm = true;
          if (this.modelTitle === "编辑任务") {
            this.getTabelList("1");
          } else {
            this.getTabelList("0");
          }
        }
      });
    },
    //获取检测表信息table
    getTabelList(isAll) {
      const params = {
        currPage: this.modelPagination.pageNum,
        pageSize: this.modelPagination.pageSize,
        source_id: this.form.source_id.split("|&|@!&|")[0],
        table_name: this.modelFormData.table_name,
        isAll,
      };
      this.$executeRequest
        .execGetByControllerMappingName("/getTabel", params)
        .then((res) => {
          if (res.code === 999) {
            // console.log(res);
            if (this.is_all_test === "0" && this.objIds.length > 0) {
              this.multipleSelection = res.data.pageList.filter((item) =>
                this.objIds.includes(item.obj_id)
              );
            } else {
              this.multipleSelection = [];
            }
            this.modelTableData = res.data.pageList;
            this.modelPagination.total = res.data.totalSize;
            this.toggleSelection(this.multipleSelection);
          }
        });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$nextTick(() => {
            this.$refs.tabelList.$refs.ByTable.toggleRowSelection(row, true);
          });
        });
      } else {
        this.$nextTick(() => {
          this.$refs.tabelList.$refs.ByTable.clearSelection();
        });
      }
    },
    //检测表信息table分页
    modelCurrentChange(val) {
      this.modelPagination.pageNum = val;
      if (this.modelTitle === "编辑任务") {
        this.getTabelList("1");
      } else {
        this.getTabelList("0");
      }
    },
    modelSizeChange(val) {
      this.modelPagination.pageNum = 1;
      this.modelPagination.pageSize = val;
      if (this.modelTitle === "编辑任务") {
        this.getTabelList("1");
      } else {
        this.getTabelList("0");
      }
    },
    //落标检测任务分页
    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getTableList();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getTableList();
    },
    //作业管理
    setOption(arrData, prop, data) {
      arrData.map((item) => {
        if (item.prop === prop) {
          item.options = data;
        }
      });
    },
    getCode(category) {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams("/K/code/getCategoryItems", {
          category: category,
        })
        .then((res) => {
          if (res && res.success) {
            res.data.map((item) => {
              item.label = item.value;
              item.value = item.code;
            });
            if (category === "Dispatch_Type") {
              let data = [];
              res.data.map((type) => {
                if (type.code !== "B" && type.code !== "A") {
                  data.push(type);
                }
              });
              this.setOption(this.taskConfigItem, "dispatching_mode", data);
            }
            if (category === "Dispatch_Frequency") {
              this.setOption(
                this.taskConfigItem,
                "dispatching_frequency",
                res.data
              );
            }
            if ("Status" === category) {
              this.setOption(this.saveEtlItem, "status", res.data);
            }
          }
        });
    },
    jobHandler() {
      this.taskCOnfigData = {};
      this.getSysPara("hrds_standard.properties");
      this.getEtlSysData();
      this.taskConfigModel = true;
    },
    getSysPara(paraType) {
      this.$executeRequest
        .execGetByControllerAllMappingName("/K/detection/getSysPara", {
          paraType: paraType,
        })
        .then((res) => {
          if (res && res.success) {
            this.$set(
              this.taskCOnfigData,
              "pro_dic",
              res.data.standard_coll_script_path
            );
            this.$set(
              this.taskCOnfigData,
              "pro_name",
              res.data.standard_coll_script_name
            );
            this.$set(
              this.taskCOnfigData,
              "log_dic",
              res.data.standard_coll_log_path
            );
          }
        });
    },
    // 作业调度工程编号
    getEtlSysData() {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/B/dataCollectionO/agent/startwayconf/getEtlSysData"
        )
        .then((res) => {
          if (res && res.success) {
            console.log(res.data);
            res.data.map((item) => {
              item.value = item.etl_sys_id;
              item.label = item.etl_sys_cd;
            });
            let data = [
              {
                label: "新增工程",
                options: [
                  {
                    value: "add",
                    label: "新增工程",
                  },
                ],
              },
              {
                label: "可选工程",
                options: res.data,
              },
            ];
            this.setOption(this.taskConfigItem, "etl_sys_id", data);
            this.setOption(this.saveEtlItem, "pre_etl_sys_ids", res.data);
            this.setOption(this.subSysFormItem, "etl_sys_id", res.data);
          }
        });
    },
    saveJobData(task_name, task_id) {
      this.$refs.taskCon
        .transferData()
        .then((data) => {
          let task_name = this.task_name;
          let task_id = this.task_id;
          let params = {};
          let etl_job_def = {};
          let etl_dependency = {};
          // etl_job_def["etl_job_id"] = this.taskCheckFromData.etl_job_id;  //作业ID
          // params["etl_sys_cd"] = this.sys_cd;
          etl_job_def["etl_sys_id"] = this.taskCOnfigData.etl_sys_id;
          // params["sub_sys_cd"] = this.formAdd.sub_sys_cd;
          etl_job_def["sub_sys_id"] = this.taskCOnfigData.sub_sys_id; //子系统主键
          etl_job_def["etl_job"] = task_name + "_" + task_id; //作业名称 取任务名称
          etl_job_def["etl_job_desc"] = this.taskCOnfigData.etl_job_desc; //描述
          etl_job_def["pro_type"] = "SHELL"; // 作业程序类型 默认为SHELL
          etl_job_def["pro_dic"] = this.taskCOnfigData.pro_dic; // 作业程序目录
          etl_job_def["pro_name"] = this.taskCOnfigData.pro_name; // 作业程序名称
          etl_job_def["pro_para"] = task_id; // 作业程序参数
          etl_job_def["log_dic"] = this.taskCOnfigData.log_dic; //日志目录
          etl_job_def["disp_freq"] = this.taskCOnfigData.dispatching_frequency; //调度频率

          etl_job_def["disp_offset"] =
            this.taskCOnfigData.dispatching_timedrift; //调度频率时间位移
          etl_job_def["disp_type"] = this.taskCOnfigData.dispatching_mode; //调度触发方式
          if (this.taskCOnfigData.database_pad == "") {
            this.$set(this.taskCOnfigData, "job_priority", null);
          }
          etl_job_def["job_priority"] = this.taskCOnfigData.database_pad; //作业优先级
          etl_job_def["job_eff_flag"] = "Y"; //作业有效标志 默认为有效 Y 无效N 空跑 V
          etl_job_def["comments"] = ""; //备注信息
          etl_job_def["disp_time"] = this.taskCOnfigData.dispatching_time; //调度触发时间
          etl_job_def["today_disp"] = "Y"; // 当天是否调度  默认为Y
          etl_job_def["success_job"] = "";
          etl_job_def["fail_job"] = ""; //失败后续作业
          etl_job_def["job_datasource"] = "11"; //作业程序类型
          params["etl_job_def"] = etl_job_def;
          etl_dependency["etl_job_id"] = this.taskCOnfigData.etl_job_id;
          etl_dependency["etl_sys_id"] = this.taskCOnfigData.etl_sys_id;
          etl_dependency["etl_job"] = task_name; //作业名称 取任务名称
          etl_dependency["pre_etl_sys_id"] = "";
          etl_dependency["status"] = "T"; // 依赖是否有效
          params["etl_dependency"] = etl_dependency;
          params["pre_etl_job_ids"] =
            this.taskCOnfigData.upstream_operation || []; //依赖作业 上游作业
          params["old_disp_freq"] = "";
          params["old_pre_etl_job_ids"] = "";
          params["old_dispatch_type"] = "";
          console.log(params);
          this.$executeRequest
            .execPostByControllerAllMappingName(
              "C/etlMage/jobconfig/saveEtlJobDef",
              params
            )
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("作业生成成功", "success");
                this.taskConfigModel = false;
                this.getTableList();
              }
            });
        })
        .catch((err) => {});
    },
    getSubSysCd() {
      this.setOption(this.taskConfigItem, "sub_sys_id", []);
      this.$set(this.taskCOnfigData, "sub_sys_id", "");
      this.getEtlSubSysData(this.taskCOnfigData.etl_sys_id);
    },
    //模态框新增保存按钮
    saveSubSysCd(formName) {
      this.$refs.subSysFromRef
        .transferData()
        .then((data) => {
          let params = {};
          params["etl_sys_id"] = this.subSysForm.etl_sys_id;
          params["sub_sys_cd"] = this.subSysForm.sub_sys_cd;
          params["sub_sys_desc"] = this.subSysForm.sub_sys_desc;
          params["comments"] = this.subSysForm.comments;
          this.$executeRequest
            .execPostByControllerAllMappingNameParams(
              "/C/etlMage/jobconfig/saveEtlSubSys",
              params
            )
            .then((res) => {
              if (res && res.success) {
                this.getEtlSubSysData(this.taskCOnfigData.etl_sys_id);
                this.$Msg.customizTitle("保存成功", "success");
                this.addSubSys = false;
              }
            });
        })
        .catch((err) => {});
    },
    getEtlSubSysData(id) {
      if (id === "add") {
        this.saveEtlData = {};
        this.taskCOnfigData.etl_sys_id = "";
        // alert("新增工程")
        this.saveEtlModel = true;
      } else {
        this.$executeRequest
          .execPostByControllerAllMappingNameParams(
            "/B/dataCollectionO/agent/startwayconf/getEtlSubSysData",
            { etl_sys_id: id }
          )
          .then((res) => {
            if (res && res.success) {
              console.log(res.data);
              res.data.map((item) => {
                item.value = item.sub_sys_id;
                item.label = item.sub_sys_cd;
              });
              let data = [
                {
                  label: "新增任务",
                  options: [
                    {
                      value: "add",
                      label: "新增任务",
                    },
                  ],
                },
                {
                  label: "可选任务",
                  options: res.data,
                },
              ];
              this.setOption(this.taskConfigItem, "sub_sys_id", data);
            }
          });
      }
    },
    // 调度触发方式
    dispFreq() {
      if (this.taskCOnfigData.dispatching_mode !== "D") {
        this.setConceal(this.taskConfigItem, "upstream_operation", "false");
        this.setConceal(this.taskConfigItem, "dispatching_time", "true");
        this.setConceal(this.taskConfigItem, "dispatching_timedrift", "true");
      } else {
        this.setConceal(this.taskConfigItem, "upstream_operation", "true");
        this.setConceal(this.taskConfigItem, "dispatching_time", "false");
        this.setConceal(this.taskConfigItem, "dispatching_timedrift", "false");
        this.getSearchEtlJob(this.taskCOnfigData.etl_sys_id);
      }
    },
    setConceal(data, prop, boole) {
      data.map((item) => {
        if (item.prop === prop) {
          item.conceal = boole;
        }
      });
    },
    getSearchEtlJob(etl_sys_id) {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/B/dataCollectionO/otherApi/searchEtlJob",
          { etl_sys_id: etl_sys_id }
        )
        .then((res) => {
          if (res && res.success) {
            res.data.map((item) => {
              item.label = item.etl_job;
              item.value = item.etl_job_id;
            });
            this.setOption(this.taskConfigItem, "upstream_operation", res.data);
          }
        });
    },
    saveEtl() {
      this.$refs.saveEtl
        .transferData()
        .then((value) => {
          let params = {};
          params["etl_sys_cd"] = this.saveEtlData.etl_sys_cd;
          params["etl_sys_name"] = this.saveEtlData.etl_sys_name;
          params["comments"] = this.saveEtlData.comments;
          params["pre_etl_sys_ids"] = this.saveEtlData.pre_etl_sys_ids;
          params["status"] = this.saveEtlData.status;
          this.$executeRequest
            .execPostByControllerAllMappingName("/C/etlMage/addEtlSys", params)
            .then((res) => {
              if (res && res.success) {
                this.saveEtlModel = false;
                this.getEtlSysData();
              }
            });
        })
        .catch((err) => {});
    },
    setSubSysCd() {
      if (this.taskCOnfigData.sub_sys_id === "add") {
        this.subSysForm = {};
        this.$set(this.taskCOnfigData, "sub_sys_id", "");
        if (
          this.taskCOnfigData.etl_sys_id !== "" &&
          this.taskCOnfigData.etl_sys_id !== undefined &&
          this.taskCOnfigData.etl_sys_id !== null
        ) {
          this.$set(
            this.subSysForm,
            "etl_sys_id",
            this.taskCOnfigData.etl_sys_id
          );
          this.addSubSys = true;
        } else {
          this.$Msg.customizTitle("请先选择工程信息！", "warning");
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.el-select {
  width: 100%;
}
::v-deep .el-input__inner {
  height: 32px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-size: 14px;
  color: #333333;
  padding: 0 10px;
}
::v-deep .el-textarea__inner {
  font-family: PingFangSC-Semibold, PingFang SC;
  font-size: 14px;
  color: #333333;
  padding: 0 10px;
}
</style>
<style>
.el-scrollbar__thumb {
  background-color: transparent;
}
</style>
