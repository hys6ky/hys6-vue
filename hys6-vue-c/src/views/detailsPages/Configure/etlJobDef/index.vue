<template>
<div class="etljob">
    <el-form :model="form" ref="form" class="demo-form-inlines" :inline="true">
        <el-col :span="12">
            <el-form-item label="作业名称">
                <el-autocomplete :fetch-suggestions="querySearch" size="mini" v-model="form.etl_job" clearable style="width:264px" placeholder="作业名称"></el-autocomplete>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="作业程序名称">
                <el-input size="mini" v-model="form.pro_name" style="width:264px" placeholder="作业程序名称"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="任务编号">
                <el-input size="mini" v-model="form.sub_sys_cd" style="width:264px" placeholder="任务编号"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="作业程序类型">
                <el-select size="mini" v-model="form.pro_type" style="width:200px" placeholder="选择程序类型" clearable>
                    <el-option v-for="item in addSelect.proType" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button class="searchBtn" size="mini" type="primary" @click="searchBtn">搜索
                </el-button>
            </el-form-item>
        </el-col>
    </el-form>
    <el-divider></el-divider>
    <el-row>
        <div class="subSystemdiv">
            <el-upload class="buttonStyle" accept=".xlsx" action="" :show-file-list="false" :auto-upload="false" :on-change="handleChange" :limit="1" :on-exceed="handleExceed" :fileList="fileList">
                <el-button size="mini" type="primary">导入数据</el-button>
            </el-upload>
            <el-button class="buttonStyle" size="mini" type="primary" @click="downloadModel">下载模板
            </el-button>
            <el-button class="buttonStyle" size="mini" type="primary" @click="handleAdd">新增
            </el-button>
            <el-button class="buttonStyle" size="mini" type="danger" @click="handleBatchDelete">批量删除
            </el-button>
        </div>
    </el-row>
    <el-table size="medium" ref="multipleTable" :data="tableData" tooltip-effect="dark" stripe border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align='center'>
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop="etl_sys_cd" label="工程编号" width="88" align='center'>
            <template slot-scope="scope">
                <span @click="gotoWorkId(scope.row.etl_sys_cd)" style="color:#409EFF;cursor:pointer "> {{scope.row.etl_sys_cd}}</span>
            </template>
        </el-table-column> -->
        <el-table-column show-overflow-tooltip prop="sub_sys_cd" label="任务编号" width="88" align='left'>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="etl_job" label="作业名称" align='left'>
            <template slot-scope="scope">
                <span @click="gotoWorkRely(scope.row.etl_job)" style="color:#409EFF;cursor:pointer "> {{scope.row.etl_job}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="etl_job_desc" label="作业描述" align='left'>
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop="pro_name" label="作业程序名称" width="110" align='center'>
        </el-table-column> -->
        <el-table-column show-overflow-tooltip prop="job_datasource" label="作业数据来源" width="110" align='left' />
        <el-table-column show-overflow-tooltip prop="dispFreq" width="80px" label="调度频率" align='left'>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="dispType" label="调度触发方式" width="130" align='left'>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="jobEffFlag" label="作业有效标志" width="110" align='left'>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="upd_time" label="定义时间" align='left'>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="todayDisp" label="当天是否调度" width="110" align='left'>
        </el-table-column>
        <el-table-column label="操作" align='center' width="150">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑
                </el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row);dialogDeleteVisible = true">删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-row :gutter="20" class="tabBtns">
        <el-pagination layout="total, sizes,prev, pager, next, jumper" style="float:right" :page-sizes="[5,10,20,25,50,100,1000]"  :page-size="pagesize" :total="pageLength" @current-change="handleCurrentChange" @size-change="handleSizeChange">
        </el-pagination>
    </el-row>
    <!-- 添加/修改任务模态框 -->
    <el-dialog :title="jobTitle" :visible.sync="dialogFormVisibleAdd" :width="screenWidth" height="1000px" v-if="this.formAdd.disp_freq != 'F' && this.formAdd.disp_type != 'D'" :before-close="beforeClosechange">
        <el-form :model="formAdd" ref="formAdd" height="1000px" class="demo-form-inline" label-position="right" :inline="true" label-width="110px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="工程编号" prop="etl_sys_cd" :rules="filter_rules([{required: true}])">
                        <el-input v-model="formAdd.etl_sys_cd" size="medium" style="width:180px;" autocomplete="off" placeholder="工程编号" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="任务编号" prop="sub_sys_cd" :rules="rule.selected">
                        <el-select v-model="formAdd.sub_sys_cd" placeholder="任务编号" clearable size="medium" style="width:185px;">
                            <el-option v-for="item in addSelect.project_no" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业名称" prop="etl_job" :rules="filter_rules([{required: true}])">
                        <el-input v-model="formAdd.etl_job" autocomplete="off" :disabled="disabledControl" placeholder="作业名称" size="medium" style="width:185px;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="作业描述" prop="etl_job_desc" :rules="filter_rules([{required: true}])">
                        <el-input v-model="formAdd.etl_job_desc" autocomplete="off" placeholder="作业描述" size="medium" style="width:185px;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业程序类型" prop="pro_type" :rules="rule.selected">
                        <el-select v-model="formAdd.pro_type" placeholder="--程序类型--" clearable size="medium" style="width:185px;">
                            <el-option v-for="item in addSelect.proType" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业程序目录" prop="pro_dic" :rules="filter_rules([{required: true}])">
                        <el-input v-model="formAdd.pro_dic" autocomplete="off" placeholder="作业程序目录" size="medium" style="width:185px;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="作业程序名称" prop="pro_name" :rules="filter_rules([{required: true}])">
                        <el-input v-model="formAdd.pro_name" autocomplete="off" placeholder="作业程序名称" size="medium" style="width:185px;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" class="workProgrammsDivFather">
                    <el-form-item label="作业程序参数" prop="pro_para">
                        <el-input v-model="formAdd.pro_para" clearable @focus="focusMenthods" @blur="blurMenthods" size="medium" style="width:185px;" placeholder="多个参数使用@分割"></el-input>
                    </el-form-item>
                    <div class="workProgrammsDiv" v-if="showHiddenOr">
                        <span class="workProgrammsDivSpan"> <span>参数</span> <i class="el-icon-close close" @click="closeShow"></i></span>
                        <p class="workProgramms" v-for="(item,index) in workhidden " @click="clickData(item.value)" :key="index">{{item.value}}</p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="日志目录" prop="log_dic" :rules="filter_rules([{required: true}])">
                        <el-input v-model="formAdd.log_dic" autocomplete="off" placeholder="日志目录" size="medium" style="width:185px;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="调度频率" prop="disp_freq" :rules="rule.selected">
                        <el-select v-model="formAdd.disp_freq" placeholder="--频率选择--" clearable size="medium" style="width:185px;">
                            <el-option v-for="item in addSelect.dispRate" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="调度时间位移" prop="disp_offset">
                        <el-input v-model="formAdd.disp_offset" autocomplete="off" placeholder="0" size="medium" style="width:185px;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="调度触发方式" prop="disp_type" :rules="rule.selected">
                        <el-select @change="changeValue" v-model="formAdd.disp_type" placeholder="--触发选择--" clearable size="medium" style="width:185px;">
                            <el-option v-for="item in addSelect.dispType" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="调度触发时间" prop="disp_time">
                        <el-time-picker v-model="formAdd.disp_time" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" placeholder="调度时间 hh:mm:ss" value-format="HH:mm:ss" format="HH:mm:ss" size="medium" style="width:185px;">
                        </el-time-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业优先级" prop="job_priority">
                        <el-input v-model="formAdd.job_priority" autocomplete="off" placeholder="0" size="medium" style="width:185px;"></el-input>
                        <el-tooltip class="item" effect="dark" content="作业优先级设置的数字越大越优先执行" placement="right">
                            <i class="fa fa-question-circle" aria-hidden="true"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业有效标志" prop="job_eff_flag" :rules="rule.selected">
                        <el-select v-model="formAdd.job_eff_flag" placeholder="--有效选择--" clearable size="medium" style="width:185px;">
                            <el-option v-for="item in addSelect.jobEfflag" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="当天是否调度" prop="today_disp" :rules="rule.selected">
                        <el-select v-model="formAdd.today_disp" placeholder="--调度选择--" clearable size="medium" style="width:185px;">
                            <el-option v-for="item in addSelect.todayDisp" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="成功后续作业" prop="success_job">
                        <el-input v-model="formAdd.success_job" autocomplete="off" placeholder="成功后续作业路径" size="medium" style="width:185px;"></el-input>
                        <el-tooltip style="clear ;margin-top: 10px;" placement="right" effect="dark" class="item">
                            <div slot="content">
                                请写完整的可执行命令，如执行shell请输入sh /home/xx/ss.sh
                            </div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="失败后续作业" prop="fail_job">
                        <el-input v-model="formAdd.fail_job" autocomplete="off" placeholder="失败后续作业路径" size="medium" style="width:185px;"></el-input>
                        <el-tooltip style="clear ;margin-top: 10px;" placement="right" effect="dark" class="item">
                            <div slot="content">
                                请写完整的可执行命令，如执行shell请输入sh /home/xx/ss.sh
                            </div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="作业数据来源" prop="job_datasource" :rules="rule.selected">
                        <el-select v-model="formAdd.job_datasource" placeholder="--调度选择--" clearable size="medium" style="width:185px;">
                            <el-option v-for="item in addSelect.ETLDataSource" :key="item.value" :label="item.value" :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-col :span="24">
                <el-form-item label="备注" prop="comments">
                    <div style="width:600px">
                        <el-input type="textarea" v-model="formAdd.comments" autocomplete="off" placeholder="备注"></el-input>
                    </div>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancleAdd" size="mini" type="danger">取消</el-button>
            <el-button type="primary" @click="saveAdd('formAdd')" size="mini">保存</el-button>
        </div>
    </el-dialog>
    <el-dialog :title="dependcyTitle" :visible.sync="dialogDeleteVisible" width="38%">
        <div slot="title" class="header-title">
            <span>
                <p>确认删除吗?</p>
                <p v-if="this.resource_count != 0 && this.dependcy_count != 0" >删除作业的同时也会删除作业依赖和作业资源!</p>
                <p v-if="this.resource_count == 0 && this.dependcy_count != 0" >删除作业的同时也会删除作业依赖!</p>
                <p v-if="this.resource_count != 0 && this.dependcy_count == 0" >删除作业的同时也会删除作业资源!</p>
            </span>
         </div>
        <div class="text-overflow">
            <el-button size="mini" style='float:right;margin-bottom:10px;' type="primary" @click="handleDelete1">确 定</el-button>
            <el-button size="mini" style='float:right;margin-bottom:10px;margin-right:10px;' @click="dialogDeleteVisible = false">取 消</el-button>&nbsp;
            <el-button size="mini" v-if="this.resource_count != 0" style='float:right;margin-bottom:10px;' type="info" @click="gotoJobResource">作业资源</el-button>
            <el-button size="mini" v-if="this.dependcy_count != 0" style='float:right;margin-bottom:10px;' type="success" @click="gotoWorkRely1">作业依赖</el-button>
        </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogdependcyVisible" width="38%">
        <div slot="title" class="header-title">
            <span>
                <p>确认删除吗?</p>
                <p v-if="this.resource_count1 != 0 && this.dependcy_count1 != 0" >删除作业的同时也会删除作业依赖和作业资源!</p>
                <p v-if="this.resource_count1 == 0 && this.dependcy_count1 != 0" >删除作业的同时也会删除作业依赖!</p>
                <p v-if="this.resource_count1 != 0 && this.dependcy_count1 == 0" >删除作业的同时也会删除作业资源!</p>
            </span>
         </div>
        <div class="text-overflow">
            <el-button size="mini" style='float:right;margin-bottom:10px;' type="primary" @click="handleBatchDelete1">确 定</el-button>
            <el-button size="mini" style='float:right;margin-bottom:10px;margin-right:10px;' @click="dialogdependcyVisible = false">取 消</el-button>&nbsp;
            <el-button size="mini" v-if="this.resource_count1 != 0" style='float:right;margin-bottom:10px;' type="info" @click="gotoJobResource1">作业资源</el-button>
            <el-button size="mini" v-if="this.dependcy_count1 != 0" style='float:right;margin-bottom:10px;' type="success" @click="gotoWorkRely2">作业依赖</el-button>
        </div>
    </el-dialog>
    <!-- 添加/修改任务模态框1 -->
    <el-dialog :title="jobTitle" :visible.sync="dialogFormVisibleAdd" width="85%" v-if="this.formAdd.disp_freq == 'F'" :before-close="beforeClosechange">
        <el-form :model="formAdd" ref="formAdd" class="demo-form-inline" :inline="true" label-width="110px" label-position="right">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="工程编号" prop="etl_sys_cd" :rules="filter_rules([{required: true}])">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.etl_sys_cd" autocomplete="off" placeholder="工程编号" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="任务编号" prop="sub_sys_cd" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.sub_sys_cd" placeholder="数据库调度(i)" clearable>
                            <el-option v-for="item in addSelect.project_no" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业名称" prop="etl_job" :rules="filter_rules([{required: true}])">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.etl_job" autocomplete="off" :disabled="disabledControl" placeholder="任务名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="作业描述" prop="etl_job_desc" :rules="filter_rules([{required: true}])">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.etl_job_desc" autocomplete="off" placeholder="作业描述"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业程序类型" prop="pro_type" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.pro_type" placeholder="--程序类型--" clearable>
                            <el-option v-for="item in addSelect.proType" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业程序目录" prop="pro_dic" :rules="filter_rules([{required: true}])">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.pro_dic" autocomplete="off" placeholder="作业程序目录"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="作业程序名称" prop="pro_name" :rules="filter_rules([{required: true}])">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.pro_name" autocomplete="off" placeholder="作业程序名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" class="workProgrammsDivFather">
                    <el-form-item label="作业程序参数" prop="pro_para">
                        <el-input v-model="formAdd.pro_para" @focus="focusMenthods" @blur="blurMenthods" clearable size="medium" style="width:185px;" placeholder="多个参数使用@分割"></el-input>
                    </el-form-item>
                    <div class="workProgrammsDiv" v-if="showHiddenOr">
                        <span class="workProgrammsDivSpan"> <span>参数</span> <i class="el-icon-close close" @click="closeShow"></i></span>
                        <p class="workProgramms" v-for="(item,index) in workhidden " @click="clickData(item.value)" :key="index">{{item.value}}</p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="日志目录" prop="log_dic" :rules="filter_rules([{required: true}])">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.log_dic" autocomplete="off" placeholder="日志目录"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="调度频率" prop="disp_freq" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.disp_freq" placeholder="--频率选择--" clearable @change="clears">
                            <el-option v-for="item in addSelect.dispRate" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="每隔(分)执行" prop="exe_frequency">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.exe_frequency" autocomplete="off" placeholder="每隔(分)执行"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="执行次数" prop="exe_num">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.exe_num" autocomplete="off" placeholder="执行次数"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="开始执行时间" prop="star_time" :rules="filter_rules([{required: true}])">
                        <el-date-picker size="medium" style="width:185px;" v-model="formAdd.star_time" type="datetime" placeholder="开始执行时间 hh:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="结束执行时间" prop="end_time" :rules="filter_rules([{required: true}])">
                        <el-date-picker size="medium" style="width:185px;" v-model="formAdd.end_time" type="datetime" placeholder="结束执行时间 hh:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业有效标志" prop="job_eff_flag" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.job_eff_flag" placeholder="--有效选择--" clearable>
                            <el-option v-for="item in addSelect.jobEfflag" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="当天是否调度" prop="today_disp" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.today_disp" placeholder="--调度选择--" clearable>
                            <el-option v-for="item in addSelect.todayDisp" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="成功后续作业" prop="success_job">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.success_job" autocomplete="off" placeholder="成功后续作业路径"></el-input>
                        <el-tooltip style="clear ;margin-top: 10px;" placement="right" content="请写完整的可执行命令，如执行shell请输入sh /home/xx/ss.sh" effect="dark" class="item">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="失败后续作业" prop="fail_job">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.fail_job" autocomplete="off" placeholder="失败后续作业路径"></el-input>
                        <el-tooltip style="clear ;margin-top: 10px;" placement="right" content="请写完整的可执行命令，如执行shell请输入sh /home/xx/ss.sh" effect="dark" class="item">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="作业数据来源" prop="job_datasource" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.job_datasource" placeholder="--调度选择--" clearable>
                            <el-option v-for="item in addSelect.ETLDataSource" :key="item.value" :label="item.value" :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-col :span="24">
                <el-form-item label="备注" prop="comments">
                    <div style="width:600px">
                        <el-input type="textarea" v-model="formAdd.comments" autocomplete="off" placeholder="备注"></el-input>
                    </div>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancleAdd1" size="mini" type="danger">取消</el-button>
            <el-button type="primary" @click="saveAdd1('formAdd')" size="mini">保存</el-button>
        </div>
    </el-dialog>
    <!-- 添加/修改任务模态框2 -->
    <el-dialog :title="jobTitle" :visible.sync="dialogFormVisibleAdd" width="85%" v-if="this.formAdd.disp_type == 'D'" :before-close="beforeClosechange">
        <el-form :model="formAdd" ref="formAdd" class="demo-form-inline" :inline="true" label-width="110px" label-position="right">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="工程编号" prop="etl_sys_cd" :rules="filter_rules([{required: true}])">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.etl_sys_cd" autocomplete="off" placeholder="工程编号" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="任务编号" prop="sub_sys_cd" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.sub_sys_cd" placeholder="数据库调度(i)" clearable>
                            <el-option v-for="item in addSelect.project_no" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业名称" prop="etl_job" :rules="filter_rules([{required: true}])">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.etl_job" autocomplete="off" :disabled="disabledControl" placeholder="任务名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="作业描述" prop="etl_job_desc" :rules="filter_rules([{required: true}])">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.etl_job_desc" autocomplete="off" placeholder="作业描述"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业程序类型" prop="pro_type" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.pro_type" placeholder="--程序类型--" clearable>
                            <el-option v-for="item in addSelect.proType" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业程序目录" prop="pro_dic" :rules="filter_rules([{required: true}])">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.pro_dic" autocomplete="off" placeholder="作业程序目录"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="作业程序名称" prop="pro_name" :rules="filter_rules([{required: true}])">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.pro_name" autocomplete="off" placeholder="作业程序名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" class="workProgrammsDivFather">
                    <el-form-item label="作业程序参数" prop="pro_para">
                        <el-input v-model="formAdd.pro_para" @focus="focusMenthods" @blur="blurMenthods" clearable size="medium" style="width:185px;" placeholder="多个参数使用@分割"></el-input>
                    </el-form-item>
                    <div class="workProgrammsDiv" v-if="showHiddenOr">
                        <span class="workProgrammsDivSpan"> <span>参数</span> <i class="el-icon-close close" @click="closeShow"></i></span>
                        <p class="workProgramms" v-for="(item,index) in workhidden " @click="clickData(item.value)" :key="index">{{item.value}}</p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="日志目录" prop="log_dic" :rules="filter_rules([{required: true}])">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.log_dic" autocomplete="off" placeholder="日志目录"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="调度频率" prop="disp_freq" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.disp_freq" placeholder="--频率选择--" clearable>
                            <el-option v-for="item in addSelect.dispRate" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="调度时间位移" prop="disp_offset">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.disp_offset" autocomplete="off" placeholder="0"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="调度触发方式" prop="disp_type" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" @change="changeValue" v-model="formAdd.disp_type" placeholder="--触发选择--" clearable>
                            <el-option v-for="item in addSelect.dispType" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="作业优先级" prop="job_priority">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.job_priority" autocomplete="off" placeholder="0"></el-input>
                        <el-tooltip class="item" effect="dark" content="作业优先级设置的数字越大越优先执行" placement="right">
                            <i class="fa fa-question-circle" aria-hidden="true"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业有效标志" prop="job_eff_flag" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.job_eff_flag" placeholder="--有效选择--" clearable>
                            <el-option v-for="item in addSelect.jobEfflag" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="当天是否调度" prop="today_disp" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.today_disp" placeholder="--调度选择--" clearable>
                            <el-option v-for="item in addSelect.todayDisp" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="上游工程名称" prop="pre_etl_sys_cd">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.pre_etl_sys_cd" autocomplete="off" placeholder="0" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="上游作业名">
                        <el-select v-model="formAdd.pre_etl_job" multiple :collapse-tags='true' size="medium" style="width:185px;" placeholder="上游作业名" @change="selectChange">
                            <el-option v-for="item in addSelect.preJobName" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="依赖是否有效" prop="status" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.status" placeholder="--有效选择--" clearable @change="selectChange">
                            <el-option v-for="item in addSelect.status" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="成功后续作业" prop="success_job">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.success_job" autocomplete="off" placeholder="成功后续作业路径"></el-input>
                        <el-tooltip style="clear ;margin-top: 10px;" placement="right" effect="dark" class="item">
                            <div slot="content">
                                请写完整的可执行命令，如执行shell请输入sh /home/xx/ss.sh
                            </div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="失败后续作业" prop="fail_job">
                        <el-input size="medium" style="width:185px;" v-model="formAdd.fail_job" autocomplete="off" placeholder="失败后续作业路径"></el-input>
                        <el-tooltip style="clear ;margin-top: 10px;" placement="right" effect="dark" class="item">
                            <div slot="content">
                                请写完整的可执行命令，如执行shell请输入sh /home/xx/ss.sh
                            </div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="作业数据来源" prop="job_datasource" :rules="rule.selected">
                        <el-select size="medium" style="width:185px;" v-model="formAdd.job_datasource" placeholder="--调度选择--" clearable>
                            <el-option v-for="item in addSelect.ETLDataSource" :key="item.value" :label="item.value" :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-col :span="24">
                <el-form-item label="备注" prop="comments">
                    <div style="width:600px;">
                        <el-input type="textarea" v-model="formAdd.comments" autocomplete="off" placeholder="备注"></el-input>
                    </div>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancleAdd2" size="mini" type="danger">取消</el-button>
            <el-button type="primary" @click="saveAdd2('formAdd')" size="mini">保存</el-button>
        </div>
    </el-dialog>
    <!-- 获取上传文件 -->
    <el-dialog title="导入作业数据" :visible.sync="dialogImportData" :before-close="importDatacancel">
        <span v-if="fileList != ''">确认导入 “ {{fileList[0].name}} ” </span>
        <div slot="footer" class="dialog-footer">
            <el-button @click="importDatacancel" size="mini" type="danger">取消</el-button>
            <el-button type="primary" @click="importData" :loading="loadingUpload" size="mini">保存</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import * as validator from "@/utils/validator";
