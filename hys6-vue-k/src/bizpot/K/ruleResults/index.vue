<template>
  <div class="px-20 codeManage" v-if="ruleVis">
    <!-- 查询 -->
    <ByQuickSearch :formItems="formItems" @search="search" @reset="reset" />

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
  <div class="px-20 codeManage" v-else>
    <div style="margin-top: 10px"></div>

    <rule-detection-detail
      :task_id="this.task_id"
      @ret="ret"
    ></rule-detection-detail>
  </div>
</template>

<script>
import { formItems, columnArr } from "./mock";
import ByTable from "@/components/global/ByTable.vue";
import RuleDetectionDetail from "@/bizpot/K/ruleResults/ruleDetectionDetail.vue";
export default {
  components: { RuleDetectionDetail, ByTable },
  data() {
    return {
      ruleVis: true,
      edRuleLevel: [],
      task_id: "",
      formItems,
      columnArr,
      tableData: [],
      pagination: {
        total: 5,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      searchFrom : [],
      row: null,
      rulesTypes: [],
      checkResultVar: [],
      executeModel: [],
    };
  },
  mounted() {
    this.rulesType();
    this.type("DqcVerifyResult");
    this.type("EdRuleLevel");
    this.type("DqcExecMode");
    this.getTableDatas();
  },
  methods: {
    search(val) {
      console.log(val);
      this.pagination.pageNum = '1';
      this.searchFrom = val;
      if (val) {
        this.searchResult(val);
      }
    },
    reset(val) {
      console.log(val);
    },
    operateHandler(type, row) {
      // console.log(type, row);
      if (type === "check") {
        // alert("查看按钮");
        this.task_id = row.task_id;
        this.ruleVis = !this.ruleVis;
      }
    },
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
            this.checkResult(res);
          }
          if (category === "DqcExecMode") {
            this.executeModel = res.data;
            this.execute(res);
          }
          if (category == "EdRuleLevel"){
            this.edRuleLevel = res.data;
          }
        });
    },
    checkResult(res) {
      this.formItems.forEach((item) => {
        if (item.prop === "verify_result") {
          item.options = res.data;
        }
      });
    },
    execute(res) {
      this.formItems.forEach((item) => {
        if (item.prop === "exec_mode") {
          item.options = res.data;
        }
      });
    },
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

            this.formItems.forEach((data) => {
              if (data.prop === "case_type") {
                data.options = opt;
              }
            });
          }
        });
    },

    ret() {
      this.ruleVis = !this.ruleVis;
    },
    // 批量选择
    handleMultipleMethod(val) {
      console.log(val);
    },
    //分页
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.pageNum = 1;
      if (this.searchFrom) {
        this.searchResult(this.searchFrom);
      }else {
        this.getTableDatas();
      }
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      if (this.searchFrom) {
        this.searchResult(this.searchFrom);
      }else {
        this.getTableDatas();
      }
    },

    //接口调试
    //获取table列表数据
    getTableDatas(val) {
      const params = {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        ...val,
      };
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dm/ruleresults/getRuleResultInfos",
          params
        )
        .then((res) => {
          if (res && res.success) {
            let list = res.data.rule_result_s;
            list.forEach((item) => {
              item.start_date_time = item.start_date + " " + item.start_time;
              this.checkResultVar.forEach((data) => {
                if (item.verify_result === data.value) {
                  item.verify_result_txt = data.label;
                }
              });
              this.executeModel.forEach((data) => {
                if (item.exec_mode === data.value) {
                  item.exec_mode_txt = data.label;
                }
              });

              this.edRuleLevel.forEach(ed =>{
                if(item.flags && item.flags ===  ed.value){
                  item.flags_name = ed.label;
                }
              })
            });

            this.tableData = list;
            console.log(list, "aaaaaaaaaaaaaaa");
            this.pagination.total = Number(res.data.totalSize);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //检索规则结果信息
    searchResult(val) {
      console.log(val);
      let startDate = null;
      let verifyDate = null;
      if ( val.start_date){
        startDate = val.start_date.replaceAll("-",'');
      }
      if ( val.verify_date){
        verifyDate = val.verify_date.replaceAll("-",'');
      }
      const params = {
        verify_date: verifyDate || null,
        start_date: startDate || null,
        rule_src: val.rule_src || null,
        rule_tag: val.rule_tag || null,
        reg_name: val.reg_name || null,
        reg_num: val.reg_num || null,
        exec_mode: val.exec_mode || [],
        verify_result: val.verify_result || [],
        case_type: val.case_type || [],
      };
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dm/ruleresults/searchRuleResultInfos?currPage="+this.pagination.pageNum +
            "&pageSize="+this.pagination.pageSize,
          params
        )
        .then((res) => {
          if (res && res.success) {
            let list = res.data.rule_result_s;
            list.forEach((item) => {
              item.start_date_time = item.start_date + " " + item.start_time;
              this.checkResultVar.forEach((data) => {
                if (item.verify_result === data.value) {
                  item.verify_result_txt = data.label;
                }
              });
              this.executeModel.forEach((data) => {
                if (item.exec_mode === data.value) {
                  item.exec_mode_txt = data.label;
                }
              });

              this.edRuleLevel.forEach(ed =>{
                if(item.flags && item.flags ===  ed.value){
                  item.flags_name = ed.label;
                }
              })
            });

            this.tableData = list;
            console.log(list, "aaaaaaaaaaaaaaa");
            this.pagination.total = Number(res.data.totalSize);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="less"></style>
