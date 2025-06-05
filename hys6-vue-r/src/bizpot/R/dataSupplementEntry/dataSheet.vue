<template>
    <el-row :gutter="20">
        <!--表头搜索栏-->
        <el-col :span="24" style="float: right;">
            <ByContainerTitle title="项目列表">
              <el-button type="primary" size="mini" style="float: right"
                         @click="goBack">返回上一级
              </el-button>
            </ByContainerTitle>
<!--            <i class="el-icon-document"><span>项目列表</span></i>-->
<!--            <el-button type="primary" size="mini" style="float: right"-->
<!--                       @click="goBack">返回上一级-->
<!--            </el-button>-->
            <el-divider/>
            <ByQuickSearch
              :formItems="dataSheetFormItems"
              :extraButton="dataSheetExtraButton"
              @search="dataSheetSearch"
              @reset="delSelectData"
              @btnClick="goToInstert"
            >
            </ByQuickSearch>
<!--            <el-form :model="selectData" ref="table" label-width="120px" size="small">-->
<!--                <el-row>-->
<!--                    <el-col :span="6">-->
<!--                        <el-form-item label="表单名称：" prop="tableName">-->
<!--                            <el-input-->
<!--                                    size="small"-->
<!--                                    v-model="selectData.tableName"-->
<!--                                    placeholder="请输入表单名称"-->
<!--                            ></el-input>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->
<!--                    <el-col :span="6">-->
<!--                        <el-form-item label="创建人：" prop="createUserId">-->
<!--                            <el-input-->
<!--                                    size="small"-->
<!--                                    v-model="selectData.createUserId"-->
<!--                                    placeholder="请输入创建人"-->
<!--                            ></el-input>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                    <el-col :span="6">-->
<!--                        <el-form-item label="创建时间：">-->
<!--                            <el-col :span="24">-->
<!--                                <el-date-picker-->
<!--                                        type="date"-->
<!--                                        value-format="yyyyMMdd"-->
<!--                                        placeholder="选择日期"-->
<!--                                        v-model="selectData.createDate"-->
<!--                                        style="width: 100%;"-->
<!--                                ></el-date-picker>-->
<!--                            </el-col>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->
<!--                    <el-col :span="6">-->
<!--                        <el-form-item label="更新时间：">-->
<!--                            <el-col :span="24">-->
<!--                                <el-date-picker-->
<!--                                        type="date"-->
<!--                                        value-format="yyyyMMdd"-->
<!--                                        placeholder="选择日期"-->
<!--                                        v-model="selectData.updateDate"-->
<!--                                        style="width: 100%;"-->
<!--                                ></el-date-picker>-->
<!--                            </el-col>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->
<!--                    <div style="text-align: right">-->
<!--                        <el-button size="mini" type="primary" @click="delSelectData">重置-->
<!--                        </el-button>-->
<!--                        <el-button size="mini" type="primary" @click="sindSelectData">查询-->
<!--                        </el-button>-->
<!--                        <el-button size="mini" type="primary"-->
<!--                                   @click="goToInstert"-->
<!--                                   v-show="this.selectData.submit_state ==='0' || this.selectData.submit_state === '3'">-->
<!--                            新增-->
<!--                        </el-button>-->
<!--                    </div>-->
<!--                </el-row>-->
<!--            </el-form>-->
        </el-col>
        <el-col>
            <by-table
              :tableData="tableData"
              :columnArr="dataSheetColumnArr"
              @operateItem="operateItem"
              :pagination="pagination"
              @sizeChange="handleSizeChange"
              @currentChange="handleCurrentChange"
            >
            </by-table>
