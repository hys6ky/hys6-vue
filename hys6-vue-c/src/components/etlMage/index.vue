<template>
  <div class="loindex px-20 codeManage h100">
    <div class="d-flex py-10 justify-content-between">
      <ByHeaderSlice title="工程管理" />
      <el-button type="primary" size="small" @click="addProject()">
        <i class="el-icon-circle-plus-outline"></i>
        <span>添加工程</span>
      </el-button>
    </div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      style="height: calc(100% - 38px)"
    >
      <el-tab-pane label="工程信息" name="first">
        <ByTable
          v-if="tableData.length !== 0"
          :tableData="tableData"
          :columnArr="columnArr1"
          @linkTo="details"
          @operateItem="operateItem"
        />
        <by-empty v-else></by-empty>
      </el-tab-pane>
      <el-tab-pane label="调度监控" name="second">
        <draggable v-model="listdata">
          <el-col
            :span="12"
            v-for="(item, index) in listdata"
            :key="item.etl_sys_cd"
          >
            <div class="movePlace" style="margin-right: 20px;margin-top: 10px;">
              <span class="pDrag">
                <span> {{ item.sys_name }} --拖动可排列顺序</span>
                <span>
                  <el-tooltip
                    class="items"
                    effect="dark"
                    content="点击可放大查看详情"
                    placement="bottom"
                  >
                    <i
                      @click="fullScreen(item)"
                      class="el-icon-full-screen"
                    ></i>
                  </el-tooltip>
                </span>
              </span>
              <p class="span10" @click="routerLink(item)">批量运行状态</p>
              <p class="span11">批量日期：{{ item.bathdate }}</p>
              <p
                :id="`radar${item.etl_sys_id}`"
                :key="item.etl_sys_cd"
                :style="{ height: '300px' }"
              ></p>
            </div>
          </el-col>
        </draggable>
      </el-tab-pane>
      <el-tab-pane label="采集表信息" name="third">
        <ByQuickSearch
          :form-items="quickFromItme"
          @search="searchTable"
        ></ByQuickSearch>
        <!--        <el-form :inline="true" :model="formInline" class="demo-form-inline">-->
        <!--          <el-form-item class="form-line">-->
        <!--            <el-input-->
        <!--              v-model="formInline.tableName"-->
        <!--              size="mini"-->
        <!--              placeholder="输入表名搜索表信息"-->
        <!--            />-->
        <!--          </el-form-item>-->
        <!--          <el-form-item class="form-line">-->
        <!--            <el-button type="primary" size="mini" @click="searchTable"-->
        <!--              >查询</el-button-->
        <!--            >-->
        <!--          </el-form-item>-->
        <!--        </el-form>-->
        <div style="height: calc(100% - 81px)">
          <ByTable
            v-if="CJtableData.length !== 0"
            :table-data="CJtableData.slice(
              (pagination.pageNum - 1) * pagination.pageSize,
              pagination.pageNum * pagination.pageSize
            )"
            :column-arr="columnArr2"
            :pagination="pagination"
            @sizeChange="handleSizeChange"
            @currentChange="handleCurrentChange"
          />
          <ByEmpty v-else></ByEmpty>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加/编辑工程模态框 -->
    <ByModel
      :modelTitle="projectTitle"
      :visible.sync="dialogFormVisibleAdd"
      modelWidth="650px"
      @confirm="add('formAdd')"
      @close="closeModel"
    >
      <ByModelForm
        :formData="formAdd"
        :formConfig="modelFormConfig"
        :formItems="ModelformItems"
        :formRules="ModeFromRules"
        ref="formAddRef"
      />
    </ByModel>
    <!--    部署Agent工程参数 -->
    <ByModel
      :model-title="'部署Agent工程参数'"
      :visible.sync="dialogFormVisibleDeploy"
      :model-width="'40%'"
      @close=""
    >
      <ByModelForm
        :form-data="formDeploy"
        :form-config="formDeployConfig111"
        :form-items="formDeployItem"
        @swichChange="swichChange"
        :form-rules="formDeployRules"
        ref="formDeployConfig111"
      ></ByModelForm>
      <div slot="modalFoot">
        <el-button @click="cancleDeploy" size="mini">取消</el-button>
        <el-button
          type="primary"
          @click="saveDeploy('formDeployConfig111')"
          :loading="isLoadings"
          size="mini"
          >部署</el-button
        >
      </div>
    </ByModel>
    <!--    <el-dialog-->
    <!--      title="部署Agent工程参数"-->
    <!--      :visible.sync="dialogFormVisibleDeploy"-->
    <!--      width="40%"-->
    <!--    >-->
    <!--      <el-form-->
    <!--        :model="formDeploy"-->
    <!--        ref="formDeploy"-->
    <!--        label-width="170px"-->
    <!--        class="demo-ruleForm"-->
    <!--      >-->
    <!--        <el-form-item-->
    <!--          label="工程编号"-->
    <!--          prop="etl_sys_cd"-->
    <!--          :rules="filter_rules([{ required: true }])"-->
    <!--        >-->
    <!--          <el-input-->
    <!--            v-model="formDeploy.etl_sys_cd"-->
    <!--            style="width: 270px"-->
    <!--            disabled-->
    <!--          ></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item-->
    <!--          label="Agent服务器IP"-->
    <!--          prop="etl_serv_ip"-->
    <!--          :rules="filter_rules([{ required: true }])"-->
    <!--        >-->
    <!--          <el-input-->
    <!--            v-model="formDeploy.etl_serv_ip"-->
    <!--            style="width: 270px"-->
    <!--          ></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item-->
    <!--          label="Agent服务器用户名"-->
    <!--          prop="user_name"-->
    <!--          :rules="filter_rules([{ required: true }])"-->
    <!--        >-->
    <!--          <el-input-->
    <!--            v-model="formDeploy.user_name"-->
    <!--            style="width: 270px"-->
    <!--          ></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item-->
    <!--          label="Agent服务器密码"-->
    <!--          prop="user_pwd"-->
    <!--          :rules="filter_rules([{ required: true }])"-->
    <!--        >-->
    <!--          <el-input-->
    <!--            v-model="formDeploy.user_pwd"-->
    <!--            style="width: 270px"-->
    <!--            show-password-->
    <!--          ></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="Agent服务器部署目录" prop="isCustomize">-->
    <!--          &lt;!&ndash; <el-radio-group v-model="formDeploy.isCustomize">-->
    <!--                    <el-radio v-for="item in YesNo" :key="item.value" :label="item.code">{{item.value}}</el-radio>-->
    <!--                </el-radio-group> &ndash;&gt;-->
    <!--          <el-switch-->
    <!--            :active-value="isflag.Shi"-->
    <!--            :inactive-value="isflag.Fou"-->
    <!--            v-model="isCustomize"-->
    <!--            active-color="#13ce66"-->
    <!--            inactive-color="#ff4949"-->
    <!--            active-text="自定义"-->
    <!--            inactive-text="系统默认"-->
    <!--          />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item-->
    <!--          label="Agent服务器部署路径"-->
    <!--          prop="serv_file_path"-->
    <!--          :rules="filter_rules([{ required: true }])"-->
    <!--          v-if="isCustomize == '1'"-->
    <!--        >-->
    <!--          <el-input v-model="formDeploy.serv_file_path" style="width: 270px">-->
    <!--          </el-input>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="cancleDeploy" size="mini" type="danger"-->
    <!--          >取消</el-button-->
    <!--        >-->
    <!--        <el-button-->
    <!--          type="primary"-->
    <!--          @click="saveDeploy('formDeploy')"-->
    <!--          :loading="isLoadings"-->
    <!--          size="mini"-->
    <!--          >部署</el-button-->
    <!--        >-->
    <!--      </div>-->
    <!--    </el-dialog>-->
    <!-- 启动CONTROL模态框 -->
    <ByModel
      :model-title="'启动CONTROL配置参数'"
      :model-width="'35%'"
      :visible.sync="dialogFormVisibleStartCON"
      @close="cancleCON"
    >
      <ByModelForm
        :form-data="formStartCON"
        :form-items="formStartCONItem"
        :form-config="formStartCONConfig"
        :form-rules="formStartCONRules1"
        @radioChange="radioChange"
        ref="formstart"
      ></ByModelForm>

      <div slot="modalFoot">
        <el-button @click="cancleCON" size="mini">取消</el-button>
        <el-button
          type="primary"
          @click="startCON()"
          :loading="isLoading"
          size="mini"
          >启动</el-button
        >
      </div>
    </ByModel>
    <!--    <el-dialog-->
    <!--      title="启动CONTROL配置参数"-->
    <!--      :visible.sync="dialogFormVisibleStartCON"-->
    <!--      width="35%"-->
    <!--      :before-close="cancleCON"-->
    <!--    >-->
    <!--      <el-form-->
    <!--        :model="formStartCON"-->
    <!--        ref="formStartCON"-->
    <!--        class="demo-ruleForm"-->
    <!--        label-width="150px"-->
    <!--      >-->
    <!--        <el-form-item-->
    <!--          label="工程编号"-->
    <!--          prop="etl_sys_cd"-->
    <!--          :rules="filter_rules([{ required: true }])"-->
    <!--        >-->
    <!--          <div style="width: 220px">-->
    <!--            <el-input v-model="formStartCON.etl_sys_cd" disabled></el-input>-->
    <!--          </div>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="是否续跑" prop="isResumeRun">-->
    <!--          <el-radio-group v-model="formStartCON.isResumeRun">-->
    <!--            <el-radio-->
    <!--              v-for="item in YesNo"-->
    <!--              @change="changeValue"-->
    <!--              :key="item.value"-->
    <!--              :label="item.code"-->
    <!--              >{{ item.value }}</el-radio-->
    <!--            >-->
    <!--          </el-radio-group>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="是否日切" prop="isAutoShift">-->
    <!--          <el-radio-group v-model="formStartCON.isAutoShift">-->
    <!--            <el-radio-->
    <!--              v-for="item in YesNo"-->
    <!--              :key="item.value"-->
    <!--              :label="item.code"-->
    <!--              >{{ item.value }}</el-radio-->
    <!--            >-->
    <!--          </el-radio-group>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item-->
    <!--          label="当前批量日期"-->
    <!--          prop="curr_bath_date"-->
    <!--          :rules="filter_rules([{ required: true }])"-->
    <!--        >-->
    <!--          <el-date-picker-->
    <!--            v-model="formStartCON.curr_bath_date"-->
    <!--            :disabled="dateDisabled"-->
    <!--            type="date"-->
    <!--            format="yyyy-MM-dd"-->
    <!--            value-format="yyyyMMdd"-->
    <!--            placeholder="选择日期"-->
    <!--          >-->
    <!--          </el-date-picker>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item-->
    <!--            v-show="formStartCON.isAutoShift === '1'"-->
    <!--            label="当前批量结束日期"-->
    <!--            prop="sys_end_date"-->
    <!--        >-->
    <!--          <el-date-picker-->
    <!--              v-model="formStartCON.sys_end_date"-->
    <!--              :disabled="dateDisabled"-->
    <!--              type="date"-->
    <!--              format="yyyy-MM-dd"-->
    <!--              value-format="yyyyMMdd"-->
    <!--              placeholder="选择日期"-->
    <!--          >-->
    <!--          </el-date-picker>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="cancleCON" size="mini" type="danger">取消</el-button>-->
    <!--        <el-button-->
    <!--          type="primary"-->
    <!--          @click="startCON('formStartCON')"-->
    <!--          :loading="isLoading"-->
    <!--          size="mini"-->
    <!--          >启动</el-button-->
    <!--        >-->
    <!--      </div>-->
    <!--    </el-dialog>-->
    <!-- 启动TRIGGER模态框  -->
    <ByModel
      :model-title="'确定启动TRIGGER?'"
      :visible.sync="dialogFormVisibleStartTRI"
      :model-width="'35%'"
      @close="cancleTRI"
    >
      <ByModelForm
        :form-data="formStartTRI"
        :form-items="formStartTRIItem"
        :form-config="formStartTRIConfig"
        ref="formStartTRI"
      ></ByModelForm>
      <div slot="modalFoot">
        <el-button @click="cancleTRI" size="mini">否</el-button>
        <el-button
          type="primary"
          @click="startTRI"
          :loading="isloadingTri"
          size="mini"
          >是</el-button
        >
      </div>
    </ByModel>
    <!--    <el-dialog-->
    <!--      title="确定启动TRIGGER?"-->
    <!--      :visible.sync="dialogFormVisibleStartTRI"-->
    <!--      width="35%"-->
    <!--    >-->
    <!--      <el-form-->
    <!--        :model="formStartTRI"-->
    <!--        ref="formStartTRI"-->
    <!--        class="demo-ruleForm"-->
    <!--        label-width="150px"-->
    <!--      >-->
    <!--        <el-form-item label="工程名为" prop="etl_sys_cd">-->
    <!--          <div style="width: 220px">-->
    <!--            <el-input v-model="formStartTRI.etl_sys_cd" disabled></el-input>-->
    <!--          </div>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="cancleTRI" size="mini" type="danger">否</el-button>-->
    <!--        <el-button-->
    <!--          type="primary"-->
    <!--          @click="startTRI"-->
    <!--          :loading="isloadingTri"-->
    <!--          size="mini"-->
    <!--          >是</el-button-->
    <!--        >-->
    <!--      </div>-->
    <!--    </el-dialog>-->
    <!--    <ByModel-->
    <!--      :modelTitle = "'CONTROL日志信息('  +this.dialogInfo + ')'"-->
    <!--      :visible.sync = "dialogFormVisibleRecordCON"-->
    <!--      @closed = "closeCON"-->
    <!--    >-->
    <!--      <ByModelForm-->
    <!--        :formData = "formRecordCON"-->
    <!--        :formRules = "formRecordCON"-->
    <!--        :formConfig = "controlLogConfig"-->
    <!--        :formItems = "controlLogIntems"-->
    <!--      >-->
    <!--      </ByModelForm>-->
    <!--    </ByModel>-->
    <!-- CONTROL日志模态框 -->
    <el-dialog
      :title="'CONTROL日志信息(' + this.dialogInfo + ')'"
      :visible.sync="dialogFormVisibleRecordCON"
      width="72%"
      :before-close="closeCON"
    >
      <el-form
        :model="formRecordCON"
        ref="formRecordCON"
        class="demo-form-inline"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="日志行数" prop="readNum">
          <div class="d-flex align-items-center">
            <el-input v-model="formRecordCON.readNum" class="formInput">
            </el-input>
            <el-tooltip
              effect="dark"
              content="默认显示100行，最多显示1000行(正整数)"
              placement="right"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer; margin-left: 5px"
              ></i>
            </el-tooltip>
            <el-button
              type="primary"
              class="saveBtn"
              :loading="isViewCon"
              @click="onViewCON"
            >
              查看
            </el-button>
          </div>
        </el-form-item>

        <el-form-item
          label="跑批日期"
          prop="curr_bath_date"
          :rules="filter_rules([{ required: true }])"
        >
          <el-date-picker
            v-model="formRecordCON.curr_bath_date"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyyMMdd"
          >
          </el-date-picker>
          <el-button
            type="primary"
            :loading="isViewDowncon"
            @click="downRecordCON('formRecordCON')"
            class="saveBtn"
          >
            下载日志
          </el-button>
        </el-form-item>
      </el-form>
      <div style="margin-left: 33px">
        <span v-html="formRecordCON.project_records"></span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeCON" size="mini">关闭</el-button>
      </div>
    </el-dialog>
    <!-- TRIGGER日志模态框 -->
    <el-dialog
      :title="'TRIGGER日志信息(' + this.dialogInfoTri + ')'"
      :visible.sync="dialogFormVisibleRecordTRI"
      width="72%"
      :before-close="closeTRI"
    >
      <el-form
        :model="formRecordTRI"
        ref="formRecordTRI"
        class="demo-form-inline"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="日志行数" prop="readNum">
          <el-input v-model="formRecordTRI.readNum"></el-input>
        </el-form-item>
        <el-tooltip
          effect="dark"
          content="默认显示100行，最多显示1000行(正整数)"
          placement="right"
        >
          <i class="fa fa-question-circle" aria-hidden="true"></i>
        </el-tooltip>
        <el-button type="primary" :loading="isViewTri" @click="onViewTRI"
          >查看</el-button
        >
        <el-form-item
          label="跑批日期"
          prop="curr_bath_date"
          :rules="filter_rules([{ required: true }])"
        >
          <el-date-picker
            v-model="formRecordTRI.curr_bath_date"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyyMMdd"
          >
          </el-date-picker>
        </el-form-item>
        <el-button
          type="primary"
          :loading="isViewDowntri"
          @click="downRecordTRI('formRecordTRI')"
          >下载日志</el-button
        >
      </el-form>
      <div style="margin-top: -10px">
        <span v-html="formRecordTRI.project_records"></span>
        <el-divider></el-divider>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeTRI" size="mini">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 调度监控模态框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogMointer"
      width="78%"
      :before-close="close"
    >
      <el-divider></el-divider>
      <div>
        <div class="fixed">
          <el-col :span="8">
            <p class="span22">批量运行状态</p>
            <p class="span2">批量日期:{{ this.dayDate }}</p>
            <div
              v-if="showChartsInfo"
              id="leftChart"
              style="width: 100%; height: 400px"
            ></div>
          </el-col>
          <el-col :span="16">
            <p class="span22">系统运行状态</p>
            <p class="span2">批量日期:{{ this.dayDate }}</p>
            <div
              v-if="showChartsInfo"
              id="rightChart"
              style="width: 100%; height: 400px"
            ></div>
          </el-col>
        </div>

        <div v-if="showOrhidden">
          <p class="span22">任务:{{ this.task }}</p>
          <p class="span2">批量日期:{{ this.dayDate }}</p>
        </div>
        <highcharts v-show="showOrhidden" :options="chartOptions"></highcharts>
      </div>
      <el-divider></el-divider>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import Highcahrts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import draggable from "vuedraggable";
