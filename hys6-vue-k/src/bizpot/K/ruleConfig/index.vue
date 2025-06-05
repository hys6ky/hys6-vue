<template>
  <div class="px-20 codeManage" v-if="ruleVis">
    <div v-if="ruleEtlVis === '1'">
      <!-- 查询 -->
      <ByQuickSearch :formItems="formItems" @search="search" @reset="reset" />
      <div class="container mt-10">
        <div style="height: 32px; float: right;  margin-bottom: 10px">
          <el-button type="primary" @click="batchIssue">
            批量发布
          </el-button>
          <el-button type="primary" @click="importDataStandards">
            批量导入
          </el-button>
          <el-button
              style="
              height: 32px;
              padding: 0 14px;
              margin-right: 10px;
            "
              type="primary"
              @click="add"
          >新 增</el-button
          >
        </div>
        <ByTable
            :tableData="tableData"
            :columnArr="columnArr"
            :pagination="pagination"
            @handleMultiple="handleMultipleMethod"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
            @operateItem="operateHandler"
        ></ByTable>
      </div>
      <ByModel
          :model-title="'请输入检查日期'"
          :visible="checkDateVis"
          modelWidth="25%"
          @close="checkDateClose"
      >
        <el-date-picker
            v-model="checkDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            editable
            type="date"
            placeholder="选择日期"
        >
        </el-date-picker>
        <template slot="modalFoot">
          <el-button @click="checkDateClose">取 消</el-button>
          <el-button type="primary" @click="saveCheckDate()" v-debounce
          >确 定</el-button
          >
        </template>
      </ByModel>
      <ByModel
          :model-title="'发布到工程调度'"
          :visible="issueEtlVis"
          modelWidth="25%"
          @close="issueEtlVisClose"
      >
        <ByModelForm
            :form-data="issueFromData"
            :form-items="issueFromItem"
            :form-rules="issueFromRules"
            :form-config="issueFromConfig"
            ref="issueFrom"
            @getSubSysCd="getSubSysCd()"
        ></ByModelForm>
        <template slot="modalFoot">
          <el-button @click="issueEtlVisClose">取 消</el-button>
          <el-button type="primary" @click="saveAndBatch()" v-debounce
          >确 定</el-button
          >
        </template>
      </ByModel>
    </div>
    <div v-else-if="ruleEtlVis === '2'">
      <div class="pt-10"></div>
      <rule-e-t-l-status
          :reg_num="regNum"
          @ret="retRuleRtl"
      ></rule-e-t-l-status>
    </div>
    <div v-else>
      <div class="pt-10"></div>
      <rule-detection-detail
          :task_id="this.task_id"
          @ret="retRuleRtl"
      ></rule-detection-detail>
    </div>
    <ByModel
        :visible.sync="importDataStandardsVisible"
        modelTitle="批量导入"
        @close="handleClose1"
        @closed="handleClosed"
    >
      <div>
        <div class="d-flex">
          <el-upload
              accept=".xls,.xlsx"
              action=""
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleChange"
              :on-exceed="exceedHandler"
              :limit="1"
              :fileList="fileList"
          >
            <el-button size="small" type="primary" style="margin-right: 20px">
              点击上传
            </el-button>
          </el-upload>
          <el-button
              type="primary"
              v-debounce
              @click="downloadDqExcel"
          >
            模板下载
          </el-button>
        </div>
        <el-upload
            action=""
            :fileList="fileList"
            :on-remove="clearFileList"
            class="standardFileList"
        ></el-upload>
      </div>

      <template slot="modalFoot">
        <el-button @click="handleClose1">取 消</el-button>
        <el-button type="primary" @click="upFile()" v-debounce>
          确 认
        </el-button>
      </template>
    </ByModel>
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
        <el-button type="primary" @click="checkoutSaveJOb">生成作业</el-button>
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
  <div class="px-20 codeManage" v-else>
    <div class="pt-10"></div>
    <rule-info
        :operation_type="operationType"
        :reg_num="regNum"
        @ret="ret()"
        @add="ruleInfoSave"
        @edit="ruleInfoEdit"
    ></rule-info>
  </div>
</template>

