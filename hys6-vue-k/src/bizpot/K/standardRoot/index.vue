<template>
  <div class="standardRoot px-20 h100">
    <ByQuickSearch
      ref="quickSearch"
      :formItems="formItems"
      @reset="reset"
      @search="search"
    ></ByQuickSearch>
    <div style="margin-top: 20px; height: calc(100% - 102px)">
      <ByContainerTitle title="词根列表">
        <div class="d-flex">
          <el-button type="primary" v-debounce @click="addRoot" class="mr-10">
            新增
          </el-button>
          <el-upload
            accept=".xls,.xlsx"
            action=""
            :show-file-list="false"
            :on-progress="handleChange"
            :before-upload="handleBeforeUpload"
            :limit="1"
          >
            <el-button type="major" class="mr-10">词根导入</el-button>
          </el-upload>
          <el-button type="major" v-debounce @click="downLoadRoot">
            词根导出
          </el-button>
        </div>
      </ByContainerTitle>
      <div class="mt-20" v-if="tableData.length > 0">
        <ByTable
          :tableData="tableData"
          :columnArr="columnArr"
          :pagination="pagination"
          @operateItem="operate"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></ByTable>
      </div>
      <div style="height: calc(100% - 32px)" v-else>
        <ByEmpty />
      </div>
    </div>
    <ByModel
      :visible.sync="visible"
      :modelTitle="modelTitle"
      modelWidth="650px"
      @close="visible = false"
      @closed="dialogClosed"
    >
      <div style="padding: 0 20px 0 20px">
        <ByModelForm
          :formData="modelFormData"
          :formItems="modelFormItems"
          :formRules="modelFormRules"
          :formConfig="modelFormConfig"
          ref="standardRoot"
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
  formItems,
  columnArr,
  modelFormItems,
  modelFormRules,
  modelFormConfig,
} from "./mock";
export default {
  name: "standardRoot",
  data() {
    return {
      formItems,
      formData: {
        norm_cname: "",
        norm_ename: "",
      },
      tableData: [],
      columnArr,
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      visible: false,
      modelTitle: "",
      modelFormData: { norm_cname: "", norm_ename: "" },
      modelFormItems,
      modelFormRules,
      modelFormConfig,
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    search(val) {
      this.formData = val;
      this.pagination.pageNum = 1;
      this.pagination.pageSize = 10;
      this.getTableList();
    },
    reset() {
      this.formData = {
        norm_cname: "",
        norm_ename: "",
      };
      this.pagination.pageNum = 1;
      this.pagination.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      const params = Object.assign({}, this.formData, {
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      });
      this.$executeRequest
        .execGetByControllerMappingName("/searchStandRoot", params)
        .then((res) => {
          if (res.code === 999) {
            this.tableData = res.data.pageList;
            this.pagination.total = res.data.totalSize;
          }
        });
    },
    downLoadRoot() {
      this.$executeRequest.downloadPostFile("/exportExcel").then((res) => {
        const blob = res;
        let fileName = "词根模板.xlsx";
        if (window.navigator.msSaveOrOpenBlob) {
          // 兼容IE10
          navigator.msSaveBlob(blob, fileName);
        } else {
          //  chrome/firefox
          let aTag = document.createElement("a");
          // document.body.appendChild(aTag);
          aTag.download = fileName;
          aTag.href = URL.createObjectURL(blob);
          if (aTag.all) {
            aTag.click();
          } else {
            //  兼容firefox
            const evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, true);
            aTag.dispatchEvent(evt);
          }
          URL.revokeObjectURL(aTag.href);
        }
      });
    },
    // 新增词根
    addRoot() {
      this.modelTitle = "新增词根";
      this.visible = true;
    },
    handleChange(event, file, fileList) {
      const params = new FormData();
      params.append("file", file.raw);
      this.$executeRequest.uploadFile("/importExcel", params).then((res) => {
        if (res.code === 999) {
          this.$Msg.customizTitle("导入成功");
          this.$refs.quickSearch.reset();
          this.reset();
        }
      });
    },
    handleBeforeUpload(file) {
      const extension = file.name.split(".").pop().toLowerCase();
      const isExcel = extension === "xls" || extension === "xlsx";
      if (!isExcel) {
        this.$Msg.customizTitle("上传文件只能是 xls/xlsx 格式!", "error");
        return false;
      }
      return true;
    },
    operate(type, row) {
      if (type === "edit") {
        this.modelTitle = "编辑词根";
        this.modelFormData = JSON.parse(JSON.stringify(row));
        this.visible = true;
      } else if (type === "del") {
        this.delHandler(row.rbasic_id);
      }
    },
    //删除
    delHandler(rbasic_id) {
      this.$executeRequest
        .execGetByControllerMappingName("/deleteStandRoot", {
          rbasic_id,
        })
        .then((res) => {
          if (res.code === 999) {
            this.$Msg.customizTitle("删除成功");
            this.getTableList();
          }
        });
    },
    //分页
    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getTableList();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getTableList();
    },
    dialogClosed() {
      this.modelFormData = {
        norm_cname: "",
        norm_ename: "",
      };
    },
    confirm() {
      this.$refs.standardRoot.$refs.standardRootForm.validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.modelFormData, {
            data_type: "109",
          });
          this.$executeRequest
            .execPostByControllerMappingName("/addOrUpdateStandRoot", params)
            .then((res) => {
              if (res.code === 999) {
                this.visible = false;
                if (this.modelTitle === "新增词根") {
                  this.$Msg.customizTitle("新增成功");
                } else {
                  this.$Msg.customizTitle("编辑成功");
                }
                this.getTableList();
              }
            });
          this.visible = false;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style></style>
