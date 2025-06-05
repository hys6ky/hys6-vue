<template>
  <div class="p-20 h100 box-sizing">
    <div>
      <el-button
        v-debounce
        @click="goBackBtn"
        class="goBackBtn"
        v-if="source == null || source == ''"
      >
        <i class="el-icon-back"></i>返回{{ source }}
      </el-button>
      <step />
    </div>
    <div class="lines"></div>
    <configStep1 v-if="active === '0' && isTrue"  @update_active="updateActive"/>
    <configStep2 v-else-if="active === '1' && isTrue" />
    <configStep3 v-else-if="active === '2' && isTrue" />
    <dbmFkInfoTab v-else-if="active === '20' && isTrue" />
    <h3 v-if="!isTrue" style="color: red;"> 请求数据有误，无法继续 </h3>
  </div>
</template>

<script>
import step from "./components/step.vue";
import configStep1 from "./components/configStep1.vue";
import configStep2 from "./components/configStep2.vue";
import configStep3 from "./components/configStep3.vue";
import dbmFkInfoTab from "./components/dbmFkInfoTab.vue";
export default {
  components: { step, configStep1, configStep2, configStep3, dbmFkInfoTab },
  data() {
    return {
      source:null,
      isTrue: true,
      // active: null,
    };
  },
  mounted(){
    this.source = this.$route.query.source;
    // http://localhost:20101/#/H/marketTable?data_mart_id=1144580090810630144&operation=update&datatable_id=1144580090944847873&active=0
    // task_uuid=qwertt&task_category=poiuy&source=abc
    if(  
      (this.$route.query.task_uuid == null || this.$route.query.task_category == null || this.$route.query.source == null) 
      &&
      (this.$route.query.data_mart_id == null|| this.$route.query.operation == null || 
        (
          (this.$route.query.active=='2'|| this.$route.query.active == 2 )
          &&
          this.$route.query.datatable_id == null
        )
      )
    ){
      this.isTrue = false;
      this.$Msg.customizTitle("错误的请求数据", "error");
    }
    this.mounted();
  },
  // beforeRouteUpdate(to,from,next){
  //   if(to.path === from.path){ 
  //     if(this.active == null || this.active == ""){
  //       this.active = "0";
  //     }else if(this.$route.query.active != null && this.$route.query.active != "" && this.active != this.$route.query.active){
  //       this.active = this.$route.query.active;
  //     }
  //   }
  //   next();
  // },
  computed: {
    active() {
      return (this.$route.query.source == null && this.$route.query.active == null) ? "0": this.$route.query.active ;
    },
  },
  methods:{
    updateActive(value){
      this.active = value;
    },
    goBackBtn(){
      this.$router.push({
        name: 'market'
      })
    },
    mounted(){
      // 外部接口跳转处理，只在第一个步骤处理1次
      var source = this.$route.query.source;
      var task_is_first = this.$route.query.task_is_first;
      // 1.判断是否由外部跳转，且是第一次进入此页面
      if(source != null && task_is_first == null){
        // 1.使用uuid和分类查询 datatable_id ，如果查询到，则是修改，没查到是新增
        this.initWithout();
      }
    },
    // 初始化外部链接
    initWithout(){
      console.log("initwithout1")
      var uuid = this.$route.query.task_uuid;
      var category = this.$route.query.task_category;
      var params = {
        uuid: uuid,
        category: category
      };
      this.$executeRequest.execGetByModulName("/market/getDataTableByCategoryUUID", params).then((res) => {
        if (res && res.success) {
          var dataTable = res.data;
          if(dataTable != null && dataTable != ""){
            this.$router.push({
              name: "marketTable",
              query: {
                data_mart_id: dataTable.data_mart_id,
                datatable_id: dataTable.datatable_id,
                operation: "update",
                active: "0",
                // 外部跳转相关
                source : this.$route.query.source,
                uuid: uuid,
                category: category,
                task_is_first : 1
              },
            });
          }else{
            params = {
              name : category
            };
            this.$executeRequest.execGetByModulName("/market/getDmInfoByName",params).then((res)=>{
              if(res && res.success && res.data && res.data.data_mart_id){
                this.$router.push({
                  name: "marketTable",
                  query: {
                    data_mart_id: res.data.data_mart_id,
                    operation: "add",
                    active: "0",
                    // 外部跳转相关
                    source : this.$route.query.source,
                    uuid: uuid,
                    category: category,
                    task_is_first : 1
                  },
                });
              }else{
                this.$router.push({
                  name: "marketTable",
                  query: {
                    // data_mart_id: this.data_mart_id,
                    operation: "add",
                    active: "0",
                    // 外部跳转相关
                    source : this.$route.query.source,
                    uuid: uuid,
                    category: category,
                    task_is_first : 1
                  },
                });
              }
            })
          }
         }
      });
    }
  }
  // methods: {
  //   step(val) {
  //     this.active = val;
  //   },
  // },
};
</script>

<style scoped>
.lines {
  margin-top: 15px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}
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
</style>
