<template>
<div>
  <div class="title">
    <by-header-slice :title="'系统批量情况'"></by-header-slice>
  </div>
<!--    <div class="title">系统批量情况</div>-->
    <div>
      <ByTableIcon v-if="tableData.length !== 0" :table-data="tableData" :column-arr="tbaleColumn" @operateItem="operateHandler"></ByTableIcon>
      <ByEmpty v-else></ByEmpty>
    </div>
<!--    <el-table size="medium" ref="multipleTable" :data="tableData" tooltip-effect="dark" stripe border style="width: 100%">-->
<!--        <el-table-column prop="etl_sys_cd" label="工程编号" align='center' width="120">-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="curr_bath_date" label="批量日期" align='center' width="150">-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="pending_num" show-overflow-tooltip label="挂起" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="waiting_num" show-overflow-tooltip label="等待" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="running_num" show-overflow-tooltip label="运行" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="done_num" show-overflow-tooltip label="完成" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="alarm_num" show-overflow-tooltip label="预警" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="error_num" show-overflow-tooltip label="错误" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="stop_num" show-overflow-tooltip label="停止" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="操作" align='center' width="150">-->
<!--            <template slot-scope="scope">-->
<!--                <i class="el-icon-video-pause ls handeler" title="暂停" @click="handlePause(scope.$index, scope.row)"></i>-->
<!--                <i class="el-icon-caret-right ls handeler" title="续跑" @click="handlePlay(scope.$index, scope.row)"></i>-->
<!--                <i class="el-icon-refresh ls handeler" title="重跑" @click="handleRefresh(scope.$index, scope.row)"></i>-->
<!--                <i class="el-icon-d-arrow-right ls handeler" title="日切" @click="handleNext(scope.$index, scope.row)"></i>-->
<!--                <i class="el-icon-circle-close ls handeler" title="停止" @click="handleStop(scope.$index, scope.row)"></i>-->
<!--            </template>-->
<!--        </el-table-column>-->
<!--    </el-table>-->
    <div class="titles">
      <by-header-slice :title="'当前干预情况'"></by-header-slice>
    </div>
  <div>
    <ByTable v-if="tableData1.length !== 0" :table-data="tableData1" :column-arr="tbaleColumn1"></ByTable>
    <by-empty v-else></by-empty>
  </div>
<!--  <el-table size="medium" ref="multipleTable" :data="tableData1" tooltip-effect="dark" stripe border style="width: 100%">-->
<!--        <el-table-column prop="event_id" label="事件号" align='center' width="160">-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="etl_sys_cd" label="工程编号" align='center' show-overflow-tooltip>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="etl_job" label="作业名称" align='center' show-overflow-tooltip>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="types" label="干预类型" show-overflow-tooltip align='center' width="120">-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="pro_para" label="作业程序参数" align='center' show-overflow-tooltip>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="status" label="状态" align='center' show-overflow-tooltip>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="st_time" label="接收时间" align='center' width="160">-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="warning" show-overflow-tooltip label="提示信息" align='center' width="80">-->
<!--        </el-table-column>-->
<!--    </el-table>-->
    <div class="titles">
      <by-header-slice :title="'历史干预情况'"></by-header-slice>
    </div>
  <div>
    <ByTable v-if="tableData2.length !== 0" :table-data="tableData2" :column-arr="tbaleColumn2"  :pagination="pagination"  @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" ></ByTable>
    <by-empty v-else></by-empty>
  </div>

<!--  <el-table size="medium" ref="multipleTable" :data="tableData2" tooltip-effect="dark" stripe border style="width: 100%">-->
<!--        <el-table-column prop="event_id" label="事件号" align='center' width="160">-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="etl_sys_cd" label="工程编号" align='center' show-overflow-tooltip>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="etl_job" label="作业名称" align='center' show-overflow-tooltip>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="types" show-overflow-tooltip label="干预类型" align='center'>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="pro_para" label="作业程序参数" align='center' show-overflow-tooltip>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="status" label="状态" align='center' show-overflow-tooltip>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="st_time" label="接收时间" align='center' width="160">-->
<!--        </el-table-column>-->
<!--    </el-table>-->
<!--    <el-row :gutter="20" class="tabBtns">-->
<!--        <el-pagination layout="total, sizes,prev, pager, next, jumper" style="float:right" :page-sizes="[5,10,20,25,50,100,1000]"  :page-size="pagesize" :total="pageLength" @current-change="handleCurrentChange" @size-change="handleSizeChange">-->
<!--        </el-pagination>-->
<!--    </el-row>-->
    <!-- 暂停模态框 -->
  <ByModel :model-title="'确定执行该暂停操作?'" :visible.sync="dialogVisiblePause" :model-width="'20%'" @close="dialogVisiblePause = false">
    <div slot="modalFoot">
      <el-button @click="dialogVisiblePause = false" >否</el-button>
      <el-button type="primary" @click="savePause" >是</el-button>
    </div>
  </ByModel>
