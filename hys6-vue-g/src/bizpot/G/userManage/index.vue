<template>
  <div class="userManage px-20">
    <div class="pt-10">
      <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)"
        >返回</el-button
      >
    </div>

    <ByQuickSearch
      :formItems="formItems"
      @reset="resetUser"
      @search="selectUserInfo"
    />
    <by-container-title
      title="用户列表"
      style="margin-top: 5px; margin-bottom: 5px"
    >
      <el-button
        class="goIndex"
        type="primary"
        size="mini"
        @click="addUserButton()"
      >
        添加用户
      </el-button>
    </by-container-title>

    <!--用户信息列表展示-->
    <div v-if="tableData.length > 0" style="height: calc(100% - 57px)">
      <ByTable
        :tableData="
          tableData.slice(
            (pagination.pageNum - 1) * pagination.pageSize,
            pagination.pageNum * pagination.pageSize
          )
        "
        :columnArr="columnArr"
        :pagination="pagination"
        @operateItem="operateItem"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChangeList"
      ></ByTable>
    </div>
    <div v-else class="pt-20" style="height: calc(100% - 57px)">
      <ByEmpty />
    </div>
    <!-- 分页内容 -->
    <!--    <el-row class="pagination">-->
    <!--      <el-pagination @current-change="handleCurrentChangeList" :current-page="currPage"-->
    <!--                     @size-change="handleSizeChange" :page-sizes="[5, 10, 50, 100,500]"-->
    <!--                     :page-size="pageSize" layout=" total,sizes,prev, pager, next,jumper"-->
    <!--                     :total="totalSize" class='locationcenter'/>-->
    <!--    </el-row>-->
    <!--新增/编辑用户弹出框-->
    <ByModel
      :visible.sync="dialogUserFormVisible"
      :modelTitle="customTitle"
      modelWidth="600px"
      @close="cancel"
      @closed="dialogClosed"
    >
      <ByModelForm
        :formData="userForm"
        :formItems="modelFormItems"
        :formRules="modelFormRules"
        :formConfig="modelFormConfig"
        ref="userForm"
      />
      <template slot="modalFoot">
        <el-button @click="cancel" size="mini">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          v-if="isEditor"
          @click="updateUser"
          >更 新
        </el-button>
        <el-button type="primary" size="mini" v-else @click="addUser"
          >保 存
        </el-button>
      </template>
    </ByModel>
  </div>
</template>
<script>
import * as validator from "@/utils/validator";
import ByContainerTitle from "@/components/global/ByContainerTitle";
import {
  formItems,
  pagination,
  columnArr,
  modelFormItems,
  modelFormRules,
  modelFormConfig,
} from "@/bizpot/G/userManage/mock";
export default {
  name: "userManage",
  components: { ByContainerTitle },
  //写定义的变量数据方法等
  data() {
    return {
      rule: validator.default,
      tableData: [],
      customTitle: "",
      isEditor: false,
      user_name: "",
      dialogUserFormVisible: false,
      userForm: {
        user_name: "",
        user_password: "",
        user_email: "",
        user_remark: "",
      },
      searchForm: {
        user_name: "",
      },
      formItems,
      columnArr,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      modelFormRules,
      modelFormItems,
      modelFormConfig,
    };
  },
  mounted() {
    this.selectUserInfo();
  },
  methods: {
    //查询获取用户管理首页数据
    selectUserInfo(val) {
      this.searchForm.user_name = Object.assign({}, val)["user_name"];
      let params = {};
      params["user_name"] = this.searchForm.user_name;
      this.$executeRequest
        .execGetByModuleUrl(
          "/interfaceManagement/userManage/selectUserInfo",
          params
        )
        .then((res) => {
          this.tableData = res.data;
          this.pagination.total = res.data.length;
        });
    },
    // 重置
    resetUser() {
      this.searchForm.user_name = "";
      this.selectUserInfo();
    },
    // 根据用户ID查询用户信息
    selectUserById(row) {
      this.dialogUserFormVisible = true;
      this.customTitle = "修改用户";
      this.isEditor = true;
      let params = {};
      params["user_id"] = row.user_id;
      this.$executeRequest
        .execGetByModuleUrl(
          "/interfaceManagement/userManage/selectUserById",
          params
        )
        .then((res) => {
          this.userForm = res.data;
        });
    },
    addUserButton() {
      // 表单清空
      this.userForm = {};
      this.isEditor = false;
      this.dialogUserFormVisible = true;
      this.customTitle = "新增用户";
    },
    // 新增用户
    addUser() {
      this.$refs.userForm.$refs[this.modelFormConfig.ref].validate((valid) => {
        if (valid) {
          // 处理参数
          this.$executeRequest
            .execGetByPostModuleUrl(
              "/interfaceManagement/userManage/addUser",
              this.userForm
            )
            .then((res) => {
              this.$Msg.saveSuccess(res);
              this.selectUserInfo();
              this.dialogUserFormVisible = false;
              // 表单清空
              this.$refs.userForm.$refs[this.modelFormConfig.ref].resetFields();
            });
        }
      });
    },
    //表格操作
    operateItem(type, row) {
      if (type === "edit") {
        this.selectUserById(row);
      } else if (type === "del") {
        this.deleteUser(row);
      }
    },
    // 编辑更新用户
    updateUser() {
      this.$refs.userForm.$refs[this.modelFormConfig.ref].validate((valid) => {
        if (valid) {
          // 处理参数
          this.$executeRequest
            .execGetByPostModuleUrl(
              "/interfaceManagement/userManage/updateUser",
              this.userForm
            )
            .then((res) => {
              this.$Msg.updateSuccess(res);
              this.selectUserInfo();
              this.dialogUserFormVisible = false;
              // 表单清空
              this.$refs.userForm.$refs[this.modelFormConfig.ref].resetFields();
            });
        }
      });
    },
    // 删除用户
    deleteUser(row) {
      let params = {};
      params["user_id"] = row.user_id;
      this.$Msg
        .confirmMsg("确定删除吗")
        .then((res) => {
          this.$executeRequest
            .execGetByPostModuleUrl(
              "/interfaceManagement/userManage/deleteUser",
              params
            )
            .then((res) => {
              this.$Msg.deleteSuccess(res);
              this.selectUserInfo();
            });
        })
        .catch(() => {});
    },
    // 关闭弹出框之前触发事件
    beforeClose() {
      this.dialogUserFormVisible = false;
      this.$refs.userForm.$refs[this.modelFormConfig.ref].resetFields();
    },
    // 点击取消按钮
    cancel() {
      this.dialogUserFormVisible = false;
      this.$refs.userForm.$refs[this.modelFormConfig.ref].resetFields();
    },
    dialogClosed() {
      this.userForm = {
        user_name: "",
        user_password: "",
        user_email: "",
        user_remark: "",
      };
    },
    //用户列表数据实现分页功能
    handleCurrentChangeList(currPage) {
      //把val赋给当前页面
      this.pagination.pageNum = currPage;
      this.selectUserInfo();
    },
    // 改变每页显示条数
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.selectUserInfo();
    },
  },
};
</script>

<style scoped>
.locationcenter {
  text-align: center;
  margin-top: 5px;
}

.el-input {
  width: 300px;
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
