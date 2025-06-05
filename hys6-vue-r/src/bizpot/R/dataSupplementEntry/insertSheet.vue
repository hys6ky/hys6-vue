<template>
    <!--表头搜索栏-->
    <el-row>
<!--        <i class="el-icon-document"><span>项目列表</span></i>-->
<!--        <el-button type="primary" size="mini" style="float: right;margin-bottom: 30px"-->
<!--                   @click="goBack">返回上一级-->
<!--        </el-button>-->
      <ByContainerTitle title="项目列表">
        <el-button type="primary" size="mini" style="float: right"
                   @click="goBack">返回上一级</el-button>
      </ByContainerTitle>
      <el-divider/>
      <el-col :span="24" style="float: right;">
        <ByQuickSearch
            :formItems="insertSheetFormItems"
            @search="insertSheetSearch"
            @reset="delSelectData"
        >
        </ByQuickSearch>
<!--            <el-form :model="selectData" ref="table" label-width="120px" size="small">-->
<!--                <el-col :span="6">-->
<!--                    <el-form-item label="表单名称：" prop="tableName">-->
<!--                        <el-input-->
<!--                                size="small"-->
<!--                                v-model="selectData.tableName"-->
<!--                                placeholder="请输入表单名称"-->
<!--                        ></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :span="18" style="text-align: right">-->
<!--                    <el-button type="primary" size="mini" @click="delSelectData">重置</el-button>-->
<!--                    <el-button type="primary" size="mini" @click="sindSelectData">查询-->
<!--                    </el-button>-->
<!--                </el-col>-->
<!--            </el-form>-->
        </el-col>
        <el-col>
            <ByTable
              :tableData="tableData"
              :columnArr="insertSheetColumnArr"
              @operateItem="operateItem"
              :pagination="pagination"
              @sizeChange="handleSizeChange"
              @currentChange="handleCurrentChange"
            >
            </ByTable>
<!--            <el-table-->
<!--                    ref="singleTable"-->
<!--                    :data="tableData"-->
<!--                    highlight-current-row-->
<!--                    border-->
<!--                    style="width: 100%">-->
<!--                <el-table-column-->
<!--                        label="序号"-->
<!--                        type="index"-->
<!--                        align="center"-->
<!--                        width="50"-->
<!--                        :show-overflow-tooltip="true">-->
<!--                    <template slot-scope="scope">-->
<!--                        <span>{{ scope.$index + (selectData.currPage - 1) * selectData.pageSize + 1 }}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        property="table_ch_name"-->
<!--                        label="表中文名"-->
<!--                        align="center"-->
<!--                        width="200"-->
<!--                        :show-overflow-tooltip="true">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        property="table_name"-->
<!--                        label="表英文名"-->
<!--                        width="400"-->
<!--                        align="center"-->
<!--                        :show-overflow-tooltip="true">-->
<!--                </el-table-column>-->

