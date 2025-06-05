<template>
    <div class="historyBatch">
      <ByQuickSearch :form-items="quickSearchItem" :extra-button="quickButtonItem"
                     @search="search"  @btnClick="btnClick"></ByQuickSearch>
<!--        <div class="text-overflow">-->
<!--            <el-row class="elRowdate">-->
<!--                <span>当前批量日期</span>&nbsp-->
<!--                <el-date-picker size="mini" v-model="dateValue" type="date" format="yyyy-MM-dd" value-format="yyyyMMdd"-->
<!--                    placeholder="当前批量日期" style="width:150px">-->
<!--                </el-date-picker>&nbsp;&nbsp;-->
<!--                <span>任务编号或名称</span>&nbsp-->
<!--                <el-input size="mini" v-model="sub_sys_cd_name" placeholder="任务编号或名称" clearable style="width:150px">-->
<!--                </el-input>&nbsp;&nbsp;-->
<!--                <span>作业名称</span>&nbsp-->
<!--                <el-input size="mini" v-model="etl_job_value" placeholder="作业名称" clearable style="width:150px">-->
<!--                </el-input>&nbsp;&nbsp;-->
<!--                <span>作业描述</span>&nbsp-->
<!--                <el-input size="mini" v-model="etl_job_desc" placeholder="作业描述" clearable style="width:150px">-->
<!--                </el-input>&nbsp-->
<!--                <el-button type="primary" @click="search" size="mini">搜索</el-button>-->
<!--                <el-button type="primary" @click="generateExcel" size="mini">导出</el-button>-->
<!--            </el-row>-->
<!--        </div>-->
<!--        <el-divider></el-divider>-->
      <div class="titles">
        <ByHeaderSlice :title="'工程耗时记总'"></ByHeaderSlice>
      </div>
<!--        <div>-->
<!--            <span style="text-align: center;display:block;">工程耗时记总</span>-->
<!--        </div>-->
        <div id="container" :style="{width: '100%', height: '10px'}"></div>
      <div>
        <ByTable
            v-if="projectData.length !== 0"
            :columnArr="timeBatch_projectData_columnArr"
            :tableData="projectData"
        />
        <ByEmpty v-else></ByEmpty>
      </div>

        <!-- <el-table stripe :data="projectData" border size="medium">
            <el-table-column prop="curr_st_time" show-overflow-tooltip label="开始时间" align="center"></el-table-column>
            <el-table-column prop="curr_end_time" show-overflow-tooltip label="结束时间" align="center"></el-table-column>
            <el-table-column prop="taskNum" show-overflow-tooltip label="总任务数" align="center"></el-table-column>
            <el-table-column prop="jobNum" show-overflow-tooltip label="总作业数" align="center"></el-table-column>
            <el-table-column prop="projectConsumeTime" show-overflow-tooltip label="总用时" align="center">
            </el-table-column>
            <el-table-column prop="projectConsumeAveTime" show-overflow-tooltip label="平均耗时" align="center">
            </el-table-column>
        </el-table> -->
        <el-divider></el-divider>
<!--        <div>-->
<!--            <span style="text-align: center;display:block;">任务耗时记总</span>-->
<!--        </div>-->
      <div class="titles">
        <ByHeaderSlice :title="'任务耗时记总'"></ByHeaderSlice>
      </div>
        <div id="container" :style="{width: '100%', height: '10px'}"></div>
        <div>
          <ByTable
              v-if="taskData.length !== 0"
              :columnArr="timeBatch_taskData_columnArr"
              :tableData="taskData"
              :pagination="taskPage"
              @sizeChange="handleSizeChange"
              @currentChange="handleCurrentChange"
          />
          <ByEmpty v-else></ByEmpty>
        </div>

        <!-- <el-table stripe :data="taskData" border size="medium">
            <el-table-column prop="sub_sys_desc" show-overflow-tooltip label="任务名称" align="center"></el-table-column>
            <el-table-column prop="curr_st_time" show-overflow-tooltip label="开始时间" align="center"></el-table-column>
            <el-table-column prop="curr_end_time" show-overflow-tooltip label="结束时间" align="center"></el-table-column>
            <el-table-column prop="jobNum" show-overflow-tooltip label="总作业数" align="center"></el-table-column>
            <el-table-column prop="taskConsumeTime" show-overflow-tooltip label="总用时" align="center"></el-table-column>
            <el-table-column prop="taskConsumeAveTime" show-overflow-tooltip label="平均耗时" align="center">
            </el-table-column>
        </el-table> -->
        <!-- 分页 -->
        <!-- <el-row class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="taskPage.currPage" :page-sizes="taskPage.pageSizes" :page-size="taskPage.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="taskPage.totalSize" class='locationcenter' />
        </el-row> -->
        <el-divider></el-divider>
