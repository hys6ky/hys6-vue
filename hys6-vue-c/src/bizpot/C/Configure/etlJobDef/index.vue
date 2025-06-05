<template>
  <div class="px-20 codeManage">
    <ByQuickSearch :form-items="formItem" @search="search"></ByQuickSearch>
    <div class="container pt-10">
      <div style="height: 32px; margin-bottom: 10px">
        <div style="float: right">
          <el-button type="primary" size="small" v-debounce>
            <el-upload
              accept=".xlsx"
              action=""
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleChange"
              :limit="1"
              :on-exceed="handleExceed"
              :fileList="fileList"
            >
              <span>导入数据</span>
            </el-upload>
          </el-button>
          <el-button
            type="primary"
            size="small"
            v-debounce
            @click="downloadModel"
            >下载模板
          </el-button>
          <el-button type="primary" size="small" v-debounce @click="handleAdd"
            >新增
          </el-button>
          <el-button
            type="primary"
            size="small"
            v-debounce
            @click="handleBatchDelete"
            >批量删除
          </el-button>
        </div>
      </div>
      <div>
        <ByTable
          v-if="tableData.length !== 0"
          :table-data="tableData"
          :column-arr="tableItem"
          @linkTo="linkTo"
          :pagination="pagination"
          @handleMultiple="handleMultipleMethod"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
          @operateItem="operateHandler"
        ></ByTable>
        <ByEmpty v-else></ByEmpty>
      </div>
    </div>
    <!-- 添加/修改任务模态框 -->
    <ByModel
      :model-title="jobTitle"
      :visible.sync="dialogFormVisibleAdd"
      :model-width="screenWidth"
      @close="beforeClosechange"
    >
      <by-model-form
        :form-data="formAdd"
        :form-items="modelFormItems"
        :form-config="modelFormConfig"
        :form-rules="modelFromRules"
        @selectChang="selectChang"
        ref="modelForm"
      ></by-model-form>
      <template slot="modalFoot">
        <el-button @click="beforeClosechange">取 消</el-button>
        <el-button type="primary" @click="modelFormClick" v-debounce
          >确 定</el-button
        >
      </template>
    </ByModel>
    <ByModel
      :title="dependcyTitle"
      :visible.sync="dialogDeleteVisible"
      @close="dialogDeleteVisible = false"
    >
      <div>
        <span>
          <p>确认删除吗?</p>
          <p v-if="this.resource_count != 0 && this.dependcy_count != 0">
            删除作业的同时也会删除作业依赖和作业资源!
          </p>
          <p v-if="this.resource_count == 0 && this.dependcy_count != 0">
            删除作业的同时也会删除作业依赖!
          </p>
          <p v-if="this.resource_count != 0 && this.dependcy_count == 0">
            删除作业的同时也会删除作业资源!
          </p>
        </span>
      </div>
      <template slot="modalFoot">
        <el-button type="primary" @click="handleDelete1">确 定</el-button>
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>&nbsp;
        <el-button
          v-if="this.resource_count != 0"
          style="float: right; margin-bottom: 10px"
          type="info"
          @click="gotoJobResource"
          >作业资源</el-button
        >
        <el-button
          v-if="this.dependcy_count != 0"
          style="float: right; margin-bottom: 10px"
          type="success"
          @click="gotoWorkRely1"
          >作业依赖</el-button
        >
      </template>
    </ByModel>
    <ByModel
      :visible.sync="dialogdependcyVisible"
      @close="dialogdependcyVisible = false"
    >
      <div>
        <span>
          <p>确认删除吗?</p>
          <p v-if="this.resource_count1 != 0 && this.dependcy_count1 != 0">
            删除作业的同时也会删除作业依赖和作业资源!
          </p>
          <p v-if="this.resource_count1 == 0 && this.dependcy_count1 != 0">
            删除作业的同时也会删除作业依赖!
          </p>
          <p v-if="this.resource_count1 != 0 && this.dependcy_count1 == 0">
            删除作业的同时也会删除作业资源!
          </p>
        </span>
      </div>
      <div slot="modalFoot">
        <el-button type="primary" @click="handleBatchDelete1">确 定</el-button>
        <el-button @click="dialogdependcyVisible = false">取 消</el-button
        >&nbsp;
        <el-button
          v-if="this.resource_count1 != 0"
          type="info"
          @click="gotoJobResource1"
          >作业资源</el-button
        >
        <el-button
          v-if="this.dependcy_count1 != 0"
          type="success"
          @click="gotoWorkRely2"
          >作业依赖</el-button
        >
      </div>
    </ByModel>
    <!-- 获取上传文件 -->
    <ByModel
      :model-title="'导入作业数据'"
      :visible.sync="dialogImportData"
      @close="importDatacancel"
    >
      <span v-if="fileList != ''">确认导入 “ {{ fileList[0].name }} ” </span>
      <div slot="modalFoot" class="dialog-footer">
        <el-button @click="importDatacancel" size="mini" type="danger"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="importData"
          :loading="loadingUpload"
          size="mini"
          >保存</el-button
        >
      </div>
    </ByModel>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import {
  formItem,
  tableItem,
  modelFormConfig,
  modelFormItems,
  modelFromRules,
} from "./mock";

