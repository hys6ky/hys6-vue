<template>
  <div>
    <ByTable :table-data="form.tableData" :column-arr="columnArr"></ByTable>
    <!--    <el-form ref="form" :model="form">-->
    <!--        <el-table :data="form.tableData" size="medium" border style="height: 115px">-->
    <!--            <el-table-column prop="etl_sys_cd" label="工程编号" align='center'>-->
    <!--                <template slot-scope="scope">-->
    <!--                    <el-form-item>-->
    <!--                        <el-input style="width: auto;" v-model="scope.row.etl_sys_cd" disabled></el-input>-->
    <!--                    </el-form-item>-->
    <!--                </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column prop="start_number" label="作业失败重试次数" align='center'>-->
    <!--                <template slot-scope="scope">-->
    <!--                    <el-form-item>-->
    <!--                        <el-input style="width: 50%;" v-model="scope.row.start_number"></el-input>-->
    <!--                    </el-form-item>-->
    <!--                </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column prop="start_interval" label="作业失败重试间隔(单位为秒)" align='center'>-->
    <!--                <template slot-scope="scope">-->
    <!--                    <el-form-item>-->
    <!--                        <el-input size="meduim" style="text-align: center;width: 50%;height: auto;"-->
    <!--                            v-model="scope.row.start_interval">-->
    <!--                        </el-input>-->
    <!--                        <el-tooltip class="item" effect="dark"-->
    <!--                            content="关于作业执行失败后自动重试的处理方式: 当工程中所有作业都执行结束后，对执行失败的作业进行自动重试，其重试次数为XX，且间隔XX秒开始启动重试"-->
    <!--                            placement="right">-->
    <!--                            <i class="fa fa-question-circle" aria-hidden="true"-->
    <!--                                style="margin-left: margin-top:12px;"></i>-->
    <!--                        </el-tooltip>-->
    <!--                    </el-form-item>-->
    <!--                </template>-->
    <!--            </el-table-column>-->
    <!--            <el-table-column prop="eer_remark" label="备注" align='center'>-->
    <!--                <template slot-scope="scope">-->
    <!--                    <el-form-item>-->
    <!--                        <el-input type="textarea" size="meduim" style="text-align: center;"-->
    <!--                            v-model="scope.row.eer_remark">-->
    <!--                        </el-input>-->
    <!--                    </el-form-item>-->
    <!--                </template>-->
    <!--            </el-table-column>-->
    <!--        </el-table>-->
    <div style="float: right">
      <el-button
        size="meduim"
        type="primary"
        @click="saveEtlErrorResource('form')"
        class="saveBtn"
        >保存
      </el-button>
    </div>
  </div>
  <!--    </el-form>-->
</template>

<script>
import ByTable from "@/components/global/ByTable.vue";
import ByModelForm from "@/components/global/ByModelForm.vue";
import { columnArr } from "./mock";

let arr = [];
export default {
  components: { ByModelForm, ByTable },
  data() {
    return {
      columnArr,
      etl_sys_id: null,
      form: {
        tableData: [
          {
            etl_sys_id: null,
            etl_sys_cd: "",
            start_number: "0",
            start_interval: "0",
            eer_remark: "",
          },
        ],
      },
    };
  },
  created() {
    this.etl_sys_id = this.$route.query.etl_sys_id;
    this.form.tableData[0].etl_sys_cd = this.$route.query.etl_sys_cd;
    this.form.tableData[0].etl_sys_id = this.$route.query.etl_sys_id;
    this.searchEtlErrorResource();
  },
  methods: {
    saveEtlErrorResource(formName) {
      // this.$refs[formName].validate(valid => {
      //     if (valid) {
      // let params = {};
      // params["etl_sys_cd"] = this.$route.query.etl_sys_cd;
      // params["start_number"] = this.form.tableData[0].start_number;
      // params["start_interval"] = this.form.tableData[0].start_interval;
      // params["eer_remark"] = this.form.tableData[0].eer_remark;
      var params = {
        etl_sys_id: this.$route.query.etl_sys_id,
        etl_sys_cd: this.$route.query.etl_sys_cd,
        start_number: this.form.tableData[0].start_number,
        start_interval: this.form.tableData[0].start_interval,
        eer_remark: this.form.tableData[0].eer_remark,
      };
      this.$executeRequest
        .execGetByModuleUrl("etlMage/jobconfig/saveEtlErrorResource", params)
        .then((res) => {
          if (res && res.success) {
            this.$Msg.customizTitle("保存成功", "success");
            this.searchEtlErrorResource();
          }
        });
      //     }
      // })
    },
    searchEtlErrorResource() {
      var data = { etl_sys_id: this.etl_sys_id };
      this.$executeRequest
        .execGetByModuleUrl("etlMage/jobconfig/searchEtlErrorResource", data)
        .then((res) => {
          if (res && res.data) {
            for (var i = 0; i < res.data.length; i++) {
              this.form.tableData[i].etl_sys_id = res.data[i].etl_sys_id;
              this.form.tableData[i].start_number = res.data[i].start_number;
              this.form.tableData[i].start_interval =
                res.data[i].start_interval;
              this.form.tableData[i].eer_remark = res.data[i].eer_remark;
            }
          }
        });
    },
  },
};
</script>

<style scoped lang="less">
.el-input {
  width: 330px;
  margin-bottom: 12px;
}
.saveBtn {
  min-width: 80px;
  height: 32px;
  padding: 8px 25px;
  font-family: @hansan;
}
.tabBtns {
  margin-top: 15px;
}

.buttonStyle {
  display: block;
  float: left;
  margin-right: 10px;
  margin-left: 0px;
}

.subSystemdiv {
  float: right;
}

.subSystemdiv2 {
  float: left;
}

.buttonStyle {
  display: block;
  float: right;
  margin-top: 15px;
  margin-right: 10px;
  margin-left: 0px;
}
</style>
