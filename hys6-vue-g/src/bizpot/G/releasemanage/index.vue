<template>
  <div class="releaseManage px-20 h100">
    <div class="pt-10">
      <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)">
        返回
      </el-button>
    </div>
    <el-row class="topTitle">
      <by-container-title title="接口功能类" />
      <!--        <span class="el-icon-menu">接口功能类</span>-->
    </el-row>

    <div class="d-flex py-10 justify-content-between">
      <by-header-slice title="接口功能设置" />
      <el-button type="primary" size="mini" @click="saveInterfaceUseInfo"
        >保存</el-button
      >
    </div>

    <ByModelForm
      :formData="form"
      :formItems="modelFormItems"
      :formRules="modelFormRules"
      :formConfig="modelFormConfig"
      @startBlur="startBlur"
      @endBlur = "endBlur"
      ref="releaseManageForm"
    />

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in interfaceType"
        value="item.code"
        v-model="item.code"
        :key="item.code"
      >
        <span slot="label">{{ item.value }}接口</span>
      </el-tab-pane>
    </el-tabs>
    <by-table
      :tableData="
        tableData.slice(
          (pagination.pageNum - 1) * pagination.pageSize,
          pagination.pageNum * pagination.pageSize
        )
      "
      :columnArr="columnArr"
      :pagination="pagination"
      class="my-10 pb-20"
      ref="multipleTable"
      @handleMultiple="handleSelectionChange"
      @allSelect="allSelect"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChangeList"
    ></by-table>
    <!-- 分页内容 -->
    <!--    <el-row class="pagination">-->
    <!--      <el-pagination @current-change="handleCurrentChangeList" :current-page="currPage" @size-change="handleSizeChange" :page-sizes="[5, 10, 50, 100,500]" :page-size="pageSize" layout=" total,sizes,prev, pager, next,jumper" :total="totalSize" class='locationcenter' />-->
    <!--    </el-row>-->

    <!--    <el-form ref="form" :inline=true :model="form" label-width="100px" size="medium">-->
    <!--        <span class="fontStyle">接口功能设置-->
    <!--            <el-button type="success" size="mini" class="saveButton" @click="saveInterfaceUseInfo('form')">保存-->
    <!--            </el-button>-->
    <!--        </span>-->
    <!--        <el-divider />-->
    <!--        <el-row>-->
    <!--            <el-col :span="11">-->
    <!--                <el-form-item label="用户名称" prop="userIds" :rules="filter_rules([{required: true}])">-->
    <!--                    <el-select v-model="form.userIds" multiple filterable clearable placeholder="请选择">-->
    <!--                        <el-option :key="item.user_id" v-for="item in userData" :label="item.user_name" :value="item.user_id">-->
    <!--                        </el-option>-->
    <!--                    </el-select>-->
    <!--                </el-form-item>-->
    <!--            </el-col>-->
    <!--            <el-col :span="11">-->
    <!--                <el-form-item label="分类名称">-->
    <!--                    <el-input v-model="form.classify_name" placeholder="分类名称" />-->
    <!--                </el-form-item>-->
    <!--            </el-col>-->
    <!--        </el-row>-->
    <!--        <el-row>-->
    <!--            <el-col :span="11">-->
    <!--                <el-form-item label="开始日期" prop="start_date">-->
    <!--                    <el-date-picker type="date" placeholder="开始日期" value-format="yyyyMMdd" v-model="form.start_date" @change="dateStartSelectChange" />-->
    <!--                </el-form-item>-->
    <!--            </el-col>-->
    <!--            <el-col :span="11">-->
    <!--                <el-form-item label="结束日期" prop="end_date">-->
    <!--                    <el-date-picker type="date" placeholder="结束日期" value-format="yyyyMMdd" v-model="form.end_date" @change="dateEndSelectChange" />-->
    <!--                </el-form-item>-->
    <!--            </el-col>-->
    <!--        </el-row>-->
    <!--        <el-form-item label="备注">-->
    <!--            <el-input type="textarea" v-model="form.interface_note" autosize placeholder="备注" style="width: 300px" />-->
    <!--        </el-form-item>-->
    <!--        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">-->
    <!--            <el-tab-pane v-for="item in interfaceType" value="item.code" v-model="item.code" :key="item.code">-->
    <!--                <span slot="label">{{item.value}}接口</span>-->
    <!--            </el-tab-pane>-->
    <!--            &lt;!&ndash;接口信息列表展示&ndash;&gt;-->
    <!--            <el-table :data="tableData.slice((currPage - 1) * pageSize,currPage * pageSize)" border style="width: 100%" ref="multipleTable" size="medium" :row-key="(row)=>{ return row.interface_id}" @selection-change="handleSelectionChange" @select-all='allSelect'>-->
    <!--                <el-table-column width="60" align="center" type="selection" :reserve-selection="true">-->
    <!--                </el-table-column>-->
    <!--                <el-table-column label="序号" align="left" width="70px">-->
    <!--                    <template slot-scope="scope">-->
    <!--                        <span>{{scope.$index+(currPage - 1) * pageSize + 1}}</span>-->
    <!--                    </template>-->
    <!--                </el-table-column>-->
    <!--                <el-table-column prop="interface_name" label="接口名称" align="left" width="230px" show-overflow-tooltip />-->
    <!--                <el-table-column prop="interface_code" label="接口代码" align="left" width="160px" show-overflow-tooltip />-->
    <!--                <el-table-column prop="start_use_date" label="开始日期" align="left" show-overflow-tooltip>-->
    <!--                    <template slot-scope="scope">-->
    <!--                        <el-date-picker type="date" placeholder="开始日期" value-format="yyyyMMdd" v-model="scope.row.start_use_date" size="small" style="width:100%" />-->
    <!--                    </template>-->
    <!--                </el-table-column>-->
    <!--                <el-table-column prop="use_valid_date" label="结束日期" align="left">-->
    <!--                    <template slot-scope="scope">-->
    <!--                        <el-date-picker type="date" placeholder="结束日期" value-format="yyyyMMdd" v-model="scope.row.use_valid_date" size="small" style="width: 100%" />-->
    <!--                    </template>-->
    <!--                </el-table-column>-->
    <!--                <el-table-column prop="use_state" label="接口状态" align="left" width="100px">-->
    <!--                    <template slot-scope="scope">{{interfaceStateObj[scope.row.interface_state]}}-->
    <!--                    </template>-->
    <!--                </el-table-column>-->
    <!--            </el-table>-->
    <!--            &lt;!&ndash; 分页内容 &ndash;&gt;-->
    <!--            <el-row class="pagination">-->
    <!--                <el-pagination @current-change="handleCurrentChangeList" :current-page="currPage" @size-change="handleSizeChange" :page-sizes="[5, 10, 50, 100,500]" :page-size="pageSize" layout=" total,sizes,prev, pager, next,jumper" :total="totalSize" class='locationcenter' />-->
    <!--            </el-row>-->
    <!--        </el-tabs>-->
    <!--    </el-form>-->
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import ByHeaderSlice from "@/components/global/ByHeaderSlice";
import {
  columnArr,
  pagination,
  modelFormConfig,
  modelFormItems,
  modelFormRules,
} from "@/bizpot/G/releasemanage/mock";
import ByTable from "@/components/global/ByTable";
import ByContainerTitle from "@/components/global/ByContainerTitle";
import {DatePicker} from "element-ui";

