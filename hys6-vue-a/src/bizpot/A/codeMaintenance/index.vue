<template>
  <div class="px-20 pb-20">
<!--    <ByContainerTitle-->
<!--        title = "编码信息"-->
<!--        :addBtn = false-->
<!--        style="margin: 5px 0px"-->
<!--    />-->
    <el-tabs v-model="value" @tab-click="changeTabPane">
      <!-- 统一编码 -->
      <el-tab-pane label="统一编码" name="统一编码">
        <el-row>
          <el-button
              size="small"
              type="primary"
              @click="dialogFormVisibleAdd = true"
              class="addCodeButton"
              style="margin-top: 5px"
          >
            <i class="el-icon-circle-plus-outline"></i>新增统一编码
          </el-button
          >
        </el-row>
        <ByTable
          :tableData="codeMaintenanceTableData.slice(
                (codepagination.pageNum - 1) *  codepagination.pageSize,
                codepagination.pageNum * codepagination.pageSize)"
          :columnArr = "codeColumns"
          :span-method="arraySpanMethod"
          @operateItem="optionItem"
          :pagination = "codepagination"
          @sizeChange="handleSizeChange"
          @currentChange = "handleCurrentChange"
        >
        </ByTable>
      </el-tab-pane>
      <el-tab-pane label="源系统编码" name="源系统编码">
        <div v-show="showOrhidden">
          <el-row>
            <el-button
                size="small"
                type="primary"
                @click="dialogFormVisibleAddScoure = true"
                class="addCodeButton"
                style="margin-top: 5px"
            >
              <i class="el-icon-circle-plus-outline"></i>新增源系统编码</el-button>
          </el-row>
          <ByTable
            :tableData = "sourceCodeTabledata.slice(
                (origpagination.pageNum - 1) * origpagination.pageSize,
                origpagination.pageNum * origpagination.pageSize
              )"
            :columnArr = "origColumns"
            @linkTo = "gotoInfos"
            :pagination = "origpagination"
            @sizeChange="handleSizeChangeScoure"
            @currentChange = "handleCurrentChangeListScoure"
          >
          </ByTable>
        </div>

        <div v-show="hiddenOrshow">
          <el-row class="hiddenOrshowRow">
            <el-col :span="24">
              <strong class="strongSpan"> 编码分类:</strong>
              <el-select
                  v-model="job_status"
                  size="small"
                  placeholder="--选择编码分类--"
                  @change="changeValue"
              >
                <el-option
                    v-for="item in jobStatus"
                    :key="item"
                    :label="item"
                    :value="item"
                >
                </el-option>
              </el-select>
              <el-button
                  class="buttonAdd"
                  size="small"
                  type="primary"
                  @click="addFromaJAX"
              >新增
              </el-button>

              <div class="saveOrgohome">
                <el-button size="small" type="primary" @click="saveOrgohome">返回</el-button>
                <el-button
                    size="small"
                    type="success"
                    @click="saveCodeList('formScoureAdd')">保存</el-button>
              </div>
            </el-col>
          </el-row>
          <el-form ref="formScoureAdd" :model="formScoureAdd">
            <el-table
                stripe
                :data="
                formScoureAdd.codeMaintenanceTableDataScoureAdd.slice(
                  (currentPageScoureinfo - 1) * pageSizeScoureinfo,
                  currentPageScoureinfo * pageSizeScoureinfo
                )
              "
                border
                size="medium"
                :span-method="arraySpanMethodScoure"
            >
              <el-table-column type="index" label="序号" width="70" align="center">
                <template slot-scope="scope">
                  <span>{{
                      scope.$index + (currentPageScoureinfo - 1) * pageSizeScoureinfo + 1
                    }}</span>
                </template>
              </el-table-column>

              <el-table-column
                  prop="code_classify"
                  label="编码分类"
                  align="center"
              ></el-table-column>

              <el-table-column
                  prop="code_classify_name"
                  label="编码分类名称"
                  align="center"
              ></el-table-column>

              <el-table-column
                  prop="code_type_name"
                  label="编码名称"
                  align="center"
              ></el-table-column>

              <el-table-column
                  prop="code_value"
                  label="编码值"
                  align="center"
              ></el-table-column>

              <el-table-column label="源系统编码值" align="center">
                <template slot-scope="scope">
                  <el-form-item
                      v-if="scope.row.show == false"
                      :prop="`codeMaintenanceTableDataScoureAdd.${scope.$index}.orig_value`"
                      :rules="filter_rules([{ required: true }])"
                  >
                    <el-input
                        size="mini"
                        v-model="scope.row.orig_value"
                        placeholder="源系统编码值"
                    ></el-input>
                  </el-form-item>
                  <el-input
                      size="mini"
                      v-else
                      v-model="scope.row.orig_value"
                      readonly
                      placeholder="源系统编码值"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center" width="160">
                <template slot-scope="scope">
                  <el-button
                      size="mini"
                      type="text"
                      v-if="scope.row.show"
                      @click="
                      dialogFormVisibleUpdateScoure = true;
                      handleEditScoure(scope.$index, scope.row);
                    "
                  >编辑
                  </el-button
                  >
                  <el-button
                      size="mini"
                      type="text"
                      @click="delteThisDataScoure(scope.row)"
                  >删除
                  </el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页内容 -->
            <el-row class="pagination">
              <el-pagination
                  @current-change="handleCurrentChangeListScoureinfo"
                  :current-page="currentPageScoureinfo"
                  @size-change="handleSizeChangeScoureinfo"
                  :page-sizes="[5, 10, 50, 100, 500]"
                  :page-size="pageSizeScoureinfo"
                  layout=" total,sizes,prev, pager, next,jumper"
                  :total="formScoureAdd.codeMaintenanceTableDataScoureAdd.length"
              ></el-pagination>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加统一编码 -->
    <ByModel
        modelTitle="统一编码"
        :visible.sync="dialogFormVisibleAdd"
        :beforeClose="beforeCloseAdd"
        modelWidth="900px"
    >
      <ByModelForm
        :formData="form"
        :formConfig="oneConfig"
        :formItems = "oneFormItems"
        :formRules = "oneFormRules"
        ref="oneRef"
      >
      </ByModelForm>
      <el-button
          size="small"
          class="partTwoBtn"
          type="success"
          @click="addTableData"
          style="margin-bottom: 5px"
      >增加行
      </el-button>
      <ByTable
        :tableData="form.tableData"
        :columnArr="oneTableCols"
        @operateItem="deleteArry"
      ></ByTable>
      <template slot="modalFoot">
        <el-button @click="beforeCloseAdd">取消</el-button>
        <el-button type="primary" @click="add()">保存</el-button>
      </template>
    </ByModel>
    <!-- 更新统一编码信息 -->
    <ByModel
        modelTitle="更新统一编码信息"
        :visible.sync="dialogFormVisibleUpdate"
        :beforeClose="beforeCloseupdate"
        modelWidth="900px"
    >
      <ByModelForm
          :formData="formUpdate"
          :formConfig="twoConfig"
          :formItems = "twoFromItems"
          :formRules = "oneFormRules"
          ref="twoRef"
      >
      </ByModelForm>
      <el-button
          size="small"
          class="partTwoBtn"
          type="success"
          @click="addTableData1"
          style="margin-bottom: 5px"
      >增加行
      </el-button>
      <ByTable
          :tableData="formUpdate.tableData"
          :columnArr="twoTableCols"
          @operateItem="deleteArry1"
      ></ByTable>
      <template slot="modalFoot">
        <el-button @click="beforeCloseupdate">取消</el-button>
        <el-button
            type="primary"
            @click="formUpdateSubmit()"
        >保存
        </el-button>
      </template>
    </ByModel>
    <!-- 添加系统编码 -->
    <ByModel
        modelTitle="源系统编码"
        :visible.sync="dialogFormVisibleAddScoure"
        modelWidth="550px"
        :beforeClose="beforeCloseAddScoure"
    >
      <ByModelForm
        :formData="formScoure"
        :formConfig="formConfig"
        :formItems="formItems"
        :formRules="formRules"
        ref="formScoure"
      />
      <template slot="modalFoot">
          <el-button @click="beforeCloseAddScoure">取消</el-button>
          <el-button
              type="primary"
              @click="addOrigSysInfo('formScoure')">保存</el-button>
      </template>
    </ByModel>
    <!-- 编辑源系统编码 -->
    <ByModel
        modelTitle="源系统编码"
        :visible.sync="dialogFormVisibleUpdateScoure"
        :beforeClose="beforeCloseupdateScoure"
        modelWidth="900px"
    >
      <ByModelForm
          :formData="formScoureRef"
          :formConfig="threeConfig"
          :formItems = "threeFromItems"
          :formRules = "threeFormRules"
          ref="threeRef"
      >
      </ByModelForm>
      <ByTable
          :tableData="formScoureRef.tableData"
          :columnArr="threeTableCols"
          @operateItem="deleteArry1"
      ></ByTable>
      <template slot="modalFoot">
        <el-button type="text" size="small" @click="beforeCloseupdateScoure">取消</el-button>
        <el-button
            type="text"
            size="small"
            @click="addOrigSysInfoScoure()"
        >保存
        </el-button>
      </template>
    </ByModel>
  </div>
