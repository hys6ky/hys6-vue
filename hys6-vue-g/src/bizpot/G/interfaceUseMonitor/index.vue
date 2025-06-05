<template>
  <div class="interfaceUseInfo px-20">
    <div class="pt-10">
      <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)"
        >返回</el-button
      >
    </div>
    <by-container-title title="接口使用监控" class="my-10" />
    <!--    <el-row class="topTitle">-->
    <!--        <span class="el-icon-s-check">接口使用监控</span>-->
    <!--        <router-link :to="{name:'interfaceManagement'}">-->
    <!--            <el-button class="goIndex" type="primary" size="mini" icon="el-icon-s-home">-->
    <!--                返回首页-->
    <!--            </el-button>-->
    <!--        </router-link>-->
    <!--    </el-row>-->
    <el-tabs @tab-click="handleClick">
      <el-tab-pane label="接口信息">
        <ByQuickSearch
          :formItems="formItems"
          @reset="resetInterfaceTable"
          @search="searchInterfaceInfoByIdOrDate"
        />

        <!--接口信息列表展示-->
        <ByTable
          class="mb-20"
          :tableData="
            interfaceData.slice(
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
        <!--                <el-table-column prop="response_time" label="响应时间" align="left" show-overflow-tooltip>-->
        <!--                    <template slot-scope="scope">-->
        <!--                        <el-row>-->
        <!--                            <span>最大:</span><code style="color:#c7254e">{{scope.row.max}} ms</code>-->
        <!--                            <span>最小:</span><code style="color:#c7254e">{{scope.row.min}} ms</code>-->
        <!--                            <span>平均:</span><code style="color:#c7254e">{{scope.row.avg}} ms</code>-->
        <!--                        </el-row>-->
        <!--                    </template>-->
        <!--                </el-table-column>-->
      </el-tab-pane>
      <!-- 数据表信息-->
      <el-tab-pane label="数据表信息">
        <ByQuickSearch
          :formItems="formItems1"
          @reset="resetDataTable"
          @search="searchTableDataById"
        />

        <ByTable
          class="mb-20"
          :tableData="
            dataTableData.slice(
              (pagination1.pageNum - 1) * pagination1.pageSize,
              pagination1.pageNum * pagination1.pageSize
            )
          "
          :columnArr="columnArr1"
          :pagination="pagination1"
          @operateItem="operateItem1"
          @sizeChange="handleSizeChange1"
          @currentChange="handleCurrentChangeList1"
        ></ByTable>
      </el-tab-pane>
    </el-tabs>
    <!--编辑弹出框-->
    <ByModel
      :visible.sync="dialogUpdateFormVisible"
      :modelTitle="editTitle"
      modelWidth="600px"
      @close="dialogUpdateFormVisible = false"
      @closed="dialogUpdateFormVisible = false"
    >
      <ByModelForm
        :formData="form"
        :formItems="modelFormItems"
        :formRules="modelFormRules"
        :formConfig="modelFormConfig"
        ref="form"
      />
      <template slot="modalFoot">
        <el-button @click="dialogUpdateFormVisible = false" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" size="mini" @click="updateInterfaceUseInfo"
          >保 存</el-button
        >
      </template>
    </ByModel>

    <!--查看字段弹出框-->
    <ByModel
      :visible.sync="dialogViewFieldFormVisible"
      :modelTitle="viewTitle"
      modelWidth="600px"
      @close="dialogViewFieldFormVisible = false"
      @closed="dialogViewFieldFormVisible = false"
    >
      <ByTable :tableData="fieldData" :columnArr="modelColumnArr"></ByTable>
      <template slot="modalFoot">
        <el-button
          type="primary"
          size="mini"
          @click="dialogViewFieldFormVisible = false"
        >
          确 认
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
  formItems1,
  pagination,
  columnArr,
  columnArr1,
  modelFormItems,
  modelFormRules,
  modelFormConfig,
  modelColumnArr,
  form,
} from "@/bizpot/G/interfaceUseMonitor/mock";
export default {
  name: "interfaceUseMonitor",
  components: { ByContainerTitle },
  //写定义的变量数据方法等
  data() {
    return {
      rule: validator.default,
      selectRow: [],
      dataTableData: [],
      interfaceData: [],
      selectColumn: [],
      userData: [],
      fieldData: [],
      useState: {},
      interface_use_id: "",
      dialogUpdateFormVisible: false,
      dialogViewFieldFormVisible: false,
      use_valid_date: "",
      user_id: "",
      dataTableStatus: false,
      form: {
        interface_use_id: "",
        start_use_date: "",
        use_valid_date: "",
      },
      editTitle: "",
      viewTitle: "",
      formItems,
      columnArr,
      formItems1,
      columnArr1,
      modelFormItems,
      modelFormRules,
      modelFormConfig,
      modelColumnArr,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      pagination1: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
    };
  },
  created() {
    this.getUseState();
  },
  mounted() {
    this.searchUserInfo();
    this.searchInterfaceInfo();
  },
  methods: {
    // 获取接口状态代码项
    getUseState() {
      this.$executeRequest
        .execGetByModuleUrl(
          "/interfaceManagement/releasemanage/getCategoryItems",
          { category: "InterfaceState" }
        )
        .then((res) => {
          res.data.forEach((row) => {
            this.useState[row.code] = row.value;
          });
        });
    },
    // 查看接口信息
    searchInterfaceInfo() {
      this.$executeRequest
        .execPostByModuleUrl(
          "/interfaceManagement/interfaceusemonitor/interfaceuseinfo/searchInterfaceInfo"
        )
        .then((res) => {
          //this.interfaceData = res.data;
          const list = res.data;
          list.map((item) => {
            item.use_state_Txt = this.useState[item.use_state];
            item.start_use_date_txt = this.dateFormat1(item.start_use_date);
            item.use_valid_date_txt = this.dateFormat1(item.use_valid_date);
            item.response_time =
              "最大：" +
              item.max +
              "ms 最小：" +
              item.min +
              "ms 平均：" +
              item.avg +
              "ms";
          });
          this.interfaceData = list;
          this.pagination.total = res.data.length;
        });
    },
    // 查看数据表信息
    searchTableData() {
      this.$executeRequest
        .execPostByModuleUrl(
          "/interfaceManagement/interfaceusemonitor/datatableuseinfo/searchTableData"
        )
        .then((res) => {
          this.dataTableData = res.data;
          this.pagination1.total = res.data.length;
        });
    },
    // 查看用户信息
    searchUserInfo() {
      this.$executeRequest
        .execPostByModuleUrl(
          "/interfaceManagement/releasemanage/searchUserInfo"
        )
        .then((res) => {
          this.userData = res.data;
          this.userData.map((item) => {
            item.label = item.user_name;
            item.value = item.user_id;
          });
          this.formItems.map((item) => {
            if (item.prop === "user_id") {
              item.options = this.userData;
            }
          });
          this.formItems1.map((item) => {
            if (item.prop === "user_id") {
              item.options = this.userData;
            }
          });
        });
    },
    //表格操作
    operateItem(type, row) {
      if (type === "edit") {
        this.searchInterfaceUseInfoById(row);
      } else if (type === "del") {
        this.deleteInterfaceUseInfo(row);
      } else if (type === "ban") {
        this.interfaceDisableEnable(row);
      }
    },
    operateItem1(type, row) {
      if (type === "view") {
        this.searchFieldInfoById(row);
      } else if (type === "del") {
        this.deleteDataTableUseInfo(row);
      }
    },
    // 根据用户ID或有效日期查询接口信息
    searchInterfaceInfoByIdOrDate(row) {
      this.$executeRequest
        .execGetByModuleUrl(
          "/interfaceManagement/interfaceusemonitor/interfaceuseinfo/searchInterfaceInfoByIdOrDate",
            row
        )
        .then((res) => {
          //this.interfaceData = res.data;
          const list = res.data;
          list.map((item) => {
            item.use_state_Txt = this.useState[item.use_state];
            item.start_use_date_txt = this.dateFormat1(item.start_use_date);
            item.use_valid_date_txt = this.dateFormat1(item.use_valid_date);
            item.response_time =
              "最大：" +
              item.max +
              "ms 最小：" +
              item.min +
              "ms 平均：" +
              item.avg +
              "ms";
          });
          this.interfaceData = list;
          this.pagination.total = res.data.length;
        });
    },
    // 根据接口使用ID查询接口信息
    searchInterfaceUseInfoById(row) {
      this.editTitle = "接口修改";
      this.dialogUpdateFormVisible = true;
      let params = {};
      params["interface_use_id"] = row.interface_use_id;
      this.$executeRequest
        .execGetByModuleUrl(
          "/interfaceManagement/interfaceusemonitor/interfaceuseinfo/searchInterfaceUseInfoById",
          params
        )
        .then((res) => {
          this.form = res.data;
        });
    },
    // 删除接口
    deleteInterfaceUseInfo(row) {
      let params = {};
      params["interface_use_id"] = row.interface_use_id;
      this.$Msg
        .confirmMsg("确定删除吗")
        .then((res) => {
          this.$executeRequest
            .execGetByModuleUrl(
              "/interfaceManagement/interfaceusemonitor/interfaceuseinfo/deleteInterfaceUseInfo",
              params
            )
            .then((res) => {
              this.$Msg.deleteSuccess(res);
              this.searchInterfaceInfo();
            });
        })
        .catch(() => {});
    },
    // 编辑
    updateInterfaceUseInfo() {
      this.$refs.form.$refs[this.modelFormConfig.ref].validate((valid) => {
        if (valid) {
          this.$executeRequest
            .execGetByPostModuleUrl(
              "/interfaceManagement/interfaceusemonitor/interfaceuseinfo/updateInterfaceUseInfo",
              this.form
            )
            .then((res) => {
              this.$Msg.updateSuccess(res);
              this.searchInterfaceInfo();
              this.dialogUpdateFormVisible = false;
            });
        }
      });
    },
    // 接口的禁用与启用
    interfaceDisableEnable(row) {
      let params = {};
      params["interface_use_id"] = row.interface_use_id;
      let confirmMessage;
      if (row.use_state === "1") {
        params["use_state"] = "2";
        confirmMessage = "确定禁用" + row.interface_name + "接口吗？";
      } else {
        params["use_state"] = "1";
        confirmMessage = "确定启用" + row.interface_name + "接口吗？";
      }
      this.$Msg
        .confirmMsg(confirmMessage)
        .then((res) => {
          this.$executeRequest
            .execGetByPostModuleUrl(
              "/interfaceManagement/interfaceusemonitor/interfaceuseinfo/interfaceDisableEnable",
              params
            )
            .then((res) => {
              if (res && res.success) {
                if (row.use_state == "1") {
                  this.$Msg.customizTitle(
                    "禁用" + row.interface_name + "接口成功",
                    "success"
                  );
                } else {
                  this.$Msg.customizTitle(
                    "启用" + row.interface_name + "接口成功",
                    "success"
                  );
                }
              }
              this.searchInterfaceInfo();
            });
        })
        .catch(() => {});
    },
    // 根据用户ID查询数据表信息
    searchTableDataById(row) {
      this.dataTableData = [];
      this.$executeRequest
        .execGetByModuleUrl(
          "/interfaceManagement/interfaceusemonitor/datatableuseinfo/searchTableDataById",
            row
        )
        .then((res) => {
          this.dataTableData = res.data;
          this.pagination1.total = res.data.length;
        });
    },
    // 根据表使用ID查看字段信息
    searchFieldInfoById(row) {
      this.viewTitle = "查看字段列表";
      this.dialogViewFieldFormVisible = true;
      let params = {};
      params["use_id"] = row.use_id;
      this.$executeRequest
        .execGetByModuleUrl(
          "/interfaceManagement/interfaceusemonitor/datatableuseinfo/searchFieldInfoById",
          params
        )
        .then((res) => {
          this.fieldData = res.data;
        });
    },
    // 删除数据表信息
    deleteDataTableUseInfo(row) {
      let params = {};
      params["use_id"] = row.use_id;
      this.$Msg
        .confirmMsg("确定删除吗")
        .then((res) => {
          this.$executeRequest
            .execGetByModuleUrl(
              "/interfaceManagement/interfaceusemonitor/datatableuseinfo/deleteDataTableUseInfo",
              params
            )
            .then((res) => {
              this.$Msg.deleteSuccess(res);
              this.searchTableData();
            });
        })
        .catch(() => {});
    },
    //表数据实现分页功能
    handleCurrentChangeList(val) {
      //把val赋给当前页面
      this.pagination.pageNum = val;
    },
    handleCurrentChangeList1(val) {
      //把val赋给当前页面
      this.pagination1.pageNum = val;
    },
    // 改变每页显示条数
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
    },
    handleSizeChange1(pageSize) {
      this.pagination1.pageSize = pageSize;
    },
    // 改变tabs框
    handleClick(tab) {
      // this.currPage = 1;
      if (tab.paneName === "0") {
        this.searchInterfaceInfo();
      } else {
        this.dataTableStatus = true;
        this.searchTableData();
      }
    },
    beforeUpdateClose() {
      this.$refs.form.resetFields();
      this.dialogUpdateFormVisible = false;
    },
    beforeViewFieldClose() {
      this.dialogViewFieldFormVisible = false;
    },
    resetInterfaceTable() {
      this.searchInterfaceInfo();
      this.user_id = "";
      this.use_valid_date = "";
    },
    resetDataTable() {
      this.searchTableData();
      this.user_id = "";
    },
    // 表格日期格式化展示
    dateFormat(row, column) {
      const date = row[column.property];
      if (date != null) {
        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const day = date.substring(6, 8);
        return year + "-" + month + "-" + day;
      }
    },
    dateFormat1(date) {
      if (date != null) {
        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const day = date.substring(6, 8);
        return year + "-" + month + "-" + day;
      }
    },
  },
};
</script>

<style scoped>
.locationcenter {
  text-align: center;
  margin-top: 5px;
}

.el-table {
  margin-top: 10px;
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
