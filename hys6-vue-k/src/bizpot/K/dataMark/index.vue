<template>
  <div class="dataMark h100 px-20">
    <ByQuickSearch :formItems="formItems" @reset="reset" @search="search" />
    <div class="mt-20" style="height: calc(100% - 110px)">
      <ByContainerTitle>
        <el-button type="major" v-debounce style="padding: 0px; border: 0px">
          <el-upload
            accept=".xls,.xlsx"
            action=""
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleChange"
            :limit="1"
            :fileList="fileList"
          >
            <el-button type="major" @click="fileList = []">落标导入</el-button>
          </el-upload>
        </el-button>
        <!--<el-button type="major" v-debounce>落标导出</el-button>-->
        <el-button type="major" v-debounce @click="demoFile">
          模板下载
        </el-button>
        <!-- <el-button type="major">落标关联</el-button> -->
      </ByContainerTitle>
      <div style="margin-top: 16px" v-if="tableData.length > 0">
        <ByTable
          :tableData="tableData"
          :columnArr="columnArr"
          :pagination="pagination"
          @operateItem="operateItem"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        />
      </div>
      <div style="height: calc(100% - 30px)" v-else>
        <ByEmpty />
      </div>
    </div>
    <!--    <div class="font-12 pb-20" style="color: #666666">-->
    <!--      说明：默认显示各系统最新检测日期的任务-->
    <!--    </div>-->
    <ByDrawer
      :visible.sync="visible"
      :drawTitle="modelTitle"
      @confirm="confirm"
    >
      <el-descriptions size="medium">
        <template slot="title">
          <ByHeaderSlice title="信息总览" />
        </template>
        <el-descriptions-item
          v-for="item in columnArr.slice(1, 10)"
          :key="item.prop"
          :label="item.label"
        >
          <span
            v-if="item.type === 'tag'"
            :style="`color:${detailItem[item.prop]?.color}`"
            >{{ detailItem[item.prop]?.text || "--" }}
          </span>
          <span v-else>{{ detailItem[item.prop] || "--" }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <ByHeaderSlice title="标准列表" style="margin: 16px 0 0" />
      <ByQuickSearch
        :formItems="mesureFormItems"
        :extraButton="[{ label: '检测' }]"
        @btnClick="detection"
        @reset="resetLuoBiao"
        @search="searchLuoBiao"
      />
      <div style="margin-top: 16px">
        <ByTable
          :tableData="mesureTableData"
          :columnArr="mesureCulumnArr"
          :pagination="mesurePagination"
          @selectionChange="selectionChange"
          @sizeChange="sizeChange1"
          @currentChange="currentChange1"
        />
      </div>
    </ByDrawer>
    <ByModel
      :visible.sync="bulkImportVisible"
      modelTitle="批量导入"
      @close="handleClose"
    >
      <el-row class="file">
        <el-col :span="24" :offset="1">
          <span v-if="fileList.length > 0"
            >确认导入: " {{ fileList[0].name }} "
          </span>
        </el-col>
      </el-row>
      <template slot="modalFoot">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="upFile()" v-debounce>
          确 认
        </el-button>
      </template>
    </ByModel>
  </div>
</template>
<script>
import { formItems, columnArr, mesureFormItems, mesureCulumnArr } from "./mock";
import ByQuickSearch from "@/components/global/ByQuickSearch.vue";

export default {
  name: "dataMark",
  components: { ByQuickSearch },
  data() {
    return {
      fromData: {},
      fileList: [],
      bulkImportVisible: false,
      formItems,
      columnArr, //表格列
      tableData: [], //表格数据
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
      },
      visible: false,
      modelTitle: "编辑目录",
      detailItem: {
        sysNum: "",
        sysName: "",
        SchemaName: "",
        formChName: "",
        formEnName: "",
        fieldChName: "",
        fieldEnName: "",
        dataDropMark: "标准名称",
        dataDropMarkResult: {
          text: "",
          color: "",
        },
      }, //
      // modelFormConfig,//弹窗表单配置
      // modelFormData,//弹窗表单数据
      // modelFormRules,//弹窗表单验证规则
      // modelForemItems,//弹窗表单项
      mesureFormItems, //标准列表项
      mesureCulumnArr, //标准列表列
      mesureTableData: [], //标准列表数据
      mesurePagination: {
        total: 0,
        pageNum: 1,
        pageSize: 15,
        pageSizes: [15, 50, 100],
      },
      jianceData: {}, // 检测选中的数据
      resultData: {}, //  接受检测完的结果
      searchForm: [],
      searchFormOne: [],
    };
  },
  created() {
    this.standardType();
    this.sysType();
  },
  methods: {
    // 获取上传的文件详情
    handleChange(file, fileList) {
      this.fileList = fileList;
      if (fileList.length != 0) {
        this.bulkImportVisible = true;
      } else {
        this.bulkImportVisible = false;
      }
    },
    handleClose() {
      this.bulkImportVisible = false;
    },
    upFile() {
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
          .uploadFileAllMappingName("/K/standardImp/importExcel", param)
          .then((res) => {
            if (res && res.success) {
              this.$Msg.customizTitle("批量导入成功", "success");
              this.bulkImportVisible = false;
              if (this.sort_id) {
              } else {
              }
            }
          });
      }
    },
    // 查询数据
    search(val) {
      console.log("查询", val);
      this.pagination.pageNum = 1;
      this.searchForm = val;
      if (val.sysNum) {
        if (val) {
          this.getTaskList(val);
        }
      } else {
        this.$message.error("请选择系统");
      }
    },
    searchLuoBiao(val) {
      this.mesurePagination.pageNum = 1;
      this.searchFormOne = val;
      if (val) {
        this.getLuoBiaoList(val);
      }
    },

    getTaskList(val) {
      this.fromData = val;
      console.log(this.fromData);
      console.log(val);
      let data = {
        sysNum: val.sysNum,
        source_id: val.sysNum, //数据源id， 必选
        retrieval: val.formName, // 检索
        codeTypeId: val.standard[val.standard.length - 1], // 标准
        currPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      this.standardImpPage(data);
    },
    getstandardImpPage() {
      debugger;
      if (this.fromData) {
        console.log(this.fromData, "fromeData数据");
        let data = {
          sysNum: this.fromData.sysNum,
          source_id: this.fromData.sysNum, //数据源id， 必选
          retrieval: this.fromData.formName, // 检索
          codeTypeId: this.fromData.standard[this.fromData.standard.length - 1], // 标准
          currPage: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
        };
        this.standardImpPage(data);
      } else {
        this.$message.error("请选择系统");
      }
    },
    standardImpPage(params) {
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/standardImp/standardImpPage",
          params
        )
        .then((res) => {
          if (res && res.success) {
            res.data.infoList.map((item) => {
              if (item.imp_result == "1") {
                item.imp_result = {
                  text: "一致",
                  color: "#3BC698",
                };
              } else if (item.imp_result == "0") {
                item.imp_result = {
                  text: "不一致",
                  color: "#E6515D",
                };
              } else {
                item.imp_result = {
                  text: "--",
                };
              }
            });
            this.tableData = res.data.infoList;
            this.pagination.total = res.data.totalSize;
          }
        });
    },

    getLuoBiaoList(val) {
      console.log(val, "luobiaochauxun");
      let data = {
        src_col_cname: this.detailItem.col_cname, //原始字段中文名称, 必填
        sort_id: val.measureCode[val.measureCode.length - 1], // 所属分类id
        search_cond: val.measureName, // 标准名称
        currPage: this.mesurePagination.pageNum,
        pageSize: this.mesurePagination.pageSize,
      };
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/standardImp/getStandardList",
          data
        )
        .then((res) => {
          if (res && res.success) {
            this.mesureTableData = res.data.normInfoList;
            this.mesurePagination.total = res.data.total;
          }
        });
    },

    // 系统
    sysType() {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/standardImp/queryMeta",
          {}
        )
        .then((res) => {
          let opt = [];
          res.data.forEach((item) => {
            opt.push({
              label: item.label,
              value: item.id,
            });
          });
          this.formItems.forEach((data) => {
            if (data.prop === "sysNum") {
              data.options = opt;
            }
          });
        });
    },
    // 标准
    standardType() {
      this.$executeRequest
        .execPostByControllerAllMappingNameParams(
          "/K/dbm/tree/getDbmSortInfoTreeData",
          {}
        )
        .then((res) => {
          let opt = [];
          res.data.dbmSortInfoTreeDataList.forEach((item) => {
            opt.push(item);
          });
          this.formItems.forEach((data) => {
            if (data.prop === "standard") {
              data.options = opt;
            }
          });
          this.mesureFormItems.forEach((data) => {
            if (data.prop === "measureCode") {
              data.options = opt;
            }
          });
        });
    },
    reset(val) {
      console.log("重置", val);
    },
    resetLuoBiao(val) {
      console.log("重置", val);
    },
    // 检测
    detection(val) {
      console.log(this.detailItem, "dsfdsfdsfdsfdsf");
      let data = {
        src_col_ename: this.detailItem.col_ename, //原始字段英文名称
        src_col_cname: this.detailItem.col_cname, //原始字段中文名称
        src_col_type: this.detailItem.col_type, //原始字段类型
        src_col_len: this.detailItem.col_len, //原始字段长度
        src_col_preci: this.detailItem.col_prec, //原始字段精度
        basic_id: this.jianceData.basic_id, //标准元主键
        code_type_id: this.jianceData.code_type_id, //代码类主键（标准代码）
      };
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/standardImp/standardCheck",
          data
        )
        .then((res) => {
          if (res && res.success) {
            this.resultData = res.data;
            // this.detailItem.imp_result = res.data.imp_result
            if (res.data.imp_result == "1") {
              this.detailItem.imp_result = "一致";
            } else {
              this.detailItem.imp_result = "不一致";
            }
            this.$message.success("检测成功");
          }
        });
    },
    operateItem(type, row) {
      console.log(row, "row参数是什么");
      this.detailItem = Object.assign({}, row);
      let maData = {
        // 字段中文名称 和字段英文名称必须有一项是必填的
        src_col_cname: row.col_cname, //原始字段中文名称, 必填
        src_col_ename: row.col_ename, //原始字段英文文名称, 必填
        currPage: this.mesurePagination.pageNum,
        pageSize: this.mesurePagination.pageSize,
      };
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/standardImp/getStandardList",
          maData
        )
        .then((res) => {
          if (res && res.success) {
            this.mesureTableData = res.data.normInfoList;
            this.mesurePagination.total = res.data.total;
          }
        });
      this.visible = true;
    },
    //弹窗取消
    cancel() {},
    //弹窗确认
    confirm() {
      let result = {
        imp_id: this.detailItem.imp_id, //落标ID
        obj_id: this.detailItem.obj_id, //对象ID
        dtl_id: this.detailItem.dtl_id, //字段id
        basic_id: this.jianceData.basic_id, //标准元主键
        imp_result: this.resultData.imp_result, //落标结果————检测获取
        imp_detail: this.resultData.imp_detail, //落标详情————检测获取
      };
      this.$executeRequest
        .execPostByControllerAllMappingName(
          "/K/standardImp/updateImpInfo",
          result
        )
        .then((res) => {
          if (res && res.success) {
            this.visible = false;
            this.$message.success("检测完成");
            this.getstandardImpPage();
          }
        });
    },
    selectionChange(value) {
      this.mesureTableData.map((item) =>
        item.basic_id === value.basic_id
          ? this.$set(item, "checked", true)
          : this.$set(item, "checked", false)
      );
      this.jianceData = value;
      // this.mesureTableData.map((item) => (item.checked = item.id === value.id));
    },
    // 落标导入数据
    // importFile() {
    //   let fileData = {
    //     file: 'C:\\Users\\洋\\Downloads\\bzc_ep_yxhxxb.xlsx'
    //   }
    //   this.$executeRequest.execPostByControllerAllMappingName("/K/standardImp/importExcel", fileData).then((res) => {
    //     if (res && res.success) {
    //       console.log(res, '结果')
    //       this.visible = false
    //     }
    //   });
    // },
    //   模板下载
    demoFile() {
      this.$executeRequest
        .downloadPostFileAllMappingNameParams("/K/standardImp/exportExcel", {})
        .then((res) => {
          const blob = res;
          let fileName = "数据落标导入模板.xlsx";
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
    //分页
    currentChange(val) {
      this.pagination.pageNum = val;
      //调用接口
      if (this.searchForm) {
        this.getTaskList(this.searchForm);
      }
    },
    sizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      //调用接口
      if (this.searchForm) {
        this.getTaskList(this.searchForm);
      }
    },
    currentChange1(val) {
      this.mesurePagination.pageNum = val;
      //调用接口
      if (this.searchFormOne) {
        this.getLuoBiaoList(this.searchFormOne);
      }
    },
    sizeChange1(val) {
      this.mesurePagination.pageNum = 1;
      this.mesurePagination.pageSize = val;
      //调用接口
      if (this.searchFormOne) {
        this.getLuoBiaoList(this.searchFormOne);
      }
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-table th.el-table__cell:nth-last-child(2)::after {
  display: none;
}

::v-deep .el-descriptions__body {
  margin-top: 10px;
}
</style>
