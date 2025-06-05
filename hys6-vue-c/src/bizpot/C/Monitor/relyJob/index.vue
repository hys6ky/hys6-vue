<template>
<div class="relyJob">
    <div class="title">
    <ByHeaderSlice :title="'搜索条件'"></ByHeaderSlice>
    </div>
  <ByQuickSearch :form-items="quickSearchItem" :show-search="true" :extra-button="quickButtonItem" @btnClick="btnClick"></ByQuickSearch>
<!--    <el-form :model="form" ref="form" class="demo-form-inline tops" :inline="true">-->
<!--        <el-form-item label="作业名称" class="elformItem">-->
<!--            <el-autocomplete :fetch-suggestions="querySearch" v-model="form.etl_job" placeholder="作业名称" clearable style="width:284px" size="mini" @select="handleSelect"></el-autocomplete>-->
<!--        </el-form-item>-->
<!--        <el-form-item class="elformItem">-->
<!--            <el-button type="primary" @click="searchSingle" size="mini">单作业搜索</el-button>-->
<!--            <el-button type="success" @click="searchALL" size="mini">全作业搜索</el-button>-->
<!--        </el-form-item>-->
<!--    </el-form>-->
<!--    <el-divider></el-divider>-->
    <el-row>
        <el-row v-show="showChartsHidden" class="workName">
            <div id="myChart" :style="{width: '100%', height: '500px'}"></div>
        </el-row>
        <el-row v-show="showOrHidden" class="workName">
            <div id="jsmind_container" :style="{width: '100%', height: '500px'}"></div>
        </el-row>
    </el-row>
</div>
</template>

