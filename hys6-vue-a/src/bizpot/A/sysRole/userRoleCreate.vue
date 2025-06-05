<template>
  <div class="p-20 h100 box-sizing">
    <el-button @click="cancel" class="goBackBtn">
      <i class="el-icon-back"></i>返回
    </el-button>
    <ByModelForm
      :formData="form"
      :formItems="modelFromItems"
      :formConfig="modelFromConfig"
      :formRules="modelFromRules"
      @radioChange="getUserFunctionMenu"
      ref="modelFromRef"
    >
    </ByModelForm>
    <div class="d-flex justify-content-end">
      <el-button type="primary" @click="add()" class="saveBtn">
        <i class="el-icon-circle-plus-outline"></i>
        <span>保存</span>
      </el-button>
    </div>
    <ByTable
      class="mt-5"
      :tableData="tableData"
      :columnArr="tableColumns"
      :treeProps="{ children: 'childList', hasChildren: 'hasChildren' }"
      @select="select"
      @handleMultiple="handleSelectionChange"
      @selectAll="selectAll"
      @OpenDetail="getOpenDetail"
      :indeterminate="false"
      ref="tableDataRef"
    >
    </ByTable>
  </div>
</template>

<script>
import {
  modelFromItems,
  modelFromConfig,
  modelFromRules,
  tableColumns,
} from "./mock";

