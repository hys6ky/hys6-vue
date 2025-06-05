<template>
    <el-row>
        <i class="el-icon-document" style="font-size: 18px;text-align: center;color: #2196f3;"><span>数据补录审批</span></i>
        <el-divider></el-divider>
        <ByQuickSearch
          :formItems="formItems"
          :extraButton="extraButton"
          @search="click_query"
          @reset = "click_reset"
          @btnClick="btnClick"
        ></ByQuickSearch>
<!--        <el-form :inline="true">-->
<!--            <el-form-item label="项目名称" style="margin-left: 10px;">-->
<!--                <el-input v-model="query.proName" size="small"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="补录类型" style="margin-left: 10px;">-->
<!--                <el-select v-model="query.dfType" size="small">-->
<!--                    <el-option v-for="item in defau.dfTypeOptions" :key="item.code" :label="item.value" :value="item.code">-->
<!--                    </el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="审批类型" style="margin-left: 10px;">-->
<!--                <el-select v-model="query.dfAppState" size="small">-->
<!--                    <el-option v-for="item in defau.dfAppStateOptions" :key="item.code" :label="item.value" :value="item.code">-->
<!--                    </el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="提交时间" style="margin-left: 10px;">-->
<!--                <el-date-picker format="yyyy-MM-dd" value-format="yyyyMMdd" v-model="query.submitStartDate" type="date"-->
<!--                    placeholder="选择日期" size="small"></el-date-picker>-->
<!--                &#45;&#45;-->
<!--                <el-date-picker format="yyyy-MM-dd" value-format="yyyyMMdd" v-model="query.submitEndDate" type="date"-->
<!--                    placeholder="选择日期" size="small"></el-date-picker>-->

<!--            </el-form-item>-->
<!--            <el-form-item style="float: right;">-->
<!--                <el-button @click="click_query" size="mini" type="primary">查询</el-button>-->
<!--                <el-button @click="click_reset" size="mini" type="primary">重置</el-button>-->
<!--                <el-button @click="click_passList" size="mini" type="primary">通过</el-button>-->
<!--                <el-button @click="click_refuseList" size="mini" type="danger">拒绝</el-button>-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--            </el-form-item>-->
<!--        </el-form>-->
        <ByTable
          :tableData="tableData"
          :columnArr="columnArr"
          :pagination="pagination"
          @handleMultiple="handleMultiple"
          @operateItem="operateItem"
          @sizeChange = "pageSizeChange"
          @currentChange="pageCurrentChange"
        ></ByTable>
<!--        <el-table :data="tableData" tooltip-effect="dark" stripe border style="width: 100%" ref="multipleTable">-->
<!--            <el-table-column type="selection" label="" width="55">-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="pro_name" label="项目名称" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="df_type" label="补录类型" :formatter="formatDfType" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="submit_user" label="提交人" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="submit_date" label="提交时间" :formatter="formatDateTime" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="submit_state" label="审批状态" :formatter="formatDfAppState" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="table_count" label="补录数量" show-overflow-tooltip align='center'>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="操作" show-overflow-tooltip align='center'>-->
<!--                <template slot-scope="scope">-->
<!--                    <el-button @click="click_view(scope.row)" type="text" size="small">查看</el-button>-->
<!--                    <el-button v-if="scope.row.submit_state == 1" @click="click_pass(scope.row)" type="text" size="small">通过</el-button>-->
<!--                    <el-button v-if="scope.row.submit_state == 1" @click="click_refuse(scope.row)" type="text" size="small">拒绝</el-button>-->
<!--                </template>-->
<!--            </el-table-column>-->

<!--        </el-table>-->
<!--        <div class="block">-->
<!--            <el-pagination style="text-align: center;" @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="page.current"-->
<!--                :page-sizes="page.pageSizes" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"-->
<!--                :total="page.total">-->
<!--            </el-pagination>-->
<!--        </div>-->
        <ByModel
          modelTitle="审批意见"
          :visible.sync="isDialogShow"
          modelWidth="40%"
        >
          <ByModelForm
              :formData="dialogForm"
              :formItems="ModelFormItems"
              :formConfig="formConfig"
          >
          </ByModelForm>
          <template  slot="modalFoot">
            <el-button type="primary" @click="submitDialogForm()">提交</el-button>
            <el-button @click="cancelDialogForm()">取消</el-button>
          </template>
        </ByModel>
