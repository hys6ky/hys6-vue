<template>
  <div  class="px-20 codeManage">
    <div style="width: 100%;height: 35px;margin-top: 10px">
      <ByHeaderSlice :title="'任务信息'" style="float: left"></ByHeaderSlice>
      <el-button v-debounce @click="goBack" class="goBackBtn button">
        <i class="el-icon-back"></i>返回{{ source }}
      </el-button>
    </div>
    <div >
      <div >
        <div style="width: 100%">
          <ByModelForm  :form-data="taskData" :form-rules="taskRule" :form-items="taskTableItem" :form-config="taskTbaleConfig" ref="taskChech"></ByModelForm>
        </div>
      </div>
      <el-tabs   v-model="activeName"  type="border-card"  @tab-click="handleClick">
        <el-tab-pane label="已选中" name="selected" v-if="!isAdd">
          <el-button @click="buttonDeleteMetaTaskObj" type="primary" size="small" style="float: right;margin-right:10px;margin-bottom: 10px">批量删除</el-button>
          <ByTable :table-data="taskTableData" :column-arr="taskTableColumn"
                   @operateItem="operateHandler" :pagination="pagination" @handleMultiple="handleMultiple"
                   @sizeChange="sizeChange" @currentChange="currentChange" ></ByTable>
        </el-tab-pane>
        <el-tab-pane label="未选中" name="unchecked" >
          <ByQuickSearch :form-items="quickSearchItem" :extra-button="extraButton"@search="search" @btnClick="btnClick"></ByQuickSearch>
          <ByTable :height="500" :table-data="tableData" :column-arr="tableColumn" @handleMultiple="tableHandleMultiple"></ByTable>
<!--          <div style="margin-top: 20px;margin-right: 10px">-->
<!--&lt;!&ndash;            <el-button @click="saveCheckTask" type="primary" size="small" style="float:right;">保存</el-button>&ndash;&gt;-->
<!--          </div>-->
        </el-tab-pane>
      </el-tabs>

      <div style="float: right;margin-right:10px;margin-bottom: 10px;margin-top: 20px">
        <!--        <el-button @click="saveCheckTask" type="primary" size="small" >保存</el-button>-->
        <el-button @click="saveTaskData" type="primary" size="small" >保存</el-button>
        <el-button type="primary" size="small" @click="saveConfigTask"  v-if="false">保存并配置作业</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import {defineComponent} from 'vue'
import ByFormTable from "@/components/global/ByFormTable.vue";
import ByTable from "@/components/global/ByTable.vue";
import {taskTableColumn,taskRule, taskTableItem,tableColumn,quickSearchItem, taskTbaleConfig} from "./mock";
import ByModelForm from "@/components/global/ByModelForm.vue";
import ByHeaderSlice from "@/components/global/ByHeaderSlice.vue";
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";

