<template>
<div class="sqlQueryRelation px-20">
  <div class="mt-10">
    <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)"
    >返回</el-button
    >
  </div>
  <by-container-title title="sql血缘查询接口说明" class="my-10"></by-container-title>
<!--    <el-row class="topTitle">-->
<!--        <span class="el-icon-s-operation">sql血缘查询接口说明</span>-->
<!--         <router-link :to="{name:'interfaceUser'}">-->
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
        <el-input v-model="requestAddressForToken" style="font-size: 16px;margin-top: 10px" :disabled="true" />
        <!--<el-divider>或</el-divider>-->
        <!--<el-input v-model="requestAddress" style="font-size: 16px;margin-top: 10px" :disabled="true"/>-->
    </el-row>
    <el-divider />
  <by-header-slice title="正常响应事例："/>
<!--    <span class="fontStyle">正常响应事例：</span>-->
    <el-row>
        <pre style="font-size: 14px;">
                    {
                        "code": 999,
                        "data": {
                            "condition": [],
                            "targetTableField": {
                                "a": [
                                    {
                                        "sourcetable": "B",
                                        "sourcecolumn": "a"
                                    }
                                ]
                            },
                            "tableColumn": {},
                            "tableName": "B",
                            "relation": []
                        },
                        "message": "Success",
                        "success": true
                    }
                </pre>
    </el-row>
    <el-divider />
    <!--<el-row :gutter="20">-->
    <!--<el-col :span="12">-->
    <!--<span class="fontStyle">错误响应字段明细</span>-->
    <!--&lt;!&ndash;响应参数列表展示&ndash;&gt;-->
    <!--<el-table :data="errorData" border size="medium">-->
    <!--<el-table-column prop="state" label="状态字段名" align="center"/>-->
    <!--<el-table-column prop="description" label="状态说明" align="center"/>-->
    <!--</el-table>-->
    <!--</el-col>-->
    <!--<el-col :span="12">-->
    <!--<span class="fontStyle">错误响应如下：</span>-->
    <!--<pre style="font-size: 16px;">-->
    <!--{-->
    <!--"status":UNAUTHORIZED,-->
    <!--"message":"账号或密码错误..."-->
    <!--}-->
    <!--</pre>-->
    <!--</el-col>-->
    <!--</el-row>-->
</div>
</template>

<

<script>

import {ApiColumnArr} from "@/bizpot/G/interfaceService/mock";
export default {
    name: "tableUsePermissions",
    data() {
        return {
          ApiColumnArr,
            ipAndPort: '',
            requestAddressForToken: '',
            // requestAddress: '',
            tableData: [{
                    field: 'sql',
                    fieldType: 'String',
                    isRequired: '必填',
                    remark: 'SQL',
                },
                {
                    field: 'dbtype',
                    fieldType: 'String',
                    isRequired: '必填',
                    remark: '数据库类型（teradata,oracle,mysql,phoneix,sqlserver,db2,odps,hive,h2)中选一个',
                },
            ],
            // errorData: [
            //     {
            //         state: 'UNAUTHORIZED',
            //         description: '账号或密码错误',
            //     },
            //     {
            //         state: 'INTERFACE_STATE',
            //         description: '接口处于禁用状态',
            //     },
            //     {
            //         state: 'USE_VALIDDATE',
            //         description: '接口使用效期已过',
            //     },
            //     {
            //         state: 'NO_PERMISSIONS',
            //         description: '没有接口使用权限',
            //     },
            //     {
            //         state: 'START_DATE_ERROR',
            //         description: '接口开始使用日期未到',
            //     },
            //     {
            //         state: 'EXCEPTION',
            //         description: '异常错误',
            //     },
            // ],
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
              "/G/interfaceService/serviceuser/impl/analysisSqlData/";
          this.requestAddressForToken =
              this.ipAndPort + "?sql=select a from b&dbtype=oracle";
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
