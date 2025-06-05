<template>
<div class="historyJob">
    <div class="title">
    <ByHeaderSlice :title="'搜索条件'"></ByHeaderSlice>
    </div>
  <ByQuickSearch :form-items="quickSearchItem" @search="search"></ByQuickSearch>
<!--    <el-form :model="form" ref="form" class="demo-form-inline" :inline="true" style="height:40px;">-->
<!--        <el-col :span="9">-->
<!--            <el-form-item label="作业名称">-->
<!--                <el-autocomplete :fetch-suggestions="querySearch" size="mini" v-model="form.etl_job" placeholder="作业名称" clearable style="width:264px" @select="handleSelect"></el-autocomplete>-->
<!--            </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="7">-->
<!--            <el-form-item label="开始批量日期">-->
<!--                <el-date-picker size="mini" style="width:126px;" v-model="form.start_date" value-format="yyyyMMdd" type="date" placeholder="开始日期">-->
<!--                </el-date-picker>-->
<!--            </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--            <el-form-item label="结束批量日期">-->
<!--                <el-date-picker size="mini" style="width:126px;" v-model="form.end_date" value-format="yyyyMMdd" type="date" placeholder="结束日期">-->
<!--                </el-date-picker>-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--                <el-button type="primary" @click="search" size="mini">搜索</el-button>-->
<!--            </el-form-item>-->
<!--        </el-col>-->
<!--    </el-form>-->
<!--    <el-divider></el-divider>-->
    <div>
      <ByHeaderSlice :title="'信息详情'"></ByHeaderSlice>
    </div>
    <div id="container" :style="{width: '100%', height: '420px'}"></div>
  <div>
    <ByTable
        v-if="departmentalList.length !== 0"
        :columnArr="columnArr"
        :tableData="departmentalList"
        @operateItem="operateItem"
    />
    <ByEmpty v-else></ByEmpty>
  </div>

    <!-- <el-table stripe :data="departmentalList" border size="medium">
        <el-table-column prop="sub_sys_cd" show-overflow-tooltip label="系统名称" align="center"></el-table-column>
        <el-table-column prop="etl_job" show-overflow-tooltip label="作业名称" align="center"></el-table-column>
        <el-table-column prop="curr_bath_date" show-overflow-tooltip label="批量日期" align="center"></el-table-column>
        <el-table-column prop="curr_st_time" show-overflow-tooltip label="开始时间" align="center"></el-table-column>
        <el-table-column prop="curr_end_time" show-overflow-tooltip label="结束时间" align="center"></el-table-column>
        <el-table-column prop="job_disp_status" show-overflow-tooltip label="状态" align="center"></el-table-column>
        <el-table-column label="日志" align="center"> <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-s-claim" title="日志" type="primary" @click="handleEdit(scope.row)">
                </el-button>
            </template></el-table-column>
    </el-table> -->
    <!-- 日志查看 -->
  <ByModel :model-title="'作业日志信息(' + this.dialogWorks + ')'" :visible.sync="dialogForm"
  @close="closeDialog" :model-width="'80%'">
    <el-form :model="formAdd" ref="formAdd">
      <el-form-item label="日志行数" :label-width="formLabelWidth">
        <el-input v-model="formAdd.readNum" autocomplete="off" placeholder="行数" style="width:284px"></el-input>
        <el-button type="primary" class="download" @click='viewData' :loading="viewLoading" size="small">查 看</el-button>
        <el-tooltip class="item" effect="dark" content="默认显示最后100行，最多显示最后1000行(正整数)" placement="right">
          <i class="fa fa-question-circle " aria-hidden="true"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label=" 日志日期" :label-width="formLabelWidth" prop="curr_bath_date" :rules="filter_rules([{required: true}])">
        <el-date-picker v-model="formAdd.curr_bath_date" value-format="yyyyMMdd" type="date" style="width:284px" placeholder="开始批量日期">
        </el-date-picker>
        <el-button class="download" @click="downLoad('formAdd')" :loading="downLoading" type="primary" size="small">下 载</el-button>
      </el-form-item>
    </el-form>

    <div v-if="showHidden" class="diaolgDiv">
      <span v-html="journalData"></span>
      <el-divider></el-divider>
    </div>
    <div slot="modalFoot">
      <el-button  @click='closeDialog'>关 闭</el-button>
    </div>
  </ByModel>
