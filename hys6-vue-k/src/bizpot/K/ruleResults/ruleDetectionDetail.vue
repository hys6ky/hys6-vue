<template>
  <div id="ruleDetectionDetail">
    <el-row class="topTitle">
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <ByHeaderSlice title="规则检测详细信息"></ByHeaderSlice>
        <el-button
          style="height: 32px; padding: 0 14px; margin-right: 20px"
          type="primary"
          @click="ret"
          >返 回</el-button
        >
      </div>
    </el-row>

    <el-row style="margin: 0 60px; margin-bottom: 10px">
      <el-row>
        <el-row>
          <ByHeaderSlice title="规则检测信息"></ByHeaderSlice></el-row>
        <ByModelForm :form-data="form_dq_result" :form-items="ruleDeteItem" :form-config="rulesDeteFormConfig"  ></ByModelForm>
<!--        <el-form-->
<!--          style="margin-top: 20px"-->
<!--          v-model="form_dq_result"-->
<!--          :inline="true"-->
<!--          size="mini"-->
<!--          label-position="right"-->
<!--          title="规则检测详细信息"-->
<!--          label-width="110px-->
<!--          "-->
<!--        >-->
<!--          <el-row>-->
<!--            <el-col :span="6" :offset="2">-->
<!--              <el-form-item label="任务编号 :" prop="task_id">-->
<!--                <el-input v-model="form_dq_result.task_id" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="6" :offset="1">-->
<!--              <el-form-item label="规则编号 :" prop="reg_name">-->
<!--                <el-input v-model="form_dq_result.reg_num" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="6" :offset="1">-->
<!--              <el-form-item label="规则类型 :" prop="case_type">-->
<!--                <el-input v-model="form_dq_result.case_type_txt" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="6" :offset="2">-->
<!--              <el-form-item label="执行方式 :" prop="exec_mode">-->
<!--                <el-input v-model="form_dq_result.exec_mode_txt" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="6" :offset="1">-->
<!--              <el-form-item label="检查日期 :" prop="verify_date">-->
<!--                <el-input v-model="form_dq_result.verify_date" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="6" :offset="1">-->
<!--              <el-form-item label="检测表名 :" prop="target_tab">-->
<!--                <el-input v-model="form_dq_result.target_tab" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="6" :offset="2">-->
<!--              <el-form-item label="检测字段 :" prop="target_key_fields">-->
<!--                <el-input v-model="form_dq_result.target_key_fields" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="6" :offset="1">-->
<!--              <el-form-item-->
<!--                label="检测结果 :"-->
<!--                prop="verify_result                                                                                                                                                                                                      "-->
<!--              >-->
<!--                <el-input v-model="form_dq_result.verify_result_txt" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="6" :offset="2">-->
<!--              <el-form-item label="开始时间 :" prop="start_date_time">-->
<!--                <el-input v-model="form_dq_result.start_date_time" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="6" :offset="1">-->
<!--              <el-form-item label="结束时间 :" prop="end_date">-->
<!--                <el-input v-model="form_dq_result.end_date_time" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="6" :offset="1">-->
<!--              <el-form-item label="执行耗时(ms) :" prop="elapsed_ms">-->
<!--                <el-input v-model="form_dq_result.elapsed_ms" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="6" :offset="2">-->
<!--              <el-form-item label="指标结果1 :" prop="check_index1">-->
<!--                <el-input v-model="form_dq_result.check_index1" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="6" :offset="1">-->
<!--              <el-form-item label="指标结果2 :" prop="check_index2">-->
<!--                <el-input v-model="form_dq_result.check_index2" disabled />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </el-form>-->
      </el-row>

      <!--    当选中保存指标3结果时,显示指标3的结果,只取前10条数据 1:保存,0:不保存   -->
      <el-row
        style="margin-bottom: 10px"
        v-if="
          form_dq_result.is_saveindex3 === '1' && check_index3_list.length > 0
        "
      >
        <el-row>
          指标3结果
          <span>
            <el-button
              style="margin-bottom: 10px"
              type="success"
              size="small"
              class="goIndex"
              @click="exportIndicator3Results(form_dq_result.target_tab+'_'+form_dq_result.verify_date)"
              >导出指标3结果集</el-button
            >
          </span>
        </el-row>

        <el-row>
          <el-table :data="check_index3_list" border size="mini">
            <el-table-column
              v-for="(index, item) in check_index3_list[0]"
              :key="item"
              :label="item"
              :prop="item"
            >
              <!-- 数据的遍历 scope.row 就代表数据的每一个对象-->
              <template slot-scope="scope">{{
                scope.row[scope.column.property]
              }}</template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-row>

      <el-row style="margin: 20px 0">
        <ByHeaderSlice title="同规则历史执行信息"></ByHeaderSlice></el-row>

      <el-row style="margin-bottom: 10px; margin-top: 10px">
        <el-col>
          <ByTable
            :tableData="dq_result_s"
            :columnArr="historyColumnArr"
            :pagination="paginationHistory"
            @operateItem="operateHistory"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
            :height="400"
          ></ByTable>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { historyColumnArr,ruleDeteItem,rulesDeteFormConfig } from "./mock.js";
