<template>
  <div class="assetCatalogManage mx-20">
    <div>
      <ByQuickSearch
        :formItems="formItems"
        @reset="reset"
        @search="search"
      ></ByQuickSearch>
    </div>
    <div>
      <div class="d-flex justify-content-between align-items-center">
        <ByHeaderSlice title="资产目录" style="margin: 0px"></ByHeaderSlice>
        <el-button class="btn" @click="visible = true" type="primary">
          新增
        </el-button>
      </div>
    </div>
    <div class="tab mt-10">
      <ByTable
        :tableData="table"
        :columnArr="columnArr"
        :pagination="pagination"
        @operateItem="operateItemHandler"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @handleMultiple="handleMultiple"
      ></ByTable>
    </div>
    <ByModel
      :visible.sync="visible"
      :modelTitle="modelTitle"
      modelWidth="650px"
      @close="dialogCancel"
      @closed="dialogClosed"
    >
      <div style="padding: 0 20px 0 20px">
        <ByModelForm
          :formData="modelFormData"
          :formItems="modelFormItems"
          :formRules="modelFormRules"
          :formConfig="modelFormConfig"
          ref="dataMark"
        />
      </div>
      <template slot="modalFoot">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm" v-debounce> 保存 </el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import {
  columnArr,
  table,
  formItems,
  modelFormData,
  modelFormItems,
  modelFormConfig,
  modelFormRules,
} from "./mock";
import { dateFormat, hourFormat } from "@/utils/dateconversion";

export default {
  name: "assetCatalogManage",
  data() {
    return {
      modelTitle: "新增",
      visible: false,
      modelFormData: JSON.parse(JSON.stringify(modelFormData)),
      modelFormItems,
      modelFormConfig,
      modelFormRules,
      table,
      columnArr,
      formItems,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
    };
  },
  methods: {
    dialogCancel() {
      this.visible = false;
      this.modelTitle = "新增";

      this.modelFormData = {
        catalog_id: 0,
        catalog_name: "",
        catalog_code: "",
      };
    },
    //保存工程
    confirm() {
      this.$refs.dataMark.$refs[this.modelFormConfig.ref].validate((valid) => {
        if (this.modelTitle === "新增") {
          if (valid) {
            this.$executeRequest
              .execPostByUrl2("/N/N1001/addOrUpdateCatalog", this.modelFormData)
              .then((res) => {
                if (res.code != 999) {
                  return;
                }
                this.$Msg.customizTitle("新增成功", "success");
                this.init("");
                this.modelFormData = {
                  catalog_id: 0,
                  catalog_name: "",
                  catalog_code: "",
                };
              });
            this.visible = false;
          }
        } else if (
          this.modelTitle === "发布" &&
          this.modelFormData.publish_status === "2"
        ) {
          if (valid) {
            let modelFormData = {
              catalogId: this.modelFormData.catalog_id,
            };
            this.$executeRequest
              .execByControllerMappingName(
                "/N/N1001/publishCatalog",
                modelFormData
              )
              .then((res) => {
                if (res.code != 999) {
                  return;
                }
                this.$Msg.customizTitle("发布成功", "success");
                this.init("");
                this.modelFormData = {
                  catalog_id: 0,
                  catalog_name: "",
                  catalog_code: "",
                };
              });
            this.visible = false;
          }
        } else if (
          this.modelTitle === "发布" &&
          this.modelFormData.publish_status === "1"
        ) {
          if (valid) {
            this.$executeRequest
              .execPostByUrl2("/N/N1001/addOrUpdateCatalog", this.modelFormData)
              .then((res) => {
                if (res.code != 999) {
                  return;
                }
                this.$Msg.customizTitle("修改成功", "success");
                this.init("");
                this.modelFormData = {
                  catalog_id: 0,
                  catalog_name: "",
                  catalog_code: "",
                };
              });
            this.visible = false;
          }
        }
      });
      this.modelTitle = "新增";
    },
    //新增弹窗关闭之后
    dialogClosed() {},
    // 类目 操作 删除
    operateItemHandler(type, row) {
      if (type === "lm") {
        let arr = JSON.parse(JSON.stringify(row));
        this.$router.push({
          path: "/N/assetCatalogLmManage",
          query: arr,
        });
      } else if (type === "del") {
        this.$executeRequest
          .execByControllerMappingName("/N/N1001/deleteCatalog", {
            catalogId: row.catalog_id,
          })
          .then((res) => {
            if (res.code != 999) {
              return;
            }
            this.$Msg.customizTitle("删除成功", "success");
            this.init("");
          });
      } else if (type === "bj") {
        this.visible = true;
        this.modelTitle = "发布";
        this.modelFormData = JSON.parse(JSON.stringify(row));
      }
    },
    // 搜索
    search(val) {
      this.init(val.bbbt);
    },
    // 重置
    reset(val) {
      this.init("");
    },
    // 多选变化触发
    handleMultiple(val) {
      console.log(val);
    },
    getMetaObjInfo() {
      const param = {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        ...this.formSearchData,
      };
      this.search(param);
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.pagination.pageSize = 10;
      this.getMetaObjInfo();
    },
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getMetaObjInfo();
    },
    init(catalogName) {
      const params = {
        catalogName: catalogName,
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      this.$executeRequest
        .execByControllerMappingName("/N/N1001/findCatalog", params)
        .then((res) => {
          if (res.code != 999) {
            return;
          }
          this.table = res.data.pageList;
          res.data.pageList.forEach((item) => {
            item.create_date = dateFormat(item.create_date);
            item.create_time = hourFormat(item.create_time);
          });
          this.pagination.total = res.data.totalSize;
        });
    },
  },
  created() {
    this.init("");
  },
};
</script>

<style scoped lang="less">
.assetCatalogManage {
  /deep/.btn {
    min-width: 80px;
    height: 32px;
    padding: 8px 25px;
    margin-top: 10px;
  }
}
</style>