<!--                <el-table-column-->
<!--                        property="is_rec"-->
<!--                        align="center"-->
<!--                        label="是否补录" :show-overflow-tooltip="true">-->
<!--                    <template slot-scope="scope">-->
<!--                        {{ scope.row.is_rec === '1' ? '已补录' : '' }}-->
<!--                        {{ scope.row.is_rec !== '1' ? '未补录' : '' }}-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        label="数据预览"-->
<!--                        align="center"-->
<!--                        :show-overflow-tooltip="true">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-button size="mini" type="primary" @click="yulan(scope.row.table_name,scope.row.target_table_id)">预览</el-button>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        label="数据导出"-->
<!--                        align="center"-->
<!--                        :show-overflow-tooltip="true">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-button size="mini" type="primary" @click="exportCursor(scope.row.table_name,scope.row.target_table_id)">导出-->
<!--                        </el-button>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        label="操作" align="center" width="200">-->
<!--                    <template slot-scope="scope">-->
<!--                        <div style="white-space: nowrap; display: inline-block">-->
<!--                            <div v-if="scope.row.is_rec == 1">-->
<!--                                <el-button size="mini" type="primary" @click="look(scope.row.apply_tab_id)">查看-->
<!--                                </el-button>-->
<!--                                <el-button size="mini" type="primary"-->
<!--                                           @click="update(scope.row.apply_tab_id,scope.row.target_table_id)">编辑-->
<!--                                </el-button>-->
<!--                            </div>-->
<!--                            <div v-else="scope.row.is_rec !==1">-->
<!--                                <el-button size="mini" type="primary"-->
<!--                                           @click="record(scope.row.table_name,scope.row.target_table_id)">数据补录-->
<!--                                </el-button>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--            </el-table>-->
<!--            <el-col style="text-align: center">-->
<!--                <el-pagination-->
<!--                        @size-change="handleSizeChange"-->
<!--                        @current-change="handleCurrentChange"-->
<!--                        :current-page.sync="selectData.currPage"-->
<!--                        :page-sizes="[10, 50, 100, 200]"-->
<!--                        :page-size="selectData.pageSize"-->
<!--                        layout="total, sizes, prev, pager, next, jumper"-->
<!--                        :total="total">-->
<!--                </el-pagination>-->
<!--            </el-col>-->
        </el-col>
        <el-dialog title='数据信息' center :visible.sync='outVisible' @close='close'>
            <el-table :data="lookTableData" stripe border>
                <el-table-column v-for="(item, index) in columnData" :key="index" :prop="item"
                                 :label="item" show-overflow-tooltip align='center'></el-table-column>
            </el-table>
            <el-col style="text-align: center">
                <el-pagination
                        @size-change="tableHandleSizeChange"
                        @current-change="tableHandleCurrentChange"
                        :current-page.sync="tableSelectData.currPage"
                        :page-sizes="[10, 50, 100, 200]"
                        :page-size="tableSelectData.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableTotal">
                </el-pagination>
            </el-col>
            <span slot='footer'>
                <el-button style="text-align: right" @click='outVisible=false'>返回</el-button>
            </span>
        </el-dialog>
    </el-row>
</template>

