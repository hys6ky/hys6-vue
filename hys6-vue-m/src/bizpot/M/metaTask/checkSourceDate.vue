<template>
  <div  class="px-20 codeManage">
    <div style="width: 100%;height: 35px;margin-top: 10px">
      <ByHeaderSlice :title="'元数据检核'" style="float: left"></ByHeaderSlice>
      <el-button v-debounce @click="goBack" class="goBackBtn button">
        <i class="el-icon-back"></i>返回{{ source }}
      </el-button>
    </div>
    <div>
      <ByQuickSearch :form-datas="fromDatas" :form-items="checkSourceItem" @search="search"></ByQuickSearch>
      <ByTable :column-arr="checkSourceTable" :table-data="checkSourceData1"></ByTable>
    </div>
  </div>
</template>

<script >
import ByModelForm from "@/components/global/ByModelForm.vue";
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";
import {checkSourceItem,checkSourceTable} from "./mock";
import ByTable from "@/components/global/ByTable.vue";
import {downloadGetFileAllMappingNameParams} from "@/utils/executeRequest";
export default {
  name: "checkSourceDate",
  components: {ByTable, ByQuickSearch, ByModelForm},
  props: {
    source_id: {
      type: Object,
      default: () => {
      },
    },
  },
  data(){
    return{
      fromDatas: {},
      checkSourceTable,
      checkSourceItem,
      checkSourceData1: [],

    }
  },
  mounted(){
    this.fromDatas = {
       source_id : this.source_id,
    }
    this.getMetaDataSource();
    if (this.source_id){
      this.getTables(this.source_id);
    }
  },
  methods:{
    goBack(){
      this.$emit("goBack");
    },
    search(row){
      // alert("查询")
      console.log(row.source_id)
      this.getTables(row.source_id);
    },
    getMetaDataSource(){
      let param ={
        // source_name: '',
        // ds_type: '',
        currPage: 1,
        pageSize: 999,
        showTask: 1,
      }
      this.$executeRequest.execGetByControllerAllMappingName("/metaTask/metaDataSource",param).then(res =>{
        if (res && res.success){
          let data = []
              res.data.pageList.map(item =>{
                if (item.dsl_id){
                  let params = {
                    value : item.source_id,
                    label : item.source_name,
                    key : item.source_id,
                  }
                  data.push(params)
                }
              })
          console.log(res.data)
          this.setOption(this.checkSourceItem,'source_id',data)
        }
      })
    },
    setOption(data,prop,value){
      data.map(item =>{
        if (item.prop === prop){
            item.options = value;
        }
      })
    },
    getTables(source_id){

      this.$executeRequest.execGetByControllerAllMappingName("/metaTask/metaDataCheck/getTable", {source_id : source_id}).then(res =>{
        debugger
        if (res&&res.success){
          debugger
          this.checkSourceData1 = res.data
          console.log(this.checkSourceData1)
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