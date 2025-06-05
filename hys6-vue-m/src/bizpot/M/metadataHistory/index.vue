<template>
  <div class="px-20 metadataHistory h100">
    <el-button v-debounce @click="goBack" class="goBackBtn mt-10">
      <i class="el-icon-back"></i>返回
    </el-button>
    <div class="mt-10">
      <ByContainerTitle title="元数据版本历史列表"></ByContainerTitle>
    </div>
    <div class="pb-20 mt-10" v-if="tableData.length > 0">
      <ByTable
        :tableData="tableData"
        :columnArr="columnArr"
        :pagination="pagination"
        @operateItem="operateItem"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      />
    </div>
    <div v-else style="height: calc(100% - 70px)">
      <ByEmpty />
    </div>
    <ByDrawer
      :visible.sync="editVisible"
      drawTitle="表信息"
      :drawWidth="1000"
      @close="editVisible = false"
      @closed="editClosed"
    >
      <div style="padding: 0 20px 0 20px" class="drawerContent">
        <ByModelForm
          :formData="editModelFormData"
          :formItems="editModelFormItems"
          :formConfig="editModelFormConfig"
          ref="editInfo"
        />
        <el-divider></el-divider>
        <div v-if="editModelFormData.type !== '2'">
          <div class="d-flex justify-content-between mb-20">
            <ByHeaderSlice title="表信息" />
          </div>
          <div>
            <ByTable :tableData="tableDataInfo" :columnArr="columnArrInfo" />
          </div>
        </div>
        <div v-else>
          <div class="d-flex justify-content-between mb-20">
            <ByHeaderSlice title="SQL信息" />
            <div>
              <el-button type="primary">版本对比</el-button>
            </div>
          </div>
          <div style="border: 1px solid #e3e4e5">
            <SqlEditor
              ref="sqlEdit"
              :value.sync="editFmSql"
              :readonly="true"
              style="height: 300px"
            />
          </div>
        </div>
      </div>
      <template slot="drawFoot">
        <el-button @click="editVisible = false">取 消</el-button>
      </template>
    </ByDrawer>
  </div>
</template>

<script>
import SqlEditor from "@/components/SqlEditor.vue";
import {
  columnArr,
  editModelFormItems,
  editModelFormData,
  editModelFormConfig,
  columnArrInfo,
} from "./mock";
export default {
  name: "metadataHistory",
  data() {
    return {
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      columnArr,
      tableData: [],
      queryForm: {
        source_id: this.$route.query.source_id || "",
        obj_id: this.$route.query.obj_id || "",
      },
      options: [
        {
          value: "0",
          label: "表",
        },
        {
          value: "1",
          label: "视图",
        },
        {
          value: "2",
          label: "存储过程",
        },
        {
          value: "3",
          label: "物化视图",
        },
      ],
      tableDataInfo: [],
      editFmSql: "",
      editVisible: false,
      editModelFormConfig,
      editModelFormItems,
      editModelFormData: JSON.parse(JSON.stringify(editModelFormData)),
      columnArrInfo,
    };
  },
  components: {
    SqlEditor,
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getTableData() {
      const params = {
        ...this.queryForm,
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      this.$executeRequest
        .execGetByControllerAllMappingName("/metaObjInfo/metaObjInfoHis", params)
        .then((res) => {
          if (res && res.success) {
            res.data.pageList.map((item) => {
              this.options.map((val) => {
                if (item.type === val.value) {
                  item.typeText = val.label;
                }
              });
            });
            this.tableData = res.data.pageList;
            this.pagination.total = res.data.totalSize;
          }
        });
    },
    operateItem(type, row) {
      if (type === "view") {
        this.editHandler(row);
      }
    },
    //编辑
    editHandler(row) {
      this.$executeRequest
        .execGetByControllerAllMappingName(`/metaObjInfo/metaObjInfoHis/${row.his_id}`)
        .then((res) => {
          if (res && res.success) {
            this.editModelFormData = {
              en_name: res.data.en_name,
              ch_name: res.data.ch_name,
              type: res.data.type,
              source_name: res.data.source_name,
              version: res.data.version,
              update_time: res.data.update_time,
            };
            this.options.map((val) => {
              if (this.editModelFormData.type === val.value) {
                this.editModelFormData.type_text = val.label;
              }
            });
            if (this.editModelFormData.type !== "2") {
              this.tableDataInfo = res.data.colQueryVoList;
            } else {
              this.editFmSql = res.data.funcQueryVo?.fm_sql || "";
            }
            this.editVisible = true;
          }
        });
    },
    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getTableData();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getTableData();
    },
    editClosed() {
      this.editModelFormData = JSON.parse(JSON.stringify(editModelFormData));
      this.tableDataInfo = [];
      this.editFmSql = "";
    },
  },
};
</script>

<style scoped lang="less">
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
