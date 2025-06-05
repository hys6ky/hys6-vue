<template>
  <div class="px-20 pb-20">
    <ByContainerTitle
      title="用户列表"
      :addBtn=false
      style="padding: 10px"
    >
      <el-button type="primary" @click="getDepartAndUsertype()" style="padding-left: 10px">
        <i class="el-icon-circle-plus-outline"></i>
        <span>新增用户</span>
      </el-button>
    </ByContainerTitle>
    <ByTable
      :tableData="userTablelist"
      :columnArr="columnArr"
      :pagination="pagination"
      @operateItem="operateItem"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    />
    <!-- 新增用户弹框 -->
    <ByModel
      :visible.sync="visible"
      :modelTitle="modelTitle"
      modelWidth="650px"
      @close="dialogCancel"
    >
      <div style="padding: 0 20px 0 20px">
        <ByModelForm
          :formData="modelFormData"
          :formItems="modelFormItems"
          :formRules="modelFormRules"
          :formConfig="modelFormConfig"
          ref="userManagement"
        />
      </div>
      <template slot="modalFoot">
        <el-button @click="dialogCancel">取消</el-button>
        <el-button
          type="primary"
          @click="confirm"
          v-debounce
          v-if="modelTitle === '新增用户'"
        >
          保存
        </el-button>
        <el-button
          type="primary"
          @click="update"
          v-debounce
          v-else-if="modelTitle === '编辑用户'"
        >
          更新
        </el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import {
  columnArr,
  modelFormItems,
  modelFormConfig,
  modelFormRules,
  modelFormData,
} from "./mock";
import {execGetAllPathByUrl} from "@/utils/executeRequest";
import ByContainerTitle from "@/components/global/ByContainerTitle.vue";

export default {
  components: {ByContainerTitle},
  data() {
    return {
      userTablelist: [],
      columnArr,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      visible: false,
      modelTitle: "",
      modelFormItems,
      modelFormData: JSON.parse(JSON.stringify(modelFormData)),
      modelFormConfig,
      modelFormRules,
    };
  },
  created() {
    // 获取用户所有信息
    this.getSysUserWithOutAdminByPage();
    this.getCodeItems("IsFlag");
  },
  methods: {
    operateItem(type, row) {
      if (type === "edit") {
        this.visible = true;
        this.handleEdit(row);
      } else {
        this.deleteSysUser(Number(row.user_id));
      }
    },
    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getSysUserWithOutAdminByPage();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getSysUserWithOutAdminByPage();
    },
    dialogCancel() {
      this.modelFormData = JSON.parse(JSON.stringify(modelFormData));
      this.$refs.userManagement.$refs[this.modelFormConfig.ref].resetFields();
      this.visible = false;
    },
    // 确认新增
    confirm() {
      this.$refs.userManagement.$refs[this.modelFormConfig.ref].validate(
        (valid) => {
          if (valid) {
            this.$confirm("确认新增吗", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.$executeRequest
                  .execByControllerMappingName(
                    "/saveSysUser",
                    this.modelFormData
                  )
                  .then((res) => {
                    if (res && res.success) {
                      this.$message.success("新增成功");
                      this.getSysUserWithOutAdminByPage();
                      this.visible = false;
                      this.$refs.userManagement.$refs[
                        this.modelFormConfig.ref
                        ].resetFields();
                    }
                  });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "取消新增!",
                });
              });
          }
        }
      );
    },
    //确认更新
    update() {
      this.$refs.userManagement.$refs[this.modelFormConfig.ref].validate(
        (valid) => {
          if (valid) {
            this.$confirm("确认更新吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.modelFormData["create_date"] =
                  this.modelFormData.create_date.replace(/-/g, "");
                this.$executeRequest
                  .execByControllerMappingName(
                    "/updateSysUser",
                    this.modelFormData
                  )
                  .then((res) => {
                    if (res && res.success) {
                      this.$message.success("更新成功");
                      this.getSysUserWithOutAdminByPage();
                      this.visible = false;
                      this.$refs.userManagement.$refs[
                        this.modelFormConfig.ref
                        ].resetFields();
                    }
                  });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "取消更新!",
                });
              });
          }
        }
      );
    },
    //删除
    deleteSysUser(val) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$executeRequest
            .execByControllerMappingName("/deleteSysUser", {
              user_id: val,
            })
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("删除成功!", "success");
                this.pagination.pageNum = 1;
                this.pagination.pageSize = 10;
                this.getSysUserWithOutAdminByPage();
              }
            });
        })
        .catch(() => {
          this.$Msg.customizTitle("已取消删除", "info");
        });
    },
    // 用户信息方法封装
    getSysUserWithOutAdminByPage() {
      this.$executeRequest.execGetByUrl("/Base/sysUser/getSysUserWithOutAdminByPage", {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      }).then((res) => {
        if (res && res.success) {
          res.data.sysUsers.map((item) => {
            item.create_date = this.$dateconversion.dateFormat(
              item.create_date
            );
            item.user_id = item.user_id.toString();
          });
          this.userTablelist = res.data.sysUsers;
          this.pagination.total = res.data.totalSize;
        }
      });
    },
    // 新增用户
    getDepartAndUsertype() {
      this.modelTitle = "新增用户";
      this.modelFormData.useris_admin = "0";
      this.getUserRole();
      this.getDepartmentInfo();
      this.visible = true;
    },
    //编辑用户
    handleEdit(row) {
      this.modelTitle = "编辑用户";
      this.modelFormData = JSON.parse(JSON.stringify(row));
      this.getUserRole();
      this.getDepartmentInfo();
      this.visible = true;
    },
    // 获取表格代码项
    getCodeItems(val) {
      // 是否标志
      if (val === "IsFlag") {
        // 是否标志
        this.$Code.getCodeItems({category: "IsFlag"}).then((res) => {
          const isFlag = res.data;
          this.modelFormItems.map((item) => {
            if (item.prop === "limitmultilogin") {
              item.activeValue = isFlag.Fou;
              item.inactiveValue = isFlag.Shi;
            }
          });
        });
      }
    },
    // 部门信息获取
    getDepartmentInfo() {
      this.$executeRequest.execGetByUrl("/Base/departmentalList/getAllDepartmentInfo").then((res) => {
        const options = res.data;
        options.map((item) => {
          item.label = item.dep_name;
          item.value = item.dep_id;
        });
        this.modelFormItems.map((item) => {
          if (item.prop === "dep_id") {
            item.options = options;
          }
        });
      });
    },
    // 获取角色
    getUserRole() {
      this.$executeRequest.execGetByUrl("/Base/sysRole/getUserRole").then((res) => {
        if (res && res.success) {
          const roleList = res.data;
          roleList.map((item) => {
            item.label = item.role_name;
            item.value = item.role_id;
          });
          this.modelFormItems.map((item) => {
            if (item.prop === "role_id") {
              item.options = roleList;
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.el-button {
  width: 100px;
  height: 32px;
  padding: 8px 0;
}

.lines {
  margin-top: 4px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}
</style>