<!--            <el-table-->
<!--                    ref="singleTable"-->
<!--                    :data="tableData"-->
<!--                    border-->
<!--                    highlight-current-row-->
<!--                    style="width: 100%">-->
<!--                <el-table-column-->
<!--                        label="序号"-->
<!--                        width="70"-->
<!--                        align="center"-->
<!--                        type="index">-->
<!--                    <template slot-scope="scope">-->
<!--                        <span>{{ scope.$index + (selectData.currPage - 1) * selectData.pageSize + 1 }}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        property="table_ch_name"-->
<!--                        label="表中文名"-->
<!--                        align="center"-->
<!--                        :show-overflow-tooltip="true">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        property="table_name"-->
<!--                        label="表英文名"-->
<!--                        align="center"-->
<!--                        :show-overflow-tooltip="true">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        property="dep_name"-->
<!--                        label="部门"-->
<!--                        align="center"-->
<!--                        :show-overflow-tooltip="true">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        property="user_name"-->
<!--                        align="center"-->
<!--                        label="创建人" :show-overflow-tooltip="true">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        property="create_date"-->
<!--                        align="center"-->
<!--                        label="创建时间" :show-overflow-tooltip="true">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        property="update_date"-->
<!--                        align="center"-->
<!--                        label="最后更新时间" :show-overflow-tooltip="true">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        property="is_rec"-->
<!--                        align="center"-->
<!--                        label="状态" :show-overflow-tooltip="true">-->
<!--                    <template slot-scope="scope">-->
<!--                        {{ scope.row.is_rec === '1' ? '已补录' : '' }}-->
<!--                        {{ scope.row.is_rec === '0' ? '未补录' : '' }}-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        label="操作" align="center" width="270px">-->
<!--                    <template slot-scope="scope">-->
<!--                        <div>-->
<!--                            <el-button size="mini" type="primary" @click="look(scope.row.apply_tab_id)">查看</el-button>-->
<!--                            <el-button size="mini" type="primary" @click="uploadTable(scope.row.apply_tab_id)">导出-->
<!--                            </el-button>-->
<!--                            <el-button size="mini" type="danger"-->
<!--                                       v-show="selectData.submit_state ==='0' || selectData.submit_state === '3'"-->
<!--                                       @click="updateStatus(scope.row.apply_tab_id)">删除-->
<!--                            </el-button>-->
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
<!--                        :page-size="selectData.currPage"-->
<!--                        layout="total, sizes, prev, pager, next, jumper"-->
<!--                        :total="total">-->
<!--                </el-pagination>-->
<!--            </el-col>-->
        </el-col>
        <el-dialog title='数据补录信息' center :visible.sync='outVisible' @close='close'>
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

