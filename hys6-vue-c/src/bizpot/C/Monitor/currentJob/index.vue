<template>
  <div>
    <div class="title">
      <ByHeaderSlice :title="'搜索条件'"></ByHeaderSlice>
    </div>
    <ByQuickSearch
      :form-items="quickSearchItem"
      :extra-button="quickButtonItem"
      @btnClick="btnClick"
      @search="search"
    ></ByQuickSearch>
    <!--    <el-form :model="form" ref="form" class="demo-form-inline tops" :inline="true">-->
    <!--        <el-form-item label="作业名称" class="itemformel">-->
    <!--            <el-autocomplete :fetch-suggestions="querySearch" v-model="form.etl_job" placeholder="作业名称" size="mini" clearable style="width:284px" @select="handleSelect"></el-autocomplete>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item class="itemformel">-->
    <!--            <el-button type="primary" @click="search" size="mini">搜索</el-button>-->
    <!--            <el-button type="success" @click="intervene" size="mini">干预</el-button>-->
    <!--        </el-form-item>-->
    <!--    </el-form>-->
    <!--    <el-divider></el-divider>-->
    <div class="titles">
      <ByHeaderSlice :title="'作业信息'"></ByHeaderSlice>
    </div>
    <ByModelForm
      :formData="forms"
      :formItems="formItems"
      :formConfig="formConfig"
      ref="departManagementForm"
    />
    <!-- <el-form :model="forms" ref="forms" class="demo-form-inline" :inline="true" label-width="100px">
        <el-col :span="8">
            <el-form-item label="作业描述">
                <el-input v-model="forms.etl_job_desc" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="作业程序类型">
                <el-input v-model="forms.pro_type" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="调度时间位移">
                <el-input v-model="forms.disp_offset" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="作业程序参数">
                <el-input v-model="forms.pro_para" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="调度触发时间">
                <el-input v-model="forms.disp_time" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="调度频率">
                <el-input size="mini" v-model="forms.disp_freq" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="作业程序名称">
                <el-input v-model="forms.pro_name" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="当前批量日期">
                <el-input v-model="forms.curr_bath_date" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="调度触发方式">
                <el-input size="mini" v-model="forms.disp_type" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="作业程序目录">
                <el-input v-model="forms.pro_dic" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="开始时间">
                <el-input v-model="forms.curr_st_time" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="作业有效标志">
                <el-input size="mini" v-model="forms.job_eff_flag" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="日志目录">
                <el-input v-model="forms.log_dic" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="结束时间">
                <el-input v-model="forms.curr_end_time" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="当天是否调度" v-model="forms.today_disp">
                <el-input size="mini" v-model="forms.today_disp" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="备注信息">
                <el-input v-model="forms.comments" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="超时阀值">
                <el-input v-model="forms.overtime_val" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="作业调度状态">
                <el-input size="mini" v-model="forms.job_disp_status" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="主服务器同步标志" label-width="130px">
                <el-input style="width:148px;" size="mini" v-model="forms.main_serv_sync" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="超长阀值">
                <el-input v-model="forms.overlength_val" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="作业优先级">
                <el-input v-model="forms.job_priority" size="mini" disabled></el-input>
            </el-form-item>
        </el-col>
    </el-form> -->

    <ByHeaderSlice :title="'资源信息'"></ByHeaderSlice>

    <div>
      <ByTable
        v-if="tableData.length !== 0"
        :columnArr="columnArr"
        :tableData="tableData"
      />
      <ByEmpty v-else></ByEmpty>
    </div>

    <!-- <el-table ref="multipleTable" size="medium " :data="tableData" tooltip-effect="dark" stripe border style="width: 100%">
        <el-table-column prop="resource_type" label="资源类型" align='center'>
        </el-table-column>
        <el-table-column prop="resource_req" label="需求数" align='center'>
        </el-table-column>
    </el-table> -->
  </div>
</template>

