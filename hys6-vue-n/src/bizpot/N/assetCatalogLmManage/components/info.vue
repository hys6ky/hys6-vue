<template>
  <div class="px-20 asset">
    <div class="mt-20">
      <div>
        <ByFormGroup :formData="formData" :formList="formList" :formConfig="formConfig" :formRules="formRules" ref="asset" />
        <div class="d-flex justify-content-center mt-20">
          <el-button type="primary" @click="bc"  v-debounce >保存</el-button>
        </div>
      </div>
    
    </div>
  </div>
</template>
 
<script>
import {formList,formConfig,formRules,formData} from '../mock'
export default {
  name: 'asset',
  data () {
    return {
      activeName: 'first',
      formList,
      formConfig,
      formRules,
      formData,

      pagination: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50],
        total: 2,
      },
    }
  },
  props : {

  },
  methods:{
   
    bc(){
      // 表单验证
      this.$refs.asset.$children[0].validate((item)=>{
        if(item){
      this.$emit('bc',JSON.parse(JSON.stringify(this.formData)))
          
        }

      })
    }
  },
  created() {
  },
}
</script>

<style lang="less" scoped>
::v-deep .el-button {
  padding: 8px 16px;
}
.title-wrap {
  background: rgb(217,236,255);
  height: 48px;
  padding: 0 10px;
  border-radius: 4px;
}
.el-button--text {
		color: @primary-color;
		// font-size: 14px;
		font-family: @pingfang;
	}
</style>