<script>
import {
  formItems,
  columnArr,
  taskConfigRule,
  taskConfigConfig,
  saveEtlConfig,
  subSysFormItem,
  subSysFormConfig,
  taskConfigItem,
  issueFromItem,
  issueFromRules,
  issueFromConfig, saveEtlItem, saveEtlRule, subSysFormRules,
} from "./mock";
import ByTable from "@/components/global/ByTable.vue";
import RuleInfo from "@/bizpot/K/ruleConfig/ruleInfo.vue";
import RuleETLStatus from "@/bizpot/K/ruleConfig/ruleETLStatus.vue";
import ByModel from "@/components/global/ByModel.vue";
import ByModelForm from "@/components/global/ByModelForm.vue";
import RuleDetectionDetail from "@/bizpot/K/ruleResults/ruleDetectionDetail.vue";
import {execPostByControllerAllMappingNameParams} from "@/utils/executeRequest";
export default {
  components: {
    RuleDetectionDetail,
    ByModelForm,
    ByModel,
    RuleETLStatus,
    RuleInfo,
    ByTable,
  },
  data() {
    return {
      saveEtlData:{},
      subSysFormConfig,
      taskConfigModel: false,
      saveEtlModel:false,
      addSubSys: false,
      taskCOnfigData: {},
      taskConfigConfig,
      subSysFormItem,
      subSysFormRules,
      subSysForm: {},
      saveEtlRule,
      saveEtlItem,
      saveEtlConfig,
      taskConfigRule,
      taskConfigItem,
      // 批量为1 单独发布为0
      tag: '0',
      reg_nums:[],
      importDataStandardsVisible: false,
      fileList:[],
      ruleVis: true,
      // 1 表示主界面 2 表示查看调度状态界面  3表示 手动执行候展示的界面
      ruleEtlVis: "1",
      checkDateVis: false,
      issueEtlVis: false,
      task_id: "",
      checkDate: "",
      issueFromData: [],
      edRuleLevel: [],
      jobEffectiveFlag: [],
      dqRuleDef: [],
      issueFromItem,
      issueFromRules,
      issueFromConfig,
      formItems,
      columnArr,
      tableData: [],
      operationType: "",
      regNum: "",
      searchForm: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
    };
  },
  mounted() {
    this.getCategoryItems("EdRuleLevel");
    this.getCategoryItems("Job_Effective_Flag");
    this.getCode("Dispatch_Type");
    this.getCode("Dispatch_Frequency");
    this.getCode("Status");
    this.getDqRuleDef();
    this.getProInfos();
    this.getQueryList();
  },
  methods: {
    search(val) {
      this.pagination.pageNum = "1";
      console.log(val);
      this.searchForm = val;
      this.searchDqDefinitionInfos(val);
    },
    reset(val) {
      console.log(val);
    },
    getCategoryItems(category) {
      this.$executeRequest
          .execPostByControllerAllMappingNameParams("/K/code/getCategoryItems", {
            category: category,
          })
          .then((res) => {
            if (res && res.success) {
              res.data.forEach((item) => {
                item.label = item.value;
                item.value = item.code;
                item.key = item.code;
              });
              if (category === "EdRuleLevel") {
                this.edRuleLevel = res.data;
              }
              if (category === "Job_Effective_Flag") {
                this.setOptions("job_status", res.data);
                this.jobEffectiveFlag = res.data;
              }
            }
          });
    },
    handleClose1() {
      this.importDataStandardsVisible = false;
    },
    handleClosed() {
      this.fileList = [];
    },
    batchIssue(){
      if (this.reg_nums && this.reg_nums.length !== 0 ){
        this.tag = '1';
        console.log(this.reg_nums)
        this.issueFromData = [];
        this.jobHandler();
        // this.issueEtlVis = true;
      }else {
        this.$Msg.customizTitle("请先选择规则!", "error");
      }
    },
    batchETLJob(){
      if (this.reg_nums && this.reg_nums.length !== 0 ){
        console.log(this.reg_nums.toString())
        let params = {
          pro_id: this.issueFromData.etl_sys_id,
          task_id: this.issueFromData.sub_sys_id,
          reg_nums: this.reg_nums.toString(),
        };
        this.$executeRequest
            .execPostByControllerAllMappingNameParams(
                "/K/dm/ruleconfig/batchETLJob",
                params
            ).then(res =>{
          if (res && res.success) {
            if(res.data || res.data !== ""){
              this.$Msg.customizTitle(res.data, "warning");
            }else{
              this.$Msg.customizTitle("批量保存成功", "success");
            }
            console.log(res.data)
            this.issueEtlVisClose();
            this.getQueryList();
          }
        })
      }else {
        this.$Msg.customizTitle("请先选择规则!", "error");
      }
    },
    // 获取上传的文件详情
    handleChange(file, fileList) {
      const extension = file.name.split(".").pop().toLowerCase();
      const isExcel = extension === "xls" || extension === "xlsx";
      if (!isExcel) {
        this.$Msg.customizTitle("上传文件只能是 xls/xlsx 格式!", "error");
        return;
      }
      this.fileList = fileList;
      // if (fileList.length != 0) {
      //   this.bulkImportVisible = true;
      // } else {
      //   this.bulkImportVisible = false;
      // }
    },
    exceedHandler() {
      this.$Msg.customizTitle("只能导入一篇", "error");
    },
    clearFileList(file, fileList) {
      this.fileList = fileList;
    },
    importDataStandards() {
      this.fileList = [];
      this.importDataStandardsVisible = true;
    },
    // 标准元模板下载
    downloadDqExcel() {
      this.$executeRequest
          .downloadGetFileAllMappingNameParams(
              "/K/dm/ruleconfig/downloadDqExcel"
          )
          .then((res) => {
            // if (res ){
            const blob = res;
            let fileName = "规则配置模板.xlsx";
            if (window.navigator.msSaveOrOpenBlob) {
              // 兼容IE10
              navigator.msSaveBlob(blob, fileName);
            } else {
              //  chrome/firefox
              let aTag = document.createElement("a");
              // document.body.appendChild(aTag);
              aTag.download = fileName;
              aTag.href = URL.createObjectURL(blob);
              if (aTag.all) {
                aTag.click();
              } else {
                //  兼容firefox
                const evt = document.createEvent("MouseEvents");
                evt.initEvent("click", true, true);
                aTag.dispatchEvent(evt);
              }
              URL.revokeObjectURL(aTag.href);
            }
            // }
          });
    },
    upFile() {
      let is_check = true;
      if (this.fileList.length === 0) {
        this.$Msg.customizTitle("上传文件不能为空", "warning");
        is_check = false;
      }
      let param = new FormData();
      if (this.fileList.length !== 0 && this.fileList[0].raw) {
        param.append("file", this.fileList[0].raw);
      }
      if (is_check) {
        this.$executeRequest
            .uploadFileAllMappingName(
                "/K/dm/ruleconfig/DqImput",
                param
            )
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("批量导入成功", "success");
                this.importDataStandardsVisible = false;
                this.getQueryList();
              }
            });
      }
    },
    getDqRuleDef() {
      this.$executeRequest
          .execPostByControllerAllMappingNameParams(
              "/K/dm/ruleconfig/getDqRuleDef"
          )
          .then((res) => {
            if (res && res.success) {
              res.data.forEach((item) => {
                item.label = item.case_type_desc;
                item.value = item.case_type;
                item.key = item.case_type;
              });
              this.setOptions("case_type", res.data);
              this.dqRuleDef = res.data;
            }
          });
    },
    getProInfos() {
      this.$executeRequest
          .execPostByControllerAllMappingName("/K/dm/ruleconfig/getProInfos")
          .then((res) => {
            if (res && res.success) {
              console.log(res.data);
              res.data.forEach((item) => {
                item.label = item.etl_sys_cd;
                item.label1 = item.etl_sys_name;
                item.value = item.etl_sys_id;
                item.key = item.etl_sys_id;
              });
              this.setOptions("etl_sys_id", res.data);
            }
          });
    },
    setOptions(prop, data) {
      if (prop === "job_status" || prop === "case_type") {
        this.formItems.forEach((item) => {
          if (prop === item.prop) {
            item.options = data;
          }
        });
      }
      if (prop === "etl_sys_id" || prop === "sub_sys_id") {
        this.issueFromItem.forEach((item) => {
          if (prop === item.prop) {
            item.options = data;
          }
        });
      }
    },
    saveCheckDate() {
      console.log(this.checkDate);
      let check = true;
      if (!this.checkDate) {
        this.$Msg.customizTitle("请输入检查日期", "warning");
        check = false;
      }
      if (check) {
        let params = {
          reg_num: this.regNum,
          verify_date: this.checkDate.replaceAll("-", ""),
        };
        this.$executeRequest
            .execPostByControllerAllMappingNameParams(
                "/K/dm/ruleconfig/manualExecution",
                params
            )
            .then((res) => {
              if (res && res.success) {
                this.task_id = res.data;
                this.$Msg.customizTitle("手动执行成功");
                this.checkDateVis = false;
                this.ruleEtlVis = "3";
              }
            });
      }
    },
    // getSubSysCd() {
    //   console.log(this.issueFromData);
    //   this.$executeRequest
    //     .execPostByControllerAllMappingNameParams(
    //       "/K/dm/ruleconfig/getTaskInfo",
    //       { etl_sys_id: this.issueFromData.etl_sys_id }
    //     )
    //     .then((res) => {
    //       if (res && res.success) {
    //         res.data.forEach((item) => {
    //           item.label = item.sub_sys_cd;
    //           item.label1 = item.sub_sys_desc;
    //           item.value = item.sub_sys_id;
    //           item.key = item.sub_sys_id;
    //         });
    //         this.setOptions("sub_sys_id", res.data);
    //       }
    //     });
    // },
    saveAndBatch(){
      // 批量发布为1 单独发布为0
      if (this.tag === "1"){
        this.batchETLJob();
      }else if (this.tag === "0"){
        this.saveissueEtlVis();
      }else {
        this.$Msg.customizTitle("发布状态TAG有问题！", "success");
      }
    },
    saveissueEtlVis() {
      let params = {
        pro_id: this.issueFromData.etl_sys_id,
        task_id: this.issueFromData.sub_sys_id,
        reg_num: this.regNum,
      };
      this.$executeRequest
          .execPostByControllerAllMappingNameParams(
              "/K/dm/ruleconfig/saveETLJob",
              params
          )
          .then((res) => {
            if (res && res.success) {
              this.$Msg.customizTitle("保存成功", "success");
              this.issueEtlVisClose();
              this.getQueryList();
            }
          });
    },
    searchDqDefinitionInfos(val) {
      // let params = {}
      let params = {
        reg_num: val.reg_num || null,
        target_tab: val.target_tab || null,
        rule_tag: val.rule_tag || null,
        reg_name: val.reg_name || null,
        rule_src: val.rule_src || null,
        case_type: val.case_type || null,
        job_status: val.job_status || null,
        // currPage : this.pagination.pageNum,
        // pageSize : this.pagination.pageSize,
      };
      this.$executeRequest
          .execPostByControllerAllMappingName(
              "/K/dm/ruleconfig/searchDqDefinitionInfos?currPage=" +
              this.pagination.pageNum +
              "&pageSize=" +
              this.pagination.pageSize,
              params
          )
          .then((res) => {
            if (res && res.success) {
              res.data.rule_dqd_data_s.forEach((item) => {
                this.dqRuleDef.forEach((def) => {
                  if (def.value === item.case_type) {
                    item.case_type_name = def.label;
                  }
                });
                this.jobEffectiveFlag.forEach((flag) => {
                  if (flag.value === item.job_status) {
                    item.job_status_name = flag.label;
                  }
                });
              });
              this.tableData = res.data.rule_dqd_data_s;
              this.pagination.total = res.data.totalSize;
            }
          });
    },
    getQueryList() {
      let params = {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      this.$executeRequest
          .execPostByControllerAllMappingNameParams(
              "/K/dm/ruleconfig/getDqDefinitionInfos",
              params
          )
          .then((res) => {
            if (res && res.success) {
              res.data.rule_dqd_data_s.forEach((item) => {
                this.dqRuleDef.forEach((def) => {
                  if (def.value === item.case_type) {
                    item.case_type_name = def.label;
                  }
                });
                this.jobEffectiveFlag.forEach((flag) => {
                  if (flag.value === item.job_status) {
                    item.job_status_name = flag.label;
                  }
                });
              });
              this.tableData = res.data.rule_dqd_data_s;
              this.pagination.total = res.data.totalSize;
            }
          });
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
    getSubSysCd() {
      this.setOption(this.taskConfigItem, "sub_sys_id", []);
      this.$set(this.taskCOnfigData, "sub_sys_id", "");
      this.getEtlSubSysData(this.taskCOnfigData.etl_sys_id);
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
    jobHandler() {
      this.taskCOnfigData = {};
      this.getSysPara("hrds_qualityManage.properties");
      this.getEtlSysData();
      this.taskConfigModel = true;
    },
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
    setOption(arrData, prop, data) {
      arrData.map((item) => {
        if (item.prop === prop) {
          item.options = data;
        }
      });
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
                  res.data.qualityManage_coll_script_path
              );
              this.$set(
                  this.taskCOnfigData,
                  "pro_name",
                  res.data.qualityManage_coll_script_name
              );
              this.$set(
                  this.taskCOnfigData,
                  "log_dic",
                  res.data.qualityManage_coll_log_path
              );
            }
          });
    },
    checkoutSaveJOb(){
      //   判断是批量发布还是手动发布
      //    0 为手动 1 为批量
      if (this.tag === '0'){
        console.log("发布")

        this.saveJobData();
      }else if (this.tag === '1'){
        console.log("批量")
        console.log(this.reg_nums)
        this.$refs.taskCon
            .transferData()
            .then((data) => {
              let i = 1;
              this.reg_nums.map( item =>{
                i++;
                console.log(item)
                this.branchSaveJobData(item.reg_name,item.reg_num);
              })
              this.$message.success("批量发布"+i+"条成功");
              this.taskConfigModel = false;})
            .catch((err) => {});
      }else {
        this.$message.warning("保存异常请重新保存！");
      }
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
            etl_job_def["pro_para"] = task_id+"@#{"+this.taskCOnfigData.curr_batch_date+"}"; // 作业程序参数
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
                  }
                });
          })
          .catch((err) => {});
    },
    branchSaveJobData(task_name, task_id) {
      console.log(task_name)
      console.log(task_id)
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
      etl_job_def["pro_para"] = task_id+"@#{"+this.taskCOnfigData.curr_batch_date+"}"; // 作业程序参数
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
            console.log("发布成1")
          });
    },

    operateHandler(type, row) {
      // console.log(type, row);
      if (type === "releaseTrigger") {
        // // alert("发布按钮");
        this.tag = '0';
        // this.issueFromData = [];
        this.task_name = row.reg_name;
        this.task_id = row.reg_num;
        this.jobHandler(row);
        // this.issueEtlVis = true;

      } else if (type === "viewRuleSchedulingStatus") {
        (this.ruleEtlVis = "2"), (this.regNum = row.reg_num);
      } else if (type === "edit") {
        this.ruleVis = !this.ruleVis;
        this.regNum = row.reg_num;
        this.operationType = "edit";
      } else if (type === "del") {
        // alert("删除操作");
        this.deleteDqDefinition(row.reg_num);
      } else if (type === "manual_execution_click") {
        // alert("手工执行")
        this.checkDateVis = true;
        this.regNum = row.reg_num;
      }
    },
    checkDateClose() {
      this.checkDateVis = false;
    },
    issueEtlVisClose() {
      this.issueEtlVis = false;
    },
    ret() {
      this.ruleVis = !this.ruleVis;
    },
    retRuleRtl() {
      this.ruleEtlVis = "1";
    },
    ruleInfoSave() {
      this.ruleVis = !this.ruleVis;
      this.getQueryList();
      this.$Msg.customizTitle("规则添加成功!", "success");
    },
    deleteDqDefinition(reg_num) {
      this.$executeRequest
          .execPostByControllerAllMappingNameParams(
              "/K/dm/ruleconfig/deleteDqDefinition",
              { reg_num: reg_num }
          )
          .then((res) => {
            if (res && res.success) {
              this.getQueryList();
              this.$Msg.customizTitle("删除成功!", "success");
            }
          });
    },
    ruleInfoEdit() {
      this.ruleVis = !this.ruleVis;
      this.getQueryList();
      this.$Msg.customizTitle("规则修改成功!", "success");
    },
    add() {
      // alert("新增")
      this.operationType = "add";
      this.regNum = "";
      this.ruleVis = !this.ruleVis;
    },
    // 批量选择
    handleMultipleMethod(val) {
      console.log(val);
      this.reg_nums = [];
      val.map( item =>{
        this.reg_nums.push({
          reg_num: item.reg_num,
          reg_name: item.reg_name
        });
      })

    },
    //分页
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.pageNum = 1;
      if (this.searchForm) {
        this.searchDqDefinitionInfos(this.searchForm);
      } else {
        this.getQueryList();
      }
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      if (this.searchForm) {
        this.searchDqDefinitionInfos(this.searchForm);
      } else {
        this.getQueryList();
      }
    },
  },
};
</script>

<style scoped lang="less"></style>
