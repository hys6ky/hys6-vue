<template>
  <div class="px-20 pb-20">
<!--    <div class="d-flex py-10 justify-content-between">-->
<!--      <ByHeaderSlice title="SOLR数据关联" />-->
<!--    </div>-->
<!--    <ByContainerTitle-->
<!--        title = "SOLR数据关联"-->
<!--        :addBtn = false-->
<!--        style="margin: 5px 0px"-->
<!--    />-->
    <el-row style="margin-top: 10px">
      <el-form ref="solrRelationForm" :model="solrRelationForm" :inline="true">
        <el-form-item label="关联表名" prop="relationTableName" :rules="filter_rules([{required: true}])">
          <el-input v-model="solrRelationForm.relationTableName" placeholder="请输入关联表名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="executeSolrDataAssociation('solrRelationForm')">关联</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 加载遮罩层 start -->
    <transition>
      <loading v-if="isLoading"/>
    </transition>
    <!-- 加载遮罩层 end -->
  </div>
</template>

<script>
import Loading from '@/components/loading';
import * as validator from "@/utils/validator";
export default {
  name: "",
  components: {
    Loading,
  },
  data() {
    return {
      rule: validator.default,
      //关联表名
      solrRelationForm: {
        relationTableName: ''
      },
      //页面加载遮罩层
      isLoading: false,
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    //执行Solr数据关联
    executeSolrDataAssociation(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.isLoading = true;
          this.$executeRequest.execByControllerMappingName('/executeSolrDataAssociation', {
            'relationTableName': this.solrRelationForm.relationTableName
          }).then((res) => {
            this.isLoading = false;
            if (res.success) {
              this.$Msg.customizTitle('关联成功', 'success')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.lines {
  margin-top: 4px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}
.topTitleLocal {
  margin-bottom: 6px !important;
}
</style>