import regular from "@/utils/regular";
import {execDownloadFileByModuleUrl, execUploadFileByModuleUrl} from "@/utils/executeRequest";
let arr = [];
export default {
    data() {
        return {
            fileList: [],
            sys_cd: '',
            form: {
                etl_job: '',
                pro_name: '',
                sub_sys_cd: '',
                pro_type: '',
            },
            workhidden: [{
                value: "#{txdate}"
            }, {
                value: "#{txdate_next}"
            }, {
                value: "#{txdate_pre}"
            }],
            tableData: [],
            listDatas: [],
            dialogDeleteVisible: false,
            etl_job: '',
            Today_Dispatch_Flag: [],
            Job_Effective_Flag: [],
            Dispatch_Type: [],
            Dispatch_Frequency: [],
            jobTitle: '',
            dependcyTitle: '',
            dependcyTitle1: '',
            temp: 'false',
            disabledControl: false,
            rule: validator.default,
            multipleSelection: [],
            dependcySelection: [],
            dialogFormVisibleAdd: false,
            dialogImportData: false,
            showHiddenOr: false,
            loadingUpload: false,
            formAdd: {
                etl_sys_cd: '',
                sub_sys_cd: '',
                etl_job: '',
                etl_job_desc: '',
                pro_type: '',
                pro_dic: '',
                pro_name: '',
                pro_para: '',
                log_dic: '',
                disp_freq: '',
                disp_offset: '',
                disp_type: '',
                disp_time: '',
                job_priority: '',
                job_eff_flag: '',
                today_disp: '',
                comments: '',
                exe_frequency: '',
                exe_num: '',
                star_time: '',
                end_time: '',
                pre_etl_sys_cd: '',
                pre_etl_job: [],
                status: '',
                job_datasource: '09',
            },
            addSelect: {
                project_no: [],
                proType: [],
                dispRate: [],
                dispType: [],
                jobEfflag: [],
                todayDisp: [],
                preJobName: [],
                status: [],
                ETLDataSource: []
            },
            deleteForm: {
                etl_sys_cd: '',
                etl_job: ''
            },
            tempForm: {
                old_disp_freq: '',
                old_pre_etl_job: [],
                old_dispatch_type: '',
            },
            pagesize: 5,
            currpage: 1,
            pageLength: 0,
            ETLDataSource: [],
            screenWidth: '85%',
            dependcy_count: '',
            dependcy_count1: '',
            resource_count: '',
            resource_count1: '',
            dialogdependcyVisible: false
        };
    },
    // watch: {
    //     windowWidth(val) {
    //         // let that = this;
    //         // console.log("实时屏幕宽度：", val, that.windowHeight);
    //     }
    // },
    created() {
      this.getCategoryItems();
    },
  mounted() {
        var that = this;
        // <!--把window.onresize事件挂在到mounted函数上-->
        window.onresize = () => {
            return (() => {
                window.fullWidth = document.documentElement.clientWidth;
                if (window.fullWidth > 1800) {
                    that.screenWidth = "70%"
                } else {
                    that.screenWidth = "85%"
                }
            })()
        };

        this.getCategoryItems();
        this.getSelect();
        this.sys_cd = sessionStorage.getItem('sys_cd');
        this.getProType();
        this.getJobName();
        if (this.$route.query.sub_sys_cd != undefined) { //判断从哪里来的
            this.form.sub_sys_cd = this.$route.query.sub_sys_cd;
            this.searchBtn();
        } else {
            this.getTable();
        }
    },
    methods: {
        //下拉框数据强制渲染
        selectChange() {
            this.$forceUpdate();
        },
        // 获取表格代码项
        getCategoryItems() {

          this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems', { //调度频率
                category: "Dispatch_Frequency"
            }).then(res => {
                this.Dispatch_Frequency = res.data;
            });
          this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems',{
                category: "Dispatch_Type"
            }).then(res => {
                this.Dispatch_Type = res.data;
            });
          this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems',{ //作业有效标志
                category: "Job_Effective_Flag"
            }).then(res => {
                this.Job_Effective_Flag = res.data;
            });
          this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems', { //是否当天调度
                category: "Today_Dispatch_Flag"
            }).then(res => {
                this.Today_Dispatch_Flag = res.data;
            });
          this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems', { // 作业数据来源
                category: "ETLDataSource"
            }).then(res => {
                this.ETLDataSource = res.data;
            });
        },
        //获取代码项
        getCode() {
            // this.getProType();
            this.getDispRate();
            this.getDispType();
            this.getJobFlag();
            this.getTodayDisp();
            this.getStatus();
            this.getETLDataSource();
            this.getPreJobName();
        },
        //任务编号下拉框数据
        getSelect() {
            let params = {};
            let arr = [];
            this.sys_cd = sessionStorage.getItem('sys_cd');
            params["etl_sys_cd"] = this.sys_cd;
            this.$executeRequest.execGetByModuleUrl('/jobconfig/searchEtlSubSys',params).then(res => {
                arr = res.data;
                arr.forEach((item) => {
                    item.label = item.sub_sys_desc + '(' + item.sub_sys_cd + ')';
                    item.value = item.sub_sys_cd;
                });
                this.addSelect.project_no = arr;
            });
        },
        // input框的历史信息
        querySearch(queryString, cb) {
            var res = this.listDatas;
            var results = queryString ? res.filter(this.createFilter(queryString)) : res;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (res) => {
                return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
            };
        },
        //获取作业名称/上游作业名称下拉框数据
        getJobName() {
            let params = {};
            let arr = [];
            let obj = {};
            params["etl_sys_cd"] = this.sys_cd;
            this.$executeRequest.execGetByModuleUrl('/jobconfig/searchEtlJob',params).then(res => {
                res.data.forEach((item) => {
                    obj.label = item;
                    obj.value = item;
                    arr.push(obj);
                    obj = {};
                });
                this.listDatas = arr;
            });
        },
        //作业程序类型下拉框数据
        getProType() {
            let params = {};
            let arr = [];
            params["category"] = "Pro_Type";
          this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems',params).then(res => {
                arr = res.data;
                arr.forEach((item) => {
                    item.label = item.value;
                    item.value = item.code;
                });
                this.addSelect.proType = arr;
            });
        },
        //调度频率下拉框数据
        getDispRate() {
            let params = {};
            let arr = [];
            params["category"] = "Dispatch_Frequency";
            this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems',params).then(res => {
                arr = res.data;
                arr.forEach((item) => {
                    item.label = item.value;
                    item.value = item.code;
                });
                this.addSelect.dispRate = arr;
            });
        },
        //调度触发方式下拉框数据
        getDispType() {
            let params = {};
            let arr = [];
            params["category"] = "Dispatch_Type";
          this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems',params).then(res => {
                arr = res.data;
                arr.forEach((item) => {
                    item.label = item.value;
                    item.value = item.code;
                });
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].code == 'A' || arr[i].code == 'B') {
                        arr.splice(i, 1);
                        i--
                    }
                }
                this.addSelect.dispType = arr;
            });
        },
        //作业有效标志下拉框数据
        getJobFlag() {
            let params = {};
            let arr = [];
            params["category"] = "Job_Effective_Flag";
          this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems',params).then(res => {
                arr = res.data;
                arr.forEach((item) => {
                    item.label = item.value;
                    item.value = item.code;
                });
                this.addSelect.jobEfflag = arr;
            });
        },
        //当天是否调度下拉框数据
        getTodayDisp() {
            let params = {};
            let arr = [];
            params["category"] = "Today_Dispatch_Flag";
          this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems',params).then(res => {
                arr = res.data;
                arr.forEach((item) => {
                    item.label = item.value;
                    item.value = item.code;
                });
                this.addSelect.todayDisp = arr;
            });
        },
        //依赖是否有效下拉框数据
        getStatus() {
            let params = {};
            let arr = [];
            params["category"] = "Status";
          this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems',params).then(res => {
                arr = res.data;
                arr.forEach((item) => {
                    item.label = item.value;
                    item.value = item.code;
                });
                this.addSelect.status = arr;
            });
        },
        // 作业数据来源
        getETLDataSource() {
          this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems',{
                category: "ETLDataSource"
            }).then(res => {
                if (res && res.success) {
                    this.addSelect.ETLDataSource = res.data;
                }
            });
        },
        //上游作业名下拉框数据
        getPreJobName() {
            let params = {};
            let arr = [];
            params["etl_sys_cd"] = this.sys_cd;
            this.$executeRequest.execGetByModuleUrl('/jobconfig/searchEtlJob',params).then(res => {
                res.data.forEach((item) => {
                    let obj = {};
                    obj.label = item;
                    obj.value = item;
                    arr.push(obj);
                });
                this.addSelect.preJobName = arr;
            });
        },
        //刷新表格
        getTable() {
            let params = {};
            this.sys_cd = sessionStorage.getItem('sys_cd');
            params["etl_sys_cd"] = this.sys_cd;
            params["sub_sys_cd"] = this.form.sub_sys_cd;
            params["etl_job"] = this.form.etl_job;
            params["currPage"] = this.currpage;
            params["pageSize"] = this.pagesize;
            this.searchEtlJobDefByPage(params);
        },
        // 获取表格代码项
        getCodeItems(val) {
            if (val == "Dispatch_Frequency") { //调度频率
              this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems', {
                    category: 'Dispatch_Frequency'
                }).then(res => {
                    this.Dispatch_Frequency = res.data;
                })
            } else if (val == "Dispatch_Type") { //触发方式
              this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems', {
                    category: 'Dispatch_Type'
                }).then(res => {
                    this.Dispatch_Type = res.data;
                })
            } else if (val == "Job_Effective_Flag") { //作业有效标志
              this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems', {
                    category: 'Job_Effective_Flag'
                }).then(res => {
                    this.Job_Effective_Flag = res.data;
                })
            } else if (val == "Today_Dispatch_Flag") { //是否当天调度
              this.$executeRequest.execGetByUrl('/A/codes/getCategoryItems', {
                    category: 'Today_Dispatch_Flag'
                }).then(res => {
                    this.Today_Dispatch_Flag = res.data;
                })
            }
        },

        //清空模态框切换残余数据
        clears() {
            this.formAdd.disp_type = '';
        },
        //搜索按钮
        searchBtn() {
            let params = {};
            params["etl_sys_cd"] = this.sys_cd;
            params["pro_type"] = this.form.pro_type;
            params["etl_job"] = this.form.etl_job;
            params["pro_name"] = this.form.pro_name;
            params["sub_sys_cd"] = this.form.sub_sys_cd;
            params["currPage"] = this.currpage;
            params["pageSize"] = this.pagesize;
            this.searchEtlJobDefByPage(params);
        },
        // 获取表格数据封装
        searchEtlJobDefByPage(params) {
            this.$executeRequest.execGetByModuleUrl('/jobconfig/searchEtlJobDefByPage',params).then(res => {
                let dates = res.data.etlJobDefList;
                this.pageLength = res.data.totalSize;
                //作业有效标志
                dates.forEach((item) => {
                    this.Job_Effective_Flag.forEach(val => {
                        if (item.job_eff_flag == val.code) {
                            item.jobEffFlag = val.value;
                        }
                    });

                    //调度频率
                    this.Dispatch_Frequency.forEach(val => {
                        if (item.disp_freq == val.code) {
                            item.dispFreq = val.value;
                        }
                    })

                    //调度触发方式
                    this.Dispatch_Type.forEach(val => {
                        if (item.disp_type == val.code) {
                            item.dispType = val.value;
                        }
                    })
                    //是否当天调度
                    this.Today_Dispatch_Flag.forEach(val => {
                        if (item.today_disp == val.code) {
                            item.todayDisp = val.value;
                        }
                    })
                    //作业数据来源
                    this.ETLDataSource.forEach(val => {
                        if (item.job_datasource == val.code) {
                            item.job_datasource = val.value;
                        }
                    })
                });
                this.tableData = dates;
            });
        },
        //选中的数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //新增按钮
        handleAdd() {
            this.getCode();
            this.jobTitle = '添加作业';
            this.dialogFormVisibleAdd = true;
            this.formAdd.etl_sys_cd = this.sys_cd;
            this.formAdd.pre_etl_sys_cd = this.sys_cd;
        },
        //批量删除按钮
        handleBatchDelete() {
            if (this.multipleSelection.length == 0) {
                this.$Msg.customizTitle("请选择需要删除的数据", "warning");
            } else {
                this.dialogdependcyVisible = true;
                this.multipleSelection.forEach((item) => {
                    this.dependcySelection.push(item.etl_job);
                });
                this.searchJobDependency1();
            }

        },
        searchJobDependency1(){
            var data = { etl_sys_cd: this.sys_cd , etl_job: this.dependcySelection };
            this.$executeRequest.execGetByModuleUrl('/jobconfig/searchJobDependency',data).then(res => {
                this.dependcy_count1 = res.data.dependcy_count;
                this.resource_count1 = res.data.resource_count;
                this.dependcySelection=[];
            })
        },
        replaceLine(string){
            string.replace(/\?/g, '.\n')
        },
        handleBatchDelete1() {
            let arr = [];
            this.multipleSelection.forEach((item) => {
                arr.push(item.etl_job);
            });
            let params = new FormData();
            params.append("etl_sys_cd", this.sys_cd);
            params.append("etl_job", JSON.stringify(arr));
            this.$executeRequest.execUploadFileByModuleUrl('/jobconfig/batchDeleteEtlJobDef',params).then(res => {
                if (res && res.success) {
                    this.$Msg.customizTitle("批量删除成功", "success");
                    this.dialogdependcyVisible = false;
                    this.getTable();
                }
            })
        },
        //编辑按钮
        handleEdit(index, row) {
            this.getCode();
            let params = {};
            let arr = [];
            this.disabledControl = true;
            params["etl_sys_cd"] = row.etl_sys_cd;
            params["etl_job"] = row.etl_job;
            this.$executeRequest.execGetByModuleUrl('/jobconfig/searchEtlJobDefById',params).then(res => {
                this.dialogFormVisibleAdd = true;
                this.jobTitle = '修改作业';
                this.formAdd = res.data;
                this.formAdd.pre_etl_sys_cd = this.sys_cd;
                this.tempForm.old_disp_freq = res.data.disp_freq;
                if (res.data.dependencyList.length != 0) {
                    let arr = [];
                    let status = '';
                    res.data.dependencyList.forEach((item) => {
                        arr.push(item.pre_etl_job);
                        status = item.status;
                    });
                    this.formAdd.pre_etl_job = arr;
                    this.formAdd.status = status;
                    this.tempForm.old_pre_etl_job = arr;
                } else {
                    this.tempForm.old_pre_etl_job = [];
                }
                if (res.data.disp_type) {
                    this.tempForm.old_dispatch_type = res.data.disp_type;
                } else {
                    this.tempForm.old_dispatch_type = '';
                }
            });
        },
        //删除按钮
        handleDelete(index, row) {
            this.etl_sys_cd = row.etl_sys_cd;
            this.etl_job = row.etl_job;
            this.searchJobDependency();
        },
        searchJobDependency(){
            var data = { etl_sys_cd: this.etl_sys_cd , etl_job: this.etl_job };
            this.$executeRequest.execGetByModuleUrl('/jobconfig/searchJobDependency',data).then(res => {
                this.dependcy_count = res.data.dependcy_count;
                this.resource_count = res.data.resource_count;
            })
        },
        handleDelete1(index, row) {
            this.deleteForm.etl_sys_cd = this.etl_sys_cd;
            this.deleteForm.etl_job = this.etl_job;
            let params = {};
            params["etl_sys_cd"] = this.deleteForm.etl_sys_cd;
            params["etl_job"] = this.deleteForm.etl_job;
            this.$executeRequest.execGetByModuleUrl('/jobconfig/deleteEtlJobDef',params).then(res => {
                if (res.code == 999) {
                    this.$Msg.customizTitle("删除成功", "success");
                    this.dialogDeleteVisible = false;
                    this.getTable();
                }
            })
        },
        //新增/修改模态框取消按钮
        cancleAdd() {
            if (this.jobTitle == "修改作业") {
                this.getTable();
                this.disabledControl = true;
            }
            this.showHiddenOr = false;
            this.disabledControl = false;
            this.dialogFormVisibleAdd = false;
            this.formAdd = {};
            this.tempForm = {};
            this.$refs.formAdd.resetFields();
        },
        beforeClosechange() {
            if (this.jobTitle == "修改作业") {
                this.disabledControl = true;
            }
            this.showHiddenOr = false;
            this.disabledControl = false;
            this.dialogFormVisibleAdd = false;
            this.formAdd = {};
            this.$refs.formAdd.resetFields();
        },
        //新增/修改模态框保存按钮
        saveAdd(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let params = {};
                    params["etl_sys_cd"] = this.sys_cd;
                    params["sub_sys_cd"] = this.formAdd.sub_sys_cd;
                    params["etl_job"] = this.formAdd.etl_job;
                    params["etl_job_desc"] = this.formAdd.etl_job_desc;
                    params["pro_type"] = this.formAdd.pro_type;
                    params["pro_dic"] = this.formAdd.pro_dic;
                    params["pro_name"] = this.formAdd.pro_name;
                    params["pro_para"] = this.formAdd.pro_para;
                    params["log_dic"] = this.formAdd.log_dic;
                    params["disp_freq"] = this.formAdd.disp_freq;
                    if (this.formAdd.disp_offset == '') {
                        this.formAdd.disp_offset = null;
                    }
                    params["disp_offset"] = this.formAdd.disp_offset;
                    params["disp_type"] = this.formAdd.disp_type;
                    params["disp_time"] = this.formAdd.disp_time;
                    if (this.formAdd.job_priority == '') {
                        this.formAdd.job_priority = null;
                    }
                    params["job_priority"] = this.formAdd.job_priority;
                    params["job_eff_flag"] = this.formAdd.job_eff_flag;
                    params["today_disp"] = this.formAdd.today_disp;
                    params["success_job"] = this.formAdd.success_job;
                    params["fail_job"] = this.formAdd.fail_job;
                    params["job_datasource"] = this.formAdd.job_datasource;
                    params["comments"] = this.formAdd.comments;
                    params['pre_etl_job'] = this.formAdd.pre_etl_job;
                    params["old_disp_freq"] = this.tempForm.old_disp_freq;
                    params["old_pre_etl_job"] = this.tempForm.old_pre_etl_job;
                    params["old_dispatch_type"] = this.tempForm.old_dispatch_type;

                    if (this.jobTitle == '添加作业') {
                        this.$executeRequest.execGetByModuleUrl('/jobconfig/saveEtlJobDef',params).then(res => {
                            if (res && res.success) {
                                this.$Msg.customizTitle("添加成功", "success");
                                this.getTable();
                                this.dialogFormVisibleAdd = false;
                                this.formAdd = {};
                                this.$refs.formAdd.resetFields();
                            }
                        });
                    } else if (this.jobTitle == '修改作业') {
                        this.$executeRequest.execGetByModuleUrl('/jobconfig/updateEtlJobDef',params).then(res => {
                            if (res && res.success) {
                                this.$Msg.customizTitle("修改成功", "success");
                                this.getTable();
                                this.dialogFormVisibleAdd = false;
                                this.formAdd = {};
                                this.tempForm = {};
                                this.$refs.formAdd.resetFields();
                            }
                        });
                    }
                }
            })
        },
        //新增/修改模态框1取消按钮
        cancleAdd1() {
            if (this.jobTitle == "修改作业") {
                this.getTable();
                this.disabledControl = true;
            }
            this.showHiddenOr = false;
            this.disabledControl = false;
            this.dialogFormVisibleAdd = false;
            this.formAdd = {};
            this.$refs.formAdd.resetFields();
        },
        //新增/修改模态框1保存按钮
        saveAdd1(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let params = {};
                    params["etl_sys_cd"] = this.sys_cd;
                    params["sub_sys_cd"] = this.formAdd.sub_sys_cd;
                    params["etl_job"] = this.formAdd.etl_job;
                    params["etl_job_desc"] = this.formAdd.etl_job_desc;
                    params["pro_type"] = this.formAdd.pro_type;
                    params["pro_dic"] = this.formAdd.pro_dic;
                    params["pro_name"] = this.formAdd.pro_name;
                    params["pro_para"] = this.formAdd.pro_para;
                    params["log_dic"] = this.formAdd.log_dic;
                    params["disp_freq"] = this.formAdd.disp_freq;
                    params["exe_frequency"] = this.formAdd.exe_frequency;
                    params["exe_num"] = this.formAdd.exe_num;
                    params["star_time"] = this.formAdd.star_time;
                    params["end_time"] = this.formAdd.end_time;
                    params["job_eff_flag"] = this.formAdd.job_eff_flag;
                    params["today_disp"] = this.formAdd.today_disp;
                    params["success_job"] = this.formAdd.success_job;
                    params["fail_job"] = this.formAdd.fail_job;
                    params["job_datasource"] = this.formAdd.job_datasource;
                    params["comments"] = this.formAdd.comments;
                    params["old_disp_freq"] = this.tempForm.old_disp_freq;
                    params["old_pre_etl_job"] = this.tempForm.old_pre_etl_job;
                    params["old_dispatch_type"] = this.tempForm.old_dispatch_type;
                    if (this.jobTitle == '添加作业') {
                        this.$executeRequest.execGetByModuleUrl('/jobconfig/saveEtlJobDef',params).then(res => {
                            if (res && res.success) {
                                this.$Msg.customizTitle("添加成功", "success");
                                this.getTable();
                                this.dialogFormVisibleAdd = false;
                                this.formAdd = {};
                            }

                        });
                    } else if (this.jobTitle == '修改作业') {
                        this.$executeRequest.execGetByModuleUrl('/jobconfig/updateEtlJobDef',params).then(res => {
                            if (res && res.success) {
                                this.$Msg.customizTitle("修改成功", "success");
                                this.getTable();
                                this.dialogFormVisibleAdd = false;
                                this.formAdd = {};
                            }

                        });
                    }
                }
            })
        },
        //新增/修改模态框2取消按钮
        cancleAdd2() {
            if (this.jobTitle == "修改作业") {
                this.getTable();
                this.disabledControl = true;
            }
            this.showHiddenOr = false;
            this.disabledControl = false;
            this.dialogFormVisibleAdd = false;
            this.formAdd = {};

            this.$refs.formAdd.resetFields();
        },
        //新增/修改模态框2保存按钮
        saveAdd2(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let params = {};
                    params["etl_sys_cd"] = this.sys_cd;
                    params["sub_sys_cd"] = this.formAdd.sub_sys_cd;
                    params["etl_job"] = this.formAdd.etl_job;
                    params["etl_job_desc"] = this.formAdd.etl_job_desc;
                    params["pro_type"] = this.formAdd.pro_type;
                    params["pro_dic"] = this.formAdd.pro_dic;
                    params["pro_name"] = this.formAdd.pro_name;
                    params["pro_para"] = this.formAdd.pro_para;
                    params["log_dic"] = this.formAdd.log_dic;
                    params["disp_freq"] = this.formAdd.disp_freq;
                    if (this.formAdd.disp_offset == '') {
                        this.formAdd.disp_offset = null;
                    }
                    params["disp_offset"] = this.formAdd.disp_offset;
                    params["disp_type"] = this.formAdd.disp_type;
                    if (this.formAdd.job_priority == '') {
                        this.formAdd.job_priority = null;
                    }
                    params["job_priority"] = this.formAdd.job_priority;
                    params["job_eff_flag"] = this.formAdd.job_eff_flag;
                    params["today_disp"] = this.formAdd.today_disp;
                    params["success_job"] = this.formAdd.success_job;
                    params["fail_job"] = this.formAdd.fail_job;
                    params["pre_etl_sys_cd"] = this.formAdd.pre_etl_sys_cd;
                    params["pre_etl_job"] = this.formAdd.pre_etl_job;
                    params["status"] = this.formAdd.status;
                    params["job_datasource"] = this.formAdd.job_datasource;
                    params["comments"] = this.formAdd.comments;
                    params["old_disp_freq"] = this.tempForm.old_disp_freq;
                    params["old_pre_etl_job"] = this.tempForm.old_pre_etl_job;
                    params["old_dispatch_type"] = this.tempForm.old_dispatch_type;
                    if (this.jobTitle == '添加作业') {
                        this.$executeRequest.execGetByModuleUrl('/jobconfig/saveEtlJobDef',params).then(res => {
                            if (res && res.success) {
                                this.getTable();
                                this.$Msg.customizTitle("添加成功", "success");
                                this.dialogFormVisibleAdd = false;
                                this.formAdd = {};
                            }
                        });
                    } else if (this.jobTitle == '修改作业') {
                        this.$executeRequest.execGetByModuleUrl('/jobconfig/updateEtlJobDef',params).then(res => {
                            if (res && res.success) {
                                this.getTable();
                                this.$Msg.customizTitle("修改成功", "success");
                                this.dialogFormVisibleAdd = false;
                                this.formAdd = {}
                            };
                        });
                    }
                }
            })
        },
        //分页方法
        handleCurrentChange(cpage) {
            this.currpage = cpage;
            this.getTable();
        },
        handleSizeChange(psize) {
            this.pagesize = psize;
            this.getTable();
        },
        //文件超出个数限制时的钩子
        handleExceed(files, fileList) {
            this.$Msg.customizTitle("只能选择一个文件", "warning");
        },
        // 获取上传的文件详情
        handleChange(file, fileList) {
            this.fileList = fileList;
            if (fileList.length != 0) {
                this.dialogImportData = true;
            } else {
                this.dialogImportData = false;
            }
            arr = fileList;
        },
        // 取消数据导入
        importDatacancel() {
            this.dialogImportData = false;
            this.fileList = [];
            this.$Msg.customizTitle("已取消导入数据", "info");
        },
        //导入数据按钮
        importData() {
            if (arr.length > 0) {
                this.loadingUpload = true;
                let param = new FormData() // 创建form对象
                for (let i = 0; i < arr.length; i++) {
                    param.append('file', arr[i].raw);
                }
                param.append('table_name', 'etl_job_def');
                this.$executeRequest.execUploadFileByModuleUrl('/jobconfig/uploadExcelFile',param).then(res => {
                    if (res && res.success) {
                        this.$Msg.customizTitle("导入数据成功", "success");
                        this.getTable();
                        this.fileList = [];
                        this.dialogImportData = false;
                        this.loadingUpload = false;
                    } else {
                        this.loadingUpload = false;
                    }
                });
            } else {
                this.$Msg.customizTitle("请选择上传文件", "warning");
            }

        },
        //下载按钮
        downloadModel() {
            let that = this;
            this.$executeRequest.execGetByModuleUrl('/jobconfig/generateExcel',{
                etl_sys_cd: that.$route.query.etl_sys_cd,
                tableName: 'etl_job_def'
            }).then(res => {
                if (res && res.success) {
                    that.downloadFile(res.data)
                }
            })
        },
        // 下载模板表格
        downloadFile(val) {
            this.$executeRequest.execDownloadFileByModuleUrl('/jobconfig/downloadFile',{
                fileName: val
            }).then(res => {
                this.filename = val;
                this.$file.fileDownload(res, val);
            })
        },
        // 获取点击作业程序参数下拉值
        clickData(val) {
            // 赋值
            if (this.formAdd.pro_para.length < 1) {
                this.formAdd.pro_para = val;
            } else if (this.formAdd.pro_para == "@" && this.formAdd.pro_para.length == 1) {
                this.formAdd.pro_para = val;
            } else {
                this.formAdd.pro_para += val;
            }
            this.showHiddenOr = false;
        },
        // 获取键盘监听事件
        keyCodeForEventup(e) {
            let self = this;
            if (e.shiftKey == 0 && e.key == "2") {
                self.showHiddenOr = true;
            }
        },
        keyCodeForEventdown(e) {
            let self = this;
            if (e.shiftKey == 1 && e.key == "Process" || e.shiftKey == 1 && e.key == "@") {
                self.showHiddenOr = true;
            }
        },
        // 作业程序参数聚焦
        focusMenthods() {
            window.addEventListener('keyup', this.keyCodeForEventup);
            window.addEventListener('keydown', this.keyCodeForEventdown);
        },
        // 作业程序参数失焦
        blurMenthods() {
            window.removeEventListener('keyup', this.keyCodeForEventup);
            window.removeEventListener('keydown', this.keyCodeForEventdown);
        },
        // 关闭参数选择栏
        closeShow() {
            this.showHiddenOr = false;
        },
        // 调度触发方式控制依赖是否有效
        changeValue(val) {
            if (val == "D") {
                this.formAdd.status = "T"
            } else {
                this.formAdd.status = ""
            }
        },
        gotoWorkRely(val) { //根据作业名称跳转作业依赖
            this.$router.push({
                name: 'etlDependency',
                query: {
                    name: '/etlDependency',
                    dec: this.$Base64.encode('作业依赖'),
                    etl_sys_name: this.$route.query.etl_sys_name,
                    etl_sys_cd: this.$route.query.etl_sys_cd,
                    etl_job: val
                }
            });
            this.$emit('viewIn', '/etlDependency', '作业依赖');
        },
        gotoWorkRely1() { //根据作业名称跳转作业依赖
            this.$router.push({
                name: 'etlDependency',
                query: {
                    name: '/etlDependency',
                    dec: this.$Base64.encode('作业依赖'),
                    etl_sys_name: this.$route.query.etl_sys_name,
                    etl_sys_cd: this.$route.query.etl_sys_cd,
                    etl_job: this.etl_job
                }
            });
            this.$emit('viewIn', '/etlDependency', '作业依赖');
        },
        gotoWorkRely2() { //根据作业名称跳转作业依赖
            var arr = [];
            this.multipleSelection.forEach(item => {
                arr.push(item.etl_job);
            })
            this.$router.push({
                path: '/etlDependency',
                query: {
                    name: "etlJobDef",
                    etl_sys_name: this.$route.query.etl_sys_name,
                    etl_sys_cd: this.$route.query.etl_sys_cd,
                    etl_job: JSON.stringify(arr)
                }
            });
            this.$emit('viewIn', '/etlDependency', '作业依赖');
        },
        gotoJobResource() { //根据作业名称跳转作业依赖配置页面
            this.$router.push({
                name: 'resourcesUsage',
                query: {
                    name: '/resourcesUsage',
                    dec: this.$Base64.encode('作业资源分配'),
                    etl_job: this.etl_job
                }
            });
            this.$emit('viewIn', '/resourcesUsage', '作业资源分配');
        },
        gotoJobResource1() { //根据作业名称跳转作业依赖配置页面
            var arr = [];
            this.multipleSelection.forEach(item => {
                arr.push(item.etl_job);
            })
            this.$router.push({
                name: 'resourcesUsage',
                query: {
                    name: 'etlJobDef',
                    dec: this.$Base64.encode('作业资源分配'),
                    etl_job: JSON.stringify(arr)
                }
            });
            this.$emit('viewIn', '/resourcesUsage', '作业资源分配');
        },
        gotoWorkId() { // 返回任务页面
            this.$router.push({
                name: 'menus',
                query: {
                    name: '/subSystem',
                    dec: this.$Base64.encode('任务'),
                    etl_sys_name: this.$route.query.etl_sys_name,
                    etl_sys_cd: this.$route.query.etl_sys_cd,
                }
            });
            this.$emit('viewIn', '/subSystem', '任务');
        }
    },
};
</script>

