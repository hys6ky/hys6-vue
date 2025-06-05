<template>
  <div class="tableSearchGetJson px-20">
    <div class="mt-10">
      <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)"
      >返回</el-button
      >
    </div>
    <by-container-title title="表结构查询-获取json信息接口说明" class="my-10"></by-container-title>
<!--    <el-row class="topTitle">-->
<!--      <span class="el-icon-s-operation">表结构查询-获取json信息接口说明</span>-->
<!--       <router-link :to="{name:'interfaceUser'}">-->
<!--        <el-button-->
<!--          class="goIndex"-->
<!--          type="primary"-->
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
        <el-input value="POST" :disabled="true"> </el-input>
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
<!--      <el-table-column prop="field" width="160px" label="字段" align="center" />-->
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
<!--      <span class="fontStyle">使用方式事例：</span>-->
      <el-input
        v-model="requestAddressForToken"
        style="font-size: 16px; margin-top: 10px"
        :disabled="true"
      />
      <el-divider>或</el-divider>
      <el-input
        v-model="requestAddress"
        style="font-size: 16px; margin-top: 10px"
        :disabled="true"
      />
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :span="13">
        <by-header-slice title="正常响应事例："/>
<!--        <span class="fontStyle">正常响应事例：</span>-->
        <pre style="font-size: 14px">
                {
                    "code":999
                    "message":"Success",
                    "data":{
                        "table_column_name":"AGENT_ID,AGENT_NAME,AGENT_TYPE"
                    },
                    "success":true
                }
            </pre
        >
      </el-col>
      <el-col :span="11">
        <by-header-slice title="错误响应事例："/>
<!--        <span class="fontStyle">错误响应事例：</span>-->
        <pre style="font-size: 14px">
                {
                    "code":1002,
                    "message":"UNAUTHORIZED"
                    "data":"账号或密码错误",
                    "success":false
                }
            </pre
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {ApiColumnArr} from "@/bizpot/G/interfaceService/mock";
export default {
    name: "tableSearchGetJson",
    data() {
        return {
            ipAndPort: '',
            requestAddressForToken: '',
            requestAddress: '',
            tableData: [{
                    field: 'user_id',
                    fieldType: 'Long',
                    isRequired: '必填，与user_password同选',
                    remark: '用户ID',
                },
                {
                    field: 'user_password',
                    fieldType: 'String',
                    isRequired: '必填，与user_id同选',
                    remark: '密码',
                },
                {
                    field: 'token',
                    fieldType: 'String',
                    isRequired: '必填，和user_id,user_password选择一种模式',
                    remark: 'token值',
                },
                {
                    field: 'url',
                    fieldType: 'String',
                    isRequired: '必填',
                    remark: '请求路径(tableSearchGetJson)',
                },
                {
                    field: 'tableName',
                    fieldType: 'String',
                    isRequired: '必填',
                    remark: '要查询表名',
                }
            ],
          ApiColumnArr,
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
          this.requestAddressForToken = this.ipAndPort + "?token=abcdef&tableName=dsd&url=" +
              this.$route.query.url;
          this.requestAddress = this.ipAndPort +
              "?user_id=1005&user_password=111111&tableName=dsd&url=" + this.$route.query.url
        })
      },
    }
}
</script>

<style lang="less" scoped>
.el-table {
  width: 100%;
  margin-top: 10px;
}

.el-input {
  margin-top: 10px;
}

.fontStyle {
  color: #2196f3;
  font-size: 18px;
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
