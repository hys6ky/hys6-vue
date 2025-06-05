<template>
  <div>
    <el-row class="partFour">
      <div class="elButton">
        <el-button type="primary" @click="returnPage()" size="medium"
          >返 回</el-button
        >
<!--        <el-button type="primary" @click="downloadJars" size="medium"-->
<!--          >下 载-->
<!--        </el-button>-->
        <el-button
          type="primary"
          size="medium"
          @click="next('ruleForm')"
          style="float: right"
          >保 存</el-button
        >
      </div>
    </el-row>
    <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="150px">
      <div class="startupform">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="作业调度工程编号"
              prop="etl_sys_id"
              :rules="filter_rules([{ required: true }])"
            >
              <el-col :span="16">
                <el-select
                  placeholder="选择作业调度工程编号"
                  v-model="ruleForm.etl_sys_id"
                  style="width: 100%"
                  size="medium"
                >
                  <el-option
                    v-for="(item, index) in alletlsys"
                    :key="index"
                    :label="item.etl_sys_cd"
                    :value="item.etl_sys_id"
                  >
                    <span style="float: left">{{ item.etl_sys_cd }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.etl_sys_name }}</span
                    >
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="作业调度任务编号"
              prop="sub_sys_id"
              :rules="filter_rules([{ required: true }])"
            >
              <el-col :span="16">
                <el-select
                  placeholder="选择作业调度任务"
                  v-model="ruleForm.sub_sys_id"
                  style="width: 100%"
                  size="medium"
                  @focus="getwork_numFun()"
                >
                  <el-option
                    v-for="(item, index) in alletltask"
                    :key="index"
                    :label="item.sub_sys_cd"
                    :value="item.sub_sys_id"
                  >
                    <span style="float: left">{{ item.sub_sys_cd }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.sub_sys_desc }}</span
                    >
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调度频率" prop="Dispatching_frequency">
              <el-col :span="16">
                <el-select
                  style="width: 100%"
                  v-model="ruleForm.Dispatching_frequency"
                  placeholder="频率选择"
                  clearable
                  size="medium"
                  @change="Dispatching_frequencyFun"
                >
                  <el-option
                    v-for="item in Dispatch_Frequency"
                    :key="item.value"
                    :label="item.value"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" prop="database_pad">
            <el-form-item label="作业优先级" prop="work_pro">
              <el-col :span="16">
                <el-input
                  v-model="ruleForm.work_pro"
                  size="medium"
                  placeholder="0"
                  @input="getwork_proFun"
                  style="width: 100%"
                >
                </el-input>
              </el-col>
              <el-tooltip
                class="item"
                effect="dark"
                content="作业优先级设置的数字越大越优先执行"
                placement="right"
              >
                <i
                  class="fa fa-question-circle"
                  aria-hidden="true"
                  style="margin-left: 4px"
                ></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调度触发方式" prop="Dispatching_mode">
              <el-col :span="16">
                <el-select
                  style="width: 100%"
                  v-model="ruleForm.Dispatching_mode"
                  @change="Dispatching_modeFun"
                  placeholder="调度触发方式选择"
                  clearable
                >
                  <el-option
                    v-for="item in Dispatching_mode"
                    :key="item.value"
                    :label="item.value"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="ruleForm.Dispatching_mode == 'D'">
            <el-form-item label="上游作业" prop="Upstream_operation">
              <el-col :span="16">
                <el-select
                  style="width: 100%"
                  filterable
                  v-model="ruleForm.Upstream_operation"
                  multiple
                  placeholder="上游作业"
                  @focus="getPreJobName"
                  @change="getUpstream_operationFun"
                >
                  <el-option
                    v-for="item in preJobName"
                    :key="item.value"
                    :label="item.value"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col
            :span="8"
            v-if="
              ruleForm.Dispatching_mode == 'T' ||
              ruleForm.Dispatching_mode == 'Z'
            "
          >
            <el-form-item label="调度触发时间" prop="Dispatching_time">
              <el-col :span="16">
                <el-time-picker
                  style="width: 100%"
                  v-model="ruleForm.Dispatching_time"
                  @change="getDispatching_timeFun"
                  :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
                  placeholder="调度时间 hh:mm:ss"
                  value-format="HH:mm:ss"
                  format="HH:mm:ss"
                >
                </el-time-picker>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="调度时间位移"
              prop="Dispatching_timedrift"
              v-if="
                ruleForm.Dispatching_mode == 'T' ||
                ruleForm.Dispatching_mode == 'Z'
              "
            >
              <el-col :span="16">
                <el-input
                  v-model="ruleForm.Dispatching_timedrift"
                  @input="getDispatching_timedriftFun"
                  size="medium"
                  placeholder="0"
                  style="width: 100%"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item
              label="作业程序目录"
              prop="work_path"
              :rules="rule.default"
            >
              <el-col :span="16">
                <el-input
                  v-model="ruleForm.work_path"
                  placeholder="作业程序目录"
                  size="medium"
                  style="width: 100%"
                ></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="采集作业日志目录"
              prop="log_path"
              :rules="rule.default"
            >
              <el-col :span="16">
                <el-input
                  v-model="ruleForm.log_path"
                  placeholder="采集作业日志目录"
                  size="medium"
                  style="width: 100%"
                ></el-input>
              </el-col>
              <el-tooltip
                class="item"
                effect="dark"
                content="这是目录，不要定义成文件"
                placement="right"
              >
                <i class="fa fa-question-circle" aria-hidden="true"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table
          :header-cell-style="{ background: '#e6e0e0' }"
          ref="filterTable"
          @selection-change="handleSelectionChange"
          stripe
          :default-sort="{ prop: 'date', order: 'descending' }"
          style="width: 100%"
          size="medium"
          border
          :data="
            ruleForm.startuptableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
        >
          <el-table-column type="selection" width="70" align="center"> </el-table-column>
          <el-table-column label="序号" align="center" width="70">
            <template slot-scope="scope">
              <span>{{ scope.$index + (currentPage - 1) * pageSize + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="作业名称"
            width="260"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'startuptableData.' + scope.$index + '.etl_job'"
                :rules="rule.default"
                label-width="0px"
              >
                <el-input
                  v-model="scope.row.etl_job"
                  placeholder="作业名称"
                >
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="作业描述" align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'startuptableData.' + scope.$index + '.etl_job_desc'"
                label-width="0px"
              >
                <el-input
                  v-model="scope.row.etl_job_desc"
                  type="textarea"
                  placeholder="作业描述"
                  size="medium"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="调度频率" align="center" width="120px">
            <template slot-scope="scope">
              <el-form-item
                :prop="'startuptableData.' + scope.$index + '.disp_freq'"
                label-width="0px"
              >
                <el-select
                  style="width: 100%"
                  v-model="scope.row.disp_freq"
                  placeholder="频率选择"
                  clearable
                  size="mini"
                  :rules="rule.default"
                >
                  <el-option
                    v-for="item in Dispatch_Frequency"
                    :key="item.value"
                    :label="item.value"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="作业优先级"
            align="center"
            :show-overflow-tooltip="true"
            width="90"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'startuptableData.' + scope.$index + '.job_priority'"
                label-width="0px"
              >
                <el-input
                  style="width: 100%"
                  v-model="scope.row.job_priority"
                  placeholder="0"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="调度触发方式" align="center" width="160">
            <template slot-scope="scope">
              <el-form-item
                :prop="'startuptableData.' + scope.$index + '.disp_type'"
                label-width="0px"
              >
                <el-select
                  style="width: 100%"
                  v-model="scope.row.disp_type"
                  placeholder="调度触发方式"
                  size="mini"
                  clearable
                  :rules="rule.default"
                >
                  <el-option
                    v-for="item in Dispatching_mode"
                    :key="item.value"
                    :label="item.value"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="调度时间位移"
            align="center"
            :show-overflow-tooltip="true"
            width="90"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'startuptableData.' + scope.$index + '.disp_offset'"
                v-if="
                  scope.row.disp_type === 'T' || scope.row.disp_type === 'Z'
                "
                label-width="0px"
              >
                <el-input
                  style="width: 100%"
                  v-model="scope.row.disp_offset"
                  placeholder="0"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="调度触发时间" align="center" width="150">
            <template slot-scope="scope">
              <el-form-item
                :prop="'startuptableData.' + scope.$index + '.disp_time'"
                :rules="rule.default"
                v-if="
                  scope.row.disp_type === 'T' || scope.row.disp_type === 'Z'
                "
                label-width="0px"
              >
                <el-time-picker
                  style="width: 100%"
                  v-model="scope.row.disp_time"
                  size="mini"
                  :picker-options="{ selectableRange: '00:00:00 - 23:59:59' }"
                  placeholder="hh:mm:ss"
                  value-format="HH:mm:ss"
                  format="HH:mm:ss"
                ></el-time-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="上游作业"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'startuptableData.' + scope.$index + '.pre_etl_job'"
                :rules="rule.default"
                v-if="scope.row.disp_type === 'D'"
                label-width="0px"
              >
                <el-select
                  style="width: 100%"
                  filterable
                  v-model="scope.row.pre_etl_job"
                  multiple
                  size="mini"
                  placeholder="上游作业"
                  @focus="getPreJobName"
                  max-width="100px"
                >
                  <el-option
                    v-for="item in preJobName"
                    :key="item.value"
                    :label="item.value"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <el-row class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize"
        class="locationcenter"
      />
    </el-row>
    <!-- 选择作业调度工程编号 -->
    <el-dialog title="选择作业调度工程编号" :visible.sync="Projectnumdialog">
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right"
          >选择作业调度工程编号</span
        >
      </div>
      <el-table
        :data="
          ProjectnumData.slice(
            (ProjectnumcurrentPage - 1) * Projectnumpagesize,
            ProjectnumcurrentPage * Projectnumpagesize
          )
        "
        border
        size="medium"
        highlight-current-row
      >
        <el-table-column
          property
          label="选择"
          width="60px"
          type="index"
          align="center"
        >
          <template slot-scope="scope">
            <el-radio v-model="projnum_radio" :label="scope.row"
              >&thinsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column property label="序号" width="70px" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.$index +
              (ProjectnumcurrentPage - 1) * Projectnumpagesize +
              1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="etl_sys_cd"
          label="作业调度工程编号"
          align="center"
        ></el-table-column>
        <el-table-column
          property="etl_sys_name"
          label="工程名称"
          align="center"
        ></el-table-column>
      </el-table>
      <el-pagination
        @size-change="Projectnum_handleSizeChange"
        @current-change="Projectnum_handleCurrentChange"
        :current-page="ProjectnumcurrentPage"
        :page-size="Projectnumpagesize"
        layout="total, prev, pager, next"
        :total="ProjectnumData.length"
        class="locationright"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="danger"
          size="mini"
          @click="projNumCloseFun(), (Projectnumdialog = false)"
          >取 消</el-button
        >
        <el-button type="primary" size="mini" @click="projNumSubmitFun()"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 选择作业调度任务编号 -->
    <el-dialog
      title="选择作业调度任务编号"
      :visible.sync="Worknumdialog"
      width="40%"
    >
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right"
          >选择作业调度任务编号</span
        >
        <span class="dialogtoptxt">
          工程名称:
          <p class="dialogtopname">{{ ruleForm.Project_name }}</p>
        </span>
      </div>
      <el-table
        :data="
          WorknumData.slice(
            (WorknumcurrentPage - 1) * Worknumpagesize,
            WorknumcurrentPage * Worknumpagesize
          )
        "
        border
        size="medium"
        highlight-current-row
      >
        <el-table-column
          property
          label="选择"
          width="60px"
          type="index"
          align="center"
        >
          <template slot-scope="scope">
            <el-radio v-model="worknum_radio" :label="scope.row.sub_sys_cd"
              >&thinsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column property label="序号" width="70px" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.$index + (WorknumcurrentPage - 1) * Worknumpagesize + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="sub_sys_cd"
          label="作业调度任务编号"
          align="center"
        ></el-table-column>
        <el-table-column
          property="sub_sys_desc"
          label="任务名称"
          align="center"
        ></el-table-column>
      </el-table>
      <el-pagination
        @size-change="Worknum_handleSizeChange"
        @current-change="Worknum_handleCurrentChange"
        :current-page="WorknumcurrentPage"
        :page-size="Worknumpagesize"
        layout="total, prev, pager, next"
        :total="WorknumData.length"
        class="locationright"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="mini" @click="Worknumdialog = false"
          >取 消</el-button
        >
        <el-button type="primary" size="mini" @click="worknumSubmitFun()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import * as fileOperations from "@/utils/fileOperations";

export default {
  name:"dataReceptionJob",
  data() {
    return {
      rule: validator.default,
      currentPage: 1,
      pageSize: 10,
      pagesize: 100,
      totalSize: 0,
      ProjectnumcurrentPage: 1,
      Projectnumpagesize: 10,
      WorknumcurrentPage: 1,
      multipleSelection: [],
      Worknumpagesize: 10,
      finishDialogVisible: false,
      Projectnumdialog: false,
      Worknumdialog: false,
      tableloadingInfo: "数据加载中...",
      task_ids: [],
      alletlsys: [],
      alletltask: [],
      ruleForm: {
        etl_sys_id: null,
        sub_sys_id: null,
        etl_sys_cd: "",
        sub_sys_cd: "",
        work_type: "",
        work_name: "",
        work_path: "",
        log_path: "",
        Dispatching_frequency: "",
        Dispatching_timedrift: "",
        Dispatching_time: "",
        work_pro: "",
        Upstream_operation: "", //上游作业
        etl_job: "",
        etl_job_desc: "",
        startuptableData: [],
      },
      Dispatch_Frequency: [], //调度频率
      Dispatching_mode: [], //调度触发方式
      ProjectnumData: [], //工程编号数据
      projnum_radio: {}, //工程编号选择radio
      WorknumData: [], //工程编号数据
      worknum_radio: "",
      Pro_Type: [], //作业程序类型
      preJobName: [], //上游作业名称
    };
  },
  created() {
     this.task_ids = this.$route.query.task_id
    this.getIsReleaseData(this.task_ids, this.currentPage, this.pageSize);
  },
  mounted() {
    this.getEtlSysDataFun();
    this.getJobMsg();
    // 调度频率
    this.$Code
      .getCategoryItems({
        category: "Dispatch_Frequency",
      })
      .then((res) => {
        if (res.data) {
          this.Dispatch_Frequency = res.data;
        }
      });
    // 调度触发方式
    this.$Code
      .getCategoryItems({
        category: "Dispatch_Type",
      })
      .then((res) => {
        if (res.data) {
          let data = res.data;
          for (let i = 0; i < data.length; i++) {
            if (data[i].code == "A" || data[i].code == "B") {
              data.splice(i, 1);
              i--;
            }
          }
          this.Dispatching_mode = res.data;
        }
      });
    // 作业程序类型
    this.$Code.getCategoryItems({category: "Pro_Type"}).then((res) => {
      if (res.data) {
        this.Pro_Type = res.data;
      }
    });
  },
  methods: {
    getIsReleaseData(task_ids1, page1, size1) {
      let params = {};
      params["task_ids"] = task_ids1;
      params["currPage"] = page1;
      params["pageSize"] = size1;
      this.$executeRequest
        .execPostByModuleUrl("/dataReception/getIsReleaseData", params)
        .then((res) => {
          this.ruleForm.startuptableData = res.data.receiveInfo;
          this.totalSize = res.data.totalSize;
          this.ruleForm.work_path = res.data.sysDir + "/";
          this.ruleForm.log_path = res.data.sysDir + "/logs/";
        });
    },
    next(formName) {
      if (this.multipleSelection.length == 0) {
        this.$Msg.customizTitle("请选择至少一条需要保存的数据", "warning");
      } else {
        // this.$confirm("确认发布吗?", "提示", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning",
        // }).then(() => {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              console.log(this.multipleSelection,"this.multipleSelection")
              let etlJobs = [];
              let etlPre = [];
              let task_id_list = [];
              this.multipleSelection.forEach((item) => {
                task_id_list.push({
                  task_id: item.dr_task_id,
                });
              });
              this.multipleSelection.forEach((item) => {
                etlJobs.push({
                  pro_type: this.ruleForm.work_type,
                  pro_name: this.ruleForm.work_name,
                  disp_type: item.disp_type,
                  pro_dic: this.ruleForm.work_path,
                  log_dic: this.ruleForm.log_path,
                  sub_sys_id: this.ruleForm.sub_sys_id,
                  etl_job: item.etl_job,
                  etl_job_id:item.etl_job_id,
                  etl_job_desc: item.etl_job_desc,
                  disp_freq: item.disp_freq,
                  job_priority: parseInt(item.job_priority),
                  disp_offset: parseInt(item.disp_offset),
                  disp_time: item.disp_time,
                  pro_para: item.pro_para,
                  etl_sys_id: this.ruleForm.etl_sys_id,
                });
                if (item.disp_type == "T" || item.disp_type == "Z") {
                  etlPre.push();
                } else {
                  etlPre.push(item.pre_etl_job);
                }
              });
              let distributeJobBean = {
                etlJobDefList: etlJobs,
                ddIds: task_id_list,
                preEtlJobIdList: etlPre,
              };
              this.$executeRequest
                .execPostByModuleUrl(
                  "/dataReception/saveDataReceiveJobRelation",distributeJobBean
                )
                .then((res) => {
                    if (res && res.success) {
                      this.$Msg.customizTitle("保存成功", "success");
                      this.getIsReleaseData();
                      this.$router.push({
                        name: "dataReception",
                      });
                    }
                });
            }
          });
        // });
      }
    },
    getJobMsg() {
      this.$executeRequest.execPostByMenuUrl("/getJobMsg", {dd_ids: this.task_ids}).then((res) => {
          if (res && res.success) {
            this.ruleForm.etl_sys_id = res.data[0][0].etl_sys_id;
            this.ruleForm.sub_sys_id = res.data[0][0].sub_sys_id;
            this.ruleForm.etl_sys_cd = res.data[0][0].etl_sys_cd;
            this.ruleForm.sub_sys_cd = res.data[0][0].sub_sys_cd;
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].length == 2) {
                this.ruleForm.startuptableData[i] = res.data[i][0];
                this.ruleForm.startuptableData[i].dr_task_id = res.data[i][1].dr_task_id;
              } else if (res.data[i].length == 3) {
                this.ruleForm.startuptableData[i] = res.data[i][0];
                this.ruleForm.startuptableData[i].dr_task_id = res.data[i][2].dr_task_id;
                this.ruleForm.startuptableData[i].pre_etl_job =
                  res.data[i][1].pre_etl_job;
              }
            }
            if (this.ruleForm.etl_sys_id){
              this.getwork_numFun();
            }
          }
        });
    },
    // downloadJars() {
    //   this.$executeRequest
    //     .execDownloadFileByUrl("/dataDistribution/packageJars", {
    //       fileName: "dataDistribute.zip",
    //     })
    //     .then((res) => {
    //       fileOperations.fileDownload(res, "dataDistribute.zip");
    //     });
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //通过触发方式value值遍历得到code
    getDispatch_FrequencycodeFun(value) {
      for (let i = 0; i < this.Dispatch_Frequency.length; i++) {
        if (this.Dispatch_Frequency[i].value == value) {
          return this.Dispatch_Frequency[i].code;
        }
      }
    },
    // 获取工程信息
    getEtlSysDataFun() {
      this.tableloadingInfo = "数据加载中...";
      this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/startwayconf/getEtlSysData").then((res) => {
          if (res.success) {
            if (res.data.length > 0) {
              // this.ProjectnumData = res.data;
              this.alletlsys = res.data;
            } else {
              this.tableloadingInfo = "暂无数据";
            }
          }
        });
    },
    // 返回
    returnPage() {
      this.$router.push({
        name:"dataReception",
      })
      // let showData = {
      //   dr_task_id: this.$route.query.task_id
      // }
      // this.$executeRequest.execGetByPostModuleUrl('/dataReception/queryTaskAndFile', showData).then((res) => {
      //   if (res.success) {
      //     // console.log(res, '回显的信息')
      //     this.$router.push({
      //       name: 'parameterNew',
      //       query: {
      //         isEdit: true,
      //         drTask: {
      //           dr_task_id: res.data.taskInfo.dr_task_id,
      //           dr_task_name: res.data.taskInfo.dr_task_name,
      //           dr_format: res.data.taskInfo.dr_format,
      //           dr_request_method: res.data.taskInfo.dr_request_method,
      //           dr_url: res.data.taskInfo.dr_url
      //         },
      //         fileDef: {
      //           dr_file_id: res.data.fileInfo.dr_file_id,                   //文件ID
      //           dr_task_id: res.data.fileInfo.dr_task_id,                   //任务ID
      //           dr_file_name: res.data.fileInfo.dr_file_name,               //文件名称
      //           dr_file_suffix: res.data.fileInfo.dr_file_suffix,           //文件后缀
      //           dr_row_separator: res.data.fileInfo.dr_row_separator,       //行分隔符
      //           dr_database_separator: res.data.fileInfo.dr_database_separator,   //列分隔符
      //           dr_database_code: res.data.fileInfo.dr_database_code,             //编码格式
      //           dr_plane_url: res.data.fileInfo.dr_plane_url,                     //数据落地目录
      //           dbfile_format: res.data.fileInfo.dbfile_format,                   //文件格式
      //           is_header: res.data.fileInfo.is_header,                           //是否需要表头
      //           df_remark: res.data.fileInfo.df_remark
      //         },
      //         drAnalyses: res.data.taskInfo.analysisList,
      //       }
      //     })
      //   }
      // })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getIsReleaseData(this.dd_ids,this.currentPage, this.pageSize);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getIsReleaseData(this.dd_ids,this.currentPage, this.pageSize);
    },
    Projectnum_handleSizeChange(size) {
      this.Projectnumpagesize = size;
    },
    Projectnum_handleCurrentChange(currentPage) {
      this.ProjectnumcurrentPage = currentPage;
    },
    Worknum_handleSizeChange(size) {
      this.Worknumpagesize = size;
    },
    Worknum_handleCurrentChange(currentPage) {
      this.WorknumcurrentPage = currentPage;
    },
    //触发方式改变
    Dispatching_modeFun(key) {
      let value = this.getDispatching_modeValueFun(key);
      this.ruleForm.startuptableData.forEach((item) => {
        this.$set(item, "disp_type", key);
      });
    },
    //通过触发方式key值遍历得到中文value值
    getDispatching_modeValueFun(key) {
      this.Dispatching_mode.forEach((item) => {
        if (item.code == key) {
          return item.value;
        }
      });
    },
    // 获取上游作业下拉
    getPreJobName() {
      let arr = [];
      if (
        this.ruleForm.etl_sys_id != undefined &&
        this.ruleForm.etl_sys_id != ""
      ) {
        this.$executeRequest
          .execGetByPostModuleUrl("/dataDistribution/searchEtlJob", {
            etl_sys_id: this.ruleForm.etl_sys_id,
          })
          .then((res) => {
            if (res.success) {
              if (res !== undefined && res.data.length > 0) {
                res.data.forEach((item) => {
                  arr.push({
                    value: item,
                    code: item,
                  });
                });
                this.preJobName = arr;
              }
            }
          });
      } else {
        this.$Msg.customizTitle("作业调度工程编号未选择", "warn");
      }
    },
    projNumCloseFun() {
      this.projnum_radio = {};
    },
    // 选择工程弹框确定
    projNumSubmitFun() {
      this.ruleForm.etl_sys_id = this.projnum_radio.etl_sys_id;
      this.ruleForm.Project_name = this.projnum_radio.etl_sys_name;
      this.ruleForm.sub_sys_id = "";
      this.Projectnumdialog = false;
    },
    //点击任务编号按钮
    getwork_numFun() {
      //调接口显示内容
      if (
        this.ruleForm.etl_sys_id != undefined &&
        this.ruleForm.etl_sys_id != ""
      ) {
        // this.Worknumdialog = true;
        this.tableloadingInfo = "数据加载中...";
        let params = {
          etl_sys_id: this.ruleForm.etl_sys_id,
        };
        this.$executeRequest.execGetByPostModuleUrl("/dataCollectionO/agent/startwayconf/getEtlSubSysData", params).then((res) => {
            if (res.success) {
              if (res.data.length > 0) {
                // this.WorknumData = res.data;
                this.alletltask = res.data;
              } else {
                this.tableloadingInfo = "暂无数据";
              }
            }
          });
      } else {
        this.$Msg.customizTitle("作业调度工程编号未选择", "warn");
      }
    },
    // 作业调度任务编号提交
    worknumSubmitFun() {
      this.ruleForm.sub_sys_id = this.worknum_radio;
      this.Worknumdialog = false;
    },
    // 调度频率改变时
    Dispatching_frequencyFun() {
      let code = this.ruleForm.Dispatching_frequency;
      this.getstartuptableData(code);
    },
    //遍历全表改变对应列值--调度频率
    getstartuptableData(key) {
      this.ruleForm.startuptableData.forEach((item) => {
        this.$set(item, "disp_freq", key);
      });
    },
    // 作业优先级发生改变
    getwork_proFun() {
      let value = this.ruleForm.work_pro;
      this.ruleForm.startuptableData.forEach((item) => {
        this.$set(item, "job_priority", value);
      });
    },
    //上游作业改变
    getUpstream_operationFun() {
      let value = this.ruleForm.Upstream_operation;
      this.ruleForm.startuptableData.forEach((item) => {
        this.$set(item, "pre_etl_job", value);
      });
    },
    getUpstream_Fun() {
      let value = this.ruleForm.sub_sys_id;
      this.ruleForm.startuptableData.forEach((item) => {
        this.$set(item, "sub_sys_id", value);
      });
    },
    // 调度时间发生改变
    getDispatching_timeFun() {
      let value = this.ruleForm.Dispatching_time;
      this.ruleForm.startuptableData.forEach((item) => {
        this.$set(item, "disp_time", value);
        this.$forceUpdate();
      });
      this.$forceUpdate();
    },
    // 调度时间位移发生改变时
    getDispatching_timedriftFun() {
      let value = this.ruleForm.Dispatching_timedrift;
      this.ruleForm.startuptableData.forEach((item) => {
        this.$set(item, "disp_offset", value);
      });
    },
  },
};
</script>