<!--    <el-dialog :title="'作业日志信息(' + this.dialogWorks + ')'" :visible.sync="dialogForm" :before-close="closeDialog">-->
<!--        <el-form :model="formAdd" ref="formAdd">-->
<!--            <el-form-item label="日志行数" :label-width="formLabelWidth">-->
<!--                <el-input v-model="formAdd.readNum" autocomplete="off" placeholder="行数" style="width:284px"></el-input>-->
<!--                <el-button type="primary" class="download" @click='viewData' :loading="viewLoading" size="small">查 看</el-button>-->
<!--                <el-tooltip class="item" effect="dark" content="默认显示最后100行，最多显示最后1000行(正整数)" placement="right">-->
<!--                    <i class="fa fa-question-circle " aria-hidden="true"></i>-->
<!--                </el-tooltip>-->
<!--            </el-form-item>-->
<!--            <el-form-item label=" 日志日期" :label-width="formLabelWidth" prop="curr_bath_date" :rules="filter_rules([{required: true}])">-->
<!--                <el-date-picker v-model="formAdd.curr_bath_date" value-format="yyyyMMdd" type="date" style="width:284px" placeholder="开始批量日期">-->
<!--                </el-date-picker>-->
<!--                <el-button class="download" @click="downLoad('formAdd')" :loading="downLoading" type="primary" size="small">下 载</el-button>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
<!--        <div v-if="showHidden" class="diaolgDiv">-->
<!--            <span v-html="journalData"></span>-->
<!--            <el-divider></el-divider>-->
<!--        </div>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--            <el-button size="mini" type="danger" @click='closeDialog'>关 闭</el-button>-->
<!--        </div>-->
<!--    </el-dialog>-->

</div>
</template>

