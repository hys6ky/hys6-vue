<template>
  <div class="dashboardRelease px-20">
    <div class="mt-10">
      <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)"
        >返回</el-button
      >
    </div>
    <by-container-title
      title="报表使用说明文档"
      class="my-10"
    ></by-container-title>
    <!--    <el-row class="topTitle">-->
    <!--      <span class="el-icon-s-operation">报表使用说明文档</span>-->
    <!--      <router-link :to="{ name: 'interfaceUser' }">-->
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
        <by-header-slice title="请求方式" />
        <!--        <span class="fontStyle">请求方式</span>-->
        <el-input value="POST" :disabled="true" />
      </el-col>
      <el-col :span="18">
        <by-header-slice title="请求URL" />
        <!--        <span class="fontStyle">请求URL</span>-->
        <el-input v-model="ipAndPort" :disabled="true" />
      </el-col>
    </el-row>
    <el-divider />
    <by-header-slice title="请求参数列表" />
    <!--    <span class="fontStyle">请求参数列表</span>-->
    <!--请求参数列表展示-->
    <ByTable
      border
      size="medium"
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
      <by-header-slice title="使用方式事例：" />
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
    <by-header-slice title="正常响应事例：" />
    <!--    <span class="fontStyle">正常响应事例：</span>-->
    <el-row>
      <img
        style="margin-left: 360px"
        width="200"
        height="150"
        src="@/assets/images/fourth.png"
      />
    </el-row>
    <el-divider />
    <el-row>
      <by-header-slice title="错误响应事例：" />
      <!--      <span class="fontStyle">错误响应事例：</span>-->
      <pre style="font-size: 16px">
            {
                "code":1002
                "message":UNAUTHORIZED,
                "data":"账号或密码错误"，
                "success": true
            }
        </pre
      >
    </el-row>
  </div>
</template>

<script>
import { ApiColumnArr } from "@/bizpot/G/interfaceService/mock";
export default {
  name: "dashboardRelease",
  data() {
    return {
      ipAndPort: "",
      requestAddressForToken: "",
      requestAddress: "",
      tableData: [
        {
          field: "user_id",
          fieldType: "Long",
          isRequired: "必填，与user_password同选",
          remark: "用户ID",
        },
        {
          field: "user_password",
          fieldType: "String",
          isRequired: "必填，与user_id同选",
          remark: "密码",
        },
        {
          field: "token",
          fieldType: "String",
          isRequired: "必填，和user_id,user_password选择一种模式",
          remark: "token值",
        },
        {
          field: "url",
          fieldType: "String",
          isRequired: "必填",
          remark: "请求路径(dashboardRelease)",
        },
      ],
      ApiColumnArr,
    };
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },
  },
  mounted() {
    this.tableData.push({
      field: "interface_code",
      fieldType: "String",
      isRequired: "必填(" + this.$route.query.interface_code + ")",
      remark: "接口编码",
    });
    this.getIpAndPort();
  },
  methods: {
    // 查询当前用户的IP与端口信息
    getIpAndPort() {
      this.$executeRequest
        .execGetByModuleUrl("/interfaceService/serviceuser/getIpAndPort")
        .then((res) => {
          console.log(res.data, "ipAndPort");
          this.ipAndPort =
            "http://" +
            res.data +
            "/G/interfaceService/serviceuser/impl/showReleaseDashboard";
          this.requestAddressForToken = `${window.location.host}/#/G/dashboard/preview?token=填写token&url=${this.$route.query.url}&interface_code=${this.$route.query.interface_code}`
          // this.requestAddressForToken = this.ipAndPort + "?token=abcdef" + "&url=" + this.$route.query.url + "&interface_code=" + this.$route.query.interface_code;
          // this.requestAddress =
          //   this.ipAndPort +
          //   "?user_id=2001&user_password=1" +
          //   "&url=" +
          //   this.$route.query.url +
          //   "&interface_code=" +
          //   this.$route.query.interface_code;
          this.requestAddress = `${window.location.host}/#/G/dashboard/preview?user_id=用户名&user_password=密码&url=${this.$route.query.url}&interface_code=${this.$route.query.interface_code}`;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 10px;
}

.el-input {
  margin-top: 10px;
}

/deep/ .el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
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