import Sortable from "sortablejs";
import { Chart } from "highcharts-vue";
import ByHeaderSlice from "@/components/global/ByHeaderSlice.vue";
import ByContainerTitle from "@/components/global/ByContainerTitle.vue";
import ByTable from "@/components/global/ByTable.vue";
import {
  columnArr1,
  columnArr2,
  formAdd,
  modelFormConfig,
  ModelformItems,
  ModeFromRules,
  formDeployConfig,
  formDeployItems,
  formDeployRules,
  formDeploy,
  controlLogConfig,
  controlLogIntems,
  TABLEDATA,
  quickFromItme,
  formStartCONItem,
  formStartCONConfig,
  formStartCONRules,
  formStartTRIItem,
  formStartTRIConfig,
  formDeployItem,
  formDeployConfig111,
} from "./mock";
import ByModel from "@/components/global/ByModel.vue";
import ByModelForm from "@/components/global/ByModelForm.vue";
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import ByEmpty from "@/components/global/ByEmpty.vue";
highchartsMore(Highcahrts);
let changValue;
export default {
  computed: {
    formStartCONRules1() {
      return this.formStartCONRules;
    },
  },

  components: {
    ByEmpty,
    ByQuickSearch,
    ByModelForm,
    ByModel,
    ByTable,
    ByContainerTitle,
    ByHeaderSlice,
    draggable,
    Sortable,
    highcharts: Chart,
  },
  data() {
    return {
      formDeployConfig111,
      formDeployItem,
      formStartTRIConfig,
      formStartTRIItem,
      formStartCONRules,
      formStartCONItem,
      formStartCONConfig,
      quickFromItme,
      columnArr1,
      columnArr2,
      ModelformItems,
      modelFormConfig,
      formAdd: JSON.parse(JSON.stringify(formAdd)),
      ModeFromRules,
      formDeployConfig,
      formDeployItems,
      formDeployRules,
      formDeploy: JSON.parse(JSON.stringify(formDeploy)),
      controlLogConfig,
      controlLogIntems,
      tableData: [],
      dataArray: [],
      dialogFormVisibleAdd: false,
      dialogFormVisibleDeploy: false,
      dialogFormVisibleStartCON: false,
      dialogFormVisibleStartTRI: false,
      dialogFormVisibleRecordCON: false,
      dialogFormVisibleRecordTRI: false,
      dateDisabled: false,
      dialogMointer: false,
      showChartsInfo: false,
      batchState: {},
      sysState: [],
      projectTitle: "",
      currDate: "",
      chartOptions: {
        title: {
          text: "",
        },
        credits: {
          enabled: false,
        },
      },
      activeName: "first",
      title: "",
      dayDate: "",
      task: "",
      showOrhidden: false,
      valueTime: "",
      dialogInfo: "",
      dialogInfoTri: "",
      isCustomize: "",
      formStartCON: {
        etl_sys_id: "",
        etl_sys_cd: "",
        isResumeRun: "0",
        isAutoShift: "0",
        curr_bath_date: "",
        sys_end_date: "",
      },
      formStartTRI: {
        etl_sys_id: "",
        etl_sys_cd: "",
      },
      formRecordCON: {
        etl_sys_id: "",
        etl_sys_cd: "",
        readNum: "",
        curr_bath_date: "",
        project_records: "",
      },
      formRecordTRI: {
        etl_sys_id: "",
        etl_sys_cd: "",
        readNum: "",
        curr_bath_date: "",
        project_records: "",
      },
      formInline: {
        tableName: "",
      },
      CJtableData: [],
      EtlSysInfo: [],
      listdata: [],
      YesNo: [],
      online: {},
      isLoadings: false,
      isLoading: false,
      isloadingTri: false,
      disableds: false,
      isViewDowncon: false,
      isViewCon: false,
      isViewDowntri: false,
      isViewTri: false,
      timer: "",
      rule: validator.default,
      isflag: {}, // 是否的代码项
      etlSysDepStatus: {}, //依赖是否有效状态代码项
      etlSysDepData: [],
      // TABLEDATA,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 25, 50, 100, 500],
      },
    };
  },
  mounted() {
    this.getTable();
    this.monitorAllProjectChartsData();
    /** 获取是否类型的代码项 */
    this.$Code.getCodeItems( {category: "IsFlag"}).then((res) => {
        this.isflag = res.data;
      });
    this.getCode();
  },
  beforeDestroy() {
    // 关闭定时器
    clearInterval(this.timer);
  },
  methods: {
    closeModel() {
      this.dialogFormVisibleAdd = false;
    },
    swichChange(prop, data) {
      if (prop === "isCustomize") {
        this.setConceal("serv_file_path", data === "1" ? "true" : "false");
      }
    },
    setConceal(prop, boolean) {
      this.formDeployItem.map((item) => {
        if (item.prop === prop) {
          item.conceal = boolean;
        }
      });
    },
    //刷新表格
    getTable() {
      let params = {};
      this.$executeRequest
        .execGetByModuleUrl("/etlMage/searchEtlSys", params)
        .then((res) => {
          if (res && res.success) {
            res.data.forEach((item) => {
              if (item.curr_bath_date) {
                item.curr_bath_date = this.$dateconversion.dateFormat(
                  item.curr_bath_date
                );
              }
              item.pre_etl_sys_cd = item.etl_sys_cd;
              item.pre_etl_sys_id = item.etl_sys_id;
            });
            this.tableData = res.data;
            this.etlSysDepData = res.data;
            // const options = res.data;
            // options.map((item) => {
            //   item.label = item.pre_etl_sys_cd;
            //   item.value = item.pre_etl_sys_cd;
            // });
            let options = [];
            for (let i = 0; i < res.data.length; i++) {
              options.push({
                label: res.data[i].pre_etl_sys_cd,
                value: res.data[i].pre_etl_sys_id,
                key: res.data[i].pre_etl_sys_id,
              });
            }
            this.ModelformItems.map((item) => {
              if (item.prop === "pre_etl_sys_ids") {
                item.options = options;
              }
            });
          }
        });
    },
    //点击工程编号跳转按钮
    details(row) {
      sessionStorage.setItem("sys_cd", row.etl_sys_cd);
      sessionStorage.setItem("sys_id", row.etl_sys_id);
      sessionStorage.setItem("sys_name", row.etl_sys_name);
      // console.log("details");
      // console.log(row);
      this.$router.push({
        path: "/C/menus/Configure/subSystem",
        query: {
          dec: this.$Base64.encode("任务"),
          etl_sys_name: row.etl_sys_name,
          etl_sys_cd: row.etl_sys_cd,
          etl_sys_id: row.etl_sys_id,
        },
      });
    },

    //点击工程编号跳转按钮
    // details(index, row) {
    //   sessionStorage.setItem("sys_cd", row.etl_sys_cd);
    //   sessionStorage.setItem("sys_name", row.etl_sys_name);
    //   console.log("details");
    //   console.log(row);
    //   this.$router.push({
    //     name: "menus",
    //     query: {
    //       name: "/C/detailsPages/menus",
    //       dec: this.$Base64.encode("任务"),
    //       etl_sys_name: row.etl_sys_name,
    //       etl_sys_cd: row.etl_sys_cd,
    //       etl_sys_id: row.etl_sys_id,
    //     },
    //   });
    // },

    operateItem(type, row) {
      if (type == "startControl") {
        this.handleStartco(row);
      } else if (type == "logControl") {
        this.handleRecordco(row);
      } else if (type == "starttri") {
        this.handleStarttr(row);
      } else if (type == "logtri") {
        this.handleRecordtr(row);
      } else if (type == "edit") {
        this.handleEdit(row);
      } else if (type == "layout") {
        this.setConceal("serv_file_path", "false");
        this.handleDeploy(row);
      } else if (type == "detele") {
        this.deleteWork(row);
      } else if ((type = "stop")) {
        this.stopWork(row);
      }
    },
    //表格启动CONTROL按钮
    handleStartco(row) {
      this.formStartCON = {
        etl_sys_id: row.etl_sys_id,
        etl_sys_cd: row.etl_sys_cd,
        isResumeRun: "0",
        isAutoShift: "0",
        curr_bath_date: "",
        sys_end_date: "",
      };
      this.dialogFormVisibleStartCON = true;
      this.getEtlSys(row.etl_sys_id);
      this.getCategoryItems("IsFlag");
      this.setConcealDataItems(this.formStartCONItem,"sys_end_date",'false');
      // this.formStartCON.etl_sys_id = row.etl_sys_id;
      this.currDate = row.curr_bath_date;
    },
    radioChange(radioChange,data){
      if(radioChange === 'isAutoShift'){
        if (data === "0"){
          this.setConcealDataItems(this.formStartCONItem,"sys_end_date",'false');
        }else {
          this.setConcealDataItems(this.formStartCONItem,"sys_end_date",'true');
        }
      }
    },
    setConcealDataItems(data,prop,boole){
      data.map( item =>{
        if(item.prop === prop){
          item.conceal = boole;
        }
      })
    },
    //启动CONTROL模态框启动按钮
    startCON() {
      this.$refs.formstart
        .transferData()
        .then((data) => {
          this.isLoading = true;
          let params = {};
          params["etl_sys_id"] = this.formStartCON.etl_sys_id;
          params["etl_sys_cd"] = this.formStartCON.etl_sys_cd;
          params["isResumeRun"] = this.formStartCON.isResumeRun;
          params["isAutoShift"] = this.formStartCON.isAutoShift;
          params["curr_bath_date"] = this.formStartCON.curr_bath_date;
          params["sys_end_date"] = this.formStartCON.sys_end_date;
          this.$executeRequest
            .execGetByModuleUrl("/etlMage/startControl", params)
            .then((res) => {
              this.isLoading = false;
              if (res && res.success) {
                this.$Msg.customizTitle("启动CONTROL成功", "success");
                this.getTable();
                this.dialogFormVisibleStartCON = false;
                this.formStartCON = {};
              }
            });
        })
        .catch((err) => {});
    },
    //表格CONTROL日志信息按钮
    handleRecordco(row) {
      this.dialogFormVisibleRecordCON = true;
      this.formRecordCON.etl_sys_id = row.etl_sys_id;
      this.formRecordCON.etl_sys_cd = row.etl_sys_cd;
      this.formRecordCON.readNum = 100;
      this.dialogInfo = row.etl_sys_cd;
    },
    getCode() {
      this.$Code.getCategoryItems( {category: "Status"}).then((res) => {
          this.etlSysDepStatus = res.data;
          let options = [];
          for (let i = 0; i < res.data.length; i++) {
            options.push({
              label: res.data[i].value,
              value: res.data[i].code,
            });
          }
          // console.log(options);
          this.ModelformItems.map((item) => {
            if (item.prop === "status") {
              item.options = options;
            }
          });
        });
    },
    //采集表信息
    searchTable(val) {
      this.formInline = val;
      if (this.formInline.tableName) {
        this.$executeRequest
          .execGetByModuleUrl("/etlMage/searchTable", {
            tableName: this.formInline.tableName,
          })
          .then((res) => {
            this.CJtableData = res ? res.data : [];
            this.pagination.total = res.data.length;
          });
      } else {
        this.$Msg.customizTitle("请先输入表名再进行查询", "warning");
      }
    },
    // 改变每页显示条数
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
    },
    //表数据实现分页功能
    handleCurrentChange(val) {
      //把val赋给当前页面
      this.pagination.pageNum = val;
    },
    //查询作业调度工程信息
    getEtlSys(etl_sys_id) {
      let params = {};
      params["etl_sys_id"] = etl_sys_id;
      this.$executeRequest
        .execGetByModuleUrl("/etlMage/searchEtlSysById", params)
        .then((res) => {
          this.EtlSysInfo = res.data;
        });
    },
    //标签页切换按钮
    handleClick(tab, event) {
      if (tab.label === "调度监控") {
        this.monitorAllProjectChartsData();
        this.setFor();
      } else {
        // 关闭定时器
        clearInterval(this.timer);
      }
    },
    // 轮询
    setFor() {
      let that = this;
      this.timer = setInterval(() => {
        setTimeout(() => {
          that.monitorAllProjectChartsData();
        }, 0);
      }, 10000);
    },

    // 关闭弹出框数据回显
    beforeClose() {
      this.getTable();
      this.dialogFormVisibleAdd = false;
    },
    // 所有项目图标数据
    monitorAllProjectChartsData() {
      this.$executeRequest
        .execGetByModuleUrl("etlMage/etlmonitor/monitorAllProjectChartsData")
        .then((res) => {
          if (res && res.success) {
            this.listdata = res.data;
            if (res.data.length > 0) {
              res.data.forEach((item, index) => {
                res.data[index].bathdate = this.$dateconversion.dateFormat(
                  res.data[index].bathdate
                );
                const bar_dv = document.getElementById(
                  `radar${item.etl_sys_id}`
                );
                if (bar_dv) {
                  this.batchState = item;
                  let chart = Highcahrts.chart(`radar${item.etl_sys_id}`, {
                    chart: {
                      type: "column",
                    },
                    credits: {
                      enabled: false,
                    },
                    exporting: {
                      enabled: false,
                    },
                    legend: {
                      enabled: false,
                    },
                    title: {
                      text: "",
                    },
                    xAxis: {
                      categories: [
                        "挂起",
                        "等待",
                        "运行",
                        "暂停",
                        "错误",
                        "完成",
                      ],
                    },
                    yAxis: {
                      min: 0,
                      title: {
                        text:
                          '<div class="EdbeSubTitle">' + "作业数量" + "<div/>",
                      },
                      labels: {
                        formatter: function () {
                          return this.value;
                        },
                      },
                      gridLineWidth: 1,
                      gridLineColor: "gray",
                    },
                    tooltip: {
                      crosshairs: true,
                      pointFormat:
                        '<span style="color:{series.color}">{series.name}</span>：' +
                        "<b>{point.y}</b>",
                    },
                    plotOptions: {
                      column: {
                        animation: false,
                        dataLabels: {
                          enabled: true,
                          formatter: function () {
                            return this.y;
                          },
                        },
                        colorByPoint: true,
                      },
                    },
                    series: [
                      {
                        name: "作业数量",
                        data: [
                          {
                            y: parseInt(this.batchState.pending),
                            color: "#90B1D8",
                          },
                          {
                            y: parseInt(this.batchState.waiting),
                            color: "#00FFFF",
                          },
                          {
                            y: parseInt(this.batchState.runing),
                            color: "#90EE7E",
                          },
                          {
                            y: parseInt(this.batchState.suspension),
                            color: "#F7A35C",
                          },
                          {
                            y: parseInt(this.batchState.error),
                            color: "#FF7474",
                          },
                          {
                            y: parseInt(this.batchState.done),
                            color: "#2B908F",
                          },
                        ],
                      },
                    ],
                  });
                }
              });
            }
          }
        });
    },
    //添加工程按钮
    addProject() {
      this.disableds = false;
      this.dialogFormVisibleAdd = true;
      this.projectTitle = "添加工程";
      this.formAdd = {
        status: "T",
      };
    },
    //添加/修改工程模态框保存按钮
    add(formName) {
      this.$refs.formAddRef.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.projectTitle === "添加工程") {
            let params = {};
            params["etl_sys_cd"] = this.formAdd.etl_sys_cd;
            params["etl_sys_name"] = this.formAdd.etl_sys_name;
            params["comments"] = this.formAdd.comments;
            params["pre_etl_sys_ids"] = this.formAdd.pre_etl_sys_ids;
            params["status"] = this.formAdd.status;
            this.$executeRequest
              .execPostByModuleUrl("/etlMage/addEtlSys", params)
              .then((res) => {
                if (res && res.success) {
                  this.dialogFormVisibleAdd = false;
                  this.getTable();
                }
              });
          } else if (this.projectTitle === "修改工程") {
            let params = {};
            params["etl_sys_cd"] = this.formAdd.etl_sys_cd;
            params["etl_sys_id"] = this.formAdd.etl_sys_id;
            params["etl_sys_name"] = this.formAdd.etl_sys_name;
            params["comments"] = this.formAdd.comments;
            params["pre_etl_sys_ids"] = this.formAdd.pre_etl_sys_ids;
            params["status"] = this.formAdd.status;
            this.$executeRequest
              .execPostByModuleUrl("/etlMage/updateEtlSys", params)
              .then((res) => {
                if (res && res.success) {
                  this.dialogFormVisibleAdd = false;
                  this.getTable();
                }
              });
          }
        }
      });
    },
    // 查询工程依赖信息
    getEtlSysDepById(row) {
      this.$executeRequest
        .execGetByModuleUrl("/etlMage/getEtlSysDepById", {
          etl_sys_id: row.etl_sys_id,
        })
        .then((res) => {
          if (res && res.success) {
            let arr = [];
            let status = "F";
            res.data.forEach((item) => {
              arr.push(item.pre_etl_sys_cd);
              status = item.status;
            });
            row.status = status;
            row.pre_etl_sys_cds = arr;
            this.formAdd = row;
            let arr2 = [];
            this.etlSysDepData.forEach((item) => {
              if (item.etl_sys_cd != row.etl_sys_cd) {
                arr2.push(item);
              }
            });
            this.etlSysDepData = arr2;
            this.$forceUpdate();
          }
        });
    },
    // 保存工程依赖信息
    saveEtlSysDep() {
      this.$executeRequest
        .execGetByModuleUrl("/etlMage/saveEtlSysDep", this.formAdd)
        .then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle(this.projectTitle + "成功", "success");
          }
        });
    },
    //下拉框数据强制渲染
    selectChange() {
      this.$forceUpdate();
    },
    //添加/修改工程模态框取消按钮
    cancleAdd() {
      // 表单清空
      this.formAdd = {};
      this.dialogFormVisibleAdd = false;
      // 隐藏对话框
      this.getTable();
      this.$refs.formAdd.resetFields();
    },
    //部署Agent工程模态框保存按钮
    saveDeploy(formName) {
      this.$refs.formDeployConfig111.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoadings = true;
          let params = {};
          params["etl_sys_id"] = this.formDeploy.etl_sys_id;
          params["etl_sys_cd"] = this.formDeploy.etl_sys_cd;
          params["etl_serv_ip"] = this.formDeploy.etl_serv_ip;
          params["user_name"] = this.formDeploy.user_name;
          params["user_pwd"] = this.formDeploy.user_pwd;
          params["isCustomize"] = this.isCustomize;
          params["serv_file_path"] = this.formDeploy.serv_file_path;
          this.$executeRequest.execGetByModuleUrl("/etlMage/deployEtlJobScheduleProject", params).then((res) => {
              this.isLoadings = false;
              if (res && res.success) {
                this.$Msg.customizTitle("部署成功", "success");
                this.getTable();
                this.dialogFormVisibleDeploy = false;
                this.formDeploy = {};
              }
            }).catch(() => {
             this.isLoadings = false
          })
        }
      });
    },
    //部署Agent工程模态框取消按钮
    cancleDeploy() {
      this.dialogFormVisibleDeploy = false;
      this.formDeploy = {};
      this.$refs.formDeploy.resetFields();
    },
    //启动CONTROL模态框取消按钮
    cancleCON() {
      this.dateDisabled = false;
      this.dialogFormVisibleStartCON = false;
      this.formStartCON = {
        etl_sys_cd: "",
        isResumeRun: "0",
        isAutoShift: "0",
        curr_bath_date: "",
        sys_end_date: "",
      };
    },
    //启动TRIGGER模态框启动按钮
    startTRI() {
      this.isloadingTri = true;
      let params = {};
      params["etl_sys_id"] = this.formStartTRI.etl_sys_id;
      params["etl_sys_cd"] = this.formStartTRI.etl_sys_cd;
      this.$executeRequest
        .execGetByModuleUrl("/etlMage/startTrigger", params)
        .then((res) => {
          this.isloadingTri = false;
          if (res && res.success) {
            this.$Msg.customizTitle("启动TRIGGER成功", "success");
            this.getTable();
            // this.formStartTRI = {};
            this.formStartTRI = {
              etl_sys_id: "",
              etl_sys_cd: "",
            };
            this.dialogFormVisibleStartTRI = false;
          }
        });
    },
    //启动TRIGGER模态框取消按钮
    cancleTRI() {
      this.dialogFormVisibleStartTRI = false;
      // this.formStartTRI = {};
      this.formStartTRI = {
        etl_sys_id: "",
        etl_sys_cd: "",
      };
      // this.$refs.formStartTRI.resetFields();
    },
    //CONTROL日志查看按钮
    onViewCON() {
      this.isViewCon = true;
      let params = {};
      params["etl_sys_id"] = this.formRecordCON.etl_sys_id;
      params["etl_sys_cd"] = this.formRecordCON.etl_sys_cd;
      params["readNum"] = this.formRecordCON.readNum;
      params["isControl"] = "0";
      this.$executeRequest
        .execGetByModuleUrl("/etlMage/readControlOrTriggerLog", params)
        .then((res) => {
          this.isViewCon = false;
          if (res.data.length != 0) {
            this.formRecordCON.project_records = res.data.replace(
              /\[/g,
              "<br>["
            );
            let dataTIP = this.formRecordCON.project_records.replace(
              /: <br>\[/g,
              ":["
            );
            this.formRecordCON.project_records = dataTIP;
          } else {
            this.formRecordCON.project_records = "暂无日志信息";
          }
        });
    },
    //CONTROL日志下载按钮
    downRecordCON(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isViewDowncon = true;
          let params = {};
          params["etl_sys_id"] = this.formRecordCON.etl_sys_id;
          params["etl_sys_cd"] = this.formRecordCON.etl_sys_cd;
          params["curr_bath_date"] = this.formRecordCON.curr_bath_date;
          params["isControl"] = "0";
          this.$executeRequest
            .execGetByModuleUrl("/etlMage/downloadControlOrTriggerLog", params)
            .then((res) => {
              this.isViewDowncon = false;
              if (res) {
                this.downloadFile(res.data);
              }
            });
        }
      });
    },
    // 下载日志方法封装
    downloadFile(val) {
      this.$executeRequest
        .execDownloadFileByModuleUrl("/etlMage/downloadFile", { fileName: val })
        .then((res) => {
          this.filename = val;
          this.$FileOperations.fileDownload(res, this.filename);
        });
    },
    //CONTROL日志关闭按钮
    closeCON() {
      this.$refs.formRecordCON.resetFields();
      this.dialogFormVisibleRecordCON = false;
      this.formRecordCON = {
        etl_sys_cd: "",
        readNum: "",
        curr_bath_date: "",
        project_records: "",
      };
    },
    //TRIGGER日志查看按钮
    onViewTRI() {
      this.isViewTri = true;
      let params = {};
      params["etl_sys_id"] = this.formRecordTRI.etl_sys_id;
      params["etl_sys_cd"] = this.formRecordTRI.etl_sys_cd;
      params["readNum"] = this.formRecordTRI.readNum;
      params["isControl"] = "1";
      this.$executeRequest
        .execGetByModuleUrl("/etlMage/readControlOrTriggerLog", params)
        .then((res) => {
          this.isViewTri = false;
          if (res.data.length != 0) {
            this.formRecordTRI.project_records = res.data.replace(
              /\[/g,
              "<br>["
            );
            let dataTIP = this.formRecordTRI.project_records.replace(
              /: <br>\[/g,
              ":["
            );
            this.formRecordTRI.project_records = dataTIP;
          } else {
            this.formRecordTRI.project_records = "暂无日志信息";
          }
        });
    },
    //TRIGGER日志下载按钮
    downRecordTRI(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isViewDowntri = true;
          let params = {};
          params["etl_sys_id"] = this.formRecordTRI.etl_sys_id;
          params["etl_sys_cd"] = this.formRecordTRI.etl_sys_cd;
          params["curr_bath_date"] = this.formRecordTRI.curr_bath_date;
          params["isControl"] = "1";
          this.$executeRequest
            .execGetByModuleUrl("/etlMage/downloadControlOrTriggerLog", params)
            .then((res) => {
              this.isViewDowntri = false;
              if (res && res.success) {
                this.downloadFile(res.data);
              }
            });
        }
      });
    },
    //TRIGGER日志关闭按钮
    closeTRI() {
      this.$refs.formRecordTRI.resetFields();
      this.dialogFormVisibleRecordTRI = false;
      this.formRecordTRI = {
        etl_sys_cd: "",
        readNum: "",
        curr_bath_date: "",
        project_records: "",
      };
    },

    //表格编辑
    handleEdit(row) {
      // 查询工程依赖
      this.getEtlSysDepById(row);
      this.projectTitle = "修改工程";
      let data = this.ModelformItems;

      this.disableds = true;
      this.dialogFormVisibleAdd = true;
    },
    // 删除作业工程
    deleteWork(row) {
      this.$confirm("确认删除(" + row.etl_sys_cd + ")工程吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$executeRequest
            .execGetByModuleUrl("/etlMage/deleteEtlProject", {
              etl_sys_id: row.etl_sys_id,
            })
            .then((res) => {
              if (res && res.success) {
                this.getTable();
                this.$Msg.customizTitle("删除成功", "success");
              }
            });
        })
        .catch(() => {
          this.$Msg.customizTitle("已取消删除", "info");
        });
    },
    //表格部署按钮
    handleDeploy(row) {
      this.formDeploy.etl_sys_id = row.etl_sys_id;
      this.getCategoryItems("IsFlag");
      this.$executeRequest
        .execGetByModuleUrl("/etlMage/searchEtlSysById", {
          etl_sys_id: row.etl_sys_id,
        })
        .then((res) => {
          // if (res.data.serv_file_path == undefined || res.data.serv_file_path == "") { //没有部署
          //     res.data.isCustomize = '0'
          // } else {
          //     res.data.isCustomize = '1'
          // }
          this.formDeploy = res.data.etlSys;
          this.isCustomize = res.data.isCustomize;
        });
      this.dialogFormVisibleDeploy = true;
    },
    //表格启动TRIGGER按钮
    handleStarttr(row) {
      this.dialogFormVisibleStartTRI = true;
      this.formStartTRI.etl_sys_cd = row.etl_sys_cd;
      this.formStartTRI.etl_sys_id = row.etl_sys_id;
    },

    //表格TRIGGER日志信息按钮
    handleRecordtr(row) {
      this.dialogFormVisibleRecordTRI = true;
      this.formRecordTRI.etl_sys_cd = row.etl_sys_cd;
      this.formRecordTRI.etl_sys_id = row.etl_sys_id;
      this.formRecordTRI.readNum = 100;
      this.dialogInfoTri = row.etl_sys_cd;
    },
    // 全屏幕显示
    fullScreen(val) {
      // console.log(val)
      this.dayDate = val.bathdate;
      this.monitorCurrentBatchInfo(val.etl_sys_id);
      this.monitorCurrentBatchInfoByTask(val.etl_sys_id);
      changValue = val.etl_sys_id;
      this.title = val.sys_name;
      this.dialogMointer = true;
      this.showChartsInfo = true;
    },
    // 系统运行状态数据
    monitorCurrentBatchInfo(val) {
      this.$executeRequest
        .execGetByModuleUrl("etlMage/etlmonitor/monitorCurrentBatchInfo", {
          etl_sys_id: val,
        })
        .then((res) => {
          let that = this;
          this.batchState = res.data;
          this.dayDate = this.$dateconversion.dateFormat(
            res.data.curr_bath_date
          );
          let chart = Highcahrts.chart("leftChart", {
            chart: {
              type: "column",
            },
            credits: {
              enabled: false,
            },
            exporting: {
              enabled: false,
            },
            legend: {
              enabled: false,
            },
            title: {
              text: "",
            },
            xAxis: {
              categories: ["挂起", "等待", "运行", "暂停", "错误", "完成"],
            },
            yAxis: {
              min: 0,
              title: {
                text: '<div class="EdbeSubTitle">' + "作业数量" + "<div/>",
              },
              labels: {
                formatter: function () {
                  return this.value;
                },
              },
              gridLineWidth: 1,
              gridLineColor: "gray",
            },
            tooltip: {
              crosshairs: true,
              pointFormat:
                '<span style="color:{series.color}">{series.name}</span>：' +
                "<b>{point.y}</b>",
            },
            plotOptions: {
              column: {
                animation: false,
                dataLabels: {
                  enabled: true,
                  formatter: function () {
                    return this.y;
                  },
                },
                colorByPoint: true,
              },
            },
            series: [
              {
                name: "作业数量",
                data: [
                  {
                    y: parseInt(this.batchState.pending),
                    color: "#90B1D8",
                  },
                  {
                    y: parseInt(this.batchState.waiting),
                    color: "#00FFFF",
                  },
                  {
                    y: parseInt(this.batchState.runing),
                    color: "#90EE7E",
                  },
                  {
                    y: parseInt(this.batchState.suspension),
                    color: "#F7A35C",
                  },
                  {
                    y: parseInt(this.batchState.error),
                    color: "#FF7474",
                  },
                  {
                    y: parseInt(this.batchState.done),
                    color: "#2B908F",
                  },
                ],
              },
            ],
          });
        });
    },
    // 监控当前批量状态
    monitorCurrentBatchInfoByTask(val) {
      this.$executeRequest
        .execGetByModuleUrl(
          "etlMage/etlmonitor/monitorCurrentBatchInfoByTask",
          {
            etl_sys_id: val,
          }
        )
        .then((res) => {
          this.sysState = res.data;
          let sub_sys_id = [];
          let sub_sys_cd = [];
          let name = [];
          let runingNum = [];
          let doneNum = [];
          let errorNum = [];
          let pendingNum = [];
          let waitingNum = [];
          let suspensionNum = [];
          for (let i in this.sysState) {
            sub_sys_cd.push(this.sysState[i].sub_sys_cd);
            sub_sys_id.push(this.sysState[i].sub_sys_id);
            name.push(this.sysState[i].sub_sys_desc);
            runingNum.push(parseInt(this.sysState[i].runing));
            doneNum.push(parseInt(this.sysState[i].done));
            errorNum.push(parseInt(this.sysState[i].error));
            pendingNum.push(parseInt(this.sysState[i].pending));
            waitingNum.push(parseInt(this.sysState[i].waiting));
            suspensionNum.push(parseInt(this.sysState[i].suspension));
          }
          let that = this;
          let chart = Highcahrts.chart("rightChart", {
            chart: {
              type: "column",
            },
            credits: {
              enabled: false,
            },
            title: {
              text: "",
            },
            exporting: {
              enabled: false,
            },
            xAxis: {
              title: {
                text: this.value,
              },
              categories: name,
              labels: {
                rotation: -45,
                formatter: function () {
                  var val;
                  if (this.value.length > 8) {
                    val = this.value.substring(0, 6) + "...";
                  } else {
                    val = this.value;
                  }
                  return val;
                },
              },
            },
            yAxis: {
              min: 0,
              title: {
                text: "",
              },
            },
            tooltip: {
              pointFormat:
                '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
              shared: true,
              followPointer: true,
              crosshairs: true,
            },
            plotOptions: {
              column: {
                animation: false,
                plotOptions: true,
                enableMouseTracking: true,
                stacking: "percent",
                events: {
                  click: function (event) {
                    that.task = event.point.category;
                    let id = that.changeParamas(event.point.category);
                    that.searchMonitorJobStateBySubCd(id);
                  },
                },
              },
            },
            series: [
              {
                name: "挂起",
                color: "#90B1D8",
                data: pendingNum,
              },
              {
                name: "等待",
                color: "#00FFFF",
                data: waitingNum,
              },
              {
                name: "运行",
                color: "#90EE7E",
                data: runingNum,
              },
              {
                name: "暂停",
                color: "#F7A35C",
                data: suspensionNum,
              },
              {
                name: "错误",
                color: "#FF7474",
                data: errorNum,
              },
              {
                name: "完成",
                color: "#2B908F",
                data: doneNum,
              },
            ],
          });
        });
    },
    // 改变传参
    changeParamas(val) {
      this.sysState.forEach((item) => {
        if (val == item.sub_sys_desc) {
          val = item.sub_sys_id;
        }
      });
      return val;
    },
    // 监控当前系统运行任务下的作业信息
    searchMonitorJobStateBySubCd(val) {
      let that = this;
      this.$executeRequest
        .execGetByModuleUrl("etlMage/etlmonitor/searchMonitorJobStateBySubCd", {
          etl_sys_id: changValue,
          sub_sys_id: val,
          curr_bath_date: this.dayDate.replace(/-/g, ""),
        })
        .then((res) => {
          if (res && res.success) {
            // 数据处理成图标需要的格式
            let time = [];
            let colorsArray = [];
            let sysName = [];
            let status = [];
            let startTime = [];
            let endTime = [];
            let start = 0;
            let end = 0;
            let arry = res.data;
            this.dataArray = res.data;
            let date = new Date().valueOf() + 8 * 60 * 60 * 1000;
            for (let index = 0; index < arry.length; index++) {
              sysName[index] = arry[index].etl_job;
              status[index] = arry[index].job_disp_status;
              let curr_st_time = arry[index]["curr_st_time"];
              let curr_end_time = arry[index]["curr_end_time"];
              // 挂起：
              if (arry[index]["job_disp_status"] == "P") {
                colorsArray[index] = "#90B1D8";
                start = date;
                end = date;
              }
              // 等待
              if (arry[index]["job_disp_status"] == "W") {
                colorsArray[index] = "#00FFFF";
                start = date;
                end = date;
              }
              // 暂停
              if (arry[index]["job_disp_status"] == "S") {
                colorsArray[index] = "#F7A35C";
                startTime[index] = this.dateToMill(curr_st_time);
                endTime[index] = this.dateToMill(curr_end_time);
                start = startTime[index];
                end = start;
              }

              // 错误
              if (arry[index]["job_disp_status"] == "E") {
                colorsArray[index] = "#FF7474";
                startTime[index] = this.dateToMill(curr_st_time);
                endTime[index] = this.dateToMill(curr_end_time);
                start = startTime[index];
                end = start;
              }
              // 运行时长：
              if (arry[index]["job_disp_status"] == "R") {
                colorsArray[index] = "#90EE7E";
                startTime[index] = this.dateToMill(curr_st_time);
                start = startTime[index];
                end = date;
              }
              // 完成
              if (arry[index]["job_disp_status"] == "D") {
                startTime[index] = this.dateToMill(curr_st_time);
                endTime[index] = this.dateToMill(curr_end_time);
                colorsArray[index] = "#2B908F";
                // 是否虚拟作业
                if (startTime[index] > endTime[index]) {
                  startTime[index] = endTime[index];
                }
                start = startTime[index];
                end = endTime[index];
              }
              time[index] = [start, end];
              let that = this;
              let heightbottom = 140 + arry.length * 30;
              this.chartOptions = {
                // 数据提示框
                tooltip: {
                  crosshairs: true,
                  useHTML: true,
                  formatter: function () {
                    var index = 0;
                    for (var i = 0; i < sysName.length; i++) {
                      if (this.x == sysName[i]) {
                        index = i;
                        var start = Highcahrts.dateFormat(
                          "%Y-%m-%d %H:%M:%S",
                          startTime[index]
                        );
                        var end = Highcahrts.dateFormat(
                          "%Y-%m-%d %H:%M:%S",
                          endTime[index]
                        );
                        if (status[index] == "P") {
                          return this.x + "<br/>" + "状态" + ":" + "挂起";
                        } else if (status[index] == "W") {
                          return this.x + "<br/>" + "状态" + ":" + "等待";
                        } else if (status[index] == "S") {
                          return (
                            this.x +
                            "<br/>" +
                            "状态" +
                            ":" +
                            "暂停" +
                            "<br/>" +
                            "开始时间" +
                            start +
                            "<br/>" +
                            "结束时间" +
                            end
                          );
                        } else if (status[index] == "E") {
                          return (
                            this.x +
                            "<br/>" +
                            "状态" +
                            ":" +
                            "错误" +
                            "<br/>" +
                            "开始时间" +
                            start +
                            "<br/>" +
                            "结束时间" +
                            end
                          );
                        } else if (status[index] == "D") {
                          return (
                            this.x +
                            "<br/>" +
                            "状态" +
                            ":" +
                            "完成" +
                            "<br/>" +
                            "开始时间" +
                            start +
                            "<br/>" +
                            "结束时间" +
                            end
                          );
                        } else if (status[index] == "R") {
                          return (
                            this.x +
                            "<br/>" +
                            "状态" +
                            ":" +
                            "运行" +
                            "<br/>" +
                            "开始时间" +
                            start +
                            "<br/>" +
                            "至" +
                            Highcahrts.dateFormat(
                              "%Y-%m-%d %H:%M:%S",
                              new Date().getTime() + 8 * 60 * 60 * 1000
                            )
                          );
                        }
                      }
                    }
                  },
                },
                chart: {
                  type: "columnrange",
                  inverted: true,
                  height: heightbottom,
                },
                credits: {
                  enabled: false,
                },
                title: {
                  text: "",
                },
                exporting: {
                  enabled: false,
                },
                xAxis: {
                  categories: sysName,
                  tickColor: "gray",
                  gridLineWidth: 1,
                  gridLineColor: "gray",
                  tickmarkPlacement: "on",
                },
                yAxis: {
                  type: "datetime",
                  title: {
                    text: "",
                  },
                  gridLineWidth: 0,
                  labels: {
                    rotation: -45,
                    overflow: "justify",
                    useHTML: true,
                    formatter: function () {
                      var date = new Date(this.value);
                      var hours = date.getUTCHours();
                      var minutes = date.getUTCMinutes();
                      var seconds = date.getUTCSeconds();
                      if (this.isFirst) {
                        return (
                          '<div class="EdbeSubTitle">' +
                          Highcahrts.dateFormat("%m-%d %H:%M", this.value) +
                          "<div/>"
                        );
                      } else if (hours == 0 && minutes == 0 && seconds == 0) {
                        return (
                          '<div class="EdbeSubTitle">' +
                          Highcahrts.dateFormat("%m-%d %H:%M", this.value) +
                          "<div/>"
                        );
                      } else {
                        return (
                          '<div class="EdbeSubTitle">' +
                          Highcahrts.dateFormat("%H:%M:%S", this.value) +
                          "<div/>"
                        );
                      }
                    },
                  },
                },
                // 数据点
                plotOptions: {
                  columnrange: {
                    colorByPoint: true,
                    pointPadding: 1,
                    borderWidth: 0,
                    pointWidth: 8,
                    showCheckbox: true,
                  },
                  series: {
                    minPointLength: 15,
                    cursor: "pointer",
                    point: {
                      events: {
                        plotOptions: true,
                        enableMouseTracking: true,
                        click: function () {
                          let etlJobName = this.category;
                          let id = that.changeParamasRouter(etlJobName);
                          that.$router.push({
                            name: "currentJob",
                            query: {
                              name: "/currentJob",
                              dec: that.$Base64.encode("当前作业"),
                              etl_job_id: id,
                              etl_sys_id: changValue,
                            },
                          });
                        },
                      },
                    },
                  },
                },
                // 图例
                legend: {
                  enabled: false,
                },
                series: [
                  {
                    data: time,
                    colors: colorsArray,
                  },
                ],
              };
              this.showOrhidden = true;
            }
          }
        });
    },
    changeParamasRouter(val) {
      this.dataArray.forEach((item) => {
        if (val == item.etl_job) {
          // val = item.sub_sys_cd;
          val = item.etl_job_id;
        }
      });
      return val;
    },
    // 毫秒数
    dateToMill(date) {
      date = date.replace(/\s*/g, "");
      let year = date.substring(0, 4);
      let month = date.substring(4, 6);
      let day = date.substring(6, 8);
      let timeh = date.substring(8, 10);
      let timem = date.substring(10, 12);
      let times = date.substring(12, 14);
      let dates =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        timeh +
        ":" +
        timem +
        ":" +
        times;
      date = dates;
      date = new Date(date).getTime() + 8 * 60 * 60 * 1000; //得到毫秒数
      return date;
    },
    edwColor(arry) {
      var color = ["#c23531", "#90EE7E", "#19d4ae"];
      if (typeof arry == "string") {
        if (arry == "E") {
          return color[0];
          //除了错误和已完成其余都是一个颜色
        } else if (arry == "R") {
          return color[1];
        } else if (arry == "W") {
          return color[1];
        } else if (arry == "P") {
          return color[1];
        } else if (arry == "S") {
          return color[1];
        } else if (arry == "D") {
          return color[2];
        }
      }
    },
    // 关闭模态框
    close() {
      this.dialogMointer = false;
      this.showOrhidden = false;
      this.showChartsInfo = false;
    },
    // 跳转详情页
    routerLink(val) {
      sessionStorage.setItem("sys_name", val.sys_name);
      this.$router.push({
        name: "currentBatch",
        query: {
          name: "/currentBatch",
          dec: this.$Base64.encode("当前批量"),
          sys_name: val.sys_name,
          etl_sys_id: val.etl_sys_id,
        },
      });
    },
    // 获取代码项对应的值
    getCategoryItems(e) {
      if (e == "IsFlag") {
        this.$Code.getCategoryItems({category: e}).then((res) => {
            this.YesNo = res.data;
            res.data.map((data) => {
              data.label = data.value;
              data.value = data.code;
            });
            this.formStartCONItem.map((item) => {
              if (item.type === "radio") {
                item.options = res.data;
              }
            });
          });
      }
    },
    // 停止工程
    stopWork(row) {
      let mess = row.etl_sys_name;
      this.$confirm("确定停止(" + mess + ")工程?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$executeRequest
            .execGetByModuleUrl("/etlMage/stopEtlProject", {
              etl_sys_id: row.etl_sys_id,
              etl_sys_cd: row.etl_sys_cd,
            })
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("停止工程成功", "success");
                this.getTable();
              }
            });
        })
        .catch(() => {
          this.$Msg.customizTitle("已取消停止", "info");
        });
    },
    // 是否续跑控制日期选择
    changeValue(val) {
      if (val == "1") {
        this.formStartCON.curr_bath_date = this.currDate.replace(/-/g, "");
        this.dateDisabled = true;
      } else if (val == "0") {
        this.formStartCON.curr_bath_date = "";
        this.dateDisabled = false;
      }
    },
  },

  //添加工程按钮
  addProject() {
    this.disableds = false;
    this.dialogFormVisibleAdd = true;
    this.projectTitle = "添加工程";
  },
};
</script>

