<template>
    <div id='ruleETLStatus'>
        <el-row class='topTitle'>
            <span>规则调度状态</span>
          <el-button type="primary" size="small" class="goIndex" @click="ret">返回规则配置</el-button>
        </el-row>
        <el-row>
            <el-col>
              <ByTable :table-data="rule_etl_status_result" :column-arr="tableColumn" ></ByTable>
<!--                <el-table :data="rule_etl_status_result" border size="mini">-->
<!--                    <el-table-column type="index" prop="date" label="序号" align="center" width="80px">-->
<!--                        <template slot-scope="scope">{{scope.$index+(currPage - 1) * pageSize + 1}}</template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column prop="etl_sys_id" label="工程编号" align="center"/>-->
<!--                    <el-table-column prop="sub_sys_id" label="任务编号" align="center"/>-->
<!--                    <el-table-column prop="etl_job" label="作业名" align="center"/>-->
<!--                    <el-table-column prop="job_eff_flag" label="作业有效标志" align="center">-->
<!--                        <template slot-scope="scope">{{job_eff_flag_map[scope.row.job_eff_flag]}}</template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column prop="job_disp_status" label="作业调度状态" align="center">-->
<!--                        <template slot-scope="scope">{{job_status_flag_map[scope.row.job_disp_status]}}</template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column prop="reg_num" label="规则编号" align="center"/>-->
<!--                    <el-table-column prop="case_type" label="规则类型" align="center"/>-->
<!--                    <el-table-column prop="target_tab" label="目标表名" align="center"/>-->
<!--                </el-table>-->
            </el-col>
        </el-row>
    </div>
</template>

<script>

    import ByTable from "@/components/global/ByTable.vue";
    import  {tableColumn} from "./mock";

    export default {
        name: "ruleETLStatus",
      components: {ByTable},
        props: {
          reg_num: {
            type: String,
            default: ()=>{
              return '';
            }
          }
        },
        data() {
            return {
                //页面加载数据
                currPage: 1,
                pageSize: 10,
                totalSize: 0,
                dq_rule_def_map: {},
                job_eff_flag_map: {},
                job_status_flag_map: {},
                rule_etl_status_result: [],
                tableColumn ,
            }
        },
        created() {
            //获取规则类型信息
            this.getDqRuleDef();
            //获取代码项信息-ETl作业有效标志
            this.getJobEffectiveFlag();
            //获取代码项信息-作业调度状态
            this.getJobStatus();
        },
        mounted() {
            //获取页面初始化数据
            if ('' !== typeof this.reg_num) {
                // this.reg_num = this.reg_num;
                //获取作业调度信息列表
                this.viewRuleSchedulingStatus()
            } else {
            }
        },
        methods: {
          //返回上一级
          ret() {
            this.$emit("ret");
          },
            /* 设置每页显示条数 */
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            },
            /* 查询页面 */
            handleCurrentChange(currPage) {
                this.currPage = currPage;
            },
            /* 上一页 */
            preclickFun(currPage) {
                this.currPage = currPage;
            },
            /* 下一页 */
            nextclickFun(currPage) {
                this.currPage = currPage;
            },
            //获取规则类型信息
            getDqRuleDef() {
                this.$executeRequest.execPostByControllerAllMappingName("/K/dm/ruleconfig/getDqRuleDef").then(res =>{
                        res.data.forEach(row => {
                        this.dq_rule_def_map[row.case_type] = row.case_type_desc;
                    });
                })
            },
            //获取代码项信息-ETl作业有效标志
            getJobEffectiveFlag() {
                //获取ETl作业有效标志
                // this.$Code.getCategoryItems({
                //     'category': 'Job_Effective_Flag'
                // })
              this.$executeRequest.execPostByControllerAllMappingNameParams("/K/code/getCategoryItems",{category:'Job_Effective_Flag'})
                  .then(res => {
                    res.data.forEach(row => {
                        this.job_eff_flag_map[row.code] = row.value;
                    });
                });
            },
            //获取代码项信息-作业调度状态
            getJobStatus() {
                //获取作业调度状态
                // this.$Code.getCategoryItems({
                //     'category': 'Job_Status'
                // })
              this.$executeRequest.execPostByControllerAllMappingNameParams("/K/code/getCategoryItems",{category:'Job_Status'})
                  .then(res => {
                    res.data.forEach(row => {
                        this.job_status_flag_map[row.code] = row.value;
                    });
                });
            },
            //规则调度信息列表
            viewRuleSchedulingStatus() {
              this.$executeRequest.execPostByControllerAllMappingNameParams("/K/dm/ruleconfig/viewRuleSchedulingStatus",{'reg_num': this.reg_num}).then(res => {
                // rcFun.viewRuleSchedulingStatus({'reg_num': this.reg_num}).then(res => {
                    if (res.success) {
                      res.data.forEach( item =>{
                        item.job_eff_flag_name = this.job_eff_flag_map[item.job_eff_flag];
                        item.job_disp_status_name = this.job_status_flag_map[item.job_disp_status];
                      })
                        this.rule_etl_status_result = res.data;
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
