<template>
  <div id='bbgl' style="padding:24px;">
    <el-row class='topTitle'>
      <span class='el-icon-location'>加工导入审核</span>
      <el-button class="goIndex" type="primary" size="mini" icon="el-icon-s-home" @click="deleteImportFilePath">
        取消
      </el-button>
      <el-button type="success" size="mini" @click="upload" style="position: relative;float: right;right: 20px;">审核
      </el-button>
    </el-row>
    <el-row>基本信息</el-row>
    <el-divider/>
    <el-row>
      <el-col v-if="tableData.dm_info!==undefined && tableData.dm_info.length!==0">
        <span style="color:#66b1ff">加工工程表差异 ：</span>
        <p v-if="tableData.dm_info.indexOf('导入版本') !== -1" style="color: red">{{ tableData.dm_info }}</p>
        <p v-else-if="tableData.dm_info.indexOf('已删除') !== -1" style="color: #1abc9c">{{ tableData.dm_info }}</p>
        <p v-else>{{ tableData.dm_info }}</p>
      </el-col>
      <el-col v-if="tableData.dm_datatable!==undefined && tableData.dm_datatable.length!==0">
        <span style="color:#66b1ff">数据表差异：</span>
        <el-row v-for="(item,index) in tableData.dm_datatable">
          <p v-if="item.indexOf('导入版本') !== -1" style="color: red">{{ item }}</p>
          <p v-else-if="item.indexOf('已删除') !== -1" style="color: #1abc9c">{{ item }}</p>
          <p v-else>{{ item }}</p>
        </el-row>
      </el-col>
      <el-col v-if="tableData.dm_category!==undefined && tableData.dm_category.length!==0">
        <span style="color:#66b1ff"> 分类表差异：</span>
        <el-row v-for="(item,index) in tableData.dm_category">
          <p v-if="item.indexOf('导入版本') !== -1" style="color: red">{{ item }}</p>
          <p v-else-if="item.indexOf('已删除') !== -1" style="color: #1abc9c">{{ item }}</p>
          <p v-else>{{ item }}</p>
        </el-row>
      </el-col>
      <el-col v-if="tableData.datatable_field_info!==undefined && tableData.datatable_field_info.length!=0">
        <span style="color:#66b1ff"> 数据表字段差异：</span>
        <el-row v-for="(item,index) in tableData.datatable_field_info">
          <p v-if="item.indexOf('导入版本') !== -1" style="color: red">{{ item }}</p>
          <p v-else-if="item.indexOf('已删除') !== -1" style="color: #1abc9c">{{ item }}</p>
          <p v-else>{{ item }}</p>
        </el-row>
      </el-col>
      <el-col v-if="tableData.dm_operation_info!==undefined && tableData.dm_operation_info.length!=0">
        <span style="color:#66b1ff"> 数据表操作差异：</span>
        <el-row v-for="(item,index) in tableData.dm_operation_info">
          <p v-if="item.indexOf('导入版本') !== -1" style="color: red">{{ item }}</p>
          <p v-else-if="item.indexOf('已删除') !== -1" style="color: #1abc9c">{{ item }}</p>
          <p v-else>{{ item }}</p>
        </el-row>
      </el-col>
      <el-col v-if="tableData.dm_relevant_info!==undefined && tableData.dm_relevant_info.length!=0">
        <span style="color:#66b1ff"> 前后置作业表差异：</span>
        <el-row v-for="(item,index) in tableData.dm_relevant_info">
          <p v-if="item.indexOf('导入版本') !== -1" style="color: red">{{ item }}</p>
          <p v-else-if="item.indexOf('已删除') !== -1" style="color: #1abc9c">{{ item }}</p>
          <p v-else>{{ item }}</p>
        </el-row>
      </el-col>
    </el-row>
    <!-----------------------------表作业影响--------------------------->
    <el-divider/>
    <el-row>
      <el-col>表作业影响</el-col>
      <el-col>
        <el-carousel indicator-position="outside" height="500px">
          <el-carousel-item v-for="item in etlJob" :key="item.tableName">
            <h3>{{ item.tableNameem }}</h3>
            <div :id="item.tableName" :style="{width: '100%', height: '500px'}"></div>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <!-----------------------------表影响--------------------------->
    <el-divider/>
    <el-row>
      <el-col>表影响</el-col>
      <el-col>
        <el-carousel indicator-position="outside" height="500px">
          <el-carousel-item v-for="item in dclTable" :key="item.tableName">
            <h3>{{ item.tableNameem }}</h3>
            <div :id="item.tableName" :style="{width: '100%', height: '500px'}"></div>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <!--加载过度-->
    <transition name="fade">
      <loading v-if="isLoading"/>
    </transition>
  </div>
</template>

<script>
import * as message from "@/utils/message";
import Loading from '@/components/loading'
// import jsMind from 'jsmind';
require('@/assets/css/jsmind.css');
export default {
  components: {
    Loading
  },
  data() {
    return {
      tableData: {},
      dclTable: [],
      etlJob: [],
      isLoading: false
    }
  },
  mounted() {
    var file_path = this.$route.query.file_path;
    console.log(file_path)
    console.log(file_path != null && file_path != '')
    if (file_path != null && file_path != '') {
      this.getImportReviewData(file_path);
    } else {
      this.$Msg.customizTitle("未获得文件地址", "warning");
      this.$router.go(-1);
    }
  },
  methods: {
    getImportReviewData(file_path) {
      this.$executeRequest.execGetByModulName('/market/getImportReviewData', {
        "file_path": file_path
      }).then(res => {
        if (res && res.success) {
          this.tableData = res.data;
          for (let key in res.data.jobInfluence) {
            let obj = {}
            obj['etlData'] = res.data.jobInfluence[key]
            obj['tableName'] = 'jobName' + key;
            this.etlJob.push(obj)
          }
          for (let key in res.data.tableInfluence) {
            let obj = {}
            obj['etlData'] = res.data.tableInfluence[key]
            obj['tableName'] = 'tableName' + key;
            this.dclTable.push(obj)
          }
          setTimeout(() => {
            this.etlJob.map(item => {
              this.load_jsmind(item.tableName, item.etlData)
            })
            this.dclTable.map(item => {
              this.load_jsmind(item.tableName, item.etlData)
            })
          }, 1000)
        }
      });
    },
    deleteImportFilePath() {
      this.$executeRequest.execGetByModulName('/market/deleteImportFilePath', {
        'file_path': this.$route.query.file_path
      }).then(res => {
        if (res && res.success) {
          this.$router.push({
            path: 'market'
          })
        }
      })
    },
    upload() {
      message.confirmMsg('确定审核吗').then(res => {
        this.isLoading = true;
        this.$executeRequest.execGetByModulName('/market/uploadFile', {
          "file_path": this.$route.query.file_path
        }).then(res => {
          if (res && res.success) {
            this.isLoading = false;
            this.$Msg.customizTitle("审核成功", "success");
            this.$router.push({
              path: 'market'
            })
          } else {
            this.isLoading = false;
          }
        });
      }).catch(() => {})
    },
    load_jsmind(id, data) {
      let options = {
        container: id,
        editable: false,
        theme: 'primary'
      }
      let mind = {
        'meta': {},
        'format': 'node_array',
        'data': data
      }
      jsMind.show(options, mind)
    },
  }
}
</script>

<style scoped>

</style>
