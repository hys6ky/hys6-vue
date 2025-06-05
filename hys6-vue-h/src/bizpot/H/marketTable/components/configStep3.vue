<template>
  <div
      class="d-flex flex-column justify-content-between"
      style="height: calc(100% - 150px)"
  >
    <ByFormGroup
        :formData="step3Form"
        :formList="step3FormList"
        :formConfig="step3FormConfig"
        class="flex-1"
    />
    <div class="d-flex justify-content-between">
      <div>
        <el-button type="primary" @click="$router.go(-1)"> 上一步</el-button>
      </div>
      <div>
        <el-button type="success" @click="producefun"> 生成作业</el-button>
        <el-button type="primary" @click="excutmartjob"> 立即执行</el-button>
      </div>
    </div>
    <ByModel
        :visible.sync="dialogProdeceJobs"
        @close="dialogProdeceJobs = false"
        modelTitle="生成作业"
        modelWidth="660px"
    >
      <ByModelForm
          :formData="prodeceJobsFormData"
          :formItems="prodeceJobsFormItems"
          :formConfig="prodeceJobsFormConfig"
      ></ByModelForm>
      <template slot="modalFoot">
        <el-button type="primary" @click="savemartjobtoetl"> 确定</el-button>
        <el-button type="danger" @click="dialogProdeceJobs = false">
          取消
        </el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import {
  step3FormList,
  step3FormConfig,
  prodeceJobsFormItems,
  prodeceJobsFormConfig,
} from "../mock";

export default {
  data() {
    return {
      step3FormList: JSON.parse(JSON.stringify(step3FormList)),
      step3FormConfig,
      datatable_id: this.$route.query.datatable_id,
      step3Form: {
        querysql: "",
        parameter: "",
        date: "",
      },
      // 生成作业弹窗
      dialogProdeceJobs: false,
      alletlsys: [],
      alletltask: [],
      prodeceJobsFormConfig,
      prodeceJobsFormItems,
      prodeceJobsFormData: {
        selectedetlsys: "",
        selectedetltask: "",
      },
    };
  },
  mounted() {
    this.gettablename();
    this.getquerysql();
  },
  watch: {
    prodeceJobsFormDataComs: {
      handler(val, oldVal) {
        if (val.selectedetlsys !== oldVal.selectedetlsys) {
          this.queryetltaskbyetlsys(val.selectedetlsys);
        }
      },
      deep: true,
    },
  },
  computed: {
    prodeceJobsFormDataComs() {
      return JSON.parse(JSON.stringify(this.prodeceJobsFormData));
    },
  },
  methods: {
    gettablename() {
      this.$executeRequest.execGetByModulName("/market/getTableName", {
        datatable_id: this.datatable_id,
      }).then((res) => {
        if (res && res.success) {
          this.step3FormList[0].title = `配置完成，表名：${res.data.datatable_en_name}`;
        }
      });
    },
    getquerysql() {
      this.$executeRequest.execGetByModulName("/market/getQuerySql", {
        datatable_id: this.datatable_id,
      }).then((res) => {
        if (res && res.success) {
          this.step3Form.querysql = this.$Secret.Decrypt(res.data);
        }
      });
    },
    producefun() {
      this.dialogProdeceJobs = true;
      this.$executeRequest.execGetByModulName("/market/queryAllEtlSys")
          .then((res) => {
            if (res && res.success) {
              const list = [];
              res.data.map((item) => {
                list.push({
                  label: item.etl_sys_name,
                  value: item.etl_sys_cd,
                });
              });
              this.prodeceJobsFormItems.map((item) => {
                if (item.prop === "selectedetlsys") {
                  item.options = list;
                }
              });
            }
          });
    },
    queryetltaskbyetlsys(val) {
      this.$executeRequest.execGetByModulName("/market/queryEtlTaskByEtlSys", {
        etl_sys_cd: val,
      }).then((res) => {
        if (res && res.success) {
          const list = [];
          res.data.map((item) => {
            // this.prodeceJobsFormData.selectedetltask = item.sub_sys_id
            list.push({
              label: item.sub_sys_desc,
              value: item.sub_sys_cd,
            });
          });
          this.prodeceJobsFormItems.map((item) => {
            if (item.prop === "selectedetltask") {
              item.options = list;
            }
          });
        }
      });
    },
    savemartjobtoetl() {
      // let param = Object.assign({}, this.prodeceJobsFormData, {
      //   datatable_id: this.datatable_id,
      //   etl_sys_id: this.prodeceJobsFormData.selectedetlsys,
      //   sub_sys_id: this.prodeceJobsFormData.selectedetltask
      // });
      this.$executeRequest.execGetByModulName("/market/generateMartJobToEtl", {
        datatable_id: this.datatable_id,
        etl_sys_cd: this.prodeceJobsFormData.selectedetlsys,
        sub_sys_cd: this.prodeceJobsFormData.selectedetltask
      }).then((res) => {
        if (res && res.success) {
          this.$Msg.customizTitle("成功!", "success");
        }
        this.dialogProdeceJobs = false;
      });
    },
    excutmartjob() {
      if (this.step3Form.date === "") {
        this.$Msg.customizTitle("日期不能为空!", "warning");
        return;
      }
      let params = {
        datatable_id: this.datatable_id,
        date: this.step3Form.date.replace(/-/g, ""),
        parameter: this.step3Form.parameter,
      };
      this.$executeRequest.execGetByModulName("/market/excutMartJob", params)
          .then((res) => {
            if (res && res.success) {
              this.$Msg.customizTitle("执行成功!", "success");
            }
          });
    },
  },
};
</script>

<style scoped>
.el-button {
  width: 100px;
  height: 32px;
  padding: 8px 0;
}
</style>