<script>
import JSmind from 'jsmind';
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import {quickButtonItem, quickSearchItem} from "./mock";
import ByHeaderSlice from "@/components/global/ByHeaderSlice.vue";
require('@/assets/css/jsmind.css');
let _jm = null;
let flag = 0;
require('echarts/dist/extension/dataTool.js');
export default {
  components: {ByHeaderSlice, ByQuickSearch},
    data() {
        return {
          quickButtonItem,
          quickSearchItem,
            etl_sys_id:null,
            showOrHidden: false,
            showChartsHidden: false,
            form: {
                etl_job_id:null,
                etl_job: '',
            },
            listDatas: [],
        };
    },
    mounted() {
        this.etl_sys_id = this.$route.query.etl_sys_id;
        if (this.$route.query.etl_job_id) {
            this.form.etl_job_id = this.$route.query.etl_job_id;
            this.form.etl_job = this.$route.query.etl_job;
        }
        this.getJobName();
        flag = 0;
    },
    methods: {
        // 单作业搜索
      btnClick(prop,val){
        if (prop === 'searchSingle' ){
          if (val.eltJobAndId){
            var splice = val.eltJobAndId.split(",");
            val.etl_job_id = splice[0];
            val.etl_job = splice[1];
          }
          this.form = val;
          this.searchSingle();
        }else if (prop ==='searchALL' ){
          this.searchALL();
        }

        },
        searchSingle() {
            if (this.form.etl_job) {
                this.showOrHidden = true;
                this.showChartsHidden = false;
              this.$executeRequest.execGetByModuleUrl('etlMage/etlmonitor/monitorJobDependencyInfo',{
                    // etl_sys_cd: sessionStorage.getItem("sys_cd"),
                    // etl_job: this.form.etl_job
                    etl_sys_id: this.etl_sys_id,
                    etl_job_id: this.form.etl_job_id
                }).then(res => {
                    if (res && res.success) {
                        let DATA = JSON.stringify(res.data).replace(/name/g, "topic")
                        let data = JSON.parse(DATA)
                        if (flag == 0) {
                            this.open_empty();
                            this.tree(data)
                            flag = 1;
                        } else {
                            this.tree(data)
                        }
                    }

                })
            } else {
                this.$Msg.customizTitle('作业名称不能为空', 'warning');
            }

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
            let arr = [];
            let obj = {};
            var params ={
                etl_sys_id: this.etl_sys_id
            };
            this.$executeRequest.execGetByModuleUrl('etlMage/etlmonitor/findJobByEtlSysId',params).then(res => {
                if (res && res.success) {
                    res.data.forEach((item) => {
                        obj.id = item.etl_job_id,
                        obj.label = item.etl_job;
                        obj.value = item.etl_job_id+","+item.etl_job;
                        arr.push(obj);
                        obj = {};
                    });
                    this.listDatas = arr;
                    this.quickSearchItem.map(item =>{
                      if ('eltJobAndId' === item.prop){
                        item.options = arr;
                      }
                    })
                }
            });
        },
        // jsmind方法
        open_empty() {
            var options = {
                container: 'jsmind_container',
                theme: 'primary',
                editable: false //是否启用编辑
            }
            // _jm = chartMind.show(options);
            _jm = new JSmind(options);
        },
        tree(data) {
            var mind = {
                "meta": {},
                "format": "node_tree",
                "data": data
            }
            _jm.show(mind);
        },
        // 全作业搜索
        searchALL() {
            this.showOrHidden = false;
            this.showChartsHidden = true;
            this.$executeRequest.execGetByModuleUrl('etlMage/etlmonitor/monitorBatchEtlJobDependencyInfo',{
                etl_sys_id: this.etl_sys_id
            }).then(res => {
                if (res && res.success) {
                    let data = res.data;
                    // 基于准备好的dom，初始化echarts实例
                    let myChart = this.$echarts.init(document.getElementById('myChart'));
                    var graph = this.$echarts.dataTool.gexf.parse(data); //xml文件
                    var count = 0;
                    var num = 0;
                    var jobNum = 0;
                    var allNum = 0;
                    var plNum = 0;
                    var nodown = 0;
                    graph.nodes.forEach(function (node) {
                        node.itemStyle = null;
                        node.symbolSize = 20;
                        node.value = node.symbolSize;
                        node.category = node.attributes.modularity_class;
                        if (node.category == 0) {
                            plNum += 1;
                        } else if (node.category == 1) {
                            count += 1;
                        } else if (node.category == 2) {
                            num += 1;
                        } else if (node.category == 3) {
                            nodown += 1;
                        } else if (node.category == 4) {
                            jobNum += 1;
                        }
                        allNum = jobNum + num + count + nodown + plNum;
                        node.x = node.y = null;
                        node.draggable = true;
                    });
                    var categories = [];
                    categories[0] = {
                        name: '频率作业' + plNum + "个"
                    };
                    categories[1] = {
                        name: '定时作业或无依赖关系作业' + count + "个"
                    };
                    categories[2] = {
                        name: '依赖但无上游作业' + num + "个"
                    };
                    categories[3] = {
                        name: '依赖但无下游作业' + nodown + "个"
                    };
                    categories[4] = {
                        name: '全依赖作业' + jobNum + "个，共有作业" + allNum + "个"
                    };
    
                    // 绘制图表
                    myChart.setOption({
                        title: {
                            text: '全作业依赖关系图',
                            subtext: 'Default layout',
                            top: 'bottom',
                            left: 'right'
                        },
                        tooltip: {
                            position: 'bottom',
                            confine: 'overflow: hidden'
    
                        },
                        legend: [{
                            // selectedMode: 'single',
                            data: categories.map(function (a) {
                                return a.name;
                            })
                        }],
                        animation: false,
                        series: [{
                            name: '作业依赖关系图',
                            type: 'graph',
                            edgeSymbol: ['none', 'arrow'],
                            layout: 'force',
                            data: graph.nodes,
                            links: graph.links,
                            categories: categories,
                            roam: true,
                            label: {
                                normal: {
                                    position: 'top'
                                }
                            },
                            force: {
                                repulsion: 300
                            }
                        }]
                    });
                }
            })
        }
    }
};
</script>

<style scoped>
.relyJob .workName {
    margin-top: 16px;
}

.relyJob .title {
    font-size: 16px;
    margin-bottom: 5px;
    font-weight: 600;
}

.relyJob .elformItem {
    margin-bottom: 0px;
}
</style><style>
.el-autocomplete-suggestion li {
    overflow: visible;
    /* text-overflow: ellipsis; */
}
</style>
