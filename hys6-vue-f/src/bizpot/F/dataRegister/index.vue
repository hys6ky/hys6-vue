<template>
    <div>
        <el-row class='topTitle'>
            <span class='el-icon-location'>数据源Agent列表</span>
        </el-row>
        <el-table stripe :data="AgenttableData" border style="width: 100%" :header-cell-style="{'text-align':'center'}">
            <el-table-column label="序号" width="100" align="center" type="index" :index="hIndex">
            </el-table-column>
            <el-table-column prop="datasource_name" label="数据源名称" align="center"></el-table-column>
            <el-table-column prop="datasource_number" label="数据源编号" align="center"></el-table-column>
            <el-table-column prop="datetime_format" label="创建时间" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-row class='optheight'>
                        <el-row class='optheight'>
                          <el-col :span="12">
                            <el-button type="success" size="mini" round @click="addtask(scope.row)"
                                       icon='el-icon-plus'>新增任务
                            </el-button>
                          </el-col>
                          <el-col :span="12">
                            <el-badge type="warning" :value="scope.row.tasknum" class="itemi">
                              <el-button type="primary" size="mini" round @click="taskManagement(scope.row)"
                                      icon='el-icon-s-cooperation'>任务管理
                              </el-button>
                            </el-badge>
                          </el-col>
                        </el-row>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <div style="float: right;margin-top: 15px">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total=this.totalSize>
          </el-pagination>
        </div>
        <!-- 点击任务管理出现弹层 -->
        <el-dialog title="数据采集任务" :visible.sync="dialogTableTask" width="70%" class="taskEx">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">数据采集任务</span>
            </div>
            <el-table stripe :data="taskMang" border size="medium" :empty-text="tableloadingInfo">
                <el-table-column label="序号" width="70" align="center" class>
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column property="task_name" label="任务名称" align="left" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column property='collect_type' label="采集方式" align="left" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-tag type="primary">{{scope.row.collect_type}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <template>
                            <el-button type="text" @click="taskEditBtn(scope.row)" class='editcolor'>编辑</el-button>
                            <el-button type="text" @click="taskDelBtn(scope.row)" class="delcolor">删除</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableTask = false" type="danger" size="medium">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import * as message from "@/utils/message";

    let rowName;
    export default {
        data() {
            return {
                totalSize:null,
                currentPage: 1,
                pageNum:1,
                pageSize:10,
                AgenttableData: [],
                taskMang: [],
                tableloadingInfo: '数据加载中...',
                dialogTableTask: false,
                CollectType: [],
                type: '',
                id: '',
                ParamPlaceholder: '',
                CollectTypeData: [],
                // collect_type: false,
            };
        },
        mounted() {
            this.getSourceInfoList();
            this.$executeRequest.execByControllerMappingName("sourceList/getSqlParamPlaceholder", null).then(res => {
                if (res.success) {
                    this.ParamPlaceholder = res.data
                }
            });
            let params = {};
            params["category"] = "CollectType";
            this.$Code.getCategoryItems(params).then(res => {
                if (res.success) {
                    this.CollectTypeData = res.data
                }
            });
        },
        methods: {
            getSourceInfoList(){
              this.$executeRequest.execByControllerMappingName("sourceList/getSourceInfoList", {pageNum:this.pageNum,pageSize:this.pageSize}).then(res => {
                if (res.success) {
                  console.log(res.data)
                  this.AgenttableData = res.data.datasourceList ? res.data.datasourceList : [];
                  this.totalSize = res.data.totalSize;
                  if (this.AgenttableData.length > 0){
                    this.AgenttableData.forEach(item =>{
                      item.datetime_format = this.$Date.dateFormat(item.create_date) + " " + this.$Date.hourFormat(item.create_time);
                    })
                  }
                }
              });
            },
            taskManagement(row) {
                this.dialogTableTask = true;
                let params = {};
                params["sourceId"] = row.source_id;
                this.$executeRequest.execByControllerMappingName("sourceList/getTaskInfo", params).then(res => {
                    if (res.success) {
                        let arrdata = res ? res.data : [];
                        for (let i = 0; i < arrdata.length; i++) {
                            for (let j = 0; j < this.CollectTypeData.length; j++) {
                                if (arrdata[i].collect_type == this.CollectTypeData[j].code) {
                                    arrdata[i].collect_type = this.CollectTypeData[j].value
                                }
                            }
                            arrdata[i].sourceName = row.datasource_name
                        }
                        this.taskMang = arrdata;
                        if (arrdata.length > 0) {
                            this.tableloadingInfo = ''
                        } else {
                            this.tableloadingInfo = '暂无数据'
                        }
                    }
                });
            },
            // 任务管理里面的编辑  根据不同类型跳转不同页面
            taskEditBtn(row) {
              this.$router.push({
                  name: "agent",
                  query: {
                      // agent_id: row.agent_id,
                      id: row.id,
                      source_id: row.source_id,
                      rowName: this.$Base64.encode(rowName),
                      source_name: this.$Base64.encode(row.sourceName),
                      edit: "yes"
                  }
              });
            },
            // 新增任务   跳转到新增任务页面
            addtask(row) {
                this.$router.push({
                    name: "agent",
                    query: {
                        source_id: row.source_id,
                        source_name: this.$Base64.encode(row.datasource_name),
                    }
                });
            },
            // 删除任务
            taskDelBtn(row) {
                message.confirmMsg('确定删除吗').then(res => {
                      let params = {};
                      params["collectSetId"] = row.id;
                      this.$executeRequest.execByControllerMappingName("sourceList/deleteDBTask", params).then(res => {
                          if (res.success) {
                              this.getSourceInfoList();
                              this.taskManagement(row);
                              message.deleteSuccess(res);
                          }
                      });
                  }).catch(() => {
                  })
            },
          handleSizeChange(val) {
            this.pageSize = val;
            let params = {};
            params["pageNum"] = this.pageNum;
            params["pageSize"] = val;
            this.$executeRequest.execByControllerMappingName("sourceList/getSourceInfoList", params).then(res => {
              if (res.success) {
                this.AgenttableData = res.data.datasourceList ? res.data.datasourceList : [];
                this.totalSize = res.data.totalSize;
                if (this.AgenttableData.length > 0){
                  this.AgenttableData.forEach(item =>{
                    item.datetime_format = this.$Date.dateFormat(item.create_date) + " " + this.$Date.hourFormat(item.create_time);
                  })
                }
              }
            });
          },
          handleCurrentChange(val) {
            this.pageNum = val;
            let params = {};
            params["pageNum"] = val;
            params["pageSize"] = this.pageSize;
            this.$executeRequest.execByControllerMappingName("sourceList/getSourceInfoList", params).then(res => {
              if (res.success) {
                this.AgenttableData = res.data.datasourceList ? res.data.datasourceList : [];
                this.totalSize = res.data.totalSize;
                if (this.AgenttableData.length > 0){
                  this.AgenttableData.forEach(item =>{
                    item.datetime_format = this.$Date.dateFormat(item.create_date) + " " + this.$Date.hourFormat(item.create_time);
                  })
                }
              }
            });
          },
          hIndex(index){
              return (this.pageNum - 1)*this.pageSize + index + 1;
          }
        }

    };
</script>
<style scoped>
    .taskEx >>> .el-dialog__body {
        padding: 8px 20px;
    }

    .taskEx >>> .el-table__row > td {
        padding: 0;
    }
    .el-badge >>> .is-fixed {
        top: 9px !important;
        right: 15px !important;
    }
</style>