<!--    <el-dialog title="确定执行该操作?" :visible.sync="dialogVisiblePause" width="20%">-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialogVisiblePause = false" size="mini" type="danger">否</el-button>-->
<!--            <el-button type="primary" @click="savePause" size="mini">是</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->
    <!-- 续跑模态框 -->
  <ByModel :model-title="'确定执行该续跑操作?'" :visible.sync="dialogVisiblePlay" :model-width="'20%'" @close="dialogVisiblePlay = false">
    <div slot="modalFoot">
      <el-button @click="dialogVisiblePlay = false" >否</el-button>
      <el-button type="primary" @click="savePlay" >是</el-button>
    </div>
  </ByModel>
<!--    <el-dialog title="确定执行该操作?" :visible.sync="dialogVisiblePlay" width="20%">-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialogVisiblePlay = false" size="mini" type="danger">否</el-button>-->
<!--            <el-button type="primary" @click="savePlay" size="mini">是</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->
    <!-- 重跑模态框 -->
  <ByModel :model-title="'确定执行该重跑操作?'" :visible.sync="dialogVisibleRefresh" :model-width="'20%'" @close="dialogVisibleRefresh = false">
    <div  slot="modalFoot">
      <el-button @click="dialogVisibleRefresh = false" >否</el-button>
      <el-button type="primary" @click="saveRefresh" >是</el-button>
    </div>
  </ByModel>
<!--  <el-dialog title="确定执行该操作?" :visible.sync="dialogVisibleRefresh" width="20%">-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialogVisibleRefresh = false" size="mini" type="danger">否</el-button>-->
<!--            <el-button type="primary" @click="saveRefresh" size="mini">是</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->
    <!-- 日切模态框 -->
  <ByModel :model-title="'确定执行该日切操作?'" :visible.sync="dialogVisibleNext" :model-width="'20%'" @close="dialogVisibleNext = false">
    <div slot="modalFoot">
      <el-button @click="dialogVisibleNext = false">否</el-button>
      <el-button type="primary" @click="saveNext" >是</el-button>
    </div>
  </ByModel>
<!--  <el-dialog title="确定执行该操作?" :visible.sync="dialogVisibleNext" width="20%">-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialogVisibleNext = false" size="mini" type="danger">否</el-button>-->
<!--            <el-button type="primary" @click="saveNext" size="mini">是</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->
    <!-- 停止模态框 -->
  <ByModel :model-title="'确定执行该停止操作?'" :visible.sync="dialogVisibleStop" :model-width="'20%'" @close="dialogVisibleStop = false">
    <div slot="modalFoot">
      <el-button @click="dialogVisibleStop = false" >否</el-button>
      <el-button type="primary" @click="saveStop" >是</el-button>
    </div>
  </ByModel>
<!--  <el-dialog title="确定执行该操作?" :visible.sync="dialogVisibleStop" width="20%">-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button @click="dialogVisibleStop = false" size="mini" type="danger">否</el-button>-->
<!--            <el-button type="primary" @click="saveStop" size="mini">是</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->
</div>
</template>

<script>
import ByHeaderSlice from "@/components/global/ByHeaderSlice.vue";
import ByTable from "@/components/global/ByTable.vue";
import {tbaleColumn, tbaleColumn1, tbaleColumn2} from "./mock";
import ByEmpty from "@/components/global/ByEmpty.vue";
import ByModel from "@/components/global/ByModel.vue";
import ByTableIcon from "@/components/global/ByTableIcon.vue";