<style scoped lang="less">
.lines {
  margin-top: 2px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 10px;
}
.saveBtn {
  min-width: 80px;
  height: 32px;
  padding: 8px 25px;
  font-family: @hansan;
  margin-left: 5px;
}
.tabes {
  margin-top: 14px;
}

.el-row {
  height: 64px;
  line-height: 64px;
  width: 100%;
}

.elRows {
  height: 40px;
  line-height: 40px;
  width: 100%;
}

.el-row span {
  color: #2196f3;
  font-size: 18px;
}

/* 字体小图标样式设置 */
.fa-globe {
  color: #2196f3;
  margin-right: 5px;
}

i {
  margin-right: 5px;
}

/* button样式设置 */
.els {
  float: right;
  margin-top: 3px;
}

.el1 {
  margin-left: 10px;
}

.item {
  float: right;
}

.loindex .span11 {
  text-align: center;
  margin-bottom: 10px;
}

.loindex .span10 {
  color: #409eff;
  cursor: pointer;
  margin-top: 30px;
  font-size: 20px;
  margin-bottom: 6px;
  text-align: center;
  margin-bottom: 10px;
}

.loindex .span11 {
  margin-top: 6px;
  font-size: 12px;
  margin-bottom: 10px;
}

.loindex .pDrag {
  display: inline-block;
  height: 40px;
  width: 100%;
  background: #f5f5f5;
  line-height: 40px;
  cursor: pointer;
}

