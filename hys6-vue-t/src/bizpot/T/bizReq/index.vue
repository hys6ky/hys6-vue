<template>
  <div class="business px-20 flex-1" v-if="dataReq">
    <ByQuickSearch :formItems="formItems" @search="search" @reset="reset" />
    <div class="container mt-10">
      <div style="height:32px;margin-bottom:10px">
        <el-button style="float:right;height:32px;padding:0 14px;"   type="primary" @click="batchDelete">批量删除</el-button>
        <el-button style="float:right;height:32px;padding:0 14px;margin-right:10px" type="primary" @click="add">新增业务需求</el-button>
      </div>
      <ByTable :tableData="tableData" :columnArr="columnArr" :pagination="pagination"   @operateItem="operate"
               @handleMultiple="handleMultipleMethod"   @sizeChange="sizeChange" @currentChange="currentChange"></ByTable>
    </div>
    <ByModel :modelTitle="type==='1'?'新增业务需求': type === '2' ? '编辑业务需求': '查看业务需求'" :visible.sync="dialogVisible" @close="handleClose1"  modelWidth="35%">
<!--      <div style="margin-bottom:10px">需求基本信息</div>-->
        <ByModelForm :form-data="bizData" :form-items="bizItems" :form-config="bizConfig" :form-rules="bizFormRules" @onlineDate="validateOnlineTimeBlur()" ref="bizFrom"></ByModelForm>
        <el-row>
          <el-col  :offset="5" :span="19">
            <span v-if="type === '3'">{{bizData.att_name}}</span>
            <el-upload v-else ref="upload" :disabled="type == 3"  :fileList="fileList" action="" :auto-upload="false" :limit="1"
                      :on-exceed="handleExceed" :on-change="handleChange" :before-remove="beforeRemove">
              <el-button   size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-col>
        </el-row>
      <template slot="modalFoot">
        <el-button @click="handleClose1">取 消</el-button>
        <el-button type="primary" v-if="type !== '3'" @click="bizResDataSaveAndUpdate()" v-debounce>
          确 认
        </el-button>
      </template>
    </ByModel>
    <el-dialog title="表资源分配" :visible.sync="dialogTableVisible" width="90%" :before-close="handleClose">
      <el-row :gutter="24">
        <el-col class="borderStyleTree" :span="9" style="margin-right: 10px; height: 60vh; overflow: auto">
          <!--树菜单-->
          <el-input placeholder="输入关键字进行过滤"  v-model="filterText" />
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="源系统表资源" name="metaRes"/>
            <el-tab-pane label="数据中心表资源" name="systemRes" />
            <el-tab-pane label="数据资产表资源" name="dataAsset" v-if="false"/>
          </el-tabs>
          <div class="mytree" v-if="activeName === 'systemRes'">
            <el-tree
                class="filter-tree" :data="treedata" :default-expanded-keys="treekeys" :default-checked-keys="treekeys" :show-checkbox="checkbox" node-key="file_id"
                @check="checkTableData" :filter-node-method="filterNode" ref="tree">
                        <span class="span-ellipsis" slot-scope="{ node, data }">
                            <span :title="data.description" v-if="data.file_id">
                                <i class="el-icon-document"></i>
                                <template v-if="data.original_name">{{ data.hyren_name }}【{{data.original_name}}】</template>
                                <template v-else-if="data.original_name === '' && data.table_name !== ''">
                                  {{ data.hyren_name }}{{ data.table_name }}
                                </template>
                                <template v-else>{{ data.hyren_name }}</template>
                            </span>
                            <span :title="data.description" v-else>
                                <i class="el-icon-folder-opened"></i>{{ node.label }}
                            </span>
                        </span>
            </el-tree>
          </div>
          <div class="mytree" v-if="activeName === 'metaRes'">
            <el-tree
                class="filter-tree" :data="treedata" :default-expanded-keys="treekeys" :default-checked-keys="treekeys" :show-checkbox="checkbox" node-key="file_id"
                @check="checkTableData1" :filter-node-method="filterNode" ref="tree">
                        <span class="span-ellipsis" slot-scope="{ node, data }">
                            <span :title="data.description" v-if="data.file_id">
                                <i class="el-icon-document"></i>
                                <template v-if="data.original_name">{{ data.hyren_name }}【{{data.original_name}}】</template>
                                <template v-else-if="data.original_name === '' && data.table_name !== ''">
                                  {{ data.hyren_name }}{{ data.table_name }}
                                </template>
                                <template v-else>{{ data.hyren_name }}</template>
                            </span>
                            <span :title="data.description" v-else>
                                <i class="el-icon-folder-opened"></i>{{ node.label }}
                            </span>
                        </span>
            </el-tree>
          </div>
        </el-col>
        <el-col class="borderStyleTabel" :span="14"  style="margin-right: 10px; height: 60vh; overflow: auto">
          <template>
            <el-table :data="showTableData" stripe height="100%" border style="width: 100% ">
              <el-table-column type="index" width="70"  align="center" label="序号">
              </el-table-column>
              <el-table-column prop="tbl_name" label="表名" >
              </el-table-column>
              <el-table-column prop="tbl_en_name" label="表中文名">
              </el-table-column>
            </el-table>
          </template>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveTable()" v-if="checkbox">保 存</el-button>
          <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>

  <div class="business px-20 flex-1" v-else>
    <DataReq :from="from" @updateValue="retBizReq()"></DataReq>
  </div>
