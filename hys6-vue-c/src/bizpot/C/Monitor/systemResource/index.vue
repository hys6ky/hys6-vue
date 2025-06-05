<template>
<div class="systemResource">
    <el-row>
<!--      <span class="spanDeatil">系统资源情况</span>-->
    <ByHeaderSlice :title="'系统资源情况'"></ByHeaderSlice>
    </el-row>
    <el-row class="span10">系统资源</el-row>
    <el-row>
        <div id="main" style="width: 100%;height:400px;"></div>
    </el-row>
    <el-row>
        <span class="spanDeatil">
            <ByHeaderSlice :title="'系统当前占用资源'"></ByHeaderSlice>
        </span>
        <el-row>
          <div>
            <ByTable
                v-if="departmentalList.length !== 0 "
                :columnArr="columnArr"
                :tableData="departmentalList"
            />
            <ByEmpty v-else></ByEmpty>
          </div>

            <!-- <el-table stripe :data="departmentalList" border size="medium">
                <el-table-column prop="resource_type" show-overflow-tooltip label="资源类型" align="center"></el-table-column>
                <el-table-column prop="sub_sys_cd" show-overflow-tooltip label="系统名称" align="center"></el-table-column>
                <el-table-column prop="etl_job" show-overflow-tooltip label="作业名称" align="center"></el-table-column>
                <el-table-column prop="resource_req" show-overflow-tooltip label="占用资源数" align="center"></el-table-column>
                <el-table-column prop="curr_st_time" show-overflow-tooltip label="开始时间" align="center"></el-table-column>
                <el-table-column prop="job_disp_status" show-overflow-tooltip label="状态" align="center"></el-table-column>
            </el-table> -->
        </el-row>
    </el-row>
</div>
</template>

<script>
import {
    columnArr
} from "./mock";
import Highcahrts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import ByEmpty from "@/components/global/ByEmpty.vue";
import ByHeaderSlice from "@/components/global/ByHeaderSlice.vue";
highchartsMore(Highcahrts);
export default {
  components: {ByHeaderSlice, ByEmpty},
    data() {
        return {
            etl_sys_id: null,
            columnArr,
            departmentalList: [],
            free: [],
            used: [],
            resourceType: []
        };

    },
    mounted() {
        this.etl_sys_id = this.$route.query.etl_sys_id;
        this.monitorSystemResourceInfo();
    },
    methods: {
        monitorSystemResourceInfo() {
          this.$executeRequest.execGetByModuleUrl('etlMage/etlmonitor/monitorSystemResourceInfo',{
                // etl_sys_cd: sessionStorage.getItem("sys_cd")
                etl_sys_id: this.etl_sys_id
            }).then((res) => {
                if (res && res.success) {
                    for (let i in res.data.etlResourceList) {
                        this.free.push(parseInt(res.data.etlResourceList[i].free))
                        this.used.push(parseInt(res.data.etlResourceList[i].resource_used))
                        this.resourceType.push(res.data.etlResourceList[i].resource_type)
                    }
                    let that = this;
                    let chart = Highcahrts.chart('main', {
                        chart: {
                            type: 'column'
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            categories: this.resourceType,
                            labels: {
                                rotation: -45
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: '资源数'
                            },
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: 'bold',
                                    color: (Highcahrts.theme && Highcahrts.theme.textColor) || 'gray'
                                }
                            }
                        },
                        legend: {
                            align: 'right',
                            x: -30,
                            verticalAlign: 'top',
                            y: 25,
                            floating: true,
                            backgroundColor: (Highcahrts.theme && Highcahrts.theme.background2) || 'white',
                            borderColor: '#CCC',
                            borderWidth: 1,
                            shadow: false
                        },
                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.x + '</b><br/><span style="color:{series.color}">' +
                                    this.series.name + ' : ' + this.y + '</span><br/>' + '总资源数' + this.point.stackTotal;
                            }
                        },
                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true,
                                    color: (Highcahrts.theme && Highcahrts.theme.dataLabelsColor) || 'white',
                                    style: {
                                        textShadow: '0 0 3px black'
                                    }
                                }
                            }
                        },
                        series: [{
                                name: '空闲资源',
                                color: '#90EE7E',
                                data: this.free
                            },
                            {
                                name: '使用资源',
                                color: '#2B908F',
                                data: this.used
                            }
                        ]
                    })
                    let arr = res.data.jobRunList;
                    arr.forEach(item => {
                        if (item.job_disp_status == "D") {
                            item.job_disp_status = '完成';
                        } else if (item.job_disp_status == "E") {
                            item.job_disp_status = '错误';
                        } else if (item.job_disp_status == "P") {
                            item.job_disp_status = '挂起';
                        } else if (item.job_disp_status == "R") {
                            item.job_disp_status = '运行';
                        } else if (item.job_disp_status == "S") {
                            item.job_disp_status = '停止';
                        } else if (item.job_disp_status == "W") {
                            item.job_disp_status = '等待';
                        }
                    });
                    arr.forEach(item=>{
                        if (item.curr_st_time) {
                            item.curr_st_time=this.$dateconversion.dateToMilldate(item.curr_st_time)
                        }
                    })
                    this.departmentalList = arr;
                }
            })
        },
    }

};
</script>

<style scoped>
.systemResource .span10 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 20px;
}

.systemResource .spanDeatil {
    display: inline-block;
    margin-bottom: 16px;
}
</style>
