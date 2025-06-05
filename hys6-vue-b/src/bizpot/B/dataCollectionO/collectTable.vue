<template>
    <div>
        <el-input v-model="search" size="mini" placeholder="输入表名搜索"/>
        <el-table
                :data="collectTableData.filter(data => !search || data.table_name.toLowerCase().includes(search.toLowerCase()))"
                height="520"
        >
            <el-table-column show-overflow-tooltip prop="table_name" label="表名"></el-table-column>
            <el-table-column prop="B001" label="卸数">
                <template v-slot="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>开始时间: {{ scope.row.B001_S_TITLE }}</p>
                        <p>结束时间: {{ scope.row.B001_E_TITLE }}</p>
                        <div slot="reference" class="name-wrapper">
                            <i
                                    v-if="scope.row.B001===tableData.success"
                                    class="el-icon-success green"
                                    aria-hidden="true"
                            ></i>
                            <i
                                    v-else-if="scope.row.B001===tableData.failure"
                                    class="el-icon-error red"
                                    aria-hidden="true"
                            ></i>
                            <i v-else class="el-icon-loading blur" aria-hidden="true"></i>
                        </div>
                        <p style="max-width:500px" class="red" v-if="scope.row.B001===tableData.failure">错误信息:
                            {{scope.row.B001error}}</p>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="B002" label="上传">
                <template v-slot="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>开始时间: {{ scope.row.B002_S_TITLE }}</p>
                        <p>结束时间: {{ scope.row.B002_E_TITLE }}</p>
                        <div slot="reference" class="name-wrapper">
                            <i
                                    v-if="scope.row.B002===tableData.success"
                                    class="el-icon-success  green"
                                    aria-hidden="true"
                            ></i>
                            <i
                                    v-else-if="scope.row.B002===tableData.failure"
                                    class="el-icon-error red"
                                    aria-hidden="true"
                            ></i>
                            <i v-else class="el-icon-loading blur" aria-hidden="true"></i>
                        </div>
                        <p style="max-width:500px" class="red" v-if="scope.row.B002===tableData.failure">错误信息:
                            {{scope.row.B002error}}</p>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="UHDFS" label="加载">
                <template v-slot="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>开始时间: {{ scope.row.UHDFS_S_TITLE }}</p>
                        <p>结束时间: {{ scope.row.UHDFS_E_TITLE }}</p>
                        <div slot="reference" class="name-wrapper">
                            <i
                                    v-if="scope.row.UHDFS===tableData.success"
                                    class="el-icon-success  green"
                                    aria-hidden="true"
                            ></i>
                            <i
                                    v-else-if="scope.row.UHDFS===tableData.failure"
                                    class="el-icon-error red"
                                    aria-hidden="true"
                            ></i>
                            <i v-else class="el-icon-loading blur" aria-hidden="true"></i>
                        </div>
                        <p style="max-width:500px" class="red" v-if="scope.row.UHDFS===tableData.failure">错误信息:
                            {{scope.row.UHDFSerror}}</p>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="LHIVE" label="增量">
                <template v-slot="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>开始时间: {{ scope.row.LHIVE_S_TITLE }}</p>
                        <p>结束时间: {{ scope.row.LHIVE_E_TITLE }}</p>
                        <div slot="reference" class="name-wrapper">
                            <i
                                    v-if="scope.row.LHIVE===tableData.success"
                                    class="el-icon-success  green"
                                    aria-hidden="true"
                            ></i>
                            <i
                                    v-else-if="scope.row.LHIVE===tableData.failure"
                                    class="el-icon-error red"
                                    aria-hidden="true"
                            ></i>
                            <i v-else class="el-icon-loading blur" aria-hidden="true"></i>
                        </div>
                        <p style="max-width:500px" class="red" v-if="scope.row.LHIVE===tableData.failure">错误信息:
                            {{scope.row.LHIVEerror}}</p>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="SOURCE" label="登记">
                <template v-slot="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>开始时间: {{ scope.row.SOURCE_S_TITLE }}</p>
                        <p>结束时间: {{ scope.row.SOURCE_E_TITLE }}</p>
                        <div slot="reference" class="name-wrapper">
                            <i
                                    v-if="scope.row.SOURCE===tableData.success"
                                    class="el-icon-success  green"
                                    aria-hidden="true"
                            ></i>
                            <i
                                    v-else-if="scope.row.SOURCE===tableData.failure"
                                    class="el-icon-error red"
                                    aria-hidden="true"
                            ></i>
                            <i v-else class="el-icon-loading blur" aria-hidden="true"></i>
                        </div>
                        <p style="max-width:500px" class="red" v-if="scope.row.SOURCE===tableData.failure">错误信息:
                            {{scope.row.SOURCEerror}}</p>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        props: ["tableData"],
        data() {
            return {
                search: "",
                collectTableData: []
            };
        },
        watch: {
            tableData() {
                this.collectTableData = this.tableData.collectTableData;
            }
        }
    };
</script>

<style>
    .green {
        color: #67c23a;
    }

    .red {
        color: #f56c6c;
    }

    .blur {
        color: #409eff;
    }
</style>