export default {
  name: "taskIndex",
  components: {ByQuickSearch, ByHeaderSlice, ByModelForm, ByTable, ByFormTable},
  props: {
    taskData: {
      type: Object ,
      default: () => {},
    },
    dslId: {
      type: Object ,
      default: () => {},
    },
    source_id: {
      type: Object ,
      default: () => {},
    },
    source_name: {
      type: Object ,
      default: () => "",
    },
    isAdd: {
      type: Boolean ,
      default: () => true,
    },
  },
  data(){
    return{
      // 采集任务名称
      taskName: '',
      taskRule,
      tableColumn,
      quickSearchItem,
      activeName: "selected",
      tableData:[],
      taskIds: [],
      taskTableForm : {},
      taskTableItem,
      taskTbaleConfig,
      taskTableData : [],
      taskTableColumn,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      extraButton: [
        {
          label: '查看全表',
        }
      ],
      MetaObjTypeEnum : [],
    }
  },
  mounted() {
    this.getCode('MetaObjTypeEnum');
    if (!this.isAdd){
      this.taskName = this.taskData.task_name;
      this.getMetaTaskObj();
      console.log(this.taskTableItem)
      this.setDisabled1(this.taskTableItem,"task_type",true)
    }else {
      this.activeName =  "unchecked";
      this.setDisabled1(this.taskTableItem,"task_type",false)
    }
  },
  methods:{
    operateHandler(type,row){
      if (type === 'del'){
        // alert("删除操作")
        this.deleteTabel(row.id);
      }
    },
    setDisabled1(data,prop,boole){
      data.map(item =>{
        if (item.prop == prop){
          item.disabled = boole;
        }
      })
    },
    btnClick(){
      this.$refs.taskChech.transferData().then(data =>{
        if (this.dslId){
          this.getMetaData(this.dslId,this.taskData.task_type,'');
        }else {
          this.$Msg.customizTitle("没有元数据信息，请先导入元数据信息！", "warning");
        }
      }).catch(err =>{

      })

    },
    search(val){
      this.$refs.taskChech.transferData().then(data =>{
        if (this.dslId){
          this.getMetaData(this.dslId,this.taskData.task_type,val.en_name);
        }else {
          this.$Msg.customizTitle("没有元数据信息，请先导入元数据信息！", "warning");
        }
      }).catch(err =>{

      })
    },
    getMetaData(dslId,objType,objName){
      let params = {
        dslId: dslId,
        objType: objType,
        objName: objName
      }
      this.$executeRequest.execGetByControllerAllMappingName("/metaObjInfo/getMetaData",params).then(res =>{
        if (res && res.success){
          res.data.map( item =>{
            this.MetaObjTypeEnum.map( type =>{
              if (objType === type.value){
                item.typeLabel = type.label;
              }
            })
          })
          this.tableData = res.data
          console.log(this.tableData)
        }
      })
    },
    tableHandleMultiple(val){
      console.log(val);
      this.obj_list = [];
      this.obj_list = val;
    },
    saveTaskData(){
      this.$refs.taskChech.transferData().then(data =>{
        console.log(this.taskData)
        if (this.taskName === this.taskData.task_name){
          this.saveCheckTask();
        }else {
          if (this.isAdd){
            this.saveCheckTask();
          }else {
            this.updateTaskName(this.taskData)
          }
        }
      }).catch(err =>{

      })

    },
    updateTaskName(params){
      this.$executeRequest.execPostByControllerAllMappingName("/M/metaTask/metaTaskObj/updateTask",params).then(res =>{
        if (res && res.success){
            if (this.obj_list && this.obj_list.length !== 0){
              this.saveCheckTask();
            }else {
              this.$Msg.customizTitle("修改任务名称成功");
              this.goBack();
          }
        }
      })
    },
    getCode(category){
      this.$executeRequest.execPostByControllerAllMappingNameParams("/M/code/getCategoryItems",{category : category}).then(res =>{
        if (res && res.success){
          res.data.map(item =>{
            item.label = item.value
            item.value  = item.code
          })
          if('MetaObjTypeEnum' ===category ){
            this.MetaObjTypeEnum = res.data;
          }
        }
      })
    },
    saveCheckTask(){
      this.$refs.taskChech.transferData().then(data =>{
        if(this.obj_list && this.obj_list.length !== 0){
          let dataList = [];
          this.obj_list.map(obj =>{
            let data = {
              source_id :  this.source_id,
              type :  this.taskData.task_type,
              is_col : '1',
              en_name: obj.en_name,
              ch_name: obj.ch_name,
              obj_id : obj.obj_id
            }
            dataList.push(data)
          })
          if (this.isAdd){
            let params = {
              task_type: this.taskData.task_type,
              task_name: this.taskData.task_name,
              source_id: this.source_id
            }
            this.saveMetaTask(params,dataList);
          }else {
            let params = {
              task_id : this.taskData.task_id,
              objList: dataList,
            }
            console.log(params);
            this.saveMetaTaskObj(params);
          }
        }else {
          this.$Msg.customizTitle("请先选择表！", "warning");
        }
      }).catch(err =>{

      })
    },
    handleClick(){

    },
    saveMetaTask(params,dataList){
      this.$executeRequest.execPostByControllerAllMappingName("/M/metaTask/",params).then(res =>{
        if(res && res.success){
          let param = {
            task_id : res.data.task_id,
            objList: dataList,
          }
          this.saveMetaTaskObj(param);
        }
      })

    },
    saveMetaTaskObj(params){
      this.$executeRequest.execPostByControllerAllMappingName("/M/metaTask/metaTaskObj",params).then(res => {
        if (res && res.success){
          if (this.isAdd){
            this.$Msg.customizTitle("新增任务成功");
          }else {
            this.$Msg.customizTitle("编辑任务成功");
          }
          this.goBack();
        }
      })
    },
    deleteTabel(id){
      let ids = [];
      ids.push(id);
      this.$executeRequest.execDelByControllerAllMappingName("/M/metaTask/metaTaskObj/"+this.taskData.task_id,ids).then(res =>{
        if (res && res.success){
          this.$Msg.customizTitle("删除成功");
          this.getMetaTaskObj();
        }
      })
    },
    //分页
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getMetaTaskObj();
    },
    goBack(){
      this.$emit("goBack");
    },
    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getMetaTaskObj();
    },
    saveTask(){

    },
    getMetaTaskObj(){
      let params = {
        currPage : this.pagination.pageNum,
        pageSize : this.pagination.pageSize,
        task_id : this.taskData.task_id,
        // type : '',
      }
      this.$executeRequest.execGetByControllerAllMappingName("/metaTask/metaTaskObj",params).then(res =>{
        if (res && res.success){
          res.data.pageList.map( item =>{
            this.MetaObjTypeEnum.map( type =>{
              if (item.type === type.value){
                item.typeLabel = type.label;
              }
            })
          })
          this.pagination.total =  res.data.totalSize;
          this.taskTableData = res.data.pageList;
        }
      })
    },
    getMetaTaskObj1(task_id){
      let params = {
        currPage : this.pagination.pageNum,
        pageSize : this.pagination.pageSize,
        task_id : task_id,
        // type : '',
      }
      this.$executeRequest.execGetByControllerAllMappingName("/metaTask/metaTaskObj",params).then(res =>{
        if (res && res.success){
          res.data.pageList.map( item =>{
            this.MetaObjTypeEnum.map( type =>{
              if (item.type === type.value){
                item.typeLabel = type.label;
              }
            })
          })
          this.pagination.total =  res.data.totalSize;
          this.taskTableData = res.data.pageList;
        }
      })
    },

    saveConfigTask(){
      this.$emit('saveConfigTask',this.taskData,this.taskTableData);
    },
    handleMultiple(val){
      console.log(val)
      this.taskIds = [];
      val.forEach(item =>{
        this.taskIds.push(item.id);
      })
    },
    buttonDeleteMetaTaskObj(){
      if (this.taskIds.length !== 0 ){
        this.deleteMetaTaskObj(this.taskIds);
      }else {
        this.$Msg.customizTitle("请先选择信息！", "warning");
      }
    },
    deleteMetaTaskObj(taskIds){
      this.$executeRequest.execDelByControllerAllMappingName("/M/metaTask/metaTaskObj/"+this.taskData.task_id,taskIds).then(res =>{
        if (res && res.success){
          this.$Msg.customizTitle("批量删除成功");
          this.getMetaTaskObj();
        }
      })
    },
  }
}
</script>

<style scoped lang="less">
.goBackBtn {
  width: 62px;
  height: 28px;
  line-height: 26px;
  padding: 0;
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  font-family: SourceHanSansCNVF-Regular, SourceHanSansCNVF;
}
.button {
  float:right;
  height:32px;
  padding:0 14px;
  margin-right:10px
}
</style>