<!--        <div>-->
<!--            <span style="text-align: center;display:block;">作业耗时记总</span>-->
<!--        </div>-->
      <div class="titles">
        <ByHeaderSlice :title="'作业耗时记总'"></ByHeaderSlice>
      </div>
        <div id="container" :style="{width: '100%', height: '10px'}"></div>
      <div>
        <ByTable
            v-if="jobData.length !== 0"
            :columnArr="timeBatch_jobData_columnArr"
            :tableData="jobData"
            :pagination="jobPage"
            @sizeChange="handleSizeJobChange"
            @currentChange="handleCurrentJobChange"
        />
        <ByEmpty v-else></ByEmpty>
      </div>

        <!-- <el-table stripe :data="jobData" border size="medium">
            <el-table-column prop="etl_job" show-overflow-tooltip label="作业名称" align="center"></el-table-column>
            <el-table-column prop="etl_job_desc" show-overflow-tooltip label="作业描述" align="center"></el-table-column>
            <el-table-column prop="curr_st_time" show-overflow-tooltip label="开始时间" align="center"></el-table-column>
            <el-table-column prop="curr_end_time" show-overflow-tooltip label="结束时间" align="center"></el-table-column>
            <el-table-column prop="jobTime" show-overflow-tooltip label="作业用时" align="center"></el-table-column>
        </el-table> -->
        <!-- <el-row class="pagination">
            <el-pagination @size-change="handleSizeJobChange" @current-change="handleCurrentJobChange"
                :current-page="jobPage.currPage" :page-sizes="jobPage.pageSizes" :page-size="jobPage.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="jobPage.totalSize" class='locationcenter' />
        </el-row> -->
    </div>
</template>

<script>
import {
  timeBatch_projectData_columnArr,
  timeBatch_taskData_columnArr,
  timeBatch_jobData_columnArr, quickSearchItem, quickButtonItem
} from "./mock";
    import Highcahrts from 'highcharts';
    import highchartsMore from 'highcharts/highcharts-more';
    highchartsMore(Highcahrts);
    import {
        Chart
    } from 'highcharts-vue'
    import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import ByHeaderSlice from "@/components/global/ByHeaderSlice.vue";
