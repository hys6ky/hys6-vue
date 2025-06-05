<template>
<div class="generalQuery px-20">
    <div class="mt-10">
      <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)"
      >返回</el-button
      >
    </div>
    <by-container-title title="单表普通查询接口说明" class="my-10"></by-container-title>
<!--    <el-row class='topTitle'>-->
<!--        <span class="el-icon-s-operation">单表普通查询接口说明</span>-->
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
<!--        <el-table-column prop="field" width="160px" label="字段" align="center" />-->
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
        <el-input v-model="requestAddress" style="font-size: 16px;margin-top: 10px" :disabled="true" />
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
                    "data":[
                        {
                            "age":30,
                            "phone":123456789,
                            "user_email":"1232313@aa.com",
                            "sex":"nan"
                        }
                    ],
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
    <el-row :gutter="20">
        <el-col :span="13">
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
        <el-col :span="11">
          <by-header-slice title="错误响应事例："/>
<!--            <span class="fontStyle">错误响应事例：</span>-->
            <pre style="font-size: 14px;margin-top: 10px">
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
    name: "generalQuery",
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
                    remark: '请求路径（generalQuery）',
                },
                {
                    field: 'tableName',
                    fieldType: 'String',
                    isRequired: '必填',
                    remark: '要查询表名',
                },
                {
                    field: 'selectColumn',
                    fieldType: 'String',
                    isRequired: '选填，需要查询的列名(column1,column2....等,号隔开)，如果没有，查询所有字段',
                    remark: '查询字段',
                },
                {
                    field: 'whereColumn',
                    fieldType: 'String',
                    isRequired: '查询条件(column1=zhangsan,age>=23...等用,号隔开)，目前支持>=,<=,<,>,=,!=',
                    remark: '查询过滤条件',
                },
                {
                    field: 'num',
                    fieldType: 'Integer',
                    isRequired: '选填，不填默认显示10条,填写方式如: num=10',
                    remark: '显示条数',
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
                    remark: '输出的数据形式，stream数据默认展示100条',
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
                    field: 'filepath',
                    fieldType: 'String',
                    isRequired: '与参数asynType一起使用(如果asynType为2,则必填轮询返回文件名称)',
                    remark: '轮询返回文件路径',
                }
            ],
            errorData: [{
                    state: 'UNAUTHORIZED',
                    description: '账号或密码错误',
                },
                {
                    state: 'INTERFACE_STATE',
                    description: '接口处于禁用状态',
                },
                {
                    state: 'USE_VALIDDATE',
                    description: '接口使用效期已过',
                },
                {
                    state: 'TABLE_NOT_EXISTENT',
                    description: '表名称不存在或为空',
                },
                {
                    state: 'COLUMN_NOT_EXISTENT',
                    description: '列名称错误或者为空',
                },
                {
                    state: 'NO_PERMISSIONS',
                    description: '没有接口使用权限',
                },
                {
                    state: 'START_DATE_ERROR',
                    description: '接口开始使用日期未到',
                },
                {
                    state: 'EXCEPTION',
                    description: '异常错误',
                },
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
              this.ipAndPort +
              "?token=AJALalfja&url=" + this.$route.query.url + "&tableName=emp" +
              "&whereColumn=user_name=zhangsan&num=10" +
              "&dataType=json&outType=stream&asynType=0";
          this.requestAddress = this.ipAndPort +
              "?user_id=1005&user_password=111111&url=" + this.$route.query.url +
              "&tableName=emp&whereColumn=user_name=zhangsan&num=10&dataType=json&outType=stream&asynType=0";
        })
      },
    }
}
</script>

<style lang="less" scoped>
.fontStyle {
    color: #2196f3;
    font-size: 18px;

}

.el-table {
    margin-top: 10px;
}

.el-input {
    margin-top: 10px;
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