</template>

<script>

import {formItems, columnArr, bizItems, bizConfig} from './mock';
import DataReq from '../dataReq/index.vue'
import ByModelForm from "@/components/global/ByModelForm.vue";
export default {
  computed: {
    bizFormRules() {
      return bizFormRules
    },
    bizConfig() {
      return bizConfig
    }
  },
  components: {
    ByModelForm,
    DataReq,
  },
  data(){
    return{
      data_type: '',
      activeName: "metaRes",
      newdate: '2023-08-21',
      from : {},
      formItems ,
      bizItems,
      bizConfig,
      columnArr,
      category_id : '',
      showTableData: [],
      filterText: '',
      treedata: [],
      type:'',
      dataReq: true,
      url: '',
      dialogVisible:false,
      dialogTableVisible: false,
      yuyanDialog:false,
      bizData:{
        biz_name:'',
        biz_desc:'',
        owner_name:'',
        dept:'',
        online_date:'',
      },
      bizFormRules: {
        owner_name:[{required:true,message:'请输入提出人',trigger:'blur'}],
        dept:[{required:true,message:'请输入提出部门',trigger:'blur'}],
        biz_name:[{required:true,message:'请输入需求名称',trigger:'blur'}],
        online_date:[
          {
            required: true,
            validator: this.validateOnlineTime,
            trigger: "blur",
          },
        ],
        biz_desc:[{required:true,message:'请输入需求简述',trigger:'blur'}],
      },
      checkbox : true,
      treekeys: [],
      tableData:[],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      fileList:[],
      fromData: {
        biz_status: [],
      },
      batchDeleteData : [],
      TskCategoryEnum : [],
    }
  },
  mounted() {
    this.$executeRequest.execPostByControllerMapping("/T/code/getCategoryItems",{category: 'ReqStatusEnum'}).then(res =>{
      if(res && res.success){
        this.TskCategoryEnum = res.data
        res.data.forEach(data =>{
          data.label = data.value;
          data.value = data.code;
        })
        this.formItems.forEach(item =>{
          if (item.prop == 'biz_status' ){
            item.options = res.data
          }
        })
      }
    })
    this.refFromData();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods:{
    search(val){
      this.pagination.pageNum = 1
      this.fromData = val;
      let param = {
        biz_name: val.biz_name,
        created_time: val.created_time,
        owner_name: val.owner_name,
        dept : val.dept,
        biz_status : val.biz_status.toString(),
        currPage: this.pagination.pageNum,
        pageSize : this.pagination.pageSize
      }
      this.queryBizList(param);
    },
    reset(val){
      console.log(val)
    },
    handleClick(tab, event) {
      this.showTableData = [];
      this.treekeys  =[];
      console.log(tab, event);
      // 0 数据中心表资源 1 源系统表资源
      if (tab.name === "systemRes"){
        this.getTableData();
        this.data_type = "0";
      }else if (tab.name === "metaRes") {
        this.getMetaTreeDataInfo("1");
        this.data_type = "1";
      }
    },
    add(){
      this.setDisabled(false);
      this.type='1'
      this.fileList = [],
      this.bizData = {
        biz_name:'',
        biz_desc:'',
        owner_name:'',
        dept:'',
        online_date:'',
      },
      this.dialogVisible=true

    },
    setDisabled(boolean){
      this.bizItems.forEach(item =>{
        item.disabled = boolean;
      })
    },
    //开始时间小于结束时间校验
    validateOnlineTime(rule, value, callback) {
      const currentDate = new Date();
      if (!value) {
        callback(new Error("请选择上线时间"));
      } else {
        callback();
      }
    },
    validateOnlineTimeBlur(){
      const selectedDate = new Date(this.bizData.online_date);
      if (selectedDate <= new Date() - 8.64e7 ) {
        this.$message({
          message: '上线日期晚于当前日期',
          type: 'warning'
        });
      }
    },
    operate(type,row){
      if(type==='downloadFile'){
        this.downloadFile(row)
      }else if(type==='check'){
        this.fileList = []
        this.bizData = {}
        console.log(row.biz_id)
        this.getOneBiz(row.biz_id)
        this.dialogVisible = true
        this.setDisabled(true)
        this.type='3'
      }else if(type==='edit'){
        this.setDisabled(false)
        this.fileList = []
        this.bizData = {}
        console.log(row.biz_id)
        this.getOneBiz(row.biz_id)
        this.dialogVisible=true
        this.type='2'
      }else if(type==='del'){
        this.deleteBizReq(row.biz_id);
      }else if(type === 'tableResAssign'){
        this.category_id = row.biz_id;
        if (row.biz_status && row.biz_status === '3' ){
          this.checkbox = false
        }
        if(row.data_type && row.data_type === "0"){
          this.data_type = "0";
          this.activeName = "systemRes";
          this.getTableData();
        }else {
          this.activeName = "metaRes";
          this.data_type = "1";
          this.getMetaTreeDataInfo("1");
        }
        // 设置回显信息
        this.getTbl(row.biz_id);
        this.dialogTableVisible = true

      }else if(type === 'BizResolve'){
          // alert("业务资源分解"+window.location.href.replaceAll("bizReq","dataReq"))
        // const data = window.microApp.getData();
        // data.baseRouer.push({
        //   path: '/T/dataReq1',
        //   query: {
        //     biz_id: row.biz_id
        //   }
        // })
        this.dataReq = false;
        this.from = row;
        // this.$router.push({
        //   path: '/T/dataReq',
        //   query: {
        //     biz_id : row.biz_id
        //   }
        // })
      }else if(type === 'stopState'){
        this.$confirm('是否关闭业务需求 '+row.biz_name+' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(res =>{
          this.stopState(row.biz_id)
        }).catch(eer =>{
          this.$message({
            message: '已取消',
            type: 'info'
          });
        })

      }
    },
    async queryBizList(param){
      this.$executeRequest.execGetByControllerMappingName("/queryBizList", param).then(res =>{
        if(res.success){
          this.pagination.total = res.data.totalSize;
          res.data.pageList.forEach(data =>{
            data.data_num = data.data_num.toString();
            this.TskCategoryEnum.forEach(Tskenum =>{
              if (data.biz_status && data.biz_status === Tskenum.code){
                data.status = Tskenum.label;
              }
            })
          })
          this.tableData = res.data.pageList || [];
        }
      })
    },
    getTableData(){
      this.$executeRequest.execGetByControllerMappingName("/getTreeDataInfo").then(res =>{
        if(res.success){
          this.treedata = res.data || []
          console.log(this.treedata)
        }
      })
    },
    getMetaTreeDataInfo(isPrco){
      this.$executeRequest.execGetByControllerMappingName("/getMetaTreeDataInfo",{isPrco: isPrco}).then(res =>{
        if(res.success){
          this.treedata = res.data || []
          console.log(this.treedata)
        }
      })
    },

    getTbl(id){
      // 设置回显信息
      this.$executeRequest.execGetByControllerMappingName("/getAssignTable",{id}).then(res =>{
        if(res && res.success){
          this.showTableData = res.data
          this.treekeys = [];
          if(this.showTableData){
            this.showTableData.forEach(data =>{
              this.treekeys.push(data.tbl_id);
            })
          }
        }
      })
    },
    retBizReq(){
      this.dataReq = true;
      this.refFromData();
    },
    stopState(biz_id){
      this.$executeRequest.execPostByControllerMappingName("/stopState?biz_id="+biz_id).then(res =>{
        if (res && res.success){
          this.$message({
            message: '关闭成功',
            type: 'success'
          });
          this.refFromData();
        }
      })
    },
    handleMultipleMethod(val){
      console.log(val);
      this.batchDeleteData = [];
      val.forEach(data =>{
        this.batchDeleteData.push(data.biz_id);
      })
    },
    batchDelete(){
      if (this.batchDeleteData && this.batchDeleteData.length != 0 ){
        console.log(this.batchDeleteData.toString())
        this.$executeRequest.execDeleteByControllerMappingName("/batchDelete",{ids : this.batchDeleteData.toString()})
        .then(res =>{
          if(res && res.success){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.refFromData();
          }
        })
      }else {
        this.$message({
          message: '批量删除信息不能为空',
          type: 'warning'
        });
      }
    },
    deleteBizReq(biz_id){
      this.$executeRequest.execDeleteByControllerMappingName("/deleteBizReq", {biz_id}).then(res =>{
        if(res.success){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.refFromData();
        }
      })
    },
    handleClose(){
      this.dialogTableVisible = false;
      this.$nextTick(() => {
        this.checkbox = true;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    bizResDataSaveAndUpdate(){
      this.$refs.bizFrom.transferData().then((data) => {//验证表单
        if(this.type === '2'){
          // alert("编辑操作");
          this.updateBizResData();
        } else {
          // alert("新增操作");
          this.saveBizResData();
        }
      }).catch(err =>{

      })
    },

    saveBizResData(){
      let param = new FormData();
      param.append("owner_name",this.bizData.owner_name);
      param.append("dept",this.bizData.dept);
      param.append("biz_name",this.bizData.biz_name);
      param.append("online_date",this.bizData.online_date);
      param.append("biz_desc",this.bizData.biz_desc);
      if(this.fileList.length !== 0 &&this.fileList[0].raw){
        param.append('file',this.fileList[0].raw);
      }
      this.$executeRequest.uploadFile("/saveBizReq",param).then(res =>{
        if(res.success){
          this.dialogVisible = false;
          this.fileList=[],
          this.bizData = {},
              this.$message({
                message: '保存成功',
                type: 'success'
              });
          this.refFromData();
        }
      })
    },
    updateBizResData(){
      debugger
      let param = new FormData();
      param.append("biz_id",this.bizData.biz_id);
      param.append("owner_name",this.bizData.owner_name);
      param.append("dept",this.bizData.dept);
      param.append("biz_name",this.bizData.biz_name);
      param.append("online_date",this.bizData.online_date);
      param.append("biz_desc",this.bizData.biz_desc);
      if (this.fileList.length === 0){
        param.append("att_path",'');
        param.append("att_name",'');
      }else {
        param.append("att_path",this.bizData.att_path);
        param.append("att_name",this.bizData.att_path);
      }
      if (this.fileList.length !== 0 &&this.fileList[0].raw){
        param.append('file',this.fileList[0].raw);
      }
      this.$executeRequest.uploadFile("/updateBizReq",param).then(res =>{
        if(res.success){
          this.dialogVisible = false;
          this.fileList=[],
          this.bizData = {},
          this.refFromData();
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        }
      })
    },
    getOneBiz(biz_id){
      const params={
        biz_id,
      }
      this.$executeRequest.execGetByControllerMappingName("/queryOneBiz", params).then(res =>{
        if(res){
         this.bizData = res.data;
         if (res.data.att_path && res.data.att_name){
           let  fileData = {
             url: res.data.att_path,
             name: res.data.att_name,
             size: 0,
           }
           this.fileList.push(fileData);
          }
        }
      })
    },
    //分页
    currentChange(val) {
      this.pagination.pageNum = val;
      //调用接口
      this.refFromData();
    },

    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      //调用接口
      this.refFromData();
    },
    checkTableData(node, checkedNodes){
     this.showTableData = [];
      checkedNodes.checkedNodes.forEach(res =>{
        if (res.file_id && res.hyren_name && res.original_name)
         this.showTableData.push({
            category_id: this.category_id,
            tbl_id : res.file_id,
            tbl_name : res.hyren_name,
            tbl_en_name : res.original_name
        })
      })
    },
    checkTableData1(node, checkedNodes){
      this.showTableData = [];
      checkedNodes.checkedNodes.forEach(res =>{
        if (res.file_id && res.hyren_name )
          this.showTableData.push({
            category_id: this.category_id,
            tbl_id : res.file_id,
            tbl_name : res.hyren_name,
            tbl_en_name : res.original_name || '',
          })
      })
    },
    handleClose1() {
      this.dialogVisible = false;
    },

  handleExceed(files, fileList) {
      this.$Msg.customizTitle("只能选择一个文件", "warning");

    },
    // 获取上传的文件详情
    handleChange(file, fileList) {
      debugger
      this.fileList = fileList;
    },
    beforeRemove(file, fileList){
      this.fileList = fileList
      console.log(this.fileList)
    },
    saveTable(){
      console.log(this.showTableData)
      this.$executeRequest.execPostByControllerMappingName("/tableBizReq/"+this.data_type,this.showTableData).then(res =>{
          if(res.success){
            this.dialogTableVisible = false
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
      })
    },
    downloadFile(row){
      this.$executeRequest.downloadFile("download",{biz_id:row.biz_id}).then(res =>{
        const blob = res;
        let fileName = row.att_name
        if (window.navigator.msSaveOrOpenBlob) {
          // 兼容IE10
          navigator.msSaveBlob(blob, fileName);
        } else {
          //  chrome/firefox
          let aTag = document.createElement("a");
          // document.body.appendChild(aTag);
          aTag.download = fileName;
          aTag.href = URL.createObjectURL(blob);
          if (aTag.all) {
            aTag.click();
          } else {
            //  兼容firefox
            const evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, true);
            aTag.dispatchEvent(evt);
          }
          URL.revokeObjectURL(aTag.href);
        }
      })

    },
    refFromData(){
      let param = {
        biz_name: this.fromData.biz_name,
        created_time: this.fromData.created_time,
        owner_name: this.fromData.owner_name,
        dept : this.fromData.dept,
        biz_status : this.fromData.biz_status.toString(),
        currPage: this.pagination.pageNum,
        pageSize : this.pagination.pageSize
      }
      this.queryBizList(param);
    },


  }
}
</script>

<style lang="less" scoped>
.colorItem /deep/ .el-form-item__label{
  padding-right: 30px;
}
::v-deep .el-dialog .el-dialog__body .el-textarea__inner {
  padding: 0 10px;
}
::v-deep .el-dialog .el-dialog__body .el-input__inner {
  padding: 0 10px;
}
::v-deep .el-dialog__body .el-input--prefix .el-input__inner {
  padding: 0 30px;
}

</style>