export default {
  data() {
    return {
      modelFromItems,
      modelFromConfig,
      modelFromRules,
      tableColumns,
      // 添加新增用户表单
      form: {
        role_id: "",
        is_admin: "0",
        role_name: "",
        role_remark: "",
        role_menu: [],
      },
      tableData: [],
      flag: "",
      MenuType: [],
      is_admin: "",
    };
  },
  created() {
    this.getCodeItems("MenuType");
    if (this.$route.query.flag === "update") {
      if (this.$route.query.is_admin === "01") {
        // 管理员
        this.form.is_admin = "01";
      } else {
        // 操作员
        this.form.is_admin = "02";
      }
      this.flag = this.$route.query.flag;
      this.form.role_id = this.$route.query.role_id;
      this.getUserFunctionMenu(this.form.is_admin);
    } else {
      this.getUserFunctionMenu("01");
    }
  },
  mounted() {},
  watch: {
    role_id(newValue, oldValue) {
      console.log(newValue, oldValue);
    },
  },
  methods: {
    getUserFunctionMenu(val) {
      this.$executeRequest.execGetByUrl("/Base/sysRole/getUserFunctionMenu", {
          userIsAdmin: val,
        })
        .then((res) => {
          if (res && res.success) {
            let tableData = res.data;
            tableData.forEach((item) => {
              this.handleItem(item);
            });
            this.tableData = tableData;
            if (this.flag === "update") {
              this.getRoleInfo();
            }
          }
        });
    },
    handleItem(item) {
      if (item.childList != null) {
        item.childList.forEach((child) => {
          if (child.menu_type === "00") {
            child["menu_type"] = "超级管理员";
          } else if (item.menu_type === "01") {
            child["menu_type"] = "管理员";
          } else if (item.menu_type === "02") {
            child["menu_type"] = "操作员";
          }
        });
      }
      if (item.menu_type === "00") {
        item["menu_type"] = "超级管理员";
      } else if (item.menu_type === "01") {
        item["menu_type"] = "管理员";
      } else if (item.menu_type === "02") {
        item["menu_type"] = "操作员";
      }
    },
    handleSelectionChange(val) {
      this.form.role_menu = [];
      val.forEach((item) => {
        this.form.role_menu.push(item.menu_id);
      });
    },
    setChildren(children, type) {
      // 编辑多个子层级
      children.map((j) => {
        this.toggleSelection(j, type);
        if (j.childList) {
          this.setChildren(j.childList, type);
        }
      });
    },
    // 选中父节点时，子节点一起选中取消
    select(selection, row) {
      console.log(selection, "selection");
      if (
        selection.some((el) => {
          return row.menu_id === el.menu_id;
        })
      ) {
        if (row.childList) {
          // 解决子组件没有被勾选到
          this.setChildren(row.childList, true);
        }
      } else {
        if (row.childList) {
          this.setChildren(row.childList, false);
        }
      }
      if (row.parent_id !== "0") {
        this.tableData.forEach((item, i) => {
          if (row.parent_id === item.menu_id) {
            this.toggleSelection(item, true);
          }
        });
      }
    },
    toggleSelection(row, select) {
      if (row) {
        this.$nextTick(() => {
          this.$refs.tableDataRef.$refs.bytable.toggleRowSelection(row, select);
        });
      }
    },
    // 选择全部
    selectAll(selection) {
      // tabledata第一层只要有在selection里面就是全选
      const isSelect = selection.some((el) => {
        const tableDataIds = this.tableData.map((j) => j.menu_id);
        return tableDataIds.includes(el.menu_id);
      });
      // tableDate第一层只要有不在selection里面就是全不选
      const isCancel = !this.tableData.every((el) => {
        const selectIds = selection.map((j) => j.menu_id);
        return selectIds.includes(el.menu_id);
      });
      if (isSelect) {
        selection.map((el) => {
          if (el.childList) {
            // 解决子组件没有被勾选到
            this.setChildren(el.childList, true);
          }
        });
      }
      if (isCancel) {
        this.tableData.map((el) => {
          if (el.childList) {
            // 解决子组件没有被勾选到
            this.setChildren(el.childList, false);
          }
        });
      }
      this.$emit("handleSelect", this.tableData);
    },
    add() {
      this.$refs.modelFromRef.$refs[this.modelFromConfig.ref].validate(
        (valid) => {
          if (valid) {
            if (this.flag === "update") {
              this.$confirm("确认修改吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                // 处理参数
                this.$executeRequest
                  .execPostByPathUrl("/sysRole/updateSysRole", this.form)
                  .then((res) => {
                    if (res && res.success) {
                      this.$Msg.customizTitle("修改成功!", "success");
                      this.$router.go(-1);
                    }
                  });
              });
            } else {
              this.$confirm("确认新增吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                // 处理参数
                this.$executeRequest
                  .execPostByPathUrl("/sysRole/saveSysRole", this.form)
                  .then((res) => {
                    if (res && res.success) {
                      this.$Msg.customizTitle("添加成功!", "success");
                      this.$router.go(-1);
                    }
                  });
              });
            }
          }
        }
      );
    },
    getCodeItems(val) {
      if (val === "MenuType") {
        this.$Code.getCategoryItems({category: "MenuType"}).then((res) => {
            if (res && res.success) {
              for (let dataKey of res.data) {
                if (dataKey.code !== "00") {
                  this.MenuType.push(dataKey);
                }
              }
            }
          });
      }
    },
    getRoleInfo() {
      this.$executeRequest.execGetByUrl("/Base/sysRole/getRoleInfo", {
          role_id: this.form.role_id,
        })
        .then((res) => {
          if (res && res.success) {
            this.form.role_name = res.data.role_name;
            this.form.role_remark = res.data.role_remark;
            this.form.role_menu = res.data.menus;
            this.tableData.forEach((item, i) => {
              this.form.role_menu.forEach((item2, j) => {
                if (item.menu_id === item2.menu_id) {
                  this.toggleSelection(this.tableData[i], true);
                }
              });
              if ("childList" in item) {
                item.childList.forEach((item3, k) => {
                  this.form.role_menu.forEach((item4, j) => {
                    if (item3.menu_id === item4.menu_id) {
                      this.toggleSelection(item.childList[k], true);
                    }
                  });
                });
              }
            });
          }
        });
    },
    getOpenDetail(row) {
      this.$refs.tableDataRef.$refs.bytable.toggleRowExpansion(row);
    },
    // 返回上一级
    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped lang="less">
.el-table .success-row {
  background: #f0f9eb;
}
.saveBtn {
  min-width: 80px;
  height: 32px;
  padding: 8px 25px;
  font-family: @hansan;
}
.goBackBtn {
  width: 62px;
  height: 28px;
  line-height: 26px;
  padding: 0;
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  font-family: SourceHanSansCNVF-Regular, SourceHanSansCNVF;
}
</style>
