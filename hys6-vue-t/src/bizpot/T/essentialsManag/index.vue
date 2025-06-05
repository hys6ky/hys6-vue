<template>
  <div class="px-20">
    <ByQuickSearch :formItems="formItems" @search="search" @reset="reset" />
    <div class="container mt-10">
      <div style="height:32px;margin-bottom:10px">
        <el-button style="float:right;height:32px;padding:0 14px;"   type="primary" @click="batchDel">批量删除</el-button>
        <el-button style="float:right;height:32px;padding:0 14px;margin-right:10px" type="primary" @click="add">新增要点</el-button>
      </div>
      <ByTable :tableData="tableData" :columnArr="columnArr" :pagination="pagination"   @operateItem="operate"
               @handleMultiple="handleMultipleMethod"   @sizeChange="sizeChange" @currentChange="currentChange"></ByTable>
    </div>

    <ByModel :model-title = "title"  :visible.sync="addVisible" @close="handleClose"  modelWidth="50%">
      <ByModelForm :form-data="formData" :form-items="formItem"   :formRules="modelFormRules"  :formConfig="modelFormConfig" style="padding: 0 50px" ref="standardSource"></ByModelForm>
      <template slot="modalFoot">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary"  @click="saveAndUpdate()" v-debounce>
          确 认
        </el-button>
      </template>
    </ByModel>
  </div>
</template>


<script >

import {formItems,columnArr,formItem,modelFormRules,modelFormConfig} from "./mock";
import ByTable from "@/components/global/ByTable.vue";
import ByModel from "@/components/global/ByModel.vue";
import ByModelForm from "@/components/global/ByModelForm.vue";
import {execPostByControllerAllMappingName} from "@/utils/executeRequest";
export default {
  components: {ByModelForm, ByModel, ByTable},
  data(){
    return{
      formItems,
      columnArr,
      formItem,
      modelFormRules,
      modelFormConfig,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      formData: {},
      quickData : {},
      tableData:[],
      title: '',
      type: '',
      addVisible : false,
      tskCategoryEnum : [],
      pointTypeEnum: [],
    }
  },
  mounted() {
    this.getCode("TskCategoryEnum");
    this.getCode("PointTypeEnum");
    this.getQueryList();
  },
  methods: {
    search(val){
      this.pagination.pageNum = 1;
      this.quickData = val;
      this.getQueryList();
    },
    getCode(category){
      this.$executeRequest.execPostByControllerAllMappingName("/T/code/getCategoryItems?category=" + category) .then(res =>{
        if (res && res.success){
          res.data.forEach(item =>{
            item.label = item.value;
            item.value = item.code;
            item.key = item.code;
          })

          if (category === 'TskCategoryEnum'){
            this.setOptions("task_category",res.data);
            this.tskCategoryEnum = res.data;
          }else if(category === 'PointTypeEnum'){
            this.setOptions("point_type",res.data)
            this.pointTypeEnum = res.data;
          }
        }
      })
    },
    reset(val){
      console.log(val)
    },
    setOptions(type,data){
        this.formItems.map(item =>{
          if (item.prop === type){
            item.options = data;
          }
        })
        this.formItem.map(item =>{
          if (item.prop === type){
            item.options = data;
          }
        })
    },
     getQueryList(){
      let params = {
        currPage : this.pagination.pageNum,
        pageSize : this.pagination.pageSize,
        point_name : this.quickData.point_name,
        task_category: this.quickData.task_category,
        point_type : this.quickData.point_type,
      }
      this.$executeRequest.execGetByControllerAllMappingName("/T/tskTestPoint",params).then(res =>{
        if (res && res.success){
          res.data.pageList.forEach(item =>{
            this.tskCategoryEnum.forEach(tsk =>{
              if (item.task_category === tsk.code){
                item.task_category_value = tsk.label
              }
            })
            this.pointTypeEnum.forEach(point =>{
              if (item.point_type === point.code){
                item.point_type_value = point.label
              }
            })
          })
          console.log(res.data.pageList)
          this.tableData = res.data.pageList;
          this.pagination.total = res.data.totalSize;
        }
      })
    },
    addTskTest(){
        this.$executeRequest.execPostByControllerAllMappingName("/T/tskTestPoint" ,this.formData).then(res =>{
          if (res && res.success){
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.addVisible = false;
            this.getQueryList();
          }
        })
    },
    updateTskTest(){
      this.$executeRequest.execPutByControllerAllMappingName("/T/tskTestPoint" ,this.formData).then(res =>{
        if (res && res.success){
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.addVisible = false;
          this.getQueryList();
        }
      })
    },
    // byTable 操作控制
    operate(type,row){
    console.log(type)
      if (type === 'edit'){
        // alert("编辑操作")
        this.addVisible = true;
        this.title = '编辑要点';
        this.type = '2';
        this.getOneTskTEst(row.point_id);
      }else if(type === 'del'){
        // alert("删除操作")
        this.deleteTskTEst(row.point_id);
      }
    },
    handleMultipleMethod(val){
      console.log(val)
      this.batchDeleteData = [];
      val.map(item =>{
        this.batchDeleteData.push(item.point_id)
      });
    },
    batchDel(){
      if(this.batchDeleteData && this.batchDeleteData.length !== 0 ){
        this.$confirm('是否批量删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(res =>{
          this.batchDelete(this.batchDeleteData.toString())
        }).catch(eer =>{
          this.$message({
            message: '已取消',
            type: 'info'
          });
        })
      }else {
        this.$message({
          message: '批量删除信息不能为空',
          type: 'warning'
        });
      }
    },
    batchDelete(params){
        this.$executeRequest.execPostByControllerAllMappingNameParams("/T/tskTestPoint/batchDelete", {pointIds : params}).then(res =>{
          if (res && res.success){
            this.$message({
              message: '批量删除成功',
              type: 'success'
            });
            this.getQueryList();
          }
        })
    },
    //分页
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getQueryList();
    },

    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getQueryList();
    },
    handleClose(){
      this.addVisible = false;
    },

    // 新增要点
    add(){
      this.formData = {};
      // alert("新增要点")
      this.addVisible = true;
      this.title = '新增要点';
      this.type = '1';

    },
    getOneTskTEst(id){
      this.$executeRequest.execGetByControllerAllMappingName("/T/tskTestPoint/"+id).then(res =>{
        if (res && res.success){
          this.formData = res.data
        }
      })
    },
    deleteTskTEst(id){
      this.$executeRequest.execDelByControllerAllMappingName("/T/tskTestPoint/"+id).then(res =>{
        if (res && res.success){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getQueryList();
        }
      })
    },
    saveAndUpdate(){
      // alert("保存按钮")
      console.log(this.formData)
      this.$refs.standardSource.transferData().then(data => {
        if (this.type === '1'){
          // alert("新增成功")
          this.addTskTest();
        }else {
          // alert("修改成功")
          this.updateTskTest();
        }
      }).catch(err =>{

      })
    },
  }
}

</script>

<style scoped lang="less">

</style>