import ByContainerTitle from "@/components/global/ByContainerTitle.vue";
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import {
  dataSheetFormItems,
  dataSheetExtraButton,
  dataSheetColumnArr
} from './mock.js'
import ByTable from "@/components/global/ByTable.vue";
import ByModel from "@/components/global/ByModel.vue";
export default {
  components: {ByModel, ByTable, ByQuickSearch, ByContainerTitle},
    data() {
        return {
            dataSheetFormItems,
            dataSheetExtraButton,
            dataSheetColumnArr,
            pagination:{
              total:0,
              pageNum : 1,
              pageSize : 10,
              pageSizes : [10, 50, 100, 200]
            },
            outVisible: false,
            innerVisible: false,
            total: 10,
            lookTableData: [],
            columnData: [],
            flag: true,
            selectData: {
                tableName: '',
                updateDate: '',
                createUserId: '',
                createDate: '',
                currPage: 1,
                pageSize: 10,
                dfPid: ''
            },
            tableSelectData: {
                tableName: '',
                updateDate: '',
                createUserId: '',
                createDate: '',
                currPage: 1,
                pageSize: 10,
                dfPid: ''
            },
            tableTotal: 10,
            tableData: [],
            currentRow: null
        }
    },
    created() {
        this.selectData.dfPid = this.$route.query.dfPid;
        this.tableSelectData.dfPid = this.$route.query.dfPid;
        this.selectData.submit_state = this.$route.query.submit_state;
        this.findByRecordList();
    },
    methods: {
        operateItem(type,row){
          if (type == 'view'){
            this.look(row.apply_tab_id)
          } else if (type =='delete'){
            this.updateStatus(row.apply_tab_id)
          }else if (type == 'export'){
            this.uploadTable(row.apply_tab_id)
          }
        },
        close() {
            this.tableSelectData.currPage = 1;
            this.tableSelectData.pageSize = 10;
            this.pagination.pageNum = 1;
            this.pagination.pageSize = 10;
        },
        //返回
        goBack() {
            //, query: {"dfPid": res, "allflag": false, "operation": false}
            // this.$router.push({path: "/dataSupplementEntry", query: {"path": "/dataSheet"}});
            this.$router.push({
              name: "dataSupplementEntry",
            })
        },
        //导出临时表
        uploadTable(dfAppId) {
            this.$executeRequest.execDownloadFileByMenuUrl("/dfTableApply/exportDslTable",{'dfAppId': dfAppId}).then(res =>{
              //console.log(res.data);
              const link = document.createElement('a'); //创建a标签
              const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}) //设置文件流
              link.style.display = 'none';
              // 设置连接
              link.href = URL.createObjectURL(blob); //将文件流转化为blob地址
              if (this.selectData.dfPid == null) {
                link.download = "_RECORD";
              } else {
                link.download = dfAppId + "_RECORD";
              }
              document.body.appendChild(link);
              // 模拟点击事件
              link.click()  //设置点击事件
            }).catch(error =>{
              this.$message.error("存储层连接获取失败，导出失败。")
            })
        },
        handleSizeChange(val) {
            this.selectData.pageSize = val;
            this.selectData.currPage = 1;
            this.pagination.pageNum = 1;
            this.pagination.pageSize = val;
            if (this.flag) {
                this.findByRecordList();
            } else {
                this.sindSelectData();
            }
        },
        tableHandleSizeChange(val) {
            console.log(val,"val")
            this.tableSelectData.pageSize = val;
            this.tableSelectData.currPage = 1;
            this.pagination.pageNum = 1;
            this.pagination.pageSize = val;
            this.findTableData();
        },
        handleCurrentChange(val) {
            //console.log(`当前页: ${val}`);
            this.selectData.currPage = val;
            this.pagination.pageNum = val;
            if (this.flag) {
                this.findByRecordList();
            } else {
                this.sindSelectData();
            }
        },
        tableHandleCurrentChange(val) {
            //console.log(`当前页: ${val}`);
            this.tableSelectData.currPage = val;
            this.pagination.pageSize = val;
            this.findTableData();
        },
        look(res) {
            this.outVisible = true;
            this.tableSelectData.dfPid = res;
            this.findTableData();
            //console.log(this.selectData.dfPid);
        },
        findTableData() {
            this.$executeRequest.execPostByMenuUrl("/dfTableApply/findCursorList",this.tableSelectData).then(res =>{
              if (res.success) {
                this.lookTableData = res.data.data;
                this.tableTotal = res.data.count;
                this.pagination.total = res.data.count;
                this.columnData = Object.keys(res.data.data[0]);
              } else {
                this.lookTableData = [];
                this.tableTotal = "";
                this.pagination.total = "";
                this.columnData = '';
                this.$message.error(res.message);
              }
            }).catch(err =>{
              this.lookTableData = [];
              this.tableTotal = 0;
              this.pagination.total = 0;
              this.columnData = [];
              //this.$message.error(err);
            })
            // record.findCursorList(this.tableSelectData).then(res => {
            //     if (res.success) {
            //         console.log(JSON.stringify(res.data.data));
            //         this.lookTableData = res.data.data;
            //         this.tableTotal = res.data.count;
            //         this.columnData = Object.keys(res.data.data[0]);
            //     } else {
            //         this.lookTableData = [];
            //         this.tableTotal = "";
            //         this.columnData = '';
            //         this.$message.error(res.message);
            //     }
            //     //this.lookTableData  = [...this.lookTableData]
            // }).catch(err => {
            //     this.lookTableData = [];
            //     this.tableTotal = 0;
            //     this.columnData = [];
            //     //this.$message.error(err);
            // });
        },
        //修改补录状态为未补录
        updateStatus(res) {
            this.$executeRequest.execGetByMenuUrl("/dfTableApply/updateStatus", {dfId:res}).then(res =>{
              if (res.success) {
                this.findByRecordList();
              } else {
                this.$message.error(res.message)
              }
            })

        },
        // 日期时间格式化
        dateTimeFormat(data) {
            data.forEach(item => {
                if (item.create_date) {
                    item.create_date = this.$Date.dateFormat(item.create_date);
                }
                if (item.update_date) {
                    item.update_date = this.$Date.dateFormat(item.update_date);
                }
                if (item.create_time) {
                    item.create_time = this.$Date.hourFormat(item.create_time);
                }
                if (item.update_time) {
                    item.update_time = this.$Date.hourFormat(item.update_time);
                }
            });
        },
        //找录入过的列表
        findByRecordList() {
            this.flag = true;
            this.$executeRequest.execPostByMenuUrl("/dfTableApply/findByRecordList",this.selectData).then(res =>{
              if (res.success) {
                this.dateTimeFormat(res.data.data)
                for (let i = 0; i < res.data.data.length; i++) {
                  res.data.data[i].create_date = res.data.data[i].create_date + " " + res.data.data[i].create_time;
                  if (res.data.data[i].update_date != null) {
                    res.data.data[i].update_date = res.data.data[i].update_date + " " + res.data.data[i].update_time;
                  }
                  res.data.data[i].submit_state = this.$route.query.submit_state;
                  if (res.data.data[i].is_rec === '1'){
                    res.data.data[i].rec = '已补录'
                  }else if (res.data.data[i].is_rec === '0'){
                    res.data.data[i].rec = '未补录'
                  }else {
                    res.data.data[i].rec = ''
                  }
                }
                this.tableData = res.data.data;
                this.total = res.data.count;
                this.pagination.total = res.data.count;
              }
            })
        },
        delSelectData() {
            const pageData = this.selectData;
            this.selectData = {};
            this.selectData.submit_state = pageData.submit_state;
            this.selectData.currPage = pageData.currPage;
            this.selectData.pageSize = pageData.pageSize;
            this.selectData.dfPid = pageData.dfPid;
            this.findByRecordList();
        },
        dataSheetSearch(data){
            data['dfPid'] = this.$route.query.dfPid;
            data['submit_state'] = this.$route.query.submit_state;
           this.sindSelectData(data)
        },
        sindSelectData(data) {
            this.flag = false;
            this.$executeRequest.execPostByMenuUrl("/dfTableApply/findRecordListByName",data).then(res =>{
              this.dateTimeFormat(res.data.data)
              if (res.success) {
                for (let i = 0; i < res.data.data.length; i++) {
                  //console.log(res.data.data)
                  res.data.data[i].create_date = res.data.data[i].create_date + " " + res.data.data[i].create_time;
                  if (res.data.data[i].update_date != null) {
                    res.data.data[i].update_date = res.data.data[i].update_date + " " + res.data.data[i].update_time;
                  }
                  res.data.data[i].submit_state = this.$route.query.submit_state;
                  if (res.data.data[i].is_rec === '1'){
                    res.data.data[i].rec = '已补录'
                  }else if (res.data.data[i].is_rec === '0'){
                    res.data.data[i].rec = '未补录'
                  }else {
                    res.data.data[i].rec = ''
                  }
                }
                this.tableData = res.data.data;
                this.total = res.data.count;
              }
            })
        },
        goToInstert() {
            if (this.selectData.submit_state ==='0' || this.selectData.submit_state === '3'){
              this.$router.push({
                name: "insertSheet",
                query:{
                  dfPid:this.selectData.dfPid,
                  "submit_state": this.selectData.submit_state,
                  // "path": "/dataSheet"
                }
              })
            }
        },
    }
}
</script>

<style scoped>
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>