import ByEmpty from "@/components/global/ByEmpty.vue";
    export default {
        components: {
          ByEmpty,
          ByHeaderSlice,
          ByQuickSearch,
            highcharts: Chart
        },
        data() {
            return {
              quickButtonItem,
              quickSearchItem,
                etl_sys_id:null,
                timeBatch_projectData_columnArr,
                timeBatch_taskData_columnArr,
                timeBatch_jobData_columnArr,
                dateValue: '',
                sub_sys_cd_name: '',
                etl_job_value: '',
                etl_job_desc: '',
                projectData: [],
                taskData: [],
                jobData: [],
                taskPage:{
                    pageNum: 1,
                    total: 0,
                    pageSize: 10,
                    pageSizes:[5,10, 50, 100, 200]
                },
                jobPage:{
                    pageNum: 1,
                    total: 0,
                    pageSize: 10,
                    pageSizes:[5,10, 50, 100, 200]
                },
                currJobPage: 1,
                totalJobSize: 0,
                pageJobSize: 10,
            };

        },
        mounted(){
            this.etl_sys_id = this.$route.query.etl_sys_id;
        },
        methods: {
            search(val) {
                this.dateValue = val.dateValue;
                this.sub_sys_cd_name = val.sub_sys_cd_name;
                this.etl_job_value = val.etl_job_value;
                this.etl_job_desc = val.etl_job_desc;
                if (this.dateValue == "" || this.dateValue.length == 0) {
                    this.$Msg.customizTitle('批量日期不能为空', 'warning')
                } else {
                    this.getProjectConsumeTimeSum();
                    this.getTaskConsumeTimeSum();
                    this.getJobConsumeTimeSum();
                }
            },
          btnClick(prop){
            if (prop === 'export'){
              this.generateExcel();
            }
          },
            getProjectConsumeTimeSum() {
                this.$executeRequest.execGetByModuleUrl('etlMage/etlmonitor/getProjectConsumeTimeSum',{
                    // etl_sys_cd: this.$route.query.etl_sys_cd,
                    etl_sys_id: this.etl_sys_id,
                    curr_bath_date: this.dateValue
                }).then(res => {
                    if (res && res.success) {
                        for (let i = 0; i < res.data.length; i++) {
                            res.data[i].curr_end_time = this.dateToMilldate(res.data[i].curr_end_time);
                            res.data[i].curr_st_time = this.dateToMilldate(res.data[i].curr_st_time);
                            res.data[i].projectConsumeTime = this.formatSeconds(res.data[i].projectConsumeTime);
                            res.data[i].projectConsumeAveTime = this.formatSeconds(res.data[i].projectConsumeAveTime);
                        }
                        this.projectData = res.data
                    }
                })
            },
            getTaskConsumeTimeSum() {
              this.$executeRequest.execGetByModuleUrl('etlMage/etlmonitor/getTaskConsumeTimeSum',{
                    // etl_sys_cd: this.$route.query.etl_sys_cd,
                    etl_sys_id: this.etl_sys_id,
                    curr_bath_date: this.dateValue,
                    sub_sys_cd_or_name: this.sub_sys_cd_name,
                    currPage: this.taskPage.pageNum,
                    pageSize: this.taskPage.pageSize
                }).then(res => {
                    if (res && res.success) {
                        for (let i = 0; i < res.data.data.length; i++) {
                            res.data.data[i].curr_end_time = this.dateToMilldate(res.data.data[i].curr_end_time);
                            res.data.data[i].curr_st_time = this.dateToMilldate(res.data.data[i].curr_st_time);
                            res.data.data[i].taskConsumeTime = this.formatSeconds(res.data.data[i].taskConsumeTime);
                            res.data.data[i].taskConsumeAveTime = this.formatSeconds(res.data.data[i].taskConsumeAveTime);
                        }
                        this.taskData = res.data.data
                        this.taskPage.total = res.data.totalSize
                    }
                })
            },
            getJobConsumeTimeSum() {
              this.$executeRequest.execGetByModuleUrl('etlMage/etlmonitor/getJobConsumeTimeSum',{
                    // etl_sys_cd: this.$route.query.etl_sys_cd,
                    etl_sys_id:this.etl_sys_id,
                    curr_bath_date: this.dateValue,
                    etl_job: this.etl_job_value,
                    etl_job_desc: this.etl_job_desc,
                    currJobPage: this.jobPage.pageNum,
                    pageJobSize: this.jobPage.pageSize
                }).then(res => {
                    if (res && res.success) {
                        console.log(res.data)
                        for (let i = 0; i < res.data.length; i++) {
                            res.data[i].curr_end_time = this.dateToMilldate(res.data[i].curr_end_time);
                            res.data[i].curr_st_time = this.dateToMilldate(res.data[i].curr_st_time);
                            res.data[i].jobTime = this.formatSeconds(res.data[i].jobTime);
                        }
                        this.jobData = res.data.data
                        this.jobPage.total = res.data.totalSize
                    }
                })
            },
            handleSizeChange(val) {
                this.taskPage.pageSize = val
                // 点击每页显示的条数时，显示第一页
                this.getTaskConsumeTimeSum();
            },
            handleCurrentChange(val) {
                this.taskPage.pageNum = val
                // 切换页码时，要获取每页显示的条数
                this.getTaskConsumeTimeSum();
            },
            handleSizeJobChange(val) {
                this.jobPage.pageSize = val
                this.getJobConsumeTimeSum();
            },
            handleCurrentJobChange(val) {
                this.jobPage.pageNum = val
                this.getJobConsumeTimeSum();
            },
            formatSeconds(value) {
                var secondTime = parseInt(value) // 秒
                var minuteTime = 0 // 分
                var hourTime = 0 // 小时
                var dayTime = 0 // 天
                var result = ''
                if (value < 60) {
                    result = secondTime + '秒'
                } else {
                    if (secondTime >= 60) { // 如果秒数大于60，将秒数转换成整数
                        // 获取分钟，除以60取整数，得到整数分钟
                        minuteTime = parseInt(secondTime / 60)
                        // 获取秒数，秒数取佘，得到整数秒数
                        secondTime = parseInt(secondTime % 60)
                        // 如果分钟大于60，将分钟转换成小时
                        if (minuteTime >= 60) {
                            // 获取小时，获取分钟除以60，得到整数小时
                            hourTime = parseInt(minuteTime / 60)
                            // 获取小时后取佘的分，获取分钟除以60取佘的分
                            minuteTime = parseInt(minuteTime % 60)
                            if (hourTime >= 24) {
                                // 获取天数， 获取小时除以24，得到整数天
                                dayTime = parseInt(hourTime / 24)
                                // 获取小时后取余小时，获取分钟除以24取余的分；
                                hourTime = parseInt(hourTime % 24)
                            }
                        }
                    }
                    if (secondTime > 0) {
                        secondTime = parseInt(secondTime) >= 10 ? secondTime : '0' + secondTime
                        result = '' + secondTime + '秒'
                    }
                    if (minuteTime > 0) {
                        minuteTime = parseInt(minuteTime) >= 10 ? minuteTime : '0' + minuteTime
                        result = '' + minuteTime + '分' + result
                    }
                    if (hourTime > 0) {
                        result = '' + parseInt(hourTime) + '小时' + result
                    }
                    if (dayTime > 0) {
                        result = '' + parseInt(dayTime) + '天' + result
                    }
                }
                return result
            },
            generateExcel() {
                if (this.projectData.length > 0) {
                    //生成excel表格
                  this.$executeRequest.execPostByModuleUrl('etlMage/etlmonitor/generateExcel',{
                        projectData: JSON.stringify(this.projectData),
                        taskData: JSON.stringify(this.taskData),
                        jobData: JSON.stringify(this.jobData)
                    }).then(res => {
                        console.log(res)
                        if (res.success) {
                            let file_name = 'bachWorkTime.xlsx';
                            let param = { fileName: file_name };
                            this.$executeRequest.execDownloadFileByModuleUrl('etlMage/etlmonitor/downloadFile',param).then(res => {
                                if (res) {
                                    this.$FileOperations.fileDownload(res, file_name)
                                }
                            })
                        }
                    });
                }
            },
            downloadModel() {
                let file_name = 'batchTaskTime.xlsx';
                let param = { fileName: file_name };
                this.$executeRequest.execDownloadFileByModuleUrl('etlMage/etlmonitor/downloadFile',param).then(res => {
                    if (res && res.success) {
                        this.$FileOperations.fileDownload(res, file_name)
                    }
                })
            },
            // 毫秒数
            dateToMill(date) {
                date = date.replace(/\s*/g, "");
                let year = date.substring(0, 4);
                let month = date.substring(4, 6);
                let day = date.substring(6, 8);
                let timeh = date.substring(8, 10);
                let timem = date.substring(10, 12)
                let times = date.substring(12, 14)
                let dates = year + "-" + month + "-" + day + " " + timeh + ":" + timem + ":" + times;
                date = dates;
                date = (new Date(date)).getTime() + 8 * 60 * 60 * 1000; //得到毫秒数
                return date;
            },
            //显示日期格式
            dateToMilldate(date) {
                date = date.replace(/\s*/g, "");
                let year = date.substring(0, 4);
                let month = date.substring(4, 6);
                let day = date.substring(6, 8);
                let timeh = date.substring(8, 10);
                let timem = date.substring(10, 12)
                let times = date.substring(12, 14)
                let dates = year + "-" + month + "-" + day + " " + timeh + ":" + timem + ":" + times;
                date = dates;
                return date;
            }
        }
    };
</script>

<style scoped>
    .historyBatch .title {
        font-size: 16px;
        margin-bottom: 5px;
        font-weight: 600;

    }

    .historyBatch .elRowdate {
        margin-top: 16px;
    }

    .elRowdate span {
        color: #606266;
        font-size: 14px;
    }

    .historyBatch .titles {
        font-weight: 600;
    }

    .historyBatch .span10 {
        text-align: center;
        margin-bottom: 10px;
    }

    .historyBatch .span10:first-child {
        margin-top: 10px;
        font-size: 20px;
    }

    .historyBatch .span10:nth-child(2) {
        font-size: 12px;
    }

    .historyBatch .el-button {
        margin-left: 12px;
    }

    .text-overflow {
        display: block;
        word-break: keep-all;
        /* 不换行 */
        white-space: nowrap;
        /* 不换行 */
        overflow: hidden;
    }
</style>