<script>
import {
  columnArr, quickSearchItem
} from "./mock";
import Highcahrts from 'highcharts';
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import ByHeaderSlice from "@/components/global/ByHeaderSlice.vue";
import ByModel from "@/components/global/ByModel.vue";
import ByEmpty from "@/components/global/ByEmpty.vue";
let object = {};
export default {
  components: {ByEmpty, ByModel, ByHeaderSlice, ByQuickSearch},
    data() {
        return {
          quickSearchItem,
            etl_sys_id: null,
            columnArr,
            form: {
                etl_job_id: '',
                etl_job: '',
                start_date: '',
                end_date: '',
                isHistoryBatch: '',
                // etl_sys_cd: sessionStorage.getItem("sys_cd"),
            },
            formAdd: {
                readNum: 100,
                curr_bath_date: ''
            },
            journalData: '',
            departmentalList: [],
            curr_bath_dates: [],
            use_times: [],
            listDatas: [],
            curr_st_times: [],
            curr_end_times: [],
            dialogForm: false,
            formLabelWidth: '150px',
            showHidden: false,
            downLoading: false,
            viewLoading: false,
            dialogWorks: ''
        };
    },
    mounted() {
        this.etl_sys_id = this.$route.query.etl_sys_id;
        // 通过传参判断是哪种途径
        if (this.$route.query.etl_job_id) {
            this.form.start_date = this.$route.query.start_date;
            this.form.etl_job_id = this.$route.query.etl_job_id;
            this.form.etl_job = this.$route.query.etl_job;
            this.form.isHistoryBatch = 1;
            this.monitorHistoryJobInfo();
        } else {
            this.form.isHistoryBatch = '';
        }
        this.getJobName();
    },
    methods: {
        //查询历史作业
        monitorHistoryJobInfo() {
            let self = this;
            if (self.form.etl_job_id == null ) {
                this.$Msg.customizTitle('作业不能为空', 'warning');
                return;
            }
            var form = self.form;
            form.etl_sys_id = this.etl_sys_id;
            form.etl_job = this.form.etl_job;
            this.$executeRequest.execGetByModuleUrl('etlMage/etlmonitor/monitorHistoryJobInfo',form).then(res => {
                if (res && res.success) {
                    for (let i = 0; i < res.data.length; i++) {
                        let year = res.data[i].curr_bath_date.substring(0, 4);
                        let month = res.data[i].curr_bath_date.substring(4, 6);
                        let day = res.data[i].curr_bath_date.substring(6, 8);
                        let date = year + "-" + month + "-" + day;
                        res.data[i].curr_bath_date = date;
                        let sty = self.formatterLong24HH(res.data[i].curr_st_time);
                        // 开始时间数据
                        let startpiont = {
                            name: res.data[i].etl_job,
                            xs: res.data[i].curr_bath_date,
                            tooltipData: this.$dateconversion.dateToMilldate(res.data[i].curr_st_time),
                            flag: "st", //开始时间标志
                            y: sty
                        };
                        let sdate = new Date(this.$dateconversion.dateToMilldate(res.data[i].curr_st_time))
                        let edate = new Date(this.$dateconversion.dateToMilldate(res.data[i].curr_end_time))
                        // 获得所用时间差
                        let entime = self.subTime(sdate, edate);
                        // 使用时间数据
                        let useTimePoint = {
                            name: res.data[i].etl_job,
                            xs: res.data[i].curr_bath_date,
                            tooltipData: entime,
                            y: entime
                        };
                        let ety = sty + entime;
                        // 结束时间数据
                        let endpiont = {
                            name: res.data[i].etl_job,
                            xs: res.data[i].curr_bath_date,
                            tooltipData: this.$dateconversion.dateToMilldate(res.data[i].curr_end_time),
                            flag: "et", //结束时间标志
                            y: ety
                        };
                        if (entime == 0) {
                            startpiont.color = 'red';
                            endpiont.color = 'red';
                        }
                        // 赋值
                        self.curr_bath_dates[i] = res.data[i].curr_bath_date;
                        self.use_times[i] = useTimePoint;
                        self.curr_st_times[i] = startpiont;
                        self.curr_end_times[i] = endpiont;
                    };
                    let dataTable = res.data;
                    dataTable.forEach(item => {
                        item.curr_st_time = this.$dateconversion.dateToMilldate(item.curr_st_time);
                        item.curr_end_time = this.$dateconversion.dateToMilldate(item.curr_end_time);
                    });
                    this.departmentalList = dataTable;
                    Highcahrts.chart('container', {
                        title: {
                            text: '作业明细'
                        },
                        exporting: {
                            enabled: false
                        },
                        xAxis: {
                            labels: {
                                formatter: function () {
                                    return self.formatterDate(self.curr_bath_dates[this.value]);
                                }
                            },
                            tickInterval: 1
                        },
                        yAxis: [{
                            lineWidth: 1,
                            labels: {
                                overflow: 'justify',
                                formatter: function () {
                                    let values = this.value - 8 * 60 * 60 * 1000;
                                    var d = new Date(values);
                                    var year = d.getFullYear();
                                    var month = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : "0" + (d.getMonth() + 1);
                                    var day = d.getDate() >= 10 ? d.getDate() : "0" + d.getDate();
                                    var hour = d.getHours() >= 10 ? d.getHours() : "0" + d.getHours();
                                    var min = d.getMinutes() >= 10 ? d.getMinutes() : "0" + d.getMinutes();
                                    var sec = d.getSeconds() >= 10 ? d.getSeconds() : "0" + d.getSeconds();
                                    let date = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
                                    return date;
                                }
                            },
                            title: {
                                text: '开始时间-结束时间',
                            },
                            gridLineWidth: 0
                        }, {
                            labels: {
                                overflow: 'justify',
                                formatter: function () {
                                    return self.get24H(this.value);
                                }
                            },
                            title: {
                                text: '所用时间',
                            },
                            opposite: true
                        }],
                        tooltip: {
                            shared: true,
                            formatter: function () {
                                let str = "";
                                if (this.points.length != 0) {
                                    str += '作业名称' + ':' + this.points[0]['key'] + "<br>";
                                    str += '批量日期' + ':' + self.formatterDate(this.points[0].point.xs) + "<br>";
                                }
                                for (var index = 0; index < this.points.length; index++) {
                                    if (this.points[index].series.name == '所用时间') {
                                        str += this.points[index].series.name + "：" +
                                            self.get24H(this.points[index].point.tooltipData) + "<br>";
                                    } else {
                                        str += this.points[index].series.name + "：" +
                                            self.formatterDate(this.points[index].point.tooltipData, "YYYY-MM-DD HH:MM:SS") + "<br>";
                                    }
    
                                }
                                return str;
                            },
                        },
                        plotOptions: {},
                        series: [{
                            type: 'column',
                            name: '所用时间',
                            yAxis: 1,
                            data: self.use_times,
                            color: "#91c7ae",
                        }, {
                            type: 'spline',
                            name: '开始时间',
                            data: self.curr_st_times,
                            color: "#00FA9A",
    
                        }, {
                            type: 'spline',
                            name: '结束时间',
                            data: self.curr_end_times,
                            color: "#c23531",
                        }]
                    });
                }
            })
        },
        // 点击按钮查询
        search(val) {
          if (val.etlJobIdAndCd){
            var splice = val.etlJobIdAndCd.split(",");
            val.etl_job_id = splice[0];
            val.etl_job = splice[1];
          }
          this.form = val;
          this.monitorHistoryJobInfo();
        },
        // 格式化日期
        formatterDate: function (value, type) {
            if (typeof (value) == 'string') {
                return value;
            }
            if (isNaN(value)) {
                return "";
            }
            let str = "";
            let d = new Date(value);
            str += d.getFullYear() + "-";

            let YYYY = d.getFullYear();
            //let MM = d.getMonth();
            let DD = d.getDate();
            let HH = d.getHours();
            let MM = d.getMinutes();
            let SS = d.getMinutes();

            if ((d.getMonth() + 1) < 10) {
                str += "0";
            };
            str += (d.getMonth() + 1) + '-';
            if (d.getDate() < 10) {
                str += "0";
            }
            str += d.getDate() + " ";
            var time = "";

            time += d.getHours() + ":";
            if (d.getMinutes() < 10) {
                time += "0";
            }
            time += d.getMinutes() + ":";
            if (d.getSeconds() < 10) {
                time += "0";
            }
            time += d.getSeconds();

            if (type == 'YYYY-MM-DD HH:MM:SS') {
                str += time;
            }
            if (type == 'HH:MM:SS') {
                str = time;
            }

            return str;
        },
        get24H: function (value) {
            if (isNaN(value)) {
                return "";
            }
            if (value < 0) {
                return 0;
            }
            var flag = true;
            let hh = 0;
            let mm = 0;
            let ss = 0;
            while (flag) {
                if ((hh + 1) * 3600 * 1000 > value) {
                    flag = false;
                    value = value - hh * 3600 * 1000;
                } else {
                    hh++;
                }
            }
            var flag = true;
            while (flag) {
                if ((mm + 1) * 60 * 1000 > value) {
                    flag = false;
                    value = value - mm * 60 * 1000;
                } else {
                    mm++;
                }
            }
            var flag = true;
            while (flag) {
                if ((ss + 1) * 1000 > value) {
                    flag = false;
                    value = value - ss * 3600 * 1000;
                } else {
                    ss++;
                }
            }

            let str = "";
            if (hh < 10) {
                str += "0"
            }
            str += hh + ":";
            if (mm < 10) {
                str += "0"
            }
            str += mm + ":";

            if (ss < 10) {
                str += "0"
            }
            str += ss;
            return str;
        },
        // 毫秒数转换
        formatterLong24HH: function (date) {
            date = date.replace(/\s*/g, "");
            let year = date.substring(0, 4);
            let month = date.substring(4, 6);
            let day = date.substring(6, 8);
            let timeh = date.substring(8, 10);
            let timem = date.substring(10, 12)
            let times = date.substring(12, 14)
            let dates = year + "-" + month + "-" + day + " " + timeh + ":" + timem + ":" + times;
            date = dates;
            date = (new Date(date)).getTime() + 8 * 60 * 60 * 1000;

            return date;
        },
        // 所用时间数据处理
        subTime: function (value, value1) {
            if (isNaN(value1) || typeof (value1) == 'undefined') {
                return 0;
            }
            if (value1 < value) {
                return 0;
            }
            return value1 - value;
        },
        operateItem(type,row){
            console.log(row)
            if (type === 'log'){
                this.visible = true
                this.handleEdit(row)
            }else {
                this.deleteDataStore(row.dsl_id)
            }
        },
        // 打开模态框查看与下载
        handleEdit(value) {
            this.dialogForm = true;
            this.formAdd.curr_bath_date = value.curr_bath_date.replace(/-/g, "");
            object = value;
            this.dialogWorks = value.etl_job;
        },
        // 关闭弹出框
        closeDialog() {
            this.dialogForm = false;
            this.showHidden = false;
            this.$refs.formAdd.resetFields();
        },
        // input框的历史信息
        querySearch(queryString, cb) {
            var res = this.listDatas;
            var results = queryString ? res.filter(this.createFilter(queryString)) : res;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        // input框的回调
        handleSelect(item){
            this.form.etl_job = item.label;
            this.form.etl_job_id = item.id;
        },
        createFilter(queryString) {
            return (res) => {
                return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
            };
        },
        //获取作业名称/上游作业名称下拉框数据
        getJobName() {
            // let params = {};
            // params["etl_sys_cd"] = sessionStorage.getItem("sys_cd");
            var params={
                etl_sys_id: this.etl_sys_id
            }
            let arr = [];
            let obj = {};
            // this.$executeRequest.execGetByModuleUrl('/jobconfig/searchEtlJob',params).then(res => {
            this.$executeRequest.execGetByModuleUrl('etlMage/etlmonitor/findJobByEtlSysId',params).then(res => {
                if (res && res.success) {
                    res.data.forEach((item) => {
                        obj.id = item.etl_job_id
                        obj.label = item.etl_job;
                        obj.value = item.etl_job_id+','+item.etl_job;
                        arr.push(obj);
                        obj = {};
                    });
                    this.listDatas = arr;
                    this.quickSearchItem.map(item =>{
                      if (item.prop === 'etlJobIdAndCd'){
                        item.options = arr;
                      }
                    })
                }
            });
        },
        // 下载
        downLoad(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.downLoading = true;
                    this.$executeRequest.execGetByModuleUrl('etlMage/etlmonitor/downHistoryJobLog',{
                        // etl_sys_cd: sessionStorage.getItem("sys_cd"),
                        etl_job: object.etl_job,
                        etl_sys_id: this.etl_sys_id,
                        etl_job_id: object.etl_job_id,
                        curr_bath_date: this.formAdd.curr_bath_date.replace(/-/g, "")
                    }).then(res => {
                        this.downLoading = false;
                        if (res && res.success) {
                            this.downloadFile(res.data)
                        }
                    })
                }
            })
        },
        // 下载日志方法封装
        downloadFile(val) {
            this.$executeRequest.execDownloadFileByModuleUrl('/etlMage/downloadFile',{
                fileName: val
            }).then(res => {
                this.$FileOperations.fileDownload(res,val);
            })
        },
        //查看日志
        viewData() {
            this.viewLoading = true;
            this.$executeRequest.execGetByModuleUrl('etlMage/etlmonitor/readHistoryJobLogInfo',{
                // etl_sys_cd: sessionStorage.getItem("sys_cd"),
                etl_job: object.etl_job,
                etl_sys_id: this.etl_sys_id,
                etl_job_id: object.etl_job_id,
                readNum: this.formAdd.readNum
            }).then(res => {
                if (res && res.success) {
                    this.showHidden = true;
                    this.viewLoading = false;
                    if (res.data.length != 0) {
                        this.journalData = res.data.replace(/\[/g, '<br>[');
                        let dataTIP = this.journalData.replace(/: <br>\[/g, ':[');
                        this.journalData = dataTIP;
                    } else {
                        this.journalData = "暂无日志信息"
                    }
                }
            })
        }
    }

};
</script>

<style scoped>
.historyJob .title {
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 600;
}

.historyJob .item {
    margin-left: 10px;
}

.historyJob .download {
    margin-left: 20px;
}

.historyJob span {
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 600;
}

.historyJob .diaolgDiv {
    min-height: 20px;
}

.historyJob .diaolgDiv span {
    font-weight: normal;
    margin-left: 10px;
}
</style><style>
.el-autocomplete-suggestion li {
    overflow: visible;
    /* text-overflow: ellipsis; */
}
</style>
