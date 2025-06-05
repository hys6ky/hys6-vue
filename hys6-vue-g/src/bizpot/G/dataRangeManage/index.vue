<template>
  <div class="dataRangeManage h100">
    <div class="px-20 pt-10">
      <el-button icon="el-icon-back" class="goBackBtn" @click="$router.go(-1)">
        返回
      </el-button>
    </div>
    <div class="d-flex" style="height: calc(100% - 38px)">
      <div class="h100">
        <ByTree
          class="h100"
          :data="treeData"
          :defaultProps="treeProps"
          @logDetail="handleNodeClick"
        />
      </div>
      <div
        class="flex-1 px-20"
        style="width: calc(100% - 275px); height: calc(100% - 10px)"
      >
        <div v-if="tableData.length > 0" class="h100">
          <el-form ref="form" :model="form" label-width="100px" size="medium">
            <div class="d-flex justify-content-between my-10">
              <by-header-slice title="数据使用范围表信息列表" />
              <el-button type="primary" size="mini" @click="saveTableData"
                >保存</el-button
              >
            </div>
            <el-divider />
            <by-model-form
              :formData="form"
              :formItems="modelFormItems"
              :formRules="modelFormRules"
              :formConfig="modelFormConfig"
              ref="dataForm"
            />
            <!--接口信息列表展示-->
            <ByTable
              :tableData="
                tableData.slice(
                  (pagination.pageNum - 1) * pagination.pageSize,
                  pagination.pageNum * pagination.pageSize
                )
              "
              :columnArr="columnArr"
              :pagination="pagination"
              @handleMultiple="selectionChange"
              @allSelect="allSelect"
              @operateItem="operateItem"
              @sizeChange="handleSizeChange"
              @currentChange="handleCurrentChangeList"
            ></ByTable>
          </el-form>
        </div>
        <div v-else class="pt-10 h100 box-sizing">
          <ByEmpty />
        </div>
      </div>
      <ByModel
        :visible.sync="dialogShowFieldFormVisible"
        :modelTitle="modelTitle"
        modelWidth="600px"
        @close="cancel"
        @closed="cancel"
      >
        <ByTable
          :tableData="columnData"
          :columnArr="columnArr1"
          @handleMultiple="columnSelectionChange"
          @allSelect="allColumnSelect"
        ></ByTable>
        <div slot="modalFoot" class="dialog-footer">
          <el-button @click="cancel" size="mini">取 消</el-button>
          <el-button type="primary" @click="addColumn" size="mini"
            >确 认
          </el-button>
        </div>
      </ByModel>
    </div>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import ByTree from "@/components/global/ByTree";
import { getFlatArr, parseSimpleTreeData } from "@/utils/datahandler.js";
import ByHeaderSlice from "@/components/global/ByHeaderSlice";
import ByQuickSearch from "@/components/global/ByQuickSearch";
import {
  columnArr,
  modelFormItems,
  modelFormRules,
  modelFormConfig,
  columnArr1,
} from "@/bizpot/G/dataRangeManage/mock";
import ByModelForm from "@/components/global/ByModelForm";

