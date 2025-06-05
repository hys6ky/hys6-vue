<template>
  <div class="px-20 codeManage">
    <!-- 查询 -->
    <ByQuickSearch :formItems="formItems" @search="search" @reset="reset" />

    <div style="margin-top: 20px">
      <!-- 功能栏 -->
      <ByContainerTitle title="">
        <el-button type="primary" v-debounce @click="clickSave">新建</el-button>
        <el-button type="major" @click="batchDele" style="padding: 8px 16px">
          批量删除
        </el-button>

        <el-button type="major" @click="bulkImport" style="padding: 8px 16px">
          批量导入
        </el-button>

        <el-button type="major" @click="bulkExport" style="padding: 8px 16px">
          批量导出
        </el-button>
        <el-button type="major" @click="downloadFile" style="padding: 8px 16px">
          模板下载
        </el-button>
      </ByContainerTitle>

      <!-- 列表 -->
      <div class="mt-20">
        <ByTable
          :tableData="tableData"
          :columnArr="columnArr"
          :pagination="pagination"
          @handleMultiple="handleMultipleMethod"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @operateItem="operateHandler"
        ></ByTable>
      </div>
    </div>

    <!-- 新增 编辑 页面 -->
    <ByModel
      :visible.sync="modelVisible"
      :modelTitle="modelTitle"
      @close="modelVisible = false"
      modelWidth="900px"
    >
      <div>
        <div style="padding: 0 180px 0 20px">
          <ByModelForm
            :formData="modelFormData"
            :onlyRead="onlyRead"
            :formItems="modelFormItems"
            :formRules="modelFormRules"
            :formConfig="modelFormConfig"
            ref="codeManage"
          />
        </div>
        <ByContainerTitle title="代码列表" class="pt-20 bottomList">
        </ByContainerTitle>

        <div class="pt-20">
          <ByFormTable
            :formData="dbmDataAll"
            :rules="modelRules"
            :onlyRead="onlyRead"
            :operate="show"
            @removeRow = "removeRow"
            :max-height="'1000px'"
            :columnArr="modelColumnArr"
            :pagination="pagination1"
            @sizeChange="sizeChange1"
            @currentChange="currentChange1"
            formTableRef="codeManageTable"
            ref="codeManageModalTable"
          />
        </div>

        <div class="mt-10" v-if="this.show">
          <el-button
            type="primary"
            @click="addEdit()"
            style="padding: 8px 0; width: 82px; height: 32px"
            >添加</el-button
          >
          <el-button
            @click="clearAllData"
            style="padding: 8px 0; width: 82px; height: 32px"
            >清空</el-button
          >
        </div>
      </div>

      <template slot="modalFoot">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" v-if="!onlyRead" @click="confirm()" v-debounce
          >确 定</el-button
        >
      </template>
    </ByModel>

    <ByModel
      :visible.sync="bulkImportVisible"
      modelTitle="批量导入"
      @close="handleClose1"
    >
      <el-upload
        :fileList="fileList"
        action=""
        :auto-upload="false"
        :limit="1"
        :on-change="handleChange"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <template slot="modalFoot">
        <el-button @click="handleClose1">取 消</el-button>
        <el-button type="primary" @click="upFile()" v-debounce>
          确 认
        </el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import {
  tableData,
  columnArr,
  formData,
  formItems,
  modelRules,
  rules,
  modelColumnArr,
  modelFormItems,
  modelFormRules,
  modelFormConfig,
} from "./mock.js";
export default {
  data() {
    return {
      dbmDataAll: {
        tableData: [
          {
            code_encode: "",
            code_item_name: "",
            code_value: "",
            code_remark: "",
            dbm_level: "",
          },
        ],
      },
      //新增弹窗控件
      dialogVisible: false,
      onlyRead: false,
      tableData,
      rules,
      formItems,
      modelTitle: "",
      fileList: [],
      batchDel: [],
      modelRules,
      options: [
        { label: "已发布", value: "1" },
        { label: "未发布", value: "0" },
      ],
      // 新增
      form: {
        code_encode: "",
        code_type_name: "",
        code_status: "",
        code_remark: "",
        queryFrom: {},
        tableData: [
          {
            code_encode: "",
            code_item_name: "",
            code_value: "",
            code_remark: "",
          },
        ],
      },
      // exportData: [],
      pagination: {
        total: 5,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      pagination1: {
        total: 5,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      bulkImportVisible: false,
      formData,
      // 1 为新增 2为编辑
      type: "",
      modelColumnArr,
      show: false,
      columnArr,
      modelVisible: false,
      modelFormData: {
        code_encode: "",
        code_type_name: "",
        code_remark: "",
        code_status: "",
      },
      modelFormItems,
      modelFormRules,
      modelFormConfig,
      formRefs: ["codeManage", "codeManageModalTable"],
      row: null,
    };
  },
  mounted() {
    this.getCodeData();
  },
  methods: {
    search(val) {
      this.queryFrom = val;
      console.log(this.queryFrom, "c和");
      this.getCodeData(val, 1);
    },
    reset(val) {
      // console.log(val);
    },
    closeAdd() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    //把文件按照二进制进行读取
    // readFile(file) {
    //   return new Promise((resolve) => {
    //     let reader = new FileReader();
    //     reader.readAsBinaryString(file);
    //     reader.onload = (ev) => {
    //       resolve(ev.target.result);
    //     };
    //   });
    // },

    //获取excel数据
    // bulkImport(ev) {
    //   console.log(this.fileList, 111);
    //   console.log(ev, "表格");
    //   const file = ev.raw;
    //   if (!file) return;
    //   //读取file中的数据
    // },
    bulkImport() {
      this.fileList = [];
      this.bulkImportVisible = true;
    },
    clickSave() {
      this.formData.tableData = [];
      this.dbmDataAll.tableData = [];
      let para = {
        code_encode: "",
        code_item_name: "",
        code_value: "",
        code_remark: "",
      };
      this.formData.tableData.push(para);
      this.dbmDataAll.tableData.push(para);
      this.modelFormData = {};
      this.type = "1";
      this.modelTitle = "新增";
      this.show = true;
      this.onlyRead = false;
      this.modelVisible = true;
    },

    bulkExport() {
      this.exportDataStandards();
    },
    exportDataStandards() {
      debugger;
      let param = {};
      if (this.queryFrom) {
        param = {
          code_type_name: this.queryFrom.code_type_name || "",
          code_encode: this.queryFrom.code_encode || "",
          code_status: this.queryFrom.code_status || "",
        };
      }

      this.$executeRequest
        .downloadGetFileAllMappingNameParams(
          "/K/dbm/dataimport/exportTypeItem",
          param
        )
        .then((res) => {
          // if (res ){
          const blob = res;
          let fileName = "标准代码模板.xlsx";
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
          // }
        });
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    upFile() {
      console.log(this.fileList[0].raw, "数据");
      let is_check = true;
      if (this.fileList.length === 0) {
        this.$Msg.customizTitle("上传文件不能为空", "warning");
        is_check = false;
      }
      let param = new FormData();
      if (this.fileList.length !== 0 && this.fileList[0].raw) {
        param.append("file", this.fileList[0].raw);
      }
      if (is_check) {
        this.$executeRequest
          .uploadFileAllMappingName(
            "/K/dbm/dataimport/importTypeAndItem",
            param
          )
          .then((res) => {
            if (res && res.success) {
              this.getCodeData();
              this.$Msg.customizTitle("批量导入成功", "success");
              this.bulkImportVisible = false;
            }
          });
      }
    },
    downloadFile() {
      this.$executeRequest
        .downloadGetFileAllMappingNameParams(
          "/K/dbm/dataimport/getTypeItemTemplate"
        )
        .then((res) => {
          // if (res ){
          const blob = res;
          let fileName = "标准代码模板.xlsx";
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
          // }
        })
        .catch(() => {
          this.$Msg.customizTitle("删除失败", "info");
        });
    },

    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    batchDele() {
      this.batchDelCodeData();
    },
    handleMultipleMethod(val) {
      val.forEach((item) => {
        // this.exportData.push(item);
        console.log(item, "批量");
        this.batchDel.push(item.code_type_id);
      });
    },
    addEdit() {
      // this.$refs.codeManageModalTable.addRow();
      let para = {
        code_encode: "",
        code_item_name: "",
        code_value: "",
        code_remark: "",
      };
      this.dbmDataAll.tableData.push(para);
      this.formData.tableData.push(para);
      this.pagination1.total = this.formData.tableData.length;
    },
    removeRow(index){
      const start = (this.pagination1.pageNum - 1) * this.pagination1.pageSize ;
      const row =  start+index
      console.log(row);
      this.formData.tableData.splice(row,1);
      this.pagination1.total = this.formData.tableData.length;
    },
    add() {
      const obj = {
        code_encode: "",
        code_type_name: "",
        code_remark: "",
        code_value: "",
      };
      this.form.tableData.push(obj);
    },
    clearAll() {
      this.form.tableData = [];
    },
    clearAllData() {
      this.formData.tableData = [];
    },

    operateHandler(type, row) {
      // console.log(type, row);
      this.pagination1.pageNum = 1;
      this.dbmDataAll.tableData = [];
      this.formData.tableData = [];
      if (type === "check") {
        this.show = false;
        this.modelTitle = "查看";
        this.onlyRead = true;
        this.editEchoData(row);
        this.editEchoItemData(row);
        this.modelVisible = true;
      } else if (type === "edit") {
        this.modelTitle = "编辑";
        this.show = true;
        this.type = "2";
        this.onlyRead = false;
        this.editEchoData(row);
        this.editEchoItemData(row);
        this.row = row;
        this.modelVisible = true;
      } else if (type === "del") {
        this.deleteCodeData(row);
      }
    },
    //弹窗取消
    dialogCancel() {
      this.modelVisible = false;
      this.$refs.codeManage.$refs[modelFormConfig.ref].resetFields(); //清空弹窗表单
    },
    handleClose1() {
      this.bulkImportVisible = false;
    },
    // 新增弹窗确认
    makeSure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.addCodeData();
        }
      });
    },
    //分页
    sizeChange1(val) {
      this.pagination1.pageSize = val;
      this.pagination1.pageNum = 1;
      this.dataPg();
    },
    currentChange1(val) {
      this.pagination1.pageNum = val;
      this.dataPg();
    },
    dataPg(){
      const start = (this.pagination1.pageNum - 1) * this.pagination1.pageSize ;
      const end = this.pagination1.pageNum * this.pagination1.pageSize;
      this.dbmDataAll.tableData = this.formData.tableData.slice(start,end);
    },
    //分页
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.pageNum = 1;
      this.getCodeData();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getCodeData();
    },
    //弹窗确认
    confirm() {
      // 标记所有表单是否通过校验的变量;
      let isValid = true;
      // 遍历表单数组，依次对每个表单进行校验
      this.formRefs.forEach((ref) => {
        this.$refs[ref].transferData().then(
          (data) => {
            // console.log(data, "99999");
          },
          (rej) => {
            rej ? (isValid = false) : "";
          }
        );
      });
      if (isValid) {

        const params = {
          code_type_name: this.modelFormData.code_type_name,
          code_encode: this.modelFormData.code_encode,
          code_remark: this.modelFormData.code_remark,
          code_status: this.modelFormData.code_status,
          itemInfos: [...this.formData.tableData],
        };
        console.log(params)
        if (this.type === "1") {
          this.addCodeData();
        } else {
          this.editCodeData();
        }
      }
    },

    //获取列表信息
    getCodeData(val, curr = this.pagination.pageNum) {
      const params = {
        ...val,
        currPage: curr,
        pageSize: this.pagination.pageSize,
      };
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dbm/codetypeinfo/searchDbmCodeTypeInfo",
          params
        )
        .then((res) => {
          if (res && res.success) {
            this.pagination.total = Number(res.data.totalSize);
            const list = res.data.dbmCodeTypeInfos;
            list.forEach((item) => {
              this.options.forEach((data) => {
                if (item.code_status == data.value) {
                  item.code_status_txt = data.label;
                }
              });
            });
            this.tableData = list;
          }
        });
    },

    //新增 添加
    addCodeData(row) {
      const params = {
        code_type_name: this.modelFormData.code_type_name,
        code_encode: this.modelFormData.code_encode,
        code_remark: this.modelFormData.code_remark,
        code_status: this.modelFormData.code_status,
        itemInfos: [...this.formData.tableData],
      };
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dbm/codetypeinfo/addDbmCodeTypeAndItemInfo",
          params
        )
        .then((res) => {
          if (res && res.success) {
            this.getCodeData();
            this.$Msg.customizTitle("添加成功");
            this.dialogVisible = false;
            this.dialogCancel();
          }
        });
    },

    //编辑代码类 修改
    editCodeData(row) {
      const params = {
        code_type_name: this.modelFormData.code_type_name,
        code_encode: this.modelFormData.code_encode,
        code_remark: this.modelFormData.code_remark,
        code_status: this.modelFormData.code_status,
        code_type_id: this.row.code_type_id,
        create_user: this.row.create_user,
        create_date: this.row.create_date,
        create_time: this.row.create_time,
        itemInfos: [...this.formData.tableData],
      };
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dbm/codetypeinfo/updateDbmCodeTypeAndItemInfo",
          params
        )
        .then((res) => {
          if (res && res.success) {
            this.getCodeData();
            this.$Msg.customizTitle("编辑成功");
            this.dialogCancel();
            this.modelVisible = false;
          }
        })
        .catch(() => {
          this.$Msg.customizTitle("编辑失败", "info");
        });
    },

    //代码项 编辑数据回显
    editEchoData(row) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dbm/codetypeinfo/getDbmCodeTypeInfoById?code_type_id=" +
            row.code_type_id
        )
        .then((res) => {
          if (res && res.success) {
            this.modelFormData = res.data;
            // console.log(this.modelFormData, "回显数据");
          }
        });
    },

    //代码类 编辑数据回显
    editEchoItemData(row) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dbm/codeiteminfo/getDbmCodeItemInfoByCodeTypeId?code_type_id=" +
            row.code_type_id
        )
        .then((res) => {
          if (res && res.success) {
            this.formData.tableData = res.data.dbmCodeItemInfos;
            // this.dbmDataAll =  res.data.dbmCodeItemInfos;
            this.pagination1.total = res.data.dbmCodeItemInfos.length;
            this.dataPg();
          }
        });
    },
    //删除
    deleteCodeData(row) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/dbm/codetypeinfo/deleteDbmCodeTypeInfo?code_type_id=" +
            row.code_type_id
        )
        .then((res) => {
          if (res && res.success) {
            let totalPage = Math.ceil(
              (this.pagination.total - 1) / this.pagination.pageSize
            );
            let currengpage =
              this.pagination.pageNum > totalPage
                ? totalPage
                : this.pagination.pageNum;
            this.pagination.pageNum = currengpage < 1 ? 1 : currengpage;
            this.getCodeData();
            this.$Msg.customizTitle("删除成功");
          }
        })
        .catch(() => {
          this.$Msg.customizTitle("删除失败", "info");
        });
    },

    //批量删除
    batchDelCodeData() {
      if (this.batchDel && this.batchDel.length != 0) {
        let params = this.batchDel.toString();
        this.$executeRequest
          .execPostByControllerAllMappingName(
            "/K/dbm/codetypeinfo/batchDeleteDbmCodeTypeInfo?code_type_id_s=" +
              params,
            params
          )
          .then((res) => {
            if (res && res.success) {
              let num = this.batchDel.length;
              let totalPage = Math.ceil(
                (this.pagination.total - num) / this.pagination.pageSize
              );
              let currengpage =
                this.pagination.pageNum > totalPage
                  ? totalPage
                  : this.pagination.pageNum;
              this.pagination.pageNum = currengpage < 1 ? 1 : currengpage;
              this.getCodeData();
              this.$Msg.customizTitle("删除成功");
              this.batchDel = [];
            }
          })
          .catch(() => {
            this.$Msg.customizTitle("删除失败", "info");
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .table {
  margin-bottom: 0;
}
// ::v-deep .el-input__inner {
//   height: 32px;
// }
// ::v-deep .el-button{
//     width: 82px;
//     height:32px;
//     // padding: 8px 0;
// }
.el-form .el-row {
  padding-left: 20px;
  margin: 10px 0;
}
::v-deep .el-input__inner {
  padding-left: 10px;
  // font-family: @pingfang;
  font-size: 14px;
  color: @tiptxt-color;
}

::v-deep .el-textarea__inner {
  padding: 7px 10px;
  font-family: @pingfang;
  font-size: 14px;
  color: @tiptxt-color;
}
.bottomList {
  border-top: @border-common;
}
</style>