<style scoped>
.leftbtn {
  margin-top: 12px;
  margin-top: 12px;
  float: left;
  margin: 15px;
  margin-bottom: 10px;
}

.rightbtn {
  margin-top: 12px;
  margin-top: 12px;
  float: right;
  margin: 15px;
  margin-bottom: 10px;
}

.startupform {
  border: 1px solid #efebeb;
  padding: 14px 0 0 10px;
  margin: 12px 0;
  border-radius: 4px;
}

.locationcenter {
  text-align: center;
  margin-top: 5px;
}

.locationbut {
  text-align: right;
  margin-top: 10px;
}

.startupform >>> .el-input-group__prepend {
  background-color: #e6a23c;
  color: white;
}

.ml_lable >>> .el-form-item__label {
  width: 26% !important;
}

.ml_lable >>> .el-form-item__content {
  margin-left: 26% !important;
}

.steps4 >>> .el-form-item {
  margin-bottom: 0 !important;
}

.steps4 >>> .el-form-item__content {
  margin-left: 0px !important;
}

.steps4 >>> .el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 6px;
  position: absolute;
  top: 69%;
  left: 4%;
  z-index: 1;
}

.linefs >>> .el-form-item__content {
  line-height: 23px !important;
}

.steps4 >>> .el-form-item__content::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
  display: inline-block;
  position: absolute;
  left: -8px;
}

.steps4 >>> tr > td {
  padding: 0;
}

.steps4 >>> .el-input-group__prepend {
  color: #fff !important;
  background-color: #e6a23c !important;
  border-color: #e6a23c !important;
}

.steps4 >>> tr > td > .cell {
  padding: 6px 10px;
}

.fdcColor >>> .el-input__inner {
  color: #f19b00;
}

#steps6 >>> .el-tag.el-tag--info {
  max-width: 88%;
}

.partFour {
  margin-top: 10px;
}

/* 按钮样式 */
.elButton {
  float: right;
  margin-bottom: 10px;
}

#steps6 >>> .el-select__tags-text {
  display: inline-flex;
  overflow: hidden;
  max-width: 90%;
}

#steps6 >>> .el-select .el-tag__close.el-icon-close {
  right: -1px !important;
}
</style>