import regular from "@/utils/regular";
import {
  execDownloadFileByModuleUrl,
  execFormPostByModuleUrl,
  execGetByModuleUrl,
  execPostByModuleUrl,
  execUploadFileByModuleUrl,
} from "@/utils/executeRequest";
import { Row } from "element-ui";
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import ByTable from "@/components/global/ByTable.vue";
import ByModel from "@/components/global/ByModel.vue";
import ByModelForm from "@/components/global/ByModelForm.vue";
import ByEmpty from "@/components/global/ByEmpty.vue";
let arr = [];
export default {
  components: { ByEmpty, ByModelForm, ByModel, ByTable, ByQuickSearch },
  computed: {
    Row() {
      return Row;
    },
  },
  data() {
    return {
      modelFromRules,
      modelFormItems,
      modelFormConfig,
      title: "",
      tableItem,
      formItem,
      sys_id: "",
      sys_cd: "",
      fileList: [],
      form: {
        etl_job: "",
        pro_name: "",
        sub_sys_cd: "",
        sub_sys_id: "",
        pro_type: "",
      },
      workhidden: [
        {
          value: "#{txdate}",
        },
        {
          value: "#{txdate_next}",
        },
        {
          value: "#{txdate_pre}",
        },
      ],
      tableData: [],
      listDatas: [],
      dialogDeleteVisible: false,
      etl_job_id: "",
      Today_Dispatch_Flag: [],
      Job_Effective_Flag: [],
      Dispatch_Type: [],
      Dispatch_Frequency: [],
      jobTitle: "",
      dependcyTitle: "",
      dependcyTitle1: "",
      temp: "false",
      disabledControl: false,
      rule: validator.default,
      multipleSelection: [],
      dependcySelection: [],
      dialogFormVisibleAdd: false,
      dialogImportData: false,
      showHiddenOr: false,
      loadingUpload: false,
      formAdd: {
        etl_sys_id: "",
        etl_sys_cd: "",
        sub_sys_id: "",
        // sub_sys_cd: '',
        etl_job: "",
        etl_job_id: "",
        etl_job_desc: "",
        pro_type: "",
        pro_dic: "",
        pro_name: "",
        pro_para: "",
        log_dic: "",
        disp_freq: "",
        disp_offset: "",
        disp_type: "",
        disp_time: "",
        job_priority: "",
        job_eff_flag: "",
        today_disp: "",
        comments: "",
        exe_frequency: "",
        exe_num: "",
        star_time: "",
        end_time: "",
        pre_etl_sys_cd: "",
        pre_etl_sys_id: "",
        pre_etl_job_ids: [],
        status: "",
        job_datasource: "09",
      },
      addSelect: {
        project_no: [],
        proType: [],
        dispRate: [],
        dispType: [],
        jobEfflag: [],
        todayDisp: [],
        preJobName: [],
        status: [],
        ETLDataSource: [],
      },
      deleteForm: {
        etl_sys_id: "",
        etl_job_id: "",
      },
      tempForm: {
        old_disp_freq: "",
        old_pre_etl_job_ids: [],
        old_dispatch_type: "",
      },
      // pagesize: 5,
      // currpage: 1,
      // pageLength: 0,
      pagination: {
        total: 5,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      ETLDataSource: [],
      screenWidth: "85%",
      dependcy_count: "",
      dependcy_count1: "",
      resource_count: "",
      resource_count1: "",
      dialogdependcyVisible: false,
    };
  },
  // watch: {
  //     windowWidth(val) {
  //         // let that = this;
  //         // console.log("实时屏幕宽度：", val, that.windowHeight);
  //     }
  // },
  created() {
    this.getCategoryItems();
  },
  mounted() {
    var that = this;
    // <!--把window.onresize事件挂在到mounted函数上-->
    window.onresize = () => {
      return (() => {
        window.fullWidth = document.documentElement.clientWidth;
        if (window.fullWidth > 1800) {
          that.screenWidth = "70%";
        } else {
          that.screenWidth = "85%";
        }
      })();
    };

    this.getCategoryItems();
    this.getSelect();
    this.sys_cd = sessionStorage.getItem("sys_cd");
    this.sys_id = sessionStorage.getItem("sys_id");
    this.getProType();
    this.getJobName();
    if (this.$route.query.sub_sys_cd != undefined) {
      //判断从哪里来的
      this.form.sub_sys_cd = this.$route.query.sub_sys_cd;
      this.form.sub_sys_id = this.$route.query.sub_sys_id;
      this.formAdd.sub_sys_id = this.$route.query.sub_sys_id;
      this.formItem.map((item) => {
        if (item.prop === 'sub_sys_cd'){
          item.value = this.$route.query.sub_sys_cd;
        }
      })
      this.searchBtn();
    } else {
      this.getTable();
    }
  },
  methods: {
    search(val) {
      this.form = val;
      this.searchBtn();
    },
    //下拉框数据强制渲染
    selectChange() {
      this.$forceUpdate();
    },
    // 获取表格代码项
    getCategoryItems() {
      //调度频率
      this.$Code.getCategoryItems({category: "Dispatch_Frequency",}).then((res) => {
          this.Dispatch_Frequency = res.data;
        });
      this.$Code.getCategoryItems({category: "Dispatch_Type"}).then((res) => {
          this.Dispatch_Type = res.data;
        });
      //作业有效标志
      this.$Code.getCategoryItems({category: "Job_Effective_Flag"}).then((res) => {
          this.Job_Effective_Flag = res.data;
        });
      //是否当天调度
      this.$Code.getCategoryItems({category: "Today_Dispatch_Flag",}).then((res) => {
          this.Today_Dispatch_Flag = res.data;
        });
      // 作业数据来源
      this.$Code.getCategoryItems({category: "ETLDataSource"}).then((res) => {
          this.ETLDataSource = res.data;
        });
    },
    //获取代码项
    getCode() {
      // this.getProType();
      this.getDispRate();
      this.getDispType();
      this.getJobFlag();
      this.getTodayDisp();
      this.getStatus();
      this.getETLDataSource();
      this.getPreJobName();
    },
    modelFormClick() {
      this.$refs.modelForm
        .transferData()
        .then((data) => {
          this.saveAdd();
        })
        .catch((err) => {});
    },
    linkTo(row) {
      this.gotoWorkRely(row.etl_job_id);
    },
    //任务编号下拉框数据
    getSelect() {
      let params = {};
      let arr = [];
      this.sys_cd = sessionStorage.getItem("sys_cd");
      this.sys_id = sessionStorage.getItem("sys_id");
      params["etl_sys_id"] = this.sys_id;
      this.$executeRequest
        .execGetByModuleUrl("etlMage/jobconfig/searchEtlSubSys", params)
        .then((res) => {
          if (res) {
            arr = res.data;
            arr.forEach((item) => {
              item.label = item.sub_sys_desc + "(" + item.sub_sys_cd + ")";
              item.value = item.sub_sys_id;
            });
            this.addSelect.project_no = arr;
            this.setFormOptions("sub_sys_id", arr);
          }
        });
    },
    // input框的历史信息
    querySearch(queryString, cb) {
      var res = this.listDatas;
      var results = queryString
        ? res.filter(this.createFilter(queryString))
        : res;
      // console.log(results);
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (res) => {
        return res.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1;
      };
    },
    operateHandler(type, row) {
      if (type === "edit") {
        this.type = "1";
        this.title = "编辑任务";
        this.handleEdit(row);
      } else if (type === "del") {
        this.handleDelete(row);
        this.dialogDeleteVisible = true;
      }
    },
    //获取作业名称/上游作业名称下拉框数据
    getJobName() {
      let params = {};
      let arr = [];
      let obj = {};
      params["etl_sys_id"] = this.sys_id;
      this.$executeRequest
        .execGetByModuleUrl("etlMage/jobconfig/searchEtlJob", params)
        .then((res) => {
          if (res.success) {
            res.data.forEach((item) => {
              obj.label = item.etl_job;
              obj.value = item.etl_job;
              arr.push(obj);
              obj = {};
            });
            this.listDatas = arr;
            this.setOptions("etl_job", arr);
          }
        });
    },
    //作业程序类型下拉框数据
    getProType() {
      let params = {};
      let arr = [];
      params["category"] = "Pro_Type";
      this.$Code.getCategoryItems(params).then((res) => {
          arr = res.data;
          arr.forEach((item) => {
            item.label = item.value;
            item.value = item.code;
          });
          this.addSelect.proType = arr;
          this.setFormOptions("pro_type", arr);
          this.setOptions("pro_type", arr);
        });
    },
    setFormOptions(prop, data) {
      this.modelFormItems.map((item) => {
        if (item.prop === prop) {
          item.options = data;
        }
      });
    },
    setOptions(prop, data) {
      this.formItem.map((item) => {
        if (item.prop === prop) {
          item.options = data;
        }
      });
    },
    //调度频率下拉框数据
    getDispRate() {
      let params = {};
      let arr = [];
      params["category"] = "Dispatch_Frequency";
      this.$Code.getCategoryItems(params).then((res) => {
          arr = res.data;
          arr.forEach((item) => {
            item.label = item.value;
            item.value = item.code;
          });
          this.addSelect.dispRate = arr;
          this.setFormOptions("disp_freq", arr);
        });
    },
    //调度触发方式下拉框数据
    getDispType() {
      let params = {};
      let arr = [];
      params["category"] = "Dispatch_Type";
      this.$Code.getCategoryItems(params).then((res) => {
          arr = res.data;
          arr.forEach((item) => {
            item.label = item.value;
            item.value = item.code;
          });
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].code == "A" || arr[i].code == "B") {
              arr.splice(i, 1);
              i--;
            }
          }
          this.addSelect.dispType = arr;
          this.setFormOptions("disp_type", arr);
        });
    },
    //作业有效标志下拉框数据
    getJobFlag() {
      let params = {};
      let arr = [];
      params["category"] = "Job_Effective_Flag";
      this.$Code.getCategoryItems(params).then((res) => {
          arr = res.data;
          arr.forEach((item) => {
            item.label = item.value;
            item.value = item.code;
          });
          this.addSelect.jobEfflag = arr;
          this.setFormOptions("job_eff_flag", arr);
        });
    },
    //当天是否调度下拉框数据
    getTodayDisp() {
      let params = {};
      let arr = [];
      params["category"] = "Today_Dispatch_Flag";
      this.$Code.getCategoryItems(params)
        .then((res) => {
          arr = res.data;
          arr.forEach((item) => {
            item.label = item.value;
            item.value = item.code;
          });
          this.addSelect.todayDisp = arr;
          this.setFormOptions("today_disp", arr);
        });
    },
    //依赖是否有效下拉框数据
    getStatus() {
      let params = {};
      let arr = [];
      params["category"] = "Status";
      this.$Code.getCategoryItems(params).then((res) => {
          // arr = res.data;
        res.data.forEach((item =>{
          let para ={
            value : item.code,
            label : item.value,
          }
          arr.push(para)
        }))
          this.addSelect.status = arr;
          this.setFormOptions("status", arr);
        });
    },
    // 作业数据来源
    getETLDataSource() {
      this.$Code.getCategoryItems({category: "ETLDataSource"}).then((res) => {
          if (res && res.success) {
            this.addSelect.ETLDataSource = res.data;
            res.data.forEach((item) => {
              item.label = item.value;
              item.value = item.code;
            });
            this.setFormOptions("job_datasource", res.data);
          }
        });
    },
    //上游作业名下拉框数据
    getPreJobName() {
      let params = {};
      let arr = [];
      params["etl_sys_id"] = this.sys_id;
      this.$executeRequest
        .execGetByModuleUrl("etlMage/jobconfig/searchEtlJob", params)
        .then((res) => {
          // console.log(res.data);
          res.data.forEach((item) => {
            let obj = {};
            obj.label = item.etl_job;
            obj.value = item.etl_job_id;
            arr.push(obj);
          });
          this.addSelect.preJobName = arr;
          this.setFormOptions("pre_etl_job_ids", arr);
        });
    },
    //刷新表格
    getTable() {
      let params = {};
      this.sys_cd = sessionStorage.getItem("sys_cd");
      params["etl_sys_id"] = this.sys_id;
      params["sub_sys_cd"] = this.form.sub_sys_cd;
      params["etl_job"] = this.form.etl_job;
      params["currPage"] = this.pagination.pageNum;
      params["pageSize"] = this.pagination.pageSize;
      this.searchEtlJobDefByPage(params);
    },
    // 获取表格代码项
    getCodeItems(val) {
      if (val == "Dispatch_Frequency") {
        //调度频率
        this.$Code.getCategoryItems( {category: "Dispatch_Frequency"}).then((res) => {
            this.Dispatch_Frequency = res.data;
          });
      } else if (val == "Dispatch_Type") {
        //触发方式
        tthis.$Code.getCategoryItems( {category: "Dispatch_Type"}).then((res) => {
            this.Dispatch_Type = res.data;
          });
      } else if (val == "Job_Effective_Flag") {
        //作业有效标志
        this.this.$Code.getCategoryItems( {category: "Job_Effective_Flag",}).then((res) => {
            this.Job_Effective_Flag = res.data;
          });
      } else if (val == "Today_Dispatch_Flag") {
        //是否当天调度
        this.$Code.getCategoryItems( {category: "Today_Dispatch_Flag"}).then((res) => {
            this.Today_Dispatch_Flag = res.data;
          });
      }
    },

    //清空模态框切换残余数据
    clears() {
      this.formAdd.disp_type = "";
    },
    selectChang(type) {
      if (type === "dispFreq") {
        this.checkDispFreq();
        debugger
        // this.clears();
      } else if (type === "dispType") {
        this.checkDispType();
        this.changeValue();
      }
    },

    checkDispFreq() {
      if (this.formAdd.disp_freq === "F") {
        this.setConceal("F");
      } else {
        this.setConceal("M");
      }
    },
    checkDispType() {
      if (this.formAdd.disp_type === "D") {
        this.setConceal("D");
      } else {
        this.setConceal("T");
      }
    },
    setConceal(tag) {
      this.modelFormItems.map((item) => {
        if (tag === "F") {
          item.tag.split(",").map((spl) => {
            if (item.tag === "A") {
              item.conceal = "true";
            } else if (item.tag.includes(tag)) {
              item.conceal = "true";
            } else {
              item.conceal = "false";
            }
          });
        } else if (tag === "D") {
          item.tag.split(",").map((spl) => {
            if (item.tag === "A") {
              item.conceal = "true";
            } else if (item.tag.includes(tag)) {
              item.conceal = "true";
            } else {
              item.conceal = "false";
            }
          });
        } else if (tag === "T") {
          item.tag.split(",").map((spl) => {
            if (item.tag === "A") {
              item.conceal = "true";
            } else if (item.tag.includes(tag)) {
              item.conceal = "true";
            } else {
              item.conceal = "false";
            }
          });
        } else if (tag === "M") {
          var strings = item.tag.split(",");
          if (item.tag === "A") {
            item.conceal = "true";
          } else if (item.tag.includes(tag)) {
            item.conceal = "true";
          } else {
            item.conceal = "false";
          }
        }
      });
    },
    setConcealTrue() {
      this.modelFormItems.map((item) => {
        item.conceal = true;
      });
    },
    //搜索按钮
    searchBtn() {
      let params = {};
      params["etl_sys_id"] = this.sys_id;
      params["pro_type"] = this.form.pro_type;
      params["etl_job"] = this.form.etl_job;
      params["pro_name"] = this.form.pro_name;
      params["sub_sys_cd"] = this.form.sub_sys_cd;
      params["currPage"] = this.pagination.pageNum;
      params["pageSize"] = this.pagination.pageSize;
      this.searchEtlJobDefByPage(params);
    },
    // 获取表格数据封装
    searchEtlJobDefByPage(params) {
      this.$executeRequest
        .execGetByModuleUrl("etlMage/jobconfig/searchEtlJobDefByPage", params)
        .then((res) => {
          if (res && res.success) {
            let dates = res.data.etlJobDefList;
            this.pagination.total = res.data.totalSize;
            //作业有效标志
            dates.forEach((item) => {
              this.Job_Effective_Flag.forEach((val) => {
                if (item.job_eff_flag == val.code) {
                  item.jobEffFlag = val.value;
                }
              });

              //调度频率
              this.Dispatch_Frequency.forEach((val) => {
                if (item.disp_freq == val.code) {
                  item.dispFreq = val.value;
                }
              });

              //调度触发方式
              this.Dispatch_Type.forEach((val) => {
                if (item.disp_type == val.code) {
                  item.dispType = val.value;
                }
              });
              //是否当天调度
              this.Today_Dispatch_Flag.forEach((val) => {
                if (item.today_disp == val.code) {
                  item.todayDisp = val.value;
                }
              });
              //作业数据来源
              this.ETLDataSource.forEach((val) => {
                if (item.job_datasource == val.code) {
                  item.job_datasource = val.value;
                }
              });
            });
            // console.log(dates);
            this.tableData = dates;
          }
        });
    },
    //选中的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //新增按钮
    handleAdd() {
      this.getCode();
      this.setConceal("M");
      this.jobTitle = "添加作业";
      this.dialogFormVisibleAdd = true;
      this.formAdd.etl_sys_cd = this.sys_cd;
      this.formAdd.pre_etl_sys_cd = this.sys_cd;
      this.formAdd.status = '';
    },
    //批量删除按钮
    handleBatchDelete() {
      if (this.multipleSelection.length == 0) {
        this.$Msg.customizTitle("请选择需要删除的数据", "warning");
      } else {
        this.dialogdependcyVisible = true;
        this.multipleSelection.forEach((item) => {
          this.dependcySelection.push(item.etl_job_id);
        });
        this.searchJobDependency1();
      }
    },
    searchJobDependency1() {
      var data = {
        etl_sys_id: this.sys_id,
        etl_job_ids: this.dependcySelection,
      };
      this.$executeRequest
        .execPostByModuleUrl("etlMage/jobconfig/searchJobDependency1", data)
        .then((res) => {
          this.dependcy_count1 = res.data.dependcy_count;
          this.resource_count1 = res.data.resource_count;
          this.dependcySelection = [];
        });
    },
    replaceLine(string) {
      string.replace(/\?/g, ".\n");
    },
    handleBatchDelete1() {
      let arr = [];
      this.multipleSelection.forEach((item) => {
        arr.push(item.etl_job_id);
      });
      let data = {};
      data["etl_sys_id"] = this.sys_id;
      data["etl_job_ids"] = arr;
      // console.log(params)
      this.$executeRequest
        .execPostByModuleUrl("etlMage/jobconfig/batchDeleteEtlJobDef", data)
        .then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle("批量删除成功", "success");
            this.dialogdependcyVisible = false;
            this.getTable();
          }
        });
    },
    //编辑按钮
    handleEdit(row) {
      this.getCode();
      let params = {};
      let arr = [];
      this.disabledControl = true;
      params["etl_sys_id"] = row.etl_sys_id;
      params["etl_job_id"] = row.etl_job_id;
      this.$executeRequest.execGetByModuleUrl("etlMage/jobconfig/searchEtlJobDefById", params).then((res) => {
          this.dialogFormVisibleAdd = true;
          this.jobTitle = "修改作业";
        res.data.pre_etl_job_ids = [];
        res.data.status = '';
        res.data.old_pre_etl_job_ids = [];
        if (res.data.dependencyList.length != 0) {
          let arr = [];
          let status = "";
          res.data.dependencyList.forEach((item) => {
            arr.push(item.pre_etl_job_id);
            status = item.status;
          });
          res.data.pre_etl_job_ids = arr;
          res.data.status = status;
          res.data.old_pre_etl_job_ids = arr;
          this.tempForm.old_pre_etl_job_ids = arr;
        } else {
          res.data.old_pre_etl_job = [];
        }
          this.formAdd = res.data;
          this.formAdd.etl_sys_cd = this.sys_cd;
          this.formAdd.etl_sys_id = this.sys_id;
          this.formAdd.pre_etl_sys_cd = this.sys_cd;
          this.formAdd.pre_etl_sys_id = this.sys_id;
          this.tempForm.old_disp_freq = res.data.disp_freq;
          this.formAdd.etl_job_id = row.etl_job_id;

          if (res.data.disp_type) {
            this.tempForm.old_dispatch_type = res.data.disp_type;
          } else {
            this.tempForm.old_dispatch_type = "";
          }
          this.checkDispFreq();
          if (this.formAdd.disp_freq !== 'F') {
            this.checkDispType();
            // let para = [];
            // let status = '';
            // row.dependencyList.forEach(item =>{
            //   para.push(item.pre_etl_job_id);
            //   status = item.status;
            // })
            // this.formAdd.pre_etl_job_ids = para;
            // this.formAdd.status = status;
          }
        });
    },
    //删除按钮
    handleDelete(row) {
      this.etl_sys_id = row.etl_sys_id;
      this.etl_job_id = row.etl_job_id;
      this.etl_job = row.etl_job;
      this.searchJobDependency();
    },
    searchJobDependency() {
      // var data = { etl_sys_id: this.etl_sys_id , etl_job_id: this.etl_job_id };
      let data = {};
      data["etl_sys_id"] = this.etl_sys_id;
      data["etl_job_ids"] = this.etl_job_id;
      this.$executeRequest
        .execGetByModuleUrl("etlMage/jobconfig/searchJobDependency", data)
        .then((res) => {
          this.dependcy_count = res.data.dependcy_count;
          this.resource_count = res.data.resource_count;
        });
    },
    handleDelete1(index, row) {
      this.deleteForm.etl_sys_id = this.etl_sys_id;
      this.deleteForm.etl_job_id = this.etl_job_id;
      let params = {};
      params["etl_sys_id"] = this.deleteForm.etl_sys_id;
      params["etl_job_id"] = this.deleteForm.etl_job_id;
      this.$executeRequest
        .execGetByModuleUrl("etlMage/jobconfig/deleteEtlJobDef", params)
        .then((res) => {
          if (res.code == 999) {
            this.$Msg.customizTitle("删除成功", "success");
            this.dialogDeleteVisible = false;
            this.getTable();
          }
        });
    },
    //新增/修改模态框取消按钮
    cancleAdd() {
      if (this.jobTitle == "修改作业") {
        this.getTable();
        this.disabledControl = true;
      }
      this.showHiddenOr = false;
      this.disabledControl = false;
      this.dialogFormVisibleAdd = false;
      this.formAdd = {};
      this.tempForm = {};
      // this.$refs.formAdd.resetFields();
    },
    beforeClosechange() {
      if (this.jobTitle == "修改作业") {
        this.disabledControl = true;
      }
      this.showHiddenOr = false;
      this.disabledControl = false;
      this.dialogFormVisibleAdd = false;
      this.formAdd = {};
      // this.$refs.formAdd.resetFields();
    },
    //新增/修改模态框保存按钮
    saveAdd(formName) {
      let params = {};
      if (this.formAdd.disp_offset === "") {
        this.formAdd.disp_offset = null;
      }
      this.formAdd.etl_sys_id = this.sys_id;
      params["etl_job_def"] = this.formAdd;
      let etl_dependency = {};
      etl_dependency["etl_job_id"] = this.formAdd.etl_job_id;
      etl_dependency["etl_sys_id"] = this.sys_id;
      etl_dependency["etl_job"] = this.formAdd.etl_job;
      etl_dependency["status"] = this.formAdd.status;
      params["etl_dependency"] = etl_dependency;
      params["pre_etl_job_ids"] = this.formAdd.pre_etl_job_ids;
      params["old_disp_freq"] = this.tempForm.old_disp_freq;
      params["old_pre_etl_job_ids"] = this.tempForm.old_pre_etl_job_ids;
      params["old_dispatch_type"] = this.tempForm.old_dispatch_type;
      if (this.jobTitle === "添加作业") {
        this.$executeRequest.execPostByModuleUrl("etlMage/jobconfig/saveEtlJobDef", params).then((res) => {
            if (res && res.success) {
              this.$Msg.customizTitle("添加成功", "success");
              this.getTable();
              this.dialogFormVisibleAdd = false;
              this.formAdd = {};
            }
          });
      } else if (this.jobTitle === "修改作业") {
        this.$executeRequest.execPostByModuleUrl("etlMage/jobconfig/updateEtlJobDef", params).then((res) => {
            if (res && res.success) {
              this.$Msg.customizTitle("修改成功", "success");
              this.getTable();
              this.dialogFormVisibleAdd = false;
              this.formAdd = {};
              this.tempForm = {};
            }
          });
      }
    },
    //新增/修改模态框1取消按钮
    cancleAdd1() {
      if (this.jobTitle == "修改作业") {
        this.getTable();
        this.disabledControl = true;
      }
      this.showHiddenOr = false;
      this.disabledControl = false;
      this.dialogFormVisibleAdd = false;
      this.formAdd = {};
      // this.$refs.formAdd.resetFields();
    },
    //新增/修改模态框1保存按钮
    saveAdd1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {};
          let etl_job_def = {};
          let etl_dependency = {};
          etl_job_def["etl_job_id"] = this.formAdd.etl_job_id;
          // params["etl_sys_cd"] = this.sys_cd;
          etl_job_def["etl_sys_id"] = this.sys_id;
          // params["sub_sys_cd"] = this.formAdd.sub_sys_cd;
          etl_job_def["sub_sys_id"] = this.formAdd.sub_sys_id;
          etl_job_def["etl_job"] = this.formAdd.etl_job;
          etl_job_def["etl_job_desc"] = this.formAdd.etl_job_desc;
          etl_job_def["pro_type"] = this.formAdd.pro_type;
          etl_job_def["pro_dic"] = this.formAdd.pro_dic;
          etl_job_def["pro_name"] = this.formAdd.pro_name;
          etl_job_def["pro_para"] = this.formAdd.pro_para;
          etl_job_def["log_dic"] = this.formAdd.log_dic;
          etl_job_def["disp_freq"] = this.formAdd.disp_freq;
          etl_job_def["job_eff_flag"] = this.formAdd.job_eff_flag;
          etl_job_def["comments"] = this.formAdd.comments;
          etl_job_def["today_disp"] = this.formAdd.today_disp;
          etl_job_def["exe_frequency"] = this.formAdd.exe_frequency;
          etl_job_def["exe_num"] = this.formAdd.exe_num;
          etl_job_def["star_time"] = this.formAdd.star_time;
          etl_job_def["end_time"] = this.formAdd.end_time;
          etl_job_def["success_job"] = this.formAdd.success_job;
          etl_job_def["fail_job"] = this.formAdd.fail_job;
          etl_job_def["job_datasource"] = this.formAdd.job_datasource;
          params["etl_job_def"] = etl_job_def;
          etl_job_def["etl_job_id"] = this.formAdd.etl_job_id;
          etl_dependency["etl_sys_id"] = this.sys_id;
          etl_dependency["etl_job"] = this.formAdd.etl_job;
          params["etl_dependency"] = etl_dependency;
          params["old_disp_freq"] = this.tempForm.old_disp_freq;
          params["old_pre_etl_job_ids"] = this.tempForm.old_pre_etl_job_ids;
          params["old_dispatch_type"] = this.tempForm.old_dispatch_type;
          if (this.jobTitle == "添加作业") {
            this.$executeRequest
              .execPostByModuleUrl("etlMage/jobconfig/saveEtlJobDef", params)
              .then((res) => {
                if (res && res.success) {
                  this.$Msg.customizTitle("添加成功", "success");
                  this.getTable();
                  this.dialogFormVisibleAdd = false;
                  this.formAdd = {};
                }
              });
          } else if (this.jobTitle == "修改作业") {
            this.$executeRequest
              .execPostByModuleUrl("etlMage/jobconfig/updateEtlJobDef", params)
              .then((res) => {
                if (res && res.success) {
                  this.$Msg.customizTitle("修改成功", "success");
                  this.getTable();
                  this.dialogFormVisibleAdd = false;
                  this.formAdd = {};
                }
              });
          }
        }
      });
    },
    //新增/修改模态框2取消按钮
    cancleAdd2() {
      if (this.jobTitle == "修改作业") {
        this.getTable();
        this.disabledControl = true;
      }
      this.showHiddenOr = false;
      this.disabledControl = false;
      this.dialogFormVisibleAdd = false;
      this.formAdd = {};

      // this.$refs.formAdd.resetFields();
    },
    //新增/修改模态框2保存按钮
    saveAdd2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {};
          let etl_job_def = {};
          let etl_dependency = {};
          etl_job_def["etl_job_id"] = this.formAdd.etl_job_id;
          // params["etl_sys_cd"] = this.sys_cd;
          etl_job_def["etl_sys_id"] = this.sys_id;
          // params["sub_sys_cd"] = this.formAdd.sub_sys_cd;
          etl_job_def["sub_sys_id"] = this.formAdd.sub_sys_id;
          etl_job_def["etl_job"] = this.formAdd.etl_job;
          etl_job_def["etl_job_desc"] = this.formAdd.etl_job_desc;
          etl_job_def["pro_type"] = this.formAdd.pro_type;
          etl_job_def["pro_dic"] = this.formAdd.pro_dic;
          etl_job_def["pro_name"] = this.formAdd.pro_name;
          etl_job_def["pro_para"] = this.formAdd.pro_para;
          etl_job_def["log_dic"] = this.formAdd.log_dic;
          etl_job_def["disp_freq"] = this.formAdd.disp_freq;
          if (this.formAdd.disp_offset == "") {
            this.formAdd.disp_offset = null;
          }
          etl_job_def["disp_offset"] = this.formAdd.disp_offset;
          etl_job_def["disp_type"] = this.formAdd.disp_type;
          if (this.formAdd.job_priority == "") {
            this.formAdd.job_priority = null;
          }
          etl_job_def["job_priority"] = this.formAdd.job_priority;
          etl_job_def["job_eff_flag"] = this.formAdd.job_eff_flag;
          etl_job_def["comments"] = this.formAdd.comments;
          etl_job_def["today_disp"] = this.formAdd.today_disp;
          etl_job_def["success_job"] = this.formAdd.success_job;
          etl_job_def["fail_job"] = this.formAdd.fail_job;
          etl_job_def["job_datasource"] = this.formAdd.job_datasource;
          params["etl_job_def"] = etl_job_def;
          etl_dependency["etl_job_id"] = this.formAdd.etl_job_id;
          etl_dependency["etl_sys_id"] = this.sys_id;
          etl_dependency["etl_job"] = this.formAdd.etl_job;
          etl_dependency["pre_etl_sys_id"] = this.sys_id;
          etl_dependency["status"] = this.formAdd.status;
          params["etl_dependency"] = etl_dependency;
          params["pre_etl_job_ids"] = this.formAdd.pre_etl_job_ids;
          params["old_disp_freq"] = this.tempForm.old_disp_freq;
          params["old_pre_etl_job_ids"] = this.tempForm.old_pre_etl_job_ids;
          params["old_dispatch_type"] = this.tempForm.old_dispatch_type;
          if (this.jobTitle == "添加作业") {
            this.$executeRequest
              .execPostByModuleUrl("etlMage/jobconfig/saveEtlJobDef", params)
              .then((res) => {
                if (res && res.success) {
                  this.getTable();
                  this.$Msg.customizTitle("添加成功", "success");
                  this.dialogFormVisibleAdd = false;
                  this.formAdd = {};
                }
              });
          } else if (this.jobTitle == "修改作业") {
            this.$executeRequest
              .execPostByModuleUrl("etlMage/jobconfig/updateEtlJobDef", params)
              .then((res) => {
                if (res && res.success) {
                  this.getTable();
                  this.$Msg.customizTitle("修改成功", "success");
                  this.dialogFormVisibleAdd = false;
                  this.formAdd = {};
                }
              });
          }
        }
      });
    },
    //分页方法
    handleCurrentChange(cpage) {
      this.pagination.pageNum = cpage;
      this.getTable();
    },
    handleSizeChange(psize) {
      this.pagination.pageSize = psize;
      this.getTable();
    },
    //文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$Msg.customizTitle("只能选择一个文件", "warning");
    },
    // 获取上传的文件详情
    handleChange(file, fileList) {
      this.fileList = fileList;
      if (fileList.length != 0) {
        this.dialogImportData = true;
      } else {
        this.dialogImportData = false;
      }
      arr = fileList;
    },
    // 取消数据导入
    importDatacancel() {
      this.dialogImportData = false;
      this.fileList = [];
      // this.$Msg.customizTitle("已取消导入数据", "info");
    },
    //导入数据按钮
    importData() {
      if (arr.length > 0) {
        this.loadingUpload = true;
        let param = new FormData(); // 创建form对象
        for (let i = 0; i < arr.length; i++) {
          param.append("file", arr[i].raw);
        }
        param.append("table_name", "etl_job_def");
        this.$executeRequest
          .execUploadFileByModuleUrl("etlMage/jobconfig/uploadExcelFile", param)
          .then((res) => {
            if (res && res.success) {
              this.$Msg.customizTitle("导入数据成功", "success");
              this.getTable();
              this.fileList = [];
              this.dialogImportData = false;
              this.loadingUpload = false;
            } else {
              this.loadingUpload = false;
            }
          });
      } else {
        this.$Msg.customizTitle("请选择上传文件", "warning");
      }
    },
    //下载按钮
    downloadModel() {
      let that = this;
      this.$executeRequest
        .execGetByModuleUrl("etlMage/jobconfig/generateExcel", {
          etl_sys_id: that.$route.query.etl_sys_id,
          tableName: "etl_job_def",
        })
        .then((res) => {
          if (res && res.success) {
            that.downloadFile(res.data);
          }
        });
    },
    //勾选
    handleMultipleMethod(val) {
      this.multipleSelection = val;
    },
    // 下载模板表格
    downloadFile(val) {
      this.$executeRequest
        .execDownloadFileByModuleUrl("etlMage/jobconfig/downloadFile", {
          fileName: val,
        })
        .then((res) => {
          this.filename = val;
          this.$file.fileDownload(res, val);
        });
    },
    // 获取点击作业程序参数下拉值
    clickData(val) {
      // 赋值
      if (this.formAdd.pro_para.length < 1) {
        this.formAdd.pro_para = val;
      } else if (
        this.formAdd.pro_para == "@" &&
        this.formAdd.pro_para.length == 1
      ) {
        this.formAdd.pro_para = val;
      } else {
        this.formAdd.pro_para += val;
      }
      this.showHiddenOr = false;
    },
    // 获取键盘监听事件
    keyCodeForEventup(e) {
      let self = this;
      if (e.shiftKey == 0 && e.key == "2") {
        self.showHiddenOr = true;
      }
    },
    keyCodeForEventdown(e) {
      let self = this;
      if (
        (e.shiftKey == 1 && e.key == "Process") ||
        (e.shiftKey == 1 && e.key == "@")
      ) {
        self.showHiddenOr = true;
      }
    },
    // 作业程序参数聚焦
    focusMenthods() {
      window.addEventListener("keyup", this.keyCodeForEventup);
      window.addEventListener("keydown", this.keyCodeForEventdown);
    },
    // 作业程序参数失焦
    blurMenthods() {
      window.removeEventListener("keyup", this.keyCodeForEventup);
      window.removeEventListener("keydown", this.keyCodeForEventdown);
    },
    // 关闭参数选择栏
    closeShow() {
      this.showHiddenOr = false;
    },
    // 调度触发方式控制依赖是否有效
    changeValue() {
      if (this.formAdd.disp_type == "D") {
        this.formAdd.status = "T";
      } else {
        this.formAdd.status = "";
      }
    },
    gotoWorkRely(val) {
      //根据作业名称跳转作业依赖
      this.$router.push({
        name: "etlDependency",
        query: {
          name: "/etlDependency",
          dec: this.$Base64.encode("作业依赖"),
          etl_sys_name: this.$route.query.etl_sys_name,
          etl_sys_cd: this.$route.query.etl_sys_cd,
          etl_sys_id: this.$route.query.etl_sys_id,
          etl_job_id: val,
        },
      });
      this.$emit("viewIn", "/etlDependency", "作业依赖");
    },
    gotoWorkRely1() {
      //根据删除按钮弹框中的作业依赖按钮跳转
      this.$router.push({
        name: "etlDependency",
        query: {
          name: "/etlDependency",
          dec: this.$Base64.encode("作业依赖"),
          etl_sys_name: this.$route.query.etl_sys_name,
          etl_sys_cd: this.$route.query.etl_sys_cd,
          etl_sys_id: this.$route.query.etl_sys_id,
          etl_job_id: this.etl_job_id,
        },
      });
      this.$emit("viewIn", "/etlDependency", "作业依赖");
    },
    gotoWorkRely2() {
      //根据作业名称跳转作业依赖
      var arr = [];
      this.multipleSelection.forEach((item) => {
        arr.push(item.etl_job);
      });
      this.$router.push({
        name: "etlDependency",
        query: {
          name: "/etlJobDef",
          etl_sys_name: this.$route.query.etl_sys_name,
          etl_sys_id: this.$route.query.etl_sys_id,
          etl_job: JSON.stringify(arr),
        },
      });
      this.$emit("viewIn", "/etlDependency", "作业依赖");
    },
    gotoJobResource() {
      //根据作业名称跳转作业依赖配置页面
      this.$router.push({
        name: "resourcesUsage",
        query: {
          name: "/resourcesUsage",
          dec: this.$Base64.encode("作业资源分配"),
          etl_job: this.etl_job,
          // etl_job_id:this.etl_job_id,
        },
      });
      this.$emit("viewIn", "/resourcesUsage", "作业资源分配");
    },
    gotoJobResource1() {
      //根据删除按钮弹窗作业资源进行跳转
      var arr = [];
      this.multipleSelection.forEach((item) => {
        arr.push(item.etl_job);
      });
      this.$router.push({
        name: "resourcesUsage",
        query: {
          name: "etlJobDef",
          dec: this.$Base64.encode("作业资源分配"),
          etl_job: JSON.stringify(arr),
        },
      });
      this.$emit("viewIn", "/resourcesUsage", "作业资源分配");
    },
    gotoWorkId() {
      // 返回任务页面
      this.$router.push({
        name: "menus",
        query: {
          name: "/subSystem",
          dec: this.$Base64.encode("任务"),
          etl_sys_name: this.$route.query.etl_sys_name,
          etl_sys_cd: this.$route.query.etl_sys_cd,
        },
      });
      this.$emit("viewIn", "/subSystem", "任务");
    },
  },
};
</script>