<style scoped>
.tabBtns {
    margin-top: 15px;
}

.el-col {
    margin-bottom: -20px;
}

.buttonStyle {
    display: block;
    float: left;
    margin-right: 10px;
    margin-left: 0px;
}

.subSystemdiv {
    float: right;
    margin-bottom: 14px;
}

.demo-form-inlines {
    height: 75px;
}

.searchBtn {
    margin-left: 10px;
}

.etljob>>>.el-select__tags {
    white-space: nowrap;
    overflow: hidden;
}

.workProgramms {
    width: 194px;
    height: 20px;
    font-size: 16px;
    cursor: pointer;
    padding-left: 8px;
}

.workProgramms:hover {
    color: #409EFF;
}

.text-overflow {
    display: block;
    word-break: keep-all;
    /* 不换行 */
    white-space: nowrap;
    /* 不换行 */
    overflow: hidden;
}

.workProgrammsDiv {
    padding: 4px;
    position: absolute;
    z-index: 10000;
    background: #fff;
    left: 150px;
    top: 40px;
    border-radius: 6px;
    border: 1px solid #e6e6e6;
    border-top: none;
    columns: black;
}

.workProgrammsDivFather {
    position: relative;
}

.workProgrammsDivSpan {
    padding-left: 4px;
    display: block;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    border-bottom: 1px solid #e6e6e6;
}

.close {
    cursor: pointer;
    float: right;
}
</style><style>
.el-autocomplete-suggestion li {
    overflow: visible;
    /* text-overflow: ellipsis; */
}
</style>