<!--        <el-dialog title="审批意见" :visible.sync="isDialogShow" width="30%">-->
<!--            <el-form :model="dialogForm" :rules="dialogFormRules">-->
<!--                <el-form-item label="审批意见" prop="audit_opinion">-->
<!--                    <el-input type="textarea" v-model="dialogForm.audit_opinion"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="备注">-->
<!--                    <el-input type="textarea" v-model="dialogForm.audit_remarks"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item>-->
<!--                    <el-button type="primary" @click="submitDialogForm()">提交</el-button>-->
<!--                    <el-button @click="cancelDialogForm()">取消</el-button>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--        </el-dialog>-->
    </el-row>
</template>
<script>
import {
  formItems,
  extraButton,
  columnArr,
  ModelFormItems,
  formConfig,
} from './mock'
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import ByTable from "@/components/global/ByTable.vue";
import ByModel from "@/components/global/ByModel.vue";
import ByModelForm from "@/components/global/ByModelForm.vue";
export default {
  components: {ByModelForm, ByModel, ByTable, ByQuickSearch},
    data() {
        return {
            formItems,
            extraButton,
            columnArr,
            row:{},
            pagination:{
                total : 0,
                pageNum : 1,
                pageSize : 10,
                pageSizes : [10, 50, 100, 200]
            },
          ModelFormItems,
          formConfig,
            // 页面默认参数
            defau: {
                // 补录类型集合 -- 下拉选择使用
                dfTypeOptions: [],
                // 审批状态类型 -- 下拉选择使用
                dfAppStateOptions:[],
                // 默认不查看 审批类型集合 草稿
                defaultNoShowAppStates:[0]
            },
            // 查询参数
            query: {
                // 项目名-模糊搜索
                proName: null,
                // 补录类型
                dfType: null,
                // 审批类型
                dfAppState: null,
                // 提交时间-起始
                submitStartDate: null,
                // 提交时间-结束
                submitEndDate: null,
            },
            // 列表数据
            tableData: [],
            // 分页数据
            page: {
                current: 1,
                pageSizes: [10, 50, 100, 200],
                pageSize: 10,
                total: 0
            },
            // 是否显示弹窗
            isDialogShow:false,
            isPassDialogShow:false,
            isRefuseDialogShow:false,
            // 弹窗form表单数据
            dialogForm:{
                df_pids:null,
                audit_opinion:null,
                audit_remarks: null,
            },
            // 弹窗表单验证规则
            dialogFormRules:{
                audit_opinion:[
                    {required:true,message:'请输入审批意见',trigger:'blur'},
                    {max:512,message:'不得超过 512 个字符',trigger:'blur'},
                ],
                audit_remarks:[
                    {max:512,message:'不得超过 512 个字符',trigger:'blur'},
                ]
            },
        }
    },

    methods: {
        // 单机查询按钮
        click_query(data) {
            console.log(data,"data")
            this.query.proName = data.proName;
            this.query.dfType = data.dfType;
            this.query.dfAppState = data.dfAppState;
            this.query.submitStartDate = data.submitDate[0];
            this.query.submitEndDate = data.submitDate[1];
            this.refreshTable();
        },
        // 单机重置按钮
        click_reset() {
            // console.log("click_reset")
            this.query = {
                proName: null,
                dfType: null,
                dfAppState: null,
                submitStartDate: null,
                submitEndDate: null,
            }
          this.refreshTable();
        },
        operateItem(type,row){
           if (type == 'view'){
              this.click_view(row)
           } else if (type == 'pass'){
              this.click_pass(row)
           } else if (type == 'refuse'){
             this.click_refuse(row)
           }
        },
        // 单击 查看 按钮
        click_view(val) {
            this.$router.push({
                name: 'apply_table',
                query:{
                    id:val.df_pid,
                    pro_name:val.pro_name
                }
            })
        },
        // 单击 通过 按钮
        click_pass(val) {
            console.log("click_pass df_pid:" + val.df_pid)
            console.log(val);
            // 获取 项目id
            var data = { df_pids : val.df_pid};
            this.$confirm("<div style=\"margin-left: 2em;\"><h5>是否要通过以下数据补录项目:</h5><p>"+val.pro_name+"</p></div>",{
                title:'提示',
                dangerouslyUseHTMLString: true,
                showCancelButton: true,
                showConfirmButton: true,
            }).then(() => {
                this.$executeRequest.execGetByMenuUrl("/proInfo/passList",data).then(res =>{
                  if(res && res.data) {
                    this.$Msg.updateSuccess("修改状态成功");
                  }
                  this.refreshTable();
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        },
        // 单击 拒绝 按钮
        click_refuse(val) {
            console.log("click_refuse df_pid:" + val.df_pid)
            console.log(val);
            // 清空 弹窗表单数据
            this.clearDialogFormData();
            // 设置 项目id
            this.dialogForm.df_pids = [val.df_pid];
            this.$confirm("<div style=\"margin-left: 2em;\"><h5>是否要通过以下数据补录项目:</h5><p>"+val.pro_name+"</p></div>",{
                title:'提示',
                dangerouslyUseHTMLString: true,
                showCancelButton: true,
                showConfirmButton: true
            }).then(() => {
                //显示表单
                this.isDialogShow = true;
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        },
        btnClick(type){
           if (type == '通过'){
             this.click_passList()
           } else if (type == '拒绝'){
             this.click_refuseList()
           }
        },
      handleMultiple(row){
        this.row = row;
      },
        // 单击 列表行的通过 按钮
        click_passList() {
            // var selection = this.$refs.multipleTable.selection;
            var selection = this.row;
            if(selection == null || selection.length<=0){
                this.$Msg.customizTitle("未选择项目!","warning");
                return ;
            }
            for(var i=0;i<selection.length;i++){
                if(selection[i].submit_state != "1"){
                    this.$Msg.customizTitle("只可操作未审批的项目!","warning");
                    return ;
                }
            }
            var proNames = selection.map(d=>d.pro_name).join(",");
            this.$confirm("<div style=\"margin-left: 2em;\"><h5>是否要通过以下数据补录项目:</h5><p>"+proNames+"</p></div>",{
                title:'提示',
                dangerouslyUseHTMLString: true,
                showCancelButton: true,
                showConfirmButton: true
            }).then(() => {
                // 获取 项目id
                var data = { df_pids : selection.map(d => d.df_pid).join(",")};
                this.$executeRequest.execGetByMenuUrl("/proInfo/passList",data).then(res =>{
                  if(res && res.data){
                    this.$Msg.updateSuccess("修改状态成功")
                  }
                  this.refreshTable();
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        },

        // 单击 列表上的拒绝 按钮
        click_refuseList() {
            // var selection = this.$refs.multipleTable.selection;
            var selection = this.row;
            if(selection == null || selection.length<=0){
                this.$Msg.customizTitle("未选择项目!","warning");
                return ;
            }

            for(var i=0;i<selection.length;i++){
                if(selection[i].submit_state != "1"){
                    this.$Msg.customizTitle("只可操作未审批的项目!","warning");
                    return ;
                }
            }
            // var selection = this.$refs.multipleTable.selection;
            var selection = this.row;
            console.log(selection)

            var proNames = selection.map(d=>d.pro_name).join(",");
            this.$confirm("<div style=\"margin-left: 2em;\"><h5>是否要拒绝以下数据补录项目:</h5><p>"+proNames+"</p></div>",{
                title:'提示',
                dangerouslyUseHTMLString: true,
                showCancelButton: true,
                showConfirmButton: true
            }).then(() => {
                 // 清空 弹窗表单数据
                this.clearDialogFormData();
                // 设置 项目id
                var df_pids = selection.map(d => d.df_pid);
                this.dialogForm.df_pids = [df_pids];
                //显示表单
                this.isDialogShow = true;
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });

           
        },
        // 提交 弹窗form 表单
        submitDialogForm(){
            var dialogForm = this.dialogForm;
            // 判断是否有项目信息
            if(dialogForm.df_pids == null || dialogForm.df_pids.length ==0){
                this.$message({
                    showClose: true,
                    message:"无法提交，缺少项目参数",
                    type:"error"
                })
                return ;
            }
            // 判断是否有审批意见
            if(dialogForm.audit_opinion == '' || dialogForm.audit_opinion == null){
                this.$message({
                    showClose: true,
                    message:"请填写审批意见",
                    type:"warning"
                })
                return ;
            }
            // 发送数据
            var data = {
                df_pids:dialogForm.df_pids.join(","),
                audit_opinion:dialogForm.audit_opinion,
                audit_remarks: dialogForm.audit_remarks,
            }
            this.$executeRequest.execGetByMenuUrl("/proInfo/refuseList",data).then(res =>{
              console.log(res)
              if(res){
                if( res.data){
                  this.$message({
                    showClose: true,
                    message:"操作成功",
                    type:"success"
                  })
                }else{
                  this.$message({
                    showClose: true,
                    message:"提交失败",
                    type:"error"
                  })
                }
              }
              this.isDialogShow = false;
              this.refreshTable();
            })
        },
        // 关闭 弹窗
        cancelDialogForm(){
            this.isDialogShow = false;
        },
        // 清空表单数据
        clearDialogFormData(){
            this.dialogForm = {
                df_pid:null,
                audit_opinion:null,
                audit_remarks: null,
            }
        },
        // 初始化补录类型
        initDfType() {
            this.$executeRequest.execGetByMenuUrl("/proInfo/getDfTypes").then(res =>{
              // console.log(res)
              if(res && res.data){
                this.defau.dfTypeOptions = res.data;
                res.data.forEach(val => {
                  this.formItems.forEach(item => {
                    if (item.prop == 'dfType'){
                      let param = {};
                      param['label'] = val.value;
                      param['value'] = val.code;
                      item.options.push(param);
                    }
                  })
                })
              }
            })
            // apply.queryDfTypes().then(res => {
            //     // console.log(res)
            //     if(res && res.data){
            //         this.defau.dfTypeOptions = res.data;
            //     }
            // })
        },
        // 初始化审批类型
        initDfAppState(){
            this.$executeRequest.execGetByMenuUrl("/proInfo/getDfAppState").then(res =>{
              if(res && res.data){
                // 过滤掉不显示的数据
                var list = [];
                for(var i=0;i<res.data.length;i++){
                  var flag = false;
                  for(var d in this.defau.defaultNoShowAppStates){
                    if(d == res.data[i].code){
                      flag = true;
                    }
                  }
                  if(!flag){
                    list.push(res.data[i])
                  }
                }
                this.defau.dfAppStateOptions = list;
                list.forEach(val => {
                  this.formItems.forEach(item => {
                    if (item.prop == 'dfAppState'){
                      let param = {};
                      param['label'] = val.value;
                      param['value'] = val.code;
                      item.options.push(param);
                    }
                  })
                })
              }
            })
        },
        // 分页大小变更事件
        pageSizeChange(val) {
            // console.log("pageSizeChange"+val);
            this.page.pageSize = val;
            this.page.current = 1;
            this.refreshTable();
        },
        // 分页当前页变更事件
        pageCurrentChange(val) {
            // console.log("pageCurrentChange"+val);
            this.page.current = val;
            this.refreshTable();
        },
        // 刷新列表
        refreshTable() {
            //创建请求参数
            var data = {
                fuzzyName: this.query.proName,
                type: this.query.dfType,
                state: this.query.dfAppState,
                startDate: this.query.submitStartDate,
                endDate: this.query.submitEndDate,
                pageSize: this.page.pageSize,
                currPage: this.page.current,
            };
            // 查询
            this.$executeRequest.execGetByMenuUrl("/proInfo/pageQueryNeedApply",data).then(res =>{
              if (res && res.data) {
                var tableData = res.data;
                // 渲染
                if (tableData) {
                  if (tableData.total != null) {
                    this.page.total = tableData.total;
                    this.pagination.total = tableData.total;
                  }
                  if (tableData.list != null) {
                    console.log(tableData.list,"tableData.list")
                    tableData.list.forEach(item => {
                      if (item.df_type == '1'){
                        item.type = '监管补录';
                      }else if(item.df_type == '2'){
                        item.type = '常规补录';
                      }else if (item.df_type == '3'){
                        item.type = '临时补录';
                      }
                      if (item.submit_state == '0'){
                        item.state ='草稿';
                      }else if (item.submit_state == '1'){
                        item.state ='未审批';
                      }else if (item.submit_state == '2'){
                        item.state ='已通过';
                      }else if (item.submit_state == '3'){
                        item.state ='已拒绝';
                      }
                    })
                    this.tableData = tableData.list;
                  }
                }

              }
            })
        },
        // 格式化补录类型
        formatDfType(value){
            if(this.defau.dfTypeOptions && this.defau.dfTypeOptions.length >0){
                for(var i = 0;i< this.defau.dfTypeOptions.length;i++){
                    if(value.df_type == this.defau.dfTypeOptions[i].code){
                        return this.defau.dfTypeOptions[i].value;
                    }
                }
            }
        },
        // 格式化审批类型
        formatDfAppState(value){
            if(this.defau.dfAppStateOptions && this.defau.dfAppStateOptions.length >0){
                for(var i = 0;i< this.defau.dfAppStateOptions.length;i++){
                    if(value.submit_state == this.defau.dfAppStateOptions[i].code){
                        return this.defau.dfAppStateOptions[i].value;
                    }
                }
            }
        },
        // 格式化时间
        formatDateTime(value){
            var dateTime = (value.submit_date==null? "":value.submit_date)+ (value.submit_time==null?"":value.submit_time);
            return this.$Date.dateToMilldate(dateTime)
        }

    },
    mounted: function () {
        this.refreshTable();
        this.initDfType();
        this.initDfAppState();
    }
}
</script>