</template>

<script>
import ByTable from "@/components/global/ByTable.vue";
import * as validator from "@/utils/validator";
import {
  codeColumns,
  origColumns,
  formConfig,
  formItems,
  formRules,
  oneConfig,
  oneFormItems,
  oneFormRules,
  oneTableCols,
  twoConfig,
  twoFromItems,
  twoTableCols,
  threeConfig,
  threeFromItems,
  threeFormRules,
  threeTableCols
} from "./mock.js"
import ByModel from "@/components/global/ByModel.vue";
import ByModelForm from "@/components/global/ByModelForm.vue";
export default {
  name: "",
  components: {ByModelForm, ByModel, ByTable},
  data() {
    return {
      codeColumns,
      codepagination: {
        total: 0,
        pageNum: 1,
        pageSize: 5,
        pageSizes: [5, 10, 20, 50],
      },
      origColumns,
      origpagination:{
        total: 0,
        pageNum: 1,
        pageSize: 5,
        pageSizes: [5, 10, 20, 50],
      },
      formConfig,
      formItems,
      formRules,
      oneConfig,
      oneFormItems,
      oneFormRules,
      oneTableCols,
      twoConfig,
      twoFromItems,
      twoTableCols,
      threeConfig,
      threeFromItems,
      threeFormRules,
      threeTableCols,
      currentPageScoureinfo: 1,
      pageSizeScoureinfo: 50,
      form: {
        tableData: [],
        code_classify: "",
        code_classify_name: "",
        code_remark: "",
      },
      value: "统一编码",
      rule: validator.default,
      codeMaintenanceTableData: [],
      sourceCodeTabledata: [],
      job_status: "",
      jobStatus: [],
      dialogFormVisibleAdd: false,
      dialogFormVisibleUpdate: false,
      dialogFormVisibleAddScoure: false,
      dialogFormVisibleUpdateScoure: false,
      // 添加数据与导入源字段
      formScoure: {
        orig_sys_code: "",
        orig_sys_name: "",
        orig_sys_remark: "",
      },
      formUpdate: {
        tableData: [],
        code_classify: "",
        code_classify_name: "",
        code_remark: "",
      },
      formScoureAdd: {
        codeMaintenanceTableDataScoureAdd: [],
      },
      formScoureRef: {
        tableData: [],
        code_classify: "",
        code_classify_name: "",
      },
      spanArr: [],
      pos: 0,
      spanArr2: [],
      pos2: 0,
      hiddenOrshow: false,
      showOrhidden: true,
      onlyId: "",
      onlyArry: [],
      markId: "",
      resultArryData: [],
    };
  },
  mounted() {
    this.getCodeInfo();
    this.getOrigSysInfo();
  },
  methods: {
    // 统一编码信息
    //查询统一编码信息
    getCodeInfo() {
      this.$executeRequest
          .execPostByPathUrl("/codeMaintenance/getCodeInfo")
          .then((res) => {
            if (res && res.success && res.data.length > 0) {
              this.codeMaintenanceTableData = res.data;
              this.codepagination.total = res.data.length;
              this.dataRosolve(res.data);
            }
          });
    },
    // 查询所有统一编码分类
    getAllCodeClassify() {
      this.$executeRequest
          .execPostByPathUrl("/codeMaintenance/getAllCodeClassify")
          .then((res) => {
            if (res && res.success && res.data.length > 0) {
              this.jobStatus = res.data;
            }
          });
    },
    // 添加统一编码行数据
    addTableData() {
      this.form.tableData.push({
        code_type_name: "",
        code_value: "",
      });
    },
    addTableData1() {
      this.formUpdate.tableData.push({
        code_type_name: "",
        code_value: "",
      });
    },
    // 删除统一编码表格的当前行
    deleteArry(type,row, index) {
      this.form.tableData.splice(index, 1);
    },
    deleteArry1(type,row, index) {
      this.formUpdate.tableData.splice(index, 1);
    },
    // 点击esc取消添加统一编码
    beforeCloseAdd() {
      this.dialogFormVisibleAdd = false;
      this.$refs.form.resetFields();
      this.form.tableData = [];
    },
    // 新增保存统一编码
    add() {
      this.$refs.oneRef.$refs[this.oneConfig.ref].validate((valid) => {
        if (valid) {
          if (this.form.tableData.length == 0) {
            this.$Msg.customizTitle("编码名称与编码值不能为空", "warning");
          } else if (this.form.tableData.length > 0) {
            this.form.tableData.forEach((item) => {
              item.code_classify = this.form.code_classify;
              item.code_classify_name = this.form.code_classify_name;
              item.code_remark = this.form.code_remark;
            });
            this.$executeRequest
                .execPostByPathUrl(
                    "/codeMaintenance/saveCodeInfo",
                    this.form.tableData
                )
                .then((res) => {
                  if (res && res.success) {
                    this.$Msg.saveSuccess(res);
                    this.$refs.oneRef.$refs[this.oneConfig.ref].resetFields();
                    this.dialogFormVisibleAdd = false;
                    this.getCodeInfo();
                  }
                });
          }
        }
      })
    },
    // 获取合并行数据，初始化数据
    dataRosolve(tableData) {
      this.spanArr = [];
      this.pos = 0;
      this.spanArr2 = [];
      this.pos2 = 0;
      tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.pos = 0;
          this.spanArr2.push(1);
          this.pos2 = 0;
        } else {
          if (
              tableData[index].code_classify ===
              tableData[index - 1].code_classify
          ) {
            //第一列需合并相同内容的判断条件
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = index;
          }
          if (
              tableData[index].code_classify_name ===
              tableData[index - 1].code_classify_name
          ) {
            this.spanArr2[this.pos2] += 1;
            this.spanArr2.push(0);
          } else {
            this.spanArr2.push(1);
            this.pos2 = index;
          }
        }
      });
    },
    // 合并行统一编码信息
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      if (columnIndex === 2 || columnIndex === 5) {
        const _row = this.spanArr2[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    // 编辑统一码表信息
    handleEdit(row) {
      this.getCodeInfoByCodeClassify(row);
    },
    //查询统一编码信息ByCodeClassify
    getCodeInfoByCodeClassify(row) {
      this.$executeRequest
          .execGetPathByUrl("/codeMaintenance/getCodeInfoByCodeClassify", {
            code_classify: row.code_classify,
          })
          .then((res) => {
            if (res && res.success && res.data.length > 0) {
              this.formUpdate.code_classify = res.data[0].code_classify;
              this.formUpdate.code_classify_name = res.data[0].code_classify_name;
              this.formUpdate.code_remark = res.data[0].code_remark;
              this.formUpdate.tableData = res.data;
            }
          });
    },
    //编辑更新统一编码信息
    formUpdateSubmit() {
      this.$refs.twoRef.$refs[this.twoConfig.ref].validate((valid) => {
        if (valid) {
          this.formUpdate.tableData.forEach((item) => {
            item.code_classify = this.formUpdate.code_classify;
            item.code_classify_name = this.formUpdate.code_classify_name;
            item.code_remark = this.formUpdate.code_remark;
          });
          this.$executeRequest
              .execPostByPathUrl(
                  "/codeMaintenance/updateCodeInfo",
                  this.formUpdate.tableData
              )
              .then((res) => {
                if (res && res.success) {
                  this.$Msg.customizTitle("更新成功", "success");
                  this.$refs.twoRef.$refs[this.twoConfig.ref].resetFields();
                  this.dialogFormVisibleUpdate = false;
                  this.getCodeInfo();
                }
              });
        } else {
          return false;
        }
      })
    },
    // 关闭编辑弹出框之前触发事件
    beforeCloseupdate() {
      this.dialogFormVisibleUpdate = false;
      this.$refs.formUpdate.resetFields();
    },
    // 删除当前统一码表信息
    delteThisData(val) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            this.$executeRequest
                .execGetPathByUrl("/codeMaintenance/deleteCodeInfo", {
                  code_classify: val.code_classify,
                })
                .then((res) => {
                  if (res && res.success) {
                    this.$Msg.customizTitle("删除成功", "success");
                    // 从新渲染表格
                    this.getCodeInfo();
                  }
                });
          })
          .catch(() => {
            this.$Msg.customizTitle("已取消删除", "info");
          });
    },
    // 源系统编码
    // 查询源系统信息
    getOrigSysInfo() {
      this.$executeRequest
          .execPostByPathUrl("/codeMaintenance/getOrigSysInfo")
          .then((res) => {
            this.sourceCodeTabledata = res.data;
            this.origpagination.total = res.data.length;
          });
    },
    // 关闭新增源系统编码弹出框
    beforeCloseAddScoure() {
      this.dialogFormVisibleAddScoure = false;
      this.$refs.formScoure.$refs[this.formConfig.ref].resetFields();
    },
    // 保存新增源系统编码
    addOrigSysInfo() {
      this.$refs.formScoure.$refs[this.formConfig.ref].validate((valid) =>{
        if (valid){
          this.$executeRequest.execPostByPathUrl("/codeMaintenance/addOrigSysInfo", {
            orig_sys_code: this.formScoure.orig_sys_code,
            orig_sys_name: this.formScoure.orig_sys_name,
            orig_sys_remark: this.formScoure.orig_sys_remark,
          })
              .then((res) => {
                if (res && res.success) {
                  this.$Msg.customizTitle("保存成功", "success");
                  this.getOrigSysInfo();
                  this.dialogFormVisibleAddScoure = false;
                  // this.$refs.formScoure.resetFields();
                  this.$refs.formScoure.$refs[this.formConfig.ref].resetFields();
                }
              });
        } else {
          return false;
        }
          })
    },
    // 去往详情页
    gotoInfos(row) {
      this.markId = row.orig_sys_code;
      this.hiddenOrshow = true;
      this.showOrhidden = false;
      this.getOrigCodeInfo(row.orig_sys_code);
      this.getAllCodeClassify();
    },
    // 查询初始化源系统编码信息
    getOrigCodeInfo(row) {
      this.$executeRequest
          .execGetPathByUrl("/codeMaintenance/getOrigCodeInfo", {
            orig_sys_code: row,
          })
          .then((res) => {
            if (res && res.success) {
              res.data.forEach((item) => {
                item.show = true;
              });
              this.formScoureAdd.codeMaintenanceTableDataScoureAdd = res.data;
              this.resultArryData = res.data;
              this.dataRosolve(res.data);
            }
          });
    },
    // 返回上一步
    saveOrgohome() {
      this.job_status = "";
      this.formScoureAdd.codeMaintenanceTableDataScoureAdd = [];
      this.hiddenOrshow = false;
      this.showOrhidden = true;
      this.getOrigSysInfo();
    },
    // 获取select对应的选择值
    changeValue(val) {
      this.onlyArry = [];
      this.onlyId = val;
      this.$executeRequest
          .execGetPathByUrl("/codeMaintenance/getCodeInfoByCodeClassify", {
            code_classify: this.onlyId,
          })
          .then((res) => {
            res.data.forEach((item) => {
              item.show = false;
            });
            this.onlyArry = res.data;
          });
    },
    //表格新增数据
    addFromaJAX() {
      if (this.formScoureAdd.codeMaintenanceTableDataScoureAdd.length == 0) {
        //分辨有没有数据展示表格
        this.formScoureAdd.codeMaintenanceTableDataScoureAdd = this.onlyArry;
      } else {
        let arr1 = [];
        this.formScoureAdd.codeMaintenanceTableDataScoureAdd.forEach((item) => {
          arr1.push(item.code_classify);
        });
        if (arr1.indexOf(this.onlyArry[0].code_classify) == -1) {
          this.formScoureAdd.codeMaintenanceTableDataScoureAdd = [
            ...this.formScoureAdd.codeMaintenanceTableDataScoureAdd,
            ...this.onlyArry,
          ];
        } else {
          this.$Msg.customizTitle("添加信息已存在", "warning");
        }
      }
      this.dataRosolve(this.formScoureAdd.codeMaintenanceTableDataScoureAdd);
    },
    // 删除表格数据
    delteThisDataScoure(row) {
      if (row.show == false) {
        //本地未保存时删除表格对应的数据
        this.formScoureAdd.codeMaintenanceTableDataScoureAdd =
            this.formScoureAdd.codeMaintenanceTableDataScoureAdd.filter(
                (item) => {
                  //过滤表格信息
                  return item.code_classify != row.code_classify;
                }
            );
      } else {
        //调用接口
        this.$confirm("确认删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
            .then(() => {
              this.$executeRequest
                  .execGetAllPathByUrl("/codeMaintenance/deleteOrigCodeInfo", {
                    code_classify: row.code_classify,
                    orig_sys_code: this.markId,
                  })
                  .then((res) => {
                    if (res && res.success) {
                      this.$Msg.customizTitle("删除成功", "success");
                      // 从新渲染表格
                      this.getOrigCodeInfo(this.markId);
                    }
                  });
            })
            .catch(() => {
              this.$Msg.customizTitle("已取消删除", "info");
            });
      }
    },
    // 合并行统一编码信息
    arraySpanMethodScoure({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      if (columnIndex === 2 || columnIndex === 6) {
        const _row = this.spanArr2[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    // 保存源系统编码值
    saveCodeList(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = [];
          let arr = JSON.parse(
              JSON.stringify(this.formScoureAdd.codeMaintenanceTableDataScoureAdd)
          );
          data = this.resultArryData
              .concat(this.formScoureAdd.codeMaintenanceTableDataScoureAdd)
              .filter((v, i, arr) => {
                return arr.indexOf(v) === arr.lastIndexOf(v);
              });

          data.forEach((item) => {
            delete item.show;
            item.orig_sys_code = this.markId;
          });
          if (data.length > 0) {
            this.$executeRequest
                .execPostByPathUrl("/codeMaintenance/addOrigCodeInfo", {
                  orig_sys_code: this.markId,
                  orig_code_infos: JSON.stringify(data),
                })
                .then((res) => {
                  if (res && res.success) {
                    this.$Msg.customizTitle("添加成功", "success");
                    // 从新渲染表格
                    this.getOrigCodeInfo(this.markId);
                    this.$refs.formScoureAdd.resetFields();
                    this.formScoureAdd.codeMaintenanceTableDataScoureAdd = [];
                  }
                });
          }
        } else {
          return false;
        }
      });
    },
    // 编辑源系统编码值
    handleEditScoure(index,row) {
      this.$executeRequest
          .execGetAllPathByUrl("/codeMaintenance/getOrigCodeInfoByCode", {
            code_classify: row.code_classify,
            orig_sys_code: this.markId,
          })
          .then((res) => {
            this.formScoureRef.code_classify = res.data[0].code_classify;
            this.formScoureRef.tableData = res.data;
            this.formScoureRef.code_classify_name =
                res.data[0].code_classify_name;
          });
    },
    // 更新源系统编码值
    addOrigSysInfoScoure(formName) {
      this.$refs.threeRef.$refs[this.threeConfig.ref].validate((valid) =>{
        if (valid) {
          let arr = JSON.parse(JSON.stringify(this.formScoureRef.tableData));
          this.$executeRequest
              .execPostByPathUrl("/codeMaintenance/updateOrigCodeInfo", {
                orig_sys_code: this.markId,
                orig_code_infos: JSON.stringify(arr),
              })
              .then((res) => {
                // 从新渲染表格
                if (res && res.success) {
                  this.$Msg.customizTitle("更新成功", "success");
                  this.getOrigCodeInfo(this.markId);
                  this.$refs.threeRef.$refs[this.threeConfig.ref].resetFields();
                  this.dialogFormVisibleUpdateScoure = false;
                  this.formScoureRef.tableData = [];
                }
              });
        } else {
          return false;
        }
      })
    },
    // 关闭弹出框beforeCloseupdateScoure
    beforeCloseupdateScoure() {
      this.$refs.threeRef.$refs[this.threeConfig.ref].resetFields();
      this.dialogFormVisibleUpdateScoure = false;
      this.formScoureRef.tableData = [];
    },
    // 点击选项卡获取初始值
    changeTabPane(tab, event) {
      if (tab.label == "统一编码") {
        this.getCodeInfo();
      } else if (tab.label == "源系统编码") {
        this.getOrigSysInfo();
      }
    },
    // 统一编码分页功能
    handleCurrentChangeList(val) {
      //把val赋给当前页面
      this.currentPage = val;
    },
    // 源编码系统信息详情分页功能
    handleCurrentChangeListScoureinfo(val) {
      //把val赋给当前页面
      this.currentPageScoureinfo = val;
    },
    // 改变每页显示条数
    handleSizeChangeScoureinfo(val) {
      this.pageSizeScoureinfo = val;
    },







    optionItem(type,row){
      if (type === "edit"){
        this.handleEdit(row)
        this.dialogFormVisibleUpdate = true;
      }else if (type === "del"){
        this.delteThisData(row)
      }
    },








    // 改变每页显示条数（统一编码）
    handleSizeChange(val) {
      this.codepagination.pageSize = val;
    },
    // 改变页码（统一编码）
    handleCurrentChange(val){
      this.codepagination.pageNum = val;
    },
    // 改变页码(源系统编码)
    handleCurrentChangeListScoure(val) {
      this.origpagination.pageNum = val;
    },
    // 改变每页显示条数(源系统编码)
    handleSizeChangeScoure(val) {
      this.origpagination.pageSize = val;
    },
  },
}
</script>