<style scoped>
.tabBtns {
  margin-top: 15px;
}

.button {
  float: right;
}
.el-col {
  margin-bottom: -20px;
}

.buttonStyle {
  display: block;
  float: left;
  margin-right: 10px;
  margin-left: 0px;
}

.subSystemdiv {
  float: right;
  margin-bottom: 14px;
}

.demo-form-inlines {
  height: 75px;
}

.searchBtn {
  margin-left: 10px;
}

.etljob >>> .el-select__tags {
  white-space: nowrap;
  overflow: hidden;
}

.workProgramms {
  width: 194px;
  height: 20px;
  font-size: 16px;
  cursor: pointer;
  padding-left: 8px;
}

.workProgramms:hover {
  color: #409eff;
}

.text-overflow {
  display: block;
  word-break: keep-all;
  /* 不换行 */
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
}

.workProgrammsDiv {
  padding: 4px;
  position: absolute;
  z-index: 10000;
  background: #fff;
  left: 150px;
  top: 40px;
  border-radius: 6px;
  border: 1px solid #e6e6e6;
  border-top: none;
  columns: black;
}

.workProgrammsDivFather {
  position: relative;
}

.workProgrammsDivSpan {
  padding-left: 4px;
  display: block;
  height: 20px;
  line-height: 20px;
  font-size: 16px;
  border-bottom: 1px solid #e6e6e6;
}

.close {
  cursor: pointer;
  float: right;
}
</style>
<style>
.el-autocomplete-suggestion li {
  overflow: visible;
  /* text-overflow: ellipsis; */
}
</style>