<script>
    import {exportCursor} from "@/utils/executeRequest";
    import {
      insertSheetFormItems,
      insertSheetColumnArr
    } from './mock'
    import ByTable from "@/components/global/ByTable.vue";
    export default {
      components: {ByTable},
        data() {
            return {
              insertSheetFormItems,
              insertSheetColumnArr,
              pagination:{
                total:0,
                pageNum:1,
                pageSize:10,
                pageSizes:[10, 50, 100, 200]
              },
                tableName:"",
                tableId: "",
                outVisible: false,
                innerVisible: false,
                path: '',
                total: 10,
                flag: true,
                selectData: {
                    currPage: 1,
                    pageSize: 10,
                    dfPid: 1,
                },
                tableSelectData: {
                    currPage: 1,
                    pageSize: 10,
                    dfPid: 1,
                },
                tableTotal: 10,
                tableData: [],
                lookTableData: [],
                columnData: []
            }
        },
        created() {
            this.selectData.dfPid = this.$route.query.dfPid; //此为项目id
            this.tableSelectData.dfPid = this.$route.query.dfPid; //此为项目id
            this.tableId = this.$route.query.tableId; //此为临时表id
            this.selectData.submit_state = this.$route.query.submit_state; //此为跳转字段，为返回键服务
            this.findAll();
        },
        methods: {
            operateItem(type,row){
              if (type == 'Preview'){
                this.yulan(row.table_name,row.target_table_id)
              }else if (type == 'export'){
                this.exportCursor(row.table_name,row.target_table_id)
              }else if (type == 'view'){
                this.look(row.apply_tab_id)
              }else if (type == 'edit'){
                this.update(row.apply_tab_id,row.target_table_id)
              }else if (type == 'record'){
                this.record(row.table_name,row.target_table_id)
              }
            },
            close() {
                this.tableSelectData.currPage = 1;
                this.tableSelectData.pageSize = 10
            },
            //返回
            goBack() {
                // this.$router.push({
                //     path: "/dataSheet",
                //     query: {
                //         "dfPid": this.selectData.dfPid,
                //         "submit_state": this.selectData.submit_state,
                //         "path": "/insertSheet"
                //     }
                // });
                this.$router.push({
                  name:"dataSheet",
                  query: {
                    "dfPid": this.selectData.dfPid,
                    "submit_state": this.selectData.submit_state,
                  }
                })
            },
            //导出两千条数据
            exportCursor(tableName,tableId) {
                this.selectData.tableName = tableName;
                this.selectData.targetTableId = tableId;
                this.$executeRequest.exportCursor("/dfTableApply/exportCursor",this.selectData).then(res =>{
                  //console.log("res.data" + JSON.stringify(res.data));
                  const link = document.createElement('a'); //创建a标签
                  const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}) //设置文件流
                  link.style.display = 'none';
                  // 设置连接
                  link.href = URL.createObjectURL(blob); //将文件流转化为blob地址
                  if (this.selectData.dfPid == null) {
                    link.download = "_RECORD";
                  } else {
                    link.download = tableName + "_RECORD";
                  }
                  document.body.appendChild(link);
                  // 模拟点击事件
                  link.click()  //设置点击事件
                }).catch(err => {
                  this.$message.error("存储层连接获取失败，导出失败。")
                });
                // record.exportCursor(this.selectData).then(res => {
                //     //console.log("res.data" + JSON.stringify(res.data));
                //     const link = document.createElement('a'); //创建a标签
                //     const blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}) //设置文件流
                //     link.style.display = 'none';
                //     // 设置连接
                //     link.href = URL.createObjectURL(blob); //将文件流转化为blob地址
                //     if (this.selectData.dfPid == null) {
                //         link.download = "_RECORD";
                //     } else {
                //         link.download = tableName + "_RECORD";
                //     }
                //     document.body.appendChild(link);
                //     // 模拟点击事件
                //     link.click()  //设置点击事件
                // }).catch(err => {
                //     this.$message.error("存储层连接获取失败，导出失败。")
                // });
                this.delSelectData();
            },

            delSelectData() {
                const pageData = this.selectData;
                this.selectData = {};
                this.selectData.submit_state = pageData.submit_state;
                this.selectData.currPage = pageData.currPage;
                this.selectData.pageSize = pageData.pageSize;
                this.selectData.dfPid = pageData.dfPid;
                this.findAll();
            }
            ,
            handleSizeChange(val) {
                console.log(val,"handleSizeChange");
                this.selectData.pageSize = val;
                this.selectData.currPage = 1;
                if (this.flag) {
                    this.findAll();
                } else {
                    this.sindSelectData();
                }
            }
            ,
            handleCurrentChange(val) {
                console.log(val,"handleCurrentChange");
                this.selectData.currPage = val;
                if (this.flag) {
                    this.findAll();
                } else {
                    this.sindSelectData();
                }
            }
            ,
            findAll() {
                this.flag = true;
                this.$executeRequest.execPostByMenuUrl("/dfTableApply/findAll",this.selectData).then(res =>{
                  if (res.success) {
                    console.log(res.data.data,"res.data.data")
                    res.data.data.forEach(item =>{
                      if (item.is_rec == null){
                        item.is_rec = 0
                      }
                      if (item.is_rec == 0){
                        item.rec = '未补录'
                      } else if (item.is_rec == 1){
                        item.rec = '已补录'
                      }
                    })
                    this.tableData = res.data.data;
                    this.total = res.data.count;
                    this.pagination.total = res.data.count;
                  }
                })
            },
            insertSheetSearch(data){
                data['dfPid'] = this.$route.query.dfPid;
                data['submit_state'] = this.$route.query.submit_state;
                this.sindSelectData(data)
            },
            sindSelectData(data) {
                this.flag = false;
                this.$executeRequest.execPostByMenuUrl("/dfTableApply/findAllListByName",data).then(res =>{
                  if (res.success) {
                    this.tableData = res.data.data;
                    this.total = res.data.count;
                    this.pagination.total = res.data.count;
                  }
                })
            }
            ,
            update(res, targetTableId) {
                console.log(res, targetTableId)
                // this.$router.push({
                //     path: "/dataTable",
                //     query: {
                //         "id": this.selectData.dfPid,
                //         "update": true,
                //         "targetTableId": targetTableId,
                //         "submit_state": this.selectData.submit_state,
                //         "dfPid": res,
                //         "allflag": false,
                //         "operation": true,
                //         "path": "/insertSheet"
                //     }
                // });
                this.$router.push({
                  name:"dataTable",
                  query:{
                    "id": this.selectData.dfPid,
                    "update": true,
                    "targetTableId": targetTableId,
                    "submit_state": this.selectData.submit_state,
                    "dfPid": res,
                    "allflag": false,
                    "operation": true,
                  }
                })
            },
            record(tableName, targetTableId) {
                // this.$router.push({
                //     path: "/dataTable",
                //     query: {
                //         "id": this.selectData.dfPid,
                //         "dfPid": this.selectData.dfPid,
                //         "submit_state": this.selectData.submit_state,
                //         "tableName": tableName,
                //         "allflag": false,
                //         "operation": true,
                //         "record": true,
                //         "path": "/insertSheet",
                //         "targetTableId": targetTableId
                //     }
                // });
                this.$router.push({
                  name:"dataTable",
                  query: {
                    "id": this.selectData.dfPid,
                    "dfPid": this.selectData.dfPid,
                    "submit_state": this.selectData.submit_state,
                    "tableName": tableName,
                    "allflag": false,
                    "operation": true,
                    "record": true,
                    "targetTableId": targetTableId
                  }
                })
            },
            yulan(table_name,table_id) {
                /*this.$router.push({
                    path: "/dataTable",
                    query: {
                        "id": this.selectData.dfPid,
                        "dfPid": this.selectData.dfPid,
                        "targetTableId": target_table_id,
                        "submit_state": this.selectData.submit_state,
                        "allflag": true,
                        "operation": false,
                        "path": "/insertSheet"
                    }
                });*/
                this.lookTableData = [];
                this.tableId = table_id;
                this.tableName = table_name;
                this.outVisible = true;
                this.findList(table_name);
            },
            findTableData() {
                this.$executeRequest.execPostByMenuUrl("/dfTableApply/findCursorList",this.tableSelectData).then(res =>{
                  if (res.success) {
                    console.log(JSON.stringify(res.data.data));
                    this.lookTableData = res.data.data;
                    this.tableTotal = res.data.count
                    this.columnData = Object.keys(res.data.data[0]);
                  } else {
                    this.$message.error(res.message);
                  }
                })
            },
            look(apply_id) {
                /*this.$router.push({
                    path: "/dataTable",
                    query: {
                        "id": this.selectData.dfPid, "dfPid": res, "allflag": false, "operation": false,
                        "submit_state": this.selectData.submit_state,
                        "path": "/insertSheet"
                    }
                });*/
                this.lookTableData = [];
                //this.tableId = res;
                this.outVisible = true;
                this.tableSelectData.dfPid = apply_id;
                this.findTableData();
            },
            //查2000条数据
            findList(table_name) {
                this.tableSelectData.tableName = table_name;
                this.tableSelectData.dfPid = this.selectData.dfPid;
                console.log(this.tableSelectData)
                this.$executeRequest.execPostByMenuUrl("/dfTableApply/findList/" + this.tableId,this.tableSelectData).then(res =>{
                  if (res.success) {
                    this.lookTableData = res.data.data;
                    this.columnData = Object.keys(res.data.data[0]);
                    this.tableTotal = res.data.count;
                  } else {
                    this.$message.error(res.message);
                  }
                }).catch(err => {
                  this.lookTableData = [];
                  this.columnData = [];
                  this.tableTotal = 0;
                })
            },
            tableHandleSizeChange(val) {
                this.tableSelectData.pageSize = val;
                this.tableSelectData.currPage = 1;
                this.pagination.pageNum = 1;
                this.pagination.pageSize = val;
                this.findList(this.tableName);
            },
            tableHandleCurrentChange(val) {
                this.tableSelectData.currPage = val;
                this.pagination.pageNum = val;
                this.findList(this.tableName);
            },
        }
    }
</script>

<style scoped>

</style>