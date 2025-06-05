<template>
  <div class="unstructuredFileDownloadApi px-20">
    <div class="mt-10">
      <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)"
      >返回</el-button
      >
    </div>
    <by-container-title title="非结构化文件下载使用说明" class="my-10"></by-container-title>
<!--    <el-row class="topTitle">-->
<!--      <span class="el-icon-s-operation">全文检索接口使用说明</span>-->
<!--      <router-link :to="{name:'interfaceUser'}">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          class="goIndex"-->
<!--          size="mini"-->
<!--          icon="el-icon-s-home"-->
<!--        >-->
<!--          返回首页-->
<!--        </el-button>-->
<!--      </router-link>-->
<!--    </el-row>-->
    <el-row :gutter="20">
      <el-col :span="6">
        <by-header-slice title="请求方式"/>
<!--        <span class="fontStyle">请求方式</span>-->
        <el-input value="POST" :disabled="true" />
      </el-col>
      <el-col :span="18">
        <by-header-slice title="请求URL"/>
<!--        <span class="fontStyle">请求URL</span>-->
        <el-input v-model="ipAndPort" :disabled="true" />
      </el-col>
    </el-row>
    <el-divider />
    <by-header-slice title="请求参数列表"/>
<!--    <span class="fontStyle">请求参数列表</span>-->
    <!--请求参数列表展示-->
    <ByTable border size="medium"
             class="mt-10"
             :tableData="tableData"
             :columnArr="ApiColumnArr"
    >
    </ByTable>
<!--    <el-table :data="tableData" border size="medium">-->
<!--      <el-table-column prop="field" label="字段" width="160px" align="center" />-->
<!--      <el-table-column-->
<!--        prop="fieldType"-->
<!--        width="100px"-->
<!--        label="类型"-->
<!--        align="center"-->
<!--      />-->
<!--      <el-table-column prop="isRequired" label="是否必填" align="center" />-->
<!--      <el-table-column prop="remark" label="描述" align="center" />-->
<!--    </el-table>-->
    <el-divider />
    <el-row>
      <by-header-slice title="使用方式如下"/>
<!--      <span class="fontStyle">使用方式如下</span>-->
      <el-input
        v-model="requestAddress"
        style="font-size: 16px; margin-top: 10px"
        :disabled="true"
      />
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :span="12">
        <by-header-slice title="正常响应字段明细"/>
<!--        <span class="fontStyle">正常响应字段明细</span>-->
        <!--请求参数列表展示-->
        <el-table :data="responseData" border size="medium">
          <el-table-column prop="field" label="响应字段" align="center" />
          <el-table-column prop="fieldType" label="字段类型" align="center" />
          <el-table-column prop="remark" label="描述" align="center" fixed="right" />
        </el-table>
      </el-col>
      <el-col :span="12" class="filtstyle">
        <by-header-slice title="正常显示如下："/>
<!--        <span class="fontStyle">正常显示如下：</span>-->
        <pre style="font-size: 14px;">返回的下载文件</pre>
<!--        <scrollbar>-->
<!--          <pre style="font-size: 14px;">-->
<!--                        返回的下载文件-->
<!--                </pre-->
<!--          >-->
<!--        </scrollbar>-->
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :span="12">
        <by-header-slice title="错误响应字段明细"/>
<!--        <span class="fontStyle">错误响应字段明细</span>-->
        <!--响应参数列表展示-->
        <el-table :data="errorData" border size="medium">
          <el-table-column prop="state" label="状态字段名" align="center" />
          <el-table-column prop="description" label="状态说明" align="center" fixed="right" />
        </el-table>
      </el-col>
      <el-col :span="12">
        <by-header-slice title="错误响应如下："/>
<!--        <span class="fontStyle">错误响应如下：</span>-->
        <pre style="font-size: 14px"></pre>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Scrollbar from '@/components/global/Scrollbar.vue';
import {ApiColumnArr} from "@/bizpot/G/interfaceService/mock";
export default {
    name: "unstructuredFileDownloadApi",
    components: {
        Scrollbar
    },
    data() {
        return {
          ApiColumnArr,
            ipAndPort: '',
            requestAddressForToken: '',
            requestAddress: '',
            tableData: [{
                    field: 'id',
                    fieldType: 'String',
                    isRequired: '选填(唯一文件ID,文件编号，即solr中存储的主键id)',
                    remark: '要查询的文件的唯一id',
                },
                {
                    field: 'file_name',
                    fieldType: 'String',
                    isRequired: '选填(文件名)',
                    remark: '文件名',
                },
            ],
            errorData: [],
            responseData: []
        }
    },
    watch: {
        $route(to, from) {
            this.$router.go(0)
        }
    },
    mounted() {
        this.getIpAndPort();
    },
    methods: {
      // 查询当前用户的IP与端口信息
      getIpAndPort() {
        this.$executeRequest.execGetByModuleUrl('/interfaceService/serviceuser/getIpAndPort').then(res =>{
          this.ipAndPort = "http://" + res.data +
              "/G/interfaceService/serviceuser/impl/" + this.$route.query.url;
          this.requestAddress = this.ipAndPort +
              "?id=21551f30-bdb4&file_name=a.png";
        })
      },
    }
}
</script>

<style lang="less" scoped>
//.filtstyle >>> .scrollbar-wrap .scrollbar__content {
//  position: relative;
//}

.el-table {
  margin-top: 10px;
}

.el-input {
  margin-top: 10px;
}

/deep/ .el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #0b0b0c;
  cursor: not-allowed;
  height: 32px;
  font-size: 14px;
  font-family: @pingfang;
  color: @titletxt-color;
  padding: 0 10px;
}

.fontStyle {
  color: #2196f3;
  font-size: 18px;
}
.goBackBtn {
  width: 62px;
  height: 28px;
  line-height: 26px;
  padding: 0;
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
</style>