<style scoped lang="less">
.lines {
  margin-top: 4px;
  width: 100%;
  min-height: 1px;
  background: #dddddd;
  margin-bottom: 15px;
}

.el-icon-s-check,
.el-row span {
  color: #2196f3;
  font-size: 18px;
}

.elRows {
  width: 100%;
  height: 40px;
  line-height: 40px;
}

/* button样式设置 */
.els {
  float: right;
  margin-top: 3px;
}

.el1 {
  margin-left: 10px;
}

.item {
  float: right;
}

.upload-demo {
  float: left;
}

.fa-question-circle {
  margin-top: 12px;
}

.addCodeButton {
  float: right;
  margin-bottom: 4px;
}

.partTwoBtn {
  float: right;
}

.elButton {
  float: right;
  margin-top: 20px;
}

/* 表格input */
.el-table .el-form-item__content {
  margin-left: 0px !important;
  line-height: 20px;
}

.el-table .el-form-item {
  margin-bottom: 0 !important;
}

.el-table {
  margin-bottom: 20px;
}

.el-table td > .cell {
  height: 40px !important;
}

.el-table--medium td {
  padding: 12px 0 0 0 !important;
}

.el-table .el-form-item__error {
  padding-top: 0 !important;
}

.tabaleSpan {
  color: #337ab7;
  cursor: pointer;
}

.strongSpan {
  font-weight: normal;
  display: inline-block;
  margin-right: 10px;
  font-size: 16px;
}

.buttonAdd {
  margin-left: 10px;
}

.hiddenOrshowRow {
  margin-bottom: 10px;
  height: 40px;
  line-height: 40px;
}

.saveOrgohome {
  float: right;
}

/* 分页 */
.pagination {
  margin-top: 20px;
  width: 100%;
}

.el-pagination {
  float: right;
}

</style>
