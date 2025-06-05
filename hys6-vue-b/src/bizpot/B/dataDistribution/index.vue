<template>
  <div class="dataDistribution">
    <el-row class="topTitle">
      <span class="el-icon-s-data">数据分发</span>
      <router-link :to="{ name: 'dataCollectionO' }">
        <el-button
          class="goIndex"
          type="primary"
          size="mini"
          icon="el-icon-s-home"
        >
          返回首页
        </el-button>
      </router-link>
    </el-row>
    <el-col>
      <el-row>
        <div class="subSystemdiv">
          <el-upload
            class="buttonStyle"
            accept=".xlsx"
            action=""
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleChange"
            :limit="1"
            :on-exceed="handleExceed"
            :fileList="fileList"
          >
            <el-button size="mini" type="primary">excel数据导入</el-button>
          </el-upload>
          <el-button
            class="buttonStyle"
            size="mini"
            type="primary"
            @click="downloadModel"
            >下载模板
          </el-button>
          <el-button
            class="buttonStyle"
            size="mini"
            type="primary"
            @click="addDistribute"
            >新增
          </el-button>
          <el-button
            class="buttonStyle"
            size="mini"
            type="primary"
            @click="handleBatchRelease"
            >批量发布
          </el-button>
        </div>
      </el-row>
      <el-table
        class="tabes"
        type="border-card"
        :data="distributeData"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" align="center" width="60px"/>
        <el-table-column label="序号" align="center" width="80px">
          <template scope="scope">
            <span>{{ scope.$index + (currentPage - 1) * pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sql_table"
          label="sql语句"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="plane_url"
          label="数据落地目录"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="file_name"
          label="文件名称"
          align="center"
          width="250px"
        >
        </el-table-column>
        <el-table-column
          prop="file_suffix"
          label="文件后缀"
          align="center"
          width="100px"
        >
        </el-table-column>
        <el-table-column
          prop="is_release"
          label="是否已发布"
          align="center"
          width="120px"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.is_release == '0'">否</p>
            <p v-else-if="scope.row.is_release == '1'">是</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="releaseJob(scope.$index, scope.row)"
              >发布
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteDistributeData(scope.$index, scope.row)"
            >
              删除
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize"
          class="locationcenter"
        />
      </el-row>
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
    </el-col>
  </div>
</template>

<script>
import * as validator from "@/utils/validator";
import * as functionAll from "./mock";

let arr = [];
export default {
  name: "dataDistribution",
  //写定义的变量数据方法等
  data() {
    return {
      rule: validator.default,
      // treeData: [],
      dicList: [],
      filterText: "",
      menuVisible: false,
      currentPage: 1,
      totalSize: 0,
      pageSize: 10,
      distributeData: [],
      fileFormat: "",
      fileList: [],
      loadingUpload: false,
      dialogFormDistributeAdd: false,
      dialogFormDistributeUpdate: false,
      dialogImportData: false,
      formLabelWidth: "150px",
      dd_id: "",
      file_name: "",
      //批量发布时选中的数据
      multipleSelection: [],
      form: {
        sql_table: "",
        database_code: "",
        row_separator: "",
        database_separatorr: "",
        dbfile_format: "",
        plane_url: "",
        file_name: "",
        dd_remark: "",
        file_suffix: "",
        is_upper: "0",
        is_header: "0",
        is_reduce: "0",
        is_mark_file: "0",
        is_compress: "0",
        is_flag: "0",
        is_release: "0",
      },
      formUpdate: {},
      dataBaseCode: [],
      isFlag: [],
      newlineCharacter: [
        {
          value: "\\n",
          code: "1",
          title: "\\n  (Linux、Unix换行符)",
        },
        {
          value: "\\r",
          code: "2",
          title: "\\r  (Mac OS换行符)",
        },
        {
          value: "\\r\\n",
          code: "3",
          title: "\\r\\n  (windows换行符)",
        },
      ],
    };
  },
  mounted() {
    this.getDistributeData(this.currentPage, this.pageSize);
    this.$Code
      .getCategoryItems({
        category: "DataBaseCode",
      })
      .then((res) => {
        if (res && res.success) {
          this.dataBaseCode = res.data;
        }
      });
    this.$Code
      .getCategoryItems({
        category: "FileFormat",
      })
      .then((res) => {
        if (res && res.success) {
          this.fileFormat = res.data;
        }
      });
    this.$Code
      .getCategoryItems({
        category: "IsFlag",
      })
      .then((res) => {
        if (res && res.success) {
          this.isFlag = res.data;
        }
      });
  },
  methods: {
    //选中的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getDistributeData(page, size) {
      var data = { currPage: page, pageSize: size };
      this.$executeRequest
        .execGetByPostModuleUrl("/dataDistribution/getDistributeData", data)
        .then((res) => {
          if (res && res.success) {
            this.distributeData = res.data.dataInfo;
            this.totalSize = res.data.totalSize;
          }
        });
    },
    addDistribute() {
      this.$router.push({
        name: "dataDistributeAdd",
      });
    },
    releaseJob(index, row) {
      this.$router.push({
        name: "dataDistributionJob",
        query: { dd_ids: row.dd_id },
      });
    },
    downloadModel() {
      let file_name = "data_distribute.xlsx";
      let param = { fileName: file_name };
      this.$executeRequest.downloadFile("/downloadDistributeFile", param).then((res) => {
          let fileName = "data_distribute.xlsx";
          this.$FileOperations.fileDownload(res, fileName);
        })
    },
    // 获取上传的文件详情
    handleChange(file, fileList) {
      this.fileList = fileList;
      if (fileList.length != 0) {
        this.dialogImportData = true;
      } else {
        this.dialogImportData = false;
      }
      arr = fileList;
    },
    //文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$Msg.customizTitle("只能选择一个文件", "warning");
    },
    //取消数据导入
    importDatacancel() {
      this.dialogImportData = false;
      this.fileList = [];
      this.$Msg.customizTitle("已取消导入数据", "info");
    },
    //导入数据按钮
    importData() {
      if (arr.length > 0) {
        this.loadingUpload = true;
        const param = new FormData();
        arr.map((item) => param.append("file", item.raw));
        this.$executeRequest
          .uploadFile("/uploadExcelFile", param)
          .then((res) => {
            if (res && res.success) {
              this.$Msg.customizTitle("导入数据成功", "success");
              this.fileList = [];
              this.dialogImportData = false;
              this.loadingUpload = false;
              this.getDistributeData(this.currentPage, this.pageSize);
            } else {
              this.loadingUpload = false;
              this.getDistributeData(this.currentPage, this.pageSize);
            }
          });
      } else {
        this.$Msg.customizTitle("请选择上传文件", "warning");
      }
    },
    //批量发布
    handleBatchRelease() {
      if (this.multipleSelection.length == 0) {
        this.$Msg.customizTitle("请选择需要发布的数据", "warning");
      } else {
        let arr = [];
        this.multipleSelection.forEach((item) => {
          arr.push(item.dd_id);
        });
        let params = {};
        params["dd_ids"] = arr;
        this.$router.push({
          name: "dataDistributionJob",
          query: params,
        });
      }
    },
    saveDistributeData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 调用添加方法
          functionAll.saveDistributeData(this.form).then((response) => {
            if (response && response.success) {
              this.$Msg.customizTitle("添加成功", "success");
              this.$emit("addEvent");
              // 隐藏对话框
              this.dialogFormDistributeAdd = false;
              // 表单清空
              this.$refs.form.resetFields();
              this.getDistributeData(this.currentPage, this.pageSize);
            }
          });
        } else {
          return false;
        }
      });
    },
    updateDistributeData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          functionAll.updateDistributeData(this.formUpdate).then((res) => {
            if (res && res.success) {
              this.$message({
                type: "success",
                message: "更新成功!",
              });
              this.dialogFormDistributeUpdate = false;
              this.formUpdate = {};
              this.getDistributeData(this.currentPage, this.pageSize);
            }
          });
        } else {
          return false;
        }
      });
    },
    //删除
    deleteDistributeData(index,row) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$executeRequest
            .execGetByPostModuleUrl("/dataDistribution/deleteDistributeData", {
            dd_id: row.dd_id
          })
            .then((res) => {
              if (res && res.success) {
                this.$Msg.customizTitle("删除成功", "success");
                // 从新渲染表格
                this.getDistributeData(this.currentPage, this.pageSize);
              }
            });
        })
        .catch(() => {
          this.$Msg.customizTitle("已取消删除", "info");
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // 点击每页显示的条数时，显示第一页
      this.getDistributeData(this.currentPage, this.pageSize);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // 切换页码时，要获取每页显示的条数
      this.getDistributeData(this.currentPage, this.pageSize);
    },
    cancleAdd() {
      // 表单清空
      this.form = {};
      this.dialogFormDistributeAdd = false;
      this.$refs.form.resetFields();
      this.formUpdate = {};
      this.dialogFormDistributeUpdate = false;
      this.$refs.formUpdate.resetFields();
    },
    beforeClose() {
      // 表单清空
      this.form = {};
      this.dialogFormDistributeAdd = false;
      this.$refs.form.resetFields();
      this.formUpdate = {};
      this.dialogFormDistributeUpdate = false;
      this.$refs.formUpdate.resetFields();
    },
    // 获取表格当前行数据
    handleEdit(index, row) {
      var data = { dd_id: row.dd_id };
      this.$router.push({
        name: "dataDistributeUpdate",
        query: data,
      });
    },
  },
};
</script>

<style lang="less">
.fontStyle {
  margin-top: 5px;
  color: #2196f3;
  font-size: 18px;
}

.buttonStyle {
  display: block;
  float: left;
  margin-right: 10px;
  margin-left: 0px;
}

.saveButton {
  margin-top: 5px;
  float: right;
}

.tabes {
  margin-top: 14px;
}

.subSystemdiv {
  float: right;
}
</style>