export default {
  components: {ByTableIcon, ByModel, ByEmpty, ByTable, ByHeaderSlice},
    data() {
        return {
          tbaleColumn1,
          tbaleColumn2,
          tbaleColumn,
            etl_sys_id: null,
            sys_cd: '',
            codes: [],
            batchDate: '',
            tableData: [],
            tableData1: [],
            tableData2: [],
            dialogVisiblePause: false,
            dialogVisiblePlay: false,
            dialogVisibleRefresh: false,
            dialogVisibleNext: false,
            dialogVisibleStop: false,
            // pagesize: 5,
            // currpage: 1,
            // pageLength: 0,
          pagination: {
            total: 5,
            pageNum: 1,
            pageSize: 10,
            pageSizes: [10, 20, 50, 100],
          },
            meddletype: [],
            jobStatued: [],
        };
    },
    mounted() {
        this.etl_sys_id = this.$route.query.etl_sys_id;
        this.getCodeItems("Meddle_type");
        this.getCodeItems("Job_Status");
        this.getSystemInfo();
        this.getCurrInfo();
        this.getHistoryInfo();
        this.getCode();
    },
    methods: {
        //操作按钮的代码值
        getCode() {
            let params = {};
            let arr = [];
            params["category"] = "Meddle_type";
            this.$Code.getCategoryItems(params).then(res => {
                this.codes = res.data;
            });
        },
      operateHandler(operation,index,row){
        debugger
          if (operation === 'handlePause'){
          //   暂停
            this.handlePause(row);
          }else if(operation === 'handlePlay'){
          //   续跑
            this.handlePlay(row);
          }else if(operation === 'handleRefresh'){
            //   重跑
            this.handleRefresh(row);
          }else if(operation === 'handleNext'){
            //   日切
            this.handleNext(row);
          }else if(operation === 'handleStop'){
            //   停止
            this.handleStop(row);
          }
      },
        //系统批量情况
        getSystemInfo() {
            // let params = {};
            // params["etl_sys_cd"] = this.sys_cd;
            this.sys_cd = sessionStorage.getItem('sys_cd');
            let arr = [];
            var params = {
                etl_sys_id:this.etl_sys_id
            }
            this.$executeRequest.execGetByModuleUrl('etlMage/syslevelintervention/searchSystemBatchConditions',params).then(res => {
                this.batchDate = res.data.curr_bath_date;
                arr = res.data.etlJobCurrList;
                arr.forEach((item) => {
                    item.etl_sys_cd = this.sys_cd;
                    item.curr_bath_date = this.$dateconversion.dateFormat(res.data.curr_bath_date);
                });
                this.tableData = arr;
            });
        },
        //当前干预情况
        getCurrInfo() {
            // let params = {};
            // params["etl_sys_cd"] = this.sys_cd;
            var params = {
                etl_sys_id: this.etl_sys_id
            };
            this.$executeRequest.execGetByModuleUrl('etlMage/syslevelintervention/searchSysLevelCurrInterventionInfo',params).then(res => {
                let dates = res.data;
                dates.forEach((item) => {
                    //干预类型
                    this.meddletype.forEach(val => {
                        if (item.etl_hand_type == val.code) {
                            item.types = val.value
                        }
                    });
                    //状态
                    this.jobStatued.forEach(value => {
                        if (item.hand_status == value.code) {
                            item.status = value.value
                        }
                    })
                });
                this.tableData1 = dates;
            });
        },
        //历史干预情况
        getHistoryInfo() {
            // let params = {};
            // params["etl_sys_cd"] = this.sys_cd;
            // params["currPage"] = this.currpage;
            // params["pageSize"] = this.pagesize;
            var params = {
                etl_sys_id: this.etl_sys_id,
                currPage: this.pagination.pageNum,
                pageSize: this.pagination.pageSize
            };
            this.$executeRequest.execGetByModuleUrl('etlMage/syslevelintervention/searchSysLeverHisInterventionByPage',params).then(res => {
                let dates = res.data.handHisList;
                this.pagination.total = res.data.totalSize;
                dates.forEach((item) => {
                    //干预类型
                    this.meddletype.forEach(val => {
                        if (item.etl_hand_type == val.code) {
                            item.types = val.value
                        }
                    });
                    //状态
                    this.jobStatued.forEach(value => {
                        if (item.hand_status == value.code) {
                            item.status = value.value
                        }
                    })
                });
                this.tableData2 = dates;
            });
        },
        //暂停按钮
        handlePause() {
            this.dialogVisiblePause = true;
        },
        //续跑按钮
        handlePlay() {
            this.dialogVisiblePlay = true;
        },
        //重跑按钮
        handleRefresh() {
            this.dialogVisibleRefresh = true;
        },
        //日切按钮
        handleNext() {
            this.dialogVisibleNext = true;
        },
        //停止按钮
        handleStop() {
            this.dialogVisibleStop = true;
        },
        // 获取代码项
        getCodeItems(val) {
            if (val == "Meddle_type") {
              this.$Code.getCategoryItems({category: 'Meddle_type'}).then(res => {
                    this.meddletype = res.data;
                })
            } else if (val == "Job_Status") {
              this.$Code.getCategoryItems({category: 'Job_Status'}).then(res => {
                    this.jobStatued = res.data;
                })
            }
        },
        //暂停保存按钮
        savePause() {
            let code = 'SP';
            // let params = {};
            // params["etl_sys_cd"] = this.sys_cd;
            // params["etl_hand_type"] = code;
            // params["curr_bath_date"] = this.batchDate;
            var params = {
                etl_sys_id: this.etl_sys_id,
                etl_hand_type: code,
                curr_bath_date: this.batchDate
            };
            this.$executeRequest.execGetByModuleUrl('etlMage/syslevelintervention/sysLevelInterventionOperate',params).then(res => {
                if (res && res.success) {
                    this.getSystemInfo();
                    this.getCurrInfo();
                    this.getHistoryInfo();
                    this.$Msg.customizTitle("系统级暂停成功！", "success");
                    this.dialogVisiblePause = false;
                }
            });
        },
        //续跑保存按钮
        savePlay() {
            let code = 'SR';
            // let params = {};
            // params["etl_sys_cd"] = this.sys_cd;
            // params["etl_hand_type"] = code;
            // params["curr_bath_date"] = this.batchDate;
            var params = {
                etl_sys_id: this.etl_sys_id,
                etl_hand_type: code,
                curr_bath_date: this.batchDate
            };
            this.$executeRequest.execGetByModuleUrl('etlMage/syslevelintervention/sysLevelInterventionOperate',params).then(res => {
                if (res && res.success) {
                    this.getSystemInfo();
                    this.getCurrInfo();
                    this.getHistoryInfo();
                    this.$Msg.customizTitle("系统级续跑成功！", "success");
                    this.dialogVisiblePlay = false;
                }
            });
        },
        //重跑保存按钮
        saveRefresh() {
            let code = 'SO';
            // let params = {};
            // params["etl_sys_cd"] = this.sys_cd;
            // params["etl_hand_type"] = code;
            // params["curr_bath_date"] = this.batchDate;
            var params = {
                etl_sys_id: this.etl_sys_id,
                etl_hand_type: code,
                curr_bath_date: this.batchDate
            };
            this.$executeRequest.execGetByModuleUrl('etlMage/syslevelintervention/sysLevelInterventionOperate',params).then(res => {
                if (res && res.success) {
                    this.getSystemInfo();
                    this.getCurrInfo();
                    this.getHistoryInfo();
                    this.$Msg.customizTitle("系统级重跑成功！", "success");
                    this.dialogVisibleRefresh = false;
                }
            });
        },
        //日切保存按钮
        saveNext() {
            let code = 'SF';
            // let params = {};
            // params["etl_sys_cd"] = this.sys_cd;
            // params["etl_hand_type"] = code;
            // params["curr_bath_date"] = this.batchDate;
            var params = {
                etl_sys_id: this.etl_sys_id,
                etl_hand_type: code,
                curr_bath_date: this.batchDate
            };
            this.$executeRequest.execGetByModuleUrl('etlMage/syslevelintervention/sysLevelInterventionOperate',params).then(res => {
                if (res && res.success) {
                    this.getSystemInfo();
                    this.getCurrInfo();
                    this.getHistoryInfo();
                    this.$Msg.customizTitle("系统日切成功！", "success");
                    this.dialogVisibleNext = false;
                }
            });
        },
        //停止保存按钮
        saveStop() {
            let code = 'SS';
            // let params = {};
            // params["etl_sys_cd"] = this.sys_cd;
            // params["etl_hand_type"] = code;
            // params["curr_bath_date"] = this.batchDate;
            var params = {
                etl_sys_id: this.etl_sys_id,
                etl_hand_type: code,
                curr_bath_date: this.batchDate
            };
            this.$executeRequest.execGetByModuleUrl('etlMage/syslevelintervention/sysLevelInterventionOperate',params).then(res => {
                if (res && res.success) {
                    this.getSystemInfo();
                    this.getCurrInfo();
                    this.getHistoryInfo();
                    this.$Msg.customizTitle("系统停止成功！", "success");
                    this.dialogVisibleStop = false;
                }
            });
        },
        //分页方法
        handleCurrentChange(cpage) {
            this.pagination.pageNum = cpage;
            this.getHistoryInfo();
        },
        handleSizeChange(psize) {
            this.pagination.pageSize = psize;
            this.getHistoryInfo();
        },
    },
};
</script>

<style scoped>
.title {
    font-size: 16px;
    margin-bottom: 10px;
}

.titles {
    font-size: 16px;
    margin-top: 15px;
    margin-bottom: 10px;
}

.ls {
    margin-right: 5px;
}

.tabBtns {
    margin-top: 15px;
}

.handeler {
    cursor: pointer;
}
</style>