export default {
  name: "releasemanage",
  computed: {
    DatePicker() {
      return DatePicker
    }
  },
  components: { ByContainerTitle, ByTable, ByHeaderSlice },
  //写定义的变量数据方法等
  data() {
    return {
      rule: validator.default,
      selectRow: [],
      tableData: [],
      userData: [],
      interfaceType: [],
      interfaceState: [],
      interfaceStateObj: {},
      activeName: "0",
      form: {
        userIds: "",
        classify_name: "",
        interface_note: "",
        start_date:null,
        end_date:null,
      },
      handleMultiple: [],
      modelFormRules,
      modelFormItems,
      modelFormConfig,
      columnArr,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
    };
  },
  created() {
    this.getInterfaceType();
    this.getInterfaceState();
  },
  mounted() {
    this.searchInterfaceInfoByType("1");
    this.searchUserInfo();
  },
  methods: {
    startBlur(){
      this.tableData.forEach(item => {
        item.start_use_date = this.form.start_date;
        item.use_valid_date = this.form.end_date;
      })
    },
    endBlur(){
      this.tableData.forEach(item => {
        item.start_use_date = this.form.start_date;
        item.use_valid_date = this.form.end_date;
      })
    },
    // 获取接口类型代码项
    getInterfaceType() {
      this.$executeRequest
        .execGetByModuleUrl(
          "/interfaceManagement/releasemanage/getCategoryItems",
          { category: "InterfaceType" }
        )
        .then((res) => {
            this.interfaceType = res.data;
        });
    },
    // 获取接口状态代码项
    getInterfaceState() {
      this.$executeRequest
        .execGetByModuleUrl(
          "/interfaceManagement/releasemanage/getCategoryItems",
          { category: "InterfaceState" }
        )
        .then((res) => {
          this.interfaceState = res.data;
          res.data.forEach((row) => {
            this.interfaceStateObj[row.code] = row.value;
          });
        });
    },
    // 根据接口类型查看接口信息
    searchInterfaceInfoByType(interface_type) {
      let params = {};
      params["interface_type"] = interface_type;
      this.$executeRequest
        .execGetByModuleUrl(
          "/interfaceManagement/releasemanage/searchInterfaceInfoByType",
          params
        )
        .then((res) => {
          res.data.map((item) => {
            item.use_state = this.interfaceStateObj[item.interface_state];
            item.start_use_date = this.form.start_date;
            item.use_valid_date = this.form.end_date;
          });
          this.tableData = res.data;
          this.pagination.total = res.data.length;
        });
    },
    // 获取接口用户信息
    searchUserInfo() {
      this.$executeRequest
        .execPostByModuleUrl(
          "/interfaceManagement/releasemanage/searchUserInfo"
        )
        .then((res) => {
          this.userData = res.data;
          if (this.userData.length > 0) {
            this.userData.map((item) => {
              item.label = item.user_name;
              item.value = item.user_id;
            });
            this.modelFormItems.map((item) => {
              if (item.prop === "userIds") {
                item.options = this.userData;
              }
            });
          }
        });
    },
    // 新增接口使用信息
    saveInterfaceUseInfo() {
      this.form["interfaceUses"] = JSON.stringify(this.selectRow);
      this.$refs.releaseManageForm.$refs[this.modelFormConfig.ref].validate(
        (valid) => {
          console.log(this.form);
          if (valid) {
            // 处理参数
            this.selectRow.forEach((item) => {
              if (
                item.start_use_date == undefined ||
                item.start_use_date == "" ||
                item.use_valid_date == undefined ||
                item.use_valid_date == ""
              ) {
                this.$Msg.customizTitle("请输入开始日期，结束日期", "warning");
              }
              return;
            });
            this.$executeRequest
              .execPostByModuleUrl(
                "/interfaceManagement/releasemanage/saveInterfaceUseInfo",
                this.form
              )
              .then((res) => {
                this.$Msg.saveSuccess(res);
                this.form = {};
                this.start_date = "";
                this.end_date = "";
                this.searchUserInfo();
                this.activeName = "0";
                //this.$refs.multipleTable.clearSelection();
                this.searchInterfaceInfoByType("1");
                this.currPage = 1;
              });
          }
        }
      );
    },
    //接口列表数据实现分页功能
    handleCurrentChangeList(currPage) {
      //把val赋给当前页面
      this.pagination.pageNum = currPage;
      this.searchInterfaceInfoByType("1");
    },
    // 改变每页显示条数
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.searchInterfaceInfoByType("1");
    },
    // 接口类型转换
    handleClick(tab) {
      //this.$refs.multipleTable.clearSelection();
      this.currPage = 1;
      if (tab.paneName === "0") {
        this.searchInterfaceInfoByType("1");
      } else if (tab.paneName === "1") {
        this.searchInterfaceInfoByType("2");
      } else if (tab.paneName === "2") {
        this.searchInterfaceInfoByType("3");
      } else if (tab.paneName === "3") {
        this.searchInterfaceInfoByType("4");
      }
    },
    // 全选
    allSelect(all) {
      this.selectRow = all;
    },
    // 复选框选中
    handleSelectionChange(selectTrue) {
      this.selectRow = selectTrue;
    },
    dateStartSelectChange(val) {
      this.tableData.forEach((o) => {
        o.start_use_date = val;
      });
    },
    dateEndSelectChange(val) {
      this.tableData.forEach((o) => {
        o.use_valid_date = val;
      });
    },
  },
};
</script>

<style scoped>
.el-select {
  width: 300px;
}

.el-input {
  width: 300px;
}

.saveButton {
  float: right;
}

.fontStyle {
  color: #2196f3;
  font-size: 16px;
}

.locationcenter {
  text-align: center;
  margin-top: 5px;
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