import ByModelForm from "@/components/global/ByModelForm.vue";
import {downloadPostFileAllMappingNameParams} from "@/utils/executeRequest";
export default {
  name: "ruleDetectionDetail",
  components: {ByModelForm},
  props: {
    task_id: {
      default: () => {
        return "";
      },
    },
  },

  data() {
    return {
      rulesDeteFormConfig,
      ruleDeteItem,
      historyColumnArr,
      //页面加载数据
      currPage: 1,
      pageSize: 5,
      totalSize: 0,
      //页面初始化数据
      form_dq_result: {
        task_id: 0,
        reg_num: 0,
        reg_name: "",
        case_type: "",
        exec_mode: "",
        verify_date: "",
        target_tab: "",
        target_key_fields: "",
        verify_result: "",
        start_date: "",
        start_date_time: "",
        start_time: "",
        end_date: "",
        end_time: "",
        end_date_time: "",
        elapsed_ms: "",
        is_saveindex1: "0",
        is_saveindex2: "0",
        is_saveindex3: "0",
        check_index1: "",
        check_index2: "",
        check_index3: "",
      },
      reg_num: "",
      task_ids: "",
      check_index3_list: [],
      dq_result_s: [],
      dq_rule_def_map: {
        case_type: "",
        case_type_desc: "",
      },
      exec_mode_map: {},
      paginationHistory: {
        total: 5,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      verify_result_map: {},
      //   状态
      rulesTypes: [],
      checkResultVar: [],
      executeModel: [],
    };
  },
  mounted() {
    this.rulesType();
    this.type("DqcVerifyResult");
    this.type("DqcExecMode");
    // 获取页面初始化数据
    if ("undefined" !== typeof this.task_id) {
      // this.task_id = task_id;
      //获取规则检测结果信息
      this.getDqRuleDef(this.task_id);
      this.getCheckIndex3(this.task_id);
    } else {
      this.$router.push({
        name: "ruleConfig",
      });
    }
    this.giveData();
  },

  methods: {
    giveData() {
      this.$emit("son", this.rulesTypes);
    },
    //任务类型
    type(category) {
      this.$executeRequest
        .execPostByControllerMapping("/K/code/getCategoryItems", {
          category: category,
        })
        .then((res) => {
          if (res && res.success) {
            res.data.forEach((item) => {
              item.label = item.value;
              item.value = item.code;
              item.key = item.code;
            });
          }

          if (category === "DqcVerifyResult") {
            this.checkResultVar = res.data;
            // this.checkResult(res);
          }
          if (category === "DqcExecMode") {
            this.executeModel = res.data;
            // this.execute(res);
          }
        });
    },
    // checkResult(res) {
    //   this.formItems.forEach((item) => {
    //     if (item.prop === "verify_result") {
    //       item.options = res.data;
    //     }
    //   });
    // },
    // execute(res) {
    //   this.formItems.forEach((item) => {
    //     if (item.prop === "exec_mode") {
    //       item.options = res.data;
    //     }
    //   });
    // },
    rulesType() {
      this.$executeRequest
        .execPostByControllerAllMappingName("/K/dm/ruleconfig/getDqRuleDef")
        .then((res) => {
          if (res && res.success) {
            let opt = [];
            res.data.forEach((item) => {
              opt.push({
                label: item.case_type + ":" + item.case_type_desc,
                value: item.case_type,
              });
            });
            this.rulesTypes = opt;

            // this.formItems.forEach((data) => {
            //   if (data.prop === "case_type") {
            //     data.options = opt;
            //   }
            // });
          }
        });
    },

    //返回上一级
    ret() {
      this.$emit("ret");
    },
    //获取规则类型信息
    getDqRuleDef(task_id) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dm/ruleresults/getRuleDetectDetail?task_id=" + task_id
        )
        .then((res) => {
          if (res && res.success) {
            res.data.start_date_time =
              res.data.start_date + " " + res.data.start_time;
            res.data.end_date_time =
              res.data.end_date + " " + res.data.end_time;
            console.log(res.data, "数据数据");
            this.rulesTypes.forEach((ele) => {
              if (res.data.case_type === ele.value) {
                res.data.case_type_txt = ele.label;
              }
            });
            this.executeModel.forEach((ele) => {
              if (res.data.exec_mode === ele.value) {
                res.data.exec_mode_txt = ele.label;
              }
            });

            this.checkResultVar.forEach((ele) => {
              if (res.data.verify_result === ele.value) {
                res.data.verify_result_txt = ele.label;
              }
            });

            this.reg_num = res.data.reg_num;
            this.form_dq_result = res.data;
            this.rulesExecuteHistory();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //规则执行历史信息
    rulesExecuteHistory() {
      const param = {
        reg_num: this.reg_num,
        currPage: this.currPage,
        pageSize: this.pageSize,
      };
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dm/ruleresults/getRuleExecuteHistoryInfo",
          param
        )
        .then((res) => {
          if (res && res.success) {
            debugger
            res.data.dq_result_s.map(item =>{
              this.checkResultVar.map(value => {
                if (item.verify_result === value.code){
                  item.verify_resultValue = value.label;
                }
              })
            })
            console.log(res.data.dq_result_s)
            console.log(this.checkResultVar)
            this.dq_result_s = res.data.dq_result_s;
            this.paginationHistory.total = Number(res.data.totalSize);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // //获取指标结果3的数据集
    getCheckIndex3(task_id) {
      if (task_id) {
        this.check_index3_list = [];
        this.$executeRequest
          .execPostByControllerAllMappingName(
            "/K/dm/ruleconfig/getCheckIndex3?task_id=" + task_id
          )
          .then((res) => {
            if (res.success) {
              this.check_index3_list = res.data;
            }
          });
      }
    },

    //导出指标3数据
    exportIndicator3Results(fileName) {
      if ("" !== this.task_id) {
        console.log("downloadPostFileAllMappingNameParams 导入")
        this.$executeRequest
          .downloadPostFileAllMappingNameParams(
            "/K/dm/ruleresults/exportIndicator3Results?task_id=" + this.task_id
          )
          .then((res) => {
            let filename = fileName+".csv";
            const blob = new Blob([res]);
            if (window.navigator.msSaveOrOpenBlob) {
              // 兼容IE10
              navigator.msSaveBlob(blob, filename);
            } else {
              //  chrome/firefox
              let aTag = document.createElement("a");
              // document.body.appendChild(aTag);
              aTag.download = filename;
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
          });
      }
    },
    //分页
    currentChange(val) {
      this.paginationHistory.pageNum = val;
      //调用接口
      this.getTestDatas();
    },

    sizeChange(val) {
      this.paginationHistory.pageNum = 1;
      this.paginationHistory.pageSize = val;
      //调用接口
      this.getTestDatas();
    },
    operateHistory(type, row) {
      console.log(row);
      if (type === "check") {
        if (row.task_id) {
          this.getDqRuleDef(row.task_id);
          this.getCheckIndex3(row.task_id);
        }
        this.giveData();
      }
    },
  },
};
</script>

<style scoped>
::v-deep .el-input__inner {
  padding-left: 10px;
}
::v-deep .el-form {
  margin: 20px 0;
}
</style>
