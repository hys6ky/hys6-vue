<template>
  <div class="px-20 pb-20">
    <div class="d-flex py-10 justify-content-between" style="margin: 5px 0px">
      <ByHeaderSlice title="存储层数据类型对比信息"/>
      <el-button type="primary" @click="downloadModel">
        <i class="el-icon-circle-plus-outline"></i>
        <span>下载模板</span>
      </el-button>
    </div>
    <ByTable
        :tableData="dataTypeContrastInfo"
        :columnArr="columnArr"
        @operateItem="operateItem"
    />
<!--查看详情弹窗-->
<!--    <ByModel-->
<!--    :visible.sync="dialogViewDetails"-->
<!--    modelWidth="80%"-->
<!--    title="查看详情"-->
<!--    >-->
<!--      <template slot="title">-->
<!--         <span class="dialogtitle el-icon-caret-right"-->
<!--         >{{ db_name1 }}->{{ db_name2 }}</span>-->
<!--      </template>-->
<!--      <ByTable-->
<!--        :tableData="tableDetailsData"-->
<!--        :columnArr = "tableDetailCols"-->
<!--      >-->
<!--      </ByTable>-->
<!--    </ByModel>-->
    <el-dialog
        title="查看详情"
        :visible.sync="dialogViewDetails"
        width="80%"
    >
      <div slot="title">
        <span class="dialogtitle el-icon-caret-right"
        >{{ db_name1 }}->{{ db_name2 }}</span
        >
      </div>
      <table class="mailTable">
        <el-table :data="tableDetailsData" border stripe size="medium">
          <el-table-column
              type="index"
              label="序号"
              width="100"
              align="center"
          ></el-table-column>
          <el-table-column
              label="数据库字段类型1"
              prop="database_type1"
              align="center"
          ></el-table-column>
          <el-table-column
              label="数据库字段类型2"
              prop="database_type2"
              align="center"
          ></el-table-column>
        </el-table>
      </table>
    </el-dialog>
    <!-- 获取上传文件 -->
    <el-dialog
        title="导入数据"
        :visible.sync="dialogImportData"
        :before-close="importDatacancel"
    >
      <span v-if="fileList != ''">确认导入 “ {{ fileList[0].name }} ” </span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importDatacancel" size="mini" type="danger"
        >取消</el-button
        >
        <el-button
            type="primary"
            @click="importData"
            :loading="loadingUpload"
            size="mini"
        >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {columnArr,tableDetailCols} from "./mock";
import * as validator from "@/utils/validator";
import ByModel from "@/components/global/ByModel.vue";
import ByTable from "@/components/global/ByTable.vue";

export default {
  name: "",
  components: {ByTable, ByModel},
  data() {
    return {
      dataTypeContrastInfo:[],
      columnArr,
      tableDetailCols,
      visible: false,
      dialogViewDetails:false,
      fileList: [],
      db_name1: "",
      db_name2: "",
      tableDetailsData: [],
      loadingUpload: false,
      dialogImportData: false,
    }
  },
  created() {
    this.getDataTypeContrastInfo()
  },
  mounted() {

  },
  methods: {
    operateItem(type,row){
      if(type === 'look'){
        // this.dialogViewDetails = true
        this.getLookMsg(row)
      }
    },
    //  获取数据列表
    getDataTypeContrastInfo(){
      this.$executeRequest
          .execByControllerMappingName("/searchContrastTypeInfo")
          .then((res) => {
            if(res && res.success && res.data.length > 0){
              this.dataTypeContrastInfo = res.data;
            }
          });
    },
    //导入数据按钮
    importData() {
      if (arr.length > 0) {
        this.loadingUpload = true;
        let param = new FormData(); // 创建form对象
        for (let i = 0; i < arr.length; i++) {
          param.append("file", arr[i].raw);
        }
        this.$executeRequest
            .uploadFile("/uploadExcelFile", param)
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("导入数据成功", "success");
                this.fileList = [];
                this.dialogImportData = false;
                this.loadingUpload = false;
                this.getDataTypeContrastInfo();
              } else {
                this.loadingUpload = false;
                this.getDataTypeContrastInfo();
              }
            });
      } else {
        this.$Msg.customizTitle("请选择上传文件", "warning");
      }
    },
    //取消数据导入
    importDatacancel() {
      this.dialogImportData = false;
      this.fileList = [];
      this.$Msg.customizTitle("已取消导入数据", "info");
    },
    // 文件下载
    downloadModel() {
      let file_name = "data_type_contrast.xlsx";
      let param = { fileName: file_name };
      this.$executeRequest
          .execDownloadFileByMenuUrl("/generateExcel", param)
          .then((res) => {
            if (res && res.success) {
              this.$executeRequest
                  .downloadFile("/downloadFile", param)
                  .then((res => {
                    this.$file.fileDownload(res, file_name);
                  }));
            }
          });
    },
    // 查看详情
    getLookMsg(row) {
      let params = {};
      params["db_name1"] = row.database_name1;
      params["db_name2"] = row.database_name2;
      this.$executeRequest
          .execByControllerMappingName("/getDataTypeMsg", params)
          .then((res) => {
            this.db_name1 = row.database_name1;
            this.db_name2 = row.database_name2;
            this.tableDetailsData = res.data;
          });
      this.dialogViewDetails = true;
    },
  }
}
</script>

<style scoped lang="less">
.el-button {
  width: 90px;
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
.mailTable {
  width: 100%;
  margin: 0 auto;
}
</style>
