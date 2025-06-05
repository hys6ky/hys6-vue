<template>
<div class="rowKeySearch px-20">
  <div class="mt-10">
    <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)"
    >返回</el-button
    >
  </div>
  <by-container-title title="rowKey查询接口说明" class="my-10"></by-container-title>
<!--    <el-row class="topTitle">-->
<!--        <span class="el-icon-s-operation">rowKey查询接口说明</span>-->
<!--          <router-link :to="{name:'interfaceUser'}">-->
<!--            <el-button class="goIndex" type="primary" size="mini" icon="el-icon-s-home">-->
<!--                返回首页-->
<!--            </el-button>-->
<!--        </router-link>-->
<!--    </el-row>-->
    <el-row :gutter="20">
        <el-col :span="6">
          <by-header-slice title="请求方式"/>
<!--            <span class="fontStyle">请求方式</span>-->
            <el-input value="POST" :disabled="true" />
        </el-col>
        <el-col :span="18">
          <by-header-slice title="请求URL"/>
<!--            <span class="fontStyle">请求URL</span>-->
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
<!--        <el-table-column prop="field" label="字段" width="160px" align="center" />-->
<!--        <el-table-column prop="fieldType" width="100px" label="类型" align="center" />-->
<!--        <el-table-column prop="isRequired" label="是否必填" align="center" />-->
<!--        <el-table-column prop="remark" label="描述" align="center" />-->
<!--    </el-table>-->
    <el-divider />
    <el-row>
      <by-header-slice title="使用方式事例："/>
<!--        <span class="fontStyle">使用方式事例：</span>-->
        <el-input v-model="requestAddressForToken" :disabled="true" />
        <el-divider>或</el-divider>
        <el-input v-model="requestAddress" :disabled="true" />
    </el-row>
    <el-divider />
    <el-row :gutter="20">
        <el-col :span="12">
          <by-header-slice title="outType=stream, dataType=JSON 正常响应事例："/>
<!--            <span class="fontStyle">outType=stream, dataType=JSON 正常响应事例：</span>-->
            <pre style="font-size: 14px;">
                   {
                        "code":999
                        "message":"Success",
                        "data":{
                            "table_column_name":"AGENT_ID,AGENT_NAME,AGENT_TYPE"
                        },
                        "success": true
                    }
            </pre>
        </el-col>
        <el-col :span="12">
          <by-header-slice title="outType=stream, dataType=CSV 正常响应事例："/>
<!--            <span class="fontStyle">outType=stream, dataType=CSV 正常响应事例：</span>-->
            <pre style="font-size: 14px;">
                age,phone,user_email,sex
                30,123456789,1232313@aa.com,nan
                30,123456789,112323@aa.com,nan
                30,123456789,adsa3@aa.com,nan
                30,123456789,12fasf3@aa.com,nan
                30,123456789,1csa13@aa.com,nan
                30,123456789,asf13@aa.com,nan
                30,123456789,hssh313@aa.com,nan
                30,123456789,1232313@aa.com,nan
                30,123456789,1232313@aa.com,nan
                30,123456789,1232313@aa.com,nan
            </pre>
        </el-col>
    </el-row>
    <el-divider />
    <el-row>
        <el-col :span="12">

          <by-header-slice title="输出的数据形式(file)正常响应事例："/>
<!--            <span class="fontStyle">输出的数据形式(file)正常响应事例：</span>-->
            <pre style="font-size: 14px;">
                {
                    "code":999
                    "message":"Success",
                    "data":{
                        "dataType":"json",
                        "uuid":"3e4a9b35-5b59-4349-a5b3-ea2cf21394a5",
                        "outType":"file"
                    },
                    "success": true
                }
            </pre>
        </el-col>
        <el-col :span="12">
          <by-header-slice title="错误响应事例："/>
<!--            <span class="fontStyle">错误响应事例：</span>-->
            <pre style="font-size: 14px;">
                {
                    "code":1002,
                    "message":"UNAUTHORIZED"
                    "data":"账号或密码错误",
                    "success": false
                }
            </pre>
        </el-col>
    </el-row>
</div>
</template>

<script>
import {ApiColumnArr} from "@/bizpot/G/interfaceService/mock";
export default {
    name: "rowKeySearch",
    data() {
        return {
          ApiColumnArr,
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
                    remark: '请求路径(rowKeySearch)',
                },
                {
                    field: 'en_table',
                    fieldType: 'String',
                    isRequired: '必填',
                    remark: '要查询表名',
                },
                {
                    field: 'en_column',
                    fieldType: 'String',
                    isRequired: '非必填',
                    remark: '格式:(列族名:列英文名)，多列以|分割，不填为整行',
                },
                {
                    field: 'rowkey',
                    fieldType: 'String',
                    isRequired: '必填',
                    remark: '要查询的rowkey(多个列的组合rowkey请按照指定顺序传值)',
                },
                {
                    field: 'get_version',
                    fieldType: 'String',
                    isRequired: '选填',
                    remark: '需要取回的数据的版本号（可以|分割，要与列对应）',
                },
                {
                    field: 'dataType',
                    fieldType: 'String',
                    isRequired: '必填 ( json / csv)只能选择一种',
                    remark: '输出的数据类型',
                },
                {
                    field: 'outType',
                    fieldType: 'String',
                    isRequired: '必填 ( stream / file)只能选择一种',
                    remark: '输出的数据形式',
                },
                {
                    field: 'asynType',
                    fieldType: 'String',
                    isRequired: '选填，如果使用此参数需注意以下事项\n' +
                        'outType为file时使用下面参数：\n' +
                        '0 - 表示同步返回\n' +
                        '1 - 表示异步回调返回，此时需要backurl参数信息\n' +
                        '2 - 表示异步通过轮询返回，此时需要filename，filepath参数信息',
                    remark: '是否异步状态',
                },
                {
                    field: 'backurl',
                    fieldType: 'String',
                    isRequired: '与参数asynType一起使用(如果asynType为1,则必填回调URL)',
                    remark: '回调返回URL',
                },
                {
                    field: 'filename',
                    fieldType: 'String',
                    isRequired: '与参数asynType一起使用(如果asynType为2,则必填轮询返回文件名称)',
                    remark: '轮询返回文件名称',
                },
                {
                    field: 'filename',
                    fieldType: 'String',
                    isRequired: '与参数asynType一起使用(如果asynType为2,则必填轮询返回文件名称)',
                    remark: '轮询返回文件路径',
                }
            ],
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
          this.requestAddressForToken =
              this.ipAndPort + "?token=AJALalfja&url=" + this.$route.query.url +
              "&en_table=dsd&rowkey=dajda&dataType=json&outType=stream&asynType=0";
          this.requestAddress = this.ipAndPort +
              "?user_id=1005&user_password=111111&url=" + this.$route.query.url +
              "&en_table=dsd&rowkey=dajda&dataType=json&outType=stream&asynType=0";
        })
      },
    }
}
</script>

<style lang="less" scoped>
.el-table {
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
    background-color: #F5F7FA;
    border-color: #E4E7ED;
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