<script>
import {
  formItems,
  formConfig,
  columnArr,
  modelFormConfig,
  quickSearchItem,
  quickButtonItem,
} from "./mock";
import ByHeaderSlice from "@/components/global/ByHeaderSlice.vue";
import ByModelForm from "@/components/global/ByModelForm.vue";
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import ByEmpty from "@/components/global/ByEmpty.vue";
export default {
  components: { ByEmpty, ByQuickSearch, ByModelForm, ByHeaderSlice },
  data() {
    return {
      quickButtonItem,
      modelFormConfig,
      quickSearchItem,
      etl_sys_id: null,
      formItems,
      formConfig,
      columnArr,
      sys_cd: "",
      sys_id: null,
      job_id: null,
      job: "",
      form: {
        etl_job_id: null,
        etl_job: "",
      },
      listDatas: [],
      forms: {
        etl_job_desc: "",
        pro_type: "",
        timeShift: "",
        pro_para: "",
        disp_time: "",
        disp_freq: "",
        pro_name: "",
        curr_bath_date: "",
        disp_type: "",
        pro_dic: "",
        curr_st_time: "",
        job_eff_flag: "",
        log_dic: "",
        curr_end_time: "",
        today_disp: "",
        comments: "",
        overtime_val: "",
        job_disp_status: "",
        main_serv_sync: "",
        overlength_val: "",
        job_priority: "",
        dispFreq: "",
      },
      tableData: [],
    };
  },
  mounted() {
    this.etl_sys_id = this.$route.query.etl_sys_id;
    this.etl_job_id = this.$route.query.etl_job_id;
    this.getForm();
    this.getJobName();
  },
  methods: {
    //刷新表单
    getForm() {
      if (this.$route.query.etl_sys_id) {
        this.sys_id = this.$route.query.etl_sys_id;
      } else {
        this.sys_id = sessionStorage.getItem("sys_id");
      }
      this.job_id = this.$route.query.etl_job_id;
      this.form.etl_job_id = this.job_id;
      if (this.job_id) {
        var params = {
          etl_sys_id: this.sys_id,
          etl_job_id: this.job_id,
        };
        this.monitorCurrJobInfo(params);
      }
    },
    changeMenu(val, val2) {
      this.$emit("viewIn", val, val2);
    },
    //搜索按钮
    search(val) {
      this.form = val;
      if (this.form.etl_job_id == "") {
        this.$Msg.customizTitle("请选择需要搜索的作业名称", "warning");
      } else {
        // let params = {};
        // params["etl_sys_cd"] = this.sys_cd;
        // params["etl_job"] = this.form.etl_job;
        var params = {
          etl_sys_id: this.etl_sys_id,
          etl_job_id: this.form.etl_job_id,
        };
        this.monitorCurrJobInfo(params);
      }
    },
    btnClick(prop) {
      if (prop === "intervene") {
        this.intervene();
      }
    },
    //干预按钮
    intervene() {
      // this.changeMenu('/C/Intervene/jobLevelIntervente', '作业级干预');
      this.$router.push({
        path: "/C/menus/Intervene/jobLevelIntervente",
        // path: '/jobLevelIntervente',
        query: {
          etl_sys_id: this.etl_sys_id,
          etl_job_id: this.form.etl_job_id,
          etl_job: this.form.etl_job,
          name: "/jobLevelIntervente",
          dec: this.$Base64.encode("作业级干预"),
        },
      });
    },
    // input框的历史信息
    querySearch(queryString, cb) {
      var res = this.listDatas;
      var results = queryString
        ? res.filter(this.createFilter(queryString))
        : res;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // input框的回调
    handleSelect(item) {
      this.form.etl_job = item.label;
      this.form.etl_job_id = item.id;
    },
    createFilter(queryString) {
      return (res) => {
        return res.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1;
      };
    },
    //获取作业名称/上游作业名称下拉框数据
    getJobName() {
      // let params = {};
      // params["etl_sys_cd"] = this.sys_cd;
      var params = {
        etl_sys_id: this.etl_sys_id,
      };
      let arr = [];
      let obj = {};
      this.$executeRequest
        .execGetByModuleUrl("etlMage/etlmonitor/findJobByEtlSysId", params)
        .then((res) => {
          if (res && res.data) {
            res.data.forEach((item) => {
              obj.id = item.etl_job_id;
              obj.label = item.etl_job;
              obj.value = item.etl_job_id;
              arr.push(obj);
              obj = {};
            });
            this.listDatas = arr;
            this.quickSearchItem.map((item) => {
              if ("etl_job_id" === item.prop) {
                item.options = arr;
                item.value=this.$route.query.etl_job_id;
              }
            });
          }
        });
    },
    // 获取当前作业信息
    monitorCurrJobInfo(params) {
      this.$executeRequest
        .execGetByModuleUrl("etlMage/etlmonitor/monitorCurrJobInfo", params)
        .then((res) => {
          if (res && res.data) {
            this.form.etl_job = res.data.etl_job;
            this.form.etl_job_id = res.data.etl_job_id;
            // 数据处理
            switch (res.data.disp_freq) {
              case "D":
                res.data.disp_freq = "天(D)";
                break;
              case "M":
                res.data.disp_freq = "月(M)";
                break;
              case "W":
                res.data.disp_freq = "周(W)";
                break;
              case "X":
                res.data.disp_freq = "旬(X)";
                break;
              case "Y":
                res.data.disp_freq = "年(Y)";
                break;
              case "F":
                res.data.disp_freq = "频率(F)";
                break;
            }

            switch (res.data.disp_type) {
              case "B":
                res.data.disp_type = "批前(B)";
                break;
              case "D":
                res.data.disp_type = "依赖触发(D)";
                break;
              case "T":
                res.data.disp_type = "定时T+1触发(T)";
                break;
              case "Z":
                res.data.disp_type = "定时T+0触发(Z)";
                break;
              case "A":
                res.data.disp_type = "批后(A)";
                break;
              case "F":
                res.data.disp_type = "频率(F)";
                break;
            }
            switch (res.data.job_eff_flag) {
              case "V":
                res.data.job_eff_flag = "空跑(V)";
                break;
              case "N":
                res.data.job_eff_flag = "无效(N)";
                break;
              case "Y":
                res.data.job_eff_flag = "有效(Y)";
                break;
            }

            switch (res.data.today_disp) {
              case "N":
                res.data.today_disp = "否(N)";
                break;
              case "Y":
                res.data.today_disp = "是(Y)";
                break;
            }

            switch (res.data.job_disp_status) {
              case "D":
                res.data.job_disp_status = "完成";
                break;
              case "E":
                res.data.job_disp_status = "错误";
                break;
              case "P":
                res.data.job_disp_status = "挂起";
                break;
              case "R":
                res.data.job_disp_status = "运行";
                break;
              case "S":
                res.data.job_disp_status = "停止";
                break;
              case "W":
                res.data.job_disp_status = "等待";
                break;
            }

            switch (res.data.main_serv_sync) {
              case "L":
                res.data.main_serv_sync = "锁定";
                break;
              case "N":
                res.data.main_serv_sync = "不同步";
                break;
              case "Y":
                res.data.main_serv_sync = "同步";
                break;
              case "B":
                res.data.main_serv_sync = "备份中";
                break;
            }
            if (res.data.curr_st_time != undefined) {
              if (res.data.curr_st_time.length > 0) {
                res.data.curr_st_time = this.$dateconversion.dateToMilldate(
                  res.data.curr_st_time
                );
              }
            }
            if (res.data.curr_end_time != undefined) {
              if (res.data.curr_end_time.length > 0) {
                res.data.curr_end_time = this.$dateconversion.dateToMilldate(
                  res.data.curr_end_time
                );
              }
            }
            if (res.data.curr_bath_date != undefined) {
              if (res.data.curr_bath_date.length > 0) {
                res.data.curr_bath_date = this.$dateconversion.dateFormat(
                  res.data.curr_bath_date
                );
              }
            }
            this.forms = res.data;
            let arr = [];
            let dates = res.data.resourceRelation;
            arr.push(dates);
            this.tableData = arr;
          }
        });
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 600;
}

.titles {
  margin-top: 20px;
  font-weight: 600;
}

.line {
  margin-top: 460px;
}

.lines {
  margin-top: -5px;
  margin-bottom: -5px;
}

.tips {
  margin-top: -5px;
  margin-bottom: 10px;
  font-weight: 600;
}

.tabBtns {
  margin-top: 15px;
}

.itemformel {
  margin-bottom: 0;
}
</style>
<style>
.el-autocomplete-suggestion li {
  overflow: visible;
  /* text-overflow: ellipsis; */
}
</style>