.loindex .movePlace {
  border: 1px solid #ddd;
}

.loindex .el-icon-full-screen {
  color: #478fca;
}

.loindex .pDrag span:first-child {
  float: left;
  margin-left: 10px;
  font-size: 13px;
  font-weight: normal;
}

.loindex .pDrag span:last-child {
  float: right;
  margin-right: 10px;
}

.loindex .color-item {
  border: 1px solid #ddd;
}

.loindex .span2 {
  text-align: center;
  margin-bottom: 10px;
}

.loindex .span22 {
  text-align: center;
  margin-bottom: 10px;
}

.loindex .span22 {
  font-size: 20px;
}

.loindex .span2 {
  font-size: 12px;
}

.fixed {
  min-height: 500px;
}

.loindex /deep/ .el-dialog__body {
  padding: 0px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}

.loindex .endAgent {
  color: red;
}

.loindex .fa-question-circle {
  margin-left: -5px;
  margin-right: 5px;
}

.form-line {
  margin-bottom: 0 !important;
}
::v-deep .el-tabs__content {
  height: calc(100% - 38px);
}
::v-deep .el-tab-pane {
  padding-top: 10px;
  height: 100%;
  box-sizing: border-box;
}
.formInput ::v-deep .el-input__inner {
  height: 32px;
  font-family: @pingfang;
  font-size: 14px;
  color: @titletxt-color;
  padding: 0 10px;
}
::v-deep .el-tab-pane{
  overflow: auto
}
</style>
