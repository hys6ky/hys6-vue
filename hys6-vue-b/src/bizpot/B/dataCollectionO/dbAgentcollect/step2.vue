<template>
    <div class="step2">
        <Step :active="active"></Step>
        <el-table :data="tableData" border size="medium" :height="tableHeight">
            <el-table-column property label="序号" width="70px" align="center">
                <template slot-scope="scope">
                    <span>{{scope.$index+(currentPage - 1) * pagesize + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column property="table_name" label="表名" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column property="table_ch_name" label="中文表名" show-overflow-tooltip
                             align="center"></el-table-column>
            <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="watchText(scope.row,scope.$index)">查看列</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                       :page-sizes="[100, 200, 300, 400]" :page-size="pagesize"
                       layout="total, sizes, prev, pager, next, jumper" :total="tableData.length"
                       class="locationcenter"></el-pagination>
        <div class="step1Footer">
            <el-col :span="12">
                <el-button type="primary" @click="goBackQuit" size="medium"> 返回</el-button>
            </el-col>
            <el-col :span="12">
                <div class="partFourDiv">
                    <el-button type="primary" style="float:left" @click="backSteps" size="medium">上一步</el-button>
                    <el-button type="primary" style="float:right" @click="nextSteps" size="medium"
                               :disabled="buttonDisabled"> 下一步
                    </el-button>
                </div>
            </el-col>
        </div>
        <!-- 查看列弹出框 -->
        <el-dialog width="70%" :visible.sync="innerVisible">
            <div slot="title">
                <span class="dialogtitle el-icon-caret-right">查看列信息</span>
            </div>
            <el-table :data="tableDataDialog.slice((currentPage - 1) * pagesize, currentPage * pagesize)" border
                      size="medium">
                <el-table-column property label="序号" width="70px" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.$index+(currentPage - 1) * pagesize + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column property="is_primary_key" width="120" label="是否为主键" align="center">
                    <template slot-scope="scope">
                        <el-checkbox :true-label="isFalg.Shi" :false-label="isFalg.Fou"
                                     v-model="scope.row.is_primary_key"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="拉链字段选择" width="150" align="center">
                    <template slot="header" slot-scope="scope">
                        <el-checkbox @change="handleCheckAllChange(tableDataDialog,isZipperAll)" v-model="isZipperAll"
                                     :checked="isZipperAll">
                            <span class="allclickColor">拉链字段选择</span>
                        </el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox :true-label="isFalg.Shi" :false-label="isFalg.Fou"
                                     v-model="scope.row.is_zipper_field"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column property="column_name" label="列名" show-overflow-tooltip
                                 align="center"></el-table-column>
                <el-table-column property="column_ch_name" label="列中文名" show-overflow-tooltip
                                 align="center"></el-table-column>
                <el-table-column label="字段类型" property="column_type" show-overflow-tooltip
                                 align="center"></el-table-column>
            </el-table>
            <div class="pageDiv">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next"
                               style="float:right;" :total="tableDataDialog.length"></el-pagination>
            </div>

            <div slot="footer">
                <el-button size="mini" type="danger" @click="cancelWatch">取 消</el-button>
                <el-button type="primary" size="mini" @click="selectWatch">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import dbStep from "./dbStep.vue";

    export default {
        components: {
          dbStep
        },
        data() {
            return {
                active: 1,
                tableData: [],
                tableDataDialog: [],
                pagesize: 10,
                currentPage: 1,
                innerVisible: false,
                table_id: '',
                table_name: '',
                tableColumn: {},
                buttonDisabled: false,
                isZipperAll: false,
                tableHeight: '',
                isFalg: {}
            }
        },
        created() {
            this.tableHeight = window.screen.height - 270 + 'px'
        },
        mounted() {
            this.getTableData();
            this.$Code.getCodeItems({
                'category': 'IsFlag'
            }).then(res => {
                this.isFalg = res.data;
            })
        },
        methods: {
            // 返回上一级
            goBackQuit() {
                this.$router.push({
                    name: "dataCollectionO"
                })
            },
            // 获取表格数据
            getTableData() {
                this.$executeRequest.execGetByMenuUrl("/dbAgentcollect/tableconf/getTableData", {
                    colSetId: this.$route.query.id
                }).then(res => {
                    if (!res.success) {
                        this.$router.push({
                            name: "dbAgentcollect",
                            query: this.$route.query
                        })
                    }
                    if (res.data.existsTable != undefined) {
                        this.$Msg.customizTitle(res.data.existsTable, "error");
                        this.buttonDisabled = true; //禁止下一步
                    } else {
                        this.buttonDisabled = false;
                    }
                    this.tableData = res.data.dirTableList;
                    // if (res.data.dirTableList && res.data.dirTableList.length > 0) {
                    //     this.$executeRequest.execGetByMenuUrl("/dbAgentcollect/tableconf/saveDatabaseType", {
                    //         database_id: res.data.dirTableList[0].database_id,
                    //         database_type: res.data.dirTableList[0].database_type
                    //     }).then(res => {
                    //         /*functionAll.saveDatabaseType({
                    //           database_id: res.data.dirTableList[0].database_id,
                    //           database_type: res.data.dirTableList[0].database_type
                    //         }).then(res => {*/
                    //     });
                    // }
                })
            },
            // 查看列数据
            watchText(val, index) {
                this.table_id = val.table_id;
                this.table_name = val.table_name;
                if (val.table_id == undefined) {
                    this.$executeRequest.execGetByMenuUrl("/dbAgentcollect/tableconf/getTableColumnByTableName", {
                        colSetId: this.$route.query.id,
                        table_name: val.table_name
                    }).then(res => {
                        /*functionAll.getTableColumnByTableName({
                            colSetId: this.$route.query.id,
                            table_name: val.table_name
                        }).then(res => {*/
                        let arry = [];
                        res.data.forEach((item, index) => {
                            if (item.column_name.toUpperCase() == 'HYREN_S_DATE') {
                                return false;
                            } else if (item.column_name.toUpperCase() == "HYREN_E_DATE") {
                                return false;
                            } else if (item.column_name.toUpperCase() == 'HYREN_MD5_VAL') {
                                return false;
                            } else {
                                arry.push(item)
                            }
                            if (item['is_zipper_field']) {
                                item['is_zipper_field'] = this.isFalg.Fou;
                            }
                        })
                        this.tableDataDialog = arry;
                    })
                } else {
                    this.$executeRequest.execGetByMenuUrl("/dbAgentcollect/tableconf/getTableColumnByTableId", {
                        colSetId: this.$route.query.id,
                        table_id: val.table_id
                    }).then(res => {
                        /*functionAll.getTableColumnByTableId({
                            colSetId: this.$route.query.id,
                            table_id: val.table_id
                        }).then(res => {*/
                        let arry = [];
                        res.data.forEach((item, index) => {
                            if (item.column_name.toUpperCase() == 'HYREN_S_DATE') {
                                return false;
                            } else if (item.column_name.toUpperCase() == "HYREN_E_DATE") {
                                return false;
                            } else if (item.column_name.toUpperCase() == 'HYREN_MD5_VAL') {
                                return false;
                            } else {
                                arry.push(item)
                            }
                        })
                        this.tableDataDialog = arry;
                    })
                }
                this.innerVisible = true;
            },
            //取消查看列
            cancelWatch() {
                this.innerVisible = false;
                this.tableDataDialog = [];
            },
            // 保存查看列
            selectWatch() {
                if (this.table_id == undefined) {
                    let obj = {};
                    obj[this.table_name] = this.tableDataDialog;
                    this.tableColumn[this.table_name] = this.tableDataDialog;
                    this.innerVisible = false;
                    this.$Msg.customizTitle("列保存成功", "success")
                } else {
                    let obj = {};
                    obj.table_id = this.table_id;
                    obj['tableColumns'] = JSON.stringify(this.tableDataDialog);
                    this.$executeRequest.execPostByMenuUrl("/dbAgentcollect/tableconf/updateColumnByTableId", obj).then(res => {
                        //functionAll.updateColumnByTableId(obj).then(res => {
                        if (res && res.success) {
                            this.innerVisible = false;
                            this.$Msg.customizTitle("列保存成功", "success");
                            this.tableDataDialog = [];
                        }
                    })
                }
            },
            // 下一步
            nextSteps() {
                let paramas = {};
                paramas["colSetId"] = this.$route.query.id;
                // paramas.tableInfos = JSON.stringify(this.tableData);
                paramas["tableInfos"] = this.tableData;
                if (JSON.stringify(this.tableColumn) != '{}') {
                    paramas["tableColumns"] = this.tableColumn;
                }
                this.$executeRequest.execPostByMenuUrl("/dbAgentcollect/tableconf/saveTableData", paramas).then(res => {
                    //functionAll.saveTableData(paramas).then(res => {
                    if (res && res.success) {
                        let data = {}
                        if (this.$route.query.edit == 'yes') {
                            data = {
                                agent_id: this.$route.query.agent_id,
                                id: res.data,
                                source_id: this.$route.query.source_id,
                                source_name: this.$route.query.source_name,
                                edit: "yes"
                            }
                        } else {
                            data = {
                                agent_id: this.$route.query.agent_id,
                                id: res.data,
                                source_id: this.$route.query.source_id,
                                source_name: this.$route.query.source_name,
                            }
                        }
                        this.$router.push({
                            //path: "collection4_3",
                            name: "step3",
                            query: data
                        })
                    }
                })
            },
            //上一步
            backSteps() {
                let data = {}
                if (this.$route.query.edit == 'yes') {
                    data = {
                        agent_id: this.$route.query.agent_id,
                        id: this.$route.query.id,
                        source_id: this.$route.query.source_id,
                        source_name: this.$route.query.source_name,
                        edit: "yes"
                    }
                } else {
                    data = {
                        agent_id: this.$route.query.agent_id,
                        id: this.$route.query.id,
                        source_id: this.$route.query.source_id,
                        source_name: this.$route.query.source_name,
                    }
                }
                this.$router.push({
                    //path: "collection4_1",
                    name: "dbAgentcollect",
                    query: data
                })
            },
            // 分页显示
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
            },
            handleSizeChange(size) {
                this.pagesize = size;
            },
            //是否为拉链字段
            handleCheckAllChange(items, e) {
                items.forEach(item => {
                    if (e) {
                        item['is_zipper_field'] = this.isFalg.Shi;
                    } else {
                        item['is_zipper_field'] = this.isFalg.Fou;
                    }
                })
            },
        }
    }
</script>

<style scoped>
    /* 按钮设置 */
    .step2 .el-table {
        margin-bottom: 20px;
    }

    .step2 .partFourDiv {
        float: right;
    }

    .step2 .partFourDiv .el-button {
        margin-bottom: 20px;
    }

    /* 数据分页 */
    .step2 .pageDiv {
        height: 10px;
    }

    .allclickColor {
        color: #2E3033;
        font-weight: bold;
    }
</style>
