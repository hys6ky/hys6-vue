<template>
  <div class="px-20 pb-20">
    <ByContainerTitle
        title = "用户列表"
        :addBtn = false
        style="padding: 10px"
    >
      <el-button type="primary" @click="getDepartAndUsertype()" style="padding-left: 10px">
        <i class="el-icon-circle-plus-outline"></i>
        <span>新增角色</span>
      </el-button>
    </ByContainerTitle>
    <ByTable
        :tableData="roleTablelist"
        :columnArr="columnArr"
        :pagination="pagination"
        @operateItem="operateItem"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
    />
  </div>
</template>

<script>
import {
  columnArr,
  roleModelFormItems,
  roleModelFormConfig,
  roleModelFormRules,
  roleModelFormData,
} from "./mock";

export default {
  data() {
    return {
      roleTablelist: [],
      columnArr,
      roleModelFormItems,
      roleModelFormConfig,
      roleModelFormRules,
      roleModelFormData: JSON.parse(JSON.stringify(roleModelFormData)),
      drawerTitle: "",
      visible: false,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
    };
  },
  created() {
    this.getSysUserInfoAll();
  },
  methods: {
    operateItem(type, row) {
      // console.log(type,row)
      if (type === "edit") {
        this.$router.push({
          name: "userRoleCreate",
          query: {
            flag: "update",
            role_id: row.role_id,
            is_admin: row.is_admin,
          },
        });
      } else {
        this.deleteSysUser(row.role_id);
      }
    },
    //删除
    deleteSysUser(val) {
      // console.log(val)
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            this.$executeRequest.execGetByPostMenuUrl("/deleteSysRole", {
              role_id: val,
            })
                .then((res) => {
                  if (res && res.success) {
                    this.$Msg.customizTitle("删除成功!", "success");
                    this.pagination.pageNum = 1;
                    this.pagination.pageSize = 10;
                    this.getSysUserInfoAll();
                  }
                });
          })
          .catch(() => {
            this.$Msg.customizTitle("已取消删除", "info");
          });
    },
    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getSysUserInfoAll();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getSysUserInfoAll();
    },
    // 用户信息方法封装
    getSysUserInfoAll() {
      this.$executeRequest.execGetByUrl("/Base/sysRole/getSysRoleInfo", {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      })
          .then(async (res) => {
            if (res && res.success) {
              this.roleTablelist = res.data.sysRoles;
              this.pagination.total = res.data.totalSize;
            }
          });
    },
    getDepartAndUsertype() {
      this.$router.push({
        name: "userRoleCreate",
        query: {
          flag: "insert",
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
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
