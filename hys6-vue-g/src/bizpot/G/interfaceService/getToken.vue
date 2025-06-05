<template>
<div class="getToken px-20">
    <div class="mt-10">
      <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)"
      >返回</el-button
      >
    </div>
    <by-container-title title="权限获取接口说明" class="my-10"></by-container-title>

<!--    <el-row class='topTitle'>-->
<!--        <span class="el-icon-s-operation">权限获取接口说明</span>-->
<!--        <router-link :to="{name:'interfaceService'}">-->
<!--            <el-button class="goIndex" type="primary" size="mini" icon="el-icon-s-home">-->
<!--                返回首页-->
<!--            </el-button>-->
<!--        </router-link>-->
<!--    </el-row>-->
    <el-row :gutter="20">
        <el-col :span="6">
            <by-header-slice title="请求方式"/>
<!--            <span class="fontStyle">请求方式</span>-->
            <el-input value="GET" :disabled="true" />
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
    <ByTable
        class="mt-10"
        border
        size="medium"
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
        <by-header-slice title="使用方式如下"/>
<!--        <span class="fontStyle">使用方式如下</span>-->
        <el-input v-model="requestAddress" style="font-size: 16px;margin-top: 10px" :disabled="true">
        </el-input>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
        <el-col :span="13">
            <by-header-slice title="正常响应事例："/>
<!--            <span class="fontStyle">正常响应事例：</span>-->
            <pre style="font-size: 14px;">
                {
                    "code": 999,
                    "message": "Success",
                    "data": {
                        "token_id": "5ec2097ffed0fb06e0a3d7158fed09ac",
                        "expires_in": 7200,
                        "use_valid_date":"1624858939240"
                    },
                    "success": true
                }
            </pre>
        </el-col>
        <el-col :span="11">
            <by-header-slice title="错误响应事例："/>
<!--            <span class="fontStyle">错误响应事例：</span>-->
            <pre style="font-size: 14px;">
                {
                    "code":1002,
                    "message":"UNAUTHORIZED"
                    "data":"账号或密码错误",
                    "success":false
                }
            </pre>
        </el-col>
    </el-row>
</div>
</template>

<script>
import ByTable from "@/components/global/ByTable";
import {ApiColumnArr} from "@/bizpot/G/interfaceService/mock";
import ByContainerTitle from "@/components/global/ByContainerTitle";
import ByHeaderSlice from "@/components/global/ByHeaderSlice";
export default {
    name: "getToken",
  components: {ByHeaderSlice, ByContainerTitle, ByTable},
  data() {
        return {
            ipAndPort: '',
            requestAddress: '',
            tableData: [{
                    field: 'user_id',
                    fieldType: 'Long',
                    isRequired: '必填',
                    remark: '用户ID',
                },
                {
                    field: 'user_password',
                    fieldType: 'String',
                    isRequired: '必填',
                    remark: '密码',
                },
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
          this.requestAddress = this.ipAndPort + "?user_id=1015&user_password=111111"
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
    color: #0b0b0c;
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