export default {
  name: "dataRangeManage",
  components: { ByModelForm, ByQuickSearch, ByHeaderSlice, ByTree },
  //写定义的变量数据方法等
  data() {
    return {
      rule: validator.default,
      selectRow: [],
      tableData: [],
      columnData: [],
      selectColumnRow: [],
      userData: [],
      treeData: [],
      dialogShowFieldFormVisible: false,
      modelTitle: "",
      filterText: "",
      tableShowStatus: true,
      index: "",
      form: {
        table_note: "",
        user_id: [],
        userIds: "",
      },
      treeProps: {
        children: "children",
        label: "label",
      },
      modelFormItems,
      modelFormRules,
      modelFormConfig,
      columnArr,
      columnArr1,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
    };
  },
  watch: {
    //设置检索内容
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    deep: true,
    immediate: true,
  },
  mounted() {
    this.searchDataUsageRangeInfoToTreeData();
    this.searchUserInfo();
  },
  methods: {
    // 展示树数据
    searchDataUsageRangeInfoToTreeData() {
      this.$executeRequest
        .execPostByModuleUrl(
          "/interfaceManagement/dataRangeManage/searchDataUsageRangeInfoToTreeData"
        )
        .then((res) => {
          if (res.success) {
            const tree = getFlatArr(res.data);
            tree.map((item) => {
              if (item.children?.length > 0) {
                item.children = [];
              }
              item.showLabel = item.label;
              item.type = "textConfig";
              item.expanded = true;
            });
            const treeArr = parseSimpleTreeData(tree, "id", "parent_id");
            this.treeData = treeArr;
            console.log(this.treeData,"this.treeData")
          }
        });
    },
    // 查询用户信息
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
          this.modelFormItems.map((item) => {
            if (item.prop === "user_id") {
              item.options = this.userData;
            }
          });
        });
    },
    //表格操作
    operateItem(type, row, index) {
      if (type === "selectColumn") {
        this.searchFieldById(row, index);
      }
    },
    // 选择字段
    searchFieldById(row, index) {
      this.modelTitle = "查看字段信息";
      this.index = index;
      this.dialogShowFieldFormVisible = true;
      let params = {};
      params["data_layer"] = row.data_layer;
      params["file_id"] = row.file_id;
      this.$executeRequest
        .execGetByModuleUrl(
          "/interfaceManagement/dataRangeManage/searchFieldById",
          params
        )
        .then((res) => {
          this.columnData = res.data.column_info_list;
        });
    },
    // 保存表数据
    saveTableData() {
      let params = {};
      let tableDataInfos = [];
      if (this.selectRow.length === 0) {
        this.$Msg.customizTitle("请至少选择一条数据", "warning");
        return;
      }
      this.selectRow.forEach((row) => {
        let tableChColumns = [];
        let tableEnColumns = [];
        let param = {};
        if (row.selectColumn !== undefined) {
          row.selectColumn.forEach((o) => {
            tableChColumns.push(o.column_ch_name);
            tableEnColumns.push(o.column_name);
          });
        }
        param["file_id"] = row.file_id;
        param["table_ch_column"] = tableChColumns;
        param["table_en_column"] = tableEnColumns;
        tableDataInfos.push(param);
      });
      params["tableDataInfos"] = JSON.stringify(tableDataInfos);
      params["data_layer"] = this.selectRow[0].data_layer;
      params["user_id"] = this.form.user_id;
      params["table_note"] = this.form.table_note;
      this.$refs.dataForm.$refs[this.modelFormConfig.ref].validate((valid) => {
        if (valid) {
          // 处理参数
          this.$executeRequest
            .execPostByModuleUrl(
              "/interfaceManagement/dataRangeManage/saveTableData",
              params
            )
            .then((res) => {
              this.$Msg.saveSuccess(res);
              if (this.selectRow.selectColumn !== undefined) {
                //this.$refs.multipleColumnTable.clearSelection();
              }
              //this.$refs.multipleTable.clearSelection();
              this.$refs.form.resetFields();
              this.tableData = [];
              this.searchUserInfo();
              this.searchDataUsageRangeInfoToTreeData();
            });
        }
      });
    },
    //表数据实现分页功能
    handleCurrentChangeList(val) {
      //把val赋给当前页面
      this.pagination.pageNum = val;
    },
    // 改变每页显示条数
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
    },
    // 树节点触发
    handleNodeClick(data) {
      this.tableData = [];
      //如果节点的file_id为未定义并且节点的分类id不为空并且节点分类不是未定义,代表该节点是分类信息,则添加分类下节点数据到展示区
      if (data.file_id === null && data.classify_id !== "" && null !== data.classify_id) {
        //如果该节点的子节点信息不是未定义,则添加该节点下所有表信息
        if (data.children !== null) {
          data.children.forEach(element => {
            //判断如果该节点下每个子节点的file_id不是未定义,并且不为空,代表该子节点是表信息,则添加该子节点到数据展示区
            if (null !== element.file_id && element.file_id !== "") {
              this.tableData.push(element);
            }
          });
        }
      }
      //如果数据层是DQC或者UDL,并且父id是DQC或者UDL则添加存储层下的表信息到展示区
      else if ((data.data_layer === 'DQC' || data.data_layer === 'UDL') && (data.parent_id === 'DQC' || data.parent_id === 'UDL')) {
        this.tableData = data.children;
      }
      //如果file_id不为空,代表该节点是表信息,添加表信息到展示区
      else if (null !== data.file_id && data.file_id !== "") {
        this.tableData.push(data);
      }
      this.totalSize = this.tableData.length;
    },
    beforeShowFieldClose() {
      this.dialogShowFieldFormVisible = false;
    },
    // 表全选
    allSelect(all) {
      this.selectRow = all;
    },
    // 表复选框选中
    selectionChange(selectTrue) {
      this.selectRow = selectTrue;
    },
    // 选择字段全选
    allColumnSelect(all) {
      // this.tableData[this.index].selectColumn = all;
      this.tableData[this.index]["selectColumn"] = all;
    },
    // 选择字段复选框选中
    columnSelectionChange(selectTrue) {
      this.tableData[this.index]["selectColumn"] = selectTrue;
    },
    // 取消
    cancel() {
      //this.$refs.multipleColumnTable.clearSelection();
      this.dialogShowFieldFormVisible = false;
    },
    // 确认
    addColumn() {
      //this.$refs.multipleColumnTable.clearSelection();
      this.dialogShowFieldFormVisible = false;
    },
  },
};
</script>

<style lang="less">
.fontStyle {
  color: #2196f3;
  font-size: 18px;
}

.saveButton {
  